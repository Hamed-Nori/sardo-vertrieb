import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { content } from "@/lib/content";
import { siteUrl, isIndexable } from "@/lib/site";
import "@/styles/tokens.css";
import "./globals.css";

const instrumentSans = localFont({
  src: [
    { path: "../styles/fonts/instrument-sans-latin-400-normal.woff2", weight: "400", style: "normal" },
    { path: "../styles/fonts/instrument-sans-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "../styles/fonts/instrument-sans-latin-500-normal.woff2", weight: "500", style: "normal" },
    { path: "../styles/fonts/instrument-sans-latin-500-italic.woff2", weight: "500", style: "italic" },
    { path: "../styles/fonts/instrument-sans-latin-600-normal.woff2", weight: "600", style: "normal" },
    { path: "../styles/fonts/instrument-sans-latin-700-normal.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-instrument",
  display: "swap",
  // Kein generierter Arial-Fallback: Zeichen außerhalb des Subsets (z. B. „→“)
  // sollen wie im Prototyp aus der Token-Kette ("Helvetica Neue", …) kommen.
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: content.meta.title,
  description: content.meta.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Sardo-Vertrieb",
    title: content.meta.title,
    description: content.meta.description,
    url: "/",
  },
  robots: isIndexable ? { index: true, follow: true } : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#171A1B", // = --color-background-primary
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={instrumentSans.variable}>
      <body>
        <a className="skip-link" href="#main">
          Zum Inhalt springen
        </a>
        {children}
      </body>
    </html>
  );
}
