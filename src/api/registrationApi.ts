/**
 * registrationApi.ts
 * -------------------
 * All network calls used by the Candidate Registration form live here.
 * The component should never call `axios` directly — it imports the
 * functions/types below instead. This keeps the form component focused on
 * UI + validation, and gives you one place to change the base URL, add
 * auth headers, retry logic, etc.
 */

import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/* ---------------------------------------------------------------
   TYPES
--------------------------------------------------------------- */

export interface Category {
  value: number;
  label: string;
  subCategories: Category[];
}

export interface CategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  total: number;
}

export interface CaptchaResponse {
  success: boolean;
  message: string;
  captchaId: string;
  captchaSvg: string;
}

export interface CaptchaValidateResponse {
  success: boolean;
  message: string;
}

export interface ExOfficerType {
  value: number;
  label: string;
}

export interface ExOfficerResponse {
  success: boolean;
  message: string;
  data: ExOfficerType[];
  total: number;
}

export interface Disability {
  id: number;
  code: string;
  name: string;
}

export interface DisabilitiesResponse {
  success: boolean;
  message: string;
  data: Disability[];
  total: number;
}

/* ---------------------------------------------------------------
   CALLS
   Each function throws a plain Error (with the backend's `message` when
   available) on failure, matching the error-handling the form component
   already expects in its try/catch blocks.
--------------------------------------------------------------- */

/** Fetch the full category / sub-category (caste) tree. */
export async function fetchCategoriesApi(): Promise<Category[]> {
  const response = await axios.get<CategoriesResponse>(`${BASE_URL}/categories`);
  const body = response.data;
  if (!response.status || !body.success) {
    throw new Error(body.message || "Failed to load categories");
  }
  return body.data;
}

/** Fetch the ex-serviceman / officer type list. */
export async function fetchExOfficerTypesApi(): Promise<ExOfficerType[]> {
  const response = await axios.get<ExOfficerResponse>(
    `${BASE_URL}/public/type-of-ex-officer`,
  );
  const body = response.data;
  if (!response.status || !body.success) {
    throw new Error(body.message || "Failed to load ex-officer types");
  }
  return body.data;
}

/** Fetch the disability type list. */
export async function fetchDisabilitiesApi(): Promise<Disability[]> {
  const response = await axios.get<DisabilitiesResponse>(`${BASE_URL}/disabilities`);
  const body = response.data;
  if (!response.status || !body.success) {
    throw new Error(body.message || "Failed to load disabilities");
  }
  return body.data;
}

/** Request a new CAPTCHA challenge (id + inline SVG markup). */
export async function fetchCaptchaApi(): Promise<{
  captchaId: string;
  captchaSvg: string;
}> {
  const response = await axios.get<CaptchaResponse>(`${BASE_URL}/auth/captcha`);
  const body = response.data;
  if (!response.status || !body.success) {
    throw new Error(body.message || "Failed to load CAPTCHA");
  }
  return { captchaId: body.captchaId, captchaSvg: body.captchaSvg };
}

/**
 * Validate the candidate's typed CAPTCHA answer against a captchaId.
 * Returns the raw response (success/message) rather than throwing, so the
 * caller can decide whether to show an inline error and re-fetch a new
 * CAPTCHA — same behaviour the form relied on before.
 */
export async function validateCaptchaApi(
  captchaId: string,
  captchaText: string,
): Promise<CaptchaValidateResponse> {
  const response = await axios.post<CaptchaValidateResponse>(
    `${BASE_URL}/auth/captcha/validate`,
    { captchaId, captchaText },
    { headers: { "Content-Type": "application/json" } },
  );
  return response.data;
}
