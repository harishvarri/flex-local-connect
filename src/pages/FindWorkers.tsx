
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Star, Calendar, Phone, Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Worker } from "@/types";
import { dummyWorkers } from "@/utils/dummyData";

const FindWorkers = () => {
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "error">("loading");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterLocation, setFilterLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        // Test the connection by getting the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Backend connection error:", error);
          setBackendStatus("error");
          toast.error("Failed to connect to the backend");
        } else {
          console.log("Backend connection successful:", data);
          setBackendStatus("connected");
          
          // Fetch workers from database or use dummy data
          fetchWorkers();
        }
      } catch (error) {
        console.error("Backend connection test failed:", error);
        setBackendStatus("error");
        toast.error("Failed to connect to the backend");
      }
    };

    checkBackendConnection();
  }, []);

  const fetchWorkers = async () => {
    try {
      // Try to fetch from Supabase first
      const { data: workerProfiles, error } = await supabase
        .from("worker_profiles")
        .select(`
          *, 
          profiles:profiles!worker_profiles_id_fkey(id, name, email, avatar, phone, location, bio, role, created_at),
          worker_skills:worker_skills!worker_skills_worker_id_fkey(
            id,
            skill_id,
            level,
            skills:skills!worker_skills_skill_id_fkey(id, name, category)
          )
        `);

      if (error) {
        console.error("Error fetching workers:", error);
        // Use dummy data as fallback
        setWorkers(dummyWorkers);
        toast.info("Using demo data with 50+ workers");
        return;
      }

      if (workerProfiles && workerProfiles.length > 0) {
        // Transform the data to match our Worker type
        const formattedWorkers = workerProfiles.map(worker => ({
          id: worker.profiles.id || worker.id,
          name: worker.profiles.name || "Anonymous Worker",
          email: worker.profiles.email || "",
          role: "worker" as const,
          avatar: worker.profiles.avatar || "",
          phone: worker.profiles.phone || "",
          location: worker.profiles.location || "Location not specified",
          bio: worker.profiles.bio || "No bio available",
          createdAt: worker.profiles.created_at,
          skills: worker.worker_skills ? worker.worker_skills.map(skill => ({
            id: skill.id,
            name: skill.skills.name,
            category: skill.skills.category,
            level: skill.level
          })) : [],
          availability: [],
          expectedWage: worker.expected_wage,
          ratings: []
        }));
        setWorkers(formattedWorkers);
      } else {
        // Use dummy data as fallback if no workers in database
        console.log("No workers found in database, using dummy data");
        setWorkers(dummyWorkers);
        toast.info("Using demo data with 50+ workers: " + dummyWorkers.length);
      }
    } catch (error) {
      console.error("Error in fetchWorkers:", error);
      setWorkers(dummyWorkers);
    }
  };

  // Filter workers based on search term and filters
  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          worker.bio.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = filterSkill === "" || 
                          worker.skills.some(skill => 
                            skill.name.toLowerCase().includes(filterSkill.toLowerCase()));
    
    const matchesLocation = filterLocation === "" || 
                            worker.location.toLowerCase().includes(filterLocation.toLowerCase());
    
    return matchesSearch && matchesSkill && matchesLocation;
  });

  const handleContactWorker = (worker: Worker) => {
    toast.success(`Contact request sent to ${worker.name}`);
    // In a real app, this would open a chat or send a notification
  };

  const handleViewProfile = (workerId: string) => {
    toast.info("Viewing worker profile: " + workerId);
    // In a real app, navigate to the worker profile
    // navigate(`/worker-profile/${workerId}`);
  };

  const getAverageRating = (ratings: Worker['ratings']) => {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((total, rating) => total + rating.score, 0);
    return (sum / ratings.length).toFixed(1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">Find Skilled Workers</h1>
        
        {backendStatus === "loading" && (
          <div className="mb-6 p-4 border rounded-lg">
            <p className="text-gray-600">Testing connection to Supabase backend...</p>
          </div>
        )}
        
        {backendStatus === "error" && (
          <div className="mb-6 p-4 border rounded-lg bg-red-50">
            <p className="text-red-600">❌ Failed to connect to Supabase backend</p>
          </div>
        )}

        {backendStatus === "connected" && (
          <>
            <div className="mb-8 flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search workers by name or bio"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex-1 flex gap-4">
                <Input
                  placeholder="Filter by skill"
                  value={filterSkill}
                  onChange={(e) => setFilterSkill(e.target.value)}
                />
                <Input
                  placeholder="Filter by location"
                  value={filterLocation}
                  onChange={(e) => setFilterLocation(e.target.value)}
                />
              </div>
            </div>

            {filteredWorkers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWorkers.map((worker) => (
                  <Card key={worker.id} className="h-full flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{worker.name}</CardTitle>
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
                      <p className="text-gray-600 mb-4">{worker.bio}</p>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold text-sm mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {worker.skills.length > 0 ? (
                            worker.skills.map((skill) => (
                              <Badge key={skill.id} variant="secondary" className="capitalize">
                                {skill.name}
                                {skill.level && (
                                  <span className="ml-1 text-xs opacity-70">({skill.level})</span>
                                )}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">No skills listed</span>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Expected Rate</h4>
                        <p className="font-medium text-green-600">
                          {worker.expectedWage ? `₹${worker.expectedWage}/day` : "Rate not specified"}
                        </p>
                      </div>
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Availability</h4>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">
                            {worker.availability.length > 0 
                              ? `${worker.availability.length} days available` 
                              : "Availability not specified"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="border-t pt-4">
                      <div className="w-full flex flex-col sm:flex-row gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full flex items-center justify-center"
                          onClick={() => window.location.href = `mailto:${worker.email}`}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Email
                        </Button>
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="w-full flex items-center justify-center"
                          onClick={() => handleViewProfile(worker.id)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No workers found matching your criteria</p>
                <Button variant="outline" onClick={() => {
                  setSearchTerm("");
                  setFilterSkill("");
                  setFilterLocation("");
                }}>
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default FindWorkers;
