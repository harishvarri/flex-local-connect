
import React from "react";
import { Briefcase, Calendar, Check, MessageSquare, Search, Star, User } from "lucide-react";

const features = [
  {
    name: "Worker Profiles",
    description:
      "Create detailed profiles with your skills, availability, and expected wages.",
    icon: User,
  },
  {
    name: "Job Listings",
    description:
      "Post and find jobs with clear details on skills, location, timing, and payment.",
    icon: Briefcase,
  },
  {
    name: "Smart Matching",
    description:
      "Get automatically matched with suitable jobs or skilled workers based on your needs.",
    icon: Search,
  },
  {
    name: "Availability Calendar",
    description:
      "Set your work schedule and find jobs that fit your availability.",
    icon: Calendar,
  },
  {
    name: "In-app Messaging",
    description:
      "Communicate directly with employers or workers after job acceptance.",
    icon: MessageSquare,
  },
  {
    name: "Ratings & Reviews",
    description:
      "Build trust with ratings and reviews based on job performance.",
    icon: Star,
  },
];

const FeatureSection = () => {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            A better way to find local work
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            SmartFlex connects businesses with skilled workers for local, flexible employment opportunities.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="feature-card">
                <div>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-smartflex-blue text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
