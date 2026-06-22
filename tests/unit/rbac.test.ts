import { describe, expect, it } from "vitest";

import {
  canAccessAdminUsers,
  canCreateClient,
  canCreateConstructionSite,
  canCreateQuote,
} from "@/lib/rbac";

describe("RBAC helpers", () => {
  it("permette ad ADMIN, MANAGER e SALES di creare clienti", () => {
    expect(canCreateClient("ADMIN")).toBe(true);
    expect(canCreateClient("MANAGER")).toBe(true);
    expect(canCreateClient("SALES")).toBe(true);
    expect(canCreateClient("TECHNICIAN")).toBe(false);
  });

  it("permette ad ADMIN, MANAGER e SALES di creare preventivi", () => {
    expect(canCreateQuote("ADMIN")).toBe(true);
    expect(canCreateQuote("MANAGER")).toBe(true);
    expect(canCreateQuote("SALES")).toBe(true);
    expect(canCreateQuote("TECHNICIAN")).toBe(false);
  });

  it("permette solo ad ADMIN e MANAGER di creare cantieri", () => {
    expect(canCreateConstructionSite("ADMIN")).toBe(true);
    expect(canCreateConstructionSite("MANAGER")).toBe(true);
    expect(canCreateConstructionSite("SALES")).toBe(false);
    expect(canCreateConstructionSite("TECHNICIAN")).toBe(false);
  });

  it("permette solo ad ADMIN di accedere alla gestione utenti", () => {
    expect(canAccessAdminUsers("ADMIN")).toBe(true);
    expect(canAccessAdminUsers("MANAGER")).toBe(false);
    expect(canAccessAdminUsers("SALES")).toBe(false);
    expect(canAccessAdminUsers("TECHNICIAN")).toBe(false);
  });
});