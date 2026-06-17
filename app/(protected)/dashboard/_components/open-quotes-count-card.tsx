import StatCard from "@/app/(protected)/dashboard/_components/stat-card";
import { prisma } from "@/lib/prisma";

export async function OpenQuotesCountCard() {
  const openQuotesCount = await prisma.quote.count({
    where: {
      deletedAt: null,
      status: {
        in: ["DRAFT", "SENT"],
      },
    },
  });

  return (
    <StatCard
      label="Preventivi aperti"
      value={openQuotesCount}
      description="Bozze o inviati"
    />
  );
}