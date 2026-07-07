"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, inviteEmailHtml } from "@/lib/email";

export type UsersState = {
  ok: boolean;
  message: string;
  /** Lien d'invitation — renvoyé pour partage manuel si l'email n'a pas pu partir. */
  inviteLink?: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Origine (https://host) déduite des en-têtes de la requête. */
function requestOrigin(): string {
  const h = headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "https";
  return `${proto}://${host}`;
}

/** Caller identity + whether they are a superadmin (session-based). */
async function getCaller() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, isSuperadmin: false };
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_superadmin")
    .eq("id", user.id)
    .single();
  return { user, isSuperadmin: !!profile?.is_superadmin };
}

/**
 * Invite a new user by email — superadmin only.
 * Crée le compte sans mot de passe, attribue le rôle, puis envoie un lien
 * d'invitation (l'utilisateur définit lui-même son mot de passe).
 */
export async function createAdminUser(
  _prev: UsersState,
  formData: FormData
): Promise<UsersState> {
  const { isSuperadmin } = await getCaller();
  if (!isSuperadmin) return { ok: false, message: "Réservé au superadmin." };

  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const name = formData.get("full_name")?.toString().trim() ?? "";
  const role = formData.get("role")?.toString() === "validateur"
    ? "validateur"
    : "manager";

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Email invalide." };
  }

  const admin = createAdminClient();

  // Génère le lien d'invitation (crée le compte s'il n'existe pas).
  const { data, error } = await admin.auth.admin.generateLink({
    type: "invite",
    email,
    options: {
      data: name ? { full_name: name } : undefined,
      redirectTo: `${requestOrigin()}/admin/set-password`,
    },
  });
  if (error || !data.user) {
    return { ok: false, message: error?.message ?? "Création impossible." };
  }

  // Attribue le rôle sur le profil (validateur = superadmin).
  const isValidateur = role === "validateur";
  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: name || null,
    is_admin: true,
    is_superadmin: isValidateur,
  });
  if (profileError) return { ok: false, message: profileError.message };

  // Construit un lien de confirmation vers notre route (verifyOtp) puis la page mot de passe.
  const origin = requestOrigin();
  const inviteUrl =
    `${origin}/auth/confirm?token_hash=${data.properties.hashed_token}` +
    `&type=invite&next=/admin/set-password`;

  const roleLabel = isValidateur ? "Validateur" : "Manager";

  // Envoi de l'email — best effort : si ça échoue, on renvoie le lien à partager.
  try {
    await sendEmail({
      to: email,
      subject: "Votre accès au backoffice Sirius Assurances",
      html: inviteEmailHtml({ inviteUrl, roleLabel }),
    });
  } catch (e) {
    revalidatePath("/admin/users");
    return {
      ok: true,
      message: `Compte ${roleLabel} créé pour ${email}, mais l'email n'a pas pu être envoyé (${(e as Error).message}). Partagez le lien manuellement :`,
      inviteLink: inviteUrl,
    };
  }

  revalidatePath("/admin/users");
  return {
    ok: true,
    message: `Invitation envoyée à ${email} (${roleLabel}).`,
    inviteLink: inviteUrl,
  };
}

/** Promote/demote a user's admin flag — superadmin only. */
export async function setAdminFlag(
  targetId: string,
  makeAdmin: boolean
): Promise<void> {
  const { user, isSuperadmin } = await getCaller();
  if (!isSuperadmin || !user) return;
  if (user.id === targetId) return; // don't change your own role here

  const admin = createAdminClient();
  // Never touch other superadmins via this control.
  const { data: target } = await admin
    .from("profiles")
    .select("is_superadmin")
    .eq("id", targetId)
    .single();
  if (target?.is_superadmin) return;

  const { error } = await admin
    .from("profiles")
    .update({ is_admin: makeAdmin })
    .eq("id", targetId);
  if (error) {
    console.error("[setAdminFlag] failed:", error);
    return;
  }
  revalidatePath("/admin/users");
}

/** Delete a user entirely — superadmin only; never yourself or a superadmin. */
export async function deleteUser(targetId: string): Promise<void> {
  const { user, isSuperadmin } = await getCaller();
  if (!isSuperadmin || !user) return;
  if (user.id === targetId) return;

  const admin = createAdminClient();
  const { data: target } = await admin
    .from("profiles")
    .select("is_superadmin")
    .eq("id", targetId)
    .single();
  if (target?.is_superadmin) return;

  const { error } = await admin.auth.admin.deleteUser(targetId);
  if (error) {
    console.error("[deleteUser] failed:", error);
    return;
  }
  // profiles row cascades via FK (on delete cascade).
  revalidatePath("/admin/users");
}
