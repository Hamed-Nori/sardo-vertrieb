import data from "@/content/content.de.json";
import type { Content } from "@/types/content";

// Strukturell geprüft: ändert sich die JSON-Struktur, schlägt der Typecheck fehl.
export const content: Content = data;
