'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FiHome, FiCalendar, FiMessageSquare, FiLogIn, FiMenu, FiX, FiUser } from 'react-icons/fi';
import { useAuth, AuthProvider } from '../context/AuthContext';

function NavbarContent() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'glass-nav shadow-custom' : 'bg-dark/50 backdrop-blur-sm'
      }`}
    >
      <div className="relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-60"></div>
        {scrolled && <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white/10"></div>}
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 -my-2">
            <Link href="/" className="flex items-center">
              <Image
                src="/pictures/fusion logo.png"
                alt="Fusion Logo"
                width={120}
                height={120}
                priority
                className="h-auto transition-transform duration-300 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,109,0,0.5)]"
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              href="/" 
              className={`nav-item group ${pathname === '/' ? 'active font-semibold text-primary' : ''}`}
            >
              <div className="flex items-center">
                <FiHome className={`mr-2 h-5 w-5 ${pathname === '/' ? 'text-primary' : ''} group-hover:text-primary transition-colors duration-300`} />
                <span>Home</span>
              </div>
              <span className={`nav-indicator ${pathname === '/' ? 'w-full scale-100' : 'w-0 scale-0'} origin-left transition-all duration-300`}></span>
            </Link>
            
            <Link 
              href="/events" 
              className={`nav-item group ${pathname === '/events' ? 'active font-semibold text-primary' : ''}`}
            >
              <div className="flex items-center">
                <FiCalendar className={`mr-2 h-5 w-5 ${pathname === '/events' ? 'text-primary' : ''} group-hover:text-primary transition-colors duration-300`} />
                <span>Events</span>
              </div>
              <span className={`nav-indicator ${pathname === '/events' ? 'w-full scale-100' : 'w-0 scale-0'} origin-left transition-all duration-300`}></span>
            </Link>
            
            <Link 
              href="/contact" 
              className={`nav-item group ${pathname === '/contact' ? 'active font-semibold text-primary' : ''}`}
            >
              <div className="flex items-center">
                <FiMessageSquare className={`mr-2 h-5 w-5 ${pathname === '/contact' ? 'text-primary' : ''} group-hover:text-primary transition-colors duration-300`} />
                <span>Contact</span>
              </div>
              <span className={`nav-indicator ${pathname === '/contact' ? 'w-full scale-100' : 'w-0 scale-0'} origin-left transition-all duration-300`}></span>
            </Link>
            
            {user ? (
              <div className="ml-3 flex items-center space-x-3 pl-3 border-l border-gray-700">
                <Link 
                  href="/profile" 
                  className={`flex items-center group relative ${pathname === '/profile' ? 'text-primary' : 'text-lightgray hover:text-white'} transition-colors duration-300`}
                >
                  <div className="flex items-center justify-center bg-darkgray w-8 h-8 rounded-full mr-2 shadow-inner-glow overflow-hidden border border-gray-700">
                    <FiUser className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                  {pathname === '/profile' && (
                    <span className="absolute -bottom-1 inset-x-0 h-0.5 bg-primary rounded opacity-70"></span>
                  )}
                </Link>
                <button 
                  onClick={logout} 
                  className="btn-sign-out text-sm px-3 py-1.5 rounded-md hover:shadow-inner-glow"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link 
                href="/auth" 
                className="btn-sign-in text-sm px-4 py-2 ml-3 rounded-md shadow-md hover:shadow-glow transition-all duration-300"
              >
                <FiLogIn className="mr-2 h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white hover:bg-darkgray focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <FiX className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <FiMenu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden glass-dark border-t border-white/5 shadow-custom animate-slideDown">
          <div className="px-4 pt-4 pb-6 space-y-3">
            <Link 
              href="/" 
              className={`mobile-nav-item ${pathname === '/' ? 'text-primary bg-primary/5 border-l-4 border-primary pl-3 font-semibold' : 'border-l-4 border-transparent pl-3'} transition-all duration-300`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FiHome className={`mr-3 h-5 w-5 ${pathname === '/' ? 'text-primary' : ''}`} />
                <span>Home</span>
              </div>
            </Link>
            
            <Link 
              href="/events" 
              className={`mobile-nav-item ${pathname === '/events' ? 'text-primary bg-primary/5 border-l-4 border-primary pl-3 font-semibold' : 'border-l-4 border-transparent pl-3'} transition-all duration-300`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FiCalendar className={`mr-3 h-5 w-5 ${pathname === '/events' ? 'text-primary' : ''}`} />
                <span>Events</span>
              </div>
            </Link>
            
            <Link 
              href="/contact" 
              className={`mobile-nav-item ${pathname === '/contact' ? 'text-primary bg-primary/5 border-l-4 border-primary pl-3 font-semibold' : 'border-l-4 border-transparent pl-3'} transition-all duration-300`}
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center">
                <FiMessageSquare className={`mr-3 h-5 w-5 ${pathname === '/contact' ? 'text-primary' : ''}`} />
                <span>Contact</span>
              </div>
            </Link>
            
            {user && (
              <Link 
                href="/profile" 
                className={`mobile-nav-item ${pathname === '/profile' ? 'text-primary border-l-4 border-primary pl-3' : 'border-l-4 border-transparent pl-3'} transition-all duration-300`}
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <FiUser className="mr-3 h-5 w-5" />
                  <span>My Profile</span>
                </div>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default function Navbar() {
  return (
    <AuthProvider>
      <NavbarContent />
    </AuthProvider>
  );
}