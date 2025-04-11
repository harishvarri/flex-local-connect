
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { dummyJobs } from "@/utils/dummyData";

const AvailabilityCalendar = () => {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [availability, setAvailability] = useState<{date: Date; start: string; end: string}[]>([]);
  const [matchedJobs, setMatchedJobs] = useState<typeof dummyJobs>([]);

  // Save availability
  const handleSaveAvailability = () => {
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    if (startTime >= endTime) {
      toast.error("End time must be after start time");
      return;
    }

    // Check if this date/time is already saved
    const existingEntryIndex = availability.findIndex(
      (a) => format(a.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );

    if (existingEntryIndex >= 0) {
      // Update existing entry
      const newAvailability = [...availability];
      newAvailability[existingEntryIndex] = { date, start: startTime, end: endTime };
      setAvailability(newAvailability);
      toast.success("Availability updated successfully");
    } else {
      // Add new entry
      setAvailability([...availability, { date, start: startTime, end: endTime }]);
      toast.success("Availability saved successfully");
    }

    // Find matching jobs based on availability
    findMatchingJobs(date, startTime, endTime);
  };

  const findMatchingJobs = (date: Date, start: string, end: string) => {
    // Convert date to string format 'yyyy-MM-dd' to match with jobs
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Filter jobs that match the selected date and have a compatible time range
    const matches = dummyJobs.filter(job => {
      // In a real app, you would do more sophisticated time matching
      // For demo purposes, we're just checking if the job's date is close to selected date
      return job.date.includes(format(date, 'MMM')) || job.date.includes('Today') || job.date.includes('Tomorrow');
    });

    setMatchedJobs(matches.slice(0, 5)); // Limit to 5 matches for the demo
  };

  const removeAvailability = (index: number) => {
    const newAvailability = [...availability];
    newAvailability.splice(index, 1);
    setAvailability(newAvailability);
    toast.success("Availability removed");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Availability Calendar</h1>
          <p className="text-lg text-gray-600 mb-8">
            Set your work schedule and find jobs that match your availability
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Set Your Availability</CardTitle>
                <CardDescription>Choose dates and times when you're available to work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Select value={startTime} onValueChange={setStartTime}>
                        <SelectTrigger id="startTime">
                          <SelectValue placeholder="Start Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={`start-${i}`} value={`${i.toString().padStart(2, '0')}:00`}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Select value={endTime} onValueChange={setEndTime}>
                        <SelectTrigger id="endTime">
                          <SelectValue placeholder="End Time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => (
                            <SelectItem key={`end-${i}`} value={`${i.toString().padStart(2, '0')}:00`}>
                              {`${i.toString().padStart(2, '0')}:00`}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAvailability} className="w-full">Save Availability</Button>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Your Scheduled Availability</CardTitle>
                <CardDescription>Dates and times you've marked as available</CardDescription>
              </CardHeader>
              <CardContent>
                {availability.length > 0 ? (
                  <div className="space-y-4">
                    {availability.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 border rounded-md">
                        <div>
                          <p className="font-medium">{format(item.date, 'EEEE, MMMM d, yyyy')}</p>
                          <p className="text-sm text-gray-500">{item.start} - {item.end}</p>
                        </div>
                        <Button variant="destructive" size="sm" onClick={() => removeAvailability(index)}>
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No availability scheduled yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {matchedJobs.length > 0 && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold mb-4">Matching Jobs</h2>
              <p className="text-gray-600 mb-6">
                These jobs match your availability schedule
              </p>
              
              <div className="space-y-4">
                {matchedJobs.map((job) => (
                  <Card key={job.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle>{job.title}</CardTitle>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div className="text-gray-600">📍 {job.location}</div>
                        <div className="text-gray-600">📅 {job.date}</div>
                        <div className="text-gray-600">💰 {job.rate}</div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button className="w-full">Apply Now</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AvailabilityCalendar;
