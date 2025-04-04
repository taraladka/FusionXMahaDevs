'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiUser, FiEdit, FiCalendar, FiMail, FiShield } from 'react-icons/fi';
import { useAuth, AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

function ProfileContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  // If not authenticated and not loading, redirect to login
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = '/auth?redirect=/profile';
    }
  }, [isLoading, isAuthenticated]);

  const initialValues = {
    name: user?.name || '',
    email: user?.email || '',
    bio: 'Fusion Club Member',
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    bio: Yup.string().max(200, 'Bio must be 200 characters or less'),
  });

  const handleSubmit = (values: any) => {
    // In a real app, you would save the profile changes to the backend
    console.log('Profile updated:', values);
    setEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your profile</h1>
        <Link href="/auth?redirect=/profile" className="btn-primary">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <main className="flex-grow content-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-darkgray rounded-lg shadow-custom overflow-hidden border border-gray-800">
            {/* Profile Header */}
            <div className="relative h-48 bg-gradient-to-r from-primary/30 to-secondary/30">
              <div className="absolute left-0 right-0 -bottom-16 flex justify-center">
                <div className="h-32 w-32 rounded-full bg-darkgray border-4 border-darkgray shadow-lg overflow-hidden">
                  <div className="h-full w-full bg-darkergray flex items-center justify-center">
                    <FiUser className="h-16 w-16 text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Profile Content */}
            <div className="mt-20 px-4 pb-6">
              {/* Profile Tabs */}
              <div className="flex justify-center mb-8 border-b border-gray-800">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-4 py-3 flex items-center ${activeTab === 'profile' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FiUser className="mr-2" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`px-4 py-3 flex items-center ${activeTab === 'events' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FiCalendar className="mr-2" />
                  <span>My Events</span>
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`px-4 py-3 flex items-center ${activeTab === 'security' ? 'text-primary border-b-2 border-primary' : 'text-gray-400 hover:text-white'}`}
                >
                  <FiShield className="mr-2" />
                  <span>Security</span>
                </button>
              </div>
              
              {/* Profile Tab Content */}
              {activeTab === 'profile' && (
                <div className="max-w-2xl mx-auto">
                  {!editMode ? (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <h1 className="text-2xl font-bold">{user.name}</h1>
                        <p className="text-gray-400">Fusion Club Member</p>
                      </div>
                      
                      <div className="bg-darkergray rounded-lg p-6 border border-gray-800">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">Profile Information</h2>
                          <button
                            onClick={() => setEditMode(true)}
                            className="flex items-center text-primary hover:text-primary/80 text-sm"
                          >
                            <FiEdit className="mr-1" /> Edit
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <FiUser className="mt-1 mr-3 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Full Name</p>
                              <p>{user.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiMail className="mt-1 mr-3 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Email</p>
                              <p>{user.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <FiUser className="mt-1 mr-3 text-gray-400" />
                            <div>
                              <p className="text-sm text-gray-400">Bio</p>
                              <p>Fusion Club Member</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-darkergray rounded-lg p-6 border border-gray-800">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Edit Profile</h2>
                        <button
                          onClick={() => setEditMode(false)}
                          className="text-gray-400 hover:text-white text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                      
                      <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ isSubmitting }) => (
                          <Form className="space-y-4">
                            <div>
                              <label htmlFor="name" className="form-label">Full Name</label>
                              <Field
                                id="name"
                                name="name"
                                type="text"
                                className="form-input"
                              />
                              <ErrorMessage name="name" component="div" className="form-error" />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="form-label">Email</label>
                              <Field
                                id="email"
                                name="email"
                                type="email"
                                className="form-input"
                              />
                              <ErrorMessage name="email" component="div" className="form-error" />
                            </div>
                            
                            <div>
                              <label htmlFor="bio" className="form-label">Bio</label>
                              <Field
                                id="bio"
                                name="bio"
                                as="textarea"
                                rows={3}
                                className="form-input resize-none"
                              />
                              <ErrorMessage name="bio" component="div" className="form-error" />
                            </div>
                            
                            <div className="flex justify-end mt-6">
                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="btn-primary"
                              >
                                Save Changes
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}
                </div>
              )}
              
              {/* Events Tab Content */}
              {activeTab === 'events' && (
                <div className="max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">My Events</h1>
                    <p className="text-gray-400">Events you've registered for</p>
                  </div>
                  
                  <div className="bg-darkergray rounded-lg p-6 border border-gray-800 text-center">
                    <div className="py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                        <FiCalendar className="h-8 w-8" />
                      </div>
                      <h3 className="text-xl font-medium text-white mb-2">No events yet</h3>
                      <p className="text-gray-300 max-w-md mx-auto mb-6">
                        You haven't registered for any events yet. Explore our events page to find interesting events.
                      </p>
                      <Link href="/events" className="btn-primary">
                        Browse Events
                      </Link>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Security Tab Content */}
              {activeTab === 'security' && (
                <div className="max-w-2xl mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold mb-2">Security Settings</h1>
                    <p className="text-gray-400">Manage your account security</p>
                  </div>
                  
                  <div className="bg-darkergray rounded-lg p-6 border border-gray-800">
                    <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          id="currentPassword"
                          type="password"
                          className="form-input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          id="newPassword"
                          type="password"
                          className="form-input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          id="confirmPassword"
                          type="password"
                          className="form-input"
                        />
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <button
                          type="button"
                          className="btn-primary"
                        >
                          Update Password
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthProvider>
      <ProfileContent />
    </AuthProvider>
  );
} 