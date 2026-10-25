import { contactRequestSchema, MIN_FILL_TIME_MS, type ContactField } from "@/lib/contact-schema";
import { isMailConfigured, sendContactMail } from "@/lib/mail";
import { isRateLimited } from "@/lib/rate-limit";

const MAX_BODY_BYTES = 10_000;

function json(body: unknown, status: number) {
  return Response.json(body, { status });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}

/** Anfrage prüfen (inkl. Datenschutz-Häkchen) und an Daniele senden */
export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return json({ error: "unsupported_media_type" }, 415);
  }
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) return json({ error: "payload_too_large" }, 413);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  if (isRateLimited(clientIp(request))) return json({ error: "rate_limited" }, 429);

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    const fields = new Set<ContactField | "privacy">();
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "website") return json({ ok: true }, 200); // Honeypot: Bots erhalten keinen Hinweis
      if (typeof key === "string" && key !== "startedAt") fields.add(key as ContactField | "privacy");
    }
    return json({ fieldErrors: [...fields] }, 400);
  }

  const { startedAt, name, email, phone, company, topic, message } = parsed.data;
  if (Date.now() - startedAt < MIN_FILL_TIME_MS) return json({ ok: true }, 200); // zu schnell → still verwerfen

  if (!isMailConfigured()) return json({ error: "not_configured" }, 503);

  try {
    await sendContactMail({ name, email, phone, company, topic, message });
  } catch (error) {
    console.error("[contact] Versand fehlgeschlagen", error instanceof Error ? error.message : error);
    return json({ error: "send_failed" }, 502);
  }
  return json({ ok: true }, 200);
}
