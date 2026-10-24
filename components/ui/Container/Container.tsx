import styles from "./Container.module.css";

type Props = {
  size?: "default" | "narrow";
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLElement>;

export function Container({ size = "default", as: Tag = "div", className, children, ...rest }: Props) {
  const classes = [styles.container, size === "narrow" && styles.narrow, className].filter(Boolean).join(" ");
  return (
    <Tag className={classes} {...rest}>
      {children}
    </Tag>
  );
}
