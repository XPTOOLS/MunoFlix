"use client"
import { useState, useRef, useEffect } from 'react';
import HoverPosterCard from './HoverPosterCard';
import MobileHoverSheet from './MobileHoverSheet';

const WithHoverCard = ({ children, movie, delay = 300 }) => {
  const [showCard, setShowCard] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef(null);
  const cardRef = useRef(null);
  const triggerRef = useRef(null);

  // Check if mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleMouseEnter = (e) => {
    if (isMobile) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate position - show to the right if there's space, otherwise to the left
    let x = rect.right + 10;
    let y = rect.top;
    
    // If there's not enough space on the right, show to the left
    if (x + 320 > viewportWidth) {
      x = rect.left - 330;
    }
    
    // Ensure card stays within viewport vertically
    if (y + 400 > viewportHeight) {
      y = viewportHeight - 450;
    }
    
    // Ensure card doesn't go above viewport
    if (y < 10) {
      y = 10;
    }
    
    setPosition({ x, y });
    
    timeoutRef.current = setTimeout(() => {
      setShowCard(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (!isMobile) {
      setShowCard(false);
    }
  };

  // Mobile long press handler
  const handleTouchStart = (e) => {
    if (!isMobile) return;
    
    timeoutRef.current = setTimeout(() => {
      setShowCard(true);
    }, 500);
  };

  const handleTouchEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Close card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cardRef.current && !cardRef.current.contains(event.target) && 
          triggerRef.current && !triggerRef.current.contains(event.target)) {
        setShowCard(false);
      }
    };

    if (showCard) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      if (!isMobile) {
        document.addEventListener('scroll', handleMouseLeave);
      }
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('scroll', handleMouseLeave);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [showCard, isMobile]);

  const closeCard = () => {
    setShowCard(false);
  };

  return (
    <div 
      ref={triggerRef}
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {children}
      
      {showCard && isMobile ? (
        <MobileHoverSheet movie={movie} onClose={closeCard} />
      ) : showCard && !isMobile ? (
        <div
          ref={cardRef}
          className="fixed z-50 transition-all duration-200"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        >
          <HoverPosterCard movie={movie} />
        </div>
      ) : null}
    </div>
  );
};

export default WithHoverCard;