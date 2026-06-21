import { z } from "zod";

export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(120),
  email: z.string().trim().toLowerCase().email("Email invalide").max(160),
  phone: z
    .string()
    .trim()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  insurance_type: z
    .enum([
      "auto_habitation",
      "sante_vie",
      "multirisque_pro",
      "construction",
      "autre",
    ])
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z.string().trim().min(10, "Message trop court (min 10)").max(4000),
  // Honeypot — must be empty
  website: z.string().max(0).optional().or(z.literal("")),
});
export type ContactInput = z.infer<typeof ContactSchema>;

export const NewsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email invalide").max(160),
  website: z.string().max(0).optional().or(z.literal("")),
});
export type NewsletterInput = z.infer<typeof NewsletterSchema>;

export const LoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

export const NewsArticleSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9-]+$/, "Slug: minuscules, chiffres et tirets uniquement"),
  title: z.string().trim().min(3).max(200),
  excerpt: z.string().trim().max(500).optional().or(z.literal("")),
  content: z.string().trim().max(50000).optional().or(z.literal("")),
  cover_url: z
    .string()
    .url()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  tag: z.string().trim().max(60).optional().or(z.literal("")),
  published: z.coerce.boolean().default(false),
});
export type NewsArticleInput = z.infer<typeof NewsArticleSchema>;

export const LeadUpdateSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
});
