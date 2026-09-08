import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Index";

import HomePage from "./pages/Home";
import RegistrationForm from "./pages/RegistrationForm";
import ApplicationPortalHeader from "./components/ApplicationPortalHeader";
import PersonalDetailsForm from "./components/PersonalDetailsForm";
import UploadForm from "./components/UploadForm";
import Qualification from "./components/Qualification";
import LivePhotoUpload from "./components/LivePhotoUpload";
import BSSCLoginPortal from "./pages/BSSCLoginPortal";
import BSSCForgotPassword from "./pages/BSSCForgotPassword";
import BSSCForgotRegistration from "./pages/BSSCForgotRegistration";
import DashboardLayout from "./layout/Dashboard/DashboardLayout";
import DashboardContent from "./pages/Dashboardcontent";
import ApplicationFormContent from "./pages/Application";
import FormInstructions from "./pages/FormInstructions";
import LivePhotoInstructions from "./pages/LivePhotoInstructions";

import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./utils/ProtectedRoute"

// NEW: per-app auth provider wrappers (each mounts its own AuthProvider
// with its own ZITADEL config, scoped only to its route subtree)
import CandidateAuthProvider from "./CandidateAuthProvider";




export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================================================
            CANDIDATE ROUTES — wrapped in CandidateAuthProvider so this
            subtree uses the candidate's own ZITADEL client_id/scope.
            Everything below is otherwise identical to the original.
        ============================================================= */}
        <Route element={<CandidateAuthProvider />}>
          <Route path="/auth/callback" element={<AuthCallback />} />
          {/* All routes below will use Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegistrationForm />} />
            <Route path="/header" element={<ApplicationPortalHeader />} />
            <Route path="/personal" element={<PersonalDetailsForm />} />
            <Route path="/upload" element={<UploadForm />} />
            <Route path="/education" element={<Qualification />} />
            <Route path="/liveupload" element={<LivePhotoUpload />} />
            <Route path="/instructions" element={<LivePhotoInstructions />} />
            <Route path="/how-to-apply" element={<FormInstructions />} />
            <Route path="/login" element={<BSSCLoginPortal />} />
            <Route path="/forgot-password" element={<BSSCForgotPassword />} />
            <Route
              path="/forgot-registration"
              element={<BSSCForgotRegistration />}
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardContent />} />
              <Route path="/application" element={<ApplicationFormContent />} />
            </Route>
          </Route>
        </Route>

      
  
      </Routes>
    </BrowserRouter>
  );
}