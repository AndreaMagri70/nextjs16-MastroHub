import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: session } = await auth.getSession();

  return (
    <main className="bg-background text-foreground flex min-h-svh items-center justify-center p-6">
      <section className="w-full max-w-3xl space-y-8">
        <div className="space-y-3">
          <p className="text-muted-foreground text-xl font-medium">
            Gestionale per artigiani
          </p>
          <h1 className="text-4xl font-bold sm:text-6xl">
            Mastro<span className="text-primary">Hub</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg sm:text-2xl">
            Gestisci clienti, preventivi e cantieri da un unico pannello.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-lg">
          {session?.user ? (
            <>
            <Link href="/dashboard" className={buttonVariants()}>
              Vai alla dashboard
            </Link>
            <Link
            href="/clients"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Esplora clienti
          </Link>
            </>
          ) : (
            <>
              <Link href="/login" className={buttonVariants()}>
                Accedi
              </Link>
              <Link
                href="/register"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                Crea account
              </Link>
            </>
          )}
          
        </div>
      </section>
    </main>
  );
}
