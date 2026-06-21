import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import NewsForm from "@/components/admin/NewsForm";

export default function NewArticlePage() {
  return (
    <div className="px-8 py-10 lg:px-12">
      <Link
        href="/admin/news"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-sirius-text-dim hover:text-sirius-text"
      >
        <ArrowLeft size={14} />
        Retour aux articles
      </Link>
      <h1 className="text-2xl font-extrabold text-sirius-text">Nouvel article</h1>
      <p className="mb-8 mt-1 text-sm text-sirius-text-dim">
        L'article ne sera visible côté public que s'il est publié.
      </p>
      <NewsForm />
    </div>
  );
}
