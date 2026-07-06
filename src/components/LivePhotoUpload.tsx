import React, { useState } from 'react';

export const LivePhotoUpload: React.FC = () => {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const handleTakePhoto = () => {
    console.log('Take Photo triggered');
    // Mocking a photo capture for visual preview testing if needed:
    // setPhotoPreview('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Live Photo Form Submitted');
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto bg-white border border-gray-300 shadow-sm font-sans text-[13px] text-black antialiased min-h-[750px] flex flex-col justify-between">
      
      <div className="p-4 flex-1 flex flex-col">
        
        {/* Registration Info / Notice Header */}
        <div className="border border-transparent p-3 text-center leading-relaxed mb-1">
          <p className="font-bold text-black text-[13px] tracking-wide">
            IF YOU HAVE RECEIVED REGISTRATION NO.: <span className="underline">5250000005</span> AT YOUR REGISTERED MOBILE NO THEN PROCEED OTHERWISE CLICK LOGOUT BUTTON ABOVE.
          </p>
          <p className="font-bold text-black text-[13px] mt-0.5 font-hindi">
            यदि आपको अपने पंजीकृत मोबाईल पर पंजीकरण संख्या: <span className="underline">5250000005</span> प्राप्त हुआ है तो आगे बढ़े अन्यथा ऊपर दिए गए लॉगआउट(LOGOUT) बटन को क्लिक करें।
          </p>
        </div>

        {/* Dynamic Red Instruction Link */}
        <div className="text-center mb-6">
          <a 
            href="#instructions" 
            className="text-red-600 font-bold text-[16px] tracking-wide uppercase underline hover:text-red-700 decoration-1 underline-offset-4"
          >
            CLICK HERE FOR IMPORTANT INSTRUCTION FOR LIVE PHOTO UPLOAD
          </a>
        </div>

        {/* Section Heading Accordion Banner */}
        <div className="bg-[#000080] text-white flex items-center justify-between px-5 py-2.5 rounded-lg font-bold text-[13px] tracking-widest w-full max-w-[260px] mb-8 shadow-md transition-all hover:shadow-lg">
          <span className="uppercase text-[12px]">UPLOAD LIVE PHOTO</span>
          <div className="bg-white rounded-full p-1 flex items-center justify-center w-5 h-5 shadow-inner">
            <svg className="w-3 h-3 text-[#000080] fill-current stroke-[2]" viewBox="0 0 24 24">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full pt-4 pb-8">
          
          {/* Cloud Upload/Camera Interactive Dropzone Frame */}
          <div className="w-full aspect-[4/3] max-w-[400px] border-2 border-dashed border-gray-300 rounded-2xl bg-gray-50 flex flex-col items-center justify-center p-6 mb-8 text-center transition-all hover:border-[#000080] hover:bg-blue-50/30 group relative overflow-hidden shadow-inner">
            {photoPreview ? (
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <>
                {/* Cloud & Camera Custom SVG Combo */}
                <div className="relative mb-4 text-gray-400 group-hover:text-[#000080] transition-colors duration-300">
                  <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pt-3 pl-1">
                    <svg className="w-8 h-8 bg-gray-50 group-hover:bg-blue-50 rounded-full p-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812-1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
                <p className="text-gray-500 font-medium text-[14px]">Your live webcam feed will appear here</p>
                <p className="text-gray-400 text-[11px] mt-1">Ensure your face is clearly visible in well-lit conditions</p>
              </>
            )}
          </div>

          {/* Take Photo Action Section */}
          <div className="flex items-center gap-2 mb-4 w-full justify-center">
            <span className="text-red-600 font-bold text-[20px] leading-none animate-pulse">*</span>
            <button
              type="button"
              onClick={handleTakePhoto}
              className="bg-[#000080] hover:bg-[#000066] text-white font-bold tracking-wider text-[14px] px-8 py-3 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.98] transition-all uppercase min-w-[280px] flex items-center justify-center gap-2 group border border-transparent focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
            >
              <svg className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              TAKE LIVE PHOTO
            </button>
          </div>

          {/* Primary Action Submit Button */}
          <div className="w-full flex justify-center border-t border-gray-100 pt-6 mt-2">
            <button
              type="submit"
              className="bg-[#000080] hover:bg-[#000066] text-white font-bold tracking-widest text-[15px] px-12 py-3.5 rounded-xl shadow-md hover:shadow-xl hover:shadow-blue-900/20 active:scale-[0.98] transition-all uppercase min-w-[280px] flex items-center justify-center gap-2 border border-transparent focus:outline-none focus:ring-2 focus:ring-[#000080] focus:ring-offset-2"
            >
              {/* Check-Circle SVG Icon */}
              <svg className="w-5 h-5 text-blue-100 animate-bounce-slow" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              SUBMIT PHOTO
            </button>
          </div>

        </form>

      </div>
      
    </div>
  );
};

export default LivePhotoUpload;