import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal(""));

const optionalPhone = z
  .string()
  .trim()
  .regex(/^[0-9]{9,10}$/, "Enter a valid phone number (9-10 digits, numbers only)")
  .optional()
  .or(z.literal(""));

export const patientFormSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "Too long"),
  middleName: optionalText(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50, "Too long"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((val) => !Number.isNaN(Date.parse(val)), "Enter a valid date")
    .refine((val) => new Date(val) <= new Date(), "Date of birth cannot be in the future"),
  gender: z.enum(["female", "male", "other", "prefer-not-to-say"], {
    error: "Please select a gender",
  }),
  phoneNumber: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .regex(/^[0-9]{9,10}$/, "Enter a valid phone number (9-10 digits, numbers only)"),
  email: z
    .email("Enter a valid email address")
    .trim()
    .toLowerCase()
    .min(1, "Email is required")
    .max(100, "Too long"),
  address: z.string().trim().min(1, "Address is required").max(200, "Too long"),
  preferredLanguage: z.string().trim().min(1, "Preferred language is required").max(50),
  nationality: z.string().trim().min(1, "Nationality is required").max(50),
  emergencyContactName: optionalText(100),
  emergencyContactRelationship: optionalText(50),
  emergencyContactPhone: optionalPhone,
  religion: optionalText(50),
});

export type PatientFormSchema = z.infer<typeof patientFormSchema>;

export const patientFormDefaults: PatientFormSchema = {
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "" as PatientFormSchema["gender"],
  phoneNumber: "",
  email: "",
  address: "",
  preferredLanguage: "",
  nationality: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  religion: "",
};
