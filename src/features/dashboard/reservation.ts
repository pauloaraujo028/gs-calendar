"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface ReservationInput {
  id?: string;
  roomId: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
}

export async function saveReservationAction(data: ReservationInput) {
  const session = await auth.api.getSession();
  if (!session) throw new Error("Não autorizado");

  const conflict = await db.reservation.findFirst({
    where: {
      roomId: data.roomId,
      status: "ACTIVE",
      ...(data.id ? { id: { not: data.id } } : {}),
      AND: [
        { startTime: { lt: data.endTime } },
        { endTime: { gt: data.startTime } },
      ],
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
        startTime: data.startTime,
        endTime: data.endTime,
      },
    });
  } else {
    await db.reservation.create({
      data: {
        title: data.title,
        description: data.description,
        roomId: data.roomId,
        startTime: data.startTime,
        endTime: data.endTime,
        userId: session.user.id,
      },
    });
  }

  revalidatePath("/");
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
