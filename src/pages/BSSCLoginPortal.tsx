import React, { useState } from 'react';
import { 
  LogIn, 
  Lock, 
  User, 
  RefreshCw, 
  ShieldCheck, 
  Eye,
  EyeOff,
  FileText,
  ExternalLink
} from 'lucide-react';

export const BSSCLoginPortal: React.FC = () => {
  const [regNo, setRegNo] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefreshCaptcha = () => {
    console.log('Refreshing captcha...');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log({ regNo, password, captcha });
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#F4F5F7] px-4 py-8 flex flex-col items-center justify-center gap-6">
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT BAR: External Links Menu */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#E1E5E3] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="bg-[#003A2B] text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2">
                <FileText size={16} />
                <span className="tracking-widest uppercase">Links</span>
              </div>
              <div className="p-4 space-y-3">
                <a 
                  href="#adv" 
                  className="flex items-start gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors"
                >
                  <span className="text-[#003A2B] mt-0.5">•</span>
                  Click Here To View Advertisement
                </a>
                <a 
                  href="#instruction" 
                  className="flex items-start gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors border-t border-dotted border-gray-200 pt-3"
                >
                  <span className="text-[#003A2B] mt-0.5">•</span>
                  Important Instruction For Live Photo Upload
                </a>
                <a 
                  href="#apply" 
                  className="flex items-start gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors border-t border-dotted border-gray-200 pt-3"
                >
                  <span className="text-[#003A2B] mt-0.5">•</span>
                  How To Apply
                </a>
              </div>
            </div>
          </div>

          {/* MIDDLE PORTION: Login Console */}
          <div className="lg:col-span-6">
            <div className="bg-white border border-[#E1E5E3] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 pt-6 pb-8 md:px-8">
              
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-12 w-12 rounded-full bg-[#003A2B]/10 flex items-center justify-center">
                    <LogIn className="h-6 w-6 text-[#003A2B]" />
                  </div>
                </div>
                <h2 className="text-[24px] md:text-[26px] font-bold text-[#003A2B]">
                  Candidate Login
                </h2>
                <p className="text-[14px] text-[#4B5563] mt-1">
                  Enter your credentials to access your dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Registration Number */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                    Registration Number
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full py-3 border border-[#4c90ff] rounded-lg pl-11 pr-4 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                      placeholder="Enter your registration number"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-[14px] font-semibold text-[#374151] mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]">
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 border border-[#4c90ff] rounded-lg pl-11 pr-11 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#374151] transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Captcha Section */}
                <div className="border border-[#E1E5E3] bg-[#F9FAFB] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[13px] font-semibold text-[#4B5563] flex items-center gap-2">
                      <ShieldCheck size={16} />
                      Security Verification
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshCaptcha}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#003A2B] hover:text-[#002B20] transition-colors"
                    >
                      <RefreshCw size={12} />
                      Refresh
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div className="w-full sm:w-[180px] min-h-[55px] bg-white border border-[#D1D5DB] rounded-lg flex items-center justify-center px-2">
                      <div className="text-[#0000ff] font-bold text-[22px] tracking-widest italic select-none font-mono">
                        WN3E30
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="Enter CAPTCHA code"
                        className="w-full h-[48px] border border-[#4c90ff] rounded-lg px-4 text-[15px] outline-none focus:border-[#003A2B] transition-colors"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#003A2B] hover:bg-[#002B20] text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <LogIn size={18} />
                      Candidate Login
                    </>
                  )}
                </button>
              </form>

              {/* User Warning */}
              <div className="mt-6 pt-4 border-t border-[#E1E5E3]">
                <div className="text-[#0000ff] text-center font-semibold text-[13px] leading-relaxed uppercase">
                  Login as per given details in your e-mail ID or SMS.
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT BAR: Online Services */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#E1E5E3] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden">
              <div className="bg-[#003A2B] text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2">
                <ExternalLink size={16} />
                <span className="tracking-widest uppercase">Online Services</span>
              </div>
              <div className="p-4 space-y-3">
                <a 
                  href="#register" 
                  className="flex items-center gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors"
                >
                  <span className="w-5 h-5 rounded-full bg-[#003A2B]/10 flex items-center justify-center text-[#003A2B] text-xs font-bold flex-shrink-0">
                    ›
                  </span>
                  Registration
                </a>
                <a 
                  href="#login-side" 
                  className="flex items-center gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors border-t border-dotted border-gray-200 pt-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#003A2B]/10 flex items-center justify-center text-[#003A2B] text-xs font-bold flex-shrink-0">
                    ›
                  </span>
                  Login
                </a>
                <a 
                  href="#forgot-reg" 
                  className="flex items-start gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors border-t border-dotted border-gray-200 pt-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#003A2B]/10 flex items-center justify-center text-[#003A2B] text-xs font-bold flex-shrink-0 mt-0.5">
                    ›
                  </span>
                  Forgot Your Registration Number
                </a>
                <a 
                  href="#forgot-pass" 
                  className="flex items-start gap-2 text-[13px] font-semibold text-[#003A2B] hover:text-[#002B20] hover:underline transition-colors border-t border-dotted border-gray-200 pt-3"
                >
                  <span className="w-5 h-5 rounded-full bg-[#003A2B]/10 flex items-center justify-center text-[#003A2B] text-xs font-bold flex-shrink-0 mt-0.5">
                    ›
                  </span>
                  Forgot Your Password
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Security Badge */}
      <div className="flex items-center gap-1.5 text-[#9CA3AF]">
        <ShieldCheck size={16} />
        <span className="text-[12px] font-medium">
          Secure AES-256 Encrypted Portal
        </span>
      </div>
    </div>
  );
};

export default BSSCLoginPortal;