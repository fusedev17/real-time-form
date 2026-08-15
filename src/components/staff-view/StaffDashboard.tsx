"use client";

import { useMemo, useState } from "react";
import { PatientList } from "./PatientList";
import { Pagination } from "./Pagination";
import { useStaffRealtimeSync } from "@/hooks/useRealtimeSync";
import { useNow } from "@/hooks/useNow";
import { getEffectiveStatus } from "@/lib/patient-status";
import type { PatientStatus } from "@/lib/types";

const FILTERS: { value: PatientStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Filling in" },
  { value: "inactive", label: "Inactive" },
  { value: "submitted", label: "Submitted" },
];

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function StaffDashboard() {
  const { patients, connectionState } = useStaffRealtimeSync();
  const now = useNow();
  const [filter, setFilter] = useState<PatientStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients.filter((patient) => {
      if (filter !== "all" && getEffectiveStatus(patient, now) !== filter) return false;
      if (!q) return true;
      const name = `${patient.firstName} ${patient.middleName ?? ""} ${patient.lastName}`.toLowerCase();
      return name.includes(q) || patient.email.toLowerCase().includes(q);
    });
    // `now` is included so patients drop into/out of the "active"/"inactive" filter as
    // they go stale, not just when the underlying patient list itself changes.
  }, [patients, filter, query, now]);

  // A new search/filter/page-size changes which records match, so a page index left over from
  // the previous result set can point past the end (or just show a confusingly different
  // slice). Reset it during render rather than in an effect, to avoid an extra render pass.
  const resultsKey = `${filter}|${query}|${pageSize}`;
  const [trackedResultsKey, setTrackedResultsKey] = useState(resultsKey);
  if (resultsKey !== trackedResultsKey) {
    setTrackedResultsKey(resultsKey);
    setPage(1);
  }

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, filtered.length);

  const isConnected = connectionState === "connected";

  const statusCounts = useMemo(() => {
    const counts: Record<PatientStatus, number> = { active: 0, inactive: 0, submitted: 0 };
    for (const patient of patients) counts[getEffectiveStatus(patient, now)]++;
    return counts;
  }, [patients, now]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
            {patients.length} patient
            {patients.length === 1 ? "" : "s"}
          </span>
        </div>
        <input
          type="search"
          placeholder="Search by name or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-base text-slate-900 shadow-sm outline-none transition hover:border-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:w-64 sm:text-sm"
        />
      </div>

      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as PatientStatus | "all")}
          className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3.5 text-base font-semibold text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100 sm:hidden"
        >
          {FILTERS.map((option) => {
            const count = option.value === "all" ? patients.length : statusCounts[option.value];
            return (
              <option key={option.value} value={option.value}>
                {option.label} ({count})
              </option>
            );
          })}
        </select>

        <div className="hidden flex-wrap gap-2 sm:flex">
          {FILTERS.map((option) => {
            const count = option.value === "all" ? patients.length : statusCounts[option.value];
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setFilter(option.value)}
                className={`min-h-[40px] rounded-full px-4 text-sm font-semibold transition ${
                  filter === option.value
                    ? "bg-teal-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {option.label}
                <span className={filter === option.value ? "ml-1.5 opacity-80" : "ml-1.5 text-slate-400"}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-xs font-medium text-slate-500">
          Rows per page
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="min-h-[36px] rounded-lg border border-slate-300 bg-white px-2 text-sm text-slate-700 shadow-sm outline-none transition hover:border-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-100"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="min-h-0 flex-1">
        <PatientList patients={pageItems} now={now} hasAnyPatients={patients.length > 0} />
      </div>

      {filtered.length > 0 && (
        <div className="flex shrink-0 flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <p className="text-xs font-medium text-slate-400">
            Showing {rangeStart}–{rangeEnd} of {filtered.length}
          </p>
          <Pagination page={currentPage} pageCount={pageCount} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
}
