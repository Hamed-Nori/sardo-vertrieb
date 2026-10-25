import { buildLlmsTxt } from "@/lib/llms";

// Statisch beim Build erzeugt (keine Laufzeitdaten) – Inhalte stammen aus content.de.json
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
