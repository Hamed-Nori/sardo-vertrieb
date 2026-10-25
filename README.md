# Sardo-Vertrieb – Website

Next.js-Umsetzung (App Router, TypeScript, CSS Modules, GSAP + ScrollTrigger) des freigegebenen
Prototyps aus `../sardo-vertrieb-design/`. Der Prototyp ist die visuelle Referenz, `docs/09` die Bauanleitung.

## Befehle

```bash
npm install
npm run dev          # Entwicklung
npm run build        # Produktions-Build
npm run lint
npm start            # Produktionsserver (Standard-Port 3000, z. B. -- -p 3100)
```

## Qualitätssicherung

```bash
npm run build && npx next start -p 3100
python3 -m http.server 8080 -d ../sardo-vertrieb-design   # Prototyp
SITE_URL=http://localhost:3100/ npm run qa:visual          # Screenshots + Pixel-Diff 1440/1280/768/390/375
SITE_URL=http://localhost:3100/ npm run qa:functional      # Formular, API-Schutz, Menü, Motion, SEO
```

Ergebnisse liegen in `qa/output/` (Screenshots, Diff-Bilder, `report.json`).
Hinweis: Seit der Umstellung auf Logo-Blau und Navy weicht die Farbe bewusst vom Prototyp ab; `qa:visual` eignet sich jetzt nur noch für Layout-Vergleiche (Höhen und Positionen der Sections).

## Struktur

| Pfad | Inhalt |
|---|---|
| `styles/tokens.css` | Basis `design-system/tokens.css`; Farben auf Logo-Blau `#005BCC` + Navy umgestellt, Dark- und Light-Theme (`--font-sans` wird in `app/globals.css` auf next/font umgestellt) |
| `public/brand/logo.svg` | Logo „Sardo Digital“ (vektorisiert): blaue Teile in `--color-brand`, weiße Teile in Textfarbe |
| `components/layout/ThemeToggle` | Theme-Umschalter + Init-Skript (Standard: Systemeinstellung, Wahl in `localStorage`) |
| `content/content.de.json` | 1 : 1 Kopie aller Texte, typisiert über `types/content.ts` |
| `components/ui` | wiederverwendbare Bausteine (Button, Eyebrow, Panel, ImageCard, Field …) |
| `components/layout` | SiteHeader + MobileMenu (Client), SiteFooter, Wordmark, LegalPage |
| `components/sections` | Hero, Services, Product, About, Faq, Contact (+ ContactForm, Client) |
| `components/motion/Reveal.tsx` | GSAP-Reveals je Section (nur bei `prefers-reduced-motion: no-preference`) |
| `lib/contact-schema.ts` | Zod-Schema für Client und Server |
| `app/api/contact/route.ts` | POST-Handler: Content-Type, Größenlimit, Honeypot, Mindest-Ausfüllzeit, Rate-Limit, Resend |

## Kontaktformular aktivieren

1. `.env.example` nach `.env.local` (bzw. in die Hosting-Umgebung) übernehmen.
2. `RESEND_API_KEY`, `CONTACT_TO` und `CONTACT_FROM` (verifizierte Domain) setzen.
3. Neu bauen. Ohne diese Variablen bleibt das Formular im Demo-Modus mit Hinweis und versendet nichts.

Das Rate-Limit (5 Anfragen / 10 min pro IP) liegt im Speicher der Instanz; bei mehreren
Serverless-Instanzen durch Upstash Redis / Vercel KV ersetzen.
