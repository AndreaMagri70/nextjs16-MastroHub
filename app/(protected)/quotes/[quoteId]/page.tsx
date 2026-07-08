import { notFound } from "next/navigation";
import Link from "next/link";

import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { StatusBadge } from "@/components/status-badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type QuoteDetailPageProps = {
    params: Promise<{
        quoteId: string;
    }>;
};

function formatCurrency(value: { toNumber: () => number }) {
    return value.toNumber().toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
    });
}

export default async function QuoteDetailPage({
    params,
}: QuoteDetailPageProps) {
    const { quoteId } = await params;

    const currentUser = await requireCurrentUser();

    const quote = await prisma.quote.findFirst({
        where: {
            id: quoteId,
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
        select: {
            id: true,
            number: true,
            title: true,
            status: true,
            subtotal: true,
            taxRate: true,
            taxTotal: true,
            total: true,
            validUntil: true,
            acceptedAt: true,
            rejectedAt: true,
            client: {
                select: {
                    id: true,
                    name: true,
                },
            },
            constructionSite: {
                select: {
                    id: true,
                    title: true,
                    status: true,
                },
            },
            items: {
                orderBy: {
                    sortOrder: "asc",
                },
                select: {
                    id: true,
                    description: true,
                    quantity: true,
                    unitPrice: true,
                    lineTotal: true,
                },
            },
        },
    });

    if (!quote) {
        notFound();
    }

    return (
        <main className="min-h-svh bg-background p-6">
            <section className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Preventivo</p>
                        <h1 className="text-2xl font-semibold">{quote.number}</h1>
                        <p className="text-sm text-muted-foreground">{quote.title}</p>
                    </div>

                    <Link
                        href="/quotes"
                        className={buttonVariants({
                            variant: "outline",
                            size: "sm",
                            className: "w-fit",
                        })}
                    >
                        Torna ai preventivi
                    </Link>
                </div>

                <div className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Cliente</p>
                        <Link
                            href={`/clients/${quote.client.id}`}
                            className="font-medium text-primary hover:underline"
                        >
                            {quote.client.name}
                        </Link>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Stato</p>
                        <StatusBadge value={quote.status} />
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Subtotale</p>
                        <p className="font-medium">{formatCurrency(quote.subtotal)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Totale</p>
                        <p className="font-medium">{formatCurrency(quote.total)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Aliquota IVA</p>
                        <p className="font-medium">{quote.taxRate.toNumber()}%</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">IVA</p>
                        <p className="font-medium">{formatCurrency(quote.taxTotal)}</p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">Cantiere</p>
                        {quote.constructionSite ? (
                            <p className="font-medium">{quote.constructionSite.title}</p>
                        ) : (
                            <p className="font-medium">-</p>
                        )}
                    </div>
                </div>
                <div className="space-y-3">
  <div>
    <h2 className="text-lg font-semibold">Righe preventivo</h2>
    <p className="text-sm text-muted-foreground">
      Dettaglio delle lavorazioni e degli importi.
    </p>
  </div>

  <div className="overflow-hidden rounded-lg border bg-card text-card-foreground">
    <Table suppressHydrationWarning>
      <TableHeader>
        <TableRow>
          <TableHead>Descrizione</TableHead>
          <TableHead className="text-right">Quantità</TableHead>
          <TableHead className="text-right">Prezzo unitario</TableHead>
          <TableHead className="text-right">Totale riga</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quote.items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {item.description}
            </TableCell>
            <TableCell className="text-right">
              {item.quantity.toNumber()}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(item.unitPrice)}
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(item.lineTotal)}
            </TableCell>
          </TableRow>
        ))}

        {quote.items.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={4}
              className="h-24 text-center text-muted-foreground"
            >
              Nessuna riga preventivo presente.
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