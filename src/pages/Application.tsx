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



import React, {useState,useRef,useCallback,useEffect,} from "react";
import  type {ChangeEvent,} from "react";
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
  AlertCircle,
  RotateCcw,
  Download,
  LogOut,
  Eye,
  Loader2,
} from "lucide-react";
import Webcam from "react-webcam";

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
  .gf-input:disabled { background: #F1F2F4; color: ${INK_SOFT}; }
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
   SHARED UI PRIMITIVES
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
}) => (
  <div className="flex flex-wrap gap-2.5">
    {options.map((opt) => (
      <label key={opt} style={{ position: "relative" }}>
        <input
          type="radio"
          name={name}
          value={opt}
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="gf-radio-input"
        />
        <span className="gf-pill">{opt.replace("NA", "N/A")}</span>
      </label>
    ))}
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

const AddressFields: React.FC<AddressFieldsProps> = ({
  prefix,
  v,
  setField,
  errors,
  disabled,
}) => {
  const rows: [string, string, string][] = [
    ["Village", "गाँव/मोहल्ला", "Village"],
    ["PoliceStation", "पुलिस थाना", "PoliceStation"],
    ["PostOffice", "डाकघर", "PostOffice"],
    ["District", "जिला", "District"],
    ["State", "राज्य", "State"],
    ["PinCode", "पिन कोड", "PinCode"],
  ];

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
const Step1Personal: React.FC<Step1Props> = ({ data, onSave }) => {
  const [v, setV] = useState<PersonalData>({
    nationality: "INDIAN",
    sameAsPermanent: false,
    ...data,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (k: string, val: string | boolean) =>
    setV((p) => ({ ...p, [k]: val }));

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
            corrState: p.permState,
            corrPinCode: p.permPinCode,
          }
        : {}),
    }));
  };

  const showCategoryDocs = v.category && v.category !== "UR";
  const showNonCreamy = v.category === "EBC" || v.category === "BC";

  const required = [
    "applicantName",
    "fatherName",
    "motherName",
    "gender",
    "dateOfBirth",
    "emailId",
    "domicileOfBihar",
    "category",
    "caste",
    "disability",
    "exServiceman",
    "nccCadet",
    "wardOfFreedomFighter",
    "biharGovtEmployee",
    "numberOfAttempts",
    "contractualEmployee",
    "isDebarred",
    "hasAadharCard",
    "permVillage",
    "permPoliceStation",
    "permPostOffice",
    "permDistrict",
    "permState",
    "permPinCode",
    "corrVillage",
    "corrPoliceStation",
    "corrPostOffice",
    "corrDistrict",
    "corrState",
    "corrPinCode",
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    required.forEach((f) => {
      if (!String(v[f as keyof PersonalData] || "").trim())
        e[f] = "This field is required";
    });
    if (v.emailId && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.emailId))
      e.emailId = "Enter a valid email";
    if (v.permPinCode && !/^\d{6}$/.test(v.permPinCode))
      e.permPinCode = "Enter a 6-digit PIN code";
    if (v.corrPinCode && !/^\d{6}$/.test(v.corrPinCode))
      e.corrPinCode = "Enter a 6-digit PIN code";
    if (
      v.hasAadharCard === "YES" &&
      v.aadharCardNumber &&
      !/^\d{12}$/.test(v.aadharCardNumber)
    )
      e.aadharCardNumber = "Aadhar must be 12 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div className="space-y-8">
      <div>
        <SectionTitle icon={User}>Basic Information</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Name of applicant"
            hi="आवेदक का नाम"
            required
            error={errors.applicantName}
          >
            <input
              className={`gf-input ${errors.applicantName ? "gf-error" : ""}`}
              value={v.applicantName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("applicantName", e.target.value)
              }
              placeholder="Enter full name"
            />
          </Field>
          <Field
            label="Father's name"
            hi="पिता का नाम"
            required
            error={errors.fatherName}
          >
            <input
              className={`gf-input ${errors.fatherName ? "gf-error" : ""}`}
              value={v.fatherName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("fatherName", e.target.value)
              }
              placeholder="Enter father's name"
            />
          </Field>
          <Field
            label="Mother's name"
            hi="माता का नाम"
            required
            error={errors.motherName}
          >
            <input
              className={`gf-input ${errors.motherName ? "gf-error" : ""}`}
              value={v.motherName || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("motherName", e.target.value)
              }
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
          {v.nationality === "OTHER" && (
            <Field label="Other Nationality" hi="अन्य राष्ट्रीयता" required>
              <input
                className="gf-input"
                value={v.otherNationality || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField("otherNationality", e.target.value)
                }
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
            <input
              type="email"
              className={`gf-input ${errors.emailId ? "gf-error" : ""}`}
              value={v.emailId || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("emailId", e.target.value)
              }
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
        </div>
      </div>

      <div>
        <SectionTitle icon={User}>Domicile &amp; Category</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Domicile of Bihar state?"
            hi="बिहार राज्य का निवासी?"
            required
            error={errors.domicileOfBihar}
          >
            <PillGroup
              name="domicileOfBihar"
              value={v.domicileOfBihar || ""}
              onChange={(val) => setField("domicileOfBihar", val)}
              options={YES_NO}
            />
          </Field>
          {v.domicileOfBihar === "YES" && (
            <CertNumberDateAuthority
              v={v}
              setField={setField}
              prefixNo="domicileCertNo"
              prefixDate="domicileIssueDate"
              prefixAuth="domicileAuthority"
              labelNo="Domicile certificate no."
              hiNo="निवास प्रमाणपत्र संख्या"
              labelDate="Issue date"
              hiDate="जारी करने की तिथि"
              labelAuth="Issuing authority"
              hiAuth="जारीकर्ता प्राधिकारी"
            />
          )}
          <Field label="Category" hi="श्रेणी" required error={errors.category}>
            <PillGroup
              name="category"
              value={v.category || ""}
              onChange={(val) => setField("category", val)}
              options={["UR", "EBC", "BC", "SC", "ST", "EWS"]}
            />
          </Field>
          <Field label="Caste" hi="जाति" required error={errors.caste}>
            <input
              className={`gf-input ${errors.caste ? "gf-error" : ""}`}
              value={v.caste || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("caste", e.target.value)
              }
              placeholder="Enter caste name"
            />
          </Field>
          {showNonCreamy && (
            <Field label="Non-creamy layer?" hi="क्रीमीलेयर रहित?">
              <PillGroup
                name="nonCreamyLayer"
                value={v.nonCreamyLayer || ""}
                onChange={(val) => setField("nonCreamyLayer", val)}
                options={YES_NO_NA}
              />
            </Field>
          )}
          {showCategoryDocs && (
            <CertNumberDateAuthority
              v={v}
              setField={setField}
              prefixNo="categoryCertNo"
              prefixDate="categoryIssueDate"
              prefixAuth="categoryAuthority"
              labelNo="Category certificate no."
              hiNo="श्रेणी प्रमाणपत्र संख्या"
              labelDate="Issue date"
              hiDate="जारी करने की तिथि"
              labelAuth="Issuing authority"
              hiAuth="जारीकर्ता प्राधिकारी"
            />
          )}
        </div>
      </div>

      <div>
        <SectionTitle icon={User}>Special Categories</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Person with disability?"
            hi="दिव्यांगता वाले व्यक्ति?"
            required
            error={errors.disability}
          >
            <PillGroup
              name="disability"
              value={v.disability || ""}
              onChange={(val) => setField("disability", val)}
              options={YES_NO}
            />
          </Field>
          {v.disability === "YES" && (
            <>
              <Field label="Nature of disability" hi="दिव्यांगता की प्रकृति">
                <select
                  className="gf-select"
                  value={v.natureOfDisability || ""}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setField("natureOfDisability", e.target.value)
                  }
                >
                  <option value="">Select</option>
                  <option value="VISUAL">Visual / दृष्टि बाधित</option>
                  <option value="HEARING_SPEECH">
                    Hearing-Speech / श्रवण-वाक् बाधित
                  </option>
                  <option value="LOCOMOTOR">Locomotor / चलन बाधित</option>
                  <option value="MENTAL_MULTIPLE">
                    Mental/Multiple / मानसिक/बहु बाधित
                  </option>
                </select>
              </Field>
              <Field
                label="Minimum 40% disability?"
                hi="न्यूनतम 40% दिव्यांगता?"
              >
                <PillGroup
                  name="disabilityPercent"
                  value={v.disabilityPercent || ""}
                  onChange={(val) => setField("disabilityPercent", val)}
                  options={YES_NO_NA}
                />
              </Field>
            </>
          )}
          <Field
            label="Ex-serviceman?"
            hi="भूतपूर्व सैनिक?"
            required
            error={errors.exServiceman}
          >
            <PillGroup
              name="exServiceman"
              value={v.exServiceman || ""}
              onChange={(val) => setField("exServiceman", val)}
              options={YES_NO}
            />
          </Field>
          <Field
            label="NCC full-time cadet / instructor?"
            hi="एनसीसी पूर्णकालिक कैडेट/अनुदेशक?"
            required
            error={errors.nccCadet}
          >
            <PillGroup
              name="nccCadet"
              value={v.nccCadet || ""}
              onChange={(val) => setField("nccCadet", val)}
              options={YES_NO}
            />
          </Field>
          {v.nccCadet === "YES" && (
            <Field
              label="NCC 'C' certificate no."
              hi="एनसीसी 'सी' प्रमाणपत्र संख्या"
            >
              <input
                className="gf-input"
                value={v.nccCertificateNo || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField("nccCertificateNo", e.target.value)
                }
              />
            </Field>
          )}
          <Field
            label="Ward of freedom fighter?"
            hi="स्वतंत्रता सेनानी के वार्ड?"
            required
            error={errors.wardOfFreedomFighter}
          >
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

      <div>
        <SectionTitle icon={User}>Employment Status</SectionTitle>
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
          <Field
            label="Number of prior attempts"
            hi="पूर्व प्रयासों की संख्या"
            required
            error={errors.numberOfAttempts}
          >
            <input
              type="number"
              min="0"
              className={`gf-input gf-mono ${errors.numberOfAttempts ? "gf-error" : ""}`}
              value={v.numberOfAttempts || ""}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("numberOfAttempts", e.target.value)
              }
              placeholder="0"
            />
          </Field>
          <Field
            label="Contractual employee?"
            hi="संविदा कर्मी?"
            required
            error={errors.contractualEmployee}
          >
            <PillGroup
              name="contractualEmployee"
              value={v.contractualEmployee || ""}
              onChange={(val) => setField("contractualEmployee", val)}
              options={YES_NO}
            />
          </Field>
          {v.contractualEmployee === "YES" && (
            <>
              <Field label="Name of post" hi="पद का नाम">
                <input
                  className="gf-input"
                  value={v.nameOfPost || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setField("nameOfPost", e.target.value)
                  }
                />
              </Field>
              <Field
                label="Agreement under circular 1003?"
                hi="संकल्प 1003 के अनुसार एकरारनामा?"
              >
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
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setField("departmentName", e.target.value)
                  }
                />
              </Field>
              <Field label="Office order no." hi="कार्यालय आदेश संख्या">
                <input
                  className="gf-input"
                  value={v.officeOrderNo || ""}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setField("officeOrderNo", e.target.value)
                  }
                />
              </Field>
              <div className="md:col-span-2 mb-2">
                <div
                  className="text-[12px] font-extrabold tracking-wide mb-2"
                  style={{ color: INK }}
                >
                  Contractual service period · संविदा सेवा अवधि
                </div>
                <div className="grid grid-cols-3 gap-3 max-w-md">
                  <input
                    type="number"
                    min="0"
                    placeholder="Years"
                    className="gf-input gf-mono"
                    value={v.contractualYears || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setField("contractualYears", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="Months"
                    className="gf-input gf-mono"
                    value={v.contractualMonths || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setField("contractualMonths", e.target.value)
                    }
                  />
                  <input
                    type="number"
                    min="0"
                    max="30"
                    placeholder="Days"
                    className="gf-input gf-mono"
                    value={v.contractualDays || ""}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setField("contractualDays", e.target.value)
                    }
                  />
                </div>
              </div>
            </>
          )}
          <Field
            label="Debarred from any examination?"
            hi="किसी परीक्षा से वंचित?"
            required
            error={errors.isDebarred}
          >
            <PillGroup
              name="isDebarred"
              value={v.isDebarred || ""}
              onChange={(val) => setField("isDebarred", val)}
              options={YES_NO}
            />
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle icon={User}>ID Proof</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
          <Field
            label="Do you have an Aadhar card?"
            hi="क्या आपके पास आधार कार्ड है?"
            required
            error={errors.hasAadharCard}
          >
            <PillGroup
              name="hasAadharCard"
              value={v.hasAadharCard || ""}
              onChange={(val) => setField("hasAadharCard", val)}
              options={YES_NO}
            />
          </Field>
          {v.hasAadharCard === "YES" && (
            <Field
              label="Aadhar number"
              hi="आधार संख्या"
              error={errors.aadharCardNumber}
            >
              <input
                className={`gf-input gf-mono ${errors.aadharCardNumber ? "gf-error" : ""}`}
                maxLength={12}
                value={v.aadharCardNumber || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setField(
                    "aadharCardNumber",
                    e.target.value.replace(/\D/g, ""),
                  )
                }
                placeholder="12-digit Aadhar number"
              />
            </Field>
          )}
          <Field
            label="Type of photo ID proof"
            hi="फोटो पहचान प्रमाण का प्रकार"
          >
            <select
              className="gf-select"
              value={v.typeOfPhotoIdProof || ""}
              onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                setField("typeOfPhotoIdProof", e.target.value)
              }
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setField("idProofNo", e.target.value)
              }
            />
          </Field>
        </div>
      </div>

      <div>
        <SectionTitle icon={User}>Permanent Address</SectionTitle>
        <AddressFields
          prefix="perm"
          v={v}
          setField={setField}
          errors={errors}
        />
      </div>

      <div>
        <SectionTitle icon={User}>Correspondence Address</SectionTitle>
        <label className="flex items-center gap-2 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={!!v.sameAsPermanent}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              toggleSame(e.target.checked)
            }
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
        />
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary"
          onClick={() => validate() && onSave(v)}
        >
          Save &amp; Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 2 — PAYMENT
--------------------------------------------------------------- */
const Step2Payment: React.FC<Step2Props> = ({ data, onSave }) => {
  const [v, setV] = useState<PaymentData>({ ...data });
  const [errors, setErrors] = useState<Record<string, string>>({});
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
          <CheckCircle2 size={18} style={{ color: TEAL }} />
          <div>
            <div
              className="gf-mono text-lg font-extrabold"
              style={{ color: TEAL }}
            >
              ₹135
            </div>
            <div
              className="text-[11.5px] font-semibold"
              style={{ color: INK_SOFT }}
            >
              EBC-I / Bihar Domicile Female — concession rate
            </div>
          </div>
        </div>

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
          onClick={() => validate() && onSave(v)}
        >
          Proceed to Pay <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 3 — EDUCATION
--------------------------------------------------------------- */
const EDU_FIELDS: [string, string, string][] = [
  ["subject", "Subject", "विषय"],
  ["boardUniversity", "Board / University", "बोर्ड/विश्वविद्यालय"],
  ["totalMarks", "Total marks", "कुल अंक"],
  ["obtainedMarks", "Obtained marks", "प्राप्त अंक"],
  ["percentage", "Percentage", "प्रतिशत"],
  ["certNumber", "Certificate no.", "प्रमाणपत्र संख्या"],
  ["certIssueDate", "Certificate issue date", "जारी करने की तिथि"],
];

const EducationBlock: React.FC<EducationBlockProps> = ({
  title,
  hi,
  prefix,
  v,
  setNested,
}) => {
  const section =
    (v[prefix as keyof EducationData] as EducationData["tenth"]) || {};
  return (
    <div>
      <SectionTitle icon={GraduationCap}>
        {title} · {hi}
      </SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {EDU_FIELDS.map(([key, label, hiLabel]) => (
          <Field key={key} label={label} hi={hiLabel} required>
            {key === "certIssueDate" ? (
              <input
                type="date"
                className="gf-input"
                value={section[key] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNested(prefix, key, e.target.value)
                }
              />
            ) : (
              <input
                className="gf-input"
                value={section[key] || ""}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setNested(prefix, key, e.target.value)
                }
                placeholder={label}
              />
            )}
          </Field>
        ))}
      </div>
    </div>
  );
};

const Step3Education: React.FC<Step3Props> = ({ data, onSave }) => {
  const [v, setV] = useState<EducationData>({
    tenth: {},
    twelfth: {},
    graduation: {},
    ...data,
  });
  const setNested = (prefix: string, key: string, val: string) =>
    setV((p) => ({
      ...p,
      [prefix]: {
        ...(p[prefix as keyof EducationData] as EducationBlock),
        [key]: val,
      },
    }));

  return (
    <div className="space-y-8">
      <EducationBlock
        title="10th / Equivalent"
        hi="10वीं / समकक्ष"
        prefix="tenth"
        v={v}
        setNested={setNested}
      />
      <EducationBlock
        title="12th / Equivalent"
        hi="12वीं / समकक्ष"
        prefix="twelfth"
        v={v}
        setNested={setNested}
      />
      <EducationBlock
        title="Graduation / Equivalent"
        hi="स्नातक / समकक्ष"
        prefix="graduation"
        v={v}
        setNested={setNested}
      />
      <div className="flex justify-end pt-2">
        <button className="gf-btn-primary" onClick={() => onSave(v)}>
          Save &amp; Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 4 — PHOTO UPLOAD
--------------------------------------------------------------- */
const Step4PhotoUpload: React.FC<Step4Props> = ({ data, onSave }) => {
  const [v, setV] = useState<PhotoData>({ ...data });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const uploads: UploadField[] = [
    {
      field: "passportPhoto",
      label: "Passport size recent photograph",
      hi: "पासपोर्ट साइज हालिया फोटो",
      spec: "JPG · 20–50KB · 200×230px · within 1 month",
      maxKB: 50,
      height: 150,
    },
    {
      field: "signatureEn",
      label: "English signature",
      hi: "अंग्रेजी हस्ताक्षर",
      spec: "JPG · 10–20KB · 200×60px",
      maxKB: 20,
      height: 74,
    },
    {
      field: "signatureHi",
      label: "Hindi signature",
      hi: "हिंदी हस्ताक्षर",
      spec: "JPG · 10–20KB · 200×60px",
      maxKB: 20,
      height: 74,
    },
  ];

  const handleFile = (field: keyof PhotoData, file: File, maxKB: number) => {
    if (file.size > maxKB * 1024) {
      setErrors((p) => ({ ...p, [field]: `File must be under ${maxKB}KB` }));
      return;
    }
    setErrors((p) => ({ ...p, [field]: "" }));
    const reader = new FileReader();
    reader.onload = (e) =>
      setV((p) => ({ ...p, [field]: e.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleNext = () => {
    const e: Record<string, string> = {};
    uploads.forEach((u) => {
      if (!v[u.field as keyof PhotoData])
        e[u.field] = "This upload is required";
    });
    setErrors((p) => ({ ...p, ...e }));
    if (Object.values(e).every((x) => !x)) onSave(v);
  };

  return (
    <div className="space-y-6">
      <SectionTitle icon={Upload}>Photo &amp; Signature Upload</SectionTitle>
      <Note>
        Photograph must be recent, light background. Signatures on white paper,
        black/blue ink, scanned clearly. Only JPG/JPEG accepted.
      </Note>

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
            </div>
            <div
              className="rounded-xl flex items-center justify-center overflow-hidden"
              style={{
                height: u.height,
                background: "#F6F7F9",
                border: `1.5px dashed ${LINE}`,
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
                accept="image/jpeg,image/jpg"
                className="hidden"
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                  const f = e.target.files?.[0];
                  if (f) handleFile(u.field as keyof PhotoData, f, u.maxKB);
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
        <button className="gf-btn-primary" onClick={handleNext}>
          Save &amp; Next <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------
   STEP 5 — LIVE PHOTO (Using react-webcam)
--------------------------------------------------------------- */
const Step5LivePhoto: React.FC<Step5Props> = ({ data, onSave }) => {
  const webcamRef = useRef<Webcam>(null);
  const [captured, setCaptured] = useState<string>(data.livePhoto || "");
  const [cameraReady, setCameraReady] = useState<boolean>(false);
  const [camError, setCamError] = useState<string>("");

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: "user",
  };

  const capture = useCallback(() => {
    if (!webcamRef.current) {
      setCamError("Camera not available. Please try again.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    
    if (imageSrc) {
      setCaptured(imageSrc);
      setCamError("");
    } else {
      setCamError("Failed to capture photo. Please try again.");
    }
  }, []);

  const retake = () => {
    setCaptured("");
    setCameraReady(false);
    setCamError("");
  };

  // Clean up camera on unmount
  useEffect(() => {
    return () => {
      const stream = webcamRef.current?.video?.srcObject;
      if (stream instanceof MediaStream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleNext = () => {
    if (!captured) {
      setCamError(
        "Please capture your live photo before proceeding. · कृपया लाइव फोटो कैप्चर करें।",
      );
      return;
    }
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
          className="relative rounded-2xl overflow-hidden flex items-center justify-center"
          style={{
            width: 420,
            height: 315,
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
                setCamError(
                  "Unable to access the camera. Please allow camera permission and try again. · कैमरा एक्सेस अस्वीकृत।",
                );
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
            <button 
              onClick={capture} 
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

        {captured && (
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl"
            style={{ background: "#E8F3EF", border: "1px solid #C9E4DA" }}
          >
            <CheckCircle2 size={15} style={{ color: TEAL }} />
            <span className="text-[12.5px] font-bold" style={{ color: TEAL }}>
              Live photo captured successfully! · लाइव फोटो सफलतापूर्वक कैप्चर हुआ!
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <button
          className="gf-btn-primary"
          disabled={!captured}
          onClick={handleNext}
        >
          Save &amp; Next <ChevronRight size={15} />
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
  value?: string | number;
}

const ReviewRow: React.FC<ReviewRowProps> = ({ label, value }) =>
  value ? (
    <div
      className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2 py-1.5"
      style={{ borderBottom: `1px solid ${LINE}` }}
    >
      <span
        className="text-[11px] font-semibold sm:w-48 shrink-0"
        style={{ color: INK_SOFT }}
      >
        {label}
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

const Step6Review: React.FC<Step6Props> = ({ formData, onSubmit, onEdit }) => {
  const [declared, setDeclared] = useState<boolean>(false);
  const [err, setErr] = useState<string>("");
  const p = formData.personal || {};
  const e = formData.education || {};
  const ph = formData.photos || {};
  const lp = formData.livePhoto || {};

  const handleSubmit = () => {
    if (!declared) {
      setErr(
        "You must accept the declaration to submit. · घोषणा स्वीकार करनी होगी।",
      );
      return;
    }
    onSubmit();
  };

  return (
    <div className="space-y-5">
      <SectionTitle icon={ClipboardCheck}>Review Your Application</SectionTitle>
      <Note>
        Please review all details carefully. Once submitted, Name, Mobile
        Number, and Email ID cannot be changed.
      </Note>

      <ReviewSection title="STEP 1 · PERSONAL DETAILS" step={1} onEdit={onEdit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <div>
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
            <ReviewRow
              label="Permanent address"
              value={
                p.permVillage
                  ? `${p.permVillage}, ${p.permDistrict}, ${p.permState} - ${p.permPinCode}`
                  : undefined
              }
            />
            <ReviewRow
              label="Correspondence address"
              value={
                p.corrVillage
                  ? `${p.corrVillage}, ${p.corrDistrict}, ${p.corrState} - ${p.corrPinCode}`
                  : undefined
              }
            />
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
      </ReviewSection>

      <ReviewSection title="STEP 3 · EDUCATION" step={3} onEdit={onEdit}>
        <div className="space-y-3">
          {[
            ["10th", e.tenth],
            ["12th", e.twelfth],
            ["Graduation", e.graduation],
          ].map(
            ([label, d]) =>
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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11.5px]">
                    <div>
                      <span style={{ color: INK_SOFT }}>Subject: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.subject}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Board: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.boardUniversity}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>Marks: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.obtainedMarks}/{d.totalMarks}
                      </span>
                    </div>
                    <div>
                      <span style={{ color: INK_SOFT }}>%: </span>
                      <span className="font-bold" style={{ color: INK }}>
                        {d.percentage}
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
          {ph.passportPhoto && (
            <div className="text-center">
              <img
                src={ph.passportPhoto}
                alt="Passport"
                className="w-20 h-24 object-cover rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Passport photo
              </div>
            </div>
          )}
          {ph.signatureEn && (
            <div className="text-center">
              <img
                src={ph.signatureEn}
                alt="Sig EN"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (EN)
              </div>
            </div>
          )}
          {ph.signatureHi && (
            <div className="text-center">
              <img
                src={ph.signatureHi}
                alt="Sig HI"
                className="w-24 h-10 object-contain rounded-lg"
                style={{ border: `1px solid ${LINE}` }}
              />
              <div
                className="text-[10.5px] font-semibold mt-1"
                style={{ color: INK_SOFT }}
              >
                Signature (HI)
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
                Live photo ✓
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
          disabled={!declared}
          onClick={handleSubmit}
        >
          <CheckCircle2 size={16} /> FINAL SUBMIT
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
            {currentStep === 1 && (
              <Step1Personal
                data={formData.personal}
                onSave={(d: PersonalData) => saveStep(1, d, "personal")}
              />
            )}
            {currentStep === 2 && (
              <Step2Payment
                data={formData.payment}
                onSave={(d: PaymentData) => saveStep(2, d, "payment")}
              />
            )}
            {currentStep === 3 && (
              <Step3Education
                data={formData.education}
                onSave={(d: EducationData) => saveStep(3, d, "education")}
              />
            )}
            {currentStep === 4 && (
              <Step4PhotoUpload
                data={formData.photos}
                onSave={(d: PhotoData) => saveStep(4, d, "photos")}
              />
            )}
            {currentStep === 5 && (
              <Step5LivePhoto
                data={formData.livePhoto}
                onSave={(d: LivePhotoData) => saveStep(5, d, "livePhoto")}
              />
            )}
            {currentStep === 6 && (
              <Step6Review
                formData={formData}
                onSubmit={() => setSubmitted(true)}
                onEdit={(s: number) => setCurrentStep(s)}
              />
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

