import { z } from "zod";

// Geteilt von ContactForm (Client) und /api/contact (Server, verbindlich)

export const topics = ["payment", "kosten", "beratung", "sonstiges"] as const;

const optionalText = (max: number) => z.string().trim().max(max).optional().or(z.literal(""));

export const contactFieldsSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().max(254).pipe(z.email()),
  // Ziffern, Leerzeichen, + ( ) / - · mindestens 6 Ziffern
  phone: z
    .string()
    .trim()
    .max(30)
    .regex(/^[+()\d\s/-]+$/)
    .refine((value) => value.replace(/\D/g, "").length >= 6),
  company: optionalText(150),
  topic: z.enum(topics).optional().or(z.literal("")),
  message: optionalText(3000),
});

export const contactRequestSchema = contactFieldsSchema.extend({
  privacy: z.literal(true), // Häkchen Datenschutzerklärung – Pflicht
  website: z.string().max(0), // Honeypot – muss leer sein
  startedAt: z.number(), // Zeitstempel beim Rendern des Formulars
});

export type ContactFields = z.infer<typeof contactFieldsSchema>;
export type ContactField = keyof ContactFields;

/** Pflichtfelder in Formular-Reihenfolge */
export const requiredFields = ["name", "email", "phone"] as const satisfies readonly ContactField[];

/** Antwort des Route Handlers bei Feldfehlern (400) */
export type ContactErrorResponse = { fieldErrors?: (ContactField | "privacy")[] };

/** Mindest-Ausfüllzeit gegen Bots */
export const MIN_FILL_TIME_MS = 3000;
