import Link from "next/link";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme-provider";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-violet-600/10 to-transparent" />
      <header className="relative z-10 flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-violet-600 font-bold text-white">
            P
          </div>
          <span className="text-lg font-semibold tracking-tight">PPMP</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
