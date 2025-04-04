'use client';

import { useEffect, useState, ReactNode } from 'react';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { app } from '../firebase/config';
import { AuthProvider } from '../context/AuthContext';

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      const auth = getAuth(app);
      try {
        // Set persistence to local (persists across browser sessions)
        await setPersistence(auth, browserLocalPersistence);
      } catch (error) {
        console.error('Error setting auth persistence:', error);
      } finally {
        setIsReady(true);
      }
    };

    initAuth();
  }, []);

  if (!isReady) {
    // You could show a loading spinner here
    return null;
  }

  return <AuthProvider>{children}</AuthProvider>;
} 