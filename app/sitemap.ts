import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).toString();
  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/impressum"), changeFrequency: "yearly", priority: 0.2 },
    { url: url("/datenschutz"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
