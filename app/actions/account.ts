"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type SetPasswordState = { ok: boolean; message: string };

/**
 * Définit le mot de passe de l'utilisateur connecté (flux d'invitation :
 * la session vient d'être ouverte via le lien /auth/confirm).
 */
export async function setOwnPassword(
  _prev: SetPasswordState,
  formData: FormData
): Promise<SetPasswordState> {
  const password = formData.get("password")?.toString() ?? "";
  const confirm = formData.get("confirm")?.toString() ?? "";

  if (password.length < 8) {
    return { ok: false, message: "Mot de passe : 8 caractères minimum." };
  }
  if (password !== confirm) {
    return { ok: false, message: "Les deux mots de passe ne correspondent pas." };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      message: "Session expirée. Rouvrez le lien d'invitation depuis votre email.",
    };
  }

  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { ok: false, message: error.message };

  redirect("/admin");
}
