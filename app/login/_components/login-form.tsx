"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signInWithEmail, type AuthActionState } from "@/app/login/actions";
import { FormMessage } from "@/components/form-message";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initialState: AuthActionState = {
  success: false,
  message: "",
};

export function LoginForm() {
  const [state, action, pending] = useActionState(
    signInWithEmail,
    initialState,
  );

  return (
    <form
      action={action}
      className="bg-card text-card-foreground flex w-full max-w-sm flex-col gap-4 rounded-lg border p-6 shadow-sm"
    >
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Accedi</h1>
        <p className="text-muted-foreground text-sm">
          Usa le credenziali del tuo account MastroHub.
        </p>
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
          autoComplete="current-password"
          required
        />
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Accesso..." : "Entra"}
      </Button>

      <FormMessage success={state.success} message={state.message} />

      <Link
        href="/register"
        className={cn(buttonVariants({ variant: "link" }), "h-auto p-0")}
      >
        Non hai un account? Registrati
      </Link>
    </form>
  );
}
