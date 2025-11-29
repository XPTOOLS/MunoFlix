"use client";
import { FaEye, FaClock, FaUsers, FaChartLine, FaExternalLinkAlt } from 'react-icons/fa';

export default function MovieTable({ movies, loading, onViewDetails }) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading movies data...</p>
        </div>
      </div>
    );
  }

  if (!movies || movies.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-8 text-center">
        <div className="text-gray-400 text-lg">No movie data available</div>
        <p className="text-gray-500 text-sm mt-2">Movie analytics will appear here as users watch content</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700/50">
              <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Movie</th>
              <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <FaEye className="text-blue-400" />
                  Views
                </div>
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <FaUsers className="text-green-400" />
                  Unique Viewers
                </div>
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <FaClock className="text-purple-400" />
                  Watch Time (hrs)
                </div>
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-yellow-400" />
                  Avg Duration
                </div>
              </th>
              <th className="text-left py-4 px-6 text-gray-400 font-semibold text-sm">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/30">
            {movies.map((movie, index) => (
              <tr key={movie.movieId} className="hover:bg-gray-700/30 transition-colors">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-4">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = '/images/placeholder-backdrop.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-12 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    <div>
                      <div className="font-medium text-white text-sm line-clamp-2">
                        {movie.title}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        ID: {movie.movieId}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-white font-semibold">{movie.views}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-green-400 font-semibold">{movie.uniqueViewers}</div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-purple-400 font-semibold">
                    {(movie.totalWatchTime / 3600).toFixed(2)}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div className="text-yellow-400 font-semibold">{movie.avgWatchTime} min</div>
                </td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => onViewDetails(movie)}
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
                  >
                    <FaExternalLinkAlt size={12} />
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}