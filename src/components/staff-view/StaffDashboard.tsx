"use client";

import { useMemo, useState } from "react";
import { PatientList } from "./PatientList";
import { useStaffRealtimeSync } from "@/hooks/useRealtimeSync";
import { useNow } from "@/hooks/useNow";
import type { PatientStatus } from "@/lib/types";

const FILTERS: { value: PatientStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Filling in" },
  { value: "inactive", label: "Inactive" },
  { value: "submitted", label: "Submitted" },
];

export function StaffDashboard() {
  const { patients, connectionState } = useStaffRealtimeSync();
  const now = useNow();
  const [filter, setFilter] = useState<PatientStatus | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((patient) => {
      if (filter !== "all" && patient.status !== filter) return false;
      if (!q) return true;
      const name = `${patient.firstName} ${patient.middleName ?? ""} ${patient.lastName}`.toLowerCase();
      return name.includes(q) || patient.email.toLowerCase().includes(q);
    });
  }, [patients, filter, query]);

  const isConnected = connectionState === "connected";

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            {isConnected && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400 opacity-60" />
            )}
            <span
              className={`relative inline-flex h-2.5 w-2.5 rounded-full ${
                isConnected ? "bg-teal-500" : "bg-amber-500"
              }`}
            />
          </span>
          <span className="text-sm font-medium text-slate-500">
            {isConnected ? "Live" : "Connecting…"} · {patients.length} patient
            {patients.length === 1 ? "" : "s"}
          </span>
        </div>
        <input
          type="search"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none transition hover:border-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:w-64"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === option.value
                ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm shadow-teal-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <PatientList patients={filtered} now={now} />
    </div>
  );
}
