import type { Metadata } from "next";
import Link from "next/link";
import { StaffDashboard } from "@/components/staff-view/StaffDashboard";

export const metadata: Metadata = {
  title: "Staff Dashboard",
};

export default function StaffPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-teal-50/60 via-slate-50 to-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
              Staff View
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Patient Intake Monitor</h1>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-teal-600"
          >
            ← Back
          </Link>
        </div>
      </header>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6">
        <StaffDashboard />
      </main>
    </div>
  );
}
