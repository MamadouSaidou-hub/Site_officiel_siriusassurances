"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Signale / dé-signale un échange (RLS : admin). */
export async function toggleChatFlag(
  id: string,
  flagged: boolean
): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("chat_logs")
    .update({ flagged })
    .eq("id", id);
  if (error) console.error("[toggleChatFlag] failed:", error);
  revalidatePath("/admin/chatbot");
}

/** Supprime un échange (RLS : superadmin uniquement). */
export async function deleteChatLog(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("chat_logs").delete().eq("id", id);
  if (error) console.error("[deleteChatLog] failed:", error);
  revalidatePath("/admin/chatbot");
}
