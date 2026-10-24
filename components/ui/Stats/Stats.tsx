import type { StatItem } from "@/types/content";
import { typo } from "@/lib/typography";
import styles from "./Stats.module.css";

type Props = { items: StatItem[]; note: string } & React.HTMLAttributes<HTMLDivElement>;

export function Stats({ items, note, ...rest }: Props) {
  return (
    <div className={styles.stats} {...rest}>
      <dl className={styles.list}>
        {items.map((item) => (
          <div className={styles.item} key={item.label} data-stat>
            <dt className={styles.label}>{item.label}</dt>
            <dd className={styles.value}>{typo(item.value)}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
