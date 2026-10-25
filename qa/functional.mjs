// Funktionstests gegen die laufende Seite (SITE_URL, Standard http://localhost:3100/)
import { chromium } from "@playwright/test";

const SITE = process.env.SITE_URL ?? "http://localhost:3100/";
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

const browser = await chromium.launch();

// 1 · Konsole/Hydration, Reveal mit Bewegung, Tastatur-Sicherheitsnetz
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const heroVisible = await page.evaluate(() => getComputedStyle(document.querySelector("#hero-title")).opacity);
  check("Hero-Intro endet sichtbar", heroVisible === "1", `opacity ${heroVisible}`);
  const faqBefore = await page.evaluate(() => getComputedStyle(document.querySelector("#faq [data-reveal]")).visibility);
  check("FAQ vor dem Scrollen verborgen (Reveal aktiv)", faqBefore === "hidden", faqBefore);
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  const faqAfter = await page.evaluate(() => getComputedStyle(document.querySelector("#faq [data-reveal]")).opacity);
  check("FAQ nach dem Scrollen sichtbar", faqAfter === "1", `opacity ${faqAfter}`);
  // Header-Zustand + Scroll-Spy
  const header = await page.evaluate(() => getComputedStyle(document.querySelector("header")).backgroundColor);
  check("Header nach Scroll mit Hintergrund", header !== "rgba(0, 0, 0, 0)", header);
  const current = await page.evaluate(() => document.querySelector('nav[aria-label="Hauptnavigation"] [aria-current="true"]')?.textContent);
  check("Scroll-Spy markiert FAQ", current === "FAQ", String(current));
  check("Keine Konsolenfehler", errors.length === 0, errors.join(" | "));
  await page.close();

  const page2 = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page2.goto(SITE, { waitUntil: "networkidle" });
  await page2.waitForTimeout(1200);
  await page2.keyboard.press("Tab");
  await page2.waitForTimeout(100);
  const hidden = await page2.evaluate(() => [...document.querySelectorAll("[data-reveal]")].filter((e) => getComputedStyle(e).visibility === "hidden").length);
  check("Nach erstem Tab sind alle Reveals sichtbar", hidden === 0, `${hidden} verborgen`);
  const skip = await page2.evaluate(() => document.activeElement?.textContent);
  check("Erster Tab-Stopp = Skip-Link", skip === "Zum Inhalt springen", String(skip));
  await page2.close();
}

// 2 · Reduced Motion: nichts verborgen
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  await page.goto(SITE, { waitUntil: "networkidle" });
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal],[data-hero-item]")].filter((e) => getComputedStyle(e).opacity !== "1" || getComputedStyle(e).visibility === "hidden").length);
  check("Reduced Motion: alles sichtbar", hidden === 0, `${hidden} verborgen`);
  await page.close();
}

// 3 · Ohne JavaScript: alles sichtbar
{
  const ctx = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "load" });
  const hidden = await page.evaluate(() => [...document.querySelectorAll("[data-reveal],[data-hero-item]")].filter((e) => getComputedStyle(e).opacity !== "1" || getComputedStyle(e).visibility === "hidden").length);
  const count = await page.evaluate(() => document.querySelectorAll("[data-reveal]").length);
  check("Ohne JS: alle Inhalte sichtbar", hidden === 0 && count > 0, `${hidden} von ${count} verborgen`);
  await ctx.close();
}

// 4 · Mobile-Menü
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(SITE, { waitUntil: "networkidle" });
  const toggle = page.locator('button[aria-controls="mobile-menu"]');
  await toggle.click();
  check("Menü öffnet (aria-expanded)", (await toggle.getAttribute("aria-expanded")) === "true");
  const focused = await page.evaluate(() => document.activeElement?.textContent);
  check("Fokus auf erstem Menülink", focused === "Leistungen", String(focused));
  check("Body-Scroll gesperrt", await page.evaluate(() => document.body.classList.contains("is-menu-open")));
  await page.keyboard.press("Escape");
  check("Esc schließt Menü", (await toggle.getAttribute("aria-expanded")) === "false");
  check("Fokus zurück auf Menü-Button", await page.evaluate(() => document.activeElement?.getAttribute("aria-controls") === "mobile-menu"));
  await toggle.click();
  await page.locator("#mobile-menu a", { hasText: "FAQ" }).click();
  check("Linkklick schließt Menü", (await toggle.getAttribute("aria-expanded")) === "false");
  await page.close();
}

// 4b · Theme-Umschalter: Systemeinstellung, Wechsel, Speicherung
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, colorScheme: "dark" });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "networkidle" });
  const bg = () => page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check("System dunkel → dunkler Grund", (await bg()) === "rgb(8, 15, 30)", await bg());
  await page.getByRole("button", { name: "Helles oder dunkles Design wählen" }).click();
  check("Umschalter → helles Design", (await bg()) === "rgb(247, 249, 252)", await bg());
  await page.reload({ waitUntil: "networkidle" });
  check("Wahl bleibt nach Neuladen erhalten", (await bg()) === "rgb(247, 249, 252)", await bg());
  await page.goto(new URL("/impressum", SITE).toString(), { waitUntil: "networkidle" });
  check("Wahl gilt auch auf Unterseiten", (await bg()) === "rgb(247, 249, 252)", await bg());
  await ctx.close();
  const light = await browser.newPage({ colorScheme: "light" });
  await light.goto(SITE, { waitUntil: "networkidle" });
  const lbg = await light.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check("System hell → helles Design", lbg === "rgb(247, 249, 252)", lbg);
  await light.close();
}

// 5 · Formular (Demo-Modus)
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await page.goto(SITE + "#kontakt", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Beratungsanfrage senden" }).click();
  const invalid = await page.evaluate(() => document.querySelectorAll('#kontakt [aria-invalid="true"]').length);
  check("Absenden leer: 4 Feldfehler", invalid === 4, String(invalid));
  check("Fokus auf erstem Fehlerfeld", await page.evaluate(() => document.activeElement?.id === "f-name"));
  const status = await page.locator('#kontakt [role="status"]').first().textContent();
  check("Status „Bitte prüfe die markierten Felder.“", status?.includes("Bitte prüfe die markierten Felder."), status ?? "");
  await page.screenshot({ path: "qa/output/form-errors.png", clip: await page.locator("form").boundingBox() });
  await page.fill("#f-name", "Max Muster");
  await page.fill("#f-company", "Café Muster");
  await page.fill("#f-email", "max@");
  await page.locator("#f-email").blur();
  const emailErr = await page.locator("#f-email-error").textContent();
  check("Ungültige E-Mail → passende Meldung", emailErr?.includes("gültige E-Mail"), emailErr ?? "");
  await page.fill("#f-email", "max@muster.de");
  await page.selectOption("#f-topic", "payment");
  await page.getByRole("button", { name: "Beratungsanfrage senden" }).click();
  const demo = await page.locator('#kontakt [role="status"]').first().textContent();
  check("Gültig im Demo-Modus: Demo-Hinweis, kein Versand", demo?.includes("Es wird noch keine Nachricht versendet"), demo ?? "");
  await page.close();
}

// 6 · API-Schutz
{
  const ctx = await browser.newContext();
  const api = ctx.request;
  const url = new URL("/api/contact", SITE).toString();
  const valid = { name: "Max Muster", company: "Café Muster", email: "max@muster.de", topic: "payment", message: "", website: "" };
  const h = (ip) => ({ "content-type": "application/json", "x-forwarded-for": ip });
  let r = await api.post(url, { headers: { "content-type": "text/plain", "x-forwarded-for": "10.0.0.1" }, data: "x" });
  check("API: falscher Content-Type → 415", r.status() === 415, String(r.status()));
  r = await api.get(url);
  check("API: GET nicht erlaubt → 405", r.status() === 405, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.2"), data: { ...valid, email: "kaputt", topic: "x", startedAt: 0 } });
  const body = await r.json();
  check("API: Feldfehler → 400 mit Feldern", r.status() === 400 && body.fieldErrors?.includes("email") && body.fieldErrors?.includes("topic"), JSON.stringify(body));
  r = await api.post(url, { headers: h("10.0.0.3"), data: { ...valid, website: "spam", startedAt: 0 } });
  check("API: Honeypot → stilles 200", r.status() === 200, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.4"), data: { ...valid, startedAt: Date.now() } });
  check("API: zu schnell ausgefüllt → stilles 200", r.status() === 200, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.5"), data: { ...valid, startedAt: Date.now() - 10000 } });
  check("API: ohne Mail-Konfiguration → 503", r.status() === 503, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.6"), data: { ...valid, message: "x".repeat(20000), startedAt: 0 } });
  check("API: zu großer Body → 413", r.status() === 413, String(r.status()));
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = await api.post(url, { headers: h("10.0.0.7"), data: { ...valid, startedAt: Date.now() - 10000 } });
    statuses.push(res.status());
  }
  check("API: Rate-Limit nach 5 Anfragen → 429", statuses[5] === 429, statuses.join(","));
  await ctx.close();
}

// 7 · SEO-Endpunkte
{
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "load" });
  const ld = await page.evaluate(() => JSON.parse(document.querySelector('script[type="application/ld+json"]').textContent));
  check("JSON-LD FAQPage mit 5 Fragen", ld["@type"] === "FAQPage" && ld.mainEntity.length === 5);
  const h1 = await page.evaluate(() => document.querySelectorAll("h1").length);
  check("Genau eine h1", h1 === 1, String(h1));
  const robotsMeta = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.content);
  check("Ohne SITE_INDEXABLE: noindex", robotsMeta?.includes("noindex"), String(robotsMeta));
  for (const p of ["/robots.txt", "/sitemap.xml", "/impressum", "/datenschutz"]) {
    const r = await ctx.request.get(new URL(p, SITE).toString());
    check(`${p} erreichbar`, r.status() === 200, String(r.status()));
  }
  const r404 = await ctx.request.get(new URL("/gibt-es-nicht", SITE).toString());
  check("Unbekannte URL → 404", r404.status() === 404, String(r404.status()));
  await ctx.close();
}

await browser.close();
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? "✓" : "✗"} ${r.name}${r.detail && !r.ok ? `  (${r.detail})` : ""}`);
}
console.log(`\n${results.length - failed}/${results.length} bestanden`);
process.exit(failed ? 1 : 0);
