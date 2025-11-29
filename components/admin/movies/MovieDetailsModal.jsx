"use client";
import { FaTimes, FaEye, FaUsers, FaClock, FaChartLine, FaPlay, FaCalendar } from 'react-icons/fa';
import ChartComponent from '@/components/ui/ChartComponent';

export default function MovieDetailsModal({ movie, isOpen, onClose, movieDetails }) {
  if (!isOpen || !movie) return null;

  const { dailyStats, playerStats, watchTimeData } = movieDetails || {};

  // Daily views chart data
  const dailyViewsChart = dailyStats ? {
    labels: dailyStats.map(day => day.date),
    datasets: [
      {
        label: 'Daily Views',
        data: dailyStats.map(day => day.views),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  } : null;

  // Watch time chart data
  const watchTimeChart = watchTimeData ? {
    labels: watchTimeData.map(day => day.date),
    datasets: [
      {
        label: 'Watch Time (hours)',
        data: watchTimeData.map(day => day.watchTime / 3600),
        backgroundColor: 'rgba(139, 92, 246, 0.6)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  } : null;

  // Player usage chart data
  const playerUsageChart = playerStats ? {
    labels: Object.keys(playerStats),
    datasets: [
      {
        label: 'Player Usage',
        data: Object.values(playerStats),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
        ],
        borderWidth: 2
      }
    ]
  } : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-4">
            {movie.poster && (
              <img
                src={movie.poster}
                alt={movie.title}
                className="w-16 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/images/placeholder-backdrop.jpg';
                }}
              />
            )}
            <div>
              <h2 className="text-2xl font-bold text-white">{movie.title}</h2>
              <p className="text-gray-400">Movie ID: {movie.movieId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaEye className="text-blue-400 mx-auto mb-2" size={20} />
              <div className="text-white font-bold text-xl">{movie.views}</div>
              <div className="text-gray-400 text-sm">Total Views</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaUsers className="text-green-400 mx-auto mb-2" size={20} />
              <div className="text-white font-bold text-xl">{movie.uniqueViewers}</div>
              <div className="text-gray-400 text-sm">Unique Viewers</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaClock className="text-purple-400 mx-auto mb-2" size={20} />
              <div className="text-white font-bold text-xl">{(movie.totalWatchTime / 3600).toFixed(1)}</div>
              <div className="text-gray-400 text-sm">Watch Hours</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-4 text-center">
              <FaChartLine className="text-yellow-400 mx-auto mb-2" size={20} />
              <div className="text-white font-bold text-xl">{movie.avgWatchTime}</div>
              <div className="text-gray-400 text-sm">Avg Duration (min)</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Views Chart */}
            {dailyViewsChart && (
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaCalendar className="text-blue-400" />
                  Daily Views (Last 14 Days)
                </h3>
                <div className="h-64">
                  <ChartComponent
                    data={dailyViewsChart}
                    type="line"
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: { color: '#9CA3AF' }
                        }
                      },
                      scales: {
                        x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(75, 85, 99, 0.3)' } },
                        y: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(75, 85, 99, 0.3)' } }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Watch Time Chart */}
            {watchTimeChart && (
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaClock className="text-purple-400" />
                  Watch Time Trend (Last 14 Days)
                </h3>
                <div className="h-64">
                  <ChartComponent
                    data={watchTimeChart}
                    type="line"
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: { color: '#9CA3AF' }
                        }
                      },
                      scales: {
                        x: { ticks: { color: '#9CA3AF' }, grid: { color: 'rgba(75, 85, 99, 0.3)' } },
                        y: { 
                          ticks: { color: '#9CA3AF' }, 
                          grid: { color: 'rgba(75, 85, 99, 0.3)' },
                          title: { display: true, text: 'Hours', color: '#9CA3AF' }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Player Usage Chart */}
            {playerUsageChart && (
              <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50 lg:col-span-2">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <FaPlay className="text-green-400" />
                  Player Usage Distribution
                </h3>
                <div className="h-64">
                  <ChartComponent
                    data={playerUsageChart}
                    type="doughnut"
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'right',
                          labels: { color: '#9CA3AF', padding: 20 }
                        }
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Player Statistics */}
          {playerStats && Object.keys(playerStats).length > 0 && (
            <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
              <h3 className="text-lg font-semibold text-white mb-4">Player Usage Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(playerStats).map(([player, count]) => (
                  <div key={player} className="bg-gray-600/30 rounded-lg p-3">
                    <div className="text-white font-semibold capitalize">{player}</div>
                    <div className="text-gray-400 text-sm">{count} sessions</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}