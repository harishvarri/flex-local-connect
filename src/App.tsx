
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FindJobs from "./pages/FindJobs";
import FindWorkers from "./pages/FindWorkers";
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import JobApplication from "./pages/JobApplication";
import Locations from "./pages/Locations";
import DummyData from "./pages/DummyData";
import WorkersList from "./pages/WorkersList";
import JobsList from "./pages/JobsList";
import MatchingPage from "./pages/MatchingPage";
import CategoryPage from "./pages/CategoryPage";
import AuthGuard from "./components/AuthGuard";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/find-jobs" element={<FindJobs />} />
              <Route path="/find-workers" element={<FindWorkers />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
              <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
              <Route path="/job-application" element={<AuthGuard><JobApplication /></AuthGuard>} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/dummy-data" element={<DummyData />} />
              <Route path="/workers" element={<WorkersList />} />
              <Route path="/jobs" element={<JobsList />} />
              <Route path="/matching" element={<MatchingPage />} />
              <Route path="/jobs/:category" element={<CategoryPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
