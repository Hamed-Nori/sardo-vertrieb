"use client";

import { useRef } from "react";
import { gsap, motion, motionQueries, useGSAP } from "@/lib/motion";

// Section-Reveals laut Tabelle in docs/06-motion-guidelines.md
const presets = {
  services: { start: "top 80%", duration: motion.dur },
  product: { start: "top 75%", duration: motion.dur },
  about: { start: "top 75%", duration: motion.dur },
  faq: { start: "top 80%", duration: 0.6 },
  contact: { start: "top 75%", duration: motion.dur },
} as const;

type Props = { preset: keyof typeof presets; children: React.ReactNode };

/**
 * Animiert [data-reveal]-Kinder einmalig beim Einscrollen. Server-HTML bleibt
 * immer sichtbar; Ausgangszustände setzt erst gsap.from() im Client.
 */
export function Reveal({ preset, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries, (context) => {
        const { motion: allowed, desktop } = context.conditions ?? {};
        if (!allowed) return;
        const { start, duration } = presets[preset];
        const tweens: gsap.core.Tween[] = [];

        gsap.utils.toArray<HTMLElement>("[data-reveal]", ref.current).forEach((el) => {
          const siblings = Array.from(el.parentElement?.children ?? []).filter((c) => c.hasAttribute("data-reveal"));
          const index = Math.max(0, siblings.indexOf(el));

          // Shift4 One: Bild öffnet sich per clipPath (nur ≥ 992 px)
          if (desktop && el.hasAttribute("data-product-media")) {
            tweens.push(
              gsap.from(el, {
                clipPath: "inset(8% 0% 8% 0% round 20px)",
                duration: 0.9,
                ease: motion.ease,
                clearProps: "clipPath",
                scrollTrigger: { trigger: el, start, once: true },
              }),
            );
            return;
          }

          // Geeignet für: Listeneinträge nacheinander
          if (el.hasAttribute("data-audience")) {
            tweens.push(
              gsap.from(el.querySelectorAll("p, li"), {
                autoAlpha: 0,
                duration: 0.5,
                stagger: 0.05,
                ease: motion.ease,
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }),
            );
            return;
          }

          // Kennzahlen: Werte erscheinen (kein Hochzählen)
          if (el.hasAttribute("data-stats")) {
            tweens.push(
              gsap.from(el.querySelectorAll("[data-stat], p"), {
                autoAlpha: 0,
                y: motion.y,
                duration: 0.6,
                stagger: motion.stagger,
                ease: motion.ease,
                scrollTrigger: { trigger: el, start: "top 85%", once: true },
              }),
            );
            return;
          }

          tweens.push(
            gsap.from(el, {
              autoAlpha: 0,
              y: motion.y,
              duration,
              ease: motion.ease,
              // Kontaktformular folgt dem Textblock 0,1 s später
              delay: el.hasAttribute("data-contact-form") ? 0.1 : (index % 4) * motion.stagger,
              scrollTrigger: { trigger: el, start, once: true },
            }),
          );
        });

        // Tastaturnutzung: noch verborgene Elemente (visibility: hidden) wären nicht
        // fokussierbar – beim ersten Tab werden daher alle Reveals sofort abgeschlossen.
        const finishAll = (event: KeyboardEvent) => {
          if (event.key !== "Tab") return;
          tweens.forEach((tween) => {
            tween.progress(1);
            tween.scrollTrigger?.kill(false, true); // Trigger entfernen, Endzustand behalten
          });
          window.removeEventListener("keydown", finishAll, true);
        };
        window.addEventListener("keydown", finishAll, true);
        return () => window.removeEventListener("keydown", finishAll, true);
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} style={{ display: "contents" }}>
      {children}
    </div>
  );
}
