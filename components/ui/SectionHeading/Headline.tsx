import type { Headline as HeadlineData } from "@/types/content";

/** Zweistimmige Headline: Text + kursiver Akzent-Halbsatz */
export function Headline({ title }: { title: HeadlineData }) {
  return (
    <>
      {title.text}
      {title.accent && (
        <>
          {" "}
          <em className="accent">{title.accent}</em>
        </>
      )}
    </>
  );
}
