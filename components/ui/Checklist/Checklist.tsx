import styles from "./Checklist.module.css";

type Props = { items: string[] } & React.HTMLAttributes<HTMLUListElement>;

export function Checklist({ items, ...rest }: Props) {
  return (
    <ul className={styles.list} {...rest}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
