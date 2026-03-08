"use client";

import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { InputForm } from "@/components/ui/input-form";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import z from "zod";
import { loginSchema } from "../schemas";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginSchema>) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
          callbackURL: "/",
        },
        {
          onSuccess: async () => {
            toast.success("Login realizado com sucesso!");
          },
          onError: async (ctx) => {
            toast.error(
              ctx.error.message ||
                "Falha ao realizar login. Por favor, verifique suas credenciais e tente novamente.",
            );
          },
        },
      );
    } catch {
      throw new Error(
        "Ops! Ocoreu um erro inesperado. Por favor, tente novamente.",
      );
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="mb-2 text-3xl font-bold text-slate-900">
          Bem-vindo de volta!
        </h1>
        <p className="text-slate-500">
          Insira suas credenciais para acessar a plataforma.
        </p>
      </header>

      <form
        id="signin-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-1">
          <Label htmlFor="email">E-mail</Label>
          <InputForm
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
        </div>

        <div className="space-y-1">
          <InputForm
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            error={form.formState.errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="p-1.5 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            }
            {...form.register("password")}
          />
        </div>

        <button
          type="submit"
          form="signin-form"
          className="flex w-full transform cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 py-3 font-bold  shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 active:scale-[0.98]"
        >
          {form.formState.isSubmitting ? (
            <Spinner className="size-6" />
          ) : (
            "Entrar"
          )}
        </button>
      </form>

      <p className="text-center text-sm text-slate-600">
        Não tem uma conta?
        <Link
          href="/auth/register"
          className="ml-1 font-bold text-primary hover:text-accent-foreground underline-offset-4 transition-colors hover:underline"
        >
          Criar conta gratuita
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
