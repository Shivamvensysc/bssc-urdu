import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  User, ShieldCheck, Briefcase, Phone, CheckCircle2,
  RefreshCw, ChevronDown, Loader2, PartyPopper, AlertCircle
} from 'lucide-react';
import { sendOtp, verifyOtp, resendOtp, calcDuration } from "../auth/cognito";
import type { RegistrationFormData, DurationParts } from "../auth/cognito";
import OTPVerificationModal from '../components/common/OTPVerificationModal';

/* ---------------------------------------------------------------
   TOKENS
--------------------------------------------------------------- */
const INK = '#12233F';
const INK_SOFT = '#5B6B84';
const PAPER = '#F4F5F2';
const CARD = '#FFFFFF';
const LINE = '#DBDFE6';
const OCHRE = '#B9722E';
const OCHRE_DEEP = '#8F5522';
const TEAL = '#1E6F5C';
const DANGER = '#B3432B';

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
`;

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

/** Full form state = everything sent to Cognito, plus UI-only confirmation/captcha fields. */
export interface FormData extends RegistrationFormData {
  confirmMobileNo: string;
  confirmEmailId: string;
  captchaInput: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;
type FormTouched = Partial<Record<keyof FormData, boolean>>;
type SectionId = 'personal' | 'category' | 'service' | 'contact';

interface SectionMeta {
  id: SectionId;
  label: string;
  hi: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
}

const SECTIONS: SectionMeta[] = [
  { id: 'personal', label: 'Personal & Identity', hi: 'व्यक्तिगत विवरण', icon: User },
  { id: 'category', label: 'Category & Reservation', hi: 'श्रेणी एवं आरक्षण', icon: ShieldCheck },
  { id: 'service', label: 'Service & Employment', hi: 'सेवा एवं नियोजन', icon: Briefcase },
  { id: 'contact', label: 'Contact & Verification', hi: 'सम्पर्क एवं सत्यापन', icon: Phone },
];

const REQUIRED_BY_SECTION: Record<SectionId, (keyof FormData)[]> = {
  personal: ['applicantName', 'gender', 'isBiharDomicile', 'dobDay', 'dobMonth', 'dobYear'],
  category: ['category', 'caste', 'isNonCreamyLayer', 'isPwD', 'isMin40PercentPwD'],
  service: ['isExServiceman', 'isNccCadet', 'isBiharGovtEmployee', 'bsscAttempts', 'isContractualEmployee'],
  contact: ['mobileNo', 'confirmMobileNo', 'emailId', 'confirmEmailId', 'captchaInput'],
};

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const initialData: FormData = {
  applicantName: '', gender: '', isBiharDomicile: '', category: '', caste: '',
  isNonCreamyLayer: '', isPwD: '', natureOfDisability: '', isMin40PercentPwD: '',
  isExServiceman: '', serviceFromDate: '', serviceToDate: '',
  isNccCadet: '', nccCertificateNo: '', isBiharGovtEmployee: '', bsscAttempts: '',
  isContractualEmployee: '', nameOfPost: '', hasAgreement: '',
  contractualFromDate: '', contractualToDate: '',
  mobileNo: '', confirmMobileNo: '', emailId: '', confirmEmailId: '',
  dobDay: '', dobMonth: '', dobYear: '', captchaInput: '',
};

const genCaptcha = (): string => {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const pad2 = (v: string): string => v.padStart(2, '0');

/** Real-calendar-date check — rejects things like 31 Feb that JS Date would silently roll into March. */
const isRealDate = (day: string, month: string, year: string): boolean => {
  const d = parseInt(day, 10), m = parseInt(month, 10), y = parseInt(year, 10);
  if (!d || !m || !y) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
};

const formatDuration = (d: DurationParts | null): string =>
  d ? `${d.years}y ${d.months}m ${d.days}d` : '—';

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
}

const Field: React.FC<FieldProps> = ({ label, hi, required, error, children, note }) => (
  <div className="mb-6">
    <div className="mb-2">
      <div className="text-[12.5px] font-extrabold tracking-wide" style={{ color: INK }}>
        {required && <span style={{ color: DANGER }}>* </span>}{label}
      </div>
      {hi && <div className="text-[11.5px] font-medium" style={{ color: INK_SOFT }}>{hi}</div>}
    </div>
    {children}
    {error && (
      <div className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold" style={{ color: DANGER }}>
        <AlertCircle size={12} /> {error}
      </div>
    )}
    {note && <div className="text-[11px] font-semibold mt-1.5 leading-relaxed" style={{ color: OCHRE_DEEP }}>{note}</div>}
  </div>
);

interface PillGroupProps {
  name: string;
  value: string;
  options: string[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PillGroup: React.FC<PillGroupProps> = ({ name, value, options, onChange, onBlur }) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((opt) => (
      <label key={opt} className="rf-pill-wrap" style={{ position: 'relative' }}>
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={onChange}
          onBlur={onBlur}
          className="rf-radio-input"
        />
        <span className="rf-pill">{opt}</span>
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
}

const SelectBox: React.FC<SelectBoxProps> = ({ name, value, onChange, onBlur, error, children, className = '' }) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`rf-select appearance-none pr-9 ${error ? 'rf-error' : ''} ${className}`}
    >
      {children}
    </select>
    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: INK_SOFT }} />
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
const DateRangeField: React.FC<DateRangeFieldProps> = ({ fromName, toName, fromValue, toValue, onChange, onBlur }) => {
  const today = new Date().toISOString().slice(0, 10);
  const duration = calcDuration(fromValue, toValue);
  return (
    <div>
      <div className="grid grid-cols-2 gap-3 max-w-md mb-3">
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
      <div className="rounded-lg px-3 py-2 inline-flex items-center gap-2" style={{ background: '#FAF6EF', border: `1px solid #ECD9BE` }}>
        <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>DURATION</span>
        <span className="rf-mono text-sm font-bold" style={{ color: INK }}>{formatDuration(duration)}</span>
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
  const [captchaCode, setCaptchaCode] = useState('');
  const [activeSection, setActiveSection] = useState<SectionId>('personal');
  const sectionRefs = useRef<Partial<Record<SectionId, HTMLDivElement | null>>>({});
  const observerRef = useRef<IntersectionObserver | null>(null);

  const [showOtp, setShowOtp] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Generate a real captcha on mount instead of shipping a hardcoded one.
  useEffect(() => {
    setCaptchaCode(genCaptcha());
  }, []);

  /* ---------- age calculation (reuses the same duration helper as service/contractual periods) ---------- */
  const age = useMemo<DurationParts | null>(() => {
    if (!isRealDate(data.dobDay, data.dobMonth, data.dobYear)) return null;
    const dobIso = `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`;
    return calcDuration(dobIso, '2025-08-01'); // age as on 01-08-2025
  }, [data.dobDay, data.dobMonth, data.dobYear]);

  /* ---------- validation ---------- */
  const validateField = useCallback((name: keyof FormData, value: string, all: FormData): string => {
    switch (name) {
      case 'applicantName':
        return value.trim() ? '' : 'Applicant name is required';
      case 'gender': return value ? '' : 'Gender is required';
      case 'isBiharDomicile': return value ? '' : 'Domicile status is required';
      case 'category': return value ? '' : 'Category is required';
      case 'caste': return value ? '' : 'Caste is required';
      case 'isNonCreamyLayer': return value ? '' : 'Non-creamy layer status is required';
      case 'isPwD': return value ? '' : 'PWD status is required';
      case 'isMin40PercentPwD': return value ? '' : 'This field is required';
      case 'isExServiceman': return value ? '' : 'Ex-serviceman status is required';
      case 'serviceFromDate':
      case 'serviceToDate':
        if (all.isExServiceman === 'YES' && (!all.serviceFromDate || !all.serviceToDate)) {
          return 'Service period is required for ex-servicemen';
        }
        return '';
      case 'isNccCadet': return value ? '' : 'NCC cadet status is required';
      case 'isBiharGovtEmployee': return value ? '' : 'This field is required';
      case 'bsscAttempts': return value ? '' : 'Number of attempts is required';
      case 'isContractualEmployee': return value ? '' : 'This field is required';
      case 'contractualFromDate':
      case 'contractualToDate':
        if (all.isContractualEmployee === 'YES' && (!all.contractualFromDate || !all.contractualToDate)) {
          return 'Contractual service period is required';
        }
        return '';
      case 'mobileNo':
        if (!value) return 'Mobile number is required';
        return /^[6-9]\d{9}$/.test(value) ? '' : 'Enter a valid 10 digit number starting with 6-9';
      case 'confirmMobileNo':
        if (!value) return 'Please confirm your mobile number';
        return value === all.mobileNo ? '' : 'Mobile numbers do not match';
      case 'emailId':
        if (!value) return 'Email is required';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'Enter a valid email address';
      case 'confirmEmailId':
        if (!value) return 'Please confirm your email';
        return value === all.emailId ? '' : 'Email addresses do not match';
      case 'dobDay': case 'dobMonth': case 'dobYear':
        if (!all.dobDay || !all.dobMonth || !all.dobYear) return 'Complete date of birth is required';
        return isRealDate(all.dobDay, all.dobMonth, all.dobYear) ? '' : 'Enter a valid calendar date';
      case 'captchaInput':
        if (!value) return 'Captcha is required';
        return value.toUpperCase() === captchaCode.toUpperCase() ? '' : 'Captcha does not match';
      default: return '';
    }
  }, [captchaCode]);

  type FieldEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;

  const handleChange = (e: FieldEvent) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    const digitsOnly = (name === 'mobileNo' || name === 'confirmMobileNo') ? value.replace(/\D/g, '').slice(0, 10) : value;
    const next: FormData = { ...data, [fieldName]: digitsOnly };
    setData(next);
    if (touched[fieldName]) setErrors((prev) => ({ ...prev, [fieldName]: validateField(fieldName, digitsOnly, next) }));

    // DOB fields are interdependent — once one is touched, re-validate the whole trio live
    if (['dobDay', 'dobMonth', 'dobYear'].includes(name) && (touched.dobDay || touched.dobMonth || touched.dobYear)) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({ ...prev, dobDay: msg, dobMonth: msg, dobYear: msg }));
    }
    // Service / contractual date pairs are interdependent the same way
    if (['serviceFromDate', 'serviceToDate'].includes(name) && (touched.serviceFromDate || touched.serviceToDate)) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({ ...prev, serviceFromDate: msg, serviceToDate: msg }));
    }
    if (['contractualFromDate', 'contractualToDate'].includes(name) && (touched.contractualFromDate || touched.contractualToDate)) {
      const msg = validateField(fieldName, digitsOnly, next);
      setErrors((prev) => ({ ...prev, contractualFromDate: msg, contractualToDate: msg }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const fieldName = name as keyof FormData;
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const msg = validateField(fieldName, value, data);
    if (['dobDay', 'dobMonth', 'dobYear'].includes(name)) {
      setTouched((prev) => ({ ...prev, dobDay: true, dobMonth: true, dobYear: true }));
      setErrors((prev) => ({ ...prev, dobDay: msg, dobMonth: msg, dobYear: msg }));
    } else if (['serviceFromDate', 'serviceToDate'].includes(name)) {
      setTouched((prev) => ({ ...prev, serviceFromDate: true, serviceToDate: true }));
      setErrors((prev) => ({ ...prev, serviceFromDate: msg, serviceToDate: msg }));
    } else if (['contractualFromDate', 'contractualToDate'].includes(name)) {
      setTouched((prev) => ({ ...prev, contractualFromDate: true, contractualToDate: true }));
      setErrors((prev) => ({ ...prev, contractualFromDate: msg, contractualToDate: msg }));
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: msg }));
    }
  };

  const refreshCaptcha = () => {
    setCaptchaCode(genCaptcha());
    setData((d) => ({ ...d, captchaInput: '' }));
    setErrors((prev) => ({ ...prev, captchaInput: '' }));
  };

  /* ---------- completion tracking ---------- */
  const sectionStatus = (id: SectionId) => {
    const fields = REQUIRED_BY_SECTION[id];
    const filled = fields.filter((f) => String(data[f] || '').trim() !== '').length;
    const hasErr = fields.some((f) => errors[f]);
    return { filled, total: fields.length, done: filled === fields.length && !hasErr };
  };

  const overallPct = useMemo(() => {
    const all = Object.values(REQUIRED_BY_SECTION).flat();
    const filled = all.filter((f) => String(data[f] || '').trim() !== '').length;
    return Math.round((filled / all.length) * 100);
  }, [data]);

  /* ---------- scroll-spy ---------- */
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const section = (entry.target as HTMLElement).dataset.section as SectionId | undefined;
          if (entry.isIntersecting && section) setActiveSection(section);
        });
      },
      { rootMargin: '-20% 0px -65% 0px', threshold: 0.1 }
    );
    Object.values(sectionRefs.current).forEach((el) => el && observerRef.current?.observe(el));
    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: SectionId) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /* ---------- submit: create Cognito user, then ask for email OTP ---------- */
  const handleSubmit = async () => {
    const allFields = Object.values(REQUIRED_BY_SECTION).flat();
    const newErrors: FormErrors = {};
    allFields.forEach((f) => { newErrors[f] = validateField(f, data[f], data); });
    setErrors(newErrors);
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])) as FormTouched);

    const firstErrorField = allFields.find((f) => newErrors[f]);
    if (firstErrorField) {
      const section = (Object.entries(REQUIRED_BY_SECTION) as [SectionId, (keyof FormData)[]][])
        .find(([, fs]) => fs.includes(firstErrorField))?.[0];
      if (section) scrollTo(section);
      return;
    }

    setLoading(true);
    setSubmitError('');
    try {
      // Sends all form fields to Cognito as user attributes (standard + custom)
      // and triggers the built-in signUp verification email containing the code.
      await sendOtp(data);
      setShowOtp(true);
    } catch (err: any) {
      const code = err?.name || err?.code;
      if (code === 'UsernameExistsException') {
        setSubmitError('An account with this email already exists. Please use a different email, or verify the code already sent to it.');
      } else if (code === 'SchemaMisconfiguredError') {
        // Thrown by cognito.ts when a custom attribute is missing from the User Pool schema.
        setSubmitError(err.message);
      } else if (code === 'InvalidPasswordException') {
        setSubmitError('There was a problem creating the account. Please try again in a moment.');
      } else {
        setSubmitError(err?.message || 'Could not start registration. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  /* ---------- OTP modal callbacks ---------- */
  const handleOtpVerify = async (otp: string) => {
    await verifyOtp(data.emailId, otp);
    console.log('Registration payload:', {
      ...data,
      dob: `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`,
      age,
    });
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOtpResend = async () => {
    await resendOtp(data.emailId);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const years = Array.from({ length: 101 }, (_, i) => new Date().getFullYear() - i);

  /* ---------------------------------------------------------------
     SUCCESS STATE
  --------------------------------------------------------------- */
  if (submitted) {
    return (
      <div className="rf-root min-h-screen flex items-center justify-center p-6" style={{ background: PAPER }}>
        <style>{FONTS}</style>
        <div className="rf-pop max-w-md w-full text-center bg-white rounded-2xl p-10 shadow-sm" style={{ border: `1.5px solid ${LINE}` }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ background: '#E8F3EF' }}>
            <PartyPopper size={28} style={{ color: TEAL }} />
          </div>
          <div className="rf-display text-2xl font-semibold mb-2" style={{ color: INK }}>Registration saved</div>
          <p className="text-sm font-medium mb-6" style={{ color: INK_SOFT }}>
            Your details for <span style={{ color: INK, fontWeight: 800 }}>{data.applicantName || 'the applicant'}</span> have
            been recorded and your email has been verified. A confirmation has been sent to {data.emailId}.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setData(initialData);
              setErrors({});
              setTouched({});
              setShowOtp(false);
              setSubmitError('');
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
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-extrabold tracking-[0.18em] mb-1" style={{ color: OCHRE_DEEP }}>
              BIHAR STAFF SELECTION COMMISSION
            </div>
            <div className="rf-display text-2xl md:text-[28px] font-semibold" style={{ color: INK }}>
              Candidate Registration
            </div>
            <div className="text-[12px] font-medium mt-0.5" style={{ color: INK_SOFT }}>अभ्यर्थी पंजीकरण फॉर्म</div>
          </div>
        </div>

        {/* mobile stepper */}
        <div className="md:hidden flex items-center gap-1 px-5 pb-4 overflow-x-auto">
          {SECTIONS.map((s, i) => {
            const st = sectionStatus(s.id);
            return (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap text-[11px] font-bold"
                style={{
                  background: activeSection === s.id ? INK : '#fff',
                  color: activeSection === s.id ? '#fff' : INK_SOFT,
                  border: `1.5px solid ${activeSection === s.id ? INK : LINE}`,
                }}
              >
                {st.done ? <CheckCircle2 size={13} /> : <span>{i + 1}</span>} {s.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-5 md:px-8 py-8 md:py-10 flex gap-10">

        {/* DESKTOP RAIL */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="sticky top-8">
            {SECTIONS.map((s, i) => {
              const st = sectionStatus(s.id);
              const Icon = s.icon;
              const isLast = i === SECTIONS.length - 1;
              const isActive = activeSection === s.id;
              return (
                <div key={s.id} className="relative pb-8 pl-2">
                  {!isLast && <div className={`rf-rail-line ${st.done ? 'done' : ''}`} />}
                  <button onClick={() => scrollTo(s.id)} className="flex items-start gap-3 text-left group w-full">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all"
                      style={{
                        background: st.done ? TEAL : isActive ? INK : '#fff',
                        border: `2px solid ${st.done ? TEAL : isActive ? INK : LINE}`,
                      }}
                    >
                      {st.done ? <CheckCircle2 size={18} color="#fff" /> : <Icon size={16} color={isActive ? '#fff' : INK_SOFT} />}
                    </div>
                    <div className="pt-1.5">
                      <div className="text-[10.5px] font-extrabold rf-mono" style={{ color: OCHRE_DEEP }}>0{i + 1} · {st.filled}/{st.total}</div>
                      <div className="text-[13px] font-extrabold leading-tight" style={{ color: isActive ? INK : '#374151' }}>{s.label}</div>
                      <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>{s.hi}</div>
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
          <div ref={(el) => { sectionRefs.current.personal = el; }} data-section="personal" className="rounded-2xl p-6 md:p-8" style={{ background: CARD, border: `1.5px solid ${LINE}` }}>
            <div className="flex items-center gap-2 mb-6">
              <User size={17} style={{ color: OCHRE }} />
              <h2 className="rf-display text-lg font-semibold" style={{ color: INK }}>Personal &amp; Identity</h2>
            </div>

            <Field label="Name of applicant" hi="आवेदक का नाम" required error={touched.applicantName && errors.applicantName}
              note="Enter your name exactly as in your Matriculation / Secondary examination certificate. Do not use prefixes such as Mr. or Ms.">
              <input type="text" name="applicantName" value={data.applicantName} onChange={handleChange} onBlur={handleBlur}
                className={`rf-input uppercase ${touched.applicantName && errors.applicantName ? 'rf-error' : ''}`} placeholder="AS PER MATRICULATION CERTIFICATE" />
            </Field>

            <Field label="Gender" hi="लिंग" required error={touched.gender && errors.gender}
              note="A transgender candidate of Bihar-state domicile must apply under the BC category.">
              <PillGroup name="gender" value={data.gender} onChange={handleChange} onBlur={handleBlur} options={['MALE', 'FEMALE', 'TRANSGENDER']} />
            </Field>

            <Field label="Domicile of Bihar state?" hi="बिहार राज्य का निवासी?" required error={touched.isBiharDomicile && errors.isBiharDomicile}>
              <PillGroup name="isBiharDomicile" value={data.isBiharDomicile} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            <Field label="Date of birth" hi="जन्म तिथि" required
              error={touched.dobDay && (errors.dobDay || errors.dobMonth || errors.dobYear)}
              note="As recorded in your Matriculation / 10th standard or equivalent certificate.">
              <div className="grid grid-cols-3 gap-3 max-w-md">
                <SelectBox name="dobDay" value={data.dobDay} onChange={handleChange} onBlur={handleBlur} error={touched.dobDay && errors.dobDay}>
                  <option value="">Day</option>
                  {days.map((d) => <option key={d} value={d}>{d}</option>)}
                </SelectBox>
                <SelectBox name="dobMonth" value={data.dobMonth} onChange={handleChange} onBlur={handleBlur} error={touched.dobMonth && errors.dobMonth}>
                  <option value="">Month</option>
                  {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
                </SelectBox>
                <SelectBox name="dobYear" value={data.dobYear} onChange={handleChange} onBlur={handleBlur} error={touched.dobYear && errors.dobYear}>
                  <option value="">Year</option>
                  {years.map((y) => <option key={y} value={y}>{y}</option>)}
                </SelectBox>
              </div>
            </Field>

            <div className="rounded-xl p-4 flex items-center justify-between" style={{ background: '#FAF6EF', border: `1px solid #ECD9BE` }}>
              <div>
                <div className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>AGE AS ON 01-08-2025</div>
                <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>दिनांक 01-08-2025 को आयु</div>
              </div>
              <div className="rf-mono text-lg font-bold" style={{ color: INK }}>{formatDuration(age)}</div>
            </div>
          </div>

          {/* SECTION 2 — CATEGORY */}
          <div ref={(el) => { sectionRefs.current.category = el; }} data-section="category" className="rounded-2xl p-6 md:p-8" style={{ background: CARD, border: `1.5px solid ${LINE}` }}>
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={17} style={{ color: OCHRE }} />
              <h2 className="rf-display text-lg font-semibold" style={{ color: INK }}>Category &amp; Reservation</h2>
            </div>

            <Field label="Category" hi="श्रेणी" required error={touched.category && errors.category}>
              <PillGroup name="category" value={data.category} onChange={handleChange} onBlur={handleBlur} options={['UR', 'SC', 'ST', 'EBC', 'BC', 'EWS']} />
            </Field>

            <Field label="Caste" hi="जाति" required error={touched.caste && errors.caste}>
              <SelectBox name="caste" value={data.caste} onChange={handleChange} onBlur={handleBlur} error={touched.caste && errors.caste} className="max-w-xs">
                <option value="">Select caste</option>
                <option value="GENERIC_CAST">Sample Caste Group</option>
              </SelectBox>
            </Field>

            <Field label="Do you belong to non-creamy layer?" hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?" required error={touched.isNonCreamyLayer && errors.isNonCreamyLayer}>
              <PillGroup name="isNonCreamyLayer" value={data.isNonCreamyLayer} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            <Field label="Are you a person with disability?" hi="क्या आप दिव्यांगता (PWD) वाले व्यक्ति हैं?" required error={touched.isPwD && errors.isPwD}>
              <PillGroup name="isPwD" value={data.isPwD} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            <Field label="Nature of disability" hi="दिव्यांगता की प्रकृति">
              <PillGroup name="natureOfDisability" value={data.natureOfDisability} onChange={handleChange} onBlur={handleBlur} options={['PERMANENT', 'TEMPORARY']} />
            </Field>

            <Field label="Are you a person with minimum 40% disability?" hi="क्या आप न्यूनतम 40% दिव्यांगता (PWD) वाले व्यक्ति हैं?" required error={touched.isMin40PercentPwD && errors.isMin40PercentPwD}>
              <PillGroup name="isMin40PercentPwD" value={data.isMin40PercentPwD} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>
          </div>

          {/* SECTION 3 — SERVICE */}
          <div ref={(el) => { sectionRefs.current.service = el; }} data-section="service" className="rounded-2xl p-6 md:p-8" style={{ background: CARD, border: `1.5px solid ${LINE}` }}>
            <div className="flex items-center gap-2 mb-6">
              <Briefcase size={17} style={{ color: OCHRE }} />
              <h2 className="rf-display text-lg font-semibold" style={{ color: INK }}>Service &amp; Employment</h2>
            </div>

            <Field label="Are you an ex-serviceman?" hi="क्या आप भूतपूर्व सैनिक हैं?" required error={touched.isExServiceman && errors.isExServiceman}>
              <PillGroup name="isExServiceman" value={data.isExServiceman} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            {data.isExServiceman === 'YES' && (
              <Field label="Service in defence — from / to date" hi="रक्षा में सेवा — दिनांक से/तक"
                error={touched.serviceFromDate && errors.serviceFromDate}
                note="Select the joining and release dates from your defence service record; the duration is calculated automatically.">
                <DateRangeField
                  fromName="serviceFromDate" toName="serviceToDate"
                  fromValue={data.serviceFromDate} toValue={data.serviceToDate}
                  onChange={handleChange} onBlur={handleBlur}
                />
              </Field>
            )}

            <Field label="Are you an NCC full-time cadet / instructor?" hi="क्या आप एनसीसी के पूर्णकालिक कैडेट/अनुदेशक हैं?" required error={touched.isNccCadet && errors.isNccCadet}>
              <PillGroup name="isNccCadet" value={data.isNccCadet} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            <Field label="NCC 'C' certificate number" hi="एनसीसी 'सी' प्रमाणपत्र संख्या">
              <input type="text" name="nccCertificateNo" value={data.nccCertificateNo} onChange={handleChange} onBlur={handleBlur} className="rf-input max-w-md" />
            </Field>

            <Field label="Are you a Bihar government employee with 3+ years continuous service?" hi="क्या आप बिहार सरकार के कर्मचारी हैं जिन्होंने कम से कम तीन साल नियमित सेवा की है?" required error={touched.isBiharGovtEmployee && errors.isBiharGovtEmployee}>
              <PillGroup name="isBiharGovtEmployee" value={data.isBiharGovtEmployee} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            <Field label="BSSC exam attempts after 12-12-2022" hi="दिनांक 12-12-2022 के बाद परीक्षाओं में प्रयासों की संख्या" required error={touched.bsscAttempts && errors.bsscAttempts}>
              <SelectBox name="bsscAttempts" value={data.bsscAttempts} onChange={handleChange} onBlur={handleBlur} error={touched.bsscAttempts && errors.bsscAttempts} className="max-w-xs">
                <option value="">Select</option><option value="0">0</option><option value="1">1</option><option value="2">2</option><option value="3">3</option>
              </SelectBox>
            </Field>

            <Field label="Are you a contractual employee on a post from the advertisement?" hi="क्या आप विज्ञापन में उल्लिखित पदों में से किसी पद पर संविदा नियोजित कर्मी हैं?" required error={touched.isContractualEmployee && errors.isContractualEmployee}>
              <PillGroup name="isContractualEmployee" value={data.isContractualEmployee} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
            </Field>

            {data.isContractualEmployee === 'YES' && (
              <>
                <Field label="Name of post" hi="पद का नाम">
                  <SelectBox name="nameOfPost" value={data.nameOfPost} onChange={handleChange} onBlur={handleBlur} className="max-w-xs">
                    <option value="">Select post</option>
                  </SelectBox>
                </Field>

                <Field label="Agreement under circular no. 1003, dated 22.01.2021 (GAD, Bihar)?" hi="क्या आपके पास संकल्प ज्ञापंक 1003, दिनांक 22.01.2021 के आलोक में एकरारनामा है?"
                  note="Ensure you have a valid agreement copy and contractual experience certificate ready to upload, or you will not receive weightage.">
                  <PillGroup name="hasAgreement" value={data.hasAgreement} onChange={handleChange} onBlur={handleBlur} options={['YES', 'NO']} />
                </Field>

                <Field label="Contractual service period in Bihar government — from / to date" hi="उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि — दिनांक से/तक"
                  error={touched.contractualFromDate && errors.contractualFromDate}
                  note="Select the dates on which your contractual engagement began and ended (or the current date, if still ongoing); the duration is calculated automatically.">
                  <DateRangeField
                    fromName="contractualFromDate" toName="contractualToDate"
                    fromValue={data.contractualFromDate} toValue={data.contractualToDate}
                    onChange={handleChange} onBlur={handleBlur}
                  />
                </Field>
              </>
            )}
          </div>

          {/* SECTION 4 — CONTACT */}
          <div ref={(el) => { sectionRefs.current.contact = el; }} data-section="contact" className="rounded-2xl p-6 md:p-8" style={{ background: CARD, border: `1.5px solid ${LINE}` }}>
            <div className="flex items-center gap-2 mb-6">
              <Phone size={17} style={{ color: OCHRE }} />
              <h2 className="rf-display text-lg font-semibold" style={{ color: INK }}>Contact &amp; Verification</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6">
              <Field label="Mobile number" hi="मोबाइल नम्बर" required error={touched.mobileNo && errors.mobileNo}
                note="Keep this number active to receive communication about the recruitment process.">
                <input type="text" inputMode="numeric" name="mobileNo" value={data.mobileNo} onChange={handleChange} onBlur={handleBlur}
                  className={`rf-input rf-mono ${touched.mobileNo && errors.mobileNo ? 'rf-error' : ''}`} placeholder="10 digit mobile number" maxLength={10} />
              </Field>
              <Field label="Confirm mobile number" hi="मोबाइल नंबर की पुष्टि" required error={touched.confirmMobileNo && errors.confirmMobileNo}>
                <input type="text" inputMode="numeric" name="confirmMobileNo" value={data.confirmMobileNo} onChange={handleChange} onBlur={handleBlur}
                  className={`rf-input rf-mono ${touched.confirmMobileNo && errors.confirmMobileNo ? 'rf-error' : ''}`} placeholder="Re-enter mobile number" maxLength={10} />
              </Field>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6">
              <Field label="Email ID" hi="ईमेल आईडी" required error={touched.emailId && errors.emailId}
                note="Keep this email active to receive communication about the recruitment process.">
                <input type="email" name="emailId" value={data.emailId} onChange={handleChange} onBlur={handleBlur}
                  className={`rf-input lowercase ${touched.emailId && errors.emailId ? 'rf-error' : ''}`} placeholder="name@example.com" />
              </Field>
              <Field label="Confirm email ID" hi="ईमेल आईडी की पुष्टि" required error={touched.confirmEmailId && errors.confirmEmailId}>
                <input type="email" name="confirmEmailId" value={data.confirmEmailId} onChange={handleChange} onBlur={handleBlur}
                  className={`rf-input lowercase ${touched.confirmEmailId && errors.confirmEmailId ? 'rf-error' : ''}`} placeholder="Re-enter email" />
              </Field>
            </div>

            {/* CAPTCHA */}
            <div className="rounded-xl p-5 mt-2" style={{ background: '#FAF6EF', border: `1px solid #ECD9BE` }}>
              <div className="text-[12px] font-extrabold tracking-wide mb-0.5" style={{ color: OCHRE_DEEP }}>
                <span style={{ color: DANGER }}>* </span>ENTER CAPTCHA CODE
              </div>
              <div className="text-[11.5px] font-medium mb-3" style={{ color: INK_SOFT }}>कैप्चा कोड दर्ज करें — नीचे दिखाया गया कोड टाइप करें</div>
              <div className="flex flex-wrap items-center gap-4">
                <div className="rf-mono text-2xl font-bold tracking-[0.3em] italic px-5 py-2 rounded-lg select-none"
                  style={{ background: INK, color: '#fff' }}>
                  {captchaCode}
                </div>
                <button type="button" onClick={refreshCaptcha} className="flex items-center gap-1.5 text-xs font-extrabold" style={{ color: OCHRE_DEEP }}>
                  <RefreshCw size={14} /> REFRESH
                </button>
              </div>
              <input type="text" name="captchaInput" value={data.captchaInput} onChange={handleChange} onBlur={handleBlur}
                className={`rf-input rf-mono max-w-xs mt-4 ${touched.captchaInput && errors.captchaInput ? 'rf-error' : ''}`} placeholder="Type the code above" />
              {touched.captchaInput && errors.captchaInput && (
                <div className="flex items-center gap-1 mt-1.5 text-[11.5px] font-bold" style={{ color: DANGER }}>
                  <AlertCircle size={12} /> {errors.captchaInput}
                </div>
              )}
            </div>
          </div>

          {/* SUBMIT BAR */}
          <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ background: CARD, border: `1.5px solid ${LINE}` }}>
            <div className="text-sm font-semibold" style={{ color: INK_SOFT }}>
              {overallPct === 100 ? 'All required fields look complete.' : `${overallPct}% of required fields completed`}
            </div>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-9 py-3 rounded-full font-extrabold text-sm text-white flex items-center justify-center gap-2 min-w-[200px] transition-opacity"
              style={{ background: loading ? '#8B93A0' : INK }}
            >
              {loading ? (<><Loader2 size={16} className="rf-spin" /> PROCESSING…</>) : 'SAVE AND CONTINUE'}
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