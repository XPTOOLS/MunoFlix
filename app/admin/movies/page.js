"use client";
import { useEffect, useState } from 'react';
import MovieStats from '@/components/admin/movies/MovieStats';
import MovieTable from '@/components/admin/movies/MovieTable';
import MovieFilters from '@/components/admin/movies/MovieFilters';
import MovieDetailsModal from '@/components/admin/movies/MovieDetailsModal';
import HeatmapChart from '@/components/admin/movies/HeatmapChart';
import ChartComponent from '@/components/ui/ChartComponent';
import { FaFilm, FaChartBar, FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function MoviesPage() {
  const [statistics, setStatistics] = useState({});
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [heatmapData, setHeatmapData] = useState(null);
  const [heatmapLoading, setHeatmapLoading] = useState(true);
  
  // Filters state
  const [filters, setFilters] = useState({
    range: 'today',
    sortBy: 'popularity',
    sortOrder: 'desc'
  });

  useEffect(() => {
    fetchMovieData();
    fetchHeatmapData();
  }, [filters.range]);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      
      // Fetch statistics
      const statsResponse = await fetch(`/api/movies/stats?range=${filters.range}`);
      const statsData = await statsResponse.json();
      
      if (!statsResponse.ok) {
        throw new Error(statsData.error || 'Failed to fetch movie statistics');
      }
      
      setStatistics(statsData.statistics || {});
      setTopMovies(statsData.topMovies || []);

      // Generate chart data
      if (statsData.topMovies && statsData.topMovies.length > 0) {
        generateChartData(statsData.topMovies.slice(0, 8));
      }
      
    } catch (error) {
      console.error('Failed to fetch movie data:', error);
      toast.error(`Failed to load movie analytics: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmapData = async () => {
    try {
      setHeatmapLoading(true);
      const response = await fetch('/api/movies/heatmap?days=30');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch heatmap data');
      }
      
      setHeatmapData(data.heatmapData || []);
    } catch (error) {
      console.error('Failed to fetch heatmap data:', error);
      toast.error(`Failed to load heatmap: ${error.message}`);
    } finally {
      setHeatmapLoading(false);
    }
  };

  const fetchMovieDetails = async (movie) => {
    try {
      setDetailsLoading(true);
      setSelectedMovie(movie);
      
      const response = await fetch(`/api/admin/movies/${movie.movieId}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch movie details');
      }
      
      setMovieDetails(data);
      setIsModalOpen(true);
      
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
      toast.error(`Failed to load movie details: ${error.message}`);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleViewDetails = async (movie) => {
    await fetchMovieDetails(movie);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const generateChartData = (movies) => {
    const chartData = {
      labels: movies.map(movie => movie.title.length > 20 ? movie.title.substring(0, 20) + '...' : movie.title),
      datasets: [
        {
          label: 'Views',
          data: movies.map(movie => movie.views),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 2,
        },
        {
          label: 'Unique Viewers',
          data: movies.map(movie => movie.uniqueViewers),
          backgroundColor: 'rgba(16, 185, 129, 0.6)',
          borderColor: 'rgba(16, 185, 129, 1)',
          borderWidth: 2,
        }
      ]
    };
    setChartData(chartData);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const getTopMovie = () => {
    return topMovies.length > 0 ? topMovies[0] : null;
  };

  const topMovie = getTopMovie();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Movies Analytics</h1>
        <p className="text-gray-400 mt-2">Track movie usage and viewer engagement analytics</p>
      </div>

      {/* Statistics Cards */}
      <MovieStats statistics={statistics} loading={loading} />

      {/* Top Movie Highlight */}
      {topMovie && !loading && (
        <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <FaFire className="text-purple-400 text-xl" />
              </div>
              <div>
                <div className="text-sm text-purple-300 font-semibold">Most Watched {filters.range === 'today' ? 'Today' : filters.range === 'week' ? 'This Week' : filters.range === 'month' ? 'This Month' : 'All Time'}</div>
                <div className="text-white font-bold text-lg">{topMovie.title}</div>
                <div className="text-purple-200 text-sm mt-1">
                  {topMovie.views} views • {topMovie.uniqueViewers} unique viewers • {(topMovie.totalWatchTime / 3600).toFixed(1)} hours watched
                </div>
              </div>
            </div>
            {topMovie.poster && (
              <img
                src={topMovie.poster}
                alt={topMovie.title}
                className="w-16 h-20 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/placeholder-backdrop.jpg';
                }}
              />
            )}
          </div>
        </div>
      )}

      {/* Filters */}
      <MovieFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onRefresh={fetchMovieData}
        loading={loading}
      />

      {/* Heatmap Chart */}
      <HeatmapChart 
        heatmapData={heatmapData}
        loading={heatmapLoading}
      />

      {/* Chart */}
      {chartData && !loading && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="flex items-center gap-3 mb-6">
            <FaChartBar className="text-blue-400" />
            <h3 className="text-lg font-semibold text-white">Top Movies Performance</h3>
          </div>
          <div className="h-80">
            <ChartComponent
              data={chartData}
              type="bar"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top',
                    labels: {
                      color: '#9CA3AF'
                    }
                  },
                  title: {
                    display: true,
                    text: 'Views vs Unique Viewers',
                    color: '#FFFFFF'
                  }
                },
                scales: {
                  x: {
                    ticks: {
                      color: '#9CA3AF'
                    },
                    grid: {
                      color: 'rgba(75, 85, 99, 0.3)'
                    }
                  },
                  y: {
                    ticks: {
                      color: '#9CA3AF'
                    },
                    grid: {
                      color: 'rgba(75, 85, 99, 0.3)'
                    }
                  }
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Movies Table */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <FaFilm className="text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Movies Analytics</h3>
          <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
            {topMovies.length} movies
          </span>
        </div>
        <MovieTable
          movies={topMovies}
          loading={loading}
          onViewDetails={handleViewDetails}
        />
      </div>

      {/* Movie Details Modal */}
      <MovieDetailsModal
        movie={selectedMovie}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        movieDetails={movieDetails}
      />
    </div>
  );
}