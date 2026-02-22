import { z } from "zod";

export const reservationSchema = z.object({
  id: z.string().optional(),
  roomId: z.string().min(1),
  date: z.string(),
  time: z.string(),
  title: z.string().min(3, "Título obrigatório"),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
