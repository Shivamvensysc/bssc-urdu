import { useState } from 'react';
import { 
  Megaphone, 
  IdCard, 
  Award, 
  Bell, 
  Search, 
  ArrowRight, 
  FileText, 
  BookOpen, 
  Calendar, 
  HelpCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// --- Types & Interfaces ---
interface NotificationItem {
  id: string;
  title: string;
  dept: string;
  advtNo: string;
  publishedDate: string;
  closingDate: string;
  status: 'Open' | 'Closed';
  isNew?: boolean;
}

interface RecentNotice {
  date: string;
  title: string;
  type: 'pdf' | 'portal';
}

export default function BSSCRecruitmentPortal() {
    const navigate= useNavigate();
  // --- States ---
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Latest Published');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);


  // --- Mock Data ---
const notifications: NotificationItem[] = [
  {
    id: "1",
    title: "ADV NO. 08/25, POST- SPORTS TRAINER",
    dept: "",
    advtNo: "ADV NO. 08/25",
    publishedDate: "09-10-2025",
    closingDate: "09-11-2025 (11:59 PM)",
    status: "Open",
    isNew: true,
  },
  {
    id: "2",
    title: "ADV NO. 07/25, POST- STENOGRAPHER/STENO TYPIST GRADE-III",
    dept: "",
    advtNo: "ADV NO. 07/25",
    publishedDate: "25-09-2025",
    closingDate: "03-11-2025 (11:59 PM)",
    status: "Open",
    isNew: true,
  },
  {
    id: "3",
    title:
      "ADV NO. 06/25, POST- OFFICE ATTENDANT/ATTENDANT(SPECIAL) COMBINED COMPETITIVE EXAM",
    dept: "",
    advtNo: "ADV NO. 06/25",
    publishedDate: "25-08-2025",
    closingDate: "21-11-2025 (11:59 PM)",
    status: "Open",
    isNew: true,
  },
  {
    id: "4",
    title:
      "ADV NO. 05/25, POST- 4TH GRADUATE LEVEL COMBINED COMPETITIVE EXAM",
    dept: "",
    advtNo: "ADV NO. 05/25",
    publishedDate: "25-08-2025",
    closingDate: "21-11-2025 (11:59 PM)",
    status: "Open",
    isNew: true,
  },
  {
    id: "5",
    title:
      "DOWNLOAD ADMIT CARD FOR ADV NO. 03/25, POST- FIELD ASSISTANT (AGRICULTURE DEPARTMENT)",
    dept: "",
    advtNo: "ADVT. NO.-03/25",
    publishedDate: "30-07-2025",
    closingDate: "10-08-2025 (01:00 PM)",
    status: "Closed",
    isNew: false,
  },
  {
    id: "6",
    title:
      "DOWNLOAD ADMIT CARD FOR ADV NO. 02/25, POST- WELFARE ORGANISER AND LOWER DIVISION CLERK (SAINIK KALYAN NIDESHALAYA)",
    dept: "",
    advtNo: "ADVT. NO.-02/25",
    publishedDate: "18-06-2025",
    closingDate: "29-06-2025 (02:00 PM)",
    status: "Closed",
    isNew: false,
  },
  {
    id: "7",
    title:
      "CLICK HERE TO APPLY FOR ADV NO. 04/25, POST- LABORATORY ASSISTANT",
    dept: "",
    advtNo: "ADVT. NO.-04/25",
    publishedDate: "15-05-2025",
    closingDate: "16-06-2025 (11:59 PM)",
    status: "Closed",
    isNew: false,
  },
  {
    id: "8",
    title:
      "CLICK HERE TO APPLY FOR ADV NO. 03/25, POST- FIELD ASSISTANT (AGRICULTURE DEPARTMENT)",
    dept: "",
    advtNo: "ADVT. NO.-03/25",
    publishedDate: "25-04-2025",
    closingDate: "21-05-2025 (11:59 PM)",
    status: "Closed",
    isNew: false,
  },
  {
    id: "9",
    title:
      "CLICK HERE TO APPLY FOR ADV NO. 02/25, POST- WELFARE ORGANISER AND LOWER DIVISION CLERK (SAINIK KALYAN NIDESHALAYA)",
    dept: "",
    advtNo: "ADVT. NO.-02/25",
    publishedDate: "25-04-2025",
    closingDate: "21-05-2025 (11:59 PM)",
    status: "Closed",
    isNew: false,
  },
];

 const recentNotices: RecentNotice[] = [
  {
    date: "09-10-2025",
    title: "ADV NO. 08/25, POST- SPORTS TRAINER",
    type: "portal",
  },
  {
    date: "25-09-2025",
    title: "ADV NO. 07/25, POST- STENOGRAPHER/STENO TYPIST GRADE-III",
    type: "portal",
  },
  {
    date: "25-08-2025",
    title: "ADV NO. 06/25, POST- OFFICE ATTENDANT/ATTENDANT(SPECIAL) COMBINED COMPETITIVE EXAM",
    type: "pdf",
  },
  {
    date: "25-08-2025",
    title: "ADV NO. 05/25, POST- 4TH GRADUATE LEVEL COMBINED COMPETITIVE EXAM",
    type: "pdf",
  },
];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased flex flex-col justify-between">
      
      {/* SECTION 1: Header / Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-12">
             <img
    src="/logo.webp"
    alt="BSSC Logo"
    className="h-20 w-auto object-contain"
  />
            <nav className="hidden lg:flex items-center space-x-8 text-[15px] font-medium text-slate-600">
              <a href="#" className="text-[#0B469B] border-b-2 border-[#0B469B] pb-1 transition-colors">Home</a>
              <a href="#" className="hover:text-[#0B469B] transition-colors">Notice Board</a>
              <a href="#" className="hover:text-[#0B469B] transition-colors">Contact</a>
            </nav>
          </div>
          <div className="hidden lg:flex items-center space-x-5">
            <button className="text-[15px] font-semibold text-slate-700 hover:text-[#0B469B] transition-colors">
              Candidate Login
            </button>
            <button 
            onClick={() => navigate("/register")}
            className="bg-[#0B469B] hover:bg-[#093a82] text-white px-6 py-2.5 rounded-full font-semibold text-[15px] shadow-sm transition-all transform active:scale-95">
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
              <a href="#" className="text-[#0B469B]">Home</a>
              <a href="#">Notice Board</a>
              <a href="#">Contact</a>
            </nav>
            <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
              <button className="w-full text-center py-2 text-sm font-semibold text-slate-700">Candidate Login</button>
              <button className="w-full bg-[#0B469B] text-white py-2.5 rounded-xl font-semibold text-sm">Register</button>
            </div>
          </div>
        )}
      </header>

      {/* SECTION 2: Hero Banner */}
      <section
        className="w-full relative overflow-hidden bg-cover bg-center bg-no-repeat pt-16 pb-24 md:pt-24 md:pb-36 px-6"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(255,255,255,1) 0%,
              rgba(255,255,255,0.98) 35%,
              rgba(255,255,255,0.85) 50%,
              rgba(255,255,255,0.30) 75%,
              rgba(255,255,255,0.0) 100%
            ),
            url('/bssc.png')
          `,
        }}
      >
        <div className="max-w-7xl mx-auto w-full z-10 relative">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-xs font-semibold text-[#0B469B] border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0B469B] animate-pulse"></span>
              Official Recruitment Portal
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-[#0B469B] leading-[1.15] tracking-tight">
              Bihar Staff Selection Commission Recruitment Portal
            </h1>

            <p className="text-slate-600 leading-relaxed text-base md:text-lg">
              The centralized gateway for government job aspirants in Bihar. Access
              the latest advertisements, download admit cards, and check official
              results with complete transparency.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-[#0B469B] hover:bg-[#093a82] text-white px-6 py-3.5 rounded-xl font-semibold text-[15px] shadow-md flex items-center gap-2 transition-all group">
                View Recruitment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="bg-white hover:bg-slate-50 text-[#0B469B] border-2 border-blue-100 px-6 py-3.5 rounded-xl font-semibold text-[15px] shadow-sm transition-all">
                Download Notifications
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Core Layout Layer */}
      <main className="max-w-7xl mx-auto w-full px-6 pb-12 space-y-12 relative z-20">
        
        {/* OVERLAPPING STATS CARD COMPONENT */}
        <section className="-mt-16 md:-mt-20 lg:-mt-20 mb-6 bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/60 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:gap-4 lg:gap-0 lg:divide-x divide-slate-100 w-full">
          {[
            { label: 'Latest Advertisements', val: '18 Open', icon: Megaphone, desc: 'Active windows' },
            { label: 'Apply Online', val: '24x7', icon: BookOpen, desc: 'Digital application' },
            { label: 'Admit Cards', val: 'Download', icon: IdCard, desc: 'Hall tickets open' },
            { label: 'Notices', val: 'Updated Daily', icon: Bell, desc: 'Latest circulars' },
            { label: 'Results', val: 'Official', icon: Award, desc: 'Verified merits' }
          ].map((item, index) => (
            <div key={index} className={`p-4 flex items-center space-x-4 ${index >= 2 ? 'pt-4 md:pt-0' : ''} ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 block tracking-tight">{item.label}</div>
                <div className="text-lg font-bold text-slate-800 leading-tight mt-0.5">{item.val}</div>
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 4: Dual Panel Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full pt-4">
          
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filter Dashboard Header (Optimized into a single 12-column horizontal row) */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              
              {/* Search keywords - Spans 4 out of 12 columns */}
              <div className="space-y-1.5 md:col-span-4">
                <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Search Keywords</label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Post name, Dept, Advt No..." 
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#0B469B] focus:bg-white transition-all"
                  />
                </div>
              </div>
              
              {/* Status - Spans 2 out of 12 columns */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Status</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0B469B] focus:bg-white transition-all cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Open</option>
                  <option>Closed</option>
                </select>
              </div>

              {/* Sort By - Spans 3 out of 12 columns */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">Sort By</label>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0B469B] focus:bg-white transition-all cursor-pointer"
                >
                  <option>Latest Published</option>
                  <option>Closing Date Soon</option>
                </select>
              </div>

              {/* Filter Button - Spans remaining 3 out of 12 columns */}
              <div className="md:col-span-3">
                <button className="bg-[#0B469B] hover:bg-[#093a82] text-white font-semibold text-sm h-[42px] rounded-xl transition-all shadow-sm w-full">
                  Apply Filter
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <h2 className="text-lg font-bold text-slate-800">Latest Recruitment Notifications</h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">Showing {notifications.length} of 24 active posts</span>
            </div>

            {/* Recruitment Cards */}
            <div className="space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors relative group w-full">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        {item.isNew && (
                          <span className="bg-rose-500 text-white text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wider animate-pulse">
                            New
                          </span>
                        )}
                        <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          Advt No: {item.advtNo}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Published: {item.publishedDate}</span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-800 tracking-tight group-hover:text-[#0B469B] transition-colors">
                        {item.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded bg-slate-400"></span>
                          {item.dept}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded bg-amber-400"></span>
                          Closing: {item.closingDate}
                        </span>
                        <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          Status: {item.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center justify-end gap-3 w-full md:w-auto md:min-w-[140px]">
                      <button className="flex-1 md:w-full bg-[#0B469B] hover:bg-[#093a82] text-white text-[14px] font-semibold py-2.5 px-5 rounded-xl transition-all shadow-sm">
                        Apply Now
                      </button>
                      <button className="flex-1 md:w-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-[14px] font-semibold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-all">
                        <FileText className="w-4 h-4 text-slate-400" />
                        View PDF
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-[16px]">Recent Notices</h3>
                <a href="#" className="text-xs font-semibold text-[#0B469B] hover:underline">View All</a>
              </div>
              <div className="space-y-3">
                {recentNotices.map((notice, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-transparent hover:border-blue-100 transition-all cursor-pointer space-y-1">
                    <span className="text-[11px] font-bold text-slate-400">{notice.date}</span>
                    <h4 className="text-sm font-semibold text-slate-700 leading-snug line-clamp-2">{notice.title}</h4>
                    <div className="pt-1 flex items-center text-xs font-semibold text-[#0B469B] gap-1">
                      {notice.type === 'pdf' ? (
                        <>
                          <FileText className="w-3.5 h-3.5" />
                          <span>DOWNLOAD PDF</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-3.5 h-3.5" />
                          <span>GO TO PORTAL</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">Quick Resources</span>
              {[
                { label: 'Exam Syllabus', icon: BookOpen },
                { label: 'Annual Calendar', icon: Calendar },
                { label: 'Application FAQs', icon: HelpCircle },
              ].map((res, idx) => (
                <button key={idx} className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 group-hover:bg-blue-50 group-hover:text-[#0B469B] transition-colors">
                      <res.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{res.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>

          </div>
        </section>

        {/* SECTION 5: How To Apply Stepper */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm space-y-12 w-full">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">How to Apply</h2>
            <p className="text-sm text-slate-500">Follow these simple steps to complete your application</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-slate-100 z-0" />
            
            {[
              { step: '1', title: 'Read Notification', desc: 'Download the detailed Advt and check eligibility criteria carefully.' },
              { step: '2', title: 'Register Online', desc: 'Create your account with a valid email and mobile number.' },
              { step: '3', title: 'Submit Details', desc: 'Fill the form, upload docs, and pay the examination fee.' },
              { step: '4', title: 'Download Hall Ticket', desc: 'Stay tuned for exam date announcements and admit cards.' },
            ].map((node, index) => (
              <div key={index} className="flex flex-col items-center text-center space-y-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-[#0B469B] text-white font-bold text-lg flex items-center justify-center shadow-md ring-4 ring-blue-50">
                  {node.step}
                </div>
                <div className="space-y-1.5 max-w-[220px]">
                  <h4 className="font-bold text-slate-800 text-[16px]">{node.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{node.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* SECTION 6: Footer */}
      <footer className="bg-[#EBF2FC] text-slate-700 border-t border-blue-100/60 w-full">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          
          <div className="space-y-4">
            <span className="text-xl font-bold text-[#0B469B]">BSSC Portal</span>
            <p className="text-sm text-slate-500 leading-relaxed">
              Providing transparent and efficient recruitment services for the state of Bihar.
            </p>
            <div className="flex items-center space-x-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-[#0B469B] shadow-sm transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-slate-500 hover:text-[#0B469B] shadow-sm transition-colors">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-[15px] tracking-wide uppercase opacity-90">Commission</h4>
            <ul className="space-y-2 text-sm font-medium text-slate-600">
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">About BSSC</a></li>
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">Our Vision</a></li>
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">Organization Structure</a></li>
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">RTI Disclosures</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-[15px] tracking-wide uppercase opacity-90">Quick Links</h4>
            <ul className="space-y-2 text-sm font-medium text-slate-600">
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">Latest Notifications</a></li>
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">Examination Calendar</a></li>
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">Admit Card Portal</a></li>
              <li><a href="#" className="hover:text-[#0B469B] transition-colors">Feedback</a></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-slate-800 text-[15px] tracking-wide uppercase opacity-90">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-600 font-medium">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0B469B] shrink-0 mt-0.5" />
                <span>Veterinary College Campus,<br />Patna, Bihar - 800014</span>
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
            <span>© 2026 Bihar Staff Selection Commission. Government of Bihar. All Rights Reserved.</span>
            <div className="flex items-center space-x-6">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}