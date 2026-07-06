import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#00008b] text-white text-center py-5 px-4 text-[12px] md:text-[13px] font-sans antialiased tracking-wide select-none box-border border-t border-blue-950">
      <div className="max-w-[1200px] mx-auto flex flex-col justify-center items-center space-y-1 uppercase font-normal">
        
        {/* Core Maintenance Credits Label */}
        <p className="opacity-95 tracking-wider">
          DEVELOPED & MAINTAINED BY IT CELL, BSSC, PATNA
        </p>

        {/* Legal Copyright Line */}
        <p className="opacity-95 tracking-wide">
          © BIHAR STAFF SELECTION COMMISSION, ALL RIGHT RESERVED.
        </p>

        {/* Session IP Trace Metadata */}
        <p className="text-[11px] md:text-[11.5px] opacity-85 tracking-widest pt-0.5 font-mono">
          IP ADDRESS: ::1
        </p>

      </div>
    </footer>
  );
};

export default Footer;