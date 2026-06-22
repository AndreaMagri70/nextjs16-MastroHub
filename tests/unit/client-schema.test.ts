import { describe, expect, it } from "vitest";

import { CreateClientSchema } from "@/schemas/client-schema";

describe("CreateClientSchema", () => {
  it("accetta un cliente valido", () => {
    const result = CreateClientSchema.safeParse({
      type: "BUSINESS",
      name: "Edil Rossi SRL",
      email: "info@example.com",
      phone: "",
      taxCode: "",
      vatNumber: "",
      address: "",
      notes: "",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta un nome troppo corto", () => {
    const result = CreateClientSchema.safeParse({
      type: "PRIVATE",
      name: "A",
      email: "",
      phone: "",
      taxCode: "",
      vatNumber: "",
      address: "",
      notes: "",
    });

    expect(result.success).toBe(false);
  });
});