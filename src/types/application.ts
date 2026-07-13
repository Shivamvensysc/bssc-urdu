// types/interfaces.ts

export interface PersonalData {
  nationality?: string;
  sameAsPermanent?: boolean;
  applicantName?: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  dateOfBirth?: string;
  emailId?: string;
  identificationMark?: string;
  domicileOfBihar?: string;
  domicileCertNo?: string;
  domicileIssueDate?: string;
  domicileAuthority?: string;
  category?: string;
  caste?: string;
  nonCreamyLayer?: string;
  categoryCertNo?: string;
  categoryIssueDate?: string;
  categoryAuthority?: string;
  disability?: string;
  natureOfDisability?: string;
  disabilityPercent?: string;
  exServiceman?: string;
  nccCadet?: string;
  nccCertificateNo?: string;
  wardOfFreedomFighter?: string;
  freedomFighterCertNo?: string;
  freedomFighterAuthority?: string;
  biharGovtEmployee?: string;
  numberOfAttempts?: string;
  contractualEmployee?: string;
  nameOfPost?: string;
  agreementCircular?: string;
  departmentName?: string;
  officeOrderNo?: string;
  contractualYears?: string;
  contractualMonths?: string;
  contractualDays?: string;
  isDebarred?: string;
  hasAadharCard?: string;
  aadharCardNumber?: string;
  typeOfPhotoIdProof?: string;
  idProofNo?: string;
  permVillage?: string;
  permPoliceStation?: string;
  permPostOffice?: string;
  permDistrict?: string;
  permState?: string;
  permPinCode?: string;
  corrVillage?: string;
  corrPoliceStation?: string;
  corrPostOffice?: string;
  corrDistrict?: string;
  corrState?: string;
  corrPinCode?: string;
}

export interface PaymentData {
  paymentMode?: string;
  paymentAcknowledged?: boolean;
}

export interface EducationData {
  tenth?: EducationBlock;
  twelfth?: EducationBlock;
  graduation?: EducationBlock;
}

export interface EducationBlock {
  subject?: string;
  boardUniversity?: string;
  totalMarks?: string;
  obtainedMarks?: string;
  percentage?: string;
  certNumber?: string;
  certIssueDate?: string;
}

export interface PhotoData {
  photograph?: string;          // Changed from passportPhoto
  signatureEnglish?: string;    // Changed from signatureEn
  signatureHindi?: string;      // Changed from signatureHi
}

export interface LivePhotoData {
  livePhoto?: string;
}

export interface FormData {
  personal: PersonalData;
  payment: PaymentData;
  education: EducationData;
  photos: PhotoData;
  livePhoto: LivePhotoData;
}

export interface StepProps {
  data: any;
  onSave: (data: any) => void;
}

export interface Step1Props extends StepProps {
  data: PersonalData;
}

export interface Step2Props extends StepProps {
  data: PaymentData;
}

export interface Step3Props extends StepProps {
  data: EducationData;
}

export interface Step4Props extends StepProps {
  data: PhotoData;
}

export interface Step5Props extends StepProps {
  data: LivePhotoData;
}

export interface Step6Props {
  formData: FormData;
  onSubmit: () => void;
  onEdit: (step: number) => void;
}

export interface FieldProps {
  label: string;
  hi?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export interface PillGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export interface SectionTitleProps {
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
  children: React.ReactNode;
}

export interface NoteProps {
  children: React.ReactNode;
  tone?: "ochre" | "danger";
}

export interface AddressFieldsProps {
  prefix: string;
  v: PersonalData;
  setField: (key: string, value: string) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}

export interface CertNumberDateAuthorityProps {
  v: any;
  setField: (key: string, value: string) => void;
  prefixNo: string;
  prefixDate?: string;
  prefixAuth: string;
  labelNo: string;
  hiNo: string;
  labelDate?: string;
  hiDate?: string;
  labelAuth: string;
  hiAuth: string;
}

export interface EducationBlockProps {
  title: string;
  hi: string;
  prefix: string;
  v: EducationData;
  setNested: (prefix: string, key: string, value: string) => void;
}

export interface UploadField {
  field: string;
  label: string;
  hi: string;
  spec: string;
  maxKB: number;
  height: number;
}

export interface ReviewRowProps {
  label: string;
  value?: string | number | null;
}

export interface ReviewSectionProps {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}

export interface Step {
  id: number;
  en: string;
  hi: string;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    style?: React.CSSProperties;
  }>;
}

export interface Candidate {
  registrationNo: string;
  name: string;
}
