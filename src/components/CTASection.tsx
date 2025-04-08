
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <div className="bg-smartflex-blue">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to get started?</span>
          <span className="block text-smartflex-amber">Join SmartFlex today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
          <Button size="lg" className="bg-white text-smartflex-blue hover:bg-gray-100" asChild>
            <Link to="/register?role=worker">I'm looking for work</Link>
          </Button>
          <Button size="lg" className="bg-smartflex-amber text-white hover:bg-amber-500" asChild>
            <Link to="/register?role=employer">I need to hire</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CTASection;
