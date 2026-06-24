"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export type UsersState = {
  ok: boolean;
  message: string;
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

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

/** Create a new admin user (email + password) — superadmin only. */
export async function createAdminUser(
  _prev: UsersState,
  formData: FormData
): Promise<UsersState> {
  const { isSuperadmin } = await getCaller();
  if (!isSuperadmin) return { ok: false, message: "Réservé au superadmin." };

  const email = formData.get("email")?.toString().trim().toLowerCase() ?? "";
  const password = formData.get("password")?.toString() ?? "";
  const name = formData.get("full_name")?.toString().trim() ?? "";

  if (!EMAIL_RE.test(email)) {
    return { ok: false, message: "Email invalide." };
  }
  if (password.length < 8) {
    return { ok: false, message: "Mot de passe : 8 caractères minimum." };
  }

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: name ? { full_name: name } : undefined,
  });
  if (error) return { ok: false, message: error.message };

  // Ensure the profile exists, is named, and is flagged admin (not superadmin).
  const { error: profileError } = await admin.from("profiles").upsert({
    id: data.user.id,
    email,
    full_name: name || null,
    is_admin: true,
    is_superadmin: false,
  });
  if (profileError) return { ok: false, message: profileError.message };

  revalidatePath("/admin/users");
  return { ok: true, message: `Admin créé : ${email}` };
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
