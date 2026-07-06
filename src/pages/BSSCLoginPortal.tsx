import React, { useState } from 'react';

export const BSSCLoginPortal: React.FC = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');

  const handleRefreshCaptcha = () => {
    console.log('Refreshing captcha...');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ regNo, password, captcha });
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto bg-white  shadow-sm font-sans text-black antialiased">
     
     
      {/* Three-Column Workspace Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 items-start bg-white min-h-[480px]">
        
        {/* LEFT BAR: External Links Menu */}
        <div className="lg:col-span-3 border border-gray-300 rounded-sm bg-white shadow-sm overflow-hidden">
          <div className="bg-[#001489] text-white font-bold text-[13px] px-3 py-2 text-center tracking-widest uppercase">
            Links
          </div>
          <div className="p-3 flex flex-col gap-4 text-[12px] font-bold text-[#660000] leading-snug">
            <a href="#adv" className="underline hover:text-red-800 uppercase block pb-3 border-b border-dotted border-gray-400">
              Click Here To View Advertisement
            </a>
            <a href="#instruction" className="underline hover:text-red-800 uppercase block pb-3 border-b border-dotted border-gray-400">
              Important Instruction For Live Photo Upload
            </a>
            <a href="#apply" className="underline hover:text-red-800 uppercase block pb-1">
              How To Apply
            </a>
          </div>
        </div>

        {/* MIDDLE PORTION: Dynamic Interactive Login Console */}
        <div className="lg:col-span-6 px-4 pt-2">
          <h2 className="text-[#669900] font-bold text-[22px] tracking-wide mb-8 uppercase font-sans">
            Login
          </h2>

          <form onSubmit={handleLogin} className="space-y-5 max-w-[450px] mx-auto">
            {/* Registration Input row */}
            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-5 text-right pr-2 font-bold text-[13px] text-black tracking-wide uppercase">
                Registration No.:
              </label>
              <input
                type="text"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="py-2 rounded-md col-span-7 border border-[#4c90ff] rounded-xs h-[32px] px-2 text-[14px] bg-white text-black outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Password Input row */}
            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-5 text-right pr-2 font-bold text-[13px] text-black tracking-wide uppercase">
                Password:
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-2 rounded-md  col-span-7 border border-[#4c90ff] rounded-xs h-[32px] px-2 text-[14px] bg-white text-black outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Captcha Input row */}
            <div className="grid grid-cols-12 items-center gap-2">
              <label className="col-span-5 text-right pr-2 font-bold text-[12px] text-black tracking-wide uppercase leading-tight">
                Enter Captcha Code:
              </label>
              <input
                type="text"
                value={captcha}
                onChange={(e) => setCaptcha(e.target.value)}
                className="py-2 rounded-md  col-span-7 border border-[#4c90ff] rounded-xs h-[32px] px-2 text-[14px] bg-white text-black outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Captcha Generation Sandbox Element */}
            <div className="grid grid-cols-12 items-center gap-2 pt-2">
              <div className="col-span-5"></div>
              <div className="col-span-7 flex items-center justify-between gap-2">
                {/* Simulated Captcha Text Graphic */}
                <div className="text-[#0000ff] font-bold text-[22px] tracking-widest italic select-none font-mono pr-2">
                  WN3E30
                </div>
                
                {/* Refresh Action Handle */}
                <button
                  type="button"
                  onClick={handleRefreshCaptcha}
                  className="flex items-center gap-1 text-[11px] font-bold text-black hover:text-gray-700 uppercase"
                >
                  <span>Refresh Captcha</span>
                  <span className="bg-blue-600 text-white rounded-full p-1 flex items-center justify-center w-5 h-5 font-sans font-normal text-[12px]">
                    ↻
                  </span>
                </button>
              </div>
            </div>

            {/* Action Executive Submit button */}
            <div className="text-center pt-4">
              <button
                type="submit"
                className="bg-[#00008b] hover:bg-blue-900 text-white font-bold tracking-widest text-[16px] px-14 py-1.5 rounded-sm shadow-[1px_2px_4px_rgba(0,0,0,0.4)] border border-blue-950 uppercase"
              >
                Login
              </button>
            </div>
          </form>

          {/* User Warning Subtitle Segment */}
          <div className="text-[#0000ff] text-center font-bold text-[14px] mt-12 tracking-wide leading-relaxed uppercase">
            Login as per given details in your e-mail ID or SMS.
          </div>
        </div>

        {/* RIGHT BAR: Online Subscriptions / Self Services */}
        <div className="lg:col-span-3 border border-gray-300 rounded-sm bg-white shadow-sm overflow-hidden">
          <div className="bg-[#001489] text-white font-bold text-[13px] px-3 py-2 text-center tracking-widest uppercase">
            Online Services
          </div>
          <div className="p-3 flex flex-col gap-3.5 text-[12px] font-bold text-[#001489]">
            
            <a href="#register" className="flex items-center gap-2 hover:underline uppercase pb-2 border-b border-dotted border-gray-300">
              <span className="bg-gray-400 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-serif">›</span>
              Registration
            </a>

            <a href="#login-side" className="flex items-center gap-2 hover:underline uppercase pb-2 border-b border-dotted border-gray-300">
              <span className="bg-gray-400 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-serif">›</span>
              Login
            </a>

            <a href="#forgot-reg" className="flex items-center gap-2 hover:underline uppercase pb-2 border-b border-dotted border-gray-300 text-left leading-tight">
              <span className="bg-gray-400 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-serif shrink-0">›</span>
              Forgot Your Registration Number
            </a>

            <a href="#forgot-pass" className="flex items-center gap-2 hover:underline uppercase text-left leading-tight">
              <span className="bg-gray-400 text-white rounded-full text-[9px] w-4 h-4 flex items-center justify-center font-serif shrink-0">›</span>
              Forgot Your Password
            </a>

          </div>
        </div>

      </div>
    </div>
  );
};

export default BSSCLoginPortal;