import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
}

export default function Header({ onLoginClick, onRegisterClick }: HeaderProps) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleRegister = () => {
    if (onRegisterClick) {
      onRegisterClick();
    } else {
      navigate('/register');
    }
    setMobileMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-12">
          <img
            src="/logo.webp"
            alt="BSSC Logo"
            className="h-20 w-auto object-contain"
          />
          <nav className="hidden lg:flex items-center space-x-8 text-[15px] font-medium text-slate-600">
            <a href="#" className="text-[#0B469B] border-b-2 border-[#0B469B] pb-1 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-[#0B469B] transition-colors">
              Notice Board
            </a>
            <a href="#" className="hover:text-[#0B469B] transition-colors">
              Contact
            </a>
          </nav>
        </div>
        <div className="hidden lg:flex items-center space-x-5">
          <button
            onClick={handleLogin}
            className="text-[15px] font-semibold text-slate-700 hover:text-[#0B469B] transition-colors"
          >
            Candidate Login
          </button>
          <button
            onClick={handleRegister}
            className="bg-[#0B469B] hover:bg-[#093a82] text-white px-6 py-2.5 rounded-full font-semibold text-[15px] shadow-sm transition-all transform active:scale-95"
          >
            Register
          </button>
        </div>

        <button
          className="lg:hidden p-2 text-slate-600 hover:text-[#0B469B] transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden w-full bg-white border-b border-slate-200 px-6 py-4 space-y-4 shadow-inner">
          <nav className="flex flex-col space-y-3 font-medium text-slate-600">
            <a href="#" className="text-[#0B469B]">
              Home
            </a>
            <a href="#">Notice Board</a>
            <a href="#">Contact</a>
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
            <button
              onClick={handleLogin}
              className="w-full text-center py-2 text-sm font-semibold text-slate-700"
            >
              Candidate Login
            </button>
            <button
              onClick={handleRegister}
              className="w-full bg-[#0B469B] text-white py-2.5 rounded-xl font-semibold text-sm"
            >
              Register
            </button>
          </div>
        </div>
      )}
    </header>
  );
}