import type { PatientData } from "./types";

declare global {
  var __patientStore: Map<string, PatientData> | undefined;
}

export const patientStore = globalThis.__patientStore ?? new Map<string, PatientData>();

if (process.env.NODE_ENV !== "production") {
  globalThis.__patientStore = patientStore;
}
