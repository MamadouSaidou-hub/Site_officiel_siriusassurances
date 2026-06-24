import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import PartnerForm from "@/components/admin/PartnerForm";

export default async function EditPartnerPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: partner } = await supabase
    .from("partners")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!partner) notFound();

  return (
    <div className="px-8 py-10 lg:px-12">
      <Link
        href="/admin/partners"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-sirius-text-dim hover:text-sirius-text"
      >
        <ArrowLeft size={14} />
        Retour aux partenaires
      </Link>
      <h1 className="text-2xl font-extrabold text-sirius-text">
        Éditer : {partner.name}
      </h1>
      <div className="mt-8 rounded-2xl border border-sirius-border bg-sirius-surface p-6 lg:p-8">
        <PartnerForm partner={partner} />
      </div>
    </div>
  );
}
