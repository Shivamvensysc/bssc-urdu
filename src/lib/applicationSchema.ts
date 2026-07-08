import { z } from "zod";

// ─── Step 1: Personal Details ───────────────────────────────────────────────
export const personalDetailsSchema = z.object({
  applicantName: z.string().min(1, "Applicant name is required").max(100),
  fatherName: z.string().min(1, "Father's name is required").max(100),
  motherName: z.string().min(1, "Mother's name is required").max(100),
  gender: z.enum(["MALE", "FEMALE", "TRANSGENDER"], {
    errorMap: () => ({ message: "Select gender" }),
  }),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  age: z.string().optional(),
  nationality: z.string().min(1, "Nationality is required").default("INDIAN"),
  domicileOfBihar: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select domicile status" }),
  }),
  domicileCertNo: z.string().optional(),
  domicileIssueDate: z.string().optional(),
  domicileAuthority: z.string().optional(),
  category: z.enum(["UR", "EBC", "BC", "SC", "ST", "EWS"], {
    errorMap: () => ({ message: "Select category" }),
  }),
  caste: z.string().min(1, "Caste is required"),
  nonCreamyLayer: z.enum(["YES", "NO", "NA"]).optional(),
  categoryCertNo: z.string().optional(),
  categoryIssueDate: z.string().optional(),
  categoryAuthority: z.string().optional(),
  disability: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select disability status" }),
  }),
  natureOfDisability: z.string().optional(),
  disabilityPercent: z.enum(["YES", "NO", "NA"]).optional(),
  exServiceman: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select ex-serviceman status" }),
  }),
  nccCadet: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select NCC status" }),
  }),
  nccCertificateNo: z.string().optional(),
  biharGovtEmployee: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select govt employee status" }),
  }),
  numberOfAttempts: z.string().min(1, "Number of attempts is required"),
  contractualEmployee: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select contractual employee status" }),
  }),
  nameOfPost: z.string().optional(),
  agreementCircular: z.enum(["YES", "NO", "NA"]).optional(),
  contractualYears: z.string().optional(),
  contractualMonths: z.string().optional(),
  contractualDays: z.string().optional(),
  departmentName: z.string().optional(),
  officeOrderNo: z.string().optional(),
  wardOfFreedomFighter: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select freedom fighter status" }),
  }),
  freedomFighterCertNo: z.string().optional(),
  freedomFighterAuthority: z.string().optional(),
  hasAadharCard: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select Aadhar status" }),
  }),
  aadharCardNumber: z.string().optional(),
  typeOfPhotoIdProof: z.string().optional(),
  idProofNo: z.string().optional(),
  identificationMark: z.string().optional(),
  isDebarred: z.enum(["YES", "NO"], {
    errorMap: () => ({ message: "Select debarred status" }),
  }),
  emailId: z.string().min(1, "Email is required").email("Enter valid email"),
  // Correspondence Address
  corrVillage: z.string().min(1, "Village/Mohalla is required"),
  corrPoliceStation: z.string().min(1, "Police station is required"),
  corrPostOffice: z.string().min(1, "Post office is required"),
  corrState: z.string().min(1, "State is required"),
  corrDistrict: z.string().min(1, "District is required"),
  corrPinCode: z.string().min(6, "PIN code must be 6 digits").max(6),
  sameAsPermanent: z.boolean().optional(),
  // Permanent Address
  permVillage: z.string().min(1, "Village/Mohalla is required"),
  permPoliceStation: z.string().min(1, "Police station is required"),
  permPostOffice: z.string().min(1, "Post office is required"),
  permState: z.string().min(1, "State is required"),
  permDistrict: z.string().min(1, "District is required"),
  permPinCode: z.string().min(6, "PIN code must be 6 digits").max(6),
});

// ─── Step 2: Payment ────────────────────────────────────────────────────────
export const paymentSchema = z.object({
  paymentMode: z.enum(["CREDIT_CARD", "DEBIT_CARD", "UPI", "NET_BANKING"], {
    errorMap: () => ({ message: "Select payment mode" }),
  }),
  paymentAcknowledged: z.boolean().refine((v) => v === true, {
    message: "You must acknowledge the payment terms",
  }),
});

// ─── Step 3: Education ──────────────────────────────────────────────────────
const educationEntrySchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  boardUniversity: z.string().min(1, "Board/University is required"),
  totalMarks: z.string().min(1, "Total marks required"),
  obtainedMarks: z.string().min(1, "Obtained marks required"),
  percentage: z.string().min(1, "Percentage required"),
  certNumber: z.string().min(1, "Certificate number required"),
  certIssueDate: z.string().min(1, "Issue date required"),
});

export const educationSchema = z.object({
  tenth: educationEntrySchema,
  twelfth: educationEntrySchema,
  graduation: educationEntrySchema,
});

// ─── Step 4: Photo Upload ───────────────────────────────────────────────────
export const photoUploadSchema = z.object({
  passportPhoto: z.string().min(1, "Passport photo is required"),
  signatureEn: z.string().min(1, "English signature is required"),
  signatureHi: z.string().min(1, "Hindi signature is required"),
});

// ─── Step 5: Live Photo ─────────────────────────────────────────────────────
export const livePhotoSchema = z.object({
  livePhoto: z.string().min(1, "Live photo capture is required"),
});

// ─── Step 6: Review (declaration) ──────────────────────────────────────────
export const reviewSchema = z.object({
  declarationAccepted: z.boolean().refine((v) => v === true, {
    message: "You must accept the declaration to submit",
  }),
});

// ─── Combined Application Form Data ────────────────────────────────────────
export type PersonalDetailsData = z.infer<typeof personalDetailsSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type EducationData = z.infer<typeof educationSchema>;
export type PhotoUploadData = z.infer<typeof photoUploadSchema>;
export type LivePhotoData = z.infer<typeof livePhotoSchema>;
export type ReviewData = z.infer<typeof reviewSchema>;

export interface ApplicationFormData {
  personal: Partial<PersonalDetailsData>;
  payment: Partial<PaymentData>;
  education: Partial<EducationData>;
  photos: Partial<PhotoUploadData>;
  livePhoto: Partial<LivePhotoData>;
}
