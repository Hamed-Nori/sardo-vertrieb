// Basis-URL und Indexierung kommen aus der Umgebung. Ohne SITE_INDEXABLE=true bleibt
// die Seite noindex, bis Impressum/Datenschutz und Konditionen freigegeben sind.

/** Liest SITE_URL und korrigiert offensichtliche Tippfehler (fehlendes „:“ oder „https://“). */
function resolveSiteUrl(raw: string | undefined): string {
  const value = raw?.trim();
  if (!value) return "http://localhost:3000";
  const repaired = value.replace(/^(https?)\/\//i, "$1://").replace(/^(?!https?:\/\/)/i, "https://");
  try {
    return new URL(repaired).origin;
  } catch {
    throw new Error(`SITE_URL ist keine gültige Adresse: "${value}" – erwartet z. B. https://sardo-digital.de`);
  }
}

export const siteUrl = resolveSiteUrl(process.env.SITE_URL);
export const isIndexable = process.env.SITE_INDEXABLE === "true";
