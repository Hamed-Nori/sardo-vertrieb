// Einfaches Rate-Limit pro IP im Speicher der laufenden Instanz.
// Für Serverless mit mehreren Instanzen durch Upstash Redis / Vercel KV ersetzen.
// Es werden nur Zeitstempel gehalten, keine Logs; Einträge verfallen nach dem Fenster.

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();

export function isRateLimited(key: string, now = Date.now()): boolean {
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_REQUESTS) {
    hits.set(key, recent);
    return true;
  }
  recent.push(now);
  hits.set(key, recent);

  // Speicher klein halten
  if (hits.size > 5000) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
    }
  }
  return false;
}
