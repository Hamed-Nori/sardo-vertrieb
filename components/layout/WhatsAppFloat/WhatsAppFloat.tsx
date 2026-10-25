"use client";

import { useEffect, useState } from "react";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon/WhatsAppIcon";
import styles from "./WhatsAppFloat.module.css";

type Props = { href: string; label: string };

/** Schwebender WhatsApp-Button; sichtbar, sobald der Hero (#top) aus dem Bild gescrollt ist */
export function WhatsAppFloat({ href, label }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(!entry.isIntersecting));
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      className={visible ? `${styles.float} ${styles.visible}` : styles.float}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      data-whatsapp-float
    >
      <WhatsAppIcon className={styles.icon} />
    </a>
  );
}
