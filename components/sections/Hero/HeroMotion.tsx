"use client";

import { useRef } from "react";
import { gsap, motion, motionQueries, useGSAP } from "@/lib/motion";

/**
 * Hero-Intro: einmalig nach document.fonts.ready, < 1 s.
 * Optionaler Scroll-Versatz des Bildes nur ≥ 992 px.
 */
export function HeroMotion({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(motionQueries, (context) => {
        const { motion: allowed, desktop } = context.conditions ?? {};
        if (!allowed) return;

        const intro = gsap.timeline({ paused: true, defaults: { ease: motion.ease } });
        intro.from("[data-hero-item]", { autoAlpha: 0, y: 16, duration: motion.dur, stagger: motion.stagger }, 0);
        intro.from("[data-hero-image]", { autoAlpha: 0, scale: desktop ? 1.04 : 1, duration: 1.2 }, 0);

        let active = true;
        document.fonts.ready.then(() => {
          if (active) intro.play();
        });

        if (desktop) {
          gsap.to("[data-hero-media]", {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: "#top", start: "top top", end: "bottom top", scrub: true },
          });
        }
        return () => {
          active = false;
        };
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
