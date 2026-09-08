import type { Step0Data, Step0Address } from "./applicationFormApi";

type DatePart = "day" | "month" | "year";

/** "16-10-1999" (DD-MM-YYYY) -> { day: "16", month: "10", year: "1999" } */
const splitDDMMYYYY = (val?: string | null): Record<string, string> | null => {
  if (!val) return null;
  const parts = val.split(/[-/]/).map((p) => p.trim());
  if (parts.length !== 3) return null;
  const [day, month, year] = parts;
  if (!day || !month || !year) return null;
  return { day, month, year };
};

/** Accepts either "DD-MM-YYYY" or ISO "YYYY-MM-DD"/"YYYY-MM-DDTHH:mm:ssZ". */
const splitAnyDate = (val?: string | null): Record<string, string> | null => {
  if (!val) return null;
  if (val.includes("T") || /^\d{4}-\d{2}-\d{2}$/.test(val)) {
    const [year, month, day] = val.slice(0, 10).split("-");
    if (!year || !month || !day) return null;
    return { day, month, year };
  }
  return splitDDMMYYYY(val);
};

const addDatePrefix = (
  target: Record<string, any>,
  prefix: string,
  parts: Record<string, string> | null,
) => {
  if (!parts) return;
  (Object.keys(parts) as DatePart[]).forEach((part) => {
    target[`${prefix}${part[0].toUpperCase()}${part.slice(1)}`] = parts[part];
  });
};

/** "YES" | "NO" pass-through helper for boolean fields from step0. */
const boolToYesNo = (val: boolean | null | undefined): string | undefined => {
  if (val === true) return "YES";
  if (val === false) return "NO";
  return undefined;
};

const mapMaritalStatus = (val?: string | null): string | undefined => {
  if (!val) return undefined;
  const v = val.toUpperCase();
  if (v.includes("MARRIED") && !v.includes("UN")) return "YES";
  if (v.includes("UNMARRIED") || v.includes("SINGLE")) return "NO";
  return undefined;
};

const mapAddress = (
  target: Record<string, any>,
  prefix: "perm" | "corr",
  addr?: Step0Address | null,
) => {
  if (!addr) return;
  // Step1 address shape: Village / PoliceStation / PostOffice / District / State / PinCode
  if (addr.street) target[`${prefix}Village`] = addr.street;
  if (addr.post) target[`${prefix}PostOffice`] = addr.post;
  if (addr.district) target[`${prefix}District`] = addr.district;
  if (addr.state) target[`${prefix}State`] = addr.state;
  if (addr.pincode) target[`${prefix}PinCode`] = addr.pincode;
};

export const mapStep0ToStep1 = (
  step0?: Step0Data | null,
): Record<string, any> => {
  if (!step0) return {};

  const out: Record<string, any> = {};

  // ---- Basic information ----
  if (step0.fullName) out.applicantName = step0.fullName;
  if (step0.fatherName) out.fatherName = step0.fatherName;
  if (step0.motherName) out.motherName = step0.motherName;
  if (step0.gender) out.gender = step0.gender.toUpperCase();
  if (step0.nationality) {
    const nat = step0.nationality.toUpperCase();
    out.nationality = nat === "INDIAN" ? "INDIAN" : "OTHER";
    if (out.nationality === "OTHER") out.otherNationality = step0.nationality;
  }
  if (step0.emailId) out.emailId = step0.emailId;
  if (step0.mobileNumber) {
    out.mobileNo = step0.mobileNumber;
    out.confirmMobileNo = step0.mobileNumber;
  }

  addDatePrefix(out, "dob", splitDDMMYYYY(step0.dateOfBirth));

  // ---- Marital status ----
  const married = mapMaritalStatus(step0.maritalStatus);
  if (married) out.isMarried = married;
  if (step0.spouseName) out.spouseName = step0.spouseName;

  // ---- Category / reservation ----
  if (step0.mainCategory !== null && step0.mainCategory !== undefined && step0.mainCategory !== "") {
    // Step1 resolves the human-readable `category` label from this id
    // once the /categories lookup has loaded.
    out.categoryId = String(step0.mainCategory);
  }
  if (step0.subCategory !== null && step0.subCategory !== undefined && step0.subCategory !== "") {
    out.casteId = String(step0.subCategory);
  }
  if (step0.nonCreamyLayer) out.isNonCreamyLayer = step0.nonCreamyLayer;
  if (step0.categoryCertificateNumber) out.categoryCertNo = step0.categoryCertificateNumber;
  if (step0.categoryCertificateAuthority) out.categoryAuthority = step0.categoryCertificateAuthority;
  addDatePrefix(out, "categoryIssueDate", splitAnyDate(step0.categoryCertificateIssueDate));

  // ---- Domicile ----
  // step0 doesn't carry an explicit "domicile of Bihar" flag, so it's
  // intentionally left for the candidate to confirm — it gates the
  // age-relaxation rules and shouldn't be guessed.
  if (step0.isBiharDomicile !== undefined && step0.isBiharDomicile !== null) {
  out.domicileOfBihar = step0.isBiharDomicile ? "YES" : "NO";
}
  if (step0.domicileCertificateNumber) out.domicileCertNo = step0.domicileCertificateNumber;
  if (step0.domicileCertificateAuthority) out.domicileAuthority = step0.domicileCertificateAuthority;
  addDatePrefix(out, "domicileIssueDate", splitAnyDate(step0.domicileCertificateIssueDate));

  // ---- Disability ----
  const disability = boolToYesNo(step0.isPwd);
  if (disability) out.disability = disability;
  if (step0.pwdType) out.natureOfDisability = step0.pwdType;
  if (step0.pwd40Percent) out.disabilityPercent = step0.pwd40Percent;
  if (step0.pwdCertificateNumber) out.disabilityCertNo = step0.pwdCertificateNumber;
  if (step0.pwdCertificateAuthority) out.disabilityAuthority = step0.pwdCertificateAuthority;
  addDatePrefix(out, "disabilityIssueDate", splitAnyDate(step0.pwdCertificateIssueDate));

  // ---- Ex-serviceman / NCC ----
  const exServiceman = boolToYesNo(step0.isExServiceman);
  if (exServiceman) out.exServiceman = exServiceman;


  // ---- Employment status ----
  if (step0.biharGovtEmp) out.biharGovtEmployee = step0.biharGovtEmp;
  if (step0.bsscAttempts) out.numberOfAttempts = step0.bsscAttempts;
  if (step0.contractualEmp) out.contractualEmployee = step0.contractualEmp;
  if (step0.hasAgreement) out.agreementCircular = step0.hasAgreement;
  if (step0.postName) out.nameOfPost = step0.postName;

  // ---- ID proof ----
  if (step0.identityType) {
    const type = step0.identityType.toLowerCase();
    if (type === "aadhaar" || type === "aadhar") {
      out.hasAadharCard = "YES";
      out.typeOfPhotoIdProof = "AADHAR";
      if (step0.identityNumber) {
        out.aadharCardNumber = step0.identityNumber;
        out.idProofNo = step0.identityNumber;
      }
    } else {
      out.typeOfPhotoIdProof = step0.identityType.toUpperCase();
      if (step0.identityNumber) out.idProofNo = step0.identityNumber;
    }
  }

  // ---- Identification marks ----
  if (step0.identificationMark1) out.identificationMarkEn = step0.identificationMark1;
  if (step0.identificationMark2) out.identificationMarkEn2 = step0.identificationMark2;

  // ---- Addresses ----
  mapAddress(out, "perm", step0.address?.permanent);
  if (step0.address?.correspondence?.sameAsPermanent) {
    out.sameAsPermanent = true;
    mapAddress(out, "corr", step0.address?.permanent);
  } else {
    mapAddress(out, "corr", step0.address?.correspondence);
  }

  return out;
};

export default mapStep0ToStep1;
