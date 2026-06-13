import { QuoteForm } from "./_components/quote-form";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

import { acceptQuote } from "@/actions/quote-actions";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function QuotesPage() {
  const currentUser = await requireCurrentUser();

  const canManageQuotes = ["ADMIN", "MANAGER", "SALES"].includes(
    currentUser.role,
  );

  const clients = await prisma.client.findMany({
    where: {
      deletedAt: null,
      ...(currentUser.role === "TECHNICIAN"
        ? {
          constructionSites: {
            some: {
              assignments: {
                some: {
                  userId: currentUser.id,
                },
              },
            },
          },
        }
        : {}),
    },
    orderBy: {
      name: "asc",
    },
    select: {
      id: true,
      name: true,
    },
  });

  const quotes = await prisma.quote.findMany({
    where: {
      deletedAt: null,
      ...(currentUser.role === "TECHNICIAN"
        ? {
          constructionSite: {
            assignments: {
              some: {
                userId: currentUser.id,
              },
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
      number: true,
      title: true,
      status: true,
      total: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <main className="min-h-svh bg-background p-6">
      <section className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[420px_1fr]">
        {canManageQuotes ? (
          <QuoteForm clients={clients} />
        ) : (
          <div className="rounded-lg border bg-card p-4 text-card-foreground">
            <h2 className="text-lg font-semibold">Preventivi</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Non hai i permessi per creare preventivi.
            </p>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Preventivi</p>
            <h1 className="text-2xl font-semibold">Elenco preventivi</h1>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
            <Table suppressHydrationWarning>
              <TableHeader>
                <TableRow>
                  <TableHead>Numero</TableHead>
                  <TableHead>Titolo</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Stato</TableHead>
                  <TableHead className="text-right">Totale</TableHead>
                  <TableHead className="text-right">Azioni</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {quotes.map((quote) => (
                  <TableRow key={quote.id}>
                    <TableCell className="font-medium">{quote.number}</TableCell>
                    <TableCell>{quote.title}</TableCell>
                    <TableCell>{quote.client.name}</TableCell>
                    <TableCell>{quote.status}</TableCell>
                    <TableCell className="text-right">
                      {quote.total.toNumber().toLocaleString("it-IT", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      {["DRAFT", "SENT"].includes(quote.status) ? (
                        <form action={acceptQuote}>
                          <input type="hidden" name="quoteId" value={quote.id} />
                          <Button type="submit" variant="outline" size="sm">
                            Accetta
                          </Button>
                        </form>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}

                {quotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      Nessun preventivo trovato.
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