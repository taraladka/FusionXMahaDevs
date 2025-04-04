'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiUser, FiMail, FiLock, FiLogIn, FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';
import { useAuth, AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';

// Validation schemas
const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Required'),
});

function AuthPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const action = searchParams.get('action');
  const redirectTo = searchParams.get('redirect') || '/events';
  
  const { login, signup, loginWithGoogle, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Update isLogin based on action from URL params
  useEffect(() => {
    setIsLogin(action !== 'signup');
  }, [action]);

  const handleSubmit = async (values: any, { setSubmitting, setStatus }: any) => {
    try {
      setAuthError(null);
      if (isLogin) {
        await login(values.email, values.password);
      } else {
        await signup(values.name, values.email, values.password);
      }
      router.push(redirectTo);
    } catch (error: any) {
      // Firebase errors are already handled in the auth context
      setStatus({ error: error.message });
      setAuthError(error.message);
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setAuthError(null);
      await loginWithGoogle();
      router.push(redirectTo);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary opacity-10 rounded-full blur-3xl"></div>
        
        <div className="glass-card max-w-md w-full space-y-8 p-8 rounded-xl shadow-custom-lg relative z-10">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          )}
          
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-300">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
          
          {/* Google Sign In Button */}
          <div className="mt-6">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="glass-button group relative w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
            >
              <span className="flex items-center">
                <FcGoogle className="h-5 w-5 mr-2" />
                {isLogin ? 'Sign in with Google' : 'Sign up with Google'}
              </span>
            </button>
          </div>
          
          {/* Divider */}
          <div className="mt-6 flex items-center justify-center">
            <div className="w-full border-t border-white/10"></div>
            <div className="px-3 text-sm text-gray-400 bg-transparent relative z-10">or</div>
            <div className="w-full border-t border-white/10"></div>
          </div>

          {/* Display Auth Error */}
          {authError && (
            <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/50 text-red-400 px-4 py-3 rounded-md mt-6">
              {authError}
            </div>
          )}
          
          <Formik
            initialValues={
              isLogin
                ? { email: '', password: '' }
                : { name: '', email: '', password: '', confirmPassword: '' }
            }
            validationSchema={isLogin ? LoginSchema : SignupSchema}
            onSubmit={(values, helpers) => handleSubmit(values, helpers)}
            enableReinitialize
          >
            {({ isSubmitting, status }) => (
              <Form className="mt-8 space-y-6">
                {status && status.error && !authError && (
                  <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded mb-4">
                    {status.error}
                  </div>
                )}
              
                {!isLogin && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                      Full Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiUser className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type="text"
                        name="name"
                        className="glass-input pl-10 w-full py-2.5 rounded-md"
                        placeholder="John Doe"
                      />
                    </div>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email address
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiMail className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type="email"
                      name="email"
                      className="glass-input pl-10 w-full py-2.5 rounded-md"
                      placeholder="your@email.com"
                    />
                  </div>
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="glass-input pl-10 pr-10 w-full py-2.5 rounded-md"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-white focus:outline-none"
                      >
                        {showPassword ? (
                          <FiEyeOff className="h-5 w-5" />
                        ) : (
                          <FiEye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="mt-1 text-sm text-red-500"
                  />
                </div>
                
                {!isLogin && (
                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FiLock className="h-5 w-5 text-gray-400" />
                      </div>
                      <Field
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        className="glass-input pl-10 pr-10 w-full py-2.5 rounded-md"
                        placeholder="••••••••"
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-white focus:outline-none"
                        >
                          {showConfirmPassword ? (
                            <FiEyeOff className="h-5 w-5" />
                          ) : (
                            <FiEye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="mt-1 text-sm text-red-500"
                    />
                  </div>
                )}
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="glass-button-primary group relative w-full flex justify-center py-2.5 px-4 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300"
                  >
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      {isLogin ? (
                        <FiLogIn className="h-5 w-5 text-white" />
                      ) : (
                        <FiUserPlus className="h-5 w-5 text-white" />
                      )}
                    </span>
                    {isLogin ? 'Sign in' : 'Sign up'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <AuthProvider>
      <AuthPageContent />
    </AuthProvider>
  );
} 