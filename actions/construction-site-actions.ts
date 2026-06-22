"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { CreateConstructionSiteFromQuoteSchema } from "@/schemas/construction-site-schema";

import { canCreateConstructionSite } from "@/lib/rbac";

export type ConstructionSiteActionState = {
  success: boolean;
  message: string;
};

function toDateOrNull(value: string) {
  return value ? new Date(value) : null;
}

export async function createConstructionSiteFromQuote(
  _prevState: ConstructionSiteActionState,
  formData: FormData,
): Promise<ConstructionSiteActionState> {
  const currentUser = await requireCurrentUser();

  const parsed = CreateConstructionSiteFromQuoteSchema.safeParse({
    quoteId: formData.get("quoteId"),
    title: formData.get("title"),
    address: formData.get("address"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dati cantiere non validi.",
    };
  }

  if (!canCreateConstructionSite(currentUser.role)) {
    return {
      success: false,
      message: "Non hai i permessi per creare cantieri.",
    };
  }

  const quote = await prisma.quote.findFirst({
    where: {
      id: parsed.data.quoteId,
      deletedAt: null,
    },
    select: {
      id: true,
      clientId: true,
      status: true,
      constructionSite: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!quote) {
    return {
      success: false,
      message: "Preventivo non trovato.",
    };
  }

  if (quote.status !== "ACCEPTED") {
    return {
      success: false,
      message: "Puoi creare un cantiere solo da un preventivo accettato.",
    };
  }

  if (quote.constructionSite) {
    return {
      success: false,
      message: "Questo preventivo ha già un cantiere collegato.",
    };
  }

  await prisma.constructionSite.create({
    data: {
      clientId: quote.clientId,
      quoteId: quote.id,
      managerId: currentUser.id,
      title: parsed.data.title,
      status: "PLANNED",
      address: parsed.data.address || null,
      startDate: toDateOrNull(parsed.data.startDate),
      endDate: toDateOrNull(parsed.data.endDate),
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/construction-sites");
  revalidatePath("/quotes");

  return {
    success: true,
    message: "Cantiere creato correttamente.",
  };
}