import { ArrowRight, Play } from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";
import { NEWS } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";

type NewsCard = {
  tag: string;
  title: string;
  excerpt: string;
  date: string;
  href: string;
  cover_url: string | null;
  hasVideo: boolean;
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Latest published articles from Supabase (public, RLS: published only). */
async function getArticles(): Promise<NewsCard[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("news_articles")
    .select(
      "slug, title, excerpt, cover_url, video_embed_url, video_url, tag, published_at"
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(3);

  if (!data || data.length === 0) return [];

  return data.map((a) => ({
    tag: a.tag ?? "Actualité",
    title: a.title,
    excerpt: a.excerpt ?? "",
    date: a.published_at ? dateFmt.format(new Date(a.published_at)) : "",
    href: `/actualites/${a.slug}`,
    cover_url: a.cover_url,
    hasVideo: Boolean(a.video_embed_url || a.video_url),
  }));
}

export default async function News() {
  const articles = await getArticles();

  // Fall back to static placeholders while no article is published yet.
  const items: NewsCard[] =
    articles.length > 0
      ? articles
      : NEWS.map((n) => ({ ...n, cover_url: null, hasVideo: false }));

  return (
    <section id="news" className="bg-sirius-light">
      <div className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Notre blog</SectionLabel>
          <SectionTitle className="mt-6">Actualités &amp; conseils</SectionTitle>
        </div>
        <a
          href="/actualites"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sirius-gold"
        >
          Voir toutes les actualités
          <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {items.map((n) => (
          <a
            key={n.title}
            href={n.href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-sirius-light-border bg-sirius-card shadow-[0_1px_3px_rgba(11,27,46,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(11,27,46,0.10)]"
          >
            <div className="relative">
              {n.cover_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={n.cover_url}
                  alt={n.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div
                  className="flex aspect-[16/9] items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #E3EBF3 0%, #D2DEEA 100%)",
                  }}
                >
                  <span className="text-[11px] font-semibold text-sirius-ink-mute">
                    Image article 480×280
                  </span>
                </div>
              )}
              {n.hasVideo && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sirius-gold/90 shadow-lg">
                    <Play size={20} className="ml-0.5 text-sirius-bg" fill="currentColor" />
                  </span>
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="self-start rounded-full bg-sirius-gold/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sirius-gold">
                {n.tag}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-sirius-ink">
                {n.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-sirius-ink-dim">
                {n.excerpt}
              </p>
              <p className="mt-4 text-xs font-semibold text-sirius-ink-mute">
                {n.date}
              </p>
            </div>
          </a>
        ))}
      </div>
      </div>
    </section>
  );
}
