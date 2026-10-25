"use client";

import { useMemo, useSyncExternalStore } from "react";

// Einwilligungsverwaltung (Cookie-Banner). Die Auswahl liegt im localStorage des Besuchers.
// CONSENT_VERSION erhöhen, wenn neue Dienste/Kategorien hinzukommen – dann wird erneut gefragt.

export const CONSENT_VERSION = 1;
export const consentCategories = ["statistics", "marketing"] as const;
export type ConsentCategory = (typeof consentCategories)[number];
export type ConsentChoice = Record<ConsentCategory, boolean>;
export type Consent = ConsentChoice & { v: number; necessary: true; updatedAt: string };

const STORAGE_KEY = "cookie-consent";
const CHANGE_EVENT = "cookie-consent-change";
export const OPEN_SETTINGS_EVENT = "cookie-consent-open";

function readRaw(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function parse(raw: string | null): Consent | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Consent>;
    if (value.v !== CONSENT_VERSION) return null;
    return {
      v: CONSENT_VERSION,
      necessary: true,
      statistics: value.statistics === true,
      marketing: value.marketing === true,
      updatedAt: String(value.updatedAt ?? ""),
    };
  } catch {
    return null;
  }
}

export function saveConsent(choice: ConsentChoice) {
  const consent: Consent = { v: CONSENT_VERSION, necessary: true, ...choice, updatedAt: new Date().toISOString() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  } catch {
    // Speicher nicht verfügbar – Auswahl gilt dann nur bis zum Neuladen
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Öffnet den Banner erneut mit den Einstellungen (z. B. aus dem Footer) */
export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const SERVER = "__server__";

/**
 * Aktuelle Einwilligung: `undefined` solange unbekannt (Server/erster Render),
 * `null` wenn noch keine Entscheidung getroffen wurde.
 */
export function useConsent(): Consent | null | undefined {
  const raw = useSyncExternalStore(subscribe, readRaw, () => SERVER);
  return useMemo(() => (raw === SERVER ? undefined : parse(raw)), [raw]);
}
