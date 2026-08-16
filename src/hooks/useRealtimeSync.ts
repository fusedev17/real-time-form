"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getPusherClient } from "@/lib/pusher-client";
import { useDebounce } from "./useDebounce";
import {
  INACTIVITY_TIMEOUT_MS,
  PATIENTS_CHANNEL,
  PATIENT_REMOVE_EVENT,
  PATIENT_UPDATE_EVENT,
  SYNC_DEBOUNCE_MS,
} from "@/lib/constants";
import type { PatientData, PatientFormValues, PatientStatus } from "@/lib/types";

function isBlank(values: PatientFormValues): boolean {
  return Object.values(values).every((value) => !value || !String(value).trim());
}

async function postPatientUpdate(
  id: string,
  status: PatientStatus,
  patch: Partial<PatientFormValues>
) {
  return fetch("/api/patients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, patch }),
    keepalive: true,
  });
}

async function deletePatient(id: string) {
  return fetch(`/api/patients?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    keepalive: true,
  });
}

export type SyncStatus = "idle" | "syncing" | "synced";

/** Patient-side: debounces form input and broadcasts active/inactive/submitted state. */
export function usePatientBroadcast(id: string, values: PatientFormValues, enabled: boolean) {
  const debouncedValues = useDebounce(values, SYNC_DEBOUNCE_MS);
  const [submitted, setSubmitted] = useState(false);
  const [hasSynced, setHasSynced] = useState(false);
  const inactivityTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasSyncedOnce = useRef(false);

  const isPending = enabled && !submitted && JSON.stringify(values) !== JSON.stringify(debouncedValues);
  const syncStatus: SyncStatus = isPending ? "syncing" : hasSynced ? "synced" : "idle";

  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
      inactivityTimer.current = null;
    }
  }, []);

  const scheduleInactivity = useCallback(() => {
    clearInactivityTimer();
    inactivityTimer.current = setTimeout(() => {
      void postPatientUpdate(id, "inactive", {});
    }, INACTIVITY_TIMEOUT_MS);
  }, [id, clearInactivityTimer]);

  useEffect(() => {
    if (!enabled || submitted) return;

    if (isBlank(debouncedValues)) {
      // Patient cleared everything back out without submitting — don't keep a ghost record.
      clearInactivityTimer();
      if (hasSyncedOnce.current) {
        hasSyncedOnce.current = false;
        void deletePatient(id);
      }
      return;
    }

    hasSyncedOnce.current = true;
    void postPatientUpdate(id, "active", debouncedValues).then((res) => {
      if (res.ok) setHasSynced(true);
    });
    scheduleInactivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValues, enabled, submitted]);

  useEffect(() => clearInactivityTimer, [clearInactivityTimer]);

  useEffect(() => {
    function handlePageHide() {
      // If they never submitted, don't leave a stale record behind for staff to see.
      if (!hasSyncedOnce.current || submitted) return;
      const payload = JSON.stringify({ id });
      navigator.sendBeacon?.(
        "/api/patients/leave",
        new Blob([payload], { type: "application/json" })
      );
    }
    window.addEventListener("pagehide", handlePageHide);
    return () => window.removeEventListener("pagehide", handlePageHide);
  }, [id, submitted]);

  const submit = useCallback(
    async (finalValues: PatientFormValues) => {
      clearInactivityTimer();
      const res = await postPatientUpdate(id, "submitted", finalValues);
      if (res.ok) {
        setSubmitted(true);
        return { ok: true as const };
      }
      const body = await res.json().catch(() => ({}));
      return { ok: false as const, error: (body?.error as string) ?? "Failed to submit" };
    },
    [id, clearInactivityTimer]
  );

  return { submitted, submit, syncStatus };
}

export interface StaffNotification {
  id: string;
  message: string;
  tone: "blue" | "green";
}

const MAX_NOTIFICATIONS = 3;

function fullNameOf(patient: PatientData): string {
  return [patient.firstName, patient.lastName].filter(Boolean).join(" ").trim();
}

/** Staff-side: loads current patients and keeps them in sync over Pusher. */
export function useStaffRealtimeSync() {
  const [patients, setPatients] = useState<Record<string, PatientData>>({});
  const [connectionState, setConnectionState] = useState("connecting");
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const hasLoadedInitial = useRef(false);

  const pushNotification = useCallback((message: string, tone: StaffNotification["tone"]) => {
    const notification = { id: `${Date.now()}-${Math.random()}`, message, tone };
    setNotifications((prev) => [...prev.slice(-(MAX_NOTIFICATIONS - 1)), notification]);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch("/api/patients")
      .then((res) => res.json())
      .then((data: PatientData[]) => {
        if (cancelled) return;
        setPatients(Object.fromEntries(data.map((p) => [p.id, p])));
        hasLoadedInitial.current = true;
      })
      .catch(() => {});

    const pusher = getPusherClient();
    const handleStateChange = (states: { current: string }) => setConnectionState(states.current);
    pusher.connection.bind("state_change", handleStateChange);

    const channel = pusher.subscribe(PATIENTS_CHANNEL);
    const handleUpdate = (patient: PatientData) => {
      setPatients((prev) => {
        // Only surface a toast for genuinely new live activity, not the initial page hydration.
        if (hasLoadedInitial.current) {
          const existing = prev[patient.id];
          const name = fullNameOf(patient);
          if (!existing) {
            pushNotification(`${name || "A new patient"} checked in`, "blue");
          } else if (existing.status !== "submitted" && patient.status === "submitted") {
            pushNotification(`${name || "A patient"} submitted their form`, "green");
          }
        }
        return { ...prev, [patient.id]: patient };
      });
    };
    const handleRemove = ({ id }: { id: string }) => {
      setPatients((prev) => {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      });
    };
    channel.bind(PATIENT_UPDATE_EVENT, handleUpdate);
    channel.bind(PATIENT_REMOVE_EVENT, handleRemove);

    return () => {
      cancelled = true;
      channel.unbind(PATIENT_UPDATE_EVENT, handleUpdate);
      channel.unbind(PATIENT_REMOVE_EVENT, handleRemove);
      pusher.unsubscribe(PATIENTS_CHANNEL);
      pusher.connection.unbind("state_change", handleStateChange);
    };
  }, [pushNotification]);

  const patientList = useMemo(
    () => Object.values(patients).sort((a, b) => b.updatedAt - a.updatedAt),
    [patients]
  );

  return { patients: patientList, connectionState, notifications, dismissNotification };
}
