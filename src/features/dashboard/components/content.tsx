"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ReservationForm from "@/features/dashboard/components/reservatio-form";
import ReservationList from "@/features/dashboard/components/reservation-list";
import TimeGrid from "@/features/dashboard/components/time-grid";
import WeeklyCalendar from "@/features/dashboard/components/weekly-calendar";
import { Reservation, Room } from "@/lib/generated/prisma/client";
import { formatDate } from "@/lib/reservation-utils";
import { formatDateInput } from "@/lib/utils";
import { Calendar, CalendarDays, LayoutGrid, Plus } from "lucide-react";
import { ReservationWithUser } from "../types";
import RoomList from "./room-list";

type Props = {
  rooms: Room[];
  reservations: ReservationWithUser[];
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

  for (const reservation of reservations) {
    if (reservation.status !== "ACTIVE") continue;

    if (reservation.startTime.toDateString() !== selectedDate.toDateString()) {
      continue;
    }

    reservationCounts[reservation.roomId] =
      (reservationCounts[reservation.roomId] ?? 0) + 1;
  }

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
    (r) =>
      r.status === "ACTIVE" &&
      r.startTime.toDateString() === selectedDate.toDateString(),
  ).length;

  return (
    <>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex ">
            <div className="flex items-center justify-between w-full md:gap-3">
              <Input
                type="date"
                value={formatDateInput(selectedDate)}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value) return;

                  const [year, month, day] = value.split("-").map(Number);

                  if (!year || !month || !day) return;
                  if (day < 1 || day > 31) return;

                  const date = new Date(year, month - 1, day, 12);

                  if (isNaN(date.getTime())) return;

                  setSelectedDate(date);
                }}
                className="w-auto"
                disabled={!rooms.length}
              />
              <span className="text-sm text-muted-foreground">
                {formatDate(selectedDate)} ·{" "}
                <strong className="text-foreground mr-1">{todayCount}</strong>
                reserva
                {todayCount !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between md:gap-3">
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
              disabled={!rooms.length}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Reserva</span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
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
