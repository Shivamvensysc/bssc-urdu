// import React, { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// import {
//   LogIn,
//   Lock,
//   User,
//   Mail,
//   KeyRound,
//   RefreshCw,
//   ShieldCheck,
//   Eye,
//   EyeOff,
//   FileText,
//   ExternalLink,
//   AlertCircle,
//   ArrowLeft,
// } from "lucide-react";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { login, triggerSetPassword, confirmSetPassword } from "../auth/cognito";

// const INK = "#12233F";
// const INK_SOFT = "#5B6B84";
// const PAPER = "#F4F5F2";
// const CARD = "#FFFFFF";
// const LINE = "#DBDFE6";
// const OCHRE = "#B9722E";
// const OCHRE_DEEP = "#8F5522";
// const DANGER = "#B3432B";

// // Get base URL from environment variables
// const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// // Types for CAPTCHA API responses
// interface CaptchaResponse {
//   success: boolean;
//   message: string;
//   captchaId: string;
//   captchaSvg: string;
// }

// interface CaptchaValidateResponse {
//   success: boolean;
//   message: string;
// }

// // Which form the middle card is showing right now
// type AuthView = "login" | "forgotEmail" | "forgotReset";

// export const BSSCLoginPortal: React.FC = () => {
//   const navigate = useNavigate();

//   const [view, setView] = useState<AuthView>("login");

//   const [regNo, setRegNo] = useState("");
//   const [password, setPassword] = useState("");
//   const [captcha, setCaptcha] = useState("");
//   const [captchaId, setCaptchaId] = useState("");
//   const [captchaSvg, setCaptchaSvg] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [captchaLoading, setCaptchaLoading] = useState(false);
//   const [isValidatingCaptcha, setIsValidatingCaptcha] = useState(false);

//   // ── Forgot password state (separate from login state above) ───
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [resetCode, setResetCode] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [confirmNewPassword, setConfirmNewPassword] = useState("");
//   const [showNewPassword, setShowNewPassword] = useState(false);
//   const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
//   const [forgotLoading, setForgotLoading] = useState(false);
//   const [forgotError, setForgotError] = useState("");

//   // ── CAPTCHA helpers ───────────────────────────────────────────
//   const fetchCaptcha = async () => {
//     try {
//       setCaptchaLoading(true);
//       const response = await axios.get<CaptchaResponse>(
//         `${BASE_URL}/auth/captcha`
//       );
//       const data = response.data;

//       if (!response.status || !data.success) {
//         throw new Error(data.message || "Failed to load CAPTCHA");
//       }

//       setCaptchaId(data.captchaId);
//       setCaptchaSvg(data.captchaSvg);
//       setCaptcha("");
//       setError("");
//     } catch (error: any) {
//       console.error("CAPTCHA error:", error);
//       const msg = error?.message || "Failed to load CAPTCHA. Please refresh.";
//       setError(msg);
//       toast.error(msg);
//     } finally {
//       setCaptchaLoading(false);
//     }
//   };

//   const validateCaptcha = async (): Promise<boolean> => {
//     if (!captchaId) {
//       const msg = "Please refresh CAPTCHA";
//       setError(msg);
//       toast.warn(msg);
//       return false;
//     }

//     if (!captcha.trim()) {
//       const msg = "Please enter CAPTCHA";
//       setError(msg);
//       toast.warn(msg);
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

//       if (!response.status || !data.success) {
//         const msg = data.message || "Invalid CAPTCHA. Please try again.";
//         setError(msg);
//         toast.error(msg);
//         await fetchCaptcha();
//         return false;
//       }

//       return true;
//     } catch (error: any) {
//       console.error("CAPTCHA validation error:", error);
//       const msg = error?.message || "Failed to validate CAPTCHA";
//       setError(msg);
//       toast.error(msg);
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

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!regNo.trim()) {
//       const msg = "Please enter your registration number.";
//       setError(msg);
//       toast.warn(msg);
//       return;
//     }

//     if (!password) {
//       const msg = "Please enter your password.";
//       setError(msg);
//       toast.warn(msg);
//       return;
//     }

//     // Validate CAPTCHA with the API
//     const isCaptchaValid = await validateCaptcha();
//     if (!isCaptchaValid) {
//       return;
//     }

//     setLoading(true);
//     try {
//       // NOTE: this resolves correctly only if `preferred_username` is
//       // enabled as a Cognito sign-in alias and is set to the candidate's
//       // registration number (see cognito.ts login() comment). Until then,
//       // candidates need to type their email here instead.
//       const result = await login(regNo.trim(), password);

//       if (result.status === "SUCCESS") {
//         // Store tokens for the authenticated session. Swap this for your
//         // preferred auth-context/state-management approach if you have one.
//         localStorage.setItem("idToken", result.idToken);
//         localStorage.setItem("accessToken", result.accessToken);
//         localStorage.setItem("refreshToken", result.refreshToken);
        
//         toast.success("Login successful!");
//         navigate("/dashboard");
//       } else if (result.status === "NEW_PASSWORD_REQUIRED") {
//         const msg = "Your account needs a password reset before you can log in. Please use 'Forgot Your Password'.";
//         setError(msg);
//         toast.info(msg);
//       }
//     } catch (err: any) {
//       const code = err?.name || err?.code;
//       let msg = "";
      
//       if (code === "NotAuthorizedException") {
//         msg = "Incorrect registration number or password.";
//       } else if (code === "UserNotConfirmedException") {
//         msg = "This account's email hasn't been verified yet. Please complete registration first.";
//       } else if (code === "UserNotFoundException") {
//         msg = "No account found with that registration number.";
//       } else if (code === "PasswordResetRequiredException") {
//         msg = "A password reset is required. Please use 'Forgot Your Password'.";
//       } else {
//         msg = err?.message || "Login failed. Please try again.";
//       }
      
//       setError(msg);
//       toast.error(msg);
//       handleRefreshCaptcha();
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ── Forgot password handlers ────────────────────────────────
//   const resetForgotState = () => {
//     setForgotEmail("");
//     setResetCode("");
//     setNewPassword("");
//     setConfirmNewPassword("");
//     setForgotError("");
//     setShowNewPassword(false);
//     setShowConfirmNewPassword(false);
//   };

//   const goToLogin = () => {
//     resetForgotState();
//     setView("login");
//   };

//   const goToForgotPassword = () => {
//     resetForgotState();
//     setError("");
//     setView("forgotEmail");
//   };

//   const handleSendResetCode = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setForgotError("");

//     if (!forgotEmail.trim()) {
//       const msg = "Please enter your registered email address.";
//       setForgotError(msg);
//       toast.warn(msg);
//       return;
//     }

//     setForgotLoading(true);
//     try {
//       await triggerSetPassword(forgotEmail.trim());
//       toast.success("A verification code has been sent to your email.");
//       setView("forgotReset");
//     } catch (err: any) {
//       const code = err?.name || err?.code;
//       let msg = "";

//       if (code === "UserNotFoundException") {
//         msg = "No account found with that email address.";
//       } else if (code === "InvalidParameterException") {
//         msg = "This account's email hasn't been verified yet. Please complete registration first.";
//       } else if (code === "LimitExceededException") {
//         msg = "Too many attempts. Please try again later.";
//       } else {
//         msg = err?.message || "Failed to send verification code. Please try again.";
//       }

//       setForgotError(msg);
//       toast.error(msg);
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   const handleResetPassword = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setForgotError("");

//     if (!resetCode.trim()) {
//       const msg = "Please enter the verification code sent to your email.";
//       setForgotError(msg);
//       toast.warn(msg);
//       return;
//     }

//     if (!newPassword) {
//       const msg = "Please enter a new password.";
//       setForgotError(msg);
//       toast.warn(msg);
//       return;
//     }

//     if (newPassword !== confirmNewPassword) {
//       const msg = "Passwords do not match.";
//       setForgotError(msg);
//       toast.warn(msg);
//       return;
//     }

//     setForgotLoading(true);
//     try {
//       await confirmSetPassword(forgotEmail.trim(), resetCode.trim(), newPassword);
//       toast.success("Password reset successfully. Please log in with your new password.");
//       goToLogin();
//     } catch (err: any) {
//       const code = err?.name || err?.code;
//       let msg = "";

//       if (code === "CodeMismatchException") {
//         msg = "Incorrect verification code. Please try again.";
//       } else if (code === "ExpiredCodeException") {
//         msg = "This code has expired. Please request a new one.";
//       } else if (code === "InvalidPasswordException") {
//         msg = "Password does not meet the required criteria.";
//       } else {
//         msg = err?.message || "Failed to reset password. Please try again.";
//       }

//       setForgotError(msg);
//       toast.error(msg);
//     } finally {
//       setForgotLoading(false);
//     }
//   };

//   return (
//     <div
//       className="min-h-screen px-4 py-8 md:pb-32 flex flex-col items-center justify-center gap-6"
//       style={{ background: PAPER }}
//     >
//       <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
//       <div className="w-full max-w-[1100px] mx-auto">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//           {/* LEFT BAR: External Links Menu */}
//           <div className="lg:col-span-3">
//             <div
//               className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
//               style={{ background: CARD, borderColor: LINE }}
//             >
//               <div
//                 className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
//                 style={{ background: INK }}
//               >
//                 <FileText size={16} />
//                 <span className="tracking-widest uppercase">Links</span>
//               </div>
//               <div className="p-4 space-y-3">
//                 <Link
//                   to="/advertisement"
//                   className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors"
//                   style={{ color: INK }}
//                 >
//                   <span className="mt-0.5" style={{ color: INK }}>
//                     •
//                   </span>
//                   Click Here To View Advertisement
//                 </Link>
//                 <Link
//                   to="/instructions"
//                   className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
//                   style={{ color: INK, borderColor: LINE }}
//                 >
//                   <span className="mt-0.5" style={{ color: INK }}>
//                     •
//                   </span>
//                   Important Instructions for Live Photo Upload
//                 </Link>
//                 <Link
//                   to="/how-to-apply"
//                   className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
//                   style={{ color: INK, borderColor: LINE }}
//                 >
//                   <span className="mt-0.5" style={{ color: INK }}>
//                     •
//                   </span>
//                   How To Apply
//                 </Link>
//               </div>
//             </div>
//           </div>

//           {/* MIDDLE PORTION: Login / Forgot Password Console */}
//           <div className="lg:col-span-6">
//             <div
//               className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 pt-4 pb-4 md:px-8"
//               style={{ background: CARD, borderColor: LINE }}
//             >
//               {/* ══════════════════ LOGIN VIEW ══════════════════ */}
//               {view === "login" && (
//                 <>
//                   <div className="text-center mb-6">
//                     <div className="flex items-center justify-center gap-2 mb-3">
//                       <div
//                         className="h-12 w-12 rounded-full flex items-center justify-center"
//                         style={{ background: `${INK}10` }}
//                       >
//                         <LogIn className="h-6 w-6" style={{ color: INK }} />
//                       </div>
//                     </div>
//                     <h2
//                       className="text-[24px] md:text-[26px] font-bold"
//                       style={{ color: INK }}
//                     >
//                       Candidate Login
//                     </h2>
//                     <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
//                       Enter your credentials to access your dashboard
//                     </p>
//                   </div>

                  
                  

//                   <form onSubmit={handleLogin} className="space-y-5">
//                     {/* Registration Number */}
//                     <div>
//                       <label
//                         className="block text-[14px] font-semibold mb-2"
//                         style={{ color: INK }}
//                       >
//                         Registration Number /Email Id
//                       </label>
//                       <div className="relative">
//                         <span
//                           className="absolute left-4 top-1/2 -translate-y-1/2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <User size={18} />
//                         </span>
//                         <input
//                           type="text"
//                           value={regNo}
//                           onChange={(e) => setRegNo(e.target.value)}
//                           className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
//                           style={{ borderColor: OCHRE, color: INK }}
//                           placeholder="Enter your registration number"
//                         />
//                       </div>
//                       {/* NEW: Forgot Registration Number Link */}
//   <div className="flex justify-end mt-2">
//     <Link
//       to="/forgot-registration"
//       className="text-[12px] font-semibold hover:underline transition-colors"
//       style={{ color: OCHRE_DEEP }}
//     >
//       Forgot Registration Number?
//     </Link>
//   </div>
//                     </div>

//                     {/* Password */}
//                     <div>
//                       <label
//                         className="block text-[14px] font-semibold mb-2"
//                         style={{ color: INK }}
//                       >
//                         Password
//                       </label>
//                       <div className="relative">
//                         <span
//                           className="absolute left-4 top-1/2 -translate-y-1/2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <Lock size={18} />
//                         </span>
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           value={password}
//                           onChange={(e) => setPassword(e.target.value)}
//                           className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
//                           style={{ borderColor: OCHRE, color: INK }}
//                           placeholder="Enter your password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
//                           style={{ color: INK_SOFT }}
//                           tabIndex={-1}
//                         >
//                           {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                       </div>

//                       {/* Forgot Password — switches the card to the inline form, no navigation */}
//                       <div className="flex justify-end mt-2">
//                         <button
//                           type="button"
//                           onClick={goToForgotPassword}
//                           className="text-[12px] font-semibold hover:underline transition-colors"
//                           style={{ color: OCHRE_DEEP }}
//                         >
//                           Forgot Password?
//                         </button>
//                       </div>
//                     </div>

//                     {/* Captcha Section */}
//                     <div
//                       className="border rounded-lg p-4"
//                       style={{ borderColor: LINE, background: PAPER }}
//                     >
//                       <div className="flex justify-between items-center mb-3">
//                         <span
//                           className="text-[13px] font-semibold flex items-center gap-2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <ShieldCheck size={16} />
//                           Security Verification
//                         </span>
//                         <button
//                           type="button"
//                           onClick={handleRefreshCaptcha}
//                           disabled={captchaLoading}
//                           className="flex items-center gap-1 text-[11px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                           style={{ color: OCHRE_DEEP }}
//                         >
//                           <RefreshCw
//                             size={12}
//                             className={captchaLoading ? "animate-spin" : ""}
//                           />
//                           Refresh
//                         </button>
//                       </div>

//                       <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
//                         <div
//                           className="w-full sm:w-[180px] min-h-[55px] border rounded-lg flex items-center justify-center px-2"
//                           style={{ background: CARD, borderColor: LINE }}
//                         >
//                           {captchaLoading ? (
//                             <div className="flex items-center justify-center">
//                               <div className="animate-spin h-6 w-6 border-2 border-[#B9722E] border-t-transparent rounded-full" />
//                             </div>
//                           ) : captchaSvg ? (
//                             <div
//                               dangerouslySetInnerHTML={{ __html: captchaSvg }}
//                               className="w-full h-full flex items-center justify-center"
//                             />
//                           ) : (
//                             <span
//                               className="text-sm font-mono"
//                               style={{ color: INK_SOFT }}
//                             >
//                               Loading...
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex-1 relative">
//                           <input
//                             type="text"
//                             value={captcha}
//                             onChange={(e) => setCaptcha(e.target.value)}
//                             placeholder="Enter CAPTCHA code"
//                             className="w-full h-[48px] border rounded-lg px-4 text-[15px] outline-none transition-colors"
//                             style={{ borderColor: OCHRE, color: INK }}
//                             disabled={captchaLoading || isValidatingCaptcha}
//                           />
//                           {isValidatingCaptcha && (
//                             <div className="absolute right-3 top-1/2 -translate-y-1/2">
//                               <div className="animate-spin h-5 w-5 border-2 border-[#B9722E] border-t-transparent rounded-full" />
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Submit Button */}
//                     <button
//                       type="submit"
//                       disabled={loading || captchaLoading || isValidatingCaptcha}
//                       className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{ background: loading || captchaLoading || isValidatingCaptcha ? INK_SOFT : INK }}
//                     >
//                       {loading || captchaLoading || isValidatingCaptcha ? (
//                         <>
//                           <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                           {loading
//                             ? "Processing..."
//                             : captchaLoading
//                             ? "Loading CAPTCHA..."
//                             : "Validating..."}
//                         </>
//                       ) : (
//                         <>
//                           <LogIn size={18} />
//                           Candidate Login
//                         </>
//                       )}
//                     </button>
//                   </form>
//                 </>
//               )}

//               {/* ══════════════ FORGOT PASSWORD — STEP 1: EMAIL ══════════════ */}
//               {view === "forgotEmail" && (
//                 <>
//                   <div className="text-center mb-6">
//                     <div className="flex items-center justify-center gap-2 mb-3">
//                       <div
//                         className="h-12 w-12 rounded-full flex items-center justify-center"
//                         style={{ background: `${INK}10` }}
//                       >
//                         <KeyRound className="h-6 w-6" style={{ color: INK }} />
//                       </div>
//                     </div>
//                     <h2
//                       className="text-[24px] md:text-[26px] font-bold"
//                       style={{ color: INK }}
//                     >
//                       Forgot Password
//                     </h2>
//                     <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
//                       Enter your registered email to receive a verification code
//                     </p>
//                   </div>

//                   {forgotError && (
//                     <div
//                       className="flex items-start gap-2 mb-5 text-[13px] font-bold rounded-lg px-3 py-2.5"
//                       style={{ color: DANGER, background: "#FBEAE6" }}
//                     >
//                       <AlertCircle size={15} className="shrink-0 mt-0.5" /> {forgotError}
//                     </div>
//                   )}

//                   <form onSubmit={handleSendResetCode} className="space-y-5">
//                     <div>
//                       <label
//                         className="block text-[14px] font-semibold mb-2"
//                         style={{ color: INK }}
//                       >
//                         Registered Email
//                       </label>
//                       <div className="relative">
//                         <span
//                           className="absolute left-4 top-1/2 -translate-y-1/2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <Mail size={18} />
//                         </span>
//                         <input
//                           type="email"
//                           value={forgotEmail}
//                           onChange={(e) => setForgotEmail(e.target.value)}
//                           className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
//                           style={{ borderColor: OCHRE, color: INK }}
//                           placeholder="Enter your registered email"
//                         />
//                       </div>
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={forgotLoading}
//                       className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{ background: forgotLoading ? INK_SOFT : INK }}
//                     >
//                       {forgotLoading ? (
//                         <>
//                           <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                           Sending Code...
//                         </>
//                       ) : (
//                         <>
//                           <KeyRound size={18} />
//                           Send Verification Code
//                         </>
//                       )}
//                     </button>

//                     <button
//                       type="button"
//                       onClick={goToLogin}
//                       className="w-full flex items-center justify-center gap-1.5 text-[13px] font-semibold hover:underline transition-colors"
//                       style={{ color: OCHRE_DEEP }}
//                     >
//                       <ArrowLeft size={14} />
//                       Back to Login
//                     </button>
//                   </form>
//                 </>
//               )}

//               {/* ══════════════ FORGOT PASSWORD — STEP 2: CODE + NEW PASSWORD ══════════════ */}
//               {view === "forgotReset" && (
//                 <>
//                   <div className="text-center mb-6">
//                     <div className="flex items-center justify-center gap-2 mb-3">
//                       <div
//                         className="h-12 w-12 rounded-full flex items-center justify-center"
//                         style={{ background: `${INK}10` }}
//                       >
//                         <KeyRound className="h-6 w-6" style={{ color: INK }} />
//                       </div>
//                     </div>
//                     <h2
//                       className="text-[24px] md:text-[26px] font-bold"
//                       style={{ color: INK }}
//                     >
//                       Reset Password
//                     </h2>
//                     <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
//                       Enter the code sent to {forgotEmail || "your email"} and choose a new password
//                     </p>
//                   </div>

//                   {forgotError && (
//                     <div
//                       className="flex items-start gap-2 mb-5 text-[13px] font-bold rounded-lg px-3 py-2.5"
//                       style={{ color: DANGER, background: "#FBEAE6" }}
//                     >
//                       <AlertCircle size={15} className="shrink-0 mt-0.5" /> {forgotError}
//                     </div>
//                   )}

//                   <form onSubmit={handleResetPassword} className="space-y-5">
//                     {/* Verification Code */}
//                     <div>
//                       <label
//                         className="block text-[14px] font-semibold mb-2"
//                         style={{ color: INK }}
//                       >
//                         Verification Code
//                       </label>
//                       <div className="relative">
//                         <span
//                           className="absolute left-4 top-1/2 -translate-y-1/2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <ShieldCheck size={18} />
//                         </span>
//                         <input
//                           type="text"
//                           value={resetCode}
//                           onChange={(e) => setResetCode(e.target.value)}
//                           className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
//                           style={{ borderColor: OCHRE, color: INK }}
//                           placeholder="Enter the code from your email"
//                         />
//                       </div>
//                     </div>

//                     {/* New Password */}
//                     <div>
//                       <label
//                         className="block text-[14px] font-semibold mb-2"
//                         style={{ color: INK }}
//                       >
//                         New Password
//                       </label>
//                       <div className="relative">
//                         <span
//                           className="absolute left-4 top-1/2 -translate-y-1/2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <Lock size={18} />
//                         </span>
//                         <input
//                           type={showNewPassword ? "text" : "password"}
//                           value={newPassword}
//                           onChange={(e) => setNewPassword(e.target.value)}
//                           className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
//                           style={{ borderColor: OCHRE, color: INK }}
//                           placeholder="Enter your new password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowNewPassword(!showNewPassword)}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
//                           style={{ color: INK_SOFT }}
//                           tabIndex={-1}
//                         >
//                           {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                       </div>
//                     </div>

//                     {/* Confirm New Password */}
//                     <div>
//                       <label
//                         className="block text-[14px] font-semibold mb-2"
//                         style={{ color: INK }}
//                       >
//                         Confirm New Password
//                       </label>
//                       <div className="relative">
//                         <span
//                           className="absolute left-4 top-1/2 -translate-y-1/2"
//                           style={{ color: INK_SOFT }}
//                         >
//                           <Lock size={18} />
//                         </span>
//                         <input
//                           type={showConfirmNewPassword ? "text" : "password"}
//                           value={confirmNewPassword}
//                           onChange={(e) => setConfirmNewPassword(e.target.value)}
//                           className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
//                           style={{ borderColor: OCHRE, color: INK }}
//                           placeholder="Re-enter your new password"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
//                           className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
//                           style={{ color: INK_SOFT }}
//                           tabIndex={-1}
//                         >
//                           {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                       </div>
//                     </div>

//                     <button
//                       type="submit"
//                       disabled={forgotLoading}
//                       className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{ background: forgotLoading ? INK_SOFT : INK }}
//                     >
//                       {forgotLoading ? (
//                         <>
//                           <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
//                           Resetting Password...
//                         </>
//                       ) : (
//                         <>
//                           <KeyRound size={18} />
//                           Reset Password
//                         </>
//                       )}
//                     </button>

//                     <div className="flex items-center justify-between text-[13px] font-semibold">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           setForgotError("");
//                           setView("forgotEmail");
//                         }}
//                         className="flex items-center gap-1.5 hover:underline transition-colors"
//                         style={{ color: OCHRE_DEEP }}
//                       >
//                         <ArrowLeft size={14} />
//                         Change Email
//                       </button>
//                       <button
//                         type="button"
//                         onClick={goToLogin}
//                         className="hover:underline transition-colors"
//                         style={{ color: INK_SOFT }}
//                       >
//                         Back to Login
//                       </button>
//                     </div>
//                   </form>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* RIGHT BAR: Online Services */}
//           <div className="lg:col-span-3">
//             <div
//               className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
//               style={{ background: CARD, borderColor: LINE }}
//             >
//               <div
//                 className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
//                 style={{ background: INK }}
//               >
//                 <ExternalLink size={16} />
//                 <span className="tracking-widest uppercase">
//                   Online Services
//                 </span>
//               </div>
//               <div className="p-4 space-y-3">
//                 <Link
//                   to="/register"
//                   className="flex items-center gap-2 text-[13px] font-semibold hover:underline transition-colors"
//                   style={{ color: INK }}
//                 >
//                   <span
//                     className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
//                     style={{ background: `${INK}10`, color: INK }}
//                   >
//                     ›
//                   </span>
//                   Registration
//                 </Link>
               
               
//                 <Link
//                   to="/forgot-registration"
//                   className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
//                   style={{ color: INK, borderColor: LINE }}
//                 >
//                   <span
//                     className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
//                     style={{ background: `${INK}10`, color: INK }}
//                   >
//                     ›
//                   </span>
//                   Forgot Your Registration Number
//                 </Link>
                
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BSSCLoginPortal;


//for testing purpose comment the captch  
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LogIn,
  Lock,
  User,
  Mail,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  FileText,
  ExternalLink,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { login, triggerSetPassword, confirmSetPassword } from "../auth/cognito";

const INK = "#12233F";
const INK_SOFT = "#5B6B84";
const PAPER = "#F4F5F2";
const CARD = "#FFFFFF";
const LINE = "#DBDFE6";
const OCHRE = "#B9722E";
const OCHRE_DEEP = "#8F5522";
const DANGER = "#B3432B";

// Get base URL from environment variables
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Types for CAPTCHA API responses
interface CaptchaResponse {
  success: boolean;
  message: string;
  captchaId: string;
  captchaSvg: string;
}

interface CaptchaValidateResponse {
  success: boolean;
  message: string;
}

// Which form the middle card is showing right now
type AuthView = "login" | "forgotEmail" | "forgotReset";

export const BSSCLoginPortal: React.FC = () => {
  const navigate = useNavigate();

  const [view, setView] = useState<AuthView>("login");

  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [captchaId, setCaptchaId] = useState("");
  const [captchaSvg, setCaptchaSvg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [captchaLoading, setCaptchaLoading] = useState(false);
  const [isValidatingCaptcha, setIsValidatingCaptcha] = useState(false);

  // ── Forgot password state (separate from login state above) ───
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState("");

  // ── CAPTCHA helpers ───────────────────────────────────────────
  const fetchCaptcha = async () => {
    try {
      setCaptchaLoading(true);
      const response = await axios.get<CaptchaResponse>(
        `${BASE_URL}/auth/captcha`
      );
      const data = response.data;

      if (!response.status || !data.success) {
        throw new Error(data.message || "Failed to load CAPTCHA");
      }

      setCaptchaId(data.captchaId);
      setCaptchaSvg(data.captchaSvg);
      setCaptcha("");
      setError("");
    } catch (error: any) {
      console.error("CAPTCHA error:", error);
      const msg = error?.message || "Failed to load CAPTCHA. Please refresh.";
      setError(msg);
      toast.error(msg);
    } finally {
      setCaptchaLoading(false);
    }
  };

  const validateCaptcha = async (): Promise<boolean> => {
    if (!captchaId) {
      const msg = "Please refresh CAPTCHA";
      setError(msg);
      toast.warn(msg);
      return false;
    }

    if (!captcha.trim()) {
      const msg = "Please enter CAPTCHA";
      setError(msg);
      toast.warn(msg);
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

      if (!response.status || !data.success) {
        const msg = data.message || "Invalid CAPTCHA. Please try again.";
        setError(msg);
        toast.error(msg);
        await fetchCaptcha();
        return false;
      }

      return true;
    } catch (error: any) {
      console.error("CAPTCHA validation error:", error);
      const msg = error?.message || "Failed to validate CAPTCHA";
      setError(msg);
      toast.error(msg);
      await fetchCaptcha();
      return false;
    } finally {
      setIsValidatingCaptcha(false);
    }
  };

  useEffect(() => {
    // fetchCaptcha();
  }, []);

  const handleRefreshCaptcha = () => {
    fetchCaptcha();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!regNo.trim()) {
      const msg = "Please enter your registration number.";
      setError(msg);
      toast.warn(msg);
      return;
    }

    if (!password) {
      const msg = "Please enter your password.";
      setError(msg);
      toast.warn(msg);
      return;
    }

    // Validate CAPTCHA with the API
    // const isCaptchaValid = await validateCaptcha();
    // if (!isCaptchaValid) {
    //   return;
    // }

    setLoading(true);
    try {
      // NOTE: this resolves correctly only if `preferred_username` is
      // enabled as a Cognito sign-in alias and is set to the candidate's
      // registration number (see cognito.ts login() comment). Until then,
      // candidates need to type their email here instead.
      const result = await login(regNo.trim(), password);

      if (result.status === "SUCCESS") {
        // Store tokens for the authenticated session. Swap this for your
        // preferred auth-context/state-management approach if you have one.
        localStorage.setItem("idToken", result.idToken);
        localStorage.setItem("accessToken", result.accessToken);
        localStorage.setItem("refreshToken", result.refreshToken);
        
        toast.success("Login successful!");
        navigate("/dashboard");
      } else if (result.status === "NEW_PASSWORD_REQUIRED") {
        const msg = "Your account needs a password reset before you can log in. Please use 'Forgot Your Password'.";
        setError(msg);
        toast.info(msg);
      }
    } catch (err: any) {
      const code = err?.name || err?.code;
      let msg = "";
      
      if (code === "NotAuthorizedException") {
        msg = "Incorrect registration number or password.";
      } else if (code === "UserNotConfirmedException") {
        msg = "This account's email hasn't been verified yet. Please complete registration first.";
      } else if (code === "UserNotFoundException") {
        msg = "No account found with that registration number.";
      } else if (code === "PasswordResetRequiredException") {
        msg = "A password reset is required. Please use 'Forgot Your Password'.";
      } else {
        msg = err?.message || "Login failed. Please try again.";
      }
      
      setError(msg);
      toast.error(msg);
      // handleRefreshCaptcha();
    } finally {
      setLoading(false);
    }
  };

  // ── Forgot password handlers ────────────────────────────────
  const resetForgotState = () => {
    setForgotEmail("");
    setResetCode("");
    setNewPassword("");
    setConfirmNewPassword("");
    setForgotError("");
    setShowNewPassword(false);
    setShowConfirmNewPassword(false);
  };

  const goToLogin = () => {
    resetForgotState();
    setView("login");
  };

  const goToForgotPassword = () => {
    resetForgotState();
    setError("");
    setView("forgotEmail");
  };

  const handleSendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!forgotEmail.trim()) {
      const msg = "Please enter your registered email address.";
      setForgotError(msg);
      toast.warn(msg);
      return;
    }

    setForgotLoading(true);
    try {
      await triggerSetPassword(forgotEmail.trim());
      toast.success("A verification code has been sent to your email.");
      setView("forgotReset");
    } catch (err: any) {
      const code = err?.name || err?.code;
      let msg = "";

      if (code === "UserNotFoundException") {
        msg = "No account found with that email address.";
      } else if (code === "InvalidParameterException") {
        msg = "This account's email hasn't been verified yet. Please complete registration first.";
      } else if (code === "LimitExceededException") {
        msg = "Too many attempts. Please try again later.";
      } else {
        msg = err?.message || "Failed to send verification code. Please try again.";
      }

      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError("");

    if (!resetCode.trim()) {
      const msg = "Please enter the verification code sent to your email.";
      setForgotError(msg);
      toast.warn(msg);
      return;
    }

    if (!newPassword) {
      const msg = "Please enter a new password.";
      setForgotError(msg);
      toast.warn(msg);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      const msg = "Passwords do not match.";
      setForgotError(msg);
      toast.warn(msg);
      return;
    }

    setForgotLoading(true);
    try {
      await confirmSetPassword(forgotEmail.trim(), resetCode.trim(), newPassword);
      toast.success("Password reset successfully. Please log in with your new password.");
      goToLogin();
    } catch (err: any) {
      const code = err?.name || err?.code;
      let msg = "";

      if (code === "CodeMismatchException") {
        msg = "Incorrect verification code. Please try again.";
      } else if (code === "ExpiredCodeException") {
        msg = "This code has expired. Please request a new one.";
      } else if (code === "InvalidPasswordException") {
        msg = "Password does not meet the required criteria.";
      } else {
        msg = err?.message || "Failed to reset password. Please try again.";
      }

      setForgotError(msg);
      toast.error(msg);
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen px-4 py-8 md:pb-32 flex flex-col items-center justify-center gap-6"
      style={{ background: PAPER }}
    >
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} />
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT BAR: External Links Menu */}
          <div className="lg:col-span-3">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div
                className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
                style={{ background: INK }}
              >
                <FileText size={16} />
                <span className="tracking-widest uppercase">Links</span>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to="/advertisement"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors"
                  style={{ color: INK }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  Click Here To View Advertisement
                </Link>
                <Link
                  to="/instructions"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  Important Instructions for Live Photo Upload
                </Link>
                <Link
                  to="/how-to-apply"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  How To Apply
                </Link>
              </div>
            </div>
          </div>

          {/* MIDDLE PORTION: Login / Forgot Password Console */}
          <div className="lg:col-span-6">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 pt-4 pb-4 md:px-8"
              style={{ background: CARD, borderColor: LINE }}
            >
              {/* ══════════════════ LOGIN VIEW ══════════════════ */}
              {view === "login" && (
                <>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ background: `${INK}10` }}
                      >
                        <LogIn className="h-6 w-6" style={{ color: INK }} />
                      </div>
                    </div>
                    <h2
                      className="text-[24px] md:text-[26px] font-bold"
                      style={{ color: INK }}
                    >
                      Candidate Login
                    </h2>
                    <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
                      Enter your credentials to access your dashboard
                    </p>
                  </div>

                  
                  

                  <form onSubmit={handleLogin} className="space-y-5">
                    {/* Registration Number */}
                    <div>
                      <label
                        className="block text-[14px] font-semibold mb-2"
                        style={{ color: INK }}
                      >
                        Registration Number /Email Id
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: INK_SOFT }}
                        >
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          value={regNo}
                          onChange={(e) => setRegNo(e.target.value)}
                          className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
                          style={{ borderColor: OCHRE, color: INK }}
                          placeholder="Enter your registration number"
                        />
                      </div>
                      {/* NEW: Forgot Registration Number Link */}
  <div className="flex justify-end mt-2">
    <Link
      to="/forgot-registration"
      className="text-[12px] font-semibold hover:underline transition-colors"
      style={{ color: OCHRE_DEEP }}
    >
      Forgot Registration Number?
    </Link>
  </div>
                    </div>

                    {/* Password */}
                    <div>
                      <label
                        className="block text-[14px] font-semibold mb-2"
                        style={{ color: INK }}
                      >
                        Password
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: INK_SOFT }}
                        >
                          <Lock size={18} />
                        </span>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
                          style={{ borderColor: OCHRE, color: INK }}
                          placeholder="Enter your password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: INK_SOFT }}
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>

                      {/* Forgot Password — switches the card to the inline form, no navigation */}
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={goToForgotPassword}
                          className="text-[12px] font-semibold hover:underline transition-colors"
                          style={{ color: OCHRE_DEEP }}
                        >
                          Forgot Password?
                        </button>
                      </div>
                    </div>

                    {/* Captcha Section */}
                    {/* <div
                      className="border rounded-lg p-4"
                      style={{ borderColor: LINE, background: PAPER }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className="text-[13px] font-semibold flex items-center gap-2"
                          style={{ color: INK_SOFT }}
                        >
                          <ShieldCheck size={16} />
                          Security Verification
                        </span>
                        <button
                          type="button"
                          onClick={handleRefreshCaptcha}
                          disabled={captchaLoading}
                          className="flex items-center gap-1 text-[11px] font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ color: OCHRE_DEEP }}
                        >
                          <RefreshCw
                            size={12}
                            className={captchaLoading ? "animate-spin" : ""}
                          />
                          Refresh
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <div
                          className="w-full sm:w-[180px] min-h-[55px] border rounded-lg flex items-center justify-center px-2"
                          style={{ background: CARD, borderColor: LINE }}
                        >
                          {captchaLoading ? (
                            <div className="flex items-center justify-center">
                              <div className="animate-spin h-6 w-6 border-2 border-[#B9722E] border-t-transparent rounded-full" />
                            </div>
                          ) : captchaSvg ? (
                            <div
                              dangerouslySetInnerHTML={{ __html: captchaSvg }}
                              className="w-full h-full flex items-center justify-center"
                            />
                          ) : (
                            <span
                              className="text-sm font-mono"
                              style={{ color: INK_SOFT }}
                            >
                              Loading...
                            </span>
                          )}
                        </div>

                        <div className="flex-1 relative">
                          <input
                            type="text"
                            value={captcha}
                            onChange={(e) => setCaptcha(e.target.value)}
                            placeholder="Enter CAPTCHA code"
                            className="w-full h-[48px] border rounded-lg px-4 text-[15px] outline-none transition-colors"
                            style={{ borderColor: OCHRE, color: INK }}
                            disabled={captchaLoading || isValidatingCaptcha}
                          />
                          {isValidatingCaptcha && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              <div className="animate-spin h-5 w-5 border-2 border-[#B9722E] border-t-transparent rounded-full" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div> */}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading || captchaLoading || isValidatingCaptcha}
                      className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: loading || captchaLoading || isValidatingCaptcha ? INK_SOFT : INK }}
                    >
                      {loading || captchaLoading || isValidatingCaptcha ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          {loading
                            ? "Processing..."
                            : captchaLoading
                            ? "Loading CAPTCHA..."
                            : "Validating..."}
                        </>
                      ) : (
                        <>
                          <LogIn size={18} />
                          Candidate Login
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* ══════════════ FORGOT PASSWORD — STEP 1: EMAIL ══════════════ */}
              {view === "forgotEmail" && (
                <>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ background: `${INK}10` }}
                      >
                        <KeyRound className="h-6 w-6" style={{ color: INK }} />
                      </div>
                    </div>
                    <h2
                      className="text-[24px] md:text-[26px] font-bold"
                      style={{ color: INK }}
                    >
                      Forgot Password
                    </h2>
                    <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
                      Enter your registered email to receive a verification code
                    </p>
                  </div>

                  {forgotError && (
                    <div
                      className="flex items-start gap-2 mb-5 text-[13px] font-bold rounded-lg px-3 py-2.5"
                      style={{ color: DANGER, background: "#FBEAE6" }}
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5" /> {forgotError}
                    </div>
                  )}

                  <form onSubmit={handleSendResetCode} className="space-y-5">
                    <div>
                      <label
                        className="block text-[14px] font-semibold mb-2"
                        style={{ color: INK }}
                      >
                        Registered Email
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: INK_SOFT }}
                        >
                          <Mail size={18} />
                        </span>
                        <input
                          type="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
                          style={{ borderColor: OCHRE, color: INK }}
                          placeholder="Enter your registered email"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: forgotLoading ? INK_SOFT : INK }}
                    >
                      {forgotLoading ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Sending Code...
                        </>
                      ) : (
                        <>
                          <KeyRound size={18} />
                          Send Verification Code
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={goToLogin}
                      className="w-full flex items-center justify-center gap-1.5 text-[13px] font-semibold hover:underline transition-colors"
                      style={{ color: OCHRE_DEEP }}
                    >
                      <ArrowLeft size={14} />
                      Back to Login
                    </button>
                  </form>
                </>
              )}

              {/* ══════════════ FORGOT PASSWORD — STEP 2: CODE + NEW PASSWORD ══════════════ */}
              {view === "forgotReset" && (
                <>
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <div
                        className="h-12 w-12 rounded-full flex items-center justify-center"
                        style={{ background: `${INK}10` }}
                      >
                        <KeyRound className="h-6 w-6" style={{ color: INK }} />
                      </div>
                    </div>
                    <h2
                      className="text-[24px] md:text-[26px] font-bold"
                      style={{ color: INK }}
                    >
                      Reset Password
                    </h2>
                    <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
                      Enter the code sent to {forgotEmail || "your email"} and choose a new password
                    </p>
                  </div>

                  {forgotError && (
                    <div
                      className="flex items-start gap-2 mb-5 text-[13px] font-bold rounded-lg px-3 py-2.5"
                      style={{ color: DANGER, background: "#FBEAE6" }}
                    >
                      <AlertCircle size={15} className="shrink-0 mt-0.5" /> {forgotError}
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-5">
                    {/* Verification Code */}
                    <div>
                      <label
                        className="block text-[14px] font-semibold mb-2"
                        style={{ color: INK }}
                      >
                        Verification Code
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: INK_SOFT }}
                        >
                          <ShieldCheck size={18} />
                        </span>
                        <input
                          type="text"
                          value={resetCode}
                          onChange={(e) => setResetCode(e.target.value)}
                          className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
                          style={{ borderColor: OCHRE, color: INK }}
                          placeholder="Enter the code from your email"
                        />
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        className="block text-[14px] font-semibold mb-2"
                        style={{ color: INK }}
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: INK_SOFT }}
                        >
                          <Lock size={18} />
                        </span>
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
                          style={{ borderColor: OCHRE, color: INK }}
                          placeholder="Enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: INK_SOFT }}
                          tabIndex={-1}
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label
                        className="block text-[14px] font-semibold mb-2"
                        style={{ color: INK }}
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <span
                          className="absolute left-4 top-1/2 -translate-y-1/2"
                          style={{ color: INK_SOFT }}
                        >
                          <Lock size={18} />
                        </span>
                        <input
                          type={showConfirmNewPassword ? "text" : "password"}
                          value={confirmNewPassword}
                          onChange={(e) => setConfirmNewPassword(e.target.value)}
                          className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
                          style={{ borderColor: OCHRE, color: INK }}
                          placeholder="Re-enter your new password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                          style={{ color: INK_SOFT }}
                          tabIndex={-1}
                        >
                          {showConfirmNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ background: forgotLoading ? INK_SOFT : INK }}
                    >
                      {forgotLoading ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <KeyRound size={18} />
                          Reset Password
                        </>
                      )}
                    </button>

                    <div className="flex items-center justify-between text-[13px] font-semibold">
                      <button
                        type="button"
                        onClick={() => {
                          setForgotError("");
                          setView("forgotEmail");
                        }}
                        className="flex items-center gap-1.5 hover:underline transition-colors"
                        style={{ color: OCHRE_DEEP }}
                      >
                        <ArrowLeft size={14} />
                        Change Email
                      </button>
                      <button
                        type="button"
                        onClick={goToLogin}
                        className="hover:underline transition-colors"
                        style={{ color: INK_SOFT }}
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>

          {/* RIGHT BAR: Online Services */}
          <div className="lg:col-span-3">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div
                className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
                style={{ background: INK }}
              >
                <ExternalLink size={16} />
                <span className="tracking-widest uppercase">
                  Online Services
                </span>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-[13px] font-semibold hover:underline transition-colors"
                  style={{ color: INK }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Registration
                </Link>
               
               
                <Link
                  to="/forgot-registration"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Forgot Your Registration Number
                </Link>
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSSCLoginPortal;