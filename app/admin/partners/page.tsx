import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deletePartner } from "@/app/actions/partners";
import PartnerForm from "@/components/admin/PartnerForm";

export const dynamic = "force-dynamic";

export default async function PartnersAdminPage() {
  const supabase = createClient();
  const { data: partners } = await supabase
    .from("partners")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  return (
    <div className="px-8 py-10 lg:px-12">
      <h1 className="text-2xl font-extrabold text-sirius-text">Partenaires</h1>
      <p className="mt-1 text-sm text-sirius-text-dim">
        {partners?.length ?? 0} partenaire(s) — affichés sur la page d'accueil.
      </p>

      {/* Add form */}
      <div className="mt-8 rounded-2xl border border-sirius-border bg-sirius-surface p-6 lg:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-sirius-text-mute">
          Ajouter un partenaire
        </h2>
        <PartnerForm />
      </div>

      {/* List */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-sirius-border bg-sirius-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sirius-border text-xs uppercase tracking-wider text-sirius-text-mute">
            <tr>
              <th className="px-4 py-3 font-bold">Logo</th>
              <th className="px-4 py-3 font-bold">Nom</th>
              <th className="px-4 py-3 font-bold">Site</th>
              <th className="px-4 py-3 font-bold">Ordre</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sirius-border">
            {partners?.map((p) => (
              <tr key={p.id}>
                <td className="px-4 py-3">
                  {p.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.logo_url}
                      alt={p.name}
                      className="h-9 w-auto max-w-[120px] rounded bg-white/5 object-contain p-1"
                    />
                  ) : (
                    <span className="text-xs text-sirius-text-mute">—</span>
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-sirius-text">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-xs text-sirius-text-dim">
                  {p.website ? (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sirius-gold hover:underline"
                    >
                      lien
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-sirius-text-dim">
                  {p.sort_order}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/partners/${p.id}/edit`}
                      className="text-sirius-gold hover:text-yellow-300"
                      title="Éditer"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <form action={deletePartner.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="text-red-400 hover:text-red-300"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {partners?.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-sm text-sirius-text-mute"
                >
                  Aucun partenaire. Ajoutez-en un avec le formulaire ci-dessus.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
