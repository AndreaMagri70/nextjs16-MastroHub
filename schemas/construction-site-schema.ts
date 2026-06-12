import { z } from "zod";

const OptionalTextSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value ?? "");

const OptionalDateSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value ?? "")
  .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
    message: "Inserisci una data valida.",
  });

export const CreateConstructionSiteFromQuoteSchema = z.object({
  quoteId: z.string().min(1, "Seleziona un preventivo."),
  title: z
    .string()
    .trim()
    .min(2, "Il titolo deve contenere almeno 2 caratteri."),
  address: OptionalTextSchema,
  startDate: OptionalDateSchema,
  endDate: OptionalDateSchema,
  notes: OptionalTextSchema,
});

export type CreateConstructionSiteFromQuoteInput = z.infer<
  typeof CreateConstructionSiteFromQuoteSchema
>;