import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import type { ChangeEvent } from "react";
import {
  User,
  CreditCard,
  GraduationCap,
  Upload,
  Camera,
  ClipboardCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  RotateCcw,
  Download,
  LogOut,
  Eye,
  Loader2,
  ShieldCheck,
  Briefcase,
  RefreshCw,
} from "lucide-react";
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useFaceLiveness } from "../hooks/useFaceLiveness";
import api from "../api/interceptor"; // Adjust the relative path if your interceptor is in another folder (e.g., "../api/interceptor")
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Added local interface to handle the new exact dimension requirements 
interface LocalUploadConfig {
  field: string;
  label: string;
  hi: string;
  spec: string;
  maxKB: number;
  height: number;
  minWidth: number;
  minHeight: number;
  isPdf?: boolean;
  accept?: string;
}

import type {
  PersonalData,
  PaymentData,
  EducationData,
  PhotoData,
  LivePhotoData,
  FormData,
  Step1Props,
  Step2Props,
  Step3Props,
  Step4Props,
  Step5Props,
  Step6Props,
  FieldProps,
  PillGroupProps,
  SectionTitleProps,
  NoteProps,
  AddressFieldsProps,
  CertNumberDateAuthorityProps,
  EducationBlockProps,
  Step,
  Candidate,
} from "../types/application";

// ── Reused exactly as in GovernmentRegistrationForm — same API module,
//    same age-eligibility engine, same DateSelect + Cognito duration helper.
import {
  fetchCategoriesApi,
  fetchDisabilitiesApi,
  type Category,
  type Disability,
} from "../api/registrationApi";
import {
  validateAgeEligibility,
  mapCategoryLabelToCode,
  type OfficerType,
  type Category as CategoryCode,
} from "../validation/ageEligibility";
import { calcDuration } from "../auth/cognito";
import type { DurationParts } from "../auth/cognito";
import DateSelect from "../components/common/DateSelect";

// ── Application-wizard API integration — single consolidated API file
//    (countries/states/districts, step bootstrap, step 1-5 saves,
//    payment probe, final submit) + the step0 -> step1 auto-fill mapper.
import {
  applicationApi,
  paymentApi,
  locationApi,
  type ApplicationStepsResponse,
  type Country,
  type StateItem,
  type DistrictItem,
} from "../api/applicationFormApi";
import { mapStep0ToStep1 } from "../api/step0ToStep1Mapper";
import { useNavigate } from "react-router-dom";

/* ---------------------------------------------------------------
   TOKENS — matches the Candidate Registration page design system
--------------------------------------------------------------- */
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
  .gf-root, .gf-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
  .gf-display { font-family: 'Fraunces', serif; }
  .gf-mono { font-family: 'JetBrains Mono', monospace; }

  .gf-root input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
  .gf-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px; border: 1.5px solid ${LINE};
    background: #fff; cursor: pointer; font-weight: 700; font-size: 12.5px;
    color: ${INK}; transition: all .15s ease; user-select: none;
  }
  .gf-pill:hover { border-color: ${OCHRE}; }
  .gf-radio-input:checked + .gf-pill { background: ${INK}; border-color: ${INK}; color: #fff; }
  .gf-radio-input:focus-visible + .gf-pill { outline: 2px solid ${OCHRE}; outline-offset: 2px; }

  .gf-input, .gf-select {
    width: 100%; border: 1.5px solid ${LINE}; border-radius: 10px;
    padding: 10px 13px; font-size: 13.5px; font-weight: 600; color: ${INK};
    background: #fff; outline: none; transition: border-color .15s ease, box-shadow .15s ease;
  }
  .gf-input:disabled, .gf-select:disabled { background: #F1F2F4; color: ${INK_SOFT}; cursor: not-allowed; }
  .gf-input:focus, .gf-select:focus { border-color: ${OCHRE}; box-shadow: 0 0 0 3px rgba(185,114,46,0.15); }
  .gf-input.gf-error, .gf-select.gf-error { border-color: ${DANGER}; }
  .gf-input::placeholder { color: #A6AEBB; font-weight: 500; }

  .gf-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 26px; border-radius: 999px; font-weight: 800; font-size: 13px;
    background: ${INK}; color: #fff; border: none; cursor: pointer; transition: opacity .15s ease;
  }
  .gf-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .gf-btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 24px; border-radius: 999px; font-weight: 800; font-size: 13px;
    background: #fff; color: ${INK}; border: 1.5px solid ${LINE}; cursor: pointer;
  }
  .gf-btn-secondary:hover { border-color: ${OCHRE_DEEP}; }

  @keyframes gf-pop { 0% { transform: scale(.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .gf-pop { animation: gf-pop .35s cubic-bezier(.34,1.56,.64,1); }
  @keyframes gf-spin { to { transform: rotate(360deg); } }
  .gf-spin { animation: gf-spin .8s linear infinite; }
`;

const MOCK_CANDIDATE: Candidate = {
  registrationNo: "5250000005",
  name: "NANCY KUMARI GUPTA",
};

const STEPS: Step[] = [
  { id: 1, en: "Personal Details", hi: "व्यक्तिगत विवरण", icon: User },
  { id: 2, en: "Payment", hi: "भुगतान", icon: CreditCard },
  { id: 3, en: "Education", hi: "शैक्षणिक विवरण", icon: GraduationCap },
  { id: 4, en: "Photo Upload", hi: "फोटो अपलोड", icon: Upload },
  { id: 5, en: "Live Photo", hi: "लाइव फोटो", icon: Camera },
  {
    id: 6,
    en: "Review & Submit",
    hi: "समीक्षा और जमा करें",
    icon: ClipboardCheck,
  },
];

const YES_NO = ["YES", "NO"];
const YES_NO_NA = ["YES", "NO"];

/* ---------------------------------------------------------------
   TOAST HELPERS — single place so every step shows errors the same
   way. `toast.error` is used for validation / mandatory-field
   failures, `toast.success` for save confirmations.
--------------------------------------------------------------- */
const notifyError = (message: string) => {
  toast.error(message, { toastId: message });
};
const notifySuccess = (message: string) => {
  toast.success(message);
};

/* ---------------------------------------------------------------
   SHARED UI PRIMITIVES  (unchanged — used by every step)
--------------------------------------------------------------- */
const Field: React.FC<FieldProps> = ({
  label,
  hi,
  required,
  error,
  children,
}) => (
  <div className="mb-5">
    <div className="mb-1.5">
      <div
        className="text-[14px] font-extrabold tracking-wide"
        style={{ color: INK }}
      >
        {required && <span style={{ color: DANGER }}>* </span>}
        {label}
      </div>
      {hi && (
        <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>
          {hi}
        </div>
      )}
    </div>
    {children}
    {error && (
      <div
        className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
        style={{ color: DANGER }}
      >
        <AlertCircle size={11} /> {error}
      </div>
    )}
  </div>
);

const PillGroup: React.FC<PillGroupProps> = ({
  name,
  value,
  onChange,
  options,
  disabled,
}: PillGroupProps & { disabled?: boolean }) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((opt) => (
      <label
        key={opt}
        style={{ position: "relative", opacity: disabled ? 0.55 : 1 }}
      >
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => !disabled && onChange(opt)}
          disabled={disabled}
          className="gf-radio-input"
        />
        <span
          className="gf-pill"
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {opt.replace("NA", "N/A")}
        </span>
      </label>
    ))}
  </div>
);

const SelectBox: React.FC<{
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string | false;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ name, value, onChange, error, disabled, className = "", children }) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`gf-select appearance-none pr-9 ${error ? "gf-error" : ""} ${className}`}
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: INK_SOFT }}
    />
  </div>
);

const SectionTitle: React.FC<SectionTitleProps> = ({
  icon: Icon,
  children,
}) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon size={16} style={{ color: OCHRE }} />
    <h3 className="gf-display text-base font-semibold" style={{ color: INK }}>
      {children}
    </h3>
  </div>
);

const Note: React.FC<NoteProps> = ({ children, tone = "ochre" }) => (
  <div
    className="rounded-xl p-4 text-[11.5px] leading-relaxed font-medium"
    style={{
      background: tone === "ochre" ? "#FAF6EF" : "#FCECE8",
      border: `1px solid ${tone === "ochre" ? "#ECD9BE" : "#F0CFC5"}`,
      color: tone === "ochre" ? OCHRE_DEEP : DANGER,
    }}
  >
    {children}
  </div>
);

/* ---------------------------------------------------------------
   ADDRESS FIELDS — Village/PoliceStation/PostOffice/PinCode stay as
   free-text inputs. State & District are now driven by the
   locationApi (getStatesByCountry / getDistrictsByState) instead of
   free text, cascading from the selected State down to District.
--------------------------------------------------------------- */
// const AddressFields: React.FC<
//   AddressFieldsProps & {
//     states: StateItem[];
//     statesLoading: boolean;
//     districts: DistrictItem[];
//     districtsLoading: boolean;
//     onStateChange: (e: ChangeEvent<HTMLSelectElement>) => void;
//     onDistrictChange: (e: ChangeEvent<HTMLSelectElement>) => void;
//   }
// > = ({
//   prefix,
//   v,
//   setField,
//   errors,
//   disabled,
//   states,
//   statesLoading,
//   districts,
//   districtsLoading,
//   onStateChange,
//   onDistrictChange,
// }) => {
//   const rows: [string, string, string][] = [
//     ["Village", "गाँव/मोहल्ला", "Village"],
//     ["PostOffice", "डाकघर", "PostOffice"],
//     ["PoliceStation", "पुलिस थाना", "PoliceStation"],
//     ["PinCode", "पिन कोड", "PinCode"],
//   ];

//   const stateKey = `${prefix}State` as keyof PersonalData;
//   const districtKey = `${prefix}District` as keyof PersonalData;
//   const hasState = !!v[`${prefix}StateId`];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//       {rows.map(([suffix, hiLabel]) => {
//         const key = `${prefix}${suffix}` as keyof PersonalData;
//         return (
//           <Field
//             key={key}
//             label={suffix.replace(/([A-Z])/g, " $1").trim()}
//             hi={hiLabel}
//             required
//             error={errors[key as string]}
//           >
//             <input
//   className={`gf-input ${errors[key as string] ? "gf-error" : ""}`}
//   disabled={disabled}
//   value={v[key] || ""}
//   onChange={(e: ChangeEvent<HTMLInputElement>) => {
//     let val = e.target.value;
//     if (suffix === "PinCode") {
//       val = val.replace(/\D/g, ""); // Strips all non-numeric characters
//     }
//     setField(key as string, val);
//   }}
//   maxLength={suffix === "PinCode" ? 6 : undefined}
//   placeholder={suffix.replace(/([A-Z])/g, " $1").trim()}
// />
//           </Field>
//         );
//       })}

//       <Field label="State" hi="राज्य" required error={errors[stateKey as string]}>
//         <SelectBox
//           name={stateKey as string}
//           value={v[stateKey] || ""}
//           onChange={onStateChange}
//           error={errors[stateKey as string]}
//           disabled={disabled || statesLoading}
//         >
//           <option value="">{statesLoading ? "Loading..." : "Select state"}</option>
//           {states.map((s) => (
//             <option key={s.stateId} value={s.stateName}>
//               {s.stateName}
//             </option>
//           ))}
//         </SelectBox>
//       </Field>

//       <Field label="District" hi="जिला" required error={errors[districtKey as string]}>
//         <SelectBox
//           name={districtKey as string}
//           value={v[districtKey] || ""}
//           onChange={onDistrictChange}
//           error={errors[districtKey as string]}
//           disabled={disabled || districtsLoading || !hasState}
//         >
//           <option value="">
//             {districtsLoading
//               ? "Loading..."
//               : !hasState
//               ? "Select state first"
//               : "Select district"}
//           </option>
//           {districts.map((d) => (
//             <option key={d.districtId} value={d.districtName}>
//               {d.districtName}
//             </option>
//           ))}
//         </SelectBox>
//       </Field>
//     </div>
//   );
// };

const AddressFields: React.FC<
  AddressFieldsProps & {
    states: StateItem[];
    statesLoading: boolean;
    districts: DistrictItem[];
    districtsLoading: boolean;
    onStateChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onDistrictChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    disableState?: boolean;
  }
> = ({
  prefix,
  v,
  setField,
  errors,
  disabled,
  states,
  statesLoading,
  districts,
  districtsLoading,
  onStateChange,
  onDistrictChange,
  disableState,
}) => {
  // We separate the first three text fields so we can control the exact rendering order
  const topRows: [string, string, string][] = [
    ["Village", "गाँव/मोहल्ला", "Village"],
    ["PostOffice", "डाकघर", "Post Office"],
    ["PoliceStation", "पुलिस थाना", "Police Station"],
  ];

  const stateKey = `${prefix}State` as keyof PersonalData;
  const districtKey = `${prefix}District` as keyof PersonalData;
  const pinCodeKey = `${prefix}PinCode` as keyof PersonalData;
  const hasState = !!v[`${prefix}StateId`];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {/* 1. Village, 2. Post Office, 3. Police Station */}
      {topRows.map(([suffix, hiLabel, placeholder]) => {
        const key = `${prefix}${suffix}` as keyof PersonalData;
        return (
          <Field
            key={key}
            label={suffix.replace(/([A-Z])/g, " $1").trim()}
            hi={hiLabel}
            required
            error={errors[key as string]}
          >
            <input
              className={`gf-input uppercase ${errors[key as string] ? "gf-error" : ""}`}
              disabled={disabled}
              value={v[key] || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setField(key as string, e.target.value);
              }}
              placeholder={placeholder}
            />
          </Field>
        );
      })}

      {/* 4. State */}
      <Field label="State" hi="राज्य" required error={errors[stateKey as string]}>
        <SelectBox
          name={stateKey as string}
          value={v[stateKey] || ""}
          onChange={onStateChange}
          error={errors[stateKey as string]}
        
          disabled={disabled || statesLoading || disableState}
        >
          <option value="">{statesLoading ? "Loading..." : "Select state"}</option>
          {states.map((s) => (
            <option key={s.stateId} value={s.stateName}>
              {s.stateName}
            </option>
          ))}
        </SelectBox>
      </Field>

      {/* 5. District */}
      <Field label="District" hi="जिला" required error={errors[districtKey as string]}>
        <SelectBox
          name={districtKey as string}
          value={v[districtKey] || ""}
          onChange={onDistrictChange}
          error={errors[districtKey as string]}
          disabled={disabled || districtsLoading || !hasState}
        >
          <option value="">
            {districtsLoading
              ? "Loading..."
              : !hasState
              ? "Select state first"
              : "Select district"}
          </option>
          {districts.map((d) => (
            <option key={d.districtId} value={d.districtName}>
              {d.districtName}
            </option>
          ))}
        </SelectBox>
      </Field>

      {/* 6. Pin Code */}
      <Field label="Pin Code" hi="पिन कोड" required error={errors[pinCodeKey as string]}>
        <input
          className={`gf-input ${errors[pinCodeKey as string] ? "gf-error" : ""}`}
          disabled={disabled}
          value={v[pinCodeKey] || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value.replace(/\D/g, ""); // Strips all non-numeric characters
            setField(pinCodeKey as string, val);
          }}
          maxLength={6}
          placeholder="Pin Code"
        />
      </Field>
    </div>
  );
};

// const CertNumberDateAuthority: React.FC<CertNumberDateAuthorityProps & { 
//   disabledNo?: boolean; 
//   disabledDate?: boolean; 
//   disabledAuth?: boolean;
// }> = ({
//   v,
//   setField,
//   prefixNo,
//   prefixDate,
//   prefixAuth,
//   labelNo,
//   hiNo,
//   labelDate,
//   hiDate,
//   labelAuth,
//   hiAuth,
//   disabledNo,
//   disabledDate,
//   disabledAuth,
// }) => (
//   <>
//     <Field label={labelNo} hi={hiNo}>
//       <input
//         className="gf-input"
//         value={v[prefixNo] || ""}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setField(prefixNo, e.target.value)
//         }
//         placeholder="Certificate number"
//         disabled={disabledNo}
//       />
//     </Field>
//     {prefixDate && (
//       <Field label={labelDate} hi={hiDate}>
//         <input
//           type="date"
//           className="gf-input"
//           value={v[prefixDate] || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setField(prefixDate, e.target.value)
//           }
//           disabled={disabledDate}
//         />
//       </Field>
//     )}
//     <Field label={labelAuth} hi={hiAuth}>
//       <input
//         className="gf-input"
//         value={v[prefixAuth] || ""}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setField(prefixAuth, e.target.value)
//         }
//         placeholder="Issuing authority"
//         disabled={disabledAuth}
//       />
//     </Field>
//   </>
// );

const CertNumberDateAuthority: React.FC<CertNumberDateAuthorityProps & { 
  disabledNo?: boolean; 
  disabledDate?: boolean; 
  disabledAuth?: boolean;
  authOptions?: string[]; // <-- ADDED: Support for Dropdown options
}> = ({
  v,
  setField,
  prefixNo,
  prefixDate,
  prefixAuth,
  labelNo,
  hiNo,
  labelDate,
  hiDate,
  labelAuth,
  hiAuth,
  disabledNo,
  disabledDate,
  disabledAuth,
  authOptions, // <-- ADDED
}) => (
  <>
    <Field label={labelNo} hi={hiNo}>
      <input
        className="gf-input uppercase"
        value={v[prefixNo] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setField(prefixNo, e.target.value)
        }
        placeholder="Certificate number"
        disabled={disabledNo}
      />
    </Field>
    {prefixDate && (
      <Field label={labelDate} hi={hiDate}>
        <input
          type="date"
          className="gf-input"
          value={v[prefixDate] || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setField(prefixDate, e.target.value)
          }
          disabled={disabledDate}
        />
      </Field>
    )}
    <Field label={labelAuth} hi={hiAuth}>
      {/* --- ADDED: Conditionally render SelectBox or text input --- */}
      {authOptions ? (
        <SelectBox
          name={prefixAuth}
          value={v[prefixAuth] || ""}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setField(prefixAuth, e.target.value)
          }
          disabled={disabledAuth}
        >
          <option value="">Select authority</option>
          {authOptions.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </SelectBox>
      ) : (
        <input
          className="gf-input"
          value={v[prefixAuth] || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setField(prefixAuth, e.target.value)
          }
          placeholder="Issuing authority"
          disabled={disabledAuth}
        />
      )}
    </Field>
  </>
);

/* ---------------------------------------------------------------
   STEP 1 — PERSONAL DETAILS
--------------------------------------------------------------- */

type Step1Data = PersonalData & { [key: string]: any };

const pad2 = (val: string): string => (val || "").padStart(2, "0");

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

const toIso = (day: string, month: string, year: string): string =>
  day && month && year ? `${year}-${pad2(month)}-${pad2(day)}` : "";

/* ---------------------------------------------------------------
   ── FIX: DATE-TRIO HYDRATION ──────────────────────────────────
   Saved/auto-filled data (step0 snapshot, previously-saved step1,
   previously-saved education sections) always arrives as ONE flat
   date string (ISO "YYYY-MM-DD" or "DD-MM-YYYY", as sent by the
   backend). But every DateSelect on this page is driven by THREE
   separate fields — e.g. dobDay / dobMonth / dobYear. Nothing was
   ever converting the flat string into those three fields, which is
   why dates looked blank whenever you left a step and came back, or
   whenever auto-fill ran. splitDateString + buildDateTrioUpdates fix
   that in one place, for every date on the form.
--------------------------------------------------------------- */
// const splitDateString = (
//   raw?: string | null,
// ): { day: string; month: string; year: string } => {
//   if (!raw || typeof raw !== "string") return { day: "", month: "", year: "" };
//   const trimmed = raw.trim();

//   // ISO: "YYYY-MM-DD" (also matches "YYYY-MM-DDTHH:mm:ss.sssZ")
//   const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
//   if (iso) {
//     return {
//       day: String(parseInt(iso[3], 10)),
//       month: String(parseInt(iso[2], 10)),
//       year: iso[1],
//     };
//   }

//   // "DD-MM-YYYY" or "DD/MM/YYYY" — the format step0 sends dateOfBirth in
//   const dmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
//   if (dmy) {
//     return {
//       day: String(parseInt(dmy[1], 10)),
//       month: String(parseInt(dmy[2], 10)),
//       year: dmy[3],
//     };
//   }

//   return { day: "", month: "", year: "" };
// };

// Maps every "flat date field" this form deals with to the trio prefix
// its DateSelect uses internally.

// Add this small helper above splitDateString to strip leading zeros safely
const unpad = (val?: string | number | null): string => {
  if (!val) return "";
  const parsed = parseInt(String(val), 10);
  return isNaN(parsed) ? String(val) : String(parsed);
};

const splitDateString = (
  raw?: string | null,
): { day: string; month: string; year: string } => {
  if (!raw || typeof raw !== "string") return { day: "", month: "", year: "" };
  const trimmed = raw.trim();

  // ISO: "YYYY-MM-DD"
  const iso = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (iso) {
    return {
      day: String(parseInt(iso[3], 10)),
      month: String(parseInt(iso[2], 10)),
      year: iso[1],
    };
  }

  // "DD-MM-YYYY" or "DD/MM/YYYY"
  const dmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) {
    return {
      day: String(parseInt(dmy[1], 10)),
      month: String(parseInt(dmy[2], 10)),
      year: dmy[3],
    };
  }

  return { day: "", month: "", year: "" };
};

const DATE_FIELD_MAP: Record<string, string> = {
  dateOfBirth: "dob",
  categoryIssueDate: "categoryIssueDate",
  domicileCertificateIssueDate: "domicileIssueDate",
  disabilityIssueDate: "disabilityIssueDate",
  serviceFromDate: "serviceFrom",
  serviceToDate: "serviceTo",
  contractualFromDate: "contractualFrom",
  contractualToDate: "contractualTo",
  debarredFromDate: "debarredFrom",
  debarredToDate: "debarredTo",
};

// Given a flat source object (autoFill / saved step data) and the
// current form state, returns ONLY the {prefix}Day/Month/Year updates
// that are missing from current state — so hydration never clobbers a
// date the person is actively editing.
const buildDateTrioUpdates = (
  source: Record<string, any> | undefined | null,
  current: Record<string, any>,
) => {
  if (!source) return {};
  const updates: Record<string, string> = {};
  Object.entries(DATE_FIELD_MAP).forEach(([flatKey, prefix]) => {
    const dayKey = `${prefix}Day`;
    const monthKey = `${prefix}Month`;
    const yearKey = `${prefix}Year`;
    const alreadySet = current[dayKey] || current[monthKey] || current[yearKey];
    if (alreadySet) return;
    const { day, month, year } = splitDateString(source[flatKey]);
    if (day && month && year) {
      updates[dayKey] = day;
      updates[monthKey] = month;
      updates[yearKey] = year;
    }
  });
  return updates;
};

/* ---------------------------------------------------------------
   ── FIX: "SMART" MERGE FOR AUTO-FILL ─────────────────────────
   The previous merge was `{ ...autoFill, ...prev }`. That means any
   key that ALREADY existed on `prev` (even an empty string, like a
   half-finished draft saved earlier) silently won over a perfectly
   good value coming from the step0 auto-fill. That's the actual
   reason fields such as the PWD-40% pill looked "not auto-filled" —
   the blank draft value was shadowing the real one. This merge only
   lets `prev` win when it actually has a non-empty value.
--------------------------------------------------------------- */
const mergePreferNonEmpty = (
  base: Record<string, any>,
  overrides: Record<string, any>,
) => {
  const result: Record<string, any> = { ...base };
  Object.entries(overrides || {}).forEach(([k, val]) => {
    const isEmpty = val === undefined || val === null || val === "";
    if (!isEmpty) {
      result[k] = val;
    } else if (!(k in result)) {
      result[k] = val;
    }
  });
  return result;
};

const formatDuration = (d: DurationParts | null): string =>
  d ? `${d.years}y ${d.months}m ${d.days}d` : "—";



const CATEGORY_AUTHORITY_OPTIONS = ["CO/RO", "SDM", "DM"];
const DISABILITY_AUTHORITY_OPTIONS = ["Civil Surgeon/Chief Medical Officer", "Suprintendent/Principal Of Medical College & Hospital"];

type DatePart = "day" | "month" | "year";


  // ── FIX: backend stores/returns this field as "oldRegistrationNumber"
// (see step0 and step1 payloads), but the UI/state and validation use
// "previousApplicationNumber". Without this mapping, a previously
// saved value never reappears in the input after leaving and
// returning to Step 1 — the raw oldRegistrationNumber sat unused in
// state while the input read v.previousApplicationNumber, which was
// always empty.
// const withPreviousApplicationNumber = <T extends Record<string, any>>(
//   obj: T | undefined | null,
// ): T => {
//   if (!obj) return {} as T;
//   if (!obj.previousApplicationNumber && obj.oldRegistrationNumber) {
//     return { ...obj, previousApplicationNumber: obj.oldRegistrationNumber };
//   }
//   return obj;
// };

const withPreviousApplicationNumber = <T extends Record<string, any>>(
  obj: T | undefined | null,
): T => {
  if (!obj) return {} as T;
  const normalized = { ...obj };

  if (!normalized.previousApplicationNumber && normalized.oldRegistrationNumber) {
    normalized.previousApplicationNumber = normalized.oldRegistrationNumber;
  }
  
  // FIX: Map step0 backend fields to step1 frontend state fields
  if (!normalized.natureOfDisabilityType && normalized.disTypePersist) {
    normalized.natureOfDisabilityType = normalized.disTypePersist;
  }
  if (!normalized.natureOfDisability && normalized.pwdType) {
    normalized.natureOfDisability = normalized.pwdType;
  }
  if (!normalized.disabilityPercent && normalized.pwd40Percent) {
    normalized.disabilityPercent = normalized.pwd40Percent;
  }

  return normalized;
};

const Step1Personal: React.FC<
  Step1Props & { applicationId?: string; autoFill?: Record<string, any> }
> = ({ data, onSave, applicationId, autoFill }) => {
  const [v, setV] = useState<Step1Data>({
    nationality: "INDIAN",
    sameAsPermanent: false,
    // ...data,
    ...withPreviousApplicationNumber(data),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSavingStep1, setIsSavingStep1] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

 
  

  const [disabilities, setDisabilities] = useState<Disability[]>([]);
  const [disabilitiesLoading, setDisabilitiesLoading] = useState(false);

  // ── Location APIs: countries (nationality), states, districts ──
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const [states, setStates] = useState<StateItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);

  const [permDistricts, setPermDistricts] = useState<DistrictItem[]>([]);
  const [permDistrictsLoading, setPermDistrictsLoading] = useState(false);
  const [corrDistricts, setCorrDistricts] = useState<DistrictItem[]>([]);
  const [corrDistrictsLoading, setCorrDistrictsLoading] = useState(false);

//   const isAutoFilled = (key: string): boolean => {
//   return autoFill !== undefined && 
//          autoFill !== null && 
//          autoFill[key] !== undefined && 
//          autoFill[key] !== null && 
//          autoFill[key] !== "";
// };

const isAutoFilled = (...keys: string[]): boolean => {
    if (!autoFill) return false;
    return keys.some(key => 
      autoFill[key] !== undefined && 
      autoFill[key] !== null && 
      autoFill[key] !== ""
    );
  };

  const setField = (k: string, val: string | boolean) =>
    setV((p) => ({ ...p, [k]: val }));

  // const setDatePart = (prefix: string, part: DatePart, value: string) => {
  //   setV((p) => ({ ...p, [`${prefix}${part[0].toUpperCase()}${part.slice(1)}`]: value }));
  // };

  const setDatePart = (prefix: string, part: DatePart, value: string) => {
    setV((p) => {
      const nextState = { ...p, [`${prefix}${part[0].toUpperCase()}${part.slice(1)}`]: value };
      
      // Prevent future dates for Domicile Issue Date (and others)
      const day = nextState[`${prefix}Day`] || "";
      const month = nextState[`${prefix}Month`] || "";
      const year = nextState[`${prefix}Year`] || "";
      
      if (prefix === "domicileIssueDate" && isFutureDate(day, month, year)) {
        notifyError("Future date is not allowed for Domicile Issue Date.");
        return p; // Reject the change, keep previous state
      }

      return nextState;
    });
  };

  const touchDateTrio = (prefix: string) => {
    setTouched((p) => ({
      ...p,
      [`${prefix}Day`]: true,
      [`${prefix}Month`]: true,
      [`${prefix}Year`]: true,
    }));
  };
  // const dateValue = (prefix: string) => ({
  //   day: v[`${prefix}Day`] || "",
  //   month: v[`${prefix}Month`] || "",
  //   year: v[`${prefix}Year`] || "",
  // });

  const dateValue = (prefix: string) => ({
    day: unpad(v[`${prefix}Day`]),
    month: unpad(v[`${prefix}Month`]),
    year: v[`${prefix}Year`] || "",
  });


  const dateTouched = (prefix: string) => ({
    day: !!touched[`${prefix}Day`],
    month: !!touched[`${prefix}Month`],
    year: !!touched[`${prefix}Year`],
  });
  const dateErrors = (prefix: string, msg?: string) => ({
    day: touched[`${prefix}Day`] ? msg || errors[`${prefix}Day`] : "",
    month: touched[`${prefix}Month`] ? msg || errors[`${prefix}Month`] : "",
    year: touched[`${prefix}Year`] ? msg || errors[`${prefix}Year`] : "",
  });

  useEffect(() => {
    (async () => {
      try {
        setCategoriesLoading(true);
        setCategories(await fetchCategoriesApi());
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    })();
  
    (async () => {
      try {
        setDisabilitiesLoading(true);
        setDisabilities(await fetchDisabilitiesApi());
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load disabilities");
      } finally {
        setDisabilitiesLoading(false);
      }
    })();
    (async () => {
      try {
        setCountriesLoading(true);
        const res = await locationApi.getCountries();
        setCountries(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load countries");
      } finally {
        setCountriesLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (v.categoryId) {
      const selected = categories.find((c) => c.value === parseInt(v.categoryId));
      setSubCategories(selected?.subCategories || []);
    } else {
      setSubCategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.categoryId, categories]);

  // ── FIX: hydrate dobDay/Month/Year (and every other date trio) from
  //    whatever saved step1 payload was passed in as `data`. Runs once
  //    on mount — the API sends flat date strings, but every DateSelect
  //    on this page needs them split into day/month/year.
  useEffect(() => {
    setV((prev) => ({ ...prev, ...buildDateTrioUpdates(data, prev) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-fill from step0 (initial registration snapshot). Only fills keys
  // that aren't already MEANINGFULLY set on `v` (a blank draft value no
  // longer blocks a good auto-fill value — see mergePreferNonEmpty), and
  // never overwrites anything the candidate has actually typed.
  // useEffect(() => {
  //   if (!autoFill) return;
  //   setV((prev) => {
  //     const merged = mergePreferNonEmpty(autoFill, prev);
  //     const dateUpdates = buildDateTrioUpdates(autoFill, merged);
  //     return { ...merged, ...dateUpdates };
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [autoFill]);

  useEffect(() => {
  if (!autoFill) return;
  const autoFillNormalized = withPreviousApplicationNumber(autoFill);
  setV((prev) => {
    const merged = mergePreferNonEmpty(autoFillNormalized, prev);
    const dateUpdates = buildDateTrioUpdates(autoFillNormalized, merged);
    return { ...merged, ...dateUpdates };
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [autoFill]);

  // Once categories load, resolve the numeric mainCategory id (from
  // step0) into the category *label* Step1Personal works with — only if
  // the candidate hasn't already picked a category.
  useEffect(() => {
    if (!v.category && v.categoryId && categories.length > 0) {
      const match = categories.find((c) => String(c.value) === String(v.categoryId));
      if (match) setV((p) => ({ ...p, category: match.label }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, v.categoryId]);

  

  // Same resolution for caste, once sub-categories become available.
  useEffect(() => {
    if (subCategories.length > 0) {
      // 1. If we have the ID but no label
      if (!v.caste && v.casteId) {
        const match = subCategories.find((c) => String(c.value) === String(v.casteId));
        if (match) setV((p) => ({ ...p, caste: match.label }));
      } 
      // 2. If we have the label (from candidateDetails fallback) but no ID
      else if (v.caste && !v.casteId) {
        const match = subCategories.find((c) => c.label === v.caste);
        if (match) setV((p) => ({ ...p, casteId: String(match.value) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategories, v.casteId, v.caste]);


  

  // Default nationality to India (from the countries API) once it loads,
  // unless the candidate/autofill already picked something else.
  useEffect(() => {
    if (countries.length === 0) return;
    if (!v.nationality || v.nationality === "INDIAN") {
      const india = countries.find((c) => /india/i.test(c.countryName)) || countries[0];
      if (india) {
        setV((p) => ({ ...p, nationality: india.countryName, nationalityId: String(india.countryId) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  // Resolve nationalityId if only the nationality label is known
  // (e.g. coming from a previously saved step1 or the step0 autofill).
  // useEffect(() => {
  //   if (v.nationality && v.nationality !== "OTHER" && !v.nationalityId && countries.length > 0) {
  //     const match = countries.find(
  //       (c) => c.countryName.toUpperCase() === String(v.nationality).toUpperCase(),
  //     );
  //     if (match) setV((p) => ({ ...p, nationalityId: String(match.countryId) }));
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [countries, v.nationality]);

  // Resolve nationalityId if only the nationality label is known
  useEffect(() => {
    if (v.nationality && !v.nationalityId && countries.length > 0) {
      const match = countries.find(
        (c) => c.countryName.toUpperCase() === String(v.nationality).toUpperCase(),
      );
      if (match) setV((p) => ({ ...p, nationalityId: String(match.countryId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, v.nationality]);

  // Fetch states for the selected country (India, by default).
  useEffect(() => {
    const countryId = v.nationalityId ? parseInt(v.nationalityId, 10) : null;
    if (!countryId) {
      setStates([]);
      return;
    }
    (async () => {
      try {
        setStatesLoading(true);
        const res = await locationApi.getStatesByCountry(countryId);
        setStates(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load states");
      } finally {
        setStatesLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.nationalityId]);

  // ── AUTO-FILL BIHAR STATE IF DOMICILE IS YES ──
  useEffect(() => {
    if (v.domicileOfBihar === "YES" && states.length > 0) {
      // Find Bihar dynamically from the API response
      const biharState = states.find((s) => /bihar/i.test(s.stateName));
      
      if (biharState && v.permState !== biharState.stateName) {
        setV((p) => ({
          ...p,
          permState: biharState.stateName,
          permStateId: String(biharState.stateId),
          // Reset district so they pick a valid Bihar district
          permDistrict: "", 
          permDistrictId: "",
          // Also apply to correspondence address if "Same as permanent" is checked
          ...(p.sameAsPermanent
            ? {
                corrState: biharState.stateName,
                corrStateId: String(biharState.stateId),
                corrDistrict: "",
                corrDistrictId: "",
              }
            : {}),
        }));
      }
    }
  }, [v.domicileOfBihar, states]);



  // Fetch districts for the permanent address's selected state.
  useEffect(() => {
    if (!v.permStateId) {
      setPermDistricts([]);
      return;
    }
    (async () => {
      try {
        setPermDistrictsLoading(true);
        const res = await locationApi.getDistrictsByState(parseInt(v.permStateId, 10));
        setPermDistricts(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load districts");
      } finally {
        setPermDistrictsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.permStateId]);

  // Fetch districts for the correspondence address's selected state.
  useEffect(() => {
    if (!v.corrStateId) {
      setCorrDistricts([]);
      return;
    }
    (async () => {
      try {
        setCorrDistrictsLoading(true);
        const res = await locationApi.getDistrictsByState(parseInt(v.corrStateId, 10));
        setCorrDistricts(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load districts");
      } finally {
        setCorrDistrictsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.corrStateId]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = categories.find((c) => c.label === label);
    setV((p) => ({
      ...p,
      category: label,
      categoryId: selected ? String(selected.value) : "",
      caste: "",
      casteId: "",
    }));
  };

  const handleCasteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = subCategories.find((c) => c.label === label);
    setV((p) => ({
      ...p,
      caste: label,
      casteId: selected ? String(selected.value) : "",
    }));
  };

  // const handleNationalityChange = (e: ChangeEvent<HTMLSelectElement>) => {
  //   const label = e.target.value;
  //   if (label === "OTHER") {
  //     setV((p) => ({ ...p, nationality: "OTHER", nationalityId: "" }));
  //     return;
  //   }
  //   const selected = countries.find((c) => c.countryName === label);
  //   setV((p) => ({
  //     ...p,
  //     nationality: label,
  //     nationalityId: selected ? String(selected.countryId) : "",
  //     otherNationality: "",
  //   }));
  // };

  const handleNationalityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = countries.find((c) => c.countryName === label);
    setV((p) => ({
      ...p,
      nationality: label,
      nationalityId: selected ? String(selected.countryId) : "",
    }));
  };

  const handleStateChange = (prefix: "perm" | "corr") => (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = states.find((s) => s.stateName === label);
    setV((p) => ({
      ...p,
      [`${prefix}State`]: label,
      [`${prefix}StateId`]: selected ? String(selected.stateId) : "",
      [`${prefix}District`]: "",
      [`${prefix}DistrictId`]: "",
    }));
  };

  const handleDistrictChange = (prefix: "perm" | "corr") => (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const districtList = prefix === "perm" ? permDistricts : corrDistricts;
    const selected = districtList.find((d) => d.districtName === label);
    setV((p) => ({
      ...p,
      [`${prefix}District`]: label,
      [`${prefix}DistrictId`]: selected ? String(selected.districtId) : "",
    }));
  };

  // Keep correspondence address in sync with permanent address for as long
// as "Same as permanent address" stays checked — not just at the moment
// the checkbox is toggled.
useEffect(() => {
  if (!v.sameAsPermanent) return;
  setV((p) => ({
    ...p,
    corrVillage: p.permVillage,
    corrPoliceStation: p.permPoliceStation,
    corrPostOffice: p.permPostOffice,
    corrDistrict: p.permDistrict,
    corrDistrictId: p.permDistrictId,
    corrState: p.permState,
    corrStateId: p.permStateId,
    corrPinCode: p.permPinCode,
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [
  v.sameAsPermanent,
  v.permVillage,
  v.permPoliceStation,
  v.permPostOffice,
  v.permDistrict,
  v.permDistrictId,
  v.permState,
  v.permStateId,
  v.permPinCode,
]);

  const toggleSame = (checked: boolean) => {
    setV((p) => ({
      ...p,
      sameAsPermanent: checked,
      ...(checked
        ? {
            corrVillage: p.permVillage,
            corrPoliceStation: p.permPoliceStation,
            corrPostOffice: p.permPostOffice,
            corrDistrict: p.permDistrict,
            corrDistrictId: p.permDistrictId,
            corrState: p.permState,
            corrStateId: p.permStateId,
            corrPinCode: p.permPinCode,
          }
        : {}),
    }));
  };

  // const showCategoryDocs = !!v.category && mapCategoryLabelToCode(v.category) !== "UR";
  const showCategoryDocs = 
    !!v.category && 
    mapCategoryLabelToCode(v.category) !== "UR" && 
    v.isNonCreamyLayer !== "NO";
  const showNonCreamy = v.category && mapCategoryLabelToCode(v.category) !== "UR";
  const isBiharDomicile = v.domicileOfBihar === "YES";
  const isPwD = isBiharDomicile && v.disability === "YES";
  const isMin40PwD = isPwD && v.disabilityPercent === "YES";
  const isExServiceman = isBiharDomicile && v.exServiceman === "YES";
  const isContractual = isBiharDomicile && v.contractualEmployee === "YES";
  // ── Debarred Details — mirrors the isExServiceman / isContractual pattern:
  //    a plain YES/NO gate that, when YES, reveals a From/To date pair
  //    (with an auto-computed duration) plus a free-text reason field.
  const isDebarred = v.isDebarred === "YES";

  const age = useMemo<DurationParts | null>(() => {
    if (!isRealDate(v.dobDay, v.dobMonth, v.dobYear)) return null;
    return calcDuration(toIso(v.dobDay, v.dobMonth, v.dobYear), "2025-08-01");
  }, [v.dobDay, v.dobMonth, v.dobYear]);

  const serviceDuration = useMemo<DurationParts | null>(() => {
    if (
      !v.serviceFromDay || !v.serviceFromMonth || !v.serviceFromYear ||
      !v.serviceToDay || !v.serviceToMonth || !v.serviceToYear
    )
      return null;
    return calcDuration(
      toIso(v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear),
      toIso(v.serviceToDay, v.serviceToMonth, v.serviceToYear),
    );
  }, [
    v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear,
    v.serviceToDay, v.serviceToMonth, v.serviceToYear,
  ]);

  const contractualDuration = useMemo<DurationParts | null>(() => {
    if (
      !v.contractualFromDay || !v.contractualFromMonth || !v.contractualFromYear ||
      !v.contractualToDay || !v.contractualToMonth || !v.contractualToYear
    )
      return null;
    return calcDuration(
      toIso(v.contractualFromDay, v.contractualFromMonth, v.contractualFromYear),
      toIso(v.contractualToDay, v.contractualToMonth, v.contractualToYear),
    );
  }, [
    v.contractualFromDay, v.contractualFromMonth, v.contractualFromYear,
    v.contractualToDay, v.contractualToMonth, v.contractualToYear,
  ]);

  // ── Debarment duration — same calcDuration helper used for service /
  //    contractual periods above, kept as its own memo so it only
  //    recomputes when the debarment date fields change.
  const debarredDuration = useMemo<DurationParts | null>(() => {
    if (
      !v.debarredFromDay || !v.debarredFromMonth || !v.debarredFromYear ||
      !v.debarredToDay || !v.debarredToMonth || !v.debarredToYear
    )
      return null;
    return calcDuration(
      toIso(v.debarredFromDay, v.debarredFromMonth, v.debarredFromYear),
      toIso(v.debarredToDay, v.debarredToMonth, v.debarredToYear),
    );
  }, [
    v.debarredFromDay, v.debarredFromMonth, v.debarredFromYear,
    v.debarredToDay, v.debarredToMonth, v.debarredToYear,
  ]);

  const ageEligibility = useMemo(() => {
    if (!isRealDate(v.dobDay, v.dobMonth, v.dobYear)) return null;
    if (!v.category || !v.gender) return null;
    return validateAgeEligibility({
      category: mapCategoryLabelToCode(v.category),
      gender: v.gender as any,
      dobISO: toIso(v.dobDay, v.dobMonth, v.dobYear),
      isPwbd: isMin40PwD,
      isExServiceman,
    
      serviceFromISO: toIso(v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear),
      serviceToISO: toIso(v.serviceToDay, v.serviceToMonth, v.serviceToYear),
      isBiharGovtEmployee: v.biharGovtEmployee === "YES",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    v.dobDay, v.dobMonth, v.dobYear, v.category, v.gender,
    v.domicileOfBihar,
    v.disability, v.disabilityPercent, v.exServiceman,
    v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear,
    v.serviceToDay, v.serviceToMonth, v.serviceToYear, v.biharGovtEmployee,
  ]);

  const required = [
    "applicantName", "fatherName", "motherName", "gender", "isMarried",
    "nationality", "emailId", "mobileNo", "confirmMobileNo",
    "domicileOfBihar", "category", "isNonCreamyLayer",
    "hasAadharCard","previouslyRegistered",
    "permVillage", "permPoliceStation", "permPostOffice", "permDistrict", "permState", "permPinCode",
    "corrVillage", "corrPoliceStation", "corrPostOffice", "corrDistrict", "corrState", "corrPinCode","isDebarred",

    ...(isBiharDomicile
      ? [
          // ── FIX: this used to say "isMin40PercentPwD", a field the
          //    form never actually writes to — the pill below sets
          //    `v.disabilityPercent`, so validation always failed even
          //    when a candidate answered it. Corrected to match.
          "disability", "disabilityPercent", "exServiceman",
          "wardOfFreedomFighter", "biharGovtEmployee", "numberOfAttempts",
          "contractualEmployee", 
          
        ]
      : []),
  ];

  const validate = () => {
    const e: Record<string, string> = {};

    required.forEach((f) => {
      if (!String(v[f] ?? "").trim()) e[f] = "This field is required";
    });

    if (!isRealDate(v.dobDay, v.dobMonth, v.dobYear)) e.dobDay = "Enter a valid date of birth";
   
    
    if (v.isMarried === "YES" && !String(v.spouseName || "").trim())
      e.spouseName = "Spouse's name is required";

    if (showNonCreamy && subCategories.length > 0 && !v.caste) e.caste = "Caste is required";

    if (showCategoryDocs) {
      if (!v.categoryCertNo) e.categoryCertNo = "Certificate number is required";
      if (!isRealDate(v.categoryIssueDateDay, v.categoryIssueDateMonth, v.categoryIssueDateYear))
        e.categoryIssueDateDay = "Issue date is required";
      if (!v.categoryAuthority) e.categoryAuthority = "Issuing authority is required";
      if (v.categoryAuthority === "Other" && !v.categoryAuthorityOther)
        e.categoryAuthorityOther = "Please specify the issuing authority";
    }

  
    if (isPwD) {
      if (!v.natureOfDisabilityType) e.natureOfDisabilityType = "Please select nature of disability";
      if (!v.disabilityCertNo) e.disabilityCertNo = "Disability certificate number is required";
      if (!isRealDate(v.disabilityIssueDateDay, v.disabilityIssueDateMonth, v.disabilityIssueDateYear))
        e.disabilityIssueDateDay = "Issue date is required";
      if (!v.disabilityAuthority) e.disabilityAuthority = "Issuing authority is required";
      if (v.disabilityAuthority === "Other" && !v.disabilityAuthorityOther)
        e.disabilityAuthorityOther = "Please specify the issuing authority";
      if (isMin40PwD && !v.isScribeRequired) e.isScribeRequired = "Please specify if scribe is required";
    }

    if (isExServiceman) {
      if (
        !v.serviceFromDay || !v.serviceFromMonth || !v.serviceFromYear ||
        !v.serviceToDay || !v.serviceToMonth || !v.serviceToYear
      ) {
        e.serviceFromDay = "Complete service period is required for ex-servicemen";
      }
    }

    // if (isBiharDomicile) {
    //   if (!String(v.domicileCertificateNumber || "").trim()) e.domicileCertificateNumber = "Domicile certificate number is required";
    //   if (!v.domicileCertificateAuthority) e.domicileCertificateAuthority = "Domicile issuing authority is required";
    //   if (!isRealDate(v.domicileIssueDateDay, v.domicileIssueDateMonth, v.domicileIssueDateYear))
    //     e.domicileIssueDateDay = "Domicile issue date is required";
    // }

    if (isBiharDomicile) {
      if (!String(v.domicileCertificateNumber || "").trim()) e.domicileCertificateNumber = "Domicile certificate number is required";
      if (!v.domicileCertificateAuthority) e.domicileCertificateAuthority = "Domicile issuing authority is required";
      
      if (!isRealDate(v.domicileIssueDateDay, v.domicileIssueDateMonth, v.domicileIssueDateYear)) {
        e.domicileIssueDateDay = "Domicile issue date is required";
      } else if (isFutureDate(v.domicileIssueDateDay, v.domicileIssueDateMonth, v.domicileIssueDateYear)) {
        e.domicileIssueDateDay = "Issue date cannot be in the future";
      }
    }

    if (isContractual) {
      if (!v.nameOfPost) e.nameOfPost = "Name of post is required";
      if (!v.organizationName) e.organizationName = "Organization name is required";
      if (!v.hasPostExperience)
        e.hasPostExperience = "Please specify if you have experience in the advertised post";
      if (
        !v.contractualFromDay || !v.contractualFromMonth || !v.contractualFromYear ||
        !v.contractualToDay || !v.contractualToMonth || !v.contractualToYear
      ) {
        e.contractualFromDay = "Contractual service period is required";
      }
    }

    // ── Debarred Details — only required once "Have you ever been
    //    debarred?" is answered YES; mirrors the contractual-date pattern.
    if (isDebarred) {
      // --- ADDED RECRUITMENT BOARD VALIDATION ---
      if (!String(v.recruitmentBoard || "").trim()) {
        e.recruitmentBoard = "Recruitment Board/Commission is required";
      }
      
      if (
        !v.debarredFromDay || !v.debarredFromMonth || !v.debarredFromYear ||
        !v.debarredToDay || !v.debarredToMonth || !v.debarredToYear
      ) {
        e.debarredFromDay = "Debarment period (from / to date) is required";
      }
      if (!String(v.debarmentReason || "").trim())
        e.debarmentReason = "Reason for debarment is required";
    }

    if (v.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.emailId)) e.emailId = "Enter a valid email";
    if (v.mobileNo && !/^[6-9]\d{9}$/.test(v.mobileNo))
      e.mobileNo = "Enter a valid 10 digit number starting with 6-9";
    if (v.confirmMobileNo && v.confirmMobileNo !== v.mobileNo)
      e.confirmMobileNo = "Mobile numbers do not match";
    if (v.permPinCode && !/^\d{6}$/.test(v.permPinCode)) e.permPinCode = "Enter a 6-digit PIN code";
    if (v.corrPinCode && !/^\d{6}$/.test(v.corrPinCode)) e.corrPinCode = "Enter a 6-digit PIN code";
    if (v.hasAadharCard === "YES" && v.aadharCardNumber && !/^\d{12}$/.test(v.aadharCardNumber))
      e.aadharCardNumber = "Aadhar must be 12 digits";

    if (v.previouslyRegistered === "YES" && !String(v.previousApplicationNumber || "").trim())
      e.previousApplicationNumber = "Previous application number is required";

    if (v.typeOfPhotoIdProof === "GOVERNMENT_ID" && !String(v.governmentIdNumber || "").trim())
      e.governmentIdNumber = "Government ID number is required";

    setErrors(e);
    setTouched((p) => {
      const t = { ...p };
      Object.keys(e).forEach((k) => (t[k] = true));
      [
        "dobDay", "dobMonth", "dobYear","domicileIssueDateDay",
         "domicileIssueDateMonth", "domicileIssueDateYear",
        "categoryIssueDateDay", "categoryIssueDateMonth", "categoryIssueDateYear",
        "disabilityIssueDateDay", "disabilityIssueDateMonth", "disabilityIssueDateYear",
        "serviceFromDay", "serviceFromMonth", "serviceFromYear",
        "serviceToDay", "serviceToMonth", "serviceToYear",
        "contractualFromDay", "contractualFromMonth", "contractualFromYear",
        "contractualToDay", "contractualToMonth", "contractualToYear",
        "debarredFromDay", "debarredFromMonth", "debarredFromYear",
        "debarredToDay", "debarredToMonth", "debarredToYear",
      ].forEach((k) => (t[k] = true));
      return t;
    });

    if (Object.keys(e).length > 0) {
      const firstMessage = Object.values(e)[0];
      notifyError(firstMessage || "Please fill all mandatory fields correctly.");
    }

    return Object.keys(e).length === 0;
  };


  

  const handleSaveNext = async () => {
    setSubmitError("");
    const ok = validate();
    if (!ok) return;

    if (ageEligibility && !ageEligibility.ok) {
      setSubmitError(ageEligibility.message);
      notifyError(ageEligibility.message);
      return;
    }
 const { applicantName,previousApplicationNumber, ...rest } = v;
    const payload: Step1Data = {
       fullName: applicantName,  // Changed from applicantName to fullName
    ...rest,
      dateOfBirth: toIso(v.dobDay, v.dobMonth, v.dobYear),
      oldRegistrationNumber: previousApplicationNumber,
      domicileCertificateIssueDate: isBiharDomicile ? toIso(v.domicileIssueDateDay, v.domicileIssueDateMonth, v.domicileIssueDateYear) : null,
      categoryIssueDate: toIso(v.categoryIssueDateDay, v.categoryIssueDateMonth, v.categoryIssueDateYear),
      disabilityIssueDate: toIso(v.disabilityIssueDateDay, v.disabilityIssueDateMonth, v.disabilityIssueDateYear),
      serviceFromDate: toIso(v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear),
      serviceToDate: toIso(v.serviceToDay, v.serviceToMonth, v.serviceToYear),
      contractualFromDate: toIso(v.contractualFromDay, v.contractualFromMonth, v.contractualFromYear),
      contractualToDate: toIso(v.contractualToDay, v.contractualToMonth, v.contractualToYear),
      debarredFromDate: toIso(v.debarredFromDay, v.debarredFromMonth, v.debarredFromYear),
      debarredToDate: toIso(v.debarredToDay, v.debarredToMonth, v.debarredToYear),
      ageEligibility,
    };

    try {
      setIsSavingStep1(true);
      await applicationApi.saveStep1({ applicationId, ...payload });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to save personal details. Please try again.";
      setSubmitError(msg);
      notifyError(msg);
      return;
    } finally {
      setIsSavingStep1(false);
    }

    notifySuccess("Personal details saved successfully.");
    onSave(payload as unknown as PersonalData);
  };

  return (
    <div className="space-y-8">
      {submitError && (
        <div>
          <Note tone="danger">{submitError}</Note>
        </div>
      )}

      {/* ── BASIC INFORMATION ── */}
      <div>
        <SectionTitle icon={User}>Basic Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Name of applicant" hi="आवेदक का नाम" required error={errors.applicantName}>
            <input
              className={`gf-input ${errors.applicantName ? "gf-error" : ""}`}
              value={v.applicantName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("applicantName", e.target.value)}
              placeholder="Enter full name"
              disabled={isAutoFilled("applicantName")}
            />
          </Field>
         <Field label="Father's name" hi="पिता का नाम" required error={errors.fatherName}>
  <input
    className={`gf-input uppercase ${errors.fatherName ? "gf-error" : ""}`}
    value={v.fatherName || ""}
    onChange={(e: ChangeEvent<HTMLInputElement>) => 
      setField("fatherName", e.target.value.replace(/[^a-zA-Z\s]/g, "").toUpperCase())
    }
    maxLength={50}
    placeholder="Enter father's name"
  />
</Field>
<Field label="Mother's name" hi="माता का नाम" required error={errors.motherName}>
  <input
    className={`gf-input uppercase ${errors.motherName ? "gf-error" : ""}`}
    value={v.motherName || ""}
    onChange={(e: ChangeEvent<HTMLInputElement>) => 
      setField("motherName", e.target.value.replace(/[^a-zA-Z\s]/g, ""))
    }
    maxLength={50}
    placeholder="Enter mother's name"
  />
</Field>
          <Field label="Gender" hi="लिंग" required error={errors.gender}>
            <PillGroup
              name="gender"
              value={v.gender || ""}
              onChange={(val) => setField("gender", val)}
              options={["MALE", "FEMALE", "TRANSGENDER"]}
              disabled={isAutoFilled("gender")}
            />
          </Field>

          <Field label="Nationality" hi="राष्ट्रीयता" required>
            <SelectBox
              name="nationality"
              value={v.nationality || ""}
              onChange={handleNationalityChange}
              disabled={countriesLoading}
            >
              <option value="">{countriesLoading ? "Loading..." : "Select nationality"}</option>
              {countries.map((c) => (
                <option key={c.countryId} value={c.countryName}>
                  {c.countryName}
                </option>
              ))}
            </SelectBox>
          </Field>

          <Field label="Email ID" hi="ईमेल आईडी" required error={errors.emailId}>
            <input
              type="email"
              className={`gf-input ${errors.emailId ? "gf-error" : ""}`}
              value={v.emailId || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("emailId", e.target.value)}
              placeholder="email@example.com"
              disabled={isAutoFilled("emailId")}
            />
          </Field>
          <Field label="Mobile number" hi="मोबाइल नम्बर" required error={errors.mobileNo}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              className={`gf-input gf-mono ${errors.mobileNo ? "gf-error" : ""}`}
              value={v.mobileNo || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("mobileNo", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10 digit mobile number"
              disabled={isAutoFilled("mobileNo")}
            />
          </Field>
          <Field label="Confirm mobile number" hi="मोबाइल नंबर की पुष्टि" required error={errors.confirmMobileNo}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              className={`gf-input gf-mono ${errors.confirmMobileNo ? "gf-error" : ""}`}
              value={v.confirmMobileNo || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("confirmMobileNo", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Re-enter mobile number"
              disabled={isAutoFilled("mobileNo")}
            />
          </Field>

          <div className="md:col-span-2">
            <DateSelect
              value={dateValue("dob")}
              onChange={(field: DatePart, val: string) => setDatePart("dob", field, val)}
              onBlur={() => touchDateTrio("dob")}
              errors={dateErrors("dob", errors.dobDay)}
              touched={dateTouched("dob")}
              required
              label="Date of birth"
              hi="जन्म तिथि"
              note="As recorded in your Matriculation / 10th standard or equivalent certificate."
              maxYear={new Date().getFullYear()}
              minYear={1900}
            disabled={isAutoFilled("dateOfBirth") || isAutoFilled("dob") || isAutoFilled("dobDay")}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex items-center justify-between mt-1"
          style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
        >
          <div>
            <div className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
              AGE AS ON 01-08-2025
            </div>
            <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>
              दिनांक 01-08-2025 को आयु
            </div>
          </div>
          <div className="gf-mono text-lg font-bold" style={{ color: INK }}>
            {formatDuration(age)}
          </div>
        </div>

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
                {ageEligibility.ok ? "AGE ELIGIBILITY: CRITERIA MET" : "AGE ELIGIBILITY: NOT MET"}
              </div>
              <div className="text-[11.5px] font-medium mt-0.5 leading-relaxed" style={{ color: INK_SOFT }}>
                {ageEligibility.message}
                {ageEligibility.effectiveMaxAge != null &&
                  ` Applicable maximum age: ${ageEligibility.effectiveMaxAge} years (as on 01-08-2025).`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── IDENTIFICATION MARKS ── */}
      {/* ── IDENTIFICATION MARKS ── */}
<div>
  <SectionTitle icon={User}>Identification Marks · पहचान चिह्न</SectionTitle>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
    <Field label="Identification Mark 1 (English)" hi="पहचान चिह्न 1 (अंग्रेजी)">
      <input
        className="gf-input uppercase"
        value={v.identificationMarkEn || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => 
          setField("identificationMarkEn", e.target.value.replace(/[^a-zA-Z\s]/g, ""))
        }
        placeholder="e.g. Mole on left cheek"
      />
    </Field>
    <Field label="Identification Mark 2 (English)" hi="पहचान चिह्न 2 (अंग्रेजी)">
      <input
        className="gf-input uppercase"
        value={v.identificationMarkEn2 || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) => 
          setField("identificationMarkEn2", e.target.value.replace(/[^a-zA-Z\s]/g, ""))
        }
        placeholder="e.g. Scar on right hand"
      />
    </Field>
  </div>
</div>

      {/* ── MARITAL STATUS ── */}
      <div>
        <SectionTitle icon={User}>Marital Status · वैवाहिक स्थिति</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Marital Status" hi="वैवाहिक स्थिति" required error={errors.isMarried}>
            <PillGroup
              name="isMarried"
              value={v.isMarried || ""}
              onChange={(val) => setField("isMarried", val)}
              options={YES_NO}
            />
          </Field>
          {v.isMarried === "YES" && (
           <Field label="Spouse's name" hi="पति/पत्नी का नाम" required error={errors.spouseName}>
    <input
      className={`gf-input uppercase ${errors.spouseName ? "gf-error" : ""}`}
      value={v.spouseName || ""}
      onChange={(e: ChangeEvent<HTMLInputElement>) => 
        setField("spouseName", e.target.value.replace(/[^a-zA-Z\s]/g, ""))
      }
      maxLength={50}
      placeholder="Enter spouse's name"
    />
  </Field>
          )}
        </div>
      </div>

      {/* ── DOMICILE & CATEGORY ── */}
      <div>
        <SectionTitle icon={ShieldCheck}>Domicile &amp; Category / Reservation</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Domicile of Bihar state?" hi="बिहार राज्य का निवासी?" required error={errors.domicileOfBihar}>
            <PillGroup
              name="domicileOfBihar"
              value={v.domicileOfBihar || ""}
              onChange={(val) => setField("domicileOfBihar", val)}
              options={YES_NO}
              disabled={isAutoFilled("domicileOfBihar")}
            />
          </Field>

          {/* --- ADDED DOMICILE DOCS BLOCK --- */}
        {isBiharDomicile && (
          <div className="mt-2 p-4 rounded-xl mb-4" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
            <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
              Domicile Certificate Details · अधिवास प्रमाणपत्र विवरण
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Certificate number" hi="प्रमाणपत्र संख्या" required error={errors.domicileCertificateNumber}>
                <input
                  className={`gf-input uppercase ${errors.domicileCertificateNumber ? "gf-error" : ""}`}
                  value={v.domicileCertificateNumber || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("domicileCertificateNumber", e.target.value)}
                  placeholder="Enter certificate number"
                  disabled={isAutoFilled("domicileCertificateNumber")}
                />
              </Field>
              <Field
                label="Issuing authority"
                hi="जारीकर्ता प्राधिकारी"
                required
                error={errors.domicileCertificateAuthority}
              >
                <SelectBox
                  name="domicileCertificateAuthority"
                  value={v.domicileCertificateAuthority || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("domicileCertificateAuthority", e.target.value)}
                  error={errors.domicileCertificateAuthority}
                  disabled={isAutoFilled("domicileCertificateAuthority")}
                >
                  <option value="">Select authority</option>
                  {CATEGORY_AUTHORITY_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </SelectBox>
              </Field>
              <div className="md:col-span-2">
                <DateSelect
                  value={dateValue("domicileIssueDate")}
                  onChange={(field: DatePart, val: string) => setDatePart("domicileIssueDate", field, val)}
                  onBlur={() => touchDateTrio("domicileIssueDate")}
                  errors={dateErrors("domicileIssueDate", errors.domicileIssueDateDay)}
                  touched={dateTouched("domicileIssueDate")}
                  required
                  label="Issue date"
                  hi="जारी करने की तिथि"
                  maxYear={new Date().getFullYear()}
                  minYear={1900}
                  disabled={isAutoFilled("domicileCertificateIssueDate") || isAutoFilled("domicileIssueDateDay")}
                />
              </div>
            </div>
          </div>
        )}
        {/* --------------------------------- */}

          <Field
            label="Category"
            hi="श्रेणी"
            required
            error={errors.category}
          >
            <SelectBox
              name="category"
              value={v.category || ""}
              onChange={handleCategoryChange}
              error={errors.category}
              disabled={categoriesLoading || isAutoFilled("category") || isAutoFilled("categoryId")}
            >
              <option value="">{categoriesLoading ? "Loading..." : "Select category"}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </SelectBox>
          </Field>

          
          <Field
            label="Caste"
            hi="जाति"
            required={subCategories.length > 0}
            error={errors.caste}
          >
            <SelectBox
              name="caste"
              value={v.caste || ""}
              onChange={handleCasteChange}
              error={errors.caste}
              disabled={!v.categoryId || subCategories.length === 0 || isAutoFilled("caste") || isAutoFilled("casteId")}
            >
              <option value="">
                {subCategories.length === 0 ? "No sub-categories available" : "Select caste"}
              </option>
              {subCategories.map((sub) => (
                <option key={sub.value} value={sub.label}>
                  {sub.label}
                </option>
              ))}
            </SelectBox>
          </Field>

          <Field
            label="Do you belong to non-creamy layer?"
            hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?"
            required
            error={errors.isNonCreamyLayer}
          >
            <PillGroup
              name="isNonCreamyLayer"
              value={v.isNonCreamyLayer || ""}
              // onChange={(val) => setField("isNonCreamyLayer", val)}
              onChange={(val) => {
                setField("isNonCreamyLayer", val);
                // Clear the certificate data if they switch to "NO"
                if (val === "NO") {
                  setV((p) => ({
                    ...p,
                    categoryCertNo: "",
                    categoryAuthority: "",
                    categoryAuthorityOther: "",
                    categoryIssueDateDay: "",
                    categoryIssueDateMonth: "",
                    categoryIssueDateYear: "",
                  }));
                }
              }}
              options={YES_NO}
              disabled={isAutoFilled("isNonCreamyLayer")}
            />
          </Field>
        </div>

        {showCategoryDocs && (
          <div className="mt-2 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
            <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
              Category Certificate Details · श्रेणी प्रमाणपत्र विवरण
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Certificate number" hi="प्रमाणपत्र संख्या" required error={errors.categoryCertNo}>
                <input
                  className={`gf-input ${errors.categoryCertNo ? "gf-error" : ""}`}
                  value={v.categoryCertNo || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("categoryCertNo", e.target.value)}
                  placeholder="Enter certificate number"
                  disabled={isAutoFilled("categoryCertNo")}
                />
              </Field>
              <Field
                label="Issuing authority"
                hi="जारीकर्ता प्राधिकारी"
                required
                error={errors.categoryAuthority}
              >
                <div>
                  <SelectBox
                    name="categoryAuthority"
                    value={v.categoryAuthority || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("categoryAuthority", e.target.value)}
                    error={errors.categoryAuthority}
                    disabled={isAutoFilled("categoryAuthority")}
                  >
                    <option value="">Select authority</option>
                    {CATEGORY_AUTHORITY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </SelectBox>
                  {v.categoryAuthority === "Other" && (
                    <input
                      className={`gf-input mt-2 ${errors.categoryAuthorityOther ? "gf-error" : ""}`}
                      value={v.categoryAuthorityOther || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField("categoryAuthorityOther", e.target.value)}
                      placeholder="Specify issuing authority"
                    />
                  )}
                </div>
              </Field>
              <div className="md:col-span-2">
                <DateSelect
                  value={dateValue("categoryIssueDate")}
                  onChange={(field: DatePart, val: string) => setDatePart("categoryIssueDate", field, val)}
                  onBlur={() => touchDateTrio("categoryIssueDate")}
                  errors={dateErrors("categoryIssueDate", errors.categoryIssueDateDay)}
                  touched={dateTouched("categoryIssueDate")}
                  required
                  label="Issue date"
                  hi="जारी करने की तिथि"
                  maxYear={new Date().getFullYear()}
                  minYear={1900}
                  disabled={isAutoFilled("categoryIssueDate") || isAutoFilled("categoryIssueDateDay")}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isBiharDomicile && (
      <div>
        <SectionTitle icon={ShieldCheck}>Special Categories</SectionTitle>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Person with disability?" hi="दिव्यांगता वाले व्यक्ति?" required error={errors.disability}>
            <PillGroup
              name="disability"
              value={v.disability || ""}
              onChange={(val) => setField("disability", val)}
              options={YES_NO}
              disabled={isAutoFilled("disability")}
            />
          </Field>

          {isPwD && (
            <Field label="Type of disability" hi="दिव्यांगता का प्रकार" note={disabilitiesLoading ? "Loading disabilities..." : undefined}>
              <SelectBox
                name="natureOfDisability"
                value={v.natureOfDisability || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("natureOfDisability", e.target.value)}
                disabled={disabilitiesLoading || isAutoFilled("natureOfDisability")}
              >
                <option value="">{disabilitiesLoading ? "Loading..." : "Select disability type"}</option>
                {disabilities.map((dis) => (
                  <option key={dis.id} value={dis.name}>{dis.name}</option>
                ))}
              </SelectBox>
            </Field>
          )}

          <Field
            label="Nature of disability?"
            hi="दिव्यांगता की प्रकृति"
            required={isPwD}
            error={errors.natureOfDisabilityType}
          >
            <PillGroup
              name="natureOfDisabilityType"
              value={v.natureOfDisabilityType || ""}
              onChange={(val) => setField("natureOfDisabilityType", val)}
              options={["PERMANENT", "TEMPORARY"]}
              disabled={!isPwD || isAutoFilled("natureOfDisabilityType")}
            />
          </Field>

          <Field
            label="Minimum 40% disability?"
            hi="न्यूनतम 40% दिव्यांगता?"
            required
            error={errors.disabilityPercent}
          >
            <PillGroup
              name="disabilityPercent"
              value={v.disabilityPercent || ""}
              onChange={(val) => setField("disabilityPercent", val)}
              options={YES_NO_NA}
              disabled={!isPwD || isAutoFilled("disabilityPercent")}
            />
          </Field>

          {isMin40PwD && (
            <Field label="Is scribe required?" hi="क्या लेखक (स्क्राइब) की आवश्यकता है?" required error={errors.isScribeRequired}>
              <PillGroup
                name="isScribeRequired"
                value={v.isScribeRequired || ""}
                onChange={(val) => setField("isScribeRequired", val)}
                options={YES_NO}
                disabled={isAutoFilled("isScribeRequired", "scribeRequired", "isScribe")}
              />
            </Field>
          )}
        </div> */}

        {/* <SectionTitle icon={ShieldCheck}>Special Categories</SectionTitle> */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Person with disability?" hi="दिव्यांगता वाले व्यक्ति?" required error={errors.disability}>
            <PillGroup
              name="disability"
              value={v.disability || ""}
              onChange={(val) => setField("disability", val)}
              options={YES_NO}
              disabled={isAutoFilled("disability")}
            />
          </Field>

          {/* This wrapper ensures these 3 fields ONLY show if Person with Disability is YES */}
          {isPwD && (
            <>
              <Field label="Type of disability" hi="दिव्यांगता का प्रकार" note={disabilitiesLoading ? "Loading disabilities..." : undefined}>
                <SelectBox
                  name="natureOfDisability"
                  value={v.natureOfDisability || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("natureOfDisability", e.target.value)}
                  disabled={disabilitiesLoading || isAutoFilled("natureOfDisability", "pwdType")}
                >
                  <option value="">{disabilitiesLoading ? "Loading..." : "Select disability type"}</option>
                  {disabilities.map((dis) => (
                    <option key={dis.id} value={dis.name}>{dis.name}</option>
                  ))}
                </SelectBox>
              </Field>

              <Field
                label="Nature of disability?"
                hi="दिव्यांगता की प्रकृति"
                required={isPwD}
                error={errors.natureOfDisabilityType}
              >
                <PillGroup
                  name="natureOfDisabilityType"
                  value={v.natureOfDisabilityType || ""}
                  onChange={(val) => setField("natureOfDisabilityType", val)}
                  options={["PERMANENT", "TEMPORARY"]}
                  disabled={isAutoFilled("natureOfDisabilityType", "disTypePersist")}
                />
              </Field>

              <Field
                label="Minimum 40% disability?"
                hi="न्यूनतम 40% दिव्यांगता?"
                required
                error={errors.disabilityPercent}
              >
                <PillGroup
                  name="disabilityPercent"
                  value={v.disabilityPercent || ""}
                  onChange={(val) => setField("disabilityPercent", val)}
                  options={YES_NO_NA}
                  disabled={isAutoFilled("disabilityPercent", "pwd40Percent")}
                />
              </Field>
            </>
          )}

          {/* Scribe field only shows if Minimum 40% is YES */}
          {isMin40PwD && (
            <Field label="Is scribe required?" hi="क्या लेखक (स्क्राइब) की आवश्यकता है?" required error={errors.isScribeRequired}>
              <PillGroup
                name="isScribeRequired"
                value={v.isScribeRequired || ""}
                onChange={(val) => setField("isScribeRequired", val)}
                options={YES_NO}
                disabled={isAutoFilled("isScribeRequired", "scribeRequired", "isScribe", "isownscribe")}
              />
            </Field>
          )}
        </div>

        {isPwD && (
          <div className="mt-2 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
            <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
              Disability Certificate Details · दिव्यांगता प्रमाणपत्र विवरण
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Certificate number" hi="प्रमाणपत्र संख्या" required error={errors.disabilityCertNo}>
                <input
                  className={`gf-input ${errors.disabilityCertNo ? "gf-error" : ""}`}
                  value={v.disabilityCertNo || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("disabilityCertNo", e.target.value)}
                  placeholder="Enter certificate number"
                  disabled={isAutoFilled("disabilityCertNo", "pwdCertificateNumber", "pwdCertNo")}
                />
              </Field>
              <Field label="Issuing authority" hi="जारीकर्ता प्राधिकारी" required error={errors.disabilityAuthority}>
                <div>
                  <SelectBox
                    name="disabilityAuthority"
                    value={v.disabilityAuthority || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("disabilityAuthority", e.target.value)}
                    error={errors.disabilityAuthority}
                    disabled={isAutoFilled("disabilityAuthority", "pwdCertificateAuthority", "pwdAuthority")}
                  
                  >
                    <option value="">Select authority</option>
                    {DISABILITY_AUTHORITY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </SelectBox>
                  {v.disabilityAuthority === "Other" && (
                    <input
                      className={`gf-input mt-2 ${errors.disabilityAuthorityOther ? "gf-error" : ""}`}
                      value={v.disabilityAuthorityOther || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField("disabilityAuthorityOther", e.target.value)}
                      placeholder="Specify issuing authority"
                    />
                  )}
                </div>
              </Field>
              <div className="md:col-span-2">
                <DateSelect
                  value={dateValue("disabilityIssueDate")}
                  onChange={(field: DatePart, val: string) => setDatePart("disabilityIssueDate", field, val)}
                  onBlur={() => touchDateTrio("disabilityIssueDate")}
                  errors={dateErrors("disabilityIssueDate", errors.disabilityIssueDateDay)}
                  touched={dateTouched("disabilityIssueDate")}
                  required
                  label="Issue date"
                  hi="जारी करने की तिथि"
                  maxYear={new Date().getFullYear()}
                  minYear={1900}
                  disabled={isAutoFilled("disabilityIssueDate", "disabilityIssueDateDay", "pwdCertificateIssueDate")}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-5">
          <Field label="Ex-serviceman?" hi="भूतपूर्व सैनिक?" required error={errors.exServiceman}>
            <PillGroup
              name="exServiceman"
              value={v.exServiceman || ""}
              onChange={(val) => setField("exServiceman", val)}
              options={YES_NO}
              disabled={isAutoFilled("exServiceman")}
            />
          </Field>


        </div>

        {isExServiceman && (
          <div className="mt-2">
            <DateSelect
              value={dateValue("serviceFrom")}
              onChange={(field: DatePart, val: string) => setDatePart("serviceFrom", field, val)}
              onBlur={() => touchDateTrio("serviceFrom")}
              errors={dateErrors("serviceFrom", errors.serviceFromDay)}
              touched={dateTouched("serviceFrom")}
              required
              label="Service in defence — from date"
              hi="रक्षा में सेवा — दिनांक से"
              maxYear={new Date().getFullYear()}
              minYear={1900}
              disabled={isAutoFilled("serviceFromDate") || isAutoFilled("serviceFromDay")}
            />
            <DateSelect
              value={dateValue("serviceTo")}
              onChange={(field: DatePart, val: string) => setDatePart("serviceTo", field, val)}
              onBlur={() => touchDateTrio("serviceTo")}
              errors={dateErrors("serviceTo", errors.serviceToDay)}
              touched={dateTouched("serviceTo")}
              required
              label="Service in defence — to date"
              hi="रक्षा में सेवा — दिनांक तक"
              maxYear={new Date().getFullYear()}
              minYear={1900}
              disabled={isAutoFilled("serviceToDate") || isAutoFilled("serviceToDay")}
            />
            {serviceDuration && (
              <div
                className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
              >
                <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
                  DURATION · अवधि
                </span>
                <span className="gf-mono text-sm font-bold" style={{ color: INK }}>
                  {formatDuration(serviceDuration)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-5">
          <Field label="Ward of freedom fighter?" hi="स्वतंत्रता सेनानी के वार्ड?" required error={errors.wardOfFreedomFighter}>
            <PillGroup
              name="wardOfFreedomFighter"
              value={v.wardOfFreedomFighter || ""}
              onChange={(val) => setField("wardOfFreedomFighter", val)}
              options={YES_NO}
            />
          </Field>
         {v.wardOfFreedomFighter === "YES" && (
            <CertNumberDateAuthority
              v={v}
              setField={setField}
              prefixNo="freedomFighterCertNo"
              prefixAuth="freedomFighterAuthority"
              labelNo="Certificate no."
              hiNo="प्रमाणपत्र संख्या"
              labelAuth="Issuing authority"
              hiAuth="जारीकर्ता प्राधिकारी"
              authOptions={["DM", "Authorized by DM"]} // <-- ADDED: Passes dropdown options
            />
          )}
        </div>
      </div>
      )}

      {isBiharDomicile && (
      <div>
        <SectionTitle icon={Briefcase}>Employment Status</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Bihar govt. employee, 3+ years continuous service?"
            hi="बिहार सरकार के कर्मचारी, 3+ वर्ष सेवा?"
            required
            error={errors.biharGovtEmployee}
          >
            <PillGroup
              name="biharGovtEmployee"
              value={v.biharGovtEmployee || ""}
              onChange={(val) => setField("biharGovtEmployee", val)}
              options={YES_NO}
              disabled={isAutoFilled("biharGovtEmployee")}
            />
          </Field>
          <Field label="Number of prior attempts (after 12-12-2022)" hi="पूर्व प्रयासों की संख्या" required error={errors.numberOfAttempts}>
            <SelectBox
              name="numberOfAttempts"
              value={v.numberOfAttempts || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("numberOfAttempts", e.target.value)}
              error={errors.numberOfAttempts}
              disabled={isAutoFilled("numberOfAttempts")}
            >
              <option value="" disabled hidden >Select</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </SelectBox>
          </Field>
          <Field label="Contractual employee?" hi="संविदा कर्मी?" required error={errors.contractualEmployee}>
            <PillGroup
              name="contractualEmployee"
              value={v.contractualEmployee || ""}
              onChange={(val) => setField("contractualEmployee", val)}
              options={YES_NO}
              disabled={isAutoFilled("contractualEmployee")} 
            />
          </Field>
          {isContractual && (
            <>
              <Field label="Organization Name" hi="संगठन का नाम" required error={errors.organizationName}>
                <input
                  className={`gf-input ${errors.organizationName ? "gf-error" : ""}`}
                  value={v.organizationName || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("organizationName", e.target.value)}
                  placeholder="Enter organization name"
                  disabled={isAutoFilled("organizationName")} 
                />
              </Field>
              <Field
                label="Do you have experience in the post mentioned in this advertisement?"
                hi="क्या आपके पास इस विज्ञापन में उल्लिखित पद का अनुभव है?"
                required
                error={errors.hasPostExperience}
              >
                <div>
                  <PillGroup
                    name="hasPostExperience"
                    value={v.hasPostExperience || ""}
                    onChange={(val) => setField("hasPostExperience", val)}
                    options={YES_NO}
                    disabled={isAutoFilled("hasPostExperience")} 
                  />
                  {v.hasPostExperience === "NO" && (
                    <div
                      className="text-[11px] font-medium mt-1.5 p-2 rounded"
                      style={{ color: DANGER, background: "#FBEAE6" }}
                    >
                      ⚠️ Otherwise, you will not be entitled for weightage.
                    </div>
                  )}
                </div>
              </Field>
              <Field label="Name of post" hi="पद का नाम" required error={errors.nameOfPost}>
                <input
                  className={`gf-input ${errors.nameOfPost ? "gf-error" : ""}`}
                  value={v.nameOfPost || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("nameOfPost", e.target.value)}
                  disabled={isAutoFilled("nameOfPost")}
                />
              </Field>
              <Field label="Agreement under circular 1003?" hi="संकल्प 1003 के अनुसार एकरारनामा?">
                <PillGroup
                  name="agreementCircular"
                  value={v.agreementCircular || ""}
                  onChange={(val) => setField("agreementCircular", val)}
                  options={YES_NO_NA}
                   disabled={isAutoFilled("agreementCircular")}
                />
              </Field>
            </>
          )}
        </div>

        {isContractual && (
          <div className="mt-2">
            <div className="text-[12px] font-extrabold tracking-wide mb-2" style={{ color: INK }}>
              Contractual service period · संविदा सेवा अवधि
            </div>
            <DateSelect
              value={dateValue("contractualFrom")}
              onChange={(field: DatePart, val: string) => setDatePart("contractualFrom", field, val)}
              onBlur={() => touchDateTrio("contractualFrom")}
              errors={dateErrors("contractualFrom", errors.contractualFromDay)}
              touched={dateTouched("contractualFrom")}
              required
              label="From date"
              hi="दिनांक से"
              maxYear={new Date().getFullYear()}
              minYear={1900}
              disabled={isAutoFilled("contractualFromDate", "contractualFromDay")}
            />
            <DateSelect
              value={dateValue("contractualTo")}
              onChange={(field: DatePart, val: string) => setDatePart("contractualTo", field, val)}
              onBlur={() => touchDateTrio("contractualTo")}
              errors={dateErrors("contractualTo", errors.contractualToDay)}
              touched={dateTouched("contractualTo")}
              required
              label="To date"
              hi="दिनांक तक"
              maxYear={new Date().getFullYear()}
              minYear={1900}
              disabled={isAutoFilled("contractualToDate") || isAutoFilled("contractualToDay")}  // ✅ add
            />
            {contractualDuration && (
              <div
                className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
              >
                <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
                  DURATION · अवधि
                </span>
                <span className="gf-mono text-sm font-bold" style={{ color: INK }}>
                  {formatDuration(contractualDuration)}
                </span>
              </div>
            )}
          </div>
        )}

        
        
      </div>
      )}

      <div className="mt-5">
          <Field label="Debarred from any examination?" hi="किसी परीक्षा से वंचित?" required error={errors.isDebarred}>
            <PillGroup
              name="isDebarred"
              value={v.isDebarred || ""}
              onChange={(val) => setField("isDebarred", val)}
              options={YES_NO}
            />
          </Field>

          {/* ── Debarred Details — appears only when "Have you ever been
               debarred?" is YES: From date, To date, auto-computed
               Duration, and a free-text Reason for Debarment. ── */}
          {isDebarred && (
            <div className="mt-2 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
              <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
                Debarment Details · वंचन विवरण
              </div>
              
              {/* --- ADDED RECRUITMENT BOARD FIELD --- */}
              <div className="mb-4">
                <Field label="Recruitment Board/Commission" hi="भर्ती बोर्ड/आयोग" required error={errors.recruitmentBoard}>
                  <input
                    className={`gf-input uppercase ${errors.recruitmentBoard ? "gf-error" : ""}`}
                    value={v.recruitmentBoard || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("recruitmentBoard", e.target.value)}
                    placeholder="Enter Recruitment Board/Commission"
                  />
                </Field>
              </div>
              {/* ------------------------------------- */}

              
              <DateSelect
                value={dateValue("debarredFrom")}
                onChange={(field: DatePart, val: string) => setDatePart("debarredFrom", field, val)}
                onBlur={() => touchDateTrio("debarredFrom")}
                errors={dateErrors("debarredFrom", errors.debarredFromDay)}
                touched={dateTouched("debarredFrom")}
                required
                label="From date"
                hi="दिनांक से"
                maxYear={new Date().getFullYear()}
                minYear={1900}
              />
              <DateSelect
                value={dateValue("debarredTo")}
                onChange={(field: DatePart, val: string) => setDatePart("debarredTo", field, val)}
                onBlur={() => touchDateTrio("debarredTo")}
                errors={dateErrors("debarredTo", errors.debarredToDay)}
                touched={dateTouched("debarredTo")}
                required
                label="To date"
                hi="दिनांक तक"
                maxYear={new Date().getFullYear()}
                minYear={1900}
              />
              {debarredDuration && (
                <div
                  className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                  style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
                >
                  <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
                    DURATION · अवधि
                  </span>
                  <span className="gf-mono text-sm font-bold" style={{ color: INK }}>
                    {formatDuration(debarredDuration)}
                  </span>
                </div>
              )}
              <div className="mt-3">
                <Field label="Reason for debarment" hi="वंचन का कारण" required error={errors.debarmentReason}>
                  <input
                    className={`gf-input uppercase ${errors.debarmentReason ? "gf-error" : ""}`}
                    value={v.debarmentReason || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("debarmentReason", e.target.value)}
                    placeholder="Enter reason for debarment"
                  />
                </Field>
              </div>
            </div>
          )}
        </div>

      {/* ── ID PROOF ── */}
     {/* ── ID PROOF ── */}
      <div>
        <SectionTitle icon={User}>ID Proof</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          
          <Field label="Do you have an Aadhar card?" hi="क्या आपके पास आधार कार्ड है?" required error={errors.hasAadharCard}>
            <PillGroup
              name="hasAadharCard"
              value={v.hasAadharCard || ""}
              onChange={(val) => {
                setField("hasAadharCard", val);
                // Clear the other ID fields if Aadhar is selected
                if (val === "YES") {
                  setV((p) => ({
                    ...p,
                    typeOfPhotoIdProof: "",
                    idProofNo: "",
                    governmentIdNumber: "",
                  }));
                }
              }}
              options={YES_NO}
            />
          </Field>

          {v.hasAadharCard === "YES" && (
            <Field label="Aadhar number" hi="आधार संख्या" error={errors.aadharCardNumber}>
              <input
                className={`gf-input gf-mono ${errors.aadharCardNumber ? "gf-error" : ""}`}
                maxLength={12}
                value={v.aadharCardNumber || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField("aadharCardNumber", e.target.value.replace(/\D/g, ""))
                }
                placeholder="12-digit Aadhar number"
              />
            </Field>
          )}

          {/* Show Other ID Proof ONLY if Aadhar is NOT "YES" */}
          {v.hasAadharCard !== "YES" && (
            <>
              <Field label="Other Photo ID Proof" hi="अन्य फोटो पहचान प्रमाण">
                <select
                  className="gf-select"
                  value={v.typeOfPhotoIdProof || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("typeOfPhotoIdProof", e.target.value)}
                >
                  <option value="" disabled hidden>Select Other Photo ID Proof</option>
                  <option value="PAN">PAN Card</option>
                  <option value="VOTER_ID">Voter ID</option>
                  <option value="PASSPORT">Passport</option>
                  <option value="DRIVING_LICENSE">Driving License</option>
                  <option value="GOVERNMENT_ID">Government ID Proof</option>
                </select>
              </Field>

              {/* Show ID Proof Number ONLY when an option is selected AND it is NOT "GOVERNMENT_ID" */}
              {v.typeOfPhotoIdProof && v.typeOfPhotoIdProof !== "GOVERNMENT_ID" && (
                <Field label="ID proof number" hi="पहचान प्रमाण संख्या">
                  <input
                    className="gf-input uppercase"
                    value={v.idProofNo || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("idProofNo", e.target.value)}
                    placeholder="Enter ID proof number"
                  />
                </Field>
              )}

              {v.typeOfPhotoIdProof === "GOVERNMENT_ID" && (
                <Field
                  label="Government ID number"
                  hi="सरकारी पहचान संख्या"
                  required
                  error={errors.governmentIdNumber}
                >
                  <input
                    className={`gf-input ${errors.governmentIdNumber ? "gf-error" : ""}`}
                    value={v.governmentIdNumber || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("governmentIdNumber", e.target.value)}
                    placeholder="Enter government ID number"
                  />
                </Field>
              )}
            </>
          )}

        </div>
      </div>

     
    
      {/* ── ADDRESSES ── */}
      <div>
        <SectionTitle icon={User}>Permanent Address</SectionTitle>
        <AddressFields
          prefix="perm"
          v={v}
          setField={setField}
          errors={errors}
          states={states}
          statesLoading={statesLoading}
          districts={permDistricts}
          districtsLoading={permDistrictsLoading}
          onStateChange={handleStateChange("perm")}
          onDistrictChange={handleDistrictChange("perm")}
          disableState={v.domicileOfBihar === "YES"}
        />
      </div>

      <div>
        <SectionTitle icon={User}>Correspondence Address</SectionTitle>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={!!v.sameAsPermanent}
            onChange={(e: ChangeEvent<HTMLInputElement>) => toggleSame(e.target.checked)}
            className="w-4 h-4"
            style={{ accentColor: INK }}
          />
          <span className="text-[13px] font-semibold" style={{ color: INK }}>
            Same as permanent address · स्थायी पते के समान
          </span>
        </label>
        <AddressFields
          prefix="corr"
          v={v}
          setField={setField}
          errors={errors}
          disabled={!!v.sameAsPermanent}
          states={states}
          statesLoading={statesLoading}
          districts={v.sameAsPermanent ? permDistricts : corrDistricts}
          districtsLoading={v.sameAsPermanent ? permDistrictsLoading : corrDistrictsLoading}
          onStateChange={handleStateChange("corr")}
          onDistrictChange={handleDistrictChange("corr")}
        />
      </div>

<div className="flex justify-end pt-2">
  <button
    className="gf-btn-primary"
    disabled={isSavingStep1}
    onClick={handleSaveNext}
  >
    {isSavingStep1 ? (
      <>
        <Loader2 size={15} className="gf-spin" /> Saving…
      </>
    ) : (
      <>
        Save &amp; Next <ChevronRight size={15} />
      </>
    )}
  </button>
</div>
    </div>
  );
};


/* ---------------------------------------------------------------
/* ---------------------------------------------------------------
   STEP 2 — PAYMENT
--------------------------------------------------------------- */
// const Step2Payment: React.FC<Step2Props & { applicationId?: string }> = ({
//   data,
//   onSave,
//   applicationId,
// }) => {
//   const [v, setV] = useState<PaymentData & { previouslyRegistered?: string; previousRegistrationNumber?: string }>({ ...data });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSavingStep2, setIsSavingStep2] = useState(false);

//   // --- STATES FOR PREVIOUS REGISTRATION VERIFICATION ---
//   const [isVerifying, setIsVerifying] = useState(false);
//   const [isVerified, setIsVerified] = useState(false);
//   const [verifyError, setVerifyError] = useState("");
//   const [verificationFailed, setVerificationFailed] = useState(false);

//   const [verificationModal, setVerificationModal] = useState<{
//     isOpen: boolean;
//     type: "success" | "error";
//     message: string;
//   }>({ isOpen: false, type: "success", message: "" });

//   // -----------------------------------------------------------

//   const [feePayment, setFeePayment] = useState<{
//     applicationFee: string;
//     transactionId: string;
//     paymentStatus: "pending" | "processing" | "completed" | "failed";
//     paymentDate: string;
//   }>({
//     applicationFee: "",
//     transactionId: "",
//     paymentStatus: "pending",
//     paymentDate: "",
//   });
//   const [feeLoading, setFeeLoading] = useState(false);
//   const [feeError, setFeeError] = useState("");

//   useEffect(() => {
//     const initializePaymentInfo = async () => {
//       if (!applicationId) return;
//       if (feePayment.paymentStatus === "completed") return;
      
//       // If previously registered is YES AND verification hasn't failed, skip loading fee details
//       if (v.previouslyRegistered === "YES" && !verificationFailed) return;

//       try {
//         setFeeLoading(true);
//         const response = await paymentApi.initiate(applicationId, "online");
//         if (response.data?.success === true) {
//           const orderData: any = response.data.data;
//           setFeePayment((prev) => ({
//             ...prev,
//             applicationFee: orderData?.amount?.toString() || "0",
//             transactionId: orderData?.paymentOrderId || prev.transactionId,
//           }));
//         }
//       } catch (error: any) {
//         if (
//           error?.response?.data?.message ===
//           "Payment has already been completed for this application"
//         ) {
//           setFeePayment((prev) => ({
//             ...prev,
//             paymentStatus: "completed",
//             transactionId: "Already Completed",
//             paymentDate: new Date().toISOString().split("T")[0],
//           }));
//         } else {
//           setFeeError(
//             error?.response?.data?.message || error?.message || "Error initializing payment info",
//           );
//         }
//       } finally {
//         setFeeLoading(false);
//       }
//     };

//     initializePaymentInfo();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [applicationId, v.previouslyRegistered, verificationFailed]);

//   // --- API CALL TO VERIFY PREVIOUS REGISTRATION ---
//   // 👉 2. REPLACE your handleVerifyRegistration with this:
//   const handleVerifyRegistration = async () => {
//     if (!v.previousRegistrationNumber?.trim()) {
//       setVerifyError("Please enter previous registration number");
//       return;
//     }
    
//     setVerifyError("");
//     setVerificationFailed(false);
//     try {
//       setIsVerifying(true);
      
//       let success = false;
//       let apiMessage = "";
      
//       if (typeof applicationApi.verifyPreviousRegistration === 'function') {
//         const res = await applicationApi.verifyPreviousRegistration({ oldRegistrationNumber: v.previousRegistrationNumber });
//         success = res.data?.success === true;
//         apiMessage = res.data?.message || "";
//       } else {
//         // Fallback using the provided axios instance and ENV base URL
//         const res = await api.post(`${API_BASE_URL}/auth/candidate/verify-previous-registration`, { 
//           oldRegistrationNumber: v.previousRegistrationNumber 
//         });
//         success = res.data?.success === true;
//         apiMessage = res.data?.message || "";
//       }

//       if (success) {
//         setIsVerified(true);
//         // OPEN SUCCESS POPUP
//         setVerificationModal({
//           isOpen: true,
//           type: "success",
//           message: "Your registration was found! You do not need to pay the application fee."
//         });
//       } else {
//         setIsVerified(false);
//         setVerificationFailed(true);
//         const msg = apiMessage || "Your registration number was not found. Please proceed with payment.";
//         setVerifyError(msg);
//         // OPEN FAILURE POPUP
//         setVerificationModal({
//           isOpen: true,
//           type: "error",
//           message: msg
//         });
//       }
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || err?.message || "Invalid Registration Number. Verification failed.";
//       setIsVerified(false);
//       setVerificationFailed(true);
//       setVerifyError(msg);
//       // OPEN FAILURE POPUP
//       setVerificationModal({
//         isOpen: true,
//         type: "error",
//         message: msg
//       });
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!v.previouslyRegistered) e.previouslyRegistered = "Please declare if you are previously registered";
    
//     // Only validate payment if they are NOT previously registered OR verification failed
//     if (v.previouslyRegistered !== "YES" || verificationFailed) {
//       if (!v.paymentMode) e.paymentMode = "Please select a payment mode";
//       if (!v.paymentAcknowledged) e.paymentAcknowledged = "You must acknowledge the fee terms";
//     }
    
//     setErrors(e);
//     if (Object.keys(e).length > 0) {
//       notifyError(Object.values(e)[0]);
//     }
//     return Object.keys(e).length === 0;
//   };

//   // --- SAVE & NEXT FOR PREVIOUSLY REGISTERED USERS (NO PAYMENT) ---
//   const handleNextWithoutPayment = async () => {
//     if (!isVerified) {
//       notifyError("Please verify your previous registration before proceeding.");
//       return;
//     }
//     try {
//       setIsSavingStep2(true);
//       // Persist step 2 (bypassing actual money payment since they registered previously)
//       await applicationApi.saveStep2({
//         applicationId,
//         ...v,
//         transactionId: "PREVIOUSLY_REGISTERED",
//         applicationFee: "0",
//       });
//       notifySuccess("Registration verified. Proceeding to next step.");
//       onSave(v as any);
//     } catch (err: any) {
//       const msg = err?.response?.data?.message || err?.message || "Failed to save details.";
//       notifyError(msg);
//     } finally {
//       setIsSavingStep2(false);
//     }
//   };

//   // --- STANDARD PAYMENT FLOW ---

// const handleProceedToPay = async () => {
//   if (!validate()) return;

//   setFeeError("");
//   setFeePayment((prev) => ({ ...prev, paymentStatus: "processing" }));

//   try {
//     setIsSavingStep2(true);

//     await applicationApi.saveStep2({
//       applicationId,
//       ...v,
//       transactionId: feePayment.transactionId,
//       applicationFee: feePayment.applicationFee,
//     });

//     const response = await paymentApi.initiate(applicationId, v.paymentMode);

//     if (
//       response.data?.success === false &&
//       response.data?.message ===
//         "Payment has already been completed for this application"
//     ) {
//       setFeePayment((prev) => ({
//         ...prev,
//         paymentStatus: "completed",
//         transactionId: "Already Completed",
//         paymentDate: new Date().toISOString().split("T")[0],
//       }));

//       notifySuccess("Payment already completed. Proceeding to review.");
//       onSave(v as any);
//       return;
//     }

//     if (response.data?.success === true) {
//       const orderData: any = response.data.data;
//       console.log("HTML FORM", orderData);

//       setFeePayment((prev) => ({
//         ...prev,
//         applicationFee:
//           orderData?.amount?.toString() || prev.applicationFee,
//         transactionId:
//           orderData?.paymentOrderId || prev.transactionId,
//       }));

//       // FREE PAYMENT
//       if (orderData?.isFree === true || orderData?.amount === 0) {
//         if (orderData?.htmlForm) {
//           notifySuccess("Redirecting...");

//           document.open();
//           document.write(orderData.htmlForm);
//           document.close();

//           return;
//         }

//         setFeePayment((prev) => ({
//           ...prev,
//           paymentStatus: "completed",
//           transactionId: orderData?.paymentOrderId || "FREE",
//           paymentDate: new Date().toISOString().split("T")[0],
//         }));

//         notifySuccess("No payment required. Proceeding to review.");
//         onSave(v as any);
//         return;
//       }

//       // SBI PAYMENT
//       if (orderData?.htmlForm) {
//         notifySuccess("Redirecting to payment gateway...");

//         console.log("HTML FORM", orderData.htmlForm);

//         document.open();
//         document.write(orderData.htmlForm);
//         document.close();

//         return;
//       }

//       const msg = "HTML form not received from server.";
//       setFeeError(msg);
//       notifyError(msg);
//       setFeePayment((prev) => ({
//         ...prev,
//         paymentStatus: "failed",
//       }));

//       return;
//     }

//     const msg =
//       response.data?.message || "Payment initiation failed.";

//     setFeeError(msg);
//     notifyError(msg);

//     setFeePayment((prev) => ({
//       ...prev,
//       paymentStatus: "failed",
//     }));
//   } catch (err: any) {
//     if (
//       err?.response?.data?.message ===
//       "Payment has already been completed for this application"
//     ) {
//       setFeePayment((prev) => ({
//         ...prev,
//         paymentStatus: "completed",
//         transactionId: "Already Completed",
//         paymentDate: new Date().toISOString().split("T")[0],
//       }));

//       notifySuccess("Payment already completed. Proceeding to review.");
//       onSave(v as any);
//       return;
//     }

//     const msg =
//       err?.response?.data?.message ||
//       err?.message ||
//       "Failed to initiate payment. Please try again.";

//     setFeeError(msg);
//     notifyError(msg);

//     setFeePayment((prev) => ({
//       ...prev,
//       paymentStatus: "failed",
//     }));
//   } finally {
//     setIsSavingStep2(false);
//   }
// };

//   return (
//     <div className="space-y-6">

//       {/* --- PREVIOUS REGISTRATION SECTION --- */}
//       <div>
//         <SectionTitle icon={User}>Previous Registration</SectionTitle>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//           <Field 
//             label="Are you previously registered for Adv No. - 05/25, Post- 4th Graduate Level Combined Competitive Exam?" 
//             hi="क्या आप विज्ञापन संख्या 05/25, पद - चतुर्थ स्नातक स्तरीय संयुक्त प्रतियोगी परीक्षा में पंजीकृत हैं?"
//             required 
//             error={errors.previouslyRegistered}
//           >
//             <PillGroup
//               name="previouslyRegistered"
//               value={v.previouslyRegistered || ""}
//               onChange={(val) => {
//                 setV((p) => ({ ...p, previouslyRegistered: val }));
//                 setIsVerified(false); // Reset verification if toggled
//                 setVerificationFailed(false);
//                 setVerifyError("");
//               }}
//               options={["YES", "NO"]}
//             />
//           </Field>
          
//           {v.previouslyRegistered === "YES" && (
//             <Field 
//               label="Previous Registration Number" 
//               hi="पिछली पंजीकरण संख्या"
//               required 
//               error={errors.previousRegistrationNumber || verifyError}
//             >
//               <div className="flex flex-col gap-3">
//                 <input
//                   className={`gf-input ${errors.previousRegistrationNumber || verifyError ? "gf-error" : ""}`}
//                   value={v.previousRegistrationNumber || ""}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                     setV((p) => ({ ...p, previousRegistrationNumber: e.target.value }));
//                     setIsVerified(false); // Reset verified state if user types something new
//                     setVerificationFailed(false);
//                     setVerifyError("");
//                   }}
//                   placeholder="Enter previous registration number"
//                   disabled={isVerified}
//                 />
                
//                 {/* Conditionally show Verify Button or Success status */}
//                 {!isVerified ? (
//                   <button 
//                     onClick={handleVerifyRegistration}
//                     disabled={isVerifying || !v.previousRegistrationNumber?.trim()}
//                     className="gf-btn-secondary w-max"
//                   >
//                     {isVerifying ? (
//                       <><Loader2 size={15} className="gf-spin" /> Verifying...</>
//                     ) : (
//                       "Verify Registration"
//                     )}
//                   </button>
//                 ) : (
//                   <div className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color: TEAL }}>
//                     <CheckCircle2 size={16} /> Verified Successfully
//                   </div>
//                 )}
//               </div>
//             </Field>
//           )}
//         </div>
//       </div>

//       {/* --- PAYMENT SECTION --- */}
//       {(v.previouslyRegistered !== "YES" || verificationFailed) && (
//         <>
//           <SectionTitle icon={CreditCard}>Examination Fee</SectionTitle>

//           <div
//             className="rounded-xl overflow-hidden"
//             style={{ border: `1px solid ${LINE}` }}
//           >
//             <div
//               className="px-4 py-2.5 text-[11px] font-extrabold tracking-wide"
//               style={{ background: INK, color: "#fff" }}
//             >
//               FEE STRUCTURE · शुल्क संरचना
//             </div>
//             <table className="w-full text-[12.5px]">
//               <tbody>
//                 <tr>
//                   <td className="py-2.5 px-4 font-semibold" style={{ color: INK }}>
//                     As per the Resolution No. 15568, dated 21.08.2025, issued by the General Administration Department, Government of Bihar, Patna, the examination fee has been fixed at ₹100 (Rupees One Hundred only) for all candidates.
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>

//           <div
//             className="rounded-2xl p-6"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div className="text-[12.5px] font-extrabold mb-2" style={{ color: INK }}>
//               Your applicable fee · आपका लागू शुल्क
//             </div>
//             <div
//               className="flex items-center gap-3 p-3 rounded-xl mb-6"
//               style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
//             >
//               {feeLoading ? (
//                 <Loader2 size={18} className="gf-spin" style={{ color: TEAL }} />
//               ) : (
//                 <CheckCircle2 size={18} style={{ color: TEAL }} />
//               )}
//               <div>
//                 <div className="gf-mono text-lg font-extrabold" style={{ color: TEAL }}>
//                   {feePayment.applicationFee ? `₹${feePayment.applicationFee}` : "₹135"}
//                 </div>
//                 <div className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>
//                   {feePayment.paymentStatus === "completed"
//                     ? "Fee already paid for this application"
//                     : ""}
//                 </div>
//               </div>
//             </div>
//             {feeError && (
//               <div className="mb-4">
//                 <Note tone="danger">{feeError}</Note>
//               </div>
//             )}

//             <Field
//               label="Select payment mode"
//               hi="भुगतान का तरीका चुनें"
//               required
//               error={errors.paymentMode}
//             >
//               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                 {[
//                   { v: "CREDIT_CARD", l: "Credit Card", hi: "क्रेडिट कार्ड" },
//                   { v: "DEBIT_CARD", l: "Debit Card", hi: "डेबिट कार्ड" },
//                   { v: "UPI", l: "UPI", hi: "यूपीआई" },
//                   { v: "NET_BANKING", l: "Net Banking", hi: "नेट बैंकिंग" },
//                 ].map((m) => (
//                   <label key={m.v} style={{ position: "relative" }}>
//                     <input
//                       type="radio"
//                       name="paymentMode"
//                       className="gf-radio-input"
//                       checked={v.paymentMode === m.v}
//                       onChange={() => setV((p) => ({ ...p, paymentMode: m.v }))}
//                     />
//                     <span
//                       className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer text-center"
//                       style={{
//                         borderColor: v.paymentMode === m.v ? INK : LINE,
//                         background: v.paymentMode === m.v ? "#EEF0F4" : "#fff",
//                       }}
//                     >
//                       <CreditCard
//                         size={18}
//                         style={{ color: v.paymentMode === m.v ? INK : INK_SOFT }}
//                       />
//                       <span className="text-[11.5px] font-extrabold" style={{ color: INK }}>
//                         {m.l}
//                       </span>
//                       <span className="text-[10.5px] font-medium" style={{ color: INK_SOFT }}>
//                         {m.hi}
//                       </span>
//                     </span>
//                   </label>
//                 ))}
//               </div>
//             </Field>

//             <Note>
//               You will be redirected to the BSSC official payment gateway. After
//               successful payment, your status updates to "Fee Paid" and a receipt is
//               generated. · आपको भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।
//             </Note>

//             <label className="flex items-start gap-3 cursor-pointer mt-5">
//               <input
//                 type="checkbox"
//                 checked={!!v.paymentAcknowledged}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setV((p) => ({ ...p, paymentAcknowledged: e.target.checked }))
//                 }
//                 className="w-4 h-4 mt-0.5"
//                 style={{ accentColor: INK }}
//               />
//               <span className="text-[13px] font-semibold leading-relaxed" style={{ color: INK }}>
//                 I acknowledge the examination fee is non-refundable and
//                 non-transferable. · मैं स्वीकार करता/करती हूँ कि शुल्क अप्रतिदेय है।
//               </span>
//             </label>
//             {errors.paymentAcknowledged && (
//               <div
//                 className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
//                 style={{ color: DANGER }}
//               >
//                 <AlertCircle size={11} /> {errors.paymentAcknowledged}
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* --- CONDITIONAL ACTION BUTTON --- */}
//       <div className="flex justify-end pt-2">
//         {v.previouslyRegistered === "YES" && !verificationFailed ? (
//           <button
//             className="gf-btn-primary"
//             disabled={!isVerified || isSavingStep2}
//             onClick={handleNextWithoutPayment}
//           >
//             {isSavingStep2 ? (
//               <><Loader2 size={15} className="gf-spin" /> Saving…</>
//             ) : (
//               <>Save & Next <ChevronRight size={15} /></>
//             )}
//           </button>
//         ) : (
//           <button
//             className="gf-btn-primary"
//             disabled={isSavingStep2 || feePayment.paymentStatus === "processing"}
//             onClick={handleProceedToPay}
//           >
//             {isSavingStep2 || feePayment.paymentStatus === "processing" ? (
//               <><Loader2 size={15} className="gf-spin" /> Redirecting…</>
//             ) : (
//               <>Proceed to Pay <ChevronRight size={15} /></>
//             )}
//           </button>
//         )}
//       </div>

//       {/* 👉 3. ADD THIS POPUP JSX RIGHT BEFORE THE CLOSING DIV */}
//       {verificationModal.isOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
//           <div 
//             className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl gf-pop" 
//             style={{ border: `1.5px solid ${LINE}` }}
//           >
//             <div className="flex flex-col items-center text-center space-y-4">
//               {verificationModal.type === "success" ? (
//                 <CheckCircle2 size={50} style={{ color: TEAL }} />
//               ) : (
//                 <AlertCircle size={50} style={{ color: DANGER }} />
//               )}
              
//               <div className="text-[18px] font-extrabold" style={{ color: INK }}>
//                 {verificationModal.type === "success" ? "Registration Found!" : "Verification Failed"}
//               </div>
              
//               <div className="text-[13px] font-medium leading-relaxed" style={{ color: INK_SOFT }}>
//                 {verificationModal.message}
//               </div>
              
//               <button
//                 onClick={() => setVerificationModal((prev) => ({ ...prev, isOpen: false }))}
//                 className="gf-btn-primary w-full mt-4"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
      
//     </div>
//   );
// };


/* ---------------------------------------------------------------
   STEP 2 — PAYMENT
--------------------------------------------------------------- */
const Step2Payment: React.FC<Step2Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  // Added gatewayChoice defaulting to "sbi" and paymentMode defaulting to "online"
  const [v, setV] = useState<PaymentData & { 
    previouslyRegistered?: string; 
    previousRegistrationNumber?: string; 
    gatewayChoice?: string;
  }>({ 
    gatewayChoice: "sbi",
    paymentMode: "online", 
    ...data 
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingStep2, setIsSavingStep2] = useState(false);

  // --- STATES FOR PREVIOUS REGISTRATION VERIFICATION ---
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [verificationFailed, setVerificationFailed] = useState(false);

  const [verificationModal, setVerificationModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    message: string;
  }>({ isOpen: false, type: "success", message: "" });

  const [feePayment, setFeePayment] = useState<{
    applicationFee: string;
    transactionId: string;
    paymentStatus: "pending" | "processing" | "completed" | "failed";
    paymentDate: string;
  }>({
    applicationFee: "",
    transactionId: "",
    paymentStatus: "pending",
    paymentDate: "",
  });
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState("");

  useEffect(() => {
    const initializePaymentInfo = async () => {
      if (!applicationId) return;
      if (feePayment.paymentStatus === "completed") return;
      
      if (v.previouslyRegistered === "YES" && !verificationFailed) return;

      try {
        setFeeLoading(true);
        // Note: Using "online" statically here if your API requires it for initiation fetch
        const response = await paymentApi.initiate(applicationId, "online");
        if (response.data?.success === true) {
          const orderData: any = response.data.data;
          setFeePayment((prev) => ({
            ...prev,
            applicationFee: orderData?.amount?.toString() || "0",
            transactionId: orderData?.paymentOrderId || prev.transactionId,
          }));
        }
      } catch (error: any) {
        if (
          error?.response?.data?.message ===
          "Payment has already been completed for this application"
        ) {
          setFeePayment((prev) => ({
            ...prev,
            paymentStatus: "completed",
            transactionId: "Already Completed",
            paymentDate: new Date().toISOString().split("T")[0],
          }));
        } else {
          setFeeError(
            error?.response?.data?.message || error?.message || "Error initializing payment info",
          );
        }
      } finally {
        setFeeLoading(false);
      }
    };

    initializePaymentInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId, v.previouslyRegistered, verificationFailed]);

  const handleVerifyRegistration = async () => {
    if (!v.previousRegistrationNumber?.trim()) {
      setVerifyError("Please enter previous registration number");
      return;
    }
    
    setVerifyError("");
    setVerificationFailed(false);
    try {
      setIsVerifying(true);
      let success = false;
      let apiMessage = "";
      
      if (typeof applicationApi.verifyPreviousRegistration === 'function') {
        const res = await applicationApi.verifyPreviousRegistration({ oldRegistrationNumber: v.previousRegistrationNumber });
        success = res.data?.success === true;
        apiMessage = res.data?.message || "";
      } else {
        const res = await api.post(`${API_BASE_URL}/auth/candidate/verify-previous-registration`, { 
          oldRegistrationNumber: v.previousRegistrationNumber 
        });
        success = res.data?.success === true;
        apiMessage = res.data?.message || "";
      }

      if (success) {
        setIsVerified(true);
        setVerificationModal({
          isOpen: true,
          type: "success",
          message: "Your registration was found! You do not need to pay the application fee."
        });
      } else {
        setIsVerified(false);
        setVerificationFailed(true);
        const msg = apiMessage || "Your registration number was not found. Please proceed with payment.";
        setVerifyError(msg);
        setVerificationModal({
          isOpen: true,
          type: "error",
          message: msg
        });
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Invalid Registration Number. Verification failed.";
      setIsVerified(false);
      setVerificationFailed(true);
      setVerifyError(msg);
      setVerificationModal({
        isOpen: true,
        type: "error",
        message: msg
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!v.previouslyRegistered) e.previouslyRegistered = "Please declare if you are previously registered";
    
    if (v.previouslyRegistered !== "YES" || verificationFailed) {
      // Changed validation from paymentMode to gatewayChoice
      if (!v.gatewayChoice) e.gatewayChoice = "Please select a payment gateway";
      if (!v.paymentAcknowledged) e.paymentAcknowledged = "You must acknowledge the fee terms";
    }
    
    setErrors(e);
    if (Object.keys(e).length > 0) {
      notifyError(Object.values(e)[0]);
    }
    return Object.keys(e).length === 0;
  };

  const handleNextWithoutPayment = async () => {
    if (!isVerified) {
      notifyError("Please verify your previous registration before proceeding.");
      return;
    }
    try {
      setIsSavingStep2(true);
      await applicationApi.saveStep2({
        applicationId,
        ...v,
        transactionId: "PREVIOUSLY_REGISTERED",
        applicationFee: "0",
      });
      notifySuccess("Registration verified. Proceeding to next step.");
      onSave(v as any);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save details.";
      notifyError(msg);
    } finally {
      setIsSavingStep2(false);
    }
  };

  const handleProceedToPay = async () => {
    if (!validate()) return;

    setFeeError("");
    setFeePayment((prev) => ({ ...prev, paymentStatus: "processing" }));

    try {
      setIsSavingStep2(true);

      // Save step to backend
      await applicationApi.saveStep2({
        applicationId,
        ...v,
        transactionId: feePayment.transactionId,
        applicationFee: feePayment.applicationFee,
      });

      // ── MODIFIED PAYLOAD SPECIFICALLY FOR YOUR REQUIREMENT ──
      const initiatePayload = {
        applicationId: applicationId,
        paymentMode: "online",
        gatewayChoice: v.gatewayChoice || "sbi"
      };

      // Ensure your paymentApi.initiate accepts this object! 
      const response = await paymentApi.initiate(initiatePayload);

      if (
        response.data?.success === false &&
        response.data?.message ===
        "Payment has already been completed for this application"
      ) {
        setFeePayment((prev) => ({
          ...prev,
          paymentStatus: "completed",
          transactionId: "Already Completed",
          paymentDate: new Date().toISOString().split("T")[0],
        }));
        notifySuccess("Payment already completed. Proceeding to review.");
        onSave(v as any);
        return;
      }

      if (response.data?.success === true) {
        const orderData: any = response.data.data;
        
        setFeePayment((prev) => ({
          ...prev,
          applicationFee: orderData?.amount?.toString() || prev.applicationFee,
          transactionId: orderData?.paymentOrderId || prev.transactionId,
        }));

        if (orderData?.isFree === true || orderData?.amount === 0) {
          if (orderData?.htmlForm) {
            notifySuccess("Redirecting...");
            document.open();
            document.write(orderData.htmlForm);
            document.close();
            return;
          }
          setFeePayment((prev) => ({
            ...prev,
            paymentStatus: "completed",
            transactionId: orderData?.paymentOrderId || "FREE",
            paymentDate: new Date().toISOString().split("T")[0],
          }));
          notifySuccess("No payment required. Proceeding to review.");
          onSave(v as any);
          return;
        }

        // if (orderData?.htmlForm) {
        //   notifySuccess(`Redirecting to ${v.gatewayChoice.toUpperCase()} payment gateway...`);
        //   document.open();
        //   document.write(orderData.htmlForm);
        //   document.close();
        //   return;
        // }

        // const msg = "HTML form not received from server.";
        // setFeeError(msg);
        // notifyError(msg);
        // setFeePayment((prev) => ({ ...prev, paymentStatus: "failed" }));
        // return;

         // ── SBI GATEWAY HANDLER (HTML Form Submission) ──
        if (v.gatewayChoice === "sbi") {
          if (orderData?.htmlForm) {
            notifySuccess("Redirecting to SBI payment gateway...");
            document.open();
            document.write(orderData.htmlForm);
            document.close();
            return;
          }
          const msg = "SBI HTML form not received from server.";
          setFeeError(msg);
          notifyError(msg);
          setFeePayment((prev) => ({ ...prev, paymentStatus: "failed" }));
          return;
        }

        // ── ICICI GATEWAY HANDLER (URL Redirect) ──
        if (v.gatewayChoice === "icici") {
          if (orderData?.paymentUrl) {
            notifySuccess("Redirecting to ICICI payment gateway...");
            window.location.href = orderData.paymentUrl;
            return;
          }
          const msg = "ICICI Payment URL not received from server.";
          setFeeError(msg);
          notifyError(msg);
          setFeePayment((prev) => ({ ...prev, paymentStatus: "failed" }));
          return;
        }

      }

      const msg = response.data?.message || "Payment initiation failed.";
      setFeeError(msg);
      notifyError(msg);
      setFeePayment((prev) => ({ ...prev, paymentStatus: "failed" }));
      
    } catch (err: any) {
      if (
        err?.response?.data?.message ===
        "Payment has already been completed for this application"
      ) {
        setFeePayment((prev) => ({
          ...prev,
          paymentStatus: "completed",
          transactionId: "Already Completed",
          paymentDate: new Date().toISOString().split("T")[0],
        }));
        notifySuccess("Payment already completed. Proceeding to review.");
        onSave(v as any);
        return;
      }

      const msg = err?.response?.data?.message || err?.message || "Failed to initiate payment. Please try again.";
      setFeeError(msg);
      notifyError(msg);
      setFeePayment((prev) => ({ ...prev, paymentStatus: "failed" }));
    } finally {
      setIsSavingStep2(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* --- PREVIOUS REGISTRATION SECTION --- */}
      <div>
        <SectionTitle icon={User}>Previous Registration</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field 
            label="Are you previously registered for Adv No. - 05/25, Post- 4th Graduate Level Combined Competitive Exam?" 
            hi="क्या आप विज्ञापन संख्या 05/25, पद - चतुर्थ स्नातक स्तरीय संयुक्त प्रतियोगी परीक्षा में पंजीकृत हैं?"
            required 
            error={errors.previouslyRegistered}
          >
            <PillGroup
              name="previouslyRegistered"
              value={v.previouslyRegistered || ""}
              onChange={(val) => {
                setV((p) => ({ ...p, previouslyRegistered: val }));
                setIsVerified(false);
                setVerificationFailed(false);
                setVerifyError("");
              }}
              options={["YES", "NO"]}
            />
          </Field>
          
          {v.previouslyRegistered === "YES" && (
            <Field 
              label="Previous Registration Number" 
              hi="पिछली पंजीकरण संख्या"
              required 
              error={errors.previousRegistrationNumber || verifyError}
            >
              <div className="flex flex-col gap-3">
                <input
                  className={`gf-input ${errors.previousRegistrationNumber || verifyError ? "gf-error" : ""}`}
                  value={v.previousRegistrationNumber || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setV((p) => ({ ...p, previousRegistrationNumber: e.target.value }));
                    setIsVerified(false); 
                    setVerificationFailed(false);
                    setVerifyError("");
                  }}
                  placeholder="Enter previous registration number"
                  disabled={isVerified}
                />
                
                {!isVerified ? (
                  <button 
                    onClick={handleVerifyRegistration}
                    disabled={isVerifying || !v.previousRegistrationNumber?.trim()}
                    className="gf-btn-secondary w-max"
                  >
                    {isVerifying ? (
                      <><Loader2 size={15} className="gf-spin" /> Verifying...</>
                    ) : (
                      "Verify Registration"
                    )}
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 text-[12px] font-bold" style={{ color: TEAL }}>
                    <CheckCircle2 size={16} /> Verified Successfully
                  </div>
                )}
              </div>
            </Field>
          )}
        </div>
      </div>

      {/* --- PAYMENT SECTION --- */}
      {(v.previouslyRegistered !== "YES" || verificationFailed) && (
        <>
          <SectionTitle icon={CreditCard}>Examination Fee</SectionTitle>

          <div
            className="rounded-xl overflow-hidden"
            style={{ border: `1px solid ${LINE}` }}
          >
            <div
              className="px-4 py-2.5 text-[11px] font-extrabold tracking-wide"
              style={{ background: INK, color: "#fff" }}
            >
              FEE STRUCTURE · शुल्क संरचना
            </div>
            <table className="w-full text-[12.5px]">
              <tbody>
                <tr>
                  <td className="py-2.5 px-4 font-semibold" style={{ color: INK }}>
                    As per the Resolution No. 15568, dated 21.08.2025, issued by the General Administration Department, Government of Bihar, Patna, the examination fee has been fixed at ₹100 (Rupees One Hundred only) for all candidates.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div
            className="rounded-2xl p-6"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div className="text-[12.5px] font-extrabold mb-2" style={{ color: INK }}>
              Your applicable fee · आपका लागू शुल्क
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-xl mb-6"
              style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
            >
              {feeLoading ? (
                <Loader2 size={18} className="gf-spin" style={{ color: TEAL }} />
              ) : (
                <CheckCircle2 size={18} style={{ color: TEAL }} />
              )}
              <div>
                <div className="gf-mono text-lg font-extrabold" style={{ color: TEAL }}>
                  {feePayment.applicationFee ? `₹${feePayment.applicationFee}` : "₹100"}
                </div>
                <div className="text-[11.5px] font-semibold" style={{ color: INK_SOFT }}>
                  {feePayment.paymentStatus === "completed"
                    ? "Fee already paid for this application"
                    : ""}
                </div>
              </div>
            </div>
            {feeError && (
              <div className="mb-4">
                <Note tone="danger">{feeError}</Note>
              </div>
            )}

            {/* ── MODIFIED: BEAUTIFUL GATEWAY SELECTION UI ── */}
            <Field
              label="Select Payment Gateway"
              hi="भुगतान गेटवे चुनें"
              required
              error={errors.gatewayChoice}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { v: "sbi", l: "SBI Payment Gateway", hi: "एसबीआई पेमेंट गेटवे", desc: "Cards, UPI, Net Banking" },
                  { v: "icici", l: "ICICI Payment Gateway", hi: "आईसीआईसीआई पेमेंट गेटवे", desc: "Cards, UPI, Net Banking" },
                ].map((m) => (
                  <label key={m.v} style={{ position: "relative" }}>
                    <input
                      type="radio"
                      name="gatewayChoice"
                      className="gf-radio-input absolute opacity-0 w-0 h-0"
                      checked={v.gatewayChoice === m.v}
                      onChange={() => setV((p) => ({ ...p, gatewayChoice: m.v, paymentMode: "online" }))}
                    />
                    <span
                      className="flex flex-col gap-1.5 p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-sm"
                      style={{
                        borderColor: v.gatewayChoice === m.v ? INK : LINE,
                        background: v.gatewayChoice === m.v ? "#EEF0F4" : "#fff",
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5">
                          <CreditCard size={18} style={{ color: v.gatewayChoice === m.v ? INK : INK_SOFT }} />
                          <span className="text-[13.5px] font-extrabold tracking-wide" style={{ color: INK }}>
                            {m.l}
                          </span>
                        </div>
                        <div
                          className="w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors"
                          style={{
                            borderColor: v.gatewayChoice === m.v ? INK : "#C9D3E0",
                            background: v.gatewayChoice === m.v ? INK : "transparent",
                          }}
                        >
                          {v.gatewayChoice === m.v && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <span className="text-[11px] font-semibold pl-[28px]" style={{ color: INK_SOFT }}>
                        {m.desc} · {m.hi}
                      </span>
                    </span>
                  </label>
                ))}
              </div>
            </Field>

            <Note>
              You will be redirected to the chosen official payment gateway. After
              successful payment, your status updates to "Fee Paid" and a receipt is
              generated. · आपको चुने गए भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।
            </Note>

            <label className="flex items-start gap-3 cursor-pointer mt-5">
              <input
                type="checkbox"
                checked={!!v.paymentAcknowledged}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setV((p) => ({ ...p, paymentAcknowledged: e.target.checked }))
                }
                className="w-4 h-4 mt-0.5"
                style={{ accentColor: INK }}
              />
              <span className="text-[13px] font-semibold leading-relaxed" style={{ color: INK }}>
                I acknowledge the examination fee is non-refundable and
                non-transferable. · मैं स्वीकार करता/करती हूँ कि शुल्क अप्रतिदेय है।
              </span>
            </label>
            {errors.paymentAcknowledged && (
              <div
                className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
                style={{ color: DANGER }}
              >
                <AlertCircle size={11} /> {errors.paymentAcknowledged}
              </div>
            )}
          </div>
        </>
      )}

      {/* --- CONDITIONAL ACTION BUTTON --- */}
      <div className="flex justify-end pt-2">
        {v.previouslyRegistered === "YES" && !verificationFailed ? (
          <button
            className="gf-btn-primary"
            disabled={!isVerified || isSavingStep2}
            onClick={handleNextWithoutPayment}
          >
            {isSavingStep2 ? (
              <><Loader2 size={15} className="gf-spin" /> Saving…</>
            ) : (
              <>Save & Next <ChevronRight size={15} /></>
            )}
          </button>
        ) : (
          <button
            className="gf-btn-primary"
            disabled={isSavingStep2 || feePayment.paymentStatus === "processing"}
            onClick={handleProceedToPay}
          >
            {isSavingStep2 || feePayment.paymentStatus === "processing" ? (
              <><Loader2 size={15} className="gf-spin" /> Redirecting…</>
            ) : (
              <>Proceed to Pay <ChevronRight size={15} /></>
            )}
          </button>
        )}
      </div>

      {verificationModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div 
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl gf-pop" 
            style={{ border: `1.5px solid ${LINE}` }}
          >
            <div className="flex flex-col items-center text-center space-y-4">
              {verificationModal.type === "success" ? (
                <CheckCircle2 size={50} style={{ color: TEAL }} />
              ) : (
                <AlertCircle size={50} style={{ color: DANGER }} />
              )}
              
              <div className="text-[18px] font-extrabold" style={{ color: INK }}>
                {verificationModal.type === "success" ? "Registration Found!" : "Verification Failed"}
              </div>
              
              <div className="text-[13px] font-medium leading-relaxed" style={{ color: INK_SOFT }}>
                {verificationModal.message}
              </div>
              
              <button
                onClick={() => setVerificationModal((prev) => ({ ...prev, isOpen: false }))}
                className="gf-btn-primary w-full mt-4"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 3 — EDUCATION
--------------------------------------------------------------- */
// Fields that must only ever contain numbers.
const NUMERIC_ONLY_FIELDS = ["totalMarks", "obtainedMarks", "passingYear"];

const sanitizeNumericInput = (key: string, raw: string): string => {
  // passingYear should be strictly digits, no decimals
  if (key === "passingYear") {
    return raw.replace(/[^0-9]/g, "").slice(0, 4);
  }

  // Allow numbers and a single decimal point
  let cleaned = raw.replace(/[^0-9.]/g, "");
  
  // Prevent multiple decimal points (keep only the first one)
  const parts = cleaned.split(".");
  if (parts.length > 2) {
    cleaned = parts[0] + "." + parts.slice(1).join("");
  }
  
  // Restrict to maximum 2 decimal places
  if (cleaned.includes(".")) {
    const [whole, decimal] = cleaned.split(".");
    cleaned = `${whole}.${decimal.slice(0, 2)}`;
  }
  
  return cleaned;
};

// ADDED: passingYear so the user can actually enter it
const EDU_FIELDS: [string, string, string][] = [
  ["subject", "Subjects", "विषय"],
  ["boardUniversity", "Board / University", "बोर्ड/विश्वविद्यालय"],
  ["totalMarks", "Total Marks / CGPA", "कुल अंक / सीजीपीए"],
  ["obtainedMarks", "Obtained Marks / CGPA", "प्राप्त अंक / सीजीपीए"],
  ["passingYear", "Passing Year", "उत्तीर्ण वर्ष"], 
  ["certNumber", "Certificate / Marksheet No.", "प्रमाणपत्र / अंकपत्र संख्या"],
];

const EducationBlock: React.FC<
  EducationBlockProps & {
    errors?: Record<string, string>;
    touched?: Record<string, boolean>;
    setDatePart: (prefix: string, part: "day" | "month" | "year", value: string) => void;
    onDateBlur: (prefix: string) => void;
  }
> = ({ title, hi, prefix, v, setNested, errors = {}, touched = {}, setDatePart, onDateBlur }) => {
  const section =
    (v[prefix as keyof EducationData] as any) || {};

  // const dateVal = {
  //   day: (section as any).certIssueDateDay || "",
  //   month: (section as any).certIssueDateMonth || "",
  //   year: (section as any).certIssueDateYear || "",
  // };

  const dateVal = {
    day: unpad((section as any).certIssueDateDay),
    month: unpad((section as any).certIssueDateMonth),
    year: (section as any).certIssueDateYear || "",
  };
  
  const dateTouchedVal = {
    day: !!touched.certIssueDateDay,
    month: !!touched.certIssueDateMonth,
    year: !!touched.certIssueDateYear,
  };
  const dateErrVal = {
    day: touched.certIssueDateDay ? errors.certIssueDateDay : "",
    month: touched.certIssueDateMonth ? errors.certIssueDateDay : "",
    year: touched.certIssueDateYear ? errors.certIssueDateDay : "",
  };

  const handleFieldChange = (key: string, rawValue: string) => {
    if (NUMERIC_ONLY_FIELDS.includes(key)) {
      const cleaned = sanitizeNumericInput(key, rawValue);
      if (cleaned !== rawValue && key !== "passingYear") {
        notifyError(
          `${EDU_FIELDS.find(([k]) => k === key)?.[1] || "This field"} accepts numbers only.`,
        );
      }
      
      if (key === "percentage" && cleaned !== "" && parseFloat(cleaned) > 100) {
        notifyError("Percentage cannot be greater than 100%.");
      }
      if (
        key === "obtainedMarks" &&
        cleaned !== "" &&
        section.totalMarks &&
        parseFloat(cleaned) > parseFloat(section.totalMarks as any)
      ) {
        notifyError("Obtained marks cannot be greater than total marks.");
      }
      setNested(prefix, key, cleaned);
      return;
    }

    let finalValue = rawValue;

    if (key === "subject") {
      finalValue = rawValue.replace(/[^a-zA-Z0-9\s]/g, "");
    } else if (key === "boardUniversity") {
      finalValue = rawValue.replace(/[^a-zA-Z\s]/g, "");
    }

    setNested(prefix, key, finalValue);
  };

  return (
    <div>
      <SectionTitle icon={GraduationCap}>
        {title} · {hi}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {EDU_FIELDS.map(([key, label, hiLabel]) => {
          const isNumeric = NUMERIC_ONLY_FIELDS.includes(key);
          return (
            <Field key={key} label={label} hi={hiLabel} required error={errors[key]}>
              <input
                className={`gf-input uppercase ${errors[key] ? "gf-error" : ""}`}
                value={section[key] || ""}
                inputMode={isNumeric ? "decimal" : "text"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(key, e.target.value)
                }
                onKeyDown={
                  isNumeric
                    ? (ev: React.KeyboardEvent<HTMLInputElement>) => {
                        const allowedKeys = [
                          "Backspace", "Delete", "ArrowLeft", "ArrowRight",
                          "Tab", "Home", "End",
                        ];
                        if (allowedKeys.includes(ev.key)) return;
                        
                        // Allow digits AND the decimal point (.)
                        const isDigitOrDot = /^[0-9.]$/.test(ev.key);
                        if (!isDigitOrDot) {
                          ev.preventDefault();
                          notifyError(
                            `${label} accepts numbers and decimals only.`,
                          );
                        }
                      }
                    : undefined
                }
                placeholder={label}
              />
            </Field>
          );
        })}
      </div>
      <div className="mt-1">
        <DateSelect
          value={dateVal}
          onChange={(field: "day" | "month" | "year", val: string) => setDatePart(prefix, field, val)}
          onBlur={() => onDateBlur(prefix)}
          errors={dateErrVal}
          touched={dateTouchedVal}
          required
          label="Certificate issue date"
          hi="जारी करने की तिथि"
          maxYear={new Date().getFullYear()}
          minYear={1900}
        />
      </div>
    </div>
  );
};

type EducationSectionKey = "tenth" | "twelfth" | "graduation";
const EDUCATION_SECTIONS: EducationSectionKey[] = ["tenth", "twelfth", "graduation"];

const Step3Education: React.FC<Step3Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  // FIX 1: Extract data from the `qualification` wrapper if present
  const qualData = (data as any)?.qualification || data || {};

  // Helper to map backend's marksObtained -> frontend's obtainedMarks
  const mapSection = (secData: any = {}) => ({
    ...secData,
    totalMarks: secData.totalMarks != null ? String(secData.totalMarks) : "",
    passingYear: secData.passingYear != null ? String(secData.passingYear) : "",
    obtainedMarks: (secData.obtainedMarks || secData.marksObtained) != null 
      ? String(secData.obtainedMarks || secData.marksObtained) 
      : "",
  });

  const [v, setV] = useState<EducationData>({
    tenth: mapSection(qualData.tenth),
    twelfth: mapSection(qualData.twelfth),
    graduation: mapSection(qualData.graduation),
  });

  const [errors, setErrors] = useState<Record<EducationSectionKey, Record<string, string>>>({
    tenth: {},
    twelfth: {},
    graduation: {},
  });
  const [touched, setTouched] = useState<Record<EducationSectionKey, Record<string, boolean>>>({
    tenth: {},
    twelfth: {},
    graduation: {},
  });
  const [isSavingStep3, setIsSavingStep3] = useState(false);
  const [step3Error, setStep3Error] = useState("");

  // FIX 2: Hydrate deeply mapped data + split strings correctly
  useEffect(() => {
    setV((prev) => {
      const next: any = { ...prev };
      const apiQualData = (data as any)?.qualification || data || {};

      EDUCATION_SECTIONS.forEach((sec) => {
        const secData = apiQualData[sec] || {};
        const current = (prev as any)[sec] || {};
        const alreadySet =
          current.certIssueDateDay || current.certIssueDateMonth || current.certIssueDateYear;
        
        let mappedData = {
           ...current,
           ...secData,
          //  obtainedMarks: secData.obtainedMarks || secData.marksObtained || current.obtainedMarks || "",
          totalMarks: secData.totalMarks != null ? String(secData.totalMarks) : current.totalMarks || "",
           passingYear: secData.passingYear != null ? String(secData.passingYear) : current.passingYear || "",
           obtainedMarks: (secData.obtainedMarks || secData.marksObtained) != null 
               ? String(secData.obtainedMarks || secData.marksObtained) 
               : current.obtainedMarks || "",
        };

        if (!alreadySet && secData?.certIssueDate) {
          const { day, month, year } = splitDateString(secData.certIssueDate);
          if (day && month && year) {
            mappedData.certIssueDateDay = day;
            mappedData.certIssueDateMonth = month;
            mappedData.certIssueDateYear = year;
          }
        }
        
        next[sec] = mappedData;
      });
      return next as EducationData;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const setNested = (prefix: string, key: string, val: string) =>
    setV((p) => ({
      ...p,
      [prefix]: {
        ...(p[prefix as keyof EducationData] as EducationBlockProps),
        [key]: val,
      },
    }));

  const setDatePart = (prefix: string, part: "day" | "month" | "year", value: string) => {
    setV((p) => {
      const key = `certIssueDate${part[0].toUpperCase()}${part.slice(1)}`;
      const currentSection = (p[prefix as keyof EducationData] as any) || {};
      const updatedSection = { ...currentSection, [key]: value };

      const day = updatedSection.certIssueDateDay || "";
      const month = updatedSection.certIssueDateMonth || "";
      const year = updatedSection.certIssueDateYear || "";

      if (isFutureDate(day, month, year)) {
        notifyError("Future date is not allowed for certificate issue date.");
        return p; // reject the change, keep previous state
      }

      return {
        ...p,
        [prefix]: updatedSection,
      };
    });
  };

  const touchDateTrio = (prefix: string) => {
    setTouched((p) => ({
      ...p,
      [prefix]: {
        ...p[prefix as EducationSectionKey],
        certIssueDateDay: true,
        certIssueDateMonth: true,
        certIssueDateYear: true,
      },
    }));
  };

  const validateSection = (prefix: EducationSectionKey) => {
    const section = (v[prefix] as any) || {};
    const e: Record<string, string> = {};

    EDU_FIELDS.forEach(([key, label]) => {
      if (!String(section[key] ?? "").trim()) {
        e[key] = `${label} is required`;
      }
    });

    const total = parseFloat(section.totalMarks);
    const obtained = parseFloat(section.obtainedMarks);

    if (section.totalMarks !== undefined && section.totalMarks !== "" && isNaN(total)) {
      e.totalMarks = "Total marks must be a number";
    }
    if (section.obtainedMarks !== undefined && section.obtainedMarks !== "" && isNaN(obtained)) {
      e.obtainedMarks = "Obtained marks must be a number";
    }

    if (
      section.totalMarks !== undefined && section.totalMarks !== "" &&
      section.obtainedMarks !== undefined && section.obtainedMarks !== "" &&
      !isNaN(total) && !isNaN(obtained) && obtained > total
    ) {
      e.obtainedMarks = "Obtained marks cannot be greater than total marks";
    }

    if (section.passingYear && !/^\d{4}$/.test(section.passingYear)) {
       e.passingYear = "Enter a valid 4-digit year";
    }

    if (!isRealDate(section.certIssueDateDay, section.certIssueDateMonth, section.certIssueDateYear)) {
      e.certIssueDateDay = "Enter a valid certificate issue date";
    }

    return e;
  };

  const handleSaveNext = async () => {
    setStep3Error("");

    const newErrors = {
      tenth: validateSection("tenth"),
      twelfth: validateSection("twelfth"),
      graduation: validateSection("graduation"),
    };
    setErrors(newErrors);
    setTouched({
      tenth: { certIssueDateDay: true, certIssueDateMonth: true, certIssueDateYear: true },
      twelfth: { certIssueDateDay: true, certIssueDateMonth: true, certIssueDateYear: true },
      graduation: { certIssueDateDay: true, certIssueDateMonth: true, certIssueDateYear: true },
    });

    const hasError = EDUCATION_SECTIONS.some(
      (section) => Object.keys(newErrors[section]).length > 0,
    );
    if (hasError) {
      const firstSectionWithError = EDUCATION_SECTIONS.find(
        (section) => Object.keys(newErrors[section]).length > 0,
      );
      const firstMessage = firstSectionWithError
        ? Object.values(newErrors[firstSectionWithError])[0]
        : "Please fill all mandatory education fields correctly.";
      notifyError(firstMessage);
      return;
    }

    const buildSectionPayload = (section: EducationSectionKey) => {
      const s = (v[section] as any) || {};
      return {
        ...s,
        // marksObtained: s.obtainedMarks, // Map it back explicitly for backend saving
        // certIssueDate: toIso(s.certIssueDateDay, s.certIssueDateMonth, s.certIssueDateYear),
      totalMarks: s.totalMarks != null ? String(s.totalMarks) : "",
        obtainedMarks: s.obtainedMarks != null ? String(s.obtainedMarks) : "",
        marksObtained: s.obtainedMarks != null ? String(s.obtainedMarks) : "", // Map it back explicitly
        passingYear: s.passingYear != null ? String(s.passingYear) : "",
        certIssueDate: toIso(s.certIssueDateDay, s.certIssueDateMonth, s.certIssueDateYear),
      };
    };

    // FIX 3: Construct payload matching exact backend schema (wrapping inside qualification)
    const payload = {
      qualification: {
        tenth: buildSectionPayload("tenth"),
        twelfth: buildSectionPayload("twelfth"),
        graduation: buildSectionPayload("graduation"),
      }
    };

    try {
      setIsSavingStep3(true);
      await applicationApi.saveStep3({ applicationId, ...payload });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to save education details. Please try again.";
      setStep3Error(msg);
      notifyError(msg);
      return;
    } finally {
      setIsSavingStep3(false);
    }
    notifySuccess("Education details saved successfully.");
    onSave(payload as any);
  };

  return (
    <div className="space-y-8">
      {step3Error && <Note tone="danger">{step3Error}</Note>}
      <EducationBlock
        title="10th / Equivalent"
        hi="10वीं / समकक्ष"
        prefix="tenth"
        v={v}
        setNested={setNested}
        errors={errors.tenth}
        touched={touched.tenth}
        setDatePart={setDatePart}
        onDateBlur={touchDateTrio}
      />
      <EducationBlock
        title="12th / Equivalent"
        hi="12वीं / समकक्ष"
        prefix="twelfth"
        v={v}
        setNested={setNested}
        errors={errors.twelfth}
        touched={touched.twelfth}
        setDatePart={setDatePart}
        onDateBlur={touchDateTrio}
      />
      <EducationBlock
        title="Graduation / Equivalent"
        hi="स्नातक / समकक्ष"
        prefix="graduation"
        v={v}
        setNested={setNested}
        errors={errors.graduation}
        touched={touched.graduation}
        setDatePart={setDatePart}
        onDateBlur={touchDateTrio}
      />
      <div className="flex justify-end pt-2">
        <button className="gf-btn-primary" disabled={isSavingStep3} onClick={handleSaveNext}>
          {isSavingStep3 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>
              Save &amp; Next <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 4 — PHOTO UPLOAD (BINARY FORMAT)
--------------------------------------------------------------- */
const Step4PhotoUpload: React.FC<Step4Props & { 
  applicationId?: string; 
  isContractual?: boolean; 
  hasAgreement?: boolean; 
}> = ({
  data,
  onSave,
  applicationId,
  isContractual,
  hasAgreement,
}) => {
  // Store base64 for preview
  const [v, setV] = useState<PhotoData & { [key: string]: any }>({ ...data });
  // Store actual File objects for binary upload to backend
  const [fileObjects, setFileObjects] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingStep4, setIsSavingStep4] = useState(false);
  const [step4ApiError, setStep4ApiError] = useState("");

  const baseUploads: LocalUploadConfig[] = [
    {
      field: "photograph", 
      label: "Passport size recent photograph",
      hi: "पासपोर्ट साइज हालिया फोटो",
      spec: "JPG, JPEG · 20–50KB · EXACTLY 200×230px · within 3 month",
      maxKB: 50,
      height: 250,
      minWidth: 150, 
      minHeight: 50, 
      accept: "image/jpeg,image/jpg"
    },
    {
      field: "signatureEnglish", 
      label: "English signature",
      hi: "अंग्रेजी हस्ताक्षर",
      spec: "JPG, JPEG · 10–20KB · EXACTLY 200×60px",
      maxKB: 20,
      height: 74,
      minWidth: 150, 
      minHeight: 50,
      accept: "image/jpeg,image/jpg"
    },
    {
      field: "signatureHindi", 
      label: "Hindi signature",
      hi: "हिंदी हस्ताक्षर",
      spec: "JPG, JPEG · 10–20KB · EXACTLY 200×60px",
      maxKB: 20,
      height: 74,
      minWidth: 150,
      minHeight: 50,
      accept: "image/jpeg,image/jpg"
    },
  ];

  // Dynamically add PDF requirements based on Step 1 selections
  const uploads = [...baseUploads];
  
  if (isContractual) {
    uploads.push({
      field: "experienceCertificate",
      label: "Upload Experience Certificate (PDF format)",
      hi: "अनुभव प्रमाणपत्र अपलोड करें (PDF प्रारूप)",
      spec: "PDF Document · Up to 2MB",
      maxKB: 2048,
      height: 120, // UI box height
      minWidth: 0, // Not applicable for PDF
      minHeight: 0, // Not applicable for PDF
      isPdf: true,
      accept: "application/pdf"
    });
  }
  
  if (hasAgreement) {
    uploads.push({
      field: "agreementCopy",
      label: "Upload Agreement Copy (PDF format)",
      hi: "एकरारनामा की प्रति अपलोड करें (PDF प्रारूप)",
      spec: "PDF Document · Up to 2MB",
      maxKB: 2048,
      height: 120,
      minWidth: 0,
      minHeight: 0,
      isPdf: true,
      accept: "application/pdf"
    });
  }

  // Unified handler for both Images and PDFs
  const handleFile = (field: string, file: File, maxKB: number, minWidth?: number, minHeight?: number, isPdf?: boolean) => {
    // 1. Validate file size
    if (file.size > maxKB * 1024) {
      const msg = `File must be under ${maxKB}KB`;
      setErrors((p) => ({ ...p, [field]: msg }));
      notifyError(msg);
      return;
    }
    
    // 2. Handle PDF Uploads (Bypass image dimension checks)
    if (isPdf) {
      if (file.type !== "application/pdf") {
        const msg = "Only PDF files are allowed for this field.";
        setErrors((p) => ({ ...p, [field]: msg }));
        notifyError(msg);
        return;
      }
      setErrors((p) => ({ ...p, [field]: "" }));
      
      // STORE BINARY FILE FOR BACKEND
      setFileObjects((prev) => ({ ...prev, [field]: file }));
      
      // Temporary URL just for UI preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setV((p) => ({ ...p, [field]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
      return;
    }

    // 3. Handle Image Uploads
    const validTypes = ['image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      const msg = "Only JPG and JPEG images are allowed.";
      setErrors((p) => ({ ...p, [field]: msg }));
      notifyError(msg);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    
    img.onload = () => {
      URL.revokeObjectURL(objectUrl); 
      
      if ((minWidth && img.width < minWidth) || (minHeight && img.height < minHeight)) {
        const msg = `Image is too small. Minimum required is ${minWidth}x${minHeight}px. Uploaded image is ${img.width}x${img.height}px.`;
        setErrors((p) => ({ ...p, [field]: msg }));
        notifyError(msg);
        return;
      }
      
      setErrors((p) => ({ ...p, [field]: "" }));
      
      // STORE BINARY FILE FOR BACKEND
      setFileObjects((prev) => ({ ...prev, [field]: file }));
      
      // Temporary URL just for UI preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setV((p) => ({ ...p, [field]: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      const msg = "The uploaded file is not a valid image.";
      setErrors((p) => ({ ...p, [field]: msg }));
      notifyError(msg);
    };

    img.src = objectUrl;
  };

  // Safe preview handler for Base64 Data URL (prevents browser blocking issues)
  const handlePreview = (dataUrl: string, label: string, isPdf?: boolean) => {
    if (isPdf) {
        // Render PDF preview properly
        const newWindow = window.open("");
        if (newWindow) {
          newWindow.document.write(`
            <html>
              <head><title>Preview - ${label}</title></head>
              <body style="margin:0; height:100vh;">
                <iframe src="${dataUrl}" width="100%" height="100%" style="border:none;"></iframe>
              </body>
            </html>
          `);
          newWindow.document.close();
        } else {
          notifyError("Pop-up blocked. Please allow pop-ups to view the preview.");
        }
        return;
    }

    // Default Image Preview
    const newWindow = window.open("");
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Preview - ${label}</title></head>
          <body style="margin:0; display:flex; justify-content:center; align-items:center; background:#121212; height:100vh;">
            <img src="${dataUrl}" style="max-width:100%; max-height:100%; box-shadow:0 0 15px rgba(0,0,0,0.5);" />
          </body>
        </html>
      `);
      newWindow.document.close();
    } else {
      notifyError("Pop-up blocked. Please allow pop-ups to view the preview.");
    }
  };

  const handleRemoveFile = (field: string) => {
    // 1. Remove from base64 preview state
    setV((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    // 2. Remove from binary file object state
    setFileObjects((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
    // 3. Clear any validation errors for this field
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleNext = async () => {
    // Validate all dynamically required fields are uploaded
    const e: Record<string, string> = {};
    uploads.forEach((u) => {
      if (!v[u.field as keyof PhotoData]) {
        e[u.field] = "This upload is required";
      }
    });
    setErrors((p) => ({ ...p, ...e }));
    
    // Check if any validation errors exist
    if (Object.values(e).some((error) => error)) {
      notifyError(Object.values(e)[0]);
      return;
    }

    // Check if all physical files exist in state (Safety Check)
    // const missingFiles = uploads.filter(
    //   (u) => !fileObjects[u.field as keyof PhotoData]
    // );
    // if (missingFiles.length > 0) {
    //   setStep4ApiError("Please upload all required files before saving.");
    //   notifyError("Please upload all required files before saving.");
    //   return;
    // }

    // Check if all physical files exist in state OR are already uploaded (Safety Check)
    const missingFiles = uploads.filter(
      (u) => !v[u.field as keyof PhotoData] && !fileObjects[u.field as keyof PhotoData]
    );
    
    if (missingFiles.length > 0) {
      setStep4ApiError("Please upload all required files before saving.");
      notifyError("Please upload all required files before saving.");
      return;
    }

    // Optimization: If there are no NEW files to upload, just go to the next step
    // without making an unnecessary API call that might fail for having an empty payload.
    if (Object.keys(fileObjects).length === 0) {
      notifySuccess("Files verified successfully.");
      onSave(v as PhotoData);
      return;
    }

    setStep4ApiError("");
    try {
      setIsSavingStep4(true);
      
      // ✅ CREATE FORMDATA FOR NATIVE BINARY UPLOAD
      const formData = new FormData();
      
      if (applicationId) {
        formData.append('applicationId', applicationId);
      }
      
      // ✅ APPEND BINARY FILES WITH THEIR EXACT FIELD NAMES
      uploads.forEach((u) => {
        const field = u.field as keyof PhotoData;
        const file = fileObjects[field];
        if (file) {
          // Key will be "photograph", "experienceCertificate", etc.
          formData.append(field, file, file.name);
        }
      });
      
      // Execute the API Call
      await applicationApi.saveStep4(formData);
      
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save uploads. Please try again.";
      setStep4ApiError(msg);
      notifyError(msg);
      setIsSavingStep4(false);
      return;
    } finally {
      setIsSavingStep4(false);
    }
    
    notifySuccess("Files saved successfully.");
    onSave(v as PhotoData);
  };

  return (
    <div className="space-y-6">
      <SectionTitle icon={Upload}>Photo, Signature & Document Upload</SectionTitle>
      <Note>
        Photograph must be recent, light background. Signatures on white paper,
        black/blue ink, scanned clearly. Supported formats: JPG, JPEG. (PNG is not allowed).
        PDF required for certificates.
      </Note>
      {step4ApiError && <Note tone="danger">{step4ApiError}</Note>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {uploads.map((u) => (
          <div
            key={u.field}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div>
              <div
                className="text-[11px] font-extrabold uppercase leading-tight"
                style={{ color: OCHRE_DEEP }}
              >
                * {u.label}
              </div>
              <div
                className="text-[11px] font-medium"
                style={{ color: INK_SOFT }}
              >
                {u.hi}
              </div>
              <div
                className="text-[10.5px] font-medium mt-1"
                style={{ color: INK_SOFT }}
              >
                {u.spec}
              </div>
              {fileObjects[u.field as keyof PhotoData] && (
                <div
                  className="text-[10.5px] font-medium mt-1"
                  style={{ color: TEAL }}
                >
                  Size: {(fileObjects[u.field as keyof PhotoData].size / 1024).toFixed(1)} KB •
                  Type: {fileObjects[u.field as keyof PhotoData].type.split("/")[1]?.toUpperCase()}
                </div>
              )}
            </div>
            
            <div
              className="rounded-xl flex items-center justify-center overflow-hidden relative group"
              style={{
                height: u.height,
                background: "#F6F7F9",
                border: `1.5px dashed ${errors[u.field] ? DANGER : LINE}`,
              }}
            >
              {v[u.field as keyof PhotoData] ? (
                u.isPdf ? (
                  <div className="flex flex-col items-center justify-center">
                    <ClipboardCheck size={30} style={{ color: TEAL }} className="mb-2" />
                    <span className="text-[11px] font-bold" style={{ color: TEAL }}>PDF Attached</span>
                  </div>
                ) : (
                  <img
                    src={v[u.field as keyof PhotoData] as string}
                    alt={u.label}
                    className="w-full h-full object-contain"
                  />
                )
              ) : (
                <div className="text-center p-2">
                  <Upload
                    size={18}
                    style={{ color: INK_SOFT }}
                    className="mx-auto mb-1"
                  />
                  <div
                    className="text-[11px] font-semibold"
                    style={{ color: INK_SOFT }}
                  >
                    No file chosen
                  </div>
                </div>
              )}
            </div>
            
            <label className="gf-btn-secondary w-full text-[11.5px] py-2 cursor-pointer mt-3">
              <Upload size={13} /> Choose file
              <input
                type="file"
                accept={u.accept || "image/jpeg,image/jpg"} 
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    handleFile(u.field, f, u.maxKB, u.minWidth, u.minHeight, u.isPdf);
                    e.target.value = '';
                  }
                }}
              />
            </label>
            
            {errors[u.field] && (
              <div
                className="flex items-center gap-1 text-[11px] font-bold"
                style={{ color: DANGER }}
              >
                <AlertCircle size={11} /> {errors[u.field]}
              </div>
            )}
            
            {/* {v[u.field as keyof PhotoData] && !errors[u.field] && (
              <div className="flex items-center justify-between pt-1">
                <div
                  className="flex items-center gap-1 text-[11px] font-bold"
                  style={{ color: TEAL }}
                >
                  <CheckCircle2 size={11} /> Uploaded
                </div>
                
                <button
                  type="button"
                  onClick={() => handlePreview(v[u.field as keyof PhotoData] as string, u.label, u.isPdf)}
                  className="flex items-center gap-1 text-[11.5px] font-bold underline"
                  style={{ color: TEAL, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  <Eye size={12} /> Preview
                </button>
              </div>
            )} */}

            {v[u.field as keyof PhotoData] && !errors[u.field] && (
              <div className="flex items-center justify-between pt-1">
                <div
                  className="flex items-center gap-1 text-[11px] font-bold"
                  style={{ color: TEAL }}
                >
                  <CheckCircle2 size={11} /> Uploaded
                </div>
                
                {/* Wrapped the buttons in a flex container */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePreview(v[u.field as keyof PhotoData] as string, u.label, u.isPdf)}
                    className="flex items-center gap-1 text-[11.5px] font-bold underline"
                    style={{ color: TEAL, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Eye size={12} /> Preview
                  </button>

                  {/* ADDED REMOVE BUTTON */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(u.field)}
                    className="flex items-center gap-1 text-[11.5px] font-bold underline"
                    style={{ color: DANGER, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary"
          disabled={isSavingStep4}
          onClick={handleNext}
        >
          {isSavingStep4 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>
              Save &amp; Next <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 5 — LIVE PHOTO (BINARY FORMAT)
--------------------------------------------------------------- */

const Step5LivePhoto: React.FC<Step5Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [videoEl, setVideoEl] = useState<HTMLVideoElement | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [camError, setCamError] = useState("");
  const [isSavingStep5, setIsSavingStep5] = useState(false);
  const [confirmed, setConfirmed] = useState<{ dataUrl: string; file: File } | null>(
    data.livePhoto ? { dataUrl: data.livePhoto, file: null as unknown as File } : null,
  );

  const detectionEnabled = cameraReady && !confirmed;
  const { state, capturedDataUrl, capturedFile, reset } = useFaceLiveness({
    videoEl,
    enabled: detectionEnabled,
    // Edge-triggered: fires once per spoof/multi-user event (flat photo or
    // screen held up, frozen/static image, or a different person swapping
    // in mid-flow) rather than spamming on every frame.
    onSecurityEvent: (msg) => notifyError(`${msg.en} · ${msg.hi}`),
  });

  // Once the hook auto-captures, lock it in as the "confirmed" shot.
  useEffect(() => {
    if (state.step === "CAPTURED" && capturedDataUrl && capturedFile) {
      setConfirmed({ dataUrl: capturedDataUrl, file: capturedFile });
    }
  }, [state.step, capturedDataUrl, capturedFile]);

  const videoConstraints = { width: 640, height: 480, facingMode: "user" as const };

  const handleUserMedia = useCallback(() => {
    setCameraReady(true);
    // react-webcam exposes the underlying <video> element here.
    setVideoEl(webcamRef.current?.video || null);
  }, []);

  const handleUserMediaError = useCallback(() => {
    const msg =
      "Unable to access the camera. Please allow camera permission and try again. · कैमरा एक्सेस अस्वीकृत।";
    setCamError(msg);
    notifyError(msg);
  }, []);

  const retake = () => {
    setConfirmed(null);
    setCamError("");
    reset();
  };

  useEffect(() => {
    return () => {
      const stream = webcamRef.current?.video?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleNext = async () => {
    if (!confirmed) {
      const msg = "Please complete the liveness check to capture your photo. · कृपया लाइवनेस जांच पूरी करें।";
      setCamError(msg);
      notifyError(msg);
      return;
    }

    if (!confirmed.file) {
      notifySuccess("Live photo verified successfully.");
      onSave({ livePhoto: confirmed.dataUrl });
      return;
    }

    setCamError("");
    try {
      setIsSavingStep5(true);
      const formData = new FormData();
      if (applicationId) formData.append("applicationId", applicationId);
      if (confirmed.file) {
        formData.append("livePhoto", confirmed.file, confirmed.file.name);
      }
      await applicationApi.saveStep5(formData);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save live photo. Please try again.";
      setCamError(msg);
      notifyError(msg);
      setIsSavingStep5(false);
      return;
    } finally {
      setIsSavingStep5(false);
    }

    notifySuccess("Live photo saved successfully.");
    onSave({ livePhoto: confirmed.dataUrl });
  };

  const toneColor = (tone: "info" | "warn" | "success") =>
    tone === "success" ? TEAL : tone === "warn" ? DANGER : OCHRE_DEEP;
  const toneBg = (tone: "info" | "warn" | "success") =>
    tone === "success" ? "#E8F3EF" : tone === "warn" ? "#FBEAE6" : "#FAF6EF";

  const checklist: { key: keyof typeof state.progress; label: string; hi: string; icon: React.ElementType }[] = [
    { key: "blink", label: "Blink detected", hi: "पलक झपकाना", icon: Eye },
    { key: "headTurn", label: "Head turn detected", hi: "सिर घुमाना", icon: RefreshCw },
  ];

  return (
    <div className="space-y-6">
      <SectionTitle icon={Camera}>Live Photo Capture</SectionTitle>
      <Note tone="danger">
        Mandatory — a live photo is captured automatically once the system verifies
        you are a real person in front of the camera (blink, head turn, and smile
        checks). It is re-verified at admit-card download.
      </Note>

      <div className="flex flex-col items-center gap-5">
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center w-full max-w-[420px]"
          style={{ aspectRatio: "4 / 3", background: "#0E1826", border: `2px solid ${LINE}` }}
        >
          {confirmed ? (
            <img src={confirmed.dataUrl} alt="Captured" className="w-full h-full object-cover" />
          ) : (
            <Webcam
              ref={webcamRef}
              mirrored
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleUserMediaError}
              className="w-full h-full object-cover"
            />
          )}

          {confirmed && (
            <div className="absolute top-2 right-2 rounded-full p-1" style={{ background: TEAL }}>
              <CheckCircle2 size={15} color="#fff" />
            </div>
          )}

          {/* Live status banner overlay */}
          {!confirmed && cameraReady && (
            <div
              className="absolute bottom-0 left-0 right-0 px-3 py-2 text-center"
              style={{
                background: "rgba(14,24,38,0.78)",
                color: state.message.tone === "warn" ? "#FFB4A3" : "#fff",
              }}
            >
              <div className="text-[12.5px] font-extrabold">
                {state.step === "COUNTDOWN" && state.countdown != null
                  ? `${state.message.en} ${state.countdown}…`
                  : state.message.en}
              </div>
              <div className="text-[10.5px] font-medium opacity-90">{state.message.hi}</div>
            </div>
          )}
        </div>

        {camError && (
          <div className="max-w-sm w-full">
            <Note tone="danger">{camError}</Note>
          </div>
        )}

        {/* Gesture checklist */}
        {!confirmed && cameraReady && (
          <div className="flex gap-2.5 flex-wrap justify-center">
            {checklist.map((c) => {
              const done = state.progress[c.key];
              const Icon = c.icon;
              return (
                <div
                  key={c.key}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{
                    background: done ? "#E8F3EF" : "#F1F2F4",
                    border: `1.5px solid ${done ? TEAL : LINE}`,
                  }}
                >
                  {done ? <CheckCircle2 size={13} style={{ color: TEAL }} /> : <Icon size={13} style={{ color: OCHRE_DEEP }} />}
                  <span className="text-[11px] font-bold" style={{ color: done ? TEAL : INK }}>
                    {c.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {!cameraReady && !confirmed && !camError && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}>
            <Loader2 size={15} className="gf-spin" style={{ color: OCHRE_DEEP }} />
            <span className="text-[12.5px] font-bold" style={{ color: OCHRE_DEEP }}>
              Initializing camera... · कैमरा प्रारंभ हो रहा है...
            </span>
          </div>
        )}

        {cameraReady && !confirmed && state.step === "LOADING_MODEL" && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: toneBg("info"), border: "1px solid #ECD9BE" }}>
            <Loader2 size={15} className="gf-spin" style={{ color: toneColor("info") }} />
            <span className="text-[12.5px] font-bold" style={{ color: toneColor("info") }}>
              Loading face detection… · फेस डिटेक्शन लोड हो रहा है…
            </span>
          </div>
        )}

        {confirmed && (
          <div className="flex gap-3 flex-wrap justify-center items-center">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
            >
              <CheckCircle2 size={15} style={{ color: TEAL }} />
              <span className="text-[12.5px] font-bold" style={{ color: TEAL }}>
                Live photo captured successfully! · लाइव फोटो सफलतापूर्वक कैप्चर हुआ!
              </span>
            </div>
            <button onClick={retake} className="gf-btn-secondary">
              <RotateCcw size={15} /> Retake
            </button>
          </div>
        )}

        {state.step === "ERROR" && !confirmed && (
          <div className="max-w-sm w-full">
            <Note tone="danger">
              <div className="flex items-center gap-1">
                <AlertCircle size={13} /> {state.message.en} · {state.message.hi}
              </div>
            </Note>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button className="gf-btn-primary" disabled={!confirmed || isSavingStep5} onClick={handleNext}>
          {isSavingStep5 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>Save &amp; Next</>
          )}
        </button>
      </div>
    </div>
  );
};


/* ---------------------------------------------------------------
   STEP 6 — REVIEW & SUBMIT
--------------------------------------------------------------- */
interface ReviewRowProps {
  label: string;
  hi?: string;
  value?: string | number | boolean | null;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, hi, value }) => {
  // Convert backend booleans to YES/NO for better readability
  const displayValue = typeof value === "boolean" ? (value ? "YES" : "NO") : value;

  return displayValue !== undefined && displayValue !== null && String(displayValue).trim() !== "" ? (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 py-1.5"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="text-[11px] font-semibold sm:w-56 shrink-0"
        style={{ color: INK_SOFT }}
      >
        {label}
        {hi && <span className="block text-[10px] font-medium">{hi}</span>}
      </span>
      <span className="text-[12px] font-bold" style={{ color: INK }}>
        {String(displayValue)}
      </span>
    </div>
  ) : null;
};

interface ReviewSectionProps {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  step,
  onEdit,
  children,
}) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ background: CARD, border: `1.5px solid ${LINE}` }}
  >
    <div
      className="px-5 py-3 flex items-center justify-between"
      style={{ background: INK }}
    >
      <span className="text-[12px] font-extrabold tracking-wide text-white">
        {title}
      </span>
      {/* <button
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-[11px] font-bold transition-opacity hover:opacity-80"
        style={{ color: "#C9D3E0" }}
      >
        <Eye size={12} /> Edit
      </button> */}
      {/* Hide the Edit button ONLY if it is step 2 (Payment) */}
      {step !== 2 && (
        <button
          onClick={() => onEdit(step)}
          className="flex items-center gap-1 text-[11px] font-bold transition-opacity hover:opacity-80"
          style={{ color: "#C9D3E0" }}
        >
          <Eye size={12} /> Edit
        </button>
      )}
    </div>
    <div className="p-5">{children}</div>
  </div>
);

// Added autoFill to props to catch the missing step0 data
const Step6Review: React.FC<Step6Props & { applicationId?: string; autoFill?: Record<string, any> }> = ({
  formData,
  onSubmit,
  onEdit,
  applicationId,
  autoFill = {},
}) => {
  const [declared, setDeclared] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  
  // Merge step0 (autoFill) and step1 (formData.personal) to get the complete picture
  const p: any = { ...autoFill, ...(formData.personal || {}) };
  
  // Handle nested 'qualification' object from API if present
  const e = formData.education?.qualification || formData.education || {};
  const pay: any = formData.payment || {};
  const ph: any = formData.photos || {};
  const lp: any = formData.livePhoto || {};

  const handleSubmit = async () => {
    if (!declared) {
      const msg = "You must accept the declaration to submit. · घोषणा स्वीकार करनी होगी।";
      setErr(msg);
      notifyError(msg);
      return;
    }

    if (!applicationId) {
      const msg = "Application not found. Please refresh and try again.";
      setErr(msg);
      notifyError(msg);
      return;
    }

    setErr("");
    try {
      setIsSubmittingFinal(true);
      await applicationApi.submitApplicationFinal(applicationId);
    } catch (apiErr: any) {
      const msg =
        apiErr?.response?.data?.message || apiErr?.message || "Failed to submit application. Please try again.";
      setErr(msg);
      notifyError(msg);
      return;
    } finally {
      setIsSubmittingFinal(false);
    }
    notifySuccess("Application submitted successfully.");
    onSubmit();
  };

  // Safe checks accommodating both API formats ("YES" strings vs boolean true)
  const isBiharDomicile = p.domicileOfBihar === "YES" || p.isBiharDomicile === true;
  const isPwD = isBiharDomicile && (p.disability === "YES" || p.isPwd === true);
  const isMin40PwD = isPwD && (p.disabilityPercent === "YES" || p.pwd40Percent === true || p.pwd40Percent === "YES");
  const isExServiceman = isBiharDomicile && (p.exServiceman === "YES" || p.isExServiceman === true);
  const isContractual = isBiharDomicile && (p.contractualEmployee === "YES" || p.contractualEmp === "YES" || p.isContractualEmp === true);
  const isDebarred = p.isDebarred === "YES" || p.isDebarred === true;
  const isSportsQuota = p.isSportsQuota === "YES" || p.isSportsQuota === true;

  // Format dates cleanly regardless of format (ISO vs DD-MM-YYYY)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    if (dateString.includes("T")) return dateString.split("T")[0]; // Handles ISO
    return dateString;
  };

  return (
    <div className="space-y-5">
      <SectionTitle icon={ClipboardCheck}>Review Your Application</SectionTitle>
      <Note>
        Please review all details carefully. Once submitted, Name, Mobile
        Number, and Email ID cannot be changed.
      </Note>

      {/* ── STEP 1 · BASIC INFORMATION ── */}
      <ReviewSection title="STEP 1 · PERSONAL DETAILS" step={1} onEdit={onEdit}>
        
        {/* BASIC INFORMATION */}
        <div className="text-[11px] font-extrabold mb-2" style={{ color: OCHRE_DEEP }}>
          Basic Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Name of applicant" hi="आवेदक का नाम" value={p.applicantName || p.fullName} />
          <ReviewRow label="Father's name" hi="पिता का नाम" value={p.fatherName} />
          <ReviewRow label="Mother's name" hi="माता का नाम" value={p.motherName} />
          <ReviewRow label="Gender" hi="लिंग" value={p.gender} />
          <ReviewRow label="Nationality" hi="राष्ट्रीयता" value={p.nationality} />
          <ReviewRow label="Email ID" hi="ईमेल आईडी" value={p.emailId} />
          <ReviewRow label="Mobile number" hi="मोबाइल नम्बर" value={p.mobileNo || p.mobileNumber} />
          <ReviewRow label="Confirm mobile number" hi="मोबाइल नंबर की पुष्टि" value={p.confirmMobileNo} />
          <ReviewRow label="Alternate number" hi="वैकल्पिक नंबर" value={p.alternateNumber} />
          <ReviewRow label="Date of birth" hi="जन्म तिथि" value={formatDate(p.dateOfBirth)} />
        </div>

        {/* IDENTIFICATION MARKS */}
        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Identification Marks · पहचान चिह्न
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Identification Mark 1" hi="पहचान चिह्न 1" value={p.identificationMark1 || p.identificationMarkEn} />
          <ReviewRow label="Identification Mark 2" hi="पहचान चिह्न 2" value={p.identificationMark2 || p.identificationMarkEn2} />
        </div>

        {/* MARITAL STATUS */}
        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Marital Status · वैवाहिक स्थिति
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Are you married?" hi="क्या आप विवाहित हैं?" value={p.isMarried || p.maritalStatus === "MARRIED" ? "YES" : "NO"} />
          {(p.isMarried === "YES" || p.maritalStatus === "MARRIED") && (
            <ReviewRow label="Spouse's name" hi="पति/पत्नी का नाम" value={p.spouseName} />
          )}
        </div>

        {/* DOMICILE & CATEGORY */}
        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Domicile &amp; Category / Reservation
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Domicile of Bihar state?" hi="बिहार राज्य का निवासी?" value={isBiharDomicile ? "YES" : "NO"} />
          {isBiharDomicile && (
            <>
              <ReviewRow label="Domicile certificate number" hi="प्रमाणपत्र संख्या" value={p.domicileCertificateNumber} />
              <ReviewRow label="Domicile — issue date" hi="जारी करने की तिथि" value={formatDate(p.domicileCertificateIssueDate)} />
              <ReviewRow label="Domicile — issuing authority" hi="जारीकर्ता प्राधिकारी" value={p.domicileCertificateAuthority} />
            </>
          )}
          <ReviewRow label="Category" hi="श्रेणी" value={p.category} />
          <ReviewRow label="Caste" hi="जाति" value={p.caste} />
          <ReviewRow label="Do you belong to non-creamy layer?" hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?" value={p.isNonCreamyLayer || p.nonCreamyLayer} />
          <ReviewRow label="Category certificate number" hi="प्रमाणपत्र संख्या" value={p.categoryCertNo || p.categoryCertificateNumber} />
          <ReviewRow label="Category — issue date" hi="जारी करने की तिथि" value={formatDate(p.categoryIssueDate || p.categoryCertificateIssueDate)} />
          <ReviewRow
            label="Category — issuing authority"
            hi="जारीकर्ता प्राधिकारी"
            value={p.categoryAuthority === "Other" ? p.categoryAuthorityOther : (p.categoryAuthority || p.categoryCertificateAuthority)}
          />
        </div>

        {/* SPECIAL CATEGORIES */}
        {isBiharDomicile && (
          <>
            <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
              Special Categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <ReviewRow label="Person with disability?" hi="दिव्यांगता वाले व्यक्ति?" value={isPwD ? "YES" : "NO"} />
              {isPwD && (
                <>
                  <ReviewRow label="Type of disability" hi="दिव्यांगता का प्रकार" value={p.natureOfDisability || p.pwdType} />
                  <ReviewRow label="Nature of disability?" hi="दिव्यांगता की प्रकृति" value={p.natureOfDisabilityType || p.disTypePersist} />
                  <ReviewRow label="Minimum 40% disability?" hi="न्यूनतम 40% दिव्यांगता?" value={isMin40PwD ? "YES" : "NO"} />
                  {isMin40PwD && (
                    <ReviewRow label="Is scribe required?" hi="क्या लेखक (स्क्राइब) की आवश्यकता है?" value={p.isScribeRequired || p.isownscribe} />
                  )}
                  <ReviewRow label="Disability certificate number" hi="प्रमाणपत्र संख्या" value={p.disabilityCertNo || p.pwdCertificateNumber} />
                  <ReviewRow label="Disability — issue date" hi="जारी करने की तिथि" value={formatDate(p.disabilityIssueDate || p.pwdCertificateIssueDate)} />
                  <ReviewRow
                    label="Disability — issuing authority"
                    hi="जारीकर्ता प्राधिकारी"
                    value={p.disabilityAuthority === "Other" ? p.disabilityAuthorityOther : (p.disabilityAuthority || p.pwdCertificateAuthority)}
                  />
                </>
              )}
              
              <ReviewRow label="Ex-serviceman?" hi="भूतपूर्व सैनिक?" value={isExServiceman ? "YES" : "NO"} />
              {isExServiceman && (
                <>
                  <ReviewRow label="Service in defence — from date" hi="रक्षा में सेवा — दिनांक से" value={formatDate(p.serviceFromDate)} />
                  <ReviewRow label="Service in defence — to date" hi="रक्षा में सेवा — दिनांक तक" value={formatDate(p.serviceToDate)} />
                  <ReviewRow label="Service Duration" hi="सेवा अवधि" value={p.servicePeriod} />
                </>
              )}
              
              <ReviewRow label="Ward of freedom fighter?" hi="स्वतंत्रता सेनानी के वार्ड?" value={p.wardOfFreedomFighter} />
              {(p.wardOfFreedomFighter === "YES" || p.wardOfFreedomFighter === true) && (
                <>
                  <ReviewRow label="Certificate no." hi="प्रमाणपत्र संख्या" value={p.freedomFighterCertNo} />
                  <ReviewRow label="Issuing authority" hi="जारीकर्ता प्राधिकारी" value={p.freedomFighterAuthority} />
                </>
              )}
            </div>

            <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
              Employment Status
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <ReviewRow label="Bihar govt. employee, 3+ years continuous service?" hi="बिहार सरकार के कर्मचारी, 3+ वर्ष सेवा?" value={p.biharGovtEmployee || p.biharGovtEmp} />
              <ReviewRow label="Number of prior attempts (after 12-12-2022)" hi="पूर्व प्रयासों की संख्या" value={p.numberOfAttempts || p.bsscAttempts} />
              
              <ReviewRow label="Contractual employee?" hi="संविदा कर्मी?" value={isContractual ? "YES" : "NO"} />
              {isContractual && (
                <>
                  <ReviewRow label="Organization Name" hi="संगठन का नाम" value={p.organizationName} />
                  <ReviewRow label="Experience in advertised post?" hi="विज्ञापित पद में अनुभव?" value={p.hasPostExperience} />
                  <ReviewRow label="Name of post" hi="पद का नाम" value={p.nameOfPost || p.postName} />
                  <ReviewRow label="Agreement under circular 1003?" hi="संकल्प 1003 के अनुसार एकरारनामा?" value={p.agreementCircular || p.hasAgreement} />
                  <ReviewRow label="Contractual service — from date" hi="संविदा सेवा अवधि — दिनांक से" value={formatDate(p.contractualFromDate)} />
                  <ReviewRow label="Contractual service — to date" hi="संविदा सेवा अवधि — दिनांक तक" value={formatDate(p.contractualToDate)} />
                  <ReviewRow label="Contractual Duration" hi="संविदा सेवा अवधि" value={p.contractualPeriod} />
                </>
              )}
              
              <ReviewRow label="Debarred from any examination?" hi="किसी परीक्षा से वंचित?" value={isDebarred ? "YES" : "NO"} />
              {isDebarred && (
                <>
                  <ReviewRow label="Debarment — from date" hi="वंचन — दिनांक से" value={formatDate(p.debarredFromDate)} />
                  <ReviewRow label="Debarment — to date" hi="वंचन — दिनांक तक" value={formatDate(p.debarredToDate)} />
                  <ReviewRow label="Reason for debarment" hi="वंचन का कारण" value={p.debarmentReason} />
                  <ReviewRow label=" Recruitment Board/Commission" hi="भर्ती बोर्ड/आयोग" value={p.recruitmentBoard} />
                </>
              )}
            </div>
          </>
        )}

        {/* ID PROOF */}
        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          ID Proof
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Do you have an Aadhar card?" hi="क्या आपके पास आधार कार्ड है?" value={p.hasAadharCard} />
          {p.hasAadharCard === "YES" && (
            <ReviewRow label="Aadhar number" hi="आधार संख्या" value={p.aadharCardNumber} />
          )}
          <ReviewRow label="Type of photo ID proof" hi="फोटो पहचान प्रमाण का प्रकार" value={p.typeOfPhotoIdProof} />
          {p.typeOfPhotoIdProof === "GOVERNMENT_ID" ? (
            <ReviewRow label="Government ID number" hi="सरकारी पहचान संख्या" value={p.governmentIdNumber} />
          ) : (
            <ReviewRow label="ID proof number" hi="पहचान प्रमाण संख्या" value={p.idProofNo} />
          )}
        </div>

        {/* PERMANENT ADDRESS */}
        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Permanent Address
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Village" hi="गाँव/मोहल्ला" value={p.permVillage || p.address?.permanent?.village} />
          <ReviewRow label="Police Station" hi="पुलिस थाना" value={p.permPoliceStation || p.address?.permanent?.policeStation} />
          <ReviewRow label="Post Office" hi="डाकघर" value={p.permPostOffice || p.address?.permanent?.postOffice} />
          <ReviewRow label="District" hi="जिला" value={p.permDistrict || p.address?.permanent?.district} />
          <ReviewRow label="State" hi="राज्य" value={p.permState || p.address?.permanent?.state} />
          <ReviewRow label="Pin Code" hi="पिन कोड" value={p.permPinCode || p.address?.permanent?.pinCode} />
        </div>

        {/* CORRESPONDENCE ADDRESS */}
        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Correspondence Address
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <ReviewRow label="Village" hi="गाँव/मोहल्ला" value={p.corrVillage || p.address?.correspondence?.village} />
          <ReviewRow label="Police Station" hi="पुलिस थाना" value={p.corrPoliceStation || p.address?.correspondence?.policeStation} />
          <ReviewRow label="Post Office" hi="डाकघर" value={p.corrPostOffice || p.address?.correspondence?.postOffice} />
          <ReviewRow label="District" hi="जिला" value={p.corrDistrict || p.address?.correspondence?.district} />
          <ReviewRow label="State" hi="राज्य" value={p.corrState || p.address?.correspondence?.state} />
          <ReviewRow label="Pin Code" hi="पिन कोड" value={p.corrPinCode || p.address?.correspondence?.pinCode} />
        </div>
      </ReviewSection>

      {/* ── STEP 2 · PAYMENT ── */}
      <ReviewSection title="STEP 2 · PAYMENT" step={2} onEdit={onEdit}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
        >
          <CheckCircle2 size={17} style={{ color: TEAL }} />
          <div>
            <div className="text-[13px] font-extrabold uppercase" style={{ color: TEAL }}>
              ₹{pay.amount || pay.applicationFee || "135"} — {pay.paymentStatus === 'completed' ? 'Fee Paid' : pay.paymentStatus || 'Pending'}
            </div>
            <div
              className="text-[11.5px] font-semibold mt-0.5"
              style={{ color: INK_SOFT }}
            >
              Payment mode: {pay.paymentMode || "N/A"} | Txn ID: {pay.transactionId || pay.paymentOrderId || "N/A"}
            </div>
          </div>
        </div>
      </ReviewSection>

      {/* ── STEP 3 · EDUCATION ── */}
      <ReviewSection title="STEP 3 · EDUCATION" step={3} onEdit={onEdit}>
        <div className="space-y-3">
          {[
            ["10th / Equivalent · 10वीं / समकक्ष", e.tenth],
            ["12th / Equivalent · 12वीं / समकक्ष", e.twelfth],
            ["Graduation / Equivalent · स्नातक / समकक्ष", e.graduation],
          ].map(
            ([label, d]: [string, any]) =>
              d && Object.keys(d).length > 0 && (
                <div
                  key={label}
                  className="p-3 rounded-xl"
                  style={{ background: PAPER, border: `1px solid ${LINE}` }}
                >
                  <div
                    className="text-[11px] font-extrabold mb-2"
                    style={{ color: OCHRE_DEEP }}
                  >
                    {label}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11.5px]">
                    <div>
                      <span style={{ color: INK_SOFT }}>Subject · विषय: </span>
                      <span className="font-bold uppercase" style={{ color: INK }}>
                        {d.subject}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Board / University · बोर्ड: </span>
                      <span className="font-bold uppercase" style={{ color: INK }}>
                        {d.boardUniversity}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Total marks · कुल अंक: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.totalMarks}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Obtained marks · प्राप्त अंक: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.obtainedMarks || d.marksObtained}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Passing Year · उत्तीर्ण वर्ष: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.passingYear}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Certificate no. · प्रमाणपत्र संख्या: </span>
                      <span className="font-bold uppercase" style={{ color: INK }}>
                        {d.certNumber}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Issue date · जारी करने की तिथि: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {formatDate(d.certIssueDate)}
                      </span>
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
      </ReviewSection>

      {/* ── STEP 4 & 5 · PHOTOS ── */}
      {/* <ReviewSection title="STEP 4 & 5 · PHOTOS" step={4} onEdit={onEdit}>
        <div className="flex flex-wrap gap-5">
          {(ph.photograph || ph.passportPhoto) && (
            <div className="text-center">
              <img
                src={ph.photograph || ph.passportPhoto}
                alt="Passport"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Passport photo · पासपोर्ट फोटो
              </div>
            </div>
          )}
          {(ph.signatureEnglish || ph.signatureEn) && (
            <div className="text-center">
              <img
                src={ph.signatureEnglish || ph.signatureEn}
                alt="Sig EN"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (English) · हस्ताक्षर (अंग्रेजी)
              </div>
            </div>
          )}
          {(ph.signatureHindi || ph.signatureHi) && (
            <div className="text-center">
              <img
                src={ph.signatureHindi || ph.signatureHi}
                alt="Sig HI"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (Hindi) · हस्ताक्षर (हिंदी)
              </div>
            </div>
          )}
          {lp.livePhoto && (
            <div className="text-center">
              <img
                src={lp.livePhoto}
                alt="Live"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `2px solid ${TEAL}` }}
              />
              <div
                className="text-[10.5px] font-bold mt-1 flex items-center justify-center gap-1"
                style={{ color: TEAL }}
              >
                <CheckCircle2 size={12}/> Live photo · लाइव फोटो
              </div>
            </div>
          )}

          {ph.experienceCertificate && (
            <a 
              href={ph.experienceCertificate} 
              target="_blank" 
              rel="noreferrer" 
              className="text-center flex flex-col items-center justify-center p-3 rounded-lg w-24 h-24 hover:bg-gray-50 transition-colors cursor-pointer" 
              style={{ border: `1px solid ${LINE}`, textDecoration: 'none' }}
            >
              <ClipboardCheck size={28} style={{ color: TEAL }} />
              <div className="text-[10px] font-semibold mt-2 leading-tight" style={{ color: INK_SOFT }}>
                Experience<br/>Certificate
              </div>
              <div className="text-[9px] font-bold mt-1 text-blue-600 underline">View PDF</div>
            </a>
          )}

          {ph.agreementCopy && (
            <a 
              href={ph.agreementCopy} 
              target="_blank" 
              rel="noreferrer" 
              className="text-center flex flex-col items-center justify-center p-3 rounded-lg w-24 h-24 hover:bg-gray-50 transition-colors cursor-pointer" 
              style={{ border: `1px solid ${LINE}`, textDecoration: 'none' }}
            >
              <ClipboardCheck size={28} style={{ color: TEAL }} />
              <div className="text-[10px] font-semibold mt-2 leading-tight" style={{ color: INK_SOFT }}>
                Agreement<br/>Copy
              </div>
              <div className="text-[9px] font-bold mt-1 text-blue-600 underline">View PDF</div>
            </a>
          )}
        </div>
      </ReviewSection> */}

      {/* ── STEP 4 · PHOTO & DOCUMENT UPLOAD ── */}
      <ReviewSection title="STEP 4 · PHOTO & DOCUMENT UPLOAD" step={4} onEdit={onEdit}>
        <div className="flex flex-wrap gap-5">
          {(ph.photograph || ph.passportPhoto) && (
            <div className="text-center">
              <img
                src={ph.photograph || ph.passportPhoto}
                alt="Passport"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Passport photo · पासपोर्ट फोटो
              </div>
            </div>
          )}
          {(ph.signatureEnglish || ph.signatureEn) && (
            <div className="text-center">
              <img
                src={ph.signatureEnglish || ph.signatureEn}
                alt="Sig EN"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (English) · हस्ताक्षर (अंग्रेजी)
              </div>
            </div>
          )}
          {(ph.signatureHindi || ph.signatureHi) && (
            <div className="text-center">
              <img
                src={ph.signatureHindi || ph.signatureHi}
                alt="Sig HI"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (Hindi) · हस्ताक्षर (हिंदी)
              </div>
            </div>
          )}
          {ph.experienceCertificate && (
            <a 
              href={ph.experienceCertificate} 
              target="_blank" 
              rel="noreferrer" 
              className="text-center flex flex-col items-center justify-center p-3 rounded-lg w-24 h-24 hover:bg-gray-50 transition-colors cursor-pointer" 
              style={{ border: `1px solid ${LINE}`, textDecoration: 'none' }}
            >
              <ClipboardCheck size={28} style={{ color: TEAL }} />
              <div className="text-[10px] font-semibold mt-2 leading-tight" style={{ color: INK_SOFT }}>
                Experience<br/>Certificate
              </div>
              <div className="text-[9px] font-bold mt-1 text-blue-600 underline">View PDF</div>
            </a>
          )}
          {ph.agreementCopy && (
            <a 
              href={ph.agreementCopy} 
              target="_blank" 
              rel="noreferrer" 
              className="text-center flex flex-col items-center justify-center p-3 rounded-lg w-24 h-24 hover:bg-gray-50 transition-colors cursor-pointer" 
              style={{ border: `1px solid ${LINE}`, textDecoration: 'none' }}
            >
              <ClipboardCheck size={28} style={{ color: TEAL }} />
              <div className="text-[10px] font-semibold mt-2 leading-tight" style={{ color: INK_SOFT }}>
                Agreement<br/>Copy
              </div>
              <div className="text-[9px] font-bold mt-1 text-blue-600 underline">View PDF</div>
            </a>
          )}
        </div>
      </ReviewSection>

      {/* ── STEP 5 · LIVE PHOTO ── */}
      <ReviewSection title="STEP 5 · LIVE PHOTO" step={5} onEdit={onEdit}>
        <div className="flex flex-wrap gap-5">
          {lp.livePhoto && (
            <div className="text-center">
              <img
                src={lp.livePhoto}
                alt="Live"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `2px solid ${TEAL}` }}
              />
              <div
                className="text-[10.5px] font-bold mt-1 flex items-center justify-center gap-1"
                style={{ color: TEAL }}
              >
                <CheckCircle2 size={12}/> Live photo · लाइव फोटो
              </div>
            </div>
          )}
        </div>
      </ReviewSection>

      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: CARD, border: `1.5px solid ${LINE}` }}
      >
        <div className="text-[12.5px] font-extrabold" style={{ color: INK }}>
          Declaration
        </div>
        <div
          className="text-[12px] leading-relaxed p-4 rounded-xl"
          style={{ background: PAPER, border: `1px solid ${LINE}`, color: INK }}
        >
          I HEREBY DECLARE THAT THE INFORMATION FILLED UP ABOVE BY ME ARE TRUE AND CORRECT TO 
          THE BEST OF MY KNOWLEDGE. I ALSO DECLARE THAT I HAVE FILLED UP ONLY ONE APPLICATION 
          FORM. I ALSO UNDERTAKE THAT IF ANY INFORMATION IS FOUND OTHERWISE, I SHALL BE LIABLE 
          FOR ANY LEGAL ACTION AND CANCELLATION OF MY CANDIDATURE.
          <div className="mt-2" style={{ color: INK_SOFT }}>
            मैं यह भी वचन देता/देती हूँ कि यदि मेरे द्वारा प्रस्तुत कोई भी जानकारी अथवा दस्तावेज किसी भी स्तर पर असत्य,
            भ्रामक या तथ्यों के विपरीत पाए जाते हैं, तो मेरी अभ्यर्थिता/नियुक्ति बिना किसी पूर्व सूचना के निरस्त की जा 
            सकती है तथा मेरे विरुद्ध प्रचलित नियमों के अनुसार विधिसम्मत कानूनी एवं प्रशासनिक कार्रवाई की जा सकती है।
          </div>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDeclared(e.target.checked);
              setErr("");
            }}
            className="w-4 h-4 mt-0.5"
            style={{ accentColor: INK }}
          />
          <span className="text-[13px] font-bold" style={{ color: INK }}>
            I accept the above declaration · मैं घोषणा स्वीकार करता/करती हूँ
          </span>
        </label>
        {err && (
          <div
            className="flex items-center gap-1 text-[11px] font-bold"
            style={{ color: DANGER }}
          >
            <AlertCircle size={11} /> {err}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary px-10 py-3 text-[13.5px]"
          disabled={!declared || isSubmittingFinal}
          onClick={handleSubmit}
        >
          {isSubmittingFinal ? (
            <>
              <Loader2 size={16} className="gf-spin" /> Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> FINAL SUBMIT
            </>
          )}
        </button>
      </div>
    </div>
  );
};


/* ---------------------------------------------------------------
   MAIN
--------------------------------------------------------------- */
const ApplicationFormContent: React.FC = () => {
  const navigate=useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    personal: {},
    payment: {},
    education: {},
    photos: {},
    livePhoto: {},
  });

  const [applicationId, setApplicationId] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string>("");
  const [step1AutoFill, setStep1AutoFill] = useState<Record<string, any>>({});
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [appLoadError, setAppLoadError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setAppLoading(true);
        setAppLoadError("");
        const res = await applicationApi.getApplicationSteps();
        const payload: ApplicationStepsResponse | undefined = res.data?.data;
        if (payload) {
          setApplicationId(payload.applicationId || "");
          setCandidateId(payload.candidateId || "");

          // Auto-fill Step 1 from the step0 registration snapshot — jo
          // value step0 me hai wo prefill ho jaayegi, baaki empty rahegi.
          // setStep1AutoFill(mapStep0ToStep1(payload.steps?.step0)); // this is current working code 
          // const step0AutoFill = mapStep0ToStep1(payload.steps?.step0);
          
          // // Fallback: If step0 doesn't have a caste, take it from candidateDetails
          // if (!step0AutoFill.caste && payload.candidateDetails?.caste) {
          //   step0AutoFill.caste = payload.candidateDetails.caste;
          // }
          
          // setStep1AutoFill(step0AutoFill);

          const rawStep0 = payload.steps?.step0 || {};
          const step0AutoFill = mapStep0ToStep1(rawStep0);
          
          // Fallback: If step0 doesn't have a caste, take it from candidateDetails
          if (!step0AutoFill.caste && payload.candidateDetails?.caste) {
            step0AutoFill.caste = payload.candidateDetails.caste;
          }
          
          // 🚨 CRITICAL FIX: Merge rawStep0 so no keys are lost by the mapper!
          setStep1AutoFill({ ...rawStep0, ...step0AutoFill });

          // If step1 (or later) was already saved earlier, resume from
          // it instead of leaving formData empty, so re-opening the
          // wizard doesn't lose previously saved progress.
          setFormData((prev) => ({
            ...prev,
            personal: payload.steps?.step1 || prev.personal,
            payment: payload.steps?.step2 || prev.payment,
            education: payload.steps?.step3 || prev.education,
            photos: payload.steps?.step4 || prev.photos,
            livePhoto: payload.steps?.step5 || prev.livePhoto,
          }));

          if (Array.isArray(payload.completedSteps) && payload.completedSteps.length > 0) {
            setCompleted(new Set(payload.completedSteps));
          }
          if (payload.currentStep && payload.currentStep > 0) {
            setCurrentStep(Math.min(payload.currentStep, 6));
          }
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to load your application. Please refresh.";
        setAppLoadError(msg);
        notifyError(msg);
      } finally {
        setAppLoading(false);
      }
    })();
  }, []);

  const saveStep = (step: number, d: any, key: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [key]: d }));
    setCompleted((prev) => new Set([...prev, step]));
    if (step < 6) setCurrentStep(step + 1);
  };

 const handleDashboard = ()=>{
  navigate("/dashboard")
 }
  

  const FONTS_STYLE = <style>{FONTS}</style>;

  if (submitted) {
    return (
      <div className="gf-root min-h-screen" style={{ background: PAPER }}>
        {FONTS_STYLE}
        <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover theme="colored" />
        <HeaderBar />
        <div
          className="flex items-center justify-center p-6"
          style={{ minHeight: "70vh" }}
        >
          <div
            className="gf-pop max-w-lg w-full rounded-2xl p-8 text-center space-y-5"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "#E8F3EF", border: `3px solid ${TEAL}` }}
            >
              <CheckCircle2 size={36} style={{ color: TEAL }} />
            </div>
            <div>
              <div
                className="gf-display text-xl font-semibold"
                style={{ color: INK }}
              >
                Application submitted!
              </div>
              <div
                className="text-[12.5px] font-medium mt-1"
                style={{ color: INK_SOFT }}
              >
                आवेदन सफलतापूर्वक जमा किया गया
              </div>
            </div>
            <div
              className="rounded-xl p-4 text-left space-y-2"
              style={{ background: PAPER, border: `1px solid ${LINE}` }}
            >
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: INK_SOFT }}>Status</span>
                <span className="font-extrabold" style={{ color: TEAL }}>
                  Submitted ✓
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
             
             
              <button
                onClick={handleDashboard}
                className="gf-btn-secondary w-full"
              >
                <LogOut size={15} /> Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gf-root min-h-screen" style={{ background: PAPER }}>
      {FONTS_STYLE}
      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover theme="colored" />
      <HeaderBar />

      {/* Stepper */}
      <div
        style={{ background: CARD, borderBottom: `1.5px solid ${LINE}` }}
        className="sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((s, idx) => {
              const isActive = currentStep === s.id;
              const isDone = completed.has(s.id);
              const accessible = s.id <= currentStep || isDone;
              const Icon = s.icon;
              return (
                <React.Fragment key={s.id}>
                  <button
                    onClick={() => accessible && setCurrentStep(s.id)}
                    disabled={!accessible}
                    className="flex flex-col items-center gap-1 shrink-0"
                    style={{
                      opacity: accessible ? 1 : 0.4,
                      cursor: accessible ? "pointer" : "not-allowed",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: isDone ? TEAL : isActive ? INK : "#fff",
                        border: `2px solid ${isDone ? TEAL : isActive ? INK : LINE}`,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={15} color="#fff" />
                      ) : (
                        <Icon size={14} color={isActive ? "#fff" : INK_SOFT} />
                      )}
                    </div>
                    <div className="text-center hidden sm:block">
                      <div
                        className="text-[11px] font-extrabold leading-tight"
                        style={{
                          color: isActive ? INK : isDone ? TEAL : INK_SOFT,
                        }}
                      >
                        {s.en}
                      </div>
                      <div
                        className="text-[10px] font-medium leading-tight"
                        style={{ color: INK_SOFT }}
                      >
                        {s.hi}
                      </div>
                    </div>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className="h-0.5 flex-1 min-w-4"
                      style={{ background: isDone ? TEAL : LINE }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full py-2">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: CARD, border: `1.5px solid ${LINE}` }}
        >
          <div className="px-5 py-2 text-center" style={{ background: OCHRE }}>
            <span className="text-[11px] font-extrabold text-white">
              STEP {currentStep} OF 6 — {STEPS[currentStep - 1].en} ·{" "}
              {STEPS[currentStep - 1].hi}
            </span>
          </div>
          <div className="p-5">
            {appLoadError && (
              <div className="mb-5">
                <Note tone="danger">{appLoadError}</Note>
              </div>
            )}
            {appLoading ? (
              <div className="flex items-center justify-center gap-2 py-16">
                <Loader2 size={18} className="gf-spin" style={{ color: OCHRE_DEEP }} />
                <span className="text-[13px] font-bold" style={{ color: OCHRE_DEEP }}>
                  Loading your application…
                </span>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <Step1Personal
                    data={formData.personal}
                    onSave={(d: PersonalData) => saveStep(1, d, "personal")}
                    applicationId={applicationId}
                    autoFill={step1AutoFill}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Payment
                    data={formData.payment}
                    onSave={(d: PaymentData) => saveStep(2, d, "payment")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Education
                    data={formData.education}
                    onSave={(d: EducationData) => saveStep(3, d, "education")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 4 && (
                  <Step4PhotoUpload
                    data={formData.photos}
                    onSave={(d: PhotoData) => saveStep(4, d, "photos")}
                    applicationId={applicationId}
                    // isContractual={formData.personal.contractualEmployee === "YES"}
                    // hasAgreement={formData.personal.agreementCircular === "YES"}
                    isContractual={
                      formData.personal?.contractualEmployee === "YES" || 
                      step1AutoFill?.contractualEmployee === "YES" || 
                      step1AutoFill?.contractualEmp === "YES"
                    }
                    hasAgreement={
                      formData.personal?.agreementCircular === "YES" || 
                      step1AutoFill?.agreementCircular === "YES" || 
                      step1AutoFill?.hasAgreement === "YES"
                    }
                  />
                )}
                {currentStep === 5 && (
                  <Step5LivePhoto
                    data={formData.livePhoto}
                    onSave={(d: LivePhotoData) => saveStep(5, d, "livePhoto")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Review
                    formData={formData}
                    onSubmit={() => setSubmitted(true)}
                    onEdit={(s: number) => setCurrentStep(s)}
                    applicationId={applicationId}
                    autoFill={step1AutoFill}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {currentStep > 1 && (
          <div className="mt-4">
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="gf-btn-secondary"
            >
              <ChevronLeft size={15} /> Previous
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const HeaderBar: React.FC = () => {
  return (
    <div style={{ background: CARD, borderBottom: `1.5px solid ${LINE}` }}>
      <div className="w-full mx-auto px-4 md:px-8 p-2 flex items-center justify-between">
        <div>
          <div
            className="text-[10.5px] font-extrabold tracking-[0.18em]"
            style={{ color: OCHRE_DEEP }}
          >
            BIHAR STAFF SELECTION COMMISSION
          </div>
          <div
            className="gf-display text-xl font-semibold"
            style={{ color: INK }}
          >
            Candidate Application
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormContent;