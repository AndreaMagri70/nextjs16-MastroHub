import StatCard from "@/app/(protected)/dashboard/_components/stat-card";
import { prisma } from "@/lib/prisma";

export async function AcceptedQuotesCountCard() {
  const acceptedQuotesCount = await prisma.quote.count({
    where: {
      deletedAt: null,
      status: "ACCEPTED",
    },
  });

  return (
    <StatCard
      label="Preventivi accettati"
      value={acceptedQuotesCount}
      description="Pronti per cantiere"
    />
  );
}