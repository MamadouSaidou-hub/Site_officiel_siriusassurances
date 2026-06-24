"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { ok: boolean; message: string };

/** Update the admin's display name (RLS: self update on profiles). */
export async function updateName(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const name = formData.get("full_name")?.toString().trim() ?? "";
  if (name.length < 2) return { ok: false, message: "Nom trop court (min 2)." };
  if (name.length > 120) return { ok: false, message: "Nom trop long." };

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Session expirée. Reconnectez-vous." };

  const { error } = await supabase
    .from("profiles")
    .update({ full_name: name })
    .eq("id", user.id);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/admin/profile");
  return { ok: true, message: "Nom mis à jour." };
}

/** Change the admin's password after verifying the current one. */
export async function changePassword(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const current = formData.get("current_password")?.toString() ?? "";
  const next = formData.get("new_password")?.toString() ?? "";
  const confirm = formData.get("confirm_password")?.toString() ?? "";

  if (next.length < 8) {
    return {
      ok: false,
      message: "Le nouveau mot de passe doit faire au moins 8 caractères.",
    };
  }
  if (next !== confirm) {
    return { ok: false, message: "La confirmation ne correspond pas." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return { ok: false, message: "Session expirée. Reconnectez-vous." };
  }

  // Re-authenticate to confirm the current password.
  const { error: reauthError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: current,
  });
  if (reauthError) {
    return { ok: false, message: "Mot de passe actuel incorrect." };
  }

  const { error } = await supabase.auth.updateUser({ password: next });
  if (error) return { ok: false, message: error.message };

  return { ok: true, message: "Mot de passe mis à jour." };
}
