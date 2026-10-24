import { z } from "zod";

// Geteilt von ContactForm (Client) und /api/contact (Server, verbindlich)

export const topics = ["payment", "kosten", "beratung", "sonstiges"] as const;

export const contactFieldsSchema = z.object({
  name: z.string().trim().min(2).max(100),
  company: z.string().trim().min(2).max(150),
  email: z.string().trim().max(254).pipe(z.email()),
  topic: z.enum(topics),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
});

export const contactRequestSchema = contactFieldsSchema.extend({
  website: z.string().max(0), // Honeypot – muss leer sein
  startedAt: z.number(), // Zeitstempel beim Rendern des Formulars
});

export type ContactFields = z.infer<typeof contactFieldsSchema>;
export type ContactField = keyof ContactFields;
export type ContactRequest = z.infer<typeof contactRequestSchema>;

/** Antwort des Route Handlers bei Feldfehlern (400) */
export type ContactErrorResponse = { fieldErrors?: ContactField[] };

/** Mindest-Ausfüllzeit gegen Bots */
export const MIN_FILL_TIME_MS = 3000;
