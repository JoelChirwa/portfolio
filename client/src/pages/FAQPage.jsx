import React from "react";
import FAQ from "../components/FAQ";
import usePageTracking from "../hooks/usePageTracking";

const FAQPage = () => {
  // Track page view
  usePageTracking("FAQ");

  return (
    <div className="min-h-screen bg-slate-900">
      <FAQ />
    </div>
  );
};

export default FAQPage;
