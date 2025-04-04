import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { User } from '../types';

// Admin code for registration
const ADMIN_CODE = "fusion2023";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, isAdmin?: boolean, adminCode?: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set up auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoading(true);
      if (firebaseUser) {
        // Check local storage for admin status
        const isAdmin = localStorage.getItem(`admin_${firebaseUser.uid}`) === 'true';
        
        // User is signed in
        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          isAdmin: isAdmin
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

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // No need to manually set user state as the onAuthStateChanged listener will handle it
    } catch (error: any) {
      const errorCode = error.code;
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
  };

  const loginWithGoogle = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      // Add scopes for better profile access
      provider.addScope('https://www.googleapis.com/auth/userinfo.email');
      provider.addScope('https://www.googleapis.com/auth/userinfo.profile');
      
      // Set custom parameters for better UX
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      // The signed-in user info is in result.user
      // No need to manually set user state as the onAuthStateChanged listener will handle it
    } catch (error: any) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error('Google login error:', errorCode, errorMessage, error);
      
      let userFriendlyError = 'Failed to sign in with Google';
      if (errorCode === 'auth/popup-closed-by-user') {
        userFriendlyError = 'Sign-in popup was closed before completing the sign-in.';
      } else if (errorCode === 'auth/popup-blocked') {
        userFriendlyError = 'Sign-in popup was blocked by the browser. Please allow popups for this site.';
      } else if (errorCode === 'auth/account-exists-with-different-credential') {
        userFriendlyError = 'An account already exists with the same email address but different sign-in credentials.';
      } else if (errorCode === 'auth/cancelled-popup-request') {
        userFriendlyError = 'The popup has been closed by another popup request.';
      } else if (errorCode === 'auth/unauthorized-domain') {
        userFriendlyError = 'This domain is not authorized for OAuth operations. Add your domain in the Firebase console.';
      }
      
      setIsLoading(false);
      throw new Error(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string, isAdmin: boolean = false, adminCode: string = ''): Promise<void> => {
    setIsLoading(true);
    try {
      // Verify admin code if attempting to register as admin
      if (isAdmin) {
        if (adminCode !== ADMIN_CODE) {
          throw new Error('Invalid admin code');
        }
      }
      
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with their name
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // Store admin status in local storage if admin registration
        if (isAdmin) {
          localStorage.setItem(`admin_${userCredential.user.uid}`, 'true');
        }
        
        // Force refresh the user to get the updated displayName
        // The onAuthStateChanged listener should pick up the change
      }
    } catch (error: any) {
      const errorCode = error.code;
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
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // No need to manually set user state as the onAuthStateChanged listener will handle it
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
      isLoading
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