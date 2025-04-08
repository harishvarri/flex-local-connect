
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="mb-8 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-smartflex-blue via-smartflex-green to-smartflex-amber">
                SmartFlex
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Connecting local businesses with skilled workers for flexible job opportunities.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              For Workers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/find-jobs" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/create-profile" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/worker-faq" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Worker FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              For Employers
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/post-job" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/find-workers" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Find Workers
                </Link>
              </li>
              <li>
                <Link to="/employer-faq" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Employer FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">
              Company
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/about" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-gray-600 hover:text-smartflex-blue">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 text-center">
            &copy; {new Date().getFullYear()} SmartFlex. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
