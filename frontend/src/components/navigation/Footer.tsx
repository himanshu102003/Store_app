import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/about" className="text-gray-500 hover:text-gray-600">
              About
            </Link>
            <Link to="/privacy" className="text-gray-500 hover:text-gray-600">
              Privacy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-600">
              Terms
            </Link>
            <Link to="/contact" className="text-gray-500 hover:text-gray-600">
              Contact
            </Link>
          </div>
          <div className="mt-4 md:mt-0 text-center md:text-right">
            <p className="text-sm text-gray-500">
              &copy; {currentYear} Store Rating App. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
