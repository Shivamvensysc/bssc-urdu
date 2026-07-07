import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#EBF2FC] text-slate-700 border-t border-blue-100/60 w-full">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <span className="text-xl font-bold text-[#0B469B]">BSSC Portal</span>
          <p className="text-sm text-slate-500 leading-relaxed">
            Providing transparent and efficient recruitment services for the state of Bihar.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-[#0B469B] shadow-sm transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-[#0B469B] shadow-sm transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-[15px] tracking-wide uppercase opacity-90">
            Commission
          </h4>
          <ul className="space-y-2 text-sm font-medium text-slate-600">
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                About BSSC
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                Our Vision
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                Organization Structure
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                RTI Disclosures
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-[15px] tracking-wide uppercase opacity-90">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm font-medium text-slate-600">
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                Latest Notifications
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                Examination Calendar
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                Admit Card Portal
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-[#0B469B] transition-colors">
                Feedback
              </a>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-slate-800 text-[15px] tracking-wide uppercase opacity-90">
            Contact
          </h4>
          <ul className="space-y-3 text-sm text-slate-600 font-medium">
            <li className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#0B469B] shrink-0 mt-0.5" />
              <span>
                Veterinary College Campus,
                <br />
                Patna, Bihar - 800014
              </span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#0B469B]" />
              <span>+91 612 2227728</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#0B469B]" />
              <span className="break-all">support-bssc@bihar.gov.in</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-6 text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>
            © 2026 Bihar Staff Selection Commission. Government of Bihar. All Rights Reserved.
          </span>
          <div className="flex items-center space-x-6">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}