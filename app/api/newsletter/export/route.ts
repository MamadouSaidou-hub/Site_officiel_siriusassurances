import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select("email, status, created_at, unsubscribed_at")
    .order("created_at", { ascending: false });

  if (error) {
    return new Response(error.message, { status: 403 });
  }

  const rows = [
    ["email", "status", "created_at", "unsubscribed_at"],
    ...(data ?? []).map((s) => [
      s.email,
      s.status,
      s.created_at,
      s.unsubscribed_at ?? "",
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
