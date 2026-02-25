import * as z from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3, "Nome deve conter no mínimo 3 caracteres."),
  email: z.email("Por favor, insira um endereço de email válido."),
  password: z
    .string()
    .min(4, "Senha deve conter no mínimo 4 caracteres.")
    .optional()
    .or(z.literal("")),
  role: z.enum(["USER", "ADMIN"]),
});
