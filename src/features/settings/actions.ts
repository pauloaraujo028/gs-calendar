"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getRooms() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Não autorizado");

  return db.room.findMany({
    orderBy: { createdAt: "asc" },
  });
}

export async function createRoom() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Não autorizado");
  }

  await db.room.create({
    data: {
      name: "Nova Sala",
      capacity: 6,
      resources: [],
    },
  });

  revalidatePath("/dashboard/settings");
}

export async function updateRoom(
  roomId: string,
  data: {
    name: string;
    capacity: number;
    resources: string[];
  },
) {
  await db.room.update({
    where: { id: roomId },
    data,
  });

  revalidatePath("/dashboard/settings");
}

export async function deleteRoom(roomId: string) {
  await db.room.delete({
    where: { id: roomId },
  });

  revalidatePath("/dashboard/settings");
}
