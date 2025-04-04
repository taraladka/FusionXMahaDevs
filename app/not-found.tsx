'use client';

import React from 'react';
import Link from 'next/link';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';
import Navbar from './components/Navbar';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-darkergray rounded-lg shadow-lg p-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 text-primary rounded-full mb-6">
            <FiAlertTriangle className="h-10 w-10" />
          </div>
          
          <h1 className="text-3xl font-bold mb-4 text-white">Page Not Found</h1>
          
          <p className="text-gray-300 mb-8">
            Sorry, the page you were looking for doesn't exist or has been moved.
          </p>
          
          <Link 
            href="/" 
            className="btn-primary inline-flex items-center justify-center py-3 px-6"
          >
            <FiHome className="mr-2" />
            Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
} 