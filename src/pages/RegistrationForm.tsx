import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

// Zod Schema for validation
const formSchema = z.object({
  applicantName: z.string().min(1, "Applicant name is required"),
  gender: z.string().min(1, "Gender is required"),
  isBiharDomicile: z.string().min(1, "Domicile status is required"),
  category: z.string().min(1, "Category is required"),
  caste: z.string().min(1, "Caste is required"),
  isNonCreamyLayer: z.string().min(1, "Non-creamy layer status is required"),
  isPwD: z.string().min(1, "PWD status is required"),
  natureOfDisability: z.string().optional(),
  isMin40PercentPwD: z.string().min(1, "Minimum 40% disability status is required"),
  isExServiceman: z.string().min(1, "Ex-serviceman status is required"),
  serviceYears: z.string().optional(),
  serviceMonths: z.string().optional(),
  serviceDays: z.string().optional(),
  isNccCadet: z.string().min(1, "NCC cadet status is required"),
  nccCertificateNo: z.string().optional(),
  isBiharGovtEmployee: z.string().min(1, "Bihar Govt employee status is required"),
  bsscAttempts: z.string().min(1, "BSSC attempts is required"),
  isContractualEmployee: z.string().min(1, "Contractual employee status is required"),
  nameOfPost: z.string().optional(),
  hasAgreement: z.string().optional(),
  contractualYears: z.string().optional(),
  contractualMonths: z.string().optional(),
  contractualDays: z.string().optional(),
  mobileNo: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^[6-9]\d{9}$/, "Enter valid 10 digit mobile number starting with 6-9"),
  confirmMobileNo: z
    .string()
    .min(1, "Confirm mobile number is required"),
  emailId: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email"),
  confirmEmailId: z
    .string()
    .min(1, "Confirm email is required"),
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
  captchaInput: z.string().min(1, "Captcha is required"),
}).refine((data) => data.mobileNo === data.confirmMobileNo, {
  message: "Mobile numbers do not match",
  path: ["confirmMobileNo"],
}).refine((data) => data.emailId === data.confirmEmailId, {
  message: "Email addresses do not match",
  path: ["confirmEmailId"],
});

type FormData = z.infer<typeof formSchema>;

const Spinner = () => (
  <svg
    className="animate-spin h-5 w-5 mr-2"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default function GovernmentRegistrationForm() {
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [age, setAge] = useState({ years: 0, months: 0, days: 0 });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
    clearErrors,
    watch,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      applicantName: '',
      gender: '',
      isBiharDomicile: '',
      category: '',
      caste: '',
      isNonCreamyLayer: '',
      isPwD: '',
      natureOfDisability: '',
      isMin40PercentPwD: '',
      isExServiceman: '',
      serviceYears: '',
      serviceMonths: '',
      serviceDays: '',
      isNccCadet: '',
      nccCertificateNo: '',
      isBiharGovtEmployee: '',
      bsscAttempts: '',
      isContractualEmployee: '',
      nameOfPost: '',
      hasAgreement: '',
      contractualYears: '',
      contractualMonths: '',
      contractualDays: '',
      mobileNo: '',
      confirmMobileNo: '',
      emailId: '',
      confirmEmailId: '',
      dob: undefined,
      captchaInput: '',
    },
  });

  // Calculate age based on selected date
  const calculateAge = (birthDate: Date) => {
    const referenceDate = new Date(2025, 7, 1); // 01-08-2025
    
    let years = referenceDate.getFullYear() - birthDate.getFullYear();
    let months = referenceDate.getMonth() - birthDate.getMonth();
    let days = referenceDate.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setValue("dob", date as Date, { shouldValidate: true });
    if (date) {
      clearErrors("dob");
      const calculatedAge = calculateAge(date);
      setAge(calculatedAge);
    } else {
      setAge({ years: 0, months: 0, days: 0 });
    }
    trigger("dob");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValue(name as any, value, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log('Registration Payload:', {
      ...data,
      dob: data.dob ? data.dob.toISOString().split('T')[0] : null,
      age: age,
    });

    alert('Form Submitted successfully! Check console for state payload.');
    setLoading(false);
  };

  const onError = (errors: any) => {
    console.log("Validation errors:", errors);
    alert("Please fill all required fields correctly.");
  };

  return (
    <div className="w-full min-h-screen bg-white p-2 md:p-6 font-sans text-[13px] text-gray-900 selection:bg-blue-200">
      <div className="max-w-6xl mx-auto border border-gray-300 bg-white">
          
        {/* --- Section Header: Registration --- */}
        <div className="bg-[#002060] text-white px-4 py-2 flex items-center justify-between font-bold text-sm tracking-wide">
          <div className="flex items-center space-x-2">
            <span>REGISTRATION</span>
            <span className="bg-white text-[#002060] rounded-full w-4 h-4 flex items-center justify-center text-[10px]">➔</span>
          </div>
        </div>

        {/* --- Javascript Link --- */}
        <div className="text-right p-2 bg-white">
          <a href="#" className="text-[#002060] underline font-bold text-[11px] hover:text-blue-800 tracking-tight">
            GUIDELINE TO ENABLE JAVASCRIPT
          </a>
        </div>

        {/* --- MAIN REGISTRATION FORM GRID --- */}
        <form onSubmit={handleSubmit(onSubmit, onError)} className="border-t border-l border-[#2f69ff] m-2 md:m-4">
          
          {/* 1. Name of Applicant */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> NAME OF APPLICANT</span>
              <span className="text-gray-700 font-medium text-[12px]">(आवेदक का नाम) :</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <input 
                type="text" 
                {...register("applicantName")}
                className="w-full max-w-md border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 uppercase text-[13px]"
              />
              {errors.applicantName && (
                <p className="text-red-500 text-xs mt-1">{errors.applicantName.message}</p>
              )}
              <div className="text-red-600 text-[11px] font-bold mt-1 leading-normal">
                NOTE 1: NAME AS IN THE MATRICULATION/SECONDARY EXAMINATION CERTIFICATE.<br />
                NOTE 2: PLEASE DO NOT USE ANY PREFIX SUCH AS MR. OR MS. ETC
              </div>
            </div>
          </div>

          {/* 2. Gender */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> GENDER</span>
              <span className="text-gray-700 font-medium text-[12px]">(लिंग) :</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex flex-col justify-center">
              <div className="flex flex-wrap gap-4 items-center font-bold text-gray-800">
                {['MALE', 'FEMALE', 'TRANSGENDER'].map((g) => (
                  <label key={g} className="flex items-center space-x-1 cursor-pointer">
                    <input 
                      type="radio" 
                      value={g} 
                      {...register("gender")}
                      className="accent-blue-800" 
                    />
                    <span>{g}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
              )}
              <span className="text-red-600 text-[11px] font-bold mt-1">
                (TRANSGENDER CANDIDATE OF BIHAR STATE DOMICILE MUST APPLY AS BC CATEGORY)
              </span>
            </div>
          </div>

          {/* 3. Domicile of Bihar */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> DOMICILE OF BIHAR STATE?</span>
              <span className="text-gray-700 font-medium text-[12px]">(बिहार राज्य का निवासी?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isBiharDomicile")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isBiharDomicile && (
                <p className="text-red-500 text-xs">{errors.isBiharDomicile.message}</p>
              )}
            </div>
          </div>

          {/* 4. Category */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> CATEGORY</span>
              <span className="text-gray-700 font-medium text-[12px]">(श्रेणी) :</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex flex-wrap gap-4 items-center font-bold text-gray-800">
              {['UR', 'SC', 'ST', 'EBC', 'BC', 'EWS'].map((cat) => (
                <label key={cat} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={cat} 
                    {...register("category")}
                    className="accent-blue-800" 
                  />
                  <span>{cat}</span>
                </label>
              ))}
              {errors.category && (
                <p className="text-red-500 text-xs w-full">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* 5. Caste */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> CASTE <span className="font-medium text-gray-700 text-[12px]">(जाति):</span></span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <select 
                {...register("caste")}
                className="w-full max-w-xs border border-gray-400 p-2 rounded-md bg-white outline-none text-xs font-semibold"
              >
                <option value="">--Select--</option>
                <option value="GENERIC_CAST">Sample Caste Group</option>
              </select>
              {errors.caste && (
                <p className="text-red-500 text-xs mt-1">{errors.caste.message}</p>
              )}
            </div>
          </div>

          {/* 6. Non-Creamy Layer */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> DO YOU BELONG TO NON-CREAMY LAYER ?</span>
              <span className="text-gray-700 font-medium text-[11px]">( क्या आप क्रीमीलेयर रहित से संबंधित हैं?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isNonCreamyLayer")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isNonCreamyLayer && (
                <p className="text-red-500 text-xs">{errors.isNonCreamyLayer.message}</p>
              )}
            </div>
          </div>

          {/* 7. Person with Disability */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> ARE YOU PERSON WITH DISABILITY?</span>
              <span className="text-gray-700 font-medium text-[11px]">(क्या आप दिव्यांगता (PWD) वाले व्यक्ति हैं?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isPwD")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isPwD && (
                <p className="text-red-500 text-xs">{errors.isPwD.message}</p>
              )}
            </div>
          </div>

          {/* 8. Nature of Disability */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800">NATURE OF DISABILITY?</span>
              <span className="text-gray-700 font-medium text-[11px]">(दिव्यांगता की प्रकृति):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['PERMANENT', 'TEMPORARY'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("natureOfDisability")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 9. Minimum 40% Disability */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> ARE YOU A PERSON WITH MINIMUM 40% DISABILITY(PWD)?</span>
              <span className="text-gray-700 font-medium text-[11px]">(क्या आप न्यूनतम 40% दिव्यांगता (PWD) वाले व्यक्ति हैं?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isMin40PercentPwD")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isMin40PercentPwD && (
                <p className="text-red-500 text-xs">{errors.isMin40PercentPwD.message}</p>
              )}
            </div>
          </div>

          {/* 10. Ex-Serviceman */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> ARE YOU AN EX-SERVICEMAN? <span className="font-medium text-gray-700 text-[11px]">(क्या आप भूतपूर्व सैनिक हैं?):</span></span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isExServiceman")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isExServiceman && (
                <p className="text-red-500 text-xs">{errors.isExServiceman.message}</p>
              )}
            </div>
          </div>

          {/* 11. Service in Defence */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> SERVICE IN DEFENCE <span className="font-medium text-gray-700 text-[11px]">(रक्षा में सेवा):</span></span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex flex-wrap gap-2 items-center">
              <select 
                {...register("serviceYears")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Year--</option>
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              <select 
                {...register("serviceMonths")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Month--</option>
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              <select 
                {...register("serviceDays")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Day--</option>
                <option value="0">0</option>
              </select>
            </div>
          </div>

          {/* 12. NCC Cadet */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> ARE YOU NCC FULL TIME CADET/INSTRUCTOR?</span>
              <span className="text-gray-700 font-medium text-[11px]">(क्या आप एनसीसी के पूर्णकालिक कैडेट/अनुदेशक हैं?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isNccCadet")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isNccCadet && (
                <p className="text-red-500 text-xs">{errors.isNccCadet.message}</p>
              )}
            </div>
          </div>

          {/* 13. NCC Certificate */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800">ENTER NCC 'C' CERTIFICATE NO.</span>
              <span className="text-gray-700 font-medium text-[11px]">(एनसीसी 'सी' प्रमाणपत्र संख्या दर्ज करें):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <input 
                type="text" 
                {...register("nccCertificateNo")}
                className="w-full max-w-md border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600"
              />
            </div>
          </div>

          {/* 14. Bihar Govt Employee */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> ARE YOU BIHAR GOVERNMENT EMPLOYEE WHO HAS RENDERED NOT LESS THAN 3 YEARS REGULAR AND CONTINUOUS SERVICE?</span>
              <span className="text-gray-700 font-medium text-[11px]">(क्या आप बिहार सरकार के कर्मचारी हैं जिन्होंने कम से कम तीन साल नियमित एवं लगातार सेवा की है? ) :</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isBiharGovtEmployee")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isBiharGovtEmployee && (
                <p className="text-red-500 text-xs">{errors.isBiharGovtEmployee.message}</p>
              )}
            </div>
          </div>

          {/* 15. BSSC Exam Attempts */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> IN BSSC EXAMS NUMBER OF ATTEMPTS AFTER 12-12-2022</span>
              <span className="text-gray-700 font-medium text-[11px]">(दिनांक 12-12-2022 के बाद बिहार कर्मचारी चयन आयोग की परीक्षाओं में प्रयासों की संख्या) :</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <select 
                {...register("bsscAttempts")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Select--</option>
                <option value="0">0</option>
                <option value="1">1</option>
              </select>
              {errors.bsscAttempts && (
                <p className="text-red-500 text-xs mt-1">{errors.bsscAttempts.message}</p>
              )}
            </div>
          </div>

          {/* 16. Contractual Employee */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> ARE YOU A CONTRACTUAL EMPLOYEE ON ANY OF THE POSTS MENTIONED IN THE ADVERTISEMENT IN THE BIHAR GOVERNMENT?</span>
              <span className="text-gray-700 font-medium text-[11px]">(क्या आप बिहार सरकार में विज्ञापन में उल्लिखित पदों में से किसी पद पर संविदा नियोजित कर्मी हैं?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex items-center space-x-4 font-bold text-gray-800">
              {['YES', 'NO'].map((opt) => (
                <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                  <input 
                    type="radio" 
                    value={opt} 
                    {...register("isContractualEmployee")}
                    className="accent-blue-800" 
                  />
                  <span>{opt}</span>
                </label>
              ))}
              {errors.isContractualEmployee && (
                <p className="text-red-500 text-xs">{errors.isContractualEmployee.message}</p>
              )}
            </div>
          </div>

          {/* 17. Name of Post */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800">NAME OF POST <span className="font-medium text-gray-700 text-[11px]">(पद का नाम) :</span></span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <select 
                {...register("nameOfPost")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs w-full max-w-xs"
              >
                <option value="">--Select--</option>
              </select>
            </div>
          </div>

          {/* 18. Circular Agreement */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800">DO YOU HAVE AGREEMENT IN THE LIGHT OF CIRCULAR NO. - 1003, DATED - 22.01.2021 OF GENERAL ADMINISTRATION DEPARTMENT, BIHAR, PATNA?</span>
              <span className="text-gray-700 font-medium text-[11px]">(क्या आपके पास सामान्य प्रशासन विभाग, बिहार, पटना के संकल्प ज्ञापंक - 1003, दिनांक - 22.01.2021 के आलोक में एकरारनामा है?):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex flex-col justify-center">
              <div className="flex items-center space-x-4 font-bold text-gray-800">
                {['YES', 'NO'].map((opt) => (
                  <label key={opt} className="flex items-center space-x-1 cursor-pointer">
                    <input 
                      type="radio" 
                      value={opt} 
                      {...register("hasAgreement")}
                      className="accent-blue-800" 
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
              <div className="text-red-600 text-[11px] font-bold mt-1 uppercase leading-tight">
                NOTE: PLEASE ENSURE THAT YOU HAVE VALID AGREEMENT COPY AND CONTRACTUAL EXPERIENCE CERTIFICATE IN PRESCRIBED FORMAT AS YOU HAVE TO UPLOAD IT, OTHERWISE YOU WILL NOT GET WEIGHTAGE.
              </div>
            </div>
          </div>

          {/* 19. Contractual Service Period */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800">CONTRACTUAL SERVICE PERIOD IN BIHAR GOVERNMENT ON MENTIONED POSTS ?</span>
              <span className="text-gray-700 font-medium text-[11px]">(उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white flex flex-wrap gap-2 items-center">
              <select 
                {...register("contractualYears")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Year--</option>
              </select>
              <select 
                {...register("contractualMonths")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Month--</option>
              </select>
              <select 
                {...register("contractualDays")}
                className="border border-gray-400 p-2 rounded-md bg-white outline-none font-semibold text-xs"
              >
                <option value="">--Day--</option>
              </select>
            </div>
          </div>

          {/* 20. Mobile No */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> MOBILE NO</span>
              <span className="text-gray-700 font-medium text-[12px]">(मोबाइल नम्बर):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <input 
                type="text" 
                maxLength={10}
                {...register("mobileNo")}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  e.target.value = value;
                  register("mobileNo").onChange(e);
                }}
                className="w-full max-w-md border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 font-mono"
              />
              {errors.mobileNo && (
                <p className="text-red-500 text-xs mt-1">{errors.mobileNo.message}</p>
              )}
              <div className="text-red-600 text-[11px] font-bold mt-1 uppercase">
                [PLEASE KEEP THIS MOBILE NO. ACTIVE FOR RECEIVING COMMUNICATION/INFORMATION PERTAINING TO THE RECRUITMENT PROCESS.]
              </div>
            </div>
          </div>

          {/* 21. Confirm Mobile No */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> CONFIRM MOBILE NO</span>
              <span className="text-gray-700 font-medium text-[12px]">(मोबाइल नंबर की पुष्टि):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <input 
                type="text" 
                maxLength={10}
                {...register("confirmMobileNo")}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  e.target.value = value;
                  register("confirmMobileNo").onChange(e);
                }}
                className="w-full max-w-md border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 font-mono"
              />
              {errors.confirmMobileNo && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmMobileNo.message}</p>
              )}
            </div>
          </div>

          {/* 22. Email ID */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> EMAIL ID</span>
              <span className="text-gray-700 font-medium text-[12px]">(ईमेल आईडी):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <input 
                type="email" 
                {...register("emailId")}
                className="w-full max-w-md border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 lowercase"
              />
              {errors.emailId && (
                <p className="text-red-500 text-xs mt-1">{errors.emailId.message}</p>
              )}
              <div className="text-red-600 text-[11px] font-bold mt-1 uppercase">
                [NOTE: PLEASE KEEP THIS EMAIL ID ACTIVE FOR RECEIVING COMMUNICATION/INFORMATION PERTAINING TO THE RECRUITMENT PROCESS.]
              </div>
            </div>
          </div>

          {/* 23. Confirm Email ID */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> CONFIRM EMAIL ID</span>
              <span className="text-gray-700 font-medium text-[12px]">(ईमेल आईडी की पुष्टि):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <input 
                type="email" 
                {...register("confirmEmailId")}
                className="w-full max-w-md border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 lowercase"
              />
              {errors.confirmEmailId && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmEmailId.message}</p>
              )}
            </div>
          </div>

          {/* 24. Date of Birth with DatePicker */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800"><span className="text-red-600">*</span> DATE OF BIRTH</span>
              <span className="text-gray-700 font-medium text-[12px]">(जन्म तिथि):</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white">
              <div className="flex items-center space-x-2">
                <div className="flex-1 max-w-md">
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    dateFormat="yyyy-MM-dd"
                    placeholderText="YYYY-MM-DD"
                    className="w-full border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 text-sm"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={new Date(new Date().getFullYear() - 100, 0, 1)}
                    isClearable
                    shouldCloseOnSelect
                  />
                </div>
                <button 
                  type="button" 
                  onClick={() => {
                    const datePickerInput = document.querySelector('.react-datepicker__input-container input');
                    if (datePickerInput) {
                      (datePickerInput as HTMLInputElement).focus();
                    }
                  }}
                  className="p-2 border border-gray-400 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  📅
                </button>
              </div>
              {errors.dob && (
                <p className="text-red-500 text-xs mt-1">{errors.dob.message}</p>
              )}
              <div className="text-red-600 text-[11px] font-bold mt-1 uppercase">
                [NOTE :DOB AS IN THE MATRICULATION/10TH STANDARD OR EQUIVALENT CERTIFICATE.]
              </div>
            </div>
          </div>

          {/* 25. Age Display Row with Calculated Age */}
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-r border-[#2f69ff]">
            <div className="md:col-span-5 bg-[#eef4ff] p-2 flex flex-col justify-center text-right pr-3 border-b md:border-b-0 md:border-r border-[#2f69ff]">
              <span className="font-bold text-gray-800">AGE (उम्र):</span>
              <span className="text-blue-700 font-bold text-[11px]">(AS ON 01-08-2025)</span>
            </div>
            <div className="md:col-span-7 p-2 bg-white font-mono font-bold flex items-center text-lg">
              {age.years > 0 || age.months > 0 || age.days > 0 ? (
                <span className="text-blue-800">
                  {age.years} year{age.years !== 1 ? 's' : ''} {age.months} month{age.months !== 1 ? 's' : ''} {age.days} day{age.days !== 1 ? 's' : ''}
                </span>
              ) : (
                <span className="text-gray-400 text-sm">Please select date of birth</span>
              )}
            </div>
          </div>

        </form>

        {/* --- CAPTCHA SECTION BLOCK --- */}
        <div className="m-2 md:m-4 bg-[#f2f7ff] border border-blue-400">
          <div className="bg-[#002060] text-white px-4 py-1.5 flex items-center justify-between font-bold text-xs tracking-wide">
            <div className="flex items-center space-x-2">
              <span>CAPTCHA CODE</span>
              <span className="bg-white text-[#002060] rounded-full w-3.5 h-3.5 flex items-center justify-center text-[9px]">➔</span>
            </div>
          </div>
          
          <div className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 text-right font-bold text-gray-800 text-[13px]">
              <span className="text-red-600">*</span>ENTER CAPTCHA CODE (कैप्चा कोड दर्ज करें) <span className="text-red-600 uppercase">(SHOWN IN BLUE COLOUR[नीला रंग में दिखाया गया])</span> :
            </div>
            <div className="md:col-span-7 space-y-3">
              <input 
                type="text" 
                {...register("captchaInput")}
                className="border border-gray-400 px-3 py-2 rounded-md outline-none focus:border-blue-600 w-full max-w-xs font-mono font-bold"
              />
              {errors.captchaInput && (
                <p className="text-red-500 text-xs">{errors.captchaInput.message}</p>
              )}
              
              <div className="flex items-center space-x-3">
                <div className="bg-white border border-gray-300 px-4 py-1 select-none font-mono text-xl font-black text-blue-800 tracking-widest italic shadow-inner bg-opacity-70">
                  UZWT1W
                </div>
                <button type="button" className="flex items-center space-x-1 text-[#002060] font-bold text-xs hover:underline">
                  <span className="text-lg">🔄</span>
                  <span className="uppercase text-[11px]">REFRESH CAPTCHA</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* --- FORM SUBMIT BUTTON CONTAINER --- */}
        <div className="p-6 text-center bg-white border-t border-gray-200">
          <button 
            type="submit" 
            disabled={loading}
            onClick={handleSubmit(onSubmit, onError)}
            className="bg-[#000080] hover:bg-blue-900 disabled:bg-blue-400 text-white font-bold px-10 py-2.5 rounded-md shadow flex items-center justify-center mx-auto transition-all min-w-[200px]"
          >
            {loading ? (
              <>
                <Spinner />
                PROCESSING...
              </>
            ) : (
              'SAVE AND CONTINUE'
            )}
          </button>
        </div>

      </div>
    </div>
  );
}