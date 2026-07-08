import { StatusBadge } from "@/components/status-badge";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { notFound } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";

import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type ClientDetailPageProps = {
    params: Promise<{
        clientId: string;
    }>;
};

function formatValue(value: string | null) {
    return value?.trim() ? value : "-";
}

export default async function ClientDetailPage({
    params,
}: ClientDetailPageProps) {
    const { clientId } = await params;

    const currentUser = await requireCurrentUser();

    const client = await prisma.client.findFirst({
        where: {
            id: clientId,
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
        select: {
            id: true,
            name: true,
            type: true,
            email: true,
            phone: true,
            vatNumber: true,
            taxCode: true,
            address: true,
            createdAt: true,
        },

    });

    if (!client) {
        notFound();
    }

    const quotes = await prisma.quote.findMany({
        where: {
            clientId: client.id,
            deletedAt: null,
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
        },
    });

    const constructionSites = await prisma.constructionSite.findMany({
        where: {
            clientId: client.id,
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
            quote: {
                select: {
                    number: true,
                },
            },
        },
    });

    return (
        <main className="min-h-svh bg-background p-6">
            <section className="mx-auto max-w-5xl space-y-6">
                <div>
                    <p className="text-sm text-muted-foreground">Cliente</p>
                    <h1 className="text-2xl font-semibold">{client.name}</h1>
                </div>

                <div className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">Tipo</p>
                        <p className="font-medium">{client.type}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="font-medium">{formatValue(client.email)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Telefono</p>
                        <p className="font-medium">{formatValue(client.phone)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Partita IVA</p>
                        <p className="font-medium">{formatValue(client.vatNumber)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Codice fiscale</p>
                        <p className="font-medium">{formatValue(client.taxCode)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Indirizzo</p>
                        <p className="font-medium">{formatValue(client.address)}</p>
                    </div>

                </div>

                <div className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">Preventivi collegati</h2>
                        <p className="text-sm text-muted-foreground">
                            Preventivi creati per questo cliente.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                        <Table suppressHydrationWarning>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Numero</TableHead>
                                    <TableHead>Titolo</TableHead>
                                    <TableHead>Stato</TableHead>
                                    <TableHead className="text-right">Totale</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {quotes.map((quote) => (
                                    <TableRow key={quote.id}>
                                        <TableCell className="font-medium">{quote.number}</TableCell>
                                        <TableCell>{quote.title}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={quote.status} />
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {quote.total.toNumber().toLocaleString("it-IT", {
                                                style: "currency",
                                                currency: "EUR",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {quotes.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            Nessun preventivo collegato.
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">Cantieri collegati</h2>
                        <p className="text-sm text-muted-foreground">
                            Cantieri aperti o pianificati per questo cliente.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
                        <Table suppressHydrationWarning>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Titolo</TableHead>
                                    <TableHead>Preventivo</TableHead>
                                    <TableHead>Stato</TableHead>
                                    <TableHead>Indirizzo</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {constructionSites.map((site) => (
                                    <TableRow key={site.id}>
                                        <TableCell className="font-medium">{site.title}</TableCell>
                                        <TableCell>{site.quote?.number ?? "-"}</TableCell>
                                        <TableCell>
                                            <StatusBadge value={site.status} />
                                        </TableCell>
                                        <TableCell>{site.address ?? "-"}</TableCell>
                                    </TableRow>
                                ))}

                                {constructionSites.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="h-24 text-center text-muted-foreground"
                                        >
                                            Nessun cantiere collegato.
                                        </TableCell>
                                    </TableRow>
                                ) : null}
                            </TableBody>
                        </Table>
                    </div>
                </div>

                <Link
                    href="/clients"
                    className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                        className: "w-fit bg-green-600 text-white hover:bg-green-700 hover:text-black",
                    })}
                >
                    TORNA AI CLIENTI
                </Link>
            </section>

        </main>
    );
}