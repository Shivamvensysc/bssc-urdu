// import { useState, useEffect, useRef} from "react";
// import type { FC } from "react";
// import { X, Mail, Smartphone, AlertCircle, Clock } from "lucide-react";

// interface OTPVerificationModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   type: "mobile" | "email";
//   emailOrMobile: string;
//   onVerify?: (otp: string) => void;
// }

// const OTPVerificationModal: FC<OTPVerificationModalProps> = ({
//   isOpen,
//   onClose,
//   type,
//   emailOrMobile,
//   onVerify,
// }) => {
//   const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
//   const [timeLeft, setTimeLeft] = useState<number>(120);
//   const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
//   const [isVerifying, setIsVerifying] = useState<boolean>(false);
//   const [error, setError] = useState<string>("");
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

//   useEffect(() => {
//     if (isOpen) {
//       setOtp(["", "", "", "", "", ""]);
//       setTimeLeft(120);
//       setIsResendDisabled(true);
//       setError("");
//       // Auto-focus first input
//       setTimeout(() => {
//         if (inputRefs.current[0]) {
//           inputRefs.current[0].focus();
//         }
//       }, 100);
//     }
//   }, [isOpen]);

//   useEffect(() => {
//     // let timer: NodeJS.Timeout;
//     let timer: ReturnType<typeof setInterval>;
//     if (isOpen && timeLeft > 0 && isResendDisabled) {
//       timer = setInterval(() => {
//         setTimeLeft((prev) => {
//           if (prev <= 1) {
//             setIsResendDisabled(false);
//             return 0;
//           }
//           return prev - 1;
//         });
//       }, 1000);
//     }
//     return () => clearInterval(timer);
//   }, [isOpen, timeLeft, isResendDisabled]);

//   const formatTime = (seconds: number): string => {
//     const mins = Math.floor(seconds / 60);
//     const secs = seconds % 60;
//     return `${mins}:${secs.toString().padStart(2, "0")}`;
//   };

//   const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
//   e.preventDefault();

//   const pastedData = e.clipboardData.getData("text").trim();

//   // Allow only digits
//   const digits = pastedData.replace(/\D/g, "");

//   if (!digits) return;

//   const newOtp = [...otp];

//   for (let i = 0; i < Math.min(digits.length, 6); i++) {
//     newOtp[i] = digits[i];
//   }

//   setOtp(newOtp);

//   // Focus last filled input
//   const focusIndex = Math.min(digits.length, 6) - 1;
//   if (focusIndex >= 0) {
//     inputRefs.current[focusIndex]?.focus();
//   }

//   setError("");
// };

//   const handleOtpChange = (index: number, value: string): void => {
//     // Only allow numbers
//     if (value && !/^\d*$/.test(value)) return;

//     const newOtp = [...otp];
//     newOtp[index] = value.slice(0, 1);
//     setOtp(newOtp);

//     // Auto-focus next input
//     if (value && index < 5) {
//       inputRefs.current[index + 1]?.focus();
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
//     if (e.key === "Backspace" && !otp[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const handleVerify = async (): Promise<void> => {
//     const otpValue = otp.join("");
//     if (otpValue.length !== 6) {
//       setError("Please enter complete 6-digit OTP");
//       return;
//     }

//     setIsVerifying(true);
//     setError("");

//     try {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1500));
      
//       // For demo, accept any 6-digit number
//       if (otpValue.length === 6) {
//         onVerify?.(otpValue);
//         onClose();
//       } else {
//         setError("Invalid OTP. Please try again.");
//       }
//     } catch (err) {
//       setError("Verification failed. Please try again.");
//     } finally {
//       setIsVerifying(false);
//     }
//   };

//   const handleResendOtp = async (): Promise<void> => {
//     setIsResendDisabled(true);
//     setTimeLeft(120);
//     setError("");
    
//     // Simulate resend API call
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     // Reset OTP inputs
//     setOtp(["", "", "", "", "", ""]);
//     inputRefs.current[0]?.focus();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
//       {/* Backdrop */}
//       <div 
//         className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
//         onClick={onClose}
//       />
      
//       {/* Modal */}
//       <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
//         >
//           <X size={20} />
//         </button>

//         {/* Header */}
//         <div className="text-center pt-8 pb-4 px-6">
//           <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
//             type === "mobile" ? "bg-blue-100" : "bg-purple-100"
//           }`}>
//             {type === "mobile" ? (
//               <Smartphone size={32} className="text-blue-600" />
//             ) : (
//               <Mail size={32} className="text-purple-600" />
//             )}
//           </div>
//           <h3 className="text-2xl font-bold text-gray-900 mb-2">
//             Verify {type === "mobile" ? "Mobile Number" : "Email Address"}
//           </h3>
//           <p className="text-gray-600 text-sm">
//             We've sent a 6-digit verification code to
//             <span className="font-semibold text-gray-900 block mt-1">
//               {emailOrMobile}
//             </span>
//           </p>
//         </div>

//         {/* OTP Input Section */}
//         <div className="px-6 py-4">
//           <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
//             Enter Verification Code
//           </label>
          
//           <div className="flex justify-center gap-2 sm:gap-3 mb-4">
//             {otp.map((digit, index) => (
//               <input
//   key={index}
//   ref={(el) => {
//     inputRefs.current[index] = el;
//   }}
//   type="text"
//   inputMode="numeric"
//   maxLength={1}
//   value={digit}
//   onChange={(e) => handleOtpChange(index, e.target.value)}
//   onKeyDown={(e) => handleKeyDown(index, e)}
//   onPaste={handlePaste}
//   className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50"
//   style={{
//     borderColor: error ? "#EF4444" : digit ? "#10B981" : "#E5E7EB",
//   }}
// />
//             ))}
//           </div>

//           {/* Error Message */}
//           {error && (
//             <div className="flex items-center justify-center gap-2 mb-4 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
//               <AlertCircle size={16} />
//               <span>{error}</span>
//             </div>
//           )}

//           {/* Timer & Resend */}
//           <div className="text-center mb-6">
//             {isResendDisabled ? (
//               <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
//                 <Clock size={14} />
//                 <span>Resend code in {formatTime(timeLeft)}</span>
//               </div>
//             ) : (
//               <button
//                 onClick={handleResendOtp}
//                 className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
//               >
//                 Resend Verification Code
//               </button>
//             )}
//           </div>

//           {/* Verify Button */}
//           <button
//             onClick={handleVerify}
//             disabled={isVerifying}
//             className="w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
//           >
//             {isVerifying ? (
//               <div className="flex items-center justify-center gap-2">
//                 <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 <span>Verifying...</span>
//               </div>
//             ) : (
//               <span>Verify & Continue</span>
//             )}
//           </button>


//         </div>
//       </div>
//     </div>
//   );
// };

// export default OTPVerificationModal;

import { useState, useEffect, useRef} from "react";
import type { FC } from "react";
import { X, Mail, Smartphone, AlertCircle, Clock } from "lucide-react";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "mobile" | "email";
  emailOrMobile: string;
  onVerify?: (otp: string) => void;
  onResend?: () => void | Promise<void>;
  // NEW — optional. When provided, a "Skip" button is rendered next to
  // "Verify & Continue" that lets the user bypass OTP entry entirely.
  // Only pass this where skipping should be allowed (e.g. mobile
  // verification during registration) — every other caller of this modal
  // that omits this prop behaves exactly as before, with no Skip button.
  onSkip?: () => void;
}

const OTPVerificationModal: FC<OTPVerificationModalProps> = ({
  isOpen,
  onClose,
  type,
  emailOrMobile,
  onVerify,
  onResend,
  onSkip,
}) => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setOtp(["", "", "", "", "", ""]);
      setTimeLeft(120);
      setIsResendDisabled(true);
      setError("");
      // Auto-focus first input
      setTimeout(() => {
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 100);
    }
  }, [isOpen]);

  useEffect(() => {
    // let timer: NodeJS.Timeout;
    let timer: ReturnType<typeof setInterval>;
    if (isOpen && timeLeft > 0 && isResendDisabled) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isOpen, timeLeft, isResendDisabled]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
  e.preventDefault();

  const pastedData = e.clipboardData.getData("text").trim();

  // Allow only digits
  const digits = pastedData.replace(/\D/g, "");

  if (!digits) return;

  const newOtp = [...otp];

  for (let i = 0; i < Math.min(digits.length, 6); i++) {
    newOtp[i] = digits[i];
  }

  setOtp(newOtp);

  // Focus last filled input
  const focusIndex = Math.min(digits.length, 6) - 1;
  if (focusIndex >= 0) {
    inputRefs.current[focusIndex]?.focus();
  }

  setError("");
};

  const handleOtpChange = (index: number, value: string): void => {
    // Only allow numbers
    if (value && !/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(0, 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async (): Promise<void> => {
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      // onVerify is expected to throw on an invalid/expired code (it calls
      // the real Cognito verifyOtp / verifyMobileOtp), so we await it here
      // and only close the modal on success.
      await onVerify?.(otpValue);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    setIsResendDisabled(true);
    setTimeLeft(120);
    setError("");

    try {
      await onResend?.();
    } catch (err: any) {
      setError(err?.message || "Could not resend code. Please try again.");
    }

    // Reset OTP inputs
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  // NEW — Skip just closes the modal and lets the caller's onSkip handler
  // decide what happens next (registration form treats a skip the same as
  // a successful verification, minus the "mobile verified" flag).
  const handleSkip = (): void => {
    onClose();
    onSkip?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl transform transition-all animate-in fade-in zoom-in duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center pt-8 pb-4 px-6">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
            type === "mobile" ? "bg-blue-100" : "bg-purple-100"
          }`}>
            {type === "mobile" ? (
              <Smartphone size={32} className="text-blue-600" />
            ) : (
              <Mail size={32} className="text-purple-600" />
            )}
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Verify {type === "mobile" ? "Mobile Number" : "Email Address"}
          </h3>
          <p className="text-gray-600 text-sm">
            We've sent a 6-digit verification code to
            <span className="font-semibold text-gray-900 block mt-1">
              {emailOrMobile}
            </span>
          </p>
        </div>

        {/* OTP Input Section */}
        <div className="px-6 py-4">
          <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
            Enter Verification Code
          </label>
          
          <div className="flex justify-center gap-2 sm:gap-3 mb-4">
            {otp.map((digit, index) => (
              <input
  key={index}
  ref={(el) => {
    inputRefs.current[index] = el;
  }}
  type="text"
  inputMode="numeric"
  maxLength={1}
  value={digit}
  onChange={(e) => handleOtpChange(index, e.target.value)}
  onKeyDown={(e) => handleKeyDown(index, e)}
  onPaste={handlePaste}
  className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold border-2 rounded-xl focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all bg-gray-50"
  style={{
    borderColor: error ? "#EF4444" : digit ? "#10B981" : "#E5E7EB",
  }}
/>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-center justify-center gap-2 mb-4 text-red-600 text-sm bg-red-50 p-2 rounded-lg">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {/* Timer & Resend */}
          <div className="text-center mb-6">
            {isResendDisabled ? (
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                <Clock size={14} />
                <span>Resend code in {formatTime(timeLeft)}</span>
              </div>
            ) : (
              <button
                onClick={handleResendOtp}
                className="text-sm text-green-600 hover:text-green-700 font-semibold transition-colors"
              >
                Resend Verification Code
              </button>
            )}
          </div>

          {/* Verify Button (+ Skip, only when onSkip is provided) */}
          <div className={onSkip ? "flex gap-3" : ""}>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              className="flex-1 w-full py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg"
            >
              {isVerifying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying...</span>
                </div>
              ) : (
                <span>Verify &amp; Continue</span>
              )}
            </button>

            {onSkip && (
              <button
                onClick={handleSkip}
                disabled={isVerifying}
                type="button"
                className="flex-1 w-full py-3 bg-white hover:bg-gray-50 text-gray-700 font-semibold rounded-xl border-2 border-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;