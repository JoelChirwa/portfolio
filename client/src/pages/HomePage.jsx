import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Process from "../components/Process";
import Portfolio from "../components/Portfolio";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import Contact from "../components/Contact";
import FAQ from "../components/FAQ";
import usePageTracking from "../hooks/usePageTracking";

const HomePage = () => {
  // Track page view
  usePageTracking("Home");

  return (
    <>
      <Hero />
      <About />
      <Services />
      <Process />
      <Portfolio />
      <Testimonials />
      <FAQ />
      <CTA />
      <Contact />
    </>
  );
};

export default HomePage;
