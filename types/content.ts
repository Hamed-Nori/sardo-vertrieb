// Typen für content/content.de.json (Struktur siehe docs/07-content-structure.md)

export type Link = { label: string; href: string };

/** Text einer einfachen Unterseite (z. B. Dankeseite) */
export type SimplePage = { eyebrow: string; title: string; lead: string };

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
        email: { label: string; required: boolean; errorEmpty: string; errorInvalid: string };
        phone: { label: string; required: boolean; errorEmpty: string; errorInvalid: string };
        company: { label: string; required: boolean; optionalLabel: string };
        topic: {
          label: string;
          required: boolean;
          optionalLabel: string;
          placeholder: string;
          options: { value: string; label: string }[];
        };
        message: { label: string; required: boolean; optionalLabel: string };
        privacy: { label: string; required: boolean; error: string };
      };
      legal: string;
      submit: string;
      status: { demo: string; invalid: string; error: string };
    };
    thanks: SimplePage;
    backgroundImage: Img;
  };
  whatsapp: { number: string; label: string; ariaLabel: string };
  company: {
    owner: string;
    name: string;
    legalForm: string;
    street: string;
    zip: string;
    city: string;
    phone: string;
    phoneHref: string;
    email: string;
    tax: string;
  };
  cookieConsent: {
    title: string;
    text: string;
    privacyLink: string;
    acceptAll: string;
    necessaryOnly: string;
    settings: string;
    save: string;
    alwaysActive: string;
    footerLink: string;
    categories: Record<"necessary" | "statistics" | "marketing", { title: string; text: string }>;
  };
  footer: {
    claim: string;
    columns: { heading: string; links: Link[] }[];
    trademark: string;
    credit: { text: string; link: Link };
  };
};
