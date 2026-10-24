import Link from "next/link";
import styles from "./TextLink.module.css";

type Props = {
  href: string;
  inline?: boolean;
  arrow?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function TextLink({ href, inline, arrow = true, className, children }: Props) {
  const classes = [styles.link, inline && styles.inline, className].filter(Boolean).join(" ");
  const body = (
    <>
      {children}
      {arrow && !inline && (
        <>
          {" "}
          <span className={styles.arrow} aria-hidden="true">
            →
          </span>
        </>
      )}
    </>
  );
  if (href.startsWith("#")) {
    return (
      <a className={classes} href={href}>
        {body}
      </a>
    );
  }
  return (
    <Link className={classes} href={href}>
      {body}
    </Link>
  );
}
