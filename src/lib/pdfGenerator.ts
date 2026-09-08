// import { jsPDF } from "jspdf";

// interface AddressData {
//   village: string;
//   postOffice: string;
//   policeStation: string;
//   district: string;
//   state: string;
//   pinCode: string;
// }

// interface EducationRow {
//   subject: string;
//   board: string;
//   total: number | string;
//   obtained: number | string;
//   percentage: string;
//   passingDate: string;
//   certNo: string;
// }

// interface EducationData {
//   tenth: EducationRow;
//   twelfth: EducationRow;
//   graduation: EducationRow;
// }

// interface DisabilityDetails {
//   nature: string;
//   min40Percent: string;
//   certNo: string;
//   issueDate: string;
//   authority: string;
//   scribeRequired: string;
// }

// interface PaymentDetails {
//   bank: string;
//   transactionId: string;
//   transactionDate: string;
//   registrationFee: string;
// }

// interface SlipData {
//   registrationNumber: string;
//   formNumber: string;
//   fullName: string;
//   fatherName: string;
//   motherName: string;
//   gender: string;
//   mobileNo: string;
//   emailId: string;
//   dateOfBirth: string;
//   age: string;
//   nationality: string;
//   category: string;
//   caste: string;
//   isNonCreamyLayer: string;
//   categoryCertNo: string;
//   categoryIssueDate: string;
//   categoryAuthority: string;
//   domicileOfBihar: string;
//   domicileCertNo: string;
//   domicileIssueDate: string;
//   domicileAuthority: string;
//   disability: string;
//   disabilityDetails: DisabilityDetails | null;
//   hasAadharCard: string;
//   aadharCardNumber: string;
//   idProofType: string;
//   idProofNo: string;
//   biharGovtEmployee: string;
//   numberOfAttempts: string;
//   contractualEmployee: string;
//   nameOfPost: string;
//   agreementCircular: string;
//   contractualPeriod: string | null;
//   departmentName: string;
//   officeOrderNo: string;
//   identificationMark: string;
//   exServiceman: string;
//   wardOfFreedomFighter: string;
//   isDebarred: string;
//   correspondenceAddress: AddressData;
//   permanentAddress: AddressData;
//   sameAsPermanent: boolean;
//   education: EducationData;
//   payment: PaymentDetails;
//   photograph: string | null;
//   signatureEnglish: string | null;
//   signatureHindi: string | null;
//   livePhoto: string | null;
//   declarationDate: string;
// }

// // ============================================================
// // API Response types (subset needed for the PDF)
// //
// // IMPORTANT: the real API splits the "personal details" data across TWO
// // step objects, not one:
// //   - steps.step0  -> fullName, gender, mobileNo, emailId, dateOfBirth,
// //                      category, caste, disability details, employment
// //                      details, contractual details, etc.
// //   - steps.step1  -> fatherName, motherName, nationality, aadhar,
// //                      ID-proof, identification marks, ward-of-freedom-
// //                      fighter, isDebarred, and BOTH addresses.
// // The previous version of this file read almost everything from step1
// // only, which is why most personal-details fields printed as "-".
// // ============================================================

// interface ApiStep0 {
//   fullName?: string;
//   gender?: string;
//   mobileNo?: string;
//   mobileNumber?: string;
//   emailId?: string;
//   dateOfBirth?: string;
//   category?: string;
//   caste?: string;
//   isNonCreamyLayer?: string;
//   nonCreamyLayer?: string;
//   categoryCertNo?: string;
//   categoryCertificateNumber?: string;
//   categoryIssueDate?: string;
//   categoryAuthority?: string;
//   domicileOfBihar?: string;
//   domicileCertificateNumber?: string;
//   domicileCertificateIssueDate?: string;
//   domicileCertificateAuthority?: string;
//   disability?: string;
//   natureOfDisability?: string;
//   pwd40Percent?: string;
//   disabilityCertNo?: string;
//   pwdCertificateNumber?: string;
//   disabilityIssueDate?: string;
//   disabilityAuthority?: string;
//   isScribeRequired?: string;
//   biharGovtEmployee?: string;
//   numberOfAttempts?: string;
//   bsscAttempts?: string;
//   contractualEmployee?: string;
//   nameOfPost?: string;
//   agreementCircular?: string;
//   contractualFromDate?: string;
//   contractualToDate?: string;
//   organizationName?: string;
//   departmentName?: string;
//   officeOrderNo?: string;
//   exServiceman?: string;
// }

// interface ApiStep1 {
//   fatherName?: string;
//   motherName?: string;
//   nationality?: string;
//   hasAadharCard?: string;
//   aadharCardNumber?: string;
//   typeOfPhotoIdProof?: string;
//   idProofNo?: string;
//   identificationMarkEn?: string;
//   identificationMarkEn2?: string;
//   wardOfFreedomFighter?: string;
//   isDebarred?: string;
//   corrVillage?: string;
//   corrPostOffice?: string;
//   corrPoliceStation?: string;
//   corrDistrict?: string;
//   corrState?: string;
//   corrPinCode?: string;
//   permVillage?: string;
//   permPostOffice?: string;
//   permPoliceStation?: string;
//   permDistrict?: string;
//   permState?: string;
//   permPinCode?: string;
//   sameAsPermanent?: boolean;
//   // Domicile-certificate issue date sometimes only arrives split into
//   // day/month/year parts here, rather than as a single formatted string
//   // in step0.
//   domicileIssueDateDay?: string;
//   domicileIssueDateMonth?: string;
//   domicileIssueDateYear?: string;
// }

// interface ApiEducationRowRaw {
//   subject?: string;
//   boardUniversity?: string;
//   totalMarks?: string | number;
//   obtainedMarks?: string | number;
//   marksObtained?: string | number; // actual API field name
//   certIssueDate?: string;
//   certNumber?: string;
//   level?: string; // e.g. "matriculation" | "intermediate" | "graduation"
//   degree?: string; // e.g. "10th" | "12th"
// }

// interface ApiStep3 {
//   // Legacy/expected flat shape (kept for backward compatibility)
//   tenth?: ApiEducationRowRaw;
//   twelfth?: ApiEducationRowRaw;
//   graduation?: ApiEducationRowRaw;
//   // Actual API shape: nested one level deeper, under `qualification`
//   // (singular), keyed by tenth/twelfth/graduation.
//   qualification?: {
//     tenth?: ApiEducationRowRaw;
//     twelfth?: ApiEducationRowRaw;
//     graduation?: ApiEducationRowRaw;
//   };
//   // Alternate shape sometimes seen: a flat list of qualifications,
//   // identified by `level`/`degree`.
//   qualifications?: ApiEducationRowRaw[];
// }

// interface ApiStep4 {
//   photograph?: string;
//   signatureEnglish?: string;
//   signatureHindi?: string;
// }

// interface ApiStep5 {
//   livePhoto?: string;
// }

// interface ApiPayment {
//   // Legacy/expected field names (kept for backward compatibility)
//   paymentBank?: string;
//   transactionDate?: string;
//   registrationFee?: string;
//   // Actual API field names (found under steps.step2)
//   bankName?: string;
//   amount?: number | string;
//   paymentMode?: string;
//   paymentStatus?: string;
//   paymentOrderId?: string;
//   transactionId?: string;
// }

// interface ApiCandidateDetails {
//   registrationNumber?: string;
//   gender?: string;
//   mobileNumber?: string;
//   // Backend-computed compact duration strings, e.g. "3Y-11M-1D"
//   contractualPeriod?: string;
//   servicePeriod?: string;
// }

// interface ApiData {
//   applicationId?: string;
//   candidateId?: string;
//   candidateDetails?: ApiCandidateDetails;
//   submissionDate?: string; // actual API: top-level ISO timestamp, used as a payment-date fallback
//   steps?: {
//     step0?: ApiStep0;
//     step1?: ApiStep1;
//     step2?: ApiPayment; // actual API: payment details live here
//     step3?: ApiStep3;
//     step4?: ApiStep4;
//     step5?: ApiStep5;
//     payment?: ApiPayment; // legacy/expected location, kept for backward compatibility
//   };
// }

// interface PDFOptions {
//   save?: boolean;
// }

// // ============================================================
// // LAYOUT CONSTANTS
// // ============================================================

// const PAGE_W = 210;
// const PAGE_H = 297;
// const MARGIN = 10;
// const CONTENT_W = PAGE_W - MARGIN * 2;
// const LABEL_W = 78;
// const FOOTER_SPACE = 8;

// // Path to your real logo file, served from the app's public folder
// // (e.g. public/logo.png -> "/logo.png"). Change this if your file lives
// // somewhere else or has a different name/extension.
// const LOGO_URL = "/logo.webp";

// const PHOTO_W = 26;
// const PHOTO_H = 17;
// const PHOTO_GAP = 1.5;
// const PHOTO_PANEL_TOTAL_H = PHOTO_H * 4 + PHOTO_GAP * 3; // default/minimum panel height
// const PHOTO_INSET = PHOTO_W + 2; // reserved on the right of rows drawn beside the photo panel

// // ---- Watermark tuning (logo-as-watermark on every page) ----
// const WATERMARK_SIZE = 130; // mm, square footprint of the watermark logo
// const WATERMARK_OPACITY = 0.08; // 0 = invisible, 1 = fully opaque

// // ============================================================
// // HELPERS
// // ============================================================

// const fmtDMY = (s: string | undefined): string => (s && s !== "0" ? s : "-");

// const fmtISOToDMY = (s: string | undefined): string => {
//   if (!s) return "-";
//   const [y, m, d] = s.split("-");
//   if (!y || !m || !d) return s;
//   return `${d}-${m}-${y}`;
// };

// // Education cert-issue dates from the actual API come back as DD-MM-YYYY
// // (e.g. "17-10-2015"), not ISO (YYYY-MM-DD). This detects which format was
// // given (by checking whether the first segment is a 4-digit year) and only
// // converts when it's genuinely ISO, so DD-MM-YYYY values pass through
// // unchanged instead of being flipped backwards.
// const fmtEduDate = (s: string | undefined): string => {
//   if (!s || s === "0") return "-";
//   const parts = s.split("-");
//   if (parts.length !== 3) return s;
//   const [a, b, c] = parts;
//   if (a.length === 4) {
//     // ISO yyyy-mm-dd -> dd-mm-yyyy
//     return `${c}-${b}-${a}`;
//   }
//   // already dd-mm-yyyy
//   return s;
// };

// const parseDMY = (s: string | undefined): Date | null => {
//   if (!s) return null;
//   const parts = s.split("-").map(Number);
//   if (parts.length !== 3) return null;
//   const [d, m, y] = parts;
//   if (!d || !m || !y) return null;
//   return new Date(y, m - 1, d);
// };

// // Builds a "DD-MM-YYYY" string from separate day/month/year parts (some
// // API fields, like the domicile certificate issue date, only arrive split
// // this way instead of as one formatted string).
// const buildDMY = (
//   day: string | undefined,
//   month: string | undefined,
//   year: string | undefined,
// ): string => {
//   if (!day || !month || !year) return "-";
//   return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
// };

// const diffYMD = (
//   fromDate: Date | null,
//   toDate: Date | null,
// ): { years: number; months: number; days: number } | null => {
//   if (!fromDate || !toDate) return null;
//   let years = toDate.getFullYear() - fromDate.getFullYear();
//   let months = toDate.getMonth() - fromDate.getMonth();
//   let days = toDate.getDate() - fromDate.getDate();
//   if (days < 0) {
//     months -= 1;
//     const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
//     days += prevMonth.getDate();
//   }
//   if (months < 0) {
//     years -= 1;
//     months += 12;
//   }
//   return { years, months, days };
// };

// // Parses the backend's compact duration strings, e.g. "3Y-11M-1D", into
// // the same {years, months, days} shape diffYMD() produces, so it can be
// // formatted with ymdLabel() directly instead of being recomputed from
// // raw from/to dates.
// const parseCompactYMD = (
//   s: string | undefined,
// ): { years: number; months: number; days: number } | null => {
//   if (!s) return null;
//   const match = s.match(/(\d+)\s*Y-(\d+)\s*M-(\d+)\s*D/i);
//   if (!match) return null;
//   return {
//     years: Number(match[1]),
//     months: Number(match[2]),
//     days: Number(match[3]),
//   };
// };

// const ymdLabel = (
//   ymd: { years: number; months: number; days: number } | null,
// ): string =>
//   ymd ? `${ymd.years} YEARS, ${ymd.months} MONTHS, ${ymd.days} DAYS` : "-";

// const yn = (v: string | boolean | undefined): string => {
//   if (typeof v === "boolean") return v ? "YES" : "NO";
//   if (typeof v === "string") {
//     const upper = v.toUpperCase();
//     if (upper === "YES" || upper === "Y" || upper === "TRUE") return "YES";
//     if (upper === "NO" || upper === "N" || upper === "FALSE") return "NO";
//   }
//   return v ? "YES" : "NO";
// };

// // "English text / हिंदी टेक्स्ट" -> "English text". Falls back to the raw
// // string if there's no slash (keeps ASCII-only strings intact).
// const latinHalf = (s: string | undefined): string => {
//   if (!s) return "-";
//   const [first] = String(s).split("/");
//   return first.trim() || "-";
// };

// // Compute a "xx.xx" percentage string from total/obtained marks when the
// // API doesn't send one directly.
// const computePercentage = (
//   total: number | string | undefined,
//   obtained: number | string | undefined,
// ): string => {
//   const t = Number(total);
//   const o = Number(obtained);
//   if (!t || Number.isNaN(t) || Number.isNaN(o)) return "-";
//   return ((o / t) * 100).toFixed(2);
// };

// // Formats a full ISO timestamp (e.g. the API's top-level `submissionDate`)
// // into "DD-MM-YYYY HH:MM:SS" for display, matching the style used elsewhere
// // in the slip. Returns "" (not "-") when there's nothing to format, so
// // callers can chain it with `||` fallbacks cleanly.
// const fmtISODateTime = (s: string | undefined): string => {
//   if (!s) return "";
//   const d = new Date(s);
//   if (Number.isNaN(d.getTime())) return "";
//   return d.toLocaleString("en-GB").replace(",", "");
// };

// const AGE_REFERENCE_DATE = new Date(2025, 7, 1); // 01-08-2025

// async function urlToDataURL(
//   url: string | null,
//   retries: number = 1,
// ): Promise<{ dataUrl: string; format: string } | null> {
//   if (!url) return null;

//   for (let attempt = 0; attempt <= retries; attempt++) {
//     try {
//       const res = await fetch(url, { mode: "cors", cache: "no-store" });
//       if (!res.ok) {
//         console.warn(
//           `[pdfGenerator] image fetch failed (HTTP ${res.status}) attempt ${
//             attempt + 1
//           }/${retries + 1}:`,
//           url,
//         );
//         continue;
//       }
//       const blob = await res.blob();
//       if (!blob || blob.size === 0) {
//         console.warn(
//           `[pdfGenerator] image fetch returned an empty blob, attempt ${
//             attempt + 1
//           }/${retries + 1}:`,
//           url,
//         );
//         continue;
//       }
//       const format = blob.type.includes("png") ? "PNG" : "JPEG";
//       const dataUrl = await new Promise<string>((resolve, reject) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result as string);
//         reader.onerror = reject;
//         reader.readAsDataURL(blob);
//       });
//       return { dataUrl, format };
//     } catch (err) {
//       console.warn(
//         `[pdfGenerator] image fetch threw an error, attempt ${
//           attempt + 1
//         }/${retries + 1}:`,
//         url,
//         err,
//       );
//     }
//   }

//   return null;
// }

// // ============================================================
// // DATA SHAPING
// // ============================================================

// function shapeSlipData(apiData: ApiData): SlipData {
//   const step0 = apiData?.steps?.step0 || {};
//   const step1 = apiData?.steps?.step1 || {};
//   const step3 = apiData?.steps?.step3 || {};
//   const step4 = apiData?.steps?.step4 || {};
//   const step5 = apiData?.steps?.step5 || {};
//   const payment = apiData?.steps?.payment || apiData?.steps?.step2 || {};
//   const candidateDetails = apiData?.candidateDetails || {};

//   const dob = parseDMY(step0.dateOfBirth);
//   const ageDiff = diffYMD(dob, AGE_REFERENCE_DATE);
//   const age = ymdLabel(ageDiff);

//   // Prefer the backend's own pre-computed contractual-period string
//   // (candidateDetails.contractualPeriod, e.g. "3Y-11M-1D") since it's
//   // authoritative; fall back to computing it from the from/to dates only
//   // if that's missing.
//   const contractualPeriod =
//     step0.contractualEmployee === "YES"
//       ? ymdLabel(
//           parseCompactYMD(candidateDetails.contractualPeriod) ||
//             diffYMD(
//               parseDMY(step0.contractualFromDate),
//               parseDMY(step0.contractualToDate),
//             ),
//         )
//       : null;

//   // The actual API nests education one level deeper than expected, under
//   // `steps.step3.qualification` (singular) keyed by tenth/twelfth/
//   // graduation. Some responses may instead send a flat `qualifications`
//   // array tagged with `level`/`degree`, or the legacy flat tenth/twelfth/
//   // graduation shape directly on step3. Resolve whichever is present.
//   const qualification = step3.qualification || {};
//   const qualifications = step3.qualifications || [];
//   const findQualification = (
//     levels: string[],
//     degrees: string[],
//   ): ApiEducationRowRaw | undefined =>
//     qualifications.find((q) => {
//       const lvl = String(q?.level || "").toLowerCase();
//       const deg = String(q?.degree || "").toLowerCase();
//       return levels.includes(lvl) || degrees.includes(deg);
//     });

//   const tenthRaw: ApiEducationRowRaw =
//     step3.tenth ||
//     qualification.tenth ||
//     findQualification(["matriculation", "10th"], ["10th"]) ||
//     {};
//   const twelfthRaw: ApiEducationRowRaw =
//     step3.twelfth ||
//     qualification.twelfth ||
//     findQualification(["intermediate", "12th"], ["12th"]) ||
//     {};
//   const gradRaw: ApiEducationRowRaw =
//     step3.graduation ||
//     qualification.graduation ||
//     findQualification(["graduation"], []) ||
//     {};

//   // Normalize field-name differences (API uses `marksObtained`, the legacy
//   // shape used `obtainedMarks`) so downstream code only deals with one name.
//   const normalizeObtained = (row: ApiEducationRowRaw): string | number =>
//     row.obtainedMarks ?? row.marksObtained ?? "-";

//   const tenthTotal = tenthRaw.totalMarks ?? "-";
//   const tenthObtained = normalizeObtained(tenthRaw);
//   const twelfthTotal = twelfthRaw.totalMarks ?? "-";
//   const twelfthObtained = normalizeObtained(twelfthRaw);
//   const gradTotal = gradRaw.totalMarks ?? "-";
//   const gradObtained = normalizeObtained(gradRaw);

//   return {
//     registrationNumber: apiData?.candidateDetails?.registrationNumber || "-",
//     formNumber: apiData?.applicationId || apiData?.candidateId || "-",

//     fullName: (step0.fullName || "").trim() || "-",
//     fatherName: step1.fatherName || "-",
//     motherName: step1.motherName || "-",
//     gender: step0.gender || candidateDetails.gender || "-",
//     mobileNo:
//       step0.mobileNo ||
//       step0.mobileNumber ||
//       candidateDetails.mobileNumber ||
//       "-",
//     emailId: step0.emailId || "-",
//     dateOfBirth: fmtDMY(step0.dateOfBirth),
//     age,
//     nationality: step1.nationality || "-",

//     category: latinHalf(step0.category),
//     caste: latinHalf(step0.caste),
//     isNonCreamyLayer: yn(
//       step0.isNonCreamyLayer === "YES" || step0.nonCreamyLayer === "YES",
//     ),
//     categoryCertNo:
//       step0.categoryCertNo || step0.categoryCertificateNumber || "-",
//     categoryIssueDate: fmtDMY(step0.categoryIssueDate),
//     categoryAuthority: step0.categoryAuthority || "-",

//     domicileOfBihar: yn(step0.domicileOfBihar === "YES"),
//     domicileCertNo: step0.domicileCertificateNumber || "-",
//     domicileIssueDate:
//       fmtDMY(step0.domicileCertificateIssueDate) !== "-"
//         ? fmtDMY(step0.domicileCertificateIssueDate)
//         : buildDMY(
//             step1.domicileIssueDateDay,
//             step1.domicileIssueDateMonth,
//             step1.domicileIssueDateYear,
//           ),
//     domicileAuthority: step0.domicileCertificateAuthority || "-",

//     disability: yn(step0.disability === "YES"),
//     disabilityDetails:
//       step0.disability === "YES"
//         ? {
//             nature: step0.natureOfDisability || "-",
//             min40Percent: yn(step0.pwd40Percent === "YES"),
//             certNo:
//               step0.disabilityCertNo || step0.pwdCertificateNumber || "-",
//             issueDate: fmtDMY(step0.disabilityIssueDate),
//             authority: step0.disabilityAuthority || "-",
//             scribeRequired: yn(step0.isScribeRequired === "YES"),
//           }
//         : null,

//     hasAadharCard: step1.hasAadharCard === "YES" ? "YES" : "NO",
//     aadharCardNumber: step1.aadharCardNumber || "-",
//     idProofType: step1.typeOfPhotoIdProof || "-",
//     idProofNo: step1.idProofNo || "-",

//     biharGovtEmployee: yn(step0.biharGovtEmployee === "YES"),
//     numberOfAttempts: step0.numberOfAttempts ?? step0.bsscAttempts ?? "0",

//     contractualEmployee: yn(step0.contractualEmployee === "YES"),
//     nameOfPost: latinHalf(step0.nameOfPost),
//     agreementCircular: yn(step0.agreementCircular === "YES"),
//     contractualPeriod,
//     departmentName: step0.departmentName || step0.organizationName || "-",
//     officeOrderNo: step0.officeOrderNo || "-",

//     identificationMark:
//       [step1.identificationMarkEn, step1.identificationMarkEn2]
//         .filter(Boolean)
//         .join(", ") || "-",

//     exServiceman: yn(step0.exServiceman === "YES"),
//     wardOfFreedomFighter: yn(step1.wardOfFreedomFighter === "YES"),
//     isDebarred: yn(step1.isDebarred === "YES"),

//     correspondenceAddress: {
//       village: step1.corrVillage || "-",
//       postOffice: step1.corrPostOffice || "-",
//       policeStation: step1.corrPoliceStation || "-",
//       district: step1.corrDistrict || "-",
//       state: step1.corrState || "-",
//       pinCode: step1.corrPinCode || "-",
//     },
//     permanentAddress: {
//       village: step1.permVillage || "-",
//       postOffice: step1.permPostOffice || "-",
//       policeStation: step1.permPoliceStation || "-",
//       district: step1.permDistrict || "-",
//       state: step1.permState || "-",
//       pinCode: step1.permPinCode || "-",
//     },
//     sameAsPermanent: !!step1.sameAsPermanent,

//     education: {
//       tenth: {
//         subject: tenthRaw.subject || "-",
//         board: tenthRaw.boardUniversity || "-",
//         total: tenthTotal,
//         obtained: tenthObtained,
//         percentage: computePercentage(tenthTotal, tenthObtained),
//         passingDate: fmtEduDate(tenthRaw.certIssueDate),
//         certNo: tenthRaw.certNumber || "-",
//       },
//       twelfth: {
//         subject: twelfthRaw.subject || "-",
//         board: twelfthRaw.boardUniversity || "-",
//         total: twelfthTotal,
//         obtained: twelfthObtained,
//         percentage: computePercentage(twelfthTotal, twelfthObtained),
//         passingDate: fmtEduDate(twelfthRaw.certIssueDate),
//         certNo: twelfthRaw.certNumber || "-",
//       },
//       graduation: {
//         subject: gradRaw.subject || "-",
//         board: gradRaw.boardUniversity || "-",
//         total: gradTotal,
//         obtained: gradObtained,
//         percentage: computePercentage(gradTotal, gradObtained),
//         passingDate: fmtEduDate(gradRaw.certIssueDate),
//         certNo: gradRaw.certNumber || "-",
//       },
//     },

//     payment: {
//       bank: payment.bankName || payment.paymentBank || "-",
//       transactionId: payment.transactionId || "-",
//       transactionDate:
//         payment.transactionDate ||
//         fmtISODateTime(apiData?.submissionDate) ||
//         "-",
//       registrationFee:
//         payment.registrationFee != null
//           ? String(payment.registrationFee)
//           : payment.amount != null
//             ? String(payment.amount)
//             : "-",
//     },

//     photograph: step4.photograph || null,
//     signatureEnglish: step4.signatureEnglish || null,
//     signatureHindi: step4.signatureHindi || null,
//     livePhoto: step5.livePhoto || null,

//     declarationDate: new Date().toLocaleString("en-GB").replace(",", ""),
//   };
// }

// // ============================================================
// // DRAWING HELPERS
// // ============================================================

// function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
//   if (y + needed > PAGE_H - MARGIN - FOOTER_SPACE) {
//     pdf.addPage();
//     return MARGIN;
//   }
//   return y;
// }

// function sectionHeader(pdf: jsPDF, y: number, title: string): number {
//   y = ensureSpace(pdf, y, 8);
//   pdf.setFillColor(220, 220, 220); // matches CSS #dcdcdc section-title background
//   pdf.rect(MARGIN, y, CONTENT_W, 7, "F");
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.2);
//   pdf.rect(MARGIN, y, CONTENT_W, 7);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(9.5);
//   pdf.setTextColor(0);
//   pdf.text(title, MARGIN + 2, y + 5);
//   return y + 7;
// }

// interface LabelValueRowOptions {
//   labelW?: number;
//   /** extra space reserved on the right (e.g. while the photo panel occupies that column) */
//   rightInset?: number;
// }

// function measureRowHeight(
//   pdf: jsPDF,
//   label: string,
//   value: string | number,
//   labelW: number,
//   rowW: number,
// ): number {
//   pdf.setFontSize(7.6);
//   const valueW = rowW - labelW;
//   const valueLines = pdf.splitTextToSize(String(value ?? "-"), valueW - 4);
//   const labelLines = pdf.splitTextToSize(String(label), labelW - 4);
//   const lines = Math.max(valueLines.length, labelLines.length, 1);
//   return Math.max(6.2, lines * 3.4 + 2.6);
// }

// function labelValueRow(
//   pdf: jsPDF,
//   y: number,
//   label: string,
//   value: string | number,
//   opts: LabelValueRowOptions = {},
// ): number {
//   const labelW = opts.labelW ?? LABEL_W;
//   const rightInset = opts.rightInset ?? 0;
//   const rowW = CONTENT_W - rightInset;
//   const valueW = rowW - labelW;

//   pdf.setFontSize(7.6);
//   const valueLines = pdf.splitTextToSize(String(value ?? "-"), valueW - 4);
//   const labelLines = pdf.splitTextToSize(String(label), labelW - 4);
//   const lineH = 3.4;
//   const lines = Math.max(valueLines.length, labelLines.length, 1);
//   const rowH = Math.max(6.2, lines * lineH + 2.6);

//   y = ensureSpace(pdf, y, rowH);

//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);

//   // label cell
//   pdf.setFillColor(233, 233, 233);
//   pdf.rect(MARGIN, y, labelW, rowH, "F");
//   pdf.rect(MARGIN, y, labelW, rowH);
//   pdf.setFont("helvetica", "normal");
//   pdf.setTextColor(0);
//   pdf.text(labelLines, MARGIN + 1.5, y + 4);

//   // value cell
//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(MARGIN + labelW, y, valueW, rowH, "F");
//   pdf.rect(MARGIN + labelW, y, valueW, rowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(valueLines, MARGIN + labelW + 1.5, y + 4);

//   return y + rowH;
// }

// /** A row holding two label/value pairs side by side (e.g. "ID PROOF" + "ID PROOF NO"). */
// function twoPairRow(
//   pdf: jsPDF,
//   y: number,
//   pairs: [string, string | number, string, string | number],
//   opts: { labelW1?: number; labelW2?: number } = {},
// ): number {
//   const halfW = CONTENT_W / 2;
//   const labelW1 = opts.labelW1 ?? 34;
//   const labelW2 = opts.labelW2 ?? 34;
//   const valueW1 = halfW - labelW1;
//   const valueW2 = halfW - labelW2;

//   pdf.setFontSize(7.6);
//   const v1Lines = pdf.splitTextToSize(String(pairs[1] ?? "-"), valueW1 - 4);
//   const v2Lines = pdf.splitTextToSize(String(pairs[3] ?? "-"), valueW2 - 4);
//   const lines = Math.max(v1Lines.length, v2Lines.length, 1);
//   const rowH = Math.max(6.2, lines * 3.4 + 2.6);

//   y = ensureSpace(pdf, y, rowH);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);

//   pdf.setFillColor(233, 233, 233);
//   pdf.rect(MARGIN, y, labelW1, rowH, "F");
//   pdf.rect(MARGIN, y, labelW1, rowH);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(pairs[0], MARGIN + 1.5, y + 4);

//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(MARGIN + labelW1, y, valueW1, rowH, "F");
//   pdf.rect(MARGIN + labelW1, y, valueW1, rowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(v1Lines, MARGIN + labelW1 + 1.5, y + 4);

//   const x2 = MARGIN + halfW;
//   pdf.setFillColor(233, 233, 233);
//   pdf.rect(x2, y, labelW2, rowH, "F");
//   pdf.rect(x2, y, labelW2, rowH);
//   pdf.setFont("helvetica", "normal");
//   pdf.text(pairs[2], x2 + 1.5, y + 4);

//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(x2 + labelW2, y, valueW2, rowH, "F");
//   pdf.rect(x2 + labelW2, y, valueW2, rowH);
//   pdf.setFont("helvetica", "bold");
//   pdf.text(v2Lines, x2 + labelW2 + 1.5, y + 4);

//   return y + rowH;
// }

// async function drawPhotoPanel(
//   pdf: jsPDF,
//   x: number,
//   y: number,
//   data: SlipData,
//   boxHeight: number = PHOTO_H,
// ): Promise<number> {
//   const boxW = PHOTO_W;
//   const boxH = boxHeight;
//   const gap = PHOTO_GAP;
//   const items = [
//     { caption: ["PHOTO", "LIVE PHOTO"], url: data.livePhoto },
//     { caption: ["PHOTO", "PHOTO"], url: data.photograph },
//     {
//       caption: ["PHOTO", "SIGNATURE", "IN ENGLISH"],
//       url: data.signatureEnglish,
//     },
//     { caption: ["PHOTO", "SIGNATURE", "IN HINDI"], url: data.signatureHindi },
//   ];

//   for (let i = 0; i < items.length; i++) {
//     const boxY = y + i * (boxH + gap);
//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);
//     pdf.setFillColor(246, 246, 246);
//     pdf.rect(x, boxY, boxW, boxH, "F");
//     pdf.rect(x, boxY, boxW, boxH);

//     const img = await urlToDataURL(items[i].url);
//     if (img) {
//       try {
//         pdf.addImage(
//           img.dataUrl,
//           img.format,
//           x + 0.5,
//           boxY + 0.5,
//           boxW - 1,
//           boxH - 1,
//         );
//         continue;
//       } catch {
//         // fall through to caption-only box
//       }
//     }
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(5.6);
//     pdf.setTextColor(120);
//     const caption = items[i].caption;
//     const startY = boxY + boxH / 2 - ((caption.length - 1) * 2.4) / 2 + 1;
//     caption.forEach((line, li) => {
//       pdf.text(line, x + boxW / 2, startY + li * 2.6, { align: "center" });
//     });
//     pdf.setTextColor(0);
//   }

//   return y + items.length * (boxH + gap);
// }

// function twoColAddressTable(
//   pdf: jsPDF,
//   y: number,
//   corr: AddressData,
//   perm: AddressData,
// ): number {
//   const colW = CONTENT_W / 2;
//   y = ensureSpace(pdf, y, 7);
//   pdf.setFillColor(220, 220, 220);
//   pdf.rect(MARGIN, y, colW, 7, "F");
//   pdf.rect(MARGIN + colW, y, colW, 7, "F");
//   pdf.setDrawColor(0);
//   pdf.rect(MARGIN, y, colW, 7);
//   pdf.rect(MARGIN + colW, y, colW, 7);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(8);
//   pdf.text("CORRESPONDENCE ADDRESS", MARGIN + colW / 2, y + 4.8, {
//     align: "center",
//   });
//   pdf.text("PERMANENT ADDRESS", MARGIN + colW + colW / 2, y + 4.8, {
//     align: "center",
//   });
//   y += 7;

//   const rows: Array<[string, keyof AddressData]> = [
//     ["VILLAGE/MOHALLA:", "village"],
//     ["POST OFFICE:", "postOffice"],
//     ["POLICE STATION:", "policeStation"],
//     ["DISTRICT:", "district"],
//     ["STATE:", "state"],
//     ["PIN CODE:", "pinCode"],
//   ];
//   const subLabelW = 30;
//   const valueW = colW - subLabelW;

//   for (const [label, key] of rows) {
//     pdf.setFontSize(7);
//     const corrLines = pdf.splitTextToSize(String(corr[key] || "-"), valueW - 3);
//     const permLines = pdf.splitTextToSize(String(perm[key] || "-"), valueW - 3);
//     const lines = Math.max(corrLines.length, permLines.length, 1);
//     const h = Math.max(6, lines * 3.2 + 2.4);

//     y = ensureSpace(pdf, y, h);

//     // left (correspondence)
//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN, y, subLabelW, h, "F");
//     pdf.rect(MARGIN, y, subLabelW, h);
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN + subLabelW, y, valueW, h, "F");
//     pdf.rect(MARGIN + subLabelW, y, valueW, h);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(label, MARGIN + 1.5, y + 4);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(corrLines, MARGIN + subLabelW + 1.5, y + 4);

//     // right (permanent)
//     pdf.setFillColor(233, 233, 233);
//     pdf.rect(MARGIN + colW, y, subLabelW, h, "F");
//     pdf.rect(MARGIN + colW, y, subLabelW, h);
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN + colW + subLabelW, y, valueW, h, "F");
//     pdf.rect(MARGIN + colW + subLabelW, y, valueW, h);
//     pdf.setFont("helvetica", "normal");
//     pdf.text(label, MARGIN + colW + 1.5, y + 4);
//     pdf.setFont("helvetica", "bold");
//     pdf.text(permLines, MARGIN + colW + subLabelW + 1.5, y + 4);

//     y += h;
//   }

//   return y;
// }

// function educationTable(
//   pdf: jsPDF,
//   y: number,
//   education: EducationData,
// ): number {
//   // 7 columns, matching the HTML table (PERCENTAGE column removed per request).
//   const headers = [
//     "EDUCATION",
//     "SUBJECT",
//     "BOARD/UNIV.",
//     "TOTAL",
//     "OBTAINED",
//     "PASSING DATE",
//     "CERT. NO.",
//   ];
//   const colCount = headers.length;
//   const widths = [22, 40, 30, 16, 16, 30, 36]; // sums to CONTENT_W (190)

//   y = ensureSpace(pdf, y, 9);

//   // ---- header row ----
//   let x = MARGIN;
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(6.6);
//   for (let i = 0; i < colCount; i++) {
//     pdf.setFillColor(220, 220, 220);
//     pdf.rect(x, y, widths[i], 9, "F");
//     pdf.rect(x, y, widths[i], 9);
//     pdf.setTextColor(0, 0, 0);
//     const lines = pdf.splitTextToSize(headers[i], widths[i] - 2);
//     pdf.text(lines, x + widths[i] / 2, y + 4, { align: "center" });
//     x += widths[i];
//   }
//   y += 9;

//   // ---- body rows ----
//   const rows: Array<[string, EducationRow]> = [
//     ["10TH / EQUIVALENT", education.tenth],
//     ["12TH/10TH +2 / EQUIVALENT", education.twelfth],
//     ["GRADUATION / EQUIVALENT", education.graduation],
//   ];

//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(6.8);

//   for (const [levelLabel, d] of rows) {
//     const cells: string[] = [
//       levelLabel,
//       d.subject,
//       d.board,
//       String(d.total),
//       String(d.obtained),
//       d.passingDate,
//       d.certNo,
//     ];

//     const wrapped = cells.map((c, i) => pdf.splitTextToSize(c, widths[i] - 2));
//     const rowH = Math.max(
//       8,
//       Math.max(...wrapped.map((w) => w.length)) * 3.2 + 2.6,
//     );

//     y = ensureSpace(pdf, y, rowH);
//     x = MARGIN;
//     for (let i = 0; i < colCount; i++) {
//       pdf.setFillColor(255, 255, 255);
//       pdf.rect(x, y, widths[i], rowH, "F");
//       pdf.rect(x, y, widths[i], rowH);
//       pdf.setTextColor(0, 0, 0);
//       pdf.text(wrapped[i], x + widths[i] / 2, y + 4, { align: "center" });
//       x += widths[i];
//     }
//     y += rowH;
//   }

//   return y;
// }

// function paymentSection(
//   pdf: jsPDF,
//   y: number,
//   payment: PaymentDetails,
// ): number {
//   y = sectionHeader(pdf, y, "PAYMENT DETAILS:");
//   const rows: Array<[string, string]> = [
//     ["PAYMENT BANK :", payment.bank],
//     ["TRANSACTION ID :", payment.transactionId],
//     ["TRANSACTION DATE :", payment.transactionDate],
//     ["REGISTRATION FEE (RS.) :", payment.registrationFee],
//   ];
//   for (const [label, value] of rows) {
//     const rowH = 6;
//     y = ensureSpace(pdf, y, rowH);
//     pdf.setDrawColor(0);
//     pdf.setLineWidth(0.15);
//     pdf.setFillColor(255, 255, 255);
//     pdf.rect(MARGIN, y, CONTENT_W, rowH, "F");
//     pdf.rect(MARGIN, y, CONTENT_W, rowH);
//     pdf.setFont("helvetica", "bold");
//     pdf.setFontSize(7.6);
//     pdf.text(label, MARGIN + 2, y + 4);
//     pdf.setFont("helvetica", "normal");
//     const labelW = pdf.getTextWidth(label);
//     pdf.text(String(value), MARGIN + 2 + labelW + 2, y + 4);
//     y += rowH;
//   }
//   return y;
// }

// /**
//  * Fallback placeholder drawn in place of the real logo when it can't be
//  * fetched (e.g. offline, LOGO_URL not reachable). Simple bordered circle
//  * with "LOGO" text, occupying the same bounding box the real logo uses.
//  */
// function drawPlaceholderLogo(
//   pdf: jsPDF,
//   cx: number,
//   cy: number,
//   r: number,
// ): void {
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.3);
//   pdf.setFillColor(245, 245, 245);
//   pdf.circle(cx, cy, r, "FD");
//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(6);
//   pdf.setTextColor(120);
//   pdf.text("LOGO", cx, cy + 1.5, { align: "center" });
//   pdf.setTextColor(0);
// }

// /** Draws a fixed-pattern barcode (visual only) similar to the CSS repeating-linear-gradient bars. */
// function drawBarcode(
//   pdf: jsPDF,
//   x: number,
//   y: number,
//   w: number,
//   h: number,
// ): void {
//   // fixed bar-width pattern (in "units"), repeated to fill the width
//   const pattern = [2, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 2, 2, 1, 1, 2, 1, 1, 3, 1];
//   const unit = w / pattern.reduce((a, b) => a + b, 0) / 3; // scale so the pattern tiles ~3x
//   let cx = x;
//   let black = true;
//   const totalUnits = pattern.reduce((a, b) => a + b, 0) * 3;
//   let unitsDrawn = 0;
//   pdf.setFillColor(255, 255, 255);
//   pdf.rect(x, y, w, h, "F");
//   while (unitsDrawn < totalUnits && cx < x + w) {
//     const barUnits = pattern[unitsDrawn % pattern.length];
//     const barW = Math.min(barUnits * unit, x + w - cx);
//     if (black) {
//       pdf.setFillColor(0, 0, 0);
//       pdf.rect(cx, y, barW, h, "F");
//     }
//     cx += barW;
//     unitsDrawn += barUnits;
//     black = !black;
//   }
// }

// /**
//  * Draws the given logo image, centered on the CURRENT page, as a large
//  * translucent watermark. Uses jsPDF's graphics-state opacity so it doesn't
//  * disturb any other drawing (colors/line widths are saved & restored).
//  * Call this once per page, after everything else on that page is drawn,
//  * so the watermark sits as a faint overlay across the whole page without
//  * altering any existing layout, spacing, or content logic.
//  */
// function drawWatermarkOnCurrentPage(
//   pdf: jsPDF,
//   logo: { dataUrl: string; format: string },
// ): void {
//   const size = WATERMARK_SIZE;
//   const x = (PAGE_W - size) / 2;
//   const y = (PAGE_H - size) / 2;

//   try {
//     // @ts-ignore - GState is provided by jsPDF at runtime for opacity control
//     const GState = (pdf as any).GState;
//     pdf.saveGraphicsState();
//     if (GState) {
//       pdf.setGState(new GState({ opacity: WATERMARK_OPACITY }));
//     }
//     pdf.addImage(logo.dataUrl, logo.format, x, y, size, size);
//   } catch {
//     // silently skip the watermark if anything goes wrong (never break the PDF)
//   } finally {
//     pdf.restoreGraphicsState();
//   }
// }

// /**
//  * Draws the logo watermark on every page currently in the document.
//  * Safe to call multiple times / after pages have already been added.
//  */
// function applyWatermarkToAllPages(
//   pdf: jsPDF,
//   logo: { dataUrl: string; format: string } | null,
// ): void {
//   if (!logo) return;
//   const totalPages = pdf.getNumberOfPages();
//   const currentPage = (pdf as any).getCurrentPageInfo
//     ? (pdf as any).getCurrentPageInfo().pageNumber
//     : totalPages;
//   for (let p = 1; p <= totalPages; p++) {
//     pdf.setPage(p);
//     drawWatermarkOnCurrentPage(pdf, logo);
//   }
//   pdf.setPage(currentPage);
// }

// /**
//  * Draws the registration slip as real vector text + lines (no screenshot,
//  * no html2canvas). This fixes the row-squishing / mid-row page breaks you
//  * get from the canvas-image approach, because every row height and every
//  * page break is computed explicitly instead of being sliced out of one
//  * giant bitmap. Layout mirrors the reference HTML design 1:1 (section
//  * bands, photo panel, two-column address block, education table,
//  * payment block, and a declaration box whose photo sits below the
//  * paragraph so nothing overlaps).
//  *
//  * Usage:
//  *   import { generateRegistrationSlipPDF } from "./pdfGenerator";
//  *   await generateRegistrationSlipPDF(apiResponseData); // apiResponseData = response.data.data
//  *
//  * Limitation (please read): jsPDF's built-in fonts (helvetica/times/courier)
//  * only cover Latin characters. Devanagari strings (the Hindi halves of
//  * bilingual fields, and the Hindi header line) will not render correctly
//  * with the default font, so this draws only the Latin/English half of any
//  * "English / Hindi" field, and skips pure-Hindi-only lines. If you need the
//  * Hindi text to render too, embed a Unicode font (e.g. Noto Sans Devanagari)
//  * via pdf.addFileToVFS + pdf.addFont — see the TODO near FONT setup below.
//  */
// export async function generateRegistrationSlipPDF(
//   apiData: ApiData,
//   opts: PDFOptions = {},
// ): Promise<jsPDF> {
//   const data = shapeSlipData(apiData);
//   const pdf = new jsPDF("p", "mm", "a4");

//   // TODO (only if you need Hindi glyphs to render): embed a Devanagari font here, e.g.
//   //   pdf.addFileToVFS("NotoSansDevanagari.ttf", NOTO_SANS_DEVANAGARI_BASE64);
//   //   pdf.addFont("NotoSansDevanagari.ttf", "NotoDevanagari", "normal");
//   //   pdf.setFont("NotoDevanagari");
//   // and use that font for any field you want to show in Hindi instead of latinHalf().

//   let y = MARGIN;

//   // Cache of the logo image (also used for the header) so we can reuse the
//   // exact same asset as a background watermark on every page, without a
//   // second network fetch.
//   let watermarkLogoImg: { dataUrl: string; format: string } | null = null;

//   /* ---------- Header ---------- */
//   const logoR = 10;
//   const logoCx = MARGIN + logoR;
//   const logoCy = y + logoR;

//   const logoImg = await urlToDataURL(LOGO_URL);
//   watermarkLogoImg = logoImg;
//   if (logoImg) {
//     try {
//       // Same bounding box the placeholder circle used to occupy (MARGIN, y, logoR*2, logoR*2)
//       // so swapping in the real logo doesn't shift anything else in the header.
//       pdf.addImage(
//         logoImg.dataUrl,
//         logoImg.format,
//         MARGIN,
//         y,
//         logoR * 2,
//         logoR * 2,
//       );
//     } catch {
//       drawPlaceholderLogo(pdf, logoCx, logoCy, logoR);
//     }
//   } else {
//     drawPlaceholderLogo(pdf, logoCx, logoCy, logoR);
//   }
//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(5.4);
//   pdf.setTextColor(51, 51, 51);

//   pdf.setTextColor(0);
//   pdf.setDrawColor(0);

//   const titleX1 = MARGIN + 26;
//   const titleX2 = PAGE_W - MARGIN - 46;
//   const titleCx = (titleX1 + titleX2) / 2;
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(13);
//   pdf.text("BIHAR STAFF SELECTION COMMISSION", titleCx, y + 6, {
//     align: "center",
//   });
//   pdf.setFontSize(8.5);
//   pdf.text("P.O.-VETERINARY COLLEGE, PATNA - 800014", titleCx, y + 11.5, {
//     align: "center",
//   });
//   pdf.text(
//     "ADV NO.-05/25, 4th GRADUATE LEVEL COMBINED COMPETITIVE EXAM",
//     titleCx,
//     y + 16.5,
//     { align: "center" },
//   );
//   // NOTE: the Hindi title line ("चतुर्थ स्नातक...") is intentionally NOT drawn here.
//   // jsPDF's built-in "helvetica" font has no Devanagari glyphs, so calling pdf.text()
//   // with that string renders corrupted/garbled characters instead of real Hindi text
//   // (this is what caused the garbled line in the previous PDF). To show it correctly,
//   // embed a Devanagari font first (see the TODO near the top of this function) and
//   // switch to that font before drawing the line.

//   const barcodeW = 40;
//   const barcodeH = 9;
//   const barcodeX = PAGE_W - MARGIN - barcodeW;
//   drawBarcode(pdf, barcodeX, y, barcodeW, barcodeH);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.rect(barcodeX, y, barcodeW, barcodeH);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(7.5);
//   pdf.setTextColor(0);
//   pdf.text(data.registrationNumber, barcodeX + barcodeW / 2, y + barcodeH + 4, {
//     align: "center",
//   });

//   y += 26;
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.4);
//   pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
//   y += 2;

//   /* ---------- Personal details ---------- */
//   y = sectionHeader(pdf, y, "PERSONAL DETAILS");

//   const personalRows: Array<[string, string | number]> = [
//     ["REGISTRATION NO. :", data.registrationNumber],
//     ["FORM NO. :", data.formNumber],
//     ["NAME OF APPLICANT :", data.fullName],
//     ["FATHER'S NAME :", data.fatherName],
//     ["MOTHER'S NAME :", data.motherName],
//     ["GENDER :", data.gender],
//     ["MOBILE NO. :", data.mobileNo],
//     ["EMAIL ID :", data.emailId],
//     ["DATE OF BIRTH :", data.dateOfBirth],
//     ["AGE AS ON 01-08-2025 :", data.age],
//     ["NATIONALITY :", data.nationality],
//     ["CATEGORY :", data.category],
//     ["DO YOU BELONG TO NON-CREAMY LAYER ? :", data.isNonCreamyLayer],
//     ["CASTE :", data.caste],
//     ["CATEGORY CERTIFICATE NUMBER :", data.categoryCertNo],
//     ["ISSUE DATE OF CERTIFICATE :", data.categoryIssueDate],
//     ["CERTIFICATE ISSUING AUTHORITY :", data.categoryAuthority],
//     ["DOMICILE OF BIHAR STATE :", data.domicileOfBihar],
//     ["ISSUE DATE OF DOMICILE CERTIFICATE:", data.domicileIssueDate],
//     ["ISSUE NUMBER OF DOMICILE CERTIFICATE :", data.domicileCertNo],
//     ["DOMICILE CERTIFICATE ISSUING AUTHORITY :", data.domicileAuthority],
//     ["ARE YOU PERSON WITH DISABILITY? :", data.disability],
//   ];

//   // Pre-measure the base rows so the photo panel can be stretched to cover
//   // exactly this block's height (this is what the reference design does —
//   // the photo column runs the full length of the block, not just its first
//   // few rows).
//   const rowWWithPhoto = CONTENT_W - PHOTO_INSET;
//   let personalBlockHeight = 0;
//   for (const [label, value] of personalRows) {
//     personalBlockHeight += measureRowHeight(
//       pdf,
//       label,
//       value,
//       LABEL_W,
//       rowWWithPhoto,
//     );
//   }
//   const photoBoxH = Math.max(
//     PHOTO_H,
//     (personalBlockHeight - PHOTO_GAP * 3) / 4,
//   );

//   const photoPanelX = PAGE_W - MARGIN - PHOTO_W;
//   const photoPanelTop = y;
//   await drawPhotoPanel(pdf, photoPanelX, photoPanelTop, data, photoBoxH);

//   for (const [label, value] of personalRows) {
//     y = labelValueRow(pdf, y, label, value, { rightInset: PHOTO_INSET });
//   }

//   if (data.disabilityDetails) {
//     const d = data.disabilityDetails;
//     const disRows: Array<[string, string]> = [
//       ["NATURE OF DISABILITY :", d.nature],
//       ["IS DISABILITY 40% OR MORE? :", d.min40Percent],
//       ["DISABILITY CERTIFICATE NO. :", d.certNo],
//       ["DISABILITY CERTIFICATE ISSUE DATE :", d.issueDate],
//       ["DISABILITY CERTIFICATE ISSUING AUTHORITY :", d.authority],
//       ["DO YOU REQUIRE A SCRIBE? :", d.scribeRequired],
//     ];
//     for (const [label, value] of disRows) {
//       y = labelValueRow(pdf, y, label, value);
//     }
//   }

//   // ---- second block: full width, wide labels (matches the HTML's colspan=3 label rows) ----
//   const WIDE_LABEL_W = 130;
//   y = labelValueRow(
//     pdf,
//     y,
//     "DO YOU HAVE AADHAR CARD? :",
//     data.hasAadharCard === "YES"
//       ? `YES (AADHAR CARD NUMBER: ${data.aadharCardNumber})`
//       : "NO",
//     { labelW: WIDE_LABEL_W },
//   );
//   y = twoPairRow(
//     pdf,
//     y,
//     ["ID PROOF :", data.idProofType, "ID PROOF NO :", data.idProofNo],
//     {
//       labelW1: 26,
//       labelW2: 26,
//     },
//   );
//   y = labelValueRow(
//     pdf,
//     y,
//     "ARE YOU BIHAR GOVERNMENT EMPLOYEE WHO HAS RENDERED NOT LESS THAN 3 YEARS REGULAR AND CONTINUOUS SERVICE? :",
//     data.biharGovtEmployee,
//     { labelW: WIDE_LABEL_W },
//   );
//   y = labelValueRow(
//     pdf,
//     y,
//     "IN BSSC EXAMS NUMBER OF ATTEMPTS AFTER 12-12-2022:",
//     data.numberOfAttempts,
//     { labelW: WIDE_LABEL_W },
//   );
//   y = labelValueRow(
//     pdf,
//     y,
//     "ARE YOU A CONTRACTUAL EMPLOYEE ON ANY OF THE POSTS MENTIONED IN THE ADVERTISEMENT IN THE BIHAR GOVERNMENT? :",
//     data.contractualEmployee,
//     { labelW: WIDE_LABEL_W },
//   );

//   if (data.contractualEmployee === "YES") {
//     y = labelValueRow(pdf, y, "NAME OF POST :", data.nameOfPost, {
//       labelW: WIDE_LABEL_W,
//     });
//     y = labelValueRow(
//       pdf,
//       y,
//       "DO YOU HAVE AGREEMENT IN THE LIGHT OF CIRCULAR NO. - 1003, DATED - 22.01.2021 OF GENERAL ADMINISTRATION DEPARTMENT, BIHAR, PATNA? :",
//       data.agreementCircular,
//       { labelW: WIDE_LABEL_W },
//     );
//     y = labelValueRow(
//       pdf,
//       y,
//       "CONTRACTUAL SERVICE PERIOD IN BIHAR GOVERNMENT? :",
//       data.contractualPeriod ?? "-",
//       { labelW: WIDE_LABEL_W },
//     );
//     y = labelValueRow(
//       pdf,
//       y,
//       "NAME OF DEPARTMENT/OFFICE :",
//       data.departmentName,
//       { labelW: WIDE_LABEL_W },
//     );
//     y = labelValueRow(pdf, y, "OFFICE ORDER NUMBER :", data.officeOrderNo, {
//       labelW: WIDE_LABEL_W,
//     });
//   }

//   y = labelValueRow(
//     pdf,
//     y,
//     "IDENTIFICATION MARK OF THE CANDIDATE :",
//     data.identificationMark,
//     { labelW: WIDE_LABEL_W },
//   );
//   y = labelValueRow(pdf, y, "ARE YOU AN EX-SERVICEMAN? :", data.exServiceman, {
//     labelW: WIDE_LABEL_W,
//   });
//   y = labelValueRow(
//     pdf,
//     y,
//     "WARD OF FREEDOM FIGHTER? :",
//     data.wardOfFreedomFighter,
//     { labelW: WIDE_LABEL_W },
//   );
//   y = labelValueRow(
//     pdf,
//     y,
//     "HAVE YOU EVER BEEN DEBARRED FROM ANY COMPETITIVE EXAMINATION (UPSC/BOARD/STATE COMMISSION/ANY OTHER)? :",
//     data.isDebarred,
//     { labelW: WIDE_LABEL_W },
//   );



//   /* ---------- Address ---------- */
//   y = sectionHeader(pdf, y, "ADDRESS DETAILS");
//   y = twoColAddressTable(
//     pdf,
//     y,
//     data.correspondenceAddress,
//     data.sameAsPermanent ? data.correspondenceAddress : data.permanentAddress,
//   );

//   /* ---------- Education ---------- */
//   y = sectionHeader(pdf, y, "EDUCATIONAL QUALIFICATIONS");
//   y = educationTable(pdf, y, data.education);

//   /* ---------- Payment ---------- */
//   y = paymentSection(pdf, y, data.payment);

//   /* ---------- Declaration ---------- */
//   y = sectionHeader(pdf, y, "DECLARATION DETAILS:");
//   const declText =
//     "I HEREBY DECLARE THAT THE INFORMATIONS FILLED UP ABOVE BY ME ARE TRUE AND CORRECT TO THE BEST OF MY KNOWLEDGE. " +
//     "I ALSO DECLARE THAT I HAVE FILLED UP ONLY ONE APPLICATION FORM. I ALSO UNDERTAKE THAT IF ANY INFORMATION IS " +
//     "FOUND OTHERWISE, I SHALL BE LIABLE FOR ANY LEGAL ACTION AND CANCELLATION OF MY CANDIDATURE.";
//   pdf.setFont("helvetica", "normal");
//   pdf.setFontSize(7.4);
//   const declLines = pdf.splitTextToSize(declText, CONTENT_W - 4);
//   const declTextH = declLines.length * 3.4;
//   const declBoxH = Math.max(28, declTextH + 20); // extra room below the paragraph for date/accepted/photo
//   y = ensureSpace(pdf, y, declBoxH);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.rect(MARGIN, y, CONTENT_W, declBoxH);
//   pdf.setTextColor(0);
//   pdf.text(declLines, MARGIN + 2, y + 5);

//   const dateLineY = y + declTextH + 9;
//   const acceptedLineY = dateLineY + 4.5;
//   pdf.setFont("helvetica", "normal");
//   pdf.text(`DATE : ${data.declarationDate}`, MARGIN + 2, dateLineY);
//   pdf.setFont("helvetica", "bold");
//   pdf.text("DECLARATION ACCEPTED : YES", MARGIN + 2, acceptedLineY);

//   // Photo sits below the paragraph, beside the DATE / DECLARATION ACCEPTED
//   // lines — never overlapping the declaration text above it.
//   const declPhotoW = 22;
//   const declPhotoH = 16;
//   const declPhotoX = MARGIN + CONTENT_W - declPhotoW - 4;
//   const declPhotoY = Math.min(dateLineY - 3.5, y + declBoxH - declPhotoH - 3);
//   pdf.setDrawColor(68, 68, 68);
//   pdf.setFillColor(246, 246, 246);
//   pdf.rect(declPhotoX, declPhotoY, declPhotoW, declPhotoH, "F");
//   pdf.rect(declPhotoX, declPhotoY, declPhotoW, declPhotoH);

//   const declPhoto = await urlToDataURL(data.photograph);
//   if (declPhoto) {
//     try {
//       pdf.addImage(
//         declPhoto.dataUrl,
//         declPhoto.format,
//         declPhotoX + 0.5,
//         declPhotoY + 0.5,
//         declPhotoW - 1,
//         declPhotoH - 1,
//       );
//     } catch {
//       pdf.setFont("helvetica", "normal");
//       pdf.setFontSize(6);
//       pdf.setTextColor(150);
//       pdf.text(
//         "PHOTO",
//         declPhotoX + declPhotoW / 2,
//         declPhotoY + declPhotoH / 2,
//         { align: "center" },
//       );
//       pdf.setTextColor(0);
//     }
//   } else {
//     pdf.setFont("helvetica", "normal");
//     pdf.setFontSize(6);
//     pdf.setTextColor(150);
//     pdf.text(
//       "PHOTO",
//       declPhotoX + declPhotoW / 2,
//       declPhotoY + declPhotoH / 2,
//       { align: "center" },
//     );
//     pdf.setTextColor(0);
//   }

//   y += declBoxH;

//   /* ---------- Footer note ---------- */
//   y = ensureSpace(pdf, y, 8);
//   pdf.setDrawColor(0);
//   pdf.setLineWidth(0.15);
//   pdf.rect(MARGIN, y, CONTENT_W, 8);
//   pdf.setFont("helvetica", "bold");
//   pdf.setFontSize(7.2);
//   pdf.text(
//     "NOTE: PLEASE KEEP YOUR REGISTRATION NO., PASSWORD, MOBILE NO AND EMAIL-ID CAREFULLY FOR FURTHER REFERENCE.",
//     PAGE_W / 2,
//     y + 5,
//     { align: "center" },
//   );

//   /* ---------- Watermark (logo, faded, every page) ---------- */
//   // Applied last, after all pages/content exist, so every page (including
//   // ones created mid-way via ensureSpace()'s pdf.addPage()) gets the same
//   // translucent logo watermark without touching any of the layout above.
//   applyWatermarkToAllPages(pdf, watermarkLogoImg);

//   const filename = `Registration_Slip_${data.registrationNumber}.pdf`;
//   if (opts.save !== false) {
//     pdf.save(filename);
//   }
//   return pdf;
// }


import { jsPDF } from "jspdf";

interface AddressData {
  village: string;
  postOffice: string;
  policeStation: string;
  district: string;
  state: string;
  pinCode: string;
}

interface EducationRow {
  subject: string;
  board: string;
  total: number | string;
  obtained: number | string;
  percentage: string;
  passingDate: string;
  certNo: string;
}

interface EducationData {
  tenth: EducationRow;
  twelfth: EducationRow;
  graduation: EducationRow;
}

interface DisabilityDetails {
  nature: string;
  natureType: string; // e.g. PERMANENT / TEMPORARY (step0.disTypePersist / natureOfDisabilityType)
  min40Percent: string;
  certNo: string;
  issueDate: string;
  authority: string;
  scribeRequired: string;
  isownscribe: string;
}

interface SportsDetails {
  level: string;
  achievement: string;
  certNo: string;
  authority: string;
  issueDate: string;
}

interface DebarmentDetails {
  reason: string;
  recruitmentBoard: string;
  fromDate: string;
  toDate: string;
}

interface FreedomFighterDetails {
  certNo: string;
  authority: string;
}

interface PaymentDetails {
  bank: string;
  transactionId: string;
  transactionDate: string;
  registrationFee: string;
}

interface SlipData {
  registrationNumber: string;
  formNumber: string;
  fullName: string;
  fatherName: string;
  motherName: string;
  gender: string;
  mobileNo: string;
  emailId: string;
  dateOfBirth: string;
  age: string;
  nationality: string;
  maritalStatus: string;
  spouseName: string;
  category: string;
  caste: string;
  isNonCreamyLayer: string;
  categoryCertNo: string;
  categoryIssueDate: string;
  categoryAuthority: string;
  domicileOfBihar: string;
  domicileCertNo: string;
  domicileIssueDate: string;
  domicileAuthority: string;
  disability: string;
  disabilityDetails: DisabilityDetails | null;
  hasAadharCard: string;
  aadharCardNumber: string;
  idProofType: string;
  idProofNo: string;
  biharGovtEmployee: string;
  numberOfAttempts: string;
  hasPostExperience: string;
  contractualEmployee: string;
  nameOfPost: string;
  agreementCircular: string;
  contractualPeriod: string | null;
  contractualFromDate: string; // <-- ADD THIS
  contractualToDate: string;
  agreementCopyUploaded: string; // <-- ADD THIS
  experienceCertificateUploaded: string; // <-- ADD THIS
  departmentName: string;
  officeOrderNo: string;
  identificationMark: string;
  exServiceman: string;
  isSportsQuota: string;
  sportsDetails: SportsDetails | null;
  wardOfFreedomFighter: string;
  freedomFighterDetails: FreedomFighterDetails | null;
  isDebarred: string;
  debarmentDetails: DebarmentDetails | null;
  correspondenceAddress: AddressData;
  permanentAddress: AddressData;
  sameAsPermanent: boolean;
  education: EducationData;
  payment: PaymentDetails;
  photograph: string | null;
  signatureEnglish: string | null;
  signatureHindi: string | null;
  livePhoto: string | null;
  declarationDate: string;
}

// ============================================================
// API Response types (subset needed for the PDF)
//
// IMPORTANT: the real API splits the "personal details" data across TWO
// step objects, not one:
//   - steps.step0  -> fullName, gender, mobileNo, emailId, dateOfBirth,
//                      category, caste, disability details, employment
//                      details, contractual details, etc.
//   - steps.step1  -> fatherName, motherName, nationality, aadhar,
//                      ID-proof, identification marks, ward-of-freedom-
//                      fighter, isDebarred, marital/spouse info, sports
//                      quota, debarment reason/board/dates, freedom
//                      fighter certificate details, and BOTH addresses.
// ============================================================

interface ApiStep0 {
  fullName?: string;
  gender?: string;
  mobileNo?: string;
  mobileNumber?: string;
  isownscribe?: string;
  emailId?: string;
  dateOfBirth?: string;
  category?: string;
  caste?: string;
  isNonCreamyLayer?: string;
  nonCreamyLayer?: string;
  categoryCertNo?: string;
  categoryCertificateNumber?: string;
  categoryIssueDate?: string;
  categoryAuthority?: string;
  domicileOfBihar?: string;
  domicileCertificateNumber?: string;
  domicileCertificateIssueDate?: string;
  domicileCertificateAuthority?: string;
  disability?: string;
  natureOfDisability?: string;
  pwdType?: string;
  disTypePersist?: string;
  natureOfDisabilityType?: string;
  pwd40Percent?: string;
  disabilityCertNo?: string;
  pwdCertificateNumber?: string;
  disabilityIssueDate?: string;
  disabilityAuthority?: string;
  isScribeRequired?: string;
  biharGovtEmployee?: string;
  numberOfAttempts?: string;
  bsscAttempts?: string;
  hasPostExperience?: string;
  contractualEmployee?: string;
  nameOfPost?: string;
  agreementCircular?: string;
  contractualFromDate?: string;
  contractualToDate?: string;
  organizationName?: string;
  departmentName?: string;
  officeOrderNo?: string;
  exServiceman?: string;
  exServicemanYears?: number;
  typeOfExOfficer?: string;
}

interface ApiStep1 {
  fatherName?: string;
  motherName?: string;
  nationality?: string;
  isMarried?: string;
  maritalStatus?: string;
  spouseName?: string;
  hasAadharCard?: string;
  aadharCardNumber?: string;
  typeOfPhotoIdProof?: string;
  idProofNo?: string;
  identificationMarkEn?: string;
  identificationMarkEn2?: string;
  isSportsQuota?: boolean | string;
  sportsLevel?: string;
  sportsAchievement?: string;
  sportsCertificateNumber?: string;
  sportsCertificateAuthority?: string;
  sportsCertificateIssueDate?: string;
  wardOfFreedomFighter?: string;
  freedomFighterCertNo?: string;
  freedomFighterAuthority?: string;
  isDebarred?: string;
  debarmentReason?: string;
  recruitmentBoard?: string;
  debarredFromDate?: string;
  debarredToDate?: string;
  corrVillage?: string;
  corrPostOffice?: string;
  corrPoliceStation?: string;
  corrDistrict?: string;
  corrState?: string;
  corrPinCode?: string;
  permVillage?: string;
  permPostOffice?: string;
  permPoliceStation?: string;
  permDistrict?: string;
  permState?: string;
  permPinCode?: string;
  sameAsPermanent?: boolean;
  // Domicile-certificate issue date sometimes only arrives split into
  // day/month/year parts here, rather than as a single formatted string
  // in step0.
  domicileIssueDateDay?: string;
  domicileIssueDateMonth?: string;
  domicileIssueDateYear?: string;

  dobDay?: string; // <-- ADD THESE
  dobMonth?: string;
  dobYear?: string;
  isownscribe?: string;
  contractualFromDay?: string;
  contractualFromMonth?: string;
  contractualFromYear?: string;
  contractualToDay?: string;
  contractualToMonth?: string;
  contractualToYear?: string;
  agreementCopy?: string;
  experienceCertificate?: string;
}

interface ApiEducationRowRaw {
  subject?: string;
  boardUniversity?: string;
  totalMarks?: string | number;
  obtainedMarks?: string | number;
  marksObtained?: string | number; // actual API field name
  certIssueDate?: string;
  certNumber?: string;
  level?: string; // e.g. "matriculation" | "intermediate" | "graduation"
  degree?: string; // e.g. "10th" | "12th"
}

interface ApiStep3 {
  // Legacy/expected flat shape (kept for backward compatibility)
  tenth?: ApiEducationRowRaw;
  twelfth?: ApiEducationRowRaw;
  graduation?: ApiEducationRowRaw;
  // Actual API shape: nested one level deeper, under `qualification`
  // (singular), keyed by tenth/twelfth/graduation.
  qualification?: {
    tenth?: ApiEducationRowRaw;
    twelfth?: ApiEducationRowRaw;
    graduation?: ApiEducationRowRaw;
  };
  // Alternate shape sometimes seen: a flat list of qualifications,
  // identified by `level`/`degree`.
  qualifications?: ApiEducationRowRaw[];
}

interface ApiStep4 {
  photograph?: string;
  signatureEnglish?: string;
  signatureHindi?: string;
  agreementCopy?: string; // <-- ADD THESE
  experienceCertificate?: string;
}

interface ApiStep5 {
  livePhoto?: string;
}

interface ApiPayment {
  // Legacy/expected field names (kept for backward compatibility)
  paymentBank?: string;
  transactionDate?: string;
  registrationFee?: string;
  // Actual API field names (found under steps.step2)
  bankName?: string;
  amount?: number | string;
  paymentMode?: string;
  paymentStatus?: string;
  paymentOrderId?: string;
  transactionId?: string;
}

interface ApiCandidateDetails {
  registrationNumber?: string;
  gender?: string;
  mobileNumber?: string;
  // Backend-computed compact duration strings, e.g. "3Y-11M-1D"
  contractualPeriod?: string;
  servicePeriod?: string;
}

interface ApiData {
  applicationId?: string;
  candidateId?: string;
  candidateDetails?: ApiCandidateDetails;
  submissionDate?: string; // actual API: top-level ISO timestamp, used as a payment-date fallback
  steps?: {
    step0?: ApiStep0;
    step1?: ApiStep1;
    step2?: ApiPayment; // actual API: payment details live here
    step3?: ApiStep3;
    step4?: ApiStep4;
    step5?: ApiStep5;
    payment?: ApiPayment; // legacy/expected location, kept for backward compatibility
  };
}

interface PDFOptions {
  save?: boolean;
}

// ============================================================
// LAYOUT CONSTANTS
// ============================================================

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 10;
const CONTENT_W = PAGE_W - MARGIN * 2;
const LABEL_W = 78;
const FOOTER_SPACE = 8;

// Path to your real logo file, served from the app's public folder
// (e.g. public/logo.png -> "/logo.png"). Change this if your file lives
// somewhere else or has a different name/extension.
const LOGO_URL = "/logo.webp";

const PHOTO_W = 26;
const PHOTO_H = 17;
const PHOTO_GAP = 1.5;
const PHOTO_PANEL_TOTAL_H = PHOTO_H * 4 + PHOTO_GAP * 3; // default/minimum panel height
const PHOTO_INSET = PHOTO_W + 2; // reserved on the right of rows drawn beside the photo panel

// ---- Watermark tuning (logo-as-watermark on every page) ----
const WATERMARK_SIZE = 130; // mm, square footprint of the watermark logo
const WATERMARK_OPACITY = 0.08; // 0 = invisible, 1 = fully opaque

// Wide-label width used for the long yes/no policy questions in the
// second personal-details block (matches the HTML's colspan=3 label rows).
const WIDE_LABEL_W = 130;

// ============================================================
// HELPERS
// ============================================================

const fmtDMY = (s: string | undefined): string => (s && s !== "0" ? s : "-");

const fmtISOToDMY = (s: string | undefined): string => {
  if (!s) return "-";
  const [y, m, d] = s.split("-");
  if (!y || !m || !d) return s;
  return `${d}-${m}-${y}`;
};

// Education cert-issue dates from the actual API come back as DD-MM-YYYY
// (e.g. "17-10-2015"), not ISO (YYYY-MM-DD). This detects which format was
// given (by checking whether the first segment is a 4-digit year) and only
// converts when it's genuinely ISO, so DD-MM-YYYY values pass through
// unchanged instead of being flipped backwards.
const fmtEduDate = (s: string | undefined): string => {
  if (!s || s === "0") return "-";
  const parts = s.split("-");
  if (parts.length !== 3) return s;
  const [a, b, c] = parts;
  if (a.length === 4) {
    // ISO yyyy-mm-dd -> dd-mm-yyyy
    return `${c}-${b}-${a}`;
  }
  // already dd-mm-yyyy
  return s;
};

const parseDMY = (s: string | undefined): Date | null => {
  if (!s) return null;
  const parts = s.split("-").map(Number);
  if (parts.length !== 3) return null;
  const [d, m, y] = parts;
  if (!d || !m || !y) return null;
  return new Date(y, m - 1, d);
};

// Builds a "DD-MM-YYYY" string from separate day/month/year parts (some
// API fields, like the domicile certificate issue date, only arrive split
// this way instead of as one formatted string).
const buildDMY = (
  day: string | undefined,
  month: string | undefined,
  year: string | undefined,
): string => {
  if (!day || !month || !year) return "-";
  return `${String(day).padStart(2, "0")}-${String(month).padStart(2, "0")}-${year}`;
};

const diffYMD = (
  fromDate: Date | null,
  toDate: Date | null,
): { years: number; months: number; days: number } | null => {
  if (!fromDate || !toDate) return null;
  let years = toDate.getFullYear() - fromDate.getFullYear();
  let months = toDate.getMonth() - fromDate.getMonth();
  let days = toDate.getDate() - fromDate.getDate();
  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(toDate.getFullYear(), toDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
};

// Parses the backend's compact duration strings, e.g. "3Y-11M-1D", into
// the same {years, months, days} shape diffYMD() produces, so it can be
// formatted with ymdLabel() directly instead of being recomputed from
// raw from/to dates.
const parseCompactYMD = (
  s: string | undefined,
): { years: number; months: number; days: number } | null => {
  if (!s) return null;
  const match = s.match(/(\d+)\s*Y-(\d+)\s*M-(\d+)\s*D/i);
  if (!match) return null;
  return {
    years: Number(match[1]),
    months: Number(match[2]),
    days: Number(match[3]),
  };
};

const ymdLabel = (
  ymd: { years: number; months: number; days: number } | null,
): string =>
  ymd ? `${ymd.years} YEARS, ${ymd.months} MONTHS, ${ymd.days} DAYS` : "-";

const yn = (v: string | boolean | undefined): string => {
  if (typeof v === "boolean") return v ? "YES" : "NO";
  if (typeof v === "string") {
    const upper = v.toUpperCase();
    if (upper === "YES" || upper === "Y" || upper === "TRUE") return "YES";
    if (upper === "NO" || upper === "N" || upper === "FALSE") return "NO";
  }
  return v ? "YES" : "NO";
};

// "English text / हिंदी टेक्स्ट" -> "English text". Falls back to the raw
// string if there's no slash (keeps ASCII-only strings intact).
const latinHalf = (s: string | undefined): string => {
  if (!s) return "-";
  const [first] = String(s).split("/");
  return first.trim() || "-";
};

// Compute a "xx.xx" percentage string from total/obtained marks when the
// API doesn't send one directly.
const computePercentage = (
  total: number | string | undefined,
  obtained: number | string | undefined,
): string => {
  const t = Number(total);
  const o = Number(obtained);
  if (!t || Number.isNaN(t) || Number.isNaN(o)) return "-";
  return ((o / t) * 100).toFixed(2);
};

// Formats a full ISO timestamp (e.g. the API's top-level `submissionDate`)
// into "DD-MM-YYYY HH:MM:SS" for display, matching the style used elsewhere
// in the slip. Returns "" (not "-") when there's nothing to format, so
// callers can chain it with `||` fallbacks cleanly.
const fmtISODateTime = (s: string | undefined): string => {
  if (!s) return "";
  const d = new Date(s);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB").replace(",", "");
};

// ------------------------------------------------------------
// Empty-value detection + row filtering.
//
// Per requirement: any personal-detail row whose value ultimately
// resolves to nothing meaningful (null/undefined/"" /the "-" placeholder)
// must simply not be printed on the PDF, rather than showing a bare "-".
// Rows that DO have real data must always be shown, regardless of how
// obscure the field is (spouse name, debarment reason, freedom-fighter
// certificate no., etc. all count).
// ------------------------------------------------------------
const isEmptyValue = (v: string | number | null | undefined): boolean => {
  if (v === null || v === undefined) return true;
  const s = String(v).trim();
  return s === "" || s === "-" || s.toLowerCase() === "null" || s.toLowerCase() === "undefined";
};

const filterRows = (
  rows: Array<[string, string | number]>,
): Array<[string, string | number]> => rows.filter(([, value]) => !isEmptyValue(value));

const AGE_REFERENCE_DATE = new Date(2025, 7, 1); // 01-08-2025

async function urlToDataURL(
  url: string | null,
  retries: number = 1,
): Promise<{ dataUrl: string; format: string } | null> {
  if (!url) return null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { mode: "cors", cache: "no-store" });
      if (!res.ok) {
        console.warn(
          `[pdfGenerator] image fetch failed (HTTP ${res.status}) attempt ${
            attempt + 1
          }/${retries + 1}:`,
          url,
        );
        continue;
      }
      const blob = await res.blob();
      if (!blob || blob.size === 0) {
        console.warn(
          `[pdfGenerator] image fetch returned an empty blob, attempt ${
            attempt + 1
          }/${retries + 1}:`,
          url,
        );
        continue;
      }
      const format = blob.type.includes("png") ? "PNG" : "JPEG";
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return { dataUrl, format };
    } catch (err) {
      console.warn(
        `[pdfGenerator] image fetch threw an error, attempt ${
          attempt + 1
        }/${retries + 1}:`,
        url,
        err,
      );
    }
  }

  return null;
}

// ============================================================
// DATA SHAPING
// ============================================================

function shapeSlipData(apiData: ApiData): SlipData {
  const step0 = apiData?.steps?.step0 || {};
  const step1 = apiData?.steps?.step1 || {};
  const step3 = apiData?.steps?.step3 || {};
  const step4 = apiData?.steps?.step4 || {};
  const step5 = apiData?.steps?.step5 || {};
  const payment = apiData?.steps?.payment || apiData?.steps?.step2 || {};
  const candidateDetails = apiData?.candidateDetails || {};

  // const dob = parseDMY(step0.dateOfBirth);
  // const ageDiff = diffYMD(dob, AGE_REFERENCE_DATE);
  // const age = ymdLabel(ageDiff);

  // ---- Build Date of Birth ----
  let dateOfBirthStr = fmtDMY(step0.dateOfBirth);
  if (dateOfBirthStr === "-") {
    dateOfBirthStr = buildDMY(step1.dobDay, step1.dobMonth, step1.dobYear);
  }
  const dob = parseDMY(dateOfBirthStr);
  const ageDiff = diffYMD(dob, AGE_REFERENCE_DATE);
  
  // Use backend age if diffYMD fails, otherwise use computed
  const age = step0.age ? `${step0.age} YEARS` : ymdLabel(ageDiff);

  // ---- Build Contractual Dates ----
  let contractualFromDate = fmtDMY(step0.contractualFromDate);
  if (contractualFromDate === "-") {
    contractualFromDate = buildDMY(step1.contractualFromDay, step1.contractualFromMonth, step1.contractualFromYear);
  }
  let contractualToDate = fmtDMY(step0.contractualToDate);
  if (contractualToDate === "-") {
    contractualToDate = buildDMY(step1.contractualToDay, step1.contractualToMonth, step1.contractualToYear);
  }

  // Prefer the backend's own pre-computed contractual-period string
  // (candidateDetails.contractualPeriod, e.g. "3Y-11M-1D") since it's
  // authoritative; fall back to computing it from the from/to dates only
  // if that's missing.
  const contractualPeriod =
    step0.contractualEmployee === "YES"
      ? ymdLabel(
          parseCompactYMD(candidateDetails.contractualPeriod) ||
            diffYMD(
              parseDMY(step0.contractualFromDate),
              parseDMY(step0.contractualToDate),
            ),
        )
      : null;

  // The actual API nests education one level deeper than expected, under
  // `steps.step3.qualification` (singular) keyed by tenth/twelfth/
  // graduation. Some responses may instead send a flat `qualifications`
  // array tagged with `level`/`degree`, or the legacy flat tenth/twelfth/
  // graduation shape directly on step3. Resolve whichever is present.
  const qualification = step3.qualification || {};
  const qualifications = step3.qualifications || [];
  const findQualification = (
    levels: string[],
    degrees: string[],
  ): ApiEducationRowRaw | undefined =>
    qualifications.find((q) => {
      const lvl = String(q?.level || "").toLowerCase();
      const deg = String(q?.degree || "").toLowerCase();
      return levels.includes(lvl) || degrees.includes(deg);
    });

  const tenthRaw: ApiEducationRowRaw =
    step3.tenth ||
    qualification.tenth ||
    findQualification(["matriculation", "10th"], ["10th"]) ||
    {};
  const twelfthRaw: ApiEducationRowRaw =
    step3.twelfth ||
    qualification.twelfth ||
    findQualification(["intermediate", "12th"], ["12th"]) ||
    {};
  const gradRaw: ApiEducationRowRaw =
    step3.graduation ||
    qualification.graduation ||
    findQualification(["graduation"], []) ||
    {};

  // Normalize field-name differences (API uses `marksObtained`, the legacy
  // shape used `obtainedMarks`) so downstream code only deals with one name.
  const normalizeObtained = (row: ApiEducationRowRaw): string | number =>
    row.obtainedMarks ?? row.marksObtained ?? "-";

  const tenthTotal = tenthRaw.totalMarks ?? "-";
  const tenthObtained = normalizeObtained(tenthRaw);
  const twelfthTotal = twelfthRaw.totalMarks ?? "-";
  const twelfthObtained = normalizeObtained(twelfthRaw);
  const gradTotal = gradRaw.totalMarks ?? "-";
  const gradObtained = normalizeObtained(gradRaw);

  // ---- marital status / spouse (step1) ----
  // The API sometimes sends a clean `maritalStatus` string and sometimes
  // only a boolean-ish `isMarried` flag; prefer maritalStatus, fall back
  // to deriving it from isMarried.
  const maritalStatus =
    step1.maritalStatus ||
    (step1.isMarried !== undefined ? (yn(step1.isMarried) === "YES" ? "MARRIED" : "UNMARRIED") : "-");
  const spouseName = step1.spouseName || "-";

  // ---- sports quota (step1) ----
  const sportsQuotaOn = yn(step1.isSportsQuota) === "YES";
  const sportsDetails = sportsQuotaOn
    ? {
        level: step1.sportsLevel || "-",
        achievement: step1.sportsAchievement || "-",
        certNo: step1.sportsCertificateNumber || "-",
        authority: step1.sportsCertificateAuthority || "-",
        issueDate: fmtDMY(step1.sportsCertificateIssueDate),
      }
    : null;

  // ---- debarment details (step1) ----
  const debarredOn = step1.isDebarred === "YES";
  const debarmentDetails = debarredOn
    ? {
        reason: step1.debarmentReason || "-",
        recruitmentBoard: step1.recruitmentBoard || "-",
        fromDate: fmtDMY(step1.debarredFromDate),
        toDate: fmtDMY(step1.debarredToDate),
      }
    : null;

  // ---- freedom fighter certificate details (step1) ----
  const freedomFighterOn = step1.wardOfFreedomFighter === "YES";
  const freedomFighterDetails = freedomFighterOn
    ? {
        certNo: step1.freedomFighterCertNo || "-",
        authority: step1.freedomFighterAuthority || "-",
      }
    : null;

  return {
    registrationNumber: apiData?.candidateDetails?.registrationNumber || "-",
    formNumber: apiData?.applicationId || apiData?.candidateId || "-",

    fullName: (step0.fullName || "").trim() || "-",
    fatherName: step1.fatherName || "-",
    motherName: step1.motherName || "-",
    gender: step0.gender || candidateDetails.gender || "-",
    mobileNo:
      step0.mobileNo ||
      step0.mobileNumber ||
      candidateDetails.mobileNumber ||
      "-",
    emailId: step0.emailId || "-",
    dateOfBirth: dateOfBirthStr,
    age,
    nationality: step1.nationality || "-",
    maritalStatus,
    spouseName,
    

    category: latinHalf(step0.category),
    caste: latinHalf(step0.caste),
    isNonCreamyLayer: yn(
      step0.isNonCreamyLayer === "YES" || step0.nonCreamyLayer === "YES",
    ),
    categoryCertNo:
      step0.categoryCertNo || step0.categoryCertificateNumber || "-",
    categoryIssueDate: fmtDMY(step0.categoryIssueDate),
    categoryAuthority: step0.categoryAuthority || "-",

    domicileOfBihar: yn(step0.domicileOfBihar === "YES"),
    domicileCertNo: step0.domicileCertificateNumber || "-",
    domicileIssueDate:
      fmtDMY(step0.domicileCertificateIssueDate) !== "-"
        ? fmtDMY(step0.domicileCertificateIssueDate)
        : buildDMY(
            step1.domicileIssueDateDay,
            step1.domicileIssueDateMonth,
            step1.domicileIssueDateYear,
          ),
    domicileAuthority: step0.domicileCertificateAuthority || "-",

    disability: yn(step0.disability === "YES"),
    disabilityDetails:
      step0.disability === "YES"
        ? {
            nature: step0.natureOfDisability || step0.pwdType || "-",
            natureType: step0.disTypePersist || step0.natureOfDisabilityType || "-",
            min40Percent: yn(step0.pwd40Percent),
            certNo: step0.disabilityCertNo || step0.pwdCertificateNumber || "-",
            issueDate: fmtDMY(step0.disabilityIssueDate),
            authority: step0.disabilityAuthority || "-",
            scribeRequired: yn(step0.isScribeRequired), // <-- FIXED
            isownscribe: yn(step1.isownscribe || step0.isownscribe) // <-- ADDED
          }
        : null,



    hasAadharCard: step1.hasAadharCard === "YES" ? "YES" : "NO",
    aadharCardNumber: step1.aadharCardNumber || "-",
    idProofType: step1.typeOfPhotoIdProof || "-",
    idProofNo: step1.idProofNo || "-",

    biharGovtEmployee: yn(step0.biharGovtEmployee === "YES"),
    numberOfAttempts: step0.numberOfAttempts ?? step0.bsscAttempts ?? "0",
    hasPostExperience: yn(step0.hasPostExperience === "YES"),

   contractualEmployee: yn(step0.contractualEmployee),
    nameOfPost: latinHalf(step0.nameOfPost),
    agreementCircular: yn(step0.agreementCircular),
    contractualFromDate, // <-- ADDED
    contractualToDate, // <-- ADDED
    contractualPeriod,
    departmentName: step0.departmentName || step0.organizationName || "-",
    officeOrderNo: step0.officeOrderNo || "-",
    agreementCopyUploaded: (step1.agreementCopy || step4.agreementCopy) ? "YES" : "NO", // <-- ADDED
    experienceCertificateUploaded: (step1.experienceCertificate || step4.experienceCertificate) ? "YES" : "NO", // <-- ADDED
    identificationMark:
      [step1.identificationMarkEn, step1.identificationMarkEn2]
        .filter(Boolean)
        .join(", ") || "-",

    exServiceman: yn(step0.exServiceman === "YES"),
    isSportsQuota: yn(sportsQuotaOn),
    sportsDetails,
    wardOfFreedomFighter: yn(step1.wardOfFreedomFighter === "YES"),
    freedomFighterDetails,
    isDebarred: yn(step1.isDebarred === "YES"),
    debarmentDetails,

    correspondenceAddress: {
      village: step1.corrVillage || "-",
      postOffice: step1.corrPostOffice || "-",
      policeStation: step1.corrPoliceStation || "-",
      district: step1.corrDistrict || "-",
      state: step1.corrState || "-",
      pinCode: step1.corrPinCode || "-",
    },
    permanentAddress: {
      village: step1.permVillage || "-",
      postOffice: step1.permPostOffice || "-",
      policeStation: step1.permPoliceStation || "-",
      district: step1.permDistrict || "-",
      state: step1.permState || "-",
      pinCode: step1.permPinCode || "-",
    },
    sameAsPermanent: !!step1.sameAsPermanent,

    education: {
      tenth: {
        subject: tenthRaw.subject || "-",
        board: tenthRaw.boardUniversity || "-",
        total: tenthTotal,
        obtained: tenthObtained,
        percentage: computePercentage(tenthTotal, tenthObtained),
        passingDate: fmtEduDate(tenthRaw.certIssueDate),
        certNo: tenthRaw.certNumber || "-",
      },
      twelfth: {
        subject: twelfthRaw.subject || "-",
        board: twelfthRaw.boardUniversity || "-",
        total: twelfthTotal,
        obtained: twelfthObtained,
        percentage: computePercentage(twelfthTotal, twelfthObtained),
        passingDate: fmtEduDate(twelfthRaw.certIssueDate),
        certNo: twelfthRaw.certNumber || "-",
      },
      graduation: {
        subject: gradRaw.subject || "-",
        board: gradRaw.boardUniversity || "-",
        total: gradTotal,
        obtained: gradObtained,
        percentage: computePercentage(gradTotal, gradObtained),
        passingDate: fmtEduDate(gradRaw.certIssueDate),
        certNo: gradRaw.certNumber || "-",
      },
    },

    payment: {
      bank: payment.bankName || payment.paymentBank || "-",
      transactionId: payment.transactionId || "-",
      transactionDate:
        payment.transactionDate ||
        fmtISODateTime(apiData?.submissionDate) ||
        "-",
      registrationFee:
        payment.registrationFee != null
          ? String(payment.registrationFee)
          : payment.amount != null
            ? String(payment.amount)
            : "-",
    },

    photograph: step4.photograph || null,
    signatureEnglish: step4.signatureEnglish || null,
    signatureHindi: step4.signatureHindi || null,
    livePhoto: step5.livePhoto || null,

    declarationDate: new Date().toLocaleString("en-GB").replace(",", ""),
  };
}

// ============================================================
// DRAWING HELPERS
// ============================================================

function ensureSpace(pdf: jsPDF, y: number, needed: number): number {
  if (y + needed > PAGE_H - MARGIN - FOOTER_SPACE) {
    pdf.addPage();
    return MARGIN;
  }
  return y;
}

function sectionHeader(pdf: jsPDF, y: number, title: string): number {
  y = ensureSpace(pdf, y, 8);
  pdf.setFillColor(220, 220, 220); // matches CSS #dcdcdc section-title background
  pdf.rect(MARGIN, y, CONTENT_W, 7, "F");
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.2);
  pdf.rect(MARGIN, y, CONTENT_W, 7);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(9.5);
  pdf.setTextColor(0);
  pdf.text(title, MARGIN + 2, y + 5);
  return y + 7;
}

interface LabelValueRowOptions {
  labelW?: number;
  /** extra space reserved on the right (e.g. while the photo panel occupies that column) */
  rightInset?: number;
}

function measureRowHeight(
  pdf: jsPDF,
  label: string,
  value: string | number,
  labelW: number,
  rowW: number,
): number {
  pdf.setFontSize(7.6);
  const valueW = rowW - labelW;
  const valueLines = pdf.splitTextToSize(String(value ?? "-"), valueW - 4);
  const labelLines = pdf.splitTextToSize(String(label), labelW - 4);
  const lines = Math.max(valueLines.length, labelLines.length, 1);
  return Math.max(6.2, lines * 3.4 + 2.6);
}

function labelValueRow(
  pdf: jsPDF,
  y: number,
  label: string,
  value: string | number,
  opts: LabelValueRowOptions = {},
): number {
  const labelW = opts.labelW ?? LABEL_W;
  const rightInset = opts.rightInset ?? 0;
  const rowW = CONTENT_W - rightInset;
  const valueW = rowW - labelW;

  pdf.setFontSize(7.6);
  const valueLines = pdf.splitTextToSize(String(value ?? "-"), valueW - 4);
  const labelLines = pdf.splitTextToSize(String(label), labelW - 4);
  const lineH = 3.4;
  const lines = Math.max(valueLines.length, labelLines.length, 1);
  const rowH = Math.max(6.2, lines * lineH + 2.6);

  y = ensureSpace(pdf, y, rowH);

  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);

  // label cell
  pdf.setFillColor(233, 233, 233);
  pdf.rect(MARGIN, y, labelW, rowH, "F");
  pdf.rect(MARGIN, y, labelW, rowH);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(0);
  pdf.text(labelLines, MARGIN + 1.5, y + 4);

  // value cell
  pdf.setFillColor(255, 255, 255);
  pdf.rect(MARGIN + labelW, y, valueW, rowH, "F");
  pdf.rect(MARGIN + labelW, y, valueW, rowH);
  pdf.setFont("helvetica", "bold");
  pdf.text(valueLines, MARGIN + labelW + 1.5, y + 4);

  return y + rowH;
}

/** Renders a set of [label, value] rows, silently skipping any row whose value is empty. */
function labelValueRows(
  pdf: jsPDF,
  y: number,
  rows: Array<[string, string | number]>,
  opts: LabelValueRowOptions = {},
): number {
  for (const [label, value] of filterRows(rows)) {
    y = labelValueRow(pdf, y, label, value, opts);
  }
  return y;
}

/** A row holding two label/value pairs side by side (e.g. "ID PROOF" + "ID PROOF NO"). */
function twoPairRow(
  pdf: jsPDF,
  y: number,
  pairs: [string, string | number, string, string | number],
  opts: { labelW1?: number; labelW2?: number } = {},
): number {
  const halfW = CONTENT_W / 2;
  const labelW1 = opts.labelW1 ?? 34;
  const labelW2 = opts.labelW2 ?? 34;
  const valueW1 = halfW - labelW1;
  const valueW2 = halfW - labelW2;

  pdf.setFontSize(7.6);
  const v1Lines = pdf.splitTextToSize(String(pairs[1] ?? "-"), valueW1 - 4);
  const v2Lines = pdf.splitTextToSize(String(pairs[3] ?? "-"), valueW2 - 4);
  const lines = Math.max(v1Lines.length, v2Lines.length, 1);
  const rowH = Math.max(6.2, lines * 3.4 + 2.6);

  y = ensureSpace(pdf, y, rowH);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);

  pdf.setFillColor(233, 233, 233);
  pdf.rect(MARGIN, y, labelW1, rowH, "F");
  pdf.rect(MARGIN, y, labelW1, rowH);
  pdf.setFont("helvetica", "normal");
  pdf.text(pairs[0], MARGIN + 1.5, y + 4);

  pdf.setFillColor(255, 255, 255);
  pdf.rect(MARGIN + labelW1, y, valueW1, rowH, "F");
  pdf.rect(MARGIN + labelW1, y, valueW1, rowH);
  pdf.setFont("helvetica", "bold");
  pdf.text(v1Lines, MARGIN + labelW1 + 1.5, y + 4);

  const x2 = MARGIN + halfW;
  pdf.setFillColor(233, 233, 233);
  pdf.rect(x2, y, labelW2, rowH, "F");
  pdf.rect(x2, y, labelW2, rowH);
  pdf.setFont("helvetica", "normal");
  pdf.text(pairs[2], x2 + 1.5, y + 4);

  pdf.setFillColor(255, 255, 255);
  pdf.rect(x2 + labelW2, y, valueW2, rowH, "F");
  pdf.rect(x2 + labelW2, y, valueW2, rowH);
  pdf.setFont("helvetica", "bold");
  pdf.text(v2Lines, x2 + labelW2 + 1.5, y + 4);

  return y + rowH;
}

async function drawPhotoPanel(
  pdf: jsPDF,
  x: number,
  y: number,
  data: SlipData,
  boxHeight: number = PHOTO_H,
): Promise<number> {
  const boxW = PHOTO_W;
  const boxH = boxHeight;
  const gap = PHOTO_GAP;
  const items = [
    { caption: ["PHOTO", "LIVE PHOTO"], url: data.livePhoto },
    { caption: ["PHOTO", "PHOTO"], url: data.photograph },
    {
      caption: ["PHOTO", "SIGNATURE", "IN ENGLISH"],
      url: data.signatureEnglish,
    },
    { caption: ["PHOTO", "SIGNATURE", "IN HINDI"], url: data.signatureHindi },
  ];

  for (let i = 0; i < items.length; i++) {
    const boxY = y + i * (boxH + gap);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);
    pdf.setFillColor(246, 246, 246);
    pdf.rect(x, boxY, boxW, boxH, "F");
    pdf.rect(x, boxY, boxW, boxH);

    const img = await urlToDataURL(items[i].url);
    if (img) {
      try {
        pdf.addImage(
          img.dataUrl,
          img.format,
          x + 0.5,
          boxY + 0.5,
          boxW - 1,
          boxH - 1,
        );
        continue;
      } catch {
        // fall through to caption-only box
      }
    }
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(5.6);
    pdf.setTextColor(120);
    const caption = items[i].caption;
    const startY = boxY + boxH / 2 - ((caption.length - 1) * 2.4) / 2 + 1;
    caption.forEach((line, li) => {
      pdf.text(line, x + boxW / 2, startY + li * 2.6, { align: "center" });
    });
    pdf.setTextColor(0);
  }

  return y + items.length * (boxH + gap);
}

function twoColAddressTable(
  pdf: jsPDF,
  y: number,
  corr: AddressData,
  perm: AddressData,
): number {
  const colW = CONTENT_W / 2;
  y = ensureSpace(pdf, y, 7);
  pdf.setFillColor(220, 220, 220);
  pdf.rect(MARGIN, y, colW, 7, "F");
  pdf.rect(MARGIN + colW, y, colW, 7, "F");
  pdf.setDrawColor(0);
  pdf.rect(MARGIN, y, colW, 7);
  pdf.rect(MARGIN + colW, y, colW, 7);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(8);
  pdf.text("CORRESPONDENCE ADDRESS", MARGIN + colW / 2, y + 4.8, {
    align: "center",
  });
  pdf.text("PERMANENT ADDRESS", MARGIN + colW + colW / 2, y + 4.8, {
    align: "center",
  });
  y += 7;

  const rows: Array<[string, keyof AddressData]> = [
    ["VILLAGE/MOHALLA:", "village"],
    ["POST OFFICE:", "postOffice"],
    ["POLICE STATION:", "policeStation"],
    ["DISTRICT:", "district"],
    ["STATE:", "state"],
    ["PIN CODE:", "pinCode"],
  ];
  const subLabelW = 30;
  const valueW = colW - subLabelW;

  for (const [label, key] of rows) {
    pdf.setFontSize(7);
    const corrLines = pdf.splitTextToSize(String(corr[key] || "-"), valueW - 3);
    const permLines = pdf.splitTextToSize(String(perm[key] || "-"), valueW - 3);
    const lines = Math.max(corrLines.length, permLines.length, 1);
    const h = Math.max(6, lines * 3.2 + 2.4);

    y = ensureSpace(pdf, y, h);

    // left (correspondence)
    pdf.setFillColor(233, 233, 233);
    pdf.rect(MARGIN, y, subLabelW, h, "F");
    pdf.rect(MARGIN, y, subLabelW, h);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(MARGIN + subLabelW, y, valueW, h, "F");
    pdf.rect(MARGIN + subLabelW, y, valueW, h);
    pdf.setFont("helvetica", "normal");
    pdf.text(label, MARGIN + 1.5, y + 4);
    pdf.setFont("helvetica", "bold");
    pdf.text(corrLines, MARGIN + subLabelW + 1.5, y + 4);

    // right (permanent)
    pdf.setFillColor(233, 233, 233);
    pdf.rect(MARGIN + colW, y, subLabelW, h, "F");
    pdf.rect(MARGIN + colW, y, subLabelW, h);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(MARGIN + colW + subLabelW, y, valueW, h, "F");
    pdf.rect(MARGIN + colW + subLabelW, y, valueW, h);
    pdf.setFont("helvetica", "normal");
    pdf.text(label, MARGIN + colW + 1.5, y + 4);
    pdf.setFont("helvetica", "bold");
    pdf.text(permLines, MARGIN + colW + subLabelW + 1.5, y + 4);

    y += h;
  }

  return y;
}

function educationTable(
  pdf: jsPDF,
  y: number,
  education: EducationData,
): number {
  // 7 columns, matching the HTML table (PERCENTAGE column removed per request).
  const headers = [
    "EDUCATION",
    "SUBJECT",
    "BOARD/UNIV.",
    "TOTAL",
    "OBTAINED",
    "PASSING DATE",
    "CERT. NO.",
  ];
  const colCount = headers.length;
  const widths = [22, 40, 30, 16, 16, 30, 36]; // sums to CONTENT_W (190)

  y = ensureSpace(pdf, y, 9);

  // ---- header row ----
  let x = MARGIN;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(6.6);
  for (let i = 0; i < colCount; i++) {
    pdf.setFillColor(220, 220, 220);
    pdf.rect(x, y, widths[i], 9, "F");
    pdf.rect(x, y, widths[i], 9);
    pdf.setTextColor(0, 0, 0);
    const lines = pdf.splitTextToSize(headers[i], widths[i] - 2);
    pdf.text(lines, x + widths[i] / 2, y + 4, { align: "center" });
    x += widths[i];
  }
  y += 9;

  // ---- body rows ----
  const rows: Array<[string, EducationRow]> = [
    ["10TH / EQUIVALENT", education.tenth],
    ["12TH/10TH +2 / EQUIVALENT", education.twelfth],
    ["GRADUATION / EQUIVALENT", education.graduation],
  ];

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6.8);

  for (const [levelLabel, d] of rows) {
    const cells: string[] = [
      levelLabel,
      d.subject,
      d.board,
      String(d.total),
      String(d.obtained),
      d.passingDate,
      d.certNo,
    ];

    const wrapped = cells.map((c, i) => pdf.splitTextToSize(c, widths[i] - 2));
    const rowH = Math.max(
      8,
      Math.max(...wrapped.map((w) => w.length)) * 3.2 + 2.6,
    );

    y = ensureSpace(pdf, y, rowH);
    x = MARGIN;
    for (let i = 0; i < colCount; i++) {
      pdf.setFillColor(255, 255, 255);
      pdf.rect(x, y, widths[i], rowH, "F");
      pdf.rect(x, y, widths[i], rowH);
      pdf.setTextColor(0, 0, 0);
      pdf.text(wrapped[i], x + widths[i] / 2, y + 4, { align: "center" });
      x += widths[i];
    }
    y += rowH;
  }

  return y;
}

function paymentSection(
  pdf: jsPDF,
  y: number,
  payment: PaymentDetails,
): number {
  y = sectionHeader(pdf, y, "PAYMENT DETAILS:");
  const rows: Array<[string, string]> = [
    ["PAYMENT BANK :", payment.bank],
    ["TRANSACTION ID :", payment.transactionId],
    ["TRANSACTION DATE :", payment.transactionDate],
    ["REGISTRATION FEE (RS.) :", payment.registrationFee],
  ];
  for (const [label, value] of rows) {
    const rowH = 6;
    y = ensureSpace(pdf, y, rowH);
    pdf.setDrawColor(0);
    pdf.setLineWidth(0.15);
    pdf.setFillColor(255, 255, 255);
    pdf.rect(MARGIN, y, CONTENT_W, rowH, "F");
    pdf.rect(MARGIN, y, CONTENT_W, rowH);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7.6);
    pdf.text(label, MARGIN + 2, y + 4);
    pdf.setFont("helvetica", "normal");
    const labelW = pdf.getTextWidth(label);
    pdf.text(String(value), MARGIN + 2 + labelW + 2, y + 4);
    y += rowH;
  }
  return y;
}

/**
 * Fallback placeholder drawn in place of the real logo when it can't be
 * fetched (e.g. offline, LOGO_URL not reachable). Simple bordered circle
 * with "LOGO" text, occupying the same bounding box the real logo uses.
 */
function drawPlaceholderLogo(
  pdf: jsPDF,
  cx: number,
  cy: number,
  r: number,
): void {
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.3);
  pdf.setFillColor(245, 245, 245);
  pdf.circle(cx, cy, r, "FD");
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(6);
  pdf.setTextColor(120);
  pdf.text("LOGO", cx, cy + 1.5, { align: "center" });
  pdf.setTextColor(0);
}

/** Draws a fixed-pattern barcode (visual only) similar to the CSS repeating-linear-gradient bars. */
function drawBarcode(
  pdf: jsPDF,
  x: number,
  y: number,
  w: number,
  h: number,
): void {
  // fixed bar-width pattern (in "units"), repeated to fill the width
  const pattern = [2, 1, 1, 1, 1, 2, 1, 2, 1, 3, 1, 2, 2, 1, 1, 2, 1, 1, 3, 1];
  const unit = w / pattern.reduce((a, b) => a + b, 0) / 3; // scale so the pattern tiles ~3x
  let cx = x;
  let black = true;
  const totalUnits = pattern.reduce((a, b) => a + b, 0) * 3;
  let unitsDrawn = 0;
  pdf.setFillColor(255, 255, 255);
  pdf.rect(x, y, w, h, "F");
  while (unitsDrawn < totalUnits && cx < x + w) {
    const barUnits = pattern[unitsDrawn % pattern.length];
    const barW = Math.min(barUnits * unit, x + w - cx);
    if (black) {
      pdf.setFillColor(0, 0, 0);
      pdf.rect(cx, y, barW, h, "F");
    }
    cx += barW;
    unitsDrawn += barUnits;
    black = !black;
  }
}

/**
 * Draws the given logo image, centered on the CURRENT page, as a large
 * translucent watermark. Uses jsPDF's graphics-state opacity so it doesn't
 * disturb any other drawing (colors/line widths are saved & restored).
 * Call this once per page, after everything else on that page is drawn,
 * so the watermark sits as a faint overlay across the whole page without
 * altering any existing layout, spacing, or content logic.
 */
function drawWatermarkOnCurrentPage(
  pdf: jsPDF,
  logo: { dataUrl: string; format: string },
): void {
  const size = WATERMARK_SIZE;
  const x = (PAGE_W - size) / 2;
  const y = (PAGE_H - size) / 2;

  try {
    // @ts-ignore - GState is provided by jsPDF at runtime for opacity control
    const GState = (pdf as any).GState;
    pdf.saveGraphicsState();
    if (GState) {
      pdf.setGState(new GState({ opacity: WATERMARK_OPACITY }));
    }
    pdf.addImage(logo.dataUrl, logo.format, x, y, size, size);
  } catch {
    // silently skip the watermark if anything goes wrong (never break the PDF)
  } finally {
    pdf.restoreGraphicsState();
  }
}

/**
 * Draws the logo watermark on every page currently in the document.
 * Safe to call multiple times / after pages have already been added.
 */
function applyWatermarkToAllPages(
  pdf: jsPDF,
  logo: { dataUrl: string; format: string } | null,
): void {
  if (!logo) return;
  const totalPages = pdf.getNumberOfPages();
  const currentPage = (pdf as any).getCurrentPageInfo
    ? (pdf as any).getCurrentPageInfo().pageNumber
    : totalPages;
  for (let p = 1; p <= totalPages; p++) {
    pdf.setPage(p);
    drawWatermarkOnCurrentPage(pdf, logo);
  }
  pdf.setPage(currentPage);
}

/**
 * Draws the registration slip as real vector text + lines (no screenshot,
 * no html2canvas). This fixes the row-squishing / mid-row page breaks you
 * get from the canvas-image approach, because every row height and every
 * page break is computed explicitly instead of being sliced out of one
 * giant bitmap. Layout mirrors the reference HTML design 1:1 (section
 * bands, photo panel, two-column address block, education table,
 * payment block, and a declaration box whose photo sits below the
 * paragraph so nothing overlaps).
 *
 * Any personal-detail field that is null/empty in the API response is
 * simply omitted from the PDF (no bare "-" rows); any field that DOES
 * have a real value is always printed, no matter how minor the field is
 * (spouse name, debarment reason/board/dates, freedom-fighter certificate
 * details, sports-quota details, etc.).
 *
 * Usage:
 *   import { generateRegistrationSlipPDF } from "./pdfGenerator";
 *   await generateRegistrationSlipPDF(apiResponseData); // apiResponseData = response.data.data
 *
 * Limitation (please read): jsPDF's built-in fonts (helvetica/times/courier)
 * only cover Latin characters. Devanagari strings (the Hindi halves of
 * bilingual fields, and the Hindi header line) will not render correctly
 * with the default font, so this draws only the Latin/English half of any
 * "English / Hindi" field, and skips pure-Hindi-only lines. If you need the
 * Hindi text to render too, embed a Unicode font (e.g. Noto Sans Devanagari)
 * via pdf.addFileToVFS + pdf.addFont — see the TODO near FONT setup below.
 */
export async function generateRegistrationSlipPDF(
  apiData: ApiData,
  opts: PDFOptions = {},
): Promise<jsPDF> {
  const data = shapeSlipData(apiData);
  const pdf = new jsPDF("p", "mm", "a4");

  // TODO (only if you need Hindi glyphs to render): embed a Devanagari font here, e.g.
  //   pdf.addFileToVFS("NotoSansDevanagari.ttf", NOTO_SANS_DEVANAGARI_BASE64);
  //   pdf.addFont("NotoSansDevanagari.ttf", "NotoDevanagari", "normal");
  //   pdf.setFont("NotoDevanagari");
  // and use that font for any field you want to show in Hindi instead of latinHalf().

  let y = MARGIN;

  // Cache of the logo image (also used for the header) so we can reuse the
  // exact same asset as a background watermark on every page, without a
  // second network fetch.
  let watermarkLogoImg: { dataUrl: string; format: string } | null = null;

  /* ---------- Header ---------- */
  const logoR = 10;
  const logoCx = MARGIN + logoR;
  const logoCy = y + logoR;

  const logoImg = await urlToDataURL(LOGO_URL);
  watermarkLogoImg = logoImg;
  if (logoImg) {
    try {
      // Same bounding box the placeholder circle used to occupy (MARGIN, y, logoR*2, logoR*2)
      // so swapping in the real logo doesn't shift anything else in the header.
      pdf.addImage(
        logoImg.dataUrl,
        logoImg.format,
        MARGIN,
        y,
        logoR * 2,
        logoR * 2,
      );
    } catch {
      drawPlaceholderLogo(pdf, logoCx, logoCy, logoR);
    }
  } else {
    drawPlaceholderLogo(pdf, logoCx, logoCy, logoR);
  }
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(5.4);
  pdf.setTextColor(51, 51, 51);

  pdf.setTextColor(0);
  pdf.setDrawColor(0);

  const titleX1 = MARGIN + 26;
  const titleX2 = PAGE_W - MARGIN - 46;
  const titleCx = (titleX1 + titleX2) / 2;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.text("BIHAR STAFF SELECTION COMMISSION", titleCx, y + 6, {
    align: "center",
  });
  pdf.setFontSize(8.5);
  pdf.text("P.O.-VETERINARY COLLEGE, PATNA - 800014", titleCx, y + 11.5, {
    align: "center",
  });
  pdf.text(
    "ADV NO.-05/25, 4th GRADUATE LEVEL COMBINED COMPETITIVE EXAM",
    titleCx,
    y + 16.5,
    { align: "center" },
  );
  // NOTE: the Hindi title line ("चतुर्थ स्नातक...") is intentionally NOT drawn here.
  // jsPDF's built-in "helvetica" font has no Devanagari glyphs, so calling pdf.text()
  // with that string renders corrupted/garbled characters instead of real Hindi text
  // (this is what caused the garbled line in the previous PDF). To show it correctly,
  // embed a Devanagari font first (see the TODO near the top of this function) and
  // switch to that font before drawing the line.

  const barcodeW = 40;
  const barcodeH = 9;
  const barcodeX = PAGE_W - MARGIN - barcodeW;
  drawBarcode(pdf, barcodeX, y, barcodeW, barcodeH);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.rect(barcodeX, y, barcodeW, barcodeH);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.5);
  pdf.setTextColor(0);
  pdf.text(data.registrationNumber, barcodeX + barcodeW / 2, y + barcodeH + 4, {
    align: "center",
  });

  y += 26;
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.4);
  pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  y += 2;

  /* ---------- Personal details ---------- */
  y = sectionHeader(pdf, y, "PERSONAL DETAILS");

  // Core identity rows (kept next to the photo panel). Marital status and
  // spouse name are included here too — they'll simply be skipped by the
  // filter below when there's no data.
  const personalRowsRaw: Array<[string, string | number]> = [
    ["REGISTRATION NO. :", data.registrationNumber],
    ["NAME OF APPLICANT :", data.fullName],
    ["FATHER'S NAME :", data.fatherName],
    ["MOTHER'S NAME :", data.motherName],
    ["GENDER :", data.gender],
    ["MARITAL STATUS :", data.maritalStatus],
    ["SPOUSE NAME :", data.spouseName],
    ["MOBILE NO. :", data.mobileNo],
    ["EMAIL ID :", data.emailId],
    ["DATE OF BIRTH :", data.dateOfBirth],
    ["AGE AS ON 01-08-2025 :", data.age],
    ["NATIONALITY :", data.nationality],
    ["CATEGORY :", data.category],
    ["DO YOU BELONG TO NON-CREAMY LAYER ? :", data.isNonCreamyLayer],
    ["CASTE :", data.caste],
    ["CATEGORY CERTIFICATE NUMBER :", data.categoryCertNo],
    ["ISSUE DATE OF CERTIFICATE :", data.categoryIssueDate],
    ["CERTIFICATE ISSUING AUTHORITY :", data.categoryAuthority],
    ["DOMICILE OF BIHAR STATE :", data.domicileOfBihar],
    ["ISSUE DATE OF DOMICILE CERTIFICATE:", data.domicileIssueDate],
    ["ISSUE NUMBER OF DOMICILE CERTIFICATE :", data.domicileCertNo],
    ["DOMICILE CERTIFICATE ISSUING AUTHORITY :", data.domicileAuthority],
    ["ARE YOU PERSON WITH DISABILITY? :", data.disability],
  ];

  // Filter out anything with no real value BEFORE measuring, so the photo
  // panel height lines up exactly with what actually gets drawn.
  const personalRows = filterRows(personalRowsRaw);

  const rowWWithPhoto = CONTENT_W - PHOTO_INSET;
  let personalBlockHeight = 0;
  for (const [label, value] of personalRows) {
    personalBlockHeight += measureRowHeight(
      pdf,
      label,
      value,
      LABEL_W,
      rowWWithPhoto,
    );
  }
  const photoBoxH = Math.max(
    PHOTO_H,
    (personalBlockHeight - PHOTO_GAP * 3) / 4,
  );

  const photoPanelX = PAGE_W - MARGIN - PHOTO_W;
  const photoPanelTop = y;
  await drawPhotoPanel(pdf, photoPanelX, photoPanelTop, data, photoBoxH);

  for (const [label, value] of personalRows) {
    y = labelValueRow(pdf, y, label, value, { rightInset: PHOTO_INSET });
  }

  if (data.disabilityDetails) {
    const d = data.disabilityDetails;
    y = labelValueRows(pdf, y, [
      ["NATURE OF DISABILITY :", d.nature],
      ["TYPE OF DISABILITY (PERMANENT/TEMPORARY) :", d.natureType],
      ["IS DISABILITY 40% OR MORE? :", d.min40Percent],
      ["DISABILITY CERTIFICATE NO. :", d.certNo],
      ["DISABILITY CERTIFICATE ISSUE DATE :", d.issueDate],
      ["DISABILITY CERTIFICATE ISSUING AUTHORITY :", d.authority],
      ["DO YOU REQUIRE A SCRIBE? :", d.scribeRequired],
      ["IS OWN SCRIBE REQUIRED? :", d.isownscribe],
    ]);
  }

  // ---- second block: full width, wide labels (matches the HTML's colspan=3 label rows) ----
  y = labelValueRow(
    pdf,
    y,
    "DO YOU HAVE AADHAR CARD? :",
    data.hasAadharCard === "YES"
      ? `YES (AADHAR CARD NUMBER: ${data.aadharCardNumber})`
      : "NO",
    { labelW: WIDE_LABEL_W },
  );

  if (!isEmptyValue(data.idProofType) || !isEmptyValue(data.idProofNo)) {
    y = twoPairRow(
      pdf,
      y,
      ["ID PROOF :", data.idProofType, "ID PROOF NO :", data.idProofNo],
      {
        labelW1: 26,
        labelW2: 26,
      },
    );
  }

  y = labelValueRows(pdf, y, [
    [
      "ARE YOU BIHAR GOVERNMENT EMPLOYEE WHO HAS RENDERED NOT LESS THAN 3 YEARS REGULAR AND CONTINUOUS SERVICE? :",
      data.biharGovtEmployee,
    ],
    [
      "IN BSSC EXAMS NUMBER OF ATTEMPTS AFTER 12-12-2022:",
      data.numberOfAttempts,
    ],
    ["DO YOU HAVE PRIOR POST EXPERIENCE? :", data.hasPostExperience],
    [
      "ARE YOU A CONTRACTUAL EMPLOYEE ON ANY OF THE POSTS MENTIONED IN THE ADVERTISEMENT IN THE BIHAR GOVERNMENT? :",
      data.contractualEmployee,
    ],
  ], { labelW: WIDE_LABEL_W });

  if (data.contractualEmployee === "YES") {
    y = labelValueRows(pdf, y, [
      ["NAME OF POST :", data.nameOfPost],
      [
        "DO YOU HAVE AGREEMENT IN THE LIGHT OF CIRCULAR NO. - 1003, DATED - 22.01.2021 OF GENERAL ADMINISTRATION DEPARTMENT, BIHAR, PATNA? :",
        data.agreementCircular,
      ],
      ["CONTRACTUAL FROM DATE :", data.contractualFromDate], // <-- ADD THIS LINE
      ["CONTRACTUAL TO DATE :", data.contractualToDate],
      [
        "CONTRACTUAL SERVICE PERIOD IN BIHAR GOVERNMENT? :",
        data.contractualPeriod ?? "-",
      ],
      ["NAME OF DEPARTMENT/OFFICE :", data.departmentName],
      ["OFFICE ORDER NUMBER :", data.officeOrderNo],
      ["AGREEMENT COPY UPLOADED :", data.agreementCopyUploaded],             // <-- ADD THIS LINE
      ["EXPERIENCE CERTIFICATE UPLOADED :", data.experienceCertificateUploaded], // <-- ADD THIS LINE
    ], { labelW: WIDE_LABEL_W });
  }

  y = labelValueRows(pdf, y, [
    ["IDENTIFICATION MARK OF THE CANDIDATE :", data.identificationMark],
    ["ARE YOU AN EX-SERVICEMAN? :", data.exServiceman],
    
  ], { labelW: WIDE_LABEL_W });

  if (data.sportsDetails) {
    const s = data.sportsDetails;
    y = labelValueRows(pdf, y, [
      ["SPORTS LEVEL :", s.level],
      ["SPORTS ACHIEVEMENT :", s.achievement],
      ["SPORTS CERTIFICATE NO. :", s.certNo],
      ["SPORTS CERTIFICATE ISSUING AUTHORITY :", s.authority],
      ["SPORTS CERTIFICATE ISSUE DATE :", s.issueDate],
    ], { labelW: WIDE_LABEL_W });
  }

  y = labelValueRow(
    pdf,
    y,
    "WARD OF FREEDOM FIGHTER? :",
    data.wardOfFreedomFighter,
    { labelW: WIDE_LABEL_W },
  );

  if (data.freedomFighterDetails) {
    const f = data.freedomFighterDetails;
    y = labelValueRows(pdf, y, [
      ["FREEDOM FIGHTER CERTIFICATE NO. :", f.certNo],
      ["FREEDOM FIGHTER CERTIFICATE ISSUING AUTHORITY :", f.authority],
    ], { labelW: WIDE_LABEL_W });
  }

  y = labelValueRow(
    pdf,
    y,
    "HAVE YOU EVER BEEN DEBARRED FROM ANY COMPETITIVE EXAMINATION (UPSC/BOARD/STATE COMMISSION/ANY OTHER)? :",
    data.isDebarred,
    { labelW: WIDE_LABEL_W },
  );

  if (data.debarmentDetails) {
    const deb = data.debarmentDetails;
    y = labelValueRows(pdf, y, [
      ["REASON FOR DEBARMENT :", deb.reason],
      ["RECRUITMENT BOARD :", deb.recruitmentBoard],
      ["DEBARRED FROM DATE :", deb.fromDate],
      ["DEBARRED TO DATE :", deb.toDate],
    ], { labelW: WIDE_LABEL_W });
  }

  /* ---------- Address ---------- */
  y = sectionHeader(pdf, y, "ADDRESS DETAILS");
  y = twoColAddressTable(
    pdf,
    y,
    data.correspondenceAddress,
    data.sameAsPermanent ? data.correspondenceAddress : data.permanentAddress,
  );

  /* ---------- Education ---------- */
  y = sectionHeader(pdf, y, "EDUCATIONAL QUALIFICATIONS");
  y = educationTable(pdf, y, data.education);

  /* ---------- Payment ---------- */
  y = paymentSection(pdf, y, data.payment);

  /* ---------- Declaration ---------- */
  y = sectionHeader(pdf, y, "DECLARATION DETAILS:");
  const declText =
    "I HEREBY DECLARE THAT THE INFORMATIONS FILLED UP ABOVE BY ME ARE TRUE AND CORRECT TO THE BEST OF MY KNOWLEDGE. " +
    "I ALSO DECLARE THAT I HAVE FILLED UP ONLY ONE APPLICATION FORM. I ALSO UNDERTAKE THAT IF ANY INFORMATION IS " +
    "FOUND OTHERWISE, I SHALL BE LIABLE FOR ANY LEGAL ACTION AND CANCELLATION OF MY CANDIDATURE.";
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.4);
  const declLines = pdf.splitTextToSize(declText, CONTENT_W - 4);
  const declTextH = declLines.length * 3.4;
  const declBoxH = Math.max(28, declTextH + 20); // extra room below the paragraph for date/accepted/photo
  y = ensureSpace(pdf, y, declBoxH);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.rect(MARGIN, y, CONTENT_W, declBoxH);
  pdf.setTextColor(0);
  pdf.text(declLines, MARGIN + 2, y + 5);

  const dateLineY = y + declTextH + 9;
  const acceptedLineY = dateLineY + 4.5;
  pdf.setFont("helvetica", "normal");
  pdf.text(`DATE : ${data.declarationDate}`, MARGIN + 2, dateLineY);
  pdf.setFont("helvetica", "bold");
  pdf.text("DECLARATION ACCEPTED : YES", MARGIN + 2, acceptedLineY);

  // Photo sits below the paragraph, beside the DATE / DECLARATION ACCEPTED
  // lines — never overlapping the declaration text above it.
  const declPhotoW = 22;
  const declPhotoH = 16;
  const declPhotoX = MARGIN + CONTENT_W - declPhotoW - 4;
  const declPhotoY = Math.min(dateLineY - 3.5, y + declBoxH - declPhotoH - 3);
  pdf.setDrawColor(68, 68, 68);
  pdf.setFillColor(246, 246, 246);
  pdf.rect(declPhotoX, declPhotoY, declPhotoW, declPhotoH, "F");
  pdf.rect(declPhotoX, declPhotoY, declPhotoW, declPhotoH);

  // const declPhoto = await urlToDataURL(data.photograph);
  const declPhoto = await urlToDataURL(data.signatureEnglish || data.signatureHindi);
  if (declPhoto) {
    try {
      pdf.addImage(
        declPhoto.dataUrl,
        declPhoto.format,
        declPhotoX + 0.5,
        declPhotoY + 0.5,
        declPhotoW - 1,
        declPhotoH - 1,
      );
    } catch {
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(6);
      pdf.setTextColor(150);
      pdf.text(
        "PHOTO",
        declPhotoX + declPhotoW / 2,
        declPhotoY + declPhotoH / 2,
        { align: "center" },
      );
      pdf.setTextColor(0);
    }
  } else {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(6);
    pdf.setTextColor(150);
    pdf.text(
      "PHOTO",
      declPhotoX + declPhotoW / 2,
      declPhotoY + declPhotoH / 2,
      { align: "center" },
    );
    pdf.setTextColor(0);
  }

  y += declBoxH;

  /* ---------- Footer note ---------- */
  y = ensureSpace(pdf, y, 8);
  pdf.setDrawColor(0);
  pdf.setLineWidth(0.15);
  pdf.rect(MARGIN, y, CONTENT_W, 8);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7.2);
  pdf.text(
    "NOTE: PLEASE KEEP YOUR REGISTRATION NO., PASSWORD, MOBILE NO AND EMAIL-ID CAREFULLY FOR FURTHER REFERENCE.",
    PAGE_W / 2,
    y + 5,
    { align: "center" },
  );

  /* ---------- Watermark (logo, faded, every page) ---------- */
  // Applied last, after all pages/content exist, so every page (including
  // ones created mid-way via ensureSpace()'s pdf.addPage()) gets the same
  // translucent logo watermark without touching any of the layout above.
  applyWatermarkToAllPages(pdf, watermarkLogoImg);

  const filename = `Registration_Slip_${data.registrationNumber}.pdf`;
  if (opts.save !== false) {
    pdf.save(filename);
  }
  return pdf;
}