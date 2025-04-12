
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, DollarSign } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AIJobRecommendations from "@/components/AIJobRecommendations";

const jobs = [
  {
    id: "1",
    title: "Office Cleaning Staff Needed",
    company: "ABC Corp",
    location: "Mumbai Central",
    date: "Tomorrow",
    time: "9:00 AM - 5:00 PM",
    rate: "₹1500 per day",
    category: "Cleaning",
    posted: "2 hours ago",
    description: "We need someone to clean our office space including bathrooms, kitchen area, and work spaces.",
  },
  {
    id: "2",
    title: "Delivery Driver - Own Vehicle",
    company: "QuickMeals",
    location: "Andheri East",
    date: "Today",
    time: "6:00 PM - 10:00 PM",
    rate: "₹200 per delivery + fuel",
    category: "Delivery",
    posted: "5 hours ago",
    description: "Deliver food orders from our restaurant to customers within 5km radius. Must have own vehicle.",
  },
  {
    id: "3",
    title: "Data Entry Operator",
    company: "TechSolutions",
    location: "Powai",
    date: "Wed, 10th April",
    time: "10:00 AM - 4:00 PM",
    rate: "₹1200 per day",
    category: "Administration",
    posted: "1 day ago",
    description: "Enter customer information into our database, process forms, and organize files.",
  },
  {
    id: "4",
    title: "Event Staff for Corporate Function",
    company: "EventPro Caterers",
    location: "BKC",
    date: "Sat, 13th April",
    time: "4:00 PM - 11:00 PM",
    rate: "₹1800 per event",
    category: "Events",
    posted: "3 days ago",
    description: "Serve food and beverages, help with setup and cleanup for a corporate event.",
  },
  {
    id: "5",
    title: "Electrician for Office Setup",
    company: "WorkSpace Interiors",
    location: "Lower Parel",
    date: "Mon, 15th April",
    time: "9:00 AM - 6:00 PM",
    rate: "₹3000 per day",
    category: "Skilled Trade",
    posted: "2 days ago",
    description: "Install lighting fixtures, set up workstations with proper cabling and ensure electrical safety.",
  },
];

const FindJobs = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredJobs, setFilteredJobs] = useState(jobs);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    if (location.state?.locationFilter) {
      setLocationFilter(location.state.locationFilter);
    }
  }, [location.state]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
  }, []);

  useEffect(() => {
    let result = jobs;
    
    if (searchTerm) {
      result = result.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (locationFilter) {
      result = result.filter(job => 
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }
    
    if (categoryFilter) {
      result = result.filter(job => 
        categoryFilter === "all" ? true : job.category === categoryFilter
      );
    }
    
    setFilteredJobs(result);
  }, [searchTerm, locationFilter, categoryFilter]);

  const handleApplyClick = (job: typeof jobs[0]) => {
    if (isLoggedIn) {
      navigate("/job-application", { state: { job } });
    } else {
      toast.error("Please login to apply for jobs");
      navigate("/login", { state: { returnTo: "/job-application", job } });
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationFilter(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryFilter(value);
  };

  const handleBrowseLocations = () => {
    navigate("/locations");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Find Flexible Jobs</h1>
            <p className="mt-4 text-lg text-gray-500">
              Discover local job opportunities that match your skills and availability
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search job title or skills"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Location"
                  value={locationFilter}
                  onChange={handleLocationChange}
                />
              </div>

              <div>
                <Select value={categoryFilter} onValueChange={handleCategoryChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Cleaning">Cleaning</SelectItem>
                    <SelectItem value="Delivery">Delivery</SelectItem>
                    <SelectItem value="Administration">Administration</SelectItem>
                    <SelectItem value="Events">Events</SelectItem>
                    <SelectItem value="Skilled Trade">Skilled Trades</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                <Badge variant="outline">Today</Badge>
                <Badge variant="outline">This Week</Badge>
                <Badge variant="outline">Within 5km</Badge>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleBrowseLocations} variant="outline">
                  Browse Locations
                </Button>
                <Button>Search Jobs</Button>
              </div>
            </div>
          </div>

          <AIJobRecommendations 
            searchTerm={searchTerm}
            location={locationFilter}
            category={categoryFilter}
            onSelectJob={(job) => {
              toast.info(`AI recommendation: ${job.title}`);
              // In a real app, you could add this job to the list or navigate to its details
            }}
          />

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Found {filteredJobs.length} Jobs {locationFilter && `in ${locationFilter}`}
            </h2>

            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-xl">{job.title}</CardTitle>
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
                    <Button onClick={() => handleApplyClick(job)}>Apply Now</Button>
                  </CardFooter>
                </Card>
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">No jobs found matching your criteria</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
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
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindJobs;
