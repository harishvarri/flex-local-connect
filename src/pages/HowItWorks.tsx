
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HowItWorksComponent from "@/components/HowItWorks";
import CTASection from "@/components/CTASection";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="pt-16"> {/* Add padding for navbar */}
          <div className="bg-gradient-to-r from-smartflex-blue to-smartflex-green text-white py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h1 className="text-4xl sm:text-5xl font-extrabold">How SmartFlex Works</h1>
              <p className="mt-4 text-xl">
                A simple process to connect local workers with job opportunities
              </p>
            </div>
          </div>
          
          <HowItWorksComponent />
          
          <section className="bg-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
                <p className="mt-4 text-lg text-gray-500">
                  Find answers to common questions about SmartFlex
                </p>
              </div>
              
              <div className="grid gap-8 md:grid-cols-2">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-xl mb-4">For Workers</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-lg">How do I get paid?</h4>
                      <p className="mt-2 text-gray-600">
                        Payment terms are agreed upon job acceptance. Currently, most payments are handled directly between you and the employer after job completion, typically in cash or via direct bank transfer.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">What skills can I list?</h4>
                      <p className="mt-2 text-gray-600">
                        You can list any skills you have, from professional trades to general labor. The platform supports various categories including cleaning, delivery, administrative work, skilled trades, and more.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">How do I set my availability?</h4>
                      <p className="mt-2 text-gray-600">
                        After registration, you can access your profile settings to set up your availability calendar, marking which days and times you're available for work.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="font-semibold text-xl mb-4">For Employers</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-lg">How do I post a job?</h4>
                      <p className="mt-2 text-gray-600">
                        After creating an employer account, you can use the "Post a Job" feature to create a new listing with details about the task, required skills, location, timing, and payment information.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">How do I select a worker?</h4>
                      <p className="mt-2 text-gray-600">
                        You can browse through available workers based on skills, location, and ratings. Our system will also suggest matches based on your job requirements. You can view profiles and directly contact workers you're interested in.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">What if the worker doesn't complete the job?</h4>
                      <p className="mt-2 text-gray-600">
                        If there are issues with job completion, you can report it through the platform. We encourage communication first, but our rating system helps maintain quality and accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <CTASection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorksPage;
