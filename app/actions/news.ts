"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NewsArticleSchema } from "@/lib/validators";

export type NewsActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
};

const COVER_BUCKET = "article-covers";

/** Upload a cover image — returns the public URL. */
async function uploadCover(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image trop lourde (max 5MB).");
  }
  if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    throw new Error("Format image invalide (jpg, png, webp uniquement).");
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(COVER_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Upload échoué : ${error.message}`);

  const { data } = supabase.storage.from(COVER_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createArticle(
  _prev: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const coverFile = formData.get("cover") as File | null;
  formData.delete("cover");

  let coverUrl: string | null = null;
  try {
    if (coverFile && coverFile.size > 0) coverUrl = await uploadCover(coverFile);
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }

  const parsed = NewsArticleSchema.safeParse({
    ...Object.fromEntries(formData),
    cover_url: coverUrl || formData.get("cover_url") || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("news_articles").insert({
    slug: parsed.data.slug,
    title: parsed.data.title,
    excerpt: parsed.data.excerpt || null,
    content: parsed.data.content || null,
    cover_url: coverUrl,
    tag: parsed.data.tag || null,
    published: parsed.data.published,
    published_at: parsed.data.published ? new Date().toISOString() : null,
    author_id: user?.id ?? null,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function updateArticle(
  id: string,
  _prev: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const coverFile = formData.get("cover") as File | null;
  formData.delete("cover");

  let coverUrl: string | undefined;
  try {
    if (coverFile && coverFile.size > 0) {
      const url = await uploadCover(coverFile);
      coverUrl = url ?? undefined;
    }
  } catch (e) {
    return { ok: false, message: (e as Error).message };
  }

  const parsed = NewsArticleSchema.safeParse({
    ...Object.fromEntries(formData),
    cover_url: coverUrl || formData.get("cover_url") || "",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Données invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const supabase = createClient();

  // Detect publish state change to set published_at
  const { data: existing } = await supabase
    .from("news_articles")
    .select("published, published_at")
    .eq("id", id)
    .single();

  const becamePublished =
    parsed.data.published && existing && !existing.published;

  const { error } = await supabase
    .from("news_articles")
    .update({
      slug: parsed.data.slug,
      title: parsed.data.title,
      excerpt: parsed.data.excerpt || null,
      content: parsed.data.content || null,
      ...(coverUrl !== undefined ? { cover_url: coverUrl } : {}),
      tag: parsed.data.tag || null,
      published: parsed.data.published,
      published_at: becamePublished
        ? new Date().toISOString()
        : existing?.published_at ?? null,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}/edit`);
  return { ok: true, message: "Article mis à jour." };
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("news_articles").delete().eq("id", id);
  if (error) {
    console.error("[deleteArticle] delete failed:", error);
    return;
  }
  revalidatePath("/admin/news");
}
