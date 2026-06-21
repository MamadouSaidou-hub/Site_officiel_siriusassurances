import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen bg-sirius-bg">
      {/* Sidebar only shown when logged in — login page bypasses via its own layout */}
      {user && <AdminSidebar email={user.email ?? null} />}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
