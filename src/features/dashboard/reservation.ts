"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

interface ReservationInput {
  id?: string;
  roomId: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
}

export async function saveReservationAction(data: ReservationInput) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) throw new Error("Não autorizado");

  const startTime = new Date(data.startTime);
  const endTime = new Date(data.endTime);

  const conflict = await db.reservation.findFirst({
    where: {
      roomId: data.roomId,
      status: "ACTIVE",
      ...(data.id ? { id: { not: data.id } } : {}),
      AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
    },
  });

  if (conflict) {
    throw new Error("Já existe uma reserva nesse horário");
  }

  if (data.id) {
    await db.reservation.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
        roomId: data.roomId,
        startTime,
        endTime,
      },
    });
  } else {
    await db.reservation.create({
      data: {
        title: data.title,
        description: data.description,
        roomId: data.roomId,
        startTime,
        endTime,
        userId: session.user.id,
      },
    });
  }

  revalidatePath("/dashboard");
}

export async function cancelReservationAction(id: string) {
  const session = await auth.api.getSession();
  if (!session) throw new Error("Não autorizado");

  await db.reservation.update({
    where: { id },
    data: { status: "CANCELLED" },
  });

  revalidatePath("/");
}
