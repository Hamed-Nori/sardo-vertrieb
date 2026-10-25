import { content } from "@/lib/content";
import { whatsappUrl } from "@/lib/whatsapp";
import { Button } from "../Button/Button";
import { WhatsAppIcon } from "../WhatsAppIcon/WhatsAppIcon";
import styles from "./WhatsAppButton.module.css";

/** WhatsApp-CTA in Markengrün, öffnet den Chat in neuem Fenster */
export function WhatsAppButton(props: React.HTMLAttributes<HTMLAnchorElement>) {
  const { whatsapp } = content;
  return (
    <Button
      variant="whatsapp"
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={whatsapp.ariaLabel}
      {...props}
    >
      <WhatsAppIcon className={styles.icon} />
      {whatsapp.label}
    </Button>
  );
}
