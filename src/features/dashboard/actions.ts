"use server";

import { db } from "@/lib/prisma";

export async function getRooms() {
  const rooms = await db.room.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return rooms;
}

export async function getReservations() {
  const rooms = await db.reservation.findMany({
    include: {
      room: true,
      user: true,
    },
  });

  return rooms;
}
