import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  RefreshCw, 
  AlertCircle,
  ArrowRight,
  Search,
  ShieldCheck
} from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),

  mobile: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number starting with 6-9"),

  dob: z
    .date({
      required_error: "Date of Birth is required",
      invalid_type_error: "Please select a valid date",
    })
    .refine((date) => {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      return date >= minDate && date <= today;
    }, "Please enter a valid date of birth"),

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
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      mobile: "",
      dob: undefined,
      captcha: "",
    },
  });

  const handleRefreshCaptcha = () => {
    console.log("Refresh captcha");
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue("dob", date as Date, { shouldValidate: true });
    if (date) {
      clearErrors("dob");
    }
    trigger("dob");
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Form Data:", {
      ...data,
      dob: data.dob ? data.dob.toISOString().split('T')[0] : null,
    });

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] px-4 py-8 flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-[600px]">
        <div className="bg-white border border-[#E1E5E3] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 pt-6 pb-8 md:px-8">
          
          {/* Header */}
          <div className="text-center mb-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-12 w-12 rounded-full bg-[#003A2B]/10 flex items-center justify-center">
                <Search className="h-6 w-6 text-[#003A2B]" />
              </div>
            </div>
            <h2 className="text-[24px] md:text-[26px] font-bold text-[#003A2B]">
              Forgot Registration Number
            </h2>
            <p className="text-[14px] text-[#4B5563] mt-1">
              Enter your details below to recover your registration number
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                <span className="text-red-500">*</span> Email ID
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <Mail size={18} />
                </span>
                <input
                  {...register("email")}
                  type="email"
                  className="w-full py-3 border border-[#4c90ff] rounded-lg pl-11 pr-4 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                  placeholder="Enter your registered email"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile Field */}
            <div>
              <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                <span className="text-red-500">*</span> Mobile Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                  <Phone size={18} />
                </span>
                <input
                  {...register("mobile")}
                  type="text"
                  maxLength={10}
                  className="w-full py-3 border border-[#4c90ff] rounded-lg pl-11 pr-4 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                  placeholder="Enter 10 digit mobile number"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = value;
                    register("mobile").onChange(e);
                  }}
                />
              </div>
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.mobile.message}
                </p>
              )}
            </div>

            {/* DOB Field */}
            <div>
              <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                <span className="text-red-500">*</span> Date of Birth
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] z-10">
                  <Calendar size={18} />
                </span>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  placeholderText="DD-MM-YYYY"
                  className="w-full py-3 border border-[#4c90ff] rounded-lg pl-11 pr-4 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  maxDate={new Date()}
                  minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                  isClearable
                  shouldCloseOnSelect
                  popperClassName="react-datepicker-popper"
                />
              </div>
              <div className="text-[11px] text-[#6B7280] mt-1.5">
                Format: DD-MM-YYYY (e.g., 01-08-2025)
              </div>
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.dob.message}
                </p>
              )}
            </div>

            {/* Captcha Section */}
            <div className="border border-[#E1E5E3] bg-[#F9FAFB] rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-[13px] font-semibold text-[#4B5563] flex items-center gap-2">
                  <Shield size={16} />
                  Security Verification
                </span>
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#003A2B] hover:text-[#002B20] transition-colors"
                >
                  <RefreshCw size={12} />
                  Refresh
                </button>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                <div className="w-full sm:w-[180px] min-h-[55px] bg-white border border-[#D1D5DB] rounded-lg flex items-center justify-center px-2">
                  <div className="text-[#0000ff] text-2xl font-bold italic tracking-widest font-mono">
                    K8W87W
                  </div>
                </div>

                <div className="flex-1 relative">
                  <input
                    {...register("captcha")}
                    type="text"
                    placeholder="Enter CAPTCHA code"
                    className="w-full h-[48px] border border-[#4c90ff] rounded-lg px-4 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                  />
                </div>
              </div>
              {errors.captcha && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.captcha.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 bg-[#003A2B] hover:bg-[#002B20] text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
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

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#E1E5E3] flex items-center justify-center gap-2 text-[#9CA3AF]">
            <ShieldCheck size={16} />
            <span className="text-[12px] font-medium">
              Secure AES-256 Encrypted Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BSSCForgotRegistration;