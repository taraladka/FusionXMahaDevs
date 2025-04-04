'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiSearch, FiCalendar, FiFilter, FiChevronRight, FiArrowRight, FiLayout, FiList, FiInfo, FiClock, FiMapPin, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { Event } from '../types';
import Link from 'next/link';
import EventInfoModal from '../components/EventInfoModal';

const eventsData: Event[] = [
  {
    id: '1',
    title: 'Tech Talk',
    date: '2025-02-11',
    time: '10:00 AM',
    location: 'Main Auditorium',
    description: 'Join us for an insightful tech talk featuring Love Babbar and Lakshay Kumar who will share their knowledge on emerging technologies and trends in artificial intelligence.',
    image: '/pictures/tech talk date- 11 february 2025 .jpg',
    category: 'upcoming',
  },
  {
    id: '2',
    title: 'Fusion X',
    date: '2025-04-04',
    time: '9:30 AM',
    location: 'Wilson Block (Block 3)',
    description: 'Our flagship annual event with workshops, hackathons, and networking opportunities with industry professionals. Experience the cutting edge of technology.',
    image: '/pictures/fusion x event date- 3 april 2025 .png',
    category: 'upcoming',
  }
];

// Calculate event categories based on current date
const calculateEventCategories = (events: Event[]) => {
  // Use April 4, 2025 as the current date for this example
  const currentDate = new Date('2025-04-04');
  
  return events.map(event => {
    // Clone the event object
    const updatedEvent = { ...event };
    
    // Calculate the event's category based on its date
    const eventDate = new Date(event.date);
    
    // Set to beginning of day for proper comparison
    currentDate.setHours(0, 0, 0, 0);
    eventDate.setHours(0, 0, 0, 0);
    
    // Compare dates
    if (eventDate.getTime() < currentDate.getTime()) {
      updatedEvent.category = 'past';
    } else if (eventDate.getTime() === currentDate.getTime()) {
      updatedEvent.category = 'current';
    } else {
      updatedEvent.category = 'upcoming';
    }
    
    return updatedEvent;
  });
};

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'current' | 'past'>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [infoModalOpen, setInfoModalOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registerUrl, setRegisterUrl] = useState<string | null>(null);
  const [openFormAfterInfoClose, setOpenFormAfterInfoClose] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string>('all');
  const [isEventTypeOpen, setIsEventTypeOpen] = useState<boolean>(false);
  
  // Event category types
  const eventTypes = ['all', 'tech', 'gaming', 'design', 'workshop', 'hackathon', 'seminar'];

  // Initialize events with calculated categories
  useEffect(() => {
    const eventsWithCategories = calculateEventCategories(eventsData);
    setEvents(eventsWithCategories);
  }, []);

  // Filter events based on search term, time category, and event type
  useEffect(() => {
    const eventsWithCategories = calculateEventCategories(eventsData);
    let filteredEvents = eventsWithCategories;
    
    if (searchTerm) {
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filter !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.category === filter);
    }
    
    if (eventType !== 'all') {
      // This is a simulation as we don't have event types in the data
      // In a real app, you would filter based on actual event type property
      filteredEvents = filteredEvents.filter(event => 
        event.title.toLowerCase().includes(eventType.toLowerCase()) || 
        event.description.toLowerCase().includes(eventType.toLowerCase())
      );
    }
    
    setEvents(filteredEvents);
  }, [searchTerm, filter, eventType]);

  // Function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Function to get badge color based on category
  const getCategoryBadgeColor = (category: string) => {
    switch(category) {
      case 'current':
        return 'bg-green-600 text-white';
      case 'upcoming':
        return 'bg-primary text-white';
      case 'past':
        return 'bg-gray-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const openInfoModal = (event: Event) => {
    if (!user) {
      window.location.href = '/auth?redirect=/events';
      return;
    }
    // Just open the info modal, don't set flag to open form after
    setSelectedEvent(event);
    setInfoModalOpen(true);
    setOpenFormAfterInfoClose(false);
  };

  const handleRegister = (event: Event) => {
    if (!user) {
      window.location.href = '/auth?redirect=/events';
      return;
    }
    
    // Only proceed with registration if the event has a form
    if (event.id === '1') {
      // Tech Talk event doesn't have a registration form yet
      alert('Registration for this event is not open yet. Please check back later!');
      return;
    }
    
    // First check if we already have the registration URL
    if (registerUrl) {
      window.open(registerUrl, '_blank');
      return;
    }
    
    // If we don't have the URL yet, open the info modal to get it
    // And set flag to open form after info modal is loaded/closed
    setSelectedEvent(event);
    setInfoModalOpen(true);
    setOpenFormAfterInfoClose(true);
  };

  const handleRegisterUrlFound = (url: string) => {
    setRegisterUrl(url);
    
    // Only open the form if the modal was opened from the Register button
    if (openFormAfterInfoClose) {
      window.open(url, '_blank');
    }
  };

  const handleModalClose = () => {
    setInfoModalOpen(false);
    setOpenFormAfterInfoClose(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      <main className="flex-grow content-container">
        {/* Hero Section */}
        <section className="relative py-16 md:py-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-dark"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10 bg-dot-pattern"
          ></div>
          <div className="absolute -bottom-10 -right-10 w-56 h-56 bg-primary opacity-10 rounded-full blur-3xl"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gradient animate-fadeIn">Events & Activities</h1>
              <p className="text-xl text-gray-300 mb-6 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                Discover exciting workshops, tech talks, hackathons, and more
              </p>
              <div className="flex flex-wrap gap-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                <button
                  onClick={() => setFilter('upcoming')} 
                  className={`${filter === 'upcoming' ? 'bg-primary text-white shadow-inner-glow' : 'bg-darkgray text-gray-300'} px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-primary/90 hover:text-white transition-all duration-300`}
                >
                  <FiCalendar className="mr-2" />
                  Upcoming Events
                </button>
                <button
                  onClick={() => setFilter('current')} 
                  className={`${filter === 'current' ? 'bg-primary text-white shadow-inner-glow' : 'bg-darkgray text-gray-300'} px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-primary/90 hover:text-white transition-all duration-300`}
                >
                  <FiCalendar className="mr-2" />
                  Today's Events
                </button>
                <button
                  onClick={() => setFilter('past')} 
                  className={`${filter === 'past' ? 'bg-primary text-white shadow-inner-glow' : 'bg-darkgray text-gray-300'} px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-primary/90 hover:text-white transition-all duration-300`}
                >
                  <FiCalendar className="mr-2" />
                  Past Events
                </button>
                <button
                  onClick={() => setFilter('all')} 
                  className={`${filter === 'all' ? 'bg-primary text-white shadow-inner-glow' : 'bg-darkgray text-gray-300'} px-4 py-2 rounded-lg text-sm font-medium flex items-center hover:bg-primary/90 hover:text-white transition-all duration-300`}
                >
                  All Events
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Search and Filter */}
        <section className="py-6 glass-dark shadow-custom relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="glass-input block w-full pl-10 pr-3 py-2.5 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="md:hidden">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-2 border border-gray-700 rounded-md shadow-sm text-sm font-medium text-white bg-darkgray hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <FiFilter className="mr-2 h-5 w-5" aria-hidden="true" />
                    Filter
                  </button>
                </div>
                
                {/* Event type dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    className="inline-flex items-center justify-between w-full px-4 py-2.5 text-sm text-white bg-darkgray rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-300"
                    onClick={() => setIsEventTypeOpen(!isEventTypeOpen)}
                  >
                    <span className="capitalize">{eventType === 'all' ? 'All Categories' : eventType}</span>
                    <FiChevronDown className={`ml-2 h-4 w-4 transition-transform ${isEventTypeOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isEventTypeOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-darkergray z-10 ring-1 ring-black ring-opacity-5 divide-y divide-gray-700 focus:outline-none">
                      {eventTypes.map((type) => (
                        <button
                          key={type}
                          className={`${eventType === type ? 'bg-primary/10 text-primary' : 'text-gray-300 hover:bg-gray-800'} w-full text-left px-4 py-2.5 text-sm capitalize transition-colors duration-200`}
                          onClick={() => {
                            setEventType(type);
                            setIsEventTypeOpen(false);
                          }}
                        >
                          {type === 'all' ? 'All Categories' : type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="hidden md:flex items-center border-l border-gray-700 pl-3 ml-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'text-primary' : 'text-gray-400 hover:text-white'} transition-colors`}
                    aria-label="Grid view"
                  >
                    <FiLayout className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'text-primary' : 'text-gray-400 hover:text-white'} transition-colors`}
                    aria-label="List view"
                  >
                    <FiList className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
            
            {isFilterOpen && (
              <div className="mt-4 md:hidden flex flex-wrap gap-2">
                <button
                  onClick={() => setFilter('upcoming')} 
                  className={`${filter === 'upcoming' ? 'bg-primary text-white' : 'bg-darkgray text-gray-300'} px-3 py-1.5 rounded-md text-sm font-medium flex items-center`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setFilter('current')} 
                  className={`${filter === 'current' ? 'bg-primary text-white' : 'bg-darkgray text-gray-300'} px-3 py-1.5 rounded-md text-sm font-medium flex items-center`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter('past')} 
                  className={`${filter === 'past' ? 'bg-primary text-white' : 'bg-darkgray text-gray-300'} px-3 py-1.5 rounded-md text-sm font-medium flex items-center`}
                >
                  Past
                </button>
                <button
                  onClick={() => setFilter('all')} 
                  className={`${filter === 'all' ? 'bg-primary text-white' : 'bg-darkgray text-gray-300'} px-3 py-1.5 rounded-md text-sm font-medium flex items-center`}
                >
                  All
                </button>
                
                {/* Mobile event types dropdown */}
                <div className="w-full mt-2">
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="w-full px-3 py-1.5 bg-darkgray text-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    {eventTypes.map((type) => (
                      <option key={type} value={type} className="capitalize bg-darkergray">
                        {type === 'all' ? 'All Categories' : type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </section>
        
        {/* Events List */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!user && (
              <div className="mb-8 p-4 bg-primary/5 border-l-4 border-primary rounded-r-md">
                <div className="flex">
                  <div className="flex-shrink-0 text-primary">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-300">
                      Please <Link href="/auth" className="font-medium underline text-primary hover:text-primary/80">sign in</Link> to register for events and get access to exclusive content.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {events.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-4">
                  <FiCalendar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No events found</h3>
                <p className="text-gray-300 max-w-md mx-auto">Try adjusting your search or filter to find what you're looking for.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event, index) => (
                  <div key={event.id} className="glass-card overflow-hidden group flex flex-col rounded-lg transform hover:-translate-y-2 transition-all duration-300" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="h-52 relative overflow-hidden rounded-t-lg">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        className="transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/60 to-transparent"></div>
                      <div className="absolute bottom-4 right-4">
                        <span className={`text-xs px-2.5 py-1.5 rounded-full capitalize font-medium backdrop-blur-sm border ${getCategoryBadgeColor(event.category)}`}>
                          {event.category === 'current' ? 'today' : event.category}
                        </span>
                      </div>
                      <div className="absolute bottom-4 left-4 text-white font-semibold">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-primary" /> 
                          {formatDate(event.date)}
                        </div>
                      </div>
                      {/* Information button */}
                      <button 
                        onClick={() => openInfoModal(event)}
                        className={`absolute top-4 right-4 ${user ? 'bg-primary/80 hover:bg-primary' : 'bg-darkgray hover:bg-darkergray'} text-white rounded-full p-2.5 transition-colors shadow-md flex items-center justify-center backdrop-blur-sm`}
                        aria-label="Event information"
                        title={user ? "View event details only" : "Sign in to view details"}
                      >
                        <FiInfo className="h-5 w-5" />
                      </button>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">{event.title}</h3>
                      <p className="text-gray-300 mb-4 line-clamp-3 flex-grow">{event.description}</p>
                      
                      {/* Time and Location info */}
                      {(event.time || event.location) && (
                        <div className="mb-4 space-y-2 text-sm text-gray-300">
                          {event.time && (
                            <div className="flex items-center">
                              <FiClock className="mr-2 text-primary" />
                              {event.time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center">
                              <FiMapPin className="mr-2 text-primary" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      )}
                      
                      <div className="pt-4 border-t border-gray-800">
                        {user ? (
                          event.category === 'past' ? (
                            <button className="w-full btn-dark flex items-center justify-center text-gray-400 py-2.5">
                              <span>Oops! Event has ended</span>
                            </button>
                          ) : event.id === '1' ? (
                            <button 
                              className="w-full btn-secondary flex items-center justify-center py-2.5 group"
                              onClick={() => handleRegister(event)}
                              title="Registration for this event is not open yet"
                            >
                              Registration Coming Soon <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                          ) : (
                            <button 
                              className="w-full btn-primary flex items-center justify-center py-2.5 group"
                              onClick={() => handleRegister(event)}
                              title="Register for this event via Google Form"
                            >
                              Register Now <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                            </button>
                          )
                        ) : (
                          <Link href="/auth?redirect=/events" className="w-full block text-center btn-dark flex items-center justify-center py-2.5 group">
                            Sign in to register <FiChevronRight className="ml-1 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {events.map((event) => (
                  <div key={event.id} className="card card-hover overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 lg:w-1/4 relative">
                      <div className="h-56 md:h-full relative">
                        <Image
                          src={event.image}
                          alt={event.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute top-4 right-4">
                          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getCategoryBadgeColor(event.category)}`}>
                            {event.category === 'current' ? 'today' : event.category}
                          </span>
                        </div>
                        {/* Information button */}
                        <button 
                          onClick={() => openInfoModal(event)}
                          className={`absolute top-4 left-4 ${user ? 'bg-primary/80 hover:bg-primary' : 'bg-darkgray hover:bg-darkergray'} text-white rounded-full p-2.5 transition-colors shadow-md flex items-center justify-center`}
                          aria-label="Event information"
                          title={user ? "View event details only" : "Sign in to view details"}
                        >
                          <FiInfo className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    <div className="md:w-2/3 lg:w-3/4 p-6 flex flex-col">
                      <div className="flex-grow">
                        <div className="flex items-center text-sm text-gray-400 mb-2">
                          <FiCalendar className="mr-2 text-primary" />
                          {formatDate(event.date)}
                        </div>
                        <h3 className="text-xl font-semibold mb-3 text-white group-hover:text-primary transition-colors">{event.title}</h3>
                        
                        {/* Time and Location info */}
                        {(event.time || event.location) && (
                          <div className="mb-3 space-y-2 text-sm text-gray-400">
                            {event.time && (
                              <div className="flex items-center">
                                <FiClock className="mr-2 text-primary" />
                                {event.time}
                              </div>
                            )}
                            {event.location && (
                              <div className="flex items-center">
                                <FiMapPin className="mr-2 text-primary" />
                                {event.location}
                              </div>
                            )}
                          </div>
                        )}
                        
                        <p className="text-gray-300 mb-6">{event.description}</p>
                      </div>
                      <div className="flex justify-end">
                        {user ? (
                          event.category === 'past' ? (
                            <button className="btn-dark flex items-center justify-center text-gray-400 px-6 py-2.5">
                              <span>Oops! Check out upcoming events</span>
                              <FiCalendar className="ml-2" />
                            </button>
                          ) : event.id === '1' ? (
                            <button 
                              className="btn-secondary flex items-center justify-center px-6 py-2.5"
                              onClick={() => handleRegister(event)}
                              title="Registration for this event is not open yet"
                            >
                              Registration Coming Soon <FiArrowRight className="ml-2" />
                            </button>
                          ) : (
                            <button 
                              className="btn-primary flex items-center justify-center px-6 py-2.5"
                              onClick={() => handleRegister(event)}
                              title="Register for this event via Google Form"
                            >
                              Register Now <FiArrowRight className="ml-2" />
                            </button>
                          )
                        ) : (
                          <Link href="/auth?redirect=/events" className="btn-dark flex items-center justify-center px-6 py-2.5">
                            Sign in to register <FiArrowRight className="ml-2" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                    <Link href="/events" className="text-primary transition-colors duration-300">
                      Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors duration-300">
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

      {/* Event Info Modal */}
      {selectedEvent && (
        <EventInfoModal
          isOpen={infoModalOpen}
          onClose={handleModalClose}
          eventId={selectedEvent.id}
          eventTitle={selectedEvent.title}
          onRegisterUrlFound={handleRegisterUrlFound}
        />
      )}
    </div>
  );
};

const EventsWithProvider = () => (
  <Events />
);

export default EventsWithProvider; 