import StatCard from "@/app/(protected)/dashboard/_components/stat-card";
import { prisma } from "@/lib/prisma";

export async function AcceptedRevenueCard() {
  const result = await prisma.quote.aggregate({
    where: {
      deletedAt: null,
      status: "ACCEPTED",
    },
    _sum: {
      total: true,
    },
  });

  const revenue = result._sum.total?.toNumber() ?? 0;

  return (
    <StatCard
      label="Valore Lavori Accettati"
      value={revenue.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
      })}
      description="Totale preventivi accettati"
    />
  );
}