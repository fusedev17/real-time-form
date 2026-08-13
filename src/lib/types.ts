export type PatientStatus = "active" | "inactive" | "submitted";

export type Gender = "female" | "male" | "other" | "prefer-not-to-say";

export interface PatientFormValues {
  firstName: string;
  middleName?: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender | "";
  phoneNumber: string;
  email: string;
  address: string;
  preferredLanguage: string;
  nationality: string;
  emergencyContactName?: string;
  emergencyContactRelationship?: string;
  emergencyContactPhone?: string;
  religion?: string;
}

export interface PatientData extends PatientFormValues {
  id: string;
  status: PatientStatus;
  updatedAt: number;
}
