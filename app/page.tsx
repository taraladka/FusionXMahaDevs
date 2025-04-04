'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from './components/Navbar';
import WelcomePopup from './components/WelcomePopup';
import Skull3D from './components/Skull3D';
import ParticleEffect from './components/ParticleEffect';
import { useAuth } from './context/AuthContext';
import { FiCalendar, FiUsers, FiCode, FiArrowRight, FiStar, FiMessageCircle } from 'react-icons/fi';

export default function Home() {
  const [showPopup, setShowPopup] = useState(true);
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-dark text-white">
      <Navbar />
      
      {showPopup && <WelcomePopup onClose={() => setShowPopup(false)} />}
      
      <main className="flex-grow content-container">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-28">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-dark"></div>
          <div 
            className="absolute top-0 left-0 w-full h-full opacity-10"
            style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23ffffff" fill-opacity="0.1" fill-rule="evenodd"%3E%3Ccircle cx="20" cy="20" r="2"/%3E%3C/g%3E%3C/svg%3E")',
              backgroundSize: '24px 24px'
            }}
          ></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                  Welcome to <span className="text-primary">Fusion</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                  The premier technical club shaping tomorrow's tech leaders through innovation, collaboration, and excellence.
                </p>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                  <Link href="/events" className="btn-primary flex items-center justify-center sm:justify-start">
                    <FiCalendar className="mr-2" />
                    Explore Events
                  </Link>
                  {!user ? (
                    <Link href="/auth" className="btn-dark flex items-center justify-center sm:justify-start">
                      <FiUsers className="mr-2" />
                      Join Our Community
                    </Link>
                  ) : (
                    <a href="https://chat.whatsapp.com/GzwZXbqi50h8ympnaKNSni" target="_blank" rel="noopener noreferrer" className="btn-dark flex items-center justify-center sm:justify-start">
                      <FiMessageCircle className="mr-2" />
                      Join the Community
                    </a>
                  )}
                </div>
              </div>
              <div className="md:w-1/2 flex justify-center relative">
                <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                  <div className="absolute inset-0 bg-primary/30 filter blur-3xl"></div>
                  <ParticleEffect />
                  <Skull3D 
                    imageUrl="/pictures/skull-emoji.png"
                    alt="Fusion Skull Logo"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-20 bg-darkergray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="section-title inline-block relative">
                About Fusion
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-primary rounded-full"></span>
              </h2>
              <p className="section-subtitle max-w-3xl mx-auto">
                We're more than just a club - we're a community of innovators, creators, and tech enthusiasts building the future together.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="glass-card card-hover text-center p-8 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                  <FiCode className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Innovation</h3>
                <p className="text-gray-300">Pushing the boundaries of technology through creative problem-solving and cutting-edge projects that address real-world challenges.</p>
              </div>
              
              <div className="glass-card card-hover text-center p-8 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                  <FiUsers className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Community</h3>
                <p className="text-gray-300">Building a supportive network of tech enthusiasts, mentors, and industry professionals who collaborate, share knowledge, and grow together.</p>
              </div>
              
              <div className="glass-card card-hover text-center p-8 rounded-lg transform hover:-translate-y-1 transition-all duration-300">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full mb-6">
                  <FiStar className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">Excellence</h3>
                <p className="text-gray-300">Striving for excellence in everything we do, from workshops and hackathons to helping members develop their technical and leadership skills.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Upcoming Events Preview */}
        <section className="py-20 bg-dark">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
              <h2 className="section-title mb-4 md:mb-0">Upcoming Events</h2>
              <Link 
                href="/events" 
                className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300 group"
              >
                <span className="font-medium">View All Events</span>
                <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass-card overflow-hidden flex flex-col md:flex-row rounded-lg transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="md:w-2/5 relative">
                  <div className="h-48 md:h-full relative">
                    <Image
                      src="/pictures/tech talk date- 11 february 2025 .jpg"
                      alt="Tech Talk Event"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium border border-primary/50">
                      Feb 11, 2025
                    </div>
                  </div>
                </div>
                <div className="md:w-3/5 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Tech Talk</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">Join us for an exciting tech talk featuring Love Babbar and Lakshay Kumar exploring the latest advancements in artificial intelligence and their impact on our future.</p>
                  <Link 
                    href={user ? "/events" : "/auth"}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300 group"
                  >
                    <span className="font-medium">{user ? "View Details" : "Register Now"}</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
              
              <div className="glass-card overflow-hidden flex flex-col md:flex-row rounded-lg transform hover:-translate-y-2 hover:shadow-lg transition-all duration-300">
                <div className="md:w-2/5 relative">
                  <div className="h-48 md:h-full relative">
                    <Image
                      src="/pictures/fusion x event date- 3 april 2025 .png"
                      alt="Fusion X Event"
                      fill
                      style={{ objectFit: 'cover' }}
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md font-medium border border-primary/50">
                      Apr 4, 2025
                    </div>
                  </div>
                </div>
                <div className="md:w-3/5 p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">Fusion X</h3>
                  <p className="text-gray-300 mb-4 line-clamp-3">Our annual flagship event featuring workshops, competitions, networking opportunities, and presentations from industry leaders in technology.</p>
                  <Link 
                    href={user ? "/events" : "/auth"}
                    className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-300 group"
                  >
                    <span className="font-medium">{user ? "View Details" : "Register Now"}</span>
                    <FiArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section - Only show if not logged in */}
        {!user && (
          <section className="py-16 bg-primary/10 relative overflow-hidden">
            <div className="absolute inset-0 backdrop-blur-sm bg-gradient-to-r from-primary/5 to-primary/20"></div>
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="text-3xl font-bold mb-6 text-white">Ready to join our tech community?</h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Become a part of Fusion and gain access to exclusive events, workshops, resources, and a network of like-minded tech enthusiasts.
              </p>
              <Link href="/auth" className="glass-button-primary py-3 px-8 text-base inline-flex items-center rounded-md">
                <FiUsers className="mr-2" />
                Sign Up Now
              </Link>
            </div>
          </section>
        )}
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
                    <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors duration-300">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-4">Join Us</h3>
                <ul className="space-y-2">
                  {user ? (
                    <>
                      <li>
                        <Link href="/events" className="text-gray-400 hover:text-primary transition-colors duration-300">
                          Upcoming Events
                        </Link>
                      </li>
                      <li>
                        <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors duration-300">
                          Contact Us
                        </Link>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link href="/auth" className="text-gray-400 hover:text-primary transition-colors duration-300">
                          Sign Up
                        </Link>
                      </li>
                      <li>
                        <Link href="/auth" className="text-gray-400 hover:text-primary transition-colors duration-300">
                          Login
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="col-span-2 md:col-span-1">
                <h3 className="text-white font-semibold mb-4">Contact Info</h3>
                <ul className="space-y-2">
                  <li className="text-gray-400">
                    Building 5, Room 303
                  </li>
                  <li>
                    <a href="mailto:borrowverse@gmail.com" className="text-gray-400 hover:text-primary transition-colors duration-300">
                      borrowverse@gmail.com
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
} 