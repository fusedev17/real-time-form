import { INACTIVITY_TIMEOUT_MS } from "./constants";
import type { PatientData, PatientStatus } from "./types";

/**
 * The patient's own tab is supposed to flip its status to "inactive" a few seconds after
 * they stop typing, but that relies on a JS timer that keeps running in their browser —
 * which gets suspended or heavily throttled the moment the tab is backgrounded or the
 * device's screen locks. When that happens, the stored status can stay "active" forever
 * even though nobody's touched the form in minutes. Deriving the effective status from how
 * long it's actually been since the last update means staff still see an accurate picture
 * even when the patient's tab never got a chance to report it.
 */
export function getEffectiveStatus(patient: PatientData, now: number): PatientStatus {
  if (patient.status === "submitted") return "submitted";
  return now - patient.updatedAt >= INACTIVITY_TIMEOUT_MS ? "inactive" : "active";
}
