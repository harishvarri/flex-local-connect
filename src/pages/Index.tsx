
import React, { useEffect, useState } from "react";
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
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { MapPin, Calendar, Clock, DollarSign, Search } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [location, setLocation] = useState("");
  const [matchedWorkers, setMatchedWorkers] = useState<typeof dummyWorkers>([]);

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

  const analyzeJobDescription = () => {
    if (jobDescription.trim().length < 10) {
      toast.error("Please provide a more detailed job description");
      return;
    }
    
    setAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Extract key terms from description to find workers
      const descriptionLower = jobDescription.toLowerCase();
      const keyTerms = [
        ...(descriptionLower.includes('clean') ? ['cleaning', 'sanitization'] : []),
        ...(descriptionLower.includes('deliver') ? ['delivery', 'driver'] : []),
        ...(descriptionLower.includes('data') ? ['data entry', 'administration'] : []),
        ...(descriptionLower.includes('event') ? ['event staff', 'catering'] : []),
        ...(descriptionLower.includes('repair') ? ['handyman', 'plumbing', 'electrical'] : []),
      ];
      
      // Use the key terms to find matching workers
      const matches = dummyWorkers.filter(worker => {
        // Check if worker has relevant skills
        const hasMatchingSkills = worker.skills.some(skill => 
          keyTerms.some(term => 
            skill.name.toLowerCase().includes(term.toLowerCase()) || 
            skill.category.toLowerCase().includes(term.toLowerCase())
          )
        );
        
        // Also match on location if it's been specified
        const matchesLocation = !location || 
                               worker.location.toLowerCase().includes(location.toLowerCase());
        
        return hasMatchingSkills && matchesLocation;
      });
      
      // Sort by rating and limit to top 3
      const sortedMatches = matches
        .sort((a, b) => {
          const aAvgRating = a.ratings.length > 0 
            ? a.ratings.reduce((sum, r) => sum + r.score, 0) / a.ratings.length 
            : 0;
          const bAvgRating = b.ratings.length > 0 
            ? b.ratings.reduce((sum, r) => sum + r.score, 0) / b.ratings.length 
            : 0;
          return bAvgRating - aAvgRating;
        })
        .slice(0, 3);
      
      setMatchedWorkers(sortedMatches);
      setAnalyzing(false);
      
      if (sortedMatches.length === 0) {
        toast.info("No matching workers found. Try a different job description or location.");
      } else {
        toast.success(`Found ${sortedMatches.length} potential workers`);
      }
    }, 1500);
  };

  const handlePostJob = () => {
    if (jobDescription.trim().length < 10) {
      toast.error("Please provide a more detailed job description");
      return;
    }
    
    toast.success("Redirecting to complete your job posting...");
    navigate("/post-job", { state: { description: jobDescription, location } });
  };

  return (
    <div className="min-h-screen">
      <AuthenticatedNavbar />
      <HeroSection />
      <FeatureSection />
      
      {/* New Employer Job Posting Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Post a Job in Seconds
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Describe your job needs and find qualified workers instantly
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-medium">Describe Your Job</h3>
                  <p className="text-sm text-gray-500">
                    Write a description including job title, requirements, salary, location and duration
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea 
                    placeholder="Example: I need a house cleaner for a 2 bedroom apartment in Mumbai Central this Friday from 10am to 2pm. Paying ₹800 for the job. Must have own supplies."
                    rows={5}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="resize-none"
                  />
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Input 
                      placeholder="Location (optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="sm:max-w-[14rem]"
                    />
                    
                    <div className="flex gap-2 ml-auto">
                      <Button 
                        variant="outline" 
                        onClick={analyzeJobDescription}
                        disabled={analyzing || jobDescription.length < 10}
                        className="whitespace-nowrap"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {analyzing ? "Analyzing..." : "Match Workers"}
                      </Button>
                      
                      <Button 
                        onClick={handlePostJob}
                        disabled={jobDescription.length < 10}
                      >
                        Post Job
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              {matchedWorkers.length > 0 ? (
                <Card>
                  <CardHeader>
                    <h3 className="text-lg font-medium">Matched Workers</h3>
                    <p className="text-sm text-gray-500">Top matches for your job</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {matchedWorkers.map((worker) => (
                      <div key={worker.id} className="border-b pb-3 last:border-0 last:pb-0">
                        <div className="font-medium">{worker.name}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {worker.location}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Skills: {worker.skills.slice(0, 2).map(s => s.name).join(", ")}
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="mt-2"
                          onClick={() => navigate(`/worker-profile/${worker.id}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    ))}
                    
                    <Button
                      className="w-full"
                      onClick={handlePostJob}
                    >
                      Complete Job Post
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center">
                    <Search className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="font-medium mb-2">Find the Perfect Worker</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Describe your job to see instant matches with qualified workers
                    </p>
                    <div className="grid grid-cols-2 gap-2 w-full text-xs text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 text-gray-400 mr-1" />
                        Location
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                        Date & Time
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        Duration
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-3 w-3 text-gray-400 mr-1" />
                        Payment
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <CategoryGrid />
      <HowItWorks />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
