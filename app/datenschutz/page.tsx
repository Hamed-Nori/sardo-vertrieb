import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage/LegalPage";

// Platzhalter (Text aus prototype/datenschutz.html) – wird vor Livegang erstellt und rechtlich geprüft
export const metadata: Metadata = {
  title: "Datenschutzerklärung · Sardo Digital",
  alternates: { canonical: "/datenschutz" },
  robots: { index: false, follow: true },
};

export default function DatenschutzPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Datenschutzerklärung"
      lead="Platzhalter – die Datenschutzerklärung (u. a. Verantwortlicher, Zwecke und Rechtsgrundlagen, Kontaktformular, Hosting, Betroffenenrechte) wird vor der Veröffentlichung erstellt und rechtlich geprüft."
      todo="[PLATZHALTER: Text folgt]"
    />
  );
}
