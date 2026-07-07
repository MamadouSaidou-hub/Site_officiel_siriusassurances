import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteArticle, setPublished } from "@/app/actions/news";
import { Plus, Edit2, Trash2, Send, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewsListPage() {
  const supabase = createClient();
  const { data: articles } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("is_superadmin")
        .eq("id", user.id)
        .single()
    : { data: null };
  const canPublish = !!profile?.is_superadmin;

  return (
    <div className="px-8 py-10 lg:px-12">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-sirius-text">Actualités</h1>
          <p className="mt-1 text-sm text-sirius-text-dim">
            {articles?.length ?? 0} article(s)
          </p>
        </div>
        <Link
          href="/admin/news/new"
          className="inline-flex items-center gap-2 rounded-lg bg-sirius-gold px-4 py-2 text-sm font-bold text-sirius-bg"
        >
          <Plus size={14} />
          Nouvel article
        </Link>
      </div>

      <div className="overflow-hidden rounded-2xl border border-sirius-border bg-sirius-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sirius-border text-xs uppercase tracking-wider text-sirius-text-mute">
            <tr>
              <th className="px-4 py-3 font-bold">Titre</th>
              <th className="px-4 py-3 font-bold">Slug</th>
              <th className="px-4 py-3 font-bold">Tag</th>
              <th className="px-4 py-3 font-bold">Statut</th>
              <th className="px-4 py-3 font-bold">MAJ</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sirius-border">
            {articles?.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-semibold text-sirius-text">
                  {a.title}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-sirius-text-dim">
                  /{a.slug}
                </td>
                <td className="px-4 py-3 text-xs text-sirius-text-dim">
                  {a.tag ?? "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                      a.published
                        ? "bg-green-500/15 text-green-400"
                        : "bg-sirius-text-mute/15 text-sirius-text-mute"
                    }`}
                  >
                    {a.published ? "publié" : "brouillon"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-sirius-text-dim">
                  {new Date(a.updated_at).toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {canPublish && (
                      <form action={setPublished.bind(null, a.id, !a.published)}>
                        <button
                          type="submit"
                          className={
                            a.published
                              ? "text-sirius-text-mute hover:text-sirius-text"
                              : "text-green-400 hover:text-green-300"
                          }
                          title={a.published ? "Dépublier" : "Publier"}
                        >
                          {a.published ? <EyeOff size={14} /> : <Send size={14} />}
                        </button>
                      </form>
                    )}
                    <Link
                      href={`/admin/news/${a.id}/edit`}
                      className="text-sirius-gold hover:text-yellow-300"
                      title="Éditer"
                    >
                      <Edit2 size={14} />
                    </Link>
                    <form action={deleteArticle.bind(null, a.id)}>
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
            {articles?.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-sm text-sirius-text-mute"
                >
                  Aucun article. Cliquez sur "Nouvel article" pour commencer.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
