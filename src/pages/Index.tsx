
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import CategoryGrid from "@/components/CategoryGrid"; 
import HowItWorks from "@/components/HowItWorks";
import TestimonialSection from "@/components/TestimonialSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { dummyWorkers, dummyJobs } from "@/utils/dummyData";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Add sample data to check database connection
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Simple query to check connection
        const { data, error } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
          
        if (error) {
          console.error("Database connection error:", error);
          // Still load the demo data
          console.log("Loading demo data with 50+ workers:", dummyWorkers.length);
          console.log("Loading demo data with jobs:", dummyJobs.length);
        } else {
          console.log("Database connection successful");
          console.log("Using demo data with 50+ workers:", dummyWorkers.length);
        }
      } catch (err) {
        console.error("Error checking database connection:", err);
      }
    };
    
    checkConnection();
  }, []);

  const handleFeatureClick = (path: string) => {
    navigate(path);
  };

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
