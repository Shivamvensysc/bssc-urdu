// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import axios from "axios";
// import {
//   Mail,
//   Shield,
//   RefreshCw,
//   AlertCircle,
//   ArrowRight,
//   Search,
//   CheckCircle2,
// } from "lucide-react";

// // BASE_URL for API requests
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// // Type definitions for API responses
// interface CaptchaResponse {
//   success: boolean;
//   message?: string;
//   captchaId: string;
//   captchaSvg: string;
// }

// interface CaptchaValidateResponse {
//   success: boolean;
//   message?: string;
// }

// interface ForgotRegistrationResponse {
//   success: boolean;
//   message: string;
// }

// // Import colors from registration page design system
// const INK = "#12233F";
// const INK_SOFT = "#5B6B84";
// const PAPER = "#F4F5F2";
// const CARD = "#FFFFFF";
// const LINE = "#DBDFE6";
// const OCHRE = "#B9722E";
// const OCHRE_DEEP = "#8F5522";
// const DANGER = "#B3432B";
// const SUCCESS = "#2E7D32";

// const formSchema = z.object({
//   email: z.string().min(1, "Email is required").email("Enter a valid email"),
//   captcha: z.string().min(1, "Captcha is required"),
// });

// type FormData = z.infer<typeof formSchema>;

// const Spinner = () => (
//   <svg
//     className="animate-spin h-5 w-5"
//     xmlns="http://www.w3.org/2000/svg"
//     fill="none"
//     viewBox="0 0 24 24"
//   >
//     <circle
//       className="opacity-20"
//       cx="12"
//       cy="12"
//       r="10"
//       stroke="currentColor"
//       strokeWidth="4"
//     />
//     <path
//       className="opacity-100"
//       fill="currentColor"
//       d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
//     />
//   </svg>
// );

// const BSSCForgotRegistration: React.FC = () => {
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState<string>("");

//   // CAPTCHA State Variables
//   const [captchaId, setCaptchaId] = useState<string>("");
//   const [captchaSvg, setCaptchaSvg] = useState<string>("");
//   const [captcha, setCaptcha] = useState<string>("");
//   const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
//   const [isValidatingCaptcha, setIsValidatingCaptcha] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     setValue,
//     clearErrors,
//     reset,
//     setError: setFormError,
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//     mode: "onBlur",
//     defaultValues: {
//       email: "",
//       captcha: "",
//     },
//   });

//   // ── CAPTCHA helpers ───────────────────────────────────────────
//   const fetchCaptcha = async () => {
//     try {
//       setCaptchaLoading(true);
//       const response = await axios.get<CaptchaResponse>(
//         `${BASE_URL}/auth/captcha`
//       );
//       const data = response.data;

//       if (!data.success) {
//         throw new Error(data.message || "Failed to load CAPTCHA");
//       }

//       setCaptchaId(data.captchaId);
//       setCaptchaSvg(data.captchaSvg);
//       setCaptcha("");
//       setValue("captcha", "");
//       setError("");
//     } catch (error: any) {
//       console.error("CAPTCHA error:", error);
//       setError(error?.response?.data?.message || error?.message || "Failed to load CAPTCHA. Please refresh.");
//     } finally {
//       setCaptchaLoading(false);
//     }
//   };

//   const validateCaptcha = async (): Promise<boolean> => {
//     if (!captchaId) {
//       setError("Please refresh CAPTCHA");
//       return false;
//     }

//     if (!captcha.trim()) {
//       setError("Please enter CAPTCHA");
//       return false;
//     }

//     try {
//       setIsValidatingCaptcha(true);
//       const response = await axios.post<CaptchaValidateResponse>(
//         `${BASE_URL}/auth/captcha/validate`,
//         {
//           captchaId: captchaId,
//           captchaText: captcha.trim(),
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       const data = response.data;

//       if (!data.success) {
//         const errorMsg = data.message || "Invalid CAPTCHA. Please try again.";
//         setError(errorMsg);
//         setFormError("captcha", { type: "manual", message: errorMsg });
//         await fetchCaptcha();
//         return false;
//       }

//       return true;
//     } catch (error: any) {
//       console.error("CAPTCHA validation error:", error);
//       const errorMsg = error?.response?.data?.message || error?.message || "Failed to validate CAPTCHA";
//       setError(errorMsg);
//       setFormError("captcha", { type: "manual", message: errorMsg });
//       await fetchCaptcha();
//       return false;
//     } finally {
//       setIsValidatingCaptcha(false);
//     }
//   };

//   useEffect(() => {
//     fetchCaptcha();
//   }, []);

//   const handleRefreshCaptcha = () => {
//     fetchCaptcha();
//   };

//   const onSubmit = async (data: FormData) => {
//     // Clear previous feedback states
//     setSuccessMessage("");
//     setError("");

//     // Validate CAPTCHA before submitting form payload
//     const isCaptchaValid = await validateCaptcha();
//     if (!isCaptchaValid) return;

//     try {
//       setLoading(true);

//       // Endpoint path structure matching the target public endpoint architecture
//       const response = await axios.post<ForgotRegistrationResponse>(
//         `${BASE_URL}/public/forgot-registration-number`,
//         {
//           email: data.email,
//         },
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (response.data.success) {
//         setSuccessMessage(response.data.message);
//         // Clear inputs upon successful processing loop
//         reset({ email: "", captcha: "" });
//         setCaptcha("");
//       } else {
//         setError(response.data.message || "Something went wrong. Please try again.");
//         await fetchCaptcha();
//       }
//     } catch (err: any) {
//       console.error("Forgot registration error:", err);
//       setError(
//         err?.response?.data?.message || 
//         "An error occurred while processing your request. Please try again later."
//       );
//       await fetchCaptcha();
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen px-4  pb-4 flex flex-col items-center justify-center gap-6"
//       style={{ background: PAPER }}
//     >
//       <div className="w-full max-w-[600px]">
//         <div
//           className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 "
//           style={{ background: CARD, borderColor: LINE }}
//         >
//           {/* Header */}
//           <div className="text-center mb-4">
//             <div className="flex items-center justify-center gap-2 mb-1">
//               <div
//                 className="h-10 w-10 rounded-full flex items-center justify-center"
//                 style={{ background: `${INK}10` }}
//               >
//                 <Search className="h-6 w-6" style={{ color: INK }} />
//               </div>
//             </div>
//             <h2
//               className="text-[24px] md:text-[26px] font-bold"
//               style={{ color: INK }}
//             >
//               Forgot Registration Number
//             </h2>
//             <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
//               Enter your details below to recover your registration number
//             </p>
//           </div>

//           {/* Success Notification Alert banner */}
//           {successMessage && (
//             <div 
//               className="mb-4 p-4 border rounded-lg flex items-start gap-2.5 text-[14px]"
//               style={{ borderColor: `${SUCCESS}40`, background: `${SUCCESS}10`, color: SUCCESS }}
//             >
//               <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
//               <div>
//                 <span className="font-bold">Success!</span> {successMessage}
//               </div>
//             </div>
//           )}

//           {/* Global API Form Fallback Error banner */}
//           {error && !errors.captcha && (
//             <div 
//               className="mb-4 p-4 border rounded-lg flex items-start gap-2.5 text-[14px]"
//               style={{ borderColor: `${DANGER}40`, background: `${DANGER}10`, color: DANGER }}
//             >
//               <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
//               <div>
//                 <span className="font-bold">Error:</span> {error}
//               </div>
//             </div>
//           )}

//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
//             {/* Email Field */}
//             <div>
//               <label
//                 className="block text-[14px] font-semibold mb-2"
//                 style={{ color: INK }}
//               >
//                 <span style={{ color: DANGER }}>*</span> Email ID
//               </label>
//               <div className="relative">
//                 <span
//                   className="absolute left-4 top-1/2 -translate-y-1/2"
//                   style={{ color: INK_SOFT }}
//                 >
//                   <Mail size={18} />
//                 </span>
//                 <input
//                   {...register("email")}
//                   type="email"
//                   className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
//                   style={{ borderColor: LINE, color: INK }}
//                   placeholder="Enter your registered email"
//                   onFocus={(e) => (e.target.style.borderColor = OCHRE)}
//                   onBlur={(e) => (e.target.style.borderColor = LINE)}
//                 />
//               </div>
//               {errors.email && (
//                 <p
//                   className="flex items-center gap-1 text-xs mt-1.5"
//                   style={{ color: DANGER }}
//                 >
//                   <AlertCircle className="h-3 w-3" />
//                   {errors.email.message}
//                 </p>
//               )}
//             </div>

//             {/* Captcha Section */}
//             <div
//               className="border rounded-lg p-4"
//               style={{ borderColor: LINE, background: PAPER }}
//             >
//               <div className="flex justify-between items-center mb-3">
//                 <span
//                   className="text-[13px] font-semibold flex items-center gap-2"
//                   style={{ color: INK_SOFT }}
//                 >
//                   <Shield size={16} />
//                   Security Verification
//                 </span>
//                 <button
//                   type="button"
//                   onClick={handleRefreshCaptcha}
//                   disabled={captchaLoading}
//                   className="flex items-center gap-1 text-[11px] font-bold transition-colors disabled:opacity-50"
//                   style={{ color: OCHRE_DEEP }}
//                 >
//                   <RefreshCw size={12} className={captchaLoading ? "animate-spin" : ""} />
//                   Refresh
//                 </button>
//               </div>

//               <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
//                 {/* SVG Render Box */}
//                 <div
//                   className="w-full sm:w-[180px] min-h-[55px] border rounded-lg flex items-center justify-center overflow-hidden px-2 relative"
//                   style={{ background: CARD, borderColor: LINE }}
//                 >
//                   {captchaLoading ? (
//                     <Spinner />
//                   ) : captchaSvg ? (
//                     <div
//                       className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto"
//                       dangerouslySetInnerHTML={{ __html: captchaSvg }}
//                     />
//                   ) : (
//                     <span className="text-xs text-gray-400">No CAPTCHA</span>
//                   )}
//                 </div>

//                 <div className="flex-1 relative">
//                   <input
//                     {...register("captcha")}
//                     type="text"
//                     value={captcha}
//                     placeholder="Enter CAPTCHA code"
//                     className="w-full h-[48px] border rounded-lg px-4 text-[15px] outline-none transition-colors"
//                     style={{ borderColor: LINE, color: INK }}
//                     onFocus={(e) => (e.target.style.borderColor = OCHRE)}
//                     onBlur={(e) => {
//                       e.target.style.borderColor = LINE;
//                       register("captcha").onBlur(e);
//                     }}
//                     onChange={(e) => {
//                       setCaptcha(e.target.value);
//                       setValue("captcha", e.target.value);
//                       if (error) setError("");
//                       clearErrors("captcha");
//                     }}
//                   />
//                 </div>
//               </div>

//               {/* CAPTCHA Error Display */}
//               {(errors.captcha || (error && errors.captcha)) && (
//                 <p
//                   className="flex items-center gap-1 text-xs mt-2"
//                   style={{ color: DANGER }}
//                 >
//                   <AlertCircle className="h-3 w-3" />
//                   {errors.captcha?.message || error}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <button
//               disabled={loading || isValidatingCaptcha || captchaLoading}
//               type="submit"
//               className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//               style={{ background: loading || isValidatingCaptcha ? INK_SOFT : INK }}
//             >
//               {loading || isValidatingCaptcha ? (
//                 <>
//                   <Spinner />
//                   Processing...
//                 </>
//               ) : (
//                 <>
//                   <ArrowRight size={18} />
//                   Submit
//                 </>
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BSSCForgotRegistration;

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Mail,
  Shield,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Search,
  CheckCircle2,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// BASE_URL for API requests
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Type definitions for API responses
interface CaptchaResponse {
  success: boolean;
  message?: string;
  captchaId: string;
  captchaSvg: string;
}

interface CaptchaValidateResponse {
  success: boolean;
  message?: string;
}

interface ForgotRegistrationResponse {
  success: boolean;
  message: string;
}

// Import colors from registration page design system
const INK = "#12233F";
const INK_SOFT = "#5B6B84";
const PAPER = "#F4F5F2";
const CARD = "#FFFFFF";
const LINE = "#DBDFE6";
const OCHRE = "#B9722E";
const OCHRE_DEEP = "#8F5522";
const DANGER = "#B3432B";
const SUCCESS = "#2E7D32";

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  captcha: z.string().min(1, "Captcha is required"),
});

type FormData = z.infer<typeof formSchema>;

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-20"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-100"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const BSSCForgotRegistration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // CAPTCHA State Variables
  const [captchaId, setCaptchaId] = useState<string>("");
  const [captchaSvg, setCaptchaSvg] = useState<string>("");
  const [captcha, setCaptcha] = useState<string>("");
  const [captchaLoading, setCaptchaLoading] = useState<boolean>(false);
  const [isValidatingCaptcha, setIsValidatingCaptcha] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    reset,
    setError: setFormError,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      captcha: "",
    },
  });

  // ── CAPTCHA helpers ───────────────────────────────────────────
  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const response = await axios.get<CaptchaResponse>(
        `${BASE_URL}/auth/captcha`
      );
      const data = response.data;

      if (!data.success) {
        throw new Error(data.message || "Failed to load CAPTCHA");
      }

      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.captchaSvg);
      setCaptcha("");
      setValue("captcha", "");
      setError("");
    } catch (error: any) {
      console.error("CAPTCHA error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to load CAPTCHA. Please refresh.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const validateCaptcha = async (): Promise<boolean> => {
    if (!captchaId) {
      const errorMsg = "Please refresh CAPTCHA";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    if (!captcha.trim()) {
      const errorMsg = "Please enter CAPTCHA";
      setError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    try {
      setIsValidatingCaptcha(true);
      const response = await axios.post<CaptchaValidateResponse>(
        `${BASE_URL}/auth/captcha/validate`,
        {
          captchaId: captchaId,
          captchaText: captcha.trim(),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;

      if (!data.success) {
        const errorMsg = data.message || "Invalid CAPTCHA. Please try again.";
        setError(errorMsg);
        setFormError("captcha", { type: "manual", message: errorMsg });
        toast.error(errorMsg);
        await fetchCaptcha();
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("CAPTCHA validation error:", error);
      const errorMsg = error?.response?.data?.message || error?.message || "Failed to validate CAPTCHA";
      setError(errorMsg);
      setFormError("captcha", { type: "manual", message: errorMsg });
      toast.error(errorMsg);
      await fetchCaptcha();
      return false;
    } finally {
      setIsValidatingCaptcha(false);
    }
  };

  useEffect(() => {
    fetchCaptcha();
  }, []);

  const handleRefreshCaptcha = () => {
    fetchCaptcha();
  };

  const onSubmit = async (data: FormData) => {
    // Clear previous feedback states
    setSuccessMessage("");
    setError("");

    // Validate CAPTCHA before submitting form payload
    const isCaptchaValid = await validateCaptcha();
    if (!isCaptchaValid) return;

    try {
      setLoading(true);

      // Endpoint path structure matching the target public endpoint architecture
      const response = await axios.post<ForgotRegistrationResponse>(
        `${BASE_URL}/public/forgot-registration-number`,
        {
          email: data.email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        toast.success(response.data.message);
        // Clear inputs upon successful processing loop
        reset({ email: "", captcha: "" });
        setCaptcha("");
      } else {
        const errorMsg = response.data.message || "Something went wrong. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
        await fetchCaptcha();
      }
    } catch (err: any) {
      console.error("Forgot registration error:", err);
      const errorMsg = err?.response?.data?.message || "An error occurred while processing your request. Please try again later.";
      setError(errorMsg);
      toast.error(errorMsg);
      await fetchCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 pb-4 flex flex-col items-center justify-center gap-6"
      style={{ background: PAPER }}
    >
      <div className="w-full max-w-[600px]">
        <div
          className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-5 "
          style={{ background: CARD, borderColor: LINE }}
        >
          {/* Header */}
          <div className="text-center mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <div
                className="h-10 w-10 rounded-full flex items-center justify-center"
                style={{ background: `${INK}10` }}
              >
                <Search className="h-6 w-6" style={{ color: INK }} />
              </div>
            </div>
            <h2
              className="text-[24px] md:text-[26px] font-bold"
              style={{ color: INK }}
            >
              Forgot Registration Number
            </h2>
            <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
              Enter your details below to recover your registration number
            </p>
          </div>

          {/* Success Notification Alert banner */}
          {successMessage && (
            <div 
              className="mb-4 p-4 border rounded-lg flex items-start gap-2.5 text-[14px]"
              style={{ borderColor: `${SUCCESS}40`, background: `${SUCCESS}10`, color: SUCCESS }}
            >
              <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Success!</span> {successMessage}
              </div>
            </div>
          )}

          {/* Global API Form Fallback Error banner */}
          {error && !errors.captcha && (
            <div 
              className="mb-4 p-4 border rounded-lg flex items-start gap-2.5 text-[14px]"
              style={{ borderColor: `${DANGER}40`, background: `${DANGER}10`, color: DANGER }}
            >
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Error:</span> {error}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label
                className="block text-[14px] font-semibold mb-2"
                style={{ color: INK }}
              >
                <span style={{ color: DANGER }}>*</span> Email ID
              </label>
              <div className="relative">
                <span
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: INK_SOFT }}
                >
                  <Mail size={18} />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
                  style={{ borderColor: LINE, color: INK }}
                  placeholder="Enter your registered email"
                  onFocus={(e) => (e.target.style.borderColor = OCHRE)}
                  onBlur={(e) => (e.target.style.borderColor = LINE)}
                />
              </div>
              {errors.email && (
                <p
                  className="flex items-center gap-1 text-xs mt-1.5"
                  style={{ color: DANGER }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Captcha Section */}
            <div
              className="border rounded-lg p-4"
              style={{ borderColor: LINE, background: PAPER }}
            >
              <div className="flex justify-between items-center mb-3">
                <span
                  className="text-[13px] font-semibold flex items-center gap-2"
                  style={{ color: INK_SOFT }}
                >
                  <Shield size={16} />
                  Security Verification
                </span>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  disabled={captchaLoading}
                  className="flex items-center gap-1 text-[11px] font-bold transition-colors disabled:opacity-50"
                  style={{ color: OCHRE_DEEP }}
                >
                  <RefreshCw size={12} className={captchaLoading ? "animate-spin" : ""} />
                  Refresh
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                {/* SVG Render Box */}
                <div
                  className="w-full sm:w-[180px] min-h-[55px] border rounded-lg flex items-center justify-center overflow-hidden px-2 relative"
                  style={{ background: CARD, borderColor: LINE }}
                >
                  {captchaLoading ? (
                    <Spinner />
                  ) : captchaSvg ? (
                    <div
                      className="w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto"
                      dangerouslySetInnerHTML={{ __html: captchaSvg }}
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No CAPTCHA</span>
                  )}
                </div>

                <div className="flex-1 relative">
                  <input
                    {...register("captcha")}
                    type="text"
                    value={captcha}
                    placeholder="Enter CAPTCHA code"
                    className="w-full h-[48px] border rounded-lg px-4 text-[15px] outline-none transition-colors"
                    style={{ borderColor: LINE, color: INK }}
                    onFocus={(e) => (e.target.style.borderColor = OCHRE)}
                    onBlur={(e) => {
                      e.target.style.borderColor = LINE;
                      register("captcha").onBlur(e);
                    }}
                    onChange={(e) => {
                      setCaptcha(e.target.value);
                      setValue("captcha", e.target.value);
                      if (error) setError("");
                      clearErrors("captcha");
                    }}
                  />
                </div>
              </div>

              {/* CAPTCHA Error Display */}
              {(errors.captcha || (error && errors.captcha)) && (
                <p
                  className="flex items-center gap-1 text-xs mt-2"
                  style={{ color: DANGER }}
                >
                  <AlertCircle className="h-3 w-3" />
                  {errors.captcha?.message || error}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={loading || isValidatingCaptcha || captchaLoading}
              type="submit"
              className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: loading || isValidatingCaptcha ? INK_SOFT : INK }}
            >
              {loading || isValidatingCaptcha ? (
                <>
                  <Spinner />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowRight size={18} />
                  Submit
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      {/* ToastContainer added to render the toasts */}
      <ToastContainer position="top-right" autoClose={4000} />
    </div>
  );
};

export default BSSCForgotRegistration;