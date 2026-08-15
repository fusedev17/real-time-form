import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/Input";
import type { PatientFormSchema } from "./validation";

interface Props {
  register: UseFormRegister<PatientFormSchema>;
  errors: FieldErrors<PatientFormSchema>;
}

export function EmergencyContactSection({ register, errors }: Props) {
  const phoneField = register("emergencyContactPhone");

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <span className="h-4 w-1 rounded-full bg-blue-600" />
        Emergency Contact <span className="text-xs font-normal text-slate-400">(optional)</span>
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField
          label="Contact Name"
          htmlFor="emergencyContactName"
          optional
          error={errors.emergencyContactName?.message}
        >
          <Input
            id="emergencyContactName"
            hasError={!!errors.emergencyContactName}
            {...register("emergencyContactName")}
          />
        </FormField>
        <FormField
          label="Relationship"
          htmlFor="emergencyContactRelationship"
          optional
          error={errors.emergencyContactRelationship?.message}
        >
          <Input
            id="emergencyContactRelationship"
            hasError={!!errors.emergencyContactRelationship}
            {...register("emergencyContactRelationship")}
          />
        </FormField>
        <FormField
          label="Contact Phone Number"
          htmlFor="emergencyContactPhone"
          optional
          error={errors.emergencyContactPhone?.message}
        >
          <Input
            id="emergencyContactPhone"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            hasError={!!errors.emergencyContactPhone}
            {...phoneField}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
              return phoneField.onChange(e);
            }}
          />
        </FormField>
      </div>
    </section>
  );
}
