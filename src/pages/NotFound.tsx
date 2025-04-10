
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home, Search, Briefcase, UserRound, MapPin, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="w-full max-w-3xl px-6 py-12 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-orange-100 rounded-full">
            <AlertTriangle className="h-16 w-16 text-orange-500" />
          </div>
        </div>
        
        <h1 className="text-5xl font-bold mb-2 text-gray-800">Oops! Page Not Found</h1>
        <h2 className="text-xl text-indigo-600 mb-4">We couldn't find the job you're looking for</h2>
        
        <p className="text-lg text-gray-600 mb-8">
          The page <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span> doesn't exist in our marketplace.
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <Button variant="default" asChild className="flex items-center gap-2 w-full md:w-auto bg-indigo-600 hover:bg-indigo-700">
            <Link to="/">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex items-center gap-2 w-full md:w-auto border-indigo-300 text-indigo-700 hover:bg-indigo-50">
            <Link to="/find-jobs">
              <Briefcase className="h-4 w-4" />
              <span>Find Jobs</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex items-center gap-2 w-full md:w-auto border-indigo-300 text-indigo-700 hover:bg-indigo-50">
            <Link to="/find-workers">
              <UserRound className="h-4 w-4" />
              <span>Find Workers</span>
            </Link>
          </Button>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Popular Destinations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <Link to="/how-it-works" className="flex items-center p-3 rounded-md hover:bg-indigo-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <ArrowLeft className="h-5 w-5 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">How It Works</p>
                <p className="text-sm text-gray-500">Learn how our job marketplace works</p>
              </div>
            </Link>
            
            <Link to="/dashboard" className="flex items-center p-3 rounded-md hover:bg-indigo-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Job Dashboard</p>
                <p className="text-sm text-gray-500">Manage your job applications</p>
              </div>
            </Link>
            
            <Link to="/locations" className="flex items-center p-3 rounded-md hover:bg-indigo-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Browse Locations</p>
                <p className="text-sm text-gray-500">Find work in your area</p>
              </div>
            </Link>
            
            <Link to="/register" className="flex items-center p-3 rounded-md hover:bg-indigo-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <UserRound className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Create Account</p>
                <p className="text-sm text-gray-500">Join our worker community</p>
              </div>
            </Link>
          </div>
        </div>
        
        <div className="border-t border-gray-200 mt-8 pt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Featured Opportunities</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800">Freelance Jobs</h3>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Flexible schedules</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild className="text-indigo-700 bg-white">
                  <Link to="/find-jobs?category=Freelance">View Jobs</Link>
                </Button>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-r from-amber-50 to-yellow-50 hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-gray-800">Skilled Trades</h3>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <Clock className="h-4 w-4 mr-1" />
                <span>High demand</span>
              </div>
              <div className="mt-4">
                <Button variant="outline" size="sm" asChild className="text-amber-700 bg-white">
                  <Link to="/find-jobs?category=Skilled%20Trade">View Jobs</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
