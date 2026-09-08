import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertCircle,
  Bell,
  Download,
  Edit,
  FileText,
  User,
  CreditCard,
  GraduationCap,
  Upload,
  Camera,
  ClipboardCheck,
  ChevronRight,
  Info,
  Briefcase,
  BarChart2,
  Phone,
  Mail,
  Clock,
  MapPin,
  BookOpen,
  Award,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/interceptor";
import { generateRegistrationSlipPDF } from "../lib/pdfGenerator";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Types for API response
interface Address {
  city: string;
  post: string;
  state: string;
  street: string;
  country: string;
  pincode: string;
  district: string;
  sameAsPermanent?: boolean;
}

interface PersonalInfo {
  age: number;
  gender: string;
  address: {
    permanent: Address;
    correspondence: Address;
  };
  emailId: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  dateOfBirth: string;
  nationality: string;
  identityType: string;
  mobileNumber: string;
  maritalStatus: string;
  identityNumber: string;
  alternateNumber: string;
  identificationMark1: string;
  identificationMark2: string;
}

interface AgeEligibility {
  ok: boolean;
  message: string;
  effectiveMaxAge: number;
  ageOnR1?: {
    days: number;
    years: number;
    months: number;
  };
  reasonCode?: string;
  usedCarryForward?: boolean;
}

interface Step0Data {
  age: number;
  caste: string;
  dobDay: string;
  gender: string;
  address: {
    permanent: Address;
    correspondence: Address;
  };
  casteId: string;
  dobYear: string;
  emailId: string;
  category: string;
  dobMonth: string;
  fullName: string;
  mobileNo: string;
  corrState: string;
  idProofNo: string;
  isMarried: string;
  permState: string;
  categoryId: string;
  disability: string;
  fatherName: string;
  isDebarred: string;
  motherName: string;
  nameOfPost: string;
  spouseName: string;
  corrPinCode: string;
  corrStateId: string;
  corrVillage: string;
  dateOfBirth: string;
  nationality: string;
  officerType: string;
  permPinCode: string;
  permStateId: string;
  permVillage: string;
  corrDistrict: string;
  exServiceman: string;
  identityType: string;
  mobileNumber: string;
  permDistrict: string;
  personalInfo: PersonalInfo;
  applicationId: string;
  hasAadharCard: string;
  maritalStatus: string;
  nationalityId: string;
  officeOrderNo: string;
  serviceToDate: string;
  ageEligibility: AgeEligibility;
  categoryCertNo: string;
  corrDistrictId: string;
  corrPostOffice: string;
  debarredToDate: string;
  departmentName: string;
  domicileCertNo: string;
  identityNumber: string;
  permDistrictId: string;
  permPostOffice: string;
  alternateNumber: string;
  confirmMobileNo: string;
  debarmentReason: string;
  domicileOfBihar: string;
  sameAsPermanent: boolean;
  serviceFromDate: string;
  aadharCardNumber: string;
  contractualToDay: string;
  debarredFromDate: string;
  disabilityCertNo: string;
  isNonCreamyLayer: string;
  isScribeRequired: string;
  numberOfAttempts: string;
  organizationName: string;
  otherNationality: string;
  agreementCircular: string;
  biharGovtEmployee: string;
  categoryAuthority: string;
  categoryIssueDate: string;
  contractualToDate: string;
  contractualToYear: string;
  corrPoliceStation: string;
  disabilityPercent: string;
  domicileAuthority: string;
  domicileIssueDate: string;
  hasPostExperience: string;
  isMin40PercentPwD: string;
  permPoliceStation: string;
  contractualFromDay: string;
  contractualToMonth: string;
  natureOfDisability: string;
  typeOfPhotoIdProof: string;
  contractualEmployee: string;
  contractualFromDate: string;
  contractualFromYear: string;
  disabilityAuthority: string;
  disabilityIssueDate: string;
  identificationMark1: string;
  identificationMark2: string;
  categoryIssueDateDay: string;
  contractualFromMonth: string;
  domicileIssueDateDay: string;
  freedomFighterCertNo: string;
  identificationMarkEn: string;
  wardOfFreedomFighter: string;
  categoryIssueDateYear: string;
  domicileIssueDateYear: string;
  identificationMarkEn2: string;
  categoryAuthorityOther: string;
  categoryIssueDateMonth: string;
  disabilityIssueDateDay: string;
  domicileIssueDateMonth: string;
  natureOfDisabilityType: string;
  disabilityIssueDateYear: string;
  freedomFighterAuthority: string;
  disabilityAuthorityOther: string;
  disabilityIssueDateMonth: string;
  // Real API field names (used instead of the Step1Data equivalents below)
  pwd40Percent?: string;
  typeOfExOfficer?: string | null;
  domicileCertificateNumber?: string | null;
  domicileCertificateAuthority?: string | null;
  domicileCertificateIssueDate?: string | null;

  ownScribeRequired?: string;
  isownscribe?: string;
  isOwnScribe?: string | boolean;
}

interface Step1Data {
  applicationId: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  dateOfBirth: string;
  nationality: string;
  nationalityId: string;
  otherNationality: string;
  emailId: string;
  mobileNo: string;
  confirmMobileNo: string;
  identificationMarkEn: string;
  identificationMarkEn2: string;
  isMarried: string;
  spouseName: string;
  domicileOfBihar: string;
  domicileCertificateNumber: string;
  domicileCertificateIssueDate: string;
  domicileCertificateAuthority: string;
  category: string;
  categoryId: string;
  caste: string;
  casteId: string;
  isNonCreamyLayer: string;
  categoryCertNo: string;
  categoryIssueDate: string;
  categoryAuthority: string;
  categoryAuthorityOther: string;
  disability: string;
  natureOfDisability: string;
  natureOfDisabilityType: string;
  disabilityPercent: string;
  isMin40PercentPwD: string;
  disabilityCertNo: string;
  disabilityIssueDate: string;
  disabilityAuthority: string;
  disabilityAuthorityOther: string;
  isScribeRequired: string;
  exServiceman: string;
  officerType: string;
  serviceFromDate: string;
  serviceToDate: string;
  wardOfFreedomFighter: string;
  freedomFighterCertNo: string;
  freedomFighterAuthority: string;
  biharGovtEmployee: string;
  numberOfAttempts: string;
  contractualEmployee: string;
  organizationName: string;
  hasPostExperience: string;
  nameOfPost: string;
  agreementCircular: string;
  departmentName: string;
  officeOrderNo: string;
  contractualFromDate: string;
  contractualToDate: string;
  isDebarred: string;
  debarredFromDate: string;
  debarredToDate: string;
  debarmentReason: string;
  hasAadharCard: string;
  aadharCardNumber: string;
  typeOfPhotoIdProof: string;
  idProofNo: string;
  permVillage: string;
  permPoliceStation: string;
  permPostOffice: string;
  permDistrict: string;
  permDistrictId: string;
  permState: string;
  permStateId: string;
  permPinCode: string;
  corrVillage: string;
  corrPoliceStation: string;
  corrPostOffice: string;
  corrDistrict: string;
  corrDistrictId: string;
  corrState: string;
  corrStateId: string;
  corrPinCode: string;
  sameAsPermanent: boolean;
  ageEligibility: AgeEligibility;
  mainCategoryName: string;
  subCategoryName: string;

  // Add these missing fields
  serviceFromDay?: string;
  serviceFromMonth?: string;
  serviceFromYear?: string;
  serviceToDay?: string;
  serviceToMonth?: string;
  serviceToYear?: string;
  contractualFromDay?: string;
  contractualFromMonth?: string;
  contractualFromYear?: string;
  contractualToDay?: string;
  contractualToMonth?: string;
  contractualToYear?: string;

  ownScribeRequired?: string;
  isownscribe?: string;
  isOwnScribe?: string | boolean;
}

/**
 * The "Personal Details" wizard step is backed by TWO API objects:
 * step0 carries name/DOB/category/disability/service/contractual info,
 * step1 carries address, identity-proof and debarment info.
 * The dashboard's Step 1 panel needs both merged together.
 */
type Step1PersonalData = Step0Data & Step1Data;

interface Step2Data {
  amount: number;
  bankName: string;
  paymentMode: string;
  paymentStatus: string;
  transactionId: string;
  paymentOrderId: string;
}

interface EducationDetail {
  degree: string;
  subject: string;
  certNumber: string;
  totalMarks: number;
  passingYear: string;
  certIssueDate: string;
  marksObtained: number;
  boardUniversity: string;
}

interface Step3Data {
  qualification: {
    tenth: EducationDetail;
    twelfth: EducationDetail;
    graduation: EducationDetail;
  };
}

interface Step4Data {
  photograph: string;
  signatureHindi: string;
  signatureEnglish: string;
}

interface Step5Data {
  livePhoto: string;
}

interface ApplicationStepsResponse {
  applicationId: string;
  candidateId: string;
  status: string;
  currentStep: number;
  completedSteps: number[];
  isSubmitted: boolean;
  otrId?: string;
  applicationReferenceNumber: string | null;
  submissionDate: string | null;
  candidateDetails: {
    id: string;
    userId: string;
    registrationNumber: string;
    dateOfBirth: string;
    mobileNumber: string;
    alternateNumber: string | null;
    mobileVerified: boolean;
    emailVerified: boolean;
    gender: string;
    category: string;
    caste: string;
    biharDomicile: boolean;
    isPwd: boolean;
    disabilityType: null;
    pwd40Percent: boolean;
    isExServiceman: boolean;
    isBiharGovtEmp: boolean;
    isContractualEmp: boolean;
    bsscAttempts: number;
    nonCreamyLayer: boolean;
    servicePeriod: null;
    postName: null;
    hasAgreement: boolean;
    contractualPeriod: null;
    domicileCertificateNumber: string;
    domicileCertificateAuthority: string;
    domicileCertificateIssueDate: string;
    categoryCertificateNumber: string;
    categoryCertificateAuthority: string;
    categoryCertificateIssueDate: string;
    pwdCertificateNumber: null;
    pwdCertificateAuthority: null;
    pwdCertificateIssueDate: null;
    disTypePersist: null;
    isScribeRequired: boolean;
    organizationName: string;
    hasPostExperience: boolean;
    createdAt: string;
    createdBy: null;
    updatedAt: string;
    updatedBy: null;
    version: number;
  };
  steps: {
    step0: Step0Data;
    step1: Step1Data;
    step2: Step2Data | null;
    step3: Step3Data;
    step4: Step4Data;
    step5: Step5Data;
  };
}

type StepStatus = "COMPLETE" | "IN_PROGRESS" | "PENDING" | "LOCKED";

interface ApplicationStep {
  id: string;
  stepNo: number;
  titleEn: string;
  titleHi: string;
  status: StepStatus;
  icon: React.ElementType;
  completedAt?: string;
  description: string;
}

const APPLICATION_STEPS: ApplicationStep[] = [
  {
    id: "step-personal",
    stepNo: 1,
    titleEn: "Personal Details",
    titleHi: "व्यक्तिगत विवरण",
    status: "PENDING",
    icon: User,
    description: "Name, DOB, category, address, ID proof details",
  },
  {
    id: "step-payment",
    stepNo: 2,
    titleEn: "Payment",
    titleHi: "भुगतान",
    status: "PENDING",
    icon: CreditCard,
    description: "Application fee payment",
  },
  {
    id: "step-education",
    stepNo: 3,
    titleEn: "Education Details",
    titleHi: "शैक्षणिक विवरण",
    status: "PENDING",
    icon: GraduationCap,
    description: "10th, 12th, and Graduation qualifications entered",
  },
  {
    id: "step-uploads",
    stepNo: 4,
    titleEn: "Upload Photo & Signature",
    titleHi: "फोटो और हस्ताक्षर अपलोड",
    status: "PENDING",
    icon: Upload,
    description: "Passport photo, English signature, Hindi signature",
  },
  {
    id: "step-livephoto",
    stepNo: 5,
    titleEn: "Live Photo",
    titleHi: "लाइव फोटो",
    status: "PENDING",
    icon: Camera,
    description: "Webcam live photo capture for identity verification",
  },
];

const POSTS_DATA = [
  {
    id: "post-1",
    name: "Assistant Branch Officer",
    level: "Level-7",
    vacancies: 1064,
  },
  { id: "post-2", name: "Planning Assistant", level: "Level-7", vacancies: 88 },
  {
    id: "post-3",
    name: "Junior Statistical Assistant",
    level: "Level-7",
    vacancies: 5,
  },
  {
    id: "post-4",
    name: "Data Entry Operator Grade-C",
    level: "Level-6",
    vacancies: 1,
  },
  {
    id: "post-5",
    name: "Auditor (Audit Directorate)",
    level: "Level-5",
    vacancies: 125,
  },
  {
    id: "post-6",
    name: "Auditor (Cooperative Societies)",
    level: "Level-5",
    vacancies: 198,
  },
];

const IMPORTANT_DATES = [
  {
    id: "date-1",
    event: "Application Start Date / आवेदन प्रारंभ तिथि",
    date: "15-06-2026",
    status: "past",
  },
  {
    id: "date-2",
    event: "Last Date to Apply / आवेदन की अंतिम तिथि",
    date: "15-07-2026",
    status: "upcoming",
  },
  {
    id: "date-3",
    event: "Last Date for Fee Payment / शुल्क भुगतान अंतिम तिथि",
    date: "17-07-2026",
    status: "upcoming",
  },
  {
    id: "date-4",
    event: "Correction Window / संशोधन विंडो",
    date: "18-07-2026 to 20-07-2026",
    status: "upcoming",
  },
  {
    id: "date-5",
    event: "Admit Card Download / प्रवेश पत्र डाउनलोड",
    date: "To be notified",
    status: "future",
  },
  {
    id: "date-6",
    event: "Preliminary Exam / प्रारंभिक परीक्षा",
    date: "To be notified",
    status: "future",
  },
];

/* ── Reusable, self-contained UI primitives ── */

type Tone = "success" | "warning" | "pending" | "locked" | "danger" | "info";

const TONE_STYLES: Record<Tone, string> = {
  success:
    "bg-[var(--teal)]/10 text-[var(--teal)] border border-[var(--teal)]/30",
  warning:
    "bg-[var(--ochre)]/10 text-[var(--ochre-deep)] border border-[var(--ochre)]/30",
  pending:
    "bg-[var(--ink)]/5 text-[var(--ink-soft)] border border-[var(--line)]",
  locked:
    "bg-[var(--ink-soft)]/10 text-[var(--ink-soft)] border border-[var(--line)]",
  danger:
    "bg-[var(--danger)]/10 text-[var(--danger)] border border-[var(--danger)]/30",
  info: "bg-blue-50 text-blue-700 border border-blue-200",
};

function Badge({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${TONE_STYLES[tone]}`}
    >
      {children}
    </span>
  );
}

function SectionHeader({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--ink)] px-4 sm:px-5 py-3 flex items-center justify-between gap-2 flex-wrap">
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-sm bg-[var(--ochre)]" />
        {children}
      </span>
      {right && (
        <span className="text-white/70 font-normal text-xs tabular-nums">
          {right}
        </span>
      )}
    </div>
  );
}

function PrimaryButton({
  children,
  onClick,
  disabled,
  as,
  to,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  as?: "link" | "button";
  to?: string;
  title?: string;
}) {
  const cls =
    "flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-[var(--ochre)] hover:bg-[var(--ochre-deep)] transition-colors shadow-sm disabled:opacity-60 disabled:cursor-not-allowed";
  if (as === "link" && to) {
    return (
      <Link to={to} className={cls} title={title}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} disabled={disabled} className={cls} title={title}>
      {children}
    </button>
  );
}

function SecondaryButton({
  children,
  onClick,
  disabled,
  title,
  full,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  full?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${full ? "w-full" : "flex-1"} inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-[var(--ink)] bg-[var(--card)] border border-[var(--line)] hover:bg-[var(--paper)] hover:border-[var(--ink-soft)]/40 transition-colors disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );
}

function StepStatusBadge({ status }: { status: StepStatus }) {
  if (status === "COMPLETE") return <Badge tone="success">Complete</Badge>;
  if (status === "IN_PROGRESS")
    return <Badge tone="warning">In Progress</Badge>;
  if (status === "PENDING") return <Badge tone="pending">Pending</Badge>;
  return <Badge tone="locked">Locked</Badge>;
}

function StepIconCircle({
  status,
  Icon,
}: {
  status: StepStatus;
  Icon: React.ElementType;
}) {
  const styles: Record<StepStatus, string> = {
    COMPLETE: "bg-[var(--teal)]/10 border-[var(--teal)] text-[var(--teal)]",
    IN_PROGRESS:
      "bg-[var(--ochre)]/10 border-[var(--ochre)] text-[var(--ochre-deep)]",
    PENDING: "bg-[var(--ink)]/5 border-[var(--line)] text-[var(--ink-soft)]",
    LOCKED:
      "bg-[var(--ink-soft)]/5 border-[var(--line)] text-[var(--ink-soft)]/50",
  };
  return (
    <div
      className={`w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${styles[status]}`}
    >
      {status === "COMPLETE" ? <CheckCircle size={19} /> : <Icon size={17} />}
    </div>
  );
}

// Helper to map API step index to UI step index (API: 0->1, 1->2, 2->3, 3->4, 4->5, 5->6)
const mapAPIStepToUI = (apiStep: number): number => apiStep + 1;

// Helper to determine step status
const getStepStatus = (
  stepNo: number,
  completedSteps: number[],
  currentStep: number
): StepStatus => {
  const apiStepIndex = stepNo - 1;

  if (completedSteps.includes(apiStepIndex)) {
    return "COMPLETE";
  }
  if (currentStep === apiStepIndex) {
    return "IN_PROGRESS";
  }
  // If there are completed steps and this step is less than current step but not completed
  if (apiStepIndex < currentStep && !completedSteps.includes(apiStepIndex)) {
    return "IN_PROGRESS";
  }
  if (apiStepIndex < currentStep) {
    return "COMPLETE";
  }
  if (apiStepIndex === currentStep + 1) {
    return "PENDING";
  }
  return "LOCKED";
};

/**
 * Each dashboard "Step N" tile maps directly to `apiData.steps.stepN`
 * (Step 1 -> steps.step1, Step 2 -> steps.step2 ... Step 5 -> steps.step5).
 */
const getStepDataForUI = (steps: any, stepNo: number) => {
  if (!steps) return null;
  if (stepNo === 1) {
    // step0 holds name/DOB/category/disability/service/contractual data,
    // step1 holds address/identity-proof/debarment data. Merge both so the
    // Personal Details panel has everything (step1 wins on overlapping keys).
    if (!steps.step0 && !steps.step1) return null;
    return { ...(steps.step0 || {}), ...(steps.step1 || {}) };
  }
  const key = `step${stepNo}` as keyof typeof steps;
  return steps[key];
};

/* ── Step detail modal helpers ── */

// Fields that hold an image URL and should be rendered as a thumbnail rather than raw text
const IMAGE_FIELD_KEYS = new Set([
  "photograph",
  "signatureHindi",
  "signatureEnglish",
  "livePhoto",
]);

// Turn a camelCase / snake_case key into a readable label, e.g. "corrPinCode" -> "Corr Pin Code"
function formatLabel(key: string): string {
  const spaced = key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ")
    .trim();
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function isImageUrl(key: string, value: unknown): value is string {
  return (
    typeof value === "string" &&
    IMAGE_FIELD_KEYS.has(key) &&
    /^https?:\/\//i.test(value)
  );
}

// Any other URL that points at a document (e.g. agreementCopy, experienceCertificate PDFs)
function isDocumentUrl(key: string, value: unknown): value is string {
  if (typeof value !== "string" || IMAGE_FIELD_KEYS.has(key)) return false;
  if (!/^https?:\/\//i.test(value)) return false;
  const withoutQuery = value.split("?")[0];
  return /\.(pdf|docx?|jpe?g|png)$/i.test(withoutQuery);
}

function formatPrimitive(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

// ─── Step 1 Manual Renderer ───────────────────────────────

function Step1DetailsPanel({ data }: { data: Step1PersonalData }) {
  if (!data) {
    return <EmptyStepDetails stepNo={1} />;
  }

  const renderValue = (val: unknown): string => {
    if (val === null || val === undefined || val === "") return "—";
    if (typeof val === "boolean") return val ? "Yes" : "No";
    return String(val);
  };

  const renderYesNo = (val: string): string => {
    if (!val) return "—";
    const upper = val.toUpperCase();
    if (upper === "YES") return "Yes";
    if (upper === "NO") return "No";
    return val;
  };

  const renderSplitDate = (fullDate: unknown, day: unknown, month: unknown, year: unknown): string => {
    // If the main date field is valid, use it
    if (fullDate && typeof fullDate === "string" && fullDate.trim() !== "") {
      return fullDate;
    }
    // Otherwise construct the date from day/month/year components
    if (day && month && year) {
      const pad = (n: unknown) => String(n).padStart(2, '0');
      return `${pad(day)}-${pad(month)}-${year}`;
    }
    return "—";
  };

  // const renderStatusBadge = (val: string) => {
  //   if (!val) return "—";
  //   const upper = val.toUpperCase();
  //   if (upper === "YES" || upper === "COMPLETED" || upper === "PAID") {
  //     return <Badge tone="success">Yes</Badge>;
  //   }
  //   if (upper === "NO" || upper === "PENDING") {
  //     return <Badge tone="warning">No</Badge>;
  //   }
  //   return renderValue(val);
  // };

  const renderStatusBadge = (val: unknown) => {
    if (val === null || val === undefined || val === "") return "—";
    
    // Safely convert to string and uppercase to handle booleans (true/false) and strings
    const upper = String(val).toUpperCase();
    
    if (upper === "YES" || upper === "TRUE" || upper === "COMPLETED" || upper === "PAID") {
      return <Badge tone="success">Yes</Badge>;
    }
    if (upper === "NO" || upper === "FALSE" || upper === "PENDING") {
      return <Badge tone="warning">No</Badge>;
    }
    return renderValue(val);
  };

  const renderAgeEligibility = (ageElig: AgeEligibility) => {
    if (!ageElig) return "—";
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          {ageElig.ok ? (
            <Check size={14} className="text-[var(--teal)]" />
          ) : (
            <AlertTriangle size={14} className="text-[var(--danger)]" />
          )}
          <span className={`text-sm font-medium ${ageElig.ok ? "text-[var(--teal)]" : "text-[var(--danger)]"}`}>
            {ageElig.ok ? "Eligible" : "Not Eligible"}
          </span>
        </div>
        {ageElig.message && (
          <p className="text-xs text-[var(--ink-soft)]">{ageElig.message}</p>
        )}
        {ageElig.ageOnR1 && (
          <p className="text-xs text-[var(--ink-soft)]">
            Age on R1: {ageElig.ageOnR1.years} years, {ageElig.ageOnR1.months} months, {ageElig.ageOnR1.days} days
          </p>
        )}
        {ageElig.effectiveMaxAge && (
          <p className="text-xs text-[var(--ink-soft)]">
            Effective Max Age: {ageElig.effectiveMaxAge} years
          </p>
        )}
        {ageElig.reasonCode && (
          <p className="text-xs text-[var(--ink-soft)]">
            Reason: {ageElig.reasonCode}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="rounded-b-lg border border-t-0 border-[var(--ochre)]/40 bg-[var(--paper)] overflow-hidden">
      <div className="px-4 py-2.5 bg-[var(--ink)] flex items-center gap-2">
        <ClipboardCheck size={13} className="text-[var(--ochre)] flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-white truncate">
          Step 1 Details — Personal Details / व्यक्तिगत विवरण
        </span>
      </div>
      <div className="p-4 sm:p-5 space-y-6">
        {/* ── Personal Information ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <User size={15} className="text-[var(--ochre-deep)]" />
            Personal Information / व्यक्तिगत जानकारी
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Full Name / पूरा नाम</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.fullName)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Father's Name / पिता का नाम</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.fatherName)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Mother's Name / माता का नाम</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.motherName)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Gender / लिंग</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.gender)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Date of Birth / जन्म तिथि</p>
              <p className="text-sm font-medium text-[var(--ink)]">
                {/* ✅ UPDATED: Use your existing renderSplitDate helper */}
                {renderSplitDate(data.dateOfBirth, data.dobDay, data.dobMonth, data.dobYear)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Marital Status / वैवाहिक स्थिति</p>
              <p className="text-sm font-medium text-[var(--ink)]">{data.isMarried === "YES" ? "Married / विवाहित" : "Unmarried / अविवाहित"}</p>
            </div>
            {data.spouseName && (
              <div>
                <p className="text-[11px] text-[var(--ink-soft)]">Spouse Name / पति/पत्नी का नाम</p>
                <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.spouseName)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Contact Details ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Mail size={15} className="text-[var(--ochre-deep)]" />
            Contact Details / संपर्क विवरण
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Mobile Number / मोबाइल नंबर</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.mobileNo)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Confirm Mobile / मोबाइल पुष्टि</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.confirmMobileNo)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Email ID / ईमेल आईडी</p>
              <p className="text-sm font-medium text-[var(--ink)] break-all">{renderValue(data.emailId)}</p>
            </div>
          </div>
        </div>

        {/* ── Nationality & Identity ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Award size={15} className="text-[var(--ochre-deep)]" />
            Nationality & Identity / राष्ट्रीयता और पहचान
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Nationality / राष्ट्रीयता</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.nationality)}</p>
            </div>
            {data.otherNationality && (
              <div>
                <p className="text-[11px] text-[var(--ink-soft)]">Other Nationality / अन्य राष्ट्रीयता</p>
                <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.otherNationality)}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Has Aadhaar Card / आधार कार्ड है</p>
              {renderStatusBadge(data.hasAadharCard)}
            </div>
            {data.aadharCardNumber && (
              <div>
                <p className="text-[11px] text-[var(--ink-soft)]">Aadhaar Number / आधार संख्या</p>
                <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.aadharCardNumber)}</p>
              </div>
            )}
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">ID Proof Type / पहचान प्रमाण प्रकार</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.typeOfPhotoIdProof)}</p>
            </div>
            {data.idProofNo && (
              <div>
                <p className="text-[11px] text-[var(--ink-soft)]">ID Proof Number / पहचान प्रमाण संख्या</p>
                <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.idProofNo)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Identification Marks ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <User size={15} className="text-[var(--ochre-deep)]" />
            Identification Marks / पहचान चिह्न
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Identification Mark 1 / पहचान चिह्न 1</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.identificationMarkEn)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Identification Mark 2 / पहचान चिह्न 2</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.identificationMarkEn2)}</p>
            </div>
          </div>
        </div>

        {/* ── Category & Caste ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <BookOpen size={15} className="text-[var(--ochre-deep)]" />
            Category & Caste / वर्ग और जाति
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Category / वर्ग</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.category)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Caste / जाति</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.caste)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Non-Creamy Layer / गैर-क्रीमीलेयर</p>
              {renderStatusBadge(data.isNonCreamyLayer)}
            </div>
          </div>
        </div>

        {/* ── Category Certificate ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Award size={15} className="text-[var(--ochre-deep)]" />
            Category Certificate / वर्ग प्रमाणपत्र
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Certificate Number / प्रमाणपत्र संख्या</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.categoryCertNo)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Issue Date / जारी तिथि</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.categoryIssueDate)}</p>
            </div>
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Authority / प्राधिकारी</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.categoryAuthority)}</p>
            </div>
            {data.categoryAuthorityOther && (
              <div>
                <p className="text-[11px] text-[var(--ink-soft)]">Other Authority / अन्य प्राधिकारी</p>
                <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.categoryAuthorityOther)}</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Disability Details ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <User size={15} className="text-[var(--ochre-deep)]" />
            Disability Details / दिव्यांगता विवरण
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Has Disability / दिव्यांगता है</p>
              {renderStatusBadge(data.disability)}
            </div>
            {data.disability === "YES" && (
              <>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Nature of Disability / दिव्यांगता का प्रकार</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.natureOfDisability)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Disability Type / दिव्यांगता प्रकार</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.natureOfDisabilityType)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Disability Percentage / दिव्यांगता प्रतिशत</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.disabilityPercent)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Min 40% PwD / न्यूनतम 40% दिव्यांग</p>
                  {renderStatusBadge(data.pwd40Percent)}
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Certificate Number / प्रमाणपत्र संख्या</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.disabilityCertNo)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Issue Date / जारी तिथि</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.disabilityIssueDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Authority / प्राधिकारी</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.disabilityAuthority)}</p>
                </div>
                {data.disabilityAuthorityOther && (
                  <div>
                    <p className="text-[11px] text-[var(--ink-soft)]">Other Authority / अन्य प्राधिकारी</p>
                    <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.disabilityAuthorityOther)}</p>
                  </div>
                )}
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Scribe Required / लेखक आवश्यक</p>
                  {renderStatusBadge(data.isScribeRequired)}
                </div>
                {(data.isScribeRequired === "YES" || data.isScribeRequired === true) && (
                  <div>
                    <p className="text-[11px] text-[var(--ink-soft)]">Own Scribe / स्वयं का लेखक</p>
                    {renderStatusBadge(data.ownScribeRequired || data.isownscribe || data.isOwnScribe)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Ex-Serviceman Details ── */}
       {/* ── Ex-Serviceman Details ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Award size={15} className="text-[var(--ochre-deep)]" />
            Ex-Serviceman Details / पूर्व सैनिक विवरण
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Is Ex-Serviceman / पूर्व सैनिक है</p>
              {renderStatusBadge(data.exServiceman)}
            </div>
            {data.exServiceman === "YES" && (
              <>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Service From / सेवा प्रारंभ</p>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {renderSplitDate(data.serviceFromDate, data.serviceFromDay, data.serviceFromMonth, data.serviceFromYear)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Service To / सेवा समाप्त</p>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {renderSplitDate(data.serviceToDate, data.serviceToDay, data.serviceToMonth, data.serviceToYear)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Freedom Fighter Details ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Award size={15} className="text-[var(--ochre-deep)]" />
            Freedom Fighter Details / स्वतंत्रता सेनानी विवरण
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Ward of Freedom Fighter / स्वतंत्रता सेनानी के वार्ड</p>
              {renderStatusBadge(data.wardOfFreedomFighter)}
            </div>
            {data.wardOfFreedomFighter === "YES" && (
              <>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Certificate Number / प्रमाणपत्र संख्या</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.freedomFighterCertNo)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Authority / प्राधिकारी</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.freedomFighterAuthority)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Bihar Government Employee ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Briefcase size={15} className="text-[var(--ochre-deep)]" />
            Bihar Government Employee / बिहार सरकार कर्मचारी
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Bihar Govt Employee / बिहार सरकार कर्मचारी</p>
              {renderStatusBadge(data.biharGovtEmployee)}
            </div>
            
            
          </div>
        </div>

        {/* ── Contractual Employee ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <Briefcase size={15} className="text-[var(--ochre-deep)]" />
            Contractual Employee / अनुबंधित कर्मचारी
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Contractual Employee / अनुबंधित कर्मचारी</p>
              {renderStatusBadge(data.contractualEmployee)}
            </div>
            {data.contractualEmployee === "YES" && (
              <>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Organization Name / संगठन का नाम</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.organizationName)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Has Post Experience / पोस्ट अनुभव है</p>
                  {renderStatusBadge(data.hasPostExperience)}
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Name of Post / पद का नाम</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.nameOfPost)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Agreement Circular / समझौता परिपत्र</p>
                  {renderStatusBadge(data.agreementCircular)}
                </div>
               <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Contract From / अनुबंध प्रारंभ</p>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {renderSplitDate(data.contractualFromDate, data.contractualFromDay, data.contractualFromMonth, data.contractualFromYear)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Contract To / अनुबंध समाप्त</p>
                  <p className="text-sm font-medium text-[var(--ink)]">
                    {renderSplitDate(data.contractualToDate, data.contractualToDay, data.contractualToMonth, data.contractualToYear)}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Debarred Details ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <AlertTriangle size={15} className="text-[var(--ochre-deep)]" />
            Debarred Details / प्रतिबंधित विवरण
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Is Debarred / प्रतिबंधित है</p>
              {renderStatusBadge(data.isDebarred)}
            </div>
            {data.isDebarred === "YES" && (
              <>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Debarred From / प्रतिबंध प्रारंभ</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.debarredFromDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Debarred To / प्रतिबंध समाप्त</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.debarredToDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Debarment Reason / प्रतिबंध कारण</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.debarmentReason)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── BSSC Attempts ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <BarChart2 size={15} className="text-[var(--ochre-deep)]" />
            BSSC Attempts / BSSC प्रयास
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Number of Attempts / प्रयासों की संख्या</p>
              <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.numberOfAttempts)}</p>
            </div>
          </div>
        </div>

        {/* ── Domicile ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <MapPin size={15} className="text-[var(--ochre-deep)]" />
            Domicile / मूल निवास
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <p className="text-[11px] text-[var(--ink-soft)]">Domicile of Bihar / बिहार का मूल निवास</p>
              {renderStatusBadge(data.domicileOfBihar)}
            </div>
            {data.domicileOfBihar === "YES" && (
              <>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Certificate Number / प्रमाणपत्र संख्या</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.domicileCertificateNumber)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Issue Date / जारी तिथि</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.domicileCertificateIssueDate)}</p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Authority / प्राधिकारी</p>
                  <p className="text-sm font-medium text-[var(--ink)]">{renderValue(data.domicileCertificateAuthority)}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Address ── */}
        <div>
          <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
            <MapPin size={15} className="text-[var(--ochre-deep)]" />
            Address / पता
          </h4>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Permanent Address */}
            <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4">
              <p className="text-xs font-bold text-[var(--ink)] uppercase tracking-wide mb-3 pb-2 border-b border-[var(--line)] flex items-center gap-2">
                <MapPin size={13} className="text-[var(--ochre-deep)]" />
                Permanent Address / स्थायी पता
              </p>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-[11px] text-[var(--ink-soft)]">Village / गाँव: </span>
                  <span className="font-medium text-[var(--ink)]">{renderValue(data.permVillage)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--ink-soft)]">Police Station / थाना: </span>
                  <span className="font-medium text-[var(--ink)]">{renderValue(data.permPoliceStation)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--ink-soft)]">Post Office / डाकघर: </span>
                  <span className="font-medium text-[var(--ink)]">{renderValue(data.permPostOffice)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--ink-soft)]">District / जिला: </span>
                  <span className="font-medium text-[var(--ink)]">{renderValue(data.permDistrict)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--ink-soft)]">State / राज्य: </span>
                  <span className="font-medium text-[var(--ink)]">{renderValue(data.permState)}</span>
                </div>
                <div>
                  <span className="text-[11px] text-[var(--ink-soft)]">Pin Code / पिन कोड: </span>
                  <span className="font-medium text-[var(--ink)]">{renderValue(data.permPinCode)}</span>
                </div>
              </div>
            </div>

            {/* Correspondence Address */}
            <div className="rounded-lg border border-[var(--line)] bg-[var(--card)] p-4">
              <p className="text-xs font-bold text-[var(--ink)] uppercase tracking-wide mb-3 pb-2 border-b border-[var(--line)] flex items-center gap-2">
                <MapPin size={13} className="text-[var(--ochre-deep)]" />
                Correspondence Address / पत्राचार पता
                {data.sameAsPermanent && (
                  <Badge tone="info">Same as Permanent</Badge>
                )}
              </p>
              {data.sameAsPermanent ? (
                <p className="text-sm text-[var(--ink-soft)] italic">Same as permanent address</p>
              ) : (
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-[11px] text-[var(--ink-soft)]">Village / गाँव: </span>
                    <span className="font-medium text-[var(--ink)]">{renderValue(data.corrVillage)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--ink-soft)]">Police Station / थाना: </span>
                    <span className="font-medium text-[var(--ink)]">{renderValue(data.corrPoliceStation)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--ink-soft)]">Post Office / डाकघर: </span>
                    <span className="font-medium text-[var(--ink)]">{renderValue(data.corrPostOffice)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--ink-soft)]">District / जिला: </span>
                    <span className="font-medium text-[var(--ink)]">{renderValue(data.corrDistrict)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--ink-soft)]">State / राज्य: </span>
                    <span className="font-medium text-[var(--ink)]">{renderValue(data.corrState)}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-[var(--ink-soft)]">Pin Code / पिन कोड: </span>
                    <span className="font-medium text-[var(--ink)]">{renderValue(data.corrPinCode)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Age Eligibility ── */}
        {data.ageEligibility && (
          <div>
            <h4 className="text-sm font-bold text-[var(--ink)] flex items-center gap-2 mb-3 pb-2 border-b border-[var(--line)]">
              <Check size={15} className="text-[var(--ochre-deep)]" />
              Age Eligibility / आयु पात्रता
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
              <div className="sm:col-span-2 lg:col-span-3">
                {renderAgeEligibility(data.ageEligibility)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyStepDetails({ stepNo }: { stepNo: number }) {
  return (
    <div className="rounded-b-lg border border-t-0 border-[var(--ochre)]/40 bg-[var(--paper)] overflow-hidden">
      <div className="px-4 py-2.5 bg-[var(--ink)] flex items-center gap-2">
        <ClipboardCheck size={13} className="text-[var(--ochre)] flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-white truncate">
          Step {stepNo} Details
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex items-start gap-2 rounded-lg p-3 border border-[var(--line)] bg-[var(--card)]">
          <Info size={14} className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5" />
          <p className="text-xs text-[var(--ink-soft)]">
            No detailed data has been recorded for this step yet.
          </p>
        </div>
      </div>
    </div>
  );
}

/** Inline panel of a step's full data, shown expanded directly below its row. */
function StepDetailsPanel({ step, data }: { step: ApplicationStep; data: any }) {
  // Special handling for Step 1 - use manual renderer
  if (step.stepNo === 1) {
    return <Step1DetailsPanel data={data as Step1PersonalData} />;
  }

  // For other steps, use generic renderer
  const hasData =
    data !== null &&
    data !== undefined &&
    (typeof data !== "object" || Object.keys(data).length > 0);

  return (
    <div className="rounded-b-lg border border-t-0 border-[var(--ochre)]/40 bg-[var(--paper)] overflow-hidden">
      <div className="px-4 py-2.5 bg-[var(--ink)] flex items-center gap-2">
        <ClipboardCheck size={13} className="text-[var(--ochre)] flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-wider text-white truncate">
          Step {step.stepNo} Details — {step.titleEn} / {step.titleHi}
        </span>
      </div>
      <div className="p-4 sm:p-5">
        {hasData ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
            {Object.entries(data as Record<string, unknown>).map(
              ([key, value]) => {
                // Skip qualifications array for step 3
                if (key === "qualifications") return null;
                return <DataField key={key} label={key} value={value} />;
              }
            )}
          </div>
        ) : (
          <div className="flex items-start gap-2 rounded-lg p-3 border border-[var(--line)] bg-[var(--card)]">
            <Info
              size={14}
              className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5"
            />
            <p className="text-xs text-[var(--ink-soft)]">
              No detailed data has been recorded for this step yet.
              {step.stepNo === 2 &&
                " Payment confirmation details are shown in the Payment Status panel."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Renders a single key/value pair, recursing into nested objects and arrays. */
function DataField({ label, value }: { label: string; value: unknown }) {
  // Image fields
  if (isImageUrl(label, value)) {
    return (
      <div className="space-y-1.5">
        <p className="text-[11px] text-[var(--ink-soft)]">
          {formatLabel(label)}
        </p>
        <img
          src={value}
          alt={formatLabel(label)}
          className="w-28 h-32 object-cover rounded-lg border border-[var(--line)] bg-[var(--paper)]"
        />
      </div>
    );
  }

  // Document fields (PDFs, etc.) — show a link, not the raw signed URL
  if (isDocumentUrl(label, value)) {
    return (
      <div className="space-y-1.5">
        <p className="text-[11px] text-[var(--ink-soft)]">
          {formatLabel(label)}
        </p>
        <a
          href={value as string}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--ochre-deep)] hover:underline"
        >
          <FileText size={14} />
          View Document
        </a>
      </div>
    );
  }

  // Nested object (but not null / not array)
  if (value && typeof value === "object" && !Array.isArray(value)) {
    const entries = Object.entries(value as Record<string, unknown>);
    if (entries.length === 0) {
      return (
        <div>
          <p className="text-[11px] text-[var(--ink-soft)]">
            {formatLabel(label)}
          </p>
          <p className="text-sm font-medium text-[var(--ink)]">—</p>
        </div>
      );
    }
    return (
      <div className="sm:col-span-2 lg:col-span-3 rounded-lg border border-[var(--line)] bg-[var(--paper)] p-3">
        <p className="text-xs font-bold text-[var(--ink)] uppercase tracking-wide mb-2 pb-2 border-b border-[var(--line)]">
          {formatLabel(label)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
          {entries.map(([k, v]) => (
            <DataField key={k} label={k} value={v} />
          ))}
        </div>
      </div>
    );
  }

  // Array of objects (e.g. qualifications)
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return (
        <div>
          <p className="text-[11px] text-[var(--ink-soft)]">
            {formatLabel(label)}
          </p>
          <p className="text-sm font-medium text-[var(--ink)]">—</p>
        </div>
      );
    }
    const itemsAreObjects = value.every(
      (item) => item && typeof item === "object"
    );
    if (itemsAreObjects) {
      return (
        <div className="sm:col-span-2 lg:col-span-3 space-y-2">
          <p className="text-xs font-bold text-[var(--ink)] uppercase tracking-wide">
            {formatLabel(label)}
          </p>
          {value.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[var(--line)] bg-[var(--paper)] p-3"
            >
              <p className="text-[11px] font-semibold text-[var(--ochre-deep)] mb-2">
                #{idx + 1}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                {Object.entries(item as Record<string, unknown>).map(
                  ([k, v]) => (
                    <DataField key={k} label={k} value={v} />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      );
    }
    // Array of primitives
    return (
      <div>
        <p className="text-[11px] text-[var(--ink-soft)]">
          {formatLabel(label)}
        </p>
        <p className="text-sm font-medium text-[var(--ink)]">
          {value.map((v) => formatPrimitive(v)).join(", ") || "—"}
        </p>
      </div>
    );
  }

  // Primitive value
  return (
    <div>
      <p className="text-[11px] text-[var(--ink-soft)]">
        {formatLabel(label)}
      </p>
      <p
        className="text-sm font-medium text-[var(--ink)] break-words"
        title={formatPrimitive(value)}
      >
        {formatPrimitive(value)}
      </p>
    </div>
  );
}

export default function DashboardContent() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<
    "application" | "exam" | "notices"
  >("application");
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiData, setApiData] = useState<ApplicationStepsResponse | null>(null);
  const [selectedStepNo, setSelectedStepNo] = useState<number | null>(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await api.get<{ success: boolean; data: ApplicationStepsResponse }>(
          `${API_BASE_URL}/application/steps/all`,
          getAuthHeaders(),
        );
        if (response.data.success) {
          setApiData(response.data.data);
        } else {
          setError("Failed to fetch application data");
        }
      } catch (err) {
        console.error("Error fetching application data:", err);
        setError("Failed to load application data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Navigation logic - redirect to /application if not submitted
  useEffect(() => {
    if (apiData && !apiData.isSubmitted) {
      navigate("/application");
    }
  }, [apiData, navigate]);

  // Build candidate info from API data
  const getCandidateInfo = () => {
    if (!apiData) return null;
    
    const step0 = apiData.steps.step0;
    const step1 = apiData.steps.step1;
    const step2 = apiData.steps.step2;
    const candidate = apiData.candidateDetails;
    // ✅ ADDED: Helper to stitch the date together if dateOfBirth is null
    const buildDob = () => {
      if (step1?.dateOfBirth) return step1.dateOfBirth;
      if (step0?.dateOfBirth) return step0.dateOfBirth;
      
      const day = step1?.dobDay || step0?.dobDay;
      const month = step1?.dobMonth || step0?.dobMonth;
      const year = step1?.dobYear || step0?.dobYear;
      
      if (day && month && year) {
        return `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
      }
      return "N/A";
    };
    
    return {
      registrationNo: candidate.registrationNumber || "N/A",
      formNo: apiData.applicationId?.slice(0, 10) || "N/A",
      name: step1?.fullName || step0?.fullName || "N/A",
      fatherName: step1?.fatherName || step0?.fatherName || "N/A",
      motherName: step1?.motherName || step0?.motherName || "N/A",
      gender: step1?.gender || step0?.gender || "N/A",
      // dob: step1?.dateOfBirth || step0?.dateOfBirth || "N/A",
      dob: buildDob(),
      ageAsOn: step0?.age ? `${step0.age} Years` : "N/A",
      category: step1?.category || step0?.category || "N/A",
      mobile: step1?.mobileNo || step0?.mobileNo || candidate.mobileNumber || "N/A",
      email: step1?.emailId || step0?.emailId || "N/A",
      examName: "4th Graduate Level Combined Competitive Exam",
      advNo: "ADV NO.-05/25",
      applicationStatus: apiData.status || "IN_PROGRESS",
      // Real payment data from steps.step2 (falls back gracefully if payment hasn't happened yet)
      paymentStatus: step2?.paymentStatus || "N/A",
      paymentAmount: step2 ? step2.amount : null,
      paymentBank: step2?.bankName || "N/A",
      paymentMode: step2?.paymentMode || "N/A",
      transactionId: step2?.transactionId || "N/A",
      paymentOrderId: step2?.paymentOrderId || "N/A",
      lastUpdated: new Date().toLocaleString(),
    };
  };

  // Build steps with status from API
  const getStepsWithStatus = (): ApplicationStep[] => {
    if (!apiData) return APPLICATION_STEPS;
    
    const { completedSteps, currentStep } = apiData;
    
    return APPLICATION_STEPS.map((step) => ({
      ...step,
      status: getStepStatus(step.stepNo, completedSteps, currentStep),
      // Add completedAt if step is complete (we don't have this info from API, so using current date)
      completedAt: completedSteps.includes(step.stepNo - 1) 
        ? new Date().toLocaleString() 
        : undefined,
    }));
  };

  // Get upload checklist status
  const getUploadStatus = () => {
    if (!apiData) {
      return {
        photo: false,
        sigEn: false,
        sigHi: false,
        live: false,
      };
    }
    
    const step4 = apiData.steps.step4;
    const step5 = apiData.steps.step5;
    
    return {
      photo: !!step4?.photograph,
      sigEn: !!step4?.signatureEnglish,
      sigHi: !!step4?.signatureHindi,
      live: !!step5?.livePhoto,
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto text-[var(--ochre)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-[var(--ink-soft)]">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <AlertCircle size={48} className="mx-auto text-[var(--danger)]" />
          <p className="mt-4 text-[var(--ink)] font-semibold">Error Loading Data</p>
          <p className="text-[var(--ink-soft)] text-sm mt-2">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[var(--ochre)] text-white rounded-lg hover:bg-[var(--ochre-deep)] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <Info size={48} className="mx-auto text-[var(--ink-soft)]" />
          <p className="mt-4 text-[var(--ink)] font-semibold">No Application Found</p>
          <p className="text-[var(--ink-soft)] text-sm mt-2">
            Please start your application by filling out the personal details.
          </p>
          <Link  className="mt-4 inline-block px-4 py-2 bg-[var(--ochre)] text-white rounded-lg hover:bg-[var(--ochre-deep)] transition-colors">
            Start Application
          </Link>
        </div>
      </div>
    );
  }

  const candidateInfo = getCandidateInfo()!;
  const stepsWithStatus = getStepsWithStatus();
  const uploadStatus = getUploadStatus();

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await generateRegistrationSlipPDF(apiData);
    } catch {
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  // Determine if all uploads are complete
  const allUploadsComplete = uploadStatus.photo && uploadStatus.sigEn && uploadStatus.sigHi;

  return (
    <div className="space-y-5">
      {/* Page title bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 rounded-lg bg-[var(--card)] border border-[var(--line)] px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText
            size={16}
            className="text-[var(--ochre-deep)] flex-shrink-0"
          />
          <h2 className="font-serif text-sm sm:text-base font-bold text-[var(--ink)] truncate">
            {candidateInfo.advNo} — {candidateInfo.examName}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--ink-soft)] flex-shrink-0">
          <Clock size={12} />
          <span className="tabular-nums">
            Last login: {candidateInfo.lastUpdated}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
        {/* ── LEFT / MAIN COLUMN ── */}
        <div className="xl:col-span-2 2xl:col-span-3 space-y-5">
          {/* Candidate summary card */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader right={`Reg. No.: ${candidateInfo.registrationNo}`}>
              Candidate Information / अभ्यर्थी जानकारी
            </SectionHeader>
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Photo placeholder */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2 mx-auto sm:mx-0">
                  {apiData.steps.step4?.photograph ? (
                    <img 
                      src={apiData.steps.step4.photograph} 
                      alt="Passport" 
                      className="w-24 h-28 object-cover rounded-lg border border-[var(--line)]"
                    />
                  ) : (
                    <div className="w-24 h-28 border-2 border-dashed border-[var(--line)] rounded-lg flex flex-col items-center justify-center text-center bg-[var(--paper)]">
                      <User size={30} className="text-[var(--ink-soft)]" />
                      <p className="text-[11px] text-[var(--ink-soft)] mt-1 leading-tight">
                        Passport
                        <br />
                        Photo
                      </p>
                    </div>
                  )}
                  {apiData.steps.step4?.photograph ? (
                    <Badge tone="success">Uploaded ✓</Badge>
                  ) : (
                    <Badge tone="warning">Upload Pending</Badge>
                  )}
                </div>

                {/* Details grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                  {[
                    {
                      id: "ci-name",
                      label: "Name / नाम",
                      value: candidateInfo.name,
                    },
                    {
                      id: "ci-father",
                      label: "Father's Name / पिता का नाम",
                      value: candidateInfo.fatherName,
                    },
                    {
                      id: "ci-mother",
                      label: "Mother's Name / माता का नाम",
                      value: candidateInfo.motherName,
                    },
                    {
                      id: "ci-dob",
                      label: "Date of Birth / जन्म तिथि",
                      value: candidateInfo.dob,
                    },
                    {
                      id: "ci-age",
                      label: "Age as on 01-08-2025",
                      value: candidateInfo.ageAsOn,
                    },
                    {
                      id: "ci-gender",
                      label: "Gender / लिंग",
                      value: candidateInfo.gender,
                    },
                    {
                      id: "ci-cat",
                      label: "Category / वर्ग",
                      value: candidateInfo.category,
                    },
                    {
                      id: "ci-mob",
                      label: "Mobile / मोबाइल",
                      value: candidateInfo.mobile,
                    },
                    {
                      id: "ci-email",
                      label: "Email / ईमेल",
                      value: candidateInfo.email,
                    },
                  ].map((item) => (
                    <div key={item.id}>
                      <p className="text-[11px] text-[var(--ink-soft)]">
                        {item.label}
                      </p>
                      <p
                        className="text-sm font-medium text-[var(--ink)] truncate"
                        title={item.value}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom meta row */}
              <div className="mt-4 pt-4 border-t border-[var(--line)] flex flex-wrap gap-x-8 gap-y-3">
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Registration No.
                  </p>
                  <p className="text-sm font-bold text-[var(--ochre-deep)] tabular-nums tracking-wider">
                    {candidateInfo.registrationNo}
                  </p>
                </div>
               
               
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Application Status
                  </p>
                  <Badge tone={apiData.isSubmitted ? "success" : "warning"}>
                    {apiData.isSubmitted ? "Submitted" : "In Progress"}
                  </Badge>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Last Updated
                  </p>
                  <p className="text-xs font-medium text-[var(--ink)] tabular-nums">
                    {candidateInfo.lastUpdated}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <div className="flex border-b border-[var(--line)] overflow-x-auto">
              {(
                [
                  {
                    id: "application",
                    label: "Application Form",
                    icon: FileText,
                  },
                  { id: "exam", label: "Exam Details", icon: BarChart2 },
                  { id: "notices", label: "Notices", icon: Bell },
                ] as const
              ).map((tab) => (
                <button
                  key={`tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 sm:px-5 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeTab === tab.id
                      ? "border-[var(--ochre)] text-[var(--ink)] bg-[var(--ochre)]/5"
                      : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-[var(--paper)]"
                  }`}
                >
                  <tab.icon size={15} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* ── APPLICATION TAB ── */}
            {activeTab === "application" && (
              <div className="p-4 sm:p-5 space-y-5">
                <div className="space-y-3">
                  {stepsWithStatus.map((step) => {
                    const rowTone =
                      step.status === "COMPLETE"
                        ? "border-[var(--teal)]/30 bg-[var(--teal)]/5"
                        : step.status === "IN_PROGRESS"
                          ? "border-[var(--ochre)]/40 bg-[var(--ochre)]/5"
                          : step.status === "PENDING"
                            ? "border-[var(--line)] bg-[var(--card)] hover:bg-[var(--paper)]"
                            : "border-[var(--line)] bg-[var(--paper)] opacity-60";
                    const isClickable = step.status !== "LOCKED";
                    const isExpanded = selectedStepNo === step.stepNo;
                    const toggleExpanded = () =>
                      setSelectedStepNo(isExpanded ? null : step.stepNo);
                    return (
                      <div key={step.id} className="space-y-0">
                        <div
                          onClick={isClickable ? toggleExpanded : undefined}
                          role={isClickable ? "button" : undefined}
                          tabIndex={isClickable ? 0 : undefined}
                          aria-expanded={isClickable ? isExpanded : undefined}
                          onKeyDown={
                            isClickable
                              ? (e) => {
                                  if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    toggleExpanded();
                                  }
                                }
                              : undefined
                          }
                          className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 border transition-all ${rowTone} ${
                            isClickable ? "cursor-pointer" : ""
                          } ${
                            isExpanded
                              ? "rounded-t-lg border-b-0"
                              : "rounded-lg"
                          }`}
                          title={
                            isClickable
                              ? `${isExpanded ? "Hide" : "Show"} details for Step ${step.stepNo}: ${step.titleEn}`
                              : undefined
                          }
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                                step.status === "COMPLETE"
                                  ? "bg-[var(--teal)] text-white"
                                  : step.status === "IN_PROGRESS"
                                    ? "bg-[var(--ochre)] text-white"
                                    : step.status === "PENDING"
                                      ? "text-[var(--ink)] border border-[var(--line)] bg-[var(--paper)]"
                                      : "bg-[var(--line)] text-[var(--ink-soft)]"
                              }`}
                            >
                              {step.status === "COMPLETE" ? (
                                <CheckCircle size={14} />
                              ) : (
                                step.stepNo
                              )}
                            </div>
                            <StepIconCircle
                              status={step.status}
                              Icon={step.icon}
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[var(--ink)]">
                              Step {step.stepNo}: {step.titleEn}
                            </p>
                            <p className="text-xs text-[var(--ink-soft)]">
                              {step.titleHi}
                            </p>
                            <p className="text-xs text-[var(--ink-soft)] mt-0.5 truncate">
                              {step.description}
                            </p>
                            {step.completedAt && (
                              <p className="text-xs text-[var(--teal)] mt-0.5 font-medium tabular-nums">
                                ✓ Completed: {step.completedAt}
                              </p>
                            )}
                            {step.status === "IN_PROGRESS" && step.stepNo === 4 && (
                              <p className="text-xs text-[var(--ochre-deep)] mt-0.5 font-medium">
                                ⚠ Action Required — complete photo &amp; signature
                                uploads
                              </p>
                            )}
                            {step.status === "IN_PROGRESS" && step.stepNo === 5 && (
                              <p className="text-xs text-[var(--ochre-deep)] mt-0.5 font-medium">
                                ⚠ Action Required — capture live photo
                              </p>
                            )}
                            {step.status === "LOCKED" && (
                              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                                Complete previous steps to unlock
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-2 flex-shrink-0">
                            <StepStatusBadge status={step.status} />
                            {isClickable && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleExpanded();
                                }}
                                className="p-1.5 rounded-md border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ochre-deep)] hover:border-[var(--ochre)] transition-colors"
                                title={`${isExpanded ? "Hide" : "Show"} details for Step ${step.stepNo}: ${step.titleEn}`}
                              >
                                <ChevronRight
                                  size={14}
                                  className={`transition-transform duration-200 ${
                                    isExpanded ? "rotate-90" : ""
                                  }`}
                                />
                              </button>
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <StepDetailsPanel
                            step={step}
                            data={getStepDataForUI(apiData.steps, step.stepNo)}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[var(--line)]">
                  <PrimaryButton disabled={true}>
                    <Edit size={15} />
                    Edit Application / आवेदन संपादित करें
                  </PrimaryButton>
                  <SecondaryButton
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    title="Download Application Form PDF"
                  >
                    {isDownloading ? (
                      <>
                        <svg
                          className="animate-spin"
                          width={15}
                          height={15}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            opacity={0.25}
                          />
                          <path d="M21 12a9 9 0 00-9-9" />
                        </svg>
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <Download size={15} />
                        <span>Download Application Form</span>
                      </>
                    )}
                  </SecondaryButton>
                </div>

                <div className="flex items-start gap-2 rounded-lg p-3 border border-[var(--line)] bg-[var(--paper)]">
                  <Info
                    size={14}
                    className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-[var(--ink-soft)]">
                    Click any step row (or its{" "}
                    <ChevronRight size={11} className="inline" /> icon) to
                    expand it and view all data recorded for that step. Click{" "}
                    <strong  className="text-[var(--ink)]">
                      Edit Application
                    </strong>{" "}
                    to open the 6-step form and complete your application. Click{" "}
                    <strong className="text-[var(--ink)]">
                      Download Application Form
                    </strong>{" "}
                    to generate a PDF of your submitted application.
                  </p>
                </div>
              </div>
            )}

            {/* ── EXAM DETAILS TAB ── */}
            {activeTab === "exam" && (
              <div className="p-4 sm:p-5 space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
                    <BarChart2 size={15} className="text-[var(--ochre-deep)]" />
                    Examination Structure / परीक्षा संरचना
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-[var(--line)] rounded-lg p-4 bg-[var(--paper)]">
                      <p className="text-xs font-bold text-[var(--ink)] uppercase tracking-wide mb-3 pb-2 border-b border-[var(--line)]">
                        Preliminary Examination / प्रारंभिक परीक्षा
                      </p>
                      <div className="space-y-2.5">
                        {[
                          {
                            id: "pe-q",
                            label: "Total Questions / कुल प्रश्न",
                            value: "150",
                          },
                          {
                            id: "pe-c",
                            label: "Correct Answer / सही उत्तर",
                            value: "+4 marks",
                          },
                          {
                            id: "pe-w",
                            label: "Wrong Answer / गलत उत्तर",
                            value: "−1 mark",
                          },
                          {
                            id: "pe-d",
                            label: "Duration / अवधि",
                            value: "2 hrs 15 min",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-xs"
                          >
                            <span className="text-[var(--ink-soft)]">
                              {item.label}
                            </span>
                            <span className="font-semibold text-[var(--ink)] tabular-nums bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--line)]">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-[var(--line)] rounded-lg p-4 bg-[var(--paper)]">
                      <p className="text-xs font-bold text-[var(--ink)] uppercase tracking-wide mb-3 pb-2 border-b border-[var(--line)]">
                        Main Examination / मुख्य परीक्षा
                      </p>
                      <div className="space-y-2.5">
                        {[
                          {
                            id: "me-p1",
                            label: "Paper 1 / पेपर 1",
                            value: "Hindi Qualifying",
                          },
                          {
                            id: "me-min",
                            label: "Minimum Qualifying",
                            value: "≥ 30% required",
                          },
                          {
                            id: "me-p2",
                            label: "Paper 2 / पेपर 2",
                            value: "Main Paper",
                          },
                        ].map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center text-xs"
                          >
                            <span className="text-[var(--ink-soft)]">
                              {item.label}
                            </span>
                            <span className="font-semibold text-[var(--ink)] bg-[var(--card)] px-2 py-0.5 rounded border border-[var(--line)]">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-[var(--ink)] mb-3 flex items-center gap-2">
                    <Briefcase size={15} className="text-[var(--ochre-deep)]" />
                    Posts &amp; Vacancies / पद और रिक्तियाँ
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[var(--ink)] text-white">
                          <th className="text-left px-3 py-2.5 font-semibold">
                            #
                          </th>
                          <th className="text-left px-3 py-2.5 font-semibold">
                            Post Name / पद का नाम
                          </th>
                          <th className="text-center px-3 py-2.5 font-semibold">
                            Pay Level
                          </th>
                          <th className="text-right px-3 py-2.5 font-semibold">
                            Vacancies / रिक्तियाँ
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {POSTS_DATA.map((post, idx) => (
                          <tr
                            key={post.id}
                            className={`border-b border-[var(--line)] hover:bg-[var(--paper)] transition-colors ${
                              idx % 2 === 0
                                ? "bg-[var(--card)]"
                                : "bg-[var(--paper)]/40"
                            }`}
                          >
                            <td className="px-3 py-2.5 text-[var(--ink-soft)] tabular-nums">
                              {idx + 1}
                            </td>
                            <td className="px-3 py-2.5 text-[var(--ink)] font-medium">
                              {post.name}
                            </td>
                            <td className="px-3 py-2.5 text-center">
                              <Badge tone="success">{post.level}</Badge>
                            </td>
                            <td className="px-3 py-2.5 text-right font-bold text-[var(--ochre-deep)] tabular-nums">
                              {post.vacancies.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-[var(--ink)] text-white">
                          <td
                            colSpan={3}
                            className="px-3 py-2.5 text-sm font-bold"
                          >
                            Total Vacancies / कुल रिक्तियाँ
                          </td>
                          <td className="px-3 py-2.5 text-right text-sm font-bold tabular-nums">
                            1,481
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ── NOTICES TAB ── */}
            {activeTab === "notices" && (
              <div className="p-4 sm:p-5 space-y-4">
                <p className="text-xs text-[var(--ink-soft)]">
                  Recent notifications and alerts for your application / आपके
                  आवेदन के लिए हाल की सूचनाएं
                </p>
                <div className="space-y-3">
                  {[
                    {
                      id: "ntc-1",
                      type: "warning",
                      title: "Upload Deadline Approaching — Action Required",
                      body: `Photo and Signature upload (Step 4) must be completed before 15-07-2026. ${
                        !uploadStatus.photo ? "📷 Passport photo pending. " : ""
                      }${!uploadStatus.sigEn ? "✍️ English signature pending. " : ""}${
                        !uploadStatus.sigHi ? "✍️ Hindi signature pending. " : ""
                      }${allUploadsComplete ? "✅ All uploads complete!" : "Please complete all uploads to proceed to Step 5."}`,
                      date: "2026-07-06 18:41",
                    },
                    {
                      id: "ntc-2",
                      type: apiData.steps.step2 ? "info" : "warning",
                      title: apiData.steps.step2
                        ? "Payment Confirmed Successfully"
                        : "Payment Pending",
                      body: apiData.steps.step2
                        ? `Application fee of ₹${candidateInfo.paymentAmount} has been received via ${candidateInfo.paymentBank} (${candidateInfo.paymentMode}). Transaction ID: ${candidateInfo.transactionId}. Payment Order ID: ${candidateInfo.paymentOrderId}.`
                        : "Payment details have not been recorded for this application yet.",
                      date: apiData.candidateDetails.updatedAt
                        ? new Date(apiData.candidateDetails.updatedAt).toLocaleString()
                        : "N/A",
                    },
                    {
                      id: "ntc-3",
                      type: apiData.steps.step5?.livePhoto ? "info" : "warning",
                      title: apiData.steps.step5?.livePhoto ? "Live Photo Captured ✓" : "Live Photo Capture Mandatory (Step 5)",
                      body: apiData.steps.step5?.livePhoto 
                        ? "Your live photo has been successfully captured and verified." 
                        : "Step 5 requires webcam access for live photo capture. Ensure your device has a functioning camera. This photo will be re-verified when you download your admit card. Use a well-lit environment.",
                      date: "2026-07-03 09:00",
                    },
                    {
                      id: "ntc-4",
                      type: apiData.steps.step3 ? "info" : "warning",
                      title: apiData.steps.step3 ? "Education Details Saved (Step 3 Complete)" : "Education Details Pending (Step 3)",
                      body: apiData.steps.step3 
                        ? `Your educational qualification details (10th, 12th, Graduation) have been saved successfully. You may edit these details until final submission.`
                        : "Please complete your educational qualification details (10th, 12th, Graduation) to proceed.",
                      date: "2026-07-05 09:17",
                    },
                  ].map((notice) => (
                    <div
                      key={notice.id}
                      className={`rounded-lg border-l-4 p-4 ${
                        notice.type === "warning"
                          ? "bg-[var(--ochre)]/5 border-[var(--ochre)]"
                          : "bg-[var(--ink)]/[0.03] border-[var(--ink)]"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {notice.type === "warning" ? (
                          <AlertCircle
                            size={15}
                            className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5"
                          />
                        ) : (
                          <Info
                            size={15}
                            className="text-[var(--ink)] flex-shrink-0 mt-0.5"
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-[var(--ink)]">
                            {notice.title}
                          </p>
                          <p className="text-xs text-[var(--ink-soft)] mt-1 leading-relaxed">
                            {notice.body}
                          </p>
                          <p className="text-xs text-[var(--ink-soft)] mt-2 tabular-nums">
                            {notice.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT SIDEBAR COLUMN ── */}
        <div className="xl:col-span-1 2xl:col-span-1 space-y-5">

          {/* OTR ID Card - NEWLY ADDED */}
          {apiData.otrId && (
            <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
              <SectionHeader>OTR Details / ओटीआर विवरण</SectionHeader>
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)] mb-1.5 uppercase font-bold tracking-wider">
                    Your OTR ID / आपका ओटीआर आईडी
                  </p>
                  <div className="flex items-center justify-between bg-[var(--paper)] border border-[var(--line)] rounded-lg px-3 py-2.5">
                    <span className="font-mono font-bold text-base text-[var(--ochre-deep)] tracking-wider">
                      {apiData.otrId}
                    </span>
                    <Badge tone="success">Generated ✓</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-2 rounded-lg p-3 border border-[var(--ochre)]/30 bg-[var(--ochre)]/5">
                  <Info size={16} className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-[var(--ink)] leading-relaxed">
                    <strong>What is OTR?</strong> In the future, if you apply for any other BSSC post, simply enter this OTR ID. All your details will be automatically fetched, saving you time. Save this otr id for future reference.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment status card */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader>Payment Status / भुगतान स्थिति</SectionHeader>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Status / स्थिति
                </span>
                {(() => {
                  const statusLower = candidateInfo.paymentStatus?.toLowerCase();
                  const isPaid = statusLower === "completed" || statusLower === "paid" || statusLower === "success";
                  const label =
                    candidateInfo.paymentStatus === "N/A"
                      ? "N/A"
                      : candidateInfo.paymentStatus.charAt(0).toUpperCase() +
                        candidateInfo.paymentStatus.slice(1);
                  return (
                    <Badge tone={isPaid ? "success" : "warning"}>
                      {label}
                      {isPaid ? " ✓" : ""}
                    </Badge>
                  );
                })()}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Amount / राशि
                </span>
                <span className="text-sm font-bold text-[var(--ochre-deep)] tabular-nums">
                  {candidateInfo.paymentAmount !== null
                    ? `₹${candidateInfo.paymentAmount}`
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Payment Mode / भुगतान मोड
                </span>
                <span className="text-xs font-semibold text-[var(--ink)] uppercase">
                  {candidateInfo.paymentMode}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Bank / बैंक
                </span>
                <span className="text-xs font-semibold text-[var(--ink)]">
                  {candidateInfo.paymentBank}
                </span>
              </div>
              <div className="pt-1 border-t border-[var(--line)]">
                <p className="text-[11px] text-[var(--ink-soft)] mb-0.5">
                  Transaction ID
                </p>
                <p className="text-xs font-mono font-semibold text-[var(--ink)] tabular-nums break-all">
                  {candidateInfo.transactionId}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--ink-soft)] mb-0.5">
                  Payment Order ID
                </p>
                <p className="text-xs font-mono font-semibold text-[var(--ink)] break-all">
                  {candidateInfo.paymentOrderId}
                </p>
              </div>
              <SecondaryButton full title="Download Fee Receipt">
                <Download size={13} />
                Download Fee Receipt
              </SecondaryButton>
            </div>
          </div>

          {/* Important Dates */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader>Important Dates / महत्वपूर्ण तिथियाँ</SectionHeader>
            <div className="p-4">
              {IMPORTANT_DATES.map((item, idx) => (
                <div
                  key={item.id}
                  className={`flex items-start justify-between gap-3 py-2.5 ${
                    idx < IMPORTANT_DATES.length - 1
                      ? "border-b border-[var(--line)]"
                      : ""
                  }`}
                >
                  <p className="text-xs text-[var(--ink)] leading-tight flex-1">
                    {item.event}
                  </p>
                  <p
                    className={`text-xs font-semibold tabular-nums flex-shrink-0 text-right leading-tight ${
                      item.status === "past"
                        ? "text-[var(--ink-soft)] line-through"
                        : item.status === "upcoming"
                          ? "text-[var(--danger)]"
                          : "text-[var(--ink-soft)]"
                    }`}
                  >
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Helpdesk */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader>Helpdesk / सहायता</SectionHeader>
            <div className="p-4 space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <Mail
                  size={13}
                  className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[var(--ink-soft)]">Email Support</p>
                  <p className="font-medium text-[var(--ink)] break-all">
                    bssc-helpdesk@bihar.gov.in
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Phone
                  size={13}
                  className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[var(--ink-soft)]">Helpline Number</p>
                  <p className="font-medium text-[var(--ink)] tabular-nums">
                    0612-2215383
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock
                  size={13}
                  className="text-[var(--ochre-deep)] flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-[var(--ink-soft)]">Support Hours</p>
                  <p className="font-medium text-[var(--ink)]">
                    Mon–Sat, 10:00 AM – 5:00 PM
                  </p>
                </div>
              </div>

              <div className="rounded-lg p-3 border border-[var(--line)] bg-[var(--paper)]">
                <p className="font-semibold text-[var(--ink)] mb-0.5">
                  BSSC Address / पता
                </p>
                <p className="text-[var(--ink-soft)] leading-relaxed">
                  P.O.-Veterinary College,
                  <br />
                  Patna - 800014, Bihar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}