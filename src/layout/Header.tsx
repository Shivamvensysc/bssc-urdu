import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="w-full  mx-auto bg-white select-none antialiased font-sans">
      
      {/* 1. TOP NAVY BLUE BRANDING BANNER */}
      <div className="w-full bg-[#001489] text-white px-4 py-4 md:py-6 flex flex-col md:flex-row items-center justify-between border-b-2 border-[#ffcc00] relative box-border">
        
        {/* Left Side: Bihar Government Seal / Crest Graphic Container */}
        <div className="flex items-center justify-center w-24 h-24 border border-blue-400/30 rounded bg-blue-950/20 p-2 shrink-0 mb-4 md:mb-0">
          <div className="text-center text-[10px] leading-tight font-mono tracking-tight text-gray-300 uppercase opacity-80">
            Government<br />Of Bihar<br />Emblem
          </div>
        </div>

        {/* Middle / Main Typography Layout Block */}
        <div className="flex-1 text-center md:pr-16 lg:pr-24">
          <h1 className="text-[22px] sm:text-[28px] lg:text-[35px] font-bold tracking-wide uppercase font-serif leading-tight">
            BIHAR STAFF SELECTION COMMISSION
          </h1>
          <p className="text-[13px] sm:text-[16px] lg:text-[18px] tracking-widest font-semibold mt-1 text-gray-100">
            P.O.-VETERINARY COLLEGE, PATNA - 800014
          </p>
          
          <div className="mt-3 text-[12px] sm:text-[13px] lg:text-[14px] font-bold tracking-normal leading-relaxed">
            <span className="uppercase text-amber-300 md:text-white">Adv No.-05/25, 4</span>
            <sup className="lowercase text-[10px] font-normal mx-0.5">th</sup>{' '}
            <span className="uppercase">GRADUATE LEVEL COMBINED COMPETITIVE EXAM</span>
            
            {/* Devnagari (Hindi) Secondary Translation Strip */}
            <div className="text-[14px] sm:text-[15px] mt-1 font-normal tracking-wide text-gray-200" style={{ fontFamily: 'Noto Sans Devanagari, Georgia, serif' }}>
              चतुर्थ स्नातक स्तरीय संयुक्त प्रतियोगिता परीक्षा
            </div>
          </div>
        </div>
      </div>

      {/* 2. TABBED NAVIGATION MENU BAR (Metallic Silver-Gray Linear Gradient) */}
      <div className="w-full bg-gradient-to-b from-[#f6f6f6] via-[#eaeaea] to-[#dcdcdc] border-b border-gray-300 flex items-stretch text-[13px] font-bold shadow-inner">
        {/* Home Tab Anchor Element */}
        <div className="px-6 py-2.5 border-r border-gray-300 bg-[#e6e6e6] text-black border-t-[3px] border-t-[#ff9900] cursor-pointer uppercase tracking-wider text-center flex items-center justify-center min-w-[100px]">
          Home
        </div>
        
        {/* Empty Replicating Structural Segments (Visible on Desktop to Match Grid Layout) */}
        <div className="hidden md:flex flex-1 grid grid-cols-8 divide-x divide-gray-300 opacity-25">
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
          <div className="h-full"></div>
        </div>
      </div>

      {/* 3. NOTICE BOARD TICKER / ALERT STRIP */}
      <div className="w-full flex items-stretch bg-white border-b border-sky-100 text-[13px] font-bold overflow-hidden min-h-[36px]">
        {/* Notice Board Glossy Badge */}
        <div className="bg-gradient-to-b from-white via-[#f3f3f3] to-[#e1e1e1] border-r border-gray-300 px-4 py-1.5 text-[#001489] flex items-center gap-2 shadow-sm shrink-0 select-none">
          {/* Replicated Megaphone Icon Asset */}
          <svg className="w-4 h-4 text-gray-600 fill-current shrink-0 transform -rotate-12" viewBox="0 0 24 24">
            <path d="M20 12c0-1.1-.9-2-2-2V7c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3c1.1 0 2-.9 2-2zm-4 5H4V7h12v10zM7 9h6v2H7V9zm0 4h4v2H7v-2z" />
          </svg>
          <span className="tracking-tight uppercase text-[12px] sm:text-[13px]">Notice Board</span>
        </div>

        {/* Right Content Stream Header (Stays locked pinned right while being flexible) */}
        <div className="flex-1 flex items-center justify-end pr-4 sm:pr-8 bg-white">
          <div className="text-[#001489] font-serif font-bold uppercase tracking-widest text-[11px] sm:text-[12.5px] whitespace-nowrap">
            Closing Dat
          </div>
        </div>
      </div>

    </div>
  );
};

export default Header;