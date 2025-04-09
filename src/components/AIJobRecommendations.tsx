
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
}

interface AIJobRecommendationsProps {
  searchTerm?: string;
  location?: string;
  category?: string;
  onSelectJob?: (job: Job) => void;
}

const AIJobRecommendations = ({
  searchTerm = "",
  location = "",
  category = "",
  onSelectJob
}: AIJobRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // For now, we'll simulate AI recommendations with mock data
      // In a real implementation, this would call a Supabase Edge Function with OpenAI integration
      
      // Mock AI-recommended jobs - would be replaced by real API call
      const mockRecommendations = [
        {
          id: "ai-1",
          title: "Retail Assistant - Weekend Hours",
          company: "Fashion Mart",
          location: location || "Bandra West",
          category: category || "Retail",
          description: "Weekend retail position perfect for students or those looking for part-time work. Flexible hours and competitive pay."
        },
        {
          id: "ai-2",
          title: "Data Entry Work From Home",
          company: "Virtual Solutions",
          location: location || "Remote",
          category: category || "Administration",
          description: "Remote data entry position with flexible hours. Perfect for those looking to work from home on their own schedule."
        },
        {
          id: "ai-3",
          title: "Food Delivery Partner",
          company: "SpeedMeals",
          location: location || "Mumbai",
          category: category || "Delivery",
          description: "Deliver food orders using your own vehicle. Set your own hours and earn competitive pay per delivery."
        }
      ];
      
      // Filter based on search terms if provided
      const filtered = searchTerm 
        ? mockRecommendations.filter(job => 
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase()))
        : mockRecommendations;
      
      setRecommendations(filtered);
      
      // Later, this would be replaced with a real API call:
      // const { data, error } = await supabase.functions.invoke('ai-job-recommendations', {
      //   body: { searchTerm, location, category }
      // });
      //
      // if (error) throw error;
      // setRecommendations(data);
      
    } catch (err) {
      console.error("Error fetching AI recommendations:", err);
      setError("Failed to load AI recommendations. Please try again later.");
      toast.error("Could not load AI recommendations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [searchTerm, location, category]);

  const handleFeedback = (jobId: string, isPositive: boolean) => {
    // In a real app, send this feedback to improve recommendations
    toast.success(`Thank you for your feedback! We'll use it to improve your recommendations.`);
    
    // Later this would call a real API:
    // supabase.functions.invoke('record-ai-feedback', {
    //   body: { jobId, isPositive }
    // });
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
            AI Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-4">
            <div className="animate-pulse flex space-x-4">
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mb-6 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center">
            <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
            AI Job Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            onClick={fetchRecommendations}
          >
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return null; // Don't show the component if there are no recommendations
  }

  return (
    <Card className="mb-6 border-blue-100 bg-blue-50/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <BrainCircuit className="mr-2 h-5 w-5 text-blue-500" />
          AI Job Recommendations
        </CardTitle>
        <p className="text-sm text-gray-500">Personalized job matches based on your search</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recommendations.map((job) => (
            <div 
              key={job.id}
              className="p-3 bg-white rounded-md border border-blue-100 hover:border-blue-300 transition-colors cursor-pointer"
              onClick={() => onSelectJob && onSelectJob(job)}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company} · {job.location}</p>
                </div>
                <Badge variant="outline" className="bg-blue-50">{job.category}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
              <div className="flex justify-between items-center">
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  onSelectJob && onSelectJob(job);
                }}>
                  View Details
                </Button>
                <div className="flex space-x-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeedback(job.id, true);
                    }}
                  >
                    <ThumbsUp className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFeedback(job.id, false);
                    }}
                  >
                    <ThumbsDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AIJobRecommendations;
