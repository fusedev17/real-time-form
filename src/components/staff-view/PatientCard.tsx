import { StatusIndicator } from "./StatusIndicator";
import { calculateAge, formatRelativeTime } from "@/lib/format";
import { GENDER_OPTIONS } from "@/lib/constants";
import type { PatientData } from "@/lib/types";

interface DetailProps {
  label: string;
  value?: string;
}

function Detail({ label, value }: DetailProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="truncate text-sm text-slate-800">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

export function PatientCard({ patient, now }: { patient: PatientData; now: number }) {
  const genderLabel = GENDER_OPTIONS.find((option) => option.value === patient.gender)?.label;
  const age = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : null;
  const fullName = [patient.firstName, patient.middleName, patient.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        patient.status === "active"
          ? "border-indigo-300 ring-1 ring-indigo-100"
          : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-slate-900">
            {fullName || "Unnamed patient"}
          </h3>
          <p className="text-xs text-slate-400">
            Updated {formatRelativeTime(patient.updatedAt, now)}
          </p>
        </div>
        <StatusIndicator status={patient.status} />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3">
        <Detail label="Date of Birth" value={patient.dateOfBirth} />
        <Detail label="Age" value={age !== null ? String(age) : undefined} />
        <Detail label="Gender" value={genderLabel} />
        <Detail label="Phone" value={patient.phoneNumber} />
        <Detail label="Email" value={patient.email} />
        <Detail label="Nationality" value={patient.nationality} />
        <Detail label="Preferred Language" value={patient.preferredLanguage} />
        <Detail label="Religion" value={patient.religion} />
        <Detail label="Address" value={patient.address} />
        <Detail
          label="Emergency Contact"
          value={
            patient.emergencyContactName
              ? `${patient.emergencyContactName}${
                  patient.emergencyContactRelationship
                    ? ` (${patient.emergencyContactRelationship})`
                    : ""
                }`
              : undefined
          }
        />
        <Detail label="Emergency Contact Phone" value={patient.emergencyContactPhone} />
      </dl>
    </div>
  );
}
