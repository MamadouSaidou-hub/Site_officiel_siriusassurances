"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { NewsletterSchema } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export type NewsletterState = { ok: boolean; message: string };

export async function subscribeNewsletter(
  _prev: NewsletterState,
  formData: FormData
): Promise<NewsletterState> {
  const parsed = NewsletterSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Email invalide." };
  }
  if (parsed.data.website) return { ok: true, message: "Inscrit." };

  const ip = getClientIp(headers());
  if (!rateLimit(`newsletter:${ip}`, { max: 5, windowMs: 60_000 }).ok) {
    return { ok: false, message: "Trop de tentatives. Réessayez plus tard." };
  }

  const supabase = createAdminClient();

  // Upsert by email — already-subscribed reactivates if needed
  const { error } = await supabase
    .from("newsletter_subscribers")
    .upsert(
      { email: parsed.data.email, status: "active", unsubscribed_at: null },
      { onConflict: "email" }
    );

  if (error) {
    console.error("[newsletter] upsert failed:", error);
    return { ok: false, message: "Erreur. Réessayez." };
  }

  return { ok: true, message: "Merci ! Vous êtes bien inscrit(e)." };
}
