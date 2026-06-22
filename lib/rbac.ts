import type { UserRole } from "@/lib/generated/prisma/client";

export function canCreateClient(role: UserRole) {
  return ["ADMIN", "MANAGER", "SALES"].includes(role);
}

export function canCreateQuote(role: UserRole) {
  return ["ADMIN", "MANAGER", "SALES"].includes(role);
}

export function canCreateConstructionSite(role: UserRole) {
  return ["ADMIN", "MANAGER"].includes(role);
}

export function canAccessAdminUsers(role: UserRole) {
  return role === "ADMIN";
}