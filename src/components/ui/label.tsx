import clsx from "clsx";
import { LabelHTMLAttributes } from "react";

interface FormLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

export function Label({ children, className, ...props }: FormLabelProps) {
  return (
    <label
      className={clsx("block text-sm font-semibold text-slate-700", className)}
      {...props}
    >
      {children}
    </label>
  );
}
