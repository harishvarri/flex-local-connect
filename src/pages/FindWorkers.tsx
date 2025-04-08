
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, MapPin, Calendar, Star } from "lucide-react";

// Mock workers data
const workers = [
  {
    id: "1",
    name: "Rahul Sharma",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    skills: ["Cleaning", "Housekeeping"],
    location: "Dadar, Mumbai",
    availability: "Weekdays, 9AM-5PM",
    experience: "3 years",
    rating: 4.8,
    ratingCount: 24,
    hourlyRate: "₹150-200/hr",
  },
  {
    id: "2",
    name: "Priya Patel",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    skills: ["Data Entry", "Admin Support"],
    location: "Andheri East, Mumbai",
    availability: "Weekends & Evenings",
    experience: "2 years",
    rating: 4.7,
    ratingCount: 19,
    hourlyRate: "₹200-250/hr",
  },
  {
    id: "3",
    name: "Ahmed Khan",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg",
    skills: ["Electrician", "Plumbing"],
    location: "Kurla, Mumbai",
    availability: "Full time",
    experience: "5 years",
    rating: 4.9,
    ratingCount: 32,
    hourlyRate: "₹350-400/hr",
  },
  {
    id: "4",
    name: "Meera Desai",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    skills: ["Food Service", "Event Staff"],
    location: "Bandra, Mumbai",
    availability: "Weekends",
    experience: "1 year",
    rating: 4.5,
    ratingCount: 11,
    hourlyRate: "₹180-220/hr",
  },
  {
    id: "5",
    name: "Vishal Gupta",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    skills: ["Delivery", "Driver"],
    location: "Goregaon, Mumbai",
    availability: "Evenings, 6PM-11PM",
    experience: "2 years",
    rating: 4.6,
    ratingCount: 27,
    hourlyRate: "₹150-200/hr",
  },
];

const FindWorkers = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Find Skilled Workers</h1>
            <p className="mt-4 text-lg text-gray-500">
              Connect with skilled professionals available for your flexible job needs
            </p>
          </div>

          {/* Search and filter */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Search skills or job title"
                />
              </div>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  className="pl-10"
                  placeholder="Location"
                />
              </div>

              <div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select skill category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Skills</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="admin">Administrative</SelectItem>
                    <SelectItem value="trades">Skilled Trades</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="events">Event Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
              <div className="flex flex-wrap gap-2 mb-4 sm:mb-0">
                <Badge variant="outline">Available Today</Badge>
                <Badge variant="outline">Top Rated</Badge>
                <Badge variant="outline">Within 5km</Badge>
              </div>
              <Button>Search Workers</Button>
            </div>
          </div>

          {/* Search results */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Found {workers.length} Workers
            </h2>

            <div className="space-y-4">
              {workers.map((worker) => (
                <Card key={worker.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 border">
                        <AvatarImage src={worker.avatar} alt={worker.name} />
                        <AvatarFallback>{worker.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <CardTitle>{worker.name}</CardTitle>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="font-medium">{worker.rating}</span>
                            <span className="text-sm text-gray-500 ml-1">({worker.ratingCount})</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap mt-2 gap-2">
                          {worker.skills.map((skill) => (
                            <Badge key={skill} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pb-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {worker.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        {worker.availability}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <span className="font-medium mr-2">Rate:</span>
                        {worker.hourlyRate}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Experience:</span> {worker.experience}
                    </p>
                  </CardContent>

                  <CardFooter className="flex justify-end items-center border-t pt-4">
                    <Button variant="outline" className="mr-2">View Profile</Button>
                    <Button>Contact</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FindWorkers;
