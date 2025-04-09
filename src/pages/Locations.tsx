
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon, MapPin } from "lucide-react";

// Mock location data
const locations = [
  { id: "1", name: "Mumbai Central", jobCount: 24 },
  { id: "2", name: "Andheri East", jobCount: 18 },
  { id: "3", name: "Powai", jobCount: 15 },
  { id: "4", name: "BKC", jobCount: 13 },
  { id: "5", name: "Lower Parel", jobCount: 11 },
  { id: "6", name: "Worli", jobCount: 9 },
  { id: "7", name: "Malad", jobCount: 8 },
  { id: "8", name: "Goregaon", jobCount: 7 },
  { id: "9", name: "Dadar", jobCount: 6 },
  { id: "10", name: "Thane", jobCount: 10 },
  { id: "11", name: "Navi Mumbai", jobCount: 12 },
  { id: "12", name: "Chembur", jobCount: 5 },
];

const Locations = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLocationClick = (locationName: string) => {
    navigate("/find-jobs", { 
      state: { locationFilter: locationName } 
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Browse Jobs by Location</h1>
            <p className="mt-4 text-lg text-gray-500">
              Find job opportunities in your area
            </p>
          </div>

          {/* Search */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                className="pl-10"
                placeholder="Search locations"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Location grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredLocations.map((location) => (
              <Card 
                key={location.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleLocationClick(location.name)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MapPin className="h-5 w-5 text-gray-500 mr-2" />
                      <h3 className="font-medium">{location.name}</h3>
                    </div>
                    <span className="text-sm text-gray-500">{location.jobCount} jobs</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center mt-8">
              <p className="text-gray-500">No locations found matching "{searchTerm}"</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchTerm("")}
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Locations;
