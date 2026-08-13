"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Sidebar, Topbar } from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    if (isAuthenticated) return;
    const tokens = JSON.parse(localStorage.getItem("ppmp_tokens") ?? "{}");
    if (!tokens?.accessToken) {
      router.replace("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar open={menuOpen} onOpenChange={setMenuOpen} />
      <div className="flex min-h-screen flex-col lg:pl-64">
        <Topbar onMenuClick={() => setMenuOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
