"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Building2, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import RoomEditor from "./room-editor";

import {
  createRoom,
  deleteRoom,
  updateRoom,
} from "@/features/settings/actions";

type Room = {
  id: string;
  name: string;
  capacity: number;
  resources: string[];
};

export default function Content({ rooms }: { rooms: Room[] }) {
  const handleAddRoom = () => {
    createRoom();
    toast("Sala criada", {
      description: "Configure os detalhes da nova sala.",
    });
  };

  const handleDeleteRoom = (id: string, name: string) => {
    deleteRoom(id);
    toast("Sala removida", { description: `${name} foi removida.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-4xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="shrink-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-base font-semibold text-foreground leading-tight">
              Configurações
            </h1>
            <p className="text-xs text-muted-foreground">
              Salas, horários e regras do sistema
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-8">
        {/* Business Hours */}
        {/* <section>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Horário de Funcionamento
            </h2>
          </div>
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Início</Label>
                  <Select
                    value={String(startHour)}
                    onValueChange={(v) => setStartHour(Number(v))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((h) => (
                        <SelectItem key={h} value={String(h)}>
                          {String(h).padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Término</Label>
                  <Select
                    value={String(endHour)}
                    onValueChange={(v) => setEndHour(Number(v))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {hourOptions.map((h) => (
                        <SelectItem key={h} value={String(h)}>
                          {String(h).padStart(2, "0")}:00
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="flex items-center gap-1.5">
                    <Timer className="h-3.5 w-3.5" />
                    Duração mínima (min)
                  </Label>
                  <Input
                    type="number"
                    min={15}
                    max={120}
                    step={15}
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="h-9"
                  />
                </div>
              </div>
              <Button onClick={handleSaveHours} size="sm" className="gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Salvar horários
              </Button>
            </CardContent>
          </Card>
        </section> */}

        {/* Rooms */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                Salas de Reunião
              </h2>
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {rooms.length}
              </span>
            </div>
            <Button
              onClick={handleAddRoom}
              size="sm"
              variant="outline"
              className="gap-1.5"
            >
              <Plus className="h-4 w-4" />
              Nova Sala
            </Button>
          </div>
          <div className="space-y-4">
            {rooms.map((room) => (
              <RoomEditor
                key={room.id}
                room={room}
                onSave={(updated) =>
                  updateRoom(updated.id, {
                    name: updated.name,
                    capacity: updated.capacity,
                    resources: updated.resources,
                  })
                }
                onDelete={() => handleDeleteRoom(room.id, room.name)}
              />
            ))}
            {rooms.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhuma sala cadastrada. Clique em <strong>Nova Sala</strong>
                  para começar.
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
