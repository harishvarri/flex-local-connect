
import React from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import CategoryGrid from "@/components/CategoryGrid"; 
import HowItWorks from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <AuthenticatedNavbar />
      <HeroSection />
      <FeatureSection />
      <CategoryGrid />
      <HowItWorks />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
