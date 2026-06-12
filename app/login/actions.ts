"use server";

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function signInWithEmail(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    throw new Error("Credenziali non valide.");
  }

  if (!email || !password) {
    throw new Error("Email e password sono obbligatorie.");
  }

  const { error } = await auth.signIn.email({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  redirect("/dashboard");
}