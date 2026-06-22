import { describe, expect, it } from "vitest";

import { calculateQuoteTotals } from "@/lib/quote-calculations";

describe("calculateQuoteTotals", () => {
  it("calcola subtotal, IVA e totale", () => {
    const result = calculateQuoteTotals({
      quantity: "2.00",
      unitPrice: "100.00",
      taxRate: "22.00",
    });

    expect(result.subtotal.toString()).toBe("200");
    expect(result.taxTotal.toString()).toBe("44");
    expect(result.total.toString()).toBe("244");
  });

  it("gestisce importi decimali", () => {
    const result = calculateQuoteTotals({
      quantity: "1.50",
      unitPrice: "80.00",
      taxRate: "10.00",
    });

    expect(result.subtotal.toString()).toBe("120");
    expect(result.taxTotal.toString()).toBe("12");
    expect(result.total.toString()).toBe("132");
  });
});