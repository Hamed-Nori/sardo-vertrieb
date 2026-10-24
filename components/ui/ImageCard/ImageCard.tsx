import Image from "next/image";
import type { Img, Link } from "@/types/content";
import { TextLink } from "../TextLink/TextLink";
import styles from "./ImageCard.module.css";

type Props = {
  index: string;
  title: string;
  text: string;
  link: Link;
  image: Img & { alt: string };
  variant: "overlay" | "stacked";
  sizes: string;
} & React.HTMLAttributes<HTMLElement>;

export function ImageCard({ index, title, text, link, image, variant, sizes, ...rest }: Props) {
  const img = (
    <Image
      className={styles.image}
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      style={{ objectPosition: image.position }}
    />
  );
  return (
    <article className={variant === "stacked" ? `${styles.card} ${styles.stacked}` : styles.card} {...rest}>
      {variant === "stacked" ? <div className={styles.stackedMedia}>{img}</div> : img}
      <div className={styles.body}>
        <span className={styles.index} aria-hidden="true">
          {index}
        </span>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.text}>{text}</p>
        <TextLink className={styles.link} href={link.href}>
          {link.label}
        </TextLink>
      </div>
    </article>
  );
}
