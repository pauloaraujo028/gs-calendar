export interface Room {
  id: string;
  name: string;
  capacity: number;
  resources: string[];
}

export interface Reservation {
  id: string;
  roomId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  title: string;
  notes?: string;
  responsible: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  reservation?: Reservation;
}

export interface ReservationFormData {
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  title: string;
  notes?: string;
  responsible: string;
}

export interface ConflictResult {
  hasConflict: boolean;
  conflictingReservation?: Reservation;
}
