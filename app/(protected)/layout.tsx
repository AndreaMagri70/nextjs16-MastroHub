import Link from "next/link";

import { Button } from "@/components/ui/button";

import { ThemeToggle } from "@/components/theme-toggle";

import { signOut } from "@/actions/auth-actions";
import { requireCurrentUser } from "@/lib/current-user";

import { ProtectedNav } from "@/app/(protected)/_components/protected-nav";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireCurrentUser();

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link href="/dashboard" className="text-2xl font-semibold">
              Mastro<span className="text-blue-500">Hub!</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {user.email} · {user.role}
            </p>
          </div>

          <ProtectedNav />

          <div className="flex items-center gap-2">
            <ThemeToggle />

            <form action={signOut}>
              <Button type="submit" variant="outline">
                Esci
              </Button>
            </form>
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}