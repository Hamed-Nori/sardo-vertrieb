"use client";

import { useConsent, type ConsentCategory } from "@/lib/consent";

/**
 * Rendert Inhalte (z. B. Tracking-Skripte via next/script) erst nach Einwilligung.
 *
 * Beispiel (app/layout.tsx):
 *   <ConsentGate category="statistics">
 *     <Script src="https://www.googletagmanager.com/gtag/js?id=G-XXXX" strategy="afterInteractive" />
 *   </ConsentGate>
 *
 * Neue Dienste zusätzlich in der Datenschutzerklärung (Abschnitt Cookies) aufführen.
 */
export function ConsentGate({ category, children }: { category: ConsentCategory; children: React.ReactNode }) {
  const consent = useConsent();
  return consent?.[category] ? <>{children}</> : null;
}
