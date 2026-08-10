// import { z } from "zod";
// /** Primary reference date (R1) — age is computed as on this date. */
// export const REFERENCE_DATE_R1 = "2026-08-01";

// /** Carry-forward reference date (R2) — GAD letter No. 212 dated 23.01.2006. */
// export const REFERENCE_DATE_R2 = "2022-08-01";

// /** Minimum age for ALL categories — never relaxed. */
// export const MIN_AGE = 21;

// /** Hard cap on ex-serviceman relaxation, regardless of computed value (§3.2, E8). */
// export const EX_SERVICEMAN_HARD_CAP = 57;


// export const ALLOW_PWBD_EXSM_STACKING = true;

// export const ALLOW_GOVT_STACKING_WITH_OTHER_GROUNDS = false;

// export const CATEGORY_VALUES = ["UR", "EBC", "BC", "SC", "ST", "EWS"] as const;
// export type Category = (typeof CATEGORY_VALUES)[number];

// export const GENDER_VALUES = ["MALE", "FEMALE", "TRANSGENDER"] as const;
// export type Gender = (typeof GENDER_VALUES)[number];


// export const OFFICER_TYPE_VALUES = [
//   "OTHER_RANKS",
//   "COMMISSIONED_OFFICER",
//   "ECO",
//   "SSCO",
// ] as const;
// export type OfficerType = (typeof OFFICER_TYPE_VALUES)[number];

// export const OFFICER_TYPE_OPTIONS: { value: OfficerType; label: string }[] = [
//   {
//     value: "OTHER_RANKS",
//     label: "Other Ranks (JCO/OR) — General Ex-Serviceman",
//   },
//   { value: "COMMISSIONED_OFFICER", label: "Commissioned Officer" },
//   { value: "ECO", label: "Emergency Commissioned Officer (ECO)" },
//   { value: "SSCO", label: "Short Service Commissioned Officer (SSCO)" },
// ];

// export type YesNo = "YES" | "NO";

// export interface AgeParts {
//   years: number;
//   months: number;
//   days: number;
// }


// export const mapCategoryLabelToCode = (label: string): Category | "" => {
//   const l = (label || "").toUpperCase();
//   if (/UNRESERVED|GENERAL|\bUR\b/.test(l)) return "UR";
//   if (/ECONOMICALLY WEAKER|\bEWS\b/.test(l)) return "EWS";
//   // Must be checked BEFORE plain "Backward Class" — "Extremely Backward
//   // Class" also contains the word "Backward".
//   if (/EXTREMELY BACKWARD|\bEBC\b/.test(l)) return "EBC";
//   if (/BACKWARD CLASS|\bBC\b/.test(l)) return "BC";
//   if (/SCHEDULED CASTE|\bSC\b/.test(l)) return "SC";
//   if (/SCHEDULED TRIBE|\bST\b/.test(l)) return "ST";
//   return "";
// };

// export const mapOfficerLabelToCode = (label: string): OfficerType | "" => {
//   const l = (label || "").toUpperCase();
//   if (!l) return "";
//   if (/\bECO\b|EMERGENCY\s*COMMISSION/.test(l)) return "ECO";
//   if (/\bSSCO\b|SHORT\s*SERVICE\s*COMMISSION/.test(l)) return "SSCO";
//   // Substring match — tolerates "commissiononed officer" typo.
//   if (/COMMISSION/.test(l)) return "COMMISSIONED_OFFICER";
//   // Substring match — tolerates " military officer" / "militey officer".
//   if (/OTHER\s*RANKS?|\bJCO\b|\bOR\b|MILIT/.test(l)) return "OTHER_RANKS";
  
//   return "OTHER_RANKS";
// };

// export function getBaseMaxAge(
//   category: Category | "" | undefined,
//   gender: Gender | "" | undefined,
// ): number | null {
//   if (!category || !gender) return null;

//   if (gender === "TRANSGENDER") {
//     // ⚠ E1 open item — see note above.
//     return 42;
//   }

//   switch (category) {
//     case "UR":
//     case "EWS":
//       return gender === "FEMALE" ? 40 : 37;
//     case "EBC":
//     case "BC":
//       return 40;
//     case "SC":
//     case "ST":
//       return 42;
//     default:
//       return null;
//   }
// }



// export function calcAgeParts(fromISO?: string, toISO?: string): AgeParts | null {
//   if (!fromISO || !toISO) return null;
//   const from = new Date(`${fromISO}T00:00:00`);
//   const to = new Date(`${toISO}T00:00:00`);
//   if (isNaN(from.getTime()) || isNaN(to.getTime())) return null;
//   if (from.getTime() > to.getTime()) return null;

//   let years = to.getFullYear() - from.getFullYear();
//   let months = to.getMonth() - from.getMonth();
//   let days = to.getDate() - from.getDate();

//   if (days < 0) {
//     months -= 1;
//     const daysInPrevMonth = new Date(to.getFullYear(), to.getMonth(), 0).getDate();
//     days += daysInPrevMonth;
//   }
//   if (months < 0) {
//     years -= 1;
//     months += 12;
//   }
//   return { years, months, days };
// }

// /** True if `age` is >= `minYears` (exact boundary allowed — matches T1). */
// export function isAtLeast(age: AgeParts, minYears: number): boolean {
//   return age.years > minYears || (age.years === minYears && age.months === 0 && age.days === 0);
// }

// /** True if `age` is <= `maxYears` (exact boundary allowed — matches T3). */
// export function isAtMost(age: AgeParts, maxYears: number): boolean {
//   return age.years < maxYears || (age.years === maxYears && age.months === 0 && age.days === 0);
// }

// /**
//  * Number of calendar days in a given month/year — accounts for leap years.
//  * `month` is 1-indexed to match the day/month/year dropdowns used across
//  * this form.
//  */
// export function getDaysInMonth(month: number, year: number): number {
//   if (!month || month < 1 || month > 12 || !year) return 31;
//   return new Date(year, month, 0).getDate();
// }



// export function computeExServicemanEffectiveMax(params: {
//   baseMax: number;
//   category: Category;
//   serviceYears: number;
// }): number {
//   const { baseMax, category,  serviceYears } = params;
//   const isScSt = category === "SC" || category === "ST";

//   // R-2 (+ R-3 for SC/ST)
//   let esMax = baseMax + 3 + Math.max(0, serviceYears);
//   if (isScSt) esMax += 5;
//   return Math.min(esMax, EX_SERVICEMAN_HARD_CAP);
// }

// /* ---------------------------------------------------------------
//    FULL AGE-ELIGIBILITY DECISION  (§5 decision flow)
// --------------------------------------------------------------- */

// export interface AgeEligibilityInput {
//   /** Internal short code ("UR"/"BC"/...) — map API labels first via mapCategoryLabelToCode. */
//   category: Category | "";
//   gender: Gender | "";
//   dobISO: string;
//   /** true when isPwD === "YES" AND isMin40PercentPwD === "YES" (R-1 ground). */
//   isPwbd: boolean;
//   isExServiceman: boolean;
//   /** Internal short code ("OTHER_RANKS"/...) — map API labels first via mapOfficerLabelToCode. */
//   officerType?: OfficerType | "";
//   serviceFromISO?: string;
//   serviceToISO?: string;
//   /** R-5 ground. */
//   isBiharGovtEmployee?: boolean;
//   /** Defaults to today if omitted — used for the ex-serviceman 53y hard cap. */
//   applicationDateISO?: string;
//   /** Enables the §2 carry-forward branch when qualification predates R2. */
//   qualificationDateISO?: string;
// }

// export type AgeEligibilityReasonCode =
//   | "DOB_MISSING"
//   | "INVALID_DOB"
//   | "CATEGORY_MISSING"
//   | "NON_CUMULATIVE_RELAXATION" // currently unreachable while ALLOW_PWBD_EXSM_STACKING = true
//   | "OFFICER_TYPE_MISSING"
//   | "BELOW_MIN_AGE"
//   | "EXSM_HARD_CAP_EXCEEDED"
//   | "ABOVE_MAX_AGE"
//   | "PASS";

// export interface AgeEligibilityResult {
//   ok: boolean;
//   reasonCode: AgeEligibilityReasonCode;
//   message: string;
//   ageOnR1: AgeParts | null;
//   effectiveMaxAge: number | null;
//   usedCarryForward: boolean;
// }

// export function validateAgeEligibility(input: AgeEligibilityInput): AgeEligibilityResult {
//   const {
//     category,
//     gender,
//     dobISO,
//     isPwbd,
//     isExServiceman,
//     officerType,
//     serviceFromISO,
//     serviceToISO,
//     qualificationDateISO,
//   } = input;

//   if (!dobISO) {
//     return fail("DOB_MISSING", "Date of birth is required to compute age eligibility.");
//   }

//   // §4 non-cumulation guard, AS WRITTEN in the matrix / test vector T10.
//   // Disabled per product decision — see ALLOW_PWBD_EXSM_STACKING doc-comment
//   // at the top of this file. Flip that flag to `false` to restore this.
//   if (!ALLOW_PWBD_EXSM_STACKING && isPwbd && isExServiceman) {
//     return fail(
//       "NON_CUMULATIVE_RELAXATION",
//       "Cannot claim disability (PwBD) and ex-serviceman relaxation together — choose a single relaxation ground.",
//     );
//   }

 
  

//   const ageOnR1 = calcAgeParts(dobISO, REFERENCE_DATE_R1);
//   if (!ageOnR1) {
//     return fail("INVALID_DOB", "Enter a valid date of birth.");
//   }

//   // Rule 1 — minimum age, never relaxed.
//   if (!isAtLeast(ageOnR1, MIN_AGE)) {
//     return fail(
//       "BELOW_MIN_AGE",
//       `Below minimum age of ${MIN_AGE} years as on ${displayDate(REFERENCE_DATE_R1)}.`,
//       ageOnR1,
//     );
//   }

//   const baseMax = getBaseMaxAge(category || undefined, gender || undefined);
//   if (baseMax == null) {
//     return fail(
//       "CATEGORY_MISSING",
//       "Select category and gender to compute the maximum age limit.",
//       ageOnR1,
//     );
//   }

//   // ---- Determine effective ceiling by relaxation ground(s) -------------
//   // When both PwBD and ex-serviceman are claimed (and stacking is allowed),
//   // compute BOTH ceilings and take the higher one, rather than picking a
//   // single ground.
//   let effMax = baseMax;
//   let pwbdMax: number | null = null;
//   let exsmMax: number | null = null;
//   let usedExsmGround = false;

//   if (isPwbd) {
//     // R-1
//     pwbdMax = baseMax + 10;
//   }

//   if (isExServiceman ) {
//     const serviceYears = calcAgeParts(serviceFromISO, serviceToISO)?.years ?? 0;
//     exsmMax = computeExServicemanEffectiveMax({
//       baseMax,
//       category: category as Category,
//       serviceYears,
//     });
//   }

//   if (pwbdMax != null && exsmMax != null) {
//     effMax = Math.max(pwbdMax, exsmMax);
//     usedExsmGround = exsmMax >= pwbdMax;
//   } else if (pwbdMax != null) {
//     effMax = pwbdMax;
//   } else if (exsmMax != null) {
//     effMax = exsmMax;
//     usedExsmGround = true;
//   }

//   // R-5 — Bihar Govt. servant (§5 pseudocode: govtservant -> baseMax + 5).
//   // See ALLOW_GOVT_STACKING_WITH_OTHER_GROUNDS doc-comment above: applies
//   // only when it's the sole ground claimed, unless that flag is flipped.
//   let govtMax: number | null = null;
//   let usedGovtGround = false;
//   if (input.isBiharGovtEmployee) {
//     govtMax = baseMax + 5;
//     const claimedOtherGround = pwbdMax != null || exsmMax != null;
//     if (!claimedOtherGround || ALLOW_GOVT_STACKING_WITH_OTHER_GROUNDS) {
//       if (govtMax > effMax) {
//         effMax = govtMax;
//         usedGovtGround = true;
//       }
//     }
//   }

//   // §3.2 hard cap — the ex-serviceman ground carries a 53y hard cap at
//   // time of application. Apply it whenever ex-serviceman status is
//   // claimed, regardless of whether the ex-serviceman ceiling ended up
//   // being the winning (higher) one — the candidate is still asserting
//   // ex-serviceman status on the form.
//   if (isExServiceman ) {
//     const appDateISO = input.applicationDateISO || new Date().toISOString().slice(0, 10);
//     const ageOnApplication = calcAgeParts(dobISO, appDateISO);
//     if (ageOnApplication && !isAtMost(ageOnApplication, EX_SERVICEMAN_HARD_CAP)) {
//       return fail(
//         "EXSM_HARD_CAP_EXCEEDED",
//         `Age exceeds the hard cap of ${EX_SERVICEMAN_HARD_CAP} years for ex-serviceman relaxation at the time of application.`,
//         ageOnR1,
//         effMax,
//       );
//     }
//   }

//   let ok = isAtMost(ageOnR1, effMax);
//   let usedCarryForward = false;

//   // §2 carry-forward branch — only if a qualifying date is supplied.
//   if (!ok && qualificationDateISO && qualificationDateISO <= REFERENCE_DATE_R2) {
//     const ageOnR2 = calcAgeParts(dobISO, REFERENCE_DATE_R2);
//     if (ageOnR2 && isAtMost(ageOnR2, effMax)) {
//       ok = true;
//       usedCarryForward = true;
//     }
//   }

//   if (!ok) {
//     return fail(
//       "ABOVE_MAX_AGE",
//       `Exceeds the maximum age limit of ${effMax} years for the selected category/relaxation as on ${displayDate(REFERENCE_DATE_R1)}.`,
//       ageOnR1,
//       effMax,
//     );
//   }

//   return {
//     ok: true,
//     reasonCode: "PASS",
//     message: usedCarryForward
//       ? "Eligible under the carry-forward provision (GAD letter No. 212 dated 23-01-2006)."
//       : pwbdMax != null && exsmMax != null
//         ? `Meets age eligibility criteria (combined PwBD + ex-serviceman relaxation; ${usedExsmGround ? "ex-serviceman" : "PwBD"} ground governs).`
//         : usedGovtGround
//           ? "Meets age eligibility criteria (Bihar Govt. servant relaxation, R-5)."
//           : "Meets age eligibility criteria.",
//     ageOnR1,
//     effectiveMaxAge: effMax,
//     usedCarryForward,
//   };
// }

// function fail(
//   reasonCode: AgeEligibilityReasonCode,
//   message: string,
//   ageOnR1: AgeParts | null = null,
//   effectiveMaxAge: number | null = null,
// ): AgeEligibilityResult {
//   return { ok: false, reasonCode, message, ageOnR1, effectiveMaxAge, usedCarryForward: false };
// }

// function displayDate(iso: string): string {
//   const [y, m, d] = iso.split("-");
//   return `${d}-${m}-${y}`;
// }

// export const categorySchema = z.enum(CATEGORY_VALUES);
// export const genderSchema = z.enum(GENDER_VALUES);
// export const officerTypeSchema = z.enum(OFFICER_TYPE_VALUES);
// export const yesNoSchema = z.enum(["YES", "NO"]);



// export const categoryLabelOrCodeSchema = z.preprocess((val) => {
//   if (typeof val !== "string" || val === "") return val;
//   if ((CATEGORY_VALUES as readonly string[]).includes(val)) return val;
//   return mapCategoryLabelToCode(val);
// }, categorySchema);



// export const officerTypeLabelOrCodeSchema = z.preprocess((val) => {
//   if (typeof val !== "string" || val === "") return val;
//   if ((OFFICER_TYPE_VALUES as readonly string[]).includes(val)) return val;
//   return mapOfficerLabelToCode(val);
// }, officerTypeSchema.or(z.literal("")));

// /** ISO yyyy-mm-dd, allows "" so it can compose with optional/conditional fields. */
// const isoDateOrEmpty = z
//   .string()
//   .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
//   .or(z.literal(""));

// /**
//  * Validates the "Service & Employment" ex-serviceman sub-section on its own.
//  * `officerType` accepts either the internal code or the raw API label.
//  */
// export const serviceEmploymentSchema = z
//   .object({
//     isExServiceman: yesNoSchema,
//     officerType: officerTypeLabelOrCodeSchema.optional().default(""),
//     serviceFromDate: isoDateOrEmpty.optional().default(""),
//     serviceToDate: isoDateOrEmpty.optional().default(""),
//   })
//   .superRefine((val, ctx) => {
//     if (val.isExServiceman !== "YES") return;

//     if (!val.officerType) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["officerType"],
//         message:
//           "Select the officer / ex-serviceman category (Other Ranks / Commissioned Officer / ECO / SSCO).",
//       });
//     }

//     if (!val.serviceFromDate || !val.serviceToDate) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["serviceFromDate"],
//         message: "Service period (from / to date) is required for ex-servicemen.",
//       });
//     } else if (new Date(val.serviceFromDate) > new Date(val.serviceToDate)) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["serviceToDate"],
//         message: "Service 'to' date must be on or after the 'from' date.",
//       });
//     }
//   });

// export type ServiceEmploymentInput = z.infer<typeof serviceEmploymentSchema>;


// export const ageEligibilitySchema = z
//   .object({
//     dob: z.string().min(1, "Date of birth is required"),
//     category: categoryLabelOrCodeSchema,
//     gender: genderSchema,
//     isBiharDomicile: yesNoSchema,
//     isPwD: yesNoSchema,
//     isMin40PercentPwD: yesNoSchema,
//     isExServiceman: yesNoSchema,
//     officerType: officerTypeLabelOrCodeSchema.optional().default(""),
//     serviceFromDate: isoDateOrEmpty.optional().default(""),
//     serviceToDate: isoDateOrEmpty.optional().default(""),
//     isBiharGovtEmployee: yesNoSchema.optional(),
//     qualificationDate: isoDateOrEmpty.optional().default(""),
//   })
//   .superRefine((val, ctx) => {
//     const isPwbd = val.isPwD === "YES" && val.isMin40PercentPwD === "YES";
//     const isExsm = val.isExServiceman === "YES";

//     // §4 non-cumulation — kept in sync with ALLOW_PWBD_EXSM_STACKING above.
//     // Currently disabled (stacking allowed); flip the flag in this file
//     // (not here) to keep a single source of truth.
//     if (!ALLOW_PWBD_EXSM_STACKING && isPwbd && isExsm) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["isExServiceman"],
//         message: "Cannot claim disability and ex-serviceman relaxation together.",
//       });
//       return;
//     }

//     if (val.gender === "TRANSGENDER" && val.isBiharDomicile === "YES" && val.category !== "BC") {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["category"],
//         message: "Transgender candidates must apply under the BC category.",
//       });
//     }

//     if (isExsm && !val.officerType) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         path: ["officerType"],
//         message: "Select the applicable officer / ex-serviceman category.",
//       });
//       return;
//     }

//     const result = validateAgeEligibility({
//       category: val.category,
//       gender: val.gender,
//       dobISO: val.dob,
//       isPwbd,
//       isExServiceman: isExsm,
//       officerType: val.officerType,
//       serviceFromISO: val.serviceFromDate,
//       serviceToISO: val.serviceToDate,
//       isBiharGovtEmployee: val.isBiharGovtEmployee === "YES",
//       qualificationDateISO: val.qualificationDate || undefined,
//     });

//     if (!result.ok) {
//       ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["dob"], message: result.message });
//     }
//   });

// export type AgeEligibilitySchemaInput = z.infer<typeof ageEligibilitySchema>;



import { z } from "zod";
/** Primary reference date (R1) — age is computed as on this date. */
export const REFERENCE_DATE_R1 = "2026-08-01";

/** Carry-forward reference date (R2) — GAD letter No. 212 dated 23.01.2006. */
export const REFERENCE_DATE_R2 = "2022-08-01";

/** Minimum age for ALL categories — never relaxed. */
export const MIN_AGE = 21;

/** Hard cap on ex-serviceman relaxation, regardless of computed value (§3.2, E8). */
export const EX_SERVICEMAN_HARD_CAP = 57;


export const ALLOW_PWBD_EXSM_STACKING = true;

export const ALLOW_GOVT_STACKING_WITH_OTHER_GROUNDS = false;

export const CATEGORY_VALUES = ["UR", "EBC", "BC", "SC", "ST", "EWS"] as const;
export type Category = (typeof CATEGORY_VALUES)[number];

export const GENDER_VALUES = ["MALE", "FEMALE", "TRANSGENDER"] as const;
export type Gender = (typeof GENDER_VALUES)[number];


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


export const mapCategoryLabelToCode = (label: string): Category | "" => {
  const l = (label || "").toUpperCase();
  if (/UNRESERVED|GENERAL|\bUR\b/.test(l)) return "UR";
  if (/ECONOMICALLY WEAKER|\bEWS\b/.test(l)) return "EWS";
  // Must be checked BEFORE plain "Backward Class" — "Extremely Backward
  // Class" also contains the word "Backward".
  if (/EXTREMELY BACKWARD|\bEBC\b/.test(l)) return "EBC";
  if (/BACKWARD CLASS|\bBC\b/.test(l)) return "BC";
  if (/SCHEDULED CASTE|\bSC\b/.test(l)) return "SC";
  if (/SCHEDULED TRIBE|\bST\b/.test(l)) return "ST";
  return "";
};

export const mapOfficerLabelToCode = (label: string): OfficerType | "" => {
  const l = (label || "").toUpperCase();
  if (!l) return "";
  if (/\bECO\b|EMERGENCY\s*COMMISSION/.test(l)) return "ECO";
  if (/\bSSCO\b|SHORT\s*SERVICE\s*COMMISSION/.test(l)) return "SSCO";
  // Substring match — tolerates "commissiononed officer" typo.
  if (/COMMISSION/.test(l)) return "COMMISSIONED_OFFICER";
  // Substring match — tolerates " military officer" / "militey officer".
  if (/OTHER\s*RANKS?|\bJCO\b|\bOR\b|MILIT/.test(l)) return "OTHER_RANKS";
 
  return "OTHER_RANKS";
};

export function getBaseMaxAge(
  category: Category | "" | undefined,
  gender: Gender | "" | undefined,
): number | null {
  if (!category || !gender) return null;

  if (gender === "TRANSGENDER") {
    // FIX (per notification, §2 age-limit table, row 04): Transgender
    // candidates are grouped with SC/ST at 42 years, not 40. Previously
    // this incorrectly returned 40 — see PDF: "अनुसूचित जाति एवं
    // अनुसूचित जनजाति (पुरुष एवं महिला) एवं ट्रांसजेंडर — 42 वर्ष".
    return 42;
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

/**
 * Number of calendar days in a given month/year — accounts for leap years.
 * `month` is 1-indexed to match the day/month/year dropdowns used across
 * this form.
 */
export function getDaysInMonth(month: number, year: number): number {
  if (!month || month < 1 || month > 12 || !year) return 31;
  return new Date(year, month, 0).getDate();
}



export function computeExServicemanEffectiveMax(params: {
  baseMax: number;
  category: Category;
  serviceYears: number;
}): number {
  const { baseMax, category,  serviceYears } = params;
  const isScSt = category === "SC" || category === "ST";

  // R-2 (+ R-3 for SC/ST)
  let esMax = baseMax + 3 + Math.max(0, serviceYears);
  if (isScSt) esMax += 5;
  return Math.min(esMax, EX_SERVICEMAN_HARD_CAP);
}

/* ---------------------------------------------------------------
   FULL AGE-ELIGIBILITY DECISION  (§5 decision flow)
--------------------------------------------------------------- */

export interface AgeEligibilityInput {
  /** Internal short code ("UR"/"BC"/...) — map API labels first via mapCategoryLabelToCode. */
  category: Category | "";
  gender: Gender | "";
  dobISO: string;
  /** true when isPwD === "YES" AND isMin40PercentPwD === "YES" (R-1 ground). */
  isPwbd: boolean;
  isExServiceman: boolean;
  /** Internal short code ("OTHER_RANKS"/...) — map API labels first via mapOfficerLabelToCode. */
  officerType?: OfficerType | "";
  serviceFromISO?: string;
  serviceToISO?: string;
  /** R-5 ground. */
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
  | "NON_CUMULATIVE_RELAXATION" // currently unreachable while ALLOW_PWBD_EXSM_STACKING = true
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

  // §4 non-cumulation guard, AS WRITTEN in the matrix / test vector T10.
  // Disabled per product decision — see ALLOW_PWBD_EXSM_STACKING doc-comment
  // at the top of this file. Flip that flag to `false` to restore this.
  if (!ALLOW_PWBD_EXSM_STACKING && isPwbd && isExServiceman) {
    return fail(
      "NON_CUMULATIVE_RELAXATION",
      "Cannot claim disability (PwBD) and ex-serviceman relaxation together — choose a single relaxation ground.",
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

  // ---- Determine effective ceiling by relaxation ground(s) -------------
  // When both PwBD and ex-serviceman are claimed (and stacking is allowed),
  // compute BOTH ceilings and take the higher one, rather than picking a
  // single ground.
  let effMax = baseMax;
  let pwbdMax: number | null = null;
  let exsmMax: number | null = null;
  let usedExsmGround = false;

  if (isPwbd) {
    // R-1
    pwbdMax = baseMax + 10;
  }

  if (isExServiceman ) {
    const serviceYears = calcAgeParts(serviceFromISO, serviceToISO)?.years ?? 0;
    exsmMax = computeExServicemanEffectiveMax({
      baseMax,
      category: category as Category,
      serviceYears,
    });
  }

  if (pwbdMax != null && exsmMax != null) {
    effMax = Math.max(pwbdMax, exsmMax);
    usedExsmGround = exsmMax >= pwbdMax;
  } else if (pwbdMax != null) {
    effMax = pwbdMax;
  } else if (exsmMax != null) {
    effMax = exsmMax;
    usedExsmGround = true;
  }

  // R-5 — Bihar Govt. servant (§5 pseudocode: govtservant -> baseMax + 5).
  // See ALLOW_GOVT_STACKING_WITH_OTHER_GROUNDS doc-comment above: applies
  // only when it's the sole ground claimed, unless that flag is flipped.
  let govtMax: number | null = null;
  let usedGovtGround = false;
  if (input.isBiharGovtEmployee) {
    govtMax = baseMax + 5;
    const claimedOtherGround = pwbdMax != null || exsmMax != null;
    if (!claimedOtherGround || ALLOW_GOVT_STACKING_WITH_OTHER_GROUNDS) {
      if (govtMax > effMax) {
        effMax = govtMax;
        usedGovtGround = true;
      }
    }
  }

  // §3.2 hard cap — the ex-serviceman ground carries a 53y hard cap at
  // time of application. Apply it whenever ex-serviceman status is
  // claimed, regardless of whether the ex-serviceman ceiling ended up
  // being the winning (higher) one — the candidate is still asserting
  // ex-serviceman status on the form.
  if (isExServiceman ) {
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
      : pwbdMax != null && exsmMax != null
        ? `Meets age eligibility criteria (combined PwBD + ex-serviceman relaxation; ${usedExsmGround ? "ex-serviceman" : "PwBD"} ground governs).`
        : usedGovtGround
          ? "Meets age eligibility criteria (Bihar Govt. servant relaxation, R-5)."
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

export const categorySchema = z.enum(CATEGORY_VALUES);
export const genderSchema = z.enum(GENDER_VALUES);
export const officerTypeSchema = z.enum(OFFICER_TYPE_VALUES);
export const yesNoSchema = z.enum(["YES", "NO"]);



export const categoryLabelOrCodeSchema = z.preprocess((val) => {
  if (typeof val !== "string" || val === "") return val;
  if ((CATEGORY_VALUES as readonly string[]).includes(val)) return val;
  return mapCategoryLabelToCode(val);
}, categorySchema);



export const officerTypeLabelOrCodeSchema = z.preprocess((val) => {
  if (typeof val !== "string" || val === "") return val;
  if ((OFFICER_TYPE_VALUES as readonly string[]).includes(val)) return val;
  return mapOfficerLabelToCode(val);
}, officerTypeSchema.or(z.literal("")));

/** ISO yyyy-mm-dd, allows "" so it can compose with optional/conditional fields. */
const isoDateOrEmpty = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date")
  .or(z.literal(""));

/**
 * Validates the "Service & Employment" ex-serviceman sub-section on its own.
 * `officerType` accepts either the internal code or the raw API label.
 */
export const serviceEmploymentSchema = z
  .object({
    isExServiceman: yesNoSchema,
    officerType: officerTypeLabelOrCodeSchema.optional().default(""),
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


export const ageEligibilitySchema = z
  .object({
    dob: z.string().min(1, "Date of birth is required"),
    category: categoryLabelOrCodeSchema,
    gender: genderSchema,
    isBiharDomicile: yesNoSchema,
    isPwD: yesNoSchema,
    isMin40PercentPwD: yesNoSchema,
    isExServiceman: yesNoSchema,
    officerType: officerTypeLabelOrCodeSchema.optional().default(""),
    serviceFromDate: isoDateOrEmpty.optional().default(""),
    serviceToDate: isoDateOrEmpty.optional().default(""),
    isBiharGovtEmployee: yesNoSchema.optional(),
    qualificationDate: isoDateOrEmpty.optional().default(""),
  })
  .superRefine((val, ctx) => {
    const isPwbd = val.isPwD === "YES" && val.isMin40PercentPwD === "YES";
    const isExsm = val.isExServiceman === "YES";

    // §4 non-cumulation — kept in sync with ALLOW_PWBD_EXSM_STACKING above.
    // Currently disabled (stacking allowed); flip the flag in this file
    // (not here) to keep a single source of truth.
    if (!ALLOW_PWBD_EXSM_STACKING && isPwbd && isExsm) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["isExServiceman"],
        message: "Cannot claim disability and ex-serviceman relaxation together.",
      });
      return;
    }

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
