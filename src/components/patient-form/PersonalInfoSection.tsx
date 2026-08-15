import type { FieldErrors, UseFormRegister } from "react-hook-form";
import { FormField } from "./FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { GENDER_OPTIONS } from "@/lib/constants";
import type { PatientFormSchema } from "./validation";

interface Props {
  register: UseFormRegister<PatientFormSchema>;
  errors: FieldErrors<PatientFormSchema>;
}

export function PersonalInfoSection({ register, errors }: Props) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <span className="h-4 w-1 rounded-full bg-blue-600" />
        Personal Information
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="First Name" htmlFor="firstName" error={errors.firstName?.message}>
          <Input
            id="firstName"
            autoComplete="given-name"
            hasError={!!errors.firstName}
            {...register("firstName")}
          />
        </FormField>
        <FormField label="Middle Name" htmlFor="middleName" optional error={errors.middleName?.message}>
          <Input
            id="middleName"
            autoComplete="additional-name"
            hasError={!!errors.middleName}
            {...register("middleName")}
          />
        </FormField>
        <FormField label="Last Name" htmlFor="lastName" error={errors.lastName?.message}>
          <Input
            id="lastName"
            autoComplete="family-name"
            hasError={!!errors.lastName}
            {...register("lastName")}
          />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Date of Birth" htmlFor="dateOfBirth" error={errors.dateOfBirth?.message}>
          <Input
            id="dateOfBirth"
            type="date"
            hasError={!!errors.dateOfBirth}
            {...register("dateOfBirth")}
          />
        </FormField>
        <FormField label="Gender" htmlFor="gender" error={errors.gender?.message}>
          <Select id="gender" hasError={!!errors.gender} {...register("gender")}>
            <option value="">Select gender</option>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Nationality" htmlFor="nationality" error={errors.nationality?.message}>
          <Input id="nationality" hasError={!!errors.nationality} {...register("nationality")} />
        </FormField>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <FormField label="Religion" htmlFor="religion" optional error={errors.religion?.message}>
          <Input id="religion" hasError={!!errors.religion} {...register("religion")} />
        </FormField>
      </div>
    </section>
  );
}
