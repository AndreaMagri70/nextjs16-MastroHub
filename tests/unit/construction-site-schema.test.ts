import { describe, expect, it } from "vitest";

import { CreateConstructionSiteFromQuoteSchema } from "@/schemas/construction-site-schema";

describe("CreateConstructionSiteFromQuoteSchema", () => {
  it("accetta un cantiere valido", () => {
    const result = CreateConstructionSiteFromQuoteSchema.safeParse({
      quoteId: "quote_123",
      title: "Cantiere bagno",
      address: "Via Roma 1",
      startDate: "2026-06-20",
      endDate: "2026-06-30",
      notes: "",
    });

    expect(result.success).toBe(true);
  });

  it("accetta date vuote", () => {
    const result = CreateConstructionSiteFromQuoteSchema.safeParse({
      quoteId: "quote_123",
      title: "Cantiere bagno",
      address: "",
      startDate: "",
      endDate: "",
      notes: "",
    });

    expect(result.success).toBe(true);
  });

  it("rifiuta una data non valida", () => {
    const result = CreateConstructionSiteFromQuoteSchema.safeParse({
      quoteId: "quote_123",
      title: "Cantiere bagno",
      address: "",
      startDate: "non-una-data",
      endDate: "",
      notes: "",
    });

    expect(result.success).toBe(false);
  });
});