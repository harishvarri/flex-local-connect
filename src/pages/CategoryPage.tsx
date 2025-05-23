
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AuthenticatedNavbar from "@/components/AuthenticatedNavbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Star, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Worker } from "@/types";

// This function transforms kebab-case to Title Case
const formatCategoryTitle = (category: string) => {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Map URL parameters to database categories
const categoryMappings: Record<string, string[]> = {
  'cleaning-maintenance': ['Cleaning', 'Maintenance'],
  'handyman-repairs': ['Repairs', 'Handyman'],
  'delivery-logistics': ['Delivery', 'Transportation'],
  'event-staff': ['Events', 'Food Service'],
  'data-entry': ['Administrative', 'Data Entry'],
  'construction': ['Construction', 'Labor'],
  'retail-sales': ['Retail', 'Sales'],
  'healthcare': ['Healthcare', 'Support']
};

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const workersPerPage = 9;
  
  const navigate = useNavigate();
  
  const categoryTitle = category ? formatCategoryTitle(category) : 'Category';
  const dbCategories = category ? categoryMappings[category] || [categoryTitle] : [];

  useEffect(() => {
    const fetchWorkersByCategory = async () => {
      if (!category) return;
      
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from("worker_profiles")
          .select(`
            *, 
            profiles:id(id, name, email, avatar, phone, location, bio, role, created_at),
            worker_skills(
              skill_id,
              level,
              skills(id, name, category)
            )
          `);

        if (error) throw error;

        if (data) {
          // Filter workers based on their skills matching the category
          const filteredWorkers = data.filter((worker: any) => {
            return worker.worker_skills.some((skill: any) => {
              return dbCategories.some(cat => 
                skill.skills.name.toLowerCase().includes(cat.toLowerCase()) || 
                skill.skills.category.toLowerCase().includes(cat.toLowerCase())
              );
            });
          });
          
          const formattedWorkers: Worker[] = filteredWorkers.map((w: any) => ({
            id: w.profiles.id,
            name: w.profiles.name,
            email: w.profiles.email,
            role: 'worker',
            avatar: w.profiles.avatar,
            phone: w.profiles.phone,
            location: w.profiles.location,
            bio: w.profiles.bio,
            createdAt: w.profiles.created_at,
            expectedWage: w.expected_wage,
            skills: w.worker_skills.map((ws: any) => ({
              id: ws.skills.id,
              name: ws.skills.name,
              category: ws.skills.category,
              level: ws.level
            })),
            availability: [],
            ratings: []
          }));
          
          setWorkers(formattedWorkers);
        }
      } catch (error) {
        console.error("Error fetching workers by category:", error);
        toast.error("Failed to load workers");
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkersByCategory();
  }, [category, dbCategories]);

  const handleViewProfile = (workerId: string) => {
    navigate(`/worker-profile/${workerId}`);
  };

  // Get current page of workers
  const indexOfLastWorker = page * workersPerPage;
  const indexOfFirstWorker = indexOfLastWorker - workersPerPage;
  const currentWorkers = workers.slice(indexOfFirstWorker, indexOfLastWorker);
  const totalPages = Math.ceil(workers.length / workersPerPage);

  return (
    <div className="min-h-screen flex flex-col">
      <AuthenticatedNavbar />
      <main className="flex-grow bg-gray-50">
        <div className="max-w-7xl mx-auto pt-24 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="mb-4 md:mb-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <h1 className="text-3xl font-extrabold text-gray-900">{categoryTitle}</h1>
              <p className="mt-2 text-lg text-gray-500">
                Find skilled workers specializing in {categoryTitle.toLowerCase()}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button onClick={() => navigate('/jobs')}>
                Browse All Jobs
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-16 w-16 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <Skeleton className="h-24 w-full mb-4" />
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Skeleton className="h-9 w-full" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : workers.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentWorkers.map((worker) => (
                  <Card key={worker.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start gap-4">
                        <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {worker.avatar ? (
                            <img 
                              src={worker.avatar} 
                              alt={worker.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-2xl text-gray-500">{worker.name?.charAt(0)}</span>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{worker.name}</CardTitle>
                          <div className="flex items-center mt-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3 mr-1" />
                            <span>{worker.location || 'Location not specified'}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {worker.bio || 'No bio available'}
                      </p>
                      
                      {worker.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {worker.skills
                            .filter(skill => 
                              dbCategories.some(cat => 
                                skill.name.toLowerCase().includes(cat.toLowerCase()) || 
                                skill.category.toLowerCase().includes(cat.toLowerCase())
                              )
                            )
                            .map((skill) => (
                              <Badge key={skill.id} variant="secondary" className="flex items-center gap-1">
                                {skill.name}
                                <span className="text-xs bg-white/50 px-1 rounded">
                                  {skill.level}
                                </span>
                              </Badge>
                            ))}
                        </div>
                      )}

                      {worker.expectedWage && (
                        <div className="mt-3 text-sm font-medium">
                          <span className="text-gray-700">Expected rate: </span>
                          <span className="text-green-600">₹{worker.expectedWage}/hr</span>
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="border-t pt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                      <Button onClick={() => handleViewProfile(worker.id)}>View Profile</Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <p className="text-gray-500 mb-4">No workers found in this category</p>
              <Button variant="outline" onClick={() => navigate('/workers')}>
                Browse All Workers
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CategoryPage;
