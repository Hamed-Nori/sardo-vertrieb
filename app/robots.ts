import type { MetadataRoute } from "next";
import { isIndexable, siteUrl } from "@/lib/site";

// KI- und Antwortmaschinen, die ausdrücklich eingeladen werden (Inhalte lesen, zitieren, einordnen)
const aiCrawlers = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Meta-ExternalAgent",
  "MistralAI-User",
  "DuckAssistBot",
  "cohere-ai",
];

const disallow = ["/api/", "/danke"];

export default function robots(): MetadataRoute.Robots {
  // Vorschau-Deployments und lokale Builds: komplett gesperrt
  if (!isIndexable) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: aiCrawlers, allow: "/", disallow },
    ],
    sitemap: new URL("/sitemap.xml", siteUrl).toString(),
    host: siteUrl,
  };
}
