"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Content } from "@/types/content";
import {
  consentCategories,
  OPEN_SETTINGS_EVENT,
  saveConsent,
  useConsent,
  type ConsentChoice,
} from "@/lib/consent";
import { Button } from "@/components/ui/Button/Button";
import styles from "./CookieConsent.module.css";

type Props = { texts: Content["cookieConsent"] };

/** Einwilligungs-Banner: erscheint, solange keine Entscheidung vorliegt oder über „Cookie-Einstellungen“ */
export function CookieConsent({ texts }: Props) {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [draft, setDraft] = useState<ConsentChoice>({ statistics: false, marketing: false });

  useEffect(() => {
    const open = () => {
      setReopened(true);
      setShowSettings(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, open);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open);
  }, []);

  // undefined = noch unbekannt (Server/erster Render) → nichts anzeigen, kein Aufblitzen
  const visible = consent === null || (reopened && consent !== undefined);
  if (!visible) return null;

  const decide = (choice: ConsentChoice) => {
    saveConsent(choice);
    setReopened(false);
    setShowSettings(false);
  };

  // Beim Öffnen der Einstellungen mit der bisherigen Auswahl beginnen
  const openSettings = () => {
    setDraft({ statistics: consent?.statistics ?? false, marketing: consent?.marketing ?? false });
    setShowSettings(true);
  };
  const current: ConsentChoice = reopened && consent && !showSettings ? consent : draft;
  const [before, after] = texts.text.split(texts.privacyLink);

  return (
    <section className={styles.banner} aria-labelledby="cookie-consent-title">
      <h2 className={styles.title} id="cookie-consent-title">
        {texts.title}
      </h2>
      <p className={styles.text}>
        {before}
        <Link href="/datenschutz">{texts.privacyLink}</Link>
        {after}
      </p>

      {showSettings && (
        <div className={styles.categories}>
          <div className={styles.category}>
            <span className={styles.categoryTitle}>{texts.categories.necessary.title}</span>
            <span className={styles.always}>{texts.alwaysActive}</span>
            <p className={styles.categoryText}>{texts.categories.necessary.text}</p>
          </div>
          {consentCategories.map((category) => (
            <div className={styles.category} key={category}>
              <label className={styles.categoryTitle} htmlFor={`consent-${category}`}>
                {texts.categories[category].title}
              </label>
              <input
                className={styles.switch}
                type="checkbox"
                role="switch"
                id={`consent-${category}`}
                checked={current[category]}
                onChange={(event) => setDraft({ ...current, [category]: event.target.checked })}
              />
              <p className={styles.categoryText}>{texts.categories[category].text}</p>
            </div>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="primary" block onClick={() => decide({ statistics: true, marketing: true })}>
          {texts.acceptAll}
        </Button>
        {showSettings ? (
          <Button variant="secondary" block onClick={() => decide(current)}>
            {texts.save}
          </Button>
        ) : (
          <>
            <Button variant="secondary" block onClick={() => decide({ statistics: false, marketing: false })}>
              {texts.necessaryOnly}
            </Button>
            <Button variant="secondary" block onClick={openSettings}>
              {texts.settings}
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
