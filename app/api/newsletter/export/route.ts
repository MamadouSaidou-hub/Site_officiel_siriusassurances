import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const supabase = createClient();

  // Defense in depth: explicit admin gate (RLS would also return no rows).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();
  if (!profile?.is_admin) {
    return new Response("Forbidden", { status: 403 });
  }

  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, status, created_at, unsubscribed_at, unsubscribe_token")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 403 });
  }

  const origin = new URL(request.url).origin;

  const rows = [
    ["email", "status", "created_at", "unsubscribed_at", "unsubscribe_url"],
    ...(data ?? []).map((s) => [
      s.email,
      s.status,
      s.created_at,
      s.unsubscribed_at ?? "",
      `${origin}/newsletter/unsubscribe?token=${s.unsubscribe_token}`,
    ]),
  ];

  const csv = rows
    .map((r) =>
      r
        .map((v) => {
          const s = String(v ?? "");
          return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
        })
        .join(",")
    )
    .join("\n");

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="newsletter-${
        new Date().toISOString().split("T")[0]
      }.csv"`,
    },
  });
}
