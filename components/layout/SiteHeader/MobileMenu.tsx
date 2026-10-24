"use client";

import { useEffect, useRef } from "react";
import type { Link } from "@/types/content";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import styles from "./SiteHeader.module.css";

type Props = {
  id: string;
  open: boolean;
  items: Link[];
  cta: Link;
  onNavigate: () => void;
  toggleRef: React.RefObject<HTMLButtonElement | null>;
};

export function MobileMenu({ id, open, items, cta, onNavigate, toggleRef }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Fokus springt beim Öffnen auf den ersten Link
  useEffect(() => {
    if (open) menuRef.current?.querySelector("a")?.focus();
  }, [open]);

  // Tab-Schleife: vom letzten Element zurück zum Menü-Button
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab" || event.shiftKey) return;
    const links = menuRef.current?.querySelectorAll("a");
    if (links && document.activeElement === links[links.length - 1]) {
      event.preventDefault();
      toggleRef.current?.focus();
    }
  };

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest("a")) onNavigate();
  };

  return (
    <div className={styles.menu} id={id} ref={menuRef} hidden={!open} onKeyDown={onKeyDown} onClick={onClick}>
      <Container as="nav" className={styles.menuInner} aria-label="Mobile Navigation">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <a className={styles.menuLink} href={item.href}>
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <Button variant="primary" block href={cta.href}>
          {cta.label}
        </Button>
      </Container>
    </div>
  );
}
