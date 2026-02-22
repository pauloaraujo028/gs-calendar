"use client";

import { useState } from "react";

import ReservationForm from "@/components/reservatio-form";
import ReservationList from "@/components/reservation-list";
import TimeGrid from "@/components/time-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import WeeklyCalendar from "@/components/weekly-calendar";
import { Reservation, Room } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/reservation-utils";
import { formatDateInput } from "@/lib/utils";
import { Calendar, CalendarDays, LayoutGrid, Plus } from "lucide-react";
import RoomList from "./room-list";

type Props = {
  rooms: Room[];
  reservations: Reservation[];
};

const Content = ({ rooms, reservations }: Props) => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editingReservation, setEditingReservation] =
    useState<Reservation | null>(null);
  const [defaultSlot, setDefaultSlot] = useState<{
    roomId?: string;
    time?: string;
  }>({});
  const [view, setView] = useState<"grid" | "list" | "week">("grid");

  const reservationCounts: Record<string, number> = {};

  function handleSlotClick(roomId: string, time: string, date?: string) {
    setDefaultSlot({ roomId, time });
    if (date) setSelectedDate(new Date(date));
    setEditingReservation(null);
    setFormOpen(true);
  }

  function handleReservationClick(resOrId: string | Reservation) {
    const res =
      typeof resOrId === "string"
        ? reservations.find((r) => r.id === resOrId) || null
        : resOrId;
    setEditingReservation(res);
    setDefaultSlot({});
    setFormOpen(true);
  }

  function handleNewReservation() {
    setEditingReservation(null);
    setDefaultSlot({});
    setFormOpen(true);
  }

  const todayCount = reservations.filter(
    (r) => r.startTime.toDateString() === selectedDate.toDateString(),
  ).length;

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex ">
            <div className="flex items-center gap-3">
              <Input
                type="date"
                value={formatDateInput(selectedDate)}
                onChange={(e) => {
                  const [year, month, day] = e.target.value.split("-");
                  setSelectedDate(
                    new Date(
                      Number(year),
                      Number(month) - 1,
                      Number(day),
                      12, // meio-dia evita bug de fuso
                    ),
                  );
                }}
                className="w-auto"
              />
              <span className="text-sm text-muted-foreground">
                {formatDate(selectedDate)} ·{" "}
                <strong className="text-foreground">{todayCount}</strong>{" "}
                reserva
                {todayCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 rounded-lg border border-border p-0.5 w-fit">
              <button
                onClick={() => setView("grid")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "grid"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="h-3.5 w-3.5 inline mr-1" />
                Grade
              </button>
              <button
                onClick={() => setView("list")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "list"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CalendarDays className="h-3.5 w-3.5 inline mr-1" />
                Lista
              </button>
              <button
                onClick={() => setView("week")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  view === "week"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Calendar className="h-3.5 w-3.5 inline mr-1" />
                Semana
              </button>
            </div>

            <Button
              onClick={handleNewReservation}
              size="sm"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Reserva</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          {/* Sidebar */}
          <aside>
            <RoomList
              rooms={rooms}
              selectedRoom={selectedRoom}
              onSelectRoom={(id) =>
                setSelectedRoom(selectedRoom === id ? null : id)
              }
              reservationCounts={reservationCounts}
            />
          </aside>

          {/* Main content */}
          <section className="min-w-0">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {view === "grid"
                ? "Agenda por Horário"
                : view === "list"
                  ? "Reservas do Dia"
                  : "Visão Semanal"}
            </h2>

            {view === "grid" ? (
              <TimeGrid
                rooms={rooms}
                reservations={reservations}
                roomId={selectedRoom}
                date={selectedDate}
                onSlotClick={handleSlotClick}
                onReservationClick={(id) => handleReservationClick(id)}
              />
            ) : view === "list" ? (
              <ReservationList
                rooms={rooms}
                reservations={reservations}
                date={selectedDate}
                roomId={selectedRoom}
                onReservationClick={handleReservationClick}
              />
            ) : (
              <WeeklyCalendar
                rooms={rooms}
                reservations={reservations}
                date={selectedDate}
                roomId={selectedRoom}
                onReservationClick={handleReservationClick}
                onSlotClick={handleSlotClick}
              />
            )}
          </section>
        </div>
      </main>

      <ReservationForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingReservation(null);
          setDefaultSlot({});
        }}
        editReservation={editingReservation}
        defaultRoomId={defaultSlot.roomId}
        defaultDate={selectedDate.toISOString().split("T")[0]}
        defaultStartTime={defaultSlot.time}
      />
    </>
  );
};

export default Content;
