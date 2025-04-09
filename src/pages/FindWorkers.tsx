
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";

const FindWorkers = () => {
  const [backendStatus, setBackendStatus] = useState<"loading" | "connected" | "error">("loading");

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        // Test the connection by getting the current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Backend connection error:", error);
          setBackendStatus("error");
          toast.error("Failed to connect to the backend");
        } else {
          console.log("Backend connection successful:", data);
          setBackendStatus("connected");
          toast.success("Successfully connected to Supabase backend!");
        }
      } catch (error) {
        console.error("Backend connection test failed:", error);
        setBackendStatus("error");
        toast.error("Failed to connect to the backend");
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-6">Find Skilled Workers</h1>
        
        <div className="mb-6 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Backend Connection Status</h2>
          {backendStatus === "loading" && (
            <p className="text-gray-600">Testing connection to Supabase backend...</p>
          )}
          {backendStatus === "connected" && (
            <p className="text-green-600">✅ Successfully connected to Supabase backend</p>
          )}
          {backendStatus === "error" && (
            <p className="text-red-600">❌ Failed to connect to Supabase backend</p>
          )}
        </div>

        <p className="text-gray-600 mb-8">
          Browse through our database of skilled workers to find the perfect match for your project needs.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Worker cards will be displayed here */}
          <div className="p-6 border rounded-lg shadow-sm">
            <p className="text-center text-gray-500">Worker profiles will be displayed here</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FindWorkers;
