import { PatientCard } from "./PatientCard";
import type { PatientData } from "@/lib/types";

export function PatientList({ patients, now }: { patients: PatientData[]; now: number }) {
  if (patients.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/60 py-16 text-center">
        <p className="text-sm font-medium text-slate-500">No patients yet</p>
        <p className="mt-1 text-xs text-slate-400">
          New entries appear here the moment a patient starts filling in the form.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {patients.map((patient) => (
        <PatientCard key={patient.id} patient={patient} now={now} />
      ))}
    </div>
  );
}
