"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormDefaults, patientFormSchema, type PatientFormSchema } from "./validation";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactSection } from "./ContactSection";
import { EmergencyContactSection } from "./EmergencyContactSection";
import { usePatientBroadcast } from "@/hooks/useRealtimeSync";
import { getOrCreatePatientId } from "@/lib/patient-id";

export function PatientForm() {
  const [patientId, setPatientId] = useState("");

  useEffect(() => {
    setPatientId(getOrCreatePatientId());
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<PatientFormSchema>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: patientFormDefaults,
    mode: "onBlur",
  });

  const values = watch();
  const { submitted, submit } = usePatientBroadcast(patientId, values, isDirty && !!patientId);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const result = await submit(data);
    if (!result.ok) {
      setSubmitError(result.error);
    }
  });

  if (submitted) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-teal-200 bg-gradient-to-b from-teal-50 to-white px-6 py-10 text-center shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-md shadow-teal-200">
          ✓
        </div>
        <h2 className="text-lg font-semibold text-slate-900">Thank you</h2>
        <p className="text-sm text-slate-600">
          Your information has been submitted and is now visible to our staff.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex max-w-2xl flex-col gap-8 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8"
    >
      <PersonalInfoSection register={register} errors={errors} />
      <ContactSection register={register} errors={errors} />
      <EmergencyContactSection register={register} errors={errors} />

      {submitError && (
        <p className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 ring-1 ring-rose-200">
          {submitError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-200 transition hover:from-indigo-500 hover:to-violet-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-end"
      >
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
