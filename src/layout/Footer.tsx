import { MapPin, Phone, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#EBF2FC] text-slate-700 border-t border-blue-100/80">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8 justify-between items-start">
          
          {/* Brand & Social Section */}
          <div className="md:col-span-7 lg:col-span-8 space-y-4 max-w-md">
            <span className="text-2xl font-bold tracking-tight text-[#0B469B] block">
              BSSC Portal
            </span>
            <p className="text-sm text-slate-600 leading-relaxed">
              Providing transparent and efficient recruitment services for the state of Bihar.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="#"
                aria-label="Website"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#0B469B] shadow-sm border border-slate-200/60 transition-all duration-200"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="#"
                aria-label="Email"
                className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-600 hover:text-white hover:bg-[#0B469B] shadow-sm border border-slate-200/60 transition-all duration-200"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Details Section */}
          <div className="md:col-span-5 lg:col-span-4 space-y-4">
            <h4 className="font-bold text-slate-800 text-xs tracking-wider uppercase opacity-90">
              Contact
            </h4>
            <ul className="space-y-3.5 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#0B469B] shrink-0 mt-0.5" />
                <span className="leading-snug">
                  Veterinary College Campus,
                  <br />
                  Patna, Bihar - 800014
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#0B469B] shrink-0" />
                <a href="tel:+916122227728" className="hover:text-[#0B469B] transition-colors">
                  +91 612 2227728
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#0B469B] shrink-0" />
                <a href="mailto:support-bssc@bihar.gov.in" className="break-all hover:text-[#0B469B] transition-colors">
                  support-bssc@bihar.gov.in
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Bar Section */}
      <div className="border-t border-slate-200/80 py-6 text-xs text-slate-500 font-medium">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <span>
            © 2026 Bihar Staff Selection Commission. Government of Bihar. All Rights Reserved.
          </span>
          <div className="flex items-center space-x-6 shrink-0">
            <a href="#" className="hover:text-[#0B469B] hover:underline transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-[#0B469B] hover:underline transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}