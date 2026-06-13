"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type AuthActionState = {
  success: boolean;
  message: string;
};

export async function signInWithEmail(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      success: false,
      message: "Credenziali non valide.",
    };
  }

  if (!email || !password) {
    return {
      success: false,
      message: "Email e password sono obbligatorie.",
    };
  }

  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message ?? "Accesso non riuscito.",
    };
  }

  redirect("/dashboard");
}
