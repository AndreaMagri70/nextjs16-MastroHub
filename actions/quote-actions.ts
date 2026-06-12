"use server";

import { Prisma } from "@/lib/generated/prisma/client";
import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { CreateQuoteSchema } from "@/schemas/quote-schema";

export type QuoteActionState = {
  success: boolean;
  message: string;
};

function toDecimal(value: string) {
  return new Prisma.Decimal(value);
}

function generateQuoteNumber() {
  return `PREV-${Date.now()}`;
}

export async function createQuote(
  _prevState: QuoteActionState,
  formData: FormData,
): Promise<QuoteActionState> {
  const currentUser = await requireCurrentUser();

  const parsed = CreateQuoteSchema.safeParse({
    clientId: formData.get("clientId"),
    title: formData.get("title"),
    itemDescription: formData.get("itemDescription"),
    quantity: formData.get("quantity"),
    unitPrice: formData.get("unitPrice"),
    taxRate: formData.get("taxRate"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dati preventivo non validi.",
    };
  }

  if (!["ADMIN", "MANAGER", "SALES"].includes(currentUser.role)) {
    return {
      success: false,
      message: "Non hai i permessi per creare preventivi.",
    };
  }

  const client = await prisma.client.findFirst({
    where: {
      id: parsed.data.clientId,
      deletedAt: null,
    },
    select: {
      id: true,
    },
  });

  if (!client) {
    return {
      success: false,
      message: "Cliente non trovato.",
    };
  }

  const quantity = toDecimal(parsed.data.quantity);
  const unitPrice = toDecimal(parsed.data.unitPrice);
  const taxRate = toDecimal(parsed.data.taxRate);

  const subtotal = quantity.mul(unitPrice);
  const taxTotal = subtotal.mul(taxRate).div(100);
  const total = subtotal.add(taxTotal);

  await prisma.quote.create({
    data: {
      clientId: client.id,
      createdById: currentUser.id,
      number: generateQuoteNumber(),
      title: parsed.data.title,
      status: "DRAFT",
      subtotal,
      taxRate,
      taxTotal,
      total,
      items: {
        create: [
          {
            description: parsed.data.itemDescription,
            quantity,
            unitPrice,
            lineTotal: subtotal,
          },
        ],
      },
    },
  });

  revalidatePath("/quotes");

  return {
    success: true,
    message: "Preventivo creato correttamente.",
  };
}