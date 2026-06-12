"use client";

import { useActionState } from "react";

import { FormMessage } from "@/components/form-message";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createQuote, type QuoteActionState } from "@/actions/quote-actions";

type QuoteFormClient = {
  id: string;
  name: string;
};

type QuoteFormProps = {
  clients: QuoteFormClient[];
};

const initialState: QuoteActionState = {
  success: false,
  message: "",
};

export function QuoteForm({ clients }: QuoteFormProps) {
  const [state, action, pending] = useActionState(createQuote, initialState);

  return (
    <form
      action={action}
      className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground"
    >
      <div>
        <h2 className="text-lg font-semibold">Nuovo preventivo</h2>
        <p className="text-sm text-muted-foreground">
          Crea un preventivo demo con una riga.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="clientId">Cliente</Label>
        <Select name="clientId" required>
          <SelectTrigger id="clientId" className="w-full">
            <SelectValue placeholder="Seleziona cliente" />
          </SelectTrigger>
          <SelectContent>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Titolo</Label>
        <Input id="title" name="title" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="itemDescription">Descrizione riga</Label>
        <Input id="itemDescription" name="itemDescription" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="grid gap-2">
          <Label htmlFor="quantity">Quantità</Label>
          <Input
            id="quantity"
            name="quantity"
            defaultValue="1.00"
            inputMode="decimal"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="unitPrice">Prezzo unitario</Label>
          <Input id="unitPrice" name="unitPrice" inputMode="decimal" required />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="taxRate">IVA %</Label>
          <Input
            id="taxRate"
            name="taxRate"
            defaultValue="22.00"
            inputMode="decimal"
            required
          />
        </div>
      </div>

      <Button type="submit" disabled={pending || clients.length === 0}>
        {pending ? "Creazione..." : "Crea preventivo"}
      </Button>

      {clients.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Crea prima almeno un cliente.
        </p>
      ) : null}

      <FormMessage success={state.success} message={state.message} />
    </form>
  );
}