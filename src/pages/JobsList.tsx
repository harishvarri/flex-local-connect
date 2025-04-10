
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Calendar, DollarSign, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  start_time: string;
  end_time: string;
  payment: number;
  status: 'open' | 'assigned' | 'completed' | 'cancelled';
  employer: {
    id: string;
    name: string;
    company_name: string;
  };
  skills: {
    id: string;
    name: string;
    category: string;
  }[];
  created_at: string;
}

const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${suffix}`;
};

const JobsList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const jobsPerPage = 6;

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("jobs")
          .select(`
            *,
            employer:employer_id(
              id, 
              profiles:id(name),
              company_name
            ),
            job_skills(
              skills(id, name, category)
            )
          `)
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (data) {
          const formattedJobs: Job[] = data.map((job: any) => ({
            id: job.id,
            title: job.title,
            description: job.description,
            location: job.location,
            date: new Date(job.date).toLocaleDateString(),
            start_time: formatTime(job.start_time),
            end_time: formatTime(job.end_time),
            payment: job.payment,
            status: job.status,
            employer: {
              id: job.employer.id,
              name: job.employer.profiles.name,
              company_name: job.employer.company_name
            },
            skills: job.job_skills.map((js: any) => ({
              id: js.skills.id,
              name: js.skills.name,
              category: js.skills.category
            })),
            created_at: new Date(job.created_at).toLocaleString()
          }));
          
          setJobs(formattedJobs);
          setFilteredJobs(formattedJobs);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    let result = jobs;
    
    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.employer.company_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      result = result.filter(job =>
        job.skills.some(skill => 
          categoryFilter === "all" ? true : skill.category.toLowerCase() === categoryFilter.toLowerCase()
        )
      );
    }
    
    setFilteredJobs(result);
  }, [searchTerm, locationFilter, categoryFilter, jobs]);

  const handleApplyClick = (job: Job) => {
    if (user) {
      navigate("/job-application", { state: { job } });
    } else {
      toast.error("Please login to apply for jobs");
      navigate("/login", { state: { returnTo: "/job-application", job } });
    }
  };

  // Get current page of jobs
  const indexOfLastJob = page * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">All Available Jobs</h1>
            <p className="mt-4 text-lg text-gray-500">
              Find flexible job opportunities that match your skills and availability
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search job title, skills or company"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Filter by location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </div>

              <div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="data entry">Data Entry</SelectItem>
                    <SelectItem value="cooking">Cooking</SelectItem>
                    <SelectItem value="gardening">Gardening</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              {isLoading ? 'Loading jobs...' : `Found ${filteredJobs.length} Jobs`}
            </h2>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <div>
                          <Skeleton className="h-6 w-64 mb-2" />
                          <Skeleton className="h-4 w-40" />
                        </div>
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-16 w-full mb-4" />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                        <Skeleton className="h-6 w-full" />
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t pt-4">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-9 w-28" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                <div className="space-y-4">
                  {currentJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-xl">{job.title}</CardTitle>
                            <p className="text-sm text-gray-500">{job.employer.company_name}</p>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {job.skills.slice(0, 2).map((skill) => (
                              <Badge key={skill.id}>{skill.name}</Badge>
                            ))}
                            {job.skills.length > 2 && (
                              <Badge variant="outline">+{job.skills.length - 2}</Badge>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{job.description}</p>
                        
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
                        
                        <div className="mt-2 flex items-center text-gray-600 text-sm">
                          <Clock className="h-4 w-4 mr-2" />
                          {job.start_time} - {job.end_time}
                        </div>
                      </CardContent>

                      <CardFooter className="flex justify-between items-center border-t pt-4">
                        <p className="text-xs text-gray-500">Posted {new Date(job.created_at).toLocaleDateString()}</p>
                        <Button onClick={() => handleApplyClick(job)}>Apply Now</Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <span className="text-sm">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500 mb-4">No jobs found matching your criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setCategoryFilter("");
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default JobsList;
