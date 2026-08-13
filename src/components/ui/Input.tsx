import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { hasError, className = "", ...props },
  ref
) {
  return (
    <input
      ref={ref}
      className={`w-full rounded-xl border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:ring-4 focus:ring-offset-0 ${
        hasError
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
          : "border-slate-300 hover:border-slate-400 focus:border-indigo-500 focus:ring-indigo-100"
      } ${className}`}
      {...props}
    />
  );
});
