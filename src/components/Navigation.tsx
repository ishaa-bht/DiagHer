import React from 'react';
import { Stethoscope } from 'lucide-react';

const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-200 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-800 to-rose-900 rounded-lg flex items-center justify-center shadow-lg">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">DiagHer</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#solution" className="text-gray-600 hover:text-rose-800 transition-colors font-medium">Solution</a>
            <a href="#technology" className="text-gray-600 hover:text-rose-800 transition-colors font-medium">Technology</a>
            <a href="#impact" className="text-gray-600 hover:text-rose-800 transition-colors font-medium">Impact</a>
            <button className="bg-gradient-to-r from-rose-800 to-rose-900 text-white px-6 py-2 rounded-lg hover:from-rose-900 hover:to-rose-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;