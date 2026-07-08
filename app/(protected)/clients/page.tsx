import { ClientForm } from "./_components/client-form";
import Link from "next/link";
import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { parsePaginationParams } from "@/lib/search-params";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


export const dynamic = "force-dynamic";

type ClientsPageProps = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const { query, page } = await searchParams;
  const currentUser = await requireCurrentUser();
  
  const { searchQuery, pageSize, currentPage, skip } = parsePaginationParams({
  query,
  page,
});

  const clientWhere = {
    deletedAt: null,

    ...(searchQuery
      ? {
        OR: [
          {
            name: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: searchQuery,
              mode: "insensitive" as const,
            },
          },
        ],
      }
      : {}),

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
  };

  const [clients, totalClients] = await Promise.all([
    prisma.client.findMany({
      where: clientWhere,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: pageSize,
      select: {
        id: true,
        name: true,
        type: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    }),
    prisma.client.count({
      where: clientWhere,
    }),
  ]);

  const totalPages = Math.max(Math.ceil(totalClients / pageSize), 1);

  const getClientsPageHref = (targetPage: number) => {
    const params = new URLSearchParams();

    if (searchQuery) {
      params.set("query", searchQuery);
    }

    if (targetPage > 1) {
      params.set("page", String(targetPage));
    }

    const queryString = params.toString();

    return queryString ? `/clients?${queryString}` : "/clients";
  };


  return (
    <main className="min-h-svh bg-background p-6">

      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[360px_1fr]">

        <ClientForm />

        <div className="space-y-4">
          <form action="/clients" className="flex flex-col gap-2 sm:max-w-sm">
            <label htmlFor="query" className="text-sm font-medium">
              Cerca cliente
            </label>
            <Input
              key={searchQuery ?? "empty-search"}
              id="query"
              name="query"
              type="search"
              placeholder="Nome o email"
              defaultValue={searchQuery ?? ""}
            />
            {searchQuery ? (
              <Link
                href="/clients"
                className={buttonVariants({
                  variant: "secondary",
                  size: "sm",
                  className: "w-fit",
                })}
              >
                Pulisci
              </Link>
            ) : null}
          </form>
          <div>
            <p className="text-sm text-muted-foreground">Clienti</p>
            <h1 className="text-2xl font-semibold">Anagrafica clienti</h1>
          </div>

          <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
            <Table suppressHydrationWarning>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefono</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">{client.name}</TableCell>
                    <TableCell>{client.type}</TableCell>
                    <TableCell>{client.email ?? "-"}</TableCell>
                    <TableCell>{client.phone ?? "-"}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Link href={`/clients/${client.id}`}>Dettagli</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                      Nessun cliente trovato.
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
                  href={getClientsPageHref(currentPage - 1)}
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
                  href={getClientsPageHref(currentPage + 1)}
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