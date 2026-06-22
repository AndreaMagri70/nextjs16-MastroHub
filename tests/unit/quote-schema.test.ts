import { describe, expect, it } from "vitest";

import { CreateQuoteSchema } from "@/schemas/quote-schema";

describe("CreateQuoteSchema", () => {
  it("accetta un preventivo valido", () => {
    const result = CreateQuoteSchema.safeParse({
      clientId: "client_123",
      title: "Preventivo bagno",
      itemDescription: "Manodopera",
      quantity: "2.00",
      unitPrice: "100.00",
      taxRate: "22.00",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta importi non numerici", () => {
    const result = CreateQuoteSchema.safeParse({
      clientId: "client_123",
      title: "Preventivo bagno",
      itemDescription: "Manodopera",
      quantity: "due",
      unitPrice: "100.00",
      taxRate: "22.00",
    });

    expect(result.success).toBe(false);
  });

  it("rifiuta più di due decimali", () => {
    const result = CreateQuoteSchema.safeParse({
      clientId: "client_123",
      title: "Preventivo bagno",
      itemDescription: "Manodopera",
      quantity: "1.000",
      unitPrice: "100.00",
      taxRate: "22.00",
    });

    expect(result.success).toBe(false);
  });
});