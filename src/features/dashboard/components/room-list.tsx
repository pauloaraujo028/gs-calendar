"use client";

import { Room } from "@/lib/generated/prisma/client";
import { Bluetooth, Mic, Tv, Users, Webcam, Wind } from "lucide-react";

const resourceIcons: Record<string, React.ReactNode> = {
  TV: <Tv className="h-3.5 w-3.5" />,
  "Ar-condicionado": <Wind className="h-3.5 w-3.5" />,
  Webcam: <Webcam className="h-3.5 w-3.5" />,
  "Microfone fixo": <Mic className="h-3.5 w-3.5" />,
  "Microfone bluetooth": <Bluetooth className="h-3.5 w-3.5" />,
};

interface RoomCardProps {
  room: Room;
  reservationCount: number;
  onSelect: (roomId: string) => void;
  selected?: boolean;
}

function RoomCard({
  room,
  reservationCount,
  onSelect,
  selected,
}: RoomCardProps) {
  return (
    <button
      onClick={() => onSelect(room.id)}
      className={`w-full rounded-lg border p-4 text-left transition-all hover:shadow-md ${
        selected
          ? "border-primary bg-accent shadow-sm"
          : "border-border bg-card hover:border-primary/40"
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-card-foreground">{room.name}</h3>

          <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{room.capacity} pessoas</span>
          </div>
        </div>

        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
          {reservationCount} reserva{reservationCount !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {room.resources.map((r) => (
          <span
            key={r}
            className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
          >
            {resourceIcons[r]}
            {r}
          </span>
        ))}
      </div>
    </button>
  );
}

interface RoomListProps {
  rooms: Room[];
  selectedRoom: string | null;
  onSelectRoom: (roomId: string) => void;
  reservationCounts: Record<string, number>;
}

export default function RoomList({
  rooms,
  selectedRoom,
  onSelectRoom,
  reservationCounts,
}: RoomListProps) {
  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
        Salas
      </h2>

      {rooms.map((room) => (
        <RoomCard
          key={room.id}
          room={room}
          reservationCount={reservationCounts[room.id] ?? 0}
          onSelect={onSelectRoom}
          selected={selectedRoom === room.id}
        />
      ))}
    </div>
  );
}
