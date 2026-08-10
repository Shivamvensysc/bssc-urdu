import React from "react";
import { 
  FileText, 
  BookOpen, 
  CreditCard, 
  CheckCircle2, 
  ShieldAlert 
} from "lucide-react";

const FormInstructions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div 
        className="rounded-2xl p-6 md:p-8 flex items-start gap-4"
        style={{ background: "#12233F", color: "#FFFFFF" }}
      >
        <FileText size={36} className="shrink-0" style={{ color: "#B9722E" }} />
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-wide mb-2 gf-display">
            Important Instructions for Filling the BSSC Online Application Form
          </h1>
          <p className="text-sm font-medium opacity-80 leading-relaxed">
            Please read these guidelines carefully before proceeding with your application to avoid rejection.
          </p>
        </div>
      </div>

      {/* Group 1: Before You Begin */}
      <InstructionSection 
        title="Before You Begin" 
        icon={BookOpen} 
        color="#1E6F5C"
      >
        <ListPoint text="Read the official advertisement carefully before filling out the application form." />
        <ListPoint text="Ensure that you meet all eligibility criteria, including age, educational qualification, reservation, and other conditions." />
        <ListPoint text="Keep your mobile number and email ID active throughout the recruitment process, as all communications will be sent through them." />
      </InstructionSection>

      {/* Group 2: Form Details & Accuracy */}
      <InstructionSection 
        title="Form Details & Accuracy" 
        icon={CheckCircle2} 
        color="#8F5522"
      >
        <ListPoint text="Enter your name, father's name, mother's name, date of birth, and other personal details exactly as mentioned in your official documents." />
        <ListPoint text="Verify all information carefully before submitting. No correction may be allowed after final submission unless notified by BSSC." />
        <ListPoint text="Do not submit multiple applications for the same post unless specifically permitted in the official advertisement." />
        <ListPoint text="Applications with incomplete, incorrect, or false information are liable to be rejected." />
      </InstructionSection>

      {/* Group 3: Uploads & Payment */}
      <InstructionSection 
        title="Documents & Payment" 
        icon={CreditCard} 
        color="#12233F"
      >
        <ListPoint text="Upload your recent passport-size photograph, signature, live photo (if applicable), and required documents in the prescribed format and size." />
        <ListPoint text="Candidates claiming reservation or age relaxation must possess valid supporting certificates issued by the competent authority." />
        <ListPoint text="Pay the application fee only through the available online payment modes and keep the payment receipt for future reference." />
      </InstructionSection>

      {/* Group 4: Disclaimers & Next Steps */}
      <InstructionSection 
        title="Disclaimers & Next Steps" 
        icon={ShieldAlert} 
        color="#B3432B"
      >
        <ListPoint text="After successful submission, download and keep a copy of the final submitted application form and payment receipt for future reference." />
        <ListPoint text="Regularly visit the official BSSC website for updates regarding corrections, admit cards, examination schedules, and other important announcements." />
        <ListPoint text="BSSC will not be responsible for any delay caused by network issues, payment failures, or incorrect information provided by the candidate." />
        <ListPoint text="The decision of BSSC regarding eligibility, acceptance or rejection of the application, and the recruitment process shall be final." />
      </InstructionSection>
    </div>
  );
};

// Helper Components
const InstructionSection = ({ title, icon: Icon, color, children }: any) => (
  <div 
    className="rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md"
    style={{ background: "#FFFFFF", border: "1.5px solid #DBDFE6" }}
  >
    <div 
      className="px-5 py-3 flex items-center gap-3 border-b"
      style={{ borderColor: "#DBDFE6", background: "#F4F5F2" }}
    >
      <Icon size={20} style={{ color }} />
      <h2 className="text-[15px] font-extrabold" style={{ color: "#12233F" }}>{title}</h2>
    </div>
    <div className="p-5 space-y-4">
      {children}
    </div>
  </div>
);

const ListPoint = ({ text }: { text: string }) => (
  <div className="flex items-start gap-3">
    <div className="mt-1 shrink-0">
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#B9722E" }} />
    </div>
    <p className="text-[13px] font-medium leading-relaxed" style={{ color: "#5B6B84" }}>
      {text}
    </p>
  </div>
);

export default FormInstructions;