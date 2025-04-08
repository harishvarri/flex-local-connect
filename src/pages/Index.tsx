
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import HowItWorks from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import CategoryGrid from "@/components/CategoryGrid";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="pt-16"> {/* Add padding for navbar */}
          <HeroSection />
          <FeatureSection />
          <CategoryGrid />
          <HowItWorks />
          <TestimonialSection />
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
