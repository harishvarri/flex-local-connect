
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";

const PostJob = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [jobDate, setJobDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [payment, setPayment] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Check if user is logged in and is an employer
  useEffect(() => {
    const checkUserRole = async () => {
      if (!isLoading && !user) {
        toast({
          title: "Authentication required",
          description: "Please log in as an employer to post jobs",
          variant: "destructive"
        });
        navigate("/login", { state: { returnTo: "/post-job" } });
      } else if (user && user.role !== "employer") {
        toast({
          title: "Employer access only",
          description: "Only employers can post jobs",
          variant: "destructive"
        });
        navigate("/");
      }
    };
    
    checkUserRole();
  }, [user, isLoading, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Form validation
    if (!title || !description || !location || !jobDate || !startTime || !endTime || !payment || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }
    
    if (isNaN(Number(payment)) || Number(payment) <= 0) {
      toast({
        title: "Invalid payment amount",
        description: "Please enter a valid payment amount",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to post jobs",
        variant: "destructive"
      });
      navigate("/login", { state: { returnTo: "/post-job" } });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Format date correctly for PostgreSQL
      const formattedDate = format(new Date(jobDate), 'yyyy-MM-dd');
      
      // Insert job into database
      const { data: jobData, error: jobError } = await supabase
        .from("jobs")
        .insert([
          {
            title,
            description,
            location,
            date: formattedDate,
            start_time: startTime,
            end_time: endTime,
            payment: Number(payment),
            employer_id: user.id,
            status: "open"
          }
        ])
        .select("id");
      
      if (jobError) {
        console.error("Error posting job:", jobError);
        throw new Error(jobError.message || "Failed to post job");
      }
      
      if (!jobData || jobData.length === 0) {
        throw new Error("No job data returned");
      }
      
      const jobId = jobData[0].id;
      
      // Now add the job skills
      if (category) {
        // First, check if the skill/category exists
        const { data: skillData, error: skillQueryError } = await supabase
          .from("skills")
          .select("id")
          .eq("category", category)
          .maybeSingle();
        
        if (skillQueryError) {
          console.error("Error finding skill:", skillQueryError);
        }
        
        let skillId;
        
        if (!skillData) {
          // Create the skill if it doesn't exist
          const { data: newSkill, error: skillInsertError } = await supabase
            .from("skills")
            .insert([{ name: category, category }])
            .select("id")
            .single();
          
          if (skillInsertError) {
            console.error("Error creating skill:", skillInsertError);
          } else {
            skillId = newSkill.id;
          }
        } else {
          skillId = skillData.id;
        }
        
        // Link the skill to the job
        if (skillId) {
          const { error: jobSkillError } = await supabase
            .from("job_skills")
            .insert([{ job_id: jobId, skill_id: skillId }]);
          
          if (jobSkillError) {
            console.error("Error linking skill to job:", jobSkillError);
          }
        }
      }
      
      toast({
        title: "Job posted successfully",
        description: "Workers can now apply to your job",
      });
      
      // Clear form
      setTitle("");
      setDescription("");
      setLocation("");
      setJobDate("");
      setStartTime("");
      setEndTime("");
      setPayment("");
      setCategory("");
      
      // Redirect to jobs page
      navigate("/jobs");
      
    } catch (error: any) {
      console.error("Error in job posting process:", error);
      toast({
        title: "Failed to post job",
        description: error.message || "Please try again",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900">Post a New Job</h1>
            <p className="mt-2 text-lg text-gray-600">
              Find skilled workers quickly for your temporary or flexible job needs
            </p>
          </div>

          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
                <CardDescription>
                  Fill in the details of your job posting to attract the right candidates
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g. Office Cleaning Staff"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe the job responsibilities, requirements, and any other relevant details"
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g. Mumbai Central"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={jobDate}
                      onChange={(e) => setJobDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start Time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End Time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment">Payment (₹ per day)</Label>
                    <Input
                      id="payment"
                      type="number"
                      placeholder="e.g. 1500"
                      value={payment}
                      onChange={(e) => setPayment(e.target.value)}
                      min={1}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Job Category</Label>
                    <Select value={category} onValueChange={setCategory} required>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cleaning">Cleaning</SelectItem>
                        <SelectItem value="Delivery">Delivery</SelectItem>
                        <SelectItem value="Administration">Administration</SelectItem>
                        <SelectItem value="Events">Events</SelectItem>
                        <SelectItem value="Skilled Trade">Skilled Trade</SelectItem>
                        <SelectItem value="Warehouse">Warehouse</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Food Service">Food Service</SelectItem>
                        <SelectItem value="Construction">Construction</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Post Job"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
