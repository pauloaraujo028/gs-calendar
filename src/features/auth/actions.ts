"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";
import { loginSchema, registerSchema } from "./schemas";

export async function Login(data: z.infer<typeof loginSchema>) {
  const validatedFields = loginSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Falha ao fazer login, verifique os dados digitados",
    };
  }

  const { email, password } = validatedFields.data;

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers(),
    });
  } catch {
    return { error: "Email ou senha incorretos" };
  }
  redirect("/dashboard");
}

export async function Register(data: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Falha ao fazer login, verifique os dados digitados",
    };
  }

  const { name, email, password } = validatedFields.data;

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch {
    return { error: "Email ou senha incorretos" };
  }
}
