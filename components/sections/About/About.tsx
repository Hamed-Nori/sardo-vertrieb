import Image from "next/image";
import { content } from "@/lib/content";
import { typo } from "@/lib/typography";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Panel } from "@/components/ui/Panel/Panel";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./About.module.css";

export function About() {
  const { about } = content;
  return (
    <Reveal preset="about">
      <section className={styles.section} id="ueber-mich" aria-labelledby="about-title">
        <Container>
          <Panel className={styles.about}>
            <div>
              <SectionHeading eyebrow={about.eyebrow} title={about.title} id="about-title" eyebrowOnPanel data-reveal />
              <div className={styles.letter} data-reveal>
                <p className={styles.greeting}>{typo(about.greeting)}</p>
                {about.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{typo(paragraph)}</p>
                ))}
              </div>
              <Button variant="primary" href={about.cta.href} className={styles.cta} data-reveal>
                {about.cta.label}
              </Button>
            </div>

            <figure className={styles.media} data-reveal>
              <Image
                className={styles.image}
                src={about.image.src}
                alt={about.image.alt}
                fill
                sizes="(min-width: 992px) 400px, 100vw"
                style={{ objectPosition: about.image.position }}
              />
              <figcaption className={styles.signature}>
                <span className={styles.signatureName}>{about.signature.name}</span>
                <span className={styles.signatureRole}>{about.signature.role}</span>
              </figcaption>
            </figure>
          </Panel>
        </Container>
      </section>
    </Reveal>
  );
}
