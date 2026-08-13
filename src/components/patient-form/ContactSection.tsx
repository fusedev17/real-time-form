import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/Input";
import type { PatientFormSchema } from "./validation";

interface Props {
  register: UseFormRegister<PatientFormSchema>;
  errors: FieldErrors<PatientFormSchema>;
}

export function ContactSection({ register, errors }: Props) {
  const phoneField = register("phoneNumber");

  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        <span className="h-4 w-1 rounded-full bg-gradient-to-b from-indigo-500 to-violet-500" />
        Contact Information
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Phone Number" htmlFor="phoneNumber" error={errors.phoneNumber?.message}>
          <Input
            id="phoneNumber"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            autoComplete="tel"
            hasError={!!errors.phoneNumber}
            {...phoneField}
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
              return phoneField.onChange(e);
            }}
          />
        </FormField>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            hasError={!!errors.email}
            {...register("email")}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormField label="Address" htmlFor="address" error={errors.address?.message}>
          <Input
            id="address"
            autoComplete="street-address"
            hasError={!!errors.address}
            {...register("address")}
          />
        </FormField>
        <FormField
          label="Preferred Language"
          htmlFor="preferredLanguage"
          error={errors.preferredLanguage?.message}
        >
          <Input
            id="preferredLanguage"
            hasError={!!errors.preferredLanguage}
            {...register("preferredLanguage")}
          />
        </FormField>
      </div>
    </section>
  );
}
