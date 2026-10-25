import { Resend } from "resend";
import { content } from "@/lib/content";
import type { ContactFields } from "@/lib/contact-schema";

// Versand über Resend. Aktiv erst, wenn RESEND_API_KEY und CONTACT_TO gesetzt sind –
// bis dahin verweist das Formular auf WhatsApp. Nur serverseitig verwenden.

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

function client() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("Mailversand ist nicht konfiguriert");
  return new Resend(apiKey);
}

// Absender muss eine bei Resend verifizierte Domain sein
const from = () => process.env.CONTACT_FROM ?? "Sardo Digital <onboarding@resend.dev>";

function topicLabel(topic: ContactFields["topic"]): string {
  return content.contact.form.fields.topic.options.find((o) => o.value === topic)?.label ?? "–";
}

/** Alle Angaben als Zeilen – identisch in beiden Mails */
function rows(data: ContactFields): [string, string][] {
  const f = content.contact.form.fields;
  return [
    [f.name.label, data.name],
    [f.email.label, data.email],
    [f.phone.label, data.phone],
    [f.company.label, data.company || "–"],
    [f.topic.label, topicLabel(data.topic)],
    [f.message.label, data.message || "–"],
  ];
}

const textTable = (r: [string, string][]) => r.map(([label, value]) => `${label}: ${value}`).join("\n");

const htmlTable = (r: [string, string][]) =>
  `<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-size:14px">${r
    .map(
      ([label, value]) =>
        `<tr><th align="left" valign="top" style="padding-right:16px;color:#566377;font-weight:500">${escapeHtml(label)}</th><td style="white-space:pre-wrap;color:#0B1220">${escapeHtml(value)}</td></tr>`,
    )
    .join("")}</table>`;

const layout = (body: string) =>
  `<div style="font-family:Helvetica,Arial,sans-serif;line-height:1.6;color:#0B1220;max-width:560px">${body}</div>`;

/** Anfrage mit allen Angaben an Daniele; Antworten gehen per Reply-To an den Kunden */
export async function sendContactMail(data: ContactFields): Promise<void> {
  const to = process.env.CONTACT_TO;
  if (!to) throw new Error("Mailversand ist nicht konfiguriert");
  const receivedAt = new Date().toLocaleString("de-DE", { timeZone: "Europe/Berlin" });
  const all: [string, string][] = [
    ...rows(data),
    ["Datenschutzerklärung", `zugestimmt am ${receivedAt}`],
  ];

  const { error } = await client().emails.send({
    from: from(),
    to: to.split(",").map((address) => address.trim()),
    replyTo: data.email, // Absenderadresse nur als Reply-To
    // Betreff nur aus festen Werten – keine Nutzereingaben (Header-Injection)
    subject: `Neue Beratungsanfrage – ${data.topic ? topicLabel(data.topic) : "Allgemein"}`,
    text: textTable(all),
    html: layout(`<p>Neue Beratungsanfrage über sardo-digital.de:</p>${htmlTable(all)}`),
  });
  if (error) throw new Error(`Resend: ${error.message}`);
}
