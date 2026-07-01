import { ConstructionSiteForm } from "./_components/construction-site-form";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

import Link from "next/link";
import { parsePaginationParams } from "@/lib/search-params";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

type ConstructionSitesPageProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function ConstructionSitesPage({
  searchParams,
}: ConstructionSitesPageProps) {
  const { query, page } = await searchParams;
  const currentUser = await requireCurrentUser();

  const { searchQuery, pageSize, currentPage, skip } = parsePaginationParams({
    query,
    page,
  });

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

  const siteWhere = {
  deletedAt: null,

  ...(searchQuery
    ? {
        OR: [
          {
            title: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
          {
            address: {
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
          {
            quote: {
              number: {
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
        assignments: {
          some: {
            userId: currentUser.id,
          },
        },
      }
    : {}),
};

  const [sites, totalSites] = await Promise.all([
  prisma.constructionSite.findMany({
    where: siteWhere,
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: pageSize,
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
  }),
  prisma.constructionSite.count({
    where: siteWhere,
  }),
]);

const totalPages = Math.max(Math.ceil(totalSites / pageSize), 1);

const getConstructionSitesPageHref = (targetPage: number) => {
  const params = new URLSearchParams();

  if (searchQuery) {
    params.set("query", searchQuery);
  }

  if (targetPage > 1) {
    params.set("page", String(targetPage));
  }

  const queryString = params.toString();

  return queryString
    ? `/construction-sites?${queryString}`
    : "/construction-sites";
};

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

          <form
  action="/construction-sites"
  className="flex flex-col gap-2 sm:max-w-md"
>
  <label htmlFor="query" className="text-sm font-medium">
    Cerca cantiere
  </label>

  <div className="flex gap-2">
    <Input
      key={searchQuery ?? "empty-search"}
      id="query"
      name="query"
      type="search"
      placeholder="Titolo, cliente, indirizzo o preventivo"
      defaultValue={searchQuery ?? ""}
    />

    {searchQuery ? (
      <Link
        href="/construction-sites"
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
          <div className="flex items-center justify-between gap-4">
  <p className="text-sm text-muted-foreground">
    Pagina {currentPage} di {totalPages}
  </p>

  <div className="flex gap-2">
    {currentPage > 1 ? (
      <Link
        href={getConstructionSitesPageHref(currentPage - 1)}
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
        href={getConstructionSitesPageHref(currentPage + 1)}
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