import { Reservation, Room } from "@/lib/generated/prisma/client";
import { BUSINESS_HOURS } from "@/lib/reservation-utils";
import { useMemo } from "react";

interface WeeklyCalendarProps {
  rooms: Room[];
  reservations: Reservation[];
  date: Date;
  roomId: string | null;
  onReservationClick: (reservation: Reservation) => void;
  onSlotClick: (roomId: string, time: string, date: string) => void;
}

const HOURS = Array.from(
  { length: BUSINESS_HOURS.end - BUSINESS_HOURS.start },
  (_, i) => BUSINESS_HOURS.start + i,
);

function dateToISO(date: Date) {
  return date.toISOString().split("T")[0];
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function minutesFromDate(date: Date) {
  return date.getHours() * 60 + date.getMinutes();
}

function getWeekDays(date: Date) {
  const d = new Date(date);
  d.setHours(12, 0, 0, 0);

  const day = d.getDay();
  const monday = new Date(d);
  monday.setDate(d.getDate() - ((day + 6) % 7));

  const today = dateToISO(new Date());
  const dayNames = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

  return Array.from({ length: 7 }, (_, i) => {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const iso = dateToISO(current);

    return {
      date: iso,
      label: `${current.getDate()}/${current.getMonth() + 1}`,
      dayName: dayNames[i],
      isToday: iso === today,
    };
  });
}

export default function WeeklyCalendar({
  rooms,
  reservations,
  date,
  roomId,
  onReservationClick,
  onSlotClick,
}: WeeklyCalendarProps) {
  const weekDays = useMemo(() => getWeekDays(date), [date]);

  const roomsToShow = roomId ? rooms.filter((r) => r.id === roomId) : rooms;

  const resMap = useMemo(() => {
    const map: Record<string, Reservation[]> = {};
    const weekSet = new Set(weekDays.map((d) => d.date));

    reservations.forEach((r) => {
      const resDate = dateToISO(r.startTime);
      if (!weekSet.has(resDate)) return;
      if (roomId && r.roomId !== roomId) return;

      const key = `${resDate}-${r.roomId}`;
      (map[key] ||= []).push(r);
    });

    return map;
  }, [reservations, weekDays, roomId]);

  const hourHeight = 60;

  if (reservations.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center text-sm text-muted-foreground">
        Nenhuma reserva para este dia.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {roomsToShow.map((room) => (
        <div key={room.id} className="animate-fade-in">
          {roomsToShow.length > 1 && (
            <h3 className="mb-2 text-sm font-semibold text-foreground">
              {room.name}
            </h3>
          )}
          <div className="overflow-x-auto rounded-lg border border-border bg-card">
            <div className="min-w-175">
              <div
                className="grid border-b border-border"
                style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}
              >
                <div className="border-r border-border p-2" />
                {weekDays.map((day) => (
                  <div
                    key={day.date}
                    className={`border-r border-border p-2 text-center last:border-r-0 ${
                      day.isToday ? "bg-primary/10" : ""
                    }`}
                  >
                    <div className="text-xs font-medium text-muted-foreground">
                      {day.dayName}
                    </div>
                    <div
                      className={`text-sm font-semibold ${
                        day.isToday ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {day.label}
                    </div>
                  </div>
                ))}
              </div>

              <div
                className="relative grid"
                style={{ gridTemplateColumns: "56px repeat(7, 1fr)" }}
              >
                <div className="border-r border-border">
                  {HOURS.map((h) => (
                    <div
                      key={h}
                      className="flex items-start justify-end border-b border-border pr-2 text-[10px] text-muted-foreground"
                      style={{ height: hourHeight }}
                    >
                      <span className="-mt-1.5">
                        {String(h).padStart(2, "0")}:00
                      </span>
                    </div>
                  ))}
                </div>

                {weekDays.map((day) => {
                  const dayReservations =
                    resMap[`${day.date}-${room.id}`] || [];
                  return (
                    <div
                      key={day.date}
                      className={`relative border-r border-border last:border-r-0 ${
                        day.isToday ? "bg-primary/5" : ""
                      }`}
                    >
                      {HOURS.map((h) => (
                        <div
                          key={h}
                          className="border-b border-border cursor-pointer hover:bg-accent/40 transition-colors"
                          style={{ height: hourHeight }}
                          onClick={() =>
                            onSlotClick(
                              room.id,
                              `${String(h).padStart(2, "0")}:00`,
                              day.date,
                            )
                          }
                        />
                      ))}

                      {dayReservations.map((res) => {
                        const startMin =
                          minutesFromDate(res.startTime) -
                          BUSINESS_HOURS.start * 60;
                        const endMin =
                          minutesFromDate(res.endTime) -
                          BUSINESS_HOURS.start * 60;
                        const top = (startMin / 60) * hourHeight;
                        const height = ((endMin - startMin) / 60) * hourHeight;

                        return (
                          <button
                            key={res.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              onReservationClick(res);
                            }}
                            className="absolute left-0.5 right-0.5 rounded-md bg-primary/20 border border-primary/30 px-1.5 py-0.5 text-left transition-all hover:bg-primary/30 hover:shadow-sm overflow-hidden z-10"
                            style={{ top, height, minHeight: 20 }}
                          >
                            <div className="text-[10px] font-semibold text-primary truncate leading-tight">
                              {res.title}
                            </div>
                            {height > 30 && (
                              <div className="text-[9px] text-muted-foreground truncate">
                                {formatTime(res.startTime)} –
                                {formatTime(res.endTime)}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
