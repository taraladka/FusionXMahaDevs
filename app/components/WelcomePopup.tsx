import React, { useState, useEffect } from 'react';
import { FiX, FiLogIn, FiUserPlus, FiExternalLink } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

type WelcomePopupProps = {
  onClose: () => void;
};

const WelcomePopup: React.FC<WelcomePopupProps> = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show popup if user is not authenticated
    if (!isAuthenticated) {
      // Add a small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center px-4 backdrop-blur-sm">
      <div className="bg-darkgray rounded-lg shadow-custom-lg max-w-md w-full relative overflow-hidden transition-all transform animate-fadeIn border border-gray-700">
        <div className="absolute top-0 right-0 p-2">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full p-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        <div className="pt-8 pb-6 px-6">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Image
                src="/pictures/fusion logo.png"
                alt="Fusion Logo"
                width={70}
                height={70}
                className="h-auto"
              />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Welcome to Fusion!</h3>
            <div className="h-1 w-16 bg-primary mx-auto rounded-full mb-4"></div>
            <p className="text-gray-300 px-4">
              Join our technical club to access exclusive events, resources, and connect with a community of tech enthusiasts.
            </p>
          </div>
          
          <div className="space-y-4">
            <Link 
              href="/auth?action=signup"
              className="block w-full py-2.5 px-4 bg-primary text-white font-medium rounded-md shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors duration-300 flex items-center justify-center"
            >
              <FiUserPlus className="mr-2 h-5 w-5" />
              Create Account
            </Link>
            <Link 
              href="/auth"
              className="block w-full py-2.5 px-4 bg-darkergray text-white font-medium rounded-md border border-gray-700 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors duration-300 flex items-center justify-center"
            >
              <FiLogIn className="mr-2 h-5 w-5" />
              Sign In
            </Link>
            <button
              onClick={onClose}
              className="block w-full text-gray-400 hover:text-primary transition-colors duration-300 py-2 text-sm font-medium flex items-center justify-center"
            >
              <FiExternalLink className="mr-1.5 h-4 w-4" />
              Continue as Guest
            </button>
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-800 text-xs text-gray-500 text-center">
            By joining, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup; 