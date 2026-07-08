import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import { canCreateQuote } from "@/lib/rbac";

function escapeCsvValue(value: string | number | null | undefined) {
  if (value === null || value === undefined) {
    return "";
  }

  const stringValue = String(value);

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

export async function GET() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    return new Response("Non autenticato", {
      status: 401,
    });
  }

  const currentUser = await prisma.user.upsert({
    where: {
      authProviderId: session.user.id,
    },
    update: {
      email: session.user.email,
      name: session.user.name,
    },
    create: {
      authProviderId: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: "TECHNICIAN",
    },
  });

  if (!canCreateQuote(currentUser.role)) {
  return new Response("Accesso negato", {
    status: 403,
  });
}

const quotes = await prisma.quote.findMany({
  where: {
    deletedAt: null,
  },
  orderBy: {
    createdAt: "desc",
  },
  select: {
    number: true,
    title: true,
    status: true,
    subtotal: true,
    taxRate: true,
    taxTotal: true,
    total: true,
    client: {
      select: {
        name: true,
      },
    },
    createdBy: {
      select: {
        email: true,
      },
    },
  },
});

const headers = [
  "Numero",
  "Titolo",
  "Cliente",
  "Stato",
  "Subtotale",
  "Aliquota IVA",
  "IVA",
  "Totale",
  "Creato da",
];

const rows = quotes.map((quote) => [
  quote.number,
  quote.title,
  quote.client.name,
  quote.status,
  quote.subtotal.toNumber().toFixed(2),
  quote.taxRate.toNumber().toFixed(2),
  quote.taxTotal.toNumber().toFixed(2),
  quote.total.toNumber().toFixed(2),
  quote.createdBy.email,
]);

const csv = [
  headers.map(escapeCsvValue).join(","),
  ...rows.map((row) => row.map(escapeCsvValue).join(",")),
].join("\n");

 return new Response(csv, {
  headers: {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": 'attachment; filename="preventivi.csv"',
  },
});
}