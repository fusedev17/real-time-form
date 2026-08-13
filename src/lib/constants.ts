export const PATIENTS_CHANNEL = "patients-channel";
export const PATIENT_UPDATE_EVENT = "patient-update";
export const PATIENT_REMOVE_EVENT = "patient-remove";

export const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

export const SYNC_DEBOUNCE_MS = 500;
export const INACTIVITY_TIMEOUT_MS = 6000;
