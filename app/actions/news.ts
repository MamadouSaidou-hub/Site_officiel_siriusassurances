"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { removeFromBucket } from "@/lib/supabase/storage";
import { NewsArticleSchema } from "@/lib/validators";

export type NewsActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
  /** Effective cover URL after the action — drives the form preview. */
  coverUrl?: string;
  /** Effective uploaded-video URL after the action — drives the form preview. */
  videoUrl?: string;
  /** True when the cover/video was just removed — hides the preview immediately. */
  coverRemoved?: boolean;
  videoRemoved?: boolean;
};

const COVER_BUCKET = "article-covers";
const VIDEO_BUCKET = "article-videos";

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

/** Upload a short video file — returns the public URL. */
async function uploadVideo(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("Vidéo trop lourde (max 50MB).");
  }
  if (
    !["video/mp4", "video/webm", "video/ogg", "video/quicktime"].includes(
      file.type
    )
  ) {
    throw new Error("Format vidéo invalide (mp4, webm, ogg, mov uniquement).");
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop() || "mp4";
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabase.storage
    .from(VIDEO_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Upload vidéo échoué : ${error.message}`);

  const { data } = supabase.storage.from(VIDEO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function createArticle(
  _prev: NewsActionState,
  formData: FormData
): Promise<NewsActionState> {
  const coverFile = formData.get("cover") as File | null;
  const videoFile = formData.get("video") as File | null;
  formData.delete("cover");
  formData.delete("video");

  let coverUrl: string | null = null;
  let videoUrl: string | null = null;
  try {
    if (coverFile && coverFile.size > 0) coverUrl = await uploadCover(coverFile);
    if (videoFile && videoFile.size > 0) videoUrl = await uploadVideo(videoFile);
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
    video_embed_url: parsed.data.video_embed_url ?? null,
    video_url: videoUrl,
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
  const videoFile = formData.get("video") as File | null;
  formData.delete("cover");
  formData.delete("video");

  let coverUrl: string | undefined;
  let videoUrl: string | undefined;
  try {
    if (coverFile && coverFile.size > 0) {
      const url = await uploadCover(coverFile);
      coverUrl = url ?? undefined;
    }
    if (videoFile && videoFile.size > 0) {
      const url = await uploadVideo(videoFile);
      videoUrl = url ?? undefined;
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

  const removeCover = formData.get("remove_cover") === "true";
  const removeVideo = formData.get("remove_video") === "true";

  const supabase = createClient();

  // Detect publish state change to set published_at + keep old asset URLs for cleanup
  const { data: existing } = await supabase
    .from("news_articles")
    .select("published, published_at, cover_url, video_url")
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
      ...(coverUrl !== undefined
        ? { cover_url: coverUrl }
        : removeCover
        ? { cover_url: null }
        : {}),
      ...(videoUrl !== undefined
        ? { video_url: videoUrl }
        : removeVideo
        ? { video_url: null }
        : {}),
      video_embed_url: parsed.data.video_embed_url ?? null,
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

  // Clean up orphaned files: old cover/video replaced by a new upload or removed.
  const oldCover = existing?.cover_url;
  if ((coverUrl !== undefined || removeCover) && oldCover && oldCover !== coverUrl) {
    await removeFromBucket(COVER_BUCKET, oldCover);
  }
  const oldVideo = existing?.video_url;
  if ((videoUrl !== undefined || removeVideo) && oldVideo && oldVideo !== videoUrl) {
    await removeFromBucket(VIDEO_BUCKET, oldVideo);
  }

  revalidatePath("/admin/news");
  revalidatePath(`/admin/news/${id}/edit`);
  return {
    ok: true,
    message: "Article mis à jour.",
    coverUrl: coverUrl ?? parsed.data.cover_url,
    videoUrl: videoUrl ?? formData.get("video_url")?.toString() ?? undefined,
    coverRemoved: removeCover && coverUrl === undefined,
    videoRemoved: removeVideo && videoUrl === undefined,
  };
}

export async function deleteArticle(id: string): Promise<void> {
  const supabase = createClient();

  // Grab asset URLs before deleting the row so we can clean up Storage.
  const { data: existing } = await supabase
    .from("news_articles")
    .select("cover_url, video_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("news_articles").delete().eq("id", id);
  if (error) {
    console.error("[deleteArticle] delete failed:", error);
    return;
  }

  await removeFromBucket(COVER_BUCKET, existing?.cover_url);
  await removeFromBucket(VIDEO_BUCKET, existing?.video_url);

  revalidatePath("/admin/news");
}
