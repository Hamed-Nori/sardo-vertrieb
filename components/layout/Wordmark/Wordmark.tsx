import Link from "next/link";
import styles from "./Wordmark.module.css";

/** Reine Typo-Wortmarke – es existiert kein Logo */
export function Wordmark({ href = "#top" }: { href?: string }) {
  const body = (
    <span>
      Sardo<span className={styles.suffix}>-Vertrieb</span>
    </span>
  );
  if (href.startsWith("#")) {
    return (
      <a className={styles.wordmark} href={href} aria-label="Sardo-Vertrieb – zum Seitenanfang">
        {body}
      </a>
    );
  }
  return (
    <Link className={styles.wordmark} href={href} aria-label="Sardo-Vertrieb – zur Startseite">
      {body}
    </Link>
  );
}
