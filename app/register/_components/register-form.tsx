"use client";

import Link from "next/link";
import { useActionState } from "react";

import {
  signUpWithEmail,
  type RegisterActionState,
} from "@/app/register/actions";
import { FormMessage } from "@/components/form-message";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState: RegisterActionState = {
  success: false,
  message: "",
};

export function RegisterForm() {
  const [state, action, pending] = useActionState(
    signUpWithEmail,
    initialState,
  );

  return (
    <form
      action={action}
      className="bg-card text-card-foreground flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Crea account</h1>
        <p className="text-muted-foreground text-sm">
          Registrati per accedere a MastroHub.
        </p>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" name="name" type="text" autoComplete="name" required />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Registrazione..." : "Registrati"}
      </Button>

      <FormMessage success={state.success} message={state.message} />

      <Link
        href="/login"
        className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
      >
        Hai già un account? Accedi
      </Link>
    </form>
  );
}
