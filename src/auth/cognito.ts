// // // // import {
// // // //   CognitoUserPool,
// // // //   CognitoUser,
// // // //   CognitoUserAttribute,
// // // // } from "amazon-cognito-identity-js";
// // // // import type { ISignUpResult } from "amazon-cognito-identity-js";

// // // // const poolData = {
// // // //   UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
// // // //   ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
// // // // };

// // // // export const userPool = new CognitoUserPool(poolData);

// // // // /** Shape of the fields we actually persist to Cognito (subset of the form's `data` state). */
// // // // export interface RegistrationFormData {
// // // //   applicantName: string;
// // // //   gender: string;
// // // //   isBiharDomicile: string;
// // // //   category: string;
// // // //   caste: string;
// // // //   isNonCreamyLayer: string;
// // // //   isPwD: string;
// // // //   natureOfDisability: string;
// // // //   isMin40PercentPwD: string;
// // // //   isExServiceman: string;
// // // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // // //   serviceFromDate: string;
// // // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // // //   serviceToDate: string;
// // // //   isNccCadet: string;
// // // //   nccCertificateNo: string;
// // // //   isBiharGovtEmployee: string;
// // // //   bsscAttempts: string;
// // // //   isContractualEmployee: string;
// // // //   nameOfPost: string;
// // // //   hasAgreement: string;
// // // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // // //   contractualFromDate: string;
// // // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // // //   contractualToDate: string;
// // // //   mobileNo: string;
// // // //   emailId: string;
// // // //   dobDay: string;
// // // //   dobMonth: string;
// // // //   dobYear: string;
// // // // }

// // // // export interface SendOtpResponse {
// // // //   userSub: string;
// // // //   username: string;
// // // //   codeDeliveryDetails?: unknown;
// // // //   rawResult: ISignUpResult;
// // // // }

// // // // export interface VerifyOtpResponse {
// // // //   status: string;
// // // //   message: string;
// // // // }

// // // // export interface DurationParts {
// // // //   years: number;
// // // //   months: number;
// // // //   days: number;
// // // // }

// // // // /**
// // // //  * Every custom attribute this app ever sends to Cognito.
// // // //  * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
// // // //  * as String / Mutable = true, or signUp() will throw InvalidParameterException with
// // // //  * "Type for attribute {custom:xxx} could not be determined".
// // // //  * Keep this list and the pool schema in sync — it's the single source of truth in code.
// // // //  */
// // // // const REQUIRED_CUSTOM_ATTRIBUTES = [
// // // //   "custom:bihar_domicile",
// // // //   "custom:mobile_no",
// // // //   "custom:category",
// // // //   "custom:caste",
// // // //   "custom:non_creamy_layer",
// // // //   "custom:is_pwd",
// // // //   "custom:disability_type",
// // // //   "custom:pwd_40_percent",
// // // //   "custom:ex_serviceman",
// // // //   "custom:service_period",
// // // //   "custom:ncc_cadet",
// // // //   "custom:ncc_cert_no",
// // // //   "custom:bihar_govt_emp",
// // // //   "custom:bssc_attempts",
// // // //   "custom:contractual_emp",
// // // //   "custom:post_name",
// // // //   "custom:has_agreement",
// // // //   "custom:contractual_period",
// // // // ] as const;

// // // // const pad2 = (v: string): string => v.padStart(2, "0");

// // // // /** true if all DOB parts are present and form a real calendar date */
// // // // const isValidDob = (day: string, month: string, year: string): boolean => {
// // // //   const d = parseInt(day, 10);
// // // //   const m = parseInt(month, 10);
// // // //   const y = parseInt(year, 10);
// // // //   if (!d || !m || !y) return false;
// // // //   const dt = new Date(y, m - 1, d);
// // // //   return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
// // // // };

// // // // /**
// // // //  * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
// // // //  * Returns null if either date is missing/invalid, or `to` is before `from`.
// // // //  * Shared by age-on-cutoff-date, service period, and contractual period calculations.
// // // //  */
// // // // export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
// // // //   if (!fromIso || !toIso) return null;
// // // //   const from = new Date(fromIso);
// // // //   const to = new Date(toIso);
// // // //   if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

// // // //   let years = to.getFullYear() - from.getFullYear();
// // // //   let months = to.getMonth() - from.getMonth();
// // // //   let days = to.getDate() - from.getDate();

// // // //   if (days < 0) {
// // // //     months -= 1;
// // // //     days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
// // // //   }
// // // //   if (months < 0) {
// // // //     years -= 1;
// // // //     months += 12;
// // // //   }
// // // //   return { years, months, days };
// // // // };

// // // // /** Formats a from/to date pair into the "0Y-0M-0D" string Cognito stores. Empty string if incomplete/invalid. */
// // // // const formatDurationAttribute = (fromIso: string, toIso: string): string => {
// // // //   const duration = calcDuration(fromIso, toIso);
// // // //   return duration ? `${duration.years}Y-${duration.months}M-${duration.days}D` : "";
// // // // };

// // // // /**
// // // //  * Maps form fields -> Cognito attributes.
// // // //  * Standard attributes are used where Cognito has a matching field
// // // //  * (email, name, gender, birthdate); everything else goes out as a
// // // //  * `custom:` attribute that must already exist in the pool schema.
// // // //  */
// // // // const buildAttributeList = (data: RegistrationFormData): CognitoUserAttribute[] => {
// // // //   const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
// // // //     ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
// // // //     : "";

// // // //   const attrs: Record<string, string> = {
// // // //     // standard attributes
// // // //     email: data.emailId,
// // // //     name: data.applicantName,
// // // //     gender: data.gender,
// // // //     birthdate,

// // // //     // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
// // // //     "custom:bihar_domicile": data.isBiharDomicile,
// // // //     "custom:mobile_no": data.mobileNo,
// // // //     "custom:category": data.category,
// // // //     "custom:caste": data.caste,
// // // //     "custom:non_creamy_layer": data.isNonCreamyLayer,
// // // //     "custom:is_pwd": data.isPwD,
// // // //     "custom:disability_type": data.natureOfDisability,
// // // //     "custom:pwd_40_percent": data.isMin40PercentPwD,
// // // //     "custom:ex_serviceman": data.isExServiceman,
// // // //     "custom:service_period": formatDurationAttribute(data.serviceFromDate, data.serviceToDate),
// // // //     "custom:ncc_cadet": data.isNccCadet,
// // // //     "custom:ncc_cert_no": data.nccCertificateNo,
// // // //     "custom:bihar_govt_emp": data.isBiharGovtEmployee,
// // // //     "custom:bssc_attempts": data.bsscAttempts,
// // // //     "custom:contractual_emp": data.isContractualEmployee,
// // // //     "custom:post_name": data.nameOfPost,
// // // //     "custom:has_agreement": data.hasAgreement,
// // // //     "custom:contractual_period": formatDurationAttribute(data.contractualFromDate, data.contractualToDate),
// // // //   };

// // // //   // Cognito rejects attributes sent as an empty string, so drop blanks
// // // //   // (this also means truly-optional fields like nccCertificateNo, or an
// // // //   // ex-serviceman date range that was never filled in, are fine unfilled).
// // // //   return Object.entries(attrs)
// // // //     .filter(([, value]) => value !== undefined && value !== null && value !== "")
// // // //     .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
// // // // };

// // // // /**
// // // //  * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
// // // //  * We turn it into something a developer can act on immediately, instead of
// // // //  * surfacing raw AWS text to the end user.
// // // //  */
// // // // class SchemaMisconfiguredError extends Error {
// // // //   constructor(message: string) {
// // // //     super(message);
// // // //     this.name = "SchemaMisconfiguredError";
// // // //   }
// // // // }

// // // // export const sendOtp = async (data: RegistrationFormData): Promise<SendOtpResponse> => {
// // // //   return new Promise((resolve, reject) => {
// // // //     const attributeList = buildAttributeList(data);

// // // //     // Cognito requires a password at signUp time even though candidates
// // // //     // only ever authenticate via the email OTP — this one is never shown
// // // //     // to the user and never reused.
// // // //     const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

// // // //     userPool.signUp(data.emailId, temporaryPassword, attributeList, [], (err, result) => {
// // // //       if (err) {
// // // //         if (
// // // //           err.name === "InvalidParameterException" &&
// // // //           /could not be determined/i.test(err.message || "")
// // // //         ) {
// // // //           const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
// // // //             (err.message || "").includes(a)
// // // //           );
// // // //           reject(
// // // //             new SchemaMisconfiguredError(
// // // //               missing
// // // //                 ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
// // // //                 : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
// // // //             )
// // // //           );
// // // //           return;
// // // //         }
// // // //         reject(err);
// // // //         return;
// // // //       }
// // // //       if (!result) {
// // // //         reject(new Error("Signup failed"));
// // // //         return;
// // // //       }
// // // //       resolve({
// // // //         userSub: result.userSub,
// // // //         username: result.user?.getUsername?.() || data.emailId,
// // // //         codeDeliveryDetails: result.codeDeliveryDetails,
// // // //         rawResult: result,
// // // //       });
// // // //     });
// // // //   });
// // // // };

// // // // export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
// // // //   return new Promise((resolve, reject) => {
// // // //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// // // //     cognitoUser.confirmRegistration(otp, true, (err, result) => {
// // // //       if (err) {
// // // //         reject(err);
// // // //         return;
// // // //       }
// // // //       resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
// // // //     });
// // // //   });
// // // // };

// // // // export const resendOtp = async (email: string): Promise<unknown> => {
// // // //   return new Promise((resolve, reject) => {
// // // //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// // // //     cognitoUser.resendConfirmationCode((err, result) => {
// // // //       if (err) {
// // // //         reject(err);
// // // //         return;
// // // //       }
// // // //       resolve(result);
// // // //     });
// // // //   });
// // // // };


// // // import {
// // //   CognitoUserPool,
// // //   CognitoUser,
// // //   CognitoUserAttribute,
// // // } from "amazon-cognito-identity-js";
// // // import type { ISignUpResult } from "amazon-cognito-identity-js";

// // // const poolData = {
// // //   UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
// // //   ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
// // // };

// // // export const userPool = new CognitoUserPool(poolData);

// // // /** Shape of the fields we actually persist to Cognito (subset of the form's `data` state). */
// // // export interface RegistrationFormData {
// // //   applicantName: string;
// // //   gender: string;
// // //   isBiharDomicile: string;
// // //   category: string;
// // //   caste: string;
// // //   isNonCreamyLayer: string;
// // //   isPwD: string;
// // //   natureOfDisability: string;
// // //   isMin40PercentPwD: string;
// // //   isExServiceman: string;
// // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // //   serviceFromDate: string;
// // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // //   serviceToDate: string;
// // //   isNccCadet: string;
// // //   nccCertificateNo: string;
// // //   isBiharGovtEmployee: string;
// // //   bsscAttempts: string;
// // //   isContractualEmployee: string;
// // //   nameOfPost: string;
// // //   hasAgreement: string;
// // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // //   contractualFromDate: string;
// // //   /** ISO yyyy-mm-dd — blank if not applicable */
// // //   contractualToDate: string;
// // //   mobileNo: string;
// // //   emailId: string;
// // //   dobDay: string;
// // //   dobMonth: string;
// // //   dobYear: string;
// // // }

// // // export interface SendOtpResponse {
// // //   userSub: string;
// // //   username: string;
// // //   codeDeliveryDetails?: unknown;
// // //   rawResult: ISignUpResult;
// // // }

// // // export interface VerifyOtpResponse {
// // //   status: string;
// // //   message: string;
// // // }

// // // export interface DurationParts {
// // //   years: number;
// // //   months: number;
// // //   days: number;
// // // }

// // // /**
// // //  * Every custom attribute this app ever sends to Cognito.
// // //  * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
// // //  * as String / Mutable = true, or signUp() will throw InvalidParameterException with
// // //  * "Type for attribute {custom:xxx} could not be determined".
// // //  * Keep this list and the pool schema in sync — it's the single source of truth in code.
// // //  */
// // // const REQUIRED_CUSTOM_ATTRIBUTES = [
// // //   "custom:bihar_domicile",
// // //   "custom:mobile_no",
// // //   "custom:category",
// // //   "custom:caste",
// // //   "custom:non_creamy_layer",
// // //   "custom:is_pwd",
// // //   "custom:disability_type",
// // //   "custom:pwd_40_percent",
// // //   "custom:ex_serviceman",
// // //   "custom:service_period",
// // //   "custom:ncc_cadet",
// // //   "custom:ncc_cert_no",
// // //   "custom:bihar_govt_emp",
// // //   "custom:bssc_attempts",
// // //   "custom:contractual_emp",
// // //   "custom:post_name",
// // //   "custom:has_agreement",
// // //   "custom:contractual_period",
// // // ] as const;

// // // const pad2 = (v: string): string => v.padStart(2, "0");

// // // /** true if all DOB parts are present and form a real calendar date */
// // // const isValidDob = (day: string, month: string, year: string): boolean => {
// // //   const d = parseInt(day, 10);
// // //   const m = parseInt(month, 10);
// // //   const y = parseInt(year, 10);
// // //   if (!d || !m || !y) return false;
// // //   const dt = new Date(y, m - 1, d);
// // //   return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
// // // };

// // // /**
// // //  * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
// // //  * Returns null if either date is missing/invalid, or `to` is before `from`.
// // //  * Shared by age-on-cutoff-date, service period, and contractual period calculations.
// // //  */
// // // export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
// // //   if (!fromIso || !toIso) return null;
// // //   const from = new Date(fromIso);
// // //   const to = new Date(toIso);
// // //   if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

// // //   let years = to.getFullYear() - from.getFullYear();
// // //   let months = to.getMonth() - from.getMonth();
// // //   let days = to.getDate() - from.getDate();

// // //   if (days < 0) {
// // //     months -= 1;
// // //     days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
// // //   }
// // //   if (months < 0) {
// // //     years -= 1;
// // //     months += 12;
// // //   }
// // //   return { years, months, days };
// // // };

// // // /** Formats a from/to date pair into the "0Y-0M-0D" string Cognito stores. Empty string if incomplete/invalid. */
// // // const formatDurationAttribute = (fromIso: string, toIso: string): string => {
// // //   const duration = calcDuration(fromIso, toIso);
// // //   return duration ? `${duration.years}Y-${duration.months}M-${duration.days}D` : "";
// // // };

// // // /**
// // //  * Maps form fields -> Cognito attributes.
// // //  * Standard attributes are used where Cognito has a matching field
// // //  * (email, name, gender, birthdate); everything else goes out as a
// // //  * `custom:` attribute that must already exist in the pool schema.
// // //  */
// // // const buildAttributeList = (data: RegistrationFormData): CognitoUserAttribute[] => {
// // //   const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
// // //     ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
// // //     : "";

// // //   const attrs: Record<string, string> = {
// // //     // standard attributes
// // //     email: data.emailId,
// // //     name: data.applicantName,
// // //     gender: data.gender,
// // //     birthdate,

// // //     // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
// // //     "custom:bihar_domicile": data.isBiharDomicile,
// // //     "custom:mobile_no": data.mobileNo,
// // //     "custom:category": data.category,
// // //     "custom:caste": data.caste,
// // //     "custom:non_creamy_layer": data.isNonCreamyLayer,
// // //     "custom:is_pwd": data.isPwD,
// // //     "custom:disability_type": data.natureOfDisability,
// // //     "custom:pwd_40_percent": data.isMin40PercentPwD,
// // //     "custom:ex_serviceman": data.isExServiceman,
// // //     "custom:service_period": formatDurationAttribute(data.serviceFromDate, data.serviceToDate),
// // //     "custom:ncc_cadet": data.isNccCadet,
// // //     "custom:ncc_cert_no": data.nccCertificateNo,
// // //     "custom:bihar_govt_emp": data.isBiharGovtEmployee,
// // //     "custom:bssc_attempts": data.bsscAttempts,
// // //     "custom:contractual_emp": data.isContractualEmployee,
// // //     "custom:post_name": data.nameOfPost,
// // //     "custom:has_agreement": data.hasAgreement,
// // //     "custom:contractual_period": formatDurationAttribute(data.contractualFromDate, data.contractualToDate),
// // //   };

// // //   // Cognito rejects attributes sent as an empty string, so drop blanks
// // //   // (this also means truly-optional fields like nccCertificateNo, or an
// // //   // ex-serviceman date range that was never filled in, are fine unfilled).
// // //   return Object.entries(attrs)
// // //     .filter(([, value]) => value !== undefined && value !== null && value !== "")
// // //     .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
// // // };

// // // /**
// // //  * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
// // //  * We turn it into something a developer can act on immediately, instead of
// // //  * surfacing raw AWS text to the end user.
// // //  */
// // // class SchemaMisconfiguredError extends Error {
// // //   constructor(message: string) {
// // //     super(message);
// // //     this.name = "SchemaMisconfiguredError";
// // //   }
// // // }

// // // export const sendOtp = async (data: RegistrationFormData): Promise<SendOtpResponse> => {
// // //   return new Promise((resolve, reject) => {
// // //     const attributeList = buildAttributeList(data);

// // //     // Cognito requires a password at signUp time even though candidates
// // //     // only ever authenticate via the email OTP — this one is never shown
// // //     // to the user and never reused.
// // //     const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

// // //     userPool.signUp(data.emailId, temporaryPassword, attributeList, [], (err, result) => {
// // //       if (err) {
// // //         if (
// // //           err.name === "InvalidParameterException" &&
// // //           /could not be determined/i.test(err.message || "")
// // //         ) {
// // //           const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
// // //             (err.message || "").includes(a)
// // //           );
// // //           reject(
// // //             new SchemaMisconfiguredError(
// // //               missing
// // //                 ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
// // //                 : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
// // //             )
// // //           );
// // //           return;
// // //         }
// // //         reject(err);
// // //         return;
// // //       }
// // //       if (!result) {
// // //         reject(new Error("Signup failed"));
// // //         return;
// // //       }
// // //       resolve({
// // //         userSub: result.userSub,
// // //         username: result.user?.getUsername?.() || data.emailId,
// // //         codeDeliveryDetails: result.codeDeliveryDetails,
// // //         rawResult: result,
// // //       });
// // //     });
// // //   });
// // // };

// // // export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
// // //   return new Promise((resolve, reject) => {
// // //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// // //     cognitoUser.confirmRegistration(otp, true, (err, result) => {
// // //       if (err) {
// // //         reject(err);
// // //         return;
// // //       }
// // //       resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
// // //     });
// // //   });
// // // };

// // // export const resendOtp = async (email: string): Promise<unknown> => {
// // //   return new Promise((resolve, reject) => {
// // //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// // //     cognitoUser.resendConfirmationCode((err, result) => {
// // //       if (err) {
// // //         reject(err);
// // //         return;
// // //       }
// // //       resolve(result);
// // //     });
// // //   });
// // // };

// // // /* ---------------------------------------------------------------
// // //    SET PASSWORD (post-registration) — frontend + Cognito only, no backend.
// // //    register.ts signs candidates up with a random temporary password they
// // //    never see. Right after email OTP verification succeeds, we reuse
// // //    Cognito's built-in forgotPassword mechanism as a "set your first real
// // //    password" step: it emails a code to the same (already verified) address,
// // //    and confirmPassword() lets the candidate set the password they'll
// // //    actually log in with.
// // // --------------------------------------------------------------- */

// // // /** Step 1: ask Cognito to email a verification code so the candidate can set a real password. */
// // // export const triggerSetPassword = (email: string): Promise<unknown> => {
// // //   return new Promise((resolve, reject) => {
// // //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// // //     cognitoUser.forgotPassword({
// // //       onSuccess: (data) => resolve(data),
// // //       onFailure: (err) => reject(err),
// // //       // Some pool configs call this instead of onSuccess once the code is sent.
// // //       inputVerificationCode: (data) => resolve(data),
// // //     });
// // //   });
// // // };

// // // /** Step 2: candidate submits the emailed code + their chosen password. */
// // // export const confirmSetPassword = (
// // //   email: string,
// // //   code: string,
// // //   newPassword: string
// // // ): Promise<string> => {
// // //   return new Promise((resolve, reject) => {
// // //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// // //     cognitoUser.confirmPassword(code, newPassword, {
// // //       onSuccess: () => resolve("Password set successfully"),
// // //       onFailure: (err) => reject(err),
// // //     });
// // //   });
// // // };


// // import {
// //   CognitoUserPool,
// //   CognitoUser,
// //   CognitoUserAttribute,
// //   AuthenticationDetails,
// // } from "amazon-cognito-identity-js";
// // import type { ISignUpResult, CognitoUserSession } from "amazon-cognito-identity-js";

// // const poolData = {
// //   UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
// //   ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
// // };

// // export const userPool = new CognitoUserPool(poolData);

// // /** Shape of the fields we actually persist to Cognito (subset of the form's `data` state). */
// // export interface RegistrationFormData {
// //   applicantName: string;
// //   gender: string;
// //   isBiharDomicile: string;
// //   category: string;
// //   caste: string;
// //   isNonCreamyLayer: string;
// //   isPwD: string;
// //   natureOfDisability: string;
// //   isMin40PercentPwD: string;
// //   isExServiceman: string;
// //   /** ISO yyyy-mm-dd — blank if not applicable */
// //   serviceFromDate: string;
// //   /** ISO yyyy-mm-dd — blank if not applicable */
// //   serviceToDate: string;
// //   isNccCadet: string;
// //   nccCertificateNo: string;
// //   isBiharGovtEmployee: string;
// //   bsscAttempts: string;
// //   isContractualEmployee: string;
// //   nameOfPost: string;
// //   hasAgreement: string;
// //   /** ISO yyyy-mm-dd — blank if not applicable */
// //   contractualFromDate: string;
// //   /** ISO yyyy-mm-dd — blank if not applicable */
// //   contractualToDate: string;
// //   mobileNo: string;
// //   emailId: string;
// //   dobDay: string;
// //   dobMonth: string;
// //   dobYear: string;
// // }

// // export interface SendOtpResponse {
// //   userSub: string;
// //   username: string;
// //   codeDeliveryDetails?: unknown;
// //   rawResult: ISignUpResult;
// // }

// // export interface VerifyOtpResponse {
// //   status: string;
// //   message: string;
// // }

// // export interface DurationParts {
// //   years: number;
// //   months: number;
// //   days: number;
// // }

// // /**
// //  * Every custom attribute this app ever sends to Cognito.
// //  * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
// //  * as String / Mutable = true, or signUp() will throw InvalidParameterException with
// //  * "Type for attribute {custom:xxx} could not be determined".
// //  * Keep this list and the pool schema in sync — it's the single source of truth in code.
// //  */
// // const REQUIRED_CUSTOM_ATTRIBUTES = [
// //   "custom:bihar_domicile",
// //   "custom:mobile_no",
// //   "custom:category",
// //   "custom:caste",
// //   "custom:non_creamy_layer",
// //   "custom:is_pwd",
// //   "custom:disability_type",
// //   "custom:pwd_40_percent",
// //   "custom:ex_serviceman",
// //   "custom:service_period",
// //   "custom:ncc_cadet",
// //   "custom:ncc_cert_no",
// //   "custom:bihar_govt_emp",
// //   "custom:bssc_attempts",
// //   "custom:contractual_emp",
// //   "custom:post_name",
// //   "custom:has_agreement",
// //   "custom:contractual_period",
// // ] as const;

// // const pad2 = (v: string): string => v.padStart(2, "0");

// // /** true if all DOB parts are present and form a real calendar date */
// // const isValidDob = (day: string, month: string, year: string): boolean => {
// //   const d = parseInt(day, 10);
// //   const m = parseInt(month, 10);
// //   const y = parseInt(year, 10);
// //   if (!d || !m || !y) return false;
// //   const dt = new Date(y, m - 1, d);
// //   return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
// // };

// // /**
// //  * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
// //  * Returns null if either date is missing/invalid, or `to` is before `from`.
// //  * Shared by age-on-cutoff-date, service period, and contractual period calculations.
// //  */
// // export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
// //   if (!fromIso || !toIso) return null;
// //   const from = new Date(fromIso);
// //   const to = new Date(toIso);
// //   if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

// //   let years = to.getFullYear() - from.getFullYear();
// //   let months = to.getMonth() - from.getMonth();
// //   let days = to.getDate() - from.getDate();

// //   if (days < 0) {
// //     months -= 1;
// //     days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
// //   }
// //   if (months < 0) {
// //     years -= 1;
// //     months += 12;
// //   }
// //   return { years, months, days };
// // };

// // /** Formats a from/to date pair into the "0Y-0M-0D" string Cognito stores. Empty string if incomplete/invalid. */
// // const formatDurationAttribute = (fromIso: string, toIso: string): string => {
// //   const duration = calcDuration(fromIso, toIso);
// //   return duration ? `${duration.years}Y-${duration.months}M-${duration.days}D` : "";
// // };

// // /**
// //  * Maps form fields -> Cognito attributes.
// //  * Standard attributes are used where Cognito has a matching field
// //  * (email, name, gender, birthdate); everything else goes out as a
// //  * `custom:` attribute that must already exist in the pool schema.
// //  */
// // const buildAttributeList = (data: RegistrationFormData): CognitoUserAttribute[] => {
// //   const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
// //     ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
// //     : "";

// //   const attrs: Record<string, string> = {
// //     // standard attributes
// //     email: data.emailId,
// //     name: data.applicantName,
// //     gender: data.gender,
// //     birthdate,

// //     // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
// //     "custom:bihar_domicile": data.isBiharDomicile,
// //     "custom:mobile_no": data.mobileNo,
// //     "custom:category": data.category,
// //     "custom:caste": data.caste,
// //     "custom:non_creamy_layer": data.isNonCreamyLayer,
// //     "custom:is_pwd": data.isPwD,
// //     "custom:disability_type": data.natureOfDisability,
// //     "custom:pwd_40_percent": data.isMin40PercentPwD,
// //     "custom:ex_serviceman": data.isExServiceman,
// //     "custom:service_period": formatDurationAttribute(data.serviceFromDate, data.serviceToDate),
// //     "custom:ncc_cadet": data.isNccCadet,
// //     "custom:ncc_cert_no": data.nccCertificateNo,
// //     "custom:bihar_govt_emp": data.isBiharGovtEmployee,
// //     "custom:bssc_attempts": data.bsscAttempts,
// //     "custom:contractual_emp": data.isContractualEmployee,
// //     "custom:post_name": data.nameOfPost,
// //     "custom:has_agreement": data.hasAgreement,
// //     "custom:contractual_period": formatDurationAttribute(data.contractualFromDate, data.contractualToDate),
// //   };

// //   // Cognito rejects attributes sent as an empty string, so drop blanks
// //   // (this also means truly-optional fields like nccCertificateNo, or an
// //   // ex-serviceman date range that was never filled in, are fine unfilled).
// //   return Object.entries(attrs)
// //     .filter(([, value]) => value !== undefined && value !== null && value !== "")
// //     .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
// // };

// // /**
// //  * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
// //  * We turn it into something a developer can act on immediately, instead of
// //  * surfacing raw AWS text to the end user.
// //  */
// // class SchemaMisconfiguredError extends Error {
// //   constructor(message: string) {
// //     super(message);
// //     this.name = "SchemaMisconfiguredError";
// //   }
// // }

// // export const sendOtp = async (data: RegistrationFormData): Promise<SendOtpResponse> => {
// //   return new Promise((resolve, reject) => {
// //     const attributeList = buildAttributeList(data);

// //     // Cognito requires a password at signUp time even though candidates
// //     // only ever authenticate via the email OTP — this one is never shown
// //     // to the user and never reused.
// //     const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

// //     userPool.signUp(data.emailId, temporaryPassword, attributeList, [], (err, result) => {
// //       if (err) {
// //         if (
// //           err.name === "InvalidParameterException" &&
// //           /could not be determined/i.test(err.message || "")
// //         ) {
// //           const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
// //             (err.message || "").includes(a)
// //           );
// //           reject(
// //             new SchemaMisconfiguredError(
// //               missing
// //                 ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
// //                 : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
// //             )
// //           );
// //           return;
// //         }
// //         reject(err);
// //         return;
// //       }
// //       if (!result) {
// //         reject(new Error("Signup failed"));
// //         return;
// //       }
// //       resolve({
// //         userSub: result.userSub,
// //         username: result.user?.getUsername?.() || data.emailId,
// //         codeDeliveryDetails: result.codeDeliveryDetails,
// //         rawResult: result,
// //       });
// //     });
// //   });
// // };

// // export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
// //   return new Promise((resolve, reject) => {
// //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// //     cognitoUser.confirmRegistration(otp, true, (err, result) => {
// //       if (err) {
// //         reject(err);
// //         return;
// //       }
// //       resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
// //     });
// //   });
// // };

// // export const resendOtp = async (email: string): Promise<unknown> => {
// //   return new Promise((resolve, reject) => {
// //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// //     cognitoUser.resendConfirmationCode((err, result) => {
// //       if (err) {
// //         reject(err);
// //         return;
// //       }
// //       resolve(result);
// //     });
// //   });
// // };

// // /* ---------------------------------------------------------------
// //    SET PASSWORD (post-registration) — frontend + Cognito only, no backend.
// //    register.ts signs candidates up with a random temporary password they
// //    never see. Right after email OTP verification succeeds, we reuse
// //    Cognito's built-in forgotPassword mechanism as a "set your first real
// //    password" step: it emails a code to the same (already verified) address,
// //    and confirmPassword() lets the candidate set the password they'll
// //    actually log in with.
// // --------------------------------------------------------------- */

// // /** Step 1: ask Cognito to email a verification code so the candidate can set a real password. */
// // export const triggerSetPassword = (email: string): Promise<unknown> => {
// //   return new Promise((resolve, reject) => {
// //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// //     cognitoUser.forgotPassword({
// //       onSuccess: (data) => resolve(data),
// //       onFailure: (err) => reject(err),
// //       // Some pool configs call this instead of onSuccess once the code is sent.
// //       inputVerificationCode: (data) => resolve(data),
// //     });
// //   });
// // };

// // /** Step 2: candidate submits the emailed code + their chosen password. */
// // export const confirmSetPassword = (
// //   email: string,
// //   code: string,
// //   newPassword: string
// // ): Promise<string> => {
// //   return new Promise((resolve, reject) => {
// //     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
// //     cognitoUser.confirmPassword(code, newPassword, {
// //       onSuccess: () => resolve("Password set successfully"),
// //       onFailure: (err) => reject(err),
// //     });
// //   });
// // };

// // /* ---------------------------------------------------------------
// //    LOGIN — frontend + Cognito only, no backend.

// //    `username` is whatever the candidate types into the "Registration
// //    Number" field. This only resolves correctly if your Cognito User Pool
// //    has `preferred_username` enabled as a sign-in alias (Console -> User
// //    Pool -> Sign-in experience -> Cognito user pool sign-in options), AND
// //    `preferred_username` is set to the same value as `custom:registration_no`
// //    for each user. If that alias isn't configured yet, candidates need to
// //    log in with their email instead until it is.
// // --------------------------------------------------------------- */

// // export interface LoginSuccessResponse {
// //   status: "SUCCESS";
// //   idToken: string;
// //   accessToken: string;
// //   refreshToken: string;
// // }

// // export interface NewPasswordRequiredResponse {
// //   status: "NEW_PASSWORD_REQUIRED";
// //   cognitoUser: CognitoUser;
// //   userAttributes: Record<string, unknown>;
// // }

// // export type LoginResult = LoginSuccessResponse | NewPasswordRequiredResponse;

// // export const login = (username: string, password: string): Promise<LoginResult> => {
// //   return new Promise((resolve, reject) => {
// //     const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
// //     const authDetails = new AuthenticationDetails({ Username: username, Password: password });

// //     cognitoUser.authenticateUser(authDetails, {
// //       onSuccess: (session: CognitoUserSession) => {
// //         resolve({
// //           status: "SUCCESS",
// //           idToken: session.getIdToken().getJwtToken(),
// //           accessToken: session.getAccessToken().getJwtToken(),
// //           refreshToken: session.getRefreshToken().getToken(),
// //         });
// //       },
// //       onFailure: (err) => reject(err),
// //       // Only fires for accounts created via AdminCreateUser that never went
// //       // through the Set Password step — shouldn't normally happen for
// //       // candidates who registered through the form, but handled just in case.
// //       newPasswordRequired: (userAttributes) => {
// //         delete userAttributes.email_verified;
// //         delete userAttributes.phone_number_verified;
// //         resolve({ status: "NEW_PASSWORD_REQUIRED", cognitoUser, userAttributes });
// //       },
// //     });
// //   });
// // };

// // export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
// //   return new Promise((resolve, reject) => {
// //     const cognitoUser = userPool.getCurrentUser();
// //     if (!cognitoUser) {
// //       resolve(null);
// //       return;
// //     }
// //     cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
// //       if (err) {
// //         reject(err);
// //         return;
// //       }
// //       resolve(session);
// //     });
// //   });
// // };

// // export const logout = (): void => {
// //   userPool.getCurrentUser()?.signOut();
// // };


// import {
//   CognitoUserPool,
//   CognitoUser,
//   CognitoUserAttribute,
//   AuthenticationDetails,
// } from "amazon-cognito-identity-js";
// import type { ISignUpResult, CognitoUserSession } from "amazon-cognito-identity-js";

// const poolData = {
//   UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
//   ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
// };

// export const userPool = new CognitoUserPool(poolData);

// /** Shape of the fields we actually persist to Cognito (subset of the form's `data` state). */
// export interface RegistrationFormData {
//   applicantName: string;
//   gender: string;
//   isBiharDomicile: string;
//   category: string;
//   caste: string;
//   isNonCreamyLayer: string;
//   isPwD: string;
//   natureOfDisability: string;
//   isMin40PercentPwD: string;
//   isExServiceman: string;
//   /** ISO yyyy-mm-dd — blank if not applicable */
//   serviceFromDate: string;
//   /** ISO yyyy-mm-dd — blank if not applicable */
//   serviceToDate: string;
//   isNccCadet: string;
//   nccCertificateNo: string;
//   isBiharGovtEmployee: string;
//   bsscAttempts: string;
//   isContractualEmployee: string;
//   nameOfPost: string;
//   hasAgreement: string;
//   /** ISO yyyy-mm-dd — blank if not applicable */
//   contractualFromDate: string;
//   /** ISO yyyy-mm-dd — blank if not applicable */
//   contractualToDate: string;
//   mobileNo: string;
//   emailId: string;
//   dobDay: string;
//   dobMonth: string;
//   dobYear: string;
//   // Additional fields for new custom attributes
//   catCertAuthOth?: string;
//   officerType?: string;
//   catCertAuth?: string;
//   disTypePersist?: string;
//   disCertAuthOth?: string;
//   isScribeRequired?: string;
//   disCertAuth?: string;
//   categoryCertNo?: string;
//   disCertIssueDt?: string;
//   disabilityCertNo?: string;
//   registrationNumber?: string;
//   organizationName?: string;
//   registrationNo?: string;
//   hasPostExperience?: string;
//   catCertIssueDt?: string;

//   isOwnScribe?: string;
// }

// export interface SendOtpResponse {
//   userSub: string;
//   username: string;
//   codeDeliveryDetails?: unknown;
//   rawResult: ISignUpResult;
// }

// export interface VerifyOtpResponse {
//   status: string;
//   message: string;
// }

// export interface DurationParts {
//   years: number;
//   months: number;
//   days: number;
// }

// /**
//  * Every custom attribute this app ever sends to Cognito.
//  * MUST exist in the User Pool schema (Console -> Sign-up experience -> Custom attributes)
//  * as String / Mutable = true, or signUp() will throw InvalidParameterException with
//  * "Type for attribute {custom:xxx} could not be determined".
//  * Keep this list and the pool schema in sync — it's the single source of truth in code.
//  */
// const REQUIRED_CUSTOM_ATTRIBUTES = [
//   "custom:non_creamy_layer",
//   "custom:contractual_emp",
//   "custom:bihar_domicile",
//   "custom:cat_cert_auth_oth",
//   "custom:disability_type",
//   "custom:is_pwd",
//   "custom:post_name",
//   "custom:officer_type",
//   "custom:cat_cert_auth",
//   "custom:ex_serviceman",
//   "custom:bihar_govt_emp",
//   "custom:bssc_attempts",
//   "custom:pwd_40_percent",
//   "custom:dis_type_persist",
//   "custom:dis_cert_auth_oth",
//   "custom:is_scribe_required",
//   "custom:dis_cert_auth",
//   "custom:caste",
//   "custom:mobile_no",
//   "custom:category_cert_no",
//   "custom:has_agreement",
//   "custom:dis_cert_issue_dt",
//   "custom:disability_cert_no",
//   "custom:registration_number",
//   "custom:service_period",
//   "custom:category",
//   "custom:organization_name",
//   "custom:contractual_period",
//   "custom:registration_no",
//   "custom:has_post_experience",
//   "custom:cat_cert_issue_dt",

//   // Added missing attributes below based on your list:
//   "custom:serviceFromDate",
//   "custom:serviceToDate",
//   "custom:contractualFromDate",
//   "custom:contractualToDate",
//   "custom:isownscribe",
// ] as const;

// const pad2 = (v: string): string => v.padStart(2, "0");

// /** true if all DOB parts are present and form a real calendar date */
// const isValidDob = (day: string, month: string, year: string): boolean => {
//   const d = parseInt(day, 10);
//   const m = parseInt(month, 10);
//   const y = parseInt(year, 10);
//   if (!d || !m || !y) return false;
//   const dt = new Date(y, m - 1, d);
//   return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
// };

// /**
//  * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
//  * Returns null if either date is missing/invalid, or `to` is before `from`.
//  * Shared by age-on-cutoff-date, service period, and contractual period calculations.
//  */
// export const calcDuration = (fromIso: string, toIso: string): DurationParts | null => {
//   if (!fromIso || !toIso) return null;
//   const from = new Date(fromIso);
//   const to = new Date(toIso);
//   if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) return null;

//   let years = to.getFullYear() - from.getFullYear();
//   let months = to.getMonth() - from.getMonth();
//   let days = to.getDate() - from.getDate();

//   if (days < 0) {
//     months -= 1;
//     days += new Date(to.getFullYear(), to.getMonth(), 0).getDate();
//   }
//   if (months < 0) {
//     years -= 1;
//     months += 12;
//   }
//   return { years, months, days };
// };

// /** Formats a from/to date pair into the "0Y-0M-0D" string Cognito stores. Empty string if incomplete/invalid. */
// const formatDurationAttribute = (fromIso: string, toIso: string): string => {
//   const duration = calcDuration(fromIso, toIso);
//   return duration ? `${duration.years}Y-${duration.months}M-${duration.days}D` : "";
// };

// /**
//  * Maps form fields -> Cognito attributes.
//  * Standard attributes are used where Cognito has a matching field
//  * (email, name, gender, birthdate); everything else goes out as a
//  * `custom:` attribute that must already exist in the pool schema.
//  */
// const buildAttributeList = (data: RegistrationFormData): CognitoUserAttribute[] => {
//   const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
//     ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
//     : "";

//   const attrs: Record<string, string> = {
//     // standard attributes
//     email: data.emailId,
//     name: data.applicantName,
//     gender: data.gender,
//     birthdate,

//     // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
//     "custom:non_creamy_layer": data.isNonCreamyLayer,
//     "custom:contractual_emp": data.isContractualEmployee,
//     "custom:bihar_domicile": data.isBiharDomicile,
//     "custom:cat_cert_auth_oth": data.catCertAuthOth || "",
//     "custom:disability_type": data.natureOfDisability,
//     "custom:is_pwd": data.isPwD,
//     "custom:post_name": data.nameOfPost,
//     "custom:officer_type": data.officerType || "",
//     "custom:cat_cert_auth": data.catCertAuth || "",
//     "custom:ex_serviceman": data.isExServiceman,
//     "custom:bihar_govt_emp": data.isBiharGovtEmployee,
//     "custom:bssc_attempts": data.bsscAttempts,
//     "custom:pwd_40_percent": data.isMin40PercentPwD,
//     "custom:dis_type_persist": data.disTypePersist || "",
//     "custom:dis_cert_auth_oth": data.disCertAuthOth || "",
//     "custom:is_scribe_required": data.isScribeRequired || "",
//     "custom:dis_cert_auth": data.disCertAuth || "",
//     "custom:caste": data.caste,
//     "custom:mobile_no": data.mobileNo,
//     "custom:category_cert_no": data.categoryCertNo || "",
//     "custom:has_agreement": data.hasAgreement,
//     "custom:dis_cert_issue_dt": data.disCertIssueDt || "",
//     "custom:disability_cert_no": data.disabilityCertNo || "",
//     "custom:registration_number": data.registrationNumber || "",
//     "custom:service_period": formatDurationAttribute(data.serviceFromDate, data.serviceToDate),
//     "custom:category": data.category,
//     "custom:organization_name": data.organizationName || "",
//     "custom:contractual_period": formatDurationAttribute(data.contractualFromDate, data.contractualToDate),
//     "custom:registration_no": data.registrationNo || "",
//     "custom:has_post_experience": data.hasPostExperience || "",
//     "custom:cat_cert_issue_dt": data.catCertIssueDt || "",

//     // Added missing attributes below based on your list:

//     "custom:serviceFromDate": data.serviceFromDate || "",
//     "custom:serviceToDate": data.serviceToDate || "",
//     "custom:contractualFromDate": data.contractualFromDate || "",
//     "custom:contractualToDate": data.contractualToDate || "",
//     "custom:isownscribe": data.isOwnScribe || "",

    
//   };

//   // Cognito rejects attributes sent as an empty string, so drop blanks
//   // (this also means truly-optional fields are fine unfilled).
//   return Object.entries(attrs)
//     .filter(([, value]) => value !== undefined && value !== null && value !== "")
//     .map(([Name, Value]) => new CognitoUserAttribute({ Name, Value: String(Value) }));
// };

// /**
//  * A misconfigured pool (missing custom attribute) produces a cryptic AWS error.
//  * We turn it into something a developer can act on immediately, instead of
//  * surfacing raw AWS text to the end user.
//  */
// class SchemaMisconfiguredError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "SchemaMisconfiguredError";
//   }
// }

// export const sendOtp = async (data: RegistrationFormData): Promise<SendOtpResponse> => {
//   return new Promise((resolve, reject) => {
//     const attributeList = buildAttributeList(data);

//     // Cognito requires a password at signUp time even though candidates
//     // only ever authenticate via the email OTP — this one is never shown
//     // to the user and never reused.
//     const temporaryPassword = Math.random().toString(36).slice(-16) + "@Temp123";

//     userPool.signUp(data.emailId, temporaryPassword, attributeList, [], (err, result) => {
//       if (err) {
//         if (
//           err.name === "InvalidParameterException" &&
//           /could not be determined/i.test(err.message || "")
//         ) {
//           const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
//             (err.message || "").includes(a)
//           );
//           reject(
//             new SchemaMisconfiguredError(
//               missing
//                 ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
//                 : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console."
//             )
//           );
//           return;
//         }
//         reject(err);
//         return;
//       }
//       if (!result) {
//         reject(new Error("Signup failed"));
//         return;
//       }
//       resolve({
//         userSub: result.userSub,
//         username: result.user?.getUsername?.() || data.emailId,
//         codeDeliveryDetails: result.codeDeliveryDetails,
//         rawResult: result,
//       });
//     });
//   });
// };

// export const verifyOtp = async (email: string, otp: string): Promise<VerifyOtpResponse> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.confirmRegistration(otp, true, (err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve({ status: result || "SUCCESS", message: "Email verified successfully" });
//     });
//   });
// };

// export const resendOtp = async (email: string): Promise<unknown> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.resendConfirmationCode((err, result) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(result);
//     });
//   });
// };

// /* ---------------------------------------------------------------
//    SET PASSWORD (post-registration) — frontend + Cognito only, no backend.
//    register.ts signs candidates up with a random temporary password they
//    never see. Right after email OTP verification succeeds, we reuse
//    Cognito's built-in forgotPassword mechanism as a "set your first real
//    password" step: it emails a code to the same (already verified) address,
//    and confirmPassword() lets the candidate set the password they'll
//    actually log in with.
// --------------------------------------------------------------- */

// /** Step 1: ask Cognito to email a verification code so the candidate can set a real password. */
// export const triggerSetPassword = (email: string): Promise<unknown> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.forgotPassword({
//       onSuccess: (data) => resolve(data),
//       onFailure: (err) => reject(err),
//       // Some pool configs call this instead of onSuccess once the code is sent.
//       inputVerificationCode: (data) => resolve(data),
//     });
//   });
// };

// /** Step 2: candidate submits the emailed code + their chosen password. */
// export const confirmSetPassword = (
//   email: string,
//   code: string,
//   newPassword: string
// ): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
//     cognitoUser.confirmPassword(code, newPassword, {
//       onSuccess: () => resolve("Password set successfully"),
//       onFailure: (err) => reject(err),
//     });
//   });
// };

// /* ---------------------------------------------------------------
//    LOGIN — frontend + Cognito only, no backend.

//    `username` is whatever the candidate types into the "Registration
//    Number" field. This only resolves correctly if your Cognito User Pool
//    has `preferred_username` enabled as a sign-in alias (Console -> User
//    Pool -> Sign-in experience -> Cognito user pool sign-in options), AND
//    `preferred_username` is set to the same value as `custom:registration_no`
//    for each user. If that alias isn't configured yet, candidates need to
//    log in with their email instead until it is.
// --------------------------------------------------------------- */

// export interface LoginSuccessResponse {
//   status: "SUCCESS";
//   idToken: string;
//   accessToken: string;
//   refreshToken: string;
// }

// export interface NewPasswordRequiredResponse {
//   status: "NEW_PASSWORD_REQUIRED";
//   cognitoUser: CognitoUser;
//   userAttributes: Record<string, unknown>;
// }

// export type LoginResult = LoginSuccessResponse | NewPasswordRequiredResponse;

// export const login = (username: string, password: string): Promise<LoginResult> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
//     const authDetails = new AuthenticationDetails({ Username: username, Password: password });

//     cognitoUser.authenticateUser(authDetails, {
//       onSuccess: (session: CognitoUserSession) => {
//         resolve({
//           status: "SUCCESS",
//           idToken: session.getIdToken().getJwtToken(),
//           accessToken: session.getAccessToken().getJwtToken(),
//           refreshToken: session.getRefreshToken().getToken(),
//         });
//       },
//       onFailure: (err) => reject(err),
//       // Only fires for accounts created via AdminCreateUser that never went
//       // through the Set Password step — shouldn't normally happen for
//       // candidates who registered through the form, but handled just in case.
//       newPasswordRequired: (userAttributes) => {
//         delete userAttributes.email_verified;
//         delete userAttributes.phone_number_verified;
//         resolve({ status: "NEW_PASSWORD_REQUIRED", cognitoUser, userAttributes });
//       },
//     });
//   });
// };

// export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
//   return new Promise((resolve, reject) => {
//     const cognitoUser = userPool.getCurrentUser();
//     if (!cognitoUser) {
//       resolve(null);
//       return;
//     }
//     cognitoUser.getSession((err: Error | null, session: CognitoUserSession | null) => {
//       if (err) {
//         reject(err);
//         return;
//       }
//       resolve(session);
//     });
//   });
// };

// export const logout = (): void => {
//   userPool.getCurrentUser()?.signOut();
// };



//this is my current 


import {
  CognitoUserPool,
  CognitoUser,
  CognitoUserAttribute,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";
import type {
  ISignUpResult,
  CognitoUserSession,
} from "amazon-cognito-identity-js";

const poolData = {
  UserPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  ClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
};

console.log("pool data", poolData)

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
  // Additional fields for new custom attributes
  catCertAuthOth?: string;
  officerType?: string;
  catCertAuth?: string;
  disTypePersist?: string;
  disCertAuthOth?: string;
  isScribeRequired?: string;
  disCertAuth?: string;
  categoryCertNo?: string;
  disCertIssueDt?: string;
  disabilityCertNo?: string;
  registrationNumber?: string;
  organizationName?: string;
  registrationNo?: string;
  hasPostExperience?: string;
  catCertIssueDt?: string;

  isOwnScribe?: string;

  experienceCertificate?: string;
  agreementCopy?: string;
  declaration: boolean;
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
  "custom:non_creamy_layer",
  "custom:contractual_emp",
  "custom:bihar_domicile",
  "custom:cat_cert_auth_oth",
  "custom:disability_type",
  "custom:is_pwd",
  "custom:post_name",
  "custom:officer_type",
  "custom:cat_cert_auth",
  "custom:ex_serviceman",
  "custom:bihar_govt_emp",
  "custom:bssc_attempts",
  "custom:pwd_40_percent",
  "custom:dis_type_persist",
  "custom:dis_cert_auth_oth",
  "custom:is_scribe_required",
  "custom:dis_cert_auth",
  "custom:caste",
  // "custom:mobile_no",
  "custom:category_cert_no",
  "custom:has_agreement",
  "custom:dis_cert_issue_dt",
  "custom:disability_cert_no",
  "custom:registration_number",
  "custom:service_period",
  "custom:category",
  "custom:organization_name",
  "custom:contractual_period",
  "custom:registration_no",
  "custom:has_post_experience",
  "custom:cat_cert_issue_dt",

  // Added missing attributes below based on your list:
  "custom:serviceFromDate",
  "custom:serviceToDate",
  "custom:contractualFromDate",
  "custom:contractualToDate",
  "custom:isownscribe",
] as const;

const pad2 = (v: string): string => v.padStart(2, "0");

/** true if all DOB parts are present and form a real calendar date */
const isValidDob = (day: string, month: string, year: string): boolean => {
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (!d || !m || !y) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
};

/**
 * Calendar-accurate Y/M/D difference between two ISO (yyyy-mm-dd) dates.
 * Returns null if either date is missing/invalid, or `to` is before `from`.
 * Shared by age-on-cutoff-date, service period, and contractual period calculations.
 */
export const calcDuration = (
  fromIso: string,
  toIso: string,
): DurationParts | null => {
  if (!fromIso || !toIso) return null;
  const from = new Date(fromIso);
  const to = new Date(toIso);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from)
    return null;

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
  return duration
    ? `${duration.years}Y-${duration.months}M-${duration.days}D`
    : "";
};

/**
 * Formats a 10-digit Indian mobile number into E.164 (+91XXXXXXXXXX) for the
 * Cognito `phone_number` standard attribute. Cognito requires E.164 format
 * for phone_number, and will send the SMS OTP to this number when
 * `getAttributeVerificationCode('phone_number', ...)` is called.
 */
const toE164 = (mobileNo: string): string => (mobileNo ? `+91${mobileNo}` : "");

/**
 * Maps form fields -> Cognito attributes.
 * Standard attributes are used where Cognito has a matching field
 * (email, name, gender, birthdate, phone_number); everything else goes out
 * as a `custom:` attribute that must already exist in the pool schema.
 */
const buildAttributeList = (
  data: RegistrationFormData,
): CognitoUserAttribute[] => {
  const birthdate = isValidDob(data.dobDay, data.dobMonth, data.dobYear)
    ? `${data.dobYear}-${pad2(data.dobMonth)}-${pad2(data.dobDay)}`
    : "";

  const attrs: Record<string, string> = {
    // standard attributes
    email: data.emailId,
    name: data.applicantName,
    gender: data.gender,
    birthdate,
    // NOTE: phone_number must be a "String" standard attribute, mutable,
    // and NOT set to auto-verified at signup — otherwise Cognito will
    // consider it already verified and getAttributeVerificationCode()
    // for phone_number will be a no-op / error. See Console -> Sign-up
    // experience -> Attribute verification and user account confirmation.
    phone_number: toE164(data.mobileNo),

    // custom attributes — keys here must exactly match REQUIRED_CUSTOM_ATTRIBUTES
    "custom:non_creamy_layer": data.isNonCreamyLayer,
    "custom:contractual_emp": data.isContractualEmployee,
    "custom:bihar_domicile": data.isBiharDomicile,
    "custom:cat_cert_auth_oth": data.catCertAuthOth || "",
    "custom:disability_type": data.natureOfDisability,
    "custom:is_pwd": data.isPwD,
    "custom:post_name": data.nameOfPost,
    "custom:officer_type": data.officerType || "",
    "custom:cat_cert_auth": data.catCertAuth || "",
    "custom:ex_serviceman": data.isExServiceman,
    "custom:bihar_govt_emp": data.isBiharGovtEmployee,
    "custom:bssc_attempts": data.bsscAttempts,
    "custom:pwd_40_percent": data.isMin40PercentPwD,
    "custom:dis_type_persist": data.disTypePersist || "",
    "custom:dis_cert_auth_oth": data.disCertAuthOth || "",
    "custom:is_scribe_required": data.isScribeRequired || "",
    "custom:dis_cert_auth": data.disCertAuth || "",
    "custom:caste": data.caste,
    // "custom:mobile_no": data.mobileNo,
    "custom:category_cert_no": data.categoryCertNo || "",
    "custom:has_agreement": data.hasAgreement,
    "custom:dis_cert_issue_dt": data.disCertIssueDt || "",
    "custom:disability_cert_no": data.disabilityCertNo || "",
    "custom:registration_number": data.registrationNumber || "",
    "custom:service_period": formatDurationAttribute(
      data.serviceFromDate,
      data.serviceToDate,
    ),
    "custom:category": data.category,
    "custom:organization_name": data.organizationName || "",
    "custom:contractual_period": formatDurationAttribute(
      data.contractualFromDate,
      data.contractualToDate,
    ),
    "custom:registration_no": data.registrationNo || "",
    "custom:has_post_experience": data.hasPostExperience || "",
    "custom:cat_cert_issue_dt": data.catCertIssueDt || "",

    // Added missing attributes below based on your list:

    "custom:serviceFromDate": data.serviceFromDate || "",
    "custom:serviceToDate": data.serviceToDate || "",
    "custom:contractualFromDate": data.contractualFromDate || "",
    "custom:contractualToDate": data.contractualToDate || "",
    "custom:isownscribe": data.isOwnScribe || "",
  };

  // Cognito rejects attributes sent as an empty string, so drop blanks
  // (this also means truly-optional fields are fine unfilled).
  return Object.entries(attrs)
    .filter(
      ([, value]) => value !== undefined && value !== null && value !== "",
    )
    .map(
      ([Name, Value]) =>
        new CognitoUserAttribute({ Name, Value: String(Value) }),
    );
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

/**
 * Creates the Cognito user and triggers the email OTP.
 *
 * CHANGED: no longer generates a random, invisible temporary password.
 * The candidate's own chosen `password` (collected on the registration
 * form, validated client-side for length/complexity) is now sent directly
 * to signUp() and becomes their real, permanent login password. There is
 * no separate "set password" step anymore.
 */
export const sendOtp = async (
  data: RegistrationFormData,
  password: string,
): Promise<SendOtpResponse> => {
  return new Promise((resolve, reject) => {
    const attributeList = buildAttributeList(data);

    userPool.signUp(
      data.emailId,
      password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          if (
            err.name === "InvalidParameterException" &&
            /could not be determined/i.test(err.message || "")
          ) {
            const missing = REQUIRED_CUSTOM_ATTRIBUTES.find((a) =>
              (err.message || "").includes(a),
            );
            reject(
              new SchemaMisconfiguredError(
                missing
                  ? `The Cognito User Pool is missing the custom attribute "${missing}". Add it in the AWS Console (Sign-up experience → Custom attributes) as String/Mutable, then try again.`
                  : "The Cognito User Pool schema is missing one or more custom attributes this form sends. Check Sign-up experience → Custom attributes in the AWS Console.",
              ),
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
      },
    );
  });
};

export const verifyOtp = async (
  email: string,
  otp: string,
): Promise<VerifyOtpResponse> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmRegistration(otp, true, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({
        status: result || "SUCCESS",
        message: "Email verified successfully",
      });
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

/* ---------------------------------------------------------------
   AUTHENTICATE RIGHT AFTER EMAIL VERIFICATION
   Needed because phone_number attribute-verification calls
   (getAttributeVerificationCode / verifyAttribute) require an
   authenticated session on the CognitoUser instance. We call this
   immediately after confirmRegistration() succeeds, using the same
   real password the candidate just chose on the form.
--------------------------------------------------------------- */
export const authenticateAndGetUser = (
  email: string,
  password: string,
): Promise<CognitoUser> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: email,
      Password: password,
    });
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: () => resolve(cognitoUser), // session is now cached on this instance
      onFailure: (err) => reject(err),
      newPasswordRequired: () =>
        reject(
          new Error(
            "Unexpected NEW_PASSWORD_REQUIRED during registration login",
          ),
        ),
    });
  });
};

/* ---------------------------------------------------------------
   MOBILE (phone_number) VERIFICATION — Cognito attribute-verification
   flow. Distinct from the signUp/confirmRegistration flow used for email.
   Requires an authenticated CognitoUser (see authenticateAndGetUser above).
--------------------------------------------------------------- */

/** Step 1: ask Cognito to SMS an OTP code to the phone_number already on the account. */
export const sendMobileOtp = (cognitoUser: CognitoUser): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    cognitoUser.getAttributeVerificationCode("phone_number", {
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
    });
  });
};

/** Step 2: candidate submits the SMS code to confirm phone_number_verified = true. */
export const verifyMobileOtp = (
  cognitoUser: CognitoUser,
  code: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    cognitoUser.verifyAttribute("phone_number", code, {
      onSuccess: () => resolve("Mobile verified"),
      onFailure: (err) => reject(err),
    });
  });
};

/* ---------------------------------------------------------------
   SET PASSWORD (legacy / kept for a possible future "forgot password"
   page). No longer used by the registration flow — registration now
   collects the real password up front and signs up with it directly.
   Left here, unused by the registration form, in case a separate
   "forgot password" screen wants to reuse this Cognito mechanism.
--------------------------------------------------------------- */

/** Ask Cognito to email a verification code so the user can set/reset a password. */
export const triggerSetPassword = (email: string): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.forgotPassword({
      onSuccess: (data) => resolve(data),
      onFailure: (err) => reject(err),
      inputVerificationCode: (data) => resolve(data),
    });
  });
};

/** Confirm the emailed code + new password. */
export const confirmSetPassword = (
  email: string,
  code: string,
  newPassword: string,
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });
    cognitoUser.confirmPassword(code, newPassword, {
      onSuccess: () => resolve("Password set successfully"),
      onFailure: (err) => reject(err),
    });
  });
};

/* ---------------------------------------------------------------
   LOGIN — frontend + Cognito only, no backend.

   `username` is whatever the candidate types into the "Registration
   Number" field. This only resolves correctly if your Cognito User Pool
   has `preferred_username` enabled as a sign-in alias (Console -> User
   Pool -> Sign-in experience -> Cognito user pool sign-in options), AND
   `preferred_username` is set to the same value as `custom:registration_no`
   for each user. If that alias isn't configured yet, candidates need to
   log in with their email instead until it is.
--------------------------------------------------------------- */

export interface LoginSuccessResponse {
  status: "SUCCESS";
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface NewPasswordRequiredResponse {
  status: "NEW_PASSWORD_REQUIRED";
  cognitoUser: CognitoUser;
  userAttributes: Record<string, unknown>;
}

export type LoginResult = LoginSuccessResponse | NewPasswordRequiredResponse;

export const login = (
  username: string,
  password: string,
): Promise<LoginResult> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = new CognitoUser({ Username: username, Pool: userPool });
    const authDetails = new AuthenticationDetails({
      Username: username,
      Password: password,
    });

    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (session: CognitoUserSession) => {
        resolve({
          status: "SUCCESS",
          idToken: session.getIdToken().getJwtToken(),
          accessToken: session.getAccessToken().getJwtToken(),
          refreshToken: session.getRefreshToken().getToken(),
        });
      },
      onFailure: (err) => reject(err),
      // Only fires for accounts created via AdminCreateUser that never went
      // through a set-password step — shouldn't normally happen for
      // candidates who registered through the form, but handled just in case.
      newPasswordRequired: (userAttributes) => {
        delete userAttributes.email_verified;
        delete userAttributes.phone_number_verified;
        resolve({
          status: "NEW_PASSWORD_REQUIRED",
          cognitoUser,
          userAttributes,
        });
      },
    });
  });
};

export const getCurrentSession = (): Promise<CognitoUserSession | null> => {
  return new Promise((resolve, reject) => {
    const cognitoUser = userPool.getCurrentUser();
    if (!cognitoUser) {
      resolve(null);
      return;
    }
    cognitoUser.getSession(
      (err: Error | null, session: CognitoUserSession | null) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(session);
      },
    );
  });
};

export const logout = (): void => {
  userPool.getCurrentUser()?.signOut();
};