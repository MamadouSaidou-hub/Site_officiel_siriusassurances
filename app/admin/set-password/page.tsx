import { createClient } from "@/lib/supabase/server";
import SetPasswordForm from "@/components/admin/SetPasswordForm";

export const dynamic = "force-dynamic";

export default async function SetPasswordPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md rounded-2xl border border-sirius-border bg-sirius-surface p-8">
        <h1 className="text-xl font-extrabold text-sirius-text">
          Activez votre compte
        </h1>
        <p className="mt-1 text-sm text-sirius-text-dim">
          {user?.email
            ? `Définissez le mot de passe pour ${user.email}.`
            : "Définissez votre mot de passe pour accéder au backoffice."}
        </p>
        <div className="mt-6">
          <SetPasswordForm />
        </div>
      </div>
    </div>
  );
}
