"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAllTranslatedMovies } from '@/data/translated-movies';
import Card from '@/components/Cards/Card/Card';

const TranslatedPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from external source
    const loadMovies = async () => {
      try {
        setLoading(true);
        // Add a small delay to see the loading animation
        await new Promise(resolve => setTimeout(resolve, 1000));
        const translatedMovies = getAllTranslatedMovies();
        setMovies(translatedMovies);
      } catch (error) {
        console.error('Error loading translated movies:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Format movie data for Card component
  const formatMovieForCard = (movie) => ({
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster,
    backdrop_path: movie.backdrop,
    overview: movie.description,
    release_date: movie.year,
    vote_average: movie.vote_average,
    genre_ids: movie.genre.map((_, index) => index),
    genres: movie.genre.map(name => ({ id: name.toLowerCase(), name })),
    media_type: movie.media_type || 'movie',
    runtime: parseInt(movie.duration) || 0,
    adult: movie.adult,
    original_language: movie.original_language || 'lg', // Luganda language code
    // Add translation identifier
    isTranslated: true
  });

  // Material Wave Loading Component
  const MaterialWaveLoading = () => (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-32">
      <div className="container mx-auto px-4 py-8">
        {/* Header Loading */}
        <div className="mb-8 animate-pulse">
          <div className="h-10 bg-[#2d2a44] rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-[#2d2a44] rounded w-1/2 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-8 bg-[#2d2a44] rounded w-24"></div>
            <div className="h-8 bg-[#2d2a44] rounded w-32"></div>
          </div>
        </div>

        {/* Material Wave Loading Animation */}
        <div className="w-full flex flex-col items-center justify-center py-20">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave"></div>
            <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-gray-400 text-sm">Loading translated movies...</p>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return <MaterialWaveLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-32">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Luganda Translated Movies</h1>
          <p className="text-gray-400 text-lg">
            Enjoy your favorite movies translated to Luganda language
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 bg-green-600 text-white text-sm font-semibold rounded-full">
              {movies.length} Movies
            </span>
            <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
              Family Friendly
            </span>
          </div>
        </div>

        {/* Movies Grid - 3 movies per line on mobile, scaling up */}
        {movies.length > 0 ? (
          <div className="mt-8 grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {movies.map((movie, index) => (
              <Card 
                key={movie.id} 
                data={formatMovieForCard(movie)} 
                index={index}
                type="movie"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-gray-400 text-xl mb-4">No translated movies available yet</div>
            <div className="text-gray-500 text-sm">Check back later for more Luganda translations</div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 p-6 bg-[#1e1c2f] border border-[#39374b] rounded-2xl">
          <h2 className="text-2xl font-bold text-white mb-4">About Luganda Translations</h2>
          <div className="grid md:grid-cols-2 gap-6 text-gray-300">
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">What are Luganda Translated Movies?</h3>
              <p className="leading-relaxed">
                These are popular international movies that have been professionally translated and dubbed 
                into Luganda, one of the major languages spoken in Uganda. Enjoy your favorite films in a 
                language that feels like home.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-400 mb-2">How to Watch</h3>
              <p className="leading-relaxed">
                Simply click on any movie poster to start watching. All movies are streamed directly 
                from our servers and are optimized for smooth playback on all devices.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatedPage;
