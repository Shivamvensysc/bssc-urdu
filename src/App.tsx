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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Home page without layout */}
        {/* <Route path="/" element={<HomePage />} /> */}

        {/* All routes below will use Layout */}
        <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/header" element={<ApplicationPortalHeader />} />
          <Route path="/personal" element={<PersonalDetailsForm />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/education" element={<Qualification />} />
          <Route path="/liveupload" element={<LivePhotoUpload />} />
          <Route path="/login" element={<BSSCLoginPortal />} />
          <Route path="/forgot-password" element={<BSSCForgotPassword />} />
          <Route
            path="/forgot-registration"
            element={<BSSCForgotRegistration />}
          />
        </Route>

        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardContent />} />

          <Route path="/application" element={<ApplicationFormContent />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}