import type { Metadata } from "next";
import { content } from "@/lib/content";
import { LegalPage } from "@/components/layout/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Impressum · Sardo Digital",
  alternates: { canonical: "/impressum" },
};

const c = content.company;

export default function ImpressumPage() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Impressum" lead="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG)">
      <h2>Anbieter</h2>
      <address>
        {c.owner}
        <br />
        {c.name} ({c.legalForm})
        <br />
        {c.street}
        <br />
        {c.zip} {c.city}
      </address>
      <p>Sardo Digital ist der Markenauftritt von {c.name}.</p>

      <h2>Kontakt</h2>
      <p>
        Telefon: <a href={c.phoneHref}>{c.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${c.email}`}>{c.email}</a>
      </p>

      <h2>Umsatzsteuer</h2>
      <p>{c.tax}</p>

      <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
      <address>
        {c.owner}
        <br />
        {c.street}, {c.zip} {c.city}
      </address>

      <h2>Verbraucherstreitbeilegung</h2>
      <p>
        Ich bin nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer
        Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Markenhinweis</h2>
      <p>{content.footer.trademark}</p>
    </LegalPage>
  );
}
