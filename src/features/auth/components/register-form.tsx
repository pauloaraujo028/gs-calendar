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
import SocialLogin from "./social";

const formSchema = z
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

const RegisterForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    toast("You submitted the following values:", {
      description: (
        <pre className="bg-black text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4">
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
          Crie sua conta gratuita!
        </h1>
        <p className="text-slate-500">
          Insira suas informações para criar uma nova conta.
        </p>
      </header>

      <form
        id="register-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-5"
      >
        <div className="space-y-1">
          <Label>Nome</Label>
          <Input
            id="name"
            placeholder="Digite seu nome"
            type="text"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
        </div>

        <div className="space-y-1">
          <Label>E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="exemplo@email.com"
            error={form.formState.errors.email?.message}
            {...form.register("email")}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <Label>Senha</Label>
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

          <div className="space-y-1">
            <Label>Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              error={form.formState.errors.confirmPassword?.message}
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="p-1.5 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <Eye /> : <EyeOff />}
                </button>
              }
              {...form.register("confirmPassword")}
            />
          </div>
        </div>

        <div className="pt-1">
          <p className="mb-4 text-[10px] text-slate-500">
            Ao clicar em cadastrar, você concorda com nossos
            <Link href="#" className="mx-1 text-indigo-600 hover:underline">
              Termos de Serviço
            </Link>
            e
            <Link href="#" className="ml-1 text-indigo-600 hover:underline">
              Política de Privacidade
            </Link>
            .
          </p>
          <button
            type="submit"
            form="register-form"
            className="flex w-full transform cursor-pointer items-center justify-center rounded-xl bg-indigo-600 py-3 font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:bg-indigo-700 active:scale-[0.98]"
          >
            Criar conta
          </button>
        </div>
      </form>

      <div className="relative flex items-center py-2">
        <div className="grow border-t border-slate-200"></div>
        <span className="mx-4 shrink text-xs font-semibold tracking-widest text-slate-400 uppercase">
          Ou cadastre-se com
        </span>
        <div className="grow border-t border-slate-200"></div>
      </div>

      <SocialLogin />

      <p className="text-center text-sm text-slate-600">
        Já possui uma conta?
        <Link
          href="/auth/login"
          className="ml-1 font-bold text-indigo-600 underline-offset-4 transition-colors hover:text-indigo-700 hover:underline"
        >
          Fazer login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
