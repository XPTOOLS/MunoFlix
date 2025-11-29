"use client";
import { useState, useEffect } from "react";
import NewsCard from "@/components/Cards/NewsCard/NewsCard";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedNews, setSelectedNews] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Check if data needs refresh (once per day)
  const shouldRefreshData = () => {
    const lastUpdate = localStorage.getItem('newsLastUpdate');
    if (!lastUpdate) return true;
    
    const lastUpdateDate = new Date(lastUpdate);
    const today = new Date();
    return lastUpdateDate.toDateString() !== today.toDateString();
  };

  // Fetch real data from TMDB with more content and better descriptions
  const fetchNewsData = async () => {
    try {
      setLoading(true);
      
      // Fetch more pages to get diverse content
      const [moviesRes1, moviesRes2, tvRes1, tvRes2, upcomingMoviesRes, trendingMoviesRes, popularTVRes] = await Promise.all([
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d6b0fe020db56e35227657fd8c0afd5c&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=d6b0fe020db56e35227657fd8c0afd5c&language=en-US&page=2`),
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=d6b0fe020db56e35227657fd8c0afd5c&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/tv/on_the_air?api_key=d6b0fe020db56e35227657fd8c0afd5c&language=en-US&page=2`),
        fetch(`https://api.themoviedb.org/3/movie/upcoming?api_key=d6b0fe020db56e35227657fd8c0afd5c&language=en-US&page=1`),
        fetch(`https://api.themoviedb.org/3/trending/movie/week?api_key=d6b0fe020db56e35227657fd8c0afd5c`),
        fetch(`https://api.themoviedb.org/3/tv/popular?api_key=d6b0fe020db56e35227657fd8c0afd5c&language=en-US&page=1`)
      ]);

      const moviesData1 = await moviesRes1.json();
      const moviesData2 = await moviesRes2.json();
      const tvData1 = await tvRes1.json();
      const tvData2 = await tvRes2.json();
      const upcomingData = await upcomingMoviesRes.json();
      const trendingData = await trendingMoviesRes.json();
      const popularTVData = await popularTVRes.json();

      // Combine all results
      const allMovies = [...moviesData1.results, ...moviesData2.results];
      const allTVShows = [...tvData1.results, ...tvData2.results];
      const upcomingMovies = upcomingData.results;
      const trendingMovies = trendingData.results;
      const popularTVShows = popularTVData.results;

      // Helper function to create detailed descriptions
      const createDetailedDescription = (item, type) => {
        const baseDescription = item.overview ? item.overview : '';
        const title = type === 'movie' ? item.title : item.name;
        
        if (type === 'movie') {
          if (item.genre_ids && item.genre_ids.length > 0) {
            return `${title} is generating buzz in theaters ${baseDescription ? `- ${baseDescription}` : 'with its compelling storyline and impressive performances.'} The film has received a rating of ${item.vote_average?.toFixed(1)}/10 from audiences.`;
          }
          return `${title} is now captivating audiences in cinemas worldwide. ${baseDescription || 'Experience this latest cinematic release on the big screen.'}`;
        } else {
          return `${title} continues to deliver exciting new episodes. ${baseDescription || 'Follow the unfolding drama and character developments in this popular series.'} Currently rated ${item.vote_average?.toFixed(1)}/10 by viewers.`;
        }
      };

      // Transform TMDB data into news format with detailed descriptions
      const movieNews = allMovies.slice(0, 8).map((movie, index) => ({
        id: `movie-${movie.id}`,
        title: `"${movie.title}" - Now in Theaters`,
        excerpt: createDetailedDescription(movie, 'movie'),
        category: "movies",
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/images/logo.png",
        date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0],
        source: "Cinema Updates",
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        type: "movie",
        tmdbId: movie.id,
        fullDescription: movie.overview || `Experience "${movie.title}" in theaters now. This film is part of the current cinematic lineup attracting audiences worldwide.`
      }));

      const tvNews = allTVShows.slice(0, 8).map((show, index) => ({
        id: `tv-${show.id}`,
        title: `"${show.name}" - Currently Airing`,
        excerpt: createDetailedDescription(show, 'tv'),
        category: "tv",
        image: show.poster_path ? `https://image.tmdb.org/t/p/w500${show.poster_path}` : "/images/logo.png",
        date: new Date(Date.now() - (index + 8) * 86400000).toISOString().split('T')[0],
        source: "TV Guide",
        vote_average: show.vote_average,
        popularity: show.popularity,
        type: "tv",
        tmdbId: show.id,
        fullDescription: show.overview || `"${show.name}" continues its run with new episodes airing regularly. Don't miss the latest developments in this popular series.`
      }));

      const upcomingNews = upcomingMovies.slice(0, 8).map((movie, index) => ({
        id: `upcoming-${movie.id}`,
        title: `"${movie.title}" - Coming Soon`,
        excerpt: `Mark your calendars! "${movie.title}" is scheduled for release ${movie.release_date ? `on ${new Date(movie.release_date).toLocaleDateString()}` : 'soon'}. ${movie.overview ? movie.overview.substring(0, 150) + '...' : 'This upcoming release is already generating excitement among fans and critics alike.'}`,
        category: "movies",
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/images/logo.png",
        date: new Date(Date.now() - (index + 16) * 86400000).toISOString().split('T')[0],
        source: "Upcoming Releases",
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        type: "movie",
        tmdbId: movie.id,
        fullDescription: movie.overview || `"${movie.title}" is one of the most anticipated releases of the season. Stay tuned for more updates about this exciting project.`,
        releaseDate: movie.release_date
      }));

      const trendingNews = trendingMovies.slice(0, 6).map((movie, index) => ({
        id: `trending-${movie.id}`,
        title: `"${movie.title}" - Trending Now`,
        excerpt: `"${movie.title}" is gaining massive popularity this week with audiences and critics. ${movie.overview ? movie.overview.substring(0, 120) + '...' : 'Join the conversation about this must-see title that everyone is talking about.'} Currently trending with a ${movie.vote_average?.toFixed(1)}/10 rating.`,
        category: "movies",
        image: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : "/images/logo.png",
        date: new Date(Date.now() - (index + 24) * 86400000).toISOString().split('T')[0],
        source: "Trending",
        vote_average: movie.vote_average,
        popularity: movie.popularity,
        type: "movie",
        tmdbId: movie.id,
        fullDescription: movie.overview || `"${movie.title}" has captured audience attention and is currently one of the most discussed titles across social media and entertainment platforms.`
      }));

      // Combine all news (total: 8 + 8 + 8 + 6 = 30 items)
      const allNews = [...movieNews, ...tvNews, ...upcomingNews, ...trendingNews]
        .sort((a, b) => b.popularity - a.popularity);

      setNews(allNews);
      setLastUpdated(new Date());
      
      // Store last update time in localStorage
      localStorage.setItem('newsLastUpdate', new Date().toISOString());
      localStorage.setItem('cachedNews', JSON.stringify(allNews));
      
    } catch (error) {
      console.error("Error fetching news:", error);
      // Try to load cached data if available
      const cachedNews = localStorage.getItem('cachedNews');
      if (cachedNews) {
        setNews(JSON.parse(cachedNews));
      } else {
        // Fallback to mock data if API fails and no cache
        setNews(getFallbackNews());
      }
      setLastUpdated(new Date());
    } finally {
      setLoading(false);
    }
  };

  // Enhanced fallback mock data with detailed descriptions
  const getFallbackNews = () => {
    const fallbackNews = [];
    
    // Generate 30 fallback items with comprehensive descriptions
    for (let i = 1; i <= 30; i++) {
      const isMovie = i % 2 === 0;
      const title = isMovie ? `Blockbuster Movie Release ${i}` : `Hit TV Series Season ${i}`;
      const excerpt = isMovie 
        ? `Experience the cinematic masterpiece that's taking theaters by storm. With stunning visuals and compelling performances, this film has earned a ${(Math.random() * 2 + 8).toFixed(1)}/10 rating from audiences. Don't miss this must-see theatrical experience.`
        : `The latest season continues to deliver shocking twists and character development that has fans buzzing. With a ${(Math.random() * 2 + 7).toFixed(1)}/10 rating, this series remains a fan favorite with new episodes airing weekly.`;
      
      fallbackNews.push({
        id: i,
        title: title,
        excerpt: excerpt,
        category: isMovie ? "movies" : "tv",
        image: "/images/logo.png",
        date: `2024-01-${16 - Math.floor(i / 2)}`,
        source: isMovie ? "Cinema Updates" : "TV Guide",
        vote_average: (Math.random() * 3 + 7).toFixed(1),
        popularity: Math.floor(Math.random() * 1000),
        type: isMovie ? "movie" : "tv",
        tmdbId: i,
        fullDescription: excerpt + " This content continues to receive positive reviews from both critics and audiences, making it one of the standout entertainment options currently available."
      });
    }
    
    return fallbackNews;
  };

  const categories = [
    { id: "all", name: "All News" },
    { id: "movies", name: "Movies" },
    { id: "tv", name: "TV Shows" }
  ];

  // Handle news item click - show expanded view
  const handleNewsClick = (newsItem) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  // Auto-refresh news daily
  useEffect(() => {
    if (shouldRefreshData()) {
      fetchNewsData();
    } else {
      // Load cached data
      const cachedNews = localStorage.getItem('cachedNews');
      if (cachedNews) {
        setNews(JSON.parse(cachedNews));
      }
      setLastUpdated(new Date(localStorage.getItem('newsLastUpdate')));
      setLoading(false);
    }
  }, []);

  const filteredNews = selectedCategory === "all" 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  // Material Wave Loading Component
  const MaterialWaveLoading = () => (
    <div className="flex justify-center items-center space-x-1 py-12">
      <div className="w-2 h-8 bg-purple-400 rounded-full animate-wave"></div>
      <div className="w-2 h-8 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
      <div className="w-2 h-8 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-8 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
      <div className="w-2 h-8 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Entertainment News
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Stay updated with the latest movies and TV shows - all in one place
            {lastUpdated && (
              <span className="block text-sm text-gray-400 mt-2">
                Updated {lastUpdated.toLocaleDateString()} • {news.length} news items
              </span>
            )}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-[#6c5dd3] text-white'
                  : 'bg-[#2d2a44] text-gray-300 hover:bg-[#39374b] hover:text-white'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Material Wave Loading */}
        {loading && <MaterialWaveLoading />}

        {/* News Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredNews.map(item => (
              <NewsCard 
                key={item.id} 
                news={item} 
                onViewDetails={() => handleNewsClick(item)}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && filteredNews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No news found for this category.</div>
          </div>
        )}
      </div>

      {/* News Detail Modal */}
      {isModalOpen && selectedNews && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#1e1c2f] border border-[#39374b] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedNews.image}
                alt={selectedNews.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 bg-black/80 text-white rounded-full p-2 hover:bg-black/60 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <span>{new Date(selectedNews.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span className="text-purple-400">{selectedNews.source}</span>
                {selectedNews.vote_average && (
                  <>
                    <span>•</span>
                    <span className="text-yellow-400">⭐ {selectedNews.vote_average.toFixed(1)}/10</span>
                  </>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-4">{selectedNews.title}</h2>
              
              <p className="text-gray-300 leading-relaxed text-lg">
                {selectedNews.fullDescription || selectedNews.excerpt}
              </p>
              
              {selectedNews.releaseDate && (
                <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                  <p className="text-blue-400 font-semibold">
                    📅 Release Date: {new Date(selectedNews.releaseDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}