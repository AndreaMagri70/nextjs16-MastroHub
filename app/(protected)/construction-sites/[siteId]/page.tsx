import { notFound } from "next/navigation";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";


type ConstructionSiteDetailPageProps = {
    params: Promise<{
        siteId: string;
    }>;
};

function formatValue(value: string | null) {
    return value?.trim() ? value : "-";
}

function formatDate(value: Date | null) {
    return value
        ? value.toLocaleDateString("it-IT", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        })
        : "-";
}

export default async function ConstructionSiteDetailPage({
    params,
}: ConstructionSiteDetailPageProps) {
    const { siteId } = await params;

    const currentUser = await requireCurrentUser();

    const site = await prisma.constructionSite.findFirst({
        where: {
            id: siteId,
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
        select: {
            id: true,
            title: true,
            status: true,
            startDate: true,
            endDate: true,
            address: true,
            notes: true,
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
            quote: {
                select: {
                    id: true,
                    number: true,
                    title: true,
                    total: true,
                },
            },
            manager: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            assignments: {
                orderBy: {
                    assignedAt: "desc",
                },
                select: {
                    id: true,
                    assignedAt: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });

    if (!site) {
        notFound();
    }

    return (
        <main className="min-h-svh bg-background p-6">
            <section className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Cantiere</p>
                        <h1 className="text-2xl font-semibold">{site.title}</h1>
                        <div className="mt-2">
                            <StatusBadge value={site.status} />
                        </div>
                    </div>

                    <Link
                        href="/construction-sites"
                        className={buttonVariants({
                            variant: "default",
                            size: "sm",
                            className: "w-fit",
                        })}
                    >
                        ← Torna ai cantieri
                    </Link>
                </div>

                <div className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <Link
                            href={`/clients/${site.client.id}`}
                            className="font-medium text-primary hover:underline"
                        >
                            {site.client.name}
                        </Link>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Preventivo</p>
                        {site.quote ? (
                            <Link
                                href={`/quotes/${site.quote.id}`}
                                className="font-medium text-primary hover:underline"
                            >
                                {site.quote.number}
                            </Link>
                        ) : (
                            <p className="font-medium">-</p>
                        )}
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Manager</p>
                        <p className="font-medium">
                            {site.manager.name ?? site.manager.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Indirizzo</p>
                        <p className="font-medium">{formatValue(site.address)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Data inizio</p>
                        <p className="font-medium">{formatDate(site.startDate)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Data fine</p>
                        <p className="font-medium">{formatDate(site.endDate)}</p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="text-sm text-muted-foreground">Note</p>
                        <p className="font-medium">{formatValue(site.notes)}</p>
                    </div>
                </div>
                <div className="space-y-3">
  <div>
    <h2 className="text-lg font-semibold">Tecnici assegnati</h2>
    <p className="text-sm text-muted-foreground">
      Utenti assegnati operativamente a questo cantiere.
    </p>
  </div>

  <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
    <Table suppressHydrationWarning>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Assegnato il</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {site.assignments.map((assignment) => (
          <TableRow key={assignment.id}>
            <TableCell className="font-medium">
              {assignment.user.name ?? "-"}
            </TableCell>
            <TableCell>{assignment.user.email}</TableCell>
            <TableCell>{formatDate(assignment.assignedAt)}</TableCell>
          </TableRow>
        ))}

        {site.assignments.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={3}
              className="h-24 text-center text-muted-foreground"
            >
              Nessun tecnico assegnato.
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