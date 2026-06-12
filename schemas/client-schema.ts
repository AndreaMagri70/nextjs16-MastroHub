import { z } from "zod";

const OptionalTextSchema = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => value ?? "");

export const CreateClientSchema = z.object({
  type: z.enum(["PRIVATE", "BUSINESS"]),
  name: z.string().trim().min(2, "Il nome deve contenere almeno 2 caratteri."),
  email: z
    .string()
    .trim()
    .email("Inserisci una email valida.")
    .optional()
    .nullable()
    .or(z.literal(""))
    .transform((value) => value ?? ""),
  phone: OptionalTextSchema,
  taxCode: OptionalTextSchema,
  vatNumber: OptionalTextSchema,
  address: OptionalTextSchema,
  notes: OptionalTextSchema,
});

export type CreateClientInput = z.infer<typeof CreateClientSchema>;