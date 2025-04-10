
import React, { useEffect, useState } from "react";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Calendar, DollarSign, User, Briefcase, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Worker } from "@/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  payment: number;
  employer: {
    company_name: string;
  };
  skills: {
    name: string;
  }[];
}

const MatchingPage = () => {
  const { appUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [matchedJobs, setMatchedJobs] = useState<Job[]>([]);
  const [matchedWorkers, setMatchedWorkers] = useState<Worker[]>([]);
  const [activeTab, setActiveTab] = useState<string>("jobs");
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        
        if (!appUser) return;

        // Determine which matches to fetch based on user role
        if (appUser.role === 'worker') {
          setActiveTab("jobs");
          await fetchMatchedJobs();
        } else if (appUser.role === 'employer') {
          setActiveTab("workers");
          await fetchMatchedWorkers();
        }
      } catch (error) {
        console.error("Error fetching matches:", error);
        toast.error("Failed to load matching recommendations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMatches();
  }, [appUser]);

  const fetchMatchedJobs = async () => {
    if (!appUser || appUser.role !== 'worker') return;
    
    try {
      // This would normally use the job-matching edge function
      // For now, simulate matched jobs with a regular query
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          id,
          title,
          description,
          location,
          date,
          payment,
          employer:employer_id(company_name),
          job_skills(skills(name))
        `)
        .eq('status', 'open')
        .limit(5);

      if (error) throw error;
      
      if (data) {
        setMatchedJobs(data.map((job: any) => ({
          id: job.id,
          title: job.title,
          description: job.description,
          location: job.location,
          date: new Date(job.date).toLocaleDateString(),
          payment: job.payment,
          employer: {
            company_name: job.employer.company_name
          },
          skills: job.job_skills.map((js: any) => ({
            name: js.skills.name
          }))
        })));
      }
    } catch (error) {
      console.error("Error fetching matched jobs:", error);
    }
  };
  
  const fetchMatchedWorkers = async () => {
    if (!appUser || appUser.role !== 'employer') return;
    
    try {
      // This would normally use the job-matching edge function
      // For now, simulate matched workers with a regular query
      const { data, error } = await supabase
        .from("worker_profiles")
        .select(`
          *,
          profiles:id(id, name, location, bio),
          worker_skills(skills(name))
        `)
        .limit(5);

      if (error) throw error;
      
      if (data) {
        setMatchedWorkers(data.map((worker: any) => ({
          id: worker.profiles.id,
          name: worker.profiles.name,
          location: worker.profiles.location,
          bio: worker.profiles.bio,
          expectedWage: worker.expected_wage,
          skills: worker.worker_skills.map((ws: any) => ({
            name: ws.skills.name
          }))
        })));
      }
    } catch (error) {
      console.error("Error fetching matched workers:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">AI-Powered Matching</h1>
            <p className="mt-4 text-lg text-gray-500">
              {appUser?.role === 'worker' 
                ? 'Jobs that match your skills and preferences'
                : 'Workers that match your job requirements'}
            </p>
          </div>

          {appUser && (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList>
                  {appUser.role === 'worker' && (
                    <TabsTrigger value="jobs">
                      <Briefcase className="h-4 w-4 mr-2" />
                      Matching Jobs
                    </TabsTrigger>
                  )}
                  {appUser.role === 'employer' && (
                    <TabsTrigger value="workers">
                      <User className="h-4 w-4 mr-2" />
                      Matching Workers
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {appUser.role === 'worker' && (
                <TabsContent value="jobs">
                  {isLoading ? (
                    <div className="space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <Card key={i}>
                          <CardHeader>
                            <Skeleton className="h-6 w-2/3 mb-2" />
                            <Skeleton className="h-4 w-1/3" />
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-16 w-full mb-4" />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {matchedJobs.length > 0 ? (
                        matchedJobs.map((job) => (
                          <Card key={job.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <CardTitle>{job.title}</CardTitle>
                              <p className="text-sm text-gray-500">{job.employer.company_name}</p>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                                <div className="flex items-center text-gray-600">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  {job.location}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  {job.date}
                                </div>
                                <div className="flex items-center text-gray-600">
                                  <DollarSign className="h-4 w-4 mr-2" />
                                  ₹{job.payment} per hour
                                </div>
                              </div>
                              
                              <div className="mt-4 flex flex-wrap gap-2">
                                <span className="text-sm font-medium text-gray-700">Skills: </span>
                                {job.skills.map((skill, index) => (
                                  <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                    {skill.name}
                                  </span>
                                ))}
                              </div>
                              
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => navigate(`/job-application?job=${job.id}`)}
                                >
                                  View Job Details <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                          <p className="text-gray-500 mb-4">No matching jobs found. Complete your profile to get better matches.</p>
                          <Button onClick={() => navigate('/profile')}>
                            Update Profile
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              )}

              {appUser.role === 'employer' && (
                <TabsContent value="workers">
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                          <CardHeader>
                            <div className="flex items-center gap-4">
                              <Skeleton className="h-12 w-12 rounded-full" />
                              <div>
                                <Skeleton className="h-6 w-40 mb-2" />
                                <Skeleton className="h-4 w-32" />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Skeleton className="h-16 w-full mb-4" />
                            <div className="flex flex-wrap gap-2">
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-6 w-20" />
                              <Skeleton className="h-6 w-20" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {matchedWorkers.length > 0 ? (
                        matchedWorkers.map((worker) => (
                          <Card key={worker.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                              <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-6 w-6 text-gray-500" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{worker.name}</CardTitle>
                                  {worker.location && (
                                    <div className="flex items-center text-sm text-gray-600">
                                      <MapPin className="h-3 w-3 mr-1" />
                                      {worker.location}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                {worker.bio || 'No bio available'}
                              </p>
                              
                              {worker.skills && worker.skills.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {worker.skills.map((skill, index) => (
                                    <span key={index} className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                                      {skill.name}
                                    </span>
                                  ))}
                                </div>
                              )}
                              
                              {worker.expectedWage && (
                                <div className="text-sm font-medium">
                                  <span className="text-gray-700">Expected rate: </span>
                                  <span className="text-green-600">₹{worker.expectedWage}/hr</span>
                                </div>
                              )}
                              
                              <div className="mt-4">
                                <Button 
                                  variant="outline" 
                                  className="w-full"
                                  onClick={() => navigate(`/worker-profile/${worker.id}`)}
                                >
                                  View Profile <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm col-span-2">
                          <p className="text-gray-500 mb-4">No matching workers found. Post more specific job requirements.</p>
                          <Button onClick={() => navigate('/post-job')}>
                            Post a Job
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>
              )}
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MatchingPage;
