/**
 * Age Eligibility Validation — BSSC Advertisement No. 05/25
 * ----------------------------------------------------------
 * Implements the "Age Eligibility Validation Matrix" document:
 *   - §0 core reference dates / minimum age
 *   - §1 base age matrix (category × gender)
 *   - §2 carry-forward rule (GAD letter 212 / 23.01.2006)
 *   - §3 relaxation matrix (PwBD, ex-serviceman, officer, govt servant)
 *   - §4 non-cumulation constraints
 *   - §6 documented open items (transgender ceiling, leap-day DOB, etc.)
 *
 * This file is intentionally self-contained (no dependency on the app's
 * `calcDuration` helper) so it can be unit-tested and reused in isolation.
 *
 * Adjust the import path in the form component to wherever this file
 * actually lives in your project (e.g. `src/validation/ageEligibility.ts`).
 */

import { z } from "zod";

/* ---------------------------------------------------------------
   0. CORE PARAMETERS  (§0 of the matrix — keep configurable)
--------------------------------------------------------------- */

/** Primary reference date (R1) — age is computed as on this date. */
export const REFERENCE_DATE_R1 = "2025-08-01";

/** Carry-forward reference date (R2) — GAD letter No. 212 dated 23.01.2006. */
export const REFERENCE_DATE_R2 = "2022-08-01";

/** Minimum age for ALL categories — never relaxed. */
export const MIN_AGE = 21;

/** Hard cap on ex-serviceman relaxation, regardless of computed value (§3.2, E8). */
export const EX_SERVICEMAN_HARD_CAP = 53;

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

export const CATEGORY_VALUES = ["UR", "EBC", "BC", "SC", "ST", "EWS"] as const;
export type Category = (typeof CATEGORY_VALUES)[number];

export const GENDER_VALUES = ["MALE", "FEMALE", "TRANSGENDER"] as const;
export type Gender = (typeof GENDER_VALUES)[number];

/**
 * Officer / ex-serviceman category — drives whether R-2/R-3 (Other Ranks) or
 * R-4 (Commissioned Officer / ECO / SSCO) relaxation applies (§3, Ground R-4).
 */
export const OFFICER_TYPE_VALUES = [
  "OTHER_RANKS",
  "COMMISSIONED_OFFICER",
  "ECO",
  "SSCO",
] as const;
export type OfficerType = (typeof OFFICER_TYPE_VALUES)[number];

export const OFFICER_TYPE_OPTIONS: { value: OfficerType; label: string }[] = [
  {
    value: "OTHER_RANKS",
    label: "Other Ranks (JCO/OR) — General Ex-Serviceman",
  },
  { value: "COMMISSIONED_OFFICER", label: "Commissioned Officer" },
  { value: "ECO", label: "Emergency Commissioned Officer (ECO)" },
  { value: "SSCO", label: "Short Service Commissioned Officer (SSCO)" },
];

export type YesNo = "YES" | "NO";

export interface AgeParts {
  years: number;
  months: number;
  days: number;
}

/* ---------------------------------------------------------------
   1. BASE AGE MATRIX  (§1 of the matrix)
--------------------------------------------------------------- */

/**
 * Returns the base maximum age for a category/gender combination, or `null`
 * if it cannot yet be determined (category not chosen).
 *
 * Transgender ceiling is unspecified in the advertisement (§6, E1 — "open
 * item, do NOT default silently"). This form already instructs transgender
 * candidates to apply under the BC category (see the Gender field note), so
 * — consistent with that existing product decision — we mirror the BC/EBC
 * ceiling (40) for transgender applicants. Confirm with BSSC before go-live.
 */
export function getBaseMaxAge(
  category: Category | "" | undefined,
  gender: Gender | "" | undefined,
): number | null {
  if (!category || !gender) return null;

  if (gender === "TRANSGENDER") {
    // ⚠ E1 open item — see note above.
    return 40;
  }

  switch (category) {
    case "UR":
    case "EWS":
      return gender === "FEMALE" ? 40 : 37;
    case "EBC":
    case "BC":
      return 40;
    case "SC":
    case "ST":
      return 42;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------
   DATE MATH
--------------------------------------------------------------- */

/**
 * Completed years/months/days between two ISO (YYYY-MM-DD) dates.
 * Uses plain calendar-field subtraction with borrowing, which is the
 * standard "completed age" convention used by the matrix's own examples
 * (e.g. T3: DOB 01.08.1988 on R1 01.08.2025 → exactly 37y 0m 0d).
 *
 * Leap-day (29-Feb) births (§6, E10): borrowing against a non-leap `to`
 * month naturally resolves using that month's actual last day, which
 * effectively treats the anniversary as falling on 28-Feb in non-leap
 * years. This is a documented choice — flag for BSSC confirmation.
 */
export function calcAgeParts(fromISO?: string, toISO?: string): AgeParts | null {
  if (!fromISO || !toISO) return null;
  const from = new Date(`${fromISO}T00:00:00`);
  const to = new Date(`${toISO}T00:00:00`);
  if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
  if (from.getTime() > to.getTime()) return null;

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const daysInPrevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
    days += daysInPrevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

/** True if `age` is >= `minYears` (exact boundary allowed — matches T1). */
export function isAtLeast(age: AgeParts, minYears: number): boolean {
  return age.years > minYears || (age.years === minYears && age.months === 0 && age.days === 0);
}

/** True if `age` is <= `maxYears` (exact boundary allowed — matches T3). */
export function isAtMost(age: AgeParts, maxYears: number): boolean {
  return age.years < maxYears || (age.years === maxYears && age.months === 0 && age.days === 0);
}

/* ---------------------------------------------------------------
   3. RELAXATION MATRIX  (§3)
--------------------------------------------------------------- */

/**
 * Effective ceiling for an ex-serviceman, covering:
 *   - R-2: +3 years + actual defence service period (Other Ranks)
 *   - R-3: additional +5 years for SC/ST, stacks only with R-2
 *   - R-4: flat +5 years for Commissioned Officer / ECO / SSCO — this is an
 *          ALTERNATIVE to R-2/R-3, not stacked with them (§3, Ground R-4)
 * The 53-year hard cap (§3.2) is applied by the caller against the
 * candidate's age at the relevant reference date.
 */
export function computeExServicemanEffectiveMax(params: {
  baseMax: number;
  category: Category;
  officerType: OfficerType;
  serviceYears: number;
}): number {
  const { baseMax, category, officerType, serviceYears } = params;
  const isScSt = category === "SC" || category === "ST";

  if (officerType !== "OTHER_RANKS") {
    // R-4 — alternative to R-2/R-3, flat +5, not stacked.
    return Math.min(baseMax + 5, EX_SERVICEMAN_HARD_CAP);
  }

  // R-2 (+ R-3 for SC/ST)
  let esMax = baseMax + 3 + Math.max(0, serviceYears);
  if (isScSt) esMax += 5;
  return Math.min(esMax, EX_SERVICEMAN_HARD_CAP);
}

/* ---------------------------------------------------------------
   FULL AGE-ELIGIBILITY DECISION  (§5 decision flow)
--------------------------------------------------------------- */

export interface AgeEligibilityInput {
  category: Category | "";
  gender: Gender | "";
  dobISO: string;
  /** true when isPwD === "YES" AND isMin40PercentPwD === "YES" (R-1 ground). */
  isPwbd: boolean;
  isExServiceman: boolean;
  officerType?: OfficerType | "";
  serviceFromISO?: string;
  serviceToISO?: string;
  /** R-5 ground — kept informational; not auto-stacked (§4 default). */
  isBiharGovtEmployee?: boolean;
  /** Defaults to today if omitted — used for the ex-serviceman 53y hard cap. */
  applicationDateISO?: string;
  /** Enables the §2 carry-forward branch when qualification predates R2. */
  qualificationDateISO?: string;
}

export type AgeEligibilityReasonCode =
  | "DOB_MISSING"
  | "INVALID_DOB"
  | "CATEGORY_MISSING"
  | "NON_CUMULATIVE_RELAXATION"
  | "OFFICER_TYPE_MISSING"
  | "BELOW_MIN_AGE"
  | "EXSM_HARD_CAP_EXCEEDED"
  | "ABOVE_MAX_AGE"
  | "PASS";

export interface AgeEligibilityResult {
  ok: boolean;
  reasonCode: AgeEligibilityReasonCode;
  message: string;
  ageOnR1: AgeParts | null;
  effectiveMaxAge: number | null;
  usedCarryForward: boolean;
}

export function validateAgeEligibility(input: AgeEligibilityInput): AgeEligibilityResult {
  const {
    category,
    gender,
    dobISO,
    isPwbd,
    isExServiceman,
    officerType,
    serviceFromISO,
    serviceToISO,
    qualificationDateISO,
  } = input;

  if (!dobISO) {
    return fail("DOB_MISSING", "Date of birth is required to compute age eligibility.");
  }

  // §4 non-cumulation guard — matches test vector T10.
  if (isPwbd && isExServiceman) {
    return fail(
      "NON_CUMULATIVE_RELAXATION",
      "Cannot claim disability (PwBD) and ex-serviceman relaxation together — choose a single relaxation ground.",
    );
  }

  if (isExServiceman && !officerType) {
    return fail(
      "OFFICER_TYPE_MISSING",
      "Select the applicable officer / ex-serviceman category (Other Ranks / Commissioned Officer / ECO / SSCO).",
    );
  }

  const ageOnR1 = calcAgeParts(dobISO, REFERENCE_DATE_R1);
  if (!ageOnR1) {
    return fail("INVALID_DOB", "Enter a valid date of birth.");
  }

  // Rule 1 — minimum age, never relaxed.
  if (!isAtLeast(ageOnR1, MIN_AGE)) {
    return fail(
      "BELOW_MIN_AGE",
      `Below minimum age of ${MIN_AGE} years as on ${displayDate(REFERENCE_DATE_R1)}.`,
      ageOnR1,
    );
  }

  const baseMax = getBaseMaxAge(category || undefined, gender || undefined);
  if (baseMax == null) {
    return fail(
      "CATEGORY_MISSING",
      "Select category and gender to compute the maximum age limit.",
      ageOnR1,
    );
  }

  // Determine effective ceiling by relaxation ground.
  let effMax = baseMax;
  if (isPwbd) {
    // R-1
    effMax = baseMax + 10;
  } else if (isExServiceman && officerType) {
    const serviceYears =
      calcAgeParts(serviceFromISO, serviceToISO)?.years ?? 0;
    effMax = computeExServicemanEffectiveMax({
      baseMax,
      category: category as Category,
      officerType,
      serviceYears,
    });

    // §3.2 hard cap — checked against age at time of application (or today).
    const appDateISO = input.applicationDateISO || new Date().toISOString().slice(0, 10);
    const ageOnApplication = calcAgeParts(dobISO, appDateISO);
    if (ageOnApplication && !isAtMost(ageOnApplication, EX_SERVICEMAN_HARD_CAP)) {
      return fail(
        "EXSM_HARD_CAP_EXCEEDED",
        `Age exceeds the hard cap of ${EX_SERVICEMAN_HARD_CAP} years for ex-serviceman relaxation at the time of application.`,
        ageOnR1,
        effMax,
      );
    }
  }
  // Note: R-5 (govt-servant) is intentionally NOT auto-stacked with PwBD/ex-serviceman
  // above — §4 states this combination is "not cumulative" by default pending BSSC
  // confirmation. Surface this as a soft note in the UI, not a hard block.

  let ok = isAtMost(ageOnR1, effMax);
  let usedCarryForward = false;

  // §2 carry-forward branch — only if a qualifying date is supplied.
  if (!ok && qualificationDateISO && qualificationDateISO <= REFERENCE_DATE_R2) {
    const ageOnR2 = calcAgeParts(dobISO, REFERENCE_DATE_R2);
    if (ageOnR2 && isAtMost(ageOnR2, effMax)) {
      ok = true;
      usedCarryForward = true;
    }
  }

  if (!ok) {
    return fail(
      "ABOVE_MAX_AGE",
      `Exceeds the maximum age limit of ${effMax} years for the selected category/relaxation as on ${displayDate(REFERENCE_DATE_R1)}.`,
      ageOnR1,
      effMax,
    );
  }

  return {
    ok: true,
    reasonCode: "PASS",
    message: usedCarryForward
      ? "Eligible under the carry-forward provision (GAD letter No. 212 dated 23-01-2006)."
      : "Meets age eligibility criteria.",
    ageOnR1,
    effectiveMaxAge: effMax,
    usedCarryForward,
  };
}

function fail(
  reasonCode: AgeEligibilityReasonCode,
  message: string,
  ageOnR1: AgeParts | null = null,
  effectiveMaxAge: number | null = null,
): AgeEligibilityResult {
  return { ok: false, reasonCode, message, ageOnR1, effectiveMaxAge, usedCarryForward: false };
}

function displayDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}-${m}-${y}`;
}

/* ---------------------------------------------------------------
   ZOD SCHEMAS
--------------------------------------------------------------- */

export const categorySchema = z.enum(CATEGORY_VALUES);
export const genderSchema = z.enum(GENDER_VALUES);
export const officerTypeSchema = z.enum(OFFICER_TYPE_VALUES);
export const yesNoSchema = z.enum(["YES", "NO"]);

/** ISO yyyy-mm-dd, allows "" so it can compose with optional/conditional fields. */
const isoDateOrEmpty = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .or(z.literal(""));

/**
 * Validates the "Service & Employment" ex-serviceman sub-section on its own —
 * i.e. that officerType and the service period are present and consistent
 * whenever isExServiceman === "YES". Use this for field-level / section-level
 * checks independent of the full age-eligibility computation below.
 */
export const serviceEmploymentSchema = z
  .object({
    isExServiceman: yesNoSchema,
    officerType: officerTypeSchema.or(z.literal("")).optional().default(""),
    serviceFromDate: isoDateOrEmpty.optional().default(""),
    serviceToDate: isoDateOrEmpty.optional().default(""),
  })
  .superRefine((val, ctx) => {
    if (val.isExServiceman !== "YES") return;

    if (!val.officerType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["officerType"],
        message:
          "Select the officer / ex-serviceman category (Other Ranks / Commissioned Officer / ECO / SSCO).",
      });
    }

    if (!val.serviceFromDate || !val.serviceToDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceFromDate"],
        message: "Service period (from / to date) is required for ex-servicemen.",
      });
    } else if (new Date(val.serviceFromDate) > new Date(val.serviceToDate)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["serviceToDate"],
        message: "Service 'to' date must be on or after the 'from' date.",
      });
    }
  });

export type ServiceEmploymentInput = z.infer<typeof serviceEmploymentSchema>;

/**
 * Full cross-field age-eligibility schema, wired to `validateAgeEligibility`
 * above so the zod layer and the pure business logic never drift apart.
 * Wire this into your form library (react-hook-form, Formik, or a manual
 * `safeParse` call in `handleSubmit`) for a single source of truth.
 */
export const ageEligibilitySchema = z
  .object({
    dob: z.string().min(1, "Date of birth is required"),
    category: categorySchema,
    gender: genderSchema,
    isBiharDomicile: yesNoSchema,
    isPwD: yesNoSchema,
    isMin40PercentPwD: yesNoSchema,
    isExServiceman: yesNoSchema,
    officerType: officerTypeSchema.or(z.literal("")).optional().default(""),
    serviceFromDate: isoDateOrEmpty.optional().default(""),
    serviceToDate: isoDateOrEmpty.optional().default(""),
    isBiharGovtEmployee: yesNoSchema.optional(),
    qualificationDate: isoDateOrEmpty.optional().default(""),
  })
  .superRefine((val, ctx) => {
    const isPwbd = val.isPwD === "YES" && val.isMin40PercentPwD === "YES";
    const isExsm = val.isExServiceman === "YES";

    // §4 non-cumulation — surfaced at the field the user is most likely
    // editing last (ex-serviceman toggle).
    if (isPwbd && isExsm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isExServiceman"],
        message: "Cannot claim disability and ex-serviceman relaxation together.",
      });
      return;
    }

    // Transgender candidates apply under BC per this form's own domicile note (§6, E1).
    if (val.gender === "TRANSGENDER" && val.isBiharDomicile === "YES" && val.category !== "BC") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["category"],
        message: "Transgender candidates must apply under the BC category.",
      });
    }

    if (isExsm && !val.officerType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["officerType"],
        message: "Select the applicable officer / ex-serviceman category.",
      });
      return;
    }

    const result = validateAgeEligibility({
      category: val.category,
      gender: val.gender,
      dobISO: val.dob,
      isPwbd,
      isExServiceman: isExsm,
      officerType: val.officerType,
      serviceFromISO: val.serviceFromDate,
      serviceToISO: val.serviceToDate,
      isBiharGovtEmployee: val.isBiharGovtEmployee === "YES",
      qualificationDateISO: val.qualificationDate || undefined,
    });

    if (!result.ok) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dob"], message: result.message });
    }
  });

export type AgeEligibilitySchemaInput = z.infer<typeof ageEligibilitySchema>;