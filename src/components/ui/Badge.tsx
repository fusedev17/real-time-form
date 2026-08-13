import type { ReactNode } from "react";

const TONES = {
  gray: "bg-slate-100 text-slate-600 ring-slate-300",
  blue: "bg-indigo-50 text-indigo-700 ring-indigo-300",
  green: "bg-teal-50 text-teal-700 ring-teal-300",
  amber: "bg-amber-50 text-amber-700 ring-amber-300",
} as const;

interface BadgeProps {
  tone?: keyof typeof TONES;
  children: ReactNode;
  dotPulse?: boolean;
}

export function Badge({ tone = "gray", children, dotPulse = false }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONES[tone]}`}
    >
      <span className="relative flex h-2 w-2">
        {dotPulse && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        )}
        <span className="relative inline-flex h-2 w-2 rounded-full bg-current" />
      </span>
      {children}
    </span>
  );
}
