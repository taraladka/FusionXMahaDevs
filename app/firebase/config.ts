// Import the functions you need from the SDKs you need
// Local storage based auth implementation
import { EventEmitter } from 'events';

// Create a simple user auth emitter to replace Firebase's auth state changes
export const authEmitter = new EventEmitter();

// Fake auth object to simulate Firebase auth
export const auth = {
  currentUser: null,
  onAuthStateChanged: (callback) => {
    // Initial callback with current user
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      try {
        auth.currentUser = JSON.parse(storedUser);
        callback(auth.currentUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        auth.currentUser = null;
        callback(null);
      }
    } else {
      callback(null);
    }

    // Setup listener for future changes
    const unsubscribe = (event) => {
      authEmitter.removeListener('authStateChanged', listener);
    };

    const listener = (user) => {
      auth.currentUser = user;
      callback(user);
    };

    authEmitter.on('authStateChanged', listener);
    return unsubscribe;
  }
};

// Export empty app to maintain compatibility
export const app = {};

// Mock Firebase analytics function
export const getFirebaseAnalytics = () => null; 