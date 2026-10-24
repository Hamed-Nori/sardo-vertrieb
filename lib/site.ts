// Basis-URL und Indexierung kommen aus der Umgebung – die Produktionsdomain
// steht noch nicht fest. Ohne SITE_INDEXABLE=true bleibt die Seite noindex
// (wie der Prototyp), bis Impressum/Datenschutz und Konditionen freigegeben sind.
export const siteUrl = process.env.SITE_URL ?? "http://localhost:3000";
export const isIndexable = process.env.SITE_INDEXABLE === "true";
