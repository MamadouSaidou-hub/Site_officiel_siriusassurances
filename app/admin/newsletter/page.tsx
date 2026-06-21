import { createClient } from "@/lib/supabase/server";
import { Download } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsletterPage() {
  const supabase = createClient();
  const { data: subs } = await supabase
    .from("newsletter_subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  const active = subs?.filter((s) => s.status === "active").length ?? 0;

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-sirius-text">Newsletter</h1>
          <p className="mt-1 text-sm text-sirius-text-dim">
            {active} abonné(s) actif(s) — {subs?.length ?? 0} total
          </p>
        </div>
        <a
          href="/api/newsletter/export"
          className="inline-flex items-center gap-2 rounded-lg bg-sirius-gold px-4 py-2 text-sm font-bold text-sirius-bg"
        >
          <Download size={14} />
          Exporter CSV
        </a>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sirius-border bg-sirius-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sirius-border text-xs uppercase tracking-wider text-sirius-text-mute">
            <tr>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Statut</th>
              <th className="px-4 py-3 font-bold">Inscrit le</th>
              <th className="px-4 py-3 font-bold">Désinscrit le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sirius-border">
            {subs?.map((s) => (
              <tr key={s.id}>
                <td className="px-4 py-3 font-semibold text-sirius-text">{s.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      s.status === "active"
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-sirius-text-dim">
                  {new Date(s.created_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3 text-xs text-sirius-text-dim">
                  {s.unsubscribed_at
                    ? new Date(s.unsubscribed_at).toLocaleDateString("fr-FR")
                    : "—"}
                </td>
              </tr>
            ))}
            {subs?.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-sm text-sirius-text-mute"
                >
                  Aucun abonné.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
