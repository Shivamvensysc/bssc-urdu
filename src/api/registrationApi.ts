import api from "./interceptor";
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

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

/** Fetch the full category / sub-category (caste) tree. */
export async function fetchCategoriesApi(): Promise<Category[]> {
  const response = await api.get<CategoriesResponse>(`${BASE_URL}/categories`);
  const body = response.data;
  if (!response.status || !body.success) {
    throw new Error(body.message || "Failed to load categories");
  }
  return body.data;
}

/** Fetch the ex-serviceman / officer type list. */
export async function fetchExOfficerTypesApi(): Promise<ExOfficerType[]> {
  const response = await api.get<ExOfficerResponse>(
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
  const response = await api.get<DisabilitiesResponse>(`${BASE_URL}/disabilities`);
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
  const response = await api.get<CaptchaResponse>(`${BASE_URL}/auth/captcha`);
  const body = response.data;
  if (!response.status || !body.success) {
    throw new Error(body.message || "Failed to load CAPTCHA");
  }
  return { captchaId: body.captchaId, captchaSvg: body.captchaSvg };
}

export async function validateCaptchaApi(
  captchaId: string,
  captchaText: string,
): Promise<CaptchaValidateResponse> {
  try {
    const response = await api.post<CaptchaValidateResponse>(
      `${BASE_URL}/auth/captcha/validate`,
      { captchaId, captchaText },
      { headers: { "Content-Type": "application/json" } },
    );
    return response.data;
  } catch (error: any) {
    // This extracts your backend message before passing it to the component
    throw new Error(error.response?.data?.message || error.message || "Failed to validate CAPTCHA");
  }
}


export const initiateCandidateApi = async (email: string, mobileNumber: string, fullName: string, password: string) => {
  try {
    const response = await api.post(`${BASE_URL}/auth/candidate/initiate`, {
      email,
      mobileNumber,
      fullName,
      password
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to initiate registration");
  }
};

export const verifyOtpApi = async (zitadelUserId: string, type: "email" | "phone", otpCode: string) => {
  try {
    const response = await api.post(`${BASE_URL}/auth/candidate/verify-otp`, {
      zitadelUserId,
      type,
      otpCode
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || `Failed to verify ${type} OTP`);
  }
};

export const finalizeRegistrationApi = async (payload: any) => {
  try {
    const response = await api.post(`${BASE_URL}/auth/candidate/finalize`, payload);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || error.message || "Failed to finalize registration");
  }
};