import { Reservation } from "@/lib/generated/prisma/client";

export type ReservationWithUser = Reservation & {
  user: { name: string } | null;
};
