import Image from "next/image";
import type { Img } from "@/types/content";
import styles from "./Panel.module.css";

type Props = {
  /** Hintergrundbild → Variante mit Overlay (dekorativ, alt="") */
  image?: Img;
  imageSizes?: string;
  className?: string;
  children: React.ReactNode;
};

export function Panel({ image, imageSizes = "100vw", className, children }: Props) {
  const classes = [styles.panel, image && styles.image, className].filter(Boolean).join(" ");
  return (
    <div className={classes}>
      {image && (
        <div className={styles.backdrop} aria-hidden="true">
          <Image
            src={image.src}
            alt=""
            fill
            sizes={imageSizes}
            quality={60}
            style={{ objectPosition: image.position }}
          />
        </div>
      )}
      {children}
    </div>
  );
}
