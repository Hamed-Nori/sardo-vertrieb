import { Resend } from "resend";
import { content } from "@/lib/content";
import type { ContactFields } from "@/lib/contact-schema";

// Versand über Resend. Aktiv erst, wenn RESEND_API_KEY und CONTACT_TO gesetzt sind –
// bis dahin bleibt das Formular im Demo-Modus. Nur serverseitig verwenden.

export function isMailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.CONTACT_TO);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendContactMail(data: ContactFields): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO;
  if (!apiKey || !to) throw new Error("Mailversand ist nicht konfiguriert");

  // Absender muss eine bei Resend verifizierte Domain sein (EU-Region wählen)
  const from = process.env.CONTACT_FROM ?? "Sardo Digital <onboarding@resend.dev>";

  // Betreff nur aus festen Werten – keine Nutzereingaben (Header-Injection)
  const topicLabel =
    content.contact.form.fields.topic.options.find((o) => o.value === data.topic)?.label ?? data.topic;
  const receivedAt = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });

  const rows: [string, string][] = [
    ["Name", data.name],
    ["Unternehmen", data.company],
    ["E-Mail", data.email],
    ["Thema", topicLabel],
    ["Nachricht", data.message || "–"],
    ["Eingegangen", receivedAt],
  ];

  const text = rows.map(([label, value]) => `${label}: ${value}`).join("\n");
  const html = `<table cellpadding="6">${rows
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top">${escapeHtml(label)}</th><td style="white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: to.split(",").map((address) => address.trim()),
    replyTo: data.email, // Absenderadresse nur als Reply-To
    subject: `Neue Beratungsanfrage – ${topicLabel}`,
    text,
    html,
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
