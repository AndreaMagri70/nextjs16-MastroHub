import { z } from "zod";

const DecimalStringSchema = z
  .string()
  .trim()
  .regex(/^\d+(\.\d{1,2})?$/, "Inserisci un numero valido con massimo 2 decimali.");

export const CreateQuoteSchema = z.object({
  clientId: z.string().min(1, "Seleziona un cliente."),
  title: z.string().trim().min(2, "Il titolo deve contenere almeno 2 caratteri."),
  itemDescription: z
    .string()
    .trim()
    .min(2, "La descrizione deve contenere almeno 2 caratteri."),
  quantity: DecimalStringSchema,
  unitPrice: DecimalStringSchema,
  taxRate: DecimalStringSchema,
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;