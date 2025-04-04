'use client';

import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show cursor after it moves (prevents initial position flash)
    const addEventListeners = () => {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseenter', onMouseEnter);
      document.addEventListener('mouseleave', onMouseLeave);
      document.addEventListener('mousedown', onMouseDown);
      document.addEventListener('mouseup', onMouseUp);
      
      // Add hover effect for interactive elements
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [role="link"]');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', onLinkHoverEnter);
        el.addEventListener('mouseleave', onLinkHoverLeave);
      });
    };

    // Add some delay to ensure all elements are loaded
    setTimeout(addEventListeners, 500);

    // Cleanup event listeners on component unmount
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      
      const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea, [role="link"]');
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onLinkHoverEnter);
        el.removeEventListener('mouseleave', onLinkHoverLeave);
      });
    };
  }, []);

  const onMouseMove = (e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY });
    if (!isVisible) setIsVisible(true);
  };

  const onMouseEnter = () => {
    setIsVisible(true);
  };

  const onMouseLeave = () => {
    setIsVisible(false);
  };

  const onMouseDown = () => {
    setIsHovering(true);
  };

  const onMouseUp = () => {
    setIsHovering(false);
  };

  const onLinkHoverEnter = () => {
    setIsHovering(true);
  };

  const onLinkHoverLeave = () => {
    setIsHovering(false);
  };

  if (typeof window === 'undefined') return null;

  return (
    <>
      <div 
        className={`custom-cursor ${isHovering ? 'hover' : ''}`} 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0
        }} 
      />
      <div 
        className="custom-cursor-dot" 
        style={{ 
          left: `${position.x}px`, 
          top: `${position.y}px`,
          opacity: isVisible ? 1 : 0,
          transform: isHovering ? 'translate(-50%, -50%) scale(0.5)' : 'translate(-50%, -50%)'
        }} 
      />
    </>
  );
};

export default CustomCursor; 