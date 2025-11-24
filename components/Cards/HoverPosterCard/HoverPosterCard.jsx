"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlay, FaClock, FaCalendar, FaBookmark, FaStar } from 'react-icons/fa';

const HoverPosterCard = ({ movie, fullWidth = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Safe destructuring with your data structure
  if (!movie) {
    return (
      <div className="w-80 h-96 bg-[#2a2d3e] rounded-lg animate-pulse">
        <div className="w-full h-48 bg-[#39374b] rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-[#39374b] rounded"></div>
          <div className="h-4 bg-[#39374b] rounded w-3/4"></div>
          <div className="h-3 bg-[#39374b] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

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
    adult,
    original_language
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
      } finally {
        setIsLoaded(true); // THIS WAS MISSING - SET LOADED TO TRUE
      }
    };
    
    checkBookmarkStatus();
  }, [id]);

  if (!isLoaded) {
    return (
      <div className="w-80 h-96 bg-[#2a2d3e] rounded-lg animate-pulse">
        <div className="w-full h-48 bg-[#39374b] rounded-t-lg"></div>
        <div className="p-4 space-y-3">
          <div className="h-4 bg-[#39374b] rounded"></div>
          <div className="h-4 bg-[#39374b] rounded w-3/4"></div>
          <div className="h-3 bg-[#39374b] rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${fullWidth ? 'w-full' : 'w-80'} bg-[#242735] border border-[#39374b] rounded-lg shadow-2xl overflow-hidden group hover:border-[#6c5dd3] transition-all duration-300`}>
      {/* Backdrop Image with Gradient Overlay */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={getImageUrl(backdrop_path || poster_path, 'w780')}
          alt={movieTitle}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 bg-[#6c5dd3] text-white text-xs font-semibold rounded-md capitalize">
            {type === 'tv' ? 'TV Show' : 'Movie'}
          </span>
          {adult && (
            <span className="px-2 py-1 bg-red-600 text-white text-xs font-semibold rounded-md">
              18+
            </span>
          )}
          {vote_average > 7.5 && (
            <span className="px-2 py-1 bg-yellow-600 text-white text-xs font-semibold rounded-md flex items-center gap-1">
              <FaStar className="text-xs" />
              Top Rated
            </span>
          )}
        </div>

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-[#8884b8]">
          <div className="flex items-center gap-1">
            <FaClock className="text-xs" />
            <span>{formatDuration(duration)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCalendar className="text-xs" />
            <span>{releaseYear}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaStar className="text-xs text-yellow-400" />
            <span>{vote_average?.toFixed(1) || 'N/A'}</span>
          </div>
        </div>

        {/* Genres */}
        {genres.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {genres.slice(0, 3).map(genre => (
              <span
                key={genre.id}
                className="px-2 py-1 bg-[#2a2d3e] border border-[#39374b] text-[#8884b8] text-xs rounded-md"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}

        {/* Overview */}
        {overview && (
          <p className="text-sm text-gray-300 line-clamp-3 leading-relaxed">
            {overview}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Link
            href={`/watch/${id}?media_type=${type}`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#6c5dd3] hover:bg-[#5b4bc4] text-white font-semibold rounded-lg transition-colors group/btn"
          >
            <FaPlay className="text-xs group-hover/btn:scale-110 transition-transform" />
            Play Now
          </Link>
          <button 
            onClick={handleBookmark}
            className={`flex items-center justify-center w-10 h-10 border rounded-lg transition-colors ${
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
  );
};

export default HoverPosterCard;