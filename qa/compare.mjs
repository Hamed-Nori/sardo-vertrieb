// Visueller Vergleich Next.js-Seite ↔ HTML-Prototyp (docs/09 C)
// Voraussetzung: Prototyp unter PROTO_URL, Next.js unter SITE_URL erreichbar.
//   npm run build && npm start            (Port 3000)
//   python3 -m http.server 8080 -d ../sardo-vertrieb-design
//   npm run qa:visual
import { chromium } from "@playwright/test";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";
import fs from "node:fs";
import path from "node:path";

const PROTO_URL = process.env.PROTO_URL ?? "http://localhost:8080/prototype/";
const SITE_URL = process.env.SITE_URL ?? "http://localhost:3000/";
const WIDTHS = (process.env.WIDTHS ?? "1440,1280,768,390,375").split(",").map(Number);
const OUT = path.resolve("qa/output");
fs.mkdirSync(OUT, { recursive: true });

async function shoot(browser, url, width, file) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  // Durch die Seite scrollen, damit Lazy-Images laden
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: file, fullPage: true });
  const sections = await page.evaluate(() =>
    ["top", "leistungen", "shift4-one", "ueber-mich", "faq", "kontakt"].map((id) => {
      const el = document.getElementById(id);
      const r = el.getBoundingClientRect();
      return { id, top: Math.round(r.top + window.scrollY), height: Math.round(r.height) };
    }),
  );
  await page.close();
  return { sections, height };
}

function diffRegion(a, b, top, height, width) {
  let diff = 0;
  let total = 0;
  for (let y = top; y < Math.min(top + height, a.height, b.height); y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
      if (d > 48) diff++;
      total++;
    }
  }
  return total ? (diff / total) * 100 : 0;
}

const browser = await chromium.launch();
const report = [];
for (const width of WIDTHS) {
  const protoFile = path.join(OUT, `proto-${width}.png`);
  const siteFile = path.join(OUT, `site-${width}.png`);
  const proto = await shoot(browser, PROTO_URL, width, protoFile);
  const site = await shoot(browser, SITE_URL, width, siteFile);

  const a = PNG.sync.read(fs.readFileSync(protoFile));
  const b = PNG.sync.read(fs.readFileSync(siteFile));
  const h = Math.min(a.height, b.height);
  const crop = (img) => {
    const out = new PNG({ width, height: h });
    img.data.copy(out.data, 0, 0, width * h * 4);
    return out;
  };
  const ca = crop(a);
  const cb = crop(b);
  const diff = new PNG({ width, height: h });
  const px = pixelmatch(ca.data, cb.data, diff.data, width, h, { threshold: 0.1 });
  fs.writeFileSync(path.join(OUT, `diff-${width}.png`), PNG.sync.write(diff));

  const perSection = proto.sections.map((s, i) => {
    const t = site.sections[i];
    return {
      id: s.id,
      protoTop: s.top,
      siteTop: t.top,
      protoH: s.height,
      siteH: t.height,
      diffPct: +diffRegion(ca, cb, s.top, s.height, width).toFixed(2),
    };
  });
  report.push({ width, protoHeight: a.height, siteHeight: b.height, totalDiffPct: +((px / (width * h)) * 100).toFixed(2), perSection });
}
await browser.close();
fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
for (const r of report) {
  console.log(`\n${r.width}px  Höhe Prototyp ${r.protoHeight} / Next ${r.siteHeight}  Gesamt-Diff ${r.totalDiffPct} %`);
  for (const s of r.perSection)
    console.log(`  ${s.id.padEnd(11)} top ${s.protoTop}/${s.siteTop}  h ${s.protoH}/${s.siteH}  diff ${s.diffPct} %`);
}
