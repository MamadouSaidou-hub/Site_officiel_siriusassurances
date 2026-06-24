import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { createClient } from "@/lib/supabase/server";
import Footer from "@/components/Footer";

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

/** Published article by slug (RLS lets anon read published rows only). */
async function getArticle(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("news_articles")
    .select(
      "slug, title, excerpt, content, cover_url, video_embed_url, video_url, tag, published_at"
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data;
}

/** Normalize a YouTube/Vimeo URL into an embeddable player URL. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com") {
      if (u.pathname.startsWith("/embed/")) return url;
      if (u.pathname === "/watch") {
        const id = u.searchParams.get("v");
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
      if (u.pathname.startsWith("/shorts/")) {
        const id = u.pathname.split("/")[2];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
    if (host === "player.vimeo.com") return url;
    if (host === "vimeo.com") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id && /^\d+$/.test(id)
        ? `https://player.vimeo.com/video/${id}`
        : null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Article introuvable — Sirius Assurances" };

  return {
    title: `${article.title} — Sirius Assurances`,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      type: "article",
      ...(article.cover_url ? { images: [article.cover_url] } : {}),
    },
  };
}

// Markdown → styled elements (no @tailwindcss/typography dependency).
const mdComponents = {
  h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-10 text-3xl font-extrabold text-sirius-text" {...props} />
  ),
  h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mt-10 text-2xl font-bold text-sirius-text" {...props} />
  ),
  h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mt-8 text-xl font-bold text-sirius-text" {...props} />
  ),
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mt-5 text-base leading-relaxed text-sirius-text-dim" {...props} />
  ),
  a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a className="font-semibold text-sirius-gold underline" {...props} />
  ),
  ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 text-sirius-text-dim" {...props} />
  ),
  ol: (props: React.OlHTMLAttributes<HTMLOListElement>) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 text-sirius-text-dim" {...props} />
  ),
  blockquote: (props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className="mt-6 border-l-2 border-sirius-gold pl-4 italic text-sirius-text-dim"
      {...props}
    />
  ),
  code: (props: React.HTMLAttributes<HTMLElement>) => (
    <code
      className="rounded bg-sirius-surface px-1.5 py-0.5 font-mono text-sm text-sirius-gold-soft"
      {...props}
    />
  ),
  hr: () => <hr className="my-10 border-sirius-border" />,
};

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) notFound();

  const embedUrl = article.video_embed_url
    ? toEmbedUrl(article.video_embed_url)
    : null;

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
            href="/actualites"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sirius-text-dim hover:text-sirius-text"
          >
            <ArrowLeft size={16} />
            Retour aux actualités
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-6 py-16 lg:px-10">
        {article.tag && (
          <span className="inline-flex rounded-full bg-sirius-gold/12 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-sirius-gold">
            {article.tag}
          </span>
        )}
        <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] text-sirius-text sm:text-[42px]">
          {article.title}
        </h1>
        {article.published_at && (
          <p className="mt-4 text-sm font-semibold text-sirius-text-mute">
            {dateFmt.format(new Date(article.published_at))}
          </p>
        )}

        {embedUrl ? (
          <div className="mt-8 aspect-video w-full overflow-hidden rounded-2xl border border-sirius-border bg-black">
            <iframe
              src={embedUrl}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        ) : article.video_url ? (
          <video
            src={article.video_url}
            controls
            playsInline
            poster={article.cover_url ?? undefined}
            className="mt-8 aspect-video w-full rounded-2xl border border-sirius-border bg-black"
          />
        ) : article.cover_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_url}
            alt={article.title}
            className="mt-8 aspect-[16/9] w-full rounded-2xl border border-sirius-border object-cover"
          />
        ) : null}

        {article.excerpt && (
          <p className="mt-8 text-lg leading-relaxed text-sirius-text">
            {article.excerpt}
          </p>
        )}

        {article.content && (
          <div className="mt-4">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
              {article.content}
            </ReactMarkdown>
          </div>
        )}
      </article>

      <Footer />
    </main>
  );
}
