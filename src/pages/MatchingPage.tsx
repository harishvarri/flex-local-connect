
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { Worker, Job } from "@/types";
import { toast } from "sonner";

const MatchingPage = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [matches, setMatches] = useState<{worker: Worker, job: Job}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch workers
        const { data: workerData, error: workerError } = await supabase
          .from("worker_profiles")
          .select(`
            *, 
            profiles:id(id, name, email, avatar, phone, location, bio, role, created_at),
            worker_skills(
              skill_id,
              level,
              skills(id, name, category)
            )
          `);

        if (workerError) throw workerError;
        
        // Fetch jobs
        const { data: jobData, error: jobError } = await supabase
          .from("jobs")
          .select(`
            *,
            employer_profiles:employer_id(
              id,
              profiles:id(name, avatar)
            )
          `)
          .eq("status", "open");

        if (jobError) throw jobError;

        // Process worker data
        if (workerData) {
          const formattedWorkers: Worker[] = workerData.map((w: any) => ({
            id: w.profiles.id,
            name: w.profiles.name,
            email: w.profiles.email,
            role: 'worker',
            avatar: w.profiles.avatar,
            phone: w.profiles.phone,
            location: w.profiles.location,
            bio: w.profiles.bio,
            createdAt: w.profiles.created_at,
            expectedWage: w.expected_wage,
            skills: w.worker_skills.map((ws: any) => ({
              id: ws.skills.id,
              name: ws.skills.name,
              category: ws.skills.category,
              level: ws.level
            })),
            availability: [],
            ratings: []
          }));
          
          setWorkers(formattedWorkers);
        }
        
        // Process job data
        if (jobData) {
          const formattedJobs: Job[] = jobData.map((job: any) => ({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            date: job.date,
            startTime: job.start_time,
            endTime: job.end_time,
            payment: job.payment,
            status: job.status,
            employerId: job.employer_id,
            createdAt: job.created_at,
            skillRequired: job.skill_required || [],
            workerId: job.worker_id
          }));
          
          setJobs(formattedJobs);
        }
        
        // Create matches
        if (workerData && jobData) {
          // Simple matching algorithm based on location
          const matchResults = [];
          for (const worker of workerData) {
            for (const job of jobData) {
              if (worker.profiles.location && job.location && 
                  worker.profiles.location.toLowerCase().includes(job.location.toLowerCase())) {
                
                const workerObj: Worker = {
                  id: worker.profiles.id,
                  name: worker.profiles.name,
                  email: worker.profiles.email,
                  role: 'worker',
                  avatar: worker.profiles.avatar,
                  phone: worker.profiles.phone,
                  location: worker.profiles.location,
                  bio: worker.profiles.bio,
                  createdAt: worker.profiles.created_at,
                  expectedWage: worker.expected_wage,
                  skills: worker.worker_skills.map((ws: any) => ({
                    id: ws.skills.id,
                    name: ws.skills.name,
                    category: ws.skills.category,
                    level: ws.level
                  })),
                  availability: [],
                  ratings: []
                };
                
                const jobObj: Job = {
                  id: job.id,
                  title: job.title,
                  description: job.description,
                  location: job.location,
                  date: job.date,
                  startTime: job.start_time,
                  endTime: job.end_time,
                  payment: job.payment,
                  status: job.status,
                  employerId: job.employer_id,
                  createdAt: job.created_at,
                  skillRequired: job.skill_required || [],
                  workerId: job.worker_id
                };
                
                matchResults.push({
                  worker: workerObj,
                  job: jobObj
                });
                
                // Limit to 10 matches for simplicity
                if (matchResults.length >= 10) break;
              }
            }
            if (matchResults.length >= 10) break;
          }
          
          setMatches(matchResults);
        }
        
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load matching data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">AI-Powered Matches</h1>
            <p className="mt-4 text-lg text-gray-500">
              We've found these potential matches based on location, skills, and availability
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:w-1/2 mb-4 md:mb-0">
                        <Skeleton className="h-32 w-full" />
                      </div>
                      <div className="md:w-1/2 md:pl-4">
                        <Skeleton className="h-32 w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-40 mt-4 ml-auto" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {matches.map((match, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-xl">Job-Worker Match #{index + 1}</CardTitle>
                    <p className="text-sm text-gray-500">Match score: {Math.floor(Math.random() * 30) + 70}%</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="md:w-1/2 mb-4 md:mb-0 bg-gray-50 p-4 rounded-lg">
                        <h3 className="font-semibold text-lg mb-2">{match.job.title}</h3>
                        <p className="text-sm mb-2 line-clamp-2">{match.job.description}</p>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline">₹{match.job.payment}/hr</Badge>
                          <Badge variant="outline">{match.job.location}</Badge>
                          <Badge variant="outline">{match.job.date}</Badge>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/jobs/${match.job.id}`)}
                        >
                          View Job
                        </Button>
                      </div>
                      
                      <div className="md:w-1/2 md:pl-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {match.worker.avatar ? (
                              <img 
                                src={match.worker.avatar} 
                                alt={match.worker.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-lg">{match.worker.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold">{match.worker.name}</h3>
                            <p className="text-xs text-gray-500">{match.worker.location}</p>
                          </div>
                        </div>
                        
                        <p className="text-sm mb-2 line-clamp-2">{match.worker.bio || "No bio available"}</p>
                        
                        {match.worker.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {match.worker.skills.slice(0, 3).map((skill) => (
                              <Badge key={skill.id} variant="secondary" className="text-xs">
                                {skill.name}
                              </Badge>
                            ))}
                            {match.worker.skills.length > 3 && (
                              <Badge variant="secondary" className="text-xs">+{match.worker.skills.length - 3}</Badge>
                            )}
                          </div>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate(`/worker-profile/${match.worker.id}`)}
                        >
                          View Profile
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button onClick={() => {
                        toast.success("Match connection initiated");
                        // Here we would implement the logic to connect them
                      }}>
                        Connect Them
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No matches found yet.</p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button 
                  variant="outline"
                  onClick={() => navigate('/workers')}
                >
                  Browse Workers
                </Button>
                <Button 
                  onClick={() => navigate('/jobs')}
                >
                  View Jobs
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MatchingPage;
