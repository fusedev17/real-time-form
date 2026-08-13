import { Badge } from "@/components/ui/Badge";
import type { PatientStatus } from "@/lib/types";

const STATUS_CONFIG: Record<PatientStatus, { label: string; tone: "green" | "blue" | "gray" }> = {
  submitted: { label: "Submitted", tone: "green" },
  active: { label: "Filling in", tone: "blue" },
  inactive: { label: "Inactive", tone: "gray" },
};

export function StatusIndicator({ status }: { status: PatientStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge tone={config.tone} dotPulse={status === "active"}>
      {config.label}
    </Badge>
  );
}
