import type { Metadata } from "next";
import Link from "next/link";
import { PatientForm } from "@/components/patient-form/PatientForm";

export const metadata: Metadata = {
  title: "Patient Intake Form",
};

export default function PatientPage() {
  return (
    <div className="flex flex-1 flex-col bg-gradient-to-b from-indigo-50/60 via-slate-50 to-slate-50">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Patient Intake
            </p>
            <h1 className="text-lg font-semibold text-slate-900">Your Information</h1>
          </div>
          <Link
            href="/"
            className="text-sm font-medium text-slate-500 transition hover:text-indigo-600"
          >
            ← Back
          </Link>
        </div>
      </header>
      <main className="flex-1 px-4 py-8 sm:px-6">
        <PatientForm />
      </main>
    </div>
  );
}
