import Link from "next/link";
import { cacheLife } from "next/cache";
import { content } from "@/lib/content";
import { Container } from "@/components/ui/Container/Container";
import { Logo } from "../Logo/Logo";
import styles from "./SiteFooter.module.css";

const navLabels: Record<string, string> = { Seite: "Seitennavigation", Rechtliches: "Rechtliches" };

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

export function SiteFooter() {
  const { footer } = content;
  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div>
          <Logo />
          <p className={styles.tagline}>{footer.claim}</p>
        </div>
        {footer.columns.map((column) => (
          <nav key={column.heading} aria-label={navLabels[column.heading] ?? column.heading}>
            <p className={styles.heading}>{column.heading}</p>
            <ul className={styles.list}>
              {column.links.map((link) => (
                <li key={link.href}>
                  {link.href.startsWith("#") ? <a href={link.href}>{link.label}</a> : <Link href={link.href}>{link.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </Container>
      <Container className={styles.base}>
        <p>
          © <CurrentYear /> Sardo Digital
        </p>
        <p>{footer.trademark}</p>
        <p>
          {footer.credit.text}{" "}
          <a className={styles.credit} href={footer.credit.link.href} target="_blank" rel="noopener">
            {footer.credit.link.label}
          </a>
        </p>
      </Container>
    </footer>
  );
}
