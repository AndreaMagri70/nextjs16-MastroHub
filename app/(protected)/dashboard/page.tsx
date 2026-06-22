import { AcceptedQuotesCountCard } from "@/app/(protected)/dashboard/_components/accepted-quotes-count-card";
import { ActiveSitesCountCard } from "@/app/(protected)/dashboard/_components/active-sites-count-card";
import { ClientsCountCard } from "@/app/(protected)/dashboard/_components/clients-count-card";
import { OpenQuotesCountCard } from "@/app/(protected)/dashboard/_components/open-quotes-count-card";
import { requireCurrentUser } from "@/lib/current-user";
import { AcceptedRevenueCard } from "@/app/(protected)/dashboard/_components/accepted-revenue-card";

import { Suspense } from "react";
import { StatCardSkeleton } from "@/app/(protected)/dashboard/_components/stat-card-skeleton";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {

  const user = await requireCurrentUser();

  return (
    <main className="min-h-svh bg-background p-6">
      <section className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-sm text-muted-foreground">Dashboard</p>
          <h1 className="text-2xl font-semibold">Bentornato</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Accesso come {user.email}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Suspense fallback={<StatCardSkeleton />}>
            <ClientsCountCard />
          </Suspense>

          <Suspense fallback={<StatCardSkeleton />}>
            <OpenQuotesCountCard />
          </Suspense>

          <Suspense fallback={<StatCardSkeleton />}>
            <AcceptedQuotesCountCard />
          </Suspense>

          <Suspense fallback={<StatCardSkeleton />}>
            <ActiveSitesCountCard />
          </Suspense>

          <Suspense fallback={<StatCardSkeleton />}>
            <AcceptedRevenueCard />
          </Suspense>
        </div>
      </section>
    </main>
  );
}