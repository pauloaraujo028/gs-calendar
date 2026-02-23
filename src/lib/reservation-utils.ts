import { Reservation } from "./generated/prisma/client";

export const BUSINESS_HOURS = { start: 7, end: 17 };
export const MIN_DURATION_MINUTES = 30;

export type TimeSlot = {
  time: string;
  available: boolean;
  reservation?: Reservation;
};

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export type ConflictResult = {
  hasConflict: boolean;
  conflictingReservation?: Reservation;
};

/**
 * Converte "08:30" + data base em Date
 */
function buildDate(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

/**
 * Verifica conflito de horário (PRISMA)
 */
export function checkTimeConflict(
  reservations: Reservation[],
  roomId: string,
  date: Date,
  startTime: string,
  endTime: string,
  excludeId?: string,
): ConflictResult {
  const start = buildDate(date, startTime);
  const end = buildDate(date, endTime);

  const conflicting = reservations.find((r) => {
    if (r.roomId !== roomId) return false;
    if (excludeId && r.id === excludeId) return false;

    return r.startTime < end && r.endTime > start;
  });

  return {
    hasConflict: !!conflicting,
    conflictingReservation: conflicting,
  };
}

/**
 * Validação de intervalo
 */
export function isValidTimeRange(startTime: string, endTime: string): boolean {
  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  if (end <= start) return false;
  if (end - start < MIN_DURATION_MINUTES) return false;
  if (start < BUSINESS_HOURS.start * 60 || end > BUSINESS_HOURS.end * 60) {
    return false;
  }

  return true;
}

/**
 * Geração do grid (30min)
 */
export function generateTimeSlots(
  reservations: Reservation[],
  roomId: string,
  selectedDate: Date,
): TimeSlot[] {
  const slots: TimeSlot[] = [];

  for (let h = BUSINESS_HOURS.start; h < BUSINESS_HOURS.end; h++) {
    for (let m = 0; m < 60; m += 30) {
      const time = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const slotMinutes = timeToMinutes(time);

      const reservation = reservations.find((r) => {
        if (r.roomId !== roomId) return false;

        if (r.status !== "ACTIVE") return false;

        const sameDay =
          r.startTime.toDateString() === selectedDate.toDateString();
        if (!sameDay) return false;

        const rStart = r.startTime.getHours() * 60 + r.startTime.getMinutes();
        const rEnd = r.endTime.getHours() * 60 + r.endTime.getMinutes();

        return slotMinutes >= rStart && slotMinutes < rEnd;
      });

      slots.push({
        time,
        available: !reservation,
        reservation,
      });
    }
  }

  return slots;
}

/**
 * Helpers de UI
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString("pt-BR");
}

export function getTimeOptions(): string[] {
  const options: string[] = [];

  for (let h = BUSINESS_HOURS.start; h <= BUSINESS_HOURS.end; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === BUSINESS_HOURS.end && m > 0) break;

      options.push(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`,
      );
    }
  }

  return options;
}
