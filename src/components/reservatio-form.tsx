"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getRooms } from "@/features/dashboard/actions";
import {
  cancelReservationAction,
  saveReservationAction,
} from "@/features/dashboard/reservation";
import { getTimeOptions, isValidTimeRange } from "@/lib/reservation-utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  capacity: number;
}

interface EditReservation {
  id: string;
  roomId: string;
  title: string;
  description?: string | null;
  startTime: Date;
  endTime: Date;
}

interface Props {
  open: boolean;
  onClose: () => void;
  editReservation?: EditReservation | null;
  defaultRoomId?: string;
  defaultDate?: string;
  defaultStartTime?: string;
}

export default function ReservationForm({
  open,
  onClose,
  editReservation,
  defaultRoomId,
  defaultDate,
  defaultStartTime,
}: Props) {
  const timeOptions = getTimeOptions();
  const isEditing = !!editReservation;

  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    roomId: "",
    date: "",
    startTime: "08:00",
    endTime: "08:30",
    title: "",
    description: "",
  });

  useEffect(() => {
    getRooms()
      .then(setRooms)
      .catch(() => toast.error("Erro ao carregar salas"));
  }, []);

  useEffect(() => {
    if (editReservation) {
      const start = new Date(editReservation.startTime);
      const end = new Date(editReservation.endTime);

      setForm({
        roomId: editReservation.roomId,
        date: start.toISOString().slice(0, 10),
        startTime: start.toTimeString().slice(0, 5),
        endTime: end.toTimeString().slice(0, 5),
        title: editReservation.title,
        description: editReservation.description || "",
      });
    } else {
      setForm({
        roomId: defaultRoomId || "",
        date: defaultDate || "",
        startTime: defaultStartTime || "08:00",
        endTime: defaultStartTime
          ? `${String(parseInt(defaultStartTime.split(":")[0]) + 1).padStart(
              2,
              "0",
            )}:${defaultStartTime.split(":")[1]}`
          : "09:00",
        title: "",
        description: "",
      });
    }
  }, [editReservation, defaultRoomId, defaultDate, defaultStartTime, open]);

  function toDateTime(date: string, time: string) {
    return new Date(`${date}T${time}:00`);
  }

  const validTime = isValidTimeRange(form.startTime, form.endTime);
  const canSubmit = form.title.trim() && form.roomId && form.date && validTime;

  async function handleSubmit() {
    if (!canSubmit) return;

    setLoading(true);
    try {
      await saveReservationAction({
        id: editReservation?.id,
        roomId: form.roomId,
        title: form.title,
        description: form.description,
        startTime: toDateTime(form.date, form.startTime),
        endTime: toDateTime(form.date, form.endTime),
      });

      toast.success(isEditing ? "Reserva atualizada" : "Reserva criada");
      onClose();
    } catch {
      toast.error("Erro ao salvar reserva");
    } finally {
      setLoading(false);
    }
  }

  async function handleCancel() {
    if (!editReservation) return;

    try {
      await cancelReservationAction(editReservation.id);
      toast.success("Reserva cancelada");
      onClose();
    } catch {
      toast.error("Erro ao cancelar reserva");
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Reserva" : "Nova Reserva"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Sala</Label>
            <Select
              value={form.roomId}
              onValueChange={(v) => setForm((f) => ({ ...f, roomId: v }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.name} ({r.capacity} pessoas)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Data</Label>
            <Input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Select
                value={form.startTime}
                onValueChange={(v) => setForm((f) => ({ ...f, startTime: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Fim</Label>
              <Select
                value={form.endTime}
                onValueChange={(v) => setForm((f) => ({ ...f, endTime: v }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!validTime && (
            <p className="text-xs text-destructive">
              Horário inválido (08:00–18:00, mínimo 30 min)
            </p>
          )}

          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>Observações</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {isEditing && (
            <Button
              variant="destructive"
              onClick={handleCancel}
              className="sm:mr-auto"
            >
              Cancelar Reserva
            </Button>
          )}
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            {isEditing ? "Salvar" : "Reservar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
