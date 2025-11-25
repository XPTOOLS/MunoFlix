"use client"
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaPlay, FaClock, FaCalendar, FaBookmark, FaStar, FaTimes } from 'react-icons/fa';

const MobileHoverSheet = ({ movie, onClose }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const sheetRef = useRef(null);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  if (!movie) return null;

  const {
    id,
    title,
    name,
    poster_path,
    backdrop_path,
    release_date,
    first_air_date,
    vote_average,
    overview,
    runtime,
    episode_run_time,
    genres = [],
    media_type,
    adult
  } = movie;

  const movieTitle = title || name || 'Unknown Title';
  const type = media_type || (title ? 'movie' : 'tv');
  const releaseYear = release_date ? new Date(release_date).getFullYear() : first_air_date ? new Date(first_air_date).getFullYear() : 'N/A';
  
// Fix duration calculation - handle different data structures
const formatDuration = (minutes) => {
  console.log('Duration minutes:', minutes); // Debug log
  
  if (!minutes || minutes === 0 || minutes === '0' || minutes === 'N/A') {
    return "N/A";
  }
  
  // Handle string inputs
  const mins = typeof minutes === 'string' ? parseInt(minutes) : minutes;
  
  if (isNaN(mins) || mins === 0) {
    return "N/A";
  }
  
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  
  const hoursText = hours > 0 ? `${hours}h ` : "";
  const minsText = remainingMins > 0 ? `${remainingMins}m` : "";
  
  return `${hoursText}${minsText}`.trim() || "N/A";
};

// Try multiple duration sources
const duration = runtime || 
  (episode_run_time && episode_run_time[0]) || 
  movie.runtime || 
  movie.duration || 
  0;

  // Get image URLs
  const getImageUrl = (path, size = 'w500') => {
    if (!path) return '/images/placeholder-backdrop.jpg';
    return `https://image.tmdb.org/t/p/${size}${path}`;
  };

  // Watch later functionality - integrate with your existing system
// Watch later functionality with MongoDB
const handleBookmark = async (e) => {
  e.preventDefault();
  e.stopPropagation();
  
  try {
    if (isBookmarked) {
      // Remove from watchlist
      const response = await fetch(`/api/watchlist?userId=default&movieId=${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setIsBookmarked(false);
        window.dispatchEvent(new Event('bookmarksUpdated'));
      }
    } else {
      // Add to watchlist
      const movieData = {
        id,
        title: movieTitle,
        poster_path,
        backdrop_path,
        media_type: type,
        release_date: release_date || first_air_date,
        vote_average,
        overview,
        runtime,
        episode_run_time,
        genres
      };
      
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'default', // Replace with actual user ID when you have auth
          movie: movieData,
          status: 'PLANNING'
        }),
      });
      
      if (response.ok) {
        setIsBookmarked(true);
        window.dispatchEvent(new Event('bookmarksUpdated'));
      }
    }
  } catch (error) {
    console.error('Error updating watchlist:', error);
  }
};

// Check if already bookmarked on mount
useEffect(() => {
  const checkBookmarkStatus = async () => {
    try {
      const response = await fetch('/api/watchlist?userId=default');
      if (response.ok) {
        const watchlist = await response.json();
        const isAlreadyBookmarked = watchlist.some(item => 
          item.movie.id === id && item.status === 'PLANNING'
        );
        setIsBookmarked(isAlreadyBookmarked);
      }
    } catch (error) {
      console.error('Error checking bookmark status:', error);
    }
  };
  
  checkBookmarkStatus();
}, [id]);

  // Swipe to close functionality
  const handleTouchStart = (e) => {
    setStartY(e.touches[0].clientY);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    
    const diff = currentY - startY;
    if (diff > 100) { // Swiped down enough to close
      onClose();
    }
    
    setIsDragging(false);
    setCurrentY(0);
    setStartY(0);
  };

  // Close on background click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
      <div
        ref={sheetRef}
        className="w-full max-w-2xl bg-[#242735] rounded-t-2xl shadow-2xl max-h-[80vh] overflow-y-auto"
        style={{
          transform: `translateY(${isDragging ? Math.max(0, currentY - startY) : 0}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-[#39374b] rounded-full"></div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white p-2 rounded-full bg-[#39374b] hover:bg-[#6c5dd3] transition-colors"
        >
          <FaTimes />
        </button>

        {/* Backdrop Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={getImageUrl(backdrop_path || poster_path, 'w780')}
            alt={movieTitle}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = '/images/placeholder-backdrop.jpg';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#242735] via-[#24273580] to-transparent"></div>
          
          {/* Title Overlay */}
          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-white text-xl font-bold line-clamp-2 drop-shadow-lg">
              {movieTitle}
            </h3>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-[#6c5dd3] text-white text-sm font-semibold rounded-md capitalize">
              {type === 'tv' ? 'TV Show' : 'Movie'}
            </span>
            {adult && (
              <span className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded-md">
                18+
              </span>
            )}
            {vote_average > 7.5 && (
              <span className="px-3 py-1 bg-yellow-600 text-white text-sm font-semibold rounded-md flex items-center gap-1">
                <FaStar className="text-sm" />
                Top Rated
              </span>
            )}
          </div>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-base text-[#8884b8]">
            <div className="flex items-center gap-2">
              <FaClock className="text-sm" />
              <span>{formatDuration(duration)}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCalendar className="text-sm" />
              <span>{releaseYear}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaStar className="text-sm text-yellow-400" />
              <span>{vote_average?.toFixed(1) || 'N/A'}</span>
            </div>
          </div>

          {/* Genres */}
          {genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {genres.slice(0, 3).map(genre => (
                <span
                  key={genre.id}
                  className="px-3 py-1 bg-[#2a2d3e] border border-[#39374b] text-[#8884b8] text-sm rounded-md"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          {/* Overview */}
          {overview && (
            <div>
              <h4 className="text-white font-semibold mb-2">Overview</h4>
              <p className="text-gray-300 leading-relaxed">
                {overview}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Link
              href={`/watch/${id}?media_type=${type}`}
              className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-[#6c5dd3] hover:bg-[#5b4bc4] text-white font-semibold rounded-lg transition-colors text-base"
              onClick={onClose}
            >
              <FaPlay className="text-sm" />
              Play Now
            </Link>
            <button 
              onClick={handleBookmark}
              className={`flex items-center justify-center w-14 h-14 border-2 rounded-lg transition-colors text-lg ${
                isBookmarked 
                  ? 'bg-[#6c5dd3] border-[#6c5dd3] text-white' 
                  : 'bg-[#2a2d3e] border-[#39374b] hover:border-[#6c5dd3] text-[#8884b8] hover:text-white'
              }`}
            >
              <FaBookmark />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHoverSheet;