import { createClient } from "@/lib/supabase/server";
import { updateLead, deleteLead } from "@/app/actions/leads";
import { Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: { status?: string; q?: string };
}) {
  const supabase = createClient();
  let q = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (searchParams.status && STATUSES.includes(searchParams.status as any)) {
    q = q.eq("status", searchParams.status as any);
  }
  if (searchParams.q) {
    q = q.or(`name.ilike.%${searchParams.q}%,email.ilike.%${searchParams.q}%`);
  }

  const { data: leads } = await q;

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-sirius-text">Leads</h1>
          <p className="mt-1 text-sm text-sirius-text-dim">
            {leads?.length ?? 0} résultat(s)
          </p>
        </div>
        <form className="flex flex-wrap gap-2">
          <input
            name="q"
            defaultValue={searchParams.q}
            placeholder="Rechercher nom ou email..."
            className="rounded-lg border border-sirius-border bg-sirius-surface px-3 py-2 text-sm text-sirius-text outline-none"
          />
          <select
            name="status"
            defaultValue={searchParams.status ?? ""}
            className="rounded-lg border border-sirius-border bg-sirius-surface px-3 py-2 text-sm text-sirius-text outline-none"
          >
            <option value="">Tous les statuts</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-sirius-gold px-4 py-2 text-sm font-bold text-sirius-bg"
          >
            Filtrer
          </button>
        </form>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-sirius-border bg-sirius-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sirius-border text-xs uppercase tracking-wider text-sirius-text-mute">
            <tr>
              <Th>Date</Th>
              <Th>Nom</Th>
              <Th>Email</Th>
              <Th>Téléphone</Th>
              <Th>Type</Th>
              <Th>Statut</Th>
              <Th>Notes</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sirius-border">
            {leads?.map((l) => (
              <tr key={l.id} className="align-top">
                <Td>
                  <span className="whitespace-nowrap text-xs text-sirius-text-dim">
                    {new Date(l.created_at).toLocaleString("fr-FR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </span>
                </Td>
                <Td className="font-semibold">{l.name}</Td>
                <Td>
                  <a
                    href={`mailto:${l.email}`}
                    className="text-sirius-gold hover:underline"
                  >
                    {l.email}
                  </a>
                  <div className="mt-1 max-w-[220px] truncate text-xs text-sirius-text-mute">
                    {l.message}
                  </div>
                </Td>
                <Td>{l.phone ?? "—"}</Td>
                <Td className="text-xs">{l.insurance_type ?? "—"}</Td>
                <Td>
                  <form action={updateLead.bind(null, l.id)} className="space-y-2">
                    <select
                      name="status"
                      defaultValue={l.status}
                      className="w-full rounded-lg border border-sirius-border bg-sirius-bg px-2 py-1.5 text-xs text-sirius-text"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <textarea
                      name="notes"
                      defaultValue={l.notes ?? ""}
                      placeholder="Notes internes..."
                      rows={2}
                      className="w-full resize-none rounded-lg border border-sirius-border bg-sirius-bg px-2 py-1.5 text-xs text-sirius-text"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-sirius-gold/15 px-2 py-1 text-[11px] font-bold text-sirius-gold hover:bg-sirius-gold/25"
                    >
                      Enregistrer
                    </button>
                  </form>
                </Td>
                <Td>—</Td>
                <Td>
                  <form action={deleteLead.bind(null, l.id)}>
                    <button
                      type="submit"
                      className="text-red-400 hover:text-red-300"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </form>
                </Td>
              </tr>
            ))}
            {leads?.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-sm text-sirius-text-mute"
                >
                  Aucun lead trouvé.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 font-bold">{children}</th>;
}
function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <td className={`px-4 py-3 text-sirius-text ${className}`}>{children}</td>;
}
