import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/PublicLayout";

// Public Pages
import HomePage from "./pages/HomePage";
import AllProjects from "./pages/AllProjects";

// Protected Route
import ProtectedRoute from "./components/ProtectedRoute";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import ProjectForm from "./pages/admin/ProjectForm";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import TestimonialForm from "./pages/admin/TestimonialForm";
import AdminSkills from "./pages/admin/AdminSkills";
import SkillForm from "./pages/admin/SkillForm";
import AdminSettings from "./pages/admin/AdminSettings";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="bg-slate-950 min-h-screen text-white selection:bg-accent/30 selection:text-accent">
          <Routes>
            {/* Public Routes - with Navbar & Footer */}
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

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/admin/reset-password/:token"
              element={<ResetPassword />}
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
              path="/admin/messages"
              element={
                <ProtectedRoute>
                  <AdminMessages />
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
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
