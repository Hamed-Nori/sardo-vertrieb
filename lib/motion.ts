"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// = Motion-Tokens aus tokens.css (docs/06)
export const motion = { dur: 0.7, ease: "power2.out", y: 24, stagger: 0.08 } as const;

export const motionQueries = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 992px)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
