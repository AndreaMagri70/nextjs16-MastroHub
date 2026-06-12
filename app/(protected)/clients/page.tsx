import { ClientForm } from "./_components/client-form";
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


export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const currentUser = await requireCurrentUser();

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
      createdAt: "desc",
    },
    select: {
      id: true,
      name: true,
      type: true,
      email: true,
      phone: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-svh bg-background p-6">
      <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[360px_1fr]">
        <ClientForm />

        <div className="space-y-4">
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
        </div>
      </section>
    </main>
  );
}