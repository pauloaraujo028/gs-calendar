import clsx from "clsx";
import { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  rightElement?: React.ReactNode;
}

export function InputForm({
  error,
  className,
  id,
  rightElement,
  ...props
}: FormInputProps) {
  return (
    <div className="w-full">
      <div className="relative">
        <input
          id={id}
          className={clsx(
            "w-full rounded-xl border px-4 py-2.5 transition-all placeholder:text-slate-400 focus:ring-2 focus:outline-none pr-10",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
              : "border-slate-200 focus:border-primary focus:ring-primary/20",
            className,
          )}
          {...props}
        />

        {rightElement && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>

      {error && (
        <span className="mt-1 block text-xs text-red-500">{error}</span>
      )}
    </div>
  );
}
