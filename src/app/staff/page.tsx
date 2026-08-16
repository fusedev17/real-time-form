import type { Metadata } from "next";
import Link from "next/link";
import { StaffDashboard } from "@/components/staff-view/StaffDashboard";

export const metadata: Metadata = {
  title: "Staff Dashboard",
};

export default function StaffPage() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <header className="shrink-0 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
              Staff View
            </p>
            <h1 className="text-lg font-bold text-slate-900">Patient Intake Monitor</h1>
          </div>
          <Link
            href="/"
            className="flex min-h-[44px] items-center text-sm font-semibold text-slate-500 transition hover:text-teal-600"
          >
            ← Back
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col px-4 py-6 sm:px-6">
        <StaffDashboard />
      </main>
    </div>
  );
}
