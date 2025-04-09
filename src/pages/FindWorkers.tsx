
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Star, Calendar, Phone, Mail } from "lucide-react";
import { Worker } from "@/types";

// Mock worker data
const mockWorkers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    role: "worker" as const,
    phone: "555-123-4567",
    location: "Mumbai Central",
    bio: "Experienced handyman with 5+ years working on residential properties. Specializing in plumbing, electrical, and carpentry work.",
    createdAt: "2023-01-15",
    skills: [
      { id: "1", name: "Plumbing", category: "Handyman", level: "expert" as const },
      { id: "2", name: "Electrical", category: "Handyman", level: "intermediate" as const },
      { id: "3", name: "Carpentry", category: "Handyman", level: "expert" as const }
    ],
    availability: [
      { id: "1", date: "2023-04-20", startTime: "09:00", endTime: "17:00" },
      { id: "2", date: "2023-04-21", startTime: "09:00", endTime: "17:00" },
      { id: "3", date: "2023-04-22", startTime: "09:00", endTime: "17:00" }
    ],
    expectedWage: 500,
    ratings: [
      { id: "1", score: 5, comment: "Great work, very professional", jobId: "j1", fromId: "u1", toId: "1", createdAt: "2023-02-10" },
      { id: "2", score: 4, comment: "Good job, on time", jobId: "j2", fromId: "u2", toId: "1", createdAt: "2023-03-05" }
    ]
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    role: "worker" as const,
    phone: "555-987-6543",
    location: "Andheri East",
    bio: "Professional cleaner with experience in residential and commercial spaces. Detailed oriented and efficient.",
    createdAt: "2023-02-10",
    skills: [
      { id: "4", name: "House Cleaning", category: "Cleaning", level: "expert" as const },
      { id: "5", name: "Office Cleaning", category: "Cleaning", level: "expert" as const },
      { id: "6", name: "Sanitization", category: "Cleaning", level: "intermediate" as const }
    ],
    availability: [
      { id: "4", date: "2023-04-20", startTime: "08:00", endTime: "16:00" },
      { id: "5", date: "2023-04-21", startTime: "08:00", endTime: "16:00" }
    ],
    expectedWage: 400,
    ratings: [
      { id: "3", score: 5, comment: "Very thorough cleaning", jobId: "j3", fromId: "u3", toId: "2", createdAt: "2023-03-15" }
    ]
  },
  {
    id: "3",
    name: "Raj Patel",
    email: "raj@example.com",
    role: "worker" as const,
    phone: "555-456-7890",
    location: "Powai",
    bio: "Delivery driver with own vehicle. Reliable and punctual with excellent knowledge of Mumbai roads.",
    createdAt: "2023-01-05",
    skills: [
      { id: "7", name: "Local Delivery", category: "Delivery", level: "expert" as const },
      { id: "8", name: "Food Delivery", category: "Delivery", level: "expert" as const },
      { id: "9", name: "Package Handling", category: "Delivery", level: "intermediate" as const }
    ],
    availability: [
      { id: "6", date: "2023-04-20", startTime: "10:00", endTime: "20:00" },
      { id: "7", date: "2023-04-21", startTime: "10:00", endTime: "20:00" },
      { id: "8", date: "2023-04-22", startTime: "10:00", endTime: "20:00" }
    ],
    expectedWage: 450,
    ratings: [
      { id: "4", score: 5, comment: "Very fast delivery", jobId: "j4", fromId: "u4", toId: "3", createdAt: "2023-02-20" },
      { id: "5", score: 5, comment: "Professional and courteous", jobId: "j5", fromId: "u5", toId: "3", createdAt: "2023-03-10" }
    ]
  }
];

const FindWorkers = () => {
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "error">("loading");
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSkill, setFilterSkill] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

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
          toast.success("Successfully connected to Supabase backend!");
          
          // In a real app, fetch workers from Supabase here
          // For now, use mock data
          setWorkers(mockWorkers);
        }
      } catch (error) {
        console.error("Backend connection test failed:", error);
        setBackendStatus("error");
        toast.error("Failed to connect to the backend");
      }
    };

    checkBackendConnection();
  }, []);

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
                      
                      <div className="mt-4">
                        <h4 className="font-semibold text-sm mb-2">Availability</h4>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-sm">{worker.availability.length} days available</span>
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
                          onClick={() => handleContactWorker(worker)}
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
