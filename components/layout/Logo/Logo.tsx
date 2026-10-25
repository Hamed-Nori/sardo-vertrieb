import Link from "next/link";
import styles from "./Logo.module.css";

// Maße der Vektorvorlage (public/brand/logo.svg)
const VIEWBOX = "0 0 995 326";

/** Logo „Sardo Digital“: weiße Teile der Vorlage in Textfarbe (Theme), blaue Teile in Markenblau */
export function Logo({ href = "#top" }: { href?: string }) {
  const svg = (
    <svg className={styles.logo} viewBox={VIEWBOX} aria-hidden="true" focusable="false">
      <use className={styles.light} href="/brand/logo.svg#light" />
      <use className={styles.blue} href="/brand/logo.svg#blue" />
    </svg>
  );
  if (href.startsWith("#")) {
    return (
      <a className={styles.link} href={href} aria-label="Sardo Digital – zum Seitenanfang">
        {svg}
      </a>
    );
  }
  return (
    <Link className={styles.link} href={href} aria-label="Sardo Digital – zur Startseite">
      {svg}
    </Link>
  );
}
