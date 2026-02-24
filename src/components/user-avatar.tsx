"use client";

import { useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import LogoutButton from "./logout-button";

const UserAvatar = () => {
  const { data: session } = useSession();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        isOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (isOpen && event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const user = session?.user;
  if (!user) return null;

  const initials = getInitials(user?.name);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="flex items-center space-x-1 cursor-pointer rounded-full p-1.5 transition-all hover:bg-slate-100 focus:outline-none"
      >
        <div className="relative size-10">
          {user?.image ? (
            <Image
              src={user.image}
              alt={user.name || "Avatar do usuário"}
              fill
              className="rounded-full border-2 border-white object-cover shadow-sm"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-full border-2 border-white bg-primary text-sm font-bold text-white shadow-sm">
              {initials}
            </div>
          )}

          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="mr-2 hidden text-left md:block">
          <p className="text-sm leading-none font-bold text-slate-900">
            {user?.name}
          </p>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute right-0 z-50 mt-2 w-56 rounded-2xl border border-slate-100 bg-white py-2 shadow-xl duration-100">
          <div className="mb-1 border-b border-slate-50 px-4 py-3">
            <p className="text-xs font-medium text-slate-400">{user?.name}</p>
            <p className="truncate text-sm font-semibold text-slate-900">
              {user?.email}
            </p>
          </div>

          <Link
            href="#"
            className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <User className="size-4" />
            <span>Meu Perfil</span>
          </Link>
          {user?.role === "ADMIN" && (
            <Link
              href="/dashboard/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center space-x-3 px-4 py-2 text-sm text-slate-600 transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Settings className="size-4" />
              <span>Configurações</span>
            </Link>
          )}

          <div className="my-2 border-t border-slate-50"></div>

          <LogoutButton className="flex w-full items-center space-x-3 px-4 py-2 text-sm text-red-500 transition-colors hover:bg-red-50">
            <LogOut className="size-4" />
            <span>Encerrar Sessão</span>
          </LogoutButton>
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
