import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import NewsForm from "@/components/admin/NewsForm";

export default async function NewArticlePage() {
  const supabase = createClient();
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
      <Link
        href="/admin/news"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-sirius-text-dim hover:text-sirius-text"
      >
        <ArrowLeft size={14} />
        Retour aux articles
      </Link>
      <h1 className="text-2xl font-extrabold text-sirius-text">Nouvel article</h1>
      <p className="mb-8 mt-1 text-sm text-sirius-text-dim">
        {canPublish
          ? "L'article ne sera visible côté public que s'il est publié."
          : "Votre article sera enregistré en brouillon, puis publié après validation."}
      </p>
      <NewsForm canPublish={canPublish} />
    </div>
  );
}
