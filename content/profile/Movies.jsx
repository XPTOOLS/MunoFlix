"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';

const Movies = ({ active, totalMovies }) => {
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist from MongoDB
  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/watchlist?userId=default');
      if (response.ok) {
        const data = await response.json();
        setWatchlist(data);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  // Listen for bookmark updates
  useEffect(() => {
    const handleBookmarksUpdated = () => {
      fetchWatchlist();
    };

    window.addEventListener('bookmarksUpdated', handleBookmarksUpdated);
    fetchWatchlist(); // Initial fetch

    return () => {
      window.removeEventListener('bookmarksUpdated', handleBookmarksUpdated);
    };
  }, []);

  // Filter watchlist based on active status
  const filteredWatchlist = watchlist.filter(item => item.status === active);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6c5dd3]"></div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-white text-xl font-semibold mb-4">
        {active === 'PLANNING' && 'To Watch'}
        {active === 'CURRENT' && 'Watching'} 
        {active === 'COMPLETED' && 'Watched'}
        {active === 'PAUSED' && 'On Hold'}
        {active === 'DROPPED' && 'Dropped'}
        <span className="text-[#8884b8] ml-2">({filteredWatchlist.length})</span>
      </h2>

      {filteredWatchlist.length === 0 ? (
        <div className="text-center py-12 text-[#8884b8]">
          <div className="text-4xl mb-3">
            {active === 'PLANNING' && '📝'}
            {active === 'CURRENT' && '🎬'}
            {active === 'COMPLETED' && '✅'}
            {active === 'PAUSED' && '⏸️'}
            {active === 'DROPPED' && '❌'}
          </div>
          <p className="text-lg">
            {active === 'PLANNING' && 'No movies to watch yet'}
            {active === 'CURRENT' && 'No movies being watched'}
            {active === 'COMPLETED' && 'No movies watched yet'}
            {active === 'PAUSED' && 'No movies on hold'}
            {active === 'DROPPED' && 'No dropped movies'}
          </p>
          <p className="text-sm mt-1">
            {active === 'PLANNING' && 'Add movies to your watchlist to see them here'}
            {active === 'CURRENT' && 'Start watching movies to see them here'}
            {active === 'COMPLETED' && 'Mark movies as watched to see them here'}
            {active === 'PAUSED' && 'Pause movies to see them here'}
            {active === 'DROPPED' && 'Drop movies to see them here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredWatchlist.map((item) => (
            <WatchlistCard key={item._id} item={item} onUpdate={fetchWatchlist} />
          ))}
        </div>
      )}
    </div>
  );
};

// Watchlist Card Component
const WatchlistCard = ({ item, onUpdate }) => {
  const { movie, status } = item;

  const handleRemove = async () => {
    try {
      const response = await fetch(`/api/watchlist?userId=default&movieId=${movie.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        onUpdate();
        window.dispatchEvent(new Event('bookmarksUpdated'));
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch('/api/watchlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: 'default',
          movie: movie,
          status: newStatus
        }),
      });
      
      if (response.ok) {
        onUpdate();
        window.dispatchEvent(new Event('bookmarksUpdated'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="bg-[#2a2d3e] border border-[#39374b] rounded-lg overflow-hidden group hover:border-[#6c5dd3] transition-all duration-300">
      <Link href={`/watch/${movie.id}?media_type=${movie.media_type}`}>
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/images/placeholder-poster.jpg'}
          alt={movie.title}
          className="w-full aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </Link>
      <div className="p-3">
        <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2">
          {movie.title}
        </h3>
        <div className="flex justify-between items-center text-xs">
          <span className="text-[#8884b8]">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
          <div className="flex gap-1">
            <button
              onClick={handleRemove}
              className="text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded"
              title="Remove"
            >
              ×
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;