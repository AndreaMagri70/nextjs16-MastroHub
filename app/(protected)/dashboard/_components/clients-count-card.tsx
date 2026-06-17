import StatCard from "@/app/(protected)/dashboard/_components/stat-card";
import { prisma } from "@/lib/prisma";

export async function ClientsCountCard() {
  const clientsCount = await prisma.client.count({
    where: {
      deletedAt: null,
    },
  });

  return (
    <StatCard
      label="Clienti"
      value={clientsCount}
      description="Anagrafiche attive"
    />
  );
}