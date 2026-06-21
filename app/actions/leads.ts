"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { LeadUpdateSchema } from "@/lib/validators";

export async function updateLead(id: string, formData: FormData): Promise<void> {
  const parsed = LeadUpdateSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    console.error("[updateLead] validation failed:", parsed.error);
    return;
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      status: parsed.data.status,
      notes: parsed.data.notes ?? null,
    })
    .eq("id", id);

  if (error) {
    console.error("[updateLead] update failed:", error);
    return;
  }

  revalidatePath("/admin/leads");
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) {
    console.error("[deleteLead] delete failed:", error);
    return;
  }
  revalidatePath("/admin/leads");
}
