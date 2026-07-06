import React, { useState } from 'react';

// Define the structure for our table rows
interface QualificationRow {
  level: string;
  levelHindi: string;
  subjects: string;
  board: string;
  totalMarks: string;
  obtainedMarks: string;
  percentage: string;
  certificateNo: string;
  issueDate: string;
  required?: boolean;
}

export const Qualification: React.FC = () => {
  // State for form fields
  const [rows, setRows] = useState<QualificationRow[]>([
    {
      level: '10TH / EQUIVALENT',
      levelHindi: '10 वीं / समकक्ष',
      subjects: 'HINDI ENGLISH\nMATHS SCIENCE\nSOCIAL SCIENCE',
      board: 'CBSE',
      totalMarks: '10',
      obtainedMarks: '9.8',
      percentage: '90.00',
      certificateNo: 'SSE/2016/13500',
      issueDate: '28-05-2016',
      required: true,
    },
    {
      level: '12TH/10TH +2/EQUIVALENT',
      levelHindi: '12वीं/10वीं +2/समकक्ष',
      subjects: 'MATHS PHYSICS\nCHEMISTRY ENGLISH\nECONOMICS',
      board: 'CBSE',
      totalMarks: '500',
      obtainedMarks: '389',
      percentage: '77.80',
      certificateNo: 'SSCE/2018/0985',
      issueDate: '26-05-2018',
      required: true,
    },
    {
      level: 'GRADUATION/EQUIVALENT',
      levelHindi: 'स्नातक/समकक्ष',
      subjects: 'MATHEMATICS',
      board: 'PATNA UNIVERSITY',
      totalMarks: '800',
      obtainedMarks: '504',
      percentage: '63.00',
      certificateNo: '21203/146',
      issueDate: '20-10-2021',
      required: true,
    },
  ]);

  const handleInputChange = (index: number, field: keyof QualificationRow, value: string) => {
    const updatedRows = [...rows];
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    setRows(updatedRows);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted Data:', rows);
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white border border-gray-300 shadow-sm font-sans text-[13px] text-black antialiased">
      
      {/* Top Navy Blue Header Banner */}
      <div className="bg-[#001f66] text-white px-4 py-2 flex flex-col sm:flex-row justify-between items-center font-bold tracking-wide border-b-4 border-[#3366cc]">
        <div>REGISTRATION NUMBER : 5250000005</div>
        <div className="flex gap-6 mt-1 sm:mt-0 text-[12px] underline decoration-1 underline-offset-2">
          <a href="#home" className="hover:text-gray-200">GO TO HOME PAGE</a>
          <a href="#logout" className="hover:text-gray-200">MOVE TO LOGOUT PAGE</a>
        </div>
      </div>

      <div className="p-4">
        {/* Warning / Status Messages */}
        <div className="flex flex-col sm:flex-row justify-between items-center font-bold text-[13px] mb-6 px-2">
          <span className="text-red-600 tracking-wider">YOUR CURRENT SESSION WILL EXPIRE IN 20 MINUTES</span>
          <span className="text-red-600 mt-1 sm:mt-0">* MARKED FIELDS ARE MANDATORY</span>
        </div>

        {/* Wizard Progress Steps */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-3 mb-8 px-1">
          {/* Active/Done Steps (Green Chevron Style) */}
          <div className="relative bg-[#00ff66] text-black font-bold text-center py-1.5 px-3 uppercase tracking-tight text-[11px] border border-emerald-400 shadow-sm">
            Step 1 Personal Details
          </div>
          <div className="relative bg-[#00ff66] text-black font-bold text-center py-1.5 px-3 uppercase tracking-tight text-[11px] border border-emerald-400 shadow-sm">
            Step 2 Payment Process
          </div>
          <div className="relative bg-[#00ff66] text-black font-bold text-center py-1.5 px-3 uppercase tracking-tight text-[11px] border border-emerald-400 shadow-sm">
            Step 3 Educational Details
          </div>
          {/* Upcoming Steps (Orange Chevron Style) */}
          <div className="relative bg-[#ff9900] text-black font-bold text-center py-1.5 px-3 uppercase tracking-tight text-[11px] border border-amber-500 shadow-sm">
            Step 4 Photo and Signature
          </div>
          <div className="relative bg-[#ff9900] text-black font-bold text-center py-1.5 px-3 uppercase tracking-tight text-[11px] border border-amber-500 shadow-sm">
            Step 5 Upload Live Photo
          </div>
          <div className="relative bg-[#ff9900] text-black font-bold text-center py-1.5 px-3 uppercase tracking-tight text-[11px] border border-amber-500 shadow-sm">
            Step 6 Application Slip
          </div>
        </div>

        {/* Instructions Banner */}
        <div className="bg-gray-50 border border-gray-200 p-3 text-center rounded-sm mb-6 leading-relaxed">
          <p className="font-bold text-black text-[13px] tracking-wide">
            IF YOU HAVE RECEIVED REGISTRATION NO.: <span className="underline">5250000005</span> AT YOUR REGISTERED MOBILE NO THEN PROCEED OTHERWISE CLICK LOGOUT BUTTON ABOVE.
          </p>
          <p className="font-bold text-black text-[13px] mt-0.5 font-hindi">
            यदि आपको अपने पंजीकृत मोबाईल पर पंजीकरण संख्या: <span className="underline">5250000005</span> प्राप्त हुआ है तो आगे बढ़े अन्यथा ऊपर दिए गए लॉगआउट(LOGOUT) बटन को क्लिक करें।
          </p>
        </div>

        {/* Section Title Accordion Heading */}
        <div className="bg-[#000080] text-white flex items-center justify-between px-4 py-1.5 rounded-t-sm font-bold text-[13px] tracking-wide mb-0.5">
          <span>EDUCATIONAL QUALIFICATION</span>
          <div className="bg-white rounded-full p-0.5 flex items-center justify-center w-4 h-4">
            <svg className="w-3 h-3 text-[#000080] fill-current" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
        </div>

        {/* Data Entry Matrix Table */}
        <form onSubmit={handleSubmit} className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-center align-middle font-sans">
            <thead>
              <tr className="bg-white text-[11px] font-bold text-black uppercase tracking-tight">
                <th className="border border-black p-2 w-[15%] min-w-[120px]">EDUCATION<br/><span className="font-normal text-[10px]">(शिक्षा)</span></th>
                <th className="border border-black p-2 w-[18%] min-w-[150px]">SUBJECT<br/><span className="font-normal text-[10px]">(विषय)</span></th>
                <th className="border border-black p-2 w-[18%] min-w-[140px]">BOARD / UNIVERSITY<br/><span className="font-normal text-[10px]">(बोर्ड / विश्वविद्यालय)</span></th>
                <th className="border border-black p-2 w-[10%] min-w-[80px]">TOTAL MARKS/CGPA/CGPA<br/><span className="font-normal text-[10px]">(कुल अंक)</span></th>
                <th className="border border-black p-2 w-[10%] min-w-[80px]">OBTAINED MARKS<br/><span className="font-normal text-[10px]">(प्राप्त अंक)</span></th>
                <th className="border border-black p-2 w-[9%] min-w-[70px]">PERCENTAGE<br/><span className="font-normal text-[10px]">(प्रतिशत)</span></th>
                <th className="border border-black p-2 w-[12%] min-w-[110px]">CERTIFICATE NUMBER/MARK SHEET NUMBER<br/><span className="font-normal text-[10px]">(प्रमाणपत्र संख्या/अंक पत्र संख्या)</span></th>
                <th className="border border-black p-2 w-[13%] min-w-[110px]">CERTIFICATE/MARK SHEET ISSUING DATE<br/><span className="font-normal text-[10px]">(उत्तीर्ण करने की तिथि)</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx} className="bg-white">
                  {/* Row Label Column */}
                  <td className="border border-black p-2 font-bold text-[11px] text-left">
                    {row.required && <span className="text-red-600 mr-0.5">*</span>}
                    {row.level}
                    <div className="font-normal text-[10px] text-gray-700 mt-0.5">{row.levelHindi}</div>
                  </td>
                  
                  {/* Subjects Textarea */}
                  <td className="border border-black p-1.5">
                    <textarea
                      value={row.subjects}
                      onChange={(e) => handleInputChange(idx, 'subjects', e.target.value)}
                      className="w-full h-14 p-1 text-[12px] border border-sky-700 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase"
                    />
                  </td>
                  
                  {/* Board Textarea */}
                  <td className="border border-black p-1.5">
                    <textarea
                      value={row.board}
                      onChange={(e) => handleInputChange(idx, 'board', e.target.value)}
                      className="w-full h-14 p-1 text-[12px] border border-sky-700 font-mono resize-none focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase"
                    />
                  </td>
                  
                  {/* Total Marks */}
                  <td className="border border-black p-1.5">
                    <input
                      type="text"
                      value={row.totalMarks}
                      onChange={(e) => handleInputChange(idx, 'totalMarks', e.target.value)}
                      className="w-full text-center p-1 text-[13px] border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </td>
                  
                  {/* Obtained Marks */}
                  <td className="border border-black p-1.5">
                    <input
                      type="text"
                      value={row.obtainedMarks}
                      onChange={(e) => handleInputChange(idx, 'obtainedMarks', e.target.value)}
                      className="w-full text-center p-1 text-[13px] border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </td>
                  
                  {/* Percentage */}
                  <td className="border border-black p-1.5">
                    <input
                      type="text"
                      value={row.percentage}
                      onChange={(e) => handleInputChange(idx, 'percentage', e.target.value)}
                      className="w-full text-center p-1 text-[13px] border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </td>
                  
                  {/* Certificate Number */}
                  <td className="border border-black p-1.5">
                    <input
                      type="text"
                      value={row.certificateNo}
                      onChange={(e) => handleInputChange(idx, 'certificateNo', e.target.value)}
                      className="w-full p-1 text-[12px] border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500 uppercase"
                    />
                  </td>
                  
                  {/* Issuing Date with pseudo-calendar layout */}
                  <td className="border border-black p-1.5">
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={row.issueDate}
                        onChange={(e) => handleInputChange(idx, 'issueDate', e.target.value)}
                        className="w-full p-1 text-center text-[12px] border border-sky-700 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        placeholder="DD-MM-YYYY"
                      />
                      <button type="button" className="text-gray-400 p-0.5 border border-gray-300 hover:bg-gray-100 bg-white">
                        {/* Inline Calendar Icon Asset */}
                        <svg className="w-3.5 h-3.5 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 3V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Action Submission Button */}
          <div className="flex justify-center mt-8 mb-4">
            <button
              type="submit"
              className="bg-[#000080] hover:bg-[#000066] text-white font-bold tracking-widest text-[16px] px-20 py-2.5 rounded shadow-[1px_2px_4px_rgba(0,0,0,0.4)] border border-blue-900 active:translate-y-0.5 transition-transform uppercase"
            >
              Submit
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};

export default Qualification;