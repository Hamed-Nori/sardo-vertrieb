// Typen für content/content.de.json (Struktur siehe docs/07-content-structure.md)

export type Link = { label: string; href: string };

/** Zweistimmige Headline: Text + optionaler kursiver Akzent */
export type Headline = { text: string; accent?: string };

export type Img = {
  src: string;
  alt?: string;
  width: number;
  height: number;
  position?: string;
};

export type ServiceItem = {
  index: string;
  title: string;
  text: string;
  link: Link;
  variant: string;
  image: Img & { alt: string };
};

export type InfoItem = { title: string; text: string };
export type StatItem = { value: string; label: string; verify?: boolean };
export type FaqItem = { question: string; answer: string; verify?: boolean };

export type Content = {
  meta: { title: string; description: string };
  nav: { items: Link[]; cta: Link };
  hero: {
    eyebrow: string;
    title: Headline;
    lead: string;
    checklist: string[];
    primaryCta: Link;
    image: Img & { alt: string };
  };
  services: {
    eyebrow: string;
    title: Headline;
    items: ServiceItem[];
    audience: { label: string; items: string[] };
  };
  product: {
    eyebrow: string;
    title: Headline;
    lead: string;
    info: InfoItem[];
    cta: Link;
    image: Img & { alt: string };
    stats: StatItem[];
    statsNote: string;
  };
  about: {
    eyebrow: string;
    title: Headline;
    greeting: string;
    paragraphs: string[];
    signature: { name: string; role: string };
    cta: Link;
    image: Img & { alt: string };
  };
  faq: {
    eyebrow: string;
    title: Headline;
    items: FaqItem[];
    hint: { text: string; link: Link };
  };
  contact: {
    eyebrow: string;
    title: Headline;
    lead: string;
    text: string;
    steps: string[];
    form: {
      title: string;
      fields: {
        name: { label: string; required: boolean; error: string };
        company: { label: string; required: boolean; error: string };
        email: { label: string; required: boolean; errorEmpty: string; errorInvalid: string };
        topic: {
          label: string;
          required: boolean;
          placeholder: string;
          error: string;
          options: { value: string; label: string }[];
        };
        message: { label: string; required: boolean; optionalLabel: string };
      };
      legal: string;
      submit: string;
      status: { demo: string; invalid: string; success: string; error: string };
    };
    backgroundImage: Img;
  };
  whatsapp: { number: string; label: string; ariaLabel: string };
  footer: {
    claim: string;
    columns: { heading: string; links: Link[] }[];
    trademark: string;
    credit: { text: string; link: Link };
  };
};
