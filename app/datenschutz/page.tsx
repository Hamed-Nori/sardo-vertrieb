import type { Metadata } from "next";
import { content } from "@/lib/content";
import { LegalPage } from "@/components/layout/LegalPage/LegalPage";
import { CookieSettingsLink } from "@/components/consent/CookieSettingsLink";

export const metadata: Metadata = {
  title: "Datenschutzerklärung · Sardo Digital",
  alternates: { canonical: "/datenschutz" },
};

const c = content.company;


// Beschreibt den tatsächlichen technischen Stand: keine Cookies, kein Tracking, Schriften lokal,
// Hosting Vercel, Formularversand Resend (EU), WhatsApp nur per Link. Bei Änderungen anpassen.
export default function DatenschutzPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      lead="Der Schutz deiner Daten ist mir wichtig. Hier erfährst du, welche Daten beim Besuch dieser Website und bei einer Anfrage verarbeitet werden – und welche Rechte du hast."
    >
      <h2>1. Verantwortlicher</h2>
      <address>
        {c.owner}
        <br />
        {c.name} ({c.legalForm})
        <br />
        {c.street}, {c.zip} {c.city}
        <br />
        Telefon: <a href={c.phoneHref}>{c.phone}</a>
        <br />
        E-Mail: <a href={`mailto:${c.email}`}>{c.email}</a>
      </address>

      <h2>2. Das Wichtigste in Kürze</h2>
      <ul>
        <li>Derzeit sind keine Statistik- oder Marketing-Dienste eingebunden. Solche Dienste würden nur mit deiner Einwilligung über den Cookie-Banner geladen.</li>
        <li>Schriften und Bilder werden vom eigenen Server geladen – es werden keine Daten an Google Fonts o. Ä. übertragen.</li>
        <li>Personenbezogene Daten verarbeite ich nur, wenn du mir über das Kontaktformular oder WhatsApp schreibst.</li>
      </ul>

      <h2>3. Hosting und Server-Logfiles</h2>
      <p>
        Diese Website wird bei Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, USA, gehostet. Beim Aufruf
        der Seiten verarbeitet der Hoster automatisch technisch notwendige Daten (Server-Logfiles): IP-Adresse,
        Datum und Uhrzeit des Zugriffs, aufgerufene Seite, Referrer-URL, Browsertyp und Betriebssystem.
      </p>
      <p>
        Zweck ist die sichere und stabile Bereitstellung der Website, Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO
        (berechtigtes Interesse an einem sicheren Betrieb). Die Logfiles werden vom Hoster nur kurzzeitig gespeichert.
        Mit Vercel besteht ein Vertrag zur Auftragsverarbeitung. Eine Übermittlung in die USA erfolgt auf Grundlage
        des EU-US Data Privacy Framework bzw. der EU-Standardvertragsklauseln.
      </p>

      <h2>4. Kontaktformular</h2>
      <p>
        Wenn du das Kontaktformular nutzt, verarbeite ich die von dir eingegebenen Daten: Name, E-Mail-Adresse,
        Telefonnummer sowie – falls angegeben – Unternehmen, Anliegen und Nachricht. Zusätzlich wird der Zeitpunkt
        deiner Zustimmung zur Datenschutzerklärung festgehalten.
      </p>
      <p>
        Die Daten nutze ich ausschließlich, um deine Anfrage zu beantworten und einen Beratungstermin zu
        vereinbaren. Rechtsgrundlage ist deine Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie die Durchführung
        vorvertraglicher Maßnahmen (Art. 6 Abs. 1 lit. b DSGVO). Deine Einwilligung kannst du jederzeit mit Wirkung
        für die Zukunft widerrufen, z. B. per E-Mail an <a href={`mailto:${c.email}`}>{c.email}</a>.
      </p>
      <p>
        Für den Versand der Anfrage per E-Mail nutze ich den Dienst Resend (Resend, Inc., USA). Die Verarbeitung
        erfolgt über Server in der EU (Irland). Mit Resend besteht ein Vertrag zur Auftragsverarbeitung; für eine
        etwaige Übermittlung in die USA gelten das EU-US Data Privacy Framework bzw. die EU-Standardvertragsklauseln.
        Die Anfrage wird an mein E-Mail-Postfach bei Microsoft (Microsoft Ireland Operations Limited, Dublin, Irland)
        zugestellt.
      </p>
      <p>
        Zum Schutz vor Missbrauch wird die IP-Adresse beim Absenden kurzzeitig (höchstens 10 Minuten) im
        Arbeitsspeicher vorgehalten, um zu viele Anfragen in kurzer Zeit zu begrenzen. Sie wird nicht dauerhaft
        gespeichert (Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <p>
        Deine Anfrage lösche ich, sobald sie abschließend bearbeitet ist, sofern keine gesetzlichen
        Aufbewahrungspflichten (z. B. für Geschäftsbriefe nach Handels- und Steuerrecht) entgegenstehen.
      </p>

      <h2>5. Kontakt per WhatsApp</h2>
      <p>
        Auf dieser Website befinden sich Links zu WhatsApp. Beim bloßen Besuch der Website werden keine Daten an
        WhatsApp übertragen. Erst wenn du auf einen WhatsApp-Button klickst, wirst du zu WhatsApp weitergeleitet.
        Anbieter ist die WhatsApp Ireland Limited, 4 Grand Canal Square, Grand Canal Harbour, Dublin 2, Irland. Für
        die Verarbeitung innerhalb von WhatsApp gelten die Datenschutzhinweise von WhatsApp; dabei können Daten auch
        in die USA übermittelt werden.
      </p>
      <p>
        Nachrichten, die du mir per WhatsApp sendest, nutze ich nur zur Bearbeitung deiner Anfrage
        (Art. 6 Abs. 1 lit. b DSGVO). Wenn du das nicht möchtest, nutze bitte das Kontaktformular, E-Mail oder Telefon.
      </p>

      <h2>6. Cookies, lokale Speicherung und Einwilligung</h2>
      <p>
        Beim ersten Besuch fragt dich ein Banner, welche Kategorien von Cookies und ähnlichen Technologien du
        zulassen möchtest. Deine Auswahl wird im lokalen Speicher deines Browsers (Local Storage) abgelegt –
        zusammen mit dem Zeitpunkt der Entscheidung –, damit der Banner nicht bei jedem Besuch erneut erscheint.
      </p>
      <h3>Notwendig (immer aktiv)</h3>
      <p>
        Gespeichert werden nur deine Wahl zwischen hellem und dunklem Design sowie deine Cookie-Auswahl. Diese
        Angaben verlassen dein Gerät nicht und sind für die von dir gewünschten Funktionen technisch erforderlich
        (§ 25 Abs. 2 Nr. 2 TDDDG, Art. 6 Abs. 1 lit. f DSGVO).
      </p>
      <h3>Statistik und Marketing (nur mit Einwilligung)</h3>
      <p>
        Dienste dieser Kategorien werden ausschließlich geladen, wenn du ihnen zustimmst (§ 25 Abs. 1 TDDDG,
        Art. 6 Abs. 1 lit. a DSGVO). Derzeit sind keine solchen Dienste eingebunden. Sobald sich das ändert, werden
        die eingesetzten Anbieter hier mit Zweck, Speicherdauer und ggf. Drittlandübermittlung aufgeführt und
        deine Einwilligung wird erneut abgefragt.
      </p>
      <h3>Einwilligung ändern oder widerrufen</h3>
      <p>
        Du kannst deine Auswahl jederzeit mit Wirkung für die Zukunft ändern oder widerrufen – über{" "}
        <CookieSettingsLink label="Cookie-Einstellungen" /> (auch im Footer jeder
        Seite) oder indem du die Website-Daten in deinem Browser löschst.
      </p>

      <h2>7. Verschlüsselung</h2>
      <p>
        Diese Website nutzt aus Sicherheitsgründen eine TLS-Verschlüsselung. Eine verschlüsselte Verbindung
        erkennst du am „https://“ in der Adresszeile deines Browsers.
      </p>

      <h2>8. Deine Rechte</h2>
      <p>Du hast im Rahmen der gesetzlichen Bestimmungen jederzeit das Recht auf</p>
      <ul>
        <li>Auskunft über deine gespeicherten Daten (Art. 15 DSGVO),</li>
        <li>Berichtigung unrichtiger Daten (Art. 16 DSGVO),</li>
        <li>Löschung (Art. 17 DSGVO) und Einschränkung der Verarbeitung (Art. 18 DSGVO),</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO),</li>
        <li>Widerspruch gegen Verarbeitungen auf Grundlage berechtigter Interessen (Art. 21 DSGVO),</li>
        <li>Widerruf einer erteilten Einwilligung mit Wirkung für die Zukunft (Art. 7 Abs. 3 DSGVO).</li>
      </ul>
      <p>
        Wende dich dazu einfach an <a href={`mailto:${c.email}`}>{c.email}</a>. Außerdem hast du das Recht, dich bei
        einer Datenschutz-Aufsichtsbehörde zu beschweren. Zuständig ist: Der Hessische Beauftragte für Datenschutz
        und Informationsfreiheit, Gustav-Stresemann-Ring 1, 65189 Wiesbaden.
      </p>

      <small>Stand: Oktober 2026</small>
    </LegalPage>
  );
}
