import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { patientStore } from "@/lib/store";
import { pusherServer } from "@/lib/pusher-server";
import { PATIENTS_CHANNEL, PATIENT_REMOVE_EVENT } from "@/lib/constants";

const bodySchema = z.object({
  id: z.string().trim().min(1).max(100),
});

/**
 * POST-only mirror of DELETE /api/patients, used with navigator.sendBeacon
 * (which cannot send DELETE requests) when a patient leaves without submitting.
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Missing or invalid id" }, { status: 400 });
  }

  const { id } = parsed.data;
  patientStore.delete(id);
  await pusherServer.trigger(PATIENTS_CHANNEL, PATIENT_REMOVE_EVENT, { id });

  return NextResponse.json({ ok: true });
}
