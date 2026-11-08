import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import UploadResume from "./pages/UploadResume.jsx";
import ResumeDetails from "./pages/ResumeDetails.jsx";
import ATSReport from "./pages/ATSReport.jsx";
import JobSearch from "./pages/JobSearch.jsx";
import SavedJobs from "./pages/SavedJobs.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upload"
        element={
          <ProtectedRoute>
            <UploadResume />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume/:id"
        element={
          <ProtectedRoute>
            <ResumeDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ats-report/:resumeId"
        element={
          <ProtectedRoute>
            <ATSReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jobs"
        element={
          <ProtectedRoute>
            <JobSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Landing />} />
    </Routes>
  );
}

export default App;
