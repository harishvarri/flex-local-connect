
import React from "react";

const steps = [
  {
    id: 1,
    title: "Create a Profile",
    description:
      "Sign up and create a detailed profile specifying your skills or business needs.",
    workerAction: "Add your skills, availability, and expected wage",
    employerAction: "Provide details about your business and job requirements",
  },
  {
    id: 2,
    title: "Find Opportunities",
    description:
      "Search for jobs or workers that match your criteria in your local area.",
    workerAction: "Browse available jobs in your area and apply",
    employerAction: "Post jobs with detailed requirements or search for available workers",
  },
  {
    id: 3,
    title: "Connect & Confirm",
    description:
      "Match with the right person or job and confirm the details together.",
    workerAction: "Accept job offers that match your skills and availability",
    employerAction: "Select the right worker for your job and confirm details",
  },
  {
    id: 4,
    title: "Complete the Work",
    description:
      "Perform the task as agreed and confirm completion through the platform.",
    workerAction: "Complete the job and mark it as finished in the app",
    employerAction: "Verify job completion and provide feedback",
  },
];

const HowItWorks = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            How SmartFlex Works
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            Our simple process connects employers with workers quickly and efficiently.
          </p>
        </div>

        <div className="mt-16">
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className="flex flex-col md:flex-row items-center"
              >
                <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                  <div className="h-24 w-24 rounded-full bg-smartflex-blue text-white flex items-center justify-center text-4xl font-bold">
                    {step.id}
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-lg text-gray-500">
                    {step.description}
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-smartflex-blue">
                        For Workers:
                      </h4>
                      <p className="mt-1">{step.workerAction}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-medium text-smartflex-green">
                        For Employers:
                      </h4>
                      <p className="mt-1">{step.employerAction}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
