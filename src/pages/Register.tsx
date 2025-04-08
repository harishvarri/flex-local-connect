
import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Register = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialRole = (queryParams.get("role") as UserRole) || "worker";
  const [activeTab, setActiveTab] = useState<UserRole>(initialRole);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
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
                    <Input id="worker-name" placeholder="Enter your full name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="worker-email">Email</Label>
                    <Input id="worker-email" type="email" placeholder="Enter your email" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="worker-phone">Phone Number</Label>
                    <Input id="worker-phone" type="tel" placeholder="Enter your phone number" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="worker-password">Password</Label>
                    <Input
                      id="worker-password"
                      type="password"
                      placeholder="Create a password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="worker-confirm-password">Confirm Password</Label>
                    <Input
                      id="worker-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full">Create Worker Account</Button>
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
                    <Input id="employer-name" placeholder="Enter your full name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" placeholder="Enter your company name" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer-email">Business Email</Label>
                    <Input
                      id="employer-email"
                      type="email"
                      placeholder="Enter your business email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer-phone">Phone Number</Label>
                    <Input
                      id="employer-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer-password">Password</Label>
                    <Input
                      id="employer-password"
                      type="password"
                      placeholder="Create a password"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employer-confirm-password">Confirm Password</Label>
                    <Input
                      id="employer-confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="w-full">Create Employer Account</Button>
                </CardFooter>
              </Card>
            </TabsContent>
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
