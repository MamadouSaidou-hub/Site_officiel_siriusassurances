"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { removeFromBucket } from "@/lib/supabase/storage";
import { PartnerSchema } from "@/lib/validators";

export type PartnerActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  logoUrl?: string;
  logoRemoved?: boolean;
};

const LOGO_BUCKET = "partner-logos";

/** Upload a partner logo — returns the public URL. */
async function uploadLogo(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Logo trop lourd (max 2MB).");
  }
  if (
    !["image/jpeg", "image/png", "image/webp", "image/svg+xml"].includes(
      file.type
    )
  ) {
    throw new Error("Format invalide (jpg, png, webp, svg uniquement).");
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "png";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Upload échoué : ${error.message}`);

  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createPartner(
  _prev: PartnerActionState,
  formData: FormData
): Promise<PartnerActionState> {
  const logoFile = formData.get("logo") as File | null;
  formData.delete("logo");

  let logoUrl: string | null = null;
  try {
    if (logoFile && logoFile.size > 0) logoUrl = await uploadLogo(logoFile);
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }

  const parsed = PartnerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { error } = await supabase.from("partners").insert({
    name: parsed.data.name,
    website: parsed.data.website ?? null,
    logo_url: logoUrl,
    sort_order: parsed.data.sort_order,
  });

  if (error) return { ok: false, message: error.message };

  // No redirect: the add form lives on /admin/partners, and redirecting to the
  // same route makes useFormState's state undefined on re-render. Revalidate so
  // the list below refreshes, and return a success state instead.
  revalidatePath("/admin/partners");
  revalidatePath("/");
  return { ok: true, message: "Partenaire ajouté." };
}

export async function updatePartner(
  id: string,
  _prev: PartnerActionState,
  formData: FormData
): Promise<PartnerActionState> {
  const logoFile = formData.get("logo") as File | null;
  formData.delete("logo");

  let logoUrl: string | undefined;
  try {
    if (logoFile && logoFile.size > 0) {
      const url = await uploadLogo(logoFile);
      logoUrl = url ?? undefined;
    }
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }

  const parsed = PartnerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const removeLogo = formData.get("remove_logo") === "true";

  const supabase = createClient();
  const { data: existing } = await supabase
    .from("partners")
    .select("logo_url")
    .eq("id", id)
    .single();

  const { error } = await supabase
    .from("partners")
    .update({
      name: parsed.data.name,
      website: parsed.data.website ?? null,
      sort_order: parsed.data.sort_order,
      ...(logoUrl !== undefined
        ? { logo_url: logoUrl }
        : removeLogo
        ? { logo_url: null }
        : {}),
    })
    .eq("id", id);

  if (error) return { ok: false, message: error.message };

  // Clean up the replaced/removed logo file.
  const oldLogo = existing?.logo_url;
  if ((logoUrl !== undefined || removeLogo) && oldLogo && oldLogo !== logoUrl) {
    await removeFromBucket(LOGO_BUCKET, oldLogo);
  }

  revalidatePath("/admin/partners");
  revalidatePath(`/admin/partners/${id}/edit`);
  revalidatePath("/");
  return {
    ok: true,
    message: "Partenaire mis à jour.",
    logoUrl: logoUrl ?? parsed.data.logo_url,
    logoRemoved: removeLogo && logoUrl === undefined,
  };
}

export async function deletePartner(id: string): Promise<void> {
  const supabase = createClient();

  const { data: existing } = await supabase
    .from("partners")
    .select("logo_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("partners").delete().eq("id", id);
  if (error) {
    console.error("[deletePartner] delete failed:", error);
    return;
  }

  await removeFromBucket(LOGO_BUCKET, existing?.logo_url);

  revalidatePath("/admin/partners");
  revalidatePath("/");
}
