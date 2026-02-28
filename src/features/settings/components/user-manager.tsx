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
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@/lib/generated/prisma/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { createUserSchema } from "../schemas";
import { createUser, deleteUser, updateUser } from "../user";

type UserDTO = Pick<User, "id" | "name" | "email" | "role">;
type FormData = z.infer<typeof createUserSchema>;

function UserForm({
  user,
  onSave,
  onCancel,
}: {
  user?: UserDTO;
  onSave: (data: FormData) => void;
  onCancel: () => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "USER",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSave)} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome</Label>
        <Input {...register("name")} placeholder="Nome" />
        {errors.name && (
          <p className="text-xs text-destructive">{errors.name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>E-mail</Label>
        <Input
          type="email"
          {...register("email")}
          placeholder="email@empresa.com"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>
      {!user && (
        <div className="space-y-2">
          <Label>Senha</Label>
          <Input type="password" {...register("password")} />
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>
      )}
      <div className="space-y-2">
        <Label>Papel</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USER">Usuário</SelectItem>
                <SelectItem value="ADMIN">Administrador</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">{user ? "Salvar" : "Criar usuário"}</Button>
      </div>
    </form>
  );
}

export default function UserManager({ users }: { users?: UserDTO[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserDTO>();

  const handleCreate = async (data: FormData) => {
    try {
      await createUser(data);

      toast.success("Usuário criado", {
        description: `Usuário ${data.name} criado com sucesso.`,
      });
      setDialogOpen(false);
    } catch {
      toast.error("Erro ao criar usuário");
    }
  };

  const handleUpdate = async (data: FormData) => {
    if (!editingUser) return;

    const changes: string[] = [];

    if (editingUser.name !== data.name) {
      changes.push(`Nome: ${editingUser.name} → ${data.name}`);
    }

    if (editingUser.email !== data.email) {
      changes.push(`Email: ${editingUser.email} → ${data.email}`);
    }

    if (editingUser.role !== data.role) {
      changes.push(`Perfil: ${editingUser.role} → ${data.role}`);
    }

    try {
      await updateUser(editingUser.id, {
        name: data.name,
        email: data.email,
        role: data.role,
      });
      toast.success("Usuário atualizado", {
        description: changes.length
          ? `Alterações realizadas:\n${changes.join("\n")}`
          : "Nenhuma alteração foi feita.",
      });
      setDialogOpen(false);
      setEditingUser(undefined);
    } catch {
      toast.error("Erro ao atualizar usuário");
    }
  };

  const handleDelete = async (user: UserDTO) => {
    try {
      await deleteUser(user.id);
      toast.success("Usuário removido", {
        description: `Usuário ${user.name} removido com sucesso.`,
      });
    } catch {
      toast.error("Erro ao remover usuário");
    }
  };

  const openEdit = (user: UserDTO) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const openCreate = () => {
    setEditingUser(undefined);
    setDialogOpen(true);
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Usuários</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {users?.length}
          </span>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="gap-1.5"
              onClick={openCreate}
            >
              <Plus className="h-4 w-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? "Editar Usuário" : "Novo Usuário"}
              </DialogTitle>
            </DialogHeader>
            <UserForm
              user={editingUser}
              onSave={editingUser ? handleUpdate : handleCreate}
              onCancel={() => setDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>E-mail</TableHead>
                <TableHead>Papel</TableHead>
                <TableHead className="w-25 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {user.email}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                      {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEdit(user)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
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
                            <AlertDialogTitle>
                              Remover usuário?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação irá remover permanentemente este usuário
                              do sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => handleDelete(user)}
                            >
                              Remover
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {users?.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Nenhum usuário cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
