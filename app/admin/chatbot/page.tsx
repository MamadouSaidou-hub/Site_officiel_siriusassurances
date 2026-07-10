import { createClient } from "@/lib/supabase/server";
import { toggleChatFlag, deleteChatLog } from "@/app/actions/chat-logs";
import { Flag, Trash2 } from "lucide-react";

export const dynamic = "force-dynamic";

function startOfToday(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function ChatbotAdminPage({
  searchParams,
}: {
  searchParams: { filter?: string };
}) {
  const supabase = createClient();
  const onlyFlagged = searchParams.filter === "flagged";

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
  const isSuperadmin = !!me?.is_superadmin;

  // Stats
  const [{ count: total }, { count: flaggedCount }, { count: todayCount }] =
    await Promise.all([
      supabase.from("chat_logs").select("*", { count: "exact", head: true }),
      supabase
        .from("chat_logs")
        .select("*", { count: "exact", head: true })
        .eq("flagged", true),
      supabase
        .from("chat_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", startOfToday()),
    ]);

  let query = supabase
    .from("chat_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  if (onlyFlagged) query = query.eq("flagged", true);
  const { data: logs } = await query;

  const fmt = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="px-8 py-10 lg:px-12">
      <h1 className="text-2xl font-extrabold text-sirius-text">Chatbot</h1>
      <p className="mt-1 text-sm text-sirius-text-dim">
        Supervision des conversations de Sirius Assist.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <Stat label="Échanges (total)" value={total ?? 0} />
        <Stat label="Aujourd'hui" value={todayCount ?? 0} />
        <Stat label="Signalés" value={flaggedCount ?? 0} accent />
      </div>

      {/* Filtres */}
      <div className="mt-6 flex gap-2">
        <FilterLink active={!onlyFlagged} href="/admin/chatbot">
          Tous
        </FilterLink>
        <FilterLink active={onlyFlagged} href="/admin/chatbot?filter=flagged">
          Signalés
        </FilterLink>
      </div>

      {/* Liste */}
      <div className="mt-4 space-y-3">
        {logs?.map((log) => (
          <div
            key={log.id}
            className={`rounded-2xl border p-4 ${
              log.flagged
                ? "border-red-400/40 bg-red-500/5"
                : "border-sirius-border bg-sirius-surface"
            }`}
          >
            <div className="mb-2 flex items-center justify-between gap-3">
              <span className="text-[11px] text-sirius-text-mute">
                {fmt.format(new Date(log.created_at))} · session{" "}
                {log.session_id?.slice(0, 8) ?? "—"}
              </span>
              <div className="flex items-center gap-3">
                <form action={toggleChatFlag.bind(null, log.id, !log.flagged)}>
                  <button
                    type="submit"
                    className={`inline-flex items-center gap-1 text-xs font-semibold ${
                      log.flagged
                        ? "text-red-400 hover:text-red-300"
                        : "text-sirius-text-mute hover:text-sirius-gold"
                    }`}
                    title={log.flagged ? "Retirer le signalement" : "Signaler"}
                  >
                    <Flag size={13} />
                    {log.flagged ? "Signalé" : "Signaler"}
                  </button>
                </form>
                {isSuperadmin && (
                  <form action={deleteChatLog.bind(null, log.id)}>
                    <button
                      type="submit"
                      className="text-red-400 hover:text-red-300"
                      title="Supprimer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </form>
                )}
              </div>
            </div>
            <p className="text-sm font-semibold text-sirius-text">
              <span className="text-sirius-gold">Q :</span> {log.question}
            </p>
            <p className="mt-1.5 whitespace-pre-wrap text-sm text-sirius-text-dim">
              <span className="font-semibold text-sirius-text-mute">R :</span>{" "}
              {log.answer ?? "—"}
            </p>
          </div>
        ))}
        {logs?.length === 0 && (
          <p className="rounded-2xl border border-sirius-border bg-sirius-surface px-6 py-12 text-center text-sm text-sirius-text-mute">
            {onlyFlagged
              ? "Aucun échange signalé."
              : "Aucune conversation pour le moment."}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-sirius-border bg-sirius-surface p-5">
      <p
        className={`text-2xl font-extrabold ${
          accent ? "text-red-400" : "text-sirius-gold"
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs text-sirius-text-dim">{label}</p>
    </div>
  );
}

function FilterLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={`rounded-full px-4 py-1.5 text-xs font-semibold ${
        active
          ? "bg-sirius-gold text-sirius-bg"
          : "border border-sirius-border text-sirius-text-dim hover:text-sirius-text"
      }`}
    >
      {children}
    </a>
  );
}
