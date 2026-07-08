import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  LogIn,
  Lock,
  User,
  RefreshCw,
  ShieldCheck,
  Eye,
  EyeOff,
  FileText,
  ExternalLink,
} from "lucide-react";

const INK = "#12233F";
const INK_SOFT = "#5B6B84";
const PAPER = "#F4F5F2";
const CARD = "#FFFFFF";
const LINE = "#DBDFE6";
const OCHRE = "#B9722E";
const OCHRE_DEEP = "#8F5522";

export const BSSCLoginPortal: React.FC = () => {
  const [regNo, setRegNo] = useState("");
  const [password, setPassword] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRefreshCaptcha = () => {
    console.log("Refreshing captcha...");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    console.log({ regNo, password, captcha });
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div
      className="min-h-screen px-4 py-8 flex flex-col items-center justify-center gap-6"
      style={{ background: PAPER }}
    >
      <div className="w-full max-w-[1100px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT BAR: External Links Menu */}
          <div className="lg:col-span-3">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div
                className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
                style={{ background: INK }}
              >
                <FileText size={16} />
                <span className="tracking-widest uppercase">Links</span>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to="/advertisement"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors"
                  style={{ color: INK }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  Click Here To View Advertisement
                </Link>
                <Link
                  to="/instructions"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  Important Instruction For Live Photo Upload
                </Link>
                <Link
                  to="/how-to-apply"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span className="mt-0.5" style={{ color: INK }}>
                    •
                  </span>
                  How To Apply
                </Link>
              </div>
            </div>
          </div>

          {/* MIDDLE PORTION: Login Console */}
          <div className="lg:col-span-6">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] px-6 pt-4 pb-4 md:px-8"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div
                    className="h-12 w-12 rounded-full flex items-center justify-center"
                    style={{ background: `${INK}10` }}
                  >
                    <LogIn className="h-6 w-6" style={{ color: INK }} />
                  </div>
                </div>
                <h2
                  className="text-[24px] md:text-[26px] font-bold"
                  style={{ color: INK }}
                >
                  Candidate Login
                </h2>
                <p className="text-[14px] mt-1" style={{ color: INK_SOFT }}>
                  Enter your credentials to access your dashboard
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {/* Registration Number */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: INK }}
                  >
                    Registration Number
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: INK_SOFT }}
                    >
                      <User size={18} />
                    </span>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => setRegNo(e.target.value)}
                      className="w-full py-3 border rounded-lg pl-11 pr-4 text-[15px] outline-none transition-colors"
                      style={{ borderColor: OCHRE, color: INK }}
                      placeholder="Enter your registration number"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    className="block text-[14px] font-semibold mb-2"
                    style={{ color: INK }}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: INK_SOFT }}
                    >
                      <Lock size={18} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 border rounded-lg pl-11 pr-11 text-[15px] outline-none transition-colors"
                      style={{ borderColor: OCHRE, color: INK }}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                      style={{ color: INK_SOFT }}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Captcha Section */}
                <div
                  className="border rounded-lg p-4"
                  style={{ borderColor: LINE, background: PAPER }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <span
                      className="text-[13px] font-semibold flex items-center gap-2"
                      style={{ color: INK_SOFT }}
                    >
                      <ShieldCheck size={16} />
                      Security Verification
                    </span>
                    <button
                      type="button"
                      onClick={handleRefreshCaptcha}
                      className="flex items-center gap-1 text-[11px] font-bold transition-colors"
                      style={{ color: OCHRE_DEEP }}
                    >
                      <RefreshCw size={12} />
                      Refresh
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                    <div
                      className="w-full sm:w-[180px] min-h-[55px] border rounded-lg flex items-center justify-center px-2"
                      style={{ background: CARD, borderColor: LINE }}
                    >
                      <div
                        className="font-bold text-[22px] tracking-widest italic select-none font-mono"
                        style={{ color: INK }}
                      >
                        WN3E30
                      </div>
                    </div>

                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={captcha}
                        onChange={(e) => setCaptcha(e.target.value)}
                        placeholder="Enter CAPTCHA code"
                        className="w-full h-[48px] border rounded-lg px-4 text-[15px] outline-none transition-colors"
                        style={{ borderColor: OCHRE, color: INK }}
                      />
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 text-white text-[16px] font-semibold rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: loading ? INK_SOFT : INK }}
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

            </div>
          </div>

          {/* RIGHT BAR: Online Services */}
          <div className="lg:col-span-3">
            <div
              className="border rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.03)] overflow-hidden"
              style={{ background: CARD, borderColor: LINE }}
            >
              <div
                className="text-white font-bold text-[13px] px-4 py-3 flex items-center gap-2"
                style={{ background: INK }}
              >
                <ExternalLink size={16} />
                <span className="tracking-widest uppercase">
                  Online Services
                </span>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  to="/register"
                  className="flex items-center gap-2 text-[13px] font-semibold hover:underline transition-colors"
                  style={{ color: INK }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Registration
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Login
                </Link>
                <Link
                  to="/forgot-registration"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Forgot Your Registration Number
                </Link>
                <Link
                  to="/forgot-password"
                  className="flex items-start gap-2 text-[13px] font-semibold hover:underline transition-colors border-t border-dotted pt-3"
                  style={{ color: INK, borderColor: LINE }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: `${INK}10`, color: INK }}
                  >
                    ›
                  </span>
                  Forgot Your Password
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div> 
    </div>
  );
};

export default BSSCLoginPortal;
