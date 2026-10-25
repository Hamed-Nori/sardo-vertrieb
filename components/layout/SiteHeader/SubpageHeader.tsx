import { Container } from "@/components/ui/Container/Container";
import { Logo } from "../Logo/Logo";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import styles from "./SiteHeader.module.css";

/** Header der Unterseiten: startet im Zustand „scrolled“, Logo + Theme-Umschalter */
export function SubpageHeader() {
  return (
    <header className={`${styles.header} ${styles.scrolled}`}>
      <Container className={styles.inner}>
        <Logo href="/" />
        <div className={`${styles.actions} ${styles.actionsEnd}`}>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
