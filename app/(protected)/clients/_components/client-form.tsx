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

import {
  createClient,
  type ClientActionState,
} from "@/actions/client-actions";

const initialState: ClientActionState = {
  success: false,
  message: "",
};

export function ClientForm() {
  const [state, action, pending] = useActionState(createClient, initialState);

  return (
    <form
      action={action}
      className="grid gap-4 rounded-lg border bg-card p-4 text-card-foreground"
    >
      <div>
        <h2 className="text-lg font-semibold">Nuovo cliente</h2>
        <p className="text-sm text-muted-foreground">
          Crea un cliente demo collegato al tuo utente.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Tipo</Label>
        <Select name="type" defaultValue="BUSINESS">
          <SelectTrigger id="type" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="BUSINESS">Azienda</SelectItem>
            <SelectItem value="PRIVATE">Privato</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Telefono</Label>
        <Input id="phone" name="phone" />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creazione..." : "Crea cliente"}
      </Button>

      <FormMessage success={state.success} message={state.message} />
    </form>
  );
}