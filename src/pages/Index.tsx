
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
import { MapPin, Calendar, Clock, DollarSign, Search, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [location, setLocation] = useState("");
  const [matchedWorkers, setMatchedWorkers] = useState<typeof dummyWorkers>([]);
  const [jobTitle, setJobTitle] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [jobStartTime, setJobStartTime] = useState("");
  const [jobEndTime, setJobEndTime] = useState("");
  const [payment, setPayment] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [jobPostSuccess, setJobPostSuccess] = useState(false);

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
    
    // Extract job details from description if possible
    const descriptionLower = jobDescription.toLowerCase();
    
    // Try to extract job title
    if (!jobTitle) {
      const titleMatch = jobDescription.match(/need (a|an) ([^,.]+)/i) || 
                        jobDescription.match(/looking for (a|an) ([^,.]+)/i) ||
                        jobDescription.match(/hiring (a|an) ([^,.]+)/i);
      if (titleMatch && titleMatch[2]) {
        const extractedTitle = titleMatch[2].trim();
        if (extractedTitle.length < 30) {
          setJobTitle(extractedTitle.charAt(0).toUpperCase() + extractedTitle.slice(1));
        }
      }
    }
    
    // Try to extract payment
    if (!payment) {
      const paymentMatch = descriptionLower.match(/₹(\d+)/) || 
                          descriptionLower.match(/rs\.? ?(\d+)/) ||
                          descriptionLower.match(/rupees (\d+)/) ||
                          descriptionLower.match(/paying (\d+)/);
      if (paymentMatch && paymentMatch[1]) {
        setPayment(paymentMatch[1]);
      }
    }
    
    // Try to extract date
    if (!jobDate) {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const dayMatch = descriptionLower.match(/on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i) ||
                      descriptionLower.match(/this (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i) ||
                      descriptionLower.match(/next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i);
      
      if (dayMatch && dayMatch[1]) {
        const targetDay = dayMatch[1].toLowerCase();
        const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const targetDayIndex = daysOfWeek.indexOf(targetDay);
        
        if (targetDayIndex !== -1) {
          const currentDayIndex = today.getDay();
          let daysToAdd = targetDayIndex - currentDayIndex;
          if (daysToAdd <= 0) daysToAdd += 7; // Next week if day has passed
          
          const targetDate = new Date(today);
          targetDate.setDate(today.getDate() + daysToAdd);
          setJobDate(targetDate.toISOString().split('T')[0]);
        }
      } else if (descriptionLower.includes("today")) {
        setJobDate(today.toISOString().split('T')[0]);
      } else if (descriptionLower.includes("tomorrow")) {
        setJobDate(tomorrow.toISOString().split('T')[0]);
      }
    }
    
    // Try to extract time
    if (!jobStartTime || !jobEndTime) {
      const timeMatch = descriptionLower.match(/from (\d+)(am|pm)? to (\d+)(am|pm)?/i) ||
                       descriptionLower.match(/(\d+)(am|pm)? to (\d+)(am|pm)?/i) ||
                       descriptionLower.match(/between (\d+)(am|pm)? and (\d+)(am|pm)?/i);
      
      if (timeMatch) {
        let startHour = parseInt(timeMatch[1]);
        const startAmPm = timeMatch[2]?.toLowerCase();
        let endHour = parseInt(timeMatch[3]);
        const endAmPm = timeMatch[4]?.toLowerCase();
        
        // Convert to 24-hour format
        if (startAmPm === "pm" && startHour < 12) startHour += 12;
        if (startAmPm === "am" && startHour === 12) startHour = 0;
        if (endAmPm === "pm" && endHour < 12) endHour += 12;
        if (endAmPm === "am" && endHour === 12) endHour = 0;
        
        setJobStartTime(`${startHour.toString().padStart(2, '0')}:00`);
        setJobEndTime(`${endHour.toString().padStart(2, '0')}:00`);
      }
    }
    
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
        setShowDetails(true);
      }
    }, 1500);
  };

  const handlePostJob = async () => {
    if (jobDescription.trim().length < 10) {
      toast.error("Please provide a more detailed job description");
      return;
    }

    if (!user) {
      toast.info("Please sign in to post a job");
      navigate("/login", { state: { 
        returnUrl: "/post-job", 
        jobData: { description: jobDescription, location, title: jobTitle } 
      }});
      return;
    }
    
    setIsPosting(true);

    try {
      // If user has completed additional details
      if (showDetails && jobTitle && jobDate && jobStartTime && jobEndTime && payment) {
        // Insert job into Supabase
        const { data, error } = await supabase
          .from('jobs')
          .insert({
            title: jobTitle,
            description: jobDescription,
            location: location || "Not specified",
            date: jobDate,
            start_time: jobStartTime,
            end_time: jobEndTime,
            payment: Number(payment),
            employer_id: user.id,
            status: 'open'
          })
          .select();

        if (error) {
          console.error("Error posting job:", error);
          toast.error("Failed to post job. Please try again later.");
          setIsPosting(false);
          return;
        }

        toast.success("Job posted successfully!");
        setJobPostSuccess(true);
        
        // Clear the form
        setJobDescription("");
        setLocation("");
        setJobTitle("");
        setJobDate("");
        setJobStartTime("");
        setJobEndTime("");
        setPayment("");
        setMatchedWorkers([]);
        setShowDetails(false);
      } else {
        // If user hasn't completed the form, expand it
        setShowDetails(true);
        toast.info("Please complete all job details");
      }
    } catch (error) {
      console.error("Error posting job:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleCloseSuccess = () => {
    setJobPostSuccess(false);
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
                        disabled={isPosting || jobDescription.length < 10}
                      >
                        {isPosting ? "Posting..." : "Post Job"}
                      </Button>
                    </div>
                  </div>

                  {/* Additional job details when showDetails is true */}
                  {showDetails && (
                    <div className="mt-6 border-t pt-6 space-y-4">
                      <h4 className="font-medium">Complete Job Details</h4>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Job Title
                        </label>
                        <Input 
                          value={jobTitle}
                          onChange={(e) => setJobTitle(e.target.value)}
                          placeholder="E.g., House Cleaner, Delivery Driver"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                          </label>
                          <Input 
                            type="date"
                            value={jobDate}
                            onChange={(e) => setJobDate(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Time
                          </label>
                          <Input 
                            type="time"
                            value={jobStartTime}
                            onChange={(e) => setJobStartTime(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Time
                          </label>
                          <Input 
                            type="time"
                            value={jobEndTime}
                            onChange={(e) => setJobEndTime(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Amount (₹)
                        </label>
                        <Input 
                          type="number"
                          value={payment}
                          onChange={(e) => setPayment(e.target.value)}
                          placeholder="E.g., 800"
                        />
                      </div>
                    </div>
                  )}
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
                    {matchedWorkers.map((worker) => {
                      const avgRating = worker.ratings.length > 0 
                        ? worker.ratings.reduce((sum, r) => sum + r.score, 0) / worker.ratings.length 
                        : 0;
                        
                      return (
                        <div key={worker.id} className="border-b pb-3 last:border-0 last:pb-0">
                          <div className="font-medium">{worker.name}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {worker.location}
                          </div>
                          <div className="flex items-center mt-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3 w-3 ${
                                  star <= Math.round(avgRating)
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-xs text-gray-500">
                              ({worker.ratings.length})
                            </span>
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
                      );
                    })}
                    
                    <Button
                      className="w-full"
                      onClick={handlePostJob}
                      disabled={isPosting}
                    >
                      {isPosting ? "Posting..." : "Complete Job Post"}
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
      
      {/* Success Dialog */}
      <Dialog open={jobPostSuccess} onOpenChange={setJobPostSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Job Posted Successfully!</DialogTitle>
            <DialogDescription>
              Your job has been posted and is now visible to potential workers.
              You'll be notified when someone applies.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={handleCloseSuccess}>
              Post Another Job
            </Button>
            <Button onClick={() => navigate('/jobs')}>
              View All Jobs
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <CategoryGrid />
      <HowItWorks />
      <TestimonialSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
