import "server-only";
import { createClient } from "./server";

/** Extract the in-bucket object path from a Supabase public URL, or null. */
export function storagePathFromPublicUrl(
  url: string | null | undefined,
  bucket: string
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}

/** Best-effort removal of an orphaned file. Never throws — just logs. */
export async function removeFromBucket(
  bucket: string,
  url: string | null | undefined
): Promise<void> {
  const path = storagePathFromPublicUrl(url, bucket);
  if (!path) return;
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    console.error(`[storage] remove failed (${bucket}/${path}):`, error.message);
  }
}
