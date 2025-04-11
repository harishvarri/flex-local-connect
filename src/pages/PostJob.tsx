
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Briefcase, MapPin, Calendar as CalendarIcon2, Clock, DollarSign, CheckCircle2, Search } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { dummyWorkers } from "@/utils/dummyData";

// Skill categories based on our dummyData
const skillCategories = [
  "Cleaning",
  "Delivery",
  "Administration",
  "Events",
  "Skilled Trade",
  "Retail",
  "Warehouse",
  "Food Service",
  "Healthcare",
  "Education",
  "IT Support",
  "Marketing",
  "Security",
  "Maintenance"
];

const locations = [
  "Mumbai Central", 
  "Andheri East", 
  "Andheri West", 
  "Bandra", 
  "Borivali", 
  "Chembur", 
  "Colaba", 
  "Dadar", 
  "Goregaon", 
  "Juhu", 
  "Lower Parel", 
  "Malad", 
  "Powai", 
  "Santacruz", 
  "Vile Parle", 
  "Worli", 
  "BKC"
];

const PostJob = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [payment, setPayment] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [matchedWorkers, setMatchedWorkers] = useState<typeof dummyWorkers>([]);
  const [jobCreated, setJobCreated] = useState(false);

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    
    // Clear matched workers when description changes
    if (matchedWorkers.length > 0) {
      setMatchedWorkers([]);
    }
  };

  const analyzeJobDescription = () => {
    if (description.trim().length < 20) {
      toast.error("Please provide a more detailed job description");
      return;
    }
    
    setAnalyzing(true);
    
    // Simulate AI analysis with a timeout
    setTimeout(() => {
      // Extract key terms from description to find workers
      const descriptionLower = description.toLowerCase();
      const keyTerms = [
        ...skillCategories.filter(skill => 
          descriptionLower.includes(skill.toLowerCase())
        ),
        // Add additional keywords based on the text
        ...(descriptionLower.includes('clean') ? ['cleaning', 'sanitization'] : []),
        ...(descriptionLower.includes('deliver') ? ['delivery', 'driver'] : []),
        ...(descriptionLower.includes('data') ? ['data entry', 'administration'] : []),
        ...(descriptionLower.includes('event') ? ['event staff', 'catering'] : []),
        ...(descriptionLower.includes('repair') ? ['handyman', 'plumbing', 'electrical'] : []),
      ];

      // If no category is set yet, try to infer it
      if (!category && keyTerms.length > 0) {
        // Find the first matching category
        const inferredCategory = skillCategories.find(cat => 
          keyTerms.some(term => term.toLowerCase().includes(cat.toLowerCase()))
        );
        
        if (inferredCategory) {
          setCategory(inferredCategory);
          toast.info(`Category set to "${inferredCategory}" based on job description`);
        }
      }
      
      // Use the key terms to find matching workers
      const matches = dummyWorkers.filter(worker => {
        // Check if worker has relevant skills
        const hasMatchingSkills = worker.skills.some(skill => 
          keyTerms.some(term => 
            skill.name.toLowerCase().includes(term.toLowerCase()) || 
            skill.category.toLowerCase().includes(term.toLowerCase())
          )
        );
        
        // Also match on location if it's been specified
        const matchesLocation = !location || worker.location.includes(location);
        
        return hasMatchingSkills && matchesLocation;
      });
      
      // Sort by rating and limit to top 5
      const sortedMatches = matches
        .sort((a, b) => {
          const aAvgRating = a.ratings.length > 0 
            ? a.ratings.reduce((sum, r) => sum + r.score, 0) / a.ratings.length 
            : 0;
          const bAvgRating = b.ratings.length > 0 
            ? b.ratings.reduce((sum, r) => sum + r.score, 0) / b.ratings.length 
            : 0;
          return bAvgRating - aAvgRating;
        })
        .slice(0, 5);
      
      setMatchedWorkers(sortedMatches);
      setAnalyzing(false);
      
      if (sortedMatches.length === 0) {
        toast.info("No matching workers found. Try a different job description or location.");
      } else {
        toast.success(`Found ${sortedMatches.length} potential workers for this job`);
      }
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form fields
    if (!title || !description || !category || !location || !date || !startTime || !endTime || !payment) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // In a real app, this would submit to the database
    toast.success("Job posted successfully!");
    setJobCreated(true);
    
    // Clear the form
    setTitle("");
    setDescription("");
    setCategory("");
    setLocation("");
    setDate(new Date());
    setStartTime("");
    setEndTime("");
    setPayment("");
    setMatchedWorkers([]);
  };

  const viewWorkerProfile = (workerId: string) => {
    // In a real app, this would navigate to the worker profile
    toast.info(`Viewing worker profile (ID: ${workerId})`);
    // navigate(`/workers/${workerId}`);
  };

  const inviteWorker = (workerId: string) => {
    // In a real app, this would send an invitation to the worker
    toast.success(`Invitation sent to worker (ID: ${workerId})`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Post a New Job</h1>
          <p className="text-lg text-gray-600 mb-8">
            Find skilled workers for your short-term job needs
          </p>

          {jobCreated ? (
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                  <CardTitle>Job Posted Successfully!</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  Your job has been posted and is now visible to potential workers. You'll be notified when someone applies.
                </p>
                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setJobCreated(false)}>
                    Post Another Job
                  </Button>
                  <Button onClick={() => navigate('/jobs')}>
                    View All Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <form onSubmit={handleSubmit}>
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                      <CardDescription>
                        Provide the details of the job you want to post
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="title">Job Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g. Office Cleaning Staff Needed"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Job Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the job in detail, including tasks, requirements, and any specific skills needed..."
                          value={description}
                          onChange={handleDescriptionChange}
                          rows={6}
                        />
                        <div className="flex justify-end">
                          <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={analyzeJobDescription}
                            disabled={analyzing || description.length < 20}
                            className="flex items-center"
                          >
                            {analyzing ? "Analyzing..." : "Analyze Description"}
                            {!analyzing && <Search className="ml-2 h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="category">Job Category</Label>
                          <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger id="category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              {skillCategories.map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="location">Location</Label>
                          <Select value={location} onValueChange={setLocation}>
                            <SelectTrigger id="location">
                              <SelectValue placeholder="Select location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((loc) => (
                                <SelectItem key={loc} value={loc}>
                                  {loc}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="date">Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="date"
                                variant="outline"
                                className={cn(
                                  "w-full text-left font-normal justify-start",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, "PPP") : "Select date"}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="startTime">Start Time</Label>
                          <Select value={startTime} onValueChange={setStartTime}>
                            <SelectTrigger id="startTime">
                              <SelectValue placeholder="Start time" />
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
                              <SelectValue placeholder="End time" />
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
                      
                      <div className="space-y-2">
                        <Label htmlFor="payment">Payment (₹)</Label>
                        <Input
                          id="payment"
                          type="number"
                          placeholder="e.g. 1500"
                          value={payment}
                          onChange={(e) => setPayment(e.target.value)}
                        />
                        <p className="text-xs text-gray-500">
                          Enter the payment amount in Indian Rupees (₹)
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="w-full">Post Job</Button>
                    </CardFooter>
                  </form>
                </Card>
              </div>
              
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Job Summary</CardTitle>
                    <CardDescription>
                      Preview of your job posting
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {title ? (
                      <div>
                        <h3 className="text-lg font-semibold">{title}</h3>
                        <div className="text-sm text-gray-500">{category}</div>
                      </div>
                    ) : (
                      <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                    )}
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Location</div>
                          <div className="text-sm text-gray-600">{location || "Not specified"}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <CalendarIcon2 className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Date</div>
                          <div className="text-sm text-gray-600">
                            {date ? format(date, "MMMM d, yyyy") : "Not specified"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Time</div>
                          <div className="text-sm text-gray-600">
                            {startTime && endTime 
                              ? `${startTime} - ${endTime}` 
                              : "Not specified"}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <DollarSign className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                        <div>
                          <div className="font-medium text-sm">Payment</div>
                          <div className="text-sm text-gray-600">
                            {payment ? `₹${payment}` : "Not specified"}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-1">Description</div>
                      {description ? (
                        <p className="text-sm text-gray-600">{description}</p>
                      ) : (
                        <div className="h-20 bg-gray-100 animate-pulse rounded"></div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {matchedWorkers.length > 0 && (
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Matched Workers</CardTitle>
                      <CardDescription>
                        Workers who match your job requirements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {matchedWorkers.map((worker) => {
                          const avgRating = worker.ratings.length > 0 
                            ? worker.ratings.reduce((sum, r) => sum + r.score, 0) / worker.ratings.length 
                            : 0;
                            
                          return (
                            <div key={worker.id} className="flex justify-between items-start border-b pb-4 last:border-0 last:pb-0">
                              <div>
                                <div className="font-medium">{worker.name}</div>
                                <div className="text-sm text-gray-500">{worker.location}</div>
                                <div className="flex items-center mt-1">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${
                                        i < Math.round(avgRating) 
                                          ? 'text-yellow-400 fill-yellow-400' 
                                          : 'text-gray-300'
                                      }`} 
                                    />
                                  ))}
                                  <span className="ml-1 text-xs text-gray-500">
                                    ({worker.ratings.length})
                                  </span>
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Skills: {worker.skills.slice(0, 3).map(s => s.name).join(", ")}
                                </div>
                              </div>
                              <div className="flex flex-col space-y-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => viewWorkerProfile(worker.id)}
                                >
                                  View
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => inviteWorker(worker.id)}
                                >
                                  Invite
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PostJob;
