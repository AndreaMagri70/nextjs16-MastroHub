"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export type RegisterActionState = {
  success: boolean;
  message: string;
};

export async function signUpWithEmail(
  _prevState: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return {
      success: false,
      message: "Dati di registrazione non validi.",
    };
  }

  if (!name || !email || !password) {
    return {
      success: false,
      message: "Nome, email e password sono obbligatori.",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      message: "La password deve contenere almeno 8 caratteri.",
    };
  }

  const { error } = await auth.signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    return {
      success: false,
      message: error.message ?? "Registrazione non riuscita.",
    };
  }

  redirect("/dashboard");
}
