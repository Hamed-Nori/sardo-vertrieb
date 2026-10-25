import { Container } from "@/components/ui/Container/Container";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import { Lead } from "@/components/ui/SectionHeading/SectionHeading";
import { TextLink } from "@/components/ui/TextLink/TextLink";
import { SubpageHeader } from "../SiteHeader/SubpageHeader";
import styles from "./LegalPage.module.css";

type Props = {
  eyebrow: string;
  title: string;
  lead: string;
  todo?: string;
  /** Fließtext (Impressum, Datenschutz) */
  children?: React.ReactNode;
};

/** Einfache Unterseite wie prototype/impressum.html – auch für die Dankeseite */
export function LegalPage({ eyebrow, title, lead, todo, children }: Props) {
  return (
    <>
      <SubpageHeader />
      <Container as="main" id="main" size="narrow" className={styles.legal}>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={styles.title}>{title}</h1>
        <Lead>{lead}</Lead>
        {todo && <p className={styles.todo}>{todo}</p>}
        {children && <div className={styles.prose}>{children}</div>}
        <TextLink href="/" arrow={false} className={styles.back}>
          <span aria-hidden="true">←</span> Zurück zur Startseite
        </TextLink>
      </Container>
    </>
  );
}
