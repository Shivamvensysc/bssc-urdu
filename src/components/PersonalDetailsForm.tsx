import React, { useState, useEffect } from 'react';

interface FormState {
  // Personal Details
  fatherName: string;
  motherName: string;
  domicileIssueDate: string;
  domicileCertNo: string;
  domicileAuthority: string;
  otherAuthorityDesignation: string;
  categoryCertNo: string;
  categoryIssueDate: string;
  categoryAuthority: string;
  categoryOtherAuthority: string;
  
  // Service Details
  departmentName: string;
  officeOrderNo: string;
  experienceCert: File | null;
  agreementCopy: File | null;
  
  // Additional Details
  isWardOfFreedomFighter: string;
  freedomFighterCertNo: string;
  freedomFighterAuthority: string;
  nationality: string;
  hasAadharCard: string;
  aadharCardNumber: string;
  typeOfPhotoIdProof: string;
  idProofNo: string;
  identificationMark: string;
  isDebarred: string;
  debarredCommissionName: string;
  debarredFromDate: string;
  debarredToDate: string;
  
  // Correspondence Address fields
  corrAddress: string;
  corrVillage: string;
  corrPoliceStation: string;
  corrPostOffice: string;
  corrState: string;
  corrDistrict: string;
  corrPinCode: string;

  // Permanent Address fields
  sameAsCorrespondence: boolean;
  permAddress: string;
  permVillage: string;
  permPoliceStation: string;
  permPostOffice: string;
  permState: string;
  permDistrict: string;
  permPinCode: string;
}

export const PersonalDetailsForm: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60);
  const [formData, setFormData] = useState<FormState>({
    // Personal Details
    fatherName: 'LATE RAMESH PRASAD',
    motherName: 'SUNITA DEVI',
    domicileIssueDate: '2024-10-28',
    domicileCertNo: 'BRCCO/2024/13884314',
    domicileAuthority: 'RO',
    otherAuthorityDesignation: '',
    categoryCertNo: 'NCLCO/2025/81221',
    categoryIssueDate: '2025-02-06',
    categoryAuthority: 'RO',
    categoryOtherAuthority: '',
    
    // Service Details
    departmentName: 'DFDFD',
    officeOrderNo: 'DFDFDF',
    experienceCert: null,
    agreementCopy: null,
    
    // Additional Details
    isWardOfFreedomFighter: 'NO',
    freedomFighterCertNo: '',
    freedomFighterAuthority: '',
    nationality: 'INDIAN',
    hasAadharCard: 'YES',
    aadharCardNumber: '689393252547',
    typeOfPhotoIdProof: 'Aadhaar Card',
    idProofNo: '689393252547',
    identificationMark: 'MOLE ON THE LEFT PALM',
    isDebarred: 'NO',
    debarredCommissionName: '',
    debarredFromDate: '',
    debarredToDate: '',
    
    // Correspondence Address
    corrAddress: 'HOUSE NO.- 33, GOLA ROAD JHAKHARI MAHADEV DANAPUR',
    corrVillage: 'JHAKHARI MAHADEV',
    corrPoliceStation: 'DANAPUR THANA',
    corrPostOffice: 'DANAPUR',
    corrState: 'BIHAR',
    corrDistrict: 'PATNA',
    corrPinCode: '801503',

    // Permanent Address
    sameAsCorrespondence: true,
    permAddress: 'HOUSE NO.- 33, GOLA ROAD JHAKHARI MAHADEV DANAPUR',
    permVillage: 'JHAKHARI MAHADEV',
    permPoliceStation: 'DANAPUR THANA',
    permPostOffice: 'DANAPUR',
    permState: 'BIHAR',
    permDistrict: 'PATNA',
    permPinCode: '801503',
  });

  // Handle active session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      // Sync address block properties safely if checkbox is marked
      if (updated.sameAsCorrespondence && name.startsWith('corr')) {
        const targetField = name.replace('corr', 'perm') as keyof FormState;
        (updated as any)[targetField] = value;
      }
      return updated;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setFormData((prev) => ({
      ...prev,
      sameAsCorrespondence: checked,
      ...(checked ? {
        permAddress: prev.corrAddress,
        permVillage: prev.corrVillage,
        permPoliceStation: prev.corrPoliceStation,
        permPostOffice: prev.corrPostOffice,
        permState: prev.corrState,
        permDistrict: prev.corrDistrict,
        permPinCode: prev.corrPinCode,
      } : {})
    }));
  };

  const steps = [
    { number: 1, label: 'PERSONAL DETAILS', status: 'completed' },
    { number: 2, label: 'PAYMENT PROCESS', status: 'pending' },
    { number: 3, label: 'EDUCATIONAL DETAILS', status: 'pending' },
    { number: 4, label: 'PHOTO AND SIGNATURE', status: 'pending' },
    { number: 5, label: 'UPLOAD LIVE PHOTO', status: 'pending' },
    { number: 6, label: 'APPLICATION SLIP', status: 'pending' },
  ];

  return (
    <div className="w-full bg-[#FAFBFD] font-sans text-[11px] text-black antialiased select-none md:text-xs">
      
      {/* 1. TOP AUTHENTICATION HEADER BANNER */}
      <div className="flex flex-col justify-between bg-[#000080] px-4 py-2.5 font-bold text-white sm:flex-row sm:items-center lg:px-6">
        <div className="tracking-wide text-center sm:text-left">
          REGISTRATION NUMBER : <span className="text-[13px] md:text-base">5250000005</span>
        </div>
        <div className="mt-2 flex justify-center gap-6 text-[11px] underline sm:mt-0 md:text-[13px]">
          <a href="#home" className="hover:text-gray-200 transition-colors">GO TO HOME PAGE</a>
          <a href="#logout" className="hover:text-gray-200 transition-colors">MOVE TO LOGOUT PAGE</a>
        </div>
      </div>

      {/* WARNING / ALERT HEADER STATS */}
      <div className="flex flex-col justify-between bg-white border-b border-gray-100 px-4 py-3 font-bold sm:flex-row sm:items-center lg:px-6">
        <div className="text-center text-[#FF0000] tracking-wide sm:text-left">
          YOUR CURRENT SESSION WILL EXPIRE IN {formatTime(timeLeft)} MINUTES
        </div>
        <div className="mt-1 text-center text-[#FF0000] text-[10px] font-bold sm:mt-0 sm:text-right md:text-xs">
          * MARKED FIELDS ARE MANDATORY
        </div>
      </div>

      {/* 2. CHEVRON PROGRESS PIPELINE STEP CHIPS */}
      <div className="bg-[#FAFBFD] p-4 lg:p-5 border-b border-gray-200">
        <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap xl:gap-x-4 xl:gap-y-4">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            return (
              <div key={step.number} className="relative flex items-center h-10 min-w-[220px] xl:w-[23%] flex-1 shadow-sm">
                <div 
                  className={`flex items-center w-full h-full pl-5 pr-6 font-black text-[11px] md:text-xs tracking-wider transition-colors ${
                    isCompleted ? 'bg-[#00FF00] text-[#000080]' : 'bg-[#FFA500] text-[#000080]'
                  }`}
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 12px 50%)',
                    marginLeft: step.number === 1 || step.number === 5 ? '0' : '-4px'
                  }}
                >
                  <span className="whitespace-nowrap uppercase">STEP {step.number} &nbsp;{step.label}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-center font-bold text-black border border-dashed border-gray-300 p-2 bg-white rounded-sm">
          <p className="text-[11px] tracking-wide uppercase">
            IF YOU HAVE RECEIVED REGISTRATION NO.: <span className="font-extrabold text-xs">5250000005</span> AT YOUR REGISTERED MOBILE NO THEN PROCEED OTHERWISE CLICK LOGOUT BUTTON ABOVE.
          </p>
          <p className="mt-1 text-[11px] font-medium text-gray-800">
            यदि आपको अपने पंजीकृत मोबाईल पर पंजीकरण संख्या: <span className="font-extrabold">5250000005</span> प्राप्त हुआ है तो आगे बढ़े अन्यथा ऊपर दिए गए लॉगआउट(LOGOUT) बटन को क्लिक करें।
          </p>
        </div>
      </div>

      {/* SECTION BLOCK PIECE TITLE BRANDING */}
      <div className="bg-white px-4 pt-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-1">
          <div className="flex items-center gap-2 rounded-r-full bg-[#000080] py-1.5 pl-4 pr-8 font-bold text-white tracking-wider text-xs shadow-sm">
            PERSONAL DETAILS
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] font-black text-[#000080]">➔</span>
          </div>
          <div className="text-[10px] font-bold text-[#FF0000] md:text-xs tracking-tight">
            * MARKED FIELDS ARE MANDATORY
          </div>
        </div>
      </div>

      {/* 3. CORE PERSONAL METADATA FIELD CONTAINER ROWS */}
      <div className="bg-white px-4 py-4 space-y-3 max-w-6xl mx-auto">
        {/* Name matrix Row */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4">
            NAME OF APPLICANT (आवेदक का नाम) :
          </div>
          <div className="mt-0.5 font-extrabold text-sm uppercase tracking-wide sm:mt-0 sm:w-1/2 sm:pl-2 text-gray-900">
            NANCY KUMARI GUPTA
          </div>
        </div>

        {/* Father name entry */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4">
            <span className="text-[#FF0000] font-black">*</span> FATHER'S NAME (पिता का नाम) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 uppercase font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm shadow-inner"
            />
          </div>
        </div>

        {/* Mother name entry */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4">
            <span className="text-[#FF0000] font-black">*</span> MOTHER'S NAME (माता का नाम) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 uppercase font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm shadow-inner"
            />
          </div>
        </div>

        {/* Binary Static Gender info tags */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4">
            GENDER(लिंग) :
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            FEMALE
          </div>
        </div>

        {/* Bihar Domicile State tag indicators */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            DOMICILE OF BIHAR STATE? (बिहार राज्य का निवासी) :
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            YES
          </div>
        </div>

        {/* Issue Date Picker config */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            <span className="text-[#FF0000] font-black">*</span> ISSUE DATE OF DOMICILE CERTIFICATE (स्थायी निवास प्रमाण पत्र जारी करने की तिथि) :
          </div>
          <div className="mt-0.5 flex items-center gap-1 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="date"
              name="domicileIssueDate"
              value={formData.domicileIssueDate}
              onChange={handleChange}
              className="w-full max-w-[180px] border border-[#7EA4CC] bg-white px-2 py-1 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
            />
          </div>
        </div>

        {/* Issue Cert code number string */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            <span className="text-[#FF0000] font-black">*</span> ISSUE NUMBER OF DOMICILE CERTIFICATE (स्थायी निवास प्रमाणपत्र संख्या) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="text"
              name="domicileCertNo"
              value={formData.domicileCertNo}
              onChange={handleChange}
              className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
            />
          </div>
        </div>

        {/* Dropdown Issuing authority parameter selectors */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            <span className="text-[#FF0000] font-black">*</span> DOMICILE CERTIFICATE ISSUING COMPETENT AUTHORITY (स्थायी निवास प्रमाण पत्र जारी करने वाला प्राधिकार) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <select
              name="domicileAuthority"
              value={formData.domicileAuthority}
              onChange={handleChange}
              className="w-full max-w-[100px] border border-[#7EA4CC] bg-white px-1.5 py-0.5 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm font-semibold"
            >
              <option value="RO">RO</option>
              <option value="SDO">SDO</option>
              <option value="DM">DM</option>
            </select>
          </div>
        </div>

        {/* Designation selector with locked disabled styling states */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            <span className="text-[#FF0000] font-black">*</span> DESIGNATION OF OTHER AUTHORITY (अन्य प्राधिकार का पदनाम) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="text"
              name="otherAuthorityDesignation"
              disabled
              value={formData.otherAuthorityDesignation}
              onChange={handleChange}
              className="w-full max-w-md border border-[#C5C7A5] bg-[#D4D6B9] px-2 py-1 cursor-not-allowed rounded-sm"
            />
          </div>
        </div>

        {/* Category metadata arrays */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4">
            CATEGORY(श्रेणी) :
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            EBC
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4">
            CASTE (जाति) :
          </div>
          <div className="mt-0.5 font-extrabold sm:mt-0 sm:w-1/2 sm:pl-2 text-gray-900">
            TANTI (TATWA)/तांती(ततवा)
          </div>
        </div>

        {/* NCLC Question blocks */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            DO YOU BELONG TO NON-CREAMY LAYER ? ( क्या आप क्रीमीलेयर रहित से संबंधित हैं? ) :
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            YES
          </div>
        </div>

        {/* Combined categorization text tracking arrays */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 text-[10px] sm:text-[11px] leading-tight">
            (EBC/BC-NCLC CERTIFICATE NUMBER)/(SC/ST-CASTE CERTIFICATE NUMBER)/(EWS-CERTIFICATE NUMBER) <br />
            <span className="font-medium text-gray-600">(एमबीसी/बीसी-एनसीएलसी प्रमाणपत्र संख्या)/(एससी/एसटी-जाति प्रमाणपत्र संख्या)/(ईडब्ल्यूएस-प्रमाणपत्र संख्या) :</span>
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="text"
              name="categoryCertNo"
              value={formData.categoryCertNo}
              onChange={handleChange}
              className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            ISSUE DATE OF CERTIFICATE (प्रमाण पत्र जारी करने की तिथि) :
          </div>
          <div className="mt-0.5 flex items-center gap-1 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="date"
              name="categoryIssueDate"
              value={formData.categoryIssueDate}
              onChange={handleChange}
              className="w-full max-w-[180px] border border-[#7EA4CC] bg-white px-2 py-1 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            CERTIFICATE ISSUING AUTHORITY ( प्रमाण पत्र जारी करने वाला प्राधिकार) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <select
              name="categoryAuthority"
              value={formData.categoryAuthority}
              onChange={handleChange}
              className="w-full max-w-[100px] border border-[#7EA4CC] bg-white px-1.5 py-0.5 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm font-semibold"
            >
              <option value="RO">RO</option>
              <option value="SDO">SDO</option>
              <option value="DM">DM</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            <span className="text-[#FF0000] font-black">*</span> CERTIFICATE OTHER ISSUING COMPETENT AUTHORITY (प्रमाण पत्र जारी करने वाला अन्य प्राधिकार) :
          </div>
          <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
            <input
              type="text"
              name="categoryOtherAuthority"
              value={formData.categoryOtherAuthority}
              onChange={handleChange}
              className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
            />
          </div>
        </div>

        {/* PWD Disablity details parameters */}
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            ARE YOU PERSON WITH DISABILITY? (क्या आप दिव्यांगता (PWD) वाले व्यक्ति हैं?):
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            NO
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            NATURE OF DISABILITY? (दिव्यांगता की प्रकृति):
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2 text-gray-700">
            NA
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            ARE YOU A PERSON WITH MINIMUM 40% DISABILITY(PWD)? (क्या आप न्यूनतम 40% दिव्यांगता (PWD) वाले व्यक्ति हैं?):
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            NO
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            ARE YOU AN EX-SERVICEMAN? (क्या आप भूतपूर्व सैनिक हैं?):
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            NO
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
            ARE YOU NCC FULL TIME CADET/INSTRUCTOR? (क्या आप एनसीसी के पूर्णकालिक कैडेट/अनुदेशक हैं?):
          </div>
          <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
            NO
          </div>
        </div>
      </div>

      {/* Service Details Section */}
      <div className="bg-white px-4 py-4 max-w-6xl mx-auto border-t border-gray-200">
        <div className="space-y-3">
          
          {/* Row: NCC Certificate */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              ENTER NCC 'C' CERTIFICATE NO. <br />
              <span className="font-medium text-gray-600">(एनसीसी 'सी' प्रमाणपत्र संख्या दर्ज करें!) :</span>
            </div>
            <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2 min-h-[16px]">
              {/* Blank space/Value as per image */}
            </div>
          </div>

          {/* Row: Bihar Govt Employee */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              ARE YOU BIHAR GOVERNMENT EMPLOYEE WHO HAS RENDERED NOT LESS THAN 3 YEARS REGULAR AND CONTINUOUS SERVICE? <br />
              <span className="font-medium text-gray-600">(क्या आप बिहार सरकार के कर्मचारी हैं जिन्होंने कम से कम तीन साल नियमित एवं लगातार सेवा की है?) :</span>
            </div>
            <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
              NO
            </div>
          </div>

          {/* Row: Number of Attempts */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              IN BSSC EXAMS NUMBER OF ATTEMPTS AFTER 12-12-2022 <br />
              <span className="font-medium text-gray-600">(दिनांक 12-12-2022 के बाद बिहार कर्मचारी चयन आयोग की परीक्षाओं में प्रयासों की संख्या) :</span>
            </div>
            <div className="mt-0.5 font-extrabold sm:mt-0 sm:w-1/2 sm:pl-2">
              00
            </div>
          </div>

          {/* Row: Contractual Employee */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              ARE YOU A CONTRACTUAL EMPLOYEE ON ANY OF THE POSTS MENTIONED IN THE ADVERTISEMENT IN THE BIHAR GOVERNMENT? <br />
              <span className="font-medium text-gray-600">(क्या आप बिहार सरकार में विज्ञापन में उल्लेखित पदों में से किसी पद पर संविदा नियोजित कर्मी हैं?) :</span>
            </div>
            <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
              YES
            </div>
          </div>

          {/* Subtle Section Break line mimicking image gap layout */}
          <div className="my-4 border-t border-gray-300 opacity-60"></div>

          {/* Row: Name of Post */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              NAME OF POST <br />
              <span className="font-medium text-gray-600">(पद का नाम) :</span>
            </div>
            <div className="mt-0.5 font-extrabold text-gray-900 sm:mt-0 sm:w-1/2 sm:pl-2 text-sm">
              योजना सहायक
            </div>
          </div>

          {/* Row: Circular Agreement */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              DO YOU HAVE AGREEMENT IN THE LIGHT OF CIRCULAR NO. - 1003, DATED - 22.01.2021 OF GENERAL ADMINISTRATION DEPARTMENT, BIHAR, PATNA? <br />
              <span className="font-medium text-gray-600">(क्या आपके पास सामान्य प्रशासन विभाग, बिहार, पटना के संकल्प ज्ञापंक - 1003, दिनांक - 22.01.2021 के आलोक में एकरारनामा है? ) :</span>
            </div>
            <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2">
              YES
            </div>
          </div>

          {/* Row: Experience Duration */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              CONTRACTUAL SERVICE PERIOD IN BIHAR GOVERNMENT ON MENTIONED POSTS ? <br />
              <span className="font-medium text-gray-600">(उल्लिखित पद पर बिहार सरकार में संविदा सेवा अवधि) :</span>
            </div>
            <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2 tracking-wide text-gray-900">
              YEARS:14 MONTHS:09 DAYS:14
            </div>
          </div>

          {/* Row: Name of Department Input */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> NAME OF DEPARTMENT/OFFICE <br />
              <span className="font-medium text-gray-600">(विभाग/ कार्यालय का नाम) :</span>
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleChange}
                className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 uppercase font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm shadow-inner"
              />
            </div>
          </div>

          {/* Row: Office Order Number Input */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> OFFICE ORDER NUMBER <br />
              <span className="font-medium text-gray-600">(कार्यालय आदेश संख्या) :</span>
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="text"
                name="officeOrderNo"
                value={formData.officeOrderNo}
                onChange={handleChange}
                className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 uppercase font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm shadow-inner"
              />
            </div>
          </div>

          {/* Row: Experience Certificate Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> UPLOAD CONTRACTUAL EXPERIENCE CERTIFICATE <br />
              <span className="text-[#FF0000] font-bold">(PDF FILE SIZE BETWEEN 50KB TO 1 MB!):</span>
            </div>
            <div className="mt-1 flex items-center sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="file"
                name="experienceCert"
                accept=".pdf"
                onChange={handleFileChange}
                className="text-[11px] file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border file:border-gray-400 file:text-[11px] file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer"
              />
            </div>
          </div>

          {/* Row: Agreement Copy Upload */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> UPLOAD AGREEMENT COPY <br />
              <span className="text-[#FF0000] font-bold">(PDF FILE SIZE BETWEEN 50KB TO 1 MB!):</span>
            </div>
            <div className="mt-1 flex items-center sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="file"
                name="agreementCopy"
                accept=".pdf"
                onChange={handleFileChange}
                className="text-[11px] file:mr-3 file:py-1 file:px-3 file:rounded-sm file:border file:border-gray-400 file:text-[11px] file:font-semibold file:bg-gray-100 hover:file:bg-gray-200 file:cursor-pointer"
              />
            </div>
          </div>

          {/* Row: Educational Qualification Confirmation */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              DO YOU HAVE EDUCATIONAL AND TECHNICAL QUALIFICATION AS PER ADVERTISEMENT ? <br />
              <span className="font-medium text-gray-600">(क्या आपके पास विज्ञापन के अनुसार शैक्षणिक और तकनीकी योग्यता है?):</span>
            </div>
            <div className="mt-0.5 font-extrabold uppercase sm:mt-0 sm:w-1/2 sm:pl-2 min-h-[16px]">
              {/* Value context space */}
            </div>
          </div>

          {/* Row: Email ID */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              EMAIL ID (ईमेल आईडी) :
            </div>
            <div className="mt-0.5 font-extrabold sm:mt-0 sm:w-1/2 sm:pl-2 text-gray-900 tracking-wide text-xs">
              NANCYGUPTA1318@GMAIL.COM
            </div>
          </div>

          {/* Row: Date of Birth */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              DATE OF BIRTH <br />
              <span className="font-medium text-gray-600">(जन्म तिथि) :</span>
            </div>
            <div className="mt-0.5 font-extrabold sm:mt-0 sm:w-1/2 sm:pl-2 text-gray-900 text-xs">
              18-10-2000
            </div>
          </div>

        </div>
      </div>

      {/* Additional Details Section */}
      <div className="bg-white px-4 py-4 max-w-6xl mx-auto border-t border-gray-200">
        <div className="space-y-3">
          
          {/* Header Metadata Display */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-center">
            <div className="text-center font-bold text-gray-900 tracking-wide">
              AGE ON 01-08-2025 (उम्र) : <span className="font-extrabold text-sm md:text-base">24 YEARS, 9 MONTHS, 14 DAYS</span>
            </div>
          </div>

          {/* Row: Ward of Freedom Fighter */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> WARD OF FREEDOM FIGHTER? <br />
              <span className="font-medium text-gray-600">(स्वतंत्रता सेनानी के आश्रित?):</span>
            </div>
            <div className="mt-1 flex items-center gap-4 sm:mt-0 sm:w-1/2 sm:pl-2">
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="isWardOfFreedomFighter"
                  value="YES"
                  checked={formData.isWardOfFreedomFighter === 'YES'}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                YES
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="isWardOfFreedomFighter"
                  value="NO"
                  checked={formData.isWardOfFreedomFighter === 'NO'}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                NO
              </label>
            </div>
          </div>

          {/* Row: Freedom Fighter Certificate Number (Disabled Condition) */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              WARD OF FREEDOM FIGHTER CERTIFICATE NUMBER <br />
              <span className="font-medium text-gray-600">(प्रमाणपत्र संख्या) :</span>
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="text"
                name="freedomFighterCertNo"
                disabled={formData.isWardOfFreedomFighter === 'NO'}
                value={formData.freedomFighterCertNo}
                onChange={handleChange}
                className="w-full max-w-md border border-[#C5C7A5] bg-[#D4D6B9] px-2 py-1 cursor-not-allowed rounded-sm disabled:opacity-90"
              />
            </div>
          </div>

          {/* Row: Freedom Fighter Issuing Authority (Disabled Condition) */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              WARD OF FREEDOM FIGHTER CERTIFICATE ISSUING AUTHORITY <br />
              <span className="font-medium text-gray-600">(स्वतंत्रता सेनानी प्रमाण पत्र जारी करने वाला प्राधिकार):</span>
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <select
                name="freedomFighterAuthority"
                disabled={formData.isWardOfFreedomFighter === 'NO'}
                value={formData.freedomFighterAuthority}
                onChange={handleChange}
                className="w-full max-w-[150px] border border-[#C5C7A5] bg-[#D4D6B9] px-1 py-0.5 text-gray-600 cursor-not-allowed rounded-sm"
              >
                <option value="">--Select--</option>
              </select>
            </div>
          </div>

          {/* Row: Nationality */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> NATIONALITY (राष्ट्रीयता) :
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                className="w-full max-w-[100px] border border-[#7EA4CC] bg-white px-1.5 py-0.5 font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
              >
                <option value="INDIAN">INDIAN</option>
              </select>
            </div>
          </div>

          {/* Row: Do you have Aadhar Card */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> DO YOU HAVE AADHAR CARD? <br />
              <span className="font-medium text-gray-600">(क्या आपके पास आधार कार्ड है?):</span>
            </div>
            <div className="mt-1 flex items-center gap-4 sm:mt-0 sm:w-1/2 sm:pl-2">
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="hasAadharCard"
                  value="YES"
                  checked={formData.hasAadharCard === 'YES'}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                YES
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="hasAadharCard"
                  value="NO"
                  checked={formData.hasAadharCard === 'NO'}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                NO
              </label>
            </div>
          </div>

          {/* Row: Aadhar Card Number */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              AADHAR CARD NUMBER <br />
              <span className="font-medium text-gray-600">(आधार कार्ड संख्या) :</span>
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="text"
                name="aadharCardNumber"
                value={formData.aadharCardNumber}
                onChange={handleChange}
                className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm shadow-inner"
              />
            </div>
          </div>

          {/* Row: Type of Photo Id Proof */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> TYPE OF PHOTO ID PROOF (फोटो पहचान प्रमाण का प्रकार):
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <select
                name="typeOfPhotoIdProof"
                value={formData.typeOfPhotoIdProof}
                onChange={handleChange}
                className="w-full max-w-[150px] border border-[#7EA4CC] bg-white px-1.5 py-0.5 text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
              >
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Voter ID Card">Voter ID Card</option>
                <option value="PAN Card">PAN Card</option>
              </select>
            </div>
          </div>

          {/* Row: ID Proof No with Subtext Notice */}
          <div className="flex flex-col sm:flex-row">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 pt-1 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> ID PROOF NO (पहचान प्रमाण संख्या):
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2 flex flex-col">
              <input
                type="text"
                name="idProofNo"
                value={formData.idProofNo}
                onChange={handleChange}
                className="w-full max-w-md border border-[#7EA4CC] bg-white px-2 py-1 font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
              />
              <span className="text-[#D01A3B] text-[10px] font-bold mt-0.5 tracking-wide uppercase">
                [AADHAAR CARD/VOTER ID CARD/DRIVING LICENSE/PAN CARD/PASSPORT]
              </span>
            </div>
          </div>

          {/* Row: Identification Mark */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> IDENTIFICATION MARK OF THE CANDIDATE <br />
              <span className="font-medium text-gray-600">(उम्मीदवार के पहचान चिह्न):</span>
            </div>
            <div className="mt-0.5 sm:mt-0 sm:w-1/2 sm:pl-2">
              <input
                type="text"
                name="identificationMark"
                value={formData.identificationMark}
                onChange={handleChange}
                className="w-full max-w-sm border border-[#7EA4CC] bg-white px-2 py-1 uppercase font-semibold text-gray-800 focus:border-blue-600 focus:outline-none rounded-sm"
              />
            </div>
          </div>

          {/* Row: Have you ever been debarred */}
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              <span className="text-[#FF0000] font-black">*</span> HAVE YOU EVER BEEN DEBARRED FROM ANY COMPETITIVE EXAMINATION (UPSC/STATE COMMISSION/OTHER SELECTION COMMISSION). <br />
              <span className="font-medium text-gray-600">(क्या आपको कभी किसी प्रतियोगिता परीक्षा (यू०पी०एस०सी०/राज्य आयोग/अन्य चयन आयोग) से वंचित किया गया है?):</span>
            </div>
            <div className="mt-1 flex items-center gap-4 sm:mt-0 sm:w-1/2 sm:pl-2">
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="isDebarred"
                  value="YES"
                  checked={formData.isDebarred === 'YES'}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                YES
              </label>
              <label className="flex items-center gap-1 font-bold cursor-pointer">
                <input
                  type="radio"
                  name="isDebarred"
                  value="NO"
                  checked={formData.isDebarred === 'NO'}
                  onChange={handleChange}
                  className="h-3.5 w-3.5 border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                NO
              </label>
            </div>
          </div>

          {/* Complex Multi-Input Block: Name of Commission & Date ranges */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="text-left font-bold text-gray-800 sm:w-1/2 sm:text-right sm:pr-4 leading-tight">
              NAME OF UPSC/STATE COMMISSION/OTHER SELECTION COMMISSION. <br />
              <span className="font-medium text-gray-600">(यू०पी०एस०सी०/राज्य आयोग/अन्य चयन आयोग का नाम):</span>
            </div>
            <div className="mt-1 sm:mt-0 sm:w-1/2 sm:pl-2 flex flex-col lg:flex-row items-start lg:items-center gap-2 w-full">
              <input
                type="text"
                name="debarredCommissionName"
                disabled={formData.isDebarred === 'NO'}
                value={formData.debarredCommissionName}
                onChange={handleChange}
                className="w-full max-w-xs border border-[#C5C7A5] bg-[#D4D6B9] px-2 py-1 rounded-sm cursor-not-allowed"
              />
              
              <div className="flex items-center gap-2 mt-1 lg:mt-0">
                <span className="font-bold shrink-0">FROM:</span>
                <input
                  type="date"
                  name="debarredFromDate"
                  disabled={formData.isDebarred === 'NO'}
                  value={formData.debarredFromDate}
                  onChange={handleChange}
                  className="w-[110px] border border-[#C5C7A5] bg-[#D4D6B9] px-1 py-0.5 rounded-sm cursor-not-allowed"
                />

                <span className="font-bold shrink-0">TO:</span>
                <input
                  type="date"
                  name="debarredToDate"
                  disabled={formData.isDebarred === 'NO'}
                  value={formData.debarredToDate}
                  onChange={handleChange}
                  className="w-[110px] border border-[#C5C7A5] bg-[#D4D6B9] px-1 py-0.5 rounded-sm cursor-not-allowed"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 4. ADDRESS COMPARISON GRID STRUCTURE PANEL */}
      <div className="mx-auto max-w-7xl px-4 py-6 border-t border-gray-200 bg-white">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Column A: Correspondence Block */}
          <div className="space-y-3">
            <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider border-b border-gray-200 pb-1.5">
              CORRESPONDENCE ADDRESS (पत्राचार का पता)
            </h3>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> ADDRESS(पता):</span>
              <textarea
                name="corrAddress"
                rows={3}
                value={formData.corrAddress}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] p-2 text-gray-800 uppercase font-semibold focus:outline-none rounded-sm resize-none shadow-inner"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> VILLAGE/MOHALLA (गांव/मोहल्ला):</span>
              <input
                type="text"
                name="corrVillage"
                value={formData.corrVillage}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] px-2 py-1 uppercase font-semibold text-gray-800 focus:outline-none rounded-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> POLICE STATION (पुलिस स्टेशन):</span>
              <input
                type="text"
                name="corrPoliceStation"
                value={formData.corrPoliceStation}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] px-2 py-1 uppercase font-semibold text-gray-800 focus:outline-none rounded-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> POST OFFICE(डाक घर):</span>
              <input
                type="text"
                name="corrPostOffice"
                value={formData.corrPostOffice}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] px-2 py-1 uppercase font-semibold text-gray-800 focus:outline-none rounded-sm"
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> STATE(राज्य):</span>
              <select
                name="corrState"
                value={formData.corrState}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] px-1.5 py-1 font-semibold text-gray-800 focus:outline-none rounded-sm"
              >
                <option value="BIHAR">BIHAR</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> DISTRICT(जिला):</span>
              <select
                name="corrDistrict"
                value={formData.corrDistrict}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] px-1.5 py-1 font-semibold text-gray-800 focus:outline-none rounded-sm"
              >
                <option value="PATNA">PATNA</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800">PIN CODE(पिन कोड):</span>
              <input
                type="text"
                name="corrPinCode"
                value={formData.corrPinCode}
                onChange={handleChange}
                className="w-full border border-[#7EA4CC] px-2 py-1 font-semibold text-gray-800 focus:outline-none rounded-sm"
              />
            </div>
          </div>

          {/* Column B: Permanent Address Block */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-200 pb-1">
              <h3 className="text-xs font-black uppercase text-gray-900 tracking-wider">
                PERMANENT(स्थायी पता)
              </h3>
              <label className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sameAsCorrespondence}
                  onChange={handleCheckboxChange}
                  className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                (SAME AS CORRESPONDENCE ADDRESS [यदि पत्राचार एवं स्थायी पता एक है])
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> ADDRESS(पता):</span>
              <textarea
                name="permAddress"
                rows={3}
                disabled={formData.sameAsCorrespondence}
                value={formData.permAddress}
                onChange={handleChange}
                className={`w-full border p-2 text-gray-800 uppercase font-semibold focus:outline-none rounded-sm resize-none shadow-inner ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> VILLAGE/MOHALLA (गांव/मोहल्ला):</span>
              <input
                type="text"
                name="permVillage"
                disabled={formData.sameAsCorrespondence}
                value={formData.permVillage}
                onChange={handleChange}
                className={`w-full border px-2 py-1 uppercase font-semibold text-gray-800 focus:outline-none rounded-sm ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> POLICE STATION (पुलिस स्टेशन):</span>
              <input
                type="text"
                name="permPoliceStation"
                disabled={formData.sameAsCorrespondence}
                value={formData.permPoliceStation}
                onChange={handleChange}
                className={`w-full border px-2 py-1 uppercase font-semibold text-gray-800 focus:outline-none rounded-sm ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> POST OFFICE(डाक घर):</span>
              <input
                type="text"
                name="permPostOffice"
                disabled={formData.sameAsCorrespondence}
                value={formData.permPostOffice}
                onChange={handleChange}
                className={`w-full border px-2 py-1 uppercase font-semibold text-gray-800 focus:outline-none rounded-sm ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              />
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> STATE(राज्य):</span>
              <select
                name="permState"
                disabled={formData.sameAsCorrespondence}
                value={formData.permState}
                onChange={handleChange}
                className={`w-full border px-1.5 py-1 font-semibold text-gray-800 focus:outline-none rounded-sm ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              >
                <option value="BIHAR">BIHAR</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800"><span className="text-red-600 font-bold">*</span> DISTRICT(जिला):</span>
              <select
                name="permDistrict"
                disabled={formData.sameAsCorrespondence}
                value={formData.permDistrict}
                onChange={handleChange}
                className={`w-full border px-1.5 py-1 font-semibold text-gray-800 focus:outline-none rounded-sm ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              >
                <option value="PATNA">PATNA</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <span className="font-bold text-gray-800">PIN CODE(पिन कोड):</span>
              <input
                type="text"
                name="permPinCode"
                disabled={formData.sameAsCorrespondence}
                value={formData.permPinCode}
                onChange={handleChange}
                className={`w-full border px-2 py-1 font-semibold text-gray-800 focus:outline-none rounded-sm ${
                  formData.sameAsCorrespondence ? 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed' : 'border-[#7EA4CC]'
                }`}
              />
            </div>
          </div>
        </div>

        {/* 5. SUBMIT COMMAND BUTTON ROW CONTAINER */}
        <div className="mt-8 flex justify-center pb-6">
          <button
            type="submit"
            className="w-full max-w-[280px] bg-[#000080] text-white font-extrabold text-sm tracking-widest uppercase py-2 px-6 rounded-md shadow-md border-b-4 border-blue-900 active:border-b-0 active:translate-y-1 transition-all duration-700 hover:bg-blue-800"
          >
            SUBMIT
          </button>
        </div>
      </div>

      {/* FOOTER SYSTEM BRAND BANNER */}
      <div className="w-full bg-[#000080] py-3 text-center text-white text-[10px] md:text-xs font-bold tracking-wider uppercase border-t border-blue-900">
        BIHAR STAFF SELECTION COMMISSION, BIHAR
      </div>
    </div>
  );
};

export default PersonalDetailsForm;