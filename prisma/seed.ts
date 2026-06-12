import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../lib/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const admin = await prisma.user.upsert({
    where: {
      authProviderId: "dev_neon_auth_user_1",
    },
    update: {},
    create: {
      authProviderId: "dev_neon_auth_user_1",
      email: "assomag@libero.it",
      name: "Admin MastroHub",
      role: "ADMIN",
    },
  });

  const client = await prisma.client.create({
    data: {
      ownerId: admin.id,
      type: "BUSINESS",
      name: "Edil Rossi SRL",
      email: "info@edilrossi.local",
      phone: "+39 000 000000",
      vatNumber: "IT00000000000",
      address: "Via Roma 1, Milano",
      notes: "Cliente demo creato dal seed.",
    },
  });

  const subtotal = "1200.00";
  const taxRate = "22.00";
  const taxTotal = "264.00";
  const total = "1464.00";

  await prisma.quote.create({
    data: {
      clientId: client.id,
      createdById: admin.id,
      number: `PREV-${Date.now()}`,
      title: "Ristrutturazione bagno demo",
      status: "DRAFT",
      subtotal,
      taxRate,
      taxTotal,
      total,
      items: {
        create: [
          {
            description: "Manodopera e materiali",
            quantity: "1.00",
            unitPrice: subtotal,
            lineTotal: subtotal,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });