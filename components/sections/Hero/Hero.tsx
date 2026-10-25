import Image from "next/image";
import { content } from "@/lib/content";
import { Button, ButtonGroup } from "@/components/ui/Button/Button";
import { Checklist } from "@/components/ui/Checklist/Checklist";
import { Container } from "@/components/ui/Container/Container";
import { Eyebrow } from "@/components/ui/Eyebrow/Eyebrow";
import { Headline } from "@/components/ui/SectionHeading/Headline";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon/WhatsAppIcon";
import { whatsappUrl } from "@/lib/whatsapp";
import { HeroMotion } from "./HeroMotion";
import styles from "./Hero.module.css";

export function Hero() {
  const { hero, whatsapp } = content;
  return (
    <HeroMotion>
      <section className={styles.hero} id="top" aria-labelledby="hero-title">
        <div className={styles.media} data-hero-media>
          <Image
            className={styles.image}
            src={hero.image.src}
            alt={hero.image.alt}
            fill
            priority
            sizes="100vw"
            data-hero-image
          />
        </div>
        <Container className={styles.inner}>
          <div className={styles.content}>
            <Eyebrow data-hero-item>{hero.eyebrow}</Eyebrow>
            <h1 className={styles.title} id="hero-title" data-hero-item>
              <Headline title={hero.title} />
            </h1>
            <p className={styles.lead} data-hero-item>
              {hero.lead}
            </p>
            <Checklist items={hero.checklist} data-hero-item />
            <ButtonGroup data-hero-item>
              <Button variant="primary" href={hero.primaryCta.href}>
                {hero.primaryCta.label}
              </Button>
              <Button
                variant="whatsapp"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={whatsapp.ariaLabel}
              >
                <WhatsAppIcon className={styles.whatsappIcon} />
                {whatsapp.label}
              </Button>
            </ButtonGroup>
          </div>
        </Container>
      </section>
    </HeroMotion>
  );
}
