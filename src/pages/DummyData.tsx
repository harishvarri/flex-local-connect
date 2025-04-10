
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { dummyJobs, dummyWorkers } from "@/utils/dummyData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Briefcase, MapPin, Calendar, DollarSign, Star, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DummyData = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobsPage, setJobsPage] = useState(1);
  const [workersPage, setWorkersPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedJobs = dummyJobs.slice(
    (jobsPage - 1) * itemsPerPage,
    jobsPage * itemsPerPage
  );

  const paginatedWorkers = dummyWorkers.slice(
    (workersPage - 1) * itemsPerPage,
    workersPage * itemsPerPage
  );

  const totalJobPages = Math.ceil(dummyJobs.length / itemsPerPage);
  const totalWorkerPages = Math.ceil(dummyWorkers.length / itemsPerPage);

  const getAverageRating = (ratings: typeof dummyWorkers[0]['ratings']) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Dummy Data</h1>
          <p className="text-gray-600">
            Sample data for development and testing purposes. Generated {dummyJobs.length} jobs and {dummyWorkers.length} worker profiles.
          </p>
          <div className="flex gap-4 mt-4">
            <Button onClick={() => navigate("/find-jobs")}>Go to Jobs Page</Button>
            <Button variant="outline" onClick={() => navigate("/find-workers")}>Go to Workers Page</Button>
          </div>
        </div>

        <Tabs defaultValue="jobs" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="jobs">Job Listings ({dummyJobs.length})</TabsTrigger>
            <TabsTrigger value="workers">Worker Profiles ({dummyWorkers.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs">
            <div className="space-y-4">
              {paginatedJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <p className="text-sm text-gray-500">{job.company}</p>
                      </div>
                      <Badge>{job.category}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <p className="text-sm text-gray-600 mb-4">{job.description}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {job.date}, {job.time}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        {job.rate}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center border-t pt-4">
                    <p className="text-xs text-gray-500">Posted {job.posted}</p>
                    <Button size="sm">View Details</Button>
                  </CardFooter>
                </Card>
              ))}

              <div className="flex justify-between items-center mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setJobsPage(prev => Math.max(prev - 1, 1))}
                  disabled={jobsPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {jobsPage} of {totalJobPages}
                </span>
                <Button 
                  variant="outline"
                  onClick={() => setJobsPage(prev => Math.min(prev + 1, totalJobPages))}
                  disabled={jobsPage === totalJobPages}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="workers">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedWorkers.map((worker) => (
                <Card key={worker.id} className="h-full flex flex-col">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{worker.name}</h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{worker.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 text-amber-500 mr-1" />
                        <span className="font-semibold">{getAverageRating(worker.ratings)}</span>
                        <span className="text-xs text-gray-500 ml-1">({worker.ratings.length})</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-gray-600 mb-4 text-sm">{worker.bio}</p>
                    
                    <div className="mb-4">
                      <h4 className="font-semibold text-sm mb-2">Skills</h4>
                      <div className="flex flex-wrap gap-2">
                        {worker.skills.map((skill) => (
                          <Badge key={skill.id} variant="secondary" className="capitalize">
                            {skill.name}
                            {skill.level && (
                              <span className="ml-1 text-xs opacity-70">({skill.level})</span>
                            )}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Expected Rate</h4>
                      <p className="font-medium text-green-600">₹{worker.expectedWage}/day</p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button size="sm" className="w-full flex items-center gap-2">
                      <UserRound className="h-4 w-4" />
                      View Profile
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setWorkersPage(prev => Math.max(prev - 1, 1))}
                disabled={workersPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {workersPage} of {totalWorkerPages}
              </span>
              <Button 
                variant="outline"
                onClick={() => setWorkersPage(prev => Math.min(prev + 1, totalWorkerPages))}
                disabled={workersPage === totalWorkerPages}
              >
                Next
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default DummyData;
