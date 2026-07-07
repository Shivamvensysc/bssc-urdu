import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";
import type { ISignUpResult } from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

export const userPool = new CognitoUserPool(poolData);

/** Shape of the fields we actually persist to Cognito (subset of the form's `data` state). */
export interface RegistrationFormData {
  applicantName: string;
  gender: string;
  isBiharDomicile: string;
  category: string;
  caste: string;
  isNonCreamyLayer: string;
  isPwD: string;
  natureOfDisability: string;
  isMin40PercentPwD: string;
  isExServiceman: string;
  /** ISO yyyy-mm-dd — blank if not applicable */
  serviceFromDate: string;
  /** ISO yyyy-mm-dd — blank if not applicable */
  serviceToDate: string;
  isNccCadet: string;
  nccCertificateNo: string;
  isBiharGovtEmployee: string;
  bsscAttempts: string;
  isContractualEmployee: string;
  nameOfPost: string;
  hasAgreement: string;
  /** ISO yyyy-mm-dd — blank if not applicable */
  contractualFromDate: string;
  /** ISO yyyy-mm-dd — blank if not applicable */
  contractualToDate: string;
  mobileNo: string;
  emailId: string;
  dobDay: string;
  dobMonth: string;
  dobYear: string;
}

export interface SendOtpResponse {
  userSub: string;
  username: string;
  codeDeliveryDetails?: unknown;
  rawResult: ISignUpResult;
}

export interface VerifyOtpResponse {
  status: string;
  message: string;
}

export interface DurationParts {
  years: number;
  months: number;
  days: number;
}

/**
 * Every custom attribute this app ever sends to Cognito.
 * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
 * as String / Mutable = true, or signUp() will throw InvalidParameterException with
 * "Type for attribute {custom:xxx} could not be determined".
 * Keep this list and the pool schema in sync — it's the single source of truth in code.
 */
const REQUIRED_CUSTOM_ATTRIBUTES = [
  "custom:bihar_domicile",
  "custom:mobile_no",
  "custom:category",
  "custom:caste",
  "custom:non_creamy_layer",
  "custom:is_pwd",
  "custom:disability_type",
  "custom:pwd_40_percent",
  "custom:ex_serviceman",
  "custom:service_period",
  "custom:ncc_cadet",
  "custom:ncc_cert_no",
  "custom:bihar_govt_emp",
  "custom:bssc_attempts",
  "custom:contractual_emp",
  "custom:post_name",
  "custom:has_agreement",
  "custom:contractual_period",
] as const;

const pad2 = (v: string): string => v.padStart(2, "0");

/** true if all DOB parts are present and form a real calendar date */
const isValidDob = (day: string, month: string, year: string): boolean => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!d || !m || !y) return false;
  const dt = new Date(y, m - 1, d);
  return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
};

/**
 * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
 * Returns null if either date is missing/invalid, or `to` is before `from`.
 * Shared by age-on-cutoff-date, service period, and contractual period calculations.
 */
export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
  if (!fromIso || !toIso) return null;
  const from = new Date(fromIso);
  const to = new Date(toIso);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
};

/** Formats a from/to date pair into the "0Y-0M-0D" string Cognito stores. Empty string if incomplete/invalid. */
const formatDurationAttribute = (fromIso: string, toIso: string): string => {
  const duration = calcDuration(fromIso, toIso);
  return duration ? `${duration.years}Y-${duration.months}M-${duration.days}D` : "";
};

/**
 * Maps form fields -> Cognito attributes.
 * Standard attributes are used where Cognito has a matching field
 * (email, name, gender, birthdate); everything else goes out as a
 * `custom:` attribute that must already exist in the pool schema.
 */
const buildAttributeList = (data: RegistrationFormData): CognitoUserAttribute[] => {
  const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
    ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
    : "";

  const attrs: Record<string, string> = {
    // standard attributes
    email: data.emailId,
    name: data.applicantName,
    gender: data.gender,
    birthdate,

    // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
    "custom:bihar_domicile": data.isBiharDomicile,
    "custom:mobile_no": data.mobileNo,
    "custom:category": data.category,
    "custom:caste": data.caste,
    "custom:non_creamy_layer": data.isNonCreamyLayer,
    "custom:is_pwd": data.isPwD,
    "custom:disability_type": data.natureOfDisability,
    "custom:pwd_40_percent": data.isMin40PercentPwD,
    "custom:ex_serviceman": data.isExServiceman,
    "custom:service_period": formatDurationAttribute(data.serviceFromDate, data.serviceToDate),
    "custom:ncc_cadet": data.isNccCadet,
    "custom:ncc_cert_no": data.nccCertificateNo,
    "custom:bihar_govt_emp": data.isBiharGovtEmployee,
    "custom:bssc_attempts": data.bsscAttempts,
    "custom:contractual_emp": data.isContractualEmployee,
    "custom:post_name": data.nameOfPost,
    "custom:has_agreement": data.hasAgreement,
    "custom:contractual_period": formatDurationAttribute(data.contractualFromDate, data.contractualToDate),
  };

  // Cognito rejects attributes sent as an empty string, so drop blanks
  // (this also means truly-optional fields like nccCertificateNo, or an
  // ex-serviceman date range that was never filled in, are fine unfilled).
  return Object.entries(attrs)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
};

/**
 * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
 * We turn it into something a developer can act on immediately, instead of
 * surfacing raw AWS text to the end user.
 */
class SchemaMisconfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SchemaMisconfiguredError";
  }
}

export const sendOtp = async (data: RegistrationFormData): Promise<SendOtpResponse> => {
  return new Promise((resolve, reject) => {
    const attributeList = buildAttributeList(data);

    // Cognito requires a password at signUp time even though candidates
    // only ever authenticate via the email OTP — this one is never shown
    // to the user and never reused.
    const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

    userPool.signUp(data.emailId, temporaryPassword, attributeList, [], (err, result) => {
      if (err) {
        if (
          err.name === "InvalidParameterException" &&
          /could not be determined/i.test(err.message || "")
        ) {
          const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
            (err.message || "").includes(a)
          );
          reject(
            new SchemaMisconfiguredError(
              missing
                ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
                : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
            )
          );
          return;
        }
        reject(err);
        return;
      }
      if (!result) {
        reject(new Error("Signup failed"));
        return;
      }
      resolve({
        userSub: result.userSub,
        username: result.user?.getUsername?.() || data.emailId,
        codeDeliveryDetails: result.codeDeliveryDetails,
        rawResult: result,
      });
    });
  });
};

export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmRegistration(otp, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
    });
  });
};

export const resendOtp = async (email: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.resendConfirmationCode((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
  });
};