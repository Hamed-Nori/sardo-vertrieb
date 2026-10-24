import type { FaqItem } from "@/types/content";
import { typo } from "@/lib/typography";
import styles from "./Accordion.module.css";

type Props = { items: FaqItem[]; name: string } & React.HTMLAttributes<HTMLDivElement>;

/** Natives details/summary – exklusiv über das gemeinsame name-Attribut, ohne JS */
export function Accordion({ items, name, ...rest }: Props) {
  return (
    <div className={styles.accordion} {...rest}>
      {items.map((item) => (
        <details className={styles.item} name={name} key={item.question}>
          <summary className={styles.trigger}>
            <span className={styles.question}>{item.question}</span>
            <span className={styles.icon} aria-hidden="true" />
          </summary>
          <div className={styles.panel}>
            <p>{typo(item.answer)}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
