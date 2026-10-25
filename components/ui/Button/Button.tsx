import Link from "next/link";
import styles from "./Button.module.css";

type CommonProps = {
  variant: "primary" | "secondary" | "whatsapp";
  size?: "default" | "compact";
  block?: boolean;
  className?: string;
  children: React.ReactNode;
};

type LinkProps = CommonProps & { href: string } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;
type ButtonProps = CommonProps & { href?: undefined } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button(props: LinkProps | ButtonProps) {
  const { variant, size = "default", block, className, children, ...rest } = props;
  const classes = [
    styles.button,
    styles[variant],
    size === "compact" && styles.compact,
    block && styles.block,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as LinkProps;
    // Sprungmarken und externe Ziele bleiben einfache Anker
    if (href.startsWith("#") || href.startsWith("https://")) {
      return (
        <a className={classes} href={href} {...anchorProps}>
          {children}
        </a>
      );
    }
    return (
      <Link className={classes} href={href} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as Omit<ButtonProps, keyof CommonProps>;
  return (
    <button className={classes} type={type} {...buttonProps}>
      {children}
    </button>
  );
}

export function ButtonGroup({ children, ...rest }: { children: React.ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={styles.group} {...rest}>
      {children}
    </div>
  );
}
