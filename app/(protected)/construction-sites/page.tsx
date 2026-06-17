import { ConstructionSiteForm } from "./_components/construction-site-form";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function ConstructionSitesPage() {
  const currentUser = await requireCurrentUser();

  const canCreateSites = ["ADMIN", "MANAGER"].includes(currentUser.role);

  const acceptedQuotes = await prisma.quote.findMany({
    where: {
      status: "ACCEPTED",
      deletedAt: null,
      constructionSite: null,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      number: true,
      title: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  const sites = await prisma.constructionSite.findMany({
    where: {
      deletedAt: null,
      ...(currentUser.role === "TECHNICIAN"
        ? {
          assignments: {
            some: {
              userId: currentUser.id,
            },
          },
        }
        : {}),
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      status: true,
      address: true,
      client: {
        select: {
          name: true,
        },
      },
      quote: {
        select: {
          number: true,
        },
      },
    },
  });

  return (
    <main className="min-h-svh bg-background p-6">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[420px_1fr]">
        {canCreateSites ? (
          <ConstructionSiteForm
            acceptedQuotes={acceptedQuotes.map((quote) => ({
              id: quote.id,
              number: quote.number,
              title: quote.title,
              clientName: quote.client.name,
            }))}
          />
        ) : (
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <h2 className="text-lg font-semibold">Cantieri</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Non hai i permessi per creare cantieri.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Cantieri</p>
            <h1 className="text-2xl font-semibold">Elenco cantieri</h1>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
            <Table suppressHydrationWarning>
              <TableHeader>
                <TableRow>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Preventivo</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead>Indirizzo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.map((site) => (
                  <TableRow key={site.id}>
                    <TableCell className="font-medium">{site.title}</TableCell>
                    <TableCell>{site.client.name}</TableCell>
                    <TableCell>{site.quote?.number ?? "-"}</TableCell>
                    <TableCell>
                      <StatusBadge value={site.status} />
                    </TableCell>
                    <TableCell>{site.address ?? "-"}</TableCell>
                  </TableRow>
                ))}

                {sites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                      Nessun cantiere trovato.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </main>
  );
}