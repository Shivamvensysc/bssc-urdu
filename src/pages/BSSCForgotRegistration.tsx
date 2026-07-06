import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

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
    <div className="w-full max-w-[1100px] mx-auto bg-white shadow-sm font-sans text-black">
      <div className="p-4 bg-white min-h-[500px]">
        <div className="border border-[#001489] rounded-sm overflow-hidden shadow-sm">
          <div className="bg-[#0000a0] text-white font-bold text-[13px] px-4 py-2 uppercase">
            FORGOT YOUR REGISTRATION NUMBER.
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white py-12 px-4 space-y-5 max-w-[650px] mx-auto"
          >
            {/* Email */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <label className="col-span-5 text-right pt-3 font-bold text-[12px] uppercase">
                <span className="text-red-600">*</span> EMAIL ID :
              </label>

              <div className="col-span-7">
                <input
                  {...register("email")}
                  type="email"
                  className="w-full border border-[#4c90ff] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />

                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            {/* Mobile */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <label className="col-span-5 text-right pt-3 font-bold text-[12px] uppercase">
                <span className="text-red-600">*</span> MOBILE NO :
              </label>

              <div className="col-span-7">
                <input
                  {...register("mobile")}
                  type="text"
                  maxLength={10}
                  placeholder="Enter 10 digit mobile number"
                  className="w-full border border-[#4c90ff] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    e.target.value = value;
                    register("mobile").onChange(e);
                  }}
                />

                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.mobile.message}
                  </p>
                )}
              </div>
            </div>

            {/* DOB with DatePicker */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <label className="col-span-5 text-right pt-3 font-bold text-[12px] uppercase">
                <span className="text-red-600">*</span> DATE OF BIRTH :
              </label>

              <div className="col-span-7">
                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      dateFormat="dd-MM-yyyy"
                      placeholderText="DD-MM-YYYY"
                      className="w-full border border-[#4c90ff] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500"
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

                  <button
                    type="button"
                    onClick={() => {
                      // Focus the date picker
                      const datePickerInput = document.querySelector('.react-datepicker__input-container input');
                      if (datePickerInput) {
                        (datePickerInput as HTMLInputElement).focus();
                      }
                    }}
                    className="border px-2 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  >
                    📅
                  </button>
                </div>

                <div className="text-blue-600 text-xs font-bold mt-1">
                  DD-MM-YYYY (01-08-2025)
                </div>

                {errors.dob && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.dob.message}
                  </p>
                )}
              </div>
            </div>

            {/* Captcha Input */}
            <div className="grid grid-cols-12 gap-2 items-start">
              <label className="col-span-5 text-right pt-3 font-bold text-[12px] uppercase">
                <span className="text-red-600">*</span> ENTER CAPTCHA :
              </label>

              <div className="col-span-7">
                <input
                  {...register("captcha")}
                  placeholder="Enter captcha"
                  className="w-[220px] border border-[#4c90ff] rounded-lg py-2 px-3 outline-none focus:ring-2 focus:ring-blue-500"
                />

                {errors.captcha && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.captcha.message}
                  </p>
                )}
              </div>
            </div>

            {/* Captcha Display */}
            <div className="grid grid-cols-12 gap-2">
              <div className="col-span-5" />

              <div className="col-span-7 flex items-center gap-6">
                <div className="text-[#0000ff] text-[22px] font-bold italic tracking-widest">
                  K8W87W
                </div>

                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="flex items-center gap-2 text-xs font-bold"
                >
                  Refresh Captcha

                  <span className="bg-blue-600 text-white rounded-full p-1">
                    ↻
                  </span>
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="text-center pt-6">
              <button
                disabled={loading}
                type="submit"
                className="bg-[#00008b] hover:bg-blue-900 disabled:bg-blue-400 text-white font-bold tracking-widest text-[16px] px-16 py-3 rounded-lg flex justify-center items-center gap-2 mx-auto min-w-[180px]"
              >
                {loading ? (
                  <>
                    <Spinner />
                    Processing...
                  </>
                ) : (
                  "SUBMIT"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BSSCForgotRegistration;