import { createClient } from "@/lib/supabase/server";
import { Inbox, Mail, Newspaper, TrendingUp } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = createClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: leadsTotal },
    { count: leadsNew },
    { count: leadsThisWeek },
    { count: subscribers },
    { count: articles },
    { count: published },
    { data: recentLeads },
  ] = await Promise.all([
    supabase.from("leads").select("*", { count: "exact", head: true }),
    supabase.from("leads").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", since),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase.from("news_articles").select("*", { count: "exact", head: true }),
    supabase
      .from("news_articles")
      .select("*", { count: "exact", head: true })
      .eq("published", true),
    supabase
      .from("leads")
      .select("id, name, email, insurance_type, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    leadsTotal: leadsTotal ?? 0,
    leadsNew: leadsNew ?? 0,
    leadsThisWeek: leadsThisWeek ?? 0,
    subscribers: subscribers ?? 0,
    articles: articles ?? 0,
    published: published ?? 0,
    recentLeads: recentLeads ?? [],
  };
}

export default async function DashboardPage() {
  const s = await getStats();

  const cards = [
    {
      Icon: Inbox,
      label: "Leads total",
      value: s.leadsTotal,
      sub: `${s.leadsNew} nouveaux`,
      href: "/admin/leads",
    },
    {
      Icon: TrendingUp,
      label: "Cette semaine",
      value: s.leadsThisWeek,
      sub: "7 derniers jours",
      href: "/admin/leads",
    },
    {
      Icon: Mail,
      label: "Abonnés newsletter",
      value: s.subscribers,
      sub: "Actifs",
      href: "/admin/newsletter",
    },
    {
      Icon: Newspaper,
      label: "Articles",
      value: s.articles,
      sub: `${s.published} publiés`,
      href: "/admin/news",
    },
  ];

  return (
    <div className="px-8 py-10 lg:px-12">
      <h1 className="text-2xl font-extrabold text-sirius-text">Dashboard</h1>
      <p className="mt-1 text-sm text-sirius-text-dim">
        Vue d'ensemble de votre activité commerciale.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map(({ Icon, label, value, sub, href }) => (
          <Link
            key={label}
            href={href}
            className="block rounded-2xl border border-sirius-border bg-sirius-surface p-5 transition-colors hover:border-sirius-gold/30"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
                {label}
              </p>
              <Icon size={18} className="text-sirius-gold" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-sirius-text">{value}</p>
            <p className="mt-1 text-xs text-sirius-text-dim">{sub}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-sirius-border bg-sirius-surface">
        <div className="flex items-center justify-between border-b border-sirius-border px-6 py-4">
          <h2 className="text-sm font-bold text-sirius-text">Derniers leads</h2>
          <Link
            href="/admin/leads"
            className="text-xs font-semibold text-sirius-gold hover:underline"
          >
            Voir tout →
          </Link>
        </div>
        <div className="divide-y divide-sirius-border">
          {s.recentLeads.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-sirius-text-mute">
              Aucun lead pour l'instant.
            </p>
          )}
          {s.recentLeads.map((l) => (
            <Link
              key={l.id}
              href={`/admin/leads?focus=${l.id}`}
              className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/[0.02]"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-sirius-text">
                  {l.name}
                </p>
                <p className="truncate text-xs text-sirius-text-dim">{l.email}</p>
              </div>
              <span className="hidden text-xs text-sirius-text-mute sm:inline">
                {l.insurance_type ?? "—"}
              </span>
              <StatusBadge status={l.status} />
              <span className="hidden text-xs text-sirius-text-mute md:inline">
                {new Date(l.created_at).toLocaleDateString("fr-FR")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    new: "bg-sirius-gold/15 text-sirius-gold",
    contacted: "bg-blue-500/15 text-blue-400",
    qualified: "bg-purple-500/15 text-purple-400",
    converted: "bg-green-500/15 text-green-400",
    lost: "bg-red-500/15 text-red-400",
  };
  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
        map[status] ?? ""
      }`}
    >
      {status}
    </span>
  );
}
