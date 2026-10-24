"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Link } from "@/types/content";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { Wordmark } from "../Wordmark/Wordmark";
import { MobileMenu } from "./MobileMenu";
import styles from "./SiteHeader.module.css";

type Props = { items: Link[]; cta: Link };

/** Header der Landingpage: Scroll-Zustand, Scroll-Spy, mobiles Menü */
export function SiteHeader({ items, cta }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // 1 · Hintergrund nach den ersten 8 px Scroll
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8);
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  // 2 · Scroll-Spy (gleiche rootMargin wie im Prototyp)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const ids = items.map((item) => item.href.slice(1));
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActiveId(ids.includes(entry.target.id) ? entry.target.id : null);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    [...ids, "top"].forEach((id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
    return () => spy.disconnect();
  }, [items]);

  const closeMenu = useCallback((returnFocus: boolean) => {
    setMenuOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // 3 · Menü: Body-Lock, Esc, automatisch schließen ≥ 992 px
  useEffect(() => {
    document.body.classList.toggle("is-menu-open", menuOpen);
    if (!menuOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeMenu(true);
    };
    const desktop = window.matchMedia("(min-width: 992px)");
    const onDesktop = (mq: MediaQueryListEvent) => {
      if (mq.matches) closeMenu(false);
    };
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.body.classList.remove("is-menu-open");
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen, closeMenu]);

  const headerClass = scrolled || menuOpen ? `${styles.header} ${styles.scrolled}` : styles.header;

  return (
    <header className={headerClass}>
      <Container className={styles.inner}>
        <Wordmark />

        <nav className={styles.nav} aria-label="Hauptnavigation">
          <ul className={styles.navList}>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  className={styles.navLink}
                  href={item.href}
                  aria-current={activeId === item.href.slice(1) ? "true" : undefined}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <Button variant="primary" size="compact" className={styles.cta} href={cta.href}>
          {cta.label}
        </Button>

        <button
          ref={toggleRef}
          className={styles.toggle}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="visually-hidden">{menuOpen ? "Menü schließen" : "Menü öffnen"}</span>
          <span className={styles.toggleIcon} aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </Container>

      <MobileMenu
        id="mobile-menu"
        open={menuOpen}
        items={items}
        cta={cta}
        onNavigate={() => closeMenu(false)}
        toggleRef={toggleRef}
      />
    </header>
  );
}
