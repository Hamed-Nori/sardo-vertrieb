import { content } from "@/lib/content";
import { siteUrl } from "@/lib/site";
import { whatsappUrl } from "@/lib/whatsapp";

const abs = (path: string) => new URL(path, siteUrl).toString();
const headline = (t: { text: string; accent?: string }) => [t.text, t.accent].filter(Boolean).join(" ");

/** llms.txt (llmstxt.org): kompakte Markdown-Fassung aller Seiteninhalte für KI-Systeme */
export function buildLlmsTxt(): string {
  const { meta, hero, services, product, about, faq, contact, company, whatsapp } = content;
  const lines = [
    "# Sardo Digital",
    "",
    `> ${meta.description}`,
    "",
    `Sardo Digital ist der Markenauftritt von ${company.name} (${company.legalForm}), Inhaber ${company.owner}, mit Sitz in ${company.city}. ${hero.lead}`,
    "",
    ...hero.checklist.map((item) => `- ${item}`),
    "",
    `## ${headline(services.title)}`,
    "",
    ...services.items.map((item) => `- **${item.title}:** ${item.text}`),
    "",
    `${services.audience.label}: ${services.audience.items.join(", ")}.`,
    "",
    `## ${product.eyebrow}: ${headline(product.title)}`,
    "",
    product.lead,
    "",
    ...product.info.map((item) => `- **${item.title}** – ${item.text}`),
    "",
    "Konditionen:",
    ...product.stats.map((stat) => `- ${stat.value} ${stat.label}`),
    "",
    product.statsNote,
    "",
    `## Über ${company.owner}`,
    "",
    about.greeting,
    "",
    ...about.paragraphs,
    "",
    "## Häufige Fragen",
    "",
    ...faq.items.flatMap((item) => [`### ${item.question}`, "", item.answer, ""]),
    "## Kontakt",
    "",
    `${contact.lead} ${contact.text}`,
    "",
    `- Kontaktformular: ${abs("/#kontakt")}`,
    `- ${whatsapp.label}: ${whatsappUrl}`,
    `- Telefon: ${company.phone}`,
    `- E-Mail: ${company.email}`,
    `- Anschrift: ${company.owner}, ${company.name}, ${company.street}, ${company.zip} ${company.city}`,
    "",
    "## Seiten",
    "",
    `- [Startseite](${abs("/")}): Leistungen, Shift4 One, Über mich, FAQ und Kontakt`,
    `- [Impressum](${abs("/impressum")})`,
    `- [Datenschutzerklärung](${abs("/datenschutz")})`,
    "",
  ];
  return lines.join("\n");
}
