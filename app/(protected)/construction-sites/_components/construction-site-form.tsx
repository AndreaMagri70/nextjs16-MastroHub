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
import { Textarea } from "@/components/ui/textarea";

import {
  createConstructionSiteFromQuote,
  type ConstructionSiteActionState,
} from "@/actions/construction-site-actions";

type AcceptedQuote = {
  id: string;
  number: string;
  title: string;
  clientName: string;
};

type ConstructionSiteFormProps = {
  acceptedQuotes: AcceptedQuote[];
};

const initialState: ConstructionSiteActionState = {
  success: false,
  message: "",
};

export function ConstructionSiteForm({
  acceptedQuotes,
}: ConstructionSiteFormProps) {
  const [state, action, pending] = useActionState(
    createConstructionSiteFromQuote,
    initialState,
  );

  return (
    <form
      action={action}
      className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground"
    >
      <div>
        <h2 className="text-lg font-semibold">Nuovo cantiere</h2>
        <p className="text-sm text-muted-foreground">
          Crea un cantiere da un preventivo accettato.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="quoteId">Preventivo accettato</Label>
        <Select name="quoteId" required>
          <SelectTrigger id="quoteId" className="w-full">
            <SelectValue placeholder="Seleziona preventivo" />
          </SelectTrigger>
          <SelectContent>
            {acceptedQuotes.map((quote) => (
              <SelectItem key={quote.id} value={quote.id}>
                {quote.number} - {quote.clientName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="title">Titolo cantiere</Label>
        <Input id="title" name="title" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="address">Indirizzo</Label>
        <Input id="address" name="address" />
      </div>


      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="startDate">Data inizio</Label>
          <Input id="startDate" name="startDate" type="date" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="endDate">Data fine</Label>
          <Input id="endDate" name="endDate" type="date" />
        </div>
      </div>


      <div className="grid gap-2">
        <Label htmlFor="notes">Note</Label>
        <Textarea id="notes" name="notes" rows={3} />
      </div>

      <Button type="submit" disabled={pending || acceptedQuotes.length === 0}>
        {pending ? "Creazione..." : "Crea cantiere"}
      </Button>

      {acceptedQuotes.length === 0 && !state.success ? (
        <p className="text-sm text-muted-foreground">
          Non ci sono preventivi accettati disponibili.
        </p>
      ) : null}

      <FormMessage 
        success={state.success} 
        message={state.message} 
      />
    </form>
  );
}