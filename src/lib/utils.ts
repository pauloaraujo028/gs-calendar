import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string | null) => {
  if (!name) return "U";

  const words = name.trim().split(" ");
  const first = words[0]?.[0] ?? "";
  const second = words[1]?.[0] ?? "";

  return (first + second).toUpperCase();
};
