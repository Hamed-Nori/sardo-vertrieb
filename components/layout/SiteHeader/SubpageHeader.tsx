import { Container } from "@/components/ui/Container/Container";
import { Wordmark } from "../Wordmark/Wordmark";
import styles from "./SiteHeader.module.css";

/** Header der Unterseiten: startet im Zustand „scrolled“, nur Wortmarke */
export function SubpageHeader() {
  return (
    <header className={`${styles.header} ${styles.scrolled}`}>
      <Container className={styles.inner}>
        <Wordmark href="/" />
      </Container>
    </header>
  );
}
