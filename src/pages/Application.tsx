
// import React, {useState,useRef,useCallback,useEffect,} from "react";
// import  type {ChangeEvent,} from "react";
// import {
//   User,
//   CreditCard,
//   GraduationCap,
//   Upload,
//   Camera,
//   ClipboardCheck,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   AlertCircle,
//   RotateCcw,
//   Download,
//   LogOut,
//   Eye,
//   Loader2,
// } from "lucide-react";

// import type {
//   PersonalData,
//   PaymentData,
//   EducationData,
//   PhotoData,
//   LivePhotoData,
//   FormData,
//   Step1Props,
//   Step2Props,
//   Step3Props,
//   Step4Props,
//   Step5Props,
//   Step6Props,
//   FieldProps,
//   PillGroupProps,
//   SectionTitleProps,
//   NoteProps,
//   AddressFieldsProps,
//   CertNumberDateAuthorityProps,
//   EducationBlockProps,
//   UploadField,
//   Step,
//   Candidate,
// } from "../types/application";

// /* ---------------------------------------------------------------
//    TOKENS — matches the Candidate Registration page design system
// --------------------------------------------------------------- */
// const INK = "#12233F";
// const INK_SOFT = "#5B6B84";
// const PAPER = "#F4F5F2";
// const CARD = "#FFFFFF";
// const LINE = "#DBDFE6";
// const OCHRE = "#B9722E";
// const OCHRE_DEEP = "#8F5522";
// const TEAL = "#1E6F5C";
// const DANGER = "#B3432B";

// const FONTS = `
//   @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
//   .gf-root, .gf-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
//   .gf-display { font-family: 'Fraunces', serif; }
//   .gf-mono { font-family: 'JetBrains Mono', monospace; }

//   .gf-root input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
//   .gf-pill {
//     display: inline-flex; align-items: center; gap: 6px;
//     padding: 8px 16px; border-radius: 999px; border: 1.5px solid ${LINE};
//     background: #fff; cursor: pointer; font-weight: 700; font-size: 12.5px;
//     color: ${INK}; transition: all .15s ease; user-select: none;
//   }
//   .gf-pill:hover { border-color: ${OCHRE}; }
//   .gf-radio-input:checked + .gf-pill { background: ${INK}; border-color: ${INK}; color: #fff; }
//   .gf-radio-input:focus-visible + .gf-pill { outline: 2px solid ${OCHRE}; outline-offset: 2px; }

//   .gf-input, .gf-select {
//     width: 100%; border: 1.5px solid ${LINE}; border-radius: 10px;
//     padding: 10px 13px; font-size: 13.5px; font-weight: 600; color: ${INK};
//     background: #fff; outline: none; transition: border-color .15s ease, box-shadow .15s ease;
//   }
//   .gf-input:disabled { background: #F1F2F4; color: ${INK_SOFT}; }
//   .gf-input:focus, .gf-select:focus { border-color: ${OCHRE}; box-shadow: 0 0 0 3px rgba(185,114,46,0.15); }
//   .gf-input.gf-error, .gf-select.gf-error { border-color: ${DANGER}; }
//   .gf-input::placeholder { color: #A6AEBB; font-weight: 500; }

//   .gf-btn-primary {
//     display: inline-flex; align-items: center; justify-content: center; gap: 8px;
//     padding: 11px 26px; border-radius: 999px; font-weight: 800; font-size: 13px;
//     background: ${INK}; color: #fff; border: none; cursor: pointer; transition: opacity .15s ease;
//   }
//   .gf-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
//   .gf-btn-secondary {
//     display: inline-flex; align-items: center; justify-content: center; gap: 8px;
//     padding: 10px 24px; border-radius: 999px; font-weight: 800; font-size: 13px;
//     background: #fff; color: ${INK}; border: 1.5px solid ${LINE}; cursor: pointer;
//   }
//   .gf-btn-secondary:hover { border-color: ${OCHRE_DEEP}; }

//   @keyframes gf-pop { 0% { transform: scale(.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
//   .gf-pop { animation: gf-pop .35s cubic-bezier(.34,1.56,.64,1); }
//   @keyframes gf-spin { to { transform: rotate(360deg); } }
//   .gf-spin { animation: gf-spin .8s linear infinite; }
// `;

// const MOCK_CANDIDATE: Candidate = {
//   registrationNo: "5250000005",
//   name: "NANCY KUMARI GUPTA",
// };

// const STEPS: Step[] = [
//   { id: 1, en: "Personal Details", hi: "व्यक्तिगत विवरण", icon: User },
//   { id: 2, en: "Payment", hi: "भुगतान", icon: CreditCard },
//   { id: 3, en: "Education", hi: "शैक्षणिक विवरण", icon: GraduationCap },
//   { id: 4, en: "Photo Upload", hi: "फोटो अपलोड", icon: Upload },
//   { id: 5, en: "Live Photo", hi: "लाइव फोटो", icon: Camera },
//   {
//     id: 6,
//     en: "Review & Submit",
//     hi: "समीक्षा और जमा करें",
//     icon: ClipboardCheck,
//   },
// ];

// const YES_NO = ["YES", "NO"];
// const YES_NO_NA = ["YES", "NO", "NA"];

// /* ---------------------------------------------------------------
//    SHARED UI PRIMITIVES
// --------------------------------------------------------------- */
// const Field: React.FC<FieldProps> = ({
//   label,
//   hi,
//   required,
//   error,
//   children,
// }) => (
//   <div className="mb-5">
//     <div className="mb-1.5">
//       <div
//         className="text-[14px] font-extrabold tracking-wide"
//         style={{ color: INK }}
//       >
//         {required && <span style={{ color: DANGER }}>* </span>}
//         {label}
//       </div>
//       {hi && (
//         <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>
//           {hi}
//         </div>
//       )}
//     </div>
//     {children}
//     {error && (
//       <div
//         className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
//         style={{ color: DANGER }}
//       >
//         <AlertCircle size={11} /> {error}
//       </div>
//     )}
//   </div>
// );

// const PillGroup: React.FC<PillGroupProps> = ({
//   name,
//   value,
//   onChange,
//   options,
// }) => (
//   <div className="flex flex-wrap gap-2.5">
//     {options.map((opt) => (
//       <label key={opt} style={{ position: "relative" }}>
//         <input
//           type="radio"
//           name={name}
//           value={opt}
//           checked={value === opt}
//           onChange={() => onChange(opt)}
//           className="gf-radio-input"
//         />
//         <span className="gf-pill">{opt.replace("NA", "N/A")}</span>
//       </label>
//     ))}
//   </div>
// );

// const SectionTitle: React.FC<SectionTitleProps> = ({
//   icon: Icon,
//   children,
// }) => (
//   <div className="flex items-center gap-2 mb-5">
//     <Icon size={16} style={{ color: OCHRE }} />
//     <h3 className="gf-display text-base font-semibold" style={{ color: INK }}>
//       {children}
//     </h3>
//   </div>
// );

// const Note: React.FC<NoteProps> = ({ children, tone = "ochre" }) => (
//   <div
//     className="rounded-xl p-4 text-[11.5px] leading-relaxed font-medium"
//     style={{
//       background: tone === "ochre" ? "#FAF6EF" : "#FCECE8",
//       border: `1px solid ${tone === "ochre" ? "#ECD9BE" : "#F0CFC5"}`,
//       color: tone === "ochre" ? OCHRE_DEEP : DANGER,
//     }}
//   >
//     {children}
//   </div>
// );

// const AddressFields: React.FC<AddressFieldsProps> = ({
//   prefix,
//   v,
//   setField,
//   errors,
//   disabled,
// }) => {
//   const rows: [string, string, string][] = [
//     ["Village", "गाँव/मोहल्ला", "Village"],
//     ["PoliceStation", "पुलिस थाना", "PoliceStation"],
//     ["PostOffice", "डाकघर", "PostOffice"],
//     ["District", "जिला", "District"],
//     ["State", "राज्य", "State"],
//     ["PinCode", "पिन कोड", "PinCode"],
//   ];

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//       {rows.map(([suffix, hiLabel]) => {
//         const key = `${prefix}${suffix}` as keyof PersonalData;
//         return (
//           <Field
//             key={key}
//             label={suffix.replace(/([A-Z])/g, " $1").trim()}
//             hi={hiLabel}
//             required
//             error={errors[key as string]}
//           >
//             <input
//               className={`gf-input ${errors[key as string] ? "gf-error" : ""}`}
//               disabled={disabled}
//               value={v[key] || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField(key as string, e.target.value)
//               }
//               maxLength={suffix === "PinCode" ? 6 : undefined}
//               placeholder={suffix.replace(/([A-Z])/g, " $1").trim()}
//             />
//           </Field>
//         );
//       })}
//     </div>
//   );
// };

// const CertNumberDateAuthority: React.FC<CertNumberDateAuthorityProps> = ({
//   v,
//   setField,
//   prefixNo,
//   prefixDate,
//   prefixAuth,
//   labelNo,
//   hiNo,
//   labelDate,
//   hiDate,
//   labelAuth,
//   hiAuth,
// }) => (
//   <>
//     <Field label={labelNo} hi={hiNo}>
//       <input
//         className="gf-input"
//         value={v[prefixNo] || ""}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setField(prefixNo, e.target.value)
//         }
//         placeholder="Certificate number"
//       />
//     </Field>
//     {prefixDate && (
//       <Field label={labelDate} hi={hiDate}>
//         <input
//           type="date"
//           className="gf-input"
//           value={v[prefixDate] || ""}
//           onChange={(e: ChangeEvent<HTMLInputElement>) =>
//             setField(prefixDate, e.target.value)
//           }
//         />
//       </Field>
//     )}
//     <Field label={labelAuth} hi={hiAuth}>
//       <input
//         className="gf-input"
//         value={v[prefixAuth] || ""}
//         onChange={(e: ChangeEvent<HTMLInputElement>) =>
//           setField(prefixAuth, e.target.value)
//         }
//         placeholder="Issuing authority"
//       />
//     </Field>
//   </>
// );

// /* ---------------------------------------------------------------
//    STEP 1 — PERSONAL DETAILS
// --------------------------------------------------------------- */
// const Step1Personal: React.FC<Step1Props> = ({ data, onSave }) => {
//   const [v, setV] = useState<PersonalData>({
//     nationality: "INDIAN",
//     sameAsPermanent: false,
//     ...data,
//   });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const setField = (k: string, val: string | boolean) =>
//     setV((p) => ({ ...p, [k]: val }));

//   const toggleSame = (checked: boolean) => {
//     setV((p) => ({
//       ...p,
//       sameAsPermanent: checked,
//       ...(checked
//         ? {
//             corrVillage: p.permVillage,
//             corrPoliceStation: p.permPoliceStation,
//             corrPostOffice: p.permPostOffice,
//             corrDistrict: p.permDistrict,
//             corrState: p.permState,
//             corrPinCode: p.permPinCode,
//           }
//         : {}),
//     }));
//   };

//   const showCategoryDocs = v.category && v.category !== "UR";
//   const showNonCreamy = v.category === "EBC" || v.category === "BC";

//   const required = [
//     "applicantName",
//     "fatherName",
//     "motherName",
//     "gender",
//     "dateOfBirth",
//     "emailId",
//     "domicileOfBihar",
//     "category",
//     "caste",
//     "disability",
//     "exServiceman",
//     "nccCadet",
//     "wardOfFreedomFighter",
//     "biharGovtEmployee",
//     "numberOfAttempts",
//     "contractualEmployee",
//     "isDebarred",
//     "hasAadharCard",
//     "permVillage",
//     "permPoliceStation",
//     "permPostOffice",
//     "permDistrict",
//     "permState",
//     "permPinCode",
//     "corrVillage",
//     "corrPoliceStation",
//     "corrPostOffice",
//     "corrDistrict",
//     "corrState",
//     "corrPinCode",
//   ];

//   const validate = () => {
//     const e: Record<string, string> = {};
//     required.forEach((f) => {
//       if (!String(v[f as keyof PersonalData] || "").trim())
//         e[f] = "This field is required";
//     });
//     if (v.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.emailId))
//       e.emailId = "Enter a valid email";
//     if (v.permPinCode && !/^\d{6}$/.test(v.permPinCode))
//       e.permPinCode = "Enter a 6-digit PIN code";
//     if (v.corrPinCode && !/^\d{6}$/.test(v.corrPinCode))
//       e.corrPinCode = "Enter a 6-digit PIN code";
//     if (
//       v.hasAadharCard === "YES" &&
//       v.aadharCardNumber &&
//       !/^\d{12}$/.test(v.aadharCardNumber)
//     )
//       e.aadharCardNumber = "Aadhar must be 12 digits";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   return (
//     <div className="space-y-8">
//       <div>
//         <SectionTitle icon={User}>Basic Information</SectionTitle>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//           <Field
//             label="Name of applicant"
//             hi="आवेदक का नाम"
//             required
//             error={errors.applicantName}
//           >
//             <input
//               className={`gf-input ${errors.applicantName ? "gf-error" : ""}`}
//               value={v.applicantName || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("applicantName", e.target.value)
//               }
//               placeholder="Enter full name"
//             />
//           </Field>
//           <Field
//             label="Father's name"
//             hi="पिता का नाम"
//             required
//             error={errors.fatherName}
//           >
//             <input
//               className={`gf-input ${errors.fatherName ? "gf-error" : ""}`}
//               value={v.fatherName || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("fatherName", e.target.value)
//               }
//               placeholder="Enter father's name"
//             />
//           </Field>
//           <Field
//             label="Mother's name"
//             hi="माता का नाम"
//             required
//             error={errors.motherName}
//           >
//             <input
//               className={`gf-input ${errors.motherName ? "gf-error" : ""}`}
//               value={v.motherName || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("motherName", e.target.value)
//               }
//               placeholder="Enter mother's name"
//             />
//           </Field>
//           <Field label="Gender" hi="लिंग" required error={errors.gender}>
//             <PillGroup
//               name="gender"
//               value={v.gender || ""}
//               onChange={(val) => setField("gender", val)}
//               options={["MALE", "FEMALE", "TRANSGENDER"]}
//             />
//           </Field>
//           <Field
//             label="Date of birth"
//             hi="जन्म तिथि"
//             required
//             error={errors.dateOfBirth}
//           >
//             <input
//               type="date"
//               className={`gf-input ${errors.dateOfBirth ? "gf-error" : ""}`}
//               value={v.dateOfBirth || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("dateOfBirth", e.target.value)
//               }
//             />
//           </Field>
//           <Field label="Nationality" hi="राष्ट्रीयता" required>
//             <input
//               className="gf-input"
//               value={v.nationality || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("nationality", e.target.value)
//               }
//             />
//           </Field>
//           <Field
//             label="Email ID"
//             hi="ईमेल आईडी"
//             required
//             error={errors.emailId}
//           >
//             <input
//               type="email"
//               className={`gf-input ${errors.emailId ? "gf-error" : ""}`}
//               value={v.emailId || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("emailId", e.target.value)
//               }
//               placeholder="email@example.com"
//             />
//           </Field>
//           <Field label="Identification mark" hi="पहचान चिह्न">
//             <input
//               className="gf-input"
//               value={v.identificationMark || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("identificationMark", e.target.value)
//               }
//               placeholder="e.g. Mole on left cheek"
//             />
//           </Field>
//         </div>
//       </div>

//       <div>
//         <SectionTitle icon={User}>Domicile &amp; Category</SectionTitle>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//           <Field
//             label="Domicile of Bihar state?"
//             hi="बिहार राज्य का निवासी?"
//             required
//             error={errors.domicileOfBihar}
//           >
//             <PillGroup
//               name="domicileOfBihar"
//               value={v.domicileOfBihar || ""}
//               onChange={(val) => setField("domicileOfBihar", val)}
//               options={YES_NO}
//             />
//           </Field>
//           {v.domicileOfBihar === "YES" && (
//             <CertNumberDateAuthority
//               v={v}
//               setField={setField}
//               prefixNo="domicileCertNo"
//               prefixDate="domicileIssueDate"
//               prefixAuth="domicileAuthority"
//               labelNo="Domicile certificate no."
//               hiNo="निवास प्रमाणपत्र संख्या"
//               labelDate="Issue date"
//               hiDate="जारी करने की तिथि"
//               labelAuth="Issuing authority"
//               hiAuth="जारीकर्ता प्राधिकारी"
//             />
//           )}
//           <Field label="Category" hi="श्रेणी" required error={errors.category}>
//             <PillGroup
//               name="category"
//               value={v.category || ""}
//               onChange={(val) => setField("category", val)}
//               options={["UR", "EBC", "BC", "SC", "ST", "EWS"]}
//             />
//           </Field>
//           <Field label="Caste" hi="जाति" required error={errors.caste}>
//             <input
//               className={`gf-input ${errors.caste ? "gf-error" : ""}`}
//               value={v.caste || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("caste", e.target.value)
//               }
//               placeholder="Enter caste name"
//             />
//           </Field>
//           {showNonCreamy && (
//             <Field label="Non-creamy layer?" hi="क्रीमीलेयर रहित?">
//               <PillGroup
//                 name="nonCreamyLayer"
//                 value={v.nonCreamyLayer || ""}
//                 onChange={(val) => setField("nonCreamyLayer", val)}
//                 options={YES_NO_NA}
//               />
//             </Field>
//           )}
//           {showCategoryDocs && (
//             <CertNumberDateAuthority
//               v={v}
//               setField={setField}
//               prefixNo="categoryCertNo"
//               prefixDate="categoryIssueDate"
//               prefixAuth="categoryAuthority"
//               labelNo="Category certificate no."
//               hiNo="श्रेणी प्रमाणपत्र संख्या"
//               labelDate="Issue date"
//               hiDate="जारी करने की तिथि"
//               labelAuth="Issuing authority"
//               hiAuth="जारीकर्ता प्राधिकारी"
//             />
//           )}
//         </div>
//       </div>

//       <div>
//         <SectionTitle icon={User}>Special Categories</SectionTitle>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//           <Field
//             label="Person with disability?"
//             hi="दिव्यांगता वाले व्यक्ति?"
//             required
//             error={errors.disability}
//           >
//             <PillGroup
//               name="disability"
//               value={v.disability || ""}
//               onChange={(val) => setField("disability", val)}
//               options={YES_NO}
//             />
//           </Field>
//           {v.disability === "YES" && (
//             <>
//               <Field label="Nature of disability" hi="दिव्यांगता की प्रकृति">
//                 <select
//                   className="gf-select"
//                   value={v.natureOfDisability || ""}
//                   onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//                     setField("natureOfDisability", e.target.value)
//                   }
//                 >
//                   <option value="">Select</option>
//                   <option value="VISUAL">Visual / दृष्टि बाधित</option>
//                   <option value="HEARING_SPEECH">
//                     Hearing-Speech / श्रवण-वाक् बाधित
//                   </option>
//                   <option value="LOCOMOTOR">Locomotor / चलन बाधित</option>
//                   <option value="MENTAL_MULTIPLE">
//                     Mental/Multiple / मानसिक/बहु बाधित
//                   </option>
//                 </select>
//               </Field>
//               <Field
//                 label="Minimum 40% disability?"
//                 hi="न्यूनतम 40% दिव्यांगता?"
//               >
//                 <PillGroup
//                   name="disabilityPercent"
//                   value={v.disabilityPercent || ""}
//                   onChange={(val) => setField("disabilityPercent", val)}
//                   options={YES_NO_NA}
//                 />
//               </Field>
//             </>
//           )}
//           <Field
//             label="Ex-serviceman?"
//             hi="भूतपूर्व सैनिक?"
//             required
//             error={errors.exServiceman}
//           >
//             <PillGroup
//               name="exServiceman"
//               value={v.exServiceman || ""}
//               onChange={(val) => setField("exServiceman", val)}
//               options={YES_NO}
//             />
//           </Field>
//           <Field
//             label="NCC full-time cadet / instructor?"
//             hi="एनसीसी पूर्णकालिक कैडेट/अनुदेशक?"
//             required
//             error={errors.nccCadet}
//           >
//             <PillGroup
//               name="nccCadet"
//               value={v.nccCadet || ""}
//               onChange={(val) => setField("nccCadet", val)}
//               options={YES_NO}
//             />
//           </Field>
//           {v.nccCadet === "YES" && (
//             <Field
//               label="NCC 'C' certificate no."
//               hi="एनसीसी 'सी' प्रमाणपत्र संख्या"
//             >
//               <input
//                 className="gf-input"
//                 value={v.nccCertificateNo || ""}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setField("nccCertificateNo", e.target.value)
//                 }
//               />
//             </Field>
//           )}
//           <Field
//             label="Ward of freedom fighter?"
//             hi="स्वतंत्रता सेनानी के वार्ड?"
//             required
//             error={errors.wardOfFreedomFighter}
//           >
//             <PillGroup
//               name="wardOfFreedomFighter"
//               value={v.wardOfFreedomFighter || ""}
//               onChange={(val) => setField("wardOfFreedomFighter", val)}
//               options={YES_NO}
//             />
//           </Field>
//           {v.wardOfFreedomFighter === "YES" && (
//             <CertNumberDateAuthority
//               v={v}
//               setField={setField}
//               prefixNo="freedomFighterCertNo"
//               prefixAuth="freedomFighterAuthority"
//               labelNo="Certificate no."
//               hiNo="प्रमाणपत्र संख्या"
//               labelAuth="Issuing authority"
//               hiAuth="जारीकर्ता प्राधिकारी"
//             />
//           )}
//         </div>
//       </div>

//       <div>
//         <SectionTitle icon={User}>Employment Status</SectionTitle>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//           <Field
//             label="Bihar govt. employee, 3+ years continuous service?"
//             hi="बिहार सरकार के कर्मचारी, 3+ वर्ष सेवा?"
//             required
//             error={errors.biharGovtEmployee}
//           >
//             <PillGroup
//               name="biharGovtEmployee"
//               value={v.biharGovtEmployee || ""}
//               onChange={(val) => setField("biharGovtEmployee", val)}
//               options={YES_NO}
//             />
//           </Field>
//           <Field
//             label="Number of prior attempts"
//             hi="पूर्व प्रयासों की संख्या"
//             required
//             error={errors.numberOfAttempts}
//           >
//             <input
//               type="number"
//               min="0"
//               className={`gf-input gf-mono ${errors.numberOfAttempts ? "gf-error" : ""}`}
//               value={v.numberOfAttempts || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("numberOfAttempts", e.target.value)
//               }
//               placeholder="0"
//             />
//           </Field>
//           <Field
//             label="Contractual employee?"
//             hi="संविदा कर्मी?"
//             required
//             error={errors.contractualEmployee}
//           >
//             <PillGroup
//               name="contractualEmployee"
//               value={v.contractualEmployee || ""}
//               onChange={(val) => setField("contractualEmployee", val)}
//               options={YES_NO}
//             />
//           </Field>
//           {v.contractualEmployee === "YES" && (
//             <>
//               <Field label="Name of post" hi="पद का नाम">
//                 <input
//                   className="gf-input"
//                   value={v.nameOfPost || ""}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                     setField("nameOfPost", e.target.value)
//                   }
//                 />
//               </Field>
//               <Field
//                 label="Agreement under circular 1003?"
//                 hi="संकल्प 1003 के अनुसार एकरारनामा?"
//               >
//                 <PillGroup
//                   name="agreementCircular"
//                   value={v.agreementCircular || ""}
//                   onChange={(val) => setField("agreementCircular", val)}
//                   options={YES_NO_NA}
//                 />
//               </Field>
//               <Field label="Department name" hi="विभाग का नाम">
//                 <input
//                   className="gf-input"
//                   value={v.departmentName || ""}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                     setField("departmentName", e.target.value)
//                   }
//                 />
//               </Field>
//               <Field label="Office order no." hi="कार्यालय आदेश संख्या">
//                 <input
//                   className="gf-input"
//                   value={v.officeOrderNo || ""}
//                   onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                     setField("officeOrderNo", e.target.value)
//                   }
//                 />
//               </Field>
//               <div className="md:col-span-2 mb-2">
//                 <div
//                   className="text-[12px] font-extrabold tracking-wide mb-2"
//                   style={{ color: INK }}
//                 >
//                   Contractual service period · संविदा सेवा अवधि
//                 </div>
//                 <div className="grid grid-cols-3 gap-3 max-w-md">
//                   <input
//                     type="number"
//                     min="0"
//                     placeholder="Years"
//                     className="gf-input gf-mono"
//                     value={v.contractualYears || ""}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                       setField("contractualYears", e.target.value)
//                     }
//                   />
//                   <input
//                     type="number"
//                     min="0"
//                     max="11"
//                     placeholder="Months"
//                     className="gf-input gf-mono"
//                     value={v.contractualMonths || ""}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                       setField("contractualMonths", e.target.value)
//                     }
//                   />
//                   <input
//                     type="number"
//                     min="0"
//                     max="30"
//                     placeholder="Days"
//                     className="gf-input gf-mono"
//                     value={v.contractualDays || ""}
//                     onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                       setField("contractualDays", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>
//             </>
//           )}
//           <Field
//             label="Debarred from any examination?"
//             hi="किसी परीक्षा से वंचित?"
//             required
//             error={errors.isDebarred}
//           >
//             <PillGroup
//               name="isDebarred"
//               value={v.isDebarred || ""}
//               onChange={(val) => setField("isDebarred", val)}
//               options={YES_NO}
//             />
//           </Field>
//         </div>
//       </div>

//       <div>
//         <SectionTitle icon={User}>ID Proof</SectionTitle>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//           <Field
//             label="Do you have an Aadhar card?"
//             hi="क्या आपके पास आधार कार्ड है?"
//             required
//             error={errors.hasAadharCard}
//           >
//             <PillGroup
//               name="hasAadharCard"
//               value={v.hasAadharCard || ""}
//               onChange={(val) => setField("hasAadharCard", val)}
//               options={YES_NO}
//             />
//           </Field>
//           {v.hasAadharCard === "YES" && (
//             <Field
//               label="Aadhar number"
//               hi="आधार संख्या"
//               error={errors.aadharCardNumber}
//             >
//               <input
//                 className={`gf-input gf-mono ${errors.aadharCardNumber ? "gf-error" : ""}`}
//                 maxLength={12}
//                 value={v.aadharCardNumber || ""}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setField(
//                     "aadharCardNumber",
//                     e.target.value.replace(/\D/g, ""),
//                   )
//                 }
//                 placeholder="12-digit Aadhar number"
//               />
//             </Field>
//           )}
//           <Field
//             label="Type of photo ID proof"
//             hi="फोटो पहचान प्रमाण का प्रकार"
//           >
//             <select
//               className="gf-select"
//               value={v.typeOfPhotoIdProof || ""}
//               onChange={(e: ChangeEvent<HTMLSelectElement>) =>
//                 setField("typeOfPhotoIdProof", e.target.value)
//               }
//             >
//               <option value="">Select</option>
//               <option value="AADHAR">Aadhar Card</option>
//               <option value="PAN">PAN Card</option>
//               <option value="VOTER_ID">Voter ID</option>
//               <option value="PASSPORT">Passport</option>
//               <option value="DRIVING_LICENSE">Driving License</option>
//             </select>
//           </Field>
//           <Field label="ID proof number" hi="पहचान प्रमाण संख्या">
//             <input
//               className="gf-input"
//               value={v.idProofNo || ""}
//               onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                 setField("idProofNo", e.target.value)
//               }
//             />
//           </Field>
//         </div>
//       </div>

//       <div>
//         <SectionTitle icon={User}>Permanent Address</SectionTitle>
//         <AddressFields
//           prefix="perm"
//           v={v}
//           setField={setField}
//           errors={errors}
//         />
//       </div>

//       <div>
//         <SectionTitle icon={User}>Correspondence Address</SectionTitle>
//         <label className="flex items-center gap-2 cursor-pointer mb-4">
//           <input
//             type="checkbox"
//             checked={!!v.sameAsPermanent}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               toggleSame(e.target.checked)
//             }
//             className="w-4 h-4"
//             style={{ accentColor: INK }}
//           />
//           <span className="text-[13px] font-semibold" style={{ color: INK }}>
//             Same as permanent address · स्थायी पते के समान
//           </span>
//         </label>
//         <AddressFields
//           prefix="corr"
//           v={v}
//           setField={setField}
//           errors={errors}
//           disabled={!!v.sameAsPermanent}
//         />
//       </div>

//       <div className="flex justify-end pt-2">
//         <button
//           className="gf-btn-primary"
//           onClick={() => validate() && onSave(v)}
//         >
//           Save &amp; Next <ChevronRight size={15} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    STEP 2 — PAYMENT
// --------------------------------------------------------------- */
// const Step2Payment: React.FC<Step2Props> = ({ data, onSave }) => {
//   const [v, setV] = useState<PaymentData>({ ...data });
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const FEE_INFO = [
//     { cat: "UR / EBC-I / BC-II — Male", fee: "₹540" },
//     { cat: "SC / ST — Bihar Domicile", fee: "₹135" },
//     { cat: "PwD — All Categories (Bihar)", fee: "₹135" },
//     { cat: "Women — All Categories (Bihar)", fee: "₹135" },
//     { cat: "Outside Bihar (Any Category)", fee: "₹540" },
//   ];

//   const validate = () => {
//     const e: Record<string, string> = {};
//     if (!v.paymentMode) e.paymentMode = "Please select a payment mode";
//     if (!v.paymentAcknowledged)
//       e.paymentAcknowledged = "You must acknowledge the fee terms";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   return (
//     <div className="space-y-6">
//       <SectionTitle icon={CreditCard}>Examination Fee</SectionTitle>

//       <div
//         className="rounded-xl overflow-hidden"
//         style={{ border: `1px solid ${LINE}` }}
//       >
//         <div
//           className="px-4 py-2.5 text-[11px] font-extrabold tracking-wide"
//           style={{ background: INK, color: "#fff" }}
//         >
//           FEE STRUCTURE · शुल्क संरचना
//         </div>
//         <table className="w-full text-[12.5px]">
//           <tbody>
//             {FEE_INFO.map((r, i) => (
//               <tr
//                 key={i}
//                 style={{ borderTop: i ? `1px solid ${LINE}` : "none" }}
//               >
//                 <td
//                   className="py-2.5 px-4 font-semibold"
//                   style={{ color: INK }}
//                 >
//                   {r.cat}
//                 </td>
//                 <td
//                   className="py-2.5 px-4 text-right font-extrabold gf-mono"
//                   style={{ color: OCHRE_DEEP }}
//                 >
//                   {r.fee}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <Note tone="danger">
//         Fee is non-refundable. Payment gateway charges and service tax are borne
//         by the candidate. · शुल्क अप्रतिदेय है।
//       </Note>

//       <div
//         className="rounded-2xl p-6"
//         style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//       >
//         <div
//           className="text-[12.5px] font-extrabold mb-2"
//           style={{ color: INK }}
//         >
//           Your applicable fee · आपका लागू शुल्क
//         </div>
//         <div
//           className="flex items-center gap-3 p-3 rounded-xl mb-6"
//           style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
//         >
//           <CheckCircle2 size={18} style={{ color: TEAL }} />
//           <div>
//             <div
//               className="gf-mono text-lg font-extrabold"
//               style={{ color: TEAL }}
//             >
//               ₹135
//             </div>
//             <div
//               className="text-[11.5px] font-semibold"
//               style={{ color: INK_SOFT }}
//             >
//               EBC-I / Bihar Domicile Female — concession rate
//             </div>
//           </div>
//         </div>

//         <Field
//           label="Select payment mode"
//           hi="भुगतान का तरीका चुनें"
//           required
//           error={errors.paymentMode}
//         >
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {[
//               { v: "CREDIT_CARD", l: "Credit Card", hi: "क्रेडिट कार्ड" },
//               { v: "DEBIT_CARD", l: "Debit Card", hi: "डेबिट कार्ड" },
//               { v: "UPI", l: "UPI", hi: "यूपीआई" },
//               { v: "NET_BANKING", l: "Net Banking", hi: "नेट बैंकिंग" },
//             ].map((m) => (
//               <label key={m.v} style={{ position: "relative" }}>
//                 <input
//                   type="radio"
//                   name="paymentMode"
//                   className="gf-radio-input"
//                   checked={v.paymentMode === m.v}
//                   onChange={() => setV((p) => ({ ...p, paymentMode: m.v }))}
//                 />
//                 <span
//                   className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer text-center"
//                   style={{
//                     borderColor: v.paymentMode === m.v ? INK : LINE,
//                     background: v.paymentMode === m.v ? "#EEF0F4" : "#fff",
//                   }}
//                 >
//                   <CreditCard
//                     size={18}
//                     style={{ color: v.paymentMode === m.v ? INK : INK_SOFT }}
//                   />
//                   <span
//                     className="text-[11.5px] font-extrabold"
//                     style={{ color: INK }}
//                   >
//                     {m.l}
//                   </span>
//                   <span
//                     className="text-[10.5px] font-medium"
//                     style={{ color: INK_SOFT }}
//                   >
//                     {m.hi}
//                   </span>
//                 </span>
//               </label>
//             ))}
//           </div>
//         </Field>

//         <Note>
//           You will be redirected to the BSSC official payment gateway. After
//           successful payment, your status updates to "Fee Paid" and a receipt is
//           generated. · आपको भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।
//         </Note>

//         <label className="flex items-start gap-3 cursor-pointer mt-5">
//           <input
//             type="checkbox"
//             checked={!!v.paymentAcknowledged}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setV((p) => ({ ...p, paymentAcknowledged: e.target.checked }))
//             }
//             className="w-4 h-4 mt-0.5"
//             style={{ accentColor: INK }}
//           />
//           <span
//             className="text-[13px] font-semibold leading-relaxed"
//             style={{ color: INK }}
//           >
//             I acknowledge the examination fee is non-refundable and
//             non-transferable. · मैं स्वीकार करता/करती हूँ कि शुल्क अप्रतिदेय है।
//           </span>
//         </label>
//         {errors.paymentAcknowledged && (
//           <div
//             className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
//             style={{ color: DANGER }}
//           >
//             <AlertCircle size={11} /> {errors.paymentAcknowledged}
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end pt-2">
//         <button
//           className="gf-btn-primary"
//           onClick={() => validate() && onSave(v)}
//         >
//           Proceed to Pay <ChevronRight size={15} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    STEP 3 — EDUCATION
// --------------------------------------------------------------- */
// const EDU_FIELDS: [string, string, string][] = [
//   ["subject", "Subject", "विषय"],
//   ["boardUniversity", "Board / University", "बोर्ड/विश्वविद्यालय"],
//   ["totalMarks", "Total marks", "कुल अंक"],
//   ["obtainedMarks", "Obtained marks", "प्राप्त अंक"],
//   ["percentage", "Percentage", "प्रतिशत"],
//   ["certNumber", "Certificate no.", "प्रमाणपत्र संख्या"],
//   ["certIssueDate", "Certificate issue date", "जारी करने की तिथि"],
// ];

// const EducationBlock: React.FC<EducationBlockProps> = ({
//   title,
//   hi,
//   prefix,
//   v,
//   setNested,
// }) => {
//   const section =
//     (v[prefix as keyof EducationData] as EducationData["tenth"]) || {};
//   return (
//     <div>
//       <SectionTitle icon={GraduationCap}>
//         {title} · {hi}
//       </SectionTitle>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
//         {EDU_FIELDS.map(([key, label, hiLabel]) => (
//           <Field key={key} label={label} hi={hiLabel} required>
//             {key === "certIssueDate" ? (
//               <input
//                 type="date"
//                 className="gf-input"
//                 value={section[key] || ""}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setNested(prefix, key, e.target.value)
//                 }
//               />
//             ) : (
//               <input
//                 className="gf-input"
//                 value={section[key] || ""}
//                 onChange={(e: ChangeEvent<HTMLInputElement>) =>
//                   setNested(prefix, key, e.target.value)
//                 }
//                 placeholder={label}
//               />
//             )}
//           </Field>
//         ))}
//       </div>
//     </div>
//   );
// };

// const Step3Education: React.FC<Step3Props> = ({ data, onSave }) => {
//   const [v, setV] = useState<EducationData>({
//     tenth: {},
//     twelfth: {},
//     graduation: {},
//     ...data,
//   });
//   const setNested = (prefix: string, key: string, val: string) =>
//     setV((p) => ({
//       ...p,
//       [prefix]: {
//         ...(p[prefix as keyof EducationData] as EducationBlock),
//         [key]: val,
//       },
//     }));

//   return (
//     <div className="space-y-8">
//       <EducationBlock
//         title="10th / Equivalent"
//         hi="10वीं / समकक्ष"
//         prefix="tenth"
//         v={v}
//         setNested={setNested}
//       />
//       <EducationBlock
//         title="12th / Equivalent"
//         hi="12वीं / समकक्ष"
//         prefix="twelfth"
//         v={v}
//         setNested={setNested}
//       />
//       <EducationBlock
//         title="Graduation / Equivalent"
//         hi="स्नातक / समकक्ष"
//         prefix="graduation"
//         v={v}
//         setNested={setNested}
//       />
//       <div className="flex justify-end pt-2">
//         <button className="gf-btn-primary" onClick={() => onSave(v)}>
//           Save &amp; Next <ChevronRight size={15} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    STEP 4 — PHOTO UPLOAD
// --------------------------------------------------------------- */
// const Step4PhotoUpload: React.FC<Step4Props> = ({ data, onSave }) => {
//   const [v, setV] = useState<PhotoData>({ ...data });
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const uploads: UploadField[] = [
//     {
//       field: "passportPhoto",
//       label: "Passport size recent photograph",
//       hi: "पासपोर्ट साइज हालिया फोटो",
//       spec: "JPG · 20–50KB · 200×230px · within 1 month",
//       maxKB: 50,
//       height: 150,
//     },
//     {
//       field: "signatureEn",
//       label: "English signature",
//       hi: "अंग्रेजी हस्ताक्षर",
//       spec: "JPG · 10–20KB · 200×60px",
//       maxKB: 20,
//       height: 74,
//     },
//     {
//       field: "signatureHi",
//       label: "Hindi signature",
//       hi: "हिंदी हस्ताक्षर",
//       spec: "JPG · 10–20KB · 200×60px",
//       maxKB: 20,
//       height: 74,
//     },
//   ];

//   const handleFile = (field: keyof PhotoData, file: File, maxKB: number) => {
//     if (file.size > maxKB * 1024) {
//       setErrors((p) => ({ ...p, [field]: `File must be under ${maxKB}KB` }));
//       return;
//     }
//     setErrors((p) => ({ ...p, [field]: "" }));
//     const reader = new FileReader();
//     reader.onload = (e) =>
//       setV((p) => ({ ...p, [field]: e.target?.result as string }));
//     reader.readAsDataURL(file);
//   };

//   const handleNext = () => {
//     const e: Record<string, string> = {};
//     uploads.forEach((u) => {
//       if (!v[u.field as keyof PhotoData])
//         e[u.field] = "This upload is required";
//     });
//     setErrors((p) => ({ ...p, ...e }));
//     if (Object.values(e).every((x) => !x)) onSave(v);
//   };

//   return (
//     <div className="space-y-6">
//       <SectionTitle icon={Upload}>Photo &amp; Signature Upload</SectionTitle>
//       <Note>
//         Photograph must be recent, light background. Signatures on white paper,
//         black/blue ink, scanned clearly. Only JPG/JPEG accepted.
//       </Note>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
//         {uploads.map((u) => (
//           <div
//             key={u.field}
//             className="rounded-2xl p-4 space-y-3"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div>
//               <div
//                 className="text-[11px] font-extrabold uppercase leading-tight"
//                 style={{ color: OCHRE_DEEP }}
//               >
//                 * {u.label}
//               </div>
//               <div
//                 className="text-[11px] font-medium"
//                 style={{ color: INK_SOFT }}
//               >
//                 {u.hi}
//               </div>
//               <div
//                 className="text-[10.5px] font-medium mt-1"
//                 style={{ color: INK_SOFT }}
//               >
//                 {u.spec}
//               </div>
//             </div>
//             <div
//               className="rounded-xl flex items-center justify-center overflow-hidden"
//               style={{
//                 height: u.height,
//                 background: "#F6F7F9",
//                 border: `1.5px dashed ${LINE}`,
//               }}
//             >
//               {v[u.field as keyof PhotoData] ? (
//                 <img
//                   src={v[u.field as keyof PhotoData]}
//                   alt={u.label}
//                   className="w-full h-full object-contain"
//                 />
//               ) : (
//                 <div className="text-center p-2">
//                   <Upload
//                     size={18}
//                     style={{ color: INK_SOFT }}
//                     className="mx-auto mb-1"
//                   />
//                   <div
//                     className="text-[11px] font-semibold"
//                     style={{ color: INK_SOFT }}
//                   >
//                     No file chosen
//                   </div>
//                 </div>
//               )}
//             </div>
//             <label className="gf-btn-secondary w-full text-[11.5px] py-2 cursor-pointer">
//               <Upload size={13} /> Choose file
//               <input
//                 type="file"
//                 accept="image/jpeg,image/jpg"
//                 className="hidden"
//                 onChange={(e: ChangeEvent<HTMLInputElement>) => {
//                   const f = e.target.files?.[0];
//                   if (f) handleFile(u.field as keyof PhotoData, f, u.maxKB);
//                 }}
//               />
//             </label>
//             {errors[u.field] && (
//               <div
//                 className="flex items-center gap-1 text-[11px] font-bold"
//                 style={{ color: DANGER }}
//               >
//                 <AlertCircle size={11} /> {errors[u.field]}
//               </div>
//             )}
//             {v[u.field as keyof PhotoData] && !errors[u.field] && (
//               <div
//                 className="flex items-center gap-1 text-[11px] font-bold"
//                 style={{ color: TEAL }}
//               >
//                 <CheckCircle2 size={11} /> Uploaded
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-end pt-2">
//         <button className="gf-btn-primary" onClick={handleNext}>
//           Save &amp; Next <ChevronRight size={15} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    STEP 5 — LIVE PHOTO
// --------------------------------------------------------------- */
// const Step5LivePhoto: React.FC<Step5Props> = ({ data, onSave }) => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [stream, setStream] = useState<MediaStream | null>(null);
//   const [captured, setCaptured] = useState<string>(data.livePhoto || "");
//   const [camError, setCamError] = useState<string>("");
//   const [camOn, setCamOn] = useState<boolean>(false);

//   const startCamera = useCallback(async () => {
//     try {
//       setCamError("");
//       const s = await navigator.mediaDevices.getUserMedia({
//         video: { width: 320, height: 240, facingMode: "user" },
//         audio: false,
//       });
//       setStream(s);
//       setCamOn(true);
//       if (videoRef.current) videoRef.current.srcObject = s;
//     } catch {
//       setCamError(
//         "Camera access denied. Please allow camera permission and try again. · कैमरा एक्सेस अस्वीकृत।",
//       );
//     }
//   }, []);

//   const stopCamera = useCallback(() => {
//     if (stream) {
//       stream.getTracks().forEach((t) => t.stop());
//       setStream(null);
//       setCamOn(false);
//     }
//   }, [stream]);

//   const capture = useCallback(() => {
//     if (!videoRef.current || !canvasRef.current) return;
//     const c = canvasRef.current,
//       video = videoRef.current;
//     c.width = video.videoWidth || 320;
//     c.height = video.videoHeight || 240;
//     const ctx = c.getContext("2d");
//     if (ctx) {
//       ctx.drawImage(video, 0, 0, c.width, c.height);
//       setCaptured(c.toDataURL("image/jpeg", 0.8));
//       stopCamera();
//     }
//   }, [stopCamera]);

//   const retake = () => {
//     setCaptured("");
//     startCamera();
//   };

//   useEffect(
//     () => () => {
//       if (stream) stream.getTracks().forEach((t) => t.stop());
//     },
//     [stream],
//   );

//   const handleNext = () => {
//     if (!captured) {
//       setCamError(
//         "Please capture your live photo before proceeding. · कृपया लाइव फोटो कैप्चर करें।",
//       );
//       return;
//     }
//     onSave({ livePhoto: captured });
//   };

//   return (
//     <div className="space-y-6">
//       <SectionTitle icon={Camera}>Live Photo Capture</SectionTitle>
//       <Note tone="danger">
//         Mandatory — a live photo must be captured via webcam before submission.
//         It is re-verified at admit-card download. Ensure good lighting, remove
//         glasses/caps.
//       </Note>

//       <div className="flex flex-col items-center gap-5">
//         <div
//           className="relative rounded-2xl overflow-hidden flex items-center justify-center"
//           style={{
//             width: 320,
//             height: 240,
//             background: "#0E1826",
//             border: `2px solid ${LINE}`,
//           }}
//         >
//           {captured ? (
//             <img
//               src={captured}
//               alt="Captured"
//               className="w-full h-full object-cover"
//             />
//           ) : camOn ? (
//             <video
//               ref={videoRef}
//               autoPlay
//               playsInline
//               muted
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <div className="text-center text-white p-4 opacity-70">
//               <Camera size={36} className="mx-auto mb-2" />
//               <div className="text-[12.5px] font-semibold">
//                 Camera not started
//               </div>
//               <div className="text-[11px]">कैमरा शुरू नहीं हुआ</div>
//             </div>
//           )}
//           {captured && (
//             <div
//               className="absolute top-2 right-2 rounded-full p-1"
//               style={{ background: TEAL }}
//             >
//               <CheckCircle2 size={15} color="#fff" />
//             </div>
//           )}
//         </div>
//         <canvas ref={canvasRef} className="hidden" />

//         {camError && (
//           <div className="max-w-sm w-full">
//             <Note tone="danger">{camError}</Note>
//           </div>
//         )}

//         <div className="flex gap-3 flex-wrap justify-center">
//           {!camOn && !captured && (
//             <button onClick={startCamera} className="gf-btn-primary">
//               <Camera size={15} /> Start Camera
//             </button>
//           )}
//           {camOn && !captured && (
//             <button onClick={capture} className="gf-btn-primary">
//               <Camera size={15} /> Capture Photo
//             </button>
//           )}
//           {captured && (
//             <button onClick={retake} className="gf-btn-secondary">
//               <RotateCcw size={15} /> Retake
//             </button>
//           )}
//         </div>

//         {captured && (
//           <div
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
//             style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
//           >
//             <CheckCircle2 size={15} style={{ color: TEAL }} />
//             <span className="text-[12.5px] font-bold" style={{ color: TEAL }}>
//               Live photo captured successfully!
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end pt-2">
//         <button
//           className="gf-btn-primary"
//           disabled={!captured}
//           onClick={handleNext}
//         >
//           Save &amp; Next <ChevronRight size={15} />
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    STEP 6 — REVIEW & SUBMIT
// --------------------------------------------------------------- */
// const ReviewRow: React.FC<ReviewRowProps> = ({ label, value }) =>
//   value ? (
//     <div
//       className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 py-1.5"
//       style={{ borderBottom: `1px solid ${LINE}` }}
//     >
//       <span
//         className="text-[11px] font-semibold sm:w-48 shrink-0"
//         style={{ color: INK_SOFT }}
//       >
//         {label}
//       </span>
//       <span className="text-[12px] font-bold" style={{ color: INK }}>
//         {String(value)}
//       </span>
//     </div>
//   ) : null;

// const ReviewSection: React.FC<ReviewSectionProps> = ({
//   title,
//   step,
//   onEdit,
//   children,
// }) => (
//   <div
//     className="rounded-2xl overflow-hidden"
//     style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//   >
//     <div
//       className="px-5 py-3 flex items-center justify-between"
//       style={{ background: INK }}
//     >
//       <span className="text-[12px] font-extrabold tracking-wide text-white">
//         {title}
//       </span>
//       <button
//         onClick={() => onEdit(step)}
//         className="flex items-center gap-1 text-[11px] font-bold"
//         style={{ color: "#C9D3E0" }}
//       >
//         <Eye size={12} /> Edit
//       </button>
//     </div>
//     <div className="p-5">{children}</div>
//   </div>
// );

// const Step6Review: React.FC<Step6Props> = ({ formData, onSubmit, onEdit }) => {
//   const [declared, setDeclared] = useState<boolean>(false);
//   const [err, setErr] = useState<string>("");
//   const p = formData.personal || {};
//   const e = formData.education || {};
//   const ph = formData.photos || {};
//   const lp = formData.livePhoto || {};

//   const handleSubmit = () => {
//     if (!declared) {
//       setErr(
//         "You must accept the declaration to submit. · घोषणा स्वीकार करनी होगी।",
//       );
//       return;
//     }
//     onSubmit();
//   };

//   return (
//     <div className="space-y-5">
//       <SectionTitle icon={ClipboardCheck}>Review Your Application</SectionTitle>
//       <Note>
//         Please review all details carefully. Once submitted, Name, Mobile
//         Number, and Email ID cannot be changed.
//       </Note>

//       <ReviewSection title="STEP 1 · PERSONAL DETAILS" step={1} onEdit={onEdit}>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
//           <div>
//             <ReviewRow label="Name" value={p.applicantName} />
//             <ReviewRow label="Father's name" value={p.fatherName} />
//             <ReviewRow label="Mother's name" value={p.motherName} />
//             <ReviewRow label="Gender" value={p.gender} />
//             <ReviewRow label="Date of birth" value={p.dateOfBirth} />
//             <ReviewRow label="Category" value={p.category} />
//             <ReviewRow label="Caste" value={p.caste} />
//           </div>
//           <div>
//             <ReviewRow label="Email" value={p.emailId} />
//             <ReviewRow label="Bihar domicile" value={p.domicileOfBihar} />
//             <ReviewRow label="Disability" value={p.disability} />
//             <ReviewRow label="Ex-serviceman" value={p.exServiceman} />
//             <ReviewRow
//               label="Permanent address"
//               value={
//                 p.permVillage
//                   ? `${p.permVillage}, ${p.permDistrict}, ${p.permState} - ${p.permPinCode}`
//                   : undefined
//               }
//             />
//             <ReviewRow
//               label="Correspondence address"
//               value={
//                 p.corrVillage
//                   ? `${p.corrVillage}, ${p.corrDistrict}, ${p.corrState} - ${p.corrPinCode}`
//                   : undefined
//               }
//             />
//           </div>
//         </div>
//       </ReviewSection>

//       <ReviewSection title="STEP 2 · PAYMENT" step={2} onEdit={onEdit}>
//         <div
//           className="flex items-center gap-3 p-3 rounded-xl"
//           style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
//         >
//           <CheckCircle2 size={17} style={{ color: TEAL }} />
//           <div>
//             <div className="text-[13px] font-extrabold" style={{ color: TEAL }}>
//               ₹135 — Fee Paid
//             </div>
//             <div
//               className="text-[11.5px] font-semibold"
//               style={{ color: INK_SOFT }}
//             >
//               Payment mode: {formData.payment?.paymentMode || "N/A"}
//             </div>
//           </div>
//         </div>
//       </ReviewSection>

//       <ReviewSection title="STEP 3 · EDUCATION" step={3} onEdit={onEdit}>
//         <div className="space-y-3">
//           {[
//             ["10th", e.tenth],
//             ["12th", e.twelfth],
//             ["Graduation", e.graduation],
//           ].map(
//             ([label, d]) =>
//               d && (
//                 <div
//                   key={label}
//                   className="p-3 rounded-xl"
//                   style={{ background: PAPER, border: `1px solid ${LINE}` }}
//                 >
//                   <div
//                     className="text-[11px] font-extrabold mb-2"
//                     style={{ color: OCHRE_DEEP }}
//                   >
//                     {label}
//                   </div>
//                   <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11.5px]">
//                     <div>
//                       <span style={{ color: INK_SOFT }}>Subject: </span>
//                       <span className="font-bold" style={{ color: INK }}>
//                         {d.subject}
//                       </span>
//                     </div>
//                     <div>
//                       <span style={{ color: INK_SOFT }}>Board: </span>
//                       <span className="font-bold" style={{ color: INK }}>
//                         {d.boardUniversity}
//                       </span>
//                     </div>
//                     <div>
//                       <span style={{ color: INK_SOFT }}>Marks: </span>
//                       <span className="font-bold" style={{ color: INK }}>
//                         {d.obtainedMarks}/{d.totalMarks}
//                       </span>
//                     </div>
//                     <div>
//                       <span style={{ color: INK_SOFT }}>%: </span>
//                       <span className="font-bold" style={{ color: INK }}>
//                         {d.percentage}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ),
//           )}
//         </div>
//       </ReviewSection>

//       <ReviewSection title="STEP 4 & 5 · PHOTOS" step={4} onEdit={onEdit}>
//         <div className="flex flex-wrap gap-5">
//           {ph.passportPhoto && (
//             <div className="text-center">
//               <img
//                 src={ph.passportPhoto}
//                 alt="Passport"
//                 className="w-20 h-24 object-cover rounded-lg"
//                 style={{ border: `1px solid ${LINE}` }}
//               />
//               <div
//                 className="text-[10.5px] font-semibold mt-1"
//                 style={{ color: INK_SOFT }}
//               >
//                 Passport photo
//               </div>
//             </div>
//           )}
//           {ph.signatureEn && (
//             <div className="text-center">
//               <img
//                 src={ph.signatureEn}
//                 alt="Sig EN"
//                 className="w-24 h-10 object-contain rounded-lg"
//                 style={{ border: `1px solid ${LINE}` }}
//               />
//               <div
//                 className="text-[10.5px] font-semibold mt-1"
//                 style={{ color: INK_SOFT }}
//               >
//                 Signature (EN)
//               </div>
//             </div>
//           )}
//           {ph.signatureHi && (
//             <div className="text-center">
//               <img
//                 src={ph.signatureHi}
//                 alt="Sig HI"
//                 className="w-24 h-10 object-contain rounded-lg"
//                 style={{ border: `1px solid ${LINE}` }}
//               />
//               <div
//                 className="text-[10.5px] font-semibold mt-1"
//                 style={{ color: INK_SOFT }}
//               >
//                 Signature (HI)
//               </div>
//             </div>
//           )}
//           {lp.livePhoto && (
//             <div className="text-center">
//               <img
//                 src={lp.livePhoto}
//                 alt="Live"
//                 className="w-20 h-24 object-cover rounded-lg"
//                 style={{ border: `2px solid ${TEAL}` }}
//               />
//               <div
//                 className="text-[10.5px] font-bold mt-1"
//                 style={{ color: TEAL }}
//               >
//                 Live photo ✓
//               </div>
//             </div>
//           )}
//         </div>
//       </ReviewSection>

//       <div
//         className="rounded-2xl p-6 space-y-4"
//         style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//       >
//         <div className="text-[12.5px] font-extrabold" style={{ color: INK }}>
//           Declaration
//         </div>
//         <div
//           className="text-[12px] leading-relaxed p-4 rounded-xl"
//           style={{ background: PAPER, border: `1px solid ${LINE}`, color: INK }}
//         >
//           I hereby declare that all information furnished by me in this
//           application is true, complete and correct to the best of my knowledge.
//           If any information is found false or ineligibility is detected, my
//           candidature is liable to be cancelled.
//           <div className="mt-2" style={{ color: INK_SOFT }}>
//             मैं घोषणा करता/करती हूँ कि इस आवेदन पत्र में दी गई सभी जानकारी सत्य
//             एवं सही है।
//           </div>
//         </div>
//         <label className="flex items-start gap-3 cursor-pointer">
//           <input
//             type="checkbox"
//             checked={declared}
//             onChange={(e: ChangeEvent<HTMLInputElement>) => {
//               setDeclared(e.target.checked);
//               setErr("");
//             }}
//             className="w-4 h-4 mt-0.5"
//             style={{ accentColor: INK }}
//           />
//           <span className="text-[13px] font-bold" style={{ color: INK }}>
//             I accept the above declaration · मैं घोषणा स्वीकार करता/करती हूँ
//           </span>
//         </label>
//         {err && (
//           <div
//             className="flex items-center gap-1 text-[11px] font-bold"
//             style={{ color: DANGER }}
//           >
//             <AlertCircle size={11} /> {err}
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end pt-2">
//         <button
//           className="gf-btn-primary px-10 py-3 text-[13.5px]"
//           disabled={!declared}
//           onClick={handleSubmit}
//         >
//           <CheckCircle2 size={16} /> FINAL SUBMIT
//         </button>
//       </div>
//     </div>
//   );
// };

// /* ---------------------------------------------------------------
//    MAIN
// --------------------------------------------------------------- */
// const ApplicationFormContent: React.FC = () => {
//   const [currentStep, setCurrentStep] = useState<number>(1);
//   const [completed, setCompleted] = useState<Set<number>>(new Set());
//   const [submitted, setSubmitted] = useState<boolean>(false);
//   const [generating, setGenerating] = useState<boolean>(false);
//   const [formData, setFormData] = useState<FormData>({
//     personal: {},
//     payment: {},
//     education: {},
//     photos: {},
//     livePhoto: {},
//   });

//   const saveStep = (step: number, d: any, key: keyof FormData) => {
//     setFormData((prev) => ({ ...prev, [key]: d }));
//     setCompleted((prev) => new Set([...prev, step]));
//     if (step < 6) setCurrentStep(step + 1);
//   };

//   const downloadSummary = async () => {
//     setGenerating(true);
//     await new Promise((r) => setTimeout(r, 900));
//     const p = formData.personal || {};
//     const html = `<html><head><meta charset="utf-8"><title>Application Summary</title></head><body style="font-family:sans-serif;padding:32px;">
//       <h2>BSSC Application Summary</h2>
//       <p><b>Registration No:</b> ${MOCK_CANDIDATE.registrationNo}</p>
//       <p><b>Name:</b> ${p.applicantName || MOCK_CANDIDATE.name}</p>
//       <p><b>Father's name:</b> ${p.fatherName || ""}</p>
//       <p><b>Category:</b> ${p.category || ""}</p>
//       <p><b>Email:</b> ${p.emailId || ""}</p>
//       <p><b>Status:</b> Submitted</p>
//       </body></html>`;
//     const blob = new Blob([html], { type: "text/html" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "Application_Summary.html";
//     a.click();
//     URL.revokeObjectURL(url);
//     setGenerating(false);
//   };

//   const FONTS_STYLE = <style>{FONTS}</style>;

//   if (submitted) {
//     return (
//       <div className="gf-root min-h-screen" style={{ background: PAPER }}>
//         {FONTS_STYLE}
//         <HeaderBar />
//         <div
//           className="flex items-center justify-center p-6"
//           style={{ minHeight: "70vh" }}
//         >
//           <div
//             className="gf-pop max-w-lg w-full rounded-2xl p-8 text-center space-y-5"
//             style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//           >
//             <div
//               className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
//               style={{ background: "#E8F3EF", border: `3px solid ${TEAL}` }}
//             >
//               <CheckCircle2 size={36} style={{ color: TEAL }} />
//             </div>
//             <div>
//               <div
//                 className="gf-display text-xl font-semibold"
//                 style={{ color: INK }}
//               >
//                 Application submitted!
//               </div>
//               <div
//                 className="text-[12.5px] font-medium mt-1"
//                 style={{ color: INK_SOFT }}
//               >
//                 आवेदन सफलतापूर्वक जमा किया गया
//               </div>
//             </div>
//             <div
//               className="rounded-xl p-4 text-left space-y-2"
//               style={{ background: PAPER, border: `1px solid ${LINE}` }}
//             >
//               <div className="flex justify-between text-[12.5px]">
//                 <span style={{ color: INK_SOFT }}>Registration No.</span>
//                 <span
//                   className="font-extrabold gf-mono"
//                   style={{ color: OCHRE_DEEP }}
//                 >
//                   {MOCK_CANDIDATE.registrationNo}
//                 </span>
//               </div>
//               <div className="flex justify-between text-[12.5px]">
//                 <span style={{ color: INK_SOFT }}>Candidate name</span>
//                 <span className="font-bold" style={{ color: INK }}>
//                   {MOCK_CANDIDATE.name}
//                 </span>
//               </div>
//               <div className="flex justify-between text-[12.5px]">
//                 <span style={{ color: INK_SOFT }}>Status</span>
//                 <span className="font-extrabold" style={{ color: TEAL }}>
//                   Submitted ✓
//                 </span>
//               </div>
//             </div>
//             <div className="flex flex-col gap-3">
//               <button
//                 onClick={downloadSummary}
//                 disabled={generating}
//                 className="gf-btn-primary w-full"
//               >
//                 {generating ? (
//                   <>
//                     <Loader2 size={15} className="gf-spin" /> Generating…
//                   </>
//                 ) : (
//                   <>
//                     <Download size={15} /> Download Application Summary
//                   </>
//                 )}
//               </button>
//               <button
//                 onClick={() => {
//                   setSubmitted(false);
//                   setCurrentStep(1);
//                   setCompleted(new Set());
//                   setFormData({
//                     personal: {},
//                     payment: {},
//                     education: {},
//                     photos: {},
//                     livePhoto: {},
//                   });
//                 }}
//                 className="gf-btn-secondary w-full"
//               >
//                 <LogOut size={15} /> Back to dashboard
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="gf-root min-h-screen" style={{ background: PAPER }}>
//       {FONTS_STYLE}
//       <HeaderBar />

//       {/* Stepper */}
//       <div
//         style={{ background: CARD, borderBottom: `1.5px solid ${LINE}` }}
//         className="sticky top-0 z-10"
//       >
//         <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
//           <div className="flex items-center gap-1 overflow-x-auto">
//             {STEPS.map((s, idx) => {
//               const isActive = currentStep === s.id;
//               const isDone = completed.has(s.id);
//               const accessible = s.id <= currentStep || isDone;
//               const Icon = s.icon;
//               return (
//                 <React.Fragment key={s.id}>
//                   <button
//                     onClick={() => accessible && setCurrentStep(s.id)}
//                     disabled={!accessible}
//                     className="flex flex-col items-center gap-1 shrink-0"
//                     style={{
//                       opacity: accessible ? 1 : 0.4,
//                       cursor: accessible ? "pointer" : "not-allowed",
//                     }}
//                   >
//                     <div
//                       className="w-9 h-9 rounded-full flex items-center justify-center"
//                       style={{
//                         background: isDone ? TEAL : isActive ? INK : "#fff",
//                         border: `2px solid ${isDone ? TEAL : isActive ? INK : LINE}`,
//                       }}
//                     >
//                       {isDone ? (
//                         <CheckCircle2 size={15} color="#fff" />
//                       ) : (
//                         <Icon size={14} color={isActive ? "#fff" : INK_SOFT} />
//                       )}
//                     </div>
//                     <div className="text-center hidden sm:block">
//                       <div
//                         className="text-[11px] font-extrabold leading-tight"
//                         style={{
//                           color: isActive ? INK : isDone ? TEAL : INK_SOFT,
//                         }}
//                       >
//                         {s.en}
//                       </div>
//                       <div
//                         className="text-[10px] font-medium leading-tight"
//                         style={{ color: INK_SOFT }}
//                       >
//                         {s.hi}
//                       </div>
//                     </div>
//                   </button>
//                   {idx < STEPS.length - 1 && (
//                     <div
//                       className="h-0.5 flex-1 min-w-4"
//                       style={{ background: isDone ? TEAL : LINE }}
//                     />
//                   )}
//                 </React.Fragment>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       <main className="max-w-7xl mx-auto w-full py-2">
//         <div
//           className="rounded-2xl overflow-hidden"
//           style={{ background: CARD, border: `1.5px solid ${LINE}` }}
//         >
//           <div className="px-5 py-2 text-center" style={{ background: OCHRE }}>
//             <span className="text-[11px] font-extrabold text-white">
//               STEP {currentStep} OF 6 — {STEPS[currentStep - 1].en} ·{" "}
//               {STEPS[currentStep - 1].hi}
//             </span>
//           </div>
//           <div className="p-5">
//             {currentStep === 1 && (
//               <Step1Personal
//                 data={formData.personal}
//                 onSave={(d: PersonalData) => saveStep(1, d, "personal")}
//               />
//             )}
//             {currentStep === 2 && (
//               <Step2Payment
//                 data={formData.payment}
//                 onSave={(d: PaymentData) => saveStep(2, d, "payment")}
//               />
//             )}
//             {currentStep === 3 && (
//               <Step3Education
//                 data={formData.education}
//                 onSave={(d: EducationData) => saveStep(3, d, "education")}
//               />
//             )}
//             {currentStep === 4 && (
//               <Step4PhotoUpload
//                 data={formData.photos}
//                 onSave={(d: PhotoData) => saveStep(4, d, "photos")}
//               />
//             )}
//             {currentStep === 5 && (
//               <Step5LivePhoto
//                 data={formData.livePhoto}
//                 onSave={(d: LivePhotoData) => saveStep(5, d, "livePhoto")}
//               />
//             )}
//             {currentStep === 6 && (
//               <Step6Review
//                 formData={formData}
//                 onSubmit={() => setSubmitted(true)}
//                 onEdit={(s: number) => setCurrentStep(s)}
//               />
//             )}
//           </div>
//         </div>

//         {currentStep > 1 && (
//           <div className="mt-4">
//             <button
//               onClick={() => setCurrentStep((s) => s - 1)}
//               className="gf-btn-secondary"
//             >
//               <ChevronLeft size={15} /> Previous
//             </button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// };

// const HeaderBar: React.FC = () => {
//   return (
//     <div style={{ background: CARD, borderBottom: `1.5px solid ${LINE}` }}>
//       <div className="w-full mx-auto px-4 md:px-8 p-2 flex items-center justify-between">
//         <div>
//           <div
//             className="text-[10.5px] font-extrabold tracking-[0.18em]"
//             style={{ color: OCHRE_DEEP }}
//           >
//             BIHAR STAFF SELECTION COMMISSION
//           </div>
//           <div
//             className="gf-display text-xl font-semibold"
//             style={{ color: INK }}
//           >
//             Candidate Application
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ApplicationFormContent;




import  type {ChangeEvent,} from "react";
import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import {
  User,
  CreditCard,
  GraduationCap,
  Upload,
  Camera,
  ClipboardCheck,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  AlertCircle,
  RotateCcw,
  Download,
  LogOut,
  Eye,
  Loader2,
  ShieldCheck,
  Briefcase,
} from "lucide-react";
import Webcam from "react-webcam";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import type {
  PersonalData,
  PaymentData,
  EducationData,
  PhotoData,
  LivePhotoData,
  FormData,
  Step1Props,
  Step2Props,
  Step3Props,
  Step4Props,
  Step5Props,
  Step6Props,
  FieldProps,
  PillGroupProps,
  SectionTitleProps,
  NoteProps,
  AddressFieldsProps,
  CertNumberDateAuthorityProps,
  EducationBlockProps,
  UploadField,
  Step,
  Candidate,
} from "../types/application";

// ── Reused exactly as in GovernmentRegistrationForm — same API module,
//    same age-eligibility engine, same DateSelect + Cognito duration helper.
import {
  fetchCategoriesApi,
  fetchExOfficerTypesApi,
  fetchDisabilitiesApi,
  type Category,
  type ExOfficerType,
  type Disability,
} from "../api/registrationApi";
import {
  validateAgeEligibility,
  type OfficerType,
  type Category as CategoryCode,
} from "../validation/ageEligibility";
import { calcDuration } from "../auth/cognito";
import type { DurationParts } from "../auth/cognito";
import DateSelect from "../components/common/DateSelect";

// ── Application-wizard API integration — single consolidated API file
//    (countries/states/districts, step bootstrap, step 1-5 saves,
//    payment probe, final submit) + the step0 -> step1 auto-fill mapper.
import {
  applicationApi,
  paymentApi,
  locationApi,
  type ApplicationStepsResponse,
  type Country,
  type StateItem,
  type DistrictItem,
} from "../api/applicationFormApi";
import { mapStep0ToStep1 } from "../api/step0ToStep1Mapper";

/* ---------------------------------------------------------------
   TOKENS — matches the Candidate Registration page design system
--------------------------------------------------------------- */
const INK = "#12233F";
const INK_SOFT = "#5B6B84";
const PAPER = "#F4F5F2";
const CARD = "#FFFFFF";
const LINE = "#DBDFE6";
const OCHRE = "#B9722E";
const OCHRE_DEEP = "#8F5522";
const TEAL = "#1E6F5C";
const DANGER = "#B3432B";

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Manrope:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');
  .gf-root, .gf-root * { font-family: 'Manrope', sans-serif; box-sizing: border-box; }
  .gf-display { font-family: 'Fraunces', serif; }
  .gf-mono { font-family: 'JetBrains Mono', monospace; }

  .gf-root input[type="radio"] { position: absolute; opacity: 0; width: 0; height: 0; }
  .gf-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px; border-radius: 999px; border: 1.5px solid ${LINE};
    background: #fff; cursor: pointer; font-weight: 700; font-size: 12.5px;
    color: ${INK}; transition: all .15s ease; user-select: none;
  }
  .gf-pill:hover { border-color: ${OCHRE}; }
  .gf-radio-input:checked + .gf-pill { background: ${INK}; border-color: ${INK}; color: #fff; }
  .gf-radio-input:focus-visible + .gf-pill { outline: 2px solid ${OCHRE}; outline-offset: 2px; }

  .gf-input, .gf-select {
    width: 100%; border: 1.5px solid ${LINE}; border-radius: 10px;
    padding: 10px 13px; font-size: 13.5px; font-weight: 600; color: ${INK};
    background: #fff; outline: none; transition: border-color .15s ease, box-shadow .15s ease;
  }
  .gf-input:disabled, .gf-select:disabled { background: #F1F2F4; color: ${INK_SOFT}; cursor: not-allowed; }
  .gf-input:focus, .gf-select:focus { border-color: ${OCHRE}; box-shadow: 0 0 0 3px rgba(185,114,46,0.15); }
  .gf-input.gf-error, .gf-select.gf-error { border-color: ${DANGER}; }
  .gf-input::placeholder { color: #A6AEBB; font-weight: 500; }

  .gf-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 11px 26px; border-radius: 999px; font-weight: 800; font-size: 13px;
    background: ${INK}; color: #fff; border: none; cursor: pointer; transition: opacity .15s ease;
  }
  .gf-btn-primary:disabled { opacity: .45; cursor: not-allowed; }
  .gf-btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 10px 24px; border-radius: 999px; font-weight: 800; font-size: 13px;
    background: #fff; color: ${INK}; border: 1.5px solid ${LINE}; cursor: pointer;
  }
  .gf-btn-secondary:hover { border-color: ${OCHRE_DEEP}; }

  @keyframes gf-pop { 0% { transform: scale(.92); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .gf-pop { animation: gf-pop .35s cubic-bezier(.34,1.56,.64,1); }
  @keyframes gf-spin { to { transform: rotate(360deg); } }
  .gf-spin { animation: gf-spin .8s linear infinite; }
`;

const MOCK_CANDIDATE: Candidate = {
  registrationNo: "5250000005",
  name: "NANCY KUMARI GUPTA",
};

const STEPS: Step[] = [
  { id: 1, en: "Personal Details", hi: "व्यक्तिगत विवरण", icon: User },
  { id: 2, en: "Payment", hi: "भुगतान", icon: CreditCard },
  { id: 3, en: "Education", hi: "शैक्षणिक विवरण", icon: GraduationCap },
  { id: 4, en: "Photo Upload", hi: "फोटो अपलोड", icon: Upload },
  { id: 5, en: "Live Photo", hi: "लाइव फोटो", icon: Camera },
  {
    id: 6,
    en: "Review & Submit",
    hi: "समीक्षा और जमा करें",
    icon: ClipboardCheck,
  },
];

const YES_NO = ["YES", "NO"];
const YES_NO_NA = ["YES", "NO", "NA"];

/* ---------------------------------------------------------------
   TOAST HELPERS — single place so every step shows errors the same
   way. `toast.error` is used for validation / mandatory-field
   failures, `toast.success` for save confirmations.
--------------------------------------------------------------- */
const notifyError = (message: string) => {
  toast.error(message, { toastId: message });
};
const notifySuccess = (message: string) => {
  toast.success(message);
};

/* ---------------------------------------------------------------
   SHARED UI PRIMITIVES  (unchanged — used by every step)
--------------------------------------------------------------- */
const Field: React.FC<FieldProps> = ({
  label,
  hi,
  required,
  error,
  children,
}) => (
  <div className="mb-5">
    <div className="mb-1.5">
      <div
        className="text-[14px] font-extrabold tracking-wide"
        style={{ color: INK }}
      >
        {required && <span style={{ color: DANGER }}>* </span>}
        {label}
      </div>
      {hi && (
        <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>
          {hi}
        </div>
      )}
    </div>
    {children}
    {error && (
      <div
        className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
        style={{ color: DANGER }}
      >
        <AlertCircle size={11} /> {error}
      </div>
    )}
  </div>
);

const PillGroup: React.FC<PillGroupProps> = ({
  name,
  value,
  onChange,
  options,
  disabled,
}: PillGroupProps & { disabled?: boolean }) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((opt) => (
      <label
        key={opt}
        style={{ position: "relative", opacity: disabled ? 0.55 : 1 }}
      >
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => !disabled && onChange(opt)}
          disabled={disabled}
          className="gf-radio-input"
        />
        <span
          className="gf-pill"
          style={{ cursor: disabled ? "not-allowed" : "pointer" }}
        >
          {opt.replace("NA", "N/A")}
        </span>
      </label>
    ))}
  </div>
);

const SelectBox: React.FC<{
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  error?: string | false;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
}> = ({ name, value, onChange, error, disabled, className = "", children }) => (
  <div className="relative">
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`gf-select appearance-none pr-9 ${error ? "gf-error" : ""} ${className}`}
    >
      {children}
    </select>
    <ChevronDown
      size={14}
      className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      style={{ color: INK_SOFT }}
    />
  </div>
);

const SectionTitle: React.FC<SectionTitleProps> = ({
  icon: Icon,
  children,
}) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon size={16} style={{ color: OCHRE }} />
    <h3 className="gf-display text-base font-semibold" style={{ color: INK }}>
      {children}
    </h3>
  </div>
);

const Note: React.FC<NoteProps> = ({ children, tone = "ochre" }) => (
  <div
    className="rounded-xl p-4 text-[11.5px] leading-relaxed font-medium"
    style={{
      background: tone === "ochre" ? "#FAF6EF" : "#FCECE8",
      border: `1px solid ${tone === "ochre" ? "#ECD9BE" : "#F0CFC5"}`,
      color: tone === "ochre" ? OCHRE_DEEP : DANGER,
    }}
  >
    {children}
  </div>
);

/* ---------------------------------------------------------------
   ADDRESS FIELDS — Village/PoliceStation/PostOffice/PinCode stay as
   free-text inputs. State & District are now driven by the
   locationApi (getStatesByCountry / getDistrictsByState) instead of
   free text, cascading from the selected State down to District.
--------------------------------------------------------------- */
const AddressFields: React.FC<
  AddressFieldsProps & {
    states: StateItem[];
    statesLoading: boolean;
    districts: DistrictItem[];
    districtsLoading: boolean;
    onStateChange: (e: ChangeEvent<HTMLSelectElement>) => void;
    onDistrictChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  }
> = ({
  prefix,
  v,
  setField,
  errors,
  disabled,
  states,
  statesLoading,
  districts,
  districtsLoading,
  onStateChange,
  onDistrictChange,
}) => {
  const rows: [string, string, string][] = [
    ["Village", "गाँव/मोहल्ला", "Village"],
    ["PoliceStation", "पुलिस थाना", "PoliceStation"],
    ["PostOffice", "डाकघर", "PostOffice"],
    ["PinCode", "पिन कोड", "PinCode"],
  ];

  const stateKey = `${prefix}State` as keyof PersonalData;
  const districtKey = `${prefix}District` as keyof PersonalData;
  const hasState = !!v[`${prefix}StateId`];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
      {rows.map(([suffix, hiLabel]) => {
        const key = `${prefix}${suffix}` as keyof PersonalData;
        return (
          <Field
            key={key}
            label={suffix.replace(/([A-Z])/g, " $1").trim()}
            hi={hiLabel}
            required
            error={errors[key as string]}
          >
            <input
              className={`gf-input ${errors[key as string] ? "gf-error" : ""}`}
              disabled={disabled}
              value={v[key] || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField(key as string, e.target.value)
              }
              maxLength={suffix === "PinCode" ? 6 : undefined}
              placeholder={suffix.replace(/([A-Z])/g, " $1").trim()}
            />
          </Field>
        );
      })}

      <Field label="State" hi="राज्य" required error={errors[stateKey as string]}>
        <SelectBox
          name={stateKey as string}
          value={v[stateKey] || ""}
          onChange={onStateChange}
          error={errors[stateKey as string]}
          disabled={disabled || statesLoading}
        >
          <option value="">{statesLoading ? "Loading..." : "Select state"}</option>
          {states.map((s) => (
            <option key={s.stateId} value={s.stateName}>
              {s.stateName}
            </option>
          ))}
        </SelectBox>
      </Field>

      <Field label="District" hi="जिला" required error={errors[districtKey as string]}>
        <SelectBox
          name={districtKey as string}
          value={v[districtKey] || ""}
          onChange={onDistrictChange}
          error={errors[districtKey as string]}
          disabled={disabled || districtsLoading || !hasState}
        >
          <option value="">
            {districtsLoading
              ? "Loading..."
              : !hasState
              ? "Select state first"
              : "Select district"}
          </option>
          {districts.map((d) => (
            <option key={d.districtId} value={d.districtName}>
              {d.districtName}
            </option>
          ))}
        </SelectBox>
      </Field>
    </div>
  );
};

const CertNumberDateAuthority: React.FC<CertNumberDateAuthorityProps> = ({
  v,
  setField,
  prefixNo,
  prefixDate,
  prefixAuth,
  labelNo,
  hiNo,
  labelDate,
  hiDate,
  labelAuth,
  hiAuth,
}) => (
  <>
    <Field label={labelNo} hi={hiNo}>
      <input
        className="gf-input"
        value={v[prefixNo] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setField(prefixNo, e.target.value)
        }
        placeholder="Certificate number"
      />
    </Field>
    {prefixDate && (
      <Field label={labelDate} hi={hiDate}>
        <input
          type="date"
          className="gf-input"
          value={v[prefixDate] || ""}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setField(prefixDate, e.target.value)
          }
        />
      </Field>
    )}
    <Field label={labelAuth} hi={hiAuth}>
      <input
        className="gf-input"
        value={v[prefixAuth] || ""}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setField(prefixAuth, e.target.value)
        }
        placeholder="Issuing authority"
      />
    </Field>
  </>
);

/* ---------------------------------------------------------------
   STEP 1 — PERSONAL DETAILS
--------------------------------------------------------------- */

type Step1Data = PersonalData & { [key: string]: any };

const pad2 = (val: string): string => (val || "").padStart(2, "0");

const isRealDate = (day: string, month: string, year: string): boolean => {
  const d = parseInt(day, 10),
    m = parseInt(month, 10),
    y = parseInt(year, 10);
  if (!d || !m || !y) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
};

const toIso = (day: string, month: string, year: string): string =>
  day && month && year ? `${year}-${pad2(month)}-${pad2(day)}` : "";

const formatDuration = (d: DurationParts | null): string =>
  d ? `${d.years}y ${d.months}m ${d.days}d` : "—";

const mapCategoryLabelToCode = (label: string): CategoryCode | "" => {
  const l = (label || "").toUpperCase();
  if (/UNRESERVED|GENERAL|\bUR\b/.test(l)) return "UR";
  if (/ECONOMICALLY WEAKER|\bEWS\b/.test(l)) return "EWS";
  if (/EXTREMELY BACKWARD|\bEBC\b/.test(l)) return "EBC";
  if (/BACKWARD CLASS|\bBC\b/.test(l)) return "BC";
  if (/SCHEDULED CASTE|\bSC\b/.test(l)) return "SC";
  if (/SCHEDULED TRIBE|\bST\b/.test(l)) return "ST";
  return "";
};

const mapOfficerLabelToCode = (label: string): OfficerType | "" => {
  const l = (label || "").toUpperCase();
  if (/\bECO\b|EMERGENCY COMMISSIONED/.test(l)) return "ECO";
  if (/\bSSCO\b|SHORT SERVICE COMMISSIONED/.test(l)) return "SSCO";
  if (/COMMISSIONED OFFICER/.test(l)) return "COMMISSIONED_OFFICER";
  if (/OTHER RANKS|\bJCO\b|\bOR\b/.test(l)) return "OTHER_RANKS";
  return "";
};

const AUTHORITY_OPTIONS = ["SO", "DM", "RO", "Other"];

type DatePart = "day" | "month" | "year";

const Step1Personal: React.FC<
  Step1Props & { applicationId?: string; autoFill?: Record<string, any> }
> = ({ data, onSave, applicationId, autoFill }) => {
  const [v, setV] = useState<Step1Data>({
    nationality: "INDIAN",
    sameAsPermanent: false,
    ...data,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSavingStep1, setIsSavingStep1] = useState(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [subCategories, setSubCategories] = useState<Category[]>([]);

  const [exOfficerTypes, setExOfficerTypes] = useState<ExOfficerType[]>([]);
  const [exOfficerLoading, setExOfficerLoading] = useState(false);

  const [disabilities, setDisabilities] = useState<Disability[]>([]);
  const [disabilitiesLoading, setDisabilitiesLoading] = useState(false);

  // ── Location APIs: countries (nationality), states, districts ──
  const [countries, setCountries] = useState<Country[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(false);

  const [states, setStates] = useState<StateItem[]>([]);
  const [statesLoading, setStatesLoading] = useState(false);

  const [permDistricts, setPermDistricts] = useState<DistrictItem[]>([]);
  const [permDistrictsLoading, setPermDistrictsLoading] = useState(false);
  const [corrDistricts, setCorrDistricts] = useState<DistrictItem[]>([]);
  const [corrDistrictsLoading, setCorrDistrictsLoading] = useState(false);

  const setField = (k: string, val: string | boolean) =>
    setV((p) => ({ ...p, [k]: val }));

  const setDatePart = (prefix: string, part: DatePart, value: string) => {
    setV((p) => ({ ...p, [`${prefix}${part[0].toUpperCase()}${part.slice(1)}`]: value }));
  };
  const touchDateTrio = (prefix: string) => {
    setTouched((p) => ({
      ...p,
      [`${prefix}Day`]: true,
      [`${prefix}Month`]: true,
      [`${prefix}Year`]: true,
    }));
  };
  const dateValue = (prefix: string) => ({
    day: v[`${prefix}Day`] || "",
    month: v[`${prefix}Month`] || "",
    year: v[`${prefix}Year`] || "",
  });
  const dateTouched = (prefix: string) => ({
    day: !!touched[`${prefix}Day`],
    month: !!touched[`${prefix}Month`],
    year: !!touched[`${prefix}Year`],
  });
  const dateErrors = (prefix: string, msg?: string) => ({
    day: touched[`${prefix}Day`] ? msg || errors[`${prefix}Day`] : "",
    month: touched[`${prefix}Month`] ? msg || errors[`${prefix}Month`] : "",
    year: touched[`${prefix}Year`] ? msg || errors[`${prefix}Year`] : "",
  });

  useEffect(() => {
    (async () => {
      try {
        setCategoriesLoading(true);
        setCategories(await fetchCategoriesApi());
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    })();
    (async () => {
      try {
        setExOfficerLoading(true);
        setExOfficerTypes(await fetchExOfficerTypesApi());
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load ex-officer types");
      } finally {
        setExOfficerLoading(false);
      }
    })();
    (async () => {
      try {
        setDisabilitiesLoading(true);
        setDisabilities(await fetchDisabilitiesApi());
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load disabilities");
      } finally {
        setDisabilitiesLoading(false);
      }
    })();
    (async () => {
      try {
        setCountriesLoading(true);
        const res = await locationApi.getCountries();
        setCountries(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load countries");
      } finally {
        setCountriesLoading(false);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (v.categoryId) {
      const selected = categories.find((c) => c.value === parseInt(v.categoryId));
      setSubCategories(selected?.subCategories || []);
    } else {
      setSubCategories([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.categoryId, categories]);

  // Auto-fill from step0 (initial registration snapshot). Only fills keys
  // that aren't already set on `v`, so it never overwrites anything
  // already on screen or a previously saved step1.
  useEffect(() => {
    if (!autoFill) return;
    setV((prev) => ({ ...autoFill, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFill]);

  // Once categories load, resolve the numeric mainCategory id (from
  // step0) into the category *label* Step1Personal works with — only if
  // the candidate hasn't already picked a category.
  useEffect(() => {
    if (!v.category && v.categoryId && categories.length > 0) {
      const match = categories.find((c) => String(c.value) === String(v.categoryId));
      if (match) setV((p) => ({ ...p, category: match.label }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, v.categoryId]);

  // Same resolution for caste, once sub-categories become available.
  useEffect(() => {
    if (!v.caste && v.casteId && subCategories.length > 0) {
      const match = subCategories.find((c) => String(c.value) === String(v.casteId));
      if (match) setV((p) => ({ ...p, caste: match.label }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subCategories, v.casteId]);

  // Default nationality to India (from the countries API) once it loads,
  // unless the candidate/autofill already picked something else.
  useEffect(() => {
    if (countries.length === 0) return;
    if (!v.nationality || v.nationality === "INDIAN") {
      const india = countries.find((c) => /india/i.test(c.countryName)) || countries[0];
      if (india) {
        setV((p) => ({ ...p, nationality: india.countryName, nationalityId: String(india.countryId) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries]);

  // Resolve nationalityId if only the nationality label is known
  // (e.g. coming from a previously saved step1 or the step0 autofill).
  useEffect(() => {
    if (v.nationality && v.nationality !== "OTHER" && !v.nationalityId && countries.length > 0) {
      const match = countries.find(
        (c) => c.countryName.toUpperCase() === String(v.nationality).toUpperCase(),
      );
      if (match) setV((p) => ({ ...p, nationalityId: String(match.countryId) }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countries, v.nationality]);

  // Fetch states for the selected country (India, by default).
  useEffect(() => {
    const countryId = v.nationalityId ? parseInt(v.nationalityId, 10) : null;
    if (!countryId) {
      setStates([]);
      return;
    }
    (async () => {
      try {
        setStatesLoading(true);
        const res = await locationApi.getStatesByCountry(countryId);
        setStates(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load states");
      } finally {
        setStatesLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.nationalityId]);

  // Fetch districts for the permanent address's selected state.
  useEffect(() => {
    if (!v.permStateId) {
      setPermDistricts([]);
      return;
    }
    (async () => {
      try {
        setPermDistrictsLoading(true);
        const res = await locationApi.getDistrictsByState(parseInt(v.permStateId, 10));
        setPermDistricts(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load districts");
      } finally {
        setPermDistrictsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.permStateId]);

  // Fetch districts for the correspondence address's selected state.
  useEffect(() => {
    if (!v.corrStateId) {
      setCorrDistricts([]);
      return;
    }
    (async () => {
      try {
        setCorrDistrictsLoading(true);
        const res = await locationApi.getDistrictsByState(parseInt(v.corrStateId, 10));
        setCorrDistricts(res.data?.data || []);
      } catch (err: any) {
        setSubmitError(err?.message || "Failed to load districts");
      } finally {
        setCorrDistrictsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [v.corrStateId]);

  const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = categories.find((c) => c.label === label);
    setV((p) => ({
      ...p,
      category: label,
      categoryId: selected ? String(selected.value) : "",
      caste: "",
      casteId: "",
    }));
  };

  const handleCasteChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = subCategories.find((c) => c.label === label);
    setV((p) => ({
      ...p,
      caste: label,
      casteId: selected ? String(selected.value) : "",
    }));
  };

  const handleNationalityChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    if (label === "OTHER") {
      setV((p) => ({ ...p, nationality: "OTHER", nationalityId: "" }));
      return;
    }
    const selected = countries.find((c) => c.countryName === label);
    setV((p) => ({
      ...p,
      nationality: label,
      nationalityId: selected ? String(selected.countryId) : "",
      otherNationality: "",
    }));
  };

  const handleStateChange = (prefix: "perm" | "corr") => (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const selected = states.find((s) => s.stateName === label);
    setV((p) => ({
      ...p,
      [`${prefix}State`]: label,
      [`${prefix}StateId`]: selected ? String(selected.stateId) : "",
      [`${prefix}District`]: "",
      [`${prefix}DistrictId`]: "",
    }));
  };

  const handleDistrictChange = (prefix: "perm" | "corr") => (e: ChangeEvent<HTMLSelectElement>) => {
    const label = e.target.value;
    const districtList = prefix === "perm" ? permDistricts : corrDistricts;
    const selected = districtList.find((d) => d.districtName === label);
    setV((p) => ({
      ...p,
      [`${prefix}District`]: label,
      [`${prefix}DistrictId`]: selected ? String(selected.districtId) : "",
    }));
  };

  const toggleSame = (checked: boolean) => {
    setV((p) => ({
      ...p,
      sameAsPermanent: checked,
      ...(checked
        ? {
            corrVillage: p.permVillage,
            corrPoliceStation: p.permPoliceStation,
            corrPostOffice: p.permPostOffice,
            corrDistrict: p.permDistrict,
            corrDistrictId: p.permDistrictId,
            corrState: p.permState,
            corrStateId: p.permStateId,
            corrPinCode: p.permPinCode,
          }
        : {}),
    }));
  };

  const showCategoryDocs = !!v.category && mapCategoryLabelToCode(v.category) !== "UR";
  const showNonCreamy = v.category && mapCategoryLabelToCode(v.category) !== "UR";
  const isBiharDomicile = v.domicileOfBihar === "YES";
  const isPwD = isBiharDomicile && v.disability === "YES";
  const isMin40PwD = isPwD && v.disabilityPercent === "YES";
  const isExServiceman = isBiharDomicile && v.exServiceman === "YES";
  const isNccCadet = isBiharDomicile && v.nccCadet === "YES";
  const isContractual = isBiharDomicile && v.contractualEmployee === "YES";

  const age = useMemo<DurationParts | null>(() => {
    if (!isRealDate(v.dobDay, v.dobMonth, v.dobYear)) return null;
    return calcDuration(toIso(v.dobDay, v.dobMonth, v.dobYear), "2025-08-01");
  }, [v.dobDay, v.dobMonth, v.dobYear]);

  const serviceDuration = useMemo<DurationParts | null>(() => {
    if (
      !v.serviceFromDay || !v.serviceFromMonth || !v.serviceFromYear ||
      !v.serviceToDay || !v.serviceToMonth || !v.serviceToYear
    )
      return null;
    return calcDuration(
      toIso(v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear),
      toIso(v.serviceToDay, v.serviceToMonth, v.serviceToYear),
    );
  }, [
    v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear,
    v.serviceToDay, v.serviceToMonth, v.serviceToYear,
  ]);

  const nccDuration = useMemo<DurationParts | null>(() => {
    if (
      !v.nccWorkingFromDay || !v.nccWorkingFromMonth || !v.nccWorkingFromYear ||
      !v.nccWorkingToDay || !v.nccWorkingToMonth || !v.nccWorkingToYear
    )
      return null;
    return calcDuration(
      toIso(v.nccWorkingFromDay, v.nccWorkingFromMonth, v.nccWorkingFromYear),
      toIso(v.nccWorkingToDay, v.nccWorkingToMonth, v.nccWorkingToYear),
    );
  }, [
    v.nccWorkingFromDay, v.nccWorkingFromMonth, v.nccWorkingFromYear,
    v.nccWorkingToDay, v.nccWorkingToMonth, v.nccWorkingToYear,
  ]);

  const contractualDuration = useMemo<DurationParts | null>(() => {
    if (
      !v.contractualFromDay || !v.contractualFromMonth || !v.contractualFromYear ||
      !v.contractualToDay || !v.contractualToMonth || !v.contractualToYear
    )
      return null;
    return calcDuration(
      toIso(v.contractualFromDay, v.contractualFromMonth, v.contractualFromYear),
      toIso(v.contractualToDay, v.contractualToMonth, v.contractualToYear),
    );
  }, [
    v.contractualFromDay, v.contractualFromMonth, v.contractualFromYear,
    v.contractualToDay, v.contractualToMonth, v.contractualToYear,
  ]);

  const ageEligibility = useMemo(() => {
    if (!isRealDate(v.dobDay, v.dobMonth, v.dobYear)) return null;
    if (!v.category || !v.gender) return null;
    return validateAgeEligibility({
      category: mapCategoryLabelToCode(v.category),
      gender: v.gender as any,
      dobISO: toIso(v.dobDay, v.dobMonth, v.dobYear),
      isPwbd: isMin40PwD,
      isExServiceman,
      officerType: mapOfficerLabelToCode(v.officerType || ""),
      serviceFromISO: toIso(v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear),
      serviceToISO: toIso(v.serviceToDay, v.serviceToMonth, v.serviceToYear),
      isBiharGovtEmployee: v.biharGovtEmployee === "YES",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    v.dobDay, v.dobMonth, v.dobYear, v.category, v.gender,
    v.disability, v.disabilityPercent, v.exServiceman, v.officerType,
    v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear,
    v.serviceToDay, v.serviceToMonth, v.serviceToYear, v.biharGovtEmployee,
  ]);

  const required = [
    "applicantName", "fatherName", "motherName", "gender", "isMarried",
    "nationality", "emailId", "mobileNo", "confirmMobileNo",
    "domicileOfBihar", "category", "isNonCreamyLayer",
    "hasAadharCard",
    "permVillage", "permPoliceStation", "permPostOffice", "permDistrict", "permState", "permPinCode",
    "corrVillage", "corrPoliceStation", "corrPostOffice", "corrDistrict", "corrState", "corrPinCode",

    ...(isBiharDomicile
      ? [
          "disability", "isMin40PercentPwD", "exServiceman", "nccCadet",
          "wardOfFreedomFighter", "biharGovtEmployee", "numberOfAttempts",
          "contractualEmployee", "isDebarred",
        ]
      : []),
  ];

  const validate = () => {
    const e: Record<string, string> = {};

    required.forEach((f) => {
      if (!String(v[f] ?? "").trim()) e[f] = "This field is required";
    });

    if (!isRealDate(v.dobDay, v.dobMonth, v.dobYear)) e.dobDay = "Enter a valid date of birth";
    if (v.domicileOfBihar === "YES" && !isRealDate(v.domicileIssueDateDay, v.domicileIssueDateMonth, v.domicileIssueDateYear))
      e.domicileIssueDateDay = "Domicile certificate issue date is required";

    if (v.isMarried === "YES" && !String(v.spouseName || "").trim())
      e.spouseName = "Spouse's name is required";

    if (showNonCreamy && subCategories.length > 0 && !v.caste) e.caste = "Caste is required";

    if (showCategoryDocs) {
      if (!v.categoryCertNo) e.categoryCertNo = "Certificate number is required";
      if (!isRealDate(v.categoryIssueDateDay, v.categoryIssueDateMonth, v.categoryIssueDateYear))
        e.categoryIssueDateDay = "Issue date is required";
      if (!v.categoryAuthority) e.categoryAuthority = "Issuing authority is required";
      if (v.categoryAuthority === "Other" && !v.categoryAuthorityOther)
        e.categoryAuthorityOther = "Please specify the issuing authority";
    }

    if (isMin40PwD && isExServiceman) {
      e.isMin40PercentPwD = "Cannot claim PwBD (40%+) relaxation together with ex-serviceman relaxation. Choose one.";
      e.exServiceman = "Cannot claim ex-serviceman relaxation together with PwBD (40%+) relaxation. Choose one.";
    }

    if (isPwD) {
      if (!v.natureOfDisabilityType) e.natureOfDisabilityType = "Please select nature of disability";
      if (!v.disabilityCertNo) e.disabilityCertNo = "Disability certificate number is required";
      if (!isRealDate(v.disabilityIssueDateDay, v.disabilityIssueDateMonth, v.disabilityIssueDateYear))
        e.disabilityIssueDateDay = "Issue date is required";
      if (!v.disabilityAuthority) e.disabilityAuthority = "Issuing authority is required";
      if (v.disabilityAuthority === "Other" && !v.disabilityAuthorityOther)
        e.disabilityAuthorityOther = "Please specify the issuing authority";
      if (isMin40PwD && !v.isScribeRequired) e.isScribeRequired = "Please specify if scribe is required";
    }

    if (isExServiceman) {
      if (!v.officerType) e.officerType = "Select the officer / ex-serviceman category";
      if (
        !v.serviceFromDay || !v.serviceFromMonth || !v.serviceFromYear ||
        !v.serviceToDay || !v.serviceToMonth || !v.serviceToYear
      ) {
        e.serviceFromDay = "Complete service period is required for ex-servicemen";
      }
    }

    if (isNccCadet) {
      if (
        !v.nccWorkingFromDay || !v.nccWorkingFromMonth || !v.nccWorkingFromYear ||
        !v.nccWorkingToDay || !v.nccWorkingToMonth || !v.nccWorkingToYear
      ) {
        e.nccWorkingFromDay = "Complete NCC working period is required";
      }
    }

    if (isContractual) {
      if (!v.nameOfPost) e.nameOfPost = "Name of post is required";
      if (
        !v.contractualFromDay || !v.contractualFromMonth || !v.contractualFromYear ||
        !v.contractualToDay || !v.contractualToMonth || !v.contractualToYear
      ) {
        e.contractualFromDay = "Contractual service period is required";
      }
    }

    if (v.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.emailId)) e.emailId = "Enter a valid email";
    if (v.mobileNo && !/^[6-9]\d{9}$/.test(v.mobileNo))
      e.mobileNo = "Enter a valid 10 digit number starting with 6-9";
    if (v.confirmMobileNo && v.confirmMobileNo !== v.mobileNo)
      e.confirmMobileNo = "Mobile numbers do not match";
    if (v.permPinCode && !/^\d{6}$/.test(v.permPinCode)) e.permPinCode = "Enter a 6-digit PIN code";
    if (v.corrPinCode && !/^\d{6}$/.test(v.corrPinCode)) e.corrPinCode = "Enter a 6-digit PIN code";
    if (v.hasAadharCard === "YES" && v.aadharCardNumber && !/^\d{12}$/.test(v.aadharCardNumber))
      e.aadharCardNumber = "Aadhar must be 12 digits";

    setErrors(e);
    setTouched((p) => {
      const t = { ...p };
      Object.keys(e).forEach((k) => (t[k] = true));
      [
        "dobDay", "dobMonth", "dobYear",
        "domicileIssueDateDay", "domicileIssueDateMonth", "domicileIssueDateYear",
        "categoryIssueDateDay", "categoryIssueDateMonth", "categoryIssueDateYear",
        "disabilityIssueDateDay", "disabilityIssueDateMonth", "disabilityIssueDateYear",
        "serviceFromDay", "serviceFromMonth", "serviceFromYear",
        "serviceToDay", "serviceToMonth", "serviceToYear",
        "nccWorkingFromDay", "nccWorkingFromMonth", "nccWorkingFromYear",
        "nccWorkingToDay", "nccWorkingToMonth", "nccWorkingToYear",
        "contractualFromDay", "contractualFromMonth", "contractualFromYear",
        "contractualToDay", "contractualToMonth", "contractualToYear",
      ].forEach((k) => (t[k] = true));
      return t;
    });

    if (Object.keys(e).length > 0) {
      const firstMessage = Object.values(e)[0];
      notifyError(firstMessage || "Please fill all mandatory fields correctly.");
    }

    return Object.keys(e).length === 0;
  };

  const handleSaveNext = async () => {
    setSubmitError("");
    const ok = validate();
    if (!ok) return;

    if (ageEligibility && !ageEligibility.ok) {
      setSubmitError(ageEligibility.message);
      notifyError(ageEligibility.message);
      return;
    }
 const { applicantName, ...rest } = v;
    const payload: Step1Data = {
       fullName: applicantName,  // Changed from applicantName to fullName
    ...rest,
      dateOfBirth: toIso(v.dobDay, v.dobMonth, v.dobYear),
      domicileIssueDate: toIso(v.domicileIssueDateDay, v.domicileIssueDateMonth, v.domicileIssueDateYear),
      categoryIssueDate: toIso(v.categoryIssueDateDay, v.categoryIssueDateMonth, v.categoryIssueDateYear),
      disabilityIssueDate: toIso(v.disabilityIssueDateDay, v.disabilityIssueDateMonth, v.disabilityIssueDateYear),
      serviceFromDate: toIso(v.serviceFromDay, v.serviceFromMonth, v.serviceFromYear),
      serviceToDate: toIso(v.serviceToDay, v.serviceToMonth, v.serviceToYear),
      nccWorkingFromDate: toIso(v.nccWorkingFromDay, v.nccWorkingFromMonth, v.nccWorkingFromYear),
      nccWorkingToDate: toIso(v.nccWorkingToDay, v.nccWorkingToMonth, v.nccWorkingToYear),
      contractualFromDate: toIso(v.contractualFromDay, v.contractualFromMonth, v.contractualFromYear),
      contractualToDate: toIso(v.contractualToDay, v.contractualToMonth, v.contractualToYear),
      ageEligibility,
    };

    try {
      setIsSavingStep1(true);
      await applicationApi.saveStep1({ applicationId, ...payload });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to save personal details. Please try again.";
      setSubmitError(msg);
      notifyError(msg);
      return;
    } finally {
      setIsSavingStep1(false);
    }

    notifySuccess("Personal details saved successfully.");
    onSave(payload as unknown as PersonalData);
  };

  return (
    <div className="space-y-8">
      {submitError && (
        <div>
          <Note tone="danger">{submitError}</Note>
        </div>
      )}

      {/* ── BASIC INFORMATION ── */}
      <div>
        <SectionTitle icon={User}>Basic Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Name of applicant" hi="आवेदक का नाम" required error={errors.applicantName}>
            <input
              className={`gf-input ${errors.applicantName ? "gf-error" : ""}`}
              value={v.applicantName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("applicantName", e.target.value)}
              placeholder="Enter full name"
            />
          </Field>
          <Field label="Father's name" hi="पिता का नाम" required error={errors.fatherName}>
            <input
              className={`gf-input ${errors.fatherName ? "gf-error" : ""}`}
              value={v.fatherName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("fatherName", e.target.value)}
              placeholder="Enter father's name"
            />
          </Field>
          <Field label="Mother's name" hi="माता का नाम" required error={errors.motherName}>
            <input
              className={`gf-input ${errors.motherName ? "gf-error" : ""}`}
              value={v.motherName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("motherName", e.target.value)}
              placeholder="Enter mother's name"
            />
          </Field>
          <Field label="Gender" hi="लिंग" required error={errors.gender}>
            <PillGroup
              name="gender"
              value={v.gender || ""}
              onChange={(val) => setField("gender", val)}
              options={["MALE", "FEMALE", "TRANSGENDER"]}
            />
          </Field>

          <Field
            label="Date of birth"
            hi="जन्म तिथि"
            required
            error={errors.dateOfBirth}
          >
            <input
              type="date"
              className={`gf-input ${errors.dateOfBirth ? "gf-error" : ""}`}
              value={v.dateOfBirth || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("dateOfBirth", e.target.value)
              }
            />
          </Field>
          
          {/* Nationality - Updated to dropdown */}
          <Field label="Nationality" hi="राष्ट्रीयता" required>
            <select
              className="gf-select"
              value={v.nationality || "INDIAN"}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                setField("nationality", e.target.value);
                // Reset otherNationality if INDIAN is selected
                if (e.target.value === "INDIAN") {
                  setField("otherNationality", "");
                }
              }}
            >
              <option value="INDIAN">INDIAN</option>
              <option value="OTHER">Other</option>
            </select>
          </Field>
          
          {/* Show input field if "Other" is selected for nationality */}

          <Field label="Nationality" hi="राष्ट्रीयता" required>
            <SelectBox
              name="nationality"
              value={v.nationality || ""}
              onChange={handleNationalityChange}
              disabled={countriesLoading}
            >
              <option value="">{countriesLoading ? "Loading..." : "Select nationality"}</option>
              {countries.map((c) => (
                <option key={c.countryId} value={c.countryName}>
                  {c.countryName}
                </option>
              ))}
              <option value="OTHER">Other</option>
            </SelectBox>
          </Field>

          {v.nationality === "OTHER" && (
            <Field label="Other Nationality" hi="अन्य राष्ट्रीयता" required>
              <input
                className="gf-input"
                value={v.otherNationality || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField("otherNationality", e.target.value)
                }
                onChange={(e: ChangeEvent<HTMLInputElement>) => setField("otherNationality", e.target.value)}

                placeholder="Enter your nationality"
              />
            </Field>
          )}
          
          <Field
            label="Email ID"
            hi="ईमेल आईडी"
            required
            error={errors.emailId}
          >


          <Field label="Email ID" hi="ईमेल आईडी" required error={errors.emailId}>
            <input
              type="email"
              className={`gf-input ${errors.emailId ? "gf-error" : ""}`}
              value={v.emailId || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("emailId", e.target.value)}
              placeholder="email@example.com"
            />
          </Field>
        </div>
      </div>

      {/* New Section: Identification Marks */}
      <div>
        <SectionTitle icon={User}>Identification Marks · पहचान चिह्न</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Identification Mark 1 (English)"
            hi="पहचान चिह्न 1 (अंग्रेजी)"
          >
            <input
              className="gf-input"
              value={v.identificationMarkEn || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("identificationMarkEn", e.target.value)
              }
              placeholder="e.g. Mole on left cheek"
            />
          </Field>
          <Field
            label="Identification Mark 2 (English)"
            hi="पहचान चिह्न 2 (अंग्रेजी)"
          >
            <input
              className="gf-input"
              value={v.identificationMarkEn2 || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("identificationMarkEn2", e.target.value)
              }
              placeholder="e.g. Scar on right hand"
            />
          </Field>
          <Field
            label="Identification Mark 1 (Hindi)"
            hi="पहचान चिह्न 1 (हिंदी)"
          >
            <input
              className="gf-input"
              value={v.identificationMarkHi || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("identificationMarkHi", e.target.value)
              }
              placeholder="उदाहरण: बाएं गाल पर तिल"
            />
          </Field>
          <Field
            label="Identification Mark 2 (Hindi)"
            hi="पहचान चिह्न 2 (हिंदी)"
          >
            <input
              className="gf-input"
              value={v.identificationMarkHi2 || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("identificationMarkHi2", e.target.value)
              }
              placeholder="उदाहरण: दाहिने हाथ पर निशान"
            />
          </Field>
        </div>
      </div>

      {/* Marital Status Section */}
      <div>
        <SectionTitle icon={User}>Marital Status · वैवाहिक स्थिति</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Are you married?"
            hi="क्या आप विवाहित हैं?"
            required
            error={errors.isMarried}
          >
            <PillGroup
              name="isMarried"
              value={v.isMarried || ""}
              onChange={(val) => setField("isMarried", val)}
              options={YES_NO}
            />
          </Field>
          {v.isMarried === "YES" && (
            <Field
              label="Spouse's name"
              hi="पति/पत्नी का नाम"
              required={v.isMarried === "YES"}
              error={errors.spouseName}
            >
              <input
                className="gf-input"
                value={v.spouseName || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField("spouseName", e.target.value)
                }
                placeholder="Enter spouse's name"
              />
            </Field>
          )}
          <Field label="Mobile number" hi="मोबाइल नम्बर" required error={errors.mobileNo}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              className={`gf-input gf-mono ${errors.mobileNo ? "gf-error" : ""}`}
              value={v.mobileNo || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("mobileNo", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10 digit mobile number"
            />
          </Field>
          <Field label="Confirm mobile number" hi="मोबाइल नंबर की पुष्टि" required error={errors.confirmMobileNo}>
            <input
              type="text"
              inputMode="numeric"
              maxLength={10}
              className={`gf-input gf-mono ${errors.confirmMobileNo ? "gf-error" : ""}`}
              value={v.confirmMobileNo || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("confirmMobileNo", e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="Re-enter mobile number"
            />
          </Field>

          <div className="md:col-span-2">
            <DateSelect
              value={dateValue("dob")}
              onChange={(field: DatePart, val: string) => setDatePart("dob", field, val)}
              onBlur={() => touchDateTrio("dob")}
              errors={dateErrors("dob", errors.dobDay)}
              touched={dateTouched("dob")}
              required
              label="Date of birth"
              hi="जन्म तिथि"
              note="As recorded in your Matriculation / 10th standard or equivalent certificate."
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
          </div>
        </div>

        <div
          className="rounded-xl p-4 flex items-center justify-between mt-1"
          style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
        >
          <div>
            <div className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
              AGE AS ON 01-08-2025
            </div>
            <div className="text-[11px] font-medium" style={{ color: INK_SOFT }}>
              दिनांक 01-08-2025 को आयु
            </div>
          </div>
          <div className="gf-mono text-lg font-bold" style={{ color: INK }}>
            {formatDuration(age)}
          </div>
        </div>

        {ageEligibility && (
          <div
            className="rounded-xl p-4 mt-3 flex items-start gap-2.5"
            style={{
              background: ageEligibility.ok ? "#E8F3EF" : "#FBEAE6",
              border: `1px solid ${ageEligibility.ok ? TEAL : DANGER}`,
            }}
          >
            {ageEligibility.ok ? (
              <CheckCircle2 size={16} style={{ color: TEAL, marginTop: 2, flexShrink: 0 }} />
            ) : (
              <AlertCircle size={16} style={{ color: DANGER, marginTop: 2, flexShrink: 0 }} />
            )}
            <div>
              <div
                className="text-[11px] font-extrabold tracking-wide"
                style={{ color: ageEligibility.ok ? TEAL : DANGER }}
              >
                {ageEligibility.ok ? "AGE ELIGIBILITY: CRITERIA MET" : "AGE ELIGIBILITY: NOT MET"}
              </div>
              <div className="text-[11.5px] font-medium mt-0.5 leading-relaxed" style={{ color: INK_SOFT }}>
                {ageEligibility.message}
                {ageEligibility.effectiveMaxAge != null &&
                  ` Applicable maximum age: ${ageEligibility.effectiveMaxAge} years (as on 01-08-2025).`}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── IDENTIFICATION MARKS ── */}
      <div>
        <SectionTitle icon={User}>Identification Marks · पहचान चिह्न</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Identification Mark 1 (English)" hi="पहचान चिह्न 1 (अंग्रेजी)">
            <input
              className="gf-input"
              value={v.identificationMarkEn || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("identificationMarkEn", e.target.value)}
              placeholder="e.g. Mole on left cheek"
            />
          </Field>
          <Field label="Identification Mark 2 (English)" hi="पहचान चिह्न 2 (अंग्रेजी)">
            <input
              className="gf-input"
              value={v.identificationMarkEn2 || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("identificationMarkEn2", e.target.value)}
              placeholder="e.g. Scar on right hand"
            />
          </Field>
          <Field label="Identification Mark 1 (Hindi)" hi="पहचान चिह्न 1 (हिंदी)">
            <input
              className="gf-input"
              value={v.identificationMarkHi || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("identificationMarkHi", e.target.value)}
              placeholder="उदाहरण: बाएं गाल पर तिल"
            />
          </Field>
          <Field label="Identification Mark 2 (Hindi)" hi="पहचान चिह्न 2 (हिंदी)">
            <input
              className="gf-input"
              value={v.identificationMarkHi2 || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("identificationMarkHi2", e.target.value)}
              placeholder="उदाहरण: दाहिने हाथ पर निशान"
            />
          </Field>
        </div>
      </div>

      {/* ── MARITAL STATUS ── */}
      <div>
        <SectionTitle icon={User}>Marital Status · वैवाहिक स्थिति</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Are you married?" hi="क्या आप विवाहित हैं?" required error={errors.isMarried}>
            <PillGroup
              name="isMarried"
              value={v.isMarried || ""}
              onChange={(val) => setField("isMarried", val)}
              options={YES_NO}
            />
          </Field>
          {v.isMarried === "YES" && (
            <Field label="Spouse's name" hi="पति/पत्नी का नाम" required error={errors.spouseName}>
              <input
                className={`gf-input ${errors.spouseName ? "gf-error" : ""}`}
                value={v.spouseName || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setField("spouseName", e.target.value)}
                placeholder="Enter spouse's name"
              />
            </Field>
          )}
        </div>
      </div>

      {/* ── DOMICILE & CATEGORY ── */}
      <div>
        <SectionTitle icon={ShieldCheck}>Domicile &amp; Category / Reservation</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Domicile of Bihar state?" hi="बिहार राज्य का निवासी?" required error={errors.domicileOfBihar}>
            <PillGroup
              name="domicileOfBihar"
              value={v.domicileOfBihar || ""}
              onChange={(val) => setField("domicileOfBihar", val)}
              options={YES_NO}
            />
          </Field>

          <Field
            label="Category"
            hi="श्रेणी"
            required
            error={errors.category}
          >
            <SelectBox
              name="category"
              value={v.category || ""}
              onChange={handleCategoryChange}
              error={errors.category}
              disabled={categoriesLoading}
            >
              <option value="">{categoriesLoading ? "Loading..." : "Select category"}</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.label}>
                  {cat.label}
                </option>
              ))}
            </SelectBox>
          </Field>

          {v.domicileOfBihar === "YES" && (
            <div className="md:col-span-2">
              <DateSelect
                value={dateValue("domicileIssueDate")}
                onChange={(field: DatePart, val: string) => setDatePart("domicileIssueDate", field, val)}
                onBlur={() => touchDateTrio("domicileIssueDate")}
                errors={dateErrors("domicileIssueDate", errors.domicileIssueDateDay)}
                touched={dateTouched("domicileIssueDate")}
                required
                label="Domicile certificate — issue date"
                hi="निवास प्रमाणपत्र — जारी करने की तिथि"
                maxYear={new Date().getFullYear()}
                minYear={1900}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-1">
                <Field label="Domicile certificate no." hi="निवास प्रमाणपत्र संख्या">
                  <input
                    className="gf-input"
                    value={v.domicileCertNo || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("domicileCertNo", e.target.value)}
                    placeholder="Certificate number"
                  />
                </Field>
                <Field label="Issuing authority" hi="जारीकर्ता प्राधिकारी">
                  <input
                    className="gf-input"
                    value={v.domicileAuthority || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setField("domicileAuthority", e.target.value)}
                    placeholder="Issuing authority"
                  />
                </Field>
              </div>
            </div>
          )}

          <Field
            label="Caste"
            hi="जाति"
            required={subCategories.length > 0}
            error={errors.caste}
          >
            <SelectBox
              name="caste"
              value={v.caste || ""}
              onChange={handleCasteChange}
              error={errors.caste}
              disabled={!v.categoryId || subCategories.length === 0}
            >
              <option value="">
                {subCategories.length === 0 ? "No sub-categories available" : "Select caste"}
              </option>
              {subCategories.map((sub) => (
                <option key={sub.value} value={sub.label}>
                  {sub.label}
                </option>
              ))}
            </SelectBox>
          </Field>

          <Field
            label="Do you belong to non-creamy layer?"
            hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?"
            required
            error={errors.isNonCreamyLayer}
          >
            <PillGroup
              name="isNonCreamyLayer"
              value={v.isNonCreamyLayer || ""}
              onChange={(val) => setField("isNonCreamyLayer", val)}
              options={YES_NO}
              disabled={!showNonCreamy}
            />
          </Field>
        </div>

        {showCategoryDocs && (
          <div className="mt-2 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
            <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
              Category Certificate Details · श्रेणी प्रमाणपत्र विवरण
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Certificate number" hi="प्रमाणपत्र संख्या" required error={errors.categoryCertNo}>
                <input
                  className={`gf-input ${errors.categoryCertNo ? "gf-error" : ""}`}
                  value={v.categoryCertNo || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("categoryCertNo", e.target.value)}
                  placeholder="Enter certificate number"
                />
              </Field>
              <Field
                label="Issuing authority"
                hi="जारीकर्ता प्राधिकारी"
                required
                error={errors.categoryAuthority}
              >
                <div>
                  <SelectBox
                    name="categoryAuthority"
                    value={v.categoryAuthority || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("categoryAuthority", e.target.value)}
                    error={errors.categoryAuthority}
                  >
                    <option value="">Select authority</option>
                    {AUTHORITY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </SelectBox>
                  {v.categoryAuthority === "Other" && (
                    <input
                      className={`gf-input mt-2 ${errors.categoryAuthorityOther ? "gf-error" : ""}`}
                      value={v.categoryAuthorityOther || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField("categoryAuthorityOther", e.target.value)}
                      placeholder="Specify issuing authority"
                    />
                  )}
                </div>
              </Field>
              <div className="md:col-span-2">
                <DateSelect
                  value={dateValue("categoryIssueDate")}
                  onChange={(field: DatePart, val: string) => setDatePart("categoryIssueDate", field, val)}
                  onBlur={() => touchDateTrio("categoryIssueDate")}
                  errors={dateErrors("categoryIssueDate", errors.categoryIssueDateDay)}
                  touched={dateTouched("categoryIssueDate")}
                  required
                  label="Issue date"
                  hi="जारी करने की तिथि"
                  maxYear={new Date().getFullYear()}
                  minYear={1900}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {isBiharDomicile && (
      <div>
        <SectionTitle icon={ShieldCheck}>Special Categories</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Person with disability?" hi="दिव्यांगता वाले व्यक्ति?" required error={errors.disability}>
            <PillGroup
              name="disability"
              value={v.disability || ""}
              onChange={(val) => setField("disability", val)}
              options={YES_NO}
            />
          </Field>

          {isPwD && (
            <Field label="Type of disability" hi="दिव्यांगता का प्रकार" note={disabilitiesLoading ? "Loading disabilities..." : undefined}>
              <SelectBox
                name="natureOfDisability"
                value={v.natureOfDisability || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("natureOfDisability", e.target.value)}
                disabled={disabilitiesLoading}
              >
                <option value="">{disabilitiesLoading ? "Loading..." : "Select disability type"}</option>
                {disabilities.map((dis) => (
                  <option key={dis.id} value={dis.name}>{dis.name}</option>
                ))}
              </SelectBox>
            </Field>
          )}

          <Field
            label="Nature of disability?"
            hi="दिव्यांगता की प्रकृति"
            required={isPwD}
            error={errors.natureOfDisabilityType}
          >
            <PillGroup
              name="natureOfDisabilityType"
              value={v.natureOfDisabilityType || ""}
              onChange={(val) => setField("natureOfDisabilityType", val)}
              options={["PERMANENT", "TEMPORARY"]}
              disabled={!isPwD}
            />
          </Field>

          <Field
            label="Minimum 40% disability?"
            hi="न्यूनतम 40% दिव्यांगता?"
            required
            error={errors.isMin40PercentPwD}
          >
            <PillGroup
              name="disabilityPercent"
              value={v.disabilityPercent || ""}
              onChange={(val) => setField("disabilityPercent", val)}
              options={YES_NO_NA}
              disabled={!isPwD}
            />
          </Field>

          {isMin40PwD && (
            <Field label="Is scribe required?" hi="क्या लेखक (स्क्राइब) की आवश्यकता है?" required error={errors.isScribeRequired}>
              <PillGroup
                name="isScribeRequired"
                value={v.isScribeRequired || ""}
                onChange={(val) => setField("isScribeRequired", val)}
                options={YES_NO}
              />
            </Field>
          )}
        </div>

        {isPwD && (
          <div className="mt-2 p-4 rounded-xl" style={{ background: PAPER, border: `1px solid ${LINE}` }}>
            <div className="text-[13px] font-extrabold mb-3" style={{ color: OCHRE_DEEP }}>
              Disability Certificate Details · दिव्यांगता प्रमाणपत्र विवरण
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              <Field label="Certificate number" hi="प्रमाणपत्र संख्या" required error={errors.disabilityCertNo}>
                <input
                  className={`gf-input ${errors.disabilityCertNo ? "gf-error" : ""}`}
                  value={v.disabilityCertNo || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("disabilityCertNo", e.target.value)}
                  placeholder="Enter certificate number"
                />
              </Field>
              <Field label="Issuing authority" hi="जारीकर्ता प्राधिकारी" required error={errors.disabilityAuthority}>
                <div>
                  <SelectBox
                    name="disabilityAuthority"
                    value={v.disabilityAuthority || ""}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("disabilityAuthority", e.target.value)}
                    error={errors.disabilityAuthority}
                  >
                    <option value="">Select authority</option>
                    {AUTHORITY_OPTIONS.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </SelectBox>
                  {v.disabilityAuthority === "Other" && (
                    <input
                      className={`gf-input mt-2 ${errors.disabilityAuthorityOther ? "gf-error" : ""}`}
                      value={v.disabilityAuthorityOther || ""}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setField("disabilityAuthorityOther", e.target.value)}
                      placeholder="Specify issuing authority"
                    />
                  )}
                </div>
              </Field>
              <div className="md:col-span-2">
                <DateSelect
                  value={dateValue("disabilityIssueDate")}
                  onChange={(field: DatePart, val: string) => setDatePart("disabilityIssueDate", field, val)}
                  onBlur={() => touchDateTrio("disabilityIssueDate")}
                  errors={dateErrors("disabilityIssueDate", errors.disabilityIssueDateDay)}
                  touched={dateTouched("disabilityIssueDate")}
                  required
                  label="Issue date"
                  hi="जारी करने की तिथि"
                  maxYear={new Date().getFullYear()}
                  minYear={1900}
                />
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-5">
          <Field label="Ex-serviceman?" hi="भूतपूर्व सैनिक?" required error={errors.exServiceman}>
            <PillGroup
              name="exServiceman"
              value={v.exServiceman || ""}
              onChange={(val) => setField("exServiceman", val)}
              options={YES_NO}
            />
          </Field>

          {isExServiceman && (
            <Field
              label="Type of officer / ex-serviceman category"
              hi="अधिकारी / भूतपूर्व सैनिक की श्रेणी"
              required
              error={errors.officerType}
            >
              <SelectBox
                name="officerType"
                value={v.officerType || ""}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("officerType", e.target.value)}
                error={errors.officerType}
                disabled={exOfficerLoading}
              >
                <option value="">{exOfficerLoading ? "Loading..." : "Select category"}</option>
                {exOfficerTypes.map((opt) => (
                  <option key={opt.value} value={opt.label}>{opt.label}</option>
                ))}
              </SelectBox>
            </Field>
          )}

          <Field label="NCC full-time cadet / instructor?" hi="एनसीसी पूर्णकालिक कैडेट/अनुदेशक?" required error={errors.nccCadet}>
            <PillGroup
              name="nccCadet"
              value={v.nccCadet || ""}
              onChange={(val) => setField("nccCadet", val)}
              options={YES_NO}
            />
          </Field>
          {isNccCadet && (
            <Field label="NCC 'C' certificate no." hi="एनसीसी 'सी' प्रमाणपत्र संख्या">
              <input
                className="gf-input"
                value={v.nccCertificateNo || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setField("nccCertificateNo", e.target.value)}
              />
            </Field>
          )}
        </div>

        {isExServiceman && (
          <div className="mt-2">
            <DateSelect
              value={dateValue("serviceFrom")}
              onChange={(field: DatePart, val: string) => setDatePart("serviceFrom", field, val)}
              onBlur={() => touchDateTrio("serviceFrom")}
              errors={dateErrors("serviceFrom", errors.serviceFromDay)}
              touched={dateTouched("serviceFrom")}
              required
              label="Service in defence — from date"
              hi="रक्षा में सेवा — दिनांक से"
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
            <DateSelect
              value={dateValue("serviceTo")}
              onChange={(field: DatePart, val: string) => setDatePart("serviceTo", field, val)}
              onBlur={() => touchDateTrio("serviceTo")}
              errors={dateErrors("serviceTo", errors.serviceToDay)}
              touched={dateTouched("serviceTo")}
              required
              label="Service in defence — to date"
              hi="रक्षा में सेवा — दिनांक तक"
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
            {serviceDuration && (
              <div
                className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
              >
                <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
                  DURATION · अवधि
                </span>
                <span className="gf-mono text-sm font-bold" style={{ color: INK }}>
                  {formatDuration(serviceDuration)}
                </span>
              </div>
            )}
          </div>
        )}

        {isNccCadet && (
          <div className="mt-4">
            <DateSelect
              value={dateValue("nccWorkingFrom")}
              onChange={(field: DatePart, val: string) => setDatePart("nccWorkingFrom", field, val)}
              onBlur={() => touchDateTrio("nccWorkingFrom")}
              errors={dateErrors("nccWorkingFrom", errors.nccWorkingFromDay)}
              touched={dateTouched("nccWorkingFrom")}
              required
              label="NCC working period — from date"
              hi="एनसीसी कार्य अवधि — दिनांक से"
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
            <DateSelect
              value={dateValue("nccWorkingTo")}
              onChange={(field: DatePart, val: string) => setDatePart("nccWorkingTo", field, val)}
              onBlur={() => touchDateTrio("nccWorkingTo")}
              errors={dateErrors("nccWorkingTo", errors.nccWorkingToDay)}
              touched={dateTouched("nccWorkingTo")}
              required
              label="NCC working period — to date"
              hi="एनसीसी कार्य अवधि — दिनांक तक"
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
            {nccDuration && (
              <div
                className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
              >
                <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
                  DURATION · अवधि
                </span>
                <span className="gf-mono text-sm font-bold" style={{ color: INK }}>
                  {formatDuration(nccDuration)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-5">
          <Field label="Ward of freedom fighter?" hi="स्वतंत्रता सेनानी के वार्ड?" required error={errors.wardOfFreedomFighter}>
            <PillGroup
              name="wardOfFreedomFighter"
              value={v.wardOfFreedomFighter || ""}
              onChange={(val) => setField("wardOfFreedomFighter", val)}
              options={YES_NO}
            />
          </Field>
          {v.wardOfFreedomFighter === "YES" && (
            <CertNumberDateAuthority
              v={v}
              setField={setField}
              prefixNo="freedomFighterCertNo"
              prefixAuth="freedomFighterAuthority"
              labelNo="Certificate no."
              hiNo="प्रमाणपत्र संख्या"
              labelAuth="Issuing authority"
              hiAuth="जारीकर्ता प्राधिकारी"
            />
          )}
        </div>
      </div>
      )}

      {isBiharDomicile && (
      <div>
        <SectionTitle icon={Briefcase}>Employment Status</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Bihar govt. employee, 3+ years continuous service?"
            hi="बिहार सरकार के कर्मचारी, 3+ वर्ष सेवा?"
            required
            error={errors.biharGovtEmployee}
          >
            <PillGroup
              name="biharGovtEmployee"
              value={v.biharGovtEmployee || ""}
              onChange={(val) => setField("biharGovtEmployee", val)}
              options={YES_NO}
            />
          </Field>
          <Field label="Number of prior attempts (after 12-12-2022)" hi="पूर्व प्रयासों की संख्या" required error={errors.numberOfAttempts}>
            <SelectBox
              name="numberOfAttempts"
              value={v.numberOfAttempts || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("numberOfAttempts", e.target.value)}
              error={errors.numberOfAttempts}
            >
              <option value="">Select</option>
              <option value="0">0</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </SelectBox>
          </Field>
          <Field label="Contractual employee?" hi="संविदा कर्मी?" required error={errors.contractualEmployee}>
            <PillGroup
              name="contractualEmployee"
              value={v.contractualEmployee || ""}
              onChange={(val) => setField("contractualEmployee", val)}
              options={YES_NO}
            />
          </Field>
          {isContractual && (
            <>
              <Field label="Name of post" hi="पद का नाम" required error={errors.nameOfPost}>
                <input
                  className={`gf-input ${errors.nameOfPost ? "gf-error" : ""}`}
                  value={v.nameOfPost || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("nameOfPost", e.target.value)}
                />
              </Field>
              <Field label="Agreement under circular 1003?" hi="संकल्प 1003 के अनुसार एकरारनामा?">
                <PillGroup
                  name="agreementCircular"
                  value={v.agreementCircular || ""}
                  onChange={(val) => setField("agreementCircular", val)}
                  options={YES_NO_NA}
                />
              </Field>
              <Field label="Department name" hi="विभाग का नाम">
                <input
                  className="gf-input"
                  value={v.departmentName || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("departmentName", e.target.value)}
                />
              </Field>
              <Field label="Office order no." hi="कार्यालय आदेश संख्या">
                <input
                  className="gf-input"
                  value={v.officeOrderNo || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setField("officeOrderNo", e.target.value)}
                />
              </Field>
            </>
          )}
        </div>

        {isContractual && (
          <div className="mt-2">
            <div className="text-[12px] font-extrabold tracking-wide mb-2" style={{ color: INK }}>
              Contractual service period · संविदा सेवा अवधि
            </div>
            <DateSelect
              value={dateValue("contractualFrom")}
              onChange={(field: DatePart, val: string) => setDatePart("contractualFrom", field, val)}
              onBlur={() => touchDateTrio("contractualFrom")}
              errors={dateErrors("contractualFrom", errors.contractualFromDay)}
              touched={dateTouched("contractualFrom")}
              required
              label="From date"
              hi="दिनांक से"
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
            <DateSelect
              value={dateValue("contractualTo")}
              onChange={(field: DatePart, val: string) => setDatePart("contractualTo", field, val)}
              onBlur={() => touchDateTrio("contractualTo")}
              errors={dateErrors("contractualTo", errors.contractualToDay)}
              touched={dateTouched("contractualTo")}
              required
              label="To date"
              hi="दिनांक तक"
              maxYear={new Date().getFullYear()}
              minYear={1900}
            />
            {contractualDuration && (
              <div
                className="rounded-lg px-3 py-2 inline-flex items-center gap-2 mt-2"
                style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}
              >
                <span className="text-[11px] font-extrabold tracking-wide" style={{ color: OCHRE_DEEP }}>
                  DURATION · अवधि
                </span>
                <span className="gf-mono text-sm font-bold" style={{ color: INK }}>
                  {formatDuration(contractualDuration)}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="mt-5">
          <Field label="Debarred from any examination?" hi="किसी परीक्षा से वंचित?" required error={errors.isDebarred}>
            <PillGroup
              name="isDebarred"
              value={v.isDebarred || ""}
              onChange={(val) => setField("isDebarred", val)}
              options={YES_NO}
            />
          </Field>
        </div>
      </div>
      )}

      {/* ── ID PROOF ── */}
      <div>
        <SectionTitle icon={User}>ID Proof</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field label="Do you have an Aadhar card?" hi="क्या आपके पास आधार कार्ड है?" required error={errors.hasAadharCard}>
            <PillGroup
              name="hasAadharCard"
              value={v.hasAadharCard || ""}
              onChange={(val) => setField("hasAadharCard", val)}
              options={YES_NO}
            />
          </Field>
          {v.hasAadharCard === "YES" && (
            <Field label="Aadhar number" hi="आधार संख्या" error={errors.aadharCardNumber}>
              <input
                className={`gf-input gf-mono ${errors.aadharCardNumber ? "gf-error" : ""}`}
                maxLength={12}
                value={v.aadharCardNumber || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField("aadharCardNumber", e.target.value.replace(/\D/g, ""))
                }
                placeholder="12-digit Aadhar number"
              />
            </Field>
          )}
          <Field label="Type of photo ID proof" hi="फोटो पहचान प्रमाण का प्रकार">
            <select
              className="gf-select"
              value={v.typeOfPhotoIdProof || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setField("typeOfPhotoIdProof", e.target.value)}
            >
              <option value="">Select</option>
              <option value="AADHAR">Aadhar Card</option>
              <option value="PAN">PAN Card</option>
              <option value="VOTER_ID">Voter ID</option>
              <option value="PASSPORT">Passport</option>
              <option value="DRIVING_LICENSE">Driving License</option>
            </select>
          </Field>
          <Field label="ID proof number" hi="पहचान प्रमाण संख्या">
            <input
              className="gf-input"
              value={v.idProofNo || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setField("idProofNo", e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* ── ADDRESSES ── */}
      <div>
        <SectionTitle icon={User}>Permanent Address</SectionTitle>
        <AddressFields
          prefix="perm"
          v={v}
          setField={setField}
          errors={errors}
          states={states}
          statesLoading={statesLoading}
          districts={permDistricts}
          districtsLoading={permDistrictsLoading}
          onStateChange={handleStateChange("perm")}
          onDistrictChange={handleDistrictChange("perm")}
        />
      </div>

      <div>
        <SectionTitle icon={User}>Correspondence Address</SectionTitle>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={!!v.sameAsPermanent}
            onChange={(e: ChangeEvent<HTMLInputElement>) => toggleSame(e.target.checked)}
            className="w-4 h-4"
            style={{ accentColor: INK }}
          />
          <span className="text-[13px] font-semibold" style={{ color: INK }}>
            Same as permanent address · स्थायी पते के समान
          </span>
        </label>
        <AddressFields
          prefix="corr"
          v={v}
          setField={setField}
          errors={errors}
          disabled={!!v.sameAsPermanent}
          states={states}
          statesLoading={statesLoading}
          districts={v.sameAsPermanent ? permDistricts : corrDistricts}
          districtsLoading={v.sameAsPermanent ? permDistrictsLoading : corrDistrictsLoading}
          onStateChange={handleStateChange("corr")}
          onDistrictChange={handleDistrictChange("corr")}
        />
      </div>

<div className="flex justify-end pt-2">
  <button
    className="gf-btn-primary"
    disabled={isSavingStep1}
    onClick={handleSaveNext}
  >
    {isSavingStep1 ? (
      <>
        <Loader2 size={15} className="gf-spin" /> Saving…
      </>
    ) : (
      <>
        Save &amp; Next <ChevronRight size={15} />
      </>
    )}
  </button>
</div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 2 — PAYMENT
--------------------------------------------------------------- */
const Step2Payment: React.FC<Step2Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  const [v, setV] = useState<PaymentData>({ ...data });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingStep2, setIsSavingStep2] = useState(false);

  const [feePayment, setFeePayment] = useState<{
    applicationFee: string;
    transactionId: string;
    paymentStatus: "pending" | "completed";
    paymentDate: string;
  }>({
    applicationFee: "",
    transactionId: "",
    paymentStatus: "pending",
    paymentDate: "",
  });
  const [feeLoading, setFeeLoading] = useState(false);
  const [feeError, setFeeError] = useState("");

  useEffect(() => {
    const initializePaymentInfo = async () => {
      if (!applicationId) return;
      if (feePayment.paymentStatus === "completed") return;

      try {
        setFeeLoading(true);
        const response = await paymentApi.initiate(applicationId, "online");
        if (response.data?.success === true) {
          const orderData: any = response.data.data;
          setFeePayment((prev) => ({
            ...prev,
            applicationFee: orderData?.amount?.toString() || "0",
            transactionId: orderData?.paymentOrderId || prev.transactionId,
          }));
        }
      } catch (error: any) {
        if (
          error?.response?.data?.message ===
          "Payment has already been completed for this application"
        ) {
          setFeePayment((prev) => ({
            ...prev,
            paymentStatus: "completed",
            transactionId: "Already Completed",
            paymentDate: new Date().toISOString().split("T")[0],
          }));
        } else {
          setFeeError(
            error?.response?.data?.message || error?.message || "Error initializing payment info",
          );
        }
      } finally {
        setFeeLoading(false);
      }
    };

    initializePaymentInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const FEE_INFO = [
    { cat: "UR / EBC-I / BC-II — Male", fee: "₹540" },
    { cat: "SC / ST — Bihar Domicile", fee: "₹135" },
    { cat: "PwD — All Categories (Bihar)", fee: "₹135" },
    { cat: "Women — All Categories (Bihar)", fee: "₹135" },
    { cat: "Outside Bihar (Any Category)", fee: "₹540" },
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!v.paymentMode) e.paymentMode = "Please select a payment mode";
    if (!v.paymentAcknowledged)
      e.paymentAcknowledged = "You must acknowledge the fee terms";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      notifyError(Object.values(e)[0]);
    }
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-6">
      <SectionTitle icon={CreditCard}>Examination Fee</SectionTitle>

      <div
        className="rounded-xl overflow-hidden"
        style={{ border: `1px solid ${LINE}` }}
      >
        <div
          className="px-4 py-2.5 text-[11px] font-extrabold tracking-wide"
          style={{ background: INK, color: "#fff" }}
        >
          FEE STRUCTURE · शुल्क संरचना
        </div>
        <table className="w-full text-[12.5px]">
          <tbody>
            {FEE_INFO.map((r, i) => (
              <tr
                key={i}
                style={{ borderTop: i ? `1px solid ${LINE}` : "none" }}
              >
                <td
                  className="py-2.5 px-4 font-semibold"
                  style={{ color: INK }}
                >
                  {r.cat}
                </td>
                <td
                  className="py-2.5 px-4 text-right font-extrabold gf-mono"
                  style={{ color: OCHRE_DEEP }}
                >
                  {r.fee}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Note tone="danger">
        Fee is non-refundable. Payment gateway charges and service tax are borne
        by the candidate. · शुल्क अप्रतिदेय है।
      </Note>

      <div
        className="rounded-2xl p-6"
        style={{ background: CARD, border: `1.5px solid ${LINE}` }}
      >
        <div
          className="text-[12.5px] font-extrabold mb-2"
          style={{ color: INK }}
        >
          Your applicable fee · आपका लागू शुल्क
        </div>
        <div
          className="flex items-center gap-3 p-3 rounded-xl mb-6"
          style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
        >
          {feeLoading ? (
            <Loader2 size={18} className="gf-spin" style={{ color: TEAL }} />
          ) : (
            <CheckCircle2 size={18} style={{ color: TEAL }} />
          )}
          <div>
            <div
              className="gf-mono text-lg font-extrabold"
              style={{ color: TEAL }}
            >
              {feePayment.applicationFee ? `₹${feePayment.applicationFee}` : "₹135"}
            </div>
            <div
              className="text-[11.5px] font-semibold"
              style={{ color: INK_SOFT }}
            >
              {feePayment.paymentStatus === "completed"
                ? "Fee already paid for this application"
                : "EBC-I / Bihar Domicile Female — concession rate"}
            </div>
          </div>
        </div>
        {feeError && (
          <div className="mb-4">
            <Note tone="danger">{feeError}</Note>
          </div>
        )}

        <Field
          label="Select payment mode"
          hi="भुगतान का तरीका चुनें"
          required
          error={errors.paymentMode}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { v: "CREDIT_CARD", l: "Credit Card", hi: "क्रेडिट कार्ड" },
              { v: "DEBIT_CARD", l: "Debit Card", hi: "डेबिट कार्ड" },
              { v: "UPI", l: "UPI", hi: "यूपीआई" },
              { v: "NET_BANKING", l: "Net Banking", hi: "नेट बैंकिंग" },
            ].map((m) => (
              <label key={m.v} style={{ position: "relative" }}>
                <input
                  type="radio"
                  name="paymentMode"
                  className="gf-radio-input"
                  checked={v.paymentMode === m.v}
                  onChange={() => setV((p) => ({ ...p, paymentMode: m.v }))}
                />
                <span
                  className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 cursor-pointer text-center"
                  style={{
                    borderColor: v.paymentMode === m.v ? INK : LINE,
                    background: v.paymentMode === m.v ? "#EEF0F4" : "#fff",
                  }}
                >
                  <CreditCard
                    size={18}
                    style={{ color: v.paymentMode === m.v ? INK : INK_SOFT }}
                  />
                  <span
                    className="text-[11.5px] font-extrabold"
                    style={{ color: INK }}
                  >
                    {m.l}
                  </span>
                  <span
                    className="text-[10.5px] font-medium"
                    style={{ color: INK_SOFT }}
                  >
                    {m.hi}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </Field>

        <Note>
          You will be redirected to the BSSC official payment gateway. After
          successful payment, your status updates to "Fee Paid" and a receipt is
          generated. · आपको भुगतान गेटवे पर पुनर्निर्देशित किया जाएगा।
        </Note>

        <label className="flex items-start gap-3 cursor-pointer mt-5">
          <input
            type="checkbox"
            checked={!!v.paymentAcknowledged}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setV((p) => ({ ...p, paymentAcknowledged: e.target.checked }))
            }
            className="w-4 h-4 mt-0.5"
            style={{ accentColor: INK }}
          />
          <span
            className="text-[13px] font-semibold leading-relaxed"
            style={{ color: INK }}
          >
            I acknowledge the examination fee is non-refundable and
            non-transferable. · मैं स्वीकार करता/करती हूँ कि शुल्क अप्रतिदेय है।
          </span>
        </label>
        {errors.paymentAcknowledged && (
          <div
            className="flex items-center gap-1 mt-1.5 text-[11px] font-bold"
            style={{ color: DANGER }}
          >
            <AlertCircle size={11} /> {errors.paymentAcknowledged}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary"
          disabled={isSavingStep2}
          onClick={async () => {
            if (!validate()) return;
            try {
              setIsSavingStep2(true);
              await applicationApi.saveStep2({
                applicationId,
                ...v,
                transactionId: feePayment.transactionId,
                applicationFee: feePayment.applicationFee,
              });
            } catch (err: any) {
              const msg =
                err?.response?.data?.message || err?.message || "Failed to save payment details. Please try again.";
              setFeeError(msg);
              notifyError(msg);
              return;
            } finally {
              setIsSavingStep2(false);
            }
            notifySuccess("Payment details saved successfully.");
            onSave(v);
          }}
        >
          {isSavingStep2 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>
              Proceed to Pay <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 3 — EDUCATION
--------------------------------------------------------------- */
// Fields that must only ever contain numbers (marks / percentage).
// `percentage` allows a single decimal point, the marks fields are
// whole numbers only.
const NUMERIC_ONLY_FIELDS = ["totalMarks", "obtainedMarks", "percentage"];

const sanitizeNumericInput = (key: string, raw: string): string => {
  if (key === "percentage") {
    // keep digits and a single decimal point
    let cleaned = raw.replace(/[^0-9.]/g, "");
    const firstDot = cleaned.indexOf(".");
    if (firstDot !== -1) {
      cleaned =
        cleaned.slice(0, firstDot + 1) +
        cleaned.slice(firstDot + 1).replace(/\./g, "");
    }
    return cleaned;
  }
  // totalMarks / obtainedMarks — digits only
  return raw.replace(/[^0-9]/g, "");
};

const EDU_FIELDS: [string, string, string][] = [
  ["subject", "Subject", "विषय"],
  ["boardUniversity", "Board / University", "बोर्ड/विश्वविद्यालय"],
  ["totalMarks", "Total marks", "कुल अंक"],
  ["obtainedMarks", "Obtained marks", "प्राप्त अंक"],
  ["percentage", "Percentage", "प्रतिशत"],
  ["certNumber", "Certificate no.", "प्रमाणपत्र संख्या"],
];

const EducationBlock: React.FC<
  EducationBlockProps & {
    errors?: Record<string, string>;
    touched?: Record<string, boolean>;
    setDatePart: (prefix: string, part: "day" | "month" | "year", value: string) => void;
    onDateBlur: (prefix: string) => void;
  }
> = ({ title, hi, prefix, v, setNested, errors = {}, touched = {}, setDatePart, onDateBlur }) => {
  const section =
    (v[prefix as keyof EducationData] as EducationData["tenth"]) || {};

  const dateVal = {
    day: (section as any).certIssueDateDay || "",
    month: (section as any).certIssueDateMonth || "",
    year: (section as any).certIssueDateYear || "",
  };
  const dateTouchedVal = {
    day: !!touched.certIssueDateDay,
    month: !!touched.certIssueDateMonth,
    year: !!touched.certIssueDateYear,
  };
  const dateErrVal = {
    day: touched.certIssueDateDay ? errors.certIssueDateDay : "",
    month: touched.certIssueDateMonth ? errors.certIssueDateDay : "",
    year: touched.certIssueDateYear ? errors.certIssueDateDay : "",
  };

  const handleFieldChange = (key: string, rawValue: string) => {
    if (NUMERIC_ONLY_FIELDS.includes(key)) {
      const cleaned = sanitizeNumericInput(key, rawValue);
      // Let the person know (once per keystroke that strips something)
      // that only numbers are accepted here.
      if (cleaned !== rawValue) {
        notifyError(
          `${EDU_FIELDS.find(([k]) => k === key)?.[1] || "This field"} accepts numbers only.`,
        );
      }
      // Extra guardrails specific to each field, validated live as the
      // person types (not just on submit).
      if (key === "percentage" && cleaned !== "" && parseFloat(cleaned) > 100) {
        notifyError("Percentage cannot be greater than 100%.");
      }
      if (
        key === "obtainedMarks" &&
        cleaned !== "" &&
        section.totalMarks &&
        parseFloat(cleaned) > parseFloat(section.totalMarks as any)
      ) {
        notifyError("Obtained marks cannot be greater than total marks.");
      }
      setNested(prefix, key, cleaned);
      return;
    }
    setNested(prefix, key, rawValue);
  };

  return (
    <div>
      <SectionTitle icon={GraduationCap}>
        {title} · {hi}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {EDU_FIELDS.map(([key, label, hiLabel]) => {
          const isNumeric = NUMERIC_ONLY_FIELDS.includes(key);
          return (
            <Field key={key} label={label} hi={hiLabel} required error={errors[key]}>
              <input
                className={`gf-input ${errors[key] ? "gf-error" : ""}`}
                value={section[key] || ""}
                inputMode={isNumeric ? "decimal" : "text"}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange(key, e.target.value)
                }
                onKeyDown={
                  isNumeric
                    ? (ev: React.KeyboardEvent<HTMLInputElement>) => {
                        const allowedKeys = [
                          "Backspace", "Delete", "ArrowLeft", "ArrowRight",
                          "Tab", "Home", "End",
                        ];
                        if (allowedKeys.includes(ev.key)) return;
                        const isDigit = /^[0-9]$/.test(ev.key);
                        const isDot = ev.key === "." && key === "percentage";
                        if (!isDigit && !isDot) {
                          ev.preventDefault();
                          notifyError(
                            `${label} accepts numbers only.`,
                          );
                        }
                      }
                    : undefined
                }
                placeholder={label}
              />
            </Field>
          );
        })}
      </div>
      <div className="mt-1">
        <DateSelect
          value={dateVal}
          onChange={(field: "day" | "month" | "year", val: string) => setDatePart(prefix, field, val)}
          onBlur={() => onDateBlur(prefix)}
          errors={dateErrVal}
          touched={dateTouchedVal}
          required
          label="Certificate issue date"
          hi="जारी करने की तिथि"
          maxYear={new Date().getFullYear()}
          minYear={1900}
        />
      </div>
    </div>
  );
};

type EducationSectionKey = "tenth" | "twelfth" | "graduation";
const EDUCATION_SECTIONS: EducationSectionKey[] = ["tenth", "twelfth", "graduation"];

const Step3Education: React.FC<Step3Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  const [v, setV] = useState<EducationData>({
    tenth: {},
    twelfth: {},
    graduation: {},
    ...data,
  });
  const [errors, setErrors] = useState<Record<EducationSectionKey, Record<string, string>>>({
    tenth: {},
    twelfth: {},
    graduation: {},
  });
  const [touched, setTouched] = useState<Record<EducationSectionKey, Record<string, boolean>>>({
    tenth: {},
    twelfth: {},
    graduation: {},
  });
  const [isSavingStep3, setIsSavingStep3] = useState(false);
  const [step3Error, setStep3Error] = useState("");

  const setNested = (prefix: string, key: string, val: string) =>
    setV((p) => ({
      ...p,
      [prefix]: {
        ...(p[prefix as keyof EducationData] as EducationBlock),
        [key]: val,
      },
    }));

  const setDatePart = (prefix: string, part: "day" | "month" | "year", value: string) => {
    setV((p) => ({
      ...p,
      [prefix]: {
        ...(p[prefix as keyof EducationData] as any),
        [`certIssueDate${part[0].toUpperCase()}${part.slice(1)}`]: value,
      },
    }));
  };

  const touchDateTrio = (prefix: string) => {
    setTouched((p) => ({
      ...p,
      [prefix]: {
        ...p[prefix as EducationSectionKey],
        certIssueDateDay: true,
        certIssueDateMonth: true,
        certIssueDateYear: true,
      },
    }));
  };

  // ── Validation: required fields must be filled, obtained marks must
  //    not exceed total marks, percentage must be within 0–100, marks
  //    fields must be numeric, and a valid certificate issue date is
  //    required (captured via DateSelect).
  const validateSection = (prefix: EducationSectionKey) => {
    const section = (v[prefix] as any) || {};
    const e: Record<string, string> = {};

    EDU_FIELDS.forEach(([key, label]) => {
      if (!String(section[key] ?? "").trim()) {
        e[key] = `${label} is required`;
      }
    });

    const total = parseFloat(section.totalMarks);
    const obtained = parseFloat(section.obtainedMarks);
    const pct = parseFloat(section.percentage);

    if (section.totalMarks !== undefined && section.totalMarks !== "" && isNaN(total)) {
      e.totalMarks = "Total marks must be a number";
    }
    if (section.obtainedMarks !== undefined && section.obtainedMarks !== "" && isNaN(obtained)) {
      e.obtainedMarks = "Obtained marks must be a number";
    }
    if (section.percentage !== undefined && section.percentage !== "" && isNaN(pct)) {
      e.percentage = "Percentage must be a number";
    }

    if (
      section.totalMarks !== undefined &&
      section.totalMarks !== "" &&
      section.obtainedMarks !== undefined &&
      section.obtainedMarks !== "" &&
      !isNaN(total) &&
      !isNaN(obtained) &&
      obtained > total
    ) {
      e.obtainedMarks = "Obtained marks cannot be greater than total marks";
    }

    if (section.percentage !== undefined && section.percentage !== "" && !isNaN(pct)) {
      if (pct > 100) e.percentage = "Percentage cannot be greater than 100%";
      else if (pct < 0) e.percentage = "Percentage cannot be negative";
    }

    if (!isRealDate(section.certIssueDateDay, section.certIssueDateMonth, section.certIssueDateYear)) {
      e.certIssueDateDay = "Enter a valid certificate issue date";
    }

    return e;
  };

  const handleSaveNext = async () => {
    setStep3Error("");

    const newErrors = {
      tenth: validateSection("tenth"),
      twelfth: validateSection("twelfth"),
      graduation: validateSection("graduation"),
    };
    setErrors(newErrors);
    setTouched({
      tenth: { certIssueDateDay: true, certIssueDateMonth: true, certIssueDateYear: true },
      twelfth: { certIssueDateDay: true, certIssueDateMonth: true, certIssueDateYear: true },
      graduation: { certIssueDateDay: true, certIssueDateMonth: true, certIssueDateYear: true },
    });

    const hasError = EDUCATION_SECTIONS.some(
      (section) => Object.keys(newErrors[section]).length > 0,
    );
    if (hasError) {
      const firstSectionWithError = EDUCATION_SECTIONS.find(
        (section) => Object.keys(newErrors[section]).length > 0,
      );
      const firstMessage = firstSectionWithError
        ? Object.values(newErrors[firstSectionWithError])[0]
        : "Please fill all mandatory education fields correctly.";
      notifyError(firstMessage);
      return;
    }

    const buildSectionPayload = (section: EducationSectionKey) => {
      const s = (v[section] as any) || {};
      return {
        ...s,
        certIssueDate: toIso(s.certIssueDateDay, s.certIssueDateMonth, s.certIssueDateYear),
      };
    };

    const payload: EducationData = {
      ...v,
      tenth: buildSectionPayload("tenth"),
      twelfth: buildSectionPayload("twelfth"),
      graduation: buildSectionPayload("graduation"),
    };

    try {
      setIsSavingStep3(true);
      await applicationApi.saveStep3({ applicationId, ...payload });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || err?.message || "Failed to save education details. Please try again.";
      setStep3Error(msg);
      notifyError(msg);
      return;
    } finally {
      setIsSavingStep3(false);
    }
    notifySuccess("Education details saved successfully.");
    onSave(payload);
  };

  return (
    <div className="space-y-8">
      {step3Error && <Note tone="danger">{step3Error}</Note>}
      <EducationBlock
        title="10th / Equivalent"
        hi="10वीं / समकक्ष"
        prefix="tenth"
        v={v}
        setNested={setNested}
        errors={errors.tenth}
        touched={touched.tenth}
        setDatePart={setDatePart}
        onDateBlur={touchDateTrio}
      />
      <EducationBlock
        title="12th / Equivalent"
        hi="12वीं / समकक्ष"
        prefix="twelfth"
        v={v}
        setNested={setNested}
        errors={errors.twelfth}
        touched={touched.twelfth}
        setDatePart={setDatePart}
        onDateBlur={touchDateTrio}
      />
      <EducationBlock
        title="Graduation / Equivalent"
        hi="स्नातक / समकक्ष"
        prefix="graduation"
        v={v}
        setNested={setNested}
        errors={errors.graduation}
        touched={touched.graduation}
        setDatePart={setDatePart}
        onDateBlur={touchDateTrio}
      />
      <div className="flex justify-end pt-2">
        <button className="gf-btn-primary" disabled={isSavingStep3} onClick={handleSaveNext}>
          {isSavingStep3 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>
              Save &amp; Next <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 4 — PHOTO UPLOAD (BINARY FORMAT)
--------------------------------------------------------------- */
const Step4PhotoUpload: React.FC<Step4Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  // Store base64 for preview
  const [v, setV] = useState<PhotoData>({ ...data });
  // Store actual File objects for upload
  const [fileObjects, setFileObjects] = useState<Record<string, File>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingStep4, setIsSavingStep4] = useState(false);
  const [step4ApiError, setStep4ApiError] = useState("");

  // Updated uploads configuration with new field names
  const uploads: UploadField[] = [
    {
      field: "photograph", // Changed from "passportPhoto"
      label: "Passport size recent photograph",
      hi: "पासपोर्ट साइज हालिया फोटो",
      spec: "PNG, JPG · 20–50KB · 200×230px · within 1 month",
      maxKB: 50,
      height: 150,
    },
    {
      field: "signatureEnglish", // Changed from "signatureEn"
      label: "English signature",
      hi: "अंग्रेजी हस्ताक्षर",
      spec: "PNG, JPG · 10–20KB · 200×60px",
      maxKB: 20,
      height: 74,
    },
    {
      field: "signatureHindi", // Changed from "signatureHi"
      label: "Hindi signature",
      hi: "हिंदी हस्ताक्षर",
      spec: "PNG, JPG · 10–20KB · 200×60px",
      maxKB: 20,
      height: 74,
    },
  ];

  // Helper function to validate image type
  const isValidImageType = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    return validTypes.includes(file.type);
  };

  const handleFile = (field: keyof PhotoData, file: File, maxKB: number) => {
    // Validate file size
    if (file.size > maxKB * 1024) {
      const msg = `File must be under ${maxKB}KB`;
      setErrors((p) => ({ ...p, [field]: msg }));
      notifyError(msg);
      return;
    }
    
    // Validate file type (PNG, JPG, JPEG)
    if (!isValidImageType(file)) {
      const msg = "Only PNG, JPG, and JPEG images are allowed";
      setErrors((p) => ({ 
        ...p, 
        [field]: msg
      }));
      notifyError(msg);
      return;
    }
    
    setErrors((p) => ({ ...p, [field]: "" }));
    
    // Store the actual File object for binary upload
    setFileObjects((prev) => ({ ...prev, [field]: file }));
    
    // Generate base64 preview for UI display
    const reader = new FileReader();
    reader.onload = (e) => {
      setV((p) => ({ ...p, [field]: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleNext = async () => {
    // Validate all required fields are uploaded
    const e: Record<string, string> = {};
    uploads.forEach((u) => {
      if (!v[u.field as keyof PhotoData]) {
        e[u.field] = "This upload is required";
      }
    });
    setErrors((p) => ({ ...p, ...e }));
    
    // Check if any validation errors exist
    if (Object.values(e).some((error) => error)) {
      notifyError(Object.values(e)[0]);
      return;
    }

    // Check if all files are ready for upload
    const missingFiles = uploads.filter(
      (u) => !fileObjects[u.field as keyof PhotoData]
    );
    if (missingFiles.length > 0) {
      setStep4ApiError("Please upload all required files before saving.");
      notifyError("Please upload all required files before saving.");
      return;
    }

    setStep4ApiError("");
    try {
      setIsSavingStep4(true);
      
      // Create FormData for binary upload
      const formData = new FormData();
      
      // Add applicationId if provided
      if (applicationId) {
        formData.append('applicationId', applicationId);
      }
      
      // Append all files as binary data using the new key names
      uploads.forEach((u) => {
        const field = u.field as keyof PhotoData;
        const file = fileObjects[field];
        if (file) {
          // Use the field name as the key (photograph, signatureEnglish, signatureHindi)
          formData.append(field, file, file.name);
        }
      });
      
      // Send the FormData to the API
      await applicationApi.saveStep4(formData);
      
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to save uploads. Please try again.";
      setStep4ApiError(msg);
      notifyError(msg);
      setIsSavingStep4(false);
      return;
    } finally {
      setIsSavingStep4(false);
    }
    
    notifySuccess("Photos and signatures saved successfully.");
    // Save the base64 data for preview in the parent component
    onSave(v);
  };

  return (
    <div className="space-y-6">
      <SectionTitle icon={Upload}>Photo &amp; Signature Upload</SectionTitle>
      <Note>
        Photograph must be recent, light background. Signatures on white paper,
        black/blue ink, scanned clearly. Supported formats: PNG, JPG, JPEG.
      </Note>
      {step4ApiError && <Note tone="danger">{step4ApiError}</Note>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {uploads.map((u) => (
          <div
            key={u.field}
            className="rounded-2xl p-4 space-y-3"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div>
              <div
                className="text-[11px] font-extrabold uppercase leading-tight"
                style={{ color: OCHRE_DEEP }}
              >
                * {u.label}
              </div>
              <div
                className="text-[11px] font-medium"
                style={{ color: INK_SOFT }}
              >
                {u.hi}
              </div>
              <div
                className="text-[10.5px] font-medium mt-1"
                style={{ color: INK_SOFT }}
              >
                {u.spec}
              </div>
              {fileObjects[u.field as keyof PhotoData] && (
                <div
                  className="text-[10.5px] font-medium mt-1"
                  style={{ color: TEAL }}
                >
                  Size: {(fileObjects[u.field as keyof PhotoData].size / 1024).toFixed(1)} KB • 
                  Type: {fileObjects[u.field as keyof PhotoData].type.toUpperCase()}
                </div>
              )}
            </div>
            
            <div
              className="rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                height: u.height,
                background: "#F6F7F9",
                border: `1.5px dashed ${errors[u.field] ? DANGER : LINE}`,
              }}
            >
              {v[u.field as keyof PhotoData] ? (
                <img
                  src={v[u.field as keyof PhotoData]}
                  alt={u.label}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-center p-2">
                  <Upload
                    size={18}
                    style={{ color: INK_SOFT }}
                    className="mx-auto mb-1"
                  />
                  <div
                    className="text-[11px] font-semibold"
                    style={{ color: INK_SOFT }}
                  >
                    No file chosen
                  </div>
                </div>
              )}
            </div>
            
            <label className="gf-btn-secondary w-full text-[11.5px] py-2 cursor-pointer">
              <Upload size={13} /> Choose file
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    handleFile(u.field as keyof PhotoData, f, u.maxKB);
                    // Reset the input so the same file can be re-selected
                    e.target.value = '';
                  }
                }}
              />
            </label>
            
            {errors[u.field] && (
              <div
                className="flex items-center gap-1 text-[11px] font-bold"
                style={{ color: DANGER }}
              >
                <AlertCircle size={11} /> {errors[u.field]}
              </div>
            )}
            
            {v[u.field as keyof PhotoData] && !errors[u.field] && (
              <div
                className="flex items-center gap-1 text-[11px] font-bold"
                style={{ color: TEAL }}
              >
                <CheckCircle2 size={11} /> Uploaded
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <button 
          className="gf-btn-primary" 
          disabled={isSavingStep4} 
          onClick={handleNext}
        >
          {isSavingStep4 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>
              Save &amp; Next <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
/* ---------------------------------------------------------------
   STEP 5 — LIVE PHOTO (Using react-webcam)
--------------------------------------------------------------- */
<<<<<<< HEAD
const Step5LivePhoto: React.FC<Step5Props> = ({ data, onSave }) => {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string>(data.livePhoto || "");
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [camError, setCamError] = useState<string>("");

=======
// const Step5LivePhoto: React.FC<Step5Props & { applicationId?: string }> = ({
//   data,
//   onSave,
//   applicationId,
// }) => {
//   const webcamRef = useRef<Webcam>(null);
//   const [captured, setCaptured] = useState<string>(data.livePhoto || "");
//   const [cameraReady, setCameraReady] = useState<boolean>(false);
//   const [camError, setCamError] = useState<string>("");
//   const [isSavingStep5, setIsSavingStep5] = useState(false);

//   const videoConstraints = {
//     width: 640,
//     height: 480,
//     facingMode: "user",
//   };

//   const capture = useCallback(() => {
//     if (!webcamRef.current) {
//       setCamError("Camera not available. Please try again.");
//       notifyError("Camera not available. Please try again.");
//       return;
//     }

//     const imageSrc = webcamRef.current.getScreenshot();

//     if (imageSrc) {
//       setCaptured(imageSrc);
//       setCamError("");
//     } else {
//       setCamError("Failed to capture photo. Please try again.");
//       notifyError("Failed to capture photo. Please try again.");
//     }
//   }, []);

//   const retake = () => {
//     setCaptured("");
//     setCameraReady(false);
//     setCamError("");
//   };

//   useEffect(() => {
//     return () => {
//       const stream = webcamRef.current?.video?.srcObject;
//       if (stream instanceof MediaStream) {
//         stream.getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);

//   const handleNext = async () => {
//     if (!captured) {
//       const msg =
//         "Please capture your live photo before proceeding. · कृपया लाइव फोटो कैप्चर करें।";
//       setCamError(msg);
//       notifyError(msg);
//       return;
//     }

//     setCamError("");
//     try {
//       setIsSavingStep5(true);
//       // NOTE: sending the captured data URL as the "live photo upload
//       // link" the backend expects — swap for a real uploaded file URL
//       // here if/when a separate file-upload endpoint is wired in.
//       await applicationApi.saveStep5({ applicationId, livePhoto: captured });
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message || err?.message || "Failed to save live photo. Please try again.";
//       setCamError(msg);
//       notifyError(msg);
//       return;
//     } finally {
//       setIsSavingStep5(false);
//     }
//     notifySuccess("Live photo saved successfully.");
//     onSave({ livePhoto: captured });
//   };

//   return (
//     <div className="space-y-6">
//       <SectionTitle icon={Camera}>Live Photo Capture</SectionTitle>
//       <Note tone="danger">
//         Mandatory — a live photo must be captured via webcam before submission.
//         It is re-verified at admit-card download. Ensure good lighting, remove
//         glasses/caps.
//       </Note>

//       <div className="flex flex-col items-center gap-5">
//         <div
//           className="relative rounded-2xl overflow-hidden flex items-center justify-center w-full max-w-[420px]"
//           style={{
//             aspectRatio: "4 / 3",
//             background: "#0E1826",
//             border: `2px solid ${LINE}`,
//           }}
//         >
//           {captured ? (
//             <img
//               src={captured}
//               alt="Captured"
//               className="w-full h-full object-cover"
//             />
//           ) : (
//             <Webcam
//               ref={webcamRef}
//               mirrored
//               audio={false}
//               screenshotFormat="image/jpeg"
//               videoConstraints={videoConstraints}
//               onUserMedia={() => setCameraReady(true)}
//               onUserMediaError={() => {
//                 const msg =
//                   "Unable to access the camera. Please allow camera permission and try again. · कैमरा एक्सेस अस्वीकृत।";
//                 setCamError(msg);
//                 notifyError(msg);
//               }}
//               className="w-full h-full object-cover"
//             />
//           )}
//           {captured && (
//             <div
//               className="absolute top-2 right-2 rounded-full p-1"
//               style={{ background: TEAL }}
//             >
//               <CheckCircle2 size={15} color="#fff" />
//             </div>
//           )}
//         </div>

//         {camError && (
//           <div className="max-w-sm w-full">
//             <Note tone="danger">{camError}</Note>
//           </div>
//         )}

//         <div className="flex gap-3 flex-wrap justify-center">
//           {!captured && (
//             <button
//               onClick={capture}
//               className="gf-btn-primary"
//               disabled={!cameraReady}
//             >
//               <Camera size={15} /> Capture Photo
//             </button>
//           )}
//           {captured && (
//             <button onClick={retake} className="gf-btn-secondary">
//               <RotateCcw size={15} /> Retake
//             </button>
//           )}
//         </div>

//         {!cameraReady && !captured && !camError && (
//           <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}>
//             <Loader2 size={15} className="gf-spin" style={{ color: OCHRE_DEEP }} />
//             <span className="text-[12.5px] font-bold" style={{ color: OCHRE_DEEP }}>
//               Initializing camera... · कैमरा प्रारंभ हो रहा है...
//             </span>
//           </div>
//         )}

//         {captured && (
//           <div
//             className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
//             style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
//           >
//             <CheckCircle2 size={15} style={{ color: TEAL }} />
//             <span className="text-[12.5px] font-bold" style={{ color: TEAL }}>
//               Live photo captured successfully! · लाइव फोटो सफलतापूर्वक कैप्चर हुआ!
//             </span>
//           </div>
//         )}
//       </div>

//       <div className="flex justify-end pt-2">
//         <button
//           className="gf-btn-primary"
//           disabled={!captured || isSavingStep5}
//           onClick={handleNext}
//         >
//           {isSavingStep5 ? (
//             <>
//               <Loader2 size={15} className="gf-spin" /> Saving…
//             </>
//           ) : (
//             <>
//               Save &amp; Next <ChevronRight size={15} />
//             </>
//           )}
//         </button>
//       </div>
//     </div>
//   );
// };

/* ---------------------------------------------------------------
   STEP 5 — LIVE PHOTO (BINARY FORMAT)
--------------------------------------------------------------- */
const Step5LivePhoto: React.FC<Step5Props & { applicationId?: string }> = ({
  data,
  onSave,
  applicationId,
}) => {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string>(data.livePhoto || "");
  const [capturedFile, setCapturedFile] = useState<File | null>(null);
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [camError, setCamError] = useState<string>("");
  const [isSavingStep5, setIsSavingStep5] = useState(false);

>>>>>>> dev
  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

<<<<<<< HEAD
  const capture = useCallback(() => {
    if (!webcamRef.current) {
      setCamError("Camera not available. Please try again.");
=======
  // Helper function to convert data URL to File
  const dataURLtoFile = (dataURL: string, filename: string): File => {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      const msg = "Camera not available. Please try again.";
      setCamError(msg);
      notifyError(msg);
>>>>>>> dev
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
<<<<<<< HEAD
    
    if (imageSrc) {
      setCaptured(imageSrc);
      setCamError("");
    } else {
      setCamError("Failed to capture photo. Please try again.");
=======

    if (imageSrc) {
      // Store base64 for preview (UI display)
      setCaptured(imageSrc);
      
      // Convert to File object for binary upload
      const file = dataURLtoFile(imageSrc, `live_photo_${Date.now()}.jpg`);
      setCapturedFile(file);
      
      setCamError("");
    } else {
      const msg = "Failed to capture photo. Please try again.";
      setCamError(msg);
      notifyError(msg);
>>>>>>> dev
    }
  }, []);

  const retake = () => {
    setCaptured("");
<<<<<<< HEAD
=======
    setCapturedFile(null);
>>>>>>> dev
    setCameraReady(false);
    setCamError("");
  };

<<<<<<< HEAD
  // Clean up camera on unmount
=======
>>>>>>> dev
  useEffect(() => {
    return () => {
      const stream = webcamRef.current?.video?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleNext = async () => {
    if (!captured || !capturedFile) {
      const msg = "Please capture your live photo before proceeding. · कृपया लाइव फोटो कैप्चर करें।";
      setCamError(msg);
      notifyError(msg);
      return;
    }

    setCamError("");
    try {
      setIsSavingStep5(true);
      
      // Create FormData for binary upload
      const formData = new FormData();
      
      // Add applicationId if provided
      if (applicationId) {
        formData.append('applicationId', applicationId);
      }
      
      // Append the live photo as binary file
      // Use 'livePhoto' as the field name (or whatever your backend expects)
      formData.append('livePhoto', capturedFile, capturedFile.name);
      
      // Send the FormData to the API
      await applicationApi.saveStep5(formData);
      
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to save live photo. Please try again.";
      setCamError(msg);
      notifyError(msg);
      setIsSavingStep5(false);
      return;
    } finally {
      setIsSavingStep5(false);
    }
    
    notifySuccess("Live photo saved successfully.");
    // Save the base64 data for preview in the parent component
    onSave({ livePhoto: captured });
  };

  return (
    <div className="space-y-6">
      <SectionTitle icon={Camera}>Live Photo Capture</SectionTitle>
      <Note tone="danger">
        Mandatory — a live photo must be captured via webcam before submission.
        It is re-verified at admit-card download. Ensure good lighting, remove
        glasses/caps.
      </Note>

      <div className="flex flex-col items-center gap-5">
        <div
          className="relative rounded-2xl overflow-hidden flex items-center justify-center w-full max-w-[420px]"
          style={{
<<<<<<< HEAD
            width: 420,
            height: 315,
=======
            aspectRatio: "4 / 3",
>>>>>>> dev
            background: "#0E1826",
            border: `2px solid ${LINE}`,
          }}
        >
          {captured ? (
            <img
              src={captured}
              alt="Captured"
              className="w-full h-full object-cover"
            />
          ) : (
            <Webcam
              ref={webcamRef}
              mirrored
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              onUserMedia={() => setCameraReady(true)}
              onUserMediaError={() => {
<<<<<<< HEAD
                setCamError(
                  "Unable to access the camera. Please allow camera permission and try again. · कैमरा एक्सेस अस्वीकृत।",
                );
=======
                const msg = "Unable to access the camera. Please allow camera permission and try again. · कैमरा एक्सेस अस्वीकृत।";
                setCamError(msg);
                notifyError(msg);
>>>>>>> dev
              }}
              className="w-full h-full object-cover"
            />
          )}
          {captured && (
            <div
              className="absolute top-2 right-2 rounded-full p-1"
              style={{ background: TEAL }}
            >
              <CheckCircle2 size={15} color="#fff" />
            </div>
          )}
        </div>

        {camError && (
          <div className="max-w-sm w-full">
            <Note tone="danger">{camError}</Note>
          </div>
        )}

        <div className="flex gap-3 flex-wrap justify-center">
          {!captured && (
<<<<<<< HEAD
            <button 
              onClick={capture} 
=======
            <button
              onClick={capture}
>>>>>>> dev
              className="gf-btn-primary"
              disabled={!cameraReady}
            >
              <Camera size={15} /> Capture Photo
            </button>
          )}
          {captured && (
            <button onClick={retake} className="gf-btn-secondary">
              <RotateCcw size={15} /> Retake
            </button>
          )}
        </div>

        {!cameraReady && !captured && !camError && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl" style={{ background: "#FAF6EF", border: "1px solid #ECD9BE" }}>
            <Loader2 size={15} className="gf-spin" style={{ color: OCHRE_DEEP }} />
            <span className="text-[12.5px] font-bold" style={{ color: OCHRE_DEEP }}>
              Initializing camera... · कैमरा प्रारंभ हो रहा है...
            </span>
          </div>
        )}

<<<<<<< HEAD
        {captured && (
=======
        {captured && capturedFile && (
>>>>>>> dev
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
          >
            <CheckCircle2 size={15} style={{ color: TEAL }} />
            <span className="text-[12.5px] font-bold" style={{ color: TEAL }}>
              Live photo captured successfully! · लाइव फोटो सफलतापूर्वक कैप्चर हुआ!
<<<<<<< HEAD
=======
              <span className="text-[10px] font-normal ml-2" style={{ color: INK_SOFT }}>
                ({(capturedFile.size / 1024).toFixed(1)} KB)
              </span>
>>>>>>> dev
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary"
          disabled={!captured || isSavingStep5}
          onClick={handleNext}
        >
          {isSavingStep5 ? (
            <>
              <Loader2 size={15} className="gf-spin" /> Saving…
            </>
          ) : (
            <>
              Save &amp; Next <ChevronRight size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 6 — REVIEW & SUBMIT
--------------------------------------------------------------- */
interface ReviewRowProps {
  label: string;
<<<<<<< HEAD
  value?: string | number;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value }) =>
  value ? (
=======
  hi?: string;
  value?: string | number;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, hi, value }) =>
  value !== undefined && value !== null && String(value).trim() !== "" ? (
>>>>>>> dev
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 py-1.5"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="text-[11px] font-semibold sm:w-56 shrink-0"
        style={{ color: INK_SOFT }}
      >
        {label}
        {hi && <span className="block text-[10px] font-medium">{hi}</span>}
      </span>
      <span className="text-[12px] font-bold" style={{ color: INK }}>
        {String(value)}
      </span>
    </div>
  ) : null;

interface ReviewSectionProps {
  title: string;
  step: number;
  onEdit: (step: number) => void;
  children: React.ReactNode;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({
  title,
  step,
  onEdit,
  children,
}) => (
  <div
    className="rounded-2xl overflow-hidden"
    style={{ background: CARD, border: `1.5px solid ${LINE}` }}
  >
    <div
      className="px-5 py-3 flex items-center justify-between"
      style={{ background: INK }}
    >
      <span className="text-[12px] font-extrabold tracking-wide text-white">
        {title}
      </span>
      <button
        onClick={() => onEdit(step)}
        className="flex items-center gap-1 text-[11px] font-bold"
        style={{ color: "#C9D3E0" }}
      >
        <Eye size={12} /> Edit
      </button>
    </div>
    <div className="p-5">{children}</div>
  </div>
);

const Step6Review: React.FC<Step6Props & { applicationId?: string }> = ({
  formData,
  onSubmit,
  onEdit,
  applicationId,
}) => {
  const [declared, setDeclared] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);
  const p: any = formData.personal || {};
  const e = formData.education || {};
  const ph: any = formData.photos || {};
  const lp: any = formData.livePhoto || {};

  const handleSubmit = async () => {
    if (!declared) {
      const msg =
        "You must accept the declaration to submit. · घोषणा स्वीकार करनी होगी।";
      setErr(msg);
      notifyError(msg);
      return;
    }

    if (!applicationId) {
      const msg = "Application not found. Please refresh and try again.";
      setErr(msg);
      notifyError(msg);
      return;
    }

    setErr("");
    try {
      setIsSubmittingFinal(true);
      await applicationApi.submitApplicationFinal(applicationId);
    } catch (apiErr: any) {
      const msg =
        apiErr?.response?.data?.message || apiErr?.message || "Failed to submit application. Please try again.";
      setErr(msg);
      notifyError(msg);
      return;
    } finally {
      setIsSubmittingFinal(false);
    }
    notifySuccess("Application submitted successfully.");
    onSubmit();
  };

  // Human-readable labels for select-driven fields so review shows the
  // same wording the person chose on Step 1, rather than a raw code.
  const isBiharDomicile = p.domicileOfBihar === "YES";
  const isPwD = isBiharDomicile && p.disability === "YES";
  const isMin40PwD = isPwD && p.disabilityPercent === "YES";
  const isExServiceman = isBiharDomicile && p.exServiceman === "YES";
  const isNccCadet = isBiharDomicile && p.nccCadet === "YES";
  const isContractual = isBiharDomicile && p.contractualEmployee === "YES";

  return (
    <div className="space-y-5">
      <SectionTitle icon={ClipboardCheck}>Review Your Application</SectionTitle>
      <Note>
        Please review all details carefully. Once submitted, Name, Mobile
        Number, and Email ID cannot be changed.
      </Note>

      {/* ── STEP 1 · BASIC INFORMATION ── */}
      <ReviewSection title="STEP 1 · PERSONAL DETAILS" step={1} onEdit={onEdit}>
        <div className="text-[11px] font-extrabold mb-2" style={{ color: OCHRE_DEEP }}>
          Basic Information
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
<<<<<<< HEAD
            <ReviewRow label="Name" value={p.applicantName} />
            <ReviewRow label="Father's name" value={p.fatherName} />
            <ReviewRow label="Mother's name" value={p.motherName} />
            <ReviewRow label="Gender" value={p.gender} />
            <ReviewRow label="Date of birth" value={p.dateOfBirth} />
            <ReviewRow label="Category" value={p.category} />
            <ReviewRow label="Caste" value={p.caste} />
            <ReviewRow label="Married" value={p.isMarried} />
            {p.isMarried === "YES" && (
              <ReviewRow label="Spouse's name" value={p.spouseName} />
            )}
          </div>
          <div>
            <ReviewRow label="Email" value={p.emailId} />
            <ReviewRow label="Nationality" value={p.nationality === "OTHER" ? p.otherNationality : p.nationality} />
            <ReviewRow label="Identification Mark 1 (EN)" value={p.identificationMarkEn} />
            <ReviewRow label="Identification Mark 2 (EN)" value={p.identificationMarkEn2} />
            <ReviewRow label="Identification Mark 1 (HI)" value={p.identificationMarkHi} />
            <ReviewRow label="Identification Mark 2 (HI)" value={p.identificationMarkHi2} />
            <ReviewRow label="Bihar domicile" value={p.domicileOfBihar} />
            <ReviewRow label="Disability" value={p.disability} />
            <ReviewRow label="Ex-serviceman" value={p.exServiceman} />
=======
            <ReviewRow label="Name of applicant" hi="आवेदक का नाम" value={p.applicantName || p.fullName} />
            <ReviewRow label="Father's name" hi="पिता का नाम" value={p.fatherName} />
            <ReviewRow label="Mother's name" hi="माता का नाम" value={p.motherName} />
            <ReviewRow label="Gender" hi="लिंग" value={p.gender} />
            <ReviewRow label="Nationality" hi="राष्ट्रीयता" value={p.nationality === "OTHER" ? p.otherNationality : p.nationality} />
            <ReviewRow label="Email ID" hi="ईमेल आईडी" value={p.emailId} />
          </div>
          <div>
            <ReviewRow label="Mobile number" hi="मोबाइल नम्बर" value={p.mobileNo} />
            <ReviewRow label="Confirm mobile number" hi="मोबाइल नंबर की पुष्टि" value={p.confirmMobileNo} />
            <ReviewRow label="Date of birth" hi="जन्म तिथि" value={p.dateOfBirth} />
          </div>
        </div>

        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Identification Marks · पहचान चिह्न
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <ReviewRow label="Identification Mark 1 (English)" hi="पहचान चिह्न 1 (अंग्रेजी)" value={p.identificationMarkEn} />
            <ReviewRow label="Identification Mark 2 (English)" hi="पहचान चिह्न 2 (अंग्रेजी)" value={p.identificationMarkEn2} />
          </div>
          <div>
            <ReviewRow label="Identification Mark 1 (Hindi)" hi="पहचान चिह्न 1 (हिंदी)" value={p.identificationMarkHi} />
            <ReviewRow label="Identification Mark 2 (Hindi)" hi="पहचान चिह्न 2 (हिंदी)" value={p.identificationMarkHi2} />
          </div>
        </div>

        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Marital Status · वैवाहिक स्थिति
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <ReviewRow label="Are you married?" hi="क्या आप विवाहित हैं?" value={p.isMarried} />
            {p.isMarried === "YES" && (
              <ReviewRow label="Spouse's name" hi="पति/पत्नी का नाम" value={p.spouseName} />
            )}
          </div>
        </div>

        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Domicile &amp; Category / Reservation
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <ReviewRow label="Domicile of Bihar state?" hi="बिहार राज्य का निवासी?" value={p.domicileOfBihar} />
            <ReviewRow label="Domicile certificate — issue date" hi="निवास प्रमाणपत्र — जारी करने की तिथि" value={p.domicileIssueDate} />
            <ReviewRow label="Domicile certificate no." hi="निवास प्रमाणपत्र संख्या" value={p.domicileCertNo} />
            <ReviewRow label="Domicile — issuing authority" hi="जारीकर्ता प्राधिकारी" value={p.domicileAuthority} />
            <ReviewRow label="Category" hi="श्रेणी" value={p.category} />
            <ReviewRow label="Caste" hi="जाति" value={p.caste} />
          </div>
          <div>
            <ReviewRow label="Do you belong to non-creamy layer?" hi="क्या आप क्रीमीलेयर रहित से संबंधित हैं?" value={p.isNonCreamyLayer} />
            <ReviewRow label="Category certificate number" hi="प्रमाणपत्र संख्या" value={p.categoryCertNo} />
            <ReviewRow label="Category — issue date" hi="जारी करने की तिथि" value={p.categoryIssueDate} />
>>>>>>> dev
            <ReviewRow
              label="Category — issuing authority"
              hi="जारीकर्ता प्राधिकारी"
              value={p.categoryAuthority === "Other" ? p.categoryAuthorityOther : p.categoryAuthority}
            />
          </div>
        </div>

        {isBiharDomicile && (
          <>
            <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
              Special Categories
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <ReviewRow label="Person with disability?" hi="दिव्यांगता वाले व्यक्ति?" value={p.disability} />
                <ReviewRow label="Type of disability" hi="दिव्यांगता का प्रकार" value={p.natureOfDisability} />
                <ReviewRow label="Nature of disability?" hi="दिव्यांगता की प्रकृति" value={p.natureOfDisabilityType} />
                <ReviewRow label="Minimum 40% disability?" hi="न्यूनतम 40% दिव्यांगता?" value={p.disabilityPercent} />
                {isMin40PwD && (
                  <ReviewRow label="Is scribe required?" hi="क्या लेखक (स्क्राइब) की आवश्यकता है?" value={p.isScribeRequired} />
                )}
                {isPwD && (
                  <>
                    <ReviewRow label="Disability certificate number" hi="प्रमाणपत्र संख्या" value={p.disabilityCertNo} />
                    <ReviewRow label="Disability — issue date" hi="जारी करने की तिथि" value={p.disabilityIssueDate} />
                    <ReviewRow
                      label="Disability — issuing authority"
                      hi="जारीकर्ता प्राधिकारी"
                      value={p.disabilityAuthority === "Other" ? p.disabilityAuthorityOther : p.disabilityAuthority}
                    />
                  </>
                )}
              </div>
              <div>
                <ReviewRow label="Ex-serviceman?" hi="भूतपूर्व सैनिक?" value={p.exServiceman} />
                {isExServiceman && (
                  <>
                    <ReviewRow label="Type of officer / ex-serviceman category" hi="अधिकारी / भूतपूर्व सैनिक की श्रेणी" value={p.officerType} />
                    <ReviewRow label="Service in defence — from date" hi="रक्षा में सेवा — दिनांक से" value={p.serviceFromDate} />
                    <ReviewRow label="Service in defence — to date" hi="रक्षा में सेवा — दिनांक तक" value={p.serviceToDate} />
                  </>
                )}
                <ReviewRow label="NCC full-time cadet / instructor?" hi="एनसीसी पूर्णकालिक कैडेट/अनुदेशक?" value={p.nccCadet} />
                {isNccCadet && (
                  <>
                    <ReviewRow label="NCC 'C' certificate no." hi="एनसीसी 'सी' प्रमाणपत्र संख्या" value={p.nccCertificateNo} />
                    <ReviewRow label="NCC working period — from date" hi="एनसीसी कार्य अवधि — दिनांक से" value={p.nccWorkingFromDate} />
                    <ReviewRow label="NCC working period — to date" hi="एनसीसी कार्य अवधि — दिनांक तक" value={p.nccWorkingToDate} />
                  </>
                )}
                <ReviewRow label="Ward of freedom fighter?" hi="स्वतंत्रता सेनानी के वार्ड?" value={p.wardOfFreedomFighter} />
                {p.wardOfFreedomFighter === "YES" && (
                  <>
                    <ReviewRow label="Certificate no." hi="प्रमाणपत्र संख्या" value={p.freedomFighterCertNo} />
                    <ReviewRow label="Issuing authority" hi="जारीकर्ता प्राधिकारी" value={p.freedomFighterAuthority} />
                  </>
                )}
              </div>
            </div>

            <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
              Employment Status
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <ReviewRow label="Bihar govt. employee, 3+ years continuous service?" hi="बिहार सरकार के कर्मचारी, 3+ वर्ष सेवा?" value={p.biharGovtEmployee} />
                <ReviewRow label="Number of prior attempts (after 12-12-2022)" hi="पूर्व प्रयासों की संख्या" value={p.numberOfAttempts} />
                <ReviewRow label="Contractual employee?" hi="संविदा कर्मी?" value={p.contractualEmployee} />
              </div>
              <div>
                {isContractual && (
                  <>
                    <ReviewRow label="Name of post" hi="पद का नाम" value={p.nameOfPost} />
                    <ReviewRow label="Agreement under circular 1003?" hi="संकल्प 1003 के अनुसार एकरारनामा?" value={p.agreementCircular} />
                    <ReviewRow label="Department name" hi="विभाग का नाम" value={p.departmentName} />
                    <ReviewRow label="Office order no." hi="कार्यालय आदेश संख्या" value={p.officeOrderNo} />
                    <ReviewRow label="Contractual service — from date" hi="संविदा सेवा अवधि — दिनांक से" value={p.contractualFromDate} />
                    <ReviewRow label="Contractual service — to date" hi="संविदा सेवा अवधि — दिनांक तक" value={p.contractualToDate} />
                  </>
                )}
                <ReviewRow label="Debarred from any examination?" hi="किसी परीक्षा से वंचित?" value={p.isDebarred} />
              </div>
            </div>
          </>
        )}

        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          ID Proof
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <ReviewRow label="Do you have an Aadhar card?" hi="क्या आपके पास आधार कार्ड है?" value={p.hasAadharCard} />
            {p.hasAadharCard === "YES" && (
              <ReviewRow label="Aadhar number" hi="आधार संख्या" value={p.aadharCardNumber} />
            )}
          </div>
          <div>
            <ReviewRow label="Type of photo ID proof" hi="फोटो पहचान प्रमाण का प्रकार" value={p.typeOfPhotoIdProof} />
            <ReviewRow label="ID proof number" hi="पहचान प्रमाण संख्या" value={p.idProofNo} />
          </div>
        </div>

        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Permanent Address
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <ReviewRow label="Village" hi="गाँव/मोहल्ला" value={p.permVillage} />
            <ReviewRow label="Police Station" hi="पुलिस थाना" value={p.permPoliceStation} />
            <ReviewRow label="Post Office" hi="डाकघर" value={p.permPostOffice} />
          </div>
          <div>
            <ReviewRow label="District" hi="जिला" value={p.permDistrict} />
            <ReviewRow label="State" hi="राज्य" value={p.permState} />
            <ReviewRow label="Pin Code" hi="पिन कोड" value={p.permPinCode} />
          </div>
        </div>

        <div className="text-[11px] font-extrabold mb-2 mt-4" style={{ color: OCHRE_DEEP }}>
          Correspondence Address
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
            <ReviewRow label="Village" hi="गाँव/मोहल्ला" value={p.corrVillage} />
            <ReviewRow label="Police Station" hi="पुलिस थाना" value={p.corrPoliceStation} />
            <ReviewRow label="Post Office" hi="डाकघर" value={p.corrPostOffice} />
          </div>
          <div>
            <ReviewRow label="District" hi="जिला" value={p.corrDistrict} />
            <ReviewRow label="State" hi="राज्य" value={p.corrState} />
            <ReviewRow label="Pin Code" hi="पिन कोड" value={p.corrPinCode} />
          </div>
        </div>
      </ReviewSection>

      <ReviewSection title="STEP 2 · PAYMENT" step={2} onEdit={onEdit}>
        <div
          className="flex items-center gap-3 p-3 rounded-xl"
          style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
        >
          <CheckCircle2 size={17} style={{ color: TEAL }} />
          <div>
            <div className="text-[13px] font-extrabold" style={{ color: TEAL }}>
              ₹135 — Fee Paid
            </div>
            <div
              className="text-[11.5px] font-semibold"
              style={{ color: INK_SOFT }}
            >
              Payment mode: {formData.payment?.paymentMode || "N/A"}
            </div>
          </div>
        </div>
        <div className="mt-3">
          <ReviewRow
            label="Fee acknowledgement"
            hi="शुल्क स्वीकृति"
            value={formData.payment?.paymentAcknowledged ? "Accepted" : ""}
          />
        </div>
      </ReviewSection>

      <ReviewSection title="STEP 3 · EDUCATION" step={3} onEdit={onEdit}>
        <div className="space-y-3">
          {[
            ["10th / Equivalent · 10वीं / समकक्ष", e.tenth],
            ["12th / Equivalent · 12वीं / समकक्ष", e.twelfth],
            ["Graduation / Equivalent · स्नातक / समकक्ष", e.graduation],
          ].map(
            ([label, d]: [string, any]) =>
              d && (
                <div
                  key={label}
                  className="p-3 rounded-xl"
                  style={{ background: PAPER, border: `1px solid ${LINE}` }}
                >
                  <div
                    className="text-[11px] font-extrabold mb-2"
                    style={{ color: OCHRE_DEEP }}
                  >
                    {label}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-[11.5px]">
                    <div>
                      <span style={{ color: INK_SOFT }}>Subject · विषय: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.subject}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Board / University · बोर्ड/विश्वविद्यालय: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.boardUniversity}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Total marks · कुल अंक: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.totalMarks}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Obtained marks · प्राप्त अंक: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.obtainedMarks}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Percentage · प्रतिशत: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.percentage}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Certificate no. · प्रमाणपत्र संख्या: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.certNumber}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Issue date · जारी करने की तिथि: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.certIssueDate}
                      </span>
                    </div>
                  </div>
                </div>
              ),
          )}
        </div>
      </ReviewSection>

      <ReviewSection title="STEP 4 & 5 · PHOTOS" step={4} onEdit={onEdit}>
        <div className="flex flex-wrap gap-5">
          {(ph.photograph || ph.passportPhoto) && (
            <div className="text-center">
              <img
                src={ph.photograph || ph.passportPhoto}
                alt="Passport"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Passport photo · पासपोर्ट फोटो
              </div>
            </div>
          )}
          {(ph.signatureEnglish || ph.signatureEn) && (
            <div className="text-center">
              <img
                src={ph.signatureEnglish || ph.signatureEn}
                alt="Sig EN"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (English) · हस्ताक्षर (अंग्रेजी)
              </div>
            </div>
          )}
          {(ph.signatureHindi || ph.signatureHi) && (
            <div className="text-center">
              <img
                src={ph.signatureHindi || ph.signatureHi}
                alt="Sig HI"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (Hindi) · हस्ताक्षर (हिंदी)
              </div>
            </div>
          )}
          {lp.livePhoto && (
            <div className="text-center">
              <img
                src={lp.livePhoto}
                alt="Live"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `2px solid ${TEAL}` }}
              />
              <div
                className="text-[10.5px] font-bold mt-1"
                style={{ color: TEAL }}
              >
                Live photo ✓ · लाइव फोटो ✓
              </div>
            </div>
          )}
        </div>
      </ReviewSection>

      <div
        className="rounded-2xl p-6 space-y-4"
        style={{ background: CARD, border: `1.5px solid ${LINE}` }}
      >
        <div className="text-[12.5px] font-extrabold" style={{ color: INK }}>
          Declaration
        </div>
        <div
          className="text-[12px] leading-relaxed p-4 rounded-xl"
          style={{ background: PAPER, border: `1px solid ${LINE}`, color: INK }}
        >
          I hereby declare that all information furnished by me in this
          application is true, complete and correct to the best of my knowledge.
          If any information is found false or ineligibility is detected, my
          candidature is liable to be cancelled.
          <div className="mt-2" style={{ color: INK_SOFT }}>
            मैं घोषणा करता/करती हूँ कि इस आवेदन पत्र में दी गई सभी जानकारी सत्य
            एवं सही है।
          </div>
        </div>
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={declared}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              setDeclared(e.target.checked);
              setErr("");
            }}
            className="w-4 h-4 mt-0.5"
            style={{ accentColor: INK }}
          />
          <span className="text-[13px] font-bold" style={{ color: INK }}>
            I accept the above declaration · मैं घोषणा स्वीकार करता/करती हूँ
          </span>
        </label>
        {err && (
          <div
            className="flex items-center gap-1 text-[11px] font-bold"
            style={{ color: DANGER }}
          >
            <AlertCircle size={11} /> {err}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary px-10 py-3 text-[13.5px]"
          disabled={!declared || isSubmittingFinal}
          onClick={handleSubmit}
        >
          {isSubmittingFinal ? (
            <>
              <Loader2 size={16} className="gf-spin" /> Submitting…
            </>
          ) : (
            <>
              <CheckCircle2 size={16} /> FINAL SUBMIT
            </>
          )}
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   MAIN
--------------------------------------------------------------- */
const ApplicationFormContent: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [generating, setGenerating] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    personal: {},
    payment: {},
    education: {},
    photos: {},
    livePhoto: {},
  });

  const [applicationId, setApplicationId] = useState<string>("");
  const [candidateId, setCandidateId] = useState<string>("");
  const [step1AutoFill, setStep1AutoFill] = useState<Record<string, any>>({});
  const [appLoading, setAppLoading] = useState<boolean>(true);
  const [appLoadError, setAppLoadError] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        setAppLoading(true);
        setAppLoadError("");
        const res = await applicationApi.getApplicationSteps();
        const payload: ApplicationStepsResponse | undefined = res.data?.data;
        if (payload) {
          setApplicationId(payload.applicationId || "");
          setCandidateId(payload.candidateId || "");

          // Auto-fill Step 1 from the step0 registration snapshot — jo
          // value step0 me hai wo prefill ho jaayegi, baaki empty rahegi.
          setStep1AutoFill(mapStep0ToStep1(payload.steps?.step0));

          // If step1 (or later) was already saved earlier, resume from
          // it instead of leaving formData empty, so re-opening the
          // wizard doesn't lose previously saved progress.
          setFormData((prev) => ({
            ...prev,
            personal: payload.steps?.step1 || prev.personal,
            payment: payload.steps?.step2 || prev.payment,
            education: payload.steps?.step3 || prev.education,
            photos: payload.steps?.step4 || prev.photos,
            livePhoto: payload.steps?.step5 || prev.livePhoto,
          }));

          if (Array.isArray(payload.completedSteps) && payload.completedSteps.length > 0) {
            setCompleted(new Set(payload.completedSteps));
          }
          if (payload.currentStep && payload.currentStep > 0) {
            setCurrentStep(Math.min(payload.currentStep, 6));
          }
        }
      } catch (err: any) {
        const msg =
          err?.response?.data?.message || err?.message || "Failed to load your application. Please refresh.";
        setAppLoadError(msg);
        notifyError(msg);
      } finally {
        setAppLoading(false);
      }
    })();
  }, []);

  const saveStep = (step: number, d: any, key: keyof FormData) => {
    setFormData((prev) => ({ ...prev, [key]: d }));
    setCompleted((prev) => new Set([...prev, step]));
    if (step < 6) setCurrentStep(step + 1);
  };

  const downloadSummary = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 900));
    const p = formData.personal || {};
    const html = `<html><head><meta charset="utf-8"><title>Application Summary</title></head><body style="font-family:sans-serif;padding:32px;">
      <h2>BSSC Application Summary</h2>
      <p><b>Registration No:</b> ${MOCK_CANDIDATE.registrationNo}</p>
      <p><b>Name:</b> ${p.applicantName || MOCK_CANDIDATE.name}</p>
      <p><b>Father's name:</b> ${p.fatherName || ""}</p>
      <p><b>Category:</b> ${p.category || ""}</p>
      <p><b>Email:</b> ${p.emailId || ""}</p>
      <p><b>Status:</b> Submitted</p>
      </body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Application_Summary.html";
    a.click();
    URL.revokeObjectURL(url);
    setGenerating(false);
  };

  const FONTS_STYLE = <style>{FONTS}</style>;

  if (submitted) {
    return (
      <div className="gf-root min-h-screen" style={{ background: PAPER }}>
        {FONTS_STYLE}
        <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover theme="colored" />
        <HeaderBar />
        <div
          className="flex items-center justify-center p-6"
          style={{ minHeight: "70vh" }}
        >
          <div
            className="gf-pop max-w-lg w-full rounded-2xl p-8 text-center space-y-5"
            style={{ background: CARD, border: `1.5px solid ${LINE}` }}
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto"
              style={{ background: "#E8F3EF", border: `3px solid ${TEAL}` }}
            >
              <CheckCircle2 size={36} style={{ color: TEAL }} />
            </div>
            <div>
              <div
                className="gf-display text-xl font-semibold"
                style={{ color: INK }}
              >
                Application submitted!
              </div>
              <div
                className="text-[12.5px] font-medium mt-1"
                style={{ color: INK_SOFT }}
              >
                आवेदन सफलतापूर्वक जमा किया गया
              </div>
            </div>
            <div
              className="rounded-xl p-4 text-left space-y-2"
              style={{ background: PAPER, border: `1px solid ${LINE}` }}
            >
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: INK_SOFT }}>Registration No.</span>
                <span
                  className="font-extrabold gf-mono"
                  style={{ color: OCHRE_DEEP }}
                >
                  {MOCK_CANDIDATE.registrationNo}
                </span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: INK_SOFT }}>Candidate name</span>
                <span className="font-bold" style={{ color: INK }}>
                  {MOCK_CANDIDATE.name}
                </span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span style={{ color: INK_SOFT }}>Status</span>
                <span className="font-extrabold" style={{ color: TEAL }}>
                  Submitted ✓
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={downloadSummary}
                disabled={generating}
                className="gf-btn-primary w-full"
              >
                {generating ? (
                  <>
                    <Loader2 size={15} className="gf-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Download size={15} /> Download Application Summary
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setCurrentStep(1);
                  setCompleted(new Set());
                  setFormData({
                    personal: {},
                    payment: {},
                    education: {},
                    photos: {},
                    livePhoto: {},
                  });
                }}
                className="gf-btn-secondary w-full"
              >
                <LogOut size={15} /> Back to dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gf-root min-h-screen" style={{ background: PAPER }}>
      {FONTS_STYLE}
      <ToastContainer position="top-right" autoClose={4000} newestOnTop closeOnClick pauseOnHover theme="colored" />
      <HeaderBar />

      {/* Stepper */}
      <div
        style={{ background: CARD, borderBottom: `1.5px solid ${LINE}` }}
        className="sticky top-0 z-10"
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3">
          <div className="flex items-center gap-1 overflow-x-auto">
            {STEPS.map((s, idx) => {
              const isActive = currentStep === s.id;
              const isDone = completed.has(s.id);
              const accessible = s.id <= currentStep || isDone;
              const Icon = s.icon;
              return (
                <React.Fragment key={s.id}>
                  <button
                    onClick={() => accessible && setCurrentStep(s.id)}
                    disabled={!accessible}
                    className="flex flex-col items-center gap-1 shrink-0"
                    style={{
                      opacity: accessible ? 1 : 0.4,
                      cursor: accessible ? "pointer" : "not-allowed",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center"
                      style={{
                        background: isDone ? TEAL : isActive ? INK : "#fff",
                        border: `2px solid ${isDone ? TEAL : isActive ? INK : LINE}`,
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={15} color="#fff" />
                      ) : (
                        <Icon size={14} color={isActive ? "#fff" : INK_SOFT} />
                      )}
                    </div>
                    <div className="text-center hidden sm:block">
                      <div
                        className="text-[11px] font-extrabold leading-tight"
                        style={{
                          color: isActive ? INK : isDone ? TEAL : INK_SOFT,
                        }}
                      >
                        {s.en}
                      </div>
                      <div
                        className="text-[10px] font-medium leading-tight"
                        style={{ color: INK_SOFT }}
                      >
                        {s.hi}
                      </div>
                    </div>
                  </button>
                  {idx < STEPS.length - 1 && (
                    <div
                      className="h-0.5 flex-1 min-w-4"
                      style={{ background: isDone ? TEAL : LINE }}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full py-2">
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: CARD, border: `1.5px solid ${LINE}` }}
        >
          <div className="px-5 py-2 text-center" style={{ background: OCHRE }}>
            <span className="text-[11px] font-extrabold text-white">
              STEP {currentStep} OF 6 — {STEPS[currentStep - 1].en} ·{" "}
              {STEPS[currentStep - 1].hi}
            </span>
          </div>
          <div className="p-5">
            {appLoadError && (
              <div className="mb-5">
                <Note tone="danger">{appLoadError}</Note>
              </div>
            )}
            {appLoading ? (
              <div className="flex items-center justify-center gap-2 py-16">
                <Loader2 size={18} className="gf-spin" style={{ color: OCHRE_DEEP }} />
                <span className="text-[13px] font-bold" style={{ color: OCHRE_DEEP }}>
                  Loading your application…
                </span>
              </div>
            ) : (
              <>
                {currentStep === 1 && (
                  <Step1Personal
                    data={formData.personal}
                    onSave={(d: PersonalData) => saveStep(1, d, "personal")}
                    applicationId={applicationId}
                    autoFill={step1AutoFill}
                  />
                )}
                {currentStep === 2 && (
                  <Step2Payment
                    data={formData.payment}
                    onSave={(d: PaymentData) => saveStep(2, d, "payment")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 3 && (
                  <Step3Education
                    data={formData.education}
                    onSave={(d: EducationData) => saveStep(3, d, "education")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 4 && (
                  <Step4PhotoUpload
                    data={formData.photos}
                    onSave={(d: PhotoData) => saveStep(4, d, "photos")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 5 && (
                  <Step5LivePhoto
                    data={formData.livePhoto}
                    onSave={(d: LivePhotoData) => saveStep(5, d, "livePhoto")}
                    applicationId={applicationId}
                  />
                )}
                {currentStep === 6 && (
                  <Step6Review
                    formData={formData}
                    onSubmit={() => setSubmitted(true)}
                    onEdit={(s: number) => setCurrentStep(s)}
                    applicationId={applicationId}
                  />
                )}
              </>
            )}
          </div>
        </div>

        {currentStep > 1 && (
          <div className="mt-4">
            <button
              onClick={() => setCurrentStep((s) => s - 1)}
              className="gf-btn-secondary"
            >
              <ChevronLeft size={15} /> Previous
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

const HeaderBar: React.FC = () => {
  return (
    <div style={{ background: CARD, borderBottom: `1.5px solid ${LINE}` }}>
      <div className="w-full mx-auto px-4 md:px-8 p-2 flex items-center justify-between">
        <div>
          <div
            className="text-[10.5px] font-extrabold tracking-[0.18em]"
            style={{ color: OCHRE_DEEP }}
          >
            BIHAR STAFF SELECTION COMMISSION
          </div>
          <div
            className="gf-display text-xl font-semibold"
            style={{ color: INK }}
          >
            Candidate Application
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationFormContent;

