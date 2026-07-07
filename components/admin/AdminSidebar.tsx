"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Mail,
  Newspaper,
  Handshake,
  Users,
  UserCog,
  LogOut,
} from "lucide-react";
import { logoutAdmin } from "@/app/actions/auth";

const ITEMS = [
  { href: "/admin", label: "Dashboard", Icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", Icon: Inbox },
  { href: "/admin/newsletter", label: "Newsletter", Icon: Mail },
  { href: "/admin/news", label: "Actualités", Icon: Newspaper },
  { href: "/admin/partners", label: "Partenaires", Icon: Handshake },
  { href: "/admin/profile", label: "Mon profil", Icon: UserCog },
];

export default function AdminSidebar({
  email,
  isSuperadmin = false,
}: {
  email: string | null;
  isSuperadmin?: boolean;
}) {
  const pathname = usePathname();

  const items = isSuperadmin
    ? [
        ...ITEMS,
        { href: "/admin/users", label: "Utilisateurs", Icon: Users },
      ]
    : ITEMS;

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-sirius-border bg-[#071320]">
      <div className="px-6 py-6">
        <p className="text-lg font-extrabold text-sirius-text">Sirius Admin</p>
        <p className="mt-0.5 text-xs text-sirius-text-mute">Backoffice</p>
      </div>

      <nav className="flex-1 px-3">
        {items.map(({ href, label, Icon }) => {
          const active =
            pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-sirius-gold/10 text-sirius-gold"
                  : "text-sirius-text-dim hover:bg-white/5 hover:text-sirius-text"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sirius-border p-3">
        {email && (
          <p className="mb-2 truncate px-3 text-xs text-sirius-text-mute">
            {email}
          </p>
        )}
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-sirius-text-dim hover:bg-white/5 hover:text-sirius-text"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </form>
      </div>
    </aside>
  );
}
