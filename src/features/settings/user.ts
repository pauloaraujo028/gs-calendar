"use server";

import { auth } from "@/lib/auth";
import { UserRole } from "@/lib/generated/prisma/client";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { createUserSchema } from "./schemas";

async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Não autorizado");
  }
}

export async function getUsers() {
  await requireAdmin();

  return db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
    orderBy: { name: "asc" },
  });
}

export async function createUser(data: z.infer<typeof createUserSchema>) {
  await requireAdmin();

  const validatedFields = createUserSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Falha ao criar usuário, verifique os dados digitados",
    };
  }

  const { name, email, password } = validatedFields.data;

  if (!password) {
    return {
      error: "Falha ao criar usuário, verifique os dados digitados",
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch {
    return { error: "Erro ao criar usuário" };
  }
}

export async function updateUser(
  id: string,
  data: { name: string; email: string; role: UserRole },
) {
  await requireAdmin();

  await db.user.update({
    where: { id },
    data,
  });

  revalidatePath("/dashboard/settings");
}

export async function deleteUser(id: string) {
  await requireAdmin();

  await db.user.delete({ where: { id } });

  revalidatePath("/dashboard/settings");
}
