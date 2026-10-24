import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

// Impressum/Datenschutz sind Platzhalter (noindex) und fehlen deshalb vorerst
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: new URL("/", siteUrl).toString(), changeFrequency: "monthly", priority: 1 }];
}
