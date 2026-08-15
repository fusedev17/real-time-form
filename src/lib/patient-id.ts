import { v4 as uuidv4 } from "uuid";

const STORAGE_KEY = "patient-session-id";

export function getOrCreatePatientId(): string {
  if (typeof window === "undefined") return "";

  const existing = window.sessionStorage.getItem(STORAGE_KEY);
  if (existing) return existing;

  const id = uuidv4();
  window.sessionStorage.setItem(STORAGE_KEY, id);
  return id;
}

/**
 * Once a submission lands, its record is terminal (the store refuses to write drafts back
 * over it). Clearing the stored id means the next patient to use this tab/kiosk gets a fresh
 * one, instead of silently reusing an id whose record can never show live progress again.
 */
export function clearPatientId(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
