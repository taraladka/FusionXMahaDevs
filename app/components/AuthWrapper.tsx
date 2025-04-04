'use client';

import { useEffect, useState, ReactNode } from 'react';
import { AuthProvider } from '../context/AuthContext';

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize any necessary auth setup
    try {
      // Ensure localStorage exists
      if (typeof window !== 'undefined') {
        // Initialize users array if it doesn't exist
        if (!localStorage.getItem('users')) {
          localStorage.setItem('users', JSON.stringify([]));
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setIsReady(true);
    }
  }, []);

  if (!isReady) {
    // You could show a loading spinner here
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
} 