import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import NewsForm from "@/components/admin/NewsForm";

export default async function EditArticlePage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: article } = await supabase
    .from("news_articles")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!article) notFound();

  return (
    <div className="px-8 py-10 lg:px-12">
      <Link
        href="/admin/news"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-sirius-text-dim hover:text-sirius-text"
      >
        <ArrowLeft size={14} />
        Retour aux articles
      </Link>
      <h1 className="text-2xl font-extrabold text-sirius-text">
        Éditer : {article.title}
      </h1>
      <p className="mb-8 mt-1 text-sm text-sirius-text-dim">
        Dernière mise à jour :{" "}
        {new Date(article.updated_at).toLocaleString("fr-FR")}
      </p>
      <NewsForm article={article} />
    </div>
  );
}
