import styles from "./Eyebrow.module.css";

type Props = { onPanel?: boolean; children: React.ReactNode } & React.HTMLAttributes<HTMLParagraphElement>;

export function Eyebrow({ onPanel, children, ...rest }: Props) {
  return (
    <p className={onPanel ? `${styles.eyebrow} ${styles.onPanel}` : styles.eyebrow} {...rest}>
      {children}
    </p>
  );
}
