import type { Metadata } from "next";
import { content } from "@/lib/content";
import { LegalPage } from "@/components/layout/LegalPage/LegalPage";

const page = content.contact.thanks;

export const metadata: Metadata = {
  title: "Danke · Sardo Digital",
  robots: { index: false, follow: false },
};

/** Nach dem Absenden des Kontaktformulars */
export default function DankePage() {
  return <LegalPage eyebrow={page.eyebrow} title={page.title} lead={page.lead} />;
}
