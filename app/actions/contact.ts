"use server";

import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";
import { ContactSchema } from "@/lib/validators";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export type ContactActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export async function submitContact(
  _prev: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  // 1. Validate
  const raw = Object.fromEntries(formData.entries());
  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Veuillez corriger les erreurs du formulaire.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  // 2. Honeypot — bot
  if (parsed.data.website) {
    return { ok: true, message: "Message envoyé." }; // silent success
  }

  // 3. Rate limit (5 req / min / IP)
  const h = headers();
  const ip = getClientIp(h);
  const rl = rateLimit(`contact:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return {
      ok: false,
      message: "Trop de tentatives. Réessayez dans une minute.",
    };
  }

  // 4. Insert via service-role (bypasses RLS for trusted server insert)
  const supabase = createAdminClient();
  const { error } = await supabase.from("leads").insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    insurance_type: parsed.data.insurance_type ?? null,
    message: parsed.data.message,
    ip_address: ip,
    user_agent: h.get("user-agent") ?? null,
  });

  if (error) {
    console.error("[contact] insert failed:", error);
    return {
      ok: false,
      message: "Erreur serveur. Réessayez ou écrivez-nous directement.",
    };
  }

  // TODO: send notification email via Resend (uncomment after wiring RESEND_API_KEY)
  // await sendLeadNotification(parsed.data);

  return {
    ok: true,
    message: "Message envoyé. Nous revenons vers vous sous 24h.",
  };
}
