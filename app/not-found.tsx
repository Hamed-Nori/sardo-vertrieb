import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Seite nicht gefunden · Sardo Digital",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <LegalPage
      eyebrow="404"
      title="Seite nicht gefunden"
      lead="Die aufgerufene Seite existiert nicht oder wurde verschoben."
    />
  );
}
