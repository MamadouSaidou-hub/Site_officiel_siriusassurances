import Link from "next/link";
import type { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import UnsubscribeForm from "./UnsubscribeForm";

export const metadata: Metadata = {
  title: "Désinscription newsletter — Sirius Assurances",
  robots: { index: false, follow: false },
};

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function getEmail(token: string): Promise<string | null> {
  if (!UUID_RE.test(token)) return null;
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("email")
    .eq("unsubscribe_token", token)
    .maybeSingle();
  return data?.email ?? null;
}

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token ?? "";
  const valid = UUID_RE.test(token);
  const email = valid ? await getEmail(token) : null;

  return (
    <main className="flex min-h-screen items-center justify-center bg-sirius-bg px-6">
      <div className="w-full max-w-md rounded-3xl border border-sirius-border bg-sirius-surface p-8 lg:p-10">
        <Link
          href="/"
          className="text-lg font-extrabold tracking-tight text-sirius-text"
        >
          Sirius Assurances
        </Link>
        <h1 className="mt-6 text-2xl font-extrabold text-sirius-text">
          Désinscription
        </h1>

        <div className="mt-6">
          {valid && email ? (
            <UnsubscribeForm token={token} email={email} />
          ) : (
            <p className="text-sm text-sirius-text-dim">
              Ce lien de désinscription est invalide ou a expiré. Si vous
              souhaitez ne plus recevoir nos emails, contactez-nous à{" "}
              <a
                href="mailto:contact@siriusassurances.com"
                className="font-semibold text-sirius-gold"
              >
                contact@siriusassurances.com
              </a>
              .
            </p>
          )}
        </div>

        <Link
          href="/"
          className="mt-8 inline-block text-sm font-semibold text-sirius-text-dim hover:text-sirius-text"
        >
          ← Retour à l'accueil
        </Link>
      </div>
    </main>
  );
}
