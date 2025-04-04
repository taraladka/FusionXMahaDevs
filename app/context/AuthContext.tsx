'use client';

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { auth, authEmitter } from '../firebase/config';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  verifyAdminCode: (code: string) => Promise<boolean>;
  loginAsAdmin: (email: string, password: string, adminCode: string) => Promise<void>;
  signupAsAdmin: (name: string, email: string, password: string, adminCode: string) => Promise<void>;
};

// Admin verification code
const ADMIN_CODE = "fusion2023";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setIsLoading(true);
      if (authUser) {
        // User is signed in
        const userData: User = {
          id: authUser.id || authUser.uid || '',
          name: authUser.displayName || 'User',
          email: authUser.email || '',
          isAdmin: localStorage.getItem(`admin_${authUser.id || authUser.uid}`) === 'true',
        };
        setUser(userData);
      } else {
        // User is signed out
        setUser(null);
      }
      setIsLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const verifyAdminCode = async (code: string): Promise<boolean> => {
    return code === ADMIN_CODE;
  };

  const loginAsAdmin = async (email: string, password: string, adminCode: string): Promise<void> => {
    setIsLoading(true);
    try {
      // First verify the admin code
      const isValidCode = await verifyAdminCode(adminCode);
      if (!isValidCode) {
        throw new Error("Invalid admin code");
      }

      // Get all users from localStorage
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Find the user with matching email and password
      const user = users.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error("auth/user-not-found");
      }
      
      // Store admin status in localStorage
      localStorage.setItem(`admin_${user.id}`, 'true');
      
      // Set as current user in localStorage
      localStorage.setItem('auth_user', JSON.stringify({
        id: user.id,
        displayName: user.name,
        email: user.email,
      }));
      
      // Notify listeners of auth state change
      authEmitter.emit('authStateChanged', {
        id: user.id,
        displayName: user.name,
        email: user.email,
      });
      
    } catch (error: any) {
      const errorCode = error.code || error.message;
      const errorMessage = error.message;
      console.error('Admin login error:', errorCode, errorMessage);
      
      let userFriendlyError = 'Invalid email, password, or admin code';
      if (error.message === "Invalid admin code") {
        userFriendlyError = 'Invalid admin code';
      } else if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        userFriendlyError = 'Invalid email or password';
      } else if (errorCode === 'auth/too-many-requests') {
        userFriendlyError = 'Too many failed login attempts. Please try again later.';
      } else if (errorCode === 'auth/user-disabled') {
        userFriendlyError = 'This account has been disabled. Please contact support.';
      }
      
      setIsLoading(false);
      throw new Error(userFriendlyError);
    }
    setIsLoading(false);
  };

  const signupAsAdmin = async (name: string, email: string, password: string, adminCode: string): Promise<void> => {
    setIsLoading(true);
    try {
      // First verify the admin code
      const isValidCode = await verifyAdminCode(adminCode);
      if (!isValidCode) {
        throw new Error("Invalid admin code");
      }

      // Get all users from localStorage
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Check if user with this email already exists
      if (users.some(u => u.email === email)) {
        throw new Error("auth/email-already-in-use");
      }
      
      // Create new user
      const id = `user_${Date.now()}`;
      const newUser = {
        id,
        name,
        email,
        password,
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set admin status
      localStorage.setItem(`admin_${id}`, 'true');
      
      // Set as current user in localStorage
      localStorage.setItem('auth_user', JSON.stringify({
        id,
        displayName: name,
        email,
      }));
      
      // Notify listeners of auth state change
      authEmitter.emit('authStateChanged', {
        id,
        displayName: name,
        email,
      });
      
    } catch (error: any) {
      const errorCode = error.code || error.message;
      const errorMessage = error.message;
      console.error('Admin signup error:', errorCode, errorMessage);
      
      let userFriendlyError = 'Failed to create admin account';
      if (error.message === "Invalid admin code") {
        userFriendlyError = 'Invalid admin code';
      } else if (errorCode === 'auth/email-already-in-use') {
        userFriendlyError = 'Email already in use';
      } else if (errorCode === 'auth/invalid-email') {
        userFriendlyError = 'Invalid email address';
      } else if (errorCode === 'auth/weak-password') {
        userFriendlyError = 'Password is too weak. Please use a stronger password.';
      }
      
      setIsLoading(false);
      throw new Error(userFriendlyError);
    }
    setIsLoading(false);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Get all users from localStorage
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Find the user with matching email and password
      const user = users.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        throw new Error("auth/user-not-found");
      }
      
      // Set as current user in localStorage
      localStorage.setItem('auth_user', JSON.stringify({
        id: user.id,
        displayName: user.name,
        email: user.email,
      }));
      
      // Notify listeners of auth state change
      authEmitter.emit('authStateChanged', {
        id: user.id,
        displayName: user.name,
        email: user.email,
      });
      
    } catch (error: any) {
      const errorCode = error.code || error.message;
      const errorMessage = error.message;
      console.error('Login error:', errorCode, errorMessage);
      
      let userFriendlyError = 'Invalid email or password';
      if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
        userFriendlyError = 'Invalid email or password';
      } else if (errorCode === 'auth/too-many-requests') {
        userFriendlyError = 'Too many failed login attempts. Please try again later.';
      } else if (errorCode === 'auth/user-disabled') {
        userFriendlyError = 'This account has been disabled. Please contact support.';
      }
      
      setIsLoading(false);
      throw new Error(userFriendlyError);
    }
    setIsLoading(false);
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate Google login with a demo user
      const id = `google_user_${Date.now()}`;
      const googleUser = {
        id,
        name: 'Google User',
        email: 'google.user@example.com',
      };
      
      // Get all users from localStorage
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Check if this Google user exists (by email), if not add them
      if (!users.some(u => u.email === googleUser.email)) {
        users.push({
          ...googleUser,
          password: 'google-auth' // No real password needed for Google auth
        });
        localStorage.setItem('users', JSON.stringify(users));
      }
      
      // Set as current user in localStorage
      localStorage.setItem('auth_user', JSON.stringify({
        id,
        displayName: googleUser.name,
        email: googleUser.email,
      }));
      
      // Notify listeners of auth state change
      authEmitter.emit('authStateChanged', {
        id,
        displayName: googleUser.name,
        email: googleUser.email,
      });
      
    } catch (error: any) {
      console.error('Google login error:', error);
      setIsLoading(false);
      throw new Error('Failed to sign in with Google');
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Get all users from localStorage
      const usersJSON = localStorage.getItem('users');
      const users = usersJSON ? JSON.parse(usersJSON) : [];
      
      // Check if user with this email already exists
      if (users.some(u => u.email === email)) {
        throw new Error("auth/email-already-in-use");
      }
      
      // Create new user
      const id = `user_${Date.now()}`;
      const newUser = {
        id,
        name,
        email,
        password,
      };
      
      // Add to users array
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Set as current user in localStorage
      localStorage.setItem('auth_user', JSON.stringify({
        id,
        displayName: name,
        email,
      }));
      
      // Notify listeners of auth state change
      authEmitter.emit('authStateChanged', {
        id,
        displayName: name,
        email,
      });
      
    } catch (error: any) {
      const errorCode = error.code || error.message;
      const errorMessage = error.message;
      console.error('Signup error:', errorCode, errorMessage);
      
      let userFriendlyError = 'Failed to create account';
      if (errorCode === 'auth/email-already-in-use') {
        userFriendlyError = 'Email already in use';
      } else if (errorCode === 'auth/invalid-email') {
        userFriendlyError = 'Invalid email address';
      } else if (errorCode === 'auth/weak-password') {
        userFriendlyError = 'Password is too weak. Please use a stronger password.';
      }
      
      setIsLoading(false);
      throw new Error(userFriendlyError);
    }
    setIsLoading(false);
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      // Remove user from localStorage
      localStorage.removeItem('auth_user');
      
      // Notify listeners of auth state change
      authEmitter.emit('authStateChanged', null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      signup, 
      logout,
      loginWithGoogle,
      isAuthenticated: !!user,
      isLoading,
      verifyAdminCode,
      loginAsAdmin,
      signupAsAdmin
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 