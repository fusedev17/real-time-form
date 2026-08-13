import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}

export function FormField({ label, htmlFor, error, optional, children }: FormFieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
        {label}
        {optional ? (
          <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
        ) : (
          <span className="ml-0.5 text-rose-500">*</span>
        )}
      </label>
      {children}
      {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
    </div>
  );
}
