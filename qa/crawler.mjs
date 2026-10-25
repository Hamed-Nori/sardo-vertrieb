// Crawler-Sicht prüfen: Server-HTML (KI-Crawler ohne JS) und gerendert (Googlebot mit JS)
import { chromium } from "@playwright/test";
import fs from "node:fs";

const SITE = process.env.SITE_URL ?? "http://localhost:3100/";
const content = JSON.parse(fs.readFileSync("content/content.de.json", "utf8"));
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });
const norm = (s) => s.replace(/ |­/g, (c) => (c === "­" ? "" : " ")).replace(/\s+/g, " ");

// Alle sichtbaren Kerntexte der Startseite
const texts = [
  content.hero.title.text, content.hero.lead,
  ...content.services.items.flatMap((i) => [i.title, i.text]),
  content.product.lead, ...content.product.info.map((i) => i.title),
  content.about.greeting, ...content.about.paragraphs,
  ...content.faq.items.flatMap((i) => [i.question, i.answer]),
  content.contact.lead, content.contact.text,
];

// 1 · Server-HTML wie ein KI-Crawler ohne JavaScript
for (const ua of ["GPTBot/1.2 (+https://openai.com/gptbot)", "ClaudeBot/1.0 (+claudebot@anthropic.com)", "PerplexityBot/1.0"]) {
  const res = await fetch(SITE, { headers: { "User-Agent": `Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; ${ua})` } });
  const html = await res.text();
  const plain = norm(html.replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"'));
  const missing = texts.filter((t) => !plain.includes(norm(t)));
  check(`${ua.split("/")[0]}: HTTP 200 und alle ${texts.length} Kerntexte im HTML`, res.status === 200 && missing.length === 0, missing.slice(0, 3).join(" | "));
}
const html = await (await fetch(SITE)).text();
check("Kein Inhalt per Inline-Style versteckt (opacity:0 / visibility:hidden)", !/style="[^"]*(opacity:\s*0[;"]|visibility:\s*hidden)/i.test(html));
check("Meta robots: index, follow", /<meta name="robots" content="index, follow/.test(html), html.match(/<meta name="robots"[^>]*>/)?.[0]);
check("Canonical gesetzt", /<link rel="canonical" href="https:\/\/[^"]+"/.test(html), html.match(/<link rel="canonical"[^>]*>/)?.[0]);
const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
const types = ld.flatMap((d) => d["@graph"]?.map((g) => g["@type"]) ?? [d["@type"]]);
check("Strukturierte Daten: FAQPage, ProfessionalService, WebSite", ["FAQPage", "ProfessionalService", "WebSite"].every((t) => types.includes(t)), types.join(","));
check("Bilder mit Alt-Text im HTML", (html.match(/<img [^>]*alt="[^"]+"/g) ?? []).length >= 5);

// 2 · Gerendert wie Googlebot (JavaScript an, keine Scrollbewegung)
const browser = await chromium.launch();
const page = await browser.newPage({
  userAgent: "Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
  viewport: { width: 412, height: 732 },
});
await page.goto(SITE, { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const hidden = await page.evaluate(() =>
  [...document.querySelectorAll("[data-reveal], [data-reveal] *, [data-hero-item]")].filter((e) => {
    const s = getComputedStyle(e);
    return s.visibility === "hidden" || s.opacity === "0";
  }).length,
);
check("Googlebot (JS an): kein Inhalt durch Animationen verborgen – ohne zu scrollen", hidden === 0, `${hidden} verborgen`);
const consent = await page.getByRole("region", { name: "Cookies & Datenschutz" }).count();
check("Cookie-Banner verdeckt keinen Inhalt im HTML (wird erst im Browser eingeblendet)", !/cookie-consent-title/.test(html), `im Server-HTML: ${/cookie-consent-title/.test(html)}, gerendert: ${consent}`);
await browser.close();

// 3 · Dateien für Crawler
for (const [path, test, label] of [
  ["/robots.txt", (t) => /User-Agent: \*\nAllow: \//.test(t) && /User-Agent: GPTBot/.test(t) && /User-Agent: ClaudeBot/.test(t) && /Sitemap: /.test(t), "robots.txt erlaubt alle + KI-Crawler, verweist auf Sitemap"],
  ["/sitemap.xml", (t) => (t.match(/<loc>/g) ?? []).length === 3, "sitemap.xml mit 3 Seiten"],
  ["/llms.txt", (t) => t.startsWith("# Sardo Digital") && t.includes("## Häufige Fragen") && t.includes(content.faq.items[0].answer), "llms.txt mit Inhalten und FAQ"],
]) {
  const res = await fetch(new URL(path, SITE));
  check(label, res.status === 200 && test(await res.text()), String(res.status));
}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} bestanden`);
process.exit(failed ? 1 : 0);
