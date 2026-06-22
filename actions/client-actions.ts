"use server";

import { revalidatePath } from "next/cache";

import { requireCurrentUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";
import { CreateClientSchema } from "@/schemas/client-schema";

import { canCreateClient } from "@/lib/rbac";

export type ClientActionState = {
  success: boolean;
  message: string;
};

export async function createClient(
  _prevState: ClientActionState,
  formData: FormData,
): Promise<ClientActionState> {
  const currentUser = await requireCurrentUser();

  const parsed = CreateClientSchema.safeParse({
    type: formData.get("type"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    taxCode: formData.get("taxCode"),
    vatNumber: formData.get("vatNumber"),
    address: formData.get("address"),
    notes: formData.get("notes"),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dati cliente non validi.",
    };
  }

  if (!canCreateClient(currentUser.role)) {
    return {
      success: false,
      message: "Non hai i permessi per creare clienti.",
    };
  }

  await prisma.client.create({
    data: {
      ownerId: currentUser.id,
      type: parsed.data.type,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      taxCode: parsed.data.taxCode || null,
      vatNumber: parsed.data.vatNumber || null,
      address: parsed.data.address || null,
      notes: parsed.data.notes || null,
    },
  });

  revalidatePath("/clients");

  return {
    success: true,
    message: "Cliente creato correttamente.",
  };
}