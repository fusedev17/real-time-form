import { PatientTable } from "./PatientTable";
import type { PatientData } from "@/lib/types";

interface PatientListProps {
  patients: PatientData[];
  now: number;
  hasAnyPatients: boolean;
}

export function PatientList({ patients, now, hasAnyPatients }: PatientListProps) {
  if (patients.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
        <p className="text-sm font-medium text-slate-500">
          {hasAnyPatients ? "No patients match" : "No patients yet"}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {hasAnyPatients
            ? "Try a different search term or filter."
            : "New entries appear here the moment a patient starts filling in the form."}
        </p>
      </div>
    );
  }

  return <PatientTable patients={patients} now={now} />;
}
