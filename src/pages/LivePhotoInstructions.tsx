import React from "react";
import { 
  Camera, 
  Sun, 
  Smile, 
  UserCheck, 
  Wifi, 
  Ban, 
  ImageMinus, 
  CheckCircle2
} from "lucide-react";

const LivePhotoInstructions: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Page Header */}
      <div 
        className="rounded-2xl p-6 flex flex-col items-center text-center gap-3"
        style={{ background: "#F4F5F2", border: "1.5px solid #B9722E" }}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
          style={{ background: "#B9722E", color: "#FFFFFF" }}
        >
          <Camera size={32} />
        </div>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-wide gf-display" style={{ color: "#12233F" }}>
          Instructions for Live Photo Capture
        </h1>
        <p className="text-[13px] font-medium max-w-2xl leading-relaxed" style={{ color: "#5B6B84" }}>
          Your live photo is a mandatory security step. Please follow these rules to ensure your photo is approved by the system automatically.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* DO's Section */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: "#FFFFFF", border: "1.5px solid #DBDFE6" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 size={24} style={{ color: "#1E6F5C" }} />
            <h2 className="text-[16px] font-extrabold" style={{ color: "#1E6F5C" }}>What to Do</h2>
          </div>
          <div className="space-y-5">
            <RulePoint icon={Sun} text="Ensure you are in a well-lit area with sufficient lighting." />
            <RulePoint icon={Camera} text="Use the front camera of your device for capturing the live photo." />
            <RulePoint icon={UserCheck} text="Keep your face fully visible and look directly into the camera." />
            <RulePoint icon={Smile} text="Maintain a neutral facial expression and keep both eyes open." />
            <RulePoint icon={UserCheck} text="Ensure the background is plain and free from distractions." />
            <RulePoint icon={Wifi} text="Make sure your internet connection is stable during the capture process." />
          </div>
        </div>

        {/* DON'Ts Section */}
        <div 
          className="rounded-2xl p-6"
          style={{ background: "#FBEAE6", border: "1.5px solid #F0CFC5" }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Ban size={24} style={{ color: "#B3432B" }} />
            <h2 className="text-[16px] font-extrabold" style={{ color: "#B3432B" }}>What to Avoid</h2>
          </div>
          <div className="space-y-5">
            <RulePoint 
              icon={Ban} 
              text="Remove sunglasses, masks, caps, helmets, or any object covering your face." 
              danger 
            />
            <RulePoint 
              icon={ImageMinus} 
              text="Do not use another person's photograph, a printed photo, or a photo displayed on another device." 
              danger 
            />
            <RulePoint 
              icon={UserCheck} 
              text="Stay still while the live photo is being captured. Do not move excessively." 
              danger 
            />
            <RulePoint 
              icon={Ban} 
              text="The live photo must be captured by the applicant only. No one else should be in the frame." 
              danger 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Component for the rules list
const RulePoint = ({ icon: Icon, text, danger = false }: any) => (
  <div className="flex items-start gap-4">
    <div 
      className="p-2 rounded-lg shrink-0 mt-0.5"
      style={{ 
        background: danger ? "rgba(179, 67, 43, 0.1)" : "rgba(30, 111, 92, 0.1)", 
        color: danger ? "#B3432B" : "#1E6F5C" 
      }}
    >
      <Icon size={18} />
    </div>
    <p 
      className="text-[13px] font-semibold leading-relaxed pt-1" 
      style={{ color: danger ? "#B3432B" : "#12233F" }}
    >
      {text}
    </p>
  </div>
);

export default LivePhotoInstructions;