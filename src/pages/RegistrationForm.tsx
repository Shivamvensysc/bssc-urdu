// // import React, {
// //   useState,
// //   useEffect,
// //   useRef,
// //   useCallback,
// //   useMemo,
// // } from "react";
// // import {
// //   User,
// //   ShieldCheck,
// //   Briefcase,
// //   Phone,
// //   CheckCircle2,
// //   RefreshCw,
// //   ChevronDown,
// //   Loader2,
// //   PartyPopper,
// //   AlertCircle,
// // } from "lucide-react";
// // import { sendOtp, verifyOtp, resendOtp, calcDuration } from "../auth/cognito";
// // import type { RegistrationFormData, DurationParts } from "../auth/cognito";
// // import OTPVerificationModal from "../components/common/OTPVerificationModal";
// // import DateSelect from "../components/common/DateSelect";

// // const INK = "#12233F";
// // const INK_SOFT = "#5B6B84";
// // const PAPER = "#F4F5F2";
// // const CARD = "#FFFFFF";
// // const LINE = "#DBDFE6";
// // const OCHRE = "#B9722E";
// // const OCHRE_DEEP = "#8F5522";
// // const TEAL = "#1E6F5C";
// // const DANGER = "#B3432B";

// // const FONTS = `
// //   @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

// //   .rf-root, .rf-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
// //   .rf-display { font-family: 'Fraunces', serif; }
// //   .rf-mono { font-family: 'JetBrains Mono', monospace; }

// //   .rf-root input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
// //   .rf-pill {
// //     display: inline-flex; align-items: center; gap: 6px;
// //     padding: 8px 16px; border-radius: 999px; border: 1.5px solid ${LINE};
// //     background: #fff; cursor: pointer; font-weight: 700; font-size: 12.5px;
// //     color: ${INK}; transition: all .15s ease; user-select: none;
// //   }
// //   .rf-pill:hover { border-color: ${OCHRE}; }
// //   .rf-radio-input:checked + .rf-pill {
// //     background: ${INK}; border-color: ${INK}; color: #fff;
// //   }
// //   .rf-radio-input:focus-visible + .rf-pill { outline: 2px solid ${OCHRE}; outline-offset: 2px; }

// //   .rf-input, .rf-select {
// //     width: 100%; border: 1.5px solid ${LINE}; border-radius: 10px;
// //     padding: 11px 14px; font-size: 14px; font-weight: 600; color: ${INK};
// //     background: #fff; outline: none; transition: border-color .15s ease, box-shadow .15s ease;
// //   }
// //   .rf-input:focus, .rf-select:focus {
// //     border-color: ${OCHRE}; box-shadow: 0 0 0 3px rgba(185,114,46,0.15);
// //   }
// //   .rf-input.rf-error, .rf-select.rf-error { border-color: ${DANGER}; }
// //   .rf-input.rf-error:focus, .rf-select.rf-error:focus { box-shadow: 0 0 0 3px rgba(179,67,43,0.15); }
// //   .rf-input::placeholder { color: #A6AEBB; font-weight: 500; }

// //   .rf-rail-line { position: absolute; left: 19px; top: 40px; bottom: -8px; width: 2px; background: ${LINE}; }
// //   .rf-rail-line.done { background: ${TEAL}; }

// //   @keyframes rf-pop { 0% { transform: scale(.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
// //   .rf-pop { animation: rf-pop .35s cubic-bezier(.34,1.56,.64,1); }

// //   @keyframes rf-spin { to { transform: rotate(360deg); } }
// //   .rf-spin { animation: rf-spin .8s linear infinite; }

// //   @keyframes rf-toast-in { 0% { transform: translate(-50%, 12px); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
// //   .rf-toast { animation: rf-toast-in .25s ease; }

// //   /* Sticky progress bar styles */
// //   .rf-sticky-progress {
// //     position: sticky;
// //     top: 0;
// //     z-index: 40;
// //     background: ${CARD};
// //     border-bottom: 1.5px solid ${LINE};
// //     transition: box-shadow 0.2s ease;
// //   }
// //   .rf-sticky-progress.scrolled {
// //     box-shadow: 0 2px 12px rgba(18, 35, 63, 0.08);
// //   }
// // `;

// // /* ---------------------------------------------------------------
// //    TYPES
// // --------------------------------------------------------------- */

// // /** Full form state = everything sent to Cognito, plus UI-only confirmation/captcha fields. */
// // export interface FormData extends RegistrationFormData {
// //   confirmMobileNo: string;
// //   confirmEmailId: string;
// //   captchaInput: string;
// // }

// // type FormErrors = Partial<Record<keyof FormData, string>>;
// // type FormTouched = Partial<Record<keyof FormData, boolean>>;
// // type SectionId = "personal" | "category" | "service" | "contact";

// // interface SectionMeta {
// //   id: SectionId;
// //   label: string;
// //   hi: string;
// //   icon: React.ComponentType<{ size?: number; color?: string }>;
// // }

// // const SECTIONS: SectionMeta[] = [
// //   {
// //     id: "personal",
// //     label: "Personal & Identity",
// //     hi: "व्यक्तिगत विवरण",
// //     icon: User,
// //   },
// //   {
// //     id: "category",
// //     label: "Category & Reservation",
// //     hi: "श्रेणी एवं आरक्षण",
// //     icon: ShieldCheck,
// //   },
// //   {
// //     id: "service",
// //     label: "Service & Employment",
// //     hi: "सेवा एवं नियोजन",
// //     icon: Briefcase,
// //   },
// //   {
// //     id: "contact",
// //     label: "Contact & Verification",
// //     hi: "सम्पर्क एवं सत्यापन",
// //     icon: Phone,
// //   },
// // ];

// // const REQUIRED_BY_SECTION: Record<SectionId, (keyof FormData)[]> = {
// //   personal: [
// //     "applicantName",
// //     "gender",
// //     "isBiharDomicile",
// //     "dobDay",
// //     "dobMonth",
// //     "dobYear",
// //   ],
// //   category: [
// //     "category",
// //     "caste",
// //     "isNonCreamyLayer",
// //     "isPwD",
// //     "isMin40PercentPwD",
// //   ],
// //   service: [
// //     "isExServiceman",
// //     "isNccCadet",
// //     "isBiharGovtEmployee",
// //     "bsscAttempts",
// //     "isContractualEmployee",
// //   ],
// //   contact: [
// //     "mobileNo",
// //     "confirmMobileNo",
// //     "emailId",
// //     "confirmEmailId",
// //     "captchaInput",
// //   ],
// // };




// // const initialData: FormData = {
// //   applicantName: "",
// //   gender: "",
// //   isBiharDomicile: "",
// //   category: "",
// //   caste: "",
// //   isNonCreamyLayer: "",
// //   isPwD: "",
// //   natureOfDisability: "",
// //   isMin40PercentPwD: "",
// //   isExServiceman: "",
// //   serviceFromDate: "",
// //   serviceToDate: "",
// //   isNccCadet: "",
// //   nccCertificateNo: "",
// //   isBiharGovtEmployee: "",
// //   bsscAttempts: "",
// //   isContractualEmployee: "",
// //   nameOfPost: "",
// //   hasAgreement: "",
// //   contractualFromDate: "",
// //   contractualToDate: "",
// //   mobileNo: "",
// //   confirmMobileNo: "",
// //   emailId: "",
// //   confirmEmailId: "",
// //   dobDay: "",
// //   dobMonth: "",
// //   dobYear: "",
// //   captchaInput: "",
// // };

// // const genCaptcha = (): string => {
// //   const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
// //   let s = "";
// //   for (let i = 0; i < 6; i++)
// //     s += chars[Math.floor(Math.random() * chars.length)];
// //   return s;
// // };

// // const pad2 = (v: string): string => v.padStart(2, "0");

// // /** Real-calendar-date check — rejects things like 31 Feb that JS Date would silently roll into March. */
// // const isRealDate = (day: string, month: string, year: string): boolean => {
// //   const d = parseInt(day, 10),
// //     m = parseInt(month, 10),
// //     y = parseInt(year, 10);
// //   if (!d || !m || !y) return false;
// //   const dt = new Date(y, m - 1, d);
// //   return (
// //     dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
// //   );
// // };

// // const formatDuration = (d: DurationParts | null): string =>
// //   d ? `${d.years}y ${d.months}m ${d.days}d` : "—";

// // /* ---------------------------------------------------------------
// //    SMALL PRESENTATIONAL COMPONENTS
// // --------------------------------------------------------------- */
// // interface FieldProps {
// //   label: string;
// //   hi?: string;
// //   required?: boolean;
// //   error?: string | false;
// //   children: React.ReactNode;
// //   note?: string;
// //   className?: string;
// // }

// // const Field: React.FC<FieldProps> = ({
// //   label,
// //   hi,
// //   required,
// //   error,
// //   children,
// //   note,
// //   className = "",
// // }) => (
// //   <div className={`mb-6 ${className}`}>
// //     <div className="mb-2">
// //       <div
// //         className="text-[12.5px] font-extrabold tracking-wide"
// //         style={{ color: INK }}
// //       >
// //         {required && <span style={{ color: DANGER }}>* </span>}
// //         {label}
// //       </div>
// //       {hi && (
// //         <div className="text-[11.5px] font-medium" style={{ color: INK_SOFT }}>
// //           {hi}
// //         </div>
// //       )}
// //     </div>
// //     {children}
// //     {error && (
// //       <div
// //         className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
// //         style={{ color: DANGER }}
// //       >
// //         <AlertCircle size={12} /> {error}
// //       </div>
// //     )}
// //     {note && (
// //       <div
// //         className="text-[11px] font-semibold mt-1.5 leading-relaxed"
// //         style={{ color: OCHRE_DEEP }}
// //       >
// //         {note}
// //       </div>
// //     )}
// //   </div>
// // );

// // interface PillGroupProps {
// //   name: string;
// //   value: string;
// //   options: string[];
// //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// //   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
// // }

// // const PillGroup: React.FC<PillGroupProps> = ({
// //   name,
// //   value,
// //   options,
// //   onChange,
// //   onBlur,
// // }) => (
// //   <div className="flex flex-wrap gap-2.5">
// //     {options.map((opt) => (
// //       <label
// //         key={opt}
// //         className="rf-pill-wrap"
// //         style={{ position: "relative" }}
// //       >
// //         <input
// //           type="radio"
// //           name={name}
// //           value={opt}
// //           checked={value === opt}
// //           onChange={onChange}
// //           onBlur={onBlur}
// //           className="rf-radio-input"
// //         />
// //         <span className="rf-pill">{opt}</span>
// //       </label>
// //     ))}
// //   </div>
// // );

// // interface SelectBoxProps {
// //   name: string;
// //   value: string;
// //   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
// //   onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
// //   error?: string | false;
// //   children: React.ReactNode;
// //   className?: string;
// // }

// // const SelectBox: React.FC<SelectBoxProps> = ({
// //   name,
// //   value,
// //   onChange,
// //   onBlur,
// //   error,
// //   children,
// //   className = "",
// // }) => (
// //   <div className="relative">
// //     <select
// //       name={name}
// //       value={value}
// //       onChange={onChange}
// //       onBlur={onBlur}
// //       className={`rf-select appearance-none pr-9 ${error ? "rf-error" : ""} ${className}`}
// //     >
// //       {children}
// //     </select>
// //     <ChevronDown
// //       size={15}
// //       className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
// //       style={{ color: INK_SOFT }}
// //     />
// //   </div>
// // );

// // interface DateRangeFieldProps {
// //   fromName: keyof FormData;
// //   toName: keyof FormData;
// //   fromValue: string;
// //   toValue: string;
// //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// //   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
// // }

// // /** Shared "From date / To date -> computed Y-M-D" widget used for service period and contractual period. */
// // const DateRangeField: React.FC<DateRangeFieldProps> = ({
// //   fromName,
// //   toName,
// //   fromValue,
// //   toValue,
// //   onChange,
// //   onBlur,
// // }) => {
// //   const today = new Date().toISOString().slice(0, 10);
// //   const duration = calcDuration(fromValue, toValue);
// //   return (
// //     <div>
// //       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mb-3">
// //         <input
// //           type="date"
// //           name={fromName}
// //           value={fromValue}
// //           max={today}
// //           onChange={onChange}
// //           onBlur={onBlur}
// //           className="rf-input"
// //         />
// //         <input
// //           type="date"
// //           name={toName}
// //           value={toValue}
// //           min={fromValue || undefined}
// //           max={today}
// //           onChange={onChange}
// //           onBlur={onBlur}
// //           className="rf-input"
// //         />
// //       </div>
// //       <div
// //         className="rounded-lg px-3 py-2 inline-flex items-center gap-2"
// //         style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
// //       >
// //         <span
// //           className="text-[11px] font-extrabold tracking-wide"
// //           style={{ color: OCHRE_DEEP }}
// //         >
// //           DURATION
// //         </span>
// //         <span className="rf-mono text-sm font-bold" style={{ color: INK }}>
// //           {formatDuration(duration)}
// //         </span>
// //       </div>
// //     </div>
// //   );
// // };

// // /* ---------------------------------------------------------------
// //    MAIN COMPONENT
// // --------------------------------------------------------------- */
// // export default function GovernmentRegistrationForm(): React.ReactElement {
// //   const [data, setData] = useState<FormData>(initialData);
// //   const [errors, setErrors] = useState<FormErrors>({});
// //   const [touched, setTouched] = useState<FormTouched>({});
// //   const [loading, setLoading] = useState(false);
// //   const [submitted, setSubmitted] = useState(false);
// //   const [captchaCode, setCaptchaCode] = useState("");
// //   const [activeSection, setActiveSection] = useState<SectionId>("personal");
// //   const [isScrolled, setIsScrolled] = useState(false);
// //   const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>(
// //     {},
// //   );
// //   const observerRef = useRef<IntersectionObserver | null>(null);
// //   const progressRef = useRef<HTMLDivElement>(null);

// //   const [showOtp, setShowOtp] = useState(false);
// //   const [submitError, setSubmitError] = useState("");

// //   // Generate a real captcha on mount instead of shipping a hardcoded one.
// //   useEffect(() => {
// //     setCaptchaCode(genCaptcha());
// //   }, []);

// //   // Handle scroll for sticky shadow
// //   useEffect(() => {
// //     const handleScroll = () => {
// //       if (progressRef.current) {
// //         const rect = progressRef.current.getBoundingClientRect();
// //         setIsScrolled(rect.top < 0);
// //       }
// //     };
// //     window.addEventListener("scroll", handleScroll, { passive: true });
// //     return () => window.removeEventListener("scroll", handleScroll);
// //   }, []);

// //   /* ---------- age calculation (reuses the same duration helper as service/contractual periods) ---------- */
// //   const age = useMemo<DurationParts | null>(() => {
// //     if (!isRealDate(data.dobDay, data.dobMonth, data.dobYear)) return null;
// //     const dobIso = `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`;
// //     return calcDuration(dobIso, "2025-08-01"); // age as on 01-08-2025
// //   }, [data.dobDay, data.dobMonth, data.dobYear]);

// //   /* ---------- validation ---------- */
// //   const validateField = useCallback(
// //     (name: keyof FormData, value: string, all: FormData): string => {
// //       switch (name) {
// //         case "applicantName":
// //           return value.trim() ? "" : "Applicant name is required";
// //         case "gender":
// //           return value ? "" : "Gender is required";
// //         case "isBiharDomicile":
// //           return value ? "" : "Domicile status is required";
// //         case "category":
// //           return value ? "" : "Category is required";
// //         case "caste":
// //           return value ? "" : "Caste is required";
// //         case "isNonCreamyLayer":
// //           return value ? "" : "Non-creamy layer status is required";
// //         case "isPwD":
// //           return value ? "" : "PWD status is required";
// //         case "isMin40PercentPwD":
// //           return value ? "" : "This field is required";
// //         case "isExServiceman":
// //           return value ? "" : "Ex-serviceman status is required";
// //         case "serviceFromDate":
// //         case "serviceToDate":
// //           if (
// //             all.isExServiceman === "YES" &&
// //             (!all.serviceFromDate || !all.serviceToDate)
// //           ) {
// //             return "Service period is required for ex-servicemen";
// //           }
// //           return "";
// //         case "isNccCadet":
// //           return value ? "" : "NCC cadet status is required";
// //         case "isBiharGovtEmployee":
// //           return value ? "" : "This field is required";
// //         case "bsscAttempts":
// //           return value ? "" : "Number of attempts is required";
// //         case "isContractualEmployee":
// //           return value ? "" : "This field is required";
// //         case "contractualFromDate":
// //         case "contractualToDate":
// //           if (
// //             all.isContractualEmployee === "YES" &&
// //             (!all.contractualFromDate || !all.contractualToDate)
// //           ) {
// //             return "Contractual service period is required";
// //           }
// //           return "";
// //         case "mobileNo":
// //           if (!value) return "Mobile number is required";
// //           return /^[6-9]\d{9}$/.test(value)
// //             ? ""
// //             : "Enter a valid 10 digit number starting with 6-9";
// //         case "confirmMobileNo":
// //           if (!value) return "Please confirm your mobile number";
// //           return value === all.mobileNo ? "" : "Mobile numbers do not match";
// //         case "emailId":
// //           if (!value) return "Email is required";
// //           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
// //             ? ""
// //             : "Enter a valid email address";
// //         case "confirmEmailId":
// //           if (!value) return "Please confirm your email";
// //           return value === all.emailId ? "" : "Email addresses do not match";
// //         case "dobDay":
// //         case "dobMonth":
// //         case "dobYear":
// //           if (!all.dobDay || !all.dobMonth || !all.dobYear)
// //             return "Complete date of birth is required";
// //           return isRealDate(all.dobDay, all.dobMonth, all.dobYear)
// //             ? ""
// //             : "Enter a valid calendar date";
// //         case "captchaInput":
// //           if (!value) return "Captcha is required";
// //           return value.toUpperCase() === captchaCode.toUpperCase()
// //             ? ""
// //             : "Captcha does not match";
// //         default:
// //           return "";
// //       }
// //     },
// //     [captchaCode],
// //   );

// //   type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

// //   const handleChange = (e: FieldEvent) => {
// //     const { name, value } = e.target;
// //     const fieldName = name as keyof FormData;
// //     const digitsOnly =
// //       name === "mobileNo" || name === "confirmMobileNo"
// //         ? value.replace(/\D/g, "").slice(0, 10)
// //         : value;
// //     const next: FormData = { ...data, [fieldName]: digitsOnly };
// //     setData(next);
// //     if (touched[fieldName])
// //       setErrors((prev) => ({
// //         ...prev,
// //         [fieldName]: validateField(fieldName, digitsOnly, next),
// //       }));

// //     // DOB fields are interdependent — once one is touched, re-validate the whole trio live
// //     if (
// //       ["dobDay", "dobMonth", "dobYear"].includes(name) &&
// //       (touched.dobDay || touched.dobMonth || touched.dobYear)
// //     ) {
// //       const msg = validateField(fieldName, digitsOnly, next);
// //       setErrors((prev) => ({
// //         ...prev,
// //         dobDay: msg,
// //         dobMonth: msg,
// //         dobYear: msg,
// //       }));
// //     }
// //     // Service / contractual date pairs are interdependent the same way
// //     if (
// //       ["serviceFromDate", "serviceToDate"].includes(name) &&
// //       (touched.serviceFromDate || touched.serviceToDate)
// //     ) {
// //       const msg = validateField(fieldName, digitsOnly, next);
// //       setErrors((prev) => ({
// //         ...prev,
// //         serviceFromDate: msg,
// //         serviceToDate: msg,
// //       }));
// //     }
// //     if (
// //       ["contractualFromDate", "contractualToDate"].includes(name) &&
// //       (touched.contractualFromDate || touched.contractualToDate)
// //     ) {
// //       const msg = validateField(fieldName, digitsOnly, next);
// //       setErrors((prev) => ({
// //         ...prev,
// //         contractualFromDate: msg,
// //         contractualToDate: msg,
// //       }));
// //     }
// //   };

// //   const handleBlur = (
// //     e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
// //   ) => {
// //     const { name, value } = e.target;
// //     const fieldName = name as keyof FormData;
// //     setTouched((prev) => ({ ...prev, [fieldName]: true }));
// //     const msg = validateField(fieldName, value, data);
// //     if (["dobDay", "dobMonth", "dobYear"].includes(name)) {
// //       setTouched((prev) => ({
// //         ...prev,
// //         dobDay: true,
// //         dobMonth: true,
// //         dobYear: true,
// //       }));
// //       setErrors((prev) => ({
// //         ...prev,
// //         dobDay: msg,
// //         dobMonth: msg,
// //         dobYear: msg,
// //       }));
// //     } else if (["serviceFromDate", "serviceToDate"].includes(name)) {
// //       setTouched((prev) => ({
// //         ...prev,
// //         serviceFromDate: true,
// //         serviceToDate: true,
// //       }));
// //       setErrors((prev) => ({
// //         ...prev,
// //         serviceFromDate: msg,
// //         serviceToDate: msg,
// //       }));
// //     } else if (["contractualFromDate", "contractualToDate"].includes(name)) {
// //       setTouched((prev) => ({
// //         ...prev,
// //         contractualFromDate: true,
// //         contractualToDate: true,
// //       }));
// //       setErrors((prev) => ({
// //         ...prev,
// //         contractualFromDate: msg,
// //         contractualToDate: msg,
// //       }));
// //     } else {
// //       setErrors((prev) => ({ ...prev, [fieldName]: msg }));
// //     }
// //   };

// //   const refreshCaptcha = () => {
// //     setCaptchaCode(genCaptcha());
// //     setData((d) => ({ ...d, captchaInput: "" }));
// //     setErrors((prev) => ({ ...prev, captchaInput: "" }));
// //   };

// //   /* ---------- completion tracking ---------- */
// //   const sectionStatus = (id: SectionId) => {
// //     const fields = REQUIRED_BY_SECTION[id];
// //     const filled = fields.filter(
// //       (f) => String(data[f] || "").trim() !== "",
// //     ).length;
// //     const hasErr = fields.some((f) => errors[f]);
// //     return {
// //       filled,
// //       total: fields.length,
// //       done: filled === fields.length && !hasErr,
// //     };
// //   };

// //   const overallPct = useMemo(() => {
// //     const all = Object.values(REQUIRED_BY_SECTION).flat();
// //     const filled = all.filter(
// //       (f) => String(data[f] || "").trim() !== "",
// //     ).length;
// //     return Math.round((filled / all.length) * 100);
// //   }, [data]);

// //   /* ---------- scroll-spy ---------- */
// //   useEffect(() => {
// //     observerRef.current = new IntersectionObserver(
// //       (entries) => {
// //         entries.forEach((entry) => {
// //           const section = (entry.target as HTMLElement).dataset.section as
// //             | SectionId
// //             | undefined;
// //           if (entry.isIntersecting && section) setActiveSection(section);
// //         });
// //       },
// //       { rootMargin: "-20% 0px -65% 0px", threshold: 0.1 },
// //     );
// //     Object.values(sectionRefs.current).forEach(
// //       (el) => el && observerRef.current?.observe(el),
// //     );
// //     return () => observerRef.current?.disconnect();
// //   }, []);

// //   const scrollTo = (id: SectionId) => {
// //     const target = sectionRefs.current[id];
// //     if (target) {
// //       const yOffset = -80; // Offset for sticky header
// //       const y =
// //         target.getBoundingClientRect().top + window.pageYOffset + yOffset;
// //       window.scrollTo({ top: y, behavior: "smooth" });
// //     }
// //   };

// //   // DateSelect handlers
// //   const handleDateChange = (field: "day" | "month" | "year", value: string) => {
// //     const fieldMap = { day: "dobDay", month: "dobMonth", year: "dobYear" };
// //     const formField = fieldMap[field];
// //     const next: FormData = { ...data, [formField]: value };
// //     setData(next);
// //     if (touched[formField]) {
// //       const msg = validateField(formField, value, next);
// //       setErrors((prev) => ({ ...prev, [formField]: msg }));
// //     }
// //     // Re-validate all DOB fields
// //     if (touched.dobDay || touched.dobMonth || touched.dobYear) {
// //       const msg = validateField("dobDay", next.dobDay, next);
// //       setErrors((prev) => ({
// //         ...prev,
// //         dobDay: msg,
// //         dobMonth: msg,
// //         dobYear: msg,
// //       }));
// //     }
// //   };

// //   const handleDateBlur = (field: "day" | "month" | "year") => {
// //     const fieldMap = { day: "dobDay", month: "dobMonth", year: "dobYear" };
// //     const formField = fieldMap[field];
// //     setTouched((prev) => ({
// //       ...prev,
// //       [formField]: true,
// //       dobDay: true,
// //       dobMonth: true,
// //       dobYear: true,
// //     }));
// //     const msg = validateField("dobDay", data.dobDay, data);
// //     setErrors((prev) => ({
// //       ...prev,
// //       dobDay: msg,
// //       dobMonth: msg,
// //       dobYear: msg,
// //     }));
// //   };

// //   /* ---------- submit: create Cognito user, then ask for email OTP ---------- */
// //   const handleSubmit = async () => {
// //     const allFields = Object.values(REQUIRED_BY_SECTION).flat();
// //     const newErrors: FormErrors = {};
// //     allFields.forEach((f) => {
// //       newErrors[f] = validateField(f, data[f], data);
// //     });
// //     setErrors(newErrors);
// //     setTouched(
// //       Object.fromEntries(allFields.map((f) => [f, true])) as FormTouched,
// //     );

// //     const firstErrorField = allFields.find((f) => newErrors[f]);
// //     if (firstErrorField) {
// //       const section = (
// //         Object.entries(REQUIRED_BY_SECTION) as [SectionId, (keyof FormData)[]][]
// //       ).find(([, fs]) => fs.includes(firstErrorField))?.[0];
// //       if (section) scrollTo(section);
// //       return;
// //     }

// //     setLoading(true);
// //     setSubmitError("");
// //     try {
// //       // Sends all form fields to Cognito as user attributes (standard + custom)
// //       // and triggers the built-in signUp verification email containing the code.
// //       await sendOtp(data);
// //       setShowOtp(true);
// //     } catch (err: any) {
// //       const code = err?.name || err?.code;
// //       if (code === "UsernameExistsException") {
// //         setSubmitError(
// //           "An account with this email already exists. Please use a different email, or verify the code already sent to it.",
// //         );
// //       } else if (code === "SchemaMisconfiguredError") {
// //         // Thrown by cognito.ts when a custom attribute is missing from the User Pool schema.
// //         setSubmitError(err.message);
// //       } else if (code === "InvalidPasswordException") {
// //         setSubmitError(
// //           "There was a problem creating the account. Please try again in a moment.",
// //         );
// //       } else {
// //         setSubmitError(
// //           err?.message || "Could not start registration. Please try again.",
// //         );
// //       }
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   /* ---------- OTP modal callbacks ---------- */
// //   const handleOtpVerify = async (otp: string) => {
// //     await verifyOtp(data.emailId, otp);
// //     console.log("Registration payload:", {
// //       ...data,
// //       dob: `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`,
// //       age,
// //     });
// //     setSubmitted(true);
// //     window.scrollTo({ top: 0, behavior: "smooth" });
// //   };

// //   const handleOtpResend = async () => {
// //     await resendOtp(data.emailId);
// //   };

// //   const days = Array.from({ length: 31 }, (_, i) => i + 1);
// //   const years = Array.from(
// //     { length: 101 },
// //     (_, i) => new Date().getFullYear() - i,
// //   );

// //   /* ---------------------------------------------------------------
// //      SUCCESS STATE
// //   --------------------------------------------------------------- */
// //   if (submitted) {
// //     return (
// //       <div
// //         className="rf-root min-h-screen flex items-center justify-center p-6"
// //         style={{ background: PAPER }}
// //       >
// //         <style>{FONTS}</style>
// //         <div
// //           className="rf-pop max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-sm"
// //           style={{ border: `1.5px solid ${LINE}` }}
// //         >
// //           <div
// //             className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
// //             style={{ background: "#E8F3EF" }}
// //           >
// //             <PartyPopper size={28} style={{ color: TEAL }} />
// //           </div>
// //           <div
// //             className="rf-display text-2xl font-semibold mb-2"
// //             style={{ color: INK }}
// //           >
// //             Registration saved
// //           </div>
// //           <p className="text-sm font-medium mb-6" style={{ color: INK_SOFT }}>
// //             Your details for{" "}
// //             <span style={{ color: INK, fontWeight: 800 }}>
// //               {data.applicantName || "the applicant"}
// //             </span>{" "}
// //             have been recorded and your email has been verified. A confirmation
// //             has been sent to {data.emailId}.
// //           </p>
// //           <button
// //             onClick={() => {
// //               setSubmitted(false);
// //               setData(initialData);
// //               setErrors({});
// //               setTouched({});
// //               setShowOtp(false);
// //               setSubmitError("");
// //               setCaptchaCode(genCaptcha());
// //             }}
// //             className="px-6 py-2.5 rounded-full font-bold text-sm text-white"
// //             style={{ background: INK }}
// //           >
// //             Start a new form
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="rf-root min-h-screen" style={{ background: PAPER }}>
// //       <style>{FONTS}</style>

// //       {/* HEADER */}
// //       <div className="border-b" style={{ borderColor: LINE, background: CARD }}>
// //         <div className="max-w-7xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between">
// //           <div>
// //             <div
// //               className="text-[11px] font-extrabold tracking-[0.18em] mb-1"
// //               style={{ color: OCHRE_DEEP }}
// //             >
// //               BIHAR STAFF SELECTION COMMISSION
// //             </div>
// //             <div
// //               className="rf-display text-2xl md:text-[24px] font-semibold"
// //               style={{ color: INK }}
// //             >
// //               Candidate Registration
// //             </div>
// //             <div
// //               className="text-[12px] font-medium mt-0.5"
// //               style={{ color: INK_SOFT }}
// //             >
// //               अभ्यर्थी पंजीकरण फॉर्म
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* STICKY PROGRESS BAR */}
// //       <div
// //         ref={progressRef}
// //         className={`rf-sticky-progress ${isScrolled ? "scrolled" : ""}`}
// //       >
// //         <div>
// //           {/* Mobile progress */}
// //           <div className="md:hidden flex items-center gap-1 overflow-x-auto">
// //             {SECTIONS.map((s, i) => {
// //               const st = sectionStatus(s.id);
// //               return (
// //                 <button
// //                   key={s.id}
// //                   onClick={() => scrollTo(s.id)}
// //                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold"
// //                   style={{
// //                     background: activeSection === s.id ? INK : "#fff",
// //                     color: activeSection === s.id ? "#fff" : INK_SOFT,
// //                     border: `1.5px solid ${
// //                       activeSection === s.id ? INK : LINE
// //                     }`,
// //                   }}
// //                 >
// //                   {st.done ? <CheckCircle2 size={13} /> : <span>{i + 1}</span>}{" "}
// //                   {s.label}
// //                 </button>
// //               );
// //             })}
// //           </div>
// //         </div>
// //       </div>

// //       <div className="max-w-7xl mx-auto px-5 py-4 flex gap-10">
// //         {/* DESKTOP RAIL */}
// //         <div className="hidden md:block w-64 shrink-0">
// //           <div className="sticky top-[90px]">
// //             {SECTIONS.map((s, i) => {
// //               const st = sectionStatus(s.id);
// //               const Icon = s.icon;
// //               const isLast = i === SECTIONS.length - 1;
// //               const isActive = activeSection === s.id;
// //               return (
// //                 <div key={s.id} className="relative pb-8 pl-2">
// //                   {!isLast && (
// //                     <div className={`rf-rail-line ${st.done ? "done" : ""}`} />
// //                   )}
// //                   <button
// //                     onClick={() => scrollTo(s.id)}
// //                     className="flex items-start gap-3 text-left group w-full"
// //                   >
// //                     <div
// //                       className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
// //                       style={{
// //                         background: st.done ? TEAL : isActive ? INK : "#fff",
// //                         border: `2px solid ${
// //                           st.done ? TEAL : isActive ? INK : LINE
// //                         }`,
// //                       }}
// //                     >
// //                       {st.done ? (
// //                         <CheckCircle2 size={18} color="#fff" />
// //                       ) : (
// //                         <Icon size={16} color={isActive ? "#fff" : INK_SOFT} />
// //                       )}
// //                     </div>
// //                     <div className="pt-1.5">
// //                       <div
// //                         className="text-[10.5px] font-extrabold rf-mono"
// //                         style={{ color: OCHRE_DEEP }}
// //                       >
// //                         0{i + 1} · {st.filled}/{st.total}
// //                       </div>
// //                       <div
// //                         className="text-[13px] font-extrabold leading-tight"
// //                         style={{ color: isActive ? INK : "#374151" }}
// //                       >
// //                         {s.label}
// //                       </div>
// //                       <div
// //                         className="text-[11px] font-medium"
// //                         style={{ color: INK_SOFT }}
// //                       >
// //                         {s.hi}
// //                       </div>
// //                     </div>
// //                   </button>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         </div>

// //         {/* MAIN CONTENT */}
// //         <div className="flex-1 min-w-0 space-y-6">
// //           {/* SECTION 1 — PERSONAL */}
// //           <div
// //             ref={(el) => {
// //               sectionRefs.current.personal = el;
// //             }}
// //             data-section="personal"
// //             className="rounded-2xl p-6 md:p-8"
// //             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
// //           >
// //             <div className="flex items-center gap-2 mb-6">
// //               <User size={17} style={{ color: OCHRE }} />
// //               <h2
// //                 className="rf-display text-lg font-semibold"
// //                 style={{ color: INK }}
// //               >
// //                 Personal &amp; Identity
// //               </h2>
// //             </div>

// //             <Field
// //               label="Name of applicant"
// //               hi="आवेदक का नाम"
// //               required
// //               error={touched.applicantName && errors.applicantName}
// //               note="Enter your name exactly as in your Matriculation / Secondary examination certificate. Do not use prefixes such as Mr. or Ms."
// //             >
// //               <input
// //                 type="text"
// //                 name="applicantName"
// //                 value={data.applicantName}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`rf-input uppercase ${
// //                   touched.applicantName && errors.applicantName
// //                     ? "rf-error"
// //                     : ""
// //                 }`}
// //                 placeholder="AS PER MATRICULATION CERTIFICATE"
// //               />
// //             </Field>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Gender"
// //                 hi="लिंग"
// //                 required
// //                 error={touched.gender && errors.gender}
// //                 note="A transgender candidate of Bihar-state domicile must apply under the BC category."
// //               >
// //                 <PillGroup
// //                   name="gender"
// //                   value={data.gender}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["MALE", "FEMALE", "TRANSGENDER"]}
// //                 />
// //               </Field>

// //               <Field
// //                 label="Domicile of Bihar state?"
// //                 hi="बिहार राज्य का निवासी?"
// //                 required
// //                 error={touched.isBiharDomicile && errors.isBiharDomicile}
// //               >
// //                 <PillGroup
// //                   name="isBiharDomicile"
// //                   value={data.isBiharDomicile}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>
// //             </div>

// //             {/* Replaced with DateSelect component */}
// //             <DateSelect
// //               value={{
// //                 day: data.dobDay,
// //                 month: data.dobMonth,
// //                 year: data.dobYear,
// //               }}
// //               onChange={handleDateChange}
// //               onBlur={handleDateBlur}
// //               errors={{
// //                 day: touched.dobDay && errors.dobDay,
// //                 month: touched.dobMonth && errors.dobMonth,
// //                 year: touched.dobYear && errors.dobYear,
// //               }}
// //               touched={{
// //                 day: touched.dobDay,
// //                 month: touched.dobMonth,
// //                 year: touched.dobYear,
// //               }}
// //               required={true}
// //               label="Date of birth"
// //               hi="जन्म तिथि"
// //               note="As recorded in your Matriculation / 10th standard or equivalent certificate."
// //               maxYear={new Date().getFullYear()}
// //               minYear={1900}
// //             />

// //             <div
// //               className="rounded-xl p-4 flex items-center justify-between"
// //               style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
// //             >
// //               <div>
// //                 <div
// //                   className="text-[11px] font-extrabold tracking-wide"
// //                   style={{ color: OCHRE_DEEP }}
// //                 >
// //                   AGE AS ON 01-08-2025
// //                 </div>
// //                 <div
// //                   className="text-[11px] font-medium"
// //                   style={{ color: INK_SOFT }}
// //                 >
// //                   दिनांक 01-08-2025 को आयु
// //                 </div>
// //               </div>
// //               <div className="rf-mono text-lg font-bold" style={{ color: INK }}>
// //                 {formatDuration(age)}
// //               </div>
// //             </div>
// //           </div>

// //           {/* SECTION 2 — CATEGORY */}
// //           <div
// //             ref={(el) => {
// //               sectionRefs.current.category = el;
// //             }}
// //             data-section="category"
// //             className="rounded-2xl p-6 md:p-8"
// //             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
// //           >
// //             <div className="flex items-center gap-2 mb-6">
// //               <ShieldCheck size={17} style={{ color: OCHRE }} />
// //               <h2
// //                 className="rf-display text-lg font-semibold"
// //                 style={{ color: INK }}
// //               >
// //                 Category &amp; Reservation
// //               </h2>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Category"
// //                 hi="श्रेणी"
// //                 required
// //                 error={touched.category && errors.category}
// //               >
// //                 <PillGroup
// //                   name="category"
// //                   value={data.category}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["UR", "SC", "ST", "EBC", "BC", "EWS"]}
// //                 />
// //               </Field>

// //               <Field
// //                 label="Caste"
// //                 hi="जाति"
// //                 required
// //                 error={touched.caste && errors.caste}
// //               >
// //                 <SelectBox
// //                   name="caste"
// //                   value={data.caste}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched.caste && errors.caste}
// //                   className="max-w-xs"
// //                 >
// //                   <option value="">Select caste</option>
// //                   <option value="GENERIC_CAST">Sample Caste Group</option>
// //                 </SelectBox>
// //               </Field>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Do you belong to non-creamy layer?"
// //                 hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?"
// //                 required
// //                 error={touched.isNonCreamyLayer && errors.isNonCreamyLayer}
// //               >
// //                 <PillGroup
// //                   name="isNonCreamyLayer"
// //                   value={data.isNonCreamyLayer}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>

// //               <Field
// //                 label="Are you a person with disability?"
// //                 hi="क्या आप दिव्यांगता (PWD) वाले व्यक्ति हैं?"
// //                 required
// //                 error={touched.isPwD && errors.isPwD}
// //               >
// //                 <PillGroup
// //                   name="isPwD"
// //                   value={data.isPwD}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field label="Nature of disability" hi="दिव्यांगता की प्रकृति">
// //                 <PillGroup
// //                   name="natureOfDisability"
// //                   value={data.natureOfDisability}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["PERMANENT", "TEMPORARY"]}
// //                 />
// //               </Field>

// //               <Field
// //                 label="Are you a person with minimum 40% disability?"
// //                 hi="क्या आप न्यूनतम 40% दिव्यांगता (PWD) वाले व्यक्ति हैं?"
// //                 required
// //                 error={touched.isMin40PercentPwD && errors.isMin40PercentPwD}
// //               >
// //                 <PillGroup
// //                   name="isMin40PercentPwD"
// //                   value={data.isMin40PercentPwD}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>
// //             </div>
// //           </div>

// //           {/* SECTION 3 — SERVICE */}
// //           <div
// //             ref={(el) => {
// //               sectionRefs.current.service = el;
// //             }}
// //             data-section="service"
// //             className="rounded-2xl p-6 md:p-8"
// //             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
// //           >
// //             <div className="flex items-center gap-2 mb-6">
// //               <Briefcase size={17} style={{ color: OCHRE }} />
// //               <h2
// //                 className="rf-display text-lg font-semibold"
// //                 style={{ color: INK }}
// //               >
// //                 Service &amp; Employment
// //               </h2>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Are you an ex-serviceman?"
// //                 hi="क्या आप भूतपूर्व सैनिक हैं?"
// //                 required
// //                 error={touched.isExServiceman && errors.isExServiceman}
// //               >
// //                 <PillGroup
// //                   name="isExServiceman"
// //                   value={data.isExServiceman}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>

// //               <Field
// //                 label="Are you an NCC full-time cadet / instructor?"
// //                 hi="क्या आप एनसीसी के पूर्णकालिक कैडेट/अनुदेशक हैं?"
// //                 required
// //                 error={touched.isNccCadet && errors.isNccCadet}
// //               >
// //                 <PillGroup
// //                   name="isNccCadet"
// //                   value={data.isNccCadet}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>
// //             </div>

// //             {data.isExServiceman === "YES" && (
// //               <Field
// //                 label="Service in defence — from / to date"
// //                 hi="रक्षा में सेवा — दिनांक से/तक"
// //                 error={touched.serviceFromDate && errors.serviceFromDate}
// //                 note="Select the joining and release dates from your defence service record; the duration is calculated automatically."
// //               >
// //                 <DateRangeField
// //                   fromName="serviceFromDate"
// //                   toName="serviceToDate"
// //                   fromValue={data.serviceFromDate}
// //                   toValue={data.serviceToDate}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                 />
// //               </Field>
// //             )}

// //             <Field
// //               label="NCC 'C' certificate number"
// //               hi="एनसीसी 'सी' प्रमाणपत्र संख्या"
// //             >
// //               <input
// //                 type="text"
// //                 name="nccCertificateNo"
// //                 value={data.nccCertificateNo}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className="rf-input max-w-md"
// //               />
// //             </Field>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Are you a Bihar government employee with 3+ years continuous service?"
// //                 hi="क्या आप बिहार सरकार के कर्मचारी हैं जिन्होंने कम से कम तीन साल नियमित सेवा की है?"
// //                 required
// //                 error={
// //                   touched.isBiharGovtEmployee && errors.isBiharGovtEmployee
// //                 }
// //               >
// //                 <PillGroup
// //                   name="isBiharGovtEmployee"
// //                   value={data.isBiharGovtEmployee}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>

// //               <Field
// //                 label="BSSC exam attempts after 12-12-2022"
// //                 hi="दिनांक 12-12-2022 के बाद परीक्षाओं में प्रयासों की संख्या"
// //                 required
// //                 error={touched.bsscAttempts && errors.bsscAttempts}
// //               >
// //                 <SelectBox
// //                   name="bsscAttempts"
// //                   value={data.bsscAttempts}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   error={touched.bsscAttempts && errors.bsscAttempts}
// //                   className="max-w-xs"
// //                 >
// //                   <option value="">Select</option>
// //                   <option value="0">0</option>
// //                   <option value="1">1</option>
// //                   <option value="2">2</option>
// //                   <option value="3">3</option>
// //                 </SelectBox>
// //               </Field>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Are you a contractual employee on a post from the advertisement?"
// //                 hi="क्या आप विज्ञापन में उल्लिखित पदों में से किसी पद पर संविदा नियोजित कर्मी हैं?"
// //                 required
// //                 error={
// //                   touched.isContractualEmployee && errors.isContractualEmployee
// //                 }
// //               >
// //                 <PillGroup
// //                   name="isContractualEmployee"
// //                   value={data.isContractualEmployee}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   options={["YES", "NO"]}
// //                 />
// //               </Field>

// //               {data.isContractualEmployee === "YES" && (
// //                 <Field label="Name of post" hi="पद का नाम">
// //                   <SelectBox
// //                     name="nameOfPost"
// //                     value={data.nameOfPost}
// //                     onChange={handleChange}
// //                     onBlur={handleBlur}
// //                     className="max-w-xs"
// //                   >
// //                     <option value="">Select post</option>
// //                   </SelectBox>
// //                 </Field>
// //               )}
// //             </div>

// //             {data.isContractualEmployee === "YES" && (
// //               <>
// //                 <Field
// //                   label="Agreement under circular no. 1003, dated 22.01.2021 (GAD, Bihar)?"
// //                   hi="क्या आपके पास संकल्प ज्ञापंक 1003, दिनांक 22.01.2021 के आलोक में एकरारनामा है?"
// //                   note="Ensure you have a valid agreement copy and contractual experience certificate ready to upload, or you will not receive weightage."
// //                 >
// //                   <PillGroup
// //                     name="hasAgreement"
// //                     value={data.hasAgreement}
// //                     onChange={handleChange}
// //                     onBlur={handleBlur}
// //                     options={["YES", "NO"]}
// //                   />
// //                 </Field>

// //                 <Field
// //                   label="Contractual service period in Bihar government — from / to date"
// //                   hi="उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि — दिनांक से/तक"
// //                   error={
// //                     touched.contractualFromDate && errors.contractualFromDate
// //                   }
// //                   note="Select the dates on which your contractual engagement began and ended (or the current date, if still ongoing); the duration is calculated automatically."
// //                 >
// //                   <DateRangeField
// //                     fromName="contractualFromDate"
// //                     toName="contractualToDate"
// //                     fromValue={data.contractualFromDate}
// //                     toValue={data.contractualToDate}
// //                     onChange={handleChange}
// //                     onBlur={handleBlur}
// //                   />
// //                 </Field>
// //               </>
// //             )}
// //           </div>

// //           {/* SECTION 4 — CONTACT */}
// //           <div
// //             ref={(el) => {
// //               sectionRefs.current.contact = el;
// //             }}
// //             data-section="contact"
// //             className="rounded-2xl p-6 md:p-8"
// //             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
// //           >
// //             <div className="flex items-center gap-2 mb-6">
// //               <Phone size={17} style={{ color: OCHRE }} />
// //               <h2
// //                 className="rf-display text-lg font-semibold"
// //                 style={{ color: INK }}
// //               >
// //                 Contact &amp; Verification
// //               </h2>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Mobile number"
// //                 hi="मोबाइल नम्बर"
// //                 required
// //                 error={touched.mobileNo && errors.mobileNo}
// //                 note="Keep this number active to receive communication about the recruitment process."
// //               >
// //                 <input
// //                   type="text"
// //                   inputMode="numeric"
// //                   name="mobileNo"
// //                   value={data.mobileNo}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   className={`rf-input rf-mono ${
// //                     touched.mobileNo && errors.mobileNo ? "rf-error" : ""
// //                   }`}
// //                   placeholder="10 digit mobile number"
// //                   maxLength={10}
// //                 />
// //               </Field>

// //               <Field
// //                 label="Confirm mobile number"
// //                 hi="मोबाइल नंबर की पुष्टि"
// //                 required
// //                 error={touched.confirmMobileNo && errors.confirmMobileNo}
// //               >
// //                 <input
// //                   type="text"
// //                   inputMode="numeric"
// //                   name="confirmMobileNo"
// //                   value={data.confirmMobileNo}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   className={`rf-input rf-mono ${
// //                     touched.confirmMobileNo && errors.confirmMobileNo
// //                       ? "rf-error"
// //                       : ""
// //                   }`}
// //                   placeholder="Re-enter mobile number"
// //                   maxLength={10}
// //                 />
// //               </Field>
// //             </div>

// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               <Field
// //                 label="Email ID"
// //                 hi="ईमेल आईडी"
// //                 required
// //                 error={touched.emailId && errors.emailId}
// //                 note="Keep this email active to receive communication about the recruitment process."
// //               >
// //                 <input
// //                   type="email"
// //                   name="emailId"
// //                   value={data.emailId}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   className={`rf-input lowercase ${
// //                     touched.emailId && errors.emailId ? "rf-error" : ""
// //                   }`}
// //                   placeholder="name@example.com"
// //                 />
// //               </Field>

// //               <Field
// //                 label="Confirm email ID"
// //                 hi="ईमेल आईडी की पुष्टि"
// //                 required
// //                 error={touched.confirmEmailId && errors.confirmEmailId}
// //               >
// //                 <input
// //                   type="email"
// //                   name="confirmEmailId"
// //                   value={data.confirmEmailId}
// //                   onChange={handleChange}
// //                   onBlur={handleBlur}
// //                   className={`rf-input lowercase ${
// //                     touched.confirmEmailId && errors.confirmEmailId
// //                       ? "rf-error"
// //                       : ""
// //                   }`}
// //                   placeholder="Re-enter email"
// //                 />
// //               </Field>
// //             </div>

// //             {/* CAPTCHA */}
// //             <div
// //               className="rounded-xl p-5 mt-2"
// //               style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
// //             >
// //               <div
// //                 className="text-[12px] font-extrabold tracking-wide mb-0.5"
// //                 style={{ color: OCHRE_DEEP }}
// //               >
// //                 <span style={{ color: DANGER }}>* </span>ENTER CAPTCHA CODE
// //               </div>
// //               <div
// //                 className="text-[11.5px] font-medium mb-3"
// //                 style={{ color: INK_SOFT }}
// //               >
// //                 कैप्चा कोड दर्ज करें — नीचे दिखाया गया कोड टाइप करें
// //               </div>
// //               <div className="flex flex-wrap items-center gap-4">
// //                 <div
// //                   className="rf-mono text-2xl font-bold tracking-[0.3em] italic px-5 py-2 rounded-lg select-none"
// //                   style={{ background: INK, color: "#fff" }}
// //                 >
// //                   {captchaCode}
// //                 </div>
// //                 <button
// //                   type="button"
// //                   onClick={refreshCaptcha}
// //                   className="flex items-center gap-1.5 text-xs font-extrabold"
// //                   style={{ color: OCHRE_DEEP }}
// //                 >
// //                   <RefreshCw size={14} /> REFRESH
// //                 </button>
// //               </div>
// //               <input
// //                 type="text"
// //                 name="captchaInput"
// //                 value={data.captchaInput}
// //                 onChange={handleChange}
// //                 onBlur={handleBlur}
// //                 className={`rf-input rf-mono max-w-xs mt-4 ${
// //                   touched.captchaInput && errors.captchaInput ? "rf-error" : ""
// //                 }`}
// //                 placeholder="Type the code above"
// //               />
// //               {touched.captchaInput && errors.captchaInput && (
// //                 <div
// //                   className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
// //                   style={{ color: DANGER }}
// //                 >
// //                   <AlertCircle size={12} /> {errors.captchaInput}
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* SUBMIT BAR */}
// //           <div
// //             className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
// //             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
// //           >
// //             <div className="text-sm font-semibold" style={{ color: INK_SOFT }}>
// //               {overallPct === 100
// //                 ? "All required fields look complete."
// //                 : `${overallPct}% of required fields completed`}
// //             </div>
// //             <button
// //               onClick={handleSubmit}
// //               disabled={loading}
// //               className="px-9 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[200px] transition-opacity"
// //               style={{ background: loading ? "#8B93A0" : INK }}
// //             >
// //               {loading ? (
// //                 <>
// //                   <Loader2 size={16} className="rf-spin" /> PROCESSING…
// //                 </>
// //               ) : (
// //                 "SAVE AND CONTINUE"
// //               )}
// //             </button>
// //           </div>
// //         </div>
// //       </div>

// //       {/* OTP MODAL — triggered after Cognito signUp succeeds */}
// //       <OTPVerificationModal
// //         isOpen={showOtp}
// //         onClose={() => setShowOtp(false)}
// //         type="email"
// //         emailOrMobile={data.emailId}
// //         onVerify={handleOtpVerify}
// //         onResend={handleOtpResend}
// //       />

// //       {/* ERROR TOAST for signUp failures (e.g. duplicate email, missing schema attribute) */}
// //       {submitError && (
// //         <div
// //           className="rf-toast fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg flex items-start gap-2 z-50"
// //           style={{ background: DANGER }}
// //         >
// //           <AlertCircle size={16} className="shrink-0 mt-0.5" />
// //           <span>{submitError}</span>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }


// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useMemo,
// } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   User,
//   ShieldCheck,
//   Briefcase,
//   Phone,
//   CheckCircle2,
//   RefreshCw,
//   ChevronDown,
//   Loader2,
//   PartyPopper,
//   AlertCircle,
//   Lock,
//   KeyRound,
// } from "lucide-react";
// import {
//   sendOtp,
//   verifyOtp,
//   resendOtp,
//   calcDuration,
//   triggerSetPassword,
//   confirmSetPassword,
// } from "../auth/cognito";
// import type { RegistrationFormData, DurationParts } from "../auth/cognito";
// import OTPVerificationModal from "../components/common/OTPVerificationModal";
// import DateSelect from "../components/common/DateSelect";

// const INK = "#12233F";
// const INK_SOFT = "#5B6B84";
// const PAPER = "#F4F5F2";
// const CARD = "#FFFFFF";
// const LINE = "#DBDFE6";
// const OCHRE = "#B9722E";
// const OCHRE_DEEP = "#8F5522";
// const TEAL = "#1E6F5C";
// const DANGER = "#B3432B";

// const FONTS = `
//   @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

//   .rf-root, .rf-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
//   .rf-display { font-family: 'Fraunces', serif; }
//   .rf-mono { font-family: 'JetBrains Mono', monospace; }

//   .rf-root input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
//   .rf-pill {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 16px; border-radius: 999px; border: 1.5px solid ${LINE};
//     background: #fff; cursor: pointer; font-weight: 700; font-size: 12.5px;
//     color: ${INK}; transition: all .15s ease; user-select: none;
//   }
//   .rf-pill:hover { border-color: ${OCHRE}; }
//   .rf-radio-input:checked + .rf-pill {
//     background: ${INK}; border-color: ${INK}; color: #fff;
//   }
//   .rf-radio-input:focus-visible + .rf-pill { outline: 2px solid ${OCHRE}; outline-offset: 2px; }

//   .rf-input, .rf-select {
//     width: 100%; border: 1.5px solid ${LINE}; border-radius: 10px;
//     padding: 11px 14px; font-size: 14px; font-weight: 600; color: ${INK};
//     background: #fff; outline: none; transition: border-color .15s ease, box-shadow .15s ease;
//   }
//   .rf-input:focus, .rf-select:focus {
//     border-color: ${OCHRE}; box-shadow: 0 0 0 3px rgba(185,114,46,0.15);
//   }
//   .rf-input.rf-error, .rf-select.rf-error { border-color: ${DANGER}; }
//   .rf-input.rf-error:focus, .rf-select.rf-error:focus { box-shadow: 0 0 0 3px rgba(179,67,43,0.15); }
//   .rf-input::placeholder { color: #A6AEBB; font-weight: 500; }

//   .rf-rail-line { position: absolute; left: 19px; top: 40px; bottom: -8px; width: 2px; background: ${LINE}; }
//   .rf-rail-line.done { background: ${TEAL}; }

//   @keyframes rf-pop { 0% { transform: scale(.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
//   .rf-pop { animation: rf-pop .35s cubic-bezier(.34,1.56,.64,1); }

//   @keyframes rf-spin { to { transform: rotate(360deg); } }
//   .rf-spin { animation: rf-spin .8s linear infinite; }

//   @keyframes rf-toast-in { 0% { transform: translate(-50%, 12px); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
//   .rf-toast { animation: rf-toast-in .25s ease; }

//   /* Sticky progress bar styles */
//   .rf-sticky-progress {
//     position: sticky;
//     top: 0;
//     z-index: 40;
//     background: ${CARD};
//     border-bottom: 1.5px solid ${LINE};
//     transition: box-shadow 0.2s ease;
//   }
//   .rf-sticky-progress.scrolled {
//     box-shadow: 0 2px 12px rgba(18, 35, 63, 0.08);
//   }
// `;

// /* ---------------------------------------------------------------
//    TYPES
// --------------------------------------------------------------- */

// /** Full form state = everything sent to Cognito, plus UI-only confirmation/captcha fields. */
// export interface FormData extends RegistrationFormData {
//   confirmMobileNo: string;
//   confirmEmailId: string;
//   captchaInput: string;
// }

// type FormErrors = Partial<Record<keyof FormData, string>>;
// type FormTouched = Partial<Record<keyof FormData, boolean>>;
// type SectionId = "personal" | "category" | "service" | "contact";

// interface SectionMeta {
//   id: SectionId;
//   label: string;
//   hi: string;
//   icon: React.ComponentType<{ size?: number; color?: string }>;
// }

// const SECTIONS: SectionMeta[] = [
//   {
//     id: "personal",
//     label: "Personal & Identity",
//     hi: "व्यक्तिगत विवरण",
//     icon: User,
//   },
//   {
//     id: "category",
//     label: "Category & Reservation",
//     hi: "श्रेणी एवं आरक्षण",
//     icon: ShieldCheck,
//   },
//   {
//     id: "service",
//     label: "Service & Employment",
//     hi: "सेवा एवं नियोजन",
//     icon: Briefcase,
//   },
//   {
//     id: "contact",
//     label: "Contact & Verification",
//     hi: "सम्पर्क एवं सत्यापन",
//     icon: Phone,
//   },
// ];

// const REQUIRED_BY_SECTION: Record<SectionId, (keyof FormData)[]> = {
//   personal: [
//     "applicantName",
//     "gender",
//     "isBiharDomicile",
//     "dobDay",
//     "dobMonth",
//     "dobYear",
//   ],
//   category: [
//     "category",
//     "caste",
//     "isNonCreamyLayer",
//     "isPwD",
//     "isMin40PercentPwD",
//   ],
//   service: [
//     "isExServiceman",
//     "isNccCadet",
//     "isBiharGovtEmployee",
//     "bsscAttempts",
//     "isContractualEmployee",
//   ],
//   contact: [
//     "mobileNo",
//     "confirmMobileNo",
//     "emailId",
//     "confirmEmailId",
//     "captchaInput",
//   ],
// };




// const initialData: FormData = {
//   applicantName: "",
//   gender: "",
//   isBiharDomicile: "",
//   category: "",
//   caste: "",
//   isNonCreamyLayer: "",
//   isPwD: "",
//   natureOfDisability: "",
//   isMin40PercentPwD: "",
//   isExServiceman: "",
//   serviceFromDate: "",
//   serviceToDate: "",
//   isNccCadet: "",
//   nccCertificateNo: "",
//   isBiharGovtEmployee: "",
//   bsscAttempts: "",
//   isContractualEmployee: "",
//   nameOfPost: "",
//   hasAgreement: "",
//   contractualFromDate: "",
//   contractualToDate: "",
//   mobileNo: "",
//   confirmMobileNo: "",
//   emailId: "",
//   confirmEmailId: "",
//   dobDay: "",
//   dobMonth: "",
//   dobYear: "",
//   captchaInput: "",
// };

// const genCaptcha = (): string => {
//   const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
//   let s = "";
//   for (let i = 0; i < 6; i++)
//     s += chars[Math.floor(Math.random() * chars.length)];
//   return s;
// };

// const pad2 = (v: string): string => v.padStart(2, "0");

// /** Real-calendar-date check — rejects things like 31 Feb that JS Date would silently roll into March. */
// const isRealDate = (day: string, month: string, year: string): boolean => {
//   const d = parseInt(day, 10),
//     m = parseInt(month, 10),
//     y = parseInt(year, 10);
//   if (!d || !m || !y) return false;
//   const dt = new Date(y, m - 1, d);
//   return (
//     dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
//   );
// };

// const formatDuration = (d: DurationParts | null): string =>
//   d ? `${d.years}y ${d.months}m ${d.days}d` : "—";

// /* ---------------------------------------------------------------
//    SMALL PRESENTATIONAL COMPONENTS
// --------------------------------------------------------------- */
// interface FieldProps {
//   label: string;
//   hi?: string;
//   required?: boolean;
//   error?: string | false;
//   children: React.ReactNode;
//   note?: string;
//   className?: string;
// }

// const Field: React.FC<FieldProps> = ({
//   label,
//   hi,
//   required,
//   error,
//   children,
//   note,
//   className = "",
// }) => (
//   <div className={`mb-6 ${className}`}>
//     <div className="mb-2">
//       <div
//         className="text-[12.5px] font-extrabold tracking-wide"
//         style={{ color: INK }}
//       >
//         {required && <span style={{ color: DANGER }}>* </span>}
//         {label}
//       </div>
//       {hi && (
//         <div className="text-[11.5px] font-medium" style={{ color: INK_SOFT }}>
//           {hi}
//         </div>
//       )}
//     </div>
//     {children}
//     {error && (
//       <div
//         className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
//         style={{ color: DANGER }}
//       >
//         <AlertCircle size={12} /> {error}
//       </div>
//     )}
//     {note && (
//       <div
//         className="text-[11px] font-semibold mt-1.5 leading-relaxed"
//         style={{ color: OCHRE_DEEP }}
//       >
//         {note}
//       </div>
//     )}
//   </div>
// );

// interface PillGroupProps {
//   name: string;
//   value: string;
//   options: string[];
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
// }

// const PillGroup: React.FC<PillGroupProps> = ({
//   name,
//   value,
//   options,
//   onChange,
//   onBlur,
// }) => (
//   <div className="flex flex-wrap gap-2.5">
//     {options.map((opt) => (
//       <label
//         key={opt}
//         className="rf-pill-wrap"
//         style={{ position: "relative" }}
//       >
//         <input
//           type="radio"
//           name={name}
//           value={opt}
//           checked={value === opt}
//           onChange={onChange}
//           onBlur={onBlur}
//           className="rf-radio-input"
//         />
//         <span className="rf-pill">{opt}</span>
//       </label>
//     ))}
//   </div>
// );

// interface SelectBoxProps {
//   name: string;
//   value: string;
//   onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
//   error?: string | false;
//   children: React.ReactNode;
//   className?: string;
// }

// const SelectBox: React.FC<SelectBoxProps> = ({
//   name,
//   value,
//   onChange,
//   onBlur,
//   error,
//   children,
//   className = "",
// }) => (
//   <div className="relative">
//     <select
//       name={name}
//       value={value}
//       onChange={onChange}
//       onBlur={onBlur}
//       className={`rf-select appearance-none pr-9 ${error ? "rf-error" : ""} ${className}`}
//     >
//       {children}
//     </select>
//     <ChevronDown
//       size={15}
//       className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
//       style={{ color: INK_SOFT }}
//     />
//   </div>
// );

// interface DateRangeFieldProps {
//   fromName: keyof FormData;
//   toName: keyof FormData;
//   fromValue: string;
//   toValue: string;
//   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
// }

// /** Shared "From date / To date -> computed Y-M-D" widget used for service period and contractual period. */
// const DateRangeField: React.FC<DateRangeFieldProps> = ({
//   fromName,
//   toName,
//   fromValue,
//   toValue,
//   onChange,
//   onBlur,
// }) => {
//   const today = new Date().toISOString().slice(0, 10);
//   const duration = calcDuration(fromValue, toValue);
//   return (
//     <div>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mb-3">
//         <input
//           type="date"
//           name={fromName}
//           value={fromValue}
//           max={today}
//           onChange={onChange}
//           onBlur={onBlur}
//           className="rf-input"
//         />
//         <input
//           type="date"
//           name={toName}
//           value={toValue}
//           min={fromValue || undefined}
//           max={today}
//           onChange={onChange}
//           onBlur={onBlur}
//           className="rf-input"
//         />
//       </div>
//       <div
//         className="rounded-lg px-3 py-2 inline-flex items-center gap-2"
//         style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
//       >
//         <span
//           className="text-[11px] font-extrabold tracking-wide"
//           style={{ color: OCHRE_DEEP }}
//         >
//           DURATION
//         </span>
//         <span className="rf-mono text-sm font-bold" style={{ color: INK }}>
//           {formatDuration(duration)}
//         </span>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    MAIN COMPONENT
// --------------------------------------------------------------- */
// export default function GovernmentRegistrationForm(): React.ReactElement {
//   const navigate = useNavigate();
//   const [data, setData] = useState<FormData>(initialData);
//   const [errors, setErrors] = useState<FormErrors>({});
//   const [touched, setTouched] = useState<FormTouched>({});
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [captchaCode, setCaptchaCode] = useState("");
//   const [activeSection, setActiveSection] = useState<SectionId>("personal");
//   const [isScrolled, setIsScrolled] = useState(false);
//   const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>(
//     {},
//   );
//   const observerRef = useRef<IntersectionObserver | null>(null);
//   const progressRef = useRef<HTMLDivElement>(null);

//   const [showOtp, setShowOtp] = useState(false);
//   const [submitError, setSubmitError] = useState("");

//   /* ---------- Set Password step (shown right after OTP verification succeeds) ---------- */
//   const [showSetPassword, setShowSetPassword] = useState(false);
//   const [spCode, setSpCode] = useState("");
//   const [spPassword, setSpPassword] = useState("");
//   const [spConfirmPassword, setSpConfirmPassword] = useState("");
//   const [spError, setSpError] = useState("");
//   const [spInfo, setSpInfo] = useState("");
//   const [spLoading, setSpLoading] = useState(false);
//   const [spSuccess, setSpSuccess] = useState(false);

//   // Generate a real captcha on mount instead of shipping a hardcoded one.
//   useEffect(() => {
//     setCaptchaCode(genCaptcha());
//   }, []);

//   // Handle scroll for sticky shadow
//   useEffect(() => {
//     const handleScroll = () => {
//       if (progressRef.current) {
//         const rect = progressRef.current.getBoundingClientRect();
//         setIsScrolled(rect.top < 0);
//       }
//     };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   /* ---------- age calculation (reuses the same duration helper as service/contractual periods) ---------- */
//   const age = useMemo<DurationParts | null>(() => {
//     if (!isRealDate(data.dobDay, data.dobMonth, data.dobYear)) return null;
//     const dobIso = `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`;
//     return calcDuration(dobIso, "2025-08-01"); // age as on 01-08-2025
//   }, [data.dobDay, data.dobMonth, data.dobYear]);

//   /* ---------- validation ---------- */
//   const validateField = useCallback(
//     (name: keyof FormData, value: string, all: FormData): string => {
//       switch (name) {
//         case "applicantName":
//           return value.trim() ? "" : "Applicant name is required";
//         case "gender":
//           return value ? "" : "Gender is required";
//         case "isBiharDomicile":
//           return value ? "" : "Domicile status is required";
//         case "category":
//           return value ? "" : "Category is required";
//         case "caste":
//           return value ? "" : "Caste is required";
//         case "isNonCreamyLayer":
//           return value ? "" : "Non-creamy layer status is required";
//         case "isPwD":
//           return value ? "" : "PWD status is required";
//         case "isMin40PercentPwD":
//           return value ? "" : "This field is required";
//         case "isExServiceman":
//           return value ? "" : "Ex-serviceman status is required";
//         case "serviceFromDate":
//         case "serviceToDate":
//           if (
//             all.isExServiceman === "YES" &&
//             (!all.serviceFromDate || !all.serviceToDate)
//           ) {
//             return "Service period is required for ex-servicemen";
//           }
//           return "";
//         case "isNccCadet":
//           return value ? "" : "NCC cadet status is required";
//         case "isBiharGovtEmployee":
//           return value ? "" : "This field is required";
//         case "bsscAttempts":
//           return value ? "" : "Number of attempts is required";
//         case "isContractualEmployee":
//           return value ? "" : "This field is required";
//         case "contractualFromDate":
//         case "contractualToDate":
//           if (
//             all.isContractualEmployee === "YES" &&
//             (!all.contractualFromDate || !all.contractualToDate)
//           ) {
//             return "Contractual service period is required";
//           }
//           return "";
//         case "mobileNo":
//           if (!value) return "Mobile number is required";
//           return /^[6-9]\d{9}$/.test(value)
//             ? ""
//             : "Enter a valid 10 digit number starting with 6-9";
//         case "confirmMobileNo":
//           if (!value) return "Please confirm your mobile number";
//           return value === all.mobileNo ? "" : "Mobile numbers do not match";
//         case "emailId":
//           if (!value) return "Email is required";
//           return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
//             ? ""
//             : "Enter a valid email address";
//         case "confirmEmailId":
//           if (!value) return "Please confirm your email";
//           return value === all.emailId ? "" : "Email addresses do not match";
//         case "dobDay":
//         case "dobMonth":
//         case "dobYear":
//           if (!all.dobDay || !all.dobMonth || !all.dobYear)
//             return "Complete date of birth is required";
//           return isRealDate(all.dobDay, all.dobMonth, all.dobYear)
//             ? ""
//             : "Enter a valid calendar date";
//         case "captchaInput":
//           if (!value) return "Captcha is required";
//           return value.toUpperCase() === captchaCode.toUpperCase()
//             ? ""
//             : "Captcha does not match";
//         default:
//           return "";
//       }
//     },
//     [captchaCode],
//   );

//   type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

//   const handleChange = (e: FieldEvent) => {
//     const { name, value } = e.target;
//     const fieldName = name as keyof FormData;
//     const digitsOnly =
//       name === "mobileNo" || name === "confirmMobileNo"
//         ? value.replace(/\D/g, "").slice(0, 10)
//         : value;
//     const next: FormData = { ...data, [fieldName]: digitsOnly };
//     setData(next);
//     if (touched[fieldName])
//       setErrors((prev) => ({
//         ...prev,
//         [fieldName]: validateField(fieldName, digitsOnly, next),
//       }));

//     // DOB fields are interdependent — once one is touched, re-validate the whole trio live
//     if (
//       ["dobDay", "dobMonth", "dobYear"].includes(name) &&
//       (touched.dobDay || touched.dobMonth || touched.dobYear)
//     ) {
//       const msg = validateField(fieldName, digitsOnly, next);
//       setErrors((prev) => ({
//         ...prev,
//         dobDay: msg,
//         dobMonth: msg,
//         dobYear: msg,
//       }));
//     }
//     // Service / contractual date pairs are interdependent the same way
//     if (
//       ["serviceFromDate", "serviceToDate"].includes(name) &&
//       (touched.serviceFromDate || touched.serviceToDate)
//     ) {
//       const msg = validateField(fieldName, digitsOnly, next);
//       setErrors((prev) => ({
//         ...prev,
//         serviceFromDate: msg,
//         serviceToDate: msg,
//       }));
//     }
//     if (
//       ["contractualFromDate", "contractualToDate"].includes(name) &&
//       (touched.contractualFromDate || touched.contractualToDate)
//     ) {
//       const msg = validateField(fieldName, digitsOnly, next);
//       setErrors((prev) => ({
//         ...prev,
//         contractualFromDate: msg,
//         contractualToDate: msg,
//       }));
//     }
//   };

//   const handleBlur = (
//     e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>,
//   ) => {
//     const { name, value } = e.target;
//     const fieldName = name as keyof FormData;
//     setTouched((prev) => ({ ...prev, [fieldName]: true }));
//     const msg = validateField(fieldName, value, data);
//     if (["dobDay", "dobMonth", "dobYear"].includes(name)) {
//       setTouched((prev) => ({
//         ...prev,
//         dobDay: true,
//         dobMonth: true,
//         dobYear: true,
//       }));
//       setErrors((prev) => ({
//         ...prev,
//         dobDay: msg,
//         dobMonth: msg,
//         dobYear: msg,
//       }));
//     } else if (["serviceFromDate", "serviceToDate"].includes(name)) {
//       setTouched((prev) => ({
//         ...prev,
//         serviceFromDate: true,
//         serviceToDate: true,
//       }));
//       setErrors((prev) => ({
//         ...prev,
//         serviceFromDate: msg,
//         serviceToDate: msg,
//       }));
//     } else if (["contractualFromDate", "contractualToDate"].includes(name)) {
//       setTouched((prev) => ({
//         ...prev,
//         contractualFromDate: true,
//         contractualToDate: true,
//       }));
//       setErrors((prev) => ({
//         ...prev,
//         contractualFromDate: msg,
//         contractualToDate: msg,
//       }));
//     } else {
//       setErrors((prev) => ({ ...prev, [fieldName]: msg }));
//     }
//   };

//   const refreshCaptcha = () => {
//     setCaptchaCode(genCaptcha());
//     setData((d) => ({ ...d, captchaInput: "" }));
//     setErrors((prev) => ({ ...prev, captchaInput: "" }));
//   };

//   /* ---------- completion tracking ---------- */
//   const sectionStatus = (id: SectionId) => {
//     const fields = REQUIRED_BY_SECTION[id];
//     const filled = fields.filter(
//       (f) => String(data[f] || "").trim() !== "",
//     ).length;
//     const hasErr = fields.some((f) => errors[f]);
//     return {
//       filled,
//       total: fields.length,
//       done: filled === fields.length && !hasErr,
//     };
//   };

//   const overallPct = useMemo(() => {
//     const all = Object.values(REQUIRED_BY_SECTION).flat();
//     const filled = all.filter(
//       (f) => String(data[f] || "").trim() !== "",
//     ).length;
//     return Math.round((filled / all.length) * 100);
//   }, [data]);

//   /* ---------- scroll-spy ---------- */
//   useEffect(() => {
//     observerRef.current = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           const section = (entry.target as HTMLElement).dataset.section as
//             | SectionId
//             | undefined;
//           if (entry.isIntersecting && section) setActiveSection(section);
//         });
//       },
//       { rootMargin: "-20% 0px -65% 0px", threshold: 0.1 },
//     );
//     Object.values(sectionRefs.current).forEach(
//       (el) => el && observerRef.current?.observe(el),
//     );
//     return () => observerRef.current?.disconnect();
//   }, []);

//   const scrollTo = (id: SectionId) => {
//     const target = sectionRefs.current[id];
//     if (target) {
//       const yOffset = -80; // Offset for sticky header
//       const y =
//         target.getBoundingClientRect().top + window.pageYOffset + yOffset;
//       window.scrollTo({ top: y, behavior: "smooth" });
//     }
//   };

//   // DateSelect handlers
//   const handleDateChange = (field: "day" | "month" | "year", value: string) => {
//     const fieldMap = { day: "dobDay", month: "dobMonth", year: "dobYear" };
//     const formField = fieldMap[field];
//     const next: FormData = { ...data, [formField]: value };
//     setData(next);
//     if (touched[formField]) {
//       const msg = validateField(formField, value, next);
//       setErrors((prev) => ({ ...prev, [formField]: msg }));
//     }
//     // Re-validate all DOB fields
//     if (touched.dobDay || touched.dobMonth || touched.dobYear) {
//       const msg = validateField("dobDay", next.dobDay, next);
//       setErrors((prev) => ({
//         ...prev,
//         dobDay: msg,
//         dobMonth: msg,
//         dobYear: msg,
//       }));
//     }
//   };

//   const handleDateBlur = (field: "day" | "month" | "year") => {
//     const fieldMap = { day: "dobDay", month: "dobMonth", year: "dobYear" };
//     const formField = fieldMap[field];
//     setTouched((prev) => ({
//       ...prev,
//       [formField]: true,
//       dobDay: true,
//       dobMonth: true,
//       dobYear: true,
//     }));
//     const msg = validateField("dobDay", data.dobDay, data);
//     setErrors((prev) => ({
//       ...prev,
//       dobDay: msg,
//       dobMonth: msg,
//       dobYear: msg,
//     }));
//   };

//   /* ---------- submit: create Cognito user, then ask for email OTP ---------- */
//   const handleSubmit = async () => {
//     const allFields = Object.values(REQUIRED_BY_SECTION).flat();
//     const newErrors: FormErrors = {};
//     allFields.forEach((f) => {
//       newErrors[f] = validateField(f, data[f], data);
//     });
//     setErrors(newErrors);
//     setTouched(
//       Object.fromEntries(allFields.map((f) => [f, true])) as FormTouched,
//     );

//     const firstErrorField = allFields.find((f) => newErrors[f]);
//     if (firstErrorField) {
//       const section = (
//         Object.entries(REQUIRED_BY_SECTION) as [SectionId, (keyof FormData)[]][]
//       ).find(([, fs]) => fs.includes(firstErrorField))?.[0];
//       if (section) scrollTo(section);
//       return;
//     }

//     setLoading(true);
//     setSubmitError("");
//     try {
//       // Sends all form fields to Cognito as user attributes (standard + custom)
//       // and triggers the built-in signUp verification email containing the code.
//       await sendOtp(data);
//       setShowOtp(true);
//     } catch (err: any) {
//       const code = err?.name || err?.code;
//       if (code === "UsernameExistsException") {
//         setSubmitError(
//           "An account with this email already exists. Please use a different email, or verify the code already sent to it.",
//         );
//       } else if (code === "SchemaMisconfiguredError") {
//         // Thrown by cognito.ts when a custom attribute is missing from the User Pool schema.
//         setSubmitError(err.message);
//       } else if (code === "InvalidPasswordException") {
//         setSubmitError(
//           "There was a problem creating the account. Please try again in a moment.",
//         );
//       } else {
//         setSubmitError(
//           err?.message || "Could not start registration. Please try again.",
//         );
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------- OTP modal callbacks ---------- */
//   const handleOtpVerify = async (otp: string) => {
//     await verifyOtp(data.emailId, otp);
//     console.log("Registration payload:", {
//       ...data,
//       dob: `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`,
//       age,
//     });
//     setShowOtp(false);

//     // Email is now verified, but the account still only has the random
//     // temporary password from sendOtp() that nobody knows. Immediately
//     // kick off Cognito's forgotPassword flow (no backend needed — this is
//     // a direct client SDK call) so the candidate can set a real password.
//     setSpError("");
//     setSpInfo("Sending you a verification code...");
//     setShowSetPassword(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     try {
//       await triggerSetPassword(data.emailId);
//       setSpInfo(
//         `We've sent a verification code to ${data.emailId}. Enter it below with your new password.`,
//       );
//     } catch (err: any) {
//       setSpError(
//         err?.message ||
//           "Could not send a verification code. Please try again.",
//       );
//     }
//   };

//   const handleOtpResend = async () => {
//     await resendOtp(data.emailId);
//   };

//   /* ---------- Set Password step callbacks ---------- */
//   const handleResendSetPasswordCode = async () => {
//     setSpError("");
//     try {
//       await triggerSetPassword(data.emailId);
//       setSpInfo(`A new verification code was sent to ${data.emailId}.`);
//     } catch (err: any) {
//       setSpError(err?.message || "Could not resend code. Please try again.");
//     }
//   };

//   const handleSetPasswordSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSpError("");

//     if (!spCode.trim()) {
//       setSpError("Please enter the verification code sent to your email.");
//       return;
//     }
//     if (spPassword.length < 8) {
//       setSpError("Password must be at least 8 characters.");
//       return;
//     }
//     if (spPassword !== spConfirmPassword) {
//       setSpError("Passwords do not match.");
//       return;
//     }

//     setSpLoading(true);
//     try {
//       await confirmSetPassword(data.emailId, spCode, spPassword);
//       setSpSuccess(true);
//       // Brief confirmation, then send the candidate to log in with their new password.
//       setTimeout(() => {
//         navigate("/login");
//       }, 1500);
//     } catch (err: any) {
//       const code = err?.name || err?.code;
//       if (code === "CodeMismatchException") {
//         setSpError("The verification code is incorrect. Please check and try again.");
//       } else if (code === "ExpiredCodeException") {
//         setSpError("This code has expired. Please request a new one.");
//       } else if (code === "InvalidPasswordException") {
//         setSpError(
//           err?.message ||
//             "Password does not meet requirements. Try a longer password with a mix of letters, numbers, and symbols.",
//         );
//       } else {
//         setSpError(err?.message || "Could not set password. Please try again.");
//       }
//     } finally {
//       setSpLoading(false);
//     }
//   };

//   const days = Array.from({ length: 31 }, (_, i) => i + 1);
//   const years = Array.from(
//     { length: 101 },
//     (_, i) => new Date().getFullYear() - i,
//   );

//   /* ---------------------------------------------------------------
//      SET PASSWORD STATE — shown right after OTP verification succeeds,
//      before the candidate is sent to /login
//   --------------------------------------------------------------- */
//   if (showSetPassword) {
//     return (
//       <div
//         className="rf-root min-h-screen flex items-center justify-center p-6"
//         style={{ background: PAPER }}
//       >
//         <style>{FONTS}</style>
//         <div
//           className="rf-pop max-w-md w-full bg-white rounded-2xl p-8 md:p-10 shadow-sm"
//           style={{ border: `1.5px solid ${LINE}` }}
//         >
//           {spSuccess ? (
//             <div className="text-center">
//               <div
//                 className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
//                 style={{ background: "#E8F3EF" }}
//               >
//                 <CheckCircle2 size={28} style={{ color: TEAL }} />
//               </div>
//               <div
//                 className="rf-display text-2xl font-semibold mb-2"
//                 style={{ color: INK }}
//               >
//                 Password set successfully
//               </div>
//               <p className="text-sm font-medium" style={{ color: INK_SOFT }}>
//                 Redirecting you to login...
//               </p>
//             </div>
//           ) : (
//             <>
//               <div
//                 className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
//                 style={{ background: "#EFEAE0" }}
//               >
//                 <Lock size={24} style={{ color: OCHRE_DEEP }} />
//               </div>
//               <div
//                 className="rf-display text-2xl font-semibold mb-2 text-center"
//                 style={{ color: INK }}
//               >
//                 Set Your Password
//               </div>
//               <p
//                 className="text-sm font-medium mb-6 text-center"
//                 style={{ color: INK_SOFT }}
//               >
//                 {spInfo}
//               </p>

//               {spError && (
//                 <div
//                   className="flex items-center gap-2 mb-4 text-[12.5px] font-bold rounded-lg px-3 py-2.5"
//                   style={{ color: DANGER, background: "#FBEAE6" }}
//                 >
//                   <AlertCircle size={14} className="shrink-0" /> {spError}
//                 </div>
//               )}

//               <form onSubmit={handleSetPasswordSubmit} className="space-y-5">
//                 <Field label="Verification code" hi="सत्यापन कोड" required>
//                   <div className="relative">
//                     <span
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2"
//                       style={{ color: INK_SOFT }}
//                     >
//                       <KeyRound size={16} />
//                     </span>
//                     <input
//                       type="text"
//                       value={spCode}
//                       onChange={(e) => setSpCode(e.target.value)}
//                       className="rf-input pl-10 rf-mono"
//                       placeholder="Enter the code emailed to you"
//                     />
//                   </div>
//                 </Field>

//                 <Field label="New password" hi="नया पासवर्ड" required>
//                   <div className="relative">
//                     <span
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2"
//                       style={{ color: INK_SOFT }}
//                     >
//                       <Lock size={16} />
//                     </span>
//                     <input
//                       type="password"
//                       value={spPassword}
//                       onChange={(e) => setSpPassword(e.target.value)}
//                       className="rf-input pl-10"
//                       placeholder="At least 8 characters"
//                     />
//                   </div>
//                 </Field>

//                 <Field label="Confirm password" hi="पासवर्ड की पुष्टि" required>
//                   <div className="relative">
//                     <span
//                       className="absolute left-3.5 top-1/2 -translate-y-1/2"
//                       style={{ color: INK_SOFT }}
//                     >
//                       <Lock size={16} />
//                     </span>
//                     <input
//                       type="password"
//                       value={spConfirmPassword}
//                       onChange={(e) => setSpConfirmPassword(e.target.value)}
//                       className="rf-input pl-10"
//                       placeholder="Re-enter password"
//                     />
//                   </div>
//                 </Field>

//                 <button
//                   type="submit"
//                   disabled={spLoading}
//                   className="w-full py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 transition-opacity"
//                   style={{ background: spLoading ? "#8B93A0" : INK }}
//                 >
//                   {spLoading ? (
//                     <>
//                       <Loader2 size={16} className="rf-spin" /> SETTING
//                       PASSWORD…
//                     </>
//                   ) : (
//                     "SET PASSWORD"
//                   )}
//                 </button>

//                 <button
//                   type="button"
//                   onClick={handleResendSetPasswordCode}
//                   className="w-full flex items-center justify-center gap-1.5 text-xs font-extrabold"
//                   style={{ color: OCHRE_DEEP }}
//                 >
//                   <RefreshCw size={13} /> RESEND CODE
//                 </button>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     );
//   }

//   /* ---------------------------------------------------------------
//      SUCCESS STATE (kept for safety / fallback — normal flow now goes
//      registration -> OTP -> Set Password -> /login above)
//   --------------------------------------------------------------- */
//   if (submitted) {
//     return (
//       <div
//         className="rf-root min-h-screen flex items-center justify-center p-6"
//         style={{ background: PAPER }}
//       >
//         <style>{FONTS}</style>
//         <div
//           className="rf-pop max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-sm"
//           style={{ border: `1.5px solid ${LINE}` }}
//         >
//           <div
//             className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
//             style={{ background: "#E8F3EF" }}
//           >
//             <PartyPopper size={28} style={{ color: TEAL }} />
//           </div>
//           <div
//             className="rf-display text-2xl font-semibold mb-2"
//             style={{ color: INK }}
//           >
//             Registration saved
//           </div>
//           <p className="text-sm font-medium mb-6" style={{ color: INK_SOFT }}>
//             Your details for{" "}
//             <span style={{ color: INK, fontWeight: 800 }}>
//               {data.applicantName || "the applicant"}
//             </span>{" "}
//             have been recorded and your email has been verified. A confirmation
//             has been sent to {data.emailId}.
//           </p>
//           <button
//             onClick={() => {
//               setSubmitted(false);
//               setData(initialData);
//               setErrors({});
//               setTouched({});
//               setShowOtp(false);
//               setSubmitError("");
//               setCaptchaCode(genCaptcha());
//             }}
//             className="px-6 py-2.5 rounded-full font-bold text-sm text-white"
//             style={{ background: INK }}
//           >
//             Start a new form
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="rf-root min-h-screen" style={{ background: PAPER }}>
//       <style>{FONTS}</style>

//       {/* HEADER */}
//       <div className="border-b" style={{ borderColor: LINE, background: CARD }}>
//         <div className="max-w-7xl mx-auto px-5 md:px-8 py-2.5 flex items-center justify-between">
//           <div>
//             <div
//               className="text-[11px] font-extrabold tracking-[0.18em] mb-1"
//               style={{ color: OCHRE_DEEP }}
//             >
//               BIHAR STAFF SELECTION COMMISSION
//             </div>
//             <div
//               className="rf-display text-2xl md:text-[24px] font-semibold"
//               style={{ color: INK }}
//             >
//               Candidate Registration
//             </div>
//             <div
//               className="text-[12px] font-medium mt-0.5"
//               style={{ color: INK_SOFT }}
//             >
//               अभ्यर्थी पंजीकरण फॉर्म
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STICKY PROGRESS BAR */}
//       <div
//         ref={progressRef}
//         className={`rf-sticky-progress ${isScrolled ? "scrolled" : ""}`}
//       >
//         <div>
//           {/* Mobile progress */}
//           <div className="md:hidden flex items-center gap-1 overflow-x-auto">
//             {SECTIONS.map((s, i) => {
//               const st = sectionStatus(s.id);
//               return (
//                 <button
//                   key={s.id}
//                   onClick={() => scrollTo(s.id)}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold"
//                   style={{
//                     background: activeSection === s.id ? INK : "#fff",
//                     color: activeSection === s.id ? "#fff" : INK_SOFT,
//                     border: `1.5px solid ${
//                       activeSection === s.id ? INK : LINE
//                     }`,
//                   }}
//                 >
//                   {st.done ? <CheckCircle2 size={13} /> : <span>{i + 1}</span>}{" "}
//                   {s.label}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-5 py-4 flex gap-10">
//         {/* DESKTOP RAIL */}
//         <div className="hidden md:block w-64 shrink-0">
//           <div className="sticky top-[90px]">
//             {SECTIONS.map((s, i) => {
//               const st = sectionStatus(s.id);
//               const Icon = s.icon;
//               const isLast = i === SECTIONS.length - 1;
//               const isActive = activeSection === s.id;
//               return (
//                 <div key={s.id} className="relative pb-8 pl-2">
//                   {!isLast && (
//                     <div className={`rf-rail-line ${st.done ? "done" : ""}`} />
//                   )}
//                   <button
//                     onClick={() => scrollTo(s.id)}
//                     className="flex items-start gap-3 text-left group w-full"
//                   >
//                     <div
//                       className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
//                       style={{
//                         background: st.done ? TEAL : isActive ? INK : "#fff",
//                         border: `2px solid ${
//                           st.done ? TEAL : isActive ? INK : LINE
//                         }`,
//                       }}
//                     >
//                       {st.done ? (
//                         <CheckCircle2 size={18} color="#fff" />
//                       ) : (
//                         <Icon size={16} color={isActive ? "#fff" : INK_SOFT} />
//                       )}
//                     </div>
//                     <div className="pt-1.5">
//                       <div
//                         className="text-[10.5px] font-extrabold rf-mono"
//                         style={{ color: OCHRE_DEEP }}
//                       >
//                         0{i + 1} · {st.filled}/{st.total}
//                       </div>
//                       <div
//                         className="text-[13px] font-extrabold leading-tight"
//                         style={{ color: isActive ? INK : "#374151" }}
//                       >
//                         {s.label}
//                       </div>
//                       <div
//                         className="text-[11px] font-medium"
//                         style={{ color: INK_SOFT }}
//                       >
//                         {s.hi}
//                       </div>
//                     </div>
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* MAIN CONTENT */}
//         <div className="flex-1 min-w-0 space-y-6">
//           {/* SECTION 1 — PERSONAL */}
//           <div
//             ref={(el) => {
//               sectionRefs.current.personal = el;
//             }}
//             data-section="personal"
//             className="rounded-2xl p-6 md:p-8"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div className="flex items-center gap-2 mb-6">
//               <User size={17} style={{ color: OCHRE }} />
//               <h2
//                 className="rf-display text-lg font-semibold"
//                 style={{ color: INK }}
//               >
//                 Personal &amp; Identity
//               </h2>
//             </div>

//             <Field
//               label="Name of applicant"
//               hi="आवेदक का नाम"
//               required
//               error={touched.applicantName && errors.applicantName}
//               note="Enter your name exactly as in your Matriculation / Secondary examination certificate. Do not use prefixes such as Mr. or Ms."
//             >
//               <input
//                 type="text"
//                 name="applicantName"
//                 value={data.applicantName}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`rf-input uppercase ${
//                   touched.applicantName && errors.applicantName
//                     ? "rf-error"
//                     : ""
//                 }`}
//                 placeholder="AS PER MATRICULATION CERTIFICATE"
//               />
//             </Field>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Gender"
//                 hi="लिंग"
//                 required
//                 error={touched.gender && errors.gender}
//                 note="A transgender candidate of Bihar-state domicile must apply under the BC category."
//               >
//                 <PillGroup
//                   name="gender"
//                   value={data.gender}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["MALE", "FEMALE", "TRANSGENDER"]}
//                 />
//               </Field>

//               <Field
//                 label="Domicile of Bihar state?"
//                 hi="बिहार राज्य का निवासी?"
//                 required
//                 error={touched.isBiharDomicile && errors.isBiharDomicile}
//               >
//                 <PillGroup
//                   name="isBiharDomicile"
//                   value={data.isBiharDomicile}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>
//             </div>

//             {/* Replaced with DateSelect component */}
//             <DateSelect
//               value={{
//                 day: data.dobDay,
//                 month: data.dobMonth,
//                 year: data.dobYear,
//               }}
//               onChange={handleDateChange}
//               onBlur={handleDateBlur}
//               errors={{
//                 day: touched.dobDay && errors.dobDay,
//                 month: touched.dobMonth && errors.dobMonth,
//                 year: touched.dobYear && errors.dobYear,
//               }}
//               touched={{
//                 day: touched.dobDay,
//                 month: touched.dobMonth,
//                 year: touched.dobYear,
//               }}
//               required={true}
//               label="Date of birth"
//               hi="जन्म तिथि"
//               note="As recorded in your Matriculation / 10th standard or equivalent certificate."
//               maxYear={new Date().getFullYear()}
//               minYear={1900}
//             />

//             <div
//               className="rounded-xl p-4 flex items-center justify-between"
//               style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
//             >
//               <div>
//                 <div
//                   className="text-[11px] font-extrabold tracking-wide"
//                   style={{ color: OCHRE_DEEP }}
//                 >
//                   AGE AS ON 01-08-2025
//                 </div>
//                 <div
//                   className="text-[11px] font-medium"
//                   style={{ color: INK_SOFT }}
//                 >
//                   दिनांक 01-08-2025 को आयु
//                 </div>
//               </div>
//               <div className="rf-mono text-lg font-bold" style={{ color: INK }}>
//                 {formatDuration(age)}
//               </div>
//             </div>
//           </div>

//           {/* SECTION 2 — CATEGORY */}
//           <div
//             ref={(el) => {
//               sectionRefs.current.category = el;
//             }}
//             data-section="category"
//             className="rounded-2xl p-6 md:p-8"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div className="flex items-center gap-2 mb-6">
//               <ShieldCheck size={17} style={{ color: OCHRE }} />
//               <h2
//                 className="rf-display text-lg font-semibold"
//                 style={{ color: INK }}
//               >
//                 Category &amp; Reservation
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Category"
//                 hi="श्रेणी"
//                 required
//                 error={touched.category && errors.category}
//               >
//                 <PillGroup
//                   name="category"
//                   value={data.category}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["UR", "SC", "ST", "EBC", "BC", "EWS"]}
//                 />
//               </Field>

//               <Field
//                 label="Caste"
//                 hi="जाति"
//                 required
//                 error={touched.caste && errors.caste}
//               >
//                 <SelectBox
//                   name="caste"
//                   value={data.caste}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.caste && errors.caste}
//                   className="max-w-xs"
//                 >
//                   <option value="">Select caste</option>
//                   <option value="GENERIC_CAST">Sample Caste Group</option>
//                 </SelectBox>
//               </Field>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Do you belong to non-creamy layer?"
//                 hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?"
//                 required
//                 error={touched.isNonCreamyLayer && errors.isNonCreamyLayer}
//               >
//                 <PillGroup
//                   name="isNonCreamyLayer"
//                   value={data.isNonCreamyLayer}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>

//               <Field
//                 label="Are you a person with disability?"
//                 hi="क्या आप दिव्यांगता (PWD) वाले व्यक्ति हैं?"
//                 required
//                 error={touched.isPwD && errors.isPwD}
//               >
//                 <PillGroup
//                   name="isPwD"
//                   value={data.isPwD}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field label="Nature of disability" hi="दिव्यांगता की प्रकृति">
//                 <PillGroup
//                   name="natureOfDisability"
//                   value={data.natureOfDisability}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["PERMANENT", "TEMPORARY"]}
//                 />
//               </Field>

//               <Field
//                 label="Are you a person with minimum 40% disability?"
//                 hi="क्या आप न्यूनतम 40% दिव्यांगता (PWD) वाले व्यक्ति हैं?"
//                 required
//                 error={touched.isMin40PercentPwD && errors.isMin40PercentPwD}
//               >
//                 <PillGroup
//                   name="isMin40PercentPwD"
//                   value={data.isMin40PercentPwD}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>
//             </div>
//           </div>

//           {/* SECTION 3 — SERVICE */}
//           <div
//             ref={(el) => {
//               sectionRefs.current.service = el;
//             }}
//             data-section="service"
//             className="rounded-2xl p-6 md:p-8"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div className="flex items-center gap-2 mb-6">
//               <Briefcase size={17} style={{ color: OCHRE }} />
//               <h2
//                 className="rf-display text-lg font-semibold"
//                 style={{ color: INK }}
//               >
//                 Service &amp; Employment
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Are you an ex-serviceman?"
//                 hi="क्या आप भूतपूर्व सैनिक हैं?"
//                 required
//                 error={touched.isExServiceman && errors.isExServiceman}
//               >
//                 <PillGroup
//                   name="isExServiceman"
//                   value={data.isExServiceman}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>

//               <Field
//                 label="Are you an NCC full-time cadet / instructor?"
//                 hi="क्या आप एनसीसी के पूर्णकालिक कैडेट/अनुदेशक हैं?"
//                 required
//                 error={touched.isNccCadet && errors.isNccCadet}
//               >
//                 <PillGroup
//                   name="isNccCadet"
//                   value={data.isNccCadet}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>
//             </div>

//             {data.isExServiceman === "YES" && (
//               <Field
//                 label="Service in defence — from / to date"
//                 hi="रक्षा में सेवा — दिनांक से/तक"
//                 error={touched.serviceFromDate && errors.serviceFromDate}
//                 note="Select the joining and release dates from your defence service record; the duration is calculated automatically."
//               >
//                 <DateRangeField
//                   fromName="serviceFromDate"
//                   toName="serviceToDate"
//                   fromValue={data.serviceFromDate}
//                   toValue={data.serviceToDate}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                 />
//               </Field>
//             )}

//             <Field
//               label="NCC 'C' certificate number"
//               hi="एनसीसी 'सी' प्रमाणपत्र संख्या"
//             >
//               <input
//                 type="text"
//                 name="nccCertificateNo"
//                 value={data.nccCertificateNo}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className="rf-input max-w-md"
//               />
//             </Field>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Are you a Bihar government employee with 3+ years continuous service?"
//                 hi="क्या आप बिहार सरकार के कर्मचारी हैं जिन्होंने कम से कम तीन साल नियमित सेवा की है?"
//                 required
//                 error={
//                   touched.isBiharGovtEmployee && errors.isBiharGovtEmployee
//                 }
//               >
//                 <PillGroup
//                   name="isBiharGovtEmployee"
//                   value={data.isBiharGovtEmployee}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>

//               <Field
//                 label="BSSC exam attempts after 12-12-2022"
//                 hi="दिनांक 12-12-2022 के बाद परीक्षाओं में प्रयासों की संख्या"
//                 required
//                 error={touched.bsscAttempts && errors.bsscAttempts}
//               >
//                 <SelectBox
//                   name="bsscAttempts"
//                   value={data.bsscAttempts}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   error={touched.bsscAttempts && errors.bsscAttempts}
//                   className="max-w-xs"
//                 >
//                   <option value="">Select</option>
//                   <option value="0">0</option>
//                   <option value="1">1</option>
//                   <option value="2">2</option>
//                   <option value="3">3</option>
//                 </SelectBox>
//               </Field>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Are you a contractual employee on a post from the advertisement?"
//                 hi="क्या आप विज्ञापन में उल्लिखित पदों में से किसी पद पर संविदा नियोजित कर्मी हैं?"
//                 required
//                 error={
//                   touched.isContractualEmployee && errors.isContractualEmployee
//                 }
//               >
//                 <PillGroup
//                   name="isContractualEmployee"
//                   value={data.isContractualEmployee}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   options={["YES", "NO"]}
//                 />
//               </Field>

//               {data.isContractualEmployee === "YES" && (
//                 <Field label="Name of post" hi="पद का नाम">
//                   <SelectBox
//                     name="nameOfPost"
//                     value={data.nameOfPost}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     className="max-w-xs"
//                   >
//                     <option value="">Select post</option>
//                   </SelectBox>
//                 </Field>
//               )}
//             </div>

//             {data.isContractualEmployee === "YES" && (
//               <>
//                 <Field
//                   label="Agreement under circular no. 1003, dated 22.01.2021 (GAD, Bihar)?"
//                   hi="क्या आपके पास संकल्प ज्ञापंक 1003, दिनांक 22.01.2021 के आलोक में एकरारनामा है?"
//                   note="Ensure you have a valid agreement copy and contractual experience certificate ready to upload, or you will not receive weightage."
//                 >
//                   <PillGroup
//                     name="hasAgreement"
//                     value={data.hasAgreement}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                     options={["YES", "NO"]}
//                   />
//                 </Field>

//                 <Field
//                   label="Contractual service period in Bihar government — from / to date"
//                   hi="उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि — दिनांक से/तक"
//                   error={
//                     touched.contractualFromDate && errors.contractualFromDate
//                   }
//                   note="Select the dates on which your contractual engagement began and ended (or the current date, if still ongoing); the duration is calculated automatically."
//                 >
//                   <DateRangeField
//                     fromName="contractualFromDate"
//                     toName="contractualToDate"
//                     fromValue={data.contractualFromDate}
//                     toValue={data.contractualToDate}
//                     onChange={handleChange}
//                     onBlur={handleBlur}
//                   />
//                 </Field>
//               </>
//             )}
//           </div>

//           {/* SECTION 4 — CONTACT */}
//           <div
//             ref={(el) => {
//               sectionRefs.current.contact = el;
//             }}
//             data-section="contact"
//             className="rounded-2xl p-6 md:p-8"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div className="flex items-center gap-2 mb-6">
//               <Phone size={17} style={{ color: OCHRE }} />
//               <h2
//                 className="rf-display text-lg font-semibold"
//                 style={{ color: INK }}
//               >
//                 Contact &amp; Verification
//               </h2>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Mobile number"
//                 hi="मोबाइल नम्बर"
//                 required
//                 error={touched.mobileNo && errors.mobileNo}
//                 note="Keep this number active to receive communication about the recruitment process."
//               >
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   name="mobileNo"
//                   value={data.mobileNo}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`rf-input rf-mono ${
//                     touched.mobileNo && errors.mobileNo ? "rf-error" : ""
//                   }`}
//                   placeholder="10 digit mobile number"
//                   maxLength={10}
//                 />
//               </Field>

//               <Field
//                 label="Confirm mobile number"
//                 hi="मोबाइल नंबर की पुष्टि"
//                 required
//                 error={touched.confirmMobileNo && errors.confirmMobileNo}
//               >
//                 <input
//                   type="text"
//                   inputMode="numeric"
//                   name="confirmMobileNo"
//                   value={data.confirmMobileNo}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`rf-input rf-mono ${
//                     touched.confirmMobileNo && errors.confirmMobileNo
//                       ? "rf-error"
//                       : ""
//                   }`}
//                   placeholder="Re-enter mobile number"
//                   maxLength={10}
//                 />
//               </Field>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <Field
//                 label="Email ID"
//                 hi="ईमेल आईडी"
//                 required
//                 error={touched.emailId && errors.emailId}
//                 note="Keep this email active to receive communication about the recruitment process."
//               >
//                 <input
//                   type="email"
//                   name="emailId"
//                   value={data.emailId}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`rf-input lowercase ${
//                     touched.emailId && errors.emailId ? "rf-error" : ""
//                   }`}
//                   placeholder="name@example.com"
//                 />
//               </Field>

//               <Field
//                 label="Confirm email ID"
//                 hi="ईमेल आईडी की पुष्टि"
//                 required
//                 error={touched.confirmEmailId && errors.confirmEmailId}
//               >
//                 <input
//                   type="email"
//                   name="confirmEmailId"
//                   value={data.confirmEmailId}
//                   onChange={handleChange}
//                   onBlur={handleBlur}
//                   className={`rf-input lowercase ${
//                     touched.confirmEmailId && errors.confirmEmailId
//                       ? "rf-error"
//                       : ""
//                   }`}
//                   placeholder="Re-enter email"
//                 />
//               </Field>
//             </div>

//             {/* CAPTCHA */}
//             <div
//               className="rounded-xl p-5 mt-2"
//               style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
//             >
//               <div
//                 className="text-[12px] font-extrabold tracking-wide mb-0.5"
//                 style={{ color: OCHRE_DEEP }}
//               >
//                 <span style={{ color: DANGER }}>* </span>ENTER CAPTCHA CODE
//               </div>
//               <div
//                 className="text-[11.5px] font-medium mb-3"
//                 style={{ color: INK_SOFT }}
//               >
//                 कैप्चा कोड दर्ज करें — नीचे दिखाया गया कोड टाइप करें
//               </div>
//               <div className="flex flex-wrap items-center gap-4">
//                 <div
//                   className="rf-mono text-2xl font-bold tracking-[0.3em] italic px-5 py-2 rounded-lg select-none"
//                   style={{ background: INK, color: "#fff" }}
//                 >
//                   {captchaCode}
//                 </div>
//                 <button
//                   type="button"
//                   onClick={refreshCaptcha}
//                   className="flex items-center gap-1.5 text-xs font-extrabold"
//                   style={{ color: OCHRE_DEEP }}
//                 >
//                   <RefreshCw size={14} /> REFRESH
//                 </button>
//               </div>
//               <input
//                 type="text"
//                 name="captchaInput"
//                 value={data.captchaInput}
//                 onChange={handleChange}
//                 onBlur={handleBlur}
//                 className={`rf-input rf-mono max-w-xs mt-4 ${
//                   touched.captchaInput && errors.captchaInput ? "rf-error" : ""
//                 }`}
//                 placeholder="Type the code above"
//               />
//               {touched.captchaInput && errors.captchaInput && (
//                 <div
//                   className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
//                   style={{ color: DANGER }}
//                 >
//                   <AlertCircle size={12} /> {errors.captchaInput}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* SUBMIT BAR */}
//           <div
//             className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div className="text-sm font-semibold" style={{ color: INK_SOFT }}>
//               {overallPct === 100
//                 ? "All required fields look complete."
//                 : `${overallPct}% of required fields completed`}
//             </div>
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="px-9 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[200px] transition-opacity"
//               style={{ background: loading ? "#8B93A0" : INK }}
//             >
//               {loading ? (
//                 <>
//                   <Loader2 size={16} className="rf-spin" /> PROCESSING…
//                 </>
//               ) : (
//                 "SAVE AND CONTINUE"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* OTP MODAL — triggered after Cognito signUp succeeds */}
//       <OTPVerificationModal
//         isOpen={showOtp}
//         onClose={() => setShowOtp(false)}
//         type="email"
//         emailOrMobile={data.emailId}
//         onVerify={handleOtpVerify}
//         onResend={handleOtpResend}
//       />

//       {/* ERROR TOAST for signUp failures (e.g. duplicate email, missing schema attribute) */}
//       {submitError && (
//         <div
//           className="rf-toast fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg flex items-start gap-2 z-50"
//           style={{ background: DANGER }}
//         >
//           <AlertCircle size={16} className="shrink-0 mt-0.5" />
//           <span>{submitError}</span>
//         </div>
//       )}
//     </div>
//   );
// }



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
} from "lucide-react";
import { sendOtp, verifyOtp, resendOtp, calcDuration } from "../auth/cognito";
import type { RegistrationFormData, DurationParts } from "../auth/cognito";
import OTPVerificationModal from "../components/common/OTPVerificationModal";
import DateSelect from "../components/common/DateSelect";
import {
  OFFICER_TYPE_OPTIONS,
  validateAgeEligibility,
  type OfficerType,
} from "../validation/ageEligibility";

const INK = "#12233F";
const INK_SOFT = "#5B6B84";
const PAPER = "#F4F5F2";
const CARD = "#FFFFFF";
const LINE = "#DBDFE6";
const OCHRE = "#B9722E";
const OCHRE_DEEP = "#8F5522";
const TEAL = "#1E6F5C";
const DANGER = "#B3432B";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  .rf-root, .rf-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
  .rf-display { font-family: 'Fraunces', serif; }
  .rf-mono { font-family: 'JetBrains Mono', monospace; }

  .rf-root input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
  .rf-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px; border: 1.5px solid ${LINE};
    background: #fff; cursor: pointer; font-weight: 700; font-size: 12.5px;
    color: ${INK}; transition: all .15s ease; user-select: none;
  }
  .rf-pill:hover { border-color: ${OCHRE}; }
  .rf-radio-input:checked + .rf-pill {
    background: ${INK}; border-color: ${INK}; color: #fff;
  }
  .rf-radio-input:focus-visible + .rf-pill { outline: 2px solid ${OCHRE}; outline-offset: 2px; }

  .rf-input, .rf-select {
    width: 100%; border: 1.5px solid ${LINE}; border-radius: 10px;
    padding: 11px 14px; font-size: 14px; font-weight: 600; color: ${INK};
    background: #fff; outline: none; transition: border-color .15s ease, box-shadow .15s ease;
  }
  .rf-input:focus, .rf-select:focus {
    border-color: ${OCHRE}; box-shadow: 0 0 0 3px rgba(185,114,46,0.15);
  }
  .rf-input.rf-error, .rf-select.rf-error { border-color: ${DANGER}; }
  .rf-input.rf-error:focus, .rf-select.rf-error:focus { box-shadow: 0 0 0 3px rgba(179,67,43,0.15); }
  .rf-input::placeholder { color: #A6AEBB; font-weight: 500; }

  .rf-rail-line { position: absolute; left: 19px; top: 40px; bottom: -8px; width: 2px; background: ${LINE}; }
  .rf-rail-line.done { background: ${TEAL}; }

  @keyframes rf-pop { 0% { transform: scale(.9); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .rf-pop { animation: rf-pop .35s cubic-bezier(.34,1.56,.64,1); }

  @keyframes rf-spin { to { transform: rotate(360deg); } }
  .rf-spin { animation: rf-spin .8s linear infinite; }

  @keyframes rf-toast-in { 0% { transform: translate(-50%, 12px); opacity: 0; } 100% { transform: translate(-50%, 0); opacity: 1; } }
  .rf-toast { animation: rf-toast-in .25s ease; }

  /* Sticky progress bar styles */
  .rf-sticky-progress {
    position: sticky;
    top: 0;
    z-index: 40;
    background: ${CARD};
    border-bottom: 1.5px solid ${LINE};
    transition: box-shadow 0.2s ease;
  }
  .rf-sticky-progress.scrolled {
    box-shadow: 0 2px 12px rgba(18, 35, 63, 0.08);
  }
`;

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

/** Full form state = everything sent to Cognito, plus UI-only confirmation/captcha fields. */
export interface FormData extends RegistrationFormData {
  confirmMobileNo: string;
  confirmEmailId: string;
  captchaInput: string;
  // Ex-serviceman officer category (Other Ranks / Commissioned Officer / ECO / SSCO)
  // — drives the R-2/R-3 vs R-4 age relaxation ground. See src/validation/ageEligibility.ts
  officerType: string;
  // Category certificate fields
  categoryCertNo: string;
  categoryIssueDateDay: string;
  categoryIssueDateMonth: string;
  categoryIssueDateYear: string;
  categoryAuthority: string;
  // Disability certificate fields
  disabilityCertNo: string;
  disabilityIssueDateDay: string;
  disabilityIssueDateMonth: string;
  disabilityIssueDateYear: string;
  disabilityAuthority: string;
  // Scribe fields
  isScribeRequired: string;
  // NCC working period
  nccWorkingFromDay: string;
  nccWorkingFromMonth: string;
  nccWorkingFromYear: string;
  nccWorkingToDay: string;
  nccWorkingToMonth: string;
  nccWorkingToYear: string;
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
  ],
  service: [
    "isExServiceman",
    "isNccCadet",
    "nccWorkingFromDay",
    "nccWorkingFromMonth",
    "nccWorkingFromYear",
    "nccWorkingToDay",
    "nccWorkingToMonth",
    "nccWorkingToYear",
    "isBiharGovtEmployee",
    "bsscAttempts",
    "isContractualEmployee",
  ],
  contact: [
    "mobileNo",
    "confirmMobileNo",
    "emailId",
    "confirmEmailId",
    "captchaInput",
  ],
};

/**
 * Fields that are conditionally required (depend on another field's value)
 * and therefore intentionally left OUT of REQUIRED_BY_SECTION above (which
 * drives the always-on completion counters). They are still fully validated
 * on submit — see handleSubmit.
 */
const CONDITIONAL_FIELDS: (keyof FormData)[] = [
  "serviceFromDate",
  "serviceToDate",
  "officerType",
  "contractualFromDate",
  "contractualToDate",
];

const initialData: FormData = {
  applicantName: "",
  gender: "",
  isBiharDomicile: "",
  category: "",
  caste: "",
  isNonCreamyLayer: "",
  isPwD: "",
  natureOfDisability: "",
  isMin40PercentPwD: "",
  isExServiceman: "",
  serviceFromDate: "",
  serviceToDate: "",
  officerType: "",
  isNccCadet: "",
  nccCertificateNo: "",
  nccWorkingFromDay: "",
  nccWorkingFromMonth: "",
  nccWorkingFromYear: "",
  nccWorkingToDay: "",
  nccWorkingToMonth: "",
  nccWorkingToYear: "",
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
  // Category certificate fields
  categoryCertNo: "",
  categoryIssueDateDay: "",
  categoryIssueDateMonth: "",
  categoryIssueDateYear: "",
  categoryAuthority: "",
  // Disability certificate fields
  disabilityCertNo: "",
  disabilityIssueDateDay: "",
  disabilityIssueDateMonth: "",
  disabilityIssueDateYear: "",
  disabilityAuthority: "",
  // Scribe fields
  isScribeRequired: "",
};

const genCaptcha = (): string => {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return s;
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

interface DateRangeFieldProps {
  fromName: keyof FormData;
  toName: keyof FormData;
  fromValue: string;
  toValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

/** Shared "From date / To date -> computed Y-M-D" widget used for service period and contractual period. */
const DateRangeField: React.FC<DateRangeFieldProps> = ({
  fromName,
  toName,
  fromValue,
  toValue,
  onChange,
  onBlur,
}) => {
  const today = new Date().toISOString().slice(0, 10);
  const duration = calcDuration(fromValue, toValue);
  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mb-3">
        <input
          type="date"
          name={fromName}
          value={fromValue}
          max={today}
          onChange={onChange}
          onBlur={onBlur}
          className="rf-input"
        />
        <input
          type="date"
          name={toName}
          value={toValue}
          min={fromValue || undefined}
          max={today}
          onChange={onChange}
          onBlur={onBlur}
          className="rf-input"
        />
      </div>
      <div
        className="rounded-lg px-3 py-2 inline-flex items-center gap-2"
        style={{ background: "#FAF6EF", border: `1px solid #ECD9BE` }}
      >
        <span
          className="text-[11px] font-extrabold tracking-wide"
          style={{ color: OCHRE_DEEP }}
        >
          DURATION
        </span>
        <span className="rf-mono text-sm font-bold" style={{ color: INK }}>
          {formatDuration(duration)}
        </span>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   MAIN COMPONENT
--------------------------------------------------------------- */
export default function GovernmentRegistrationForm(): React.ReactElement {
  const [data, setData] = useState<FormData>(initialData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<FormTouched>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [captchaCode, setCaptchaCode] = useState("");
  const [activeSection, setActiveSection] = useState<SectionId>("personal");
  const [isScrolled, setIsScrolled] = useState(false);
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>(
    {},
  );
  const observerRef = useRef<IntersectionObserver | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [showOtp, setShowOtp] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Generate a real captcha on mount instead of shipping a hardcoded one.
  useEffect(() => {
    setCaptchaCode(genCaptcha());
  }, []);

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
    return calcDuration(dobIso, "2025-08-01"); // age as on 01-08-2025
  }, [data.dobDay, data.dobMonth, data.dobYear]);

  /**
   * Full age-eligibility decision per the "Age Eligibility Validation Matrix"
   * (BSSC Adv. 05/25) — base age matrix, PwBD / ex-serviceman relaxations,
   * non-cumulation, and the carry-forward branch. Wired to the same pure
   * logic used by the zod schema in `src/validation/ageEligibility.ts`.
   */
  const ageEligibility = useMemo(() => {
    if (!isRealDate(data.dobDay, data.dobMonth, data.dobYear)) return null;
    if (!data.category || !data.gender) return null;
    const dobIso = `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`;
    return validateAgeEligibility({
      category: data.category as any,
      gender: data.gender as any,
      dobISO: dobIso,
      isPwbd: data.isPwD === "YES" && data.isMin40PercentPwD === "YES",
      isExServiceman: data.isExServiceman === "YES",
      officerType: (data.officerType || "") as OfficerType | "",
      serviceFromISO: data.serviceFromDate,
      serviceToISO: data.serviceToDate,
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
    data.serviceFromDate,
    data.serviceToDate,
    data.isBiharGovtEmployee,
  ]);

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
          if (!value) return "Category is required";
          if (
            all.gender === "TRANSGENDER" &&
            all.isBiharDomicile === "YES" &&
            value !== "BC"
          ) {
            return "Transgender candidates must apply under the BC category";
          }
          return "";
        case "caste":
          return value ? "" : "Caste is required";
        case "isNonCreamyLayer":
          return value ? "" : "Non-creamy layer status is required";
        case "isPwD":
          return value ? "" : "PWD status is required";
        case "isMin40PercentPwD":
          if (!value) return "This field is required";
          if (value === "YES" && all.isExServiceman === "YES") {
            return "Cannot claim PwBD (40%+ disability) relaxation together with ex-serviceman relaxation. Choose one.";
          }
          return "";
        case "isExServiceman":
          if (!value) return "Ex-serviceman status is required";
          if (
            value === "YES" &&
            all.isPwD === "YES" &&
            all.isMin40PercentPwD === "YES"
          ) {
            return "Cannot claim ex-serviceman relaxation together with PwBD (40%+ disability) relaxation. Choose one.";
          }
          return "";
        case "serviceFromDate":
        case "serviceToDate":
          if (
            all.isExServiceman === "YES" &&
            (!all.serviceFromDate || !all.serviceToDate)
          ) {
            return "Service period is required for ex-servicemen";
          }
          if (
            all.serviceFromDate &&
            all.serviceToDate &&
            new Date(all.serviceFromDate) > new Date(all.serviceToDate)
          ) {
            return "Service 'to' date must be on or after the 'from' date";
          }
          return "";
        case "officerType":
          if (all.isExServiceman === "YES" && !value) {
            return "Select the officer / ex-serviceman category (Other Ranks / Commissioned Officer / ECO / SSCO)";
          }
          return "";
        case "isNccCadet":
          return value ? "" : "NCC cadet status is required";
        case "nccWorkingFromDay":
        case "nccWorkingFromMonth":
        case "nccWorkingFromYear":
        case "nccWorkingToDay":
        case "nccWorkingToMonth":
        case "nccWorkingToYear":
          if (all.isNccCadet === "YES") {
            if (!all.nccWorkingFromDay || !all.nccWorkingFromMonth || !all.nccWorkingFromYear ||
                !all.nccWorkingToDay || !all.nccWorkingToMonth || !all.nccWorkingToYear) {
              return "Complete NCC working period is required";
            }
            // Validate that from date is before to date
            const fromDate = new Date(
              parseInt(all.nccWorkingFromYear),
              parseInt(all.nccWorkingFromMonth) - 1,
              parseInt(all.nccWorkingFromDay)
            );
            const toDate = new Date(
              parseInt(all.nccWorkingToYear),
              parseInt(all.nccWorkingToMonth) - 1,
              parseInt(all.nccWorkingToDay)
            );
            if (fromDate > toDate) {
              return "From date must be before to date";
            }
            return "";
          }
          return "";
        case "isBiharGovtEmployee":
          return value ? "" : "This field is required";
        case "bsscAttempts":
          return value ? "" : "Number of attempts is required";
        case "isContractualEmployee":
          return value ? "" : "This field is required";
        case "contractualFromDate":
        case "contractualToDate":
          if (
            all.isContractualEmployee === "YES" &&
            (!all.contractualFromDate || !all.contractualToDate)
          ) {
            return "Contractual service period is required";
          }
          return "";
        case "mobileNo":
          if (!value) return "Mobile number is required";
          return /^[6-9]\d{9}$/.test(value)
            ? ""
            : "Enter a valid 10 digit number starting with 6-9";
        case "confirmMobileNo":
          if (!value) return "Please confirm your mobile number";
          return value === all.mobileNo ? "" : "Mobile numbers do not match";
        case "emailId":
          if (!value) return "Email is required";
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
            ? ""
            : "Enter a valid email address";
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
        case "captchaInput":
          if (!value) return "Captcha is required";
          return value.toUpperCase() === captchaCode.toUpperCase()
            ? ""
            : "Captcha does not match";
        case "categoryCertNo":
        case "categoryIssueDateDay":
        case "categoryIssueDateMonth":
        case "categoryIssueDateYear":
        case "categoryAuthority":
          if (all.isBiharDomicile === "YES" && all.category !== "UR" && all.category !== "" && !all.categoryCertNo) {
            return "Certificate details are required for reserved categories";
          }
          return "";
        case "disabilityCertNo":
        case "disabilityIssueDateDay":
        case "disabilityIssueDateMonth":
        case "disabilityIssueDateYear":
        case "disabilityAuthority":
          if (all.isBiharDomicile === "YES" && all.isPwD === "YES" && !all.disabilityCertNo) {
            return "Disability certificate details are required";
          }
          return "";
        case "isScribeRequired":
          if (all.isBiharDomicile === "YES" && all.isPwD === "YES" && all.isMin40PercentPwD === "YES" && !value) {
            return "Please specify if scribe is required";
          }
          return "";
        default:
          return "";
      }
    },
    [captchaCode],
  );

  type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  const handleChange = (e: FieldEvent) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    const digitsOnly =
      name === "mobileNo" || name === "confirmMobileNo"
        ? value.replace(/\D/g, "").slice(0, 10)
        : value;
    
    // Create a copy of current data
    const next: FormData = { ...data, [fieldName]: digitsOnly };
    
    // If domicile is set to NO, auto-set category to UR and clear dependent fields
    if (name === "isBiharDomicile" && value === "NO") {
      next.category = "UR";
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
      next.isExServiceman = "";
      next.serviceFromDate = "";
      next.serviceToDate = "";
      next.officerType = "";
      next.isNccCadet = "";
      next.nccCertificateNo = "";
      next.nccWorkingFromDay = "";
      next.nccWorkingFromMonth = "";
      next.nccWorkingFromYear = "";
      next.nccWorkingToDay = "";
      next.nccWorkingToMonth = "";
      next.nccWorkingToYear = "";
      next.isBiharGovtEmployee = "";
      next.bsscAttempts = "";
      next.isContractualEmployee = "";
      next.nameOfPost = "";
      next.hasAgreement = "";
      next.contractualFromDate = "";
      next.contractualToDate = "";
    }
    
    // If domicile is set to YES, set category to empty (so user can select)
    if (name === "isBiharDomicile" && value === "YES") {
      next.category = "";
      // Don't clear other fields when switching to YES - let user fill them
    }

    // If ex-serviceman is set to NO, clear the dependent officer-type / service fields
    if (name === "isExServiceman" && value === "NO") {
      next.officerType = "";
      next.serviceFromDate = "";
      next.serviceToDate = "";
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
    // Service / contractual date pairs are interdependent the same way
    if (
      ["serviceFromDate", "serviceToDate"].includes(name) &&
      (touched.serviceFromDate || touched.serviceToDate)
    ) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({
        ...prev,
        serviceFromDate: msg,
        serviceToDate: msg,
      }));
    }
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

    // Non-cumulation guard (§4): isExServiceman <-> isMin40PercentPwD are mutually
    // exclusive relaxation grounds, so re-validate whichever one is already touched
    // whenever the other one changes.
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
    } else if (["serviceFromDate", "serviceToDate"].includes(name)) {
      setTouched((prev) => ({
        ...prev,
        serviceFromDate: true,
        serviceToDate: true,
      }));
      setErrors((prev) => ({
        ...prev,
        serviceFromDate: msg,
        serviceToDate: msg,
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
    setCaptchaCode(genCaptcha());
    setData((d) => ({ ...d, captchaInput: "" }));
    setErrors((prev) => ({ ...prev, captchaInput: "" }));
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

  const overallPct = useMemo(() => {
    const all = Object.values(REQUIRED_BY_SECTION).flat();
    const filled = all.filter(
      (f) => String(data[f] || "").trim() !== "",
    ).length;
    return Math.round((filled / all.length) * 100);
  }, [data]);

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

  // DateSelect handlers for Category Certificate Date
  const handleCategoryDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = { 
      day: "categoryIssueDateDay", 
      month: "categoryIssueDateMonth", 
      year: "categoryIssueDateYear" 
    };
    const formField = fieldMap[field];
    setData((prev) => ({ ...prev, [formField]: value }));
    if (touched[formField]) {
      const msg = validateField(formField, value, data);
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
    setData((prev) => ({ ...prev, [formField]: value }));
    if (touched[formField]) {
      const msg = validateField(formField, value, data);
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

  // DateSelect handlers for NCC Working Period - From Date
  const handleNccFromDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = { 
      day: "nccWorkingFromDay", 
      month: "nccWorkingFromMonth", 
      year: "nccWorkingFromYear" 
    };
    const formField = fieldMap[field];
    setData((prev) => ({ ...prev, [formField]: value }));
    if (touched[formField]) {
      const msg = validateField(formField, value, data);
      setErrors((prev) => ({ ...prev, [formField]: msg }));
    }
  };

  const handleNccFromDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = { 
      day: "nccWorkingFromDay", 
      month: "nccWorkingFromMonth", 
      year: "nccWorkingFromYear" 
    };
    const formField = fieldMap[field];
    setTouched((prev) => ({ ...prev, [formField]: true }));
    const msg = validateField(formField, data[formField], data);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  };

  // DateSelect handlers for NCC Working Period - To Date
  const handleNccToDateChange = (field: "day" | "month" | "year", value: string) => {
    const fieldMap = { 
      day: "nccWorkingToDay", 
      month: "nccWorkingToMonth", 
      year: "nccWorkingToYear" 
    };
    const formField = fieldMap[field];
    setData((prev) => ({ ...prev, [formField]: value }));
    if (touched[formField]) {
      const msg = validateField(formField, value, data);
      setErrors((prev) => ({ ...prev, [formField]: msg }));
    }
  };

  const handleNccToDateBlur = (field: "day" | "month" | "year") => {
    const fieldMap = { 
      day: "nccWorkingToDay", 
      month: "nccWorkingToMonth", 
      year: "nccWorkingToYear" 
    };
    const formField = fieldMap[field];
    setTouched((prev) => ({ ...prev, [formField]: true }));
    const msg = validateField(formField, data[formField], data);
    setErrors((prev) => ({ ...prev, [formField]: msg }));
  };

  /* ---------- submit: create Cognito user, then ask for email OTP ---------- */
  const handleSubmit = async () => {
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

    const firstErrorField = fieldsToValidate.find((f) => newErrors[f]);
    if (firstErrorField) {
      const section =
        (
          Object.entries(REQUIRED_BY_SECTION) as [SectionId, (keyof FormData)[]][]
        ).find(([, fs]) => fs.includes(firstErrorField))?.[0] ?? "service"; // all CONDITIONAL_FIELDS live in the Service & Employment section
      scrollTo(section as SectionId);
      return;
    }

    // Age eligibility gate — Age Eligibility Validation Matrix, BSSC Adv. 05/25.
    if (ageEligibility && !ageEligibility.ok) {
      setSubmitError(ageEligibility.message);
      scrollTo("personal");
      return;
    }

    setLoading(true);
    setSubmitError("");
    try {
      // Sends all form fields to Cognito as user attributes (standard + custom)
      // and triggers the built-in signUp verification email containing the code.
      await sendOtp(data);
      setShowOtp(true);
    } catch (err: any) {
      const code = err?.name || err?.code;
      if (code === "UsernameExistsException") {
        setSubmitError(
          "An account with this email already exists. Please use a different email, or verify the code already sent to it.",
        );
      } else if (code === "SchemaMisconfiguredError") {
        // Thrown by cognito.ts when a custom attribute is missing from the User Pool schema.
        setSubmitError(err.message);
      } else if (code === "InvalidPasswordException") {
        setSubmitError(
          "There was a problem creating the account. Please try again in a moment.",
        );
      } else {
        setSubmitError(
          err?.message || "Could not start registration. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP modal callbacks ---------- */
  const handleOtpVerify = async (otp: string) => {
    await verifyOtp(data.emailId, otp);
    console.log("Registration payload:", {
      ...data,
      dob: `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`,
      age,
      ageEligibility,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOtpResend = async () => {
    await resendOtp(data.emailId);
  };

  // Check if category requires certificate
  const showCategoryCert = data.isBiharDomicile === "YES" && data.category && data.category !== "UR";

  // Check if disability certificate is required
  const showDisabilityCert = data.isBiharDomicile === "YES" && data.isPwD === "YES";

  // Check if scribe field should show
  const showScribeField = data.isBiharDomicile === "YES" && data.isPwD === "YES" && data.isMin40PercentPwD === "YES";

  // Check if category section fields should be shown (show by default when domicile is empty or YES)
  const showCategoryFields = data.isBiharDomicile === "YES" || data.isBiharDomicile === "";

  // Check if service section should be shown (show by default when domicile is empty or YES)
  const showServiceSection = data.isBiharDomicile === "YES" || data.isBiharDomicile === "";

  // Check if category is disabled (only when domicile is explicitly NO)
  const isCategoryDisabled = data.isBiharDomicile === "NO";

  // Check if caste should be disabled (false - never disable caste)
  const isCasteDisabled = false;

  // Calculate NCC duration
  const nccDuration = useMemo<DurationParts | null>(() => {
    if (!data.nccWorkingFromDay || !data.nccWorkingFromMonth || !data.nccWorkingFromYear ||
        !data.nccWorkingToDay || !data.nccWorkingToMonth || !data.nccWorkingToYear) {
      return null;
    }
    const fromIso = `${data.nccWorkingFromYear}-${pad2(data.nccWorkingFromMonth)}-${pad2(data.nccWorkingFromDay)}`;
    const toIso = `${data.nccWorkingToYear}-${pad2(data.nccWorkingToMonth)}-${pad2(data.nccWorkingToDay)}`;
    return calcDuration(fromIso, toIso);
  }, [data.nccWorkingFromDay, data.nccWorkingFromMonth, data.nccWorkingFromYear, 
      data.nccWorkingToDay, data.nccWorkingToMonth, data.nccWorkingToYear]);

  /* ---------------------------------------------------------------
     SUCCESS STATE
  --------------------------------------------------------------- */
  if (submitted) {
    return (
      <div
        className="rf-root min-h-screen flex items-center justify-center p-6"
        style={{ background: PAPER }}
      >
        <style>{FONTS}</style>
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
            Registration saved
          </div>
          <p className="text-sm font-medium mb-6" style={{ color: INK_SOFT }}>
            Your details for{" "}
            <span style={{ color: INK, fontWeight: 800 }}>
              {data.applicantName || "the applicant"}
            </span>{" "}
            have been recorded and your email has been verified. A confirmation
            has been sent to {data.emailId}.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setData(initialData);
              setErrors({});
              setTouched({});
              setShowOtp(false);
              setSubmitError("");
              setCaptchaCode(genCaptcha());
            }}
            className="px-6 py-2.5 rounded-full font-bold text-sm text-white"
            style={{ background: INK }}
          >
            Start a new form
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rf-root min-h-screen" style={{ background: PAPER }}>
      <style>{FONTS}</style>

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
              note="Enter your name exactly as in your Matriculation / Secondary examination certificate. Do not use prefixes such as Mr. or Ms."
            >
              <input
                type="text"
                name="applicantName"
                value={data.applicantName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`rf-input uppercase ${
                  touched.applicantName && errors.applicantName
                    ? "rf-error"
                    : ""
                }`}
                placeholder="AS PER MATRICULATION CERTIFICATE"
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                hi="बिहार राज्य का निवासी?"
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
            </div>

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
              note="As recorded in your Matriculation / 10th standard or equivalent certificate."
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
                      ` Applicable maximum age: ${ageEligibility.effectiveMaxAge} years (as on 01-08-2025).`}
                  </div>
                </div>
              </div>
            )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field
                label="Category"
                hi="श्रेणी"
                required
                error={touched.category && errors.category}
              >
                <PillGroup
                  name="category"
                  value={data.category}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={["UR", "SC", "ST", "EBC", "BC", "EWS"]}
                  disabled={isCategoryDisabled}
                />
                {isCategoryDisabled && (
                  <div className="text-[11px] font-medium mt-1" style={{ color: INK_SOFT }}>
                    Category is auto-set to UR for non-Bihar domicile candidates
                  </div>
                )}
              </Field>

              <Field
                label="Caste"
                hi="जाति"
                required
                error={touched.caste && errors.caste}
              >
                <SelectBox
                  name="caste"
                  value={data.caste}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.caste && errors.caste}
                  className="max-w-xs"
                  disabled={isCasteDisabled}
                >
                  <option value="">Select caste</option>
                  <option value="GENERIC_CAST">Sample Caste Group</option>
                </SelectBox>
              </Field>
            </div>

            {/* Category Certificate - Only show when domicile is YES and category is not UR */}
            {showCategoryCert && (
              <div className="mt-4 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
                  Category Certificate Details · श्रेणी प्रमाणपत्र विवरण
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Field
                    label="Certificate number"
                    hi="प्रमाणपत्र संख्या"
                    required
                    error={touched.categoryCertNo && errors.categoryCertNo}
                  >
                    <input
                      type="text"
                      name="categoryCertNo"
                      value={data.categoryCertNo || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`rf-input ${touched.categoryCertNo && errors.categoryCertNo ? "rf-error" : ""}`}
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
                    <input
                      type="text"
                      name="categoryAuthority"
                      value={data.categoryAuthority || ""}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`rf-input ${touched.categoryAuthority && errors.categoryAuthority ? "rf-error" : ""}`}
                      placeholder="Enter issuing authority"
                    />
                  </Field>
                </div>
              </div>
            )}

            {/* These fields are hidden only when domicile is explicitly NO */}
            {showCategoryFields && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Field label="Type of disability" hi="दिव्यांगता का प्रकार">
                    <SelectBox
                      name="natureOfDisability"
                      value={data.natureOfDisability}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="max-w-xs"
                    >
                      <option value="">Select disability type</option>
                      <option value="VISUAL">Visual Disability (दृष्टि दिव्यांग)</option>
                      <option value="HEARING">Hearing Disability (मूक बधिर दिव्यांग)</option>
                      <option value="LOCOMOTOR">Locomotor Disability (चलन्त दिव्यांग)</option>
                      <option value="MENTAL">Mental/Multiple Disabilities (मनोविकार दिव्यांग / बहु दिव्यांग)</option>
                    </SelectBox>
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

                {showDisabilityCert && (
                  <div className="mt-4 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
                    <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
                      Disability Certificate Details · दिव्यांगता प्रमाणपत्र विवरण
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                          className={`rf-input ${touched.disabilityCertNo && errors.disabilityCertNo ? "rf-error" : ""}`}
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
                        <input
                          type="text"
                          name="disabilityAuthority"
                          value={data.disabilityAuthority || ""}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`rf-input ${touched.disabilityAuthority && errors.disabilityAuthority ? "rf-error" : ""}`}
                          placeholder="Enter issuing authority"
                        />
                      </Field>
                    </div>
                  </div>
                )}

                {showScribeField && (
                  <Field
                    label="Is scribe required?"
                    hi="क्या लेखक (स्क्राइब) की आवश्यकता है?"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <Field
                  label="Are you an NCC full-time cadet / instructor?"
                  hi="क्या आप एनसीसी के पूर्णकालिक कैडेट/अनुदेशक हैं?"
                  required
                  error={touched.isNccCadet && errors.isNccCadet}
                >
                  <PillGroup
                    name="isNccCadet"
                    value={data.isNccCadet}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    options={["YES", "NO"]}
                  />
                </Field>
              </div>

              {data.isExServiceman === "YES" && (
                <Field
                  label="Type of officer / ex-serviceman category"
                  hi="अधिकारी / भूतपूर्व सैनिक की श्रेणी"
                  required
                  error={touched.officerType && errors.officerType}
                  note="Commissioned Officer / ECO / SSCO receive a flat +5 year age relaxation (an alternative to, not stacked with, the standard ex-serviceman relaxation). Other Ranks (JCO/OR) receive +3 years plus the actual defence service period; SC/ST candidates get a further +5 years. All ex-serviceman relaxations are capped so that age does not exceed 53 years at the time of application."
                >
                  <SelectBox
                    name="officerType"
                    value={data.officerType || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.officerType && errors.officerType}
                    className="max-w-md"
                  >
                    <option value="">Select category</option>
                    {OFFICER_TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </SelectBox>
                </Field>
              )}

              {data.isExServiceman === "YES" && (
                <Field
                  label="Service in defence — from / to date"
                  hi="रक्षा में सेवा — दिनांक से/तक"
                  required
                  error={touched.serviceFromDate && errors.serviceFromDate}
                  note="Select the joining and release dates from your defence service record; the duration is calculated automatically and used to compute your ex-serviceman age relaxation."
                >
                  <DateRangeField
                    fromName="serviceFromDate"
                    toName="serviceToDate"
                    fromValue={data.serviceFromDate}
                    toValue={data.serviceToDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </Field>
              )}

              {data.isNccCadet === "YES" && (
                <>
                  <Field
                    label="NCC 'C' certificate number"
                    hi="एनसीसी 'सी' प्रमाणपत्र संख्या"
                  >
                    <input
                      type="text"
                      name="nccCertificateNo"
                      value={data.nccCertificateNo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="rf-input max-w-md"
                    />
                  </Field>

                  <Field
                    label="NCC working period — from / to date"
                    hi="एनसीसी कार्य अवधि — दिनांक से/तक"
                    required
                    error={touched.nccWorkingFromDay && errors.nccWorkingFromDay}
                    note="Select the dates of your NCC service period; the duration is calculated automatically."
                  >
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <DateSelect
                          value={{
                            day: data.nccWorkingFromDay || "",
                            month: data.nccWorkingFromMonth || "",
                            year: data.nccWorkingFromYear || "",
                          }}
                          onChange={handleNccFromDateChange}
                          onBlur={handleNccFromDateBlur}
                          errors={{
                            day: touched.nccWorkingFromDay && errors.nccWorkingFromDay,
                            month: touched.nccWorkingFromMonth && errors.nccWorkingFromMonth,
                            year: touched.nccWorkingFromYear && errors.nccWorkingFromYear,
                          }}
                          touched={{
                            day: touched.nccWorkingFromDay,
                            month: touched.nccWorkingFromMonth,
                            year: touched.nccWorkingFromYear,
                          }}
                          required={true}
                          label="From Date"
                          hi="दिनांक से"
                          maxYear={new Date().getFullYear()}
                          minYear={1900}
                        />
                        <DateSelect
                          value={{
                            day: data.nccWorkingToDay || "",
                            month: data.nccWorkingToMonth || "",
                            year: data.nccWorkingToYear || "",
                          }}
                          onChange={handleNccToDateChange}
                          onBlur={handleNccToDateBlur}
                          errors={{
                            day: touched.nccWorkingToDay && errors.nccWorkingToDay,
                            month: touched.nccWorkingToMonth && errors.nccWorkingToMonth,
                            year: touched.nccWorkingToYear && errors.nccWorkingToYear,
                          }}
                          touched={{
                            day: touched.nccWorkingToDay,
                            month: touched.nccWorkingToMonth,
                            year: touched.nccWorkingToYear,
                          }}
                          required={true}
                          label="To Date"
                          hi="दिनांक तक"
                          maxYear={new Date().getFullYear()}
                          minYear={1900}
                        />
                      </div>
                      {nccDuration && (
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
                            {formatDuration(nccDuration)}
                          </span>
                        </div>
                      )}
                    </div>
                  </Field>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Are you a Bihar government employee with 3+ years continuous service?"
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
                    <option value="">Select</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                  </SelectBox>
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Field
                  label="Are you a contractual employee on a post from the advertisement?"
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

                {data.isContractualEmployee === "YES" && (
                  <Field label="Name of post" hi="पद का नाम">
                    <SelectBox
                      name="nameOfPost"
                      value={data.nameOfPost}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="max-w-xs"
                    >
                      <option value="">Select post</option>
                    </SelectBox>
                  </Field>
                )}
              </div>

              {data.isContractualEmployee === "YES" && (
                <>
                  <Field
                    label="Agreement under circular no. 1003, dated 22.01.2021 (GAD, Bihar)?"
                    hi="क्या आपके पास संकल्प ज्ञापंक 1003, दिनांक 22.01.2021 के आलोक में एकरारनामा है?"
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

                  <Field
                    label="Contractual service period in Bihar government — from / to date"
                    hi="उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि — दिनांक से/तक"
                    error={
                      touched.contractualFromDate && errors.contractualFromDate
                    }
                    note="Select the dates on which your contractual engagement began and ended (or the current date, if still ongoing); the duration is calculated automatically."
                  >
                    <DateRangeField
                      fromName="contractualFromDate"
                      toName="contractualToDate"
                      fromValue={data.contractualFromDate}
                      toValue={data.contractualToDate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Field>
                </>
              )}
            </div>
          )}

          {/* SECTION 4 — CONTACT */}
          <div
            ref={(el) => {
              sectionRefs.current.contact = el;
            }}
            data-section="contact"
            className="rounded-2xl p-6 md:p-8"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Phone size={17} style={{ color: OCHRE }} />
              <h2
                className="rf-display text-lg font-semibold"
                style={{ color: INK }}
              >
                Contact &amp; Verification
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
                  className={`rf-input lowercase ${
                    touched.confirmEmailId && errors.confirmEmailId
                      ? "rf-error"
                      : ""
                  }`}
                  placeholder="Re-enter email"
                />
              </Field>
            </div>

            {/* CAPTCHA */}
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
                  className="rf-mono text-2xl font-bold tracking-[0.3em] italic px-5 py-2 rounded-lg select-none"
                  style={{ background: INK, color: "#fff" }}
                >
                  {captchaCode}
                </div>
                <button
                  type="button"
                  onClick={refreshCaptcha}
                  className="flex items-center gap-1.5 text-xs font-extrabold"
                  style={{ color: OCHRE_DEEP }}
                >
                  <RefreshCw size={14} /> REFRESH
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
              />
              {touched.captchaInput && errors.captchaInput && (
                <div
                  className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold"
                  style={{ color: DANGER }}
                >
                  <AlertCircle size={12} /> {errors.captchaInput}
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BAR */}
          <div
            className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div className="text-sm font-semibold" style={{ color: INK_SOFT }}>
              {overallPct === 100
                ? "All required fields look complete."
                : `${overallPct}% of required fields completed`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-9 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[200px] transition-opacity"
              style={{ background: loading ? "#8B93A0" : INK }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="rf-spin" /> PROCESSING…
                </>
              ) : (
                "SAVE AND CONTINUE"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* OTP MODAL — triggered after Cognito signUp succeeds */}
      <OTPVerificationModal
        isOpen={showOtp}
        onClose={() => setShowOtp(false)}
        type="email"
        emailOrMobile={data.emailId}
        onVerify={handleOtpVerify}
        onResend={handleOtpResend}
      />

      {/* ERROR TOAST for signUp failures (e.g. duplicate email, missing schema attribute) */}
      {submitError && (
        <div
          className="rf-toast fixed bottom-6 left-1/2 -translate-x-1/2 max-w-md px-5 py-3 rounded-xl text-sm font-bold text-white shadow-lg flex items-start gap-2 z-50"
          style={{ background: DANGER }}
        >
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          <span>{submitError}</span>
        </div>
      )}
    </div>
  );
}
