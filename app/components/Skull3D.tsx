'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Skull3DProps {
  imageUrl: string;
  alt: string;
}

export default function Skull3D({ imageUrl, alt }: Skull3DProps) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);
  const [animate, setAnimate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Handle mouse movement for 3D effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    // Stop automatic animation when user interacts
    setAnimate(false);
    
    // Get container dimensions and position
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate center of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate mouse position relative to center (-1 to 1)
    const relativeX = (e.clientX - centerX) / (rect.width / 2);
    const relativeY = (e.clientY - centerY) / (rect.height / 2);
    
    // Apply rotation based on mouse position (limited range)
    setRotation({
      x: -relativeY * 15, // Flip Y axis for natural tilt
      y: relativeX * 15,
    });
    
    // Restart automatic animation after user stops interacting
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setAnimate(true), 3000);
  };

  // Handle touch events for mobile devices
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    
    // Stop automatic animation when user interacts
    setAnimate(false);
    setHover(true);
    
    // Get container dimensions and position
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate center of the element
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Get first touch position
    const touch = e.touches[0];
    
    // Calculate touch position relative to center (-1 to 1)
    const relativeX = (touch.clientX - centerX) / (rect.width / 2);
    const relativeY = (touch.clientY - centerY) / (rect.height / 2);
    
    // Apply rotation based on touch position (limited range)
    setRotation({
      x: -relativeY * 15, // Flip Y axis for natural tilt
      y: relativeX * 15,
    });
    
    // Prevent default to avoid scrolling while interacting
    e.preventDefault();
    
    // Restart automatic animation after user stops interacting
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setAnimate(true);
      setHover(false);
    }, 3000);
  };

  // Handle touch end
  const handleTouchEnd = () => {
    // Don't reset immediately to allow for a smooth transition
    setTimeout(() => {
      setHover(false);
    }, 300);
    
    // Restart automatic animation after a delay
    setTimeout(() => {
      setAnimate(true);
    }, 1000);
  };

  // Automatic gentle floating animation
  useEffect(() => {
    if (!animate) return;
    
    const interval = setInterval(() => {
      setRotation(prev => ({
        x: prev.x + Math.sin(Date.now() / 1000) * 0.2,
        y: prev.y + Math.cos(Date.now() / 1000) * 0.2,
      }));
    }, 50);
    
    return () => clearInterval(interval);
  }, [animate]);

  // Pulse animation effect
  useEffect(() => {
    const pulseInterval = setInterval(() => {
      if (animate) {
        setHover(prev => !prev);
        setTimeout(() => {
          setHover(prev => !prev);
        }, 300);
      }
    }, 3000);
    
    return () => clearInterval(pulseInterval);
  }, [animate]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full perspective-1000 cursor-pointer"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => {
        setHover(false);
        setAnimate(true);
        setRotation({ x: 0, y: 0 });
      }}
    >
      <div 
        className="relative h-full w-full transition-transform duration-200 ease-out preserve-3d"
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)${hover ? ' scale(1.05)' : ''}`,
        }}
      >
        <Image
          src={imageUrl}
          alt={alt}
          fill
          priority
          style={{ objectFit: 'contain' }}
          className={`drop-shadow-[0_0_35px_rgba(255,109,0,0.9)] z-10 transition-all duration-300 ${
            hover ? 'drop-shadow-[0_0_50px_rgba(255,109,0,1)]' : ''
          }`}
        />
        
        {/* Reflection effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-transparent to-white/5 opacity-0 transition-opacity duration-300 z-20"
          style={{ opacity: hover ? 0.2 : 0 }}
        ></div>
      </div>
    </div>
  );
} 