
// This is a new file we need to create to add our new routes
import React, { Suspense } from "react";
import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";

import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Dashboard from "@/pages/Dashboard";
import FindJobs from "@/pages/FindJobs";
import FindWorkers from "@/pages/FindWorkers";
import NotFound from "@/pages/NotFound";
import Profile from "@/pages/Profile";
import JobApplication from "@/pages/JobApplication";
import MatchingPage from "@/pages/MatchingPage";
import CategoryPage from "@/pages/CategoryPage";
import Locations from "@/pages/Locations";
import PostJob from "@/pages/PostJob";
import AvailabilityCalendar from "@/pages/AvailabilityCalendar";
import Messages from "@/pages/Messages";
import Ratings from "@/pages/Ratings";

import { AuthProvider } from "@/contexts/AuthContext";
import AuthGuard from "@/components/AuthGuard";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense
          fallback={
            <div className="flex h-screen w-full items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          }
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<FindJobs />} />
            <Route path="/workers" element={<FindWorkers />} />
            <Route path="/jobs/:category" element={<CategoryPage />} />
            <Route path="/locations" element={<Locations />} />
            
            {/* New public routes */}
            <Route path="/calendar" element={<AvailabilityCalendar />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/ratings" element={<Ratings />} />
            <Route path="/post-job" element={<PostJob />} />
            
            {/* Protected routes */}
            <Route
              path="/dashboard"
              element={
                <AuthGuard>
                  <Dashboard />
                </AuthGuard>
              }
            />
            <Route
              path="/profile"
              element={
                <AuthGuard>
                  <Profile />
                </AuthGuard>
              }
            />
            <Route
              path="/job-application"
              element={
                <AuthGuard>
                  <JobApplication />
                </AuthGuard>
              }
            />
            <Route
              path="/matching"
              element={
                <AuthGuard>
                  <MatchingPage />
                </AuthGuard>
              }
            />
            
            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
