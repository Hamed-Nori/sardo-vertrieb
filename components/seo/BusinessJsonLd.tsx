import { content } from "@/lib/content";
import { siteUrl } from "@/lib/site";

/** Unternehmensdaten als schema.org – nur echte Angaben aus Impressum und Inhalten */
export function BusinessJsonLd() {
  const { company, meta, hero, services } = content;
  const abs = (path: string) => new URL(path, siteUrl).toString();
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": abs("/#business"),
        name: "Sardo Digital",
        alternateName: company.name,
        description: meta.description,
        url: abs("/"),
        logo: abs("/icon.svg"),
        image: abs(hero.image.src),
        telephone: company.phone,
        email: company.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: company.street,
          postalCode: company.zip,
          addressLocality: company.city,
          addressCountry: "DE",
        },
        founder: { "@type": "Person", name: company.owner, jobTitle: "Inhaber" },
        knowsAbout: services.items.map((item) => item.title),
      },
      {
        "@type": "WebSite",
        "@id": abs("/#website"),
        name: "Sardo Digital",
        url: abs("/"),
        inLanguage: "de-DE",
        publisher: { "@id": abs("/#business") },
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
  );
}
