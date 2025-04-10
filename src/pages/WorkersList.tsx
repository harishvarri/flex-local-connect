
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
import { Search, MapPin, Star } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Worker } from "@/types";
import { toast } from "sonner";

const WorkersList = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const workersPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
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

        if (error) throw error;

        if (data) {
          const formattedWorkers: Worker[] = data.map((w: any) => ({
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
          setFilteredWorkers(formattedWorkers);
        }
      } catch (error) {
        console.error("Error fetching workers:", error);
        toast.error("Failed to load worker profiles");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkers();
  }, []);

  useEffect(() => {
    let result = workers;
    
    if (searchTerm) {
      result = result.filter(worker => 
        worker.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.skills.some(skill => skill.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (locationFilter) {
      result = result.filter(worker => 
        worker.location?.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (skillFilter !== "") {
      result = result.filter(worker =>
        worker.skills.some(skill => skill.name.toLowerCase() === skillFilter.toLowerCase() || 
                                   skill.category.toLowerCase() === skillFilter.toLowerCase())
      );
    }
    
    setFilteredWorkers(result);
  }, [searchTerm, locationFilter, skillFilter, workers]);

  const handleViewProfile = (workerId: string) => {
    navigate(`/worker-profile/${workerId}`);
  };

  // Get current page of workers
  const indexOfLastWorker = page * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = filteredWorkers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(filteredWorkers.length / workersPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Find Skilled Workers</h1>
            <p className="mt-4 text-lg text-gray-500">
              Browse through our talented pool of professionals ready to help with your tasks
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search by name or skills"
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
                <Select value={skillFilter} onValueChange={setSkillFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Skills</SelectItem>
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
              {isLoading ? 'Loading workers...' : `Found ${filteredWorkers.length} Workers`}
            </h2>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-6 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/2" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <Skeleton className="h-24 w-full mb-4" />
                      <div className="flex flex-wrap gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <Skeleton className="h-9 w-full" />
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : filteredWorkers.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentWorkers.map((worker) => (
                    <Card key={worker.id} className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                            {worker.avatar ? (
                              <img 
                                src={worker.avatar} 
                                alt={worker.name} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl text-gray-500">{worker.name?.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <CardTitle className="text-xl">{worker.name}</CardTitle>
                            <div className="flex items-center mt-1 text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              <span>{worker.location || 'Location not specified'}</span>
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="pb-2">
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                          {worker.bio || 'No bio available'}
                        </p>
                        
                        {worker.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {worker.skills.slice(0, 5).map((skill) => (
                              <Badge key={skill.id} variant="outline" className="flex items-center gap-1">
                                {skill.name}
                                <span className="text-xs bg-gray-100 px-1 rounded">
                                  {skill.level}
                                </span>
                              </Badge>
                            ))}
                            {worker.skills.length > 5 && (
                              <Badge variant="outline">+{worker.skills.length - 5} more</Badge>
                            )}
                          </div>
                        )}

                        {worker.expectedWage && (
                          <div className="mt-3 text-sm font-medium">
                            <span className="text-gray-700">Expected rate: </span>
                            <span className="text-green-600">₹{worker.expectedWage}/hr</span>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="border-t pt-4 flex justify-between items-center">
                        <div className="flex items-center">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                        <Button onClick={() => handleViewProfile(worker.id)}>View Profile</Button>
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
                <p className="text-gray-500 mb-4">No workers found matching your criteria</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("");
                    setSkillFilter("");
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

export default WorkersList;
