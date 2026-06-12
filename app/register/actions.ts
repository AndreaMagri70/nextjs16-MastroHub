"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function signUpWithEmail(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Dati di registrazione non validi.");
  }

  if (!name || !email || !password) {
    throw new Error("Nome, email e password sono obbligatori.");
  }

  if (password.length < 8) {
    throw new Error("La password deve contenere almeno 8 caratteri.");
  }

  const { error } = await auth.signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}