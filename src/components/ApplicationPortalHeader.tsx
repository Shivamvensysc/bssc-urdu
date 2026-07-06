import React, { useState, useEffect } from 'react';

export const ApplicationPortalHeader: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<number>(20 * 60); // 20 minutes in seconds

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

  const steps = [
    { number: 1, label: 'PERSONAL DETAILS', status: 'completed' },
    { number: 2, label: 'PAYMENT PROCESS', status: 'pending' },
    { number: 3, label: 'EDUCATIONAL DETAILS', status: 'pending' },
    { number: 4, label: 'PHOTO AND SIGNATURE', status: 'pending' },
    { number: 5, label: 'UPLOAD LIVE PHOTO', status: 'pending' },
    { number: 6, label: 'APPLICATION SLIP', status: 'pending' },
  ];

  return (
    <div className="w-full bg-white font-sans text-xs select-none antialiased md:text-sm">
      {/* Top Banner */}
      <div className="flex flex-col justify-between bg-[#000080] px-4 py-2.5 font-bold text-white sm:flex-row sm:items-center lg:px-6">
        <div className="tracking-wide text-center sm:text-left">
          REGISTRATION NUMBER : <span className="text-[13px] md:text-base">5250000005</span>
        </div>
        <div className="mt-2 flex justify-center gap-6 text-[11px] underline sm:mt-0 md:text-[13px]">
          <a href="#home" className="hover:text-gray-200 transition-colors">GO TO HOME PAGE</a>
          <a href="#logout" className="hover:text-gray-200 transition-colors">MOVE TO LOGOUT PAGE</a>
        </div>
      </div>

      {/* Warning & Alerts Section */}
      <div className="flex flex-col justify-between border-b border-gray-100 px-4 py-3 font-bold sm:flex-row sm:items-center lg:px-6">
        <div className="text-center text-[#FF0000] tracking-wide sm:text-left animate-pulse">
          YOUR CURRENT SESSION WILL EXPIRE IN {timeLeft > 0 ? formatTime(timeLeft) : '00:00'} MINUTES
        </div>
        <div className="mt-1 text-center text-[#FF0000] text-[11px] font-medium sm:mt-0 sm:text-right md:text-xs">
          * MARKED FIELDS ARE MANDATORY
        </div>
      </div>

      {/* Steps Progress Breadcrumbs Grid */}
      <div className="bg-[#FAFBFD] p-4 lg:p-6">
        <div className="grid grid-cols-1 gap-y-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:flex xl:flex-wrap xl:gap-x-4 xl:gap-y-4">
          {steps.map((step) => {
            const isCompleted = step.status === 'completed';
            return (
              <div 
                key={step.number} 
                className="relative flex items-center h-10 min-w-[220px] xl:w-[23%] flex-1 shadow-sm group cursor-pointer transition-transform duration-150 active:scale-[0.99]"
              >
                {/* Main Chevron Body */}
                <div 
                  className={`flex items-center w-full h-full pl-5 pr-6 font-bold text-[11px] md:text-xs tracking-wider transition-colors duration-200 ${
                    isCompleted 
                      ? 'bg-[#00FF00] text-[#000080]' 
                      : 'bg-[#FFA500] text-[#000080] hover:bg-[#ffb426]'
                  }`}
                  style={{
                    clipPath: 'polygon(0% 0%, calc(100% - 12px) 0%, 100% 50%, calc(100% - 12px) 100%, 0% 100%, 12px 50%)',
                    marginLeft: step.number === 1 || step.number === 5 ? '0' : '-4px'
                  }}
                >
                  <span className="whitespace-nowrap uppercase">
                    STEP {step.number} &nbsp;{step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Validation Notification Box */}
      <div className="border-t border-gray-200 bg-white px-4 py-5 text-center font-bold text-black lg:px-6">
        <p className="text-[11px] sm:text-xs md:text-[13px] tracking-wide leading-relaxed uppercase">
          IF YOU HAVE RECEIVED REGISTRATION NO.: <span className="font-extrabold text-sm md:text-base">5250000005</span> AT YOUR REGISTERED MOBILE NO THEN PROCEED OTHERWISE CLICK LOGOUT BUTTON ABOVE.
        </p>
        <p className="mt-2 text-[12px] sm:text-sm md:text-[15px] tracking-normal font-medium text-gray-900 leading-relaxed">
          यदि आपको अपने पंजीकृत मोबाईल पर पंजीकरण संख्या: <span className="font-extrabold">5250000005</span> प्राप्त हुआ है तो आगे बढ़े अन्यथा ऊपर दिए गए लॉगआउट(LOGOUT) बटन को क्लिक करें।
        </p>
      </div>
    </div>
  );
};

export default ApplicationPortalHeader;