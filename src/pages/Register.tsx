import React, { useState, useEffect } from "react";
import { useLocation as useRouterLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserRole } from "@/types";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

const Register = () => {
  const locationHook = useRouterLocation();
  const navigate = useNavigate();
  const { signUp, isLoading: authLoading, user } = useAuth();
  
  const queryParams = new URLSearchParams(locationHook.search);
  const initialRole = (queryParams.get("role") as UserRole) || "worker";
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);
  
  // Common form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [bio, setBio] = useState("");
  
  // Employer-specific fields
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  
  // Worker-specific fields
  const [skills, setSkills] = useState<{ name: string; level: string }[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [currentSkillLevel, setCurrentSkillLevel] = useState("beginner");
  const [expectedWage, setExpectedWage] = useState("");
  const [experience, setExperience] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleAddSkill = () => {
    if (!currentSkill.trim()) return;
    
    const newSkill = {
      name: currentSkill.trim(),
      level: currentSkillLevel
    };
    
    // Check for duplicates
    if (skills.some(skill => skill.name.toLowerCase() === newSkill.name.toLowerCase())) {
      toast.error("This skill has already been added");
      return;
    }
    
    setSkills([...skills, newSkill]);
    setCurrentSkill("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill.name !== skillToRemove));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (!email || !password || !name || !phone) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    if (activeTab === "employer" && !companyName) {
      toast.error("Please enter your company name");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare user data for registration
      const userData: any = {
        name,
        phone,
        role: activeTab,
        location: userLocation || null,
        bio: bio || null,
      };
      
      // Add employer-specific data if applicable
      if (activeTab === "employer") {
        userData.company_name = companyName;
        userData.industry = industry || null;
      }
      
      // Add worker-specific data if applicable
      if (activeTab === "worker") {
        userData.expected_wage = expectedWage ? Number(expectedWage) : null;
        userData.experience = experience || null;
        userData.skills = skills.length > 0 ? skills : null;
      }
      
      // Register with Supabase
      const { error } = await signUp(email, password, userData);
      
      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success("Registration successful! Please check your email to confirm your account.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavbar />
      <div className="flex-grow flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900">Create your account</h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-smartflex-blue hover:underline">
                Sign in
              </Link>
            </p>
          </div>

          <Tabs defaultValue={activeTab} onValueChange={(value) => setActiveTab(value as UserRole)}>
            <TabsList className="grid grid-cols-2 w-full">
              <TabsTrigger value="worker">I'm a Worker</TabsTrigger>
              <TabsTrigger value="employer">I'm an Employer</TabsTrigger>
            </TabsList>

            <form onSubmit={handleRegister}>
              <TabsContent value="worker" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Worker Registration</CardTitle>
                    <CardDescription>
                      Create an account to find flexible job opportunities in your area.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="worker-name">Full Name</Label>
                      <Input 
                        id="worker-name" 
                        placeholder="Enter your full name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-email">Email</Label>
                      <Input 
                        id="worker-email" 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-phone">Phone Number</Label>
                      <Input 
                        id="worker-phone" 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-location">Location</Label>
                      <Input 
                        id="worker-location" 
                        placeholder="Enter your city" 
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-bio">About Yourself</Label>
                      <Textarea 
                        id="worker-bio" 
                        placeholder="Tell employers about yourself, your background, and what kind of work you're looking for"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-experience">Work Experience</Label>
                      <Textarea 
                        id="worker-experience" 
                        placeholder="Briefly describe your previous work experience"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        rows={2}
                        disabled={isLoading || authLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="worker-wage">Expected Daily Rate (₹)</Label>
                      <Input 
                        id="worker-wage" 
                        type="number" 
                        placeholder="Enter your expected daily rate" 
                        value={expectedWage}
                        onChange={(e) => setExpectedWage(e.target.value)}
                        min={0}
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Skills</Label>
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Add a skill" 
                          value={currentSkill}
                          onChange={(e) => setCurrentSkill(e.target.value)}
                          className="flex-grow"
                          disabled={isLoading || authLoading}
                        />
                        <Select 
                          value={currentSkillLevel} 
                          onValueChange={setCurrentSkillLevel}
                          disabled={isLoading || authLoading}
                        >
                          <SelectTrigger className="w-[110px]">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner</SelectItem>
                            <SelectItem value="intermediate">Intermediate</SelectItem>
                            <SelectItem value="expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          type="button" 
                          onClick={handleAddSkill}
                          disabled={isLoading || authLoading || !currentSkill.trim()}
                        >
                          Add
                        </Button>
                      </div>
                      
                      {skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {skills.map((skill, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary"
                              className="flex items-center gap-1 pl-2 pr-1 py-1"
                            >
                              {skill.name}
                              <span className="text-xs bg-gray-100 px-1 rounded mr-1">
                                {skill.level}
                              </span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full"
                                onClick={() => handleRemoveSkill(skill.name)}
                                disabled={isLoading || authLoading}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-password">Password</Label>
                      <Input
                        id="worker-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="worker-confirm-password">Confirm Password</Label>
                      <Input
                        id="worker-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      type="submit" 
                      disabled={isLoading || authLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Worker Account"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="employer" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Employer Registration</CardTitle>
                    <CardDescription>
                      Create an account to find skilled workers for your business needs.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="employer-name">Full Name</Label>
                      <Input 
                        id="employer-name" 
                        placeholder="Enter your full name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-name">Company Name</Label>
                      <Input 
                        id="company-name" 
                        placeholder="Enter your company name" 
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry" 
                        placeholder="Enter your industry" 
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-email">Business Email</Label>
                      <Input
                        id="employer-email"
                        type="email"
                        placeholder="Enter your business email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-phone">Phone Number</Label>
                      <Input
                        id="employer-phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-location">Location</Label>
                      <Input 
                        id="employer-location" 
                        placeholder="Enter your city" 
                        value={userLocation}
                        onChange={(e) => setUserLocation(e.target.value)}
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-bio">Company Description</Label>
                      <Textarea 
                        id="employer-bio" 
                        placeholder="Tell workers about your company and the types of jobs you typically offer"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        rows={3}
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-password">Password</Label>
                      <Input
                        id="employer-password"
                        type="password"
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employer-confirm-password">Confirm Password</Label>
                      <Input
                        id="employer-confirm-password"
                        type="password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading || authLoading}
                      />
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button 
                      className="w-full" 
                      type="submit" 
                      disabled={isLoading || authLoading}
                    >
                      {isLoading ? "Creating Account..." : "Create Employer Account"}
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </form>
          </Tabs>

          <div className="text-center text-sm text-gray-600">
            By registering, you agree to our{" "}
            <Link to="/terms" className="text-smartflex-blue hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-smartflex-blue hover:underline">
              Privacy Policy
            </Link>
            .
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
