import { QuoteForm } from "./_components/quote-form";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

import Link from "next/link";

import { parsePaginationParams } from "@/lib/search-params";
import { Input } from "@/components/ui/input";

import { StatusBadge } from "@/components/status-badge";

import { acceptQuote } from "@/actions/quote-actions";
import { Button, buttonVariants } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

type QuotesPageProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function QuotesPage({ searchParams }: QuotesPageProps) {
  const { query, page } = await searchParams;
  const currentUser = await requireCurrentUser();

  const { searchQuery, pageSize, currentPage, skip } = parsePaginationParams({
    query,
    page,
  });

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

  const quoteWhere = {
    deletedAt: null,

    ...(searchQuery
      ? {
        OR: [
          {
            number: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
          {
            title: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
          {
            client: {
              name: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
          },
        ],
      }
      : {}),

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
  };

  const [quotes, totalQuotes] = await Promise.all([
    prisma.quote.findMany({
      where: quoteWhere,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
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
    }),
    prisma.quote.count({
      where: quoteWhere,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalQuotes / pageSize), 1);

  const getQuotesPageHref = (targetPage: number) => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("query", searchQuery);
    }

    if (targetPage > 1) {
      params.set("page", String(targetPage));
    }

    const queryString = params.toString();

    return queryString ? `/quotes?${queryString}` : "/quotes";
  };


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
            <form action="/quotes" className="flex flex-col gap-2 sm:max-w-md">
              <label htmlFor="query" className="text-sm font-medium">
                Cerca preventivo
              </label>

              <div className="flex gap-2">
                <Input
                  key={searchQuery ?? "empty-search"}
                  id="query"
                  name="query"
                  type="search"
                  placeholder="Numero, titolo o cliente"
                  defaultValue={searchQuery ?? ""}
                />

                {searchQuery ? (
                  <Link
                    href="/quotes"
                    className={buttonVariants({
                      variant: "secondary",
                      size: "default",
                      className: "shrink-0",
                    })}
                  >
                    Pulisci
                  </Link>
                ) : null}
              </div>
            </form>
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
                    <TableCell>
                      <StatusBadge value={quote.status} />
                    </TableCell>
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
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Pagina {currentPage} di {totalPages}
            </p>

            <div className="flex gap-2">
              {currentPage > 1 ? (
                <Link
                  href={getQuotesPageHref(currentPage - 1)}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  Precedente
                </Link>
              ) : null}

              {currentPage < totalPages ? (
                <Link
                  href={getQuotesPageHref(currentPage + 1)}
                  className={buttonVariants({
                    variant: "outline",
                    size: "sm",
                  })}
                >
                  Successiva
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}