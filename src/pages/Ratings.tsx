
import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { Star, StarHalf, Calendar, MapPin, User, Briefcase } from "lucide-react";
import { format } from "date-fns";
import { dummyWorkers, dummyJobs } from "@/utils/dummyData";
import { toast } from "sonner";
import { Worker, Job } from "@/types";

const StarRating = ({ rating, setRating }: { rating: number; setRating: (rating: number) => void }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className="focus:outline-none text-2xl"
        >
          {rating >= star ? (
            <Star className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          ) : (
            <Star className="w-8 h-8 text-gray-300" />
          )}
        </button>
      ))}
    </div>
  );
};

// Mock completed jobs for the current user
const generateCompletedJobs = () => {
  return dummyJobs
    .slice(0, 8)
    .map(job => ({
      ...job,
      worker: dummyWorkers[Math.floor(Math.random() * dummyWorkers.length)],
      completedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      isRated: Math.random() > 0.5
    }));
};

// Mock reviews received by the current user
const generateReceivedReviews = () => {
  return Array.from({ length: 6 }, (_, i) => ({
    id: `review-${i + 1}`,
    score: 3 + Math.floor(Math.random() * 3),
    comment: getRandomReviewComment(),
    fromName: dummyWorkers[Math.floor(Math.random() * dummyWorkers.length)].name,
    fromRole: Math.random() > 0.5 ? 'worker' : 'employer',
    jobTitle: dummyJobs[Math.floor(Math.random() * dummyJobs.length)].title,
    date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000)
  }));
};

const getRandomReviewComment = () => {
  const comments = [
    "Great work, very professional and completed the task on time.",
    "Excellent service, would definitely hire again for future projects.",
    "Very reliable and communicative throughout the job.",
    "Did a fantastic job, exceeded my expectations.",
    "Professional, punctual, and skilled. Highly recommended.",
    "Good quality work delivered within the agreed timeframe.",
    "Very responsive and easy to work with.",
    "Completed the work to a high standard, thank you!",
    "Excellent attention to detail and great communication.",
    "Very satisfied with the quality of work provided."
  ];
  return comments[Math.floor(Math.random() * comments.length)];
};

const Ratings = () => {
  const { user } = useAuth();
  const [pendingJobs, setPendingJobs] = useState<any[]>([]);
  const [completedRatings, setCompletedRatings] = useState<any[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    // Load mock data
    const completed = generateCompletedJobs();
    setPendingJobs(completed.filter(job => !job.isRated));
    setCompletedRatings(completed.filter(job => job.isRated));
    setReceivedReviews(generateReceivedReviews());
  }, []);

  const handleRateJob = () => {
    if (!selectedJob) return;
    
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    
    // In a real app, this would submit to the database
    toast.success("Thank you for your rating!");
    
    // Update local state for the demo
    setCompletedRatings(prev => [
      ...prev, 
      { 
        ...selectedJob, 
        isRated: true, 
        rating, 
        comment, 
        ratedDate: new Date() 
      }
    ]);
    
    setPendingJobs(prev => prev.filter(job => job.id !== selectedJob.id));
    setSelectedJob(null);
    setRating(5);
    setComment("");
  };

  const handleSelectJobToRate = (job: any) => {
    setSelectedJob(job);
    setRating(5);
    setComment("");
  };

  const calculateAverageRating = (reviews: any[]) => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((total, review) => total + review.score, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<Star key={`star-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<StarHalf key={`star-half-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
      } else {
        stars.push(<Star key={`star-empty-${i}`} className="w-4 h-4 text-gray-300" />);
      }
    }
    
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Ratings & Reviews</h1>
          <p className="text-lg text-gray-600 mb-8">
            Build trust with ratings and reviews based on job performance
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">
                    Pending Reviews ({pendingJobs.length})
                  </TabsTrigger>
                  <TabsTrigger value="given">
                    Reviews Given ({completedRatings.length})
                  </TabsTrigger>
                  <TabsTrigger value="received">
                    Reviews Received ({receivedReviews.length})
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="pending" className="mt-6">
                  {pendingJobs.length > 0 ? (
                    <div className="space-y-4">
                      {pendingJobs.map(job => (
                        <Card key={job.id} className="hover:shadow-sm transition-shadow">
                          <CardHeader className="pb-2">
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription>{job.company}</CardDescription>
                          </CardHeader>
                          <CardContent className="pb-2">
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                Completed on {format(job.completedDate, 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPin className="h-4 w-4 mr-2" />
                                {job.location}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-3">
                              <div className="text-sm font-medium">Rate worker:</div>
                              <div className="font-medium">{job.worker.name}</div>
                            </div>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              onClick={() => handleSelectJobToRate(job)}
                              className="w-full"
                            >
                              Leave Review
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>No pending reviews at this time</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="given" className="mt-6">
                  {completedRatings.length > 0 ? (
                    <div className="space-y-4">
                      {completedRatings.map(job => (
                        <Card key={job.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle>{job.title}</CardTitle>
                                <CardDescription>{job.company}</CardDescription>
                              </div>
                              <div className="flex">
                                {renderStars(job.rating || 5)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                              <div className="flex items-center text-gray-600">
                                <Calendar className="h-4 w-4 mr-2" />
                                Reviewed on {format(job.ratedDate || new Date(), 'MMM d, yyyy')}
                              </div>
                              <div className="flex items-center text-gray-600">
                                <User className="h-4 w-4 mr-2" />
                                {job.worker.name}
                              </div>
                            </div>
                            
                            <p className="text-gray-600">
                              {job.comment || "Great job, very professional and completed the task on time."}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>You haven't given any reviews yet</p>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="received" className="mt-6">
                  {receivedReviews.length > 0 ? (
                    <div className="space-y-4">
                      {receivedReviews.map(review => (
                        <Card key={review.id}>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between">
                              <div>
                                <CardTitle>{review.jobTitle}</CardTitle>
                                <CardDescription>
                                  Review from {review.fromName} ({review.fromRole === 'employer' ? 'Employer' : 'Worker'})
                                </CardDescription>
                              </div>
                              <div className="flex">
                                {renderStars(review.score)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="text-sm text-gray-600 mb-3">
                              <Calendar className="h-4 w-4 inline mr-2" />
                              {format(review.date, 'MMM d, yyyy')}
                            </div>
                            
                            <p className="text-gray-600">
                              {review.comment}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <p>You haven't received any reviews yet</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Your Rating Summary</CardTitle>
                  <CardDescription>Based on reviews you've received</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center mb-6">
                    <div className="text-5xl font-bold text-smartflex-blue">
                      {calculateAverageRating(receivedReviews)}
                    </div>
                    <div className="flex mt-2 mb-1">
                      {renderStars(parseFloat(calculateAverageRating(receivedReviews)))}
                    </div>
                    <div className="text-sm text-gray-500">
                      Based on {receivedReviews.length} reviews
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map(starCount => {
                      const count = receivedReviews.filter(r => Math.floor(r.score) === starCount).length;
                      const percentage = receivedReviews.length > 0 
                        ? Math.round((count / receivedReviews.length) * 100)
                        : 0;
                      
                      return (
                        <div key={starCount} className="flex items-center">
                          <div className="w-12 text-sm text-gray-700">{starCount} stars</div>
                          <div className="flex-1 mx-4 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-smartflex-blue rounded-full"
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <div className="w-8 text-sm text-gray-700">{count}</div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
              
              {selectedJob && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Rate Your Experience</CardTitle>
                    <CardDescription>
                      Providing feedback for job: {selectedJob.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rate {selectedJob.worker.name}'s performance:
                        </label>
                        <StarRating rating={rating} setRating={setRating} />
                      </div>
                      
                      <div>
                        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                          Comments (optional):
                        </label>
                        <Textarea
                          id="comment"
                          placeholder="Share your experience working with this person..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setSelectedJob(null)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleRateJob}>
                      Submit Review
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Ratings;
