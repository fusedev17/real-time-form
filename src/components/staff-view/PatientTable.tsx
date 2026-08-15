"use client";

import { useState } from "react";
import { StatusIndicator } from "./StatusIndicator";
import { Modal } from "@/components/ui/Modal";
import { calculateAge, formatRelativeTime } from "@/lib/format";
import { GENDER_OPTIONS } from "@/lib/constants";
import type { PatientData } from "@/lib/types";

interface DetailFieldProps {
  label: string;
  value?: string;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="truncate text-sm text-slate-800">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

function fullNameOf(patient: PatientData): string {
  return [patient.firstName, patient.middleName, patient.lastName].filter(Boolean).join(" ");
}

export function PatientTable({ patients, now }: { patients: PatientData[]; now: number }) {
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);

  const genderLabel = selectedPatient
    ? GENDER_OPTIONS.find((option) => option.value === selectedPatient.gender)?.label
    : undefined;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 overflow-auto">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead className="sticky top-0 z-10">
            <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 sm:table-cell">Age</th>
              <th className="hidden px-4 py-3 md:table-cell">Phone</th>
              <th className="hidden px-4 py-3 lg:table-cell">Email</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => {
              const fullName = fullNameOf(patient);
              const age = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : null;
              const openDetail = () => setSelectedPatient(patient);

              return (
                <tr
                  key={patient.id}
                  onClick={openDetail}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      openDetail();
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`cursor-pointer border-b border-slate-100 outline-none transition last:border-0 hover:bg-slate-50 focus-visible:bg-slate-50 ${
                    patient.status === "active" ? "bg-blue-50/40" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-slate-900">
                    {fullName || "Unnamed patient"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusIndicator status={patient.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">{age ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                    {patient.phoneNumber || "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-slate-600 lg:table-cell">
                    {patient.email || "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                    {formatRelativeTime(patient.updatedAt, now)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        open={!!selectedPatient}
        onClose={() => setSelectedPatient(null)}
        title={
          selectedPatient && (
            <div className="flex items-center gap-3">
              <h2 className="truncate text-base font-bold text-slate-900">
                {fullNameOf(selectedPatient) || "Unnamed patient"}
              </h2>
              <StatusIndicator status={selectedPatient.status} />
            </div>
          )
        }
      >
        {selectedPatient && (
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
            <DetailField label="Date of Birth" value={selectedPatient.dateOfBirth} />
            <DetailField label="Gender" value={genderLabel} />
            <DetailField label="Nationality" value={selectedPatient.nationality} />
            <DetailField label="Preferred Language" value={selectedPatient.preferredLanguage} />
            <DetailField label="Religion" value={selectedPatient.religion} />
            <DetailField label="Address" value={selectedPatient.address} />
            <DetailField label="Phone" value={selectedPatient.phoneNumber} />
            <DetailField label="Email" value={selectedPatient.email} />
            <DetailField
              label="Emergency Contact"
              value={
                selectedPatient.emergencyContactName
                  ? `${selectedPatient.emergencyContactName}${
                      selectedPatient.emergencyContactRelationship
                        ? ` (${selectedPatient.emergencyContactRelationship})`
                        : ""
                    }`
                  : undefined
              }
            />
            <DetailField
              label="Emergency Contact Phone"
              value={selectedPatient.emergencyContactPhone}
            />
            <DetailField label="Updated" value={formatRelativeTime(selectedPatient.updatedAt, now)} />
          </dl>
        )}
      </Modal>
    </div>
  );
}
