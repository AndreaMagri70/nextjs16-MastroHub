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

export default async function AdminUsersPage() {
  const currentUser = await requireCurrentUser();

  if (currentUser.role !== "ADMIN") {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background p-6">
        <section className="w-full max-w-md rounded-lg border bg-card p-6 text-card-foreground">
          <p className="text-sm text-muted-foreground">403</p>
          <h1 className="mt-1 text-xl font-semibold">Accesso negato</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Non hai i permessi per gestire gli utenti.
          </p>
        </section>
      </main>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  return (
    <main className="min-h-svh bg-background p-6">
      <section className="mx-auto max-w-5xl space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Admin</p>
          <h1 className="text-2xl font-semibold">Utenti</h1>
        </div>

        <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
          <Table suppressHydrationWarning>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Creato il</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.name ?? "-"}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.createdAt.toLocaleDateString("it-IT")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </main>
  );
}