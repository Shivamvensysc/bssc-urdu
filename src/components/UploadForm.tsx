import React from 'react';

export const UploadForm: React.FC = () => {
  // Mock handler for re-uploading
  const handleReUpload = () => {
    console.log('Re-upload photo and signature clicked');
  };

  // Mock handler for saving
  const handleSaveAndNext = () => {
    console.log('Save and next clicked');
  };

  return (
    <div className="min-h-screen bg-white p-4 font-sans antialiased selection:bg-blue-200">
      <div className="mx-auto max-w-4xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm">
        
        {/* Header Section */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div className="flex items-center bg-[#00008b] text-white px-5 py-2 rounded-full shadow-sm text-sm font-bold tracking-wide">
            UPLOAD REQUIRED IMAGES
            <span className="ml-3 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#00008b] text-xs font-black">
              &#10142;
            </span>
          </div>
        </div>

        {/* Form Body Container */}
        <div className="mt-8 flex flex-col items-center justify-center space-y-6 px-4 md:px-20">
          
          {/* Photograph Row */}
          <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-end">
            <span className="w-full text-left text-xs font-bold uppercase tracking-wider text-gray-800 sm:w-auto sm:text-right">
              PHOTOGRAPH
            </span>
            <div className="relative h-64 w-full border border-gray-400 bg-white p-1 sm:w-56">
              {/* Broken Image icon placeholder as shown in screenshot */}
              <img 
                src="broken-link-placeholder" 
                alt="" 
                className="h-4 w-4 text-gray-400 absolute top-1 left-1"
                onError={(e) => {
                  // Fallback styling mimicry for broken images native to browsers
                  e.currentTarget.style.display = 'inline';
                }}
              />
            </div>
          </div>

          {/* English Signature Row */}
          <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-end">
            <span className="w-full text-left text-xs font-bold uppercase tracking-wider text-gray-800 sm:w-auto sm:text-right">
              ENGLISH SIGNATURE
            </span>
            <div className="relative h-20 w-full border border-gray-400 bg-white p-1 sm:w-56">
              <img 
                src="broken-link-placeholder" 
                alt="" 
                className="h-4 w-4 text-gray-400 absolute top-1 left-1"
              />
            </div>
          </div>

          {/* Hindi Signature Row */}
          <div className="flex w-full flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-end">
            <span className="w-full text-left text-xs font-bold uppercase tracking-wider text-gray-800 sm:w-auto sm:text-right">
              HINDI SIGNATURE
            </span>
            <div className="relative h-20 w-full border border-gray-400 bg-white p-1 sm:w-56">
              <img 
                src="broken-link-placeholder" 
                alt="" 
                className="h-4 w-4 text-gray-400 absolute top-1 left-1"
              />
            </div>
          </div>

        </div>

        {/* Action Buttons Section */}
        <div className="mt-10 flex flex-col items-center justify-center space-y-5 pb-6">
          
          {/* Re-upload Button */}
          <button
            onClick={handleReUpload}
            className="w-full max-w-sm rounded-md bg-[#00008b] px-6 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_6px_rgba(0,0,0,0.15)] transition-all hover:bg-[#000066] active:translate-y-0.5 active:shadow-inner sm:w-auto"
          >
            RE-UPLOAD PHOTO AND SIGNATURE
          </button>

          {/* Save and Next Button */}
          <button
            onClick={handleSaveAndNext}
            className="w-full max-w-sm rounded-md bg-[#00008b] px-16 py-2.5 text-center text-sm font-bold uppercase tracking-wider text-white shadow-[0_4px_6px_rgba(0,0,0,0.15)] transition-all hover:bg-[#000066] active:translate-y-0.5 active:shadow-inner sm:w-auto"
          >
            SAVE AND NEXT
          </button>

        </div>

      </div>
    </div>
  );
};

export default UploadForm;