import styles from "./Steps.module.css";

export function Steps({ items }: { items: string[] }) {
  return (
    <ol className={styles.steps}>
      {items.map((item, i) => (
        <li className={styles.item} key={item}>
          <span className={styles.index} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </span>
          {item}
        </li>
      ))}
    </ol>
  );
}
