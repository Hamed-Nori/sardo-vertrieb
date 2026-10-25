"use client";

import { openConsentSettings } from "@/lib/consent";

/** Footer-Link zum erneuten Öffnen der Cookie-Einstellungen (Widerruf jederzeit möglich) */
export function CookieSettingsLink({ label, className }: { label: string; className?: string }) {
  return (
    <button type="button" className={className} onClick={openConsentSettings}>
      {label}
    </button>
  );
}
