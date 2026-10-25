import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage/LegalPage";

// Platzhalter (Text aus prototype/impressum.html) – bis echte Angaben vorliegen
export const metadata: Metadata = {
  title: "Impressum · Sardo Digital",
  alternates: { canonical: "/impressum" },
  robots: { index: false, follow: true },
};

export default function ImpressumPage() {
  return (
    <LegalPage
      eyebrow="Rechtliches"
      title="Impressum"
      lead="Platzhalter – die Pflichtangaben nach § 5 DDG (Name, ladungsfähige Anschrift, Kontakt, ggf. USt-IdNr.) liegen noch nicht vor und werden vor der Veröffentlichung von Daniele Sardo ergänzt."
      todo="[PLATZHALTER: Angaben folgen – keine erfundenen Daten]"
    />
  );
}
