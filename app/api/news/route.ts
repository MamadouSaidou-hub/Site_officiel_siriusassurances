import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// ISR-style cache (60s) — revalidates on publish via revalidatePath in actions
export const revalidate = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? 10), 50);

  const supabase = createClient();
  const { data, error } = await supabase
    .from("news_articles")
    .select("id, slug, title, excerpt, cover_url, tag, published_at")
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ articles: data ?? [] });
}
