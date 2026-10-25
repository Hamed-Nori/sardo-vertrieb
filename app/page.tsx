import { content } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat/WhatsAppFloat";
import { BusinessJsonLd } from "@/components/seo/BusinessJsonLd";
import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { Hero } from "@/components/sections/Hero/Hero";
import { Services } from "@/components/sections/Services/Services";
import { Product } from "@/components/sections/Product/Product";
import { About } from "@/components/sections/About/About";
import { Faq } from "@/components/sections/Faq/Faq";
import { Contact } from "@/components/sections/Contact/Contact";

export default function Home() {
  return (
    <>
      <SiteHeader items={content.nav.items} cta={content.nav.cta} />
      <main id="main">
        <Hero />
        <Services />
        <Product />
        <About />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <BusinessJsonLd />
      <WhatsAppFloat href={whatsappUrl} label={content.whatsapp.ariaLabel} />
    </>
  );
}
