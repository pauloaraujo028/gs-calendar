"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import z from "zod";

const formSchema = z.object({
  email: z.email("Por favor, insira um endereço de email válido."),
  password: z.string().min(5, "Senha deve conter no mínimo 5 caracteres."),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    toast("Você enviou os seguintes valores:", {
      description: (
        <pre className="bg-code text-black mt-2 w-[320px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius)  + 4px)",
      } as React.CSSProperties,
    });
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
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label>Senha</Label>
            <Link
              href="#"
              className="text-xs font-semibold text-indigo-600 transition-colors hover:text-indigo-700"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <Input
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

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label
            htmlFor="remember"
            className="cursor-pointer text-xs font-medium text-slate-600"
          >
            Lembrar de mim
          </label>
        </div>

        <button
          type="submit"
          form="signin-form"
          className="flex w-full transform cursor-pointer items-center justify-center rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-[0.98]"
        >
          Entrar
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="grow border-t border-slate-200"></div>
        <span className="mx-4 shrink text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Ou continue com
        </span>
        <div className="grow border-t border-slate-200"></div>
      </div>

      <p className="text-center text-sm text-slate-600">
        Não tem uma conta?
        <Link
          href="/auth/register"
          className="ml-1 font-bold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline"
        >
          Criar conta gratuita
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
