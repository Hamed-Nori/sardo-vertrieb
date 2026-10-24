import type { Headline as HeadlineData } from "@/types/content";
import { Eyebrow } from "../Eyebrow/Eyebrow";
import { Headline } from "./Headline";
import styles from "./SectionHeading.module.css";

type Props = {
  eyebrow: string;
  title: HeadlineData;
  id: string;
  as?: "h1" | "h2";
  /** center = Section-Kopf (Leistungen, FAQ); left = Kopf innerhalb eines Splits */
  align?: "left" | "center";
  eyebrowOnPanel?: boolean;
  className?: string;
  /** Inhalte nach der Headline (Lead, Text …) */
  children?: React.ReactNode;
} & Omit<React.HTMLAttributes<HTMLElement>, "title" | "id">;

export function SectionHeading({
  eyebrow,
  title,
  id,
  as: Heading = "h2",
  align = "left",
  eyebrowOnPanel,
  className,
  children,
  ...rest
}: Props) {
  const Wrapper = align === "center" ? "header" : "div";
  const classes = [align === "center" && `${styles.head} ${styles.center}`, className].filter(Boolean).join(" ");
  return (
    <Wrapper className={classes || undefined} {...rest}>
      <Eyebrow onPanel={eyebrowOnPanel}>{eyebrow}</Eyebrow>
      <Heading className={styles.title} id={id}>
        <Headline title={title} />
      </Heading>
      {children}
    </Wrapper>
  );
}

export function Lead({ children }: { children: React.ReactNode }) {
  return <p className={styles.lead}>{children}</p>;
}
