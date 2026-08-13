"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Bell,
  Briefcase,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Settings,
  Shield,
  User,
  X,
} from "lucide-react";
import { cn, initials } from "@/lib/utils";
import { useAuthStore, isAdmin } from "@/store/auth";
import { authService } from "@/services/auth";
import { ThemeToggle } from "@/components/theme-provider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/projects", label: "Projects", icon: FolderKanban },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/portfolio/settings", label: "Portfolio", icon: Briefcase },
  { href: "/settings", label: "Settings", icon: User },
];

interface SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const setOpen = onOpenChange;

  const items = isAdmin(user) ? [...NAV_ITEMS, { href: "/admin", label: "Admin", icon: Shield }] : NAV_ITEMS;

  const handleLogout = async () => {
    await authService.logout().catch(() => {});
    logout();
    router.push("/login");
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />
      ) : null}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600 font-bold text-white">
              P
            </div>
            <span className="text-lg font-semibold tracking-tight">PPMP</span>
          </Link>
          <button
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {items.map((item) => {
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-300"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground",
                )}
              >
                <item.icon className="size-4.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <Link
            href={`/p/${user?.portfolioSlug ?? user?.username ?? ""}`}
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <BarChart3 className="size-4.5" />
            View public portfolio
          </Link>
          <div className="flex items-center justify-between rounded-lg px-3 py-2">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold text-white">
                {initials(user?.fullName ?? user?.username)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{user?.fullName}</p>
                <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-muted-foreground transition-colors hover:text-rose-500"
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user } = useAuthStore();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur sm:px-6">
      <div className="flex items-center gap-3">
        <button
          className="lg:hidden rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <LayoutDashboard className="size-5" />
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {user ? `Signed in as @${user.username}` : "PPMP"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/notifications"
          className="inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-4.5" />
        </Link>
        <Link href="/settings" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground" aria-label="Settings">
          <Settings className="size-4.5" />
        </Link>
      </div>
    </header>
  );
}
