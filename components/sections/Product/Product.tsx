import Image from "next/image";
import { content } from "@/lib/content";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { InfoList } from "@/components/ui/InfoList/InfoList";
import { Lead, SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Stats } from "@/components/ui/Stats/Stats";
import { Reveal } from "@/components/motion/Reveal";
import styles from "./Product.module.css";

export function Product() {
  const { product } = content;
  return (
    <Reveal preset="product">
      <section className={styles.section} id="shift4-one" aria-labelledby="product-title">
        <Container>
          <div className={styles.product}>
            <figure className={styles.media} data-reveal data-product-media>
              <Image
                className={styles.image}
                src={product.image.src}
                alt={product.image.alt}
                width={product.image.width}
                height={product.image.height}
                sizes="(min-width: 992px) 480px, 100vw"
                style={{ objectPosition: product.image.position }}
              />
            </figure>

            <div>
              <SectionHeading eyebrow={product.eyebrow} title={product.title} id="product-title" data-reveal>
                <Lead>{product.lead}</Lead>
              </SectionHeading>
              <InfoList items={product.info} data-reveal />
              <Button variant="secondary" href={product.cta.href} className={styles.cta} data-reveal>
                {product.cta.label}
              </Button>
            </div>
          </div>

          <Stats items={product.stats} note={product.statsNote} data-reveal data-stats />
        </Container>
      </section>
    </Reveal>
  );
}
