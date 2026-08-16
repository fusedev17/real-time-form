"use client";

import { useEffect } from "react";
import type { StaffNotification } from "@/hooks/useRealtimeSync";

const TONE_STYLES = {
  blue: "border-l-blue-500",
  green: "border-l-teal-500",
} as const;

const TONE_DOT = {
  blue: "bg-blue-500",
  green: "bg-teal-500",
} as const;

interface ToastStackProps {
  toasts: StaffNotification[];
  onDismiss: (id: string) => void;
}

export function ToastStack({ toasts, onDismiss }: ToastStackProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-xs flex-col gap-2 sm:bottom-6 sm:right-6">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function Toast({ toast, onDismiss }: { toast: StaffNotification; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      className={`animate-toast-in pointer-events-auto flex items-center gap-2.5 rounded-xl border-l-4 bg-white px-4 py-3 shadow-lg ring-1 ring-slate-200 ${TONE_STYLES[toast.tone]}`}
      role="status"
    >
      <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${TONE_DOT[toast.tone]}`} aria-hidden />
      <p className="truncate text-sm font-medium text-slate-700">{toast.message}</p>
    </div>
  );
}
