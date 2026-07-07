import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, Play } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Actualités & conseils — Sirius Assurances",
  description:
    "Toutes les actualités, analyses et conseils de Sirius Assurances sur le marché de l'assurance au Sénégal et en Afrique de l'Ouest.",
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

async function getArticles() {
  const supabase = createClient();
  const { data } = await supabase
    .from("news_articles")
    .select(
      "slug, title, excerpt, cover_url, video_embed_url, video_url, tag, published_at"
    )
    .eq("published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export default async function AllNewsPage() {
  const articles = await getArticles();

  return (
    <main className="min-h-screen bg-sirius-bg">
      <header className="sticky top-0 z-30 border-b border-sirius-border bg-sirius-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-container items-center justify-between px-6 py-5 lg:px-10">
          <Link
            href="/"
            className="text-lg font-extrabold tracking-tight text-sirius-text"
          >
            Sirius Assurances
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sirius-text-dim hover:text-sirius-text"
          >
            <ArrowLeft size={16} />
            Retour à l'accueil
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-container px-6 py-16 lg:px-10">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-sirius-gold">
          Notre blog
        </p>
        <h1 className="mt-4 font-serif text-[34px] font-semibold leading-[1.15] text-sirius-text sm:text-[42px]">
          Actualités &amp; conseils
        </h1>

        {articles.length === 0 ? (
          <p className="mt-10 text-sm text-sirius-text-dim">
            Aucun article publié pour le moment. Revenez bientôt !
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <Link
                key={a.slug}
                href={`/actualites/${a.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-sirius-border bg-sirius-surface transition-all hover:-translate-y-1"
              >
                <div className="relative">
                  {a.cover_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.cover_url}
                      alt={a.title}
                      className="aspect-[16/9] w-full object-cover"
                    />
                  ) : (
                    <div
                      className="flex aspect-[16/9] items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #1a2533 0%, #0d1622 100%)",
                      }}
                    >
                      <span className="text-[11px] font-semibold text-sirius-text-mute">
                        Sirius Assurances
                      </span>
                    </div>
                  )}
                  {(a.video_embed_url || a.video_url) && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sirius-gold/90 shadow-lg">
                        <Play
                          size={20}
                          className="ml-0.5 text-sirius-bg"
                          fill="currentColor"
                        />
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  {a.tag && (
                    <span className="self-start rounded-full bg-sirius-gold/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sirius-gold">
                      {a.tag}
                    </span>
                  )}
                  <h2 className="mt-4 text-base font-bold leading-snug text-sirius-text">
                    {a.title}
                  </h2>
                  {a.excerpt && (
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-sirius-text-dim">
                      {a.excerpt}
                    </p>
                  )}
                  {a.published_at && (
                    <p className="mt-4 text-xs font-semibold text-sirius-text-mute">
                      {dateFmt.format(new Date(a.published_at))}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
