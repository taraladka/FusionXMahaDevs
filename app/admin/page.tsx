'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiUsers, FiCalendar, FiMessageSquare, FiPlusCircle } from 'react-icons/fi';
import Navbar from '@/app/components/Navbar';
import { useAuth } from '@/app/context/AuthContext';
import { User, Event, Feedback } from '@/app/types';

export default function AdminDashboard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('events');
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);

  // Check if user is admin, if not redirect to home
  useEffect(() => {
    if (!isLoading && user) {
      if (!user.isAdmin) {
        router.push('/');
      }
    } else if (!isLoading && !user) {
      router.push('/auth?action=login&redirect=/admin');
    }
  }, [user, isLoading, router]);

  // Load mock data for now - in a real app would fetch from Firebase
  useEffect(() => {
    if (user?.isAdmin) {
      // Mock data
      setEvents([
        {
          id: '1',
          title: 'Introduction to Web Development',
          date: '2023-09-15',
          time: '10:00 AM',
          location: 'Room 101',
          description: 'Learn the basics of web development with HTML, CSS, and JavaScript.',
          image: '/images/events/web-dev.jpg',
          capacity: 30,
          registeredUsers: 15
        },
        {
          id: '2',
          title: 'Advanced React Workshop',
          date: '2023-09-22',
          time: '2:00 PM',
          location: 'Room 202',
          description: 'Deep dive into advanced React concepts like hooks, context, and performance optimization.',
          image: '/images/events/react.jpg',
          capacity: 20,
          registeredUsers: 18
        }
      ]);
      
      setUsers([
        {
          uid: '1',
          email: 'user1@example.com',
          displayName: 'User One',
          isAdmin: false
        },
        {
          uid: '2',
          email: 'admin@example.com',
          displayName: 'Admin User',
          isAdmin: true
        }
      ]);
      
      setFeedback([
        {
          id: '1',
          userId: '1',
          name: 'User One',
          email: 'user1@example.com',
          message: 'Great workshop! Learned a lot.',
          createdAt: '2023-09-16'
        },
        {
          id: '2',
          userId: null,
          name: 'Anonymous',
          email: 'anon@example.com',
          message: 'Would love to see more AI workshops.',
          createdAt: '2023-09-17'
        }
      ]);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark text-white flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-dark text-white flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="glass-card p-6 rounded-xl shadow-custom-lg mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-gray-300">
            Welcome back, {user.displayName}. Manage your club's content here.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-6 py-3 focus:outline-none ${
              activeTab === 'events'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('events')}
          >
            <div className="flex items-center">
              <FiCalendar className="mr-2" />
              Events
            </div>
          </button>
          <button
            className={`px-6 py-3 focus:outline-none ${
              activeTab === 'users'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('users')}
          >
            <div className="flex items-center">
              <FiUsers className="mr-2" />
              Users
            </div>
          </button>
          <button
            className={`px-6 py-3 focus:outline-none ${
              activeTab === 'feedback'
                ? 'text-primary border-b-2 border-primary font-medium'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            <div className="flex items-center">
              <FiMessageSquare className="mr-2" />
              Feedback
            </div>
          </button>
        </div>
        
        {/* Content based on active tab */}
        <div className="glass-card p-6 rounded-xl shadow-custom-lg">
          {activeTab === 'events' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Events</h2>
                <button className="glass-button-primary py-2 px-4 rounded-md flex items-center">
                  <FiPlusCircle className="mr-2" />
                  Add Event
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Capacity
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{event.title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{event.date} {event.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{event.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">
                            {event.registeredUsers}/{event.capacity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark mr-3">
                            Edit
                          </button>
                          <button className="text-red-500 hover:text-red-400">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Manage Users</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.uid}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">{user.displayName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isAdmin ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {user.isAdmin ? 'Admin' : 'Member'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary hover:text-primary-dark mr-3">
                            {user.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {activeTab === 'feedback' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">User Feedback</h2>
              </div>
              
              <div className="space-y-6">
                {feedback.map((item) => (
                  <div key={item.id} className="p-4 border border-gray-700 rounded-lg">
                    <div className="flex justify-between">
                      <h3 className="font-medium">{item.name}</h3>
                      <span className="text-gray-400 text-sm">{item.createdAt}</span>
                    </div>
                    <div className="text-gray-300 text-sm mb-2">{item.email}</div>
                    <p className="text-gray-200">{item.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 