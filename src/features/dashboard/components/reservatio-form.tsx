"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

import { Spinner } from "@/components/ui/spinner";
import {
  cancelReservationAction,
  saveReservationAction,
} from "@/features/dashboard/actions";
import { getRooms } from "@/features/settings/actions";
import { useSession } from "@/lib/auth-client";
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
  userId: string | null;
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

  const { data: session } = useSession();
  const currentUserId = session?.user.id;
  const currentUserRole = session?.user.role;
  const isOwner = editReservation?.userId === currentUserId;
  const isAdmin = currentUserRole === "ADMIN";

  const canEdit = isEditing && (isOwner || isAdmin);

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
        startTime: defaultStartTime || "07:00",
        endTime: defaultStartTime
          ? `${String(parseInt(defaultStartTime.split(":")[0]) + 1).padStart(
              2,
              "0",
            )}:${defaultStartTime.split(":")[1]}`
          : "08:00",
        title: "",
        description: "",
      });
    }
  }, [editReservation, defaultRoomId, defaultDate, defaultStartTime, open]);

  function toDateTime(date: string, time: string) {
    return new Date(`${date}T${time}:00`);
  }

  const now = new Date();

  const startDateTime =
    form.date && form.startTime ? toDateTime(form.date, form.startTime) : null;

  const isPastDateTime = startDateTime
    ? startDateTime.getTime() < now.getTime()
    : false;

  const validTime = isValidTimeRange(form.startTime, form.endTime);
  const canSubmit =
    form.title.trim() &&
    form.roomId &&
    form.date &&
    validTime &&
    !isPastDateTime;

  async function handleSubmit() {
    if (!canSubmit) return;

    setLoading(true);
    try {
      await saveReservationAction({
        ...(editReservation?.id ? { id: editReservation.id } : {}),
        roomId: form.roomId,
        title: form.title,
        description: form.description,
        startTime: toDateTime(form.date, form.startTime).toISOString(),
        endTime: toDateTime(form.date, form.endTime).toISOString(),
      });

      toast.success(
        isEditing
          ? "Reserva atualizada com sucesso!"
          : "Reserva criada com sucesso!",
      );
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar reserva",
      );
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

  function filterPastTimes(times: string[]) {
    if (!form.date) return times;

    const today = new Date();
    const selectedDate = new Date(form.date + "T00:00:00");

    if (selectedDate.toDateString() !== today.toDateString()) {
      return times;
    }

    const nowMinutes = today.getHours() * 60 + today.getMinutes();

    return times.filter((time) => {
      const [h, m] = time.split(":").map(Number);
      const timeMinutes = h * 60 + m;

      return timeMinutes > nowMinutes;
    });
  }

  const filteredTimeOptions = filterPastTimes(timeOptions);
  const filteredEndTimeOptions = filteredTimeOptions.filter(
    (t) => t > form.startTime,
  );

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Reserva" : "Nova Reserva"}
          </DialogTitle>

          <DialogDescription>
            Preencha as informações abaixo para salvar a reserva.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label>Sala</Label>
            <Select
              value={form.roomId}
              onValueChange={(v) => setForm((f) => ({ ...f, roomId: v }))}
              disabled={isEditing && !canEdit}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione uma sala…" />
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
              min={new Date().toISOString().slice(0, 10)}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              disabled={isEditing && !canEdit}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Select
                value={form.startTime}
                onValueChange={(v) => setForm((f) => ({ ...f, startTime: v }))}
                disabled={isEditing && !canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredTimeOptions.map((t) => (
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
                disabled={isEditing && !canEdit}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {filteredEndTimeOptions.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isPastDateTime && (
            <p className="text-xs text-destructive">
              Não é possível agendar para data/horário que já passou.
            </p>
          )}

          {!validTime && (
            <p className="text-xs text-destructive">
              Horário inválido (07:00–16:30, mínimo 30 min)
            </p>
          )}

          <div className="space-y-1.5">
            <Label>Título</Label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Ex: Alinhamento de equipe"
              disabled={isEditing && !canEdit}
            />
          </div>

          <div className="space-y-1.5">
            <Label>Observações (opcional)</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={2}
              placeholder="Informações adicionais..."
              disabled={isEditing && !canEdit}
            />
          </div>
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-row">
          {canEdit && isEditing && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="sm:mr-auto">
                  Cancelar Reserva
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Cancelar Reserva?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja cancelar esta reserva?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={handleCancel}
                  >
                    Confirmar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Fechar
          </Button>
          {(!isEditing || canEdit) && (
            <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
              {loading ? <Spinner /> : isEditing ? "Salvar" : "Reservar"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
