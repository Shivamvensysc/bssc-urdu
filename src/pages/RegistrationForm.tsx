import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import {
  User,
  ShieldCheck,
  Briefcase,
  Phone,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  Loader2,
  PartyPopper,
  AlertCircle,
  Lock,
  MailCheck,
  Smartphone,
  Eye,     
  EyeOff,
  ArrowRight
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  initiateCandidateApi,
  verifyOtpApi,
  finalizeRegistrationApi
} from "../api/registrationApi";

import {
  resendOtp,
  calcDuration,
} from "../auth/cognito";

import type { RegistrationFormData, DurationParts } from "../auth/cognito";
import OTPVerificationModal from "../components/common/OTPVerificationModal";
import DateSelect from "../components/common/DateSelect";
import {
  validateAgeEligibility,
   mapCategoryLabelToCode,    
  type Category as CategoryCode,
} from "../validation/ageEligibility";
// ── All network calls now live in a dedicated API module ──────────
import {
  fetchCategoriesApi,
  fetchDisabilitiesApi,
  fetchCaptchaApi,
  validateCaptchaApi,
  type Category,
  type Disability,
} from "../api/registrationApi";
import { useNavigate } from "react-router-dom";

// Color tokens now live in src/theme/colors.ts (kept in sync with
// tailwind.config.js theme.extend.colors) instead of being redeclared
// here. The global font import + `.rf-*` CSS that used to be injected
// via an inline <style>{FONTS}</style> tag now lives in index.css,
// loaded once for the whole app.
import {
  INK,
  INK_SOFT,
  PAPER,
  CARD,
  LINE,
  OCHRE,
  OCHRE_DEEP,
  TEAL,
  DANGER,
} from "../theme/colors"

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

/** Full form state = everything sent to Cognito, plus UI-only confirmation/captcha fields. */
export interface FormData extends RegistrationFormData {
  confirmMobileNo: string;
  confirmEmailId: string;
  captchaInput: string;
  officerType: string;
  categoryCertNo: string;
  categoryIssueDateDay: string;
  categoryIssueDateMonth: string;
  categoryIssueDateYear: string;
  categoryAuthority: string;
  categoryAuthorityOther: string; // For "Other" authority selection
  disabilityCertNo: string;
  disabilityIssueDateDay: string;
  disabilityIssueDateMonth: string;
  disabilityIssueDateYear: string;
  disabilityAuthority: string;
  disabilityAuthorityOther: string; // For "Other" authority selection
  isScribeRequired: string;
  ownScribeRequired: string; // NEW: does the candidate want to bring their own scribe
  categoryId: string;
  casteId: string;
  serviceFromDay: string;
  serviceFromMonth: string;
  serviceFromYear: string;
  serviceToDay: string;
  serviceToMonth: string;
  serviceToYear: string;
   natureOfDisabilityType: string; 
   contractualFromDay: string;
  contractualFromMonth: string;
  contractualFromYear: string;
  contractualToDay: string;
  contractualToMonth: string;
  contractualToYear: string;
   organizationName: string;           // Organization Name
  nameOfPost: string;   
  hasUrduInIntermediate: string; // Intermediate/equiv. with Urdu, min 100 marks — post-specific min qualification
catCertAuth?: string;
disTypePersist?: string;
disCertAuthOth?: string;
disCertAuth?: string;
disCertIssueDt?: string;
registrationNumber?: string;
registrationNo?: string;
catCertIssueDt?: string;
  password: string;
  confirmPassword: string;

  experienceCertificateName: string;
  experienceCertificateBase64: string;
  agreementCopyName: string;
  agreementCopyBase64: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type FormTouched = Partial<Record<keyof FormData, boolean>>;
type SectionId = "personal" | "category" | "service" | "contact";

interface SectionMeta {
  id: SectionId;
  label: string;
  hi: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const SECTIONS: SectionMeta[] = [
  {
    id: "personal",
    label: "Personal & Identity",
    hi: "व्यक्तिगत विवरण",
    icon: User,
  },
  {
    id: "category",
    label: "Category & Reservation",
    hi: "श्रेणी एवं आरक्षण",
    icon: ShieldCheck,
  },
  {
    id: "service",
    label: "Service & Employment",
    hi: "सेवा एवं नियोजन",
    icon: Briefcase,
  },
  {
    id: "contact",
    label: "Contact & Verification",
    hi: "सम्पर्क एवं सत्यापन",
    icon: Phone,
  },
];

const REQUIRED_BY_SECTION: Record<SectionId, (keyof FormData)[]> = {
  personal: [
    "applicantName",
    "gender",
    "isBiharDomicile",
    "dobDay",
    "dobMonth",
    "dobYear",
  ],
  category: [
    "category",
    "caste",
    "isNonCreamyLayer",
    "isPwD",
    "isMin40PercentPwD",
    "hasUrduInIntermediate",
  ],
  service: [
    "isExServiceman",
    "isBiharGovtEmployee",
    "isContractualEmployee",
  ],
  contact: [
    "mobileNo",
    "confirmMobileNo",
    "emailId",
    "confirmEmailId",
    "password",
    "confirmPassword",
  ],
};

const CONDITIONAL_FIELDS: (keyof FormData)[] = [
  "bsscAttempts",
   "ownScribeRequired",
  "serviceFromDay",
  "serviceFromMonth",
  "serviceFromYear",
  "serviceToDay",
  "serviceToMonth",
  "serviceToYear",
  "contractualFromDate",
  "contractualToDate",
  "contractualFromDay",
  "contractualFromMonth",
  "contractualFromYear",
  "contractualToDay",
  "contractualToMonth",
  "contractualToYear",
  "experienceCertificateBase64",
  "agreementCopyBase64",
  
];

/* ---------------------------------------------------------------
   FIELD LABELS — human-readable names used to build the
   "please fix these fields" toast message. Purely presentational;
   does not affect any validation logic.
--------------------------------------------------------------- */
const FIELD_LABELS: Partial<Record<keyof FormData, string>> = {
  applicantName: "Name of applicant",
  gender: "Gender",
  isBiharDomicile: "Domicile of Bihar state",
  dobDay: "Date of birth",
  dobMonth: "Date of birth",
  dobYear: "Date of birth",
  category: "Category",
  caste: "Caste",
  isNonCreamyLayer: "Non-creamy layer status",
  isPwD: "Person with disability",
  isMin40PercentPwD: "Minimum 40% disability",
  hasUrduInIntermediate: "Urdu qualification (Intermediate, min 100 marks)",
  isExServiceman: "Ex-serviceman status",
  serviceFromDay: "Service from date",
  serviceFromMonth: "Service from date",
  serviceFromYear: "Service from date",
  serviceToDay: "Service to date",
  serviceToMonth: "Service to date",
  serviceToYear: "Service to date",
  isBiharGovtEmployee: "Bihar government employee status",
  bsscAttempts: "BSSC exam attempts",
  isContractualEmployee: "Contractual employee status",
  organizationName: "Organization/Department name",
  nameOfPost: "Name of post",
  contractualFromDate: "Contractual service period (from date)",
  contractualToDate: "Contractual service period (to date)",
  contractualFromDay: "Contractual from date",
  contractualFromMonth: "Contractual from date",
  contractualFromYear: "Contractual from date",
  contractualToDay: "Contractual to date",
  contractualToMonth: "Contractual to date",
  contractualToYear: "Contractual to date",
  experienceCertificateBase64: "Experience certificate upload",
  agreementCopyBase64: "Agreement copy upload",
  mobileNo: "Mobile number",
  confirmMobileNo: "Confirm mobile number",
  emailId: "Email ID",
  confirmEmailId: "Confirm email ID",
  password: "Password",
  confirmPassword: "Confirm password",
  categoryCertNo: "Category certificate number",
  categoryIssueDateDay: "Category certificate issue date",
  categoryIssueDateMonth: "Category certificate issue date",
  categoryIssueDateYear: "Category certificate issue date",
  categoryAuthority: "Category certificate issuing authority",
  categoryAuthorityOther: "Category certificate issuing authority",
  disabilityCertNo: "Disability certificate number",
  disabilityIssueDateDay: "Disability certificate issue date",
  disabilityIssueDateMonth: "Disability certificate issue date",
  disabilityIssueDateYear: "Disability certificate issue date",
  disabilityAuthority: "Disability certificate issuing authority",
  disabilityAuthorityOther: "Disability certificate issuing authority",
  isScribeRequired: "Scribe requirement",
  ownScribeRequired: "Own scribe requirement",
};

const initialData: FormData = {
  applicantName: "",
  gender: "",
  isBiharDomicile: "",
  category: "",
  categoryId: "",
  caste: "",
  casteId: "",
  isNonCreamyLayer: "",
  isPwD: "",
  natureOfDisability: "",
  isMin40PercentPwD: "",
  hasUrduInIntermediate: "",
  isExServiceman: "",
  serviceFromDate: "",
  serviceToDate: "",
  serviceFromDay: "",
  serviceFromMonth: "",
  serviceFromYear: "",
  serviceToDay: "",
  serviceToMonth: "",
  serviceToYear: "",
  officerType: "",
  isBiharGovtEmployee: "",
  bsscAttempts: "",
  isContractualEmployee: "",
  nameOfPost: "",
  hasAgreement: "",
  contractualFromDate: "",
  contractualToDate: "",
  mobileNo: "",
  confirmMobileNo: "",
  emailId: "",
  confirmEmailId: "",
  dobDay: "",
  dobMonth: "",
  dobYear: "",
  captchaInput: "",
  categoryCertNo: "",
  categoryIssueDateDay: "",
  categoryIssueDateMonth: "",
  categoryIssueDateYear: "",
  categoryAuthority: "",
  categoryAuthorityOther: "",
  disabilityCertNo: "",
  disabilityIssueDateDay: "",
  disabilityIssueDateMonth: "",
  disabilityIssueDateYear: "",
  disabilityAuthority: "",
  disabilityAuthorityOther: "",
  isNccCadet: "",
  nccCertificateNo: "",
  contractualFromDay: "",
  contractualFromMonth: "",
  contractualFromYear: "",
  contractualToDay: "",
  contractualToMonth: "",
  contractualToYear: "",
 organizationName: "",
  isScribeRequired: "",
   ownScribeRequired: "",
  natureOfDisabilityType: "",
  catCertAuth: "",
  disTypePersist: "",
  disCertAuth: "",
  disCertIssueDt: "",
  registrationNumber: "",
  registrationNo: "",
  catCertIssueDt: "",
  password: "",
  confirmPassword: "",
  experienceCertificateName: "",
  experienceCertificateBase64: "",
  agreementCopyName: "",
  agreementCopyBase64: "",
};

const pad2 = (v: string): string => v.padStart(2, "0");

/** Real-calendar-date check — rejects things like 31 Feb that JS Date would silently roll into March. */
const isRealDate = (day: string, month: string, year: string): boolean => {
  const d = parseInt(day, 10),
    m = parseInt(month, 10),
    y = parseInt(year, 10);
  if (!d || !m || !y) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
};

const isFutureDate = (day: string, month: string, year: string): boolean => {
  if (!isRealDate(day, month, year)) return false;
  const selected = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  selected.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected.getTime() > today.getTime();
};

const formatDuration = (d: DurationParts | null): string =>
  d ? `${d.years}y ${d.months}m ${d.days}d` : "—";





/* ---------------------------------------------------------------
   SMALL PRESENTATIONAL COMPONENTS
--------------------------------------------------------------- */
interface FieldProps {
  label: string;
  hi?: string;
  required?: boolean;
  error?: string | false;
  children: React.ReactNode;
  note?: string;
  className?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  hi,
  required,
  error,
  children,
  note,
  className = "",
}) => (
  <div className={`mb-6 ${className}`}>
    <div className="mb-2">
      <div
        className="text-[12.5px] font-extrabold tracking-wide"
        style={{ color: INK }}
      >
        {required && <span style={{ color: DANGER }}>* </span>}
        {label}
      </div>
      {hi && (
        <div className="text-[11.5px] font-medium" style={{ color: INK_SOFT }}>
          {hi}
        </div>
      )}
    </div>
    {children}
    {error && (
      <div
        className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
        style={{ color: DANGER }}
      >
        <AlertCircle size={12} /> {error}
      </div>
    )}
    {note && (
      <div
        className="text-[11px] font-semibold mt-1.5 leading-relaxed"
        style={{ color: OCHRE_DEEP }}
      >
        {note}
      </div>
    )}
  </div>
);

interface PillGroupProps {
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

const PillGroup: React.FC<PillGroupProps> = ({
  name,
  value,
  options,
  onChange,
  onBlur,
  disabled = false,
}) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((opt) => (
      <label
        key={opt}
        className="rf-pill-wrap"
        style={{ position: "relative", opacity: disabled ? 0.6 : 1 }}
      >
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={onChange}
          onBlur={onBlur}
          className="rf-radio-input"
          disabled={disabled}
        />
        <span className="rf-pill" style={{ cursor: disabled ? "not-allowed" : "pointer" }}>
          {opt}
        </span>
      </label>
    ))}
  </div>
);

interface SelectBoxProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
  error?: string | false;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
}

const SelectBox: React.FC<SelectBoxProps> = ({
  name,
  value,
  onChange,
  onBlur,
  error,
  children,
  className = "",
  disabled = false,
}) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      className={`rf-select appearance-none pr-9 ${error ? "rf-error" : ""} ${className}`}
      style={{ cursor: disabled ? "not-allowed" : "default", opacity: disabled ? 0.6 : 1 }}
    >
      {children}
    </select>
    <ChevronDown
      size={15}
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: INK_SOFT }}
    />
  </div>
);


/* ---------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------- */
export default function GovernmentRegistrationForm(): React.ReactElement {
    const navigate=useNavigate();


    const [zitadelUserId, setZitadelUserId] = useState("");
const [isFinalizing, setIsFinalizing] = useState(false);

  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
 
  // CAPTCHA state
  const [captchaId, setCaptchaId] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isValidatingCaptcha, setIsValidatingCaptcha] = useState(false);
 
  // Categories state
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
 // --- New state for Caste Search Dropdown ---
  const [casteSearchTerm, setCasteSearchTerm] = useState("");
  const [isCasteMenuOpen, setIsCasteMenuOpen] = useState(false);
  const casteDropdownRef = useRef<HTMLDivElement>(null);



const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // Disabilities state
  const [disabilities, setDisabilities] = useState<Disability[]>([]);
  const [disabilitiesLoading, setDisabilitiesLoading] = useState(false);
 
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>(
    {},
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const skipCasteResetRef = useRef(false); 
  const [showOtp, setShowOtp] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [showNclPopup, setShowNclPopup] = useState(false);
  const [showUrduIneligiblePopup, setShowUrduIneligiblePopup] = useState(false);

  // Auto-close the NCL popup after 10 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showNclPopup) {
      timer = setTimeout(() => {
        setShowNclPopup(false);
      }, 10000);
    }
    return () => clearTimeout(timer);
  }, [showNclPopup]);

   useEffect(() => {
   let timer: NodeJS.Timeout;
   if (showUrduIneligiblePopup) {
     timer = setTimeout(() => setShowUrduIneligiblePopup(false), 10000);
   }
   return () => clearTimeout(timer);
 }, [showUrduIneligiblePopup]);


  const [emailVerified, setEmailVerified] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [showMobileOtp, setShowMobileOtp] = useState(false);
  const [mobileSkipped, setMobileSkipped] = useState(false);
  const [mobileOtpLoading, setMobileOtpLoading] = useState(false);
  const zitadelSessionRef = useRef<ZitadelSession | null>(null);

  // ── Fetch Categories ───────────────────────────────────────────
  const fetchCategories = async () => {
    try {
      setCategoriesLoading(true);
      const list = await fetchCategoriesApi();
      setCategories(list);
    } catch (error: any) {
      console.error("Categories error:", error);
      const msg = error?.message || "Failed to load categories";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setCategoriesLoading(false);
    }
  };

  
  
  // ── Fetch Disabilities ──────────────────────────────────────────
  const fetchDisabilities = async () => {
    try {
      setDisabilitiesLoading(true);
      const list = await fetchDisabilitiesApi();
      setDisabilities(list);
    } catch (error: any) {
      console.error("Disabilities error:", error);
      const msg = error?.message || "Failed to load disabilities";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setDisabilitiesLoading(false);
    }
  };

  // ── Fetch CAPTCHA ──────────────────────────────────────────────
  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const { captchaId: id, captchaSvg: svg } = await fetchCaptchaApi();
      setCaptchaId(id);
      setCaptchaSvg(svg);
      setData((d) => ({ ...d, captchaInput: "" }));
      setErrors((prev) => ({ ...prev, captchaInput: "" }));
    } catch (error: any) {
      console.error("CAPTCHA error:", error);
      const msg = error?.message || "Failed to load CAPTCHA. Please refresh.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const validateCaptcha = async (): Promise<boolean> => {
    if (!captchaId) {
      setSubmitError("Please refresh CAPTCHA");
      toast.error("Please refresh CAPTCHA");
      return false;
    }

    if (!data.captchaInput.trim()) {
      setErrors((prev) => ({ ...prev, captchaInput: "Please enter CAPTCHA" }));
      return false;
    }

    try {
      setIsValidatingCaptcha(true);
      const resData = await validateCaptchaApi(captchaId, data.captchaInput.trim());

      if (!resData.success) {
        const msg = resData.message || "Invalid CAPTCHA. Please try again.";
        setErrors((prev) => ({
          ...prev,
          captchaInput: msg
        }));
        toast.error(msg);
        await fetchCaptcha();
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("CAPTCHA validation error:", error);
      const msg = error?.message || "Failed to validate CAPTCHA";
      setErrors((prev) => ({
        ...prev,
        captchaInput: msg
      }));
      toast.error(msg);
      await fetchCaptcha();
      return false;
    } finally {
      setIsValidatingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchDisabilities();
    fetchCaptcha(); // comment for testing 
  }, []);

  // Update subCategories when category changes
  useEffect(() => {
    if (data.categoryId) {
      const selectedCategory = categories.find(
        (c) => c.value === parseInt(data.categoryId)
      );
      if (selectedCategory) {
        setSubCategories(selectedCategory.subCategories || []);
        if (data.caste && !skipCasteResetRef.current) {
          setData((prev) => ({ ...prev, caste: "", casteId: "" }));
        }
        skipCasteResetRef.current=false;
      }
    } else {
      setSubCategories([]);
    }
  }, [data.categoryId, categories]);

  // Handle scroll for sticky shadow
  useEffect(() => {
    const handleScroll = () => {
      if (progressRef.current) {
        const rect = progressRef.current.getBoundingClientRect();
        setIsScrolled(rect.top < 0);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ---------- age calculation (reuses the same duration helper as service/contractual periods) ---------- */
  const age = useMemo<DurationParts | null>(() => {
    if (!isRealDate(data.dobDay, data.dobMonth, data.dobYear)) return null;
    const dobIso = `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`;
    return calcDuration(dobIso, "2025-08-01");
  }, [data.dobDay, data.dobMonth, data.dobYear]);

  // Calculate service duration from date components
  const serviceDuration = useMemo<DurationParts | null>(() => {
    if (!data.serviceFromDay || !data.serviceFromMonth || !data.serviceFromYear ||
        !data.serviceToDay || !data.serviceToMonth || !data.serviceToYear) {
      return null;
    }
    const fromIso = `${data.serviceFromYear}-${pad2(data.serviceFromMonth)}-${pad2(data.serviceFromDay)}`;
    const toIso = `${data.serviceToYear}-${pad2(data.serviceToMonth)}-${pad2(data.serviceToDay)}`;
    return calcDuration(fromIso, toIso);
  }, [data.serviceFromDay, data.serviceFromMonth, data.serviceFromYear,
      data.serviceToDay, data.serviceToMonth, data.serviceToYear]);

  // Calculate contractual employment duration (parity with service/NCC duration displays)
 const contractualDuration = useMemo<DurationParts | null>(() => {
  if (!data.contractualFromDay || !data.contractualFromMonth || !data.contractualFromYear ||
      !data.contractualToDay || !data.contractualToMonth || !data.contractualToYear) {
    return null;
  }
  const fromIso = `${data.contractualFromYear}-${pad2(data.contractualFromMonth)}-${pad2(data.contractualFromDay)}`;
  const toIso = `${data.contractualToYear}-${pad2(data.contractualToMonth)}-${pad2(data.contractualToDay)}`;
  return calcDuration(fromIso, toIso);
}, [data.contractualFromDay, data.contractualFromMonth, data.contractualFromYear,
    data.contractualToDay, data.contractualToMonth, data.contractualToYear]);


    
  const ageEligibility = useMemo(() => {
    if (!isRealDate(data.dobDay, data.dobMonth, data.dobYear)) return null;
    if (!data.category || !data.gender) return null;
    const dobIso = `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`;
    const serviceFromISO = data.serviceFromYear && data.serviceFromMonth && data.serviceFromDay
      ? `${data.serviceFromYear}-${pad2(data.serviceFromMonth)}-${pad2(data.serviceFromDay)}`
      : "";
    const serviceToISO = data.serviceToYear && data.serviceToMonth && data.serviceToDay
      ? `${data.serviceToYear}-${pad2(data.serviceToMonth)}-${pad2(data.serviceToDay)}`
      : "";
    return validateAgeEligibility({
      category: mapCategoryLabelToCode(data.category),
      gender: data.gender as any,
      dobISO: dobIso,
      isPwbd: data.isPwD === "YES" && data.isMin40PercentPwD === "YES",
      isExServiceman: data.isExServiceman === "YES",
      serviceFromISO: serviceFromISO,
      serviceToISO: serviceToISO,
      isBiharGovtEmployee: data.isBiharGovtEmployee === "YES",
    });
  }, [
    data.dobDay,
    data.dobMonth,
    data.dobYear,
    data.category,
    data.gender,
    data.isPwD,
    data.isMin40PercentPwD,
    data.isExServiceman,
    data.officerType,
    data.serviceFromDay,
    data.serviceFromMonth,
    data.serviceFromYear,
    data.serviceToDay,
    data.serviceToMonth,
    data.serviceToYear,
    data.isBiharGovtEmployee,
  ]);

// Handle closing the custom caste dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (casteDropdownRef.current && !casteDropdownRef.current.contains(event.target as Node)) {
        setIsCasteMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- validation ---------- */
  const validateField = useCallback(
    (name: keyof FormData, value: string, all: FormData): string => {
      switch (name) {
        case "applicantName":
          return value.trim() ? "" : "Applicant name is required";
        case "gender":
          return value ? "" : "Gender is required";
        case "isBiharDomicile":
          return value ? "" : "Domicile status is required";
        case "category":
             if (all.isBiharDomicile === "NO") return "";
          if (!value) return "Category is required";
          if (
            all.gender === "TRANSGENDER" &&
            all.isBiharDomicile === "YES" &&
            mapCategoryLabelToCode(value) !== "BC"
          ) {
            return "Transgender candidates must apply under the BC category";
          }
          return "";
        case "caste":
          if (mapCategoryLabelToCode(all.category) === "UR") return "";
             if (all.isBiharDomicile === "NO") return "";
          // Check if subCategories exist for selected category
          const selectedCat = categories.find(
            (c) => c.value === parseInt(all.categoryId)
          );
          if (selectedCat && selectedCat.subCategories && selectedCat.subCategories.length > 0) {
            return value ? "" : "Caste is required";
          }
          return ""; // No caste selection needed if no subcategories
        
          case "hasUrduInIntermediate":
            if (!value) return "This field is required";
            if (value === "NO")
              return "Urdu as a subject with minimum 100 marks in Intermediate (10+2)/equivalent is mandatory for this post.";
            return "";

          case "isNonCreamyLayer":
            if (all.isBiharDomicile === "NO") return "";
            const nclCode = mapCategoryLabelToCode(all.category);
            if (nclCode !== "EBC" && nclCode !== "BC") return "";
            return value ? "" : "Non-creamy layer status is required";
        case "isPwD":
             if (all.isBiharDomicile === "NO") return "";
          return value ? "" : "PWD status is required";
        case "isMin40PercentPwD":
             if (all.isBiharDomicile === "NO") return "";
             if (all.isPwD !== "YES") return "";
          if (!value) return "This field is required";
      
          return "";
        case "isExServiceman":
             if (all.isBiharDomicile === "NO") return "";
          if (!value) return "Ex-serviceman status is required";
       
          
          return "";
        case "serviceFromDay":
        case "serviceFromMonth":
        case "serviceFromYear":
        case "serviceToDay":
        case "serviceToMonth":
        case "serviceToYear":
             if (all.isBiharDomicile === "NO") return "";
          if (all.isExServiceman === "YES") {
            if (!all.serviceFromDay || !all.serviceFromMonth || !all.serviceFromYear ||
                !all.serviceToDay || !all.serviceToMonth || !all.serviceToYear) {
              return "Complete service period is required for ex-servicemen";
            }
            // Validate that from date is before to date
            const fromDate = new Date(
              parseInt(all.serviceFromYear),
              parseInt(all.serviceFromMonth) - 1,
              parseInt(all.serviceFromDay)
            );
            const toDate = new Date(
              parseInt(all.serviceToYear),
              parseInt(all.serviceToMonth) - 1,
              parseInt(all.serviceToDay)
            );
            if (fromDate > toDate) {
              return "From date must be before to date";
            }
            return "";
          }
          return "";
      
      
        case "isBiharGovtEmployee":
             if (all.isBiharDomicile === "NO") return "";
             if (all.isBiharGovtEmployee !== "YES") return "";  
          return value ? "" : "This field is required";
        case "bsscAttempts":
             if (all.isBiharDomicile === "NO") return "";
             if (all.isBiharGovtEmployee !== "YES") return "";
          if (!value) return "Number of attempts is required";
          if (value === "5") {
            return "Candidates with 5 attempts after 12-12-2022 are not eligible.";
          }
          return "";
        case "isContractualEmployee":
             if (all.isBiharDomicile === "NO") return "";
          return value ? "" : "This field is required";
        case "contractualFromDate":
case "contractualToDate":
case "contractualFromDay":
case "contractualFromMonth":
case "contractualFromYear":
case "contractualToDay":
case "contractualToMonth":
case "contractualToYear":
     if (all.isBiharDomicile === "NO") return "";
  if (all.isContractualEmployee === "YES") {
    if (!all.contractualFromDay || !all.contractualFromMonth || !all.contractualFromYear ||
        !all.contractualToDay || !all.contractualToMonth || !all.contractualToYear) {
      return "Complete contractual service period is required";
    }
    // Validate that from date is before to date
    const fromDate = new Date(
      parseInt(all.contractualFromYear),
      parseInt(all.contractualFromMonth) - 1,
      parseInt(all.contractualFromDay)
    );
    const toDate = new Date(
      parseInt(all.contractualToYear),
      parseInt(all.contractualToMonth) - 1,
      parseInt(all.contractualToDay)
    );
    if (fromDate > toDate) {
      return "From date must be before to date";
    }
    return "";
  }
  return "";
        case "mobileNo": {
          if (!value) return "Mobile number is required";
          if (!/^\d+$/.test(value)) return "Mobile number must contain digits only";
          if (value.length !== 10) return "Mobile number must be exactly 10 digits";
          if (!/^[6-9]\d{9}$/.test(value))
            return "Enter a valid 10 digit number starting with 6-9";
          // Reject numbers where all 10 digits are identical (e.g. 9999999999)
          if (/^(\d)\1{9}$/.test(value))
            return "Enter a valid mobile number";
          // Reject obvious placeholder/sequential patterns (ascending or descending)
          const ascending = "0123456789";
          const descending = "9876543210";
          if (ascending.includes(value) || descending.includes(value)) {
            return "Enter a valid mobile number";
          }
          return "";
        }
        case "confirmMobileNo":
          if (!value) return "Please confirm your mobile number";
          return value === all.mobileNo ? "" : "Mobile numbers do not match";
        case "emailId":
          if (!value) return "Email is required";
         const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,6}$/;
  
  // Check if the ENTIRE string matches the pattern
  if (!emailRegex.test(value)) {
    return "Enter a valid email address (e.g., name@domain.com)";
  }
  
  // Additional checks
  const parts = value.split('@');
  if (parts.length !== 2) {
    return "Enter a valid email address";
  }
  
  const localPart = parts[0];
  const domainPart = parts[1];
  
  // Local part should not be empty and should not start/end with dot
  if (localPart.length === 0 || localPart.startsWith('.') || localPart.endsWith('.')) {
    return "Email local part cannot be empty or start/end with a dot";
  }
  
  // Domain should not be empty
  if (domainPart.length === 0) {
    return "Email domain cannot be empty";
  }
  
  // Check TLD (top-level domain) is valid
  const domainSegments = domainPart.split('.');
  if (domainSegments.length < 2) {
    return "Email must have a valid domain with a TLD (e.g., .com, .in)";
  }
  
  const tld = domainSegments[domainSegments.length - 1];
  if (tld.length < 2 || tld.length > 6) {
    return "Email TLD must be between 2-6 characters";
  }
  
  // Check for consecutive dots
  if (value.includes('..')) {
    return "Email cannot contain consecutive dots";
  }
  
  return "";
        case "confirmEmailId":
          if (!value) return "Please confirm your email";

        return value === all.emailId ? "" : "Email addresses do not match";
        case "dobDay":
        case "dobMonth":
        case "dobYear":
          if (!all.dobDay || !all.dobMonth || !all.dobYear)
            return "Complete date of birth is required";
          return isRealDate(all.dobDay, all.dobMonth, all.dobYear)
            ? ""
            : "Enter a valid calendar date";
          
        case "password": {
          if (!value) return "Password is required";
          const hasMinLength = value.length >= 8;
          const hasCapital = /[A-Z]/.test(value);
          const hasNumber = /\d/.test(value);
          const hasSpecialChar = /[^A-Za-z0-9]/.test(value);
          if (!(hasMinLength && hasCapital && hasNumber && hasSpecialChar)) {
            return "Password must be 8+ characters with 1 capital letter, 1 number, and 1 special character";
          }
          return "";
        }
        case "confirmPassword":
          if (!value) return "Please confirm your password";
          return value === all.password ? "" : "Passwords do not match";
        case "categoryCertNo":
        case "categoryIssueDateDay":
        case "categoryIssueDateMonth":
        case "categoryIssueDateYear":
             if (all.isBiharDomicile === "NO") return "";
             if (all.isNonCreamyLayer === "NO") return "";
          if (
            all.isBiharDomicile === "YES" &&
            all.category !== "" &&
            mapCategoryLabelToCode(all.category) !== "UR" &&
            !all.categoryCertNo
          ) {
            return "Certificate details are required for reserved categories";
          }
          return "";
        case "categoryAuthority":
             if (all.isBiharDomicile === "NO") return "";
             if (all.isNonCreamyLayer === "NO") return "";
          if (
            all.isBiharDomicile === "YES" &&
            all.category !== "" &&
            mapCategoryLabelToCode(all.category) !== "UR" &&
            !value
          ) {
            return "Issuing authority is required";
          }
          // If "Other" is selected, categoryAuthorityOther is required
          if (value === "Other" && !all.categoryAuthorityOther) {
            return "Please specify the issuing authority";
          }
          return "";
        case "categoryAuthorityOther":
          if (all.categoryAuthority === "Other" && !value) {
            return "Please specify the issuing authority";
          }
          return "";
        case "disabilityCertNo":
        case "disabilityIssueDateDay":
        case "disabilityIssueDateMonth":
        case "disabilityIssueDateYear":
             if (all.isBiharDomicile === "NO") return "";
          if (all.isBiharDomicile === "YES" && all.isPwD === "YES" && !all.disabilityCertNo) {
            return "Disability certificate details are required";
          }
          return "";
        case "disabilityAuthority":
             if (all.isBiharDomicile === "NO") return "";
          if (all.isBiharDomicile === "YES" && all.isPwD === "YES" && !value) {
            return "Issuing authority is required";
          }
          if (value === "Other" && !all.disabilityAuthorityOther) {
            return "Please specify the issuing authority";
          }
          return "";
        case "disabilityAuthorityOther":
          if (all.disabilityAuthority === "Other" && !value) {
            return "Please specify the issuing authority";
          }
          return "";
        case "isScribeRequired":
             if (all.isBiharDomicile === "NO") return "";
          if (all.isBiharDomicile === "YES" && all.isPwD === "YES" && all.isMin40PercentPwD === "YES" && !value) {
            return "Please specify if scribe is required";
          }
          return "";

          case "ownScribeRequired":
             if (all.isBiharDomicile === "NO") return "";
          if (
            all.isBiharDomicile === "YES" &&
            all.isPwD === "YES" &&
            all.isMin40PercentPwD === "YES" &&
            all.isScribeRequired === "YES" &&
            !value
          ) {
            return "Please specify if you want your own scribe";
          }
          return "";

           case "organizationName":
        if (all.isBiharDomicile === "NO") return "";
        if (all.isContractualEmployee === "YES" && !value) {
          return "Organization name is required";
        }
        return "";
        
      case "nameOfPost":
        if (all.isBiharDomicile === "NO") return "";
        if (all.isContractualEmployee === "YES" && !value) {
          return "Name of post is required";
        }
        return "";

        case "experienceCertificateBase64":
          if (all.isBiharDomicile === "NO") return "";
          if (all.isContractualEmployee === "YES" && !value) {
            return "Experience Certificate is required";
          }
          return "";
          
        case "agreementCopyBase64":
          if (all.isBiharDomicile === "NO") return "";
          if (all.isContractualEmployee === "YES" && all.hasAgreement === "YES" && !value) {
            return "Agreement Copy is required";
          }
          return "";

        default:
          return "";
      }
    },
    [categories],
  );

  type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  const handleChange = (e: FieldEvent) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;


    if (name === "applicantName") {
    // Allow only letters, spaces, and common name characters (hyphen, apostrophe, dot)
    const sanitizedValue = value.replace(/[^a-zA-Z\s\-'.,]/g, '');
    // Update the value to the sanitized version
    const next: FormData = { ...data, applicantName: sanitizedValue };
    setData(next);
    if (touched.applicantName) {
      setErrors((prev) => ({
        ...prev,
        applicantName: validateField("applicantName", sanitizedValue, next),
      }));
    }
    return; // Exit early
  }

  // STRICT email sanitization - also prevent extra characters at the end
if (name === "emailId" || name === "confirmEmailId") {
  // Convert to lowercase and remove ALL invalid characters
  let sanitizedValue = value.toLowerCase().replace(/[^a-zA-Z0-9._%+-@]/g, '');
  
  // Prevent multiple @ symbols
  const atCount = (sanitizedValue.match(/@/g) || []).length;
  if (atCount > 1) {
    const parts = sanitizedValue.split('@');
    sanitizedValue = parts[0] + '@' + parts.slice(1).join('').replace(/@/g, '');
  }
  
  // Optional: Limit email length to prevent abuse
  if (sanitizedValue.length > 254) {
    sanitizedValue = sanitizedValue.slice(0, 254);
  }
  
  const next: FormData = { ...data, [fieldName]: sanitizedValue };
  setData(next);
  if (touched[fieldName]) {
    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, sanitizedValue, next),
    }));
  }

  // EmailId <-> confirmEmailId are interdependent
  if (name === "emailId" && touched.confirmEmailId) {
    setErrors((prev) => ({
      ...prev,
      confirmEmailId: validateField("confirmEmailId", next.confirmEmailId, next),
    }));
  }
  
  return;
}

// Auto-select Category & Caste for Transgender candidates (Bihar domicile)
    if (name === "gender") {
      let next: FormData = { ...data, gender: value };
      if (value === "TRANSGENDER" && data.isBiharDomicile === "YES") {
        const bcCategory = categories.find(
          (c) => mapCategoryLabelToCode(c.label) === "BC"
        );
        if (bcCategory) {
          const transSub = (bcCategory.subCategories || []).find((s) =>
            s.label.includes("Transgender")
          );
          next = {
            ...next,
            category: bcCategory.label,
            categoryId: String(bcCategory.value),
            caste: transSub ? transSub.label : "",
            casteId: transSub ? String(transSub.value) : "",
          };
          skipCasteResetRef.current = true;
        }
      }
      setData(next);
      if (touched.gender) {
        setErrors((prev) => ({
          ...prev,
          gender: validateField("gender", value, next),
        }));
      }
      if (touched.category) {
        setErrors((prev) => ({
          ...prev,
          category: validateField("category", next.category, next),
        }));
      }
      if (touched.caste) {
        setErrors((prev) => ({
          ...prev,
          caste: validateField("caste", next.caste, next),
        }));
      }
      return;
    }

   
    // Handle category selection - map label to value for storage
    if (name === "category") {
      const selectedCategory = categories.find((c) => c.label === value);
      if (selectedCategory) {
        const newCatCode = mapCategoryLabelToCode(value);
        const requiresNCL = newCatCode === "EBC" || newCatCode === "BC";
        const next: FormData = {
          ...data,
          category: value,
          categoryId: String(selectedCategory.value),
          caste: "",
          casteId: "",
          isNonCreamyLayer: requiresNCL ? data.isNonCreamyLayer : "",
        };
        setData(next);
        if (touched[fieldName])
          setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, value, next),
          }));
        setErrors((prev) => ({
          ...prev,
          caste: "",
          isNonCreamyLayer: requiresNCL ? prev.isNonCreamyLayer : "",
        }));
        return;
      }
    }
   
    // Handle caste selection
    if (name === "caste") {
      const selectedSubCategory = subCategories.find((c) => c.label === value);
      if (selectedSubCategory) {
        const next: FormData = {
          ...data,
          caste: value,
          casteId: String(selectedSubCategory.value)
        };
        setData(next);
        if (touched[fieldName])
          setErrors((prev) => ({
            ...prev,
            [fieldName]: validateField(fieldName, value, next),
          }));
        return;
      }
    }

    const digitsOnly =
      name === "mobileNo" || name === "confirmMobileNo"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;
   
    // Create a copy of current data
    const next: FormData = { ...data, [fieldName]: digitsOnly };
   
    // If domicile is set to NO, auto-set category to UR and clear dependent fields
    if (name === "isBiharDomicile" && value === "NO") {
      // Find the "Unreserved (General)" category from the API
      const urCategory = categories.find(
        (c) => c.label.includes("Unreserved") || c.label.includes("गैर आरक्षित")
      );

      
        // Clear validation errors for hidden fields
  setErrors((prev) => ({
    ...prev,
    isExServiceman: "",
    serviceFromDay: "",
    serviceFromMonth: "",
    serviceFromYear: "",
    serviceToDay: "",
    serviceToMonth: "",
    serviceToYear: "",
    officerType: "",
    isBiharGovtEmployee: "",
    bsscAttempts: "",
    isContractualEmployee: "",
    contractualFromDate: "",
    contractualToDate: "",
    contractualFromDay: "",
    contractualFromMonth: "",
    contractualFromYear: "",
    contractualToDay: "",
    contractualToMonth: "",
    contractualToYear: "",
    categoryCertNo: "",
    categoryIssueDateDay: "",
    categoryIssueDateMonth: "",
    categoryIssueDateYear: "",
    categoryAuthority: "",
    categoryAuthorityOther: "",
    disabilityCertNo: "",
    disabilityIssueDateDay: "",
    disabilityIssueDateMonth: "",
    disabilityIssueDateYear: "",
    disabilityAuthority: "",
    disabilityAuthorityOther: "",
    isScribeRequired: "",
  }));
     
      next.category = urCategory ? urCategory.label : "UR";
      next.categoryId = urCategory ? String(urCategory.value) : "";
      next.caste = "";
      next.casteId = "";
      next.isNonCreamyLayer = "";
      next.isPwD = "";
      next.natureOfDisability = "";
      next.isMin40PercentPwD = "";
      next.isScribeRequired = "";
      next.disabilityCertNo = "";
      next.disabilityIssueDateDay = "";
      next.disabilityIssueDateMonth = "";
      next.disabilityIssueDateYear = "";
      next.disabilityAuthority = "";
      next.disabilityAuthorityOther = "";
      next.isExServiceman = "";
      next.serviceFromDay = "";
      next.serviceFromMonth = "";
      next.serviceFromYear = "";
      next.serviceToDay = "";
      next.serviceToMonth = "";
      next.serviceToYear = "";
      next.officerType = "";
      next.isNccCadet = "";
      next.nccCertificateNo = "";
      next.isBiharGovtEmployee = "";
      next.bsscAttempts = "";
      next.isContractualEmployee = "";
      next.nameOfPost = "";
      next.hasAgreement = "";
      next.contractualFromDate = "";
      next.contractualToDate = "";
      // Add these new fields
next.contractualFromDay = "";
next.contractualFromMonth = "";
next.contractualFromYear = "";
next.contractualToDay = "";
next.contractualToMonth = "";
next.contractualToYear = "";
    }
   
   // If domicile is set to YES, set category to empty (so user can select)
    // — unless Transgender is already selected, in which case auto-apply BC + Transgender caste.
    if (name === "isBiharDomicile" && value === "YES") {
      if (data.gender === "TRANSGENDER") {
        const bcCategory = categories.find(
          (c) => mapCategoryLabelToCode(c.label) === "BC"
        );
        if (bcCategory) {
          const transSub = (bcCategory.subCategories || []).find((s) =>
            s.label.includes("Transgender")
          );
          next.category = bcCategory.label;
          next.categoryId = String(bcCategory.value);
          next.caste = transSub ? transSub.label : "";
          next.casteId = transSub ? String(transSub.value) : "";
          skipCasteResetRef.current = true;
        } else {
          next.category = "";
          next.categoryId = "";
          next.caste = "";
          next.casteId = "";
        }
      } else {
        next.category = "";
        next.categoryId = "";
        next.caste = "";
        next.casteId = "";
      }
    }

    // If ex-serviceman is set to NO, clear the dependent officer-type / service fields
    if (name === "isExServiceman" && value === "NO") {
      next.officerType = "";
      next.serviceFromDay = "";
      next.serviceFromMonth = "";
      next.serviceFromYear = "";
      next.serviceToDay = "";
      next.serviceToMonth = "";
      next.serviceToYear = "";
    }

    // If PWD is set to NO, clear the dependent disability fields
    if (name === "isPwD" && value === "NO") {
      next.natureOfDisability = "";
      next.natureOfDisabilityType = "";
      next.isMin40PercentPwD = "";
      next.isScribeRequired = "";
        next.ownScribeRequired = "";
      next.disabilityCertNo = "";
      next.disabilityIssueDateDay = "";
      next.disabilityIssueDateMonth = "";
      next.disabilityIssueDateYear = "";
      next.disabilityAuthority = "";
      next.disabilityAuthorityOther = "";
    }
    // If scribe is not required, clear the "own scribe" follow-up
    if (name === "isScribeRequired" && value === "NO") {
      next.ownScribeRequired = "";
    }

    // If Govt Employee is set to NO, clear the attempts field
    if (name === "isBiharGovtEmployee" && value === "NO") {
      next.bsscAttempts = "";
      // Clear any lingering error message
      setErrors((prev) => ({ ...prev, bsscAttempts: "" }));
    }

   
    // If Non-Creamy Layer is NO, clear category certificate fields and their errors
    if (name === "isNonCreamyLayer" && value === "NO") {
      setShowNclPopup(true); // <--- ADD THIS LINE HERE
      next.categoryCertNo = "";
      next.categoryIssueDateDay = "";
      next.categoryIssueDateMonth = "";
      next.categoryIssueDateYear = "";
      next.categoryAuthority = "";
      next.categoryAuthorityOther = "";
      
      // Clear any stale validation errors for these hidden fields
      setErrors((prev) => ({
        ...prev,
        categoryCertNo: "",
        categoryIssueDateDay: "",
        categoryIssueDateMonth: "",
        categoryIssueDateYear: "",
        categoryAuthority: "",
        categoryAuthorityOther: ""
      }));
    }
    
    if (name === "hasUrduInIntermediate" && value === "NO") {
     setShowUrduIneligiblePopup(true);
   }

    if (name === "hasAgreement" && value === "NO") {
      next.isContractualEmployee = "NO";
      next.organizationName = "";
      next.nameOfPost = "";
      next.contractualFromDate = "";
      next.contractualToDate = "";
      next.contractualFromDay = "";
      next.contractualFromMonth = "";
      next.contractualFromYear = "";
      next.contractualToDay = "";
      next.contractualToMonth = "";
      next.contractualToYear = "";

      setErrors((prev) => ({
        ...prev,
        isContractualEmployee: "",
        organizationName: "",
        nameOfPost: "",
        contractualFromDate: "",
        contractualToDate: "",
        contractualFromDay: "",
        contractualFromMonth: "",
        contractualFromYear: "",
        contractualToDay: "",
        contractualToMonth: "",
        contractualToYear: "",
        experienceCertificateName: "",
      }));

      next.experienceCertificateName = "";
      next.experienceCertificateBase64 = "";
      next.agreementCopyName = "";
      next.agreementCopyBase64 = "";

      // Add to setErrors reset:
      setErrors((prev) => ({
        ...prev,
        // ... (Keep existing error clears)
        experienceCertificateBase64: "",
        agreementCopyBase64: "",
      }));
    }
   
    setData(next);
    if (touched[fieldName])
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(fieldName, digitsOnly, next),
      }));

    // DOB fields are interdependent — once one is touched, re-validate the whole trio live
    if (
      ["dobDay", "dobMonth", "dobYear"].includes(name) &&
      (touched.dobDay || touched.dobMonth || touched.dobYear)
    ) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({
        ...prev,
        dobDay: msg,
        dobMonth: msg,
        dobYear: msg,
      }));
    }
    // Service date fields are interdependent
    if (
      ["serviceFromDay", "serviceFromMonth", "serviceFromYear", "serviceToDay", "serviceToMonth", "serviceToYear"].includes(name) &&
      (touched.serviceFromDay || touched.serviceFromMonth || touched.serviceFromYear ||
       touched.serviceToDay || touched.serviceToMonth || touched.serviceToYear)
    ) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({
        ...prev,
        serviceFromDay: msg,
        serviceFromMonth: msg,
        serviceFromYear: msg,
        serviceToDay: msg,
        serviceToMonth: msg,
        serviceToYear: msg,
      }));
    }
    // Contractual date pairs are interdependent
    if (
      ["contractualFromDate", "contractualToDate"].includes(name) &&
      (touched.contractualFromDate || touched.contractualToDate)
    ) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({
        ...prev,
        contractualFromDate: msg,
        contractualToDate: msg,
      }));
    }

    if (name === "isExServiceman" || name === "isMin40PercentPwD") {
      if (touched.isExServiceman) {
        setErrors((prev) => ({
          ...prev,
          isExServiceman: validateField("isExServiceman", next.isExServiceman, next),
        }));
      }
      if (touched.isMin40PercentPwD) {
        setErrors((prev) => ({
          ...prev,
          isMin40PercentPwD: validateField(
            "isMin40PercentPwD",
            next.isMin40PercentPwD,
            next,
          ),
        }));
      }
    }

    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", next.confirmPassword, next),
      }));
    }

    // MobileNo <-> confirmMobileNo are interdependent 
    if (name === "mobileNo" && touched.confirmMobileNo) {
      setErrors((prev) => ({
        ...prev,
        confirmMobileNo: validateField("confirmMobileNo", next.confirmMobileNo, next),
      }));
    }
  };


 const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: "experienceCertificate" | "agreementCopy"
  ) => {
    const file = e.target.files?.[0];
    if (!file) {
      setData((prev) => ({ ...prev, [`${fieldName}Name`]: "", [`${fieldName}Base64`]: "" }));
      return;
    }

    if (file.type !== "application/pdf") {
      toast.error("Please upload a valid PDF file.");
      e.target.value = ""; 
      return;
    }

    if (file.size > 2048 * 1024) {
      toast.error("File size must be less than 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const fullDataUrl = event.target?.result as string;
      
      // FIX: Split the string to remove 'data:application/pdf;base64,' and keep only the raw base64 data
      const rawBase64Data = fullDataUrl.split(',')[1];
      
      setData((prev) => ({
        ...prev,
        [`${fieldName}Name`]: file.name,
        [`${fieldName}Base64`]: rawBase64Data,
      }));
      setErrors((prev) => ({ ...prev, [`${fieldName}Base64`]: "" }));
    };
    reader.readAsDataURL(file);
  };
  

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const msg = validateField(fieldName, value, data);
    if (["dobDay", "dobMonth", "dobYear"].includes(name)) {
      setTouched((prev) => ({
        ...prev,
        dobDay: true,
        dobMonth: true,
        dobYear: true,
      }));
      setErrors((prev) => ({
        ...prev,
        dobDay: msg,
        dobMonth: msg,
        dobYear: msg,
      }));
    } else if (["serviceFromDay", "serviceFromMonth", "serviceFromYear", "serviceToDay", "serviceToMonth", "serviceToYear"].includes(name)) {
      setTouched((prev) => ({
        ...prev,
        serviceFromDay: true,
        serviceFromMonth: true,
        serviceFromYear: true,
        serviceToDay: true,
        serviceToMonth: true,
        serviceToYear: true,
      }));
      setErrors((prev) => ({
        ...prev,
        serviceFromDay: msg,
        serviceFromMonth: msg,
        serviceFromYear: msg,
        serviceToDay: msg,
        serviceToMonth: msg,
        serviceToYear: msg,
      }));
    } else if (["contractualFromDate", "contractualToDate"].includes(name)) {
      setTouched((prev) => ({
        ...prev,
        contractualFromDate: true,
        contractualToDate: true,
      }));
      setErrors((prev) => ({
        ...prev,
        contractualFromDate: msg,
        contractualToDate: msg,
      }));
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: msg }));
    }
  };

  const refreshCaptcha = () => {
    fetchCaptcha();
  };

  /* ---------- completion tracking ---------- */
  const sectionStatus = (id: SectionId) => {
    const fields = REQUIRED_BY_SECTION[id];
    const filled = fields.filter(
      (f) => String(data[f] || "").trim() !== "",
    ).length;
    const hasErr = fields.some((f) => errors[f]);
    return {
      filled,
      total: fields.length,
      done: filled === fields.length && !hasErr,
    };
  };


  // Revert the selection and close modal if the user cancels
  const handleCancelNclPopup = () => {
    setShowNclPopup(false);
  };
  
  // Filter castes based on search term
  const filteredCastes = subCategories.filter(sub =>
    sub.label.toLowerCase().includes(casteSearchTerm.toLowerCase())
  );

  /* ---------- scroll-spy ---------- */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = (entry.target as HTMLElement).dataset.section as
            | SectionId
            | undefined;
          if (entry.isIntersecting && section) setActiveSection(section);
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0.1 },
    );
    Object.values(sectionRefs.current).forEach(
      (el) => el && observerRef.current?.observe(el),
    );
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    const target = sectionRefs.current[id];
    if (target) {
      const yOffset = -80; // Offset for sticky header
      const y =
        target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  // DateSelect handlers for DOB
  const handleDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = { day: "dobDay", month: "dobMonth", year: "dobYear" };
    const formField = fieldMap[field];
    const next: FormData = { ...data, [formField]: value };
    if (isFutureDate(next.dobDay, next.dobMonth, next.dobYear)) {
    toast.error("Future date is not allowed for date of birth.");
    return;
  }

    setData(next);
    if (touched[formField]) {
      const msg = validateField(formField, value, next);
      setErrors((prev) => ({ ...prev, [formField]: msg }));
    }
    // Re-validate all DOB fields
    if (touched.dobDay || touched.dobMonth || touched.dobYear) {
      const msg = validateField("dobDay", next.dobDay, next);
      setErrors((prev) => ({
        ...prev,
        dobDay: msg,
        dobMonth: msg,
        dobYear: msg,
      }));
    }
  };

  const handleDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = { day: "dobDay", month: "dobMonth", year: "dobYear" };
    const formField = fieldMap[field];
    setTouched((prev) => ({
      ...prev,
      [formField]: true,
      dobDay: true,
      dobMonth: true,
      dobYear: true,
    }));
    const msg = validateField("dobDay", data.dobDay, data);
    setErrors((prev) => ({
      ...prev,
      dobDay: msg,
      dobMonth: msg,
      dobYear: msg,
    }));
  };

  // DateSelect handlers for Service From Date
  const handleServiceFromDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = {
      day: "serviceFromDay",
      month: "serviceFromMonth",
      year: "serviceFromYear"
    };
    const formField = fieldMap[field];
    const next: FormData = { ...data, [formField]: value };
    if (isFutureDate(next.serviceFromDay, next.serviceFromMonth, next.serviceFromYear)) {
    toast.error("Future date is not allowed.");
    return;
  }
    setData(next);
    if (touched[formField]) {
      const msg = validateField(formField, value, next);
      setErrors((prev) => ({ ...prev, [formField]: msg }));
    }
    // Re-validate all service date fields
    if (touched.serviceFromDay || touched.serviceFromMonth || touched.serviceFromYear ||
        touched.serviceToDay || touched.serviceToMonth || touched.serviceToYear) {
      const msg = validateField("serviceFromDay", next.serviceFromDay, next);
      setErrors((prev) => ({
        ...prev,
        serviceFromDay: msg,
        serviceFromMonth: msg,
        serviceFromYear: msg,
        serviceToDay: msg,
        serviceToMonth: msg,
        serviceToYear: msg,
      }));
    }
  };

  const handleServiceFromDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = {
      day: "serviceFromDay",
      month: "serviceFromMonth",
      year: "serviceFromYear"
    };
    const formField = fieldMap[field];
    setTouched((prev) => ({
      ...prev,
      [formField]: true,
      serviceFromDay: true,
      serviceFromMonth: true,
      serviceFromYear: true,
      serviceToDay: true,
      serviceToMonth: true,
      serviceToYear: true,
    }));
    const msg = validateField("serviceFromDay", data.serviceFromDay, data);
    setErrors((prev) => ({
      ...prev,
      serviceFromDay: msg,
      serviceFromMonth: msg,
      serviceFromYear: msg,
      serviceToDay: msg,
      serviceToMonth: msg,
      serviceToYear: msg,
    }));
  };

  // DateSelect handlers for Service To Date
  const handleServiceToDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = {
      day: "serviceToDay",
      month: "serviceToMonth",
      year: "serviceToYear"
    };
    const formField = fieldMap[field];
    const next: FormData = { ...data, [formField]: value };
     if (isFutureDate(next.serviceToDay, next.serviceToMonth, next.serviceToYear)) {
    toast.error("Future date is not allowed.");
    return;
  }

    setData(next);
    if (touched[formField]) {
      const msg = validateField(formField, value, next);
      setErrors((prev) => ({ ...prev, [formField]: msg }));
    }
    // Re-validate all service date fields
    if (touched.serviceFromDay || touched.serviceFromMonth || touched.serviceFromYear ||
        touched.serviceToDay || touched.serviceToMonth || touched.serviceToYear) {
      const msg = validateField("serviceFromDay", next.serviceFromDay, next);
      setErrors((prev) => ({
        ...prev,
        serviceFromDay: msg,
        serviceFromMonth: msg,
        serviceFromYear: msg,
        serviceToDay: msg,
        serviceToMonth: msg,
        serviceToYear: msg,
      }));
    }
  };

  const handleServiceToDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = {
      day: "serviceToDay",
      month: "serviceToMonth",
      year: "serviceToYear"
    };
    const formField = fieldMap[field];
    setTouched((prev) => ({
      ...prev,
      [formField]: true,
      serviceFromDay: true,
      serviceFromMonth: true,
      serviceFromYear: true,
      serviceToDay: true,
      serviceToMonth: true,
      serviceToYear: true,
    }));
    const msg = validateField("serviceFromDay", data.serviceFromDay, data);
    setErrors((prev) => ({
      ...prev,
      serviceFromDay: msg,
      serviceFromMonth: msg,
      serviceFromYear: msg,
      serviceToDay: msg,
      serviceToMonth: msg,
      serviceToYear: msg,
    }));
  };

  // DateSelect handlers for Category Certificate Date
  const handleCategoryDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = {
      day: "categoryIssueDateDay",
      month: "categoryIssueDateMonth",
      year: "categoryIssueDateYear"
    };
    const formField = fieldMap[field];
     const next: FormData = { ...data, [formField]: value };
  if (isFutureDate(next.categoryIssueDateDay, next.categoryIssueDateMonth, next.categoryIssueDateYear)) {
    toast.error("Future date is not allowed.");
    return;
  }
  setData(next);

    if (touched[formField]) {
    const msg = validateField(formField, value, next);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  }
  };

  const handleCategoryDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = {
      day: "categoryIssueDateDay",
      month: "categoryIssueDateMonth",
      year: "categoryIssueDateYear"
    };
    const formField = fieldMap[field];
    setTouched((prev) => ({ ...prev, [formField]: true }));
    const msg = validateField(formField, data[formField], data);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  };

  // DateSelect handlers for Disability Certificate Date
  const handleDisabilityDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = {
      day: "disabilityIssueDateDay",
      month: "disabilityIssueDateMonth",
      year: "disabilityIssueDateYear"
    };
    const formField = fieldMap[field];
    const next: FormData = { ...data, [formField]: value };
  if (isFutureDate(next.disabilityIssueDateDay, next.disabilityIssueDateMonth, next.disabilityIssueDateYear)) {
    toast.error("Future date is not allowed.");
    return;
  }
  setData(next);
  if (touched[formField]) {
    const msg = validateField(formField, value, next);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  }
  };

  const handleDisabilityDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = {
      day: "disabilityIssueDateDay",
      month: "disabilityIssueDateMonth",
      year: "disabilityIssueDateYear"
    };
    const formField = fieldMap[field];
    setTouched((prev) => ({ ...prev, [formField]: true }));
    const msg = validateField(formField, data[formField], data);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  };



  // DateSelect handlers for Contractual From Date
const handleContractualFromDateChange = (field: "day" | "month" | "year", value: string) => {
  const fieldMap = {
    day: "contractualFromDay",
    month: "contractualFromMonth",
    year: "contractualFromYear"
  };
  const formField = fieldMap[field];
  const next: FormData = { ...data, [formField]: value };
  if (isFutureDate(next.contractualFromDay, next.contractualFromMonth, next.contractualFromYear)) {
    toast.error("Future date is not allowed.");
    return;
  }
  setData(next);
  if (touched[formField]) {
    const msg = validateField(formField, value, next);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  }
};

const handleContractualFromDateBlur = (field: "day" | "month" | "year") => {
  const fieldMap = {
    day: "contractualFromDay",
    month: "contractualFromMonth",
    year: "contractualFromYear"
  };
  const formField = fieldMap[field];
  setTouched((prev) => ({ ...prev, [formField]: true }));
  const msg = validateField(formField, data[formField], data);
  setErrors((prev) => ({ ...prev, [formField]: msg }));
};




// DateSelect handlers for Contractual To Date
const handleContractualToDateChange = (field: "day" | "month" | "year", value: string) => {
  const fieldMap = {
    day: "contractualToDay",
    month: "contractualToMonth",
    year: "contractualToYear"
  };
  const formField = fieldMap[field];
  
  // Create the next state object to check the complete date
  const next: FormData = { ...data, [formField]: value };
  
  // Add the future date validation
  if (isFutureDate(next.contractualToDay, next.contractualToMonth, next.contractualToYear)) {
    toast.error("Future date is not allowed.");
    return;
  }

  setData(next);
  if (touched[formField]) {
    const msg = validateField(formField, value, next);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  }
};

const handleContractualToDateBlur = (field: "day" | "month" | "year") => {
  const fieldMap = {
    day: "contractualToDay",
    month: "contractualToMonth",
    year: "contractualToYear"
  };
  const formField = fieldMap[field];
  setTouched((prev) => ({ ...prev, [formField]: true }));
  const msg = validateField(formField, data[formField], data);
  setErrors((prev) => ({ ...prev, [formField]: msg }));
};

  const buildRegistrationPayload = (d: FormData): RegistrationFormData => {
    // 1. EXTRACT and REMOVE the unwanted UI-only file keys so they don't go to the API
    const {
      experienceCertificateName,
      experienceCertificateBase64,
      experienceCertificateFile, 
      agreementCopyName,
      agreementCopyBase64,
      agreementCopyFile,
      hasUrduInIntermediate,
      ...apiData // <-- This now contains everything EXCEPT the 6 file keys above
    } = d as any;

    const serviceFromISO =
      d.serviceFromYear && d.serviceFromMonth && d.serviceFromDay
        ? `${d.serviceFromYear}-${pad2(d.serviceFromMonth)}-${pad2(d.serviceFromDay)}`
        : "";
    const serviceToISO =
      d.serviceToYear && d.serviceToMonth && d.serviceToDay
        ? `${d.serviceToYear}-${pad2(d.serviceToMonth)}-${pad2(d.serviceToDay)}`
        : "";
    const contractualFromISO =
      d.contractualFromYear && d.contractualFromMonth && d.contractualFromDay
        ? `${d.contractualFromYear}-${pad2(d.contractualFromMonth)}-${pad2(d.contractualFromDay)}`
        : "";
    const contractualToISO =
      d.contractualToYear && d.contractualToMonth && d.contractualToDay
        ? `${d.contractualToYear}-${pad2(d.contractualToMonth)}-${pad2(d.contractualToDay)}`
        : "";
    const categoryIssueISO =
      d.categoryIssueDateYear && d.categoryIssueDateMonth && d.categoryIssueDateDay
        ? `${d.categoryIssueDateYear}-${pad2(d.categoryIssueDateMonth)}-${pad2(d.categoryIssueDateDay)}`
        : "";
    const disabilityIssueISO =
      d.disabilityIssueDateYear && d.disabilityIssueDateMonth && d.disabilityIssueDateDay
        ? `${d.disabilityIssueDateYear}-${pad2(d.disabilityIssueDateMonth)}-${pad2(d.disabilityIssueDateDay)}`
        : "";

        
    return {
      ...apiData,
      declaration: hasUrduInIntermediate === "YES",
      serviceFromDate: serviceFromISO,
      serviceToDate: serviceToISO,
      contractualFromDate: contractualFromISO,
      contractualToDate: contractualToISO,
      catCertAuth:
        d.categoryAuthority === "Other" ? d.categoryAuthorityOther : d.categoryAuthority,
      
      catCertIssueDt: categoryIssueISO,
      disCertAuth:
        d.disabilityAuthority === "Other" ? d.disabilityAuthorityOther : d.disabilityAuthority,
      disCertIssueDt: disabilityIssueISO,
      disTypePersist: d.natureOfDisabilityType,
      isOwnScribe: d.ownScribeRequired,
     experienceCertificate: d.experienceCertificateBase64,
      agreementCopy: d.agreementCopyBase64,
    };
  };

  /* ---------- STEP 1: verify email
     Validates the whole form (unchanged validation), then creates the
     Cognito user with the candidate's own real password and sends the
     email OTP. Replaces the old handleSubmit / "SAVE AND CONTINUE" flow.
  --------------------------------------------------------------- */
  const handleVerifyEmail = async () => {
    // --- NEW CHANGE: Hard block if Urdu is NO ---
    if (data.hasUrduInIntermediate === "NO") {
      setShowUrduIneligiblePopup(true);
      return; 
    }

    // First validate CAPTCHA
    const isCaptchaValid = await validateCaptcha();
    if (!isCaptchaValid) {
      return;
    }

    const allFields = Object.values(REQUIRED_BY_SECTION).flat();
    const fieldsToValidate = [...allFields, ...CONDITIONAL_FIELDS];

    const newErrors: FormErrors = {};
    fieldsToValidate.forEach((f) => {
      newErrors[f] = validateField(f, data[f], data);
    });
    setErrors(newErrors);
    setTouched(
      Object.fromEntries(fieldsToValidate.map((f) => [f, true])) as FormTouched,
    );

    // Collect ALL fields that failed validation (not just the first one) so
    // we can tell the user exactly which fields still need attention.
    const failingFields = fieldsToValidate.filter((f) => newErrors[f]);

    if (failingFields.length > 0) {
      const firstErrorField = failingFields[0];
      const section =
        (
          Object.entries(REQUIRED_BY_SECTION) as [SectionId, (keyof FormData)[]][]
        ).find(([, fs]) => fs.includes(firstErrorField))?.[0] ?? "service";
      scrollTo(section as SectionId);

      // Build a de-duplicated, human-readable list of the failing field
      // names (e.g. "Date of birth" instead of dobDay/dobMonth/dobYear
      // each showing up separately).
      const uniqueFieldLabels = Array.from(
        new Set(
          failingFields.map((f) => FIELD_LABELS[f] || String(f)),
        ),
      );

      const fieldListText = uniqueFieldLabels.join(", ");
      toast.error(
        `Please fix the highlighted field${
          uniqueFieldLabels.length > 1 ? "s" : ""
        } before continuing: ${fieldListText}`,
      );
      return;
    }

    // Age eligibility gate — Age Eligibility Validation Matrix, BSSC Adv. 05/25.
    if (ageEligibility && !ageEligibility.ok) {
      setSubmitError(ageEligibility.message);
      toast.error(ageEligibility.message);
      scrollTo("personal");
      return;
    }

    setLoading(true);
    setSubmitError("");
    try {

      const res = await initiateCandidateApi(data.emailId, data.mobileNo, data.applicantName, data.password);
 
      setZitadelUserId(res.userId);
      
      setShowOtp(true);

      toast.success("OTP sent to your email. Please verify to continue.");
    } catch (err: any) {
      const code = err?.name || err?.code;
      let msg = "";
      if (code === "UsernameExistsException") {
        try {
          await resendOtp(data.emailId);
          setShowOtp(true);
          toast.success("Unverified account found. A new OTP has been sent to your email.");
          return; 
        } catch (resendErr: any) {
          msg = "An account with this email is already registered and verified. Please go to login.";
        }
      } else if (code === "SchemaMisconfiguredError") {
        msg = err.message;
      } else if (code === "InvalidPasswordException") {
        msg =
          err?.message ||
          "Password does not meet the account requirements. Please choose a different password.";
      } else {
        msg = err?.message || "Could not start registration. Please try again.";
      }
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

 
  
  const handleOtpVerify = async (otp: string) => {
    try {
      await verifyOtpApi(zitadelUserId, "email", otp);
      
      setShowOtp(false);
      setEmailVerified(true);
      toast.success("Email verified successfully!");
      
      // Automatically open Mobile OTP modal 
      setTimeout(() => {
        setShowMobileOtp(true);
      }, 400); // slight delay for smooth UI transition
      
      document.getElementById("mobile-verification-section")?.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    } catch (err: any) {
      toast.error(err.message || "Invalid Email OTP");
    }
  };

  const handleOtpResend = async () => {
    await resendOtp(data.emailId);
    toast.success("OTP resent successfully.");
  };
 

  const handleVerifyMobileClick = async () => {
    if (!emailVerified) {
      toast.error("Please verify your email first.");
      return;
    }
    setShowMobileOtp(true);
  };

  const handleMobileOtpResend = async () => {
    toast.success("OTP resent to your mobile number.");
  };

  const handleMobileOtpVerify = async (otp: string) => {
    try {
      await verifyOtpApi(zitadelUserId, "phone", otp);
      setMobileVerified(true);
      setShowMobileOtp(false);
      toast.success("Mobile number verified successfully! You can now submit your registration.");
    } catch (err: any) {
      toast.error(err.message || "Invalid Mobile OTP");
    }
  };

  const handleMobileOtpSkip = () => {
    setShowMobileOtp(false);
    setMobileSkipped(true); 
    toast.info("Mobile verification skipped. You can now submit your registration.");
  };

  const handleFinalizeRegistration = async () => {
    setIsFinalizing(true);
    setSubmitError("");
    try {
      const payload = buildRegistrationPayload(data);
      
      const finalData = {
        zitadelUserId,
        ...payload
      };

      await finalizeRegistrationApi(finalData);
      
      toast.success("Registration completed successfully!");
      setSubmitted(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err: any) {
      const msg = err?.message || "Failed to finalize registration. Please try again.";
      setSubmitError(msg);
      toast.error(msg);
    } finally {
      setIsFinalizing(false);
    }
  };

  
  // Check if category requires certificate (compares the mapped code, not the raw label — see bug-fix note above)
  const showCategoryCert =
    data.isBiharDomicile === "YES" &&
    !!data.category &&
    mapCategoryLabelToCode(data.category) !== "UR" &&
    data.isNonCreamyLayer !== "NO"; 
  const showDisabilityCert = data.isBiharDomicile === "YES" && data.isPwD === "YES";


  // Check if category section fields should be shown (show by default when domicile is empty or YES)
  const showCategoryFields = data.isBiharDomicile === "YES" || data.isBiharDomicile === "";

  // Check if service section should be shown (show by default when domicile is empty or YES)
  const showServiceSection = data.isBiharDomicile === "YES" || data.isBiharDomicile === "";

  // Check if category is disabled (only when domicile is explicitly NO)
  const isCategoryDisabled = data.isBiharDomicile === "NO";

   // Transgender + Bihar domicile: category/caste are auto-applied and locked
  const isTransgenderAutoLocked =
    data.gender === "TRANSGENDER" && data.isBiharDomicile === "YES";

  // Check if caste should be disabled
  // const isCasteDisabled = !data.categoryId || (subCategories.length === 0);
  const isCasteDisabled = !data.categoryId || (subCategories.length === 0) || isTransgenderAutoLocked;
  const isUnreservedCategory =
    !!data.category && mapCategoryLabelToCode(data.category) === "UR";
    //add this new 
    const nonCreamyLayerCategoryCode = mapCategoryLabelToCode(data.category);
  const showNonCreamyLayer =
    nonCreamyLayerCategoryCode === "EBC" || nonCreamyLayerCategoryCode === "BC";

    // Dynamic label for the Category Certificate "Certificate number" field —
  // purely cosmetic, driven off the same mapped code used everywhere else.
  const categoryCertCode = mapCategoryLabelToCode(data.category);
  const categoryCertNoLabel =
    categoryCertCode === "SC" || categoryCertCode === "ST"
      ? { label: "Caste certificate number", hi: "जाति प्रमाणपत्र संख्या" }
      : categoryCertCode === "BC" || categoryCertCode === "EBC"
      ? { label: "Non-Creamy Layer (NCL) certificate number", hi: "नॉन-क्रीमी लेयर (NCL) प्रमाणपत्र संख्या" }
      : categoryCertCode === "EWS"
      ? { label: "EWS certificate number", hi: "EWS प्रमाणपत्र संख्या" }
      : { label: "Certificate number", hi: "प्रमाणपत्र संख्या" };

  
  const categoryAuthorityOptions = ["CO/RO", "SDM", "DM"];
const disabilityAuthorityOptions = ["Civil Surgeon/Chief Medical Officer", "Suprintendent/Principal Of Medical College & Hospital"];

  /* ---------------------------------------------------------------
     SUCCESS STATE
  --------------------------------------------------------------- */
  if (submitted) {
    return (
      <div
        className="rf-root min-h-screen flex items-center justify-center p-6"
        style={{ background: PAPER }}
      >
        <ToastContainer position="top-right" autoClose={4000} />
        <div
          className="rf-pop max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-sm"
          style={{ border: `1.5px solid ${LINE}` }}
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ background: "#E8F3EF" }}
          >
            <PartyPopper size={28} style={{ color: TEAL }} />
          </div>
          <div
            className="rf-display text-2xl font-semibold mb-2"
            style={{ color: INK }}
          >
            Registration successful
          </div>
          <p className="text-sm font-medium mb-6" style={{ color: INK_SOFT }}>
            Your details for{" "}
            <span style={{ color: INK, fontWeight: 800 }}>
              {data.applicantName || "the applicant"}
            </span>{" "}
            have been recorded
            {mobileVerified
              ? " and both your email and mobile number have been verified."
              : " and your email has been verified."}{" "}
            Redirecting you to login...
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-white"
            style={{ background: INK }}
          >
            Go to login now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rf-root min-h-screen" style={{ background: PAPER }}>
      <ToastContainer position="top-center" autoClose={4000} />

      {/* HEADER */}
      <div className="border-b" style={{ borderColor: LINE, background: CARD }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between">
          <div>
            <div
              className="text-[11px] font-extrabold tracking-[0.18em] mb-1"
              style={{ color: OCHRE_DEEP }}
            >
              BIHAR STAFF SELECTION COMMISSION
            </div>
            <div
              className="rf-display text-2xl md:text-[24px] font-semibold"
              style={{ color: INK }}
            >
              Candidate Registration
            </div>
            <div
              className="text-[12px] font-medium mt-0.5"
              style={{ color: INK_SOFT }}
            >
              अभ्यर्थी पंजीकरण फॉर्म
            </div>
          </div>
        </div>
      </div>

      {/* STICKY PROGRESS BAR */}
      <div
        ref={progressRef}
        className={`rf-sticky-progress ${isScrolled ? "scrolled" : ""}`}
      >
        <div>
          {/* Mobile progress */}
          <div className="md:hidden flex items-center gap-1 overflow-x-auto">
            {SECTIONS.map((s, i) => {
              const st = sectionStatus(s.id);
              return (
                <button
                  key={s.id}
                  onClick={() => scrollTo(s.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold"
                  style={{
                    background: activeSection === s.id ? INK : "#fff",
                    color: activeSection === s.id ? "#fff" : INK_SOFT,
                    border: `1.5px solid ${
                      activeSection === s.id ? INK : LINE
                    }`,
                  }}
                >
                  {st.done ? <CheckCircle2 size={13} /> : <span>{i + 1}</span>}{" "}
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-4 flex gap-10">
        {/* DESKTOP RAIL */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-[90px]">
            {SECTIONS.map((s, i) => {
              const st = sectionStatus(s.id);
              const Icon = s.icon;
              const isLast = i === SECTIONS.length - 1;
              const isActive = activeSection === s.id;
              return (
                <div key={s.id} className="relative pb-8 pl-2">
                  {!isLast && (
                    <div className={`rf-rail-line ${st.done ? "done" : ""}`} />
                  )}
                  <button
                    onClick={() => scrollTo(s.id)}
                    className="flex items-start gap-3 text-left group w-full"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: st.done ? TEAL : isActive ? INK : "#fff",
                        border: `2px solid ${
                          st.done ? TEAL : isActive ? INK : LINE
                        }`,
                      }}
                    >
                      {st.done ? (
                        <CheckCircle2 size={18} color="#fff" />
                      ) : (
                        <Icon size={16} color={isActive ? "#fff" : INK_SOFT} />
                      )}
                    </div>
                    <div className="pt-1.5">
                      <div
                        className="text-[10.5px] font-extrabold rf-mono"
                        style={{ color: OCHRE_DEEP }}
                      >
                        0{i + 1} · {st.filled}/{st.total}
                      </div>
                      <div
                        className="text-[13px] font-extrabold leading-tight"
                        style={{ color: isActive ? INK : "#374151" }}
                      >
                        {s.label}
                      </div>
                      <div
                        className="text-[11px] font-medium"
                        style={{ color: INK_SOFT }}
                      >
                        {s.hi}
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex-1 min-w-0 space-y-6">
          {/* SECTION 1 — PERSONAL */}
          <div
            ref={(el) => {
              sectionRefs.current.personal = el;
            }}
            data-section="personal"
            className="rounded-2xl p-6 md:p-8"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div className="flex items-center gap-2 mb-6">
              <User size={17} style={{ color: OCHRE }} />
              <h2
                className="rf-display text-lg font-semibold"
                style={{ color: INK }}
              >
                Personal &amp; Identity
              </h2>
            </div>

            <Field
              label="Name of applicant"
              hi="आवेदक का नाम"
              required
              error={touched.applicantName && errors.applicantName}
              note="Enter your name exactly As per in your Matriculation / 10th standard or equivalent certificate."
            >
              <input
                type="text"
                name="applicantName"
                value={data.applicantName}
                onChange={handleChange}
                onBlur={handleBlur}
                 maxLength={50}
                className={`rf-input uppercase ${
                  touched.applicantName && errors.applicantName
                    ? "rf-error"
                    : ""
                }`}
                placeholder="AS PER MATRICULATION CERTIFICATE"
              />
            </Field>

            <div className="grid grid-cols-1 gap-6">
              <Field
                label="Gender"
                hi="लिंग"
                required
                error={touched.gender && errors.gender}
                note="A transgender candidate of Bihar-state domicile must apply under the BC category."
              >
                <PillGroup
                  name="gender"
                  value={data.gender}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={["MALE", "FEMALE", "TRANSGENDER"]}
                />
              </Field>

              <Field
                label="Domicile of Bihar state?"
                hi="बिहार राज्य का स्थायी निवासी?"
                required
                error={touched.isBiharDomicile && errors.isBiharDomicile}
              >
                <PillGroup
                  name="isBiharDomicile"
                  value={data.isBiharDomicile}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={["YES", "NO"]}
                />
              </Field>

              <Field
  label="Do you hold Intermediate (10+2)/equivalent with Urdu as a subject, with minimum 100 marks?"
  hi="क्या आपके पास इन्टरमीडिएट/समकक्ष है जिसमें उर्दू विषय में न्यूनतम 100 अंक हों?"
  required
  error={touched.hasUrduInIntermediate && errors.hasUrduInIntermediate}
  note="Minimum qualification for Assistant Urdu Translator: Intermediate/equivalent from a recognized university/board with Urdu, scoring at least 100 marks."
>
  <PillGroup
    name="hasUrduInIntermediate"
    value={data.hasUrduInIntermediate}
    onChange={handleChange}
    onBlur={handleBlur}
    options={["YES", "NO"]}
  />
</Field>
            </div>

            {/* DateSelect component for DOB */}
           
          </div>

          {/* SECTION 2 — CATEGORY */}
          <div
            ref={(el) => {
              sectionRefs.current.category = el;
            }}
            data-section="category"
            className="rounded-2xl p-6 md:p-8"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={17} style={{ color: OCHRE }} />
              <h2
                className="rf-display text-lg font-semibold"
                style={{ color: INK }}
              >
                Category &amp; Reservation
              </h2>
            </div>

            <div className="grid grid-cols-1  gap-6">
              <Field
                label="Category"
                hi="श्रेणी"
                required
                error={touched.category && errors.category}
                note={categoriesLoading ? "Loading categories..." : ""}
              >
                <SelectBox
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.category && errors.category}
                  className="max-w-full"
                  disabled={isCategoryDisabled || isTransgenderAutoLocked || categoriesLoading}
                >
                  <option value="">{categoriesLoading ? "Loading..." : "Select category"}</option>
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.label}>
                      {cat.label}
                    </option>
                  ))}
                </SelectBox>
                {isCategoryDisabled && (
                  <div className="text-[11px] font-medium mt-1" style={{ color: INK_SOFT }}>
                    Category is auto-set to Unreserved (General) for non-Bihar domicile candidates
                  </div>
                )}

                {isTransgenderAutoLocked && (
                  <div className="text-[11px] font-medium mt-1" style={{ color: INK_SOFT }}>
                    Category is auto-set to Backward Class (Annexure-2) for Transgender candidates
                  </div>
                )}
              </Field>

              {!isUnreservedCategory && (
                <Field
                  label="Caste"
                  hi="जाति"
                  required={subCategories.length > 0}
                  error={touched.caste && errors.caste}
                  note={
                    subCategories.length === 0 && data.categoryId
                      ? "No sub-categories available for this category"
                      : ""
                  }
                >
                
                  <div ref={casteDropdownRef} className="relative max-w-full">
                  {/* Dropdown Trigger */}
                  <div
                    className={`rf-select flex items-center justify-between cursor-pointer ${
                      touched.caste && errors.caste ? "rf-error" : ""
                    }`}
                    style={{
                      cursor: isCasteDisabled ? "not-allowed" : "pointer",
                      opacity: isCasteDisabled ? 0.6 : 1,
                      background: "#fff",
                    }}
                    onClick={() => {
                      if (!isCasteDisabled) setIsCasteMenuOpen(!isCasteMenuOpen);
                    }}
                    tabIndex={isCasteDisabled ? -1 : 0}
                    onBlur={() => {
                      // Trigger validation on blur to keep your existing logic intact
                      handleBlur({ target: { name: "caste", value: data.caste } } as any);
                    }}
                  >
                    <span className={data.caste ? "text-inherit" : "text-[#A6AEBB] font-medium"}>
                      {data.caste || (subCategories.length === 0 ? "No sub-categories available" : "Select caste")}
                    </span>
                    <ChevronDown size={15} style={{ color: INK_SOFT }} />
                  </div>

                  {/* Dropdown Menu with Search */}
                  {isCasteMenuOpen && !isCasteDisabled && (
                    <div
                      className="absolute z-50 w-full mt-1 bg-white border rounded-xl shadow-lg overflow-hidden"
                      style={{ borderColor: LINE }}
                    >
                      <div className="p-2 border-b bg-gray-50/50" style={{ borderColor: LINE }}>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm font-medium border rounded-lg outline-none"
                          style={{ borderColor: LINE, color: INK }}
                          placeholder="Type to search caste..."
                          value={casteSearchTerm}
                          onChange={(e) => setCasteSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {filteredCastes.length > 0 ? (
                          filteredCastes.map((sub) => (
                            <div
                              key={sub.value}
                              className="px-4 py-2.5 text-sm font-semibold cursor-pointer hover:bg-gray-50 transition-colors"
                              style={{ color: data.caste === sub.label ? OCHRE : INK }}
                              onClick={() => {
                                // Simulate the exact same event your existing handleChange expects
                                handleChange({
                                  target: { name: "caste", value: sub.label },
                                } as any);
                                setIsCasteMenuOpen(false);
                                setCasteSearchTerm(""); // Reset search after selection
                              }}
                            >
                              {sub.label}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-3 text-sm font-medium text-center text-gray-500">
                            No matching castes found
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                </Field>
              )}

              {/* 👇 MOVED: Non-Creamy Layer field is now immediately below Caste */}
              {showNonCreamyLayer && (
                <Field
                  label="Do you belong to non-creamy layer?"
                  hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?"
                  required
                  error={touched.isNonCreamyLayer && errors.isNonCreamyLayer}
                >
                  <PillGroup
                    name="isNonCreamyLayer"
                    value={data.isNonCreamyLayer}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={["YES", "NO"]}
                  />
                </Field>
              )}
            </div>

            {/* Category Certificate - Only show when domicile is YES and category is not UR */}
            {showCategoryCert && (
              <div className="mt-4 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
                  Category Certificate Details · श्रेणी प्रमाणपत्र विवरण
                </div>
                <div className="grid grid-cols-1  gap-6">
                  <Field
  label={categoryCertNoLabel.label}
  hi={categoryCertNoLabel.hi}
  required
  error={touched.categoryCertNo && errors.categoryCertNo}
>
  <input
    type="text"
    name="categoryCertNo"
    value={data.categoryCertNo || ""}
    onChange={handleChange}
    onBlur={handleBlur}
    className={`rf-input uppercase ${touched.categoryCertNo && errors.categoryCertNo ? "rf-error" : ""}`}
    placeholder="Enter certificate number"
  />
</Field>

                  <Field
                    label="Issue date"
                    hi="जारी करने की तिथि"
                    required
                    error={touched.categoryIssueDateDay && errors.categoryIssueDateDay}
                  >
                    <DateSelect
                      value={{
                        day: data.categoryIssueDateDay || "",
                        month: data.categoryIssueDateMonth || "",
                        year: data.categoryIssueDateYear || "",
                      }}
                      onChange={handleCategoryDateChange}
                      onBlur={handleCategoryDateBlur}
                      errors={{
                        day: touched.categoryIssueDateDay && errors.categoryIssueDateDay,
                        month: touched.categoryIssueDateMonth && errors.categoryIssueDateMonth,
                        year: touched.categoryIssueDateYear && errors.categoryIssueDateYear,
                      }}
                      touched={{
                        day: touched.categoryIssueDateDay,
                        month: touched.categoryIssueDateMonth,
                        year: touched.categoryIssueDateYear,
                      }}
                      maxYear={new Date().getFullYear()}
                      minYear={1900}
                    />
                  </Field>

                  <Field
                    label="Issuing authority"
                    hi="जारीकर्ता प्राधिकारी"
                    required
                    error={touched.categoryAuthority && errors.categoryAuthority}
                  >
                    <div>
                      <SelectBox
                        name="categoryAuthority"
                        value={data.categoryAuthority || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={touched.categoryAuthority && errors.categoryAuthority}
                        className="max-w-full"
                      >
                        <option value="" disabled hidden>Select authority</option>
                        {categoryAuthorityOptions.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </SelectBox>
                      
                      
                    </div>
                  </Field>
                </div>
              </div>
            )}

            {/* These fields are hidden only when domicile is explicitly NO */}
            {showCategoryFields && (
              <>
                <div className="grid grid-cols-1  gap-6">
                  <Field
                    label="Are you a person with disability?"
                    hi="क्या आप दिव्यांगता (PWD) वाले व्यक्ति हैं?"
                    required
                    error={touched.isPwD && errors.isPwD}
                  >
                    <PillGroup
                      name="isPwD"
                      value={data.isPwD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={["YES", "NO"]}
                    />
                  </Field>
                </div>

                {data.isPwD === "YES" && (
                <div className="grid grid-cols-1  gap-6">
                  <Field
                    label="Type of disability"
                    hi="दिव्यांगता का प्रकार"
                    note={disabilitiesLoading ? "Loading disabilities..." : "Select your disability type from the list"}
                  >
                    <SelectBox
                      name="natureOfDisability"
                      value={data.natureOfDisability}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="max-w-full"
                      disabled={disabilitiesLoading}
                    >
                      <option value=""  disabled hidden >{disabilitiesLoading ? "Loading..." : "Select disability type"}</option>
                      {disabilities.map((dis) => (
                        <option key={dis.id} value={dis.name}>
                          {dis.name}
                        </option>
                      ))}
                    </SelectBox>
                  </Field>
                  <Field
                    label="Nature of disability?"
                    hi="दिव्यांगता की प्रकृति"
                    required
                    error={touched.natureOfDisabilityType && errors.natureOfDisabilityType}
                  >
                    <PillGroup
                      name="natureOfDisabilityType"
                      value={data.natureOfDisabilityType}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={["PERMANENT", "TEMPORARY"]}
                    />
                  </Field>

                  <Field
                    label="Are you a person with minimum 40% disability?"
                    hi="क्या आप न्यूनतम 40% दिव्यांगता (PWD) वाले व्यक्ति हैं?"
                    required
                    error={touched.isMin40PercentPwD && errors.isMin40PercentPwD}
                  >
                    <PillGroup
                      name="isMin40PercentPwD"
                      value={data.isMin40PercentPwD}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      options={["YES", "NO"]}
                    />
                  </Field>
                </div>
                )}

                {showDisabilityCert && (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                    <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
                      Disability Certificate Details · दिव्यांगता प्रमाणपत्र विवरण
                    </div>
                    <div className="grid grid-cols-1  gap-6">
                      <Field
                        label="Certificate number"
                        hi="प्रमाणपत्र संख्या"
                        required
                        error={touched.disabilityCertNo && errors.disabilityCertNo}
                      >
                        <input
                          type="text"
                          name="disabilityCertNo"
                          value={data.disabilityCertNo || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`rf-input uppercase ${touched.disabilityCertNo && errors.disabilityCertNo ? "rf-error" : ""}`}
                          placeholder="Enter certificate number"
                        />
                      </Field>

                      <Field
                        label="Issue date"
                        hi="जारी करने की तिथि"
                        required
                        error={touched.disabilityIssueDateDay && errors.disabilityIssueDateDay}
                      >
                        <DateSelect
                          value={{
                            day: data.disabilityIssueDateDay || "",
                            month: data.disabilityIssueDateMonth || "",
                            year: data.disabilityIssueDateYear || "",
                          }}
                          onChange={handleDisabilityDateChange}
                          onBlur={handleDisabilityDateBlur}
                          errors={{
                            day: touched.disabilityIssueDateDay && errors.disabilityIssueDateDay,
                            month: touched.disabilityIssueDateMonth && errors.disabilityIssueDateMonth,
                            year: touched.disabilityIssueDateYear && errors.disabilityIssueDateYear,
                          }}
                          touched={{
                            day: touched.disabilityIssueDateDay,
                            month: touched.disabilityIssueDateMonth,
                            year: touched.disabilityIssueDateYear,
                          }}
                          maxYear={new Date().getFullYear()}
                          minYear={1900}
                        />
                      </Field>

                      <Field
                        label="Issuing authority"
                        hi="जारीकर्ता प्राधिकारी"
                        required
                        error={touched.disabilityAuthority && errors.disabilityAuthority}
                      >
                        <div>
                          <SelectBox
                            name="disabilityAuthority"
                            value={data.disabilityAuthority || ""}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={touched.disabilityAuthority && errors.disabilityAuthority}
                            className="max-w-full"
                          >
                            <option value="" disabled hidden >Select authority</option>
                            {disabilityAuthorityOptions.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </SelectBox>
                         
                         
                        </div>
                      </Field>
                    </div>
                  </div>
                )}

                { data.isMin40PercentPwD === "YES" && (
                  <>
                    <Field
                      label="Is scribe required?"
                      hi="क्या श्रुतिलेखक (स्क्राइब) की आवश्यकता है?"
                      required
                      error={touched.isScribeRequired && errors.isScribeRequired}
                    >
                      <PillGroup
                        name="isScribeRequired"
                        value={data.isScribeRequired}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        options={["YES", "NO"]}
                      />
                    </Field>

                    {data.isScribeRequired === "YES" && (
                      <Field
                        label="Do you want your own scribe?"
                        hi="क्या आप अपना स्वयं का श्रुतिलेखक (स्क्राइब) चाहते हैं?"
                        required
                        error={touched.ownScribeRequired && errors.ownScribeRequired}
                      >
                        <PillGroup
                          name="ownScribeRequired"
                          value={data.ownScribeRequired}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          options={["YES", "NO"]}
                        />
                      </Field>
                    )}
                  </>
                )}
              </>
            )}
          </div>

          {/* SECTION 3 — SERVICE - Only hidden when domicile is explicitly NO */}
          {showServiceSection && (
            <div
              ref={(el) => {
                sectionRefs.current.service = el;
              }}
              data-section="service"
              className="rounded-2xl p-6 md:p-8"
              style={{ background: CARD, border: `1.5px solid ${LINE}` }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Briefcase size={17} style={{ color: OCHRE }} />
                <h2
                  className="rf-display text-lg font-semibold"
                  style={{ color: INK }}
                >
                  Service &amp; Employment
                </h2>
              </div>

              <div className="grid grid-cols-1  gap-6">
                <Field
                  label="Are you an ex-serviceman?"
                  hi="क्या आप भूतपूर्व सैनिक हैं?"
                  required
                  error={touched.isExServiceman && errors.isExServiceman}
                >
                  <PillGroup
                    name="isExServiceman"
                    value={data.isExServiceman}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={["YES", "NO"]}
                  />
                </Field>

                
                
              </div>

              {data.isExServiceman === "YES" && (
                <>
                  <Field
                    label="Service in defence — from / to date"
                    hi="रक्षा में सेवा — दिनांक से/तक"
                    required
                    // error={touched.serviceFromDay && errors.serviceFromDay}
                    note="Select the joining and release dates from your defence service record; the duration is calculated automatically and used to compute your ex-serviceman age relaxation."
                  >
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DateSelect
                          value={{
                            day: data.serviceFromDay || "",
                            month: data.serviceFromMonth || "",
                            year: data.serviceFromYear || "",
                          }}
                          onChange={handleServiceFromDateChange}
                          onBlur={handleServiceFromDateBlur}
                          errors={{
                            day: touched.serviceFromDay && errors.serviceFromDay,
                            month: touched.serviceFromMonth && errors.serviceFromMonth,
                            year: touched.serviceFromYear && errors.serviceFromYear,
                          }}
                          touched={{
                            day: touched.serviceFromDay,
                            month: touched.serviceFromMonth,
                            year: touched.serviceFromYear,
                          }}
                          required={true}
                          label="From Date"
                          hi="दिनांक से"
                          maxYear={new Date().getFullYear()}
                          minYear={1900}
                        />
                        <DateSelect
                          value={{
                            day: data.serviceToDay || "",
                            month: data.serviceToMonth || "",
                            year: data.serviceToYear || "",
                          }}
                          onChange={handleServiceToDateChange}
                          onBlur={handleServiceToDateBlur}
                          errors={{
                            day: touched.serviceToDay && errors.serviceToDay,
                            month: touched.serviceToMonth && errors.serviceToMonth,
                            year: touched.serviceToYear && errors.serviceToYear,
                          }}
                          touched={{
                            day: touched.serviceToDay,
                            month: touched.serviceToMonth,
                            year: touched.serviceToYear,
                          }}
                          required={true}
                          label="To Date"
                          hi="दिनांक तक"
                          maxYear={new Date().getFullYear()}
                          minYear={1900}
                        />
                      </div>
                      {serviceDuration && (
                        <div
                          className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                          style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
                        >
                          <span
                            className="text-[11px] font-extrabold tracking-wide"
                            style={{ color: OCHRE_DEEP }}
                          >
                            DURATION · अवधि
                          </span>
                          <span className="rf-mono text-sm font-bold" style={{ color: INK }}>
                            {formatDuration(serviceDuration)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Field>
                </>
              )}

              <div className="grid grid-cols-1  gap-6">
                <Field
                  label="Are you a Bihar government employee with 3+ years of continuous service?"
                  hi="क्या आप बिहार सरकार के कर्मचारी हैं जिन्होंने कम से कम तीन साल नियमित सेवा की है?"
                  required
                  error={
                    touched.isBiharGovtEmployee && errors.isBiharGovtEmployee
                  }
                >
                  <PillGroup
                    name="isBiharGovtEmployee"
                    value={data.isBiharGovtEmployee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={["YES", "NO"]}
                  />
                </Field>

{data.isBiharGovtEmployee === "YES" && (
                <Field
                  label="BSSC exam attempts after 12-12-2022"
                  hi="दिनांक 12-12-2022 के बाद परीक्षाओं में प्रयासों की संख्या"
                  required
                  error={touched.bsscAttempts && errors.bsscAttempts}
                >
                  <SelectBox
                    name="bsscAttempts"
                    value={data.bsscAttempts}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.bsscAttempts && errors.bsscAttempts}
                    className="max-w-xs"
                  >
                    <option value="" disabled hidden>Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </SelectBox>
                </Field>
)}
              </div>

              <div className="grid grid-cols-1  gap-6">
                <Field
                  label="Are you a contractual employee in Bihar Gov. on the post mentioned in the advertisement."
                  hi="क्या आप विज्ञापन में उल्लिखित पदों में से किसी पद पर संविदा नियोजित कर्मी हैं?"
                  required
                  error={
                    touched.isContractualEmployee && errors.isContractualEmployee
                  }
                >
                  <PillGroup
                    name="isContractualEmployee"
                    value={data.isContractualEmployee}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={["YES", "NO"]}
                  />
                </Field>

    
              </div>

              {data.isContractualEmployee === "YES" && (

<>
      {/* Organization Name - New Field */}
      <Field
        label="Organization/Department Name"
        hi="विभाग/कार्यालय का नाम"
        required
        error={touched.organizationName && errors.organizationName}
      >
        <input
          type="text"
          name="organizationName"
          value={data.organizationName || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`rf-input uppercase ${touched.organizationName && errors.organizationName ? "rf-error" : ""}`}
          placeholder="Enter organization name"
        />
      </Field>

  
      {/* Name of post - Changed from SelectBox to text input */}
      <Field
        label="Name of post"
        hi="पद का नाम"
        required
        error={touched.nameOfPost && errors.nameOfPost}
      >
        <SelectBox
          name="nameOfPost"
          value={data.nameOfPost || ""}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.nameOfPost && errors.nameOfPost}
        >
          <option value="" disabled hidden >Select a post</option>
          <option value="Assistant section officer">Assistant section officer</option>
          <option value="Planning Assistant">Planning Assistant</option>
          <option value="Auditor">Auditor</option>
          <option value="Data Entry operator">Data Entry operator</option>
          <option value="Industry Extension officer">Industry Extension officer</option>
          <option value="Agriculture statistics computer">Agriculture statistics computer</option>
        </SelectBox>
      </Field>

      {/* 1. EXPERIENCE CERTIFICATE UPLOAD */}
                  <Field
                    label="Upload Experience Certificate (PDF format)"
                    hi="अनुभव प्रमाणपत्र अपलोड करें (PDF प्रारूप)"
                    required
                    error={touched.experienceCertificateBase64 && errors.experienceCertificateBase64}
                    note="PDF Document · Up to 2MB"
                  >
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) => handleFileUpload(e, "experienceCertificate")}
                      className={`rf-input ${touched.experienceCertificateBase64 && errors.experienceCertificateBase64 ? "rf-error" : ""}`}
                      style={{ padding: "8px 14px", cursor: "pointer" }}
                    />
                  </Field>

      <Field
        label="Do you have Agreement in the light of circular no. 1003, dated 22.01.2021 (GAD, Bihar)?"
        hi="क्या आपके पास संकल्प ज्ञापांक  1003, दिनांक 22.01.2021 के आलोक में एकरारनामा है?"
        note="Ensure you have a valid agreement copy and contractual experience certificate ready to upload, or you will not receive weightage."
      >
        <PillGroup
          name="hasAgreement"
          value={data.hasAgreement}
          onChange={handleChange}
          onBlur={handleBlur}
          options={["YES", "NO"]}
        />
      </Field>
      
      {/* 2. AGREEMENT COPY UPLOAD (Only shows if hasAgreement === "YES") */}
                  {data.hasAgreement === "YES" && (
                    <Field
                      label="Upload Agreement Copy (PDF format)"
                      hi="एकरारनामा की प्रति अपलोड करें (PDF प्रारूप)"
                      required
                      error={touched.agreementCopyBase64 && errors.agreementCopyBase64}
                      note="PDF Document · Up to 2MB"
                    >
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => handleFileUpload(e, "agreementCopy")}
                        className={`rf-input ${touched.agreementCopyBase64 && errors.agreementCopyBase64 ? "rf-error" : ""}`}
                        style={{ padding: "8px 14px", cursor: "pointer" }}
                      />
                    </Field>
                  )}
     
     

      <Field
        label="Contractual service period in Bihar government — from / to date"
        hi="उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि — दिनांक से/तक"
        error={touched.contractualFromDate && errors.contractualFromDate}
        note="Select the dates on which your contractual engagement began and ended (or the current date, if still ongoing); the duration is calculated automatically."
      >
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div
                className="text-[11px] font-extrabold tracking-wide mb-1.5"
                style={{ color: INK_SOFT }}
              >
                From Date · दिनांक से
              </div>
              <DateSelect
                value={{
                  day: data.contractualFromDay || "",
                  month: data.contractualFromMonth || "",
                  year: data.contractualFromYear || "",
                }}
                onChange={handleContractualFromDateChange}
                onBlur={handleContractualFromDateBlur}
                errors={{
                  day: touched.contractualFromDay && errors.contractualFromDay,
                  month: touched.contractualFromMonth && errors.contractualFromMonth,
                  year: touched.contractualFromYear && errors.contractualFromYear,
                }}
                touched={{
                  day: touched.contractualFromDay,
                  month: touched.contractualFromMonth,
                  year: touched.contractualFromYear,
                }}
                required={true}
                maxYear={new Date().getFullYear()}
                minYear={1900}
              />
            </div>
            <div>
              <div
                className="text-[11px] font-extrabold tracking-wide mb-1.5"
                style={{ color: INK_SOFT }}
              >
                To Date · दिनांक तक
              </div>
              <DateSelect
                value={{
                  day: data.contractualToDay || "",
                  month: data.contractualToMonth || "",
                  year: data.contractualToYear || "",
                }}
                onChange={handleContractualToDateChange}
                onBlur={handleContractualToDateBlur}
                errors={{
                  day: touched.contractualToDay && errors.contractualToDay,
                  month: touched.contractualToMonth && errors.contractualToMonth,
                  year: touched.contractualToYear && errors.contractualToYear,
                }}
                touched={{
                  day: touched.contractualToDay,
                  month: touched.contractualToMonth,
                  year: touched.contractualToYear,
                }}
                required={true}
                maxYear={new Date().getFullYear()}
                minYear={1900}
              />
            </div>
          </div>
          {contractualDuration && (
            <div
              className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
              style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
            >
              <span
                className="text-[11px] font-extrabold tracking-wide"
                style={{ color: OCHRE_DEEP }}
              >
                DURATION · अवधि
              </span>
              <span className="rf-mono text-sm font-bold" style={{ color: INK }}>
                {formatDuration(contractualDuration)}
              </span>
            </div>
          )}
        </div>
      </Field>

    
    
      
      

    </>
              )}
            </div>
          )}

                    {/* MOVED SECTION — DATE OF BIRTH */}
          {/* ========================================== */}
          <div
            className="rounded-2xl p-6 md:p-8"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <h2
              className="rf-display text-lg font-semibold mb-6"
              style={{ color: INK }}
            >
              Date of Birth 
            </h2>

            {/* DateSelect component for DOB */}
            <DateSelect
              value={{
                day: data.dobDay,
                month: data.dobMonth,
                year: data.dobYear,
              }}
              onChange={handleDateChange}
              onBlur={handleDateBlur}
              errors={{
                day: touched.dobDay && errors.dobDay,
                month: touched.dobMonth && errors.dobMonth,
                year: touched.dobYear && errors.dobYear,
              }}
              touched={{
                day: touched.dobDay,
                month: touched.dobMonth,
                year: touched.dobYear,
              }}
              required={true}
              label="Date of birth"
              hi="जन्म तिथि"
              note="As per in your Matriculation / 10th standard or equivalent certificate."
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />

            <div
              className="rounded-xl p-4 flex items-center justify-between"
              style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
            >
              <div>
                <div
                  className="text-[11px] font-extrabold tracking-wide"
                  style={{ color: OCHRE_DEEP }}
                >
                  AGE AS ON 01-08-2025
                </div>
                <div
                  className="text-[11px] font-medium"
                  style={{ color: INK_SOFT }}
                >
                  दिनांक 01-08-2025 को आयु
                </div>
              </div>
              <div className="rf-mono text-lg font-bold" style={{ color: INK }}>
                {formatDuration(age)}
              </div>
            </div>

            {/* AGE ELIGIBILITY RESULT — Age Eligibility Validation Matrix, BSSC Adv. 05/25 */}
            {ageEligibility && (
              <div
                className="rounded-xl p-4 mt-3 flex items-start gap-2.5"
                style={{
                  background: ageEligibility.ok ? "#E8F3EF" : "#FBEAE6",
                  border: `1px solid ${ageEligibility.ok ? TEAL : DANGER}`,
                }}
              >
                {ageEligibility.ok ? (
                  <CheckCircle2 size={16} style={{ color: TEAL, marginTop: 2, flexShrink: 0 }} />
                ) : (
                  <AlertCircle size={16} style={{ color: DANGER, marginTop: 2, flexShrink: 0 }} />
                )}
                <div>
                  <div
                    className="text-[11px] font-extrabold tracking-wide"
                    style={{ color: ageEligibility.ok ? TEAL : DANGER }}
                  >
                    {ageEligibility.ok
                      ? "AGE ELIGIBILITY: CRITERIA MET"
                      : "AGE ELIGIBILITY: NOT MET"}
                  </div>
                  <div
                    className="text-[11.5px] font-medium mt-0.5 leading-relaxed"
                    style={{ color: INK_SOFT }}
                  >
                    {ageEligibility.message}
                    {ageEligibility.effectiveMaxAge != null &&
                      ` Applicable maximum age: ${ageEligibility.effectiveMaxAge} years (as on 01-08-2026).`}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div
            ref={(el) => {
              sectionRefs.current.contact = el;
            }}
            data-section="contact"
            className="rounded-2xl p-6 md:p-8"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div className="flex items-center gap-2 mb-6">
              <MailCheck size={17} style={{ color: OCHRE }} />
              <h2
                className="rf-display text-lg font-semibold"
                style={{ color: INK }}
              >
                Email &amp; Password
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Email ID"
                hi="ईमेल आईडी"
                required
                error={touched.emailId && errors.emailId}
                note="Keep this email active to receive communication about the recruitment process."
              >
                <input
                  type="email"
                  name="emailId"
                  value={data.emailId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={emailVerified}
                  className={`rf-input lowercase ${
                    touched.emailId && errors.emailId ? "rf-error" : ""
                  }`}
                  placeholder="name@example.com"
                />
              </Field>

              <Field
                label="Confirm email ID"
                hi="ईमेल आईडी की पुष्टि"
                required
                error={touched.confirmEmailId && errors.confirmEmailId}
              >
                <input
                  type="email"
                  name="confirmEmailId"
                  value={data.confirmEmailId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onPaste={(e) => e.preventDefault()}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  disabled={emailVerified}
                  className={`rf-input lowercase ${
                    touched.confirmEmailId && errors.confirmEmailId
                      ? "rf-error"
                      : ""
                  }`}
                  placeholder="Re-enter email"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Password"
                hi="पासवर्ड"
                required
                error={touched.password && errors.password}
              >
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: INK_SOFT }}
                  >
                    <Lock size={16} />
                  </span>
                  <input
                   type={showPassword ? "text" : "password"}
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={emailVerified}
                    className={`rf-input ${
                      touched.password && errors.password ? "rf-error" : ""
                    }`}
                    style={{ paddingLeft: "40px" }}
                    placeholder="Create a password"
                  />
                  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    disabled={emailVerified}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-gray-700"
    style={{ color: INK_SOFT }}
    tabIndex={-1}
  >
    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
                </div>
                {/* live checklist */}
                <div className="mt-3 grid grid-cols-2 gap-y-2 gap-x-2">
                  <div
                    className="flex items-center gap-1.5 text-[10.5px] font-bold transition-colors"
                    style={{ color: data.password.length >= 8 ? TEAL : INK_SOFT }}
                  >
                    <CheckCircle2 size={14} /> 8+ Characters
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-[10.5px] font-bold transition-colors"
                    style={{ color: /[A-Z]/.test(data.password) ? TEAL : INK_SOFT }}
                  >
                    <CheckCircle2 size={14} /> 1 Capital Letter
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-[10.5px] font-bold transition-colors"
                    style={{ color: /\d/.test(data.password) ? TEAL : INK_SOFT }}
                  >
                    <CheckCircle2 size={14} /> 1 Number
                  </div>
                  <div
                    className="flex items-center gap-1.5 text-[10.5px] font-bold transition-colors"
                    style={{ color: /[^A-Za-z0-9]/.test(data.password) ? TEAL : INK_SOFT }}
                  >
                    <CheckCircle2 size={14} /> 1 Special Character
                  </div>
                </div>
              </Field>

              <Field
                label="Confirm password"
                hi="पासवर्ड की पुष्टि"
                required
                error={touched.confirmPassword && errors.confirmPassword}
              >
                <div className="relative">
                  <span
                    className="absolute left-3.5 top-1/2 -translate-y-1/2"
                    style={{ color: INK_SOFT }}
                  >
                    <Lock size={16} />
                  </span>
                  <input
                   type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={data.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    disabled={emailVerified}
                    className={`rf-input ${
                      touched.confirmPassword && errors.confirmPassword ? "rf-error" : ""
                    }`}
                    style={{ paddingLeft: "40px" }}
                    placeholder="Re-enter password"
                  />
                  <button
    type="button"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
    disabled={emailVerified}
    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:text-gray-700"
    style={{ color: INK_SOFT }}
    tabIndex={-1}
  >
    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
  </button>
                </div>
                
                {data.confirmPassword.length > 0 && data.confirmPassword === data.password && (
  <div
    className="mt-2 flex items-center gap-1.5 text-[10.5px] font-bold transition-colors"
    style={{ color: TEAL }}
  >
    <CheckCircle2 size={14} /> Passwords match
  </div>
)}
              </Field>
            </div>

            {/* --- 2. MOBILE VERIFICATION (Moved inside here) --- */}
            <div id="mobile-verification-section" className="mb-6">
              <div className="flex items-center gap-2 mb-6">
                <Smartphone size={17} style={{ color: OCHRE }} />
                <h2
                  className="rf-display text-lg font-semibold"
                  style={{ color: INK }}
                >
                  Mobile
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Mobile number"
                  hi="मोबाइल नम्बर"
                  required
                  error={touched.mobileNo && errors.mobileNo}
                  note="Keep this number active to receive communication about the recruitment process."
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    name="mobileNo"
                    value={data.mobileNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={emailVerified}
                    className={`rf-input rf-mono ${
                      touched.mobileNo && errors.mobileNo ? "rf-error" : ""
                    }`}
                    placeholder="10 digit mobile number"
                    maxLength={10}
                  />
                </Field>

                <Field
                  label="Confirm mobile number"
                  hi="मोबाइल नंबर की पुष्टि"
                  required
                  error={touched.confirmMobileNo && errors.confirmMobileNo}
                >
                  <input
                    type="text"
                    inputMode="numeric"
                    name="confirmMobileNo"
                    value={data.confirmMobileNo}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={(e) => e.preventDefault()}
                    onCopy={(e) => e.preventDefault()}
                    onCut={(e) => e.preventDefault()}
                    disabled={emailVerified}
                    className={`rf-input rf-mono ${
                      touched.confirmMobileNo && errors.confirmMobileNo
                        ? "rf-error"
                        : ""
                    }`}
                    placeholder="Re-enter mobile number"
                    maxLength={10}
                  />
                </Field>
              </div>

              {!emailVerified && (
                <div
                  className="text-[11.5px] font-semibold mt-2"
                  style={{ color: OCHRE_DEEP }}
                >
                  Verify your email  first to enable mobile verification.
                </div>
              )}

             
             
            </div>

            <hr className="my-8" style={{ borderColor: LINE }} />

{/* --- CAPTCHA UI COMMENTED OUT FOR TESTING --- */}
            {/* CAPTCHA — validated as part of the same "Verify Email" click,
                so it stays inside this card too. */}
            <div
              className="rounded-xl p-5 mt-2"
              style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
            >
              <div
                className="text-[12px] font-extrabold tracking-wide mb-0.5"
                style={{ color: OCHRE_DEEP }}
              >
                <span style={{ color: DANGER }}>* </span>ENTER CAPTCHA CODE
              </div>
              <div
                className="text-[11.5px] font-medium mb-3"
                style={{ color: INK_SOFT }}
              >
                कैप्चा कोड दर्ज करें — नीचे दिखाया गया कोड टाइप करें
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <div
                  className="flex items-center justify-center min-h-[55px] min-w-[150px] px-5 py-2 rounded-lg select-none"
                  style={{ background: INK, color: "#fff" }}
                >
                  {captchaLoading ? (
                    <Loader2 size={24} className="rf-spin" />
                  ) : captchaSvg ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: captchaSvg }}
                      className="w-full flex items-center justify-center"
                    />
                  ) : (
                    <span className="text-sm font-mono">Loading...</span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  disabled={captchaLoading || emailVerified}
                  className="flex items-center gap-1.5 text-xs font-extrabold disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ color: OCHRE_DEEP }}
                >
                  <RefreshCw size={14} className={captchaLoading ? "rf-spin" : ""} /> REFRESH
                </button>
              </div>
              <input
                type="text"
                name="captchaInput"
                value={data.captchaInput}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`rf-input rf-mono max-w-xs mt-4 ${
                  touched.captchaInput && errors.captchaInput ? "rf-error" : ""
                }`}
                placeholder="Type the code above"
                disabled={isValidatingCaptcha || captchaLoading || emailVerified}
              />
              {touched.captchaInput && errors.captchaInput && (
                <div
                  className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
                  style={{ color: DANGER }}
                >
                  <AlertCircle size={12} /> {errors.captchaInput}
                </div>
              )}
              {isValidatingCaptcha && (
                <div className="flex items-center gap-2 mt-2 text-sm font-medium" style={{ color: INK_SOFT }}>
                  <Loader2 size={16} className="rf-spin" /> Validating CAPTCHA...
                </div>
              )}
            </div>

            {/* VERIFY BUTTONS ROW (Mobile & Email Side-by-Side) */}
            <div className="flex flex-wrap items-center justify-end gap-4 mt-6">
              
              {/* 1. VERIFY MOBILE BUTTON */}
              <button
                onClick={handleVerifyMobileClick}
                disabled={!emailVerified || mobileVerified || mobileOtpLoading}
                className="px-7 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[190px] transition-opacity"
                style={{
                  background: mobileVerified
                    ? TEAL
                    : !emailVerified || mobileOtpLoading
                    ? "#8B93A0"
                    : INK,
                }}
              >
                {mobileVerified ? (
                  <>
                    <CheckCircle2 size={16} /> MOBILE VERIFIED
                  </>
                ) : mobileOtpLoading ? (
                  <>
                    <Loader2 size={16} className="rf-spin" /> SENDING…
                  </>
                ) : (
                  <>
                    <Smartphone size={16} /> VERIFY MOBILE
                  </>
                )}
              </button>

              {/* 2. VERIFY EMAIL BUTTON */}
              {/* 2. VERIFY EMAIL BUTTON */}
              <button
                onClick={handleVerifyEmail}
                // --- NEW CHANGE: Add data.hasUrduInIntermediate === "NO" to disabled array ---
                disabled={loading || isValidatingCaptcha || emailVerified || data.hasUrduInIntermediate === "NO"}
                className="px-7 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[190px] transition-opacity"
                style={{
                  background: emailVerified
                    ? TEAL
                    // --- NEW CHANGE: Gray out the button if Urdu is NO ---
                    : loading || isValidatingCaptcha || data.hasUrduInIntermediate === "NO"
                    ? "#8B93A0"
                    : INK,
                }}
              >
                {emailVerified ? (
                  <>
                    <CheckCircle2 size={16} /> EMAIL VERIFIED
                  </>
                ) : loading ? (
                  <>
                    <Loader2 size={16} className="rf-spin" /> PROCESSING…
                  </>
                ) : isValidatingCaptcha ? (
                  <>
                    <Loader2 size={16} className="rf-spin" /> VALIDATING CAPTCHA…
                  </>
                ) : (
                  <>
                    <MailCheck size={16} /> VERIFY EMAIL
                  </>
                )}
              </button>

  {/* 3. COMPLETE REGISTRATION BUTTON */}
              {emailVerified && (mobileVerified || mobileSkipped) && (
                <button
                  onClick={handleFinalizeRegistration}
                  disabled={isFinalizing}
                  className="px-8 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[220px] transition-all hover:scale-105"
                  style={{
                    // Change TEAL to INK (or your primary action color) so it looks clickable, not "already done"
                    background: isFinalizing ? "#8B93A0" : INK, 
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Adjusted shadow to match a generic dark color
                  }}
                >
                  {isFinalizing ? (
                    <>
                      <Loader2 size={18} className="rf-spin" /> SUBMITTING...
                    </>
                  ) : (
                    <>
                      {/* Changed from CheckCircle2 to ArrowRight to imply a next step/submission */}
                      COMPLETE REGISTRATION <ArrowRight size={18} /> 
                    </>
                  )}
                </button>
              )}

            </div>
          </div>

         
        </div>
      </div>

      {/* EMAIL OTP MODAL — triggered after Cognito signUp succeeds */}
      <OTPVerificationModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        type="email"
        emailOrMobile={data.emailId}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />

   
      <OTPVerificationModal
        isOpen={showMobileOtp}
        onClose={() => setShowMobileOtp(false)}
        type="mobile"
        emailOrMobile={data.mobileNo}
        onVerify={handleMobileOtpVerify}
        onResend={handleMobileOtpResend}
        onSkip={handleMobileOtpSkip}
      />


      {/* NCL Warning Modal */}
      {showNclPopup && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4" 
          style={{ background: "rgba(18, 35, 63, 0.6)" }}
        >
          <div 
            className="rf-pop bg-white rounded-xl shadow-xl p-6 max-w-sm w-full" 
            style={{ border: `1.5px solid ${LINE}` }}
          >
            <div className="flex items-center gap-3 mb-3" style={{ color: DANGER }}>
              <AlertCircle size={24} />
              <h3 className="text-lg font-bold">Notice</h3>
            </div>
            
            <p className="text-[14px] font-semibold mb-6 leading-relaxed" style={{ color: INK }}>
              You will be treated Under UR category.
            </p>
            
            <div className="flex justify-end">
              <button
                onClick={handleCancelNclPopup}
                className="px-6 py-2.5 rounded-full font-bold text-sm transition-colors"
                style={{ background: "#F4F5F2", color: INK }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showUrduIneligiblePopup && (
  <div
    className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    style={{ background: "rgba(18, 35, 63, 0.6)" }}
  >
    <div
      className="rf-pop bg-white rounded-xl shadow-xl p-6 max-w-sm w-full"
      style={{ border: `1.5px solid ${LINE}` }}
    >
      <div className="flex items-center gap-3 mb-3" style={{ color: DANGER }}>
        <AlertCircle size={24} />
        <h3 className="text-lg font-bold">Not Eligible</h3>
      </div>
      <p className="text-[14px] font-semibold mb-6 leading-relaxed" style={{ color: INK }}>
        You are not eligible for this post. Urdu as a subject with a minimum
        of 100 marks at Intermediate (10+2)/equivalent level is mandatory.
      </p>
      <div className="flex justify-end">
        <button
          onClick={() => setShowUrduIneligiblePopup(false)}
          className="px-6 py-2.5 rounded-full font-bold text-sm transition-colors"
          style={{ background: "#F4F5F2", color: INK }}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}