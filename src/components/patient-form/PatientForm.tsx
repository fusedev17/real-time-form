"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { patientFormDefaults, patientFormSchema, type PatientFormSchema } from "./validation";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { ContactSection } from "./ContactSection";
import { EmergencyContactSection } from "./EmergencyContactSection";
import { usePatientBroadcast } from "@/hooks/useRealtimeSync";
import { clearPatientId, getOrCreatePatientId } from "@/lib/patient-id";

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
  const { submitted, submit, syncStatus } = usePatientBroadcast(
    patientId,
    values,
    isDirty && !!patientId
  );
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    const result = await submit(data);
    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }
    // This id's record is now terminal — clear it so the next patient to use this
    // tab/kiosk starts a fresh draft instead of silently reusing a submitted one.
    clearPatientId();
  });

  if (submitted) {
    return (
      <div className="animate-scale-in mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-teal-200 bg-white px-6 py-10 text-center shadow-sm">
        <div className="animate-scale-in flex h-12 w-12 items-center justify-center rounded-full bg-teal-600 text-xl text-white shadow-sm [animation-delay:150ms]">
          ✓
        </div>
        <h2 className="text-lg font-bold text-slate-900">Thank you</h2>
        <p className="text-base text-slate-600">
          Your information has been submitted and is now visible to our staff.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in-up mx-auto flex max-w-5xl flex-col gap-3">
      <div className="flex min-h-[24px] justify-end">
        {syncStatus !== "idle" && (
          <span
            className="flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors"
            role="status"
          >
            <span className="relative flex h-1.5 w-1.5">
              {syncStatus === "syncing" && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-60" />
              )}
              <span
                className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                  syncStatus === "syncing" ? "bg-amber-500" : "bg-teal-500"
                }`}
              />
            </span>
            {syncStatus === "syncing" ? "Saving…" : "Saved"}
          </span>
        )}
      </div>

      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10"
      >
        <PersonalInfoSection register={register} errors={errors} />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <ContactSection register={register} errors={errors} />
          <EmergencyContactSection register={register} errors={errors} />
        </div>

        {submitError && (
          <p className="rounded-xl bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-600 ring-1 ring-rose-200">
            {submitError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[52px] w-full rounded-xl bg-blue-600 px-6 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:self-end"
        >
          {isSubmitting ? "Submitting…" : "Submit"}
        </button>
      </form>
    </div>
  );
}
