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

/**
 * Suchmaschinen- und KI-Crawler sehen die Seite ohne Animationen, damit kein Inhalt
 * zum Zeitpunkt des Renderns ausgeblendet ist (Server-HTML ist ohnehin vollständig).
 */
export function isCrawler(): boolean {
  return /bot|crawl|spider|slurp|bingpreview|google-inspectiontool|mediapartners|adsbot|facebookexternalhit|preview|perplexity|claude|anthropic|gptbot|chatgpt|oai-searchbot|cohere|mistral/i.test(
    navigator.userAgent,
  );
}

export { gsap, ScrollTrigger, useGSAP };
