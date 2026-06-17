import StatCard from "@/app/(protected)/dashboard/_components/stat-card";
import { prisma } from "@/lib/prisma";

export async function ActiveSitesCountCard() {
  const activeSitesCount = await prisma.constructionSite.count({
    where: {
      deletedAt: null,
      status: {
        in: ["PLANNED", "IN_PROGRESS", "ON_HOLD"],
      },
    },
  });

  return (
    <StatCard
      label="Cantieri attivi"
      value={activeSitesCount}
      description="Pianificati o in corso"
    />
  );
}