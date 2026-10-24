import { content } from "@/lib/content";
import { typo } from "@/lib/typography";
import { Container } from "@/components/ui/Container/Container";
import { ImageCard } from "@/components/ui/ImageCard/ImageCard";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Services.module.css";

// sizes je Kartenposition im 7 : 5-Raster (docs/09 D)
const cardSizes = ["(min-width: 992px) 640px, 100vw", "(min-width: 992px) 440px, 100vw"];

export function Services() {
  const { services } = content;
  return (
    <Reveal preset="services">
      <section className={styles.section} id="leistungen" aria-labelledby="services-title">
        <Container>
          <SectionHeading
            align="center"
            eyebrow={services.eyebrow}
            title={services.title}
            id="services-title"
            data-reveal
          />

          <div className={styles.grid}>
            {services.items.map((item, i) => (
              <ImageCard
                key={item.index}
                index={item.index}
                title={item.title}
                text={item.text}
                link={item.link}
                image={item.image}
                variant={item.variant === "stacked" ? "stacked" : "overlay"}
                sizes={cardSizes[i] ?? "100vw"}
                data-reveal
              />
            ))}
          </div>

          <div className={styles.audience} data-reveal data-audience>
            <p className={styles.audienceLabel}>{services.audience.label}</p>
            <ul className={styles.audienceList}>
              {services.audience.items.map((item) => (
                <li key={item}>{typo(item)}</li>
              ))}
            </ul>
          </div>
        </Container>
      </section>
    </Reveal>
  );
}
