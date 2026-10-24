import { content } from "@/lib/content";
import { Accordion } from "@/components/ui/Accordion/Accordion";
import { Container } from "@/components/ui/Container/Container";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { TextLink } from "@/components/ui/TextLink/TextLink";
import { Reveal } from "@/components/motion/Reveal";
import { FaqJsonLd } from "./FaqJsonLd";
import styles from "./Faq.module.css";

export function Faq() {
  const { faq } = content;
  return (
    <Reveal preset="faq">
      <section className={styles.section} id="faq" aria-labelledby="faq-title">
        <Container size="narrow">
          <SectionHeading align="center" eyebrow={faq.eyebrow} title={faq.title} id="faq-title" data-reveal />
          <Accordion items={faq.items} name="faq" data-reveal />
          <p className={styles.hint} data-reveal>
            {faq.hint.text} <TextLink href={faq.hint.link.href}>{faq.hint.link.label}</TextLink>
          </p>
        </Container>
        <FaqJsonLd items={faq.items} />
      </section>
    </Reveal>
  );
}
