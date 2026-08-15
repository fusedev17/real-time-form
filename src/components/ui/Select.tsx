import { forwardRef, type SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { hasError, className = "", children, ...props },
  ref
) {
  return (
    <select
      ref={ref}
      className={`w-full rounded-xl border bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm outline-none transition focus:ring-4 focus:ring-offset-0 sm:text-sm ${
        hasError
          ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
          : "border-slate-300 hover:border-slate-400 focus:border-blue-500 focus:ring-blue-100"
      } ${className}`}
      {...props}
    >
      {children}
    </select>
  );
});
