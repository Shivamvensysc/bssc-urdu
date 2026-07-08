import React, { useState } from "react";
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
} from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_CANDIDATE = {
  registrationNo: "5250000005",
  formNo: "6250000005",
  name: "NANCY KUMARI GUPTA",
  fatherName: "LATE RAMESH PRASAD",
  motherName: "SUNITA DEVI",
  gender: "FEMALE",
  dob: "18-10-2000",
  ageAsOn: "24 YEARS, 9 MONTHS, 14 DAYS",
  category: "EBC",
  mobile: "7991145490",
  email: "NANCYGUPTA1318@GMAIL.COM",
  examName: "4th Graduate Level Combined Competitive Exam",
  advNo: "ADV NO.-05/25",
  applicationStatus: "IN_PROGRESS",
  paymentStatus: "PAID",
  paymentAmount: 135,
  paymentBank: "SBI",
  transactionId: "4469494806723",
  transactionDate: "2025-08-25 17:45:16",
  lastUpdated: "2026-07-06 18:41:51",
};

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
    status: "COMPLETE",
    icon: User,
    completedAt: "2026-07-04 10:22:14",
    description: "Name, DOB, category, address, ID proof details",
  },
  {
    id: "step-payment",
    stepNo: 2,
    titleEn: "Payment",
    titleHi: "भुगतान",
    status: "COMPLETE",
    icon: CreditCard,
    completedAt: "2026-07-04 11:05:33",
    description: "Application fee payment — ₹135 paid via SBI",
  },
  {
    id: "step-education",
    stepNo: 3,
    titleEn: "Education Details",
    titleHi: "शैक्षणिक विवरण",
    status: "COMPLETE",
    icon: GraduationCap,
    completedAt: "2026-07-05 09:17:48",
    description: "10th, 12th, and Graduation qualifications entered",
  },
  {
    id: "step-uploads",
    stepNo: 4,
    titleEn: "Upload Photo & Signature",
    titleHi: "फोटो और हस्ताक्षर अपलोड",
    status: "IN_PROGRESS",
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
  {
    id: "step-review",
    stepNo: 6,
    titleEn: "Review & Submit",
    titleHi: "समीक्षा और जमा करें",
    status: "LOCKED",
    icon: ClipboardCheck,
    description: "Final review of all details and declaration submission",
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

const QUALIFYING_MARKS = [
  { id: "qual-ur", category: "UR (Unreserved)", percent: 40 },
  { id: "qual-bc2", category: "BC-II", percent: 36.5 },
  { id: "qual-ebc", category: "EBC-I", percent: 34 },
  { id: "qual-scst", category: "SC / ST", percent: 32 },
  { id: "qual-women", category: "Women (all categories)", percent: 32 },
  { id: "qual-pwd", category: "PwD (all categories)", percent: 32 },
];

/* ── Reusable, self-contained UI primitives (palette-driven, no external CSS needed) ── */

type Tone = "success" | "warning" | "pending" | "locked" | "danger";

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

const completedSteps = APPLICATION_STEPS.filter(
  (s) => s.status === "COMPLETE",
).length;
const totalSteps = APPLICATION_STEPS.length;
const completionPercent = Math.round((completedSteps / totalSteps) * 100);

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState<
    "application" | "exam" | "notices"
  >("application");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await new Promise((r) => setTimeout(r, 900)); // placeholder for real PDF generation call
    } catch {
      alert("PDF generation failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

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
            {MOCK_CANDIDATE.advNo} — {MOCK_CANDIDATE.examName}
          </h2>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--ink-soft)] flex-shrink-0">
          <Clock size={12} />
          <span className="tabular-nums">
            Last login: {MOCK_CANDIDATE.lastUpdated}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-4 gap-5 sm:gap-6">
        {/* ── LEFT / MAIN COLUMN ── */}
        <div className="xl:col-span-2 2xl:col-span-3 space-y-5">
          {/* Candidate summary card */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader right={`Reg. No.: ${MOCK_CANDIDATE.registrationNo}`}>
              Candidate Information / अभ्यर्थी जानकारी
            </SectionHeader>
            <div className="p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row gap-5">
                {/* Photo placeholder */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2 mx-auto sm:mx-0">
                  <div className="w-24 h-28 border-2 border-dashed border-[var(--line)] rounded-lg flex flex-col items-center justify-center text-center bg-[var(--paper)]">
                    <User size={30} className="text-[var(--ink-soft)]" />
                    <p className="text-[11px] text-[var(--ink-soft)] mt-1 leading-tight">
                      Passport
                      <br />
                      Photo
                    </p>
                  </div>
                  <Badge tone="warning">Upload Pending</Badge>
                </div>

                {/* Details grid */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                  {[
                    {
                      id: "ci-name",
                      label: "Name / नाम",
                      value: MOCK_CANDIDATE.name,
                    },
                    {
                      id: "ci-father",
                      label: "Father's Name / पिता का नाम",
                      value: MOCK_CANDIDATE.fatherName,
                    },
                    {
                      id: "ci-mother",
                      label: "Mother's Name / माता का नाम",
                      value: MOCK_CANDIDATE.motherName,
                    },
                    {
                      id: "ci-dob",
                      label: "Date of Birth / जन्म तिथि",
                      value: MOCK_CANDIDATE.dob,
                    },
                    {
                      id: "ci-age",
                      label: "Age as on 01-08-2025",
                      value: MOCK_CANDIDATE.ageAsOn,
                    },
                    {
                      id: "ci-gender",
                      label: "Gender / लिंग",
                      value: MOCK_CANDIDATE.gender,
                    },
                    {
                      id: "ci-cat",
                      label: "Category / वर्ग",
                      value: MOCK_CANDIDATE.category,
                    },
                    {
                      id: "ci-mob",
                      label: "Mobile / मोबाइल",
                      value: MOCK_CANDIDATE.mobile,
                    },
                    {
                      id: "ci-email",
                      label: "Email / ईमेल",
                      value: MOCK_CANDIDATE.email,
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
                    {MOCK_CANDIDATE.registrationNo}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">Form No.</p>
                  <p className="text-sm font-bold text-[var(--ochre-deep)] tabular-nums tracking-wider">
                    {MOCK_CANDIDATE.formNo}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Application Status
                  </p>
                  <Badge tone="warning">In Progress</Badge>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Last Updated
                  </p>
                  <p className="text-xs font-medium text-[var(--ink)] tabular-nums">
                    {MOCK_CANDIDATE.lastUpdated}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Completion
                  </p>
                  <p className="text-sm font-bold text-[var(--ochre-deep)] tabular-nums">
                    {completionPercent}%
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
                <div>
                  <div className="flex items-center justify-between mb-2 flex-wrap gap-1">
                    <p className="text-sm font-semibold text-[var(--ink)]">
                      Application Completion / आवेदन पूर्णता
                    </p>
                    <p className="text-sm font-bold text-[var(--ochre-deep)] tabular-nums">
                      {completedSteps} / {totalSteps} Steps —{" "}
                      {completionPercent}%
                    </p>
                  </div>
                  <div className="w-full rounded-full overflow-hidden h-3 bg-[var(--line)]">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${completionPercent}%`,
                        background:
                          "linear-gradient(90deg, var(--ochre-deep) 0%, var(--ochre) 100%)",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs text-[var(--ink-soft)]">
                      {completedSteps} steps completed
                    </p>
                    <p className="text-xs text-[var(--ink-soft)]">
                      {totalSteps - completedSteps} step(s) remaining
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {APPLICATION_STEPS.map((step) => {
                    const rowTone =
                      step.status === "COMPLETE"
                        ? "border-[var(--teal)]/30 bg-[var(--teal)]/5"
                        : step.status === "IN_PROGRESS"
                          ? "border-[var(--ochre)]/40 bg-[var(--ochre)]/5"
                          : step.status === "PENDING"
                            ? "border-[var(--line)] bg-[var(--card)] hover:bg-[var(--paper)]"
                            : "border-[var(--line)] bg-[var(--paper)] opacity-60";
                    return (
                      <div
                        key={step.id}
                        className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 rounded-lg border transition-all ${rowTone}`}
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
                          {step.status === "IN_PROGRESS" && (
                            <p className="text-xs text-[var(--ochre-deep)] mt-0.5 font-medium">
                              ⚠ Action Required — complete photo &amp; signature
                              uploads
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
                          {step.status !== "LOCKED" && (
                            <Link
                              to={`/application/step/${step.stepNo}`}
                              className="p-1.5 rounded-md border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ochre-deep)] hover:border-[var(--ochre)] transition-colors"
                              title={`Go to Step ${step.stepNo}: ${step.titleEn}`}
                            >
                              <ChevronRight size={14} />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t border-[var(--line)]">
                  <PrimaryButton as="link" to="/application">
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
                    Click{" "}
                    <strong className="text-[var(--ink)]">
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
                  <h3 className="text-sm font-semibold text-[var(--ink)] mb-3">
                    Category-wise Qualifying Marks (Main Exam) / वर्गवार अर्हक
                    अंक
                  </h3>
                  <div className="overflow-x-auto rounded-lg border border-[var(--line)]">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-[var(--ink)] text-white">
                          <th className="text-left px-4 py-2.5 font-semibold">
                            Category / वर्ग
                          </th>
                          <th className="text-right px-4 py-2.5 font-semibold">
                            Qualifying % / अर्हक प्रतिशत
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {QUALIFYING_MARKS.map((row, idx) => (
                          <tr
                            key={row.id}
                            className={`border-b border-[var(--line)] transition-colors hover:bg-[var(--paper)] ${
                              row.category.includes("EBC")
                                ? "bg-[var(--ochre)]/5 font-semibold"
                                : idx % 2 === 0
                                  ? "bg-[var(--card)]"
                                  : "bg-[var(--paper)]/40"
                            }`}
                          >
                            <td className="px-4 py-2.5 text-[var(--ink)]">
                              {row.category}
                              {row.category.includes("EBC") && (
                                <span className="ml-2 text-xs text-[var(--ochre-deep)] font-normal">
                                  ← Your category
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-right font-bold text-[var(--ochre-deep)] tabular-nums">
                              {row.percent}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                      body: "Photo and Signature upload (Step 4) must be completed before 15-07-2026. Your application cannot proceed to Step 5 without all three uploads (passport photo, English signature, Hindi signature).",
                      date: "2026-07-06 18:41",
                    },
                    {
                      id: "ntc-2",
                      type: "info",
                      title: "Payment Confirmed Successfully",
                      body: `Application fee of ₹${MOCK_CANDIDATE.paymentAmount} (EBC-I / Bihar Domicile concession rate) has been received via ${MOCK_CANDIDATE.paymentBank}. Transaction ID: ${MOCK_CANDIDATE.transactionId}. Date: ${MOCK_CANDIDATE.transactionDate}.`,
                      date: "2025-08-25 17:45",
                    },
                    {
                      id: "ntc-3",
                      type: "info",
                      title: "Live Photo Capture Mandatory (Step 5)",
                      body: "Step 5 requires webcam access for live photo capture. Ensure your device has a functioning camera. This photo will be re-verified when you download your admit card. Use a well-lit environment.",
                      date: "2026-07-03 09:00",
                    },
                    {
                      id: "ntc-4",
                      type: "info",
                      title: "Education Details Saved (Step 3 Complete)",
                      body: "Your educational qualification details (10th, 12th, Graduation) have been saved successfully. You may edit these details until final submission.",
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
          {/* Payment status card */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader>Payment Status / भुगतान स्थिति</SectionHeader>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Status / स्थिति
                </span>
                <Badge tone="success">Paid ✓</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Amount / राशि
                </span>
                <span className="text-sm font-bold text-[var(--ochre-deep)] tabular-nums">
                  ₹{MOCK_CANDIDATE.paymentAmount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Concession / रियायत
                </span>
                <span className="text-xs font-medium text-[var(--ink)]">
                  EBC / Bihar Domicile
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)]">
                  Bank / बैंक
                </span>
                <span className="text-xs font-semibold text-[var(--ink)]">
                  {MOCK_CANDIDATE.paymentBank}
                </span>
              </div>
              <div className="pt-1 border-t border-[var(--line)]">
                <p className="text-[11px] text-[var(--ink-soft)] mb-0.5">
                  Transaction ID
                </p>
                <p className="text-xs font-mono font-semibold text-[var(--ink)] tabular-nums break-all">
                  {MOCK_CANDIDATE.transactionId}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-[var(--ink-soft)] mb-0.5">
                  Transaction Date
                </p>
                <p className="text-xs text-[var(--ink)] tabular-nums">
                  {MOCK_CANDIDATE.transactionDate}
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

          {/* Upload checklist */}
          <div className="rounded-xl overflow-hidden bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <SectionHeader>Upload Checklist / अपलोड जाँचसूची</SectionHeader>
            <div className="p-4 space-y-2.5">
              {[
                {
                  id: "uc-photo",
                  label: "Passport Photo",
                  hi: "पासपोर्ट फोटो",
                  spec: "JPG • 20–50KB • 200×230px",
                  done: false,
                },
                {
                  id: "uc-sig-en",
                  label: "Signature (English)",
                  hi: "हस्ताक्षर (अंग्रेजी)",
                  spec: "JPG • 10–20KB • 200×60px",
                  done: false,
                },
                {
                  id: "uc-sig-hi",
                  label: "Signature (Hindi)",
                  hi: "हस्ताक्षर (हिंदी)",
                  spec: "JPG • 10–20KB • 200×60px",
                  done: false,
                },
                {
                  id: "uc-live",
                  label: "Live Photo (Webcam)",
                  hi: "लाइव फोटो (वेबकैम)",
                  spec: "Step 5 — Webcam capture",
                  done: false,
                },
              ].map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg border"
                  style={{
                    background: item.done
                      ? "color-mix(in srgb, var(--teal) 8%, transparent)"
                      : "color-mix(in srgb, var(--ochre) 8%, transparent)",
                    borderColor: item.done
                      ? "color-mix(in srgb, var(--teal) 30%, transparent)"
                      : "color-mix(in srgb, var(--ochre) 30%, transparent)",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{
                      borderColor: item.done ? "var(--teal)" : "var(--ochre)",
                      background: item.done
                        ? "color-mix(in srgb, var(--teal) 15%, white)"
                        : "color-mix(in srgb, var(--ochre) 15%, white)",
                    }}
                  >
                    {item.done ? (
                      <CheckCircle size={12} style={{ color: "var(--teal)" }} />
                    ) : (
                      <Clock size={10} style={{ color: "var(--ochre-deep)" }} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[var(--ink)] leading-tight">
                      {item.label}
                    </p>
                    <p className="text-xs text-[var(--ink-soft)]">{item.hi}</p>
                    <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                      {item.spec}
                    </p>
                  </div>
                </div>
              ))}
              <Link
                to="/application/step/4"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-white bg-[var(--ochre)] hover:bg-[var(--ochre-deep)] transition-colors mt-1"
              >
                <Upload size={13} />
                Go to Upload Step
              </Link>
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
