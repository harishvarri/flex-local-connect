
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { dummyJobs } from "@/utils/dummyData";

// Get unique job categories from dummy data
const getUniqueCategories = () => {
  const categoriesSet = new Set(dummyJobs.map(job => job.category));
  return Array.from(categoriesSet).map(category => ({
    name: category,
    icon: getCategoryIcon(category),
    url: `/jobs/${category.toLowerCase().replace(/\s+/g, '-')}`,
  }));
};

// Helper to get appropriate emoji for each category
const getCategoryIcon = (category: string): string => {
  const iconMap: {[key: string]: string} = {
    "Cleaning": "🧹",
    "Delivery": "🚚",
    "Administration": "💻", 
    "Events": "🍽️",
    "Skilled Trade": "🔧",
    "Retail": "🛍️",
    "Warehouse": "📦",
    "Food Service": "🍳",
    "Healthcare": "⚕️",
    "Education": "📚",
    "IT Support": "🖥️",
    "Marketing": "📱",
    "Security": "🛡️",
    "Maintenance": "🔨",
    "Hospitality": "🏨",
    "Manufacturing": "🏭",
    "Construction": "👷"
  };
  
  return iconMap[category] || "🔍";
};

// Get top 8 categories or fill with predefined ones if needed
const categories = getUniqueCategories().slice(0, 8);

const CategoryGrid = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (url: string) => {
    navigate(url);
  };
  
  return (
    <section className="bg-white py-16" id="categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Browse by Category
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Explore job opportunities across various skill categories
          </p>
        </div>

        <div className="mt-12 grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.name}
              onClick={() => handleCategoryClick(category.url)}
              className="group bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-smartflex-blue/30 transition-all cursor-pointer"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-lg font-medium text-gray-900 group-hover:text-smartflex-blue transition-colors">
                {category.name}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <Button variant="outline" size="lg" onClick={() => navigate('/workers')}>
            View Worker Profiles
          </Button>
          <Button size="lg" onClick={() => navigate('/jobs')}>
            Browse Available Jobs
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
