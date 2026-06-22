import { Prisma } from "@/lib/generated/prisma/client";

export function calculateQuoteTotals({
  quantity,
  unitPrice,
  taxRate,
}: {
  quantity: string;
  unitPrice: string;
  taxRate: string;
}) {
  const quantityDecimal = new Prisma.Decimal(quantity);
  const unitPriceDecimal = new Prisma.Decimal(unitPrice);
  const taxRateDecimal = new Prisma.Decimal(taxRate);

  const subtotal = quantityDecimal.mul(unitPriceDecimal);
  const taxTotal = subtotal.mul(taxRateDecimal).div(100);
  const total = subtotal.add(taxTotal);

  return {
    quantity: quantityDecimal,
    unitPrice: unitPriceDecimal,
    taxRate: taxRateDecimal,
    subtotal,
    taxTotal,
    total,
  };
}