import { ReservationWithUser } from "@/features/dashboard/types";
import { Room } from "@/lib/generated/prisma/client";
import { Clock, MessageSquare, Presentation, User } from "lucide-react";

interface ReservationListProps {
  rooms: Room[];
  reservations: ReservationWithUser[];
  date: Date;
  roomId: string | null;
  onReservationClick: (reservation: ReservationWithUser) => void;
}

function isSameDay(date: Date, dateStr: string) {
  return date.toISOString().startsWith(dateStr);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ReservationList({
  rooms,
  reservations,
  date,
  roomId,
  onReservationClick,
}: ReservationListProps) {
  const filtered = reservations
    .filter(
      (r) =>
        isSameDay(r.startTime, date.toISOString().split("T")[0]) &&
        (!roomId || r.roomId === roomId),
    )
    .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());

  if (filtered.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        Nenhuma reserva para este dia.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {filtered.map((r) => {
        const room = rooms.find((rm) => rm.id === r.roomId);

        return (
          <button
            key={r.id}
            onClick={() => onReservationClick(r)}
            className="w-full animate-fade-in rounded-lg border border-border bg-card p-3 text-left transition-all hover:shadow-md hover:border-primary/30"
          >
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-card-foreground truncate">
                  {r.title}
                </p>
                <div className="flex items-center gap-3 text-muted-foreground">
                  {r.description && (
                    <span className="flex items-center gap-1 text-xs">
                      <MessageSquare className="size-3" />
                      {r.description.length > 30
                        ? `${r.description.substring(0, 30)}…`
                        : r.description}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Presentation className="size-3" />
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">
                    Sala <span className="text-primary">{room?.name}</span>
                  </p>
                </div>
              </div>
              <span className="ml-2 flex shrink-0 items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                <Clock className="size-3" />
                {formatTime(r.startTime)} – {formatTime(r.endTime)}
              </span>
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              {r.user?.name && (
                <span className="flex items-center gap-1">
                  <User className="size-3" />
                  Reservado por
                  <strong className="capitalize">{r.user.name}</strong>
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
