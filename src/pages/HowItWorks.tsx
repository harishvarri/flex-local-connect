
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Calendar, 
  Users, 
  MessageSquare, 
  CreditCard, 
  Star, 
  Clock, 
  Search, 
  Briefcase, 
  User 
} from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">How SmartFlex Works</h1>
            <p className="mt-4 text-lg text-gray-500">
              Your flexible workforce solution, simplified
            </p>
          </div>

          {/* For Workers Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">For Workers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600 mb-4 mx-auto">
                  <User className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">1. Create Your Profile</h3>
                <p className="text-gray-600 text-center">
                  Sign up and build your profile highlighting your skills, experience, and availability.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600 mb-4 mx-auto">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">2. Find Opportunities</h3>
                <p className="text-gray-600 text-center">
                  Browse available jobs that match your skills, location and schedule preferences.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600 mb-4 mx-auto">
                  <CreditCard className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">3. Get Paid</h3>
                <p className="text-gray-600 text-center">
                  Complete jobs, receive ratings, and get paid securely through our platform.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link to="/register">Sign Up as a Worker</Link>
              </Button>
            </div>
          </section>

          {/* For Employers Section */}
          <section className="mb-20">
            <h2 className="text-2xl font-bold mb-8 text-center">For Employers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-amber-100 text-amber-600 mb-4 mx-auto">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">1. Post a Job</h3>
                <p className="text-gray-600 text-center">
                  Describe your needs, set your budget, and specify when you need the work done.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600 mb-4 mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">2. Review Candidates</h3>
                <p className="text-gray-600 text-center">
                  Browse worker profiles, check ratings, and pick the perfect match for your job.
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-rose-100 text-rose-600 mb-4 mx-auto">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">3. Complete the Job</h3>
                <p className="text-gray-600 text-center">
                  Approve completed work, provide feedback, and process secure payment.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button asChild size="lg">
                <Link to="/register">Sign Up as an Employer</Link>
              </Button>
            </div>
          </section>

          {/* Key Features Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-8 text-center">Key Platform Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <div className="mr-4 flex-shrink-0">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Flexible Scheduling</h3>
                  <p className="text-gray-600">
                    Set your availability or find workers when you need them most, with our intuitive calendar system.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <div className="mr-4 flex-shrink-0">
                  <MessageSquare className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Secure Messaging</h3>
                  <p className="text-gray-600">
                    Communicate directly with workers or employers through our in-app messaging system.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <div className="mr-4 flex-shrink-0">
                  <Star className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Rating System</h3>
                  <p className="text-gray-600">
                    Build trust through our transparent rating and review system to showcase reliability.
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm flex">
                <div className="mr-4 flex-shrink-0">
                  <Clock className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Real-Time Updates</h3>
                  <p className="text-gray-600">
                    Get notifications about new jobs, applications, and messages as they happen.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-gradient-to-r from-smartflex-blue to-smartflex-green rounded-lg shadow-md p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to get started?</h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Join thousands of workers and employers already using SmartFlex to connect for flexible work opportunities.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link to="/workers">Browse Workers</Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-white hover:bg-white/10" asChild>
                <Link to="/jobs">Find Jobs</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;
