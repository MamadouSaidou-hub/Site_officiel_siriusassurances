import { redirect } from "next/navigation";
import { ShieldCheck, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { setAdminFlag, deleteUser } from "@/app/actions/users";
import CreateUserForm from "@/components/admin/CreateUserForm";

export const dynamic = "force-dynamic";

export default async function UsersAdminPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: me } = user
    ? await supabase
        .from("profiles")
        .select("is_superadmin")
        .eq("id", user.id)
        .single()
    : { data: null };

  // Superadmin-only page.
  if (!me?.is_superadmin) redirect("/admin");

  const { data: users } = await supabase
    .from("profiles")
    .select("id, email, full_name, is_admin, is_superadmin, created_at")
    .order("created_at", { ascending: true });

  return (
    <div className="px-8 py-10 lg:px-12">
      <h1 className="text-2xl font-extrabold text-sirius-text">Utilisateurs</h1>
      <p className="mt-1 text-sm text-sirius-text-dim">
        Gestion des comptes admin — réservé au superadmin.
      </p>

      {/* Create */}
      <div className="mt-8 rounded-2xl border border-sirius-border bg-sirius-surface p-6 lg:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-sirius-text-mute">
          Créer un nouvel admin
        </h2>
        <CreateUserForm />
      </div>

      {/* List */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-sirius-border bg-sirius-surface">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sirius-border text-xs uppercase tracking-wider text-sirius-text-mute">
            <tr>
              <th className="px-4 py-3 font-bold">Email</th>
              <th className="px-4 py-3 font-bold">Nom</th>
              <th className="px-4 py-3 font-bold">Rôle</th>
              <th className="px-4 py-3 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sirius-border">
            {users?.map((u) => {
              const isSelf = u.id === user?.id;
              const role = u.is_superadmin
                ? "Superadmin"
                : u.is_admin
                ? "Admin"
                : "—";
              return (
                <tr key={u.id}>
                  <td className="px-4 py-3 font-semibold text-sirius-text">
                    {u.email}
                    {isSelf && (
                      <span className="ml-2 text-[10px] text-sirius-text-mute">
                        (vous)
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sirius-text-dim">
                    {u.full_name ?? "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                        u.is_superadmin
                          ? "bg-sirius-gold/15 text-sirius-gold"
                          : u.is_admin
                          ? "bg-green-500/15 text-green-400"
                          : "bg-sirius-text-mute/15 text-sirius-text-mute"
                      }`}
                    >
                      {role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {u.is_superadmin || isSelf ? (
                      <span className="text-xs text-sirius-text-mute">—</span>
                    ) : (
                      <div className="flex items-center gap-3">
                        <form
                          action={setAdminFlag.bind(null, u.id, !u.is_admin)}
                        >
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1 text-xs font-semibold text-sirius-gold hover:text-yellow-300"
                            title={u.is_admin ? "Rétrograder" : "Promouvoir admin"}
                          >
                            <ShieldCheck size={13} />
                            {u.is_admin ? "Rétrograder" : "Promouvoir"}
                          </button>
                        </form>
                        <form action={deleteUser.bind(null, u.id)}>
                          <button
                            type="submit"
                            className="text-red-400 hover:text-red-300"
                            title="Supprimer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </form>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
