'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import Navbar from '../components/Navbar';

export default function AdminPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);

  useEffect(() => {
    // Redirect non-admin users
    if (!isLoading && (!user || !user.isAdmin)) {
      router.push('/auth');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    // Load users (mocked for now)
    setIsLoadingUsers(true);
    
    // In a real app, this would be an API call
    // Simulate API call with timeout
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          email: 'user1@example.com',
          name: 'User One',
          isAdmin: false
        },
        {
          id: '2',
          email: 'user2@example.com',
          name: 'User Two',
          isAdmin: false
        },
        {
          id: '3',
          email: 'admin@example.com',
          name: 'Admin User',
          isAdmin: true
        }
      ]);
      setIsLoadingUsers(false);
    }, 1000);
  }, []);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-dark text-white">
        <Navbar />
        <div className="flex-grow content-container flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      <div className="flex-grow content-container">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold mb-8 text-gradient">Admin Dashboard</h1>

          <div className="glass-card p-6 rounded-lg shadow-custom mb-8">
            <h2 className="text-xl font-bold mb-4">User Management</h2>
            
            {isLoadingUsers ? (
              <div className="text-center py-8">
                <p>Loading users...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {users.map(user => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs ${user.isAdmin ? 'bg-primary text-white' : 'bg-gray-700 text-gray-300'}`}>
                            {user.isAdmin ? 'Admin' : 'User'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 