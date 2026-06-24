import { createClient } from "@/lib/supabase/server";
import ProfileForms from "@/components/admin/ProfileForms";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
    : { data: null };

  return (
    <div className="px-8 py-10 lg:px-12">
      <h1 className="text-2xl font-extrabold text-sirius-text">Mon profil</h1>
      <p className="mt-1 text-sm text-sirius-text-dim">
        Gérez votre nom et votre mot de passe.
      </p>

      <div className="max-w-2xl">
        <ProfileForms
          email={user?.email ?? null}
          fullName={profile?.full_name ?? null}
        />
      </div>
    </div>
  );
}
