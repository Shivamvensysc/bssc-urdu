import api from "./interceptor";
/* =================================================================
   SINGLE SOURCE OF TRUTH FOR ALL "APPLICATION FORM" RELATED APIs
   - Countries / States / Districts (location lookups)
   - Application bootstrap (GET /application/steps/all)
   - Step 1..5 save calls (PATCH /auth/candidate/step-N)
   - Payment initiate (POST /payment/initiate)
   - Final submit (POST /application/:id/submit-final)
================================================================= */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** Attach bearer token + JSON content-type to every authenticated call. */
export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const getMultipartHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      // "Content-Type": "multipart/form-data",
    },
    "Content-Type": "multipart/form-data",
  };
};

/* -----------------------------------------------------------------
   TYPES — modeled directly off the real API responses you shared
----------------------------------------------------------------- */

export interface Country {
  countryId: number;
  countryName: string;
  countryCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StateItem {
  stateId: number;
  countryId: number;
  stateName: string;
  stateCode: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  "state-code"?: string;
}

export interface DistrictItem {
  districtId: number;
  stateId: number;
  districtName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Step0Address {
  city: string;
  post: string;
  state: string;
  street: string;
  country: string;
  pincode: string;
  district: string;
  sameAsPermanent?: boolean;
}

/** Shape of `data.steps.step0` from GET /application/steps/all */
export interface Step0Data {
  age: number | null;
  isPwd: boolean | null;
  gender: string | null;
  address: {
    permanent: Step0Address;
    correspondence: Step0Address;
  };
  emailId: string | null;
  pwdType: string | null;
  fullName: string | null;
  postName: string | null;
  fatherName: string | null;
  motherName: string | null;
  spouseName: string | null;
  dateOfBirth: string | null; // "DD-MM-YYYY"
  declaration: boolean | null;
  nationality: string | null;
  subCategory: number | string | null;
  biharGovtEmp: string | null;
  bsscAttempts: string | null;
  hasAgreement: string | null;
  identityType: string | null;
  mainCategory: number | string | null;
  mobileNumber: string | null;
  pwd40Percent: string | null;
  maritalStatus: string | null;
  pwdPercentage: string | number | null;
  contractualEmp: string | null;
  identityNumber: string | null;
  isExServiceman: boolean | null;
  nonCreamyLayer: string | null;
  alternateNumber: string | null;
  localDistrictId: number | string | null;
  subSubCategoryId: number | string | null;
  contractualPeriod: string | null; // "0-0-0"
  exServicemanYears: string | number | null;
  isLocallyResident: boolean | null;
  sportsAchievement: string | null;
  identificationMark1: string | null;
  identificationMark2: string | null;
  isBiharDomicile: boolean | null; 
  pwdCertificateNumber: string | null;
  pwdCertificateAuthority: string | null;
  pwdCertificateIssueDate: string | null;
  categoryCertificateNumber: string | null;
  domicileCertificateNumber: string | null;
  categoryCertificateAuthority: string | null;
  categoryCertificateIssueDate: string | null;
  domicileCertificateAuthority: string | null;
  domicileCertificateIssueDate: string | null;
}

export interface CandidateDetails {
  id: string;
  userId: string;
  registrationNumber: string;
  dateOfBirth: string;
  mobileNumber: string;
  alternateNumber: string | null;
  mobileVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  createdBy: string | null;
  updatedAt: string;
  updatedBy: string | null;
  version: number;
}

/** Shape of `data.data` from GET /application/steps/all */
export interface ApplicationStepsResponse {
  applicationId: string;
  candidateId: string;
  status: string;
  currentStep: number;
  completedSteps: number[];
  isSubmitted: boolean;
  applicationReferenceNumber: string | null;
  submissionDate: string | null;
  candidateDetails: CandidateDetails;
  steps: {
    step0: Step0Data | null;
    step1: any | null;
    step2: any | null;
    step3: any | null;
    step4: any | null;
    step5: any | null;
    step6: any | null;
    step7: any | null;
    step8: any | null;
  };
}

/* -----------------------------------------------------------------
   LOCATION APIs — Country / State / District lookups
   (Not wired into the current free-text address inputs yet — kept
   here so AddressFields can be switched to selects later without
   touching the API layer again.)
----------------------------------------------------------------- */
export const locationApi = {
  getCountries: () =>
    api.get<{ success: boolean; message: string; data: Country[] }>(
      `${API_BASE_URL}/countries`,
    ),

  getStatesByCountry: (countryId: number) =>
    api.get<{ success: boolean; message: string; data: StateItem[] }>(
      `${API_BASE_URL}/countries/${countryId}/states`,
    ),

  getDistrictsByState: (stateId: number) =>
    api.get<{ success: boolean; message: string; data: DistrictItem[] }>(
      `${API_BASE_URL}/states/${stateId}/districts`,
    ),
};

/* -----------------------------------------------------------------
   APPLICATION WIZARD APIs — bootstrap + step saves + final submit
----------------------------------------------------------------- */
export const applicationApi = {
  /** GET /application/steps/all — bootstraps applicationId, candidateId,
   *  currentStep, completedSteps, and every previously-saved step
   *  (including the step0 registration snapshot used for auto-fill). */
  getApplicationSteps: () =>
    api.get<{ success: boolean; data: ApplicationStepsResponse }>(
      `${API_BASE_URL}/application/steps/all`,
      getAuthHeaders(),
    ),

  saveStep1: (data: any) =>
    api.patch(`${API_BASE_URL}/auth/candidate/step-1`, data, getAuthHeaders()),

  saveStep2: (data: any) =>
    api.patch(`${API_BASE_URL}/auth/candidate/step-2`, data, getAuthHeaders()),

  saveStep3: (data: any) =>
    api.patch(`${API_BASE_URL}/auth/candidate/step-3`, data, getAuthHeaders()),

  saveStep4: (data: any) =>
    api.patch(`${API_BASE_URL}/auth/candidate/step-4`, data, getMultipartHeaders()),

  /** payload should include the live-photo upload link (data URL / file URL). */
  saveStep5: (data: any) =>
    api.post(`${API_BASE_URL}/auth/candidate/step-5`, data, getMultipartHeaders()),

  submitApplicationFinal: (applicationId: string) =>
    api.post(
      `${API_BASE_URL}/application/${applicationId}/submit-final`,
      {applicationId},
      getAuthHeaders(),
    ),
};

/* -----------------------------------------------------------------
   PAYMENT API
----------------------------------------------------------------- */
// export const paymentApi = {
//   /** POST /payment/initiate — used both as a fee probe on Step 2 mount
//    *  and (with the same call) to actually kick off the gateway order. */
//   initiate: (applicationId: string, paymentMode: string = "online") =>
//     api.post(
//       `${API_BASE_URL}/payment/initiate`,
//       { applicationId, paymentMode },
//       getAuthHeaders(),
//     ),
// };

export const paymentApi = {
  /** POST /payment/initiate — used both as a fee probe on Step 2 mount
   *  and (with the same call) to actually kick off the gateway order. */
  initiate: (payload: { applicationId: string; paymentMode: string; gatewayChoice: string }) =>
    api.post(
      `${API_BASE_URL}/payment/initiate`,
      payload,
      getAuthHeaders(),
    ),
};