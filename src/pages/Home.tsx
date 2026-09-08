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
  HelpCircle,
  ChevronDown,
} from 'lucide-react';

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

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  name: string;
  faqs: FaqItem[];
}

export default function Home() {
  // --- States ---
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [sortBy, setSortBy] = useState('Latest Published');
  
  // FAQ States
  const [activeFaqCategory, setActiveFaqCategory] = useState<string>('Registration & Eligibility');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // --- Mock Data ---
  const notifications: NotificationItem[] = [
    {
      id: '1',
      title: 'Assistant Urdu Translator (सहायक उर्दू अनुवादक)[cite: 1]',
      dept: 'Cabinet Secretariat Department (Urdu Directorate)[cite: 1]',
      advtNo: '01/26[cite: 1]',
      publishedDate: '09.01.2026[cite: 1]',
      closingDate: '29.01.2026[cite: 1]',
      status: 'Open',
      isNew: true,
    },
  ];

  const recentNotices: RecentNotice[] = [
    {
      date: '09.01.2026[cite: 1]',
      title: 'ADV NO. 01/26, ASSISTANT URDU TRANSLATOR (सहायक उर्दू अनुवादक) Online Registration[cite: 1]',
      type: 'portal',
    },
  ];

  // --- FAQ Data ---
  const faqCategories: FaqCategory[] = [
    {
      name: "Registration & Eligibility",
      faqs: [
        {
          q: "I am unable to start a new registration — the 'Apply' button is not working. What should I do?",
          a: "Clear your browser cache and cookies, or try a different browser (Chrome or Firefox, latest version). Ensure pop-up blockers are disabled for the portal. If the issue persists, it is usually a server-load issue during peak hours — try again during off-peak times (early morning or late evening)."
        },
        {
          q: "Can I edit my personal details (name, date of birth, category) after final submission?",
          a: "No. Core details such as name, DOB, and category cannot be changed after final submission, as they are matched against your supporting certificates. Only the designated \"Correction Window\" (announced separately) allows limited edits."
        },
        {
          q: "I am not sure which post/category I am eligible for. Where can I check?",
          a: "Refer to the detailed eligibility criteria in the official notification (age limit, educational qualification, physical standards where applicable). The helpdesk cannot certify eligibility — this is determined by the Commission at the scrutiny stage."
        },
        {
          q: "Can I submit more than one application for the same post?",
          a: "Only one application per candidate per post is permitted. Multiple submissions may lead to rejection of all your applications. If you registered by mistake, do not create a second profile — contact the helpdesk with your Registration ID to resolve it."
        }
      ]
    },
    {
      name: "Login, OTP & Password",
      faqs: [
        {
          q: "I am not receiving the OTP on my registered mobile number/email.",
          a: "Wait at least 2–3 minutes before requesting a resend (frequent requests may trigger a temporary block). Check that your mobile has network signal and check the spam/junk folder for email OTPs. If it still fails after 3 attempts, share your Registration ID/mobile number with the helpdesk for manual verification."
        },
        {
          q: "I forgot my registration password. How do I reset it?",
          a: "Use the \"Forgot Password\" link on the login page. You'll need your registered mobile number or email and Registration ID. A reset link/OTP will be sent to your registered contact details — this cannot be changed without identity proof."
        },
        {
          q: "My account shows 'locked' after multiple failed login attempts. What now?",
          a: "Accounts are typically auto-unlocked after 30 minutes. If it remains locked beyond that, the helpdesk can manually unlock it — please provide your Registration ID and a copy of a valid ID proof."
        }
      ]
    },
    {
      name: "Photo & Signature Upload",
      faqs: [
        {
          q: "My photo/signature upload keeps failing.",
          a: "Check the file format (usually JPEG/JPG only) and size limit (commonly 20–50 KB for photo, 10–20 KB for signature — confirm exact limits in the notification). Use an online image compressor if the file exceeds the limit. Ensure the photo is a recent passport-size photograph with a plain background, and the signature is in black/blue ink on white paper."
        },
        {
          q: "Can I re-upload my photo after submission if it looks unclear?",
          a: "Only during the correction window, if one is announced. Otherwise, a blurred or non-compliant photo may be flagged during document verification, so it's best to get it right before final submission."
        }
      ]
    },
    {
      name: "Document Upload",
      faqs: [
        {
          q: "Which documents are mandatory to upload during registration?",
          a: "Typically: educational certificates/mark sheets, category certificate (if applicable), age proof, domicile/residence certificate, and photo/signature. The exact list is in the notification's \"Documents Required\" section — this can vary by post."
        },
        {
          q: "My certificate is in a language other than English — is that acceptable?",
          a: "Most Commissions require an English or Hindi language certificate, or a certified translation. If unsure, upload the original along with a translated/attested copy and flag it to the helpdesk for confirmation before final submission."
        },
        {
          q: "The portal is rejecting my document upload with a file size/format error.",
          a: "Convert the file to PDF (or the specified format) and compress it below the stated limit (commonly 100–200 KB per document). Free tools like SmallPDF or ILovePDF can help. Avoid scanning at very high DPI, which inflates file size unnecessarily."
        }
      ]
    },
    {
      name: "Application Fee & Payment",
      faqs: [
        {
          q: "I paid the application fee, but the status still shows 'Payment Pending.'",
          a: "This usually resolves within 24–48 hours as banks confirm the transaction. Do not make a second payment. If the status doesn't update after 48 hours, share your transaction ID/UTR number and payment date with the helpdesk."
        },
        {
          q: "I was charged twice for the same application. How do I get a refund?",
          a: "Duplicate/failed transactions where money was debited but the application wasn't confirmed are typically auto-refunded within 5–7 working days by the bank/payment gateway. If not received, raise a ticket with both transaction reference numbers."
        },
        {
          q: "Are there fee concessions for SC/ST/PwD/Ex-Servicemen candidates?",
          a: "No."
        },
        {
          q: "What payment modes are accepted?",
          a: "Typically net banking, debit/credit card, and UPI. If a particular mode fails repeatedly, try an alternate mode rather than retrying the same one multiple times."
        }
      ]
    },
    {
      name: "Form Correction",
      faqs: [
        {
          q: "I made a mistake in my application. Can I correct it now?",
          a: "Corrections are only allowed during the officially announced Correction Window, usually opened for a few days after the registration deadline. Outside this window, no changes can be made — watch for the official announcement."
        },
        {
          q: "What details typically CANNOT be corrected even during the correction window?",
          a: "Usually: category (once claimed with certificate), post applied for (in some cases), and the mobile number/email used for OTP verification. Always check the specific correction-window notice, as rules vary by exam cycle."
        }
      ]
    },
    {
      name: "Admit Card & Exam Centre",
      faqs: [
        {
          q: "When and where will the admit card be released?",
          a: "Admit cards are usually released 7–10 days before the exam date on the official portal, downloadable using your Registration ID and DOB/password. An SMS/email alert is usually sent, but candidates should proactively check the portal rather than rely solely on notifications."
        },
        {
          q: "Can I choose or change my exam centre?",
          a: "No."
        }
      ]
    },
    {
      name: "Technical & General",
      faqs: [
        {
          q: "The portal is very slow or not loading, especially close to the deadline.",
          a: "This is common due to heavy traffic near the last date. Avoid last-day submission; if you must, try during non-peak hours (late night/early morning) and avoid refreshing repeatedly, which can worsen server load."
        },
        {
          q: "I completed the form but didn't get a confirmation/printout. Is my application submitted?",
          a: "Log in and check your Application Status/Dashboard — if it shows \"Submitted\" or provides a downloadable acknowledgment, your application is registered. Always download and save the confirmation PDF immediately after submission; do not rely on email confirmation alone."
        },
        {
          q: "Do I need to send a hard copy of the application/documents by post?",
          a: "Generally no — most recruitment processes are now fully online, and physical documents are verified later at the interview/document-verification stage. Confirm this specifically in the notification, as it varies."
        }
      ]
    }
  ];

  const currentCategoryFaqs = faqCategories.find(c => c.name === activeFaqCategory)?.faqs || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans antialiased flex flex-col justify-between">
      
      {/* SECTION 1: Hero Banner */}
      <section
        className="w-full relative overflow-hidden bg-cover bg-center bg-no-repeat pt-26 pb-24 px-6"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(255,255,255,0.96) 0%,
              rgba(255,255,255,0.90) 25%,
              rgba(255,255,255,0.50) 35%,
              rgba(255,255,255,0) 100%
            ),
            url('/back.png')
          `,
        }}
      >
        <div className="max-w-7xl mx-auto w-full z-10 relative">
          <div className="max-w-2xl space-y-6 mt-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#0B469B] leading-[1.15] tracking-tight drop-shadow-sm">
              Bihar Staff Selection Commission Recruitment Portal
            </h1>

            <p className="max-w-xl text-[17px] md:text-[18px] leading-8 font-semibold text-slate-800 tracking-[0.01em]">
              The Bihar Staff Selection Commission (BSSC), located at Veterinary College,
              Patna, was established under Bihar State Act No. 7 of 2002 to conduct
              recruitment for various Government of Bihar posts up to Pay Level-7 in a
              transparent and merit-based manner.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button className="bg-[#0B469B] hover:bg-[#093a82] text-white px-6 py-3.5 rounded-xl font-semibold text-[15px] shadow-md flex items-center gap-2 transition-all group cursor-pointer">
                View Recruitment
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button className="bg-white hover:bg-slate-50 text-[#0B469B] border-2 border-blue-100 px-6 py-3.5 rounded-xl font-semibold text-[15px] shadow-sm transition-all cursor-pointer">
                Download Notifications
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container Core Layout Layer */}
      <main className="max-w-7xl mx-auto w-full px-6 pb-20 space-y-12 relative z-20">
        
        {/* OVERLAPPING STATS CARD COMPONENT */}
        <section className="-mt-16 md:-mt-20 lg:-mt-20 mb-6 bg-white border border-slate-100 rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/60 p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 divide-y md:divide-y-0 md:gap-4 lg:gap-0 lg:divide-x divide-slate-100 w-full">
          {[
            { label: 'Latest Advertisements', val: '1 Open', icon: Megaphone, desc: 'Active windows' },
            { label: 'Apply Online', val: '24x7', icon: BookOpen, desc: 'Digital application' },
            { label: 'Admit Cards', val: 'Download', icon: IdCard, desc: 'Hall tickets open' },
            { label: 'Notices', val: 'Updated Daily', icon: Bell, desc: 'Latest circulars' },
            { label: 'Results', val: 'Official', icon: Award, desc: 'Verified merits' },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-4 flex items-center space-x-4 ${
                index >= 2 ? 'pt-4 md:pt-0' : ''
              } ${index === 2 ? 'col-span-2 md:col-span-1' : ''}`}
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                <item.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-medium text-slate-400 block tracking-tight">
                  {item.label}
                </div>
                <div className="text-lg font-bold text-slate-800 leading-tight mt-0.5">
                  {item.val}
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* SECTION 4: Dual Panel Content */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full pt-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filter Dashboard Header */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Search keywords */}
              <div className="space-y-1.5 md:col-span-4">
                <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  Search Keywords
                </label>
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

              {/* Status */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  Status
                </label>
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

              {/* Sort By */}
              <div className="space-y-1.5 md:col-span-3">
                <label className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#0B469B] focus:bg-white transition-all cursor-pointer"
                >
                  <option>Latest Published</option>
                  <option>Closing Date Soon</option>
                </select>
              </div>

              {/* Filter Button */}
              <div className="md:col-span-3">
                <button className="bg-[#0B469B] hover:bg-[#093a82] text-white font-semibold text-sm h-[42px] rounded-xl transition-all shadow-sm w-full">
                  Apply Filter
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1">
              <h2 className="text-lg font-bold text-slate-800">
                Latest Recruitment Notifications
              </h2>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
                Showing {notifications.length} of 1 active posts
              </span>
            </div>

            {/* Recruitment Cards */}
            <div className="space-y-4">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:border-blue-100 transition-colors relative group w-full"
                >
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
                        <span className="text-xs text-slate-400 font-medium">
                          Published: {item.publishedDate}
                        </span>
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
                <a href="#" className="text-xs font-semibold text-[#0B469B] hover:underline">
                  View All
                </a>
              </div>
              <div className="space-y-3">
                {recentNotices.map((notice, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-transparent hover:border-blue-100 transition-all cursor-pointer space-y-1"
                  >
                    <span className="text-[11px] font-bold text-slate-400">
                      {notice.date}
                    </span>
                    <h4 className="text-sm font-semibold text-slate-700 leading-snug line-clamp-2">
                      {notice.title}
                    </h4>
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
          </div>
        </section>

        {/* SECTION 5: How To Apply Stepper */}
        <section className="bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-sm space-y-12 w-full">
          <div className="text-center max-w-md mx-auto space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">How to Apply</h2>
            <p className="text-sm text-slate-500">
              Follow these simple steps to complete your application
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            <div className="hidden lg:block absolute top-[28px] left-[12%] right-[12%] h-[2px] bg-slate-100 z-0" />

            {[
              {
                step: '1',
                title: 'Read Notification',
                desc: 'Download the detailed Advt and check eligibility criteria carefully.',
              },
              {
                step: '2',
                title: 'Register Online',
                desc: 'Create your account with a valid email and mobile number.',
              },
              {
                step: '3',
                title: 'Submit Details',
                desc: 'Fill the form, upload docs, and pay the examination fee.',
              },
              {
                step: '4',
                title: 'Download Application',
                desc: 'Stay tuned for exam date announcements and admit cards.',
              },
            ].map((node, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center space-y-4 relative z-10"
              >
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

        {/* SECTION 6: Frequently Asked Questions (FAQ) */}
        <section className="pt-6 w-full">
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#0B469B]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-sm text-slate-500 font-medium">Quick answers to common registration queries</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Category Sidebar (Scrollable row on mobile, Column on desktop) */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0 scrollbar-hide">
              {faqCategories.map((category) => (
                <button
                  key={category.name}
                  onClick={() => {
                    setActiveFaqCategory(category.name);
                    setExpandedFaqIndex(0); // Reset to first item when switching tabs
                  }}
                  className={`text-left px-4 py-3.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap lg:whitespace-normal flex-shrink-0 ${
                    activeFaqCategory === category.name 
                      ? 'bg-[#0B469B] text-white shadow-md' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Accordion Content Area */}
            <div className="lg:col-span-9 space-y-3">
              {currentCategoryFaqs.map((faq, index) => {
                const isExpanded = expandedFaqIndex === index;
                return (
                  <div 
                    key={index} 
                    className={`bg-white border rounded-2xl overflow-hidden transition-all duration-200 ${
                      isExpanded ? 'border-[#0B469B] shadow-sm' : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      onClick={() => setExpandedFaqIndex(isExpanded ? null : index)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                    >
                      <span className={`font-bold pr-6 text-[15px] ${isExpanded ? 'text-[#0B469B]' : 'text-slate-800'}`}>
                        {faq.q}
                      </span>
                      <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isExpanded ? 'bg-blue-50' : 'bg-slate-50'}`}>
                        <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-[#0B469B]' : 'text-slate-400'}`} />
                      </div>
                    </button>
                    
                    {/* Expandable Answer */}
                    <div 
                      className={`px-5 text-[14px] text-slate-600 leading-relaxed overflow-hidden transition-all duration-300 ease-in-out ${
                        isExpanded ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="pt-2 border-t border-slate-100">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                );
              })}
              
              <div className="mt-6 p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 leading-relaxed font-medium">
                <span className="font-bold text-slate-700">Note:</span> This FAQ is a general reference and does not override the official recruitment notification. In case of any conflict, the notification issued by Bihar Staff Selection Commission shall prevail.
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Optional styling for hiding scrollbar on the mobile category tabs */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
    </div>
  );
} 