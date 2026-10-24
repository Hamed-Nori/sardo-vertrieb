import type { InfoItem } from "@/types/content";
import styles from "./InfoList.module.css";

type Props = { items: InfoItem[] } & React.HTMLAttributes<HTMLUListElement>;

export function InfoList({ items, ...rest }: Props) {
  return (
    <ul className={styles.list} {...rest}>
      {items.slice(0, 4).map((item, i) => (
        <li className={styles.item} key={item.title}>
          <span className={styles.index} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className={styles.text}>
            <strong>{item.title}</strong> – {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
