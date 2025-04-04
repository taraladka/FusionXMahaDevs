'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  FiUsers, 
  FiCalendar, 
  FiMessageSquare, 
  FiHome, 
  FiSettings,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiAlertCircle
} from 'react-icons/fi';
import { useAuth, AuthProvider } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';

type AdminTab = 'overview' | 'events' | 'users' | 'feedback' | 'settings';

// Sample event data (fallback if no events in localStorage)
const sampleEvents = [
  {
    id: "1",
    title: "Tech Talk",
    date: "Feb 11, 2025",
    status: "Upcoming"
  },
  {
    id: "2",
    title: "Fusion X",
    date: "Apr 4, 2025",
    status: "Upcoming"
  }
];

// Admin Dashboard Content Component
function AdminDashboardContent() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [events, setEvents] = useState([]);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load events from localStorage when component mounts
  useEffect(() => {
    const loadEvents = () => {
      try {
        // Try to get events from localStorage
        const eventsJSON = localStorage.getItem('fusionEvents');
        
        if (eventsJSON) {
          // If events exist in localStorage, use them
          const loadedEvents = JSON.parse(eventsJSON);
          setEvents(loadedEvents);
        } else {
          // If no events in localStorage, use sample data
          setEvents(sampleEvents);
          // Initialize localStorage with sample data
          localStorage.setItem('fusionEvents', JSON.stringify(sampleEvents));
        }
      } catch (error) {
        console.error('Error loading events from localStorage:', error);
        // Fallback to sample data if there's an error
        setEvents(sampleEvents);
      } finally {
        setIsLoaded(true);
      }
    };

    // Only load events if we're in a browser environment (not during SSR)
    if (typeof window !== 'undefined') {
      loadEvents();
    }
  }, []);

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  // Handle event deletion
  const handleDeleteEvent = (eventId: string) => {
    try {
      // Filter out the deleted event
      const updatedEvents = events.filter(event => event.id !== eventId);
      
      // Update state
      setEvents(updatedEvents);
      
      // Update localStorage
      localStorage.setItem('fusionEvents', JSON.stringify(updatedEvents));
      
      // Clear confirmation dialog
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting event:', error);
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

  // Format date for display
  const formatEventDate = (dateStr) => {
    // If the date is already in a display format (e.g., "Feb 11, 2025"), return as is
    if (dateStr.includes(',')) return dateStr;
    
    // Otherwise, try to parse and format it
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      // Return original if can't parse
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <div className="flex-grow content-container">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:space-x-8">
            {/* Sidebar */}
            <div className="w-full md:w-64 mb-6 md:mb-0">
              <div className="glass-dark p-4 rounded-lg shadow-custom">
                <h2 className="text-lg font-semibold mb-6 text-primary border-b border-gray-700 pb-2">Admin Dashboard</h2>
                
                <nav className="space-y-2">
                  <button 
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'overview' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-darkgray hover:text-white'} transition-colors`}
                  >
                    <FiHome className="mr-3 h-5 w-5" />
                    Overview
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('events')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'events' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-darkgray hover:text-white'} transition-colors`}
                  >
                    <FiCalendar className="mr-3 h-5 w-5" />
                    Manage Events
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('users')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'users' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-darkgray hover:text-white'} transition-colors`}
                  >
                    <FiUsers className="mr-3 h-5 w-5" />
                    Manage Users
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('feedback')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'feedback' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-darkgray hover:text-white'} transition-colors`}
                  >
                    <FiMessageSquare className="mr-3 h-5 w-5" />
                    Feedback
                  </button>
                  
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${activeTab === 'settings' ? 'bg-primary/20 text-primary' : 'text-gray-300 hover:bg-darkgray hover:text-white'} transition-colors`}
                  >
                    <FiSettings className="mr-3 h-5 w-5" />
                    Settings
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="flex-1">
              <div className="glass-card p-6 rounded-lg shadow-custom">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="glass-dark p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Total Users</p>
                            <h3 className="text-2xl font-bold text-white">23</h3>
                          </div>
                          <div className="bg-primary/20 p-3 rounded-full">
                            <FiUsers className="h-6 w-6 text-primary" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-dark p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Upcoming Events</p>
                            <h3 className="text-2xl font-bold text-white">{events.length}</h3>
                          </div>
                          <div className="bg-green-500/20 p-3 rounded-full">
                            <FiCalendar className="h-6 w-6 text-green-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="glass-dark p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-400">Feedback Messages</p>
                            <h3 className="text-2xl font-bold text-white">7</h3>
                          </div>
                          <div className="bg-blue-500/20 p-3 rounded-full">
                            <FiMessageSquare className="h-6 w-6 text-blue-500" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-4 text-white">Recent Activity</h3>
                    <div className="glass-dark rounded-lg divide-y divide-gray-800">
                      <div className="p-4">
                        <p className="text-sm text-gray-300">New user registered: <span className="text-primary font-medium">john.doe@example.com</span></p>
                        <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-300">Feedback received from: <span className="text-primary font-medium">sarah@example.com</span></p>
                        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                      </div>
                      <div className="p-4">
                        <p className="text-sm text-gray-300">New event created: <span className="text-primary font-medium">{events[0]?.title || 'Tech Talk'}</span></p>
                        <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'events' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-white">Manage Events</h2>
                      <Link 
                        href="/admin/events/create" 
                        className="btn-primary flex items-center"
                      >
                        <FiPlusCircle className="mr-2 h-5 w-5" />
                        Add Event
                      </Link>
                    </div>
                    
                    {events.length === 0 ? (
                      <div className="text-center py-10">
                        <FiCalendar className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">No Events Found</h3>
                        <p className="text-gray-400 max-w-md mx-auto">You haven't created any events yet. Click the "Add Event" button to create your first event.</p>
                      </div>
                    ) : (
                      <div className="glass-dark rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-800">
                          <thead className="bg-darkergray">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Event</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-800">
                            {events.map((event) => (
                              <tr key={event.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-white">{event.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm text-gray-400">{formatEventDate(event.date)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{event.status}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                  {deleteConfirm === event.id ? (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-red-500 mr-2">Delete?</span>
                                      <button 
                                        onClick={() => handleDeleteEvent(event.id)} 
                                        className="text-white bg-red-600 hover:bg-red-700 px-2 py-1 rounded-md text-xs"
                                      >
                                        Yes
                                      </button>
                                      <button 
                                        onClick={() => setDeleteConfirm(null)} 
                                        className="text-white bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded-md text-xs"
                                      >
                                        No
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex space-x-2">
                                      <Link 
                                        href={`/admin/events/edit/${event.id}`}
                                        className="text-blue-500 hover:text-blue-400"
                                      >
                                        <FiEdit className="h-5 w-5" />
                                      </Link>
                                      <button 
                                        onClick={() => setDeleteConfirm(event.id)} 
                                        className="text-red-500 hover:text-red-400"
                                      >
                                        <FiTrash2 className="h-5 w-5" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === 'users' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Manage Users</h2>
                    <p className="text-gray-400 mb-4">This page would allow admins to manage user accounts.</p>
                    
                    <div className="p-12 text-center">
                      <FiUsers className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">User Management Coming Soon</h3>
                      <p className="text-gray-400 max-w-md mx-auto">This feature is currently under development.</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'feedback' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Feedback Management</h2>
                    <p className="text-gray-400 mb-4">View and respond to user feedback.</p>
                    
                    <div className="p-12 text-center">
                      <FiMessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Feedback Management Coming Soon</h3>
                      <p className="text-gray-400 max-w-md mx-auto">This feature is currently under development.</p>
                    </div>
                  </div>
                )}
                
                {activeTab === 'settings' && (
                  <div>
                    <h2 className="text-2xl font-bold mb-6 text-white">Settings</h2>
                    <p className="text-gray-400 mb-4">Manage admin settings and preferences.</p>
                    
                    <div className="p-12 text-center">
                      <FiSettings className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-white mb-2">Settings Panel Coming Soon</h3>
                      <p className="text-gray-400 max-w-md mx-auto">This feature is currently under development.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wrap with AuthProvider
export default function AdminDashboard() {
  return (
    <AuthProvider>
      <AdminDashboardContent />
    </AuthProvider>
  );
} 