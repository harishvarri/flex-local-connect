import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Profile = () => {
  const { user, appUser, refreshUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    location: "",
    skills: "",
    bio: "",
    expectedWage: "",
    companyName: "",
    industry: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        if (!user) {
          navigate("/login", { state: { returnTo: "/profile" } });
          return;
        }
        
        if (appUser) {
          setFormData({
            fullName: appUser.name || "",
            phoneNumber: appUser.phone || "",
            location: appUser.location || "",
            bio: appUser.bio || "",
            skills: appUser.role === 'worker' && 'skills' in appUser 
              ? (appUser as any).skills?.map((s: any) => s.name).join(", ") || ""
              : "",
            expectedWage: appUser.role === 'worker' && 'expectedWage' in appUser 
              ? (appUser as any).expectedWage?.toString() || ""
              : "",
            companyName: appUser.role === 'employer' && 'companyName' in appUser
              ? (appUser as any).companyName || ""
              : "",
            industry: appUser.role === 'employer' && 'industry' in appUser
              ? (appUser as any).industry || ""
              : "",
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [user, appUser, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (!user) {
        throw new Error("User not authenticated");
      }
      
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: formData.fullName,
          phone: formData.phoneNumber,
          location: formData.location,
          bio: formData.bio,
        })
        .eq("id", user.id);
        
      if (profileError) throw profileError;
      
      if (appUser?.role === 'worker') {
        const { error: workerError } = await supabase
          .from("worker_profiles")
          .update({
            expected_wage: formData.expectedWage ? parseFloat(formData.expectedWage) : null,
          })
          .eq("id", user.id);
          
        if (workerError) throw workerError;
      } else if (appUser?.role === 'employer') {
        const { error: employerError } = await supabase
          .from("employer_profiles")
          .update({
            company_name: formData.companyName,
            industry: formData.industry,
          })
          .eq("id", user.id);
          
        if (employerError) throw employerError;
      }
      
      await refreshUser();
      
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Loading your profile...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 pt-24 pb-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="mt-2 text-gray-600">Update your personal information and settings</p>
          </div>

          <Card className="mb-8">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input 
                    id="fullName" 
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your full name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input 
                    id="phoneNumber" 
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="Your phone number"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="City, State"
                  />
                </div>
                
                {appUser?.role === 'worker' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input 
                        id="skills" 
                        value={formData.skills}
                        onChange={handleInputChange}
                        placeholder="List your key skills, separated by commas"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expectedWage">Expected Hourly Rate</Label>
                      <Input 
                        id="expectedWage" 
                        type="number"
                        value={formData.expectedWage}
                        onChange={handleInputChange}
                        placeholder="Your expected hourly rate"
                      />
                    </div>
                  </>
                )}
                
                {appUser?.role === 'employer' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={formData.companyName}
                        onChange={handleInputChange}
                        placeholder="Your company name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input 
                        id="industry" 
                        value={formData.industry}
                        onChange={handleInputChange}
                        placeholder="Your industry"
                      />
                    </div>
                  </>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={formData.bio}
                    onChange={handleInputChange}
                    placeholder="Tell us about yourself"
                    rows={4}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
