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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Room } from "@/types";
import { Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const AVAILABLE_RESOURCES = [
  "TV",
  "Ar-condicionado",
  "Webcam",
  "Microfone fixo",
  "Microfone bluetooth",
];

export default function RoomEditor({
  room,
  onSave,
  onDelete,
}: {
  room: Room;
  onSave: (room: Room) => void;
  onDelete: () => void;
}) {
  const [name, setName] = useState(room.name);
  const [capacity, setCapacity] = useState(room.capacity);
  const [resources, setResources] = useState<string[]>(room.resources);
  const [newResource, setNewResource] = useState("");

  const handleSave = () => {
    if (!name.trim()) {
      toast("Nome obrigatório", {
        description: "Informe o nome da sala.",
      });
      return;
    }
    onSave({ ...room, name: name.trim(), capacity, resources });
    toast("Sala atualizada", {
      description: `${name.trim()} salva com sucesso.`,
    });
  };

  const addResource = (value: string) => {
    if (value && !resources.includes(value)) {
      setResources([...resources, value]);
    }
    setNewResource("");
  };

  const removeResource = (r: string) =>
    setResources(resources.filter((x) => x !== r));

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{room.name}</CardTitle>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remover sala?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação irá remover permanentemente esta sala do sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onDelete}>
                  Remover
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor={`name-${room.id}`}>Nome da sala</Label>
            <Input
              id={`name-${room.id}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`cap-${room.id}`}>Capacidade (pessoas)</Label>
            <Input
              id={`cap-${room.id}`}
              type="number"
              min={1}
              max={100}
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Recursos</Label>
          <div className="flex flex-wrap gap-1.5">
            {resources.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground"
              >
                {r}
                <button
                  onClick={() => removeResource(r)}
                  className="ml-0.5 text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Select value={newResource} onValueChange={addResource}>
            <SelectTrigger className="h-9 text-sm w-auto min-w-45">
              <SelectValue placeholder="Adicionar recurso…" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_RESOURCES.filter((r) => !resources.includes(r)).map(
                (r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} size="sm" className="gap-1.5">
          <Save className="h-3.5 w-3.5" />
          Salvar alterações
        </Button>
      </CardContent>
    </Card>
  );
}
