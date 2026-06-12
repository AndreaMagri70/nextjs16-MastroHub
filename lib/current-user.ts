import "server-only";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireCurrentUser() {
  const { data: session } = await auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  return prisma.user.upsert({
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
}