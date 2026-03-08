import { Reservation, Room } from "@/lib/generated/prisma/client";
import { generateTimeSlots, TimeSlot } from "@/lib/reservation-utils";
import { Clock } from "lucide-react";

interface TimeGridProps {
  rooms: Room[];
  reservations: Reservation[];
  roomId: string | null;
  date: Date;
  onSlotClick: (roomId: string, time: string) => void;
  onReservationClick: (reservationId: string) => void;
}

export default function TimeGrid({
  rooms,
  reservations,
  roomId,
  date,
  onSlotClick,
  onReservationClick,
}: TimeGridProps) {
  const roomsToShow = roomId ? rooms.filter((r) => r.id === roomId) : rooms;

  if (!rooms || rooms.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        Nenhuma sala encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-available-muted border border-available/30" />
          Disponível
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm bg-occupied-muted border border-occupied/30" />
          Ocupado
        </span>
      </div>

      {roomsToShow.map((room) => {
        const slots = generateTimeSlots(reservations, room.id, date);

        return (
          <div key={room.id} className="animate-fade-in">
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {room.name}
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-1.5">
              {slots.map((slot) => (
                <SlotCell
                  key={`${room.id}-${slot.time}`}
                  slot={slot}
                  roomId={room.id}
                  onSlotClick={onSlotClick}
                  onReservationClick={onReservationClick}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function SlotCell({
  slot,
  roomId,
  onSlotClick,
  onReservationClick,
}: {
  slot: TimeSlot;
  roomId: string;
  onSlotClick: (roomId: string, time: string) => void;
  onReservationClick: (id: string) => void;
}) {
  const isOccupied = !slot.available;

  return (
    <button
      onClick={() => {
        if (isOccupied && slot.reservation) {
          onReservationClick(slot.reservation.id);
        } else {
          onSlotClick(roomId, slot.time);
        }
      }}
      className={`group relative flex flex-col items-center justify-center rounded-md border px-1 py-2 text-xs transition-all ${
        isOccupied
          ? "border-occupied/20 bg-occupied-muted text-occupied hover:bg-occupied/10"
          : "border-available/20 bg-available-muted text-available hover:bg-available/10 hover:border-available/40"
      }`}
    >
      <Clock className="h-3 w-3 mb-0.5 opacity-60" />
      <span className="font-medium">{slot.time}</span>

      {isOccupied && slot.reservation && (
        <span className="mt-0.5 truncate w-full text-center text-[10px] opacity-70">
          {slot.reservation.title.slice(0, 10)}…
        </span>
      )}
    </button>
  );
}
