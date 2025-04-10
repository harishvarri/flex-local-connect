
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { AlertTriangle, ArrowLeft, Home, Search, Briefcase, UserRound } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl px-6 py-12 bg-white rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="h-20 w-20 text-orange-500" />
        </div>
        
        <h1 className="text-5xl font-bold mb-4 text-gray-800">Page Not Found</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{location.pathname}</span>
        </p>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-10">
          <Button variant="default" asChild className="flex items-center gap-2 w-full md:w-auto">
            <Link to="/">
              <Home className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex items-center gap-2 w-full md:w-auto">
            <Link to="/find-jobs">
              <Briefcase className="h-4 w-4" />
              <span>Find Jobs</span>
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="flex items-center gap-2 w-full md:w-auto">
            <Link to="/find-workers">
              <UserRound className="h-4 w-4" />
              <span>Find Workers</span>
            </Link>
          </Button>
        </div>
        
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">Looking for something else?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left">
            <Link to="/how-it-works" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">How It Works</p>
                <p className="text-sm text-gray-500">Learn about our platform</p>
              </div>
            </Link>
            
            <Link to="/dashboard" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Your Dashboard</p>
                <p className="text-sm text-gray-500">Manage your account</p>
              </div>
            </Link>
            
            <Link to="/locations" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <Search className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Browse Locations</p>
                <p className="text-sm text-gray-500">Find work in your area</p>
              </div>
            </Link>
            
            <Link to="/register" className="flex items-center p-3 rounded-md hover:bg-gray-50 transition-colors duration-200">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                <UserRound className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-base font-medium text-gray-900">Create Account</p>
                <p className="text-sm text-gray-500">Join our community</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
