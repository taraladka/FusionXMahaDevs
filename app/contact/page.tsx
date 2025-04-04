'use client';

import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiMail, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare, FiCheck } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { AuthProvider, useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Link from 'next/link';
import Image from 'next/image';

// Validation schema
const FeedbackSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  message: Yup.string().required('Message is required').min(10, 'Message is too short (minimum 10 characters)'),
});

const Contact = () => {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (values: any, { resetForm }: any) => {
    // In a real app, this would call an API to send the feedback to fusionclubcgc@gmail.com
    console.log('Feedback submitted to fusionclubcgc@gmail.com:', values);
    
    // TODO: Implement actual email sending functionality to fusionclubcgc@gmail.com
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    resetForm();
    setIsSubmitted(true);
    
    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <main className="flex-grow content-container">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-dark"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"%3E%3Ccircle cx="20" cy="20" r="2"/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '24px 24px'
            }}
          ></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient animate-fadeIn">Get in Touch</h1>
              <p className="text-xl text-gray-300 mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                Have questions or feedback? We'd love to hear from you!
              </p>
              
              {user && (
                <div className="flex flex-wrap gap-4 mb-8 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <a 
                    href="https://chat.whatsapp.com/EDQKvCG2ZqMJcdea22iJsG" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-dark flex items-center justify-center"
                  >
                    <FaWhatsapp className="mr-2" />
                    Join the Community
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Contact Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="card card-hover flex flex-col items-center text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                  <FiMail className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Email</h3>
                <p className="text-gray-300 mb-4">Have a question? Reach out to us.</p>
                <a 
                  href="mailto:fusionclubcgc@gmail.com" 
                  className="text-primary font-medium hover:text-primary/80 transition-colors flex items-center group"
                >
                  fusionclubcgc@gmail.com
                  <FiSend className="ml-2 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
              
              <div className="card card-hover flex flex-col items-center text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                  <FiMapPin className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Location</h3>
                <p className="text-gray-300 mb-4">Find us on campus at the Tech Hub.</p>
                <p className="text-primary font-medium">Building 5, Room 303</p>
              </div>
              
              <div className="card card-hover flex flex-col items-center text-center p-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                  <FiClock className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Club Hours</h3>
                <p className="text-gray-300 mb-4">When we're available on campus.</p>
                <p className="text-primary font-medium">Mon-Fri: 2PM-6PM</p>
              </div>
            </div>
            
            {/* Feedback Form */}
            <div className="grid md:grid-cols-5 gap-8 items-start">
              <div className="md:col-span-2">
                <div className="sticky top-24">
                  <h2 className="text-2xl font-bold mb-4 text-white">Get in Touch</h2>
                  <div className="h-1 w-20 bg-primary rounded-full mb-6"></div>
                  <p className="text-gray-300 mb-6">
                    We'd love to hear from you! Whether you have a question about our events, want to join the club, or have a suggestion for us, fill out the form and we'll get back to you as soon as possible.
                  </p>
                  <div className="mb-8">
                    <Image 
                      src="/pictures/fusion logo.png"
                      alt="Fusion Logo"
                      width={150}
                      height={150}
                      className="opacity-80"
                    />
                  </div>
                  <div className="text-gray-400 text-sm">
                    <p>Your feedback helps us improve our club and better serve our community.</p>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-3">
                <div className="bg-darkergray rounded-lg shadow-custom-lg overflow-hidden border border-gray-800">
                  <div className="p-8">
                    {isSubmitted && (
                      <div className="mb-8 p-4 bg-green-900/20 border border-green-800 text-green-300 rounded-md">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <FiCheck className="h-5 w-5 text-green-400" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium">
                              Thank you for your feedback! We'll get back to you soon.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <Formik
                      initialValues={{
                        name: user ? user.name : '',
                        email: user ? user.email : '',
                        message: '',
                      }}
                      validationSchema={FeedbackSchema}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting, touched, errors }) => (
                        <Form className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label htmlFor="name" className="form-label">
                                Your Name
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FiUser className="h-5 w-5 text-gray-400" />
                                </div>
                                <Field
                                  type="text"
                                  name="name"
                                  className={`form-input pl-10 ${touched.name && errors.name ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                  placeholder="John Doe"
                                />
                              </div>
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="form-error"
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="email" className="form-label">
                                Email Address
                              </label>
                              <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                  <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <Field
                                  type="email"
                                  name="email"
                                  className={`form-input pl-10 ${touched.email && errors.email ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                  placeholder="your@email.com"
                                />
                              </div>
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="form-error"
                              />
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="message" className="form-label">
                              Message
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pt-2.5 pl-3 flex items-start pointer-events-none">
                                <FiMessageSquare className="h-5 w-5 text-gray-400" />
                              </div>
                              <Field
                                as="textarea"
                                name="message"
                                rows={5}
                                className={`form-input pl-10 ${touched.message && errors.message ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}`}
                                placeholder="How can we help you?"
                              />
                            </div>
                            <ErrorMessage
                              name="message"
                              component="div"
                              className="form-error"
                            />
                          </div>
                          
                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex justify-center items-center py-3 px-6 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300 shadow-md"
                            >
                              {isSubmitting ? (
                                <>
                                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <FiSend className="mr-2" />
                                  Send Message
                                </>
                              )}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-darkergray py-12 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Image
                  src="/pictures/fusion logo.png"
                  alt="Fusion Logo"
                  width={40}
                  height={40}
                  className="mr-3"
                />
                <span className="text-xl font-bold text-white">Fusion</span>
              </div>
              <p className="text-gray-400 max-w-md mb-4">
                The premier technical club at our college, dedicated to fostering innovation and building tomorrow's tech leaders.
              </p>
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Fusion Technical Club. All rights reserved.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="text-gray-400 hover:text-primary transition-colors duration-300">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/events" className="text-gray-400 hover:text-primary transition-colors duration-300">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-primary transition-colors duration-300">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-white font-semibold mb-4">Contact Info</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">
                    Building 5, Room 303
                  </li>
                  <li>
                    <a href="mailto:fusionclubcgc@gmail.com" className="text-gray-400 hover:text-primary transition-colors duration-300">
                      fusionclubcgc@gmail.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const ContactWithProvider = () => (
  <AuthProvider>
    <Contact />
  </AuthProvider>
);

export default ContactWithProvider; 