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

export type UnsubscribeState = { ok: boolean; message: string };

/** Mark a subscriber as unsubscribed using their unguessable token. */
export async function unsubscribeNewsletter(
  _prev: UnsubscribeState,
  formData: FormData
): Promise<UnsubscribeState> {
  const token = formData.get("token")?.toString() ?? "";
  // UUID format guard — avoids hitting the DB with junk.
  const isUuid =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);
  if (!isUuid) {
    return { ok: false, message: "Lien de désinscription invalide." };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .select("email")
    .maybeSingle();

  if (error) {
    console.error("[newsletter] unsubscribe failed:", error);
    return { ok: false, message: "Erreur. Réessayez plus tard." };
  }
  if (!data) {
    return { ok: false, message: "Lien de désinscription invalide ou expiré." };
  }

  return { ok: true, message: "Vous êtes désinscrit(e). À bientôt !" };
}
