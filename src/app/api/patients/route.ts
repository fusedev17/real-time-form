import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { patientStore } from "@/lib/store";
import { pusherServer } from "@/lib/pusher-server";
import { PATIENTS_CHANNEL, PATIENT_REMOVE_EVENT, PATIENT_UPDATE_EVENT } from "@/lib/constants";
import { patientFormSchema } from "@/components/patient-form/validation";
import type { PatientData, PatientStatus } from "@/lib/types";

// Live "active"/"inactive" pings carry whatever the patient has typed so far, which is
// often mid-format (e.g. a half-typed phone number or an unselected gender). Those must
// still reach the staff view in real time, so drafts only get a loose shape check here —
// the strict, fully-formatted `patientFormSchema` is only enforced at submit time below.
const draftPatchSchema = z.object({
  firstName: z.string().max(50).optional(),
  middleName: z.string().max(50).optional(),
  lastName: z.string().max(50).optional(),
  dateOfBirth: z.string().max(20).optional(),
  gender: z.string().max(30).optional(),
  phoneNumber: z.string().max(20).optional(),
  email: z.string().max(100).optional(),
  address: z.string().max(200).optional(),
  preferredLanguage: z.string().max(50).optional(),
  nationality: z.string().max(50).optional(),
  emergencyContactName: z.string().max(100).optional(),
  emergencyContactRelationship: z.string().max(50).optional(),
  emergencyContactPhone: z.string().max(20).optional(),
  religion: z.string().max(50).optional(),
});

const requestSchema = z.object({
  id: z.string().trim().min(1).max(100),
  status: z.enum(["active", "inactive", "submitted"]),
  patch: draftPatchSchema,
});

const idSchema = z.string().trim().min(1).max(100);

export async function GET() {
  const patients = Array.from(patientStore.values()).sort((a, b) => b.updatedAt - a.updatedAt);
  return NextResponse.json(patients);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id, status, patch } = parsed.data;
  const existing = patientStore.get(id);

  // Cast: while in draft (pre-submit), fields like `gender` may hold text that hasn't
  // settled into a valid enum value yet. `patientFormSchema` re-validates everything
  // for real once `status` is "submitted", so PatientData's stricter shape holds by then.
  const merged = {
    id,
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    phoneNumber: "",
    email: "",
    address: "",
    preferredLanguage: "",
    nationality: "",
    ...existing,
    ...patch,
    status: status as PatientStatus,
    updatedAt: Date.now(),
  } as PatientData;

  if (status === "submitted") {
    const validation = patientFormSchema.safeParse(merged);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Cannot submit: form data is incomplete or invalid." },
        { status: 422 }
      );
    }
  }

  patientStore.set(id, merged);

  await pusherServer.trigger(PATIENTS_CHANNEL, PATIENT_UPDATE_EVENT, merged);

  return NextResponse.json(merged);
}

export async function DELETE(req: NextRequest) {
  const rawId = req.nextUrl.searchParams.get("id");
  const parsed = idSchema.safeParse(rawId);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
  }

  const id = parsed.data;
  patientStore.delete(id);
  await pusherServer.trigger(PATIENTS_CHANNEL, PATIENT_REMOVE_EVENT, { id });

  return NextResponse.json({ ok: true });
}
