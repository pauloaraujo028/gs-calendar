import * as z from "zod";

export const loginSchema = z.object({
  email: z.email("Por favor, insira um endereço de email válido."),
  password: z.string().min(5, "Senha deve conter no mínimo 5 caracteres."),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nome deve conter no mínimo 3 caracteres."),
    email: z.email("Por favor, insira um endereço de email válido."),
    password: z.string().min(4, "Senha deve conter no mínimo 4 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
