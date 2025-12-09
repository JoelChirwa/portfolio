import React, { Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { LoaderProvider } from "./context/LoaderContext";
import ScrollToTop from "./components/ScrollToTop";
import PageLoader from "./components/PageLoader";
import WhatsAppButton from "./components/WhatsAppButton";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicLayout from "./components/PublicLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import AllProjects from "./pages/AllProjects";
import ConsultationPage from "./pages/ConsultationPage";
import ConsultationSuccess from "./pages/ConsultationSuccess";
import AllSkills from "./pages/AllSkills";
import NotFound from "./pages/NotFound";
// import BlogPage from "./pages/BlogPage"; // Coming soon

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import ProjectForm from "./pages/admin/ProjectForm";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import TestimonialForm from "./pages/admin/TestimonialForm";
import AdminSkills from "./pages/admin/AdminSkills";
import SkillForm from "./pages/admin/SkillForm";
import AdminSettings from "./pages/admin/AdminSettings";
import EngagementAnalytics from "./pages/admin/EngagementAnalytics";
import AdminConsultations from "./pages/admin/AdminConsultations";
import AdminNewsletter from "./pages/admin/AdminNewsletter";
import AdminCampaigns from "./pages/admin/AdminCampaigns";
import CampaignEditor from "./pages/admin/CampaignEditor";
import AdminBlogs from "./pages/admin/AdminBlogs";
import BlogEditor from "./pages/admin/BlogEditor";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";

const App = () => {
  return (
    <LoaderProvider>
      <Router>
        <AuthProvider>
          <ScrollToTop />
          <PageLoader />
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid #475569",
              },
              success: {
                style: {
                  background: "#1e293b",
                  color: "#10b981",
                },
              },
              error: {
                style: {
                  background: "#1e293b",
                  color: "#ef4444",
                },
              },
            }}
          />

          <div className="bg-slate-900 min-h-screen text-white relative">
            <WhatsAppButton />

            <Routes>
              {/* Public Routes */}
              <Route
                path="/"
                element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                }
              />
              <Route
                path="/projects"
                element={
                  <PublicLayout>
                    <AllProjects />
                  </PublicLayout>
                }
              />
              <Route
                path="/consultation"
                element={
                  <PublicLayout>
                    <ConsultationPage />
                  </PublicLayout>
                }
              />
              <Route
                path="/consultation/success"
                element={
                  <PublicLayout>
                    <ConsultationSuccess />
                  </PublicLayout>
                }
              />
              <Route
                path="/skills"
                element={
                  <PublicLayout>
                    <AllSkills />
                  </PublicLayout>
                }
              />
              {/* <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} /> */}

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/forgot-password"
                element={<ForgotPassword />}
              />
              <Route
                path="/admin/reset-password/:token"
                element={<ResetPassword />}
              />

              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Navigate to="/admin/dashboard" replace />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects"
                element={
                  <ProtectedRoute>
                    <AdminProjects />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/new"
                element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects/edit/:id"
                element={
                  <ProtectedRoute>
                    <ProjectForm />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/testimonials"
                element={
                  <ProtectedRoute>
                    <AdminTestimonials />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials/new"
                element={
                  <ProtectedRoute>
                    <TestimonialForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/testimonials/edit/:id"
                element={
                  <ProtectedRoute>
                    <TestimonialForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/skills"
                element={
                  <ProtectedRoute>
                    <AdminSkills />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/skills/new"
                element={
                  <ProtectedRoute>
                    <SkillForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/skills/edit/:id"
                element={
                  <ProtectedRoute>
                    <SkillForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/engagement"
                element={
                  <ProtectedRoute>
                    <EngagementAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/consultations"
                element={
                  <ProtectedRoute>
                    <AdminConsultations />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/newsletter"
                element={
                  <ProtectedRoute>
                    <AdminNewsletter />
                  </ProtectedRoute>
                }
              />

              {/* Campaign Routes */}
              <Route
                path="/admin/campaigns"
                element={
                  <ProtectedRoute>
                    <AdminCampaigns />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/campaigns/new"
                element={
                  <ProtectedRoute>
                    <CampaignEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/campaigns/edit/:id"
                element={
                  <ProtectedRoute>
                    <CampaignEditor />
                  </ProtectedRoute>
                }
              />

              {/* Blog Admin Routes */}
              <Route
                path="/admin/blogs"
                element={
                  <ProtectedRoute>
                    <AdminBlogs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/new"
                element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/blogs/edit/:id"
                element={
                  <ProtectedRoute>
                    <BlogEditor />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - 404 Page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </LoaderProvider>
  );
};

export default App;
