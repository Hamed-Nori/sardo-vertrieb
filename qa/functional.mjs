// Funktionstests gegen die laufende Seite (SITE_URL, Standard http://localhost:3100/)
import { chromium } from "@playwright/test";

const SITE = process.env.SITE_URL ?? "http://localhost:3100/";
const results = [];
const check = (name, ok, detail = "") => results.push({ name, ok, detail });

const browser = await chromium.launch();

// Für alle Tests außer dem Banner-Test liegt bereits eine Cookie-Entscheidung vor,
// damit der Banner keine Klicks abfängt.
const CONSENT = JSON.stringify({ v: 1, necessary: true, statistics: false, marketing: false, updatedAt: "qa" });
const freshContext = browser.newContext.bind(browser);
browser.newContext = async (options) => {
  const ctx = await freshContext(options);
  await ctx.addInitScript((value) => {
    if (!sessionStorage.getItem("qa-consent-set")) {
      localStorage.setItem("cookie-consent", value);
      sessionStorage.setItem("qa-consent-set", "1");
    }
  }, CONSENT);
  return ctx;
};
browser.newPage = async (options) => {
  const ctx = await browser.newContext(options);
  const page = await ctx.newPage();
  page.on("close", () => ctx.close());
  return page;
};

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

// 4b2 · Cookie-Banner (Einwilligung): erscheint beim ersten Besuch, Auswahl wird gespeichert
{
  const consentOf = (page) => page.evaluate(() => JSON.parse(localStorage.getItem("cookie-consent") ?? "null"));
  for (const [width, label] of [[390, "mobil"], [1280, "Desktop"]]) {
    const ctx = await freshContext({ viewport: { width, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(SITE, { waitUntil: "networkidle" });
    const banner = page.getByRole("region", { name: "Cookies & Datenschutz" });
    check(`Banner beim ersten Besuch sichtbar (${label})`, await banner.isVisible());
    const box = await banner.boundingBox();
    check(`Banner-Position ${label === "mobil" ? "unten" : "oben unter dem Header"}`, label === "mobil" ? box.y + box.height > 700 : box.y < 200, JSON.stringify(box));
    await ctx.close();
  }

  const ctx = await freshContext({ viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(SITE, { waitUntil: "networkidle" });
  const banner = page.getByRole("region", { name: "Cookies & Datenschutz" });
  check("Banner verlinkt Datenschutzerklärung", (await banner.locator('a[href="/datenschutz"]').count()) === 1);
  const accept = banner.getByRole("button", { name: "Alle akzeptieren" });
  const acceptBg = await accept.evaluate((e) => getComputedStyle(e).backgroundColor);
  const otherBg = await banner.getByRole("button", { name: "Nur notwendige" }).evaluate((e) => getComputedStyle(e).backgroundColor);
  check("Nur „Alle akzeptieren“ in Primärfarbe", acceptBg === "rgb(0, 91, 204)" && otherBg !== acceptBg, `${acceptBg} / ${otherBg}`);
  await banner.getByRole("button", { name: "Nur notwendige" }).click();
  let c = await consentOf(page);
  check("„Nur notwendige“: Statistik und Marketing aus", (await banner.isHidden()) && c?.statistics === false && c?.marketing === false, JSON.stringify(c));
  await page.reload({ waitUntil: "networkidle" });
  check("Banner bleibt nach Neuladen weg", await banner.isHidden());
  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  check("„Cookie-Einstellungen“ im Footer öffnet Einstellungen", (await banner.isVisible()) && (await banner.getByRole("switch", { name: "Statistik" }).isVisible()));
  await banner.getByRole("switch", { name: "Statistik" }).check();
  await banner.getByRole("button", { name: "Auswahl speichern" }).click();
  c = await consentOf(page);
  check("Einzelauswahl wird gespeichert (nur Statistik)", c?.statistics === true && c?.marketing === false, JSON.stringify(c));
  await page.getByRole("button", { name: "Cookie-Einstellungen" }).click();
  check("Einstellungen zeigen bisherige Auswahl", await banner.getByRole("switch", { name: "Statistik" }).isChecked());
  await banner.getByRole("button", { name: "Alle akzeptieren" }).click();
  c = await consentOf(page);
  check("„Alle akzeptieren“: alles an", c?.statistics === true && c?.marketing === true, JSON.stringify(c));
  const cookies = await ctx.cookies();
  check("Es werden keine Cookies gesetzt", cookies.length === 0, cookies.map((x) => x.name).join(","));
  await ctx.close();
}

// 4c · WhatsApp: Hero-Button und schwebender Button
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await page.goto(SITE, { waitUntil: "networkidle" });
  const hero = page.locator("#top a[href^='https://wa.me/']");
  check("Hero: WhatsApp-Link auf wa.me/491775359611", (await hero.getAttribute("href")) === "https://wa.me/491775359611");
  check("Hero: WhatsApp öffnet in neuem Fenster", (await hero.getAttribute("target")) === "_blank" && (await hero.getAttribute("rel"))?.includes("noopener"));
  const float = page.locator("[data-whatsapp-float]");
  const vis = () => float.evaluate((e) => getComputedStyle(e).visibility);
  check("Schwebender Button im Hero verborgen", (await vis()) === "hidden", await vis());
  await page.evaluate(() => window.scrollTo(0, 2000));
  await page.waitForTimeout(300);
  check("Schwebender Button nach dem Scrollen sichtbar", (await vis()) === "visible", await vis());
  check("Schwebender Button öffnet in neuem Fenster", (await float.getAttribute("target")) === "_blank");
  await page.close();
}

// 5 · Formular – Testadresse von Resend, damit nie echte Postfächer Mails bekommen
const TEST_EMAIL = "delivered@resend.dev";
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  await page.goto(SITE + "#kontakt", { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Beratungsanfrage senden" }).click();
  const invalid = await page.evaluate(() => [...document.querySelectorAll('#kontakt [aria-invalid="true"]')].map((e) => e.id).join(","));
  check("Absenden leer: Name, Telefon, E-Mail und Datenschutz-Häkchen markiert", invalid === "f-name,f-phone,f-email,f-privacy", invalid);
  check("Fokus auf erstem Fehlerfeld", await page.evaluate(() => document.activeElement?.id === "f-name"));
  const status = await page.locator('#kontakt [role="status"]').first().textContent();
  check("Status „Bitte prüfe die markierten Felder.“", status?.includes("Bitte prüfe die markierten Felder."), status ?? "");
  await page.screenshot({ path: "qa/output/form-errors.png", clip: await page.locator("form").boundingBox() });
  await page.fill("#f-name", "Erika Test");
  await page.fill("#f-phone", "abc");
  await page.locator("#f-phone").blur();
  const phoneErr = await page.locator("#f-phone-error").textContent();
  check("Ungültige Telefonnummer → passende Meldung", phoneErr?.includes("gültige Telefonnummer"), phoneErr ?? "");
  await page.fill("#f-phone", "0177 1234567");
  await page.fill("#f-email", "erika@");
  await page.locator("#f-email").blur();
  const emailErr = await page.locator("#f-email-error").textContent();
  check("Ungültige E-Mail → passende Meldung", emailErr?.includes("gültige E-Mail"), emailErr ?? "");
  await page.fill("#f-email", TEST_EMAIL);
  await page.waitForTimeout(3000); // Mindest-Ausfüllzeit
  await page.getByRole("button", { name: "Beratungsanfrage senden" }).click();
  const privacyErr = await page.locator("#f-privacy-error").textContent();
  check("Ohne Häkchen kein Versand, Hinweis zur Datenschutzerklärung", privacyErr?.includes("Datenschutzerklärung") && new URL(page.url()).pathname === "/", privacyErr ?? "");
  check("Fokus springt auf das Häkchen", await page.evaluate(() => document.activeElement?.id === "f-privacy"));
  await page.locator('label[for="f-privacy"]').click({ position: { x: 5, y: 5 } });
  check("Häkchen per Klick auf das Label setzbar, Fehler verschwindet", (await page.locator("#f-privacy").isChecked()) && (await page.locator("#f-privacy-error").isHidden()));
  await page.getByRole("button", { name: "Beratungsanfrage senden" }).click();
  // Je nach Konfiguration: Dankeseite oder Verweis auf WhatsApp
  await Promise.race([page.waitForURL("**/danke", { timeout: 15000 }), page.locator('#kontakt [role="status"] a[href^="https://wa.me/"]').waitFor({ timeout: 15000 })]).catch(() => {});
  if (new URL(page.url()).pathname === "/danke") {
    check("Mit Mailversand: Weiterleitung auf Dankeseite", true);
  } else {
    const demo = await page.locator('#kontakt [role="status"]').first().textContent();
    check("Ohne Mailversand: Verweis auf WhatsApp statt Scheinerfolg", demo?.includes("noch nicht freigeschaltet"), demo ?? "");
  }
  const idle = await browser.newPage();
  await idle.goto(SITE, { waitUntil: "networkidle" });
  const idleText = (await idle.locator('#kontakt [role="status"]').first().textContent())?.trim();
  check("Kein Demo-Hinweis im Ruhezustand", !idleText, String(idleText));
  await idle.close();
  await page.close();
}

// 6 · API-Schutz (Rate-Limit mit ungültigen Daten, damit keine Mails entstehen)
{
  const ctx = await browser.newContext();
  const api = ctx.request;
  const url = new URL("/api/contact", SITE).toString();
  const valid = { name: "Erika Test", email: TEST_EMAIL, phone: "0177 1234567", company: "", topic: "", message: "", privacy: true, website: "" };
  const h = (ip) => ({ "content-type": "application/json", "x-forwarded-for": ip });
  let r = await api.post(url, { headers: { "content-type": "text/plain", "x-forwarded-for": "10.0.0.1" }, data: "x" });
  check("API: falscher Content-Type → 415", r.status() === 415, String(r.status()));
  r = await api.get(url);
  check("API: GET nicht erlaubt → 405", r.status() === 405, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.2"), data: { ...valid, email: "kaputt", phone: "12", topic: "x", startedAt: 0 } });
  const body = await r.json();
  const fe = body.fieldErrors ?? [];
  check("API: Feldfehler → 400 mit Feldern", r.status() === 400 && ["email", "phone", "topic"].every((f) => fe.includes(f)), JSON.stringify(body));
  r = await api.post(url, { headers: h("10.0.0.9"), data: { ...valid, privacy: false, startedAt: 0 } });
  check("API: ohne Datenschutz-Zustimmung → 400 privacy", r.status() === 400 && (await r.json()).fieldErrors?.includes("privacy"), String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.3"), data: { ...valid, website: "spam", startedAt: 0 } });
  check("API: Honeypot → stilles 200", r.status() === 200, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.4"), data: { ...valid, startedAt: Date.now() } });
  check("API: zu schnell ausgefüllt → stilles 200", r.status() === 200, String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.5"), data: { ...valid, startedAt: Date.now() - 10000 } });
  check("API: gültige Anfrage → 200 bzw. 503 ohne Mailversand", [200, 503].includes(r.status()), String(r.status()));
  r = await api.post(url, { headers: h("10.0.0.6"), data: { ...valid, message: "x".repeat(20000), startedAt: 0 } });
  check("API: zu großer Body → 413", r.status() === 413, String(r.status()));
  const statuses = [];
  for (let i = 0; i < 6; i++) {
    const res = await api.post(url, { headers: h("10.0.0.7"), data: { ...valid, email: "kaputt", startedAt: 0 } });
    statuses.push(res.status());
  }
  check("API: Rate-Limit nach 5 Anfragen → 429", statuses[5] === 429, statuses.join(","));

  await ctx.close();

  const page = await browser.newPage();
  const res = await page.goto(new URL("/danke", SITE).toString());
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  const title = await page.locator("h1").textContent();
  check("Dankeseite erreichbar, noindex", res?.status() === 200 && robots?.includes("noindex") && title?.includes("angekommen"), `${res?.status()} ${robots} ${title}`);
  await page.close();
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
