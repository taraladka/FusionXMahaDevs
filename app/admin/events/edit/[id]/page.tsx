'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiArrowLeft, 
  FiCalendar, 
  FiClock, 
  FiMapPin, 
  FiImage, 
  FiSave, 
  FiInfo,
  FiLink
} from 'react-icons/fi';
import { useAuth, AuthProvider } from '../../../../context/AuthContext';
import Navbar from '../../../../components/Navbar';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Categories for dropdown (same as in create page)
const EVENT_CATEGORIES = [
  'Workshop',
  'Hackathon',
  'Competition',
  'Webinar',
  'Tech Talk',
  'Conference',
  'Networking',
  'Other'
];

// Updated validation schema with the new fields
const EventSchema = Yup.object().shape({
  title: Yup.string()
    .min(5, 'Title must be at least 5 characters')
    .max(100, 'Title must be less than 100 characters')
    .required('Title is required'),
  date: Yup.date()
    .required('Date is required'),
  time: Yup.string()
    .required('Time is required'),
  location: Yup.string()
    .required('Location is required'),
  description: Yup.string()
    .min(20, 'Description must be at least 20 characters')
    .required('Description is required'),
  category: Yup.string()
    .required('Category is required'),
  imageUrl: Yup.string()
    .url('Must be a valid URL')
    .required('Image URL is required'),
  additionalInfo: Yup.string()
    .min(10, 'Additional info must be at least 10 characters'),
  registrationLink: Yup.string()
    .url('Must be a valid URL')
});

// Sample event data (in a real app this would come from your API)
const sampleEvents = {
  "1": {
    id: "1",
    title: "Tech Talk",
    date: "2025-02-11",
    time: "14:30",
    location: "Main Auditorium",
    description: "Join us for an exciting tech talk about the latest advancements in artificial intelligence and machine learning. Our guest speakers will share insights about the future of technology.",
    category: "Tech Talk",
    imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=1470&auto=format&fit=crop"
  },
  "2": {
    id: "2",
    title: "Fusion X",
    date: "2025-04-04",
    time: "09:00",
    location: "Innovation Hub",
    description: "Fusion X is our annual flagship event bringing together the best minds in technology. Participate in coding challenges, attend workshops, and network with industry professionals.",
    category: "Conference",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1470&auto=format&fit=crop"
  }
};

// Edit Event Form Component
function EditEventContent({ params }) {
  const { id } = params;
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [event, setEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  
  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  // Function to toggle calendar and focus on date input
  const toggleCalendar = () => {
    if (dateInputRef.current) {
      dateInputRef.current.focus();
      dateInputRef.current.click();
    }
  };

  // Function to toggle time picker and focus on time input
  const toggleTimePicker = () => {
    if (timeInputRef.current) {
      timeInputRef.current.focus();
      timeInputRef.current.click();
    }
  };

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Fetch event data
  useEffect(() => {
    if (!id) return;

    // Fetch event from localStorage instead of using sample data
    const fetchEvent = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get events from localStorage
        const eventsJSON = localStorage.getItem('fusionEvents');
        
        if (eventsJSON) {
          const events = JSON.parse(eventsJSON);
          // Find the event with the matching ID
          const foundEvent = events.find(event => event.id === id);
          
          if (foundEvent) {
            // Ensure the event has the new fields even if they didn't exist before
            const enhancedEvent = {
              additionalInfo: '',
              registrationLink: '',
              ...foundEvent
            };
            setEvent(enhancedEvent);
          } else {
            // Fallback to sample events if not found in localStorage
            if (sampleEvents[id]) {
              const enhancedSampleEvent = {
                additionalInfo: '',
                registrationLink: '',
                ...sampleEvents[id]
              };
              setEvent(enhancedSampleEvent);
            } else {
              setError('Event not found');
            }
          }
        } else {
          // If no events in localStorage, check sample data
          if (sampleEvents[id]) {
            const enhancedSampleEvent = {
              additionalInfo: '',
              registrationLink: '',
              ...sampleEvents[id]
            };
            setEvent(enhancedSampleEvent);
          } else {
            setError('Event not found');
          }
        }
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event data');
      } finally {
        setIsLoaded(true);
      }
    };

    fetchEvent();
  }, [id]);

  // Handle form submission
  const handleSubmit = async (values, { setSubmitting }) => {
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Update the event with new values
      const updatedEvent = {
        ...values,
        id: id, // Keep the same ID
        status: event.status || "Upcoming" // Keep the same status
      };
      
      // Get all events from localStorage
      const eventsJSON = localStorage.getItem('fusionEvents');
      
      if (eventsJSON) {
        const events = JSON.parse(eventsJSON);
        
        // Replace the event with the updated one
        const updatedEvents = events.map(event => 
          event.id === id ? updatedEvent : event
        );
        
        // Save back to localStorage
        localStorage.setItem('fusionEvents', JSON.stringify(updatedEvents));
      }
      
      console.log('Event updated in localStorage:', updatedEvent);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Event updated successfully!');
      
      // Redirect to events management after 2 seconds
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !isLoaded) {
    return (
      <div className="min-h-screen flex flex-col bg-dark text-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  // If user is not admin or not logged in, don't render anything (redirect will happen from useEffect)
  if (!user || !user.isAdmin) {
    return null;
  }

  // If event not found
  if (!event) {
    return (
      <div className="min-h-screen flex flex-col bg-dark text-white">
        <Navbar />
        <div className="flex-grow content-container">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-6 flex items-center">
              <Link href="/admin/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors mr-4">
                <FiArrowLeft className="h-5 w-5 mr-1" />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-2xl font-bold text-white">Edit Event</h1>
            </div>

            <div className="glass-card p-6 rounded-lg shadow-custom">
              <div className="p-4 bg-red-900/50 border border-red-500 rounded-md text-white">
                Event not found. The event may have been deleted or you don't have permission to edit it.
              </div>
              <div className="mt-4">
                <Link href="/admin/dashboard" className="btn-primary inline-flex items-center">
                  <FiArrowLeft className="mr-2 h-5 w-5" />
                  Return to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <div className="flex-grow content-container">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6 flex items-center">
            <Link href="/admin/dashboard" className="flex items-center text-gray-400 hover:text-white transition-colors mr-4">
              <FiArrowLeft className="h-5 w-5 mr-1" />
              <span>Back to Dashboard</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">Edit Event: {event.title}</h1>
          </div>

          <div className="glass-card p-6 rounded-lg shadow-custom">
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-md text-white">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-md text-white">
                {success}
              </div>
            )}

            <Formik
              initialValues={{
                title: event.title,
                date: event.date,
                time: event.time,
                location: event.location,
                description: event.description,
                category: event.category,
                imageUrl: event.imageUrl,
                additionalInfo: event.additionalInfo || '',
                registrationLink: event.registrationLink || ''
              }}
              validationSchema={EventSchema}
              onSubmit={handleSubmit}
            >
              {({ isValid, dirty, errors, touched }) => (
                <Form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div className="col-span-2">
                      <label htmlFor="title" className="form-label">Event Title</label>
                      <Field 
                        id="title" 
                        name="title" 
                        type="text" 
                        className="form-input"
                        placeholder="Enter a catchy title for your event" 
                      />
                      <ErrorMessage name="title" component="div" className="form-error" />
                    </div>

                    {/* Date */}
                    <div>
                      <label htmlFor="date" className="form-label flex items-center">
                        <FiCalendar className="mr-2 h-4 w-4 text-primary" />
                        Event Date
                      </label>
                      <div className="relative flex items-center">
                        <Field 
                          id="date" 
                          name="date" 
                          type="date" 
                          className="form-input pr-10"
                          ref={dateInputRef}
                        />
                        <button 
                          type="button" 
                          className="absolute right-2 text-primary hover:text-primary/80"
                          onClick={toggleCalendar}
                        >
                          <FiCalendar className="h-5 w-5" />
                        </button>
                      </div>
                      <ErrorMessage name="date" component="div" className="form-error" />
                    </div>

                    {/* Time */}
                    <div>
                      <label htmlFor="time" className="form-label flex items-center">
                        <FiClock className="mr-2 h-4 w-4 text-primary" />
                        Event Time
                      </label>
                      <div className="relative flex items-center">
                        <Field 
                          id="time" 
                          name="time" 
                          type="time" 
                          className="form-input pr-10"
                          ref={timeInputRef}
                        />
                        <button 
                          type="button" 
                          className="absolute right-2 text-primary hover:text-primary/80"
                          onClick={toggleTimePicker}
                        >
                          <FiClock className="h-5 w-5" />
                        </button>
                      </div>
                      <ErrorMessage name="time" component="div" className="form-error" />
                    </div>

                    {/* Location */}
                    <div>
                      <label htmlFor="location" className="form-label flex items-center">
                        <FiMapPin className="mr-2 h-4 w-4 text-primary" />
                        Location
                      </label>
                      <Field 
                        id="location" 
                        name="location" 
                        type="text" 
                        className="form-input"
                        placeholder="Online or physical location" 
                      />
                      <ErrorMessage name="location" component="div" className="form-error" />
                    </div>

                    {/* Category */}
                    <div>
                      <label htmlFor="category" className="form-label">Category</label>
                      <Field 
                        as="select"
                        id="category" 
                        name="category"
                        className="form-input"
                      >
                        <option value="">Select a category</option>
                        {EVENT_CATEGORIES.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component="div" className="form-error" />
                    </div>

                    {/* Registration Link */}
                    <div className="col-span-2">
                      <label htmlFor="registrationLink" className="form-label flex items-center">
                        <FiLink className="mr-2 h-4 w-4 text-primary" />
                        Registration Form Link (Google Form)
                      </label>
                      <Field 
                        id="registrationLink" 
                        name="registrationLink" 
                        type="text" 
                        className="form-input"
                        placeholder="https://forms.google.com/..." 
                      />
                      <p className="text-xs text-gray-400 mt-1">This link will be used when users click "Register Now" for your event</p>
                      <ErrorMessage name="registrationLink" component="div" className="form-error" />
                    </div>

                    {/* Image URL */}
                    <div className="col-span-2">
                      <label htmlFor="imageUrl" className="form-label flex items-center">
                        <FiImage className="mr-2 h-4 w-4 text-primary" />
                        Event Image URL
                      </label>
                      <Field 
                        id="imageUrl" 
                        name="imageUrl" 
                        type="text" 
                        className="form-input"
                        placeholder="https://example.com/image.jpg" 
                      />
                      <ErrorMessage name="imageUrl" component="div" className="form-error" />
                    </div>

                    {/* Description */}
                    <div className="col-span-2">
                      <label htmlFor="description" className="form-label">Event Description</label>
                      <Field 
                        as="textarea"
                        id="description" 
                        name="description" 
                        rows="6"
                        className="form-input"
                        placeholder="Describe your event in detail" 
                      />
                      <ErrorMessage name="description" component="div" className="form-error" />
                    </div>

                    {/* Additional Info (i button content) */}
                    <div className="col-span-2">
                      <label htmlFor="additionalInfo" className="form-label flex items-center">
                        <FiInfo className="mr-2 h-4 w-4 text-primary" />
                        Additional Info (shown when users click the Info button)
                      </label>
                      <Field 
                        as="textarea"
                        id="additionalInfo" 
                        name="additionalInfo" 
                        rows="4"
                        className="form-input"
                        placeholder="Add any extra information that will be displayed when users click the info (i) button" 
                      />
                      <p className="text-xs text-gray-400 mt-1">This could include prerequisites, materials needed, or special instructions</p>
                      <ErrorMessage name="additionalInfo" component="div" className="form-error" />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      className={`btn-primary flex items-center px-6 ${isSubmitting || !isValid ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      <FiSave className="mr-2 h-5 w-5" />
                      {isSubmitting ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with AuthProvider
export default function EditEvent({ params }) {
  return (
    <AuthProvider>
      <EditEventContent params={params} />
    </AuthProvider>
  );
} 