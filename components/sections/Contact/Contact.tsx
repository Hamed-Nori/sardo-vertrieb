import { content } from "@/lib/content";
import { isMailConfigured } from "@/lib/mail";
import { whatsappUrl } from "@/lib/whatsapp";
import { Container } from "@/components/ui/Container/Container";
import { Panel } from "@/components/ui/Panel/Panel";
import { Lead, SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import { Steps } from "@/components/ui/Steps/Steps";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "./ContactForm";
import styles from "./Contact.module.css";

export function Contact() {
  const { contact } = content;
  return (
    <Reveal preset="contact">
      <section className={styles.section} id="kontakt" aria-labelledby="contact-title">
        <Container>
          <Panel
            image={contact.backgroundImage}
            imageSizes="(min-width: 992px) 1100px, 100vw"
            className={styles.contact}
          >
            <SectionHeading eyebrow={contact.eyebrow} title={contact.title} id="contact-title" data-reveal>
              <Lead>{contact.lead}</Lead>
              <p className={styles.text}>{contact.text}</p>
              <Steps items={contact.steps} />
            </SectionHeading>

            {/* Ohne RESEND_API_KEY und CONTACT_TO wird nichts versendet, sondern auf WhatsApp verwiesen */}
            <ContactForm
              form={contact.form}
              demo={!isMailConfigured()}
              whatsappUrl={whatsappUrl}
              data-reveal
              data-contact-form
            />
          </Panel>
        </Container>
      </section>
    </Reveal>
  );
}
