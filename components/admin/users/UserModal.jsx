"use client";
import { FaTimes, FaBan, FaCheck, FaTrash, FaUser, FaEnvelope, FaCalendar, FaClock, FaExclamationTriangle } from 'react-icons/fa';

export default function UserModal({ 
  user, 
  isOpen, 
  onClose, 
  onBanUser, 
  onUnbanUser, 
  onDeleteUser 
}) {
  if (!isOpen || !user) return null;

  const getStatusColor = () => {
    if (user.status === 'banned') return 'text-red-400 bg-red-500/20 border-red-500/30';
    if (user.isActive) return 'text-green-400 bg-green-500/20 border-green-500/30';
    return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
  };

  const getStatusText = () => {
    if (user.status === 'banned') return 'Banned';
    if (user.isActive) return 'Active';
    return 'Inactive';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700/50 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {user.displayName || 'No Name'}
              </h2>
              <p className="text-gray-400 text-sm">
                User Details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaUser className="text-blue-400" />
                Basic Information
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Username</label>
                  <div className="text-white font-medium mt-1">
                    {user.displayName || 'No Name'}
                    {user.username && (
                      <span className="text-gray-400 text-sm ml-2">@{user.username}</span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Email</label>
                  <div className="text-white font-medium mt-1 flex items-center gap-2">
                    <FaEnvelope className="text-gray-400" size={14} />
                    {user.email || 'No email'}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">User ID</label>
                  <div className="text-gray-300 font-mono text-sm mt-1 bg-gray-700/50 p-2 rounded border border-gray-600">
                    {user.id}
                  </div>
                </div>
              </div>
            </div>

            {/* Status & Activity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <FaClock className="text-green-400" />
                Status & Activity
              </h3>
              
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-400">Status</label>
                  <div className="mt-1">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor()}`}>
                      {user.status === 'banned' && <FaBan size={12} />}
                      {user.status !== 'banned' && user.isActive && <FaCheck size={12} />}
                      {getStatusText()}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <FaCalendar className="text-purple-400" size={12} />
                    Joined Date
                  </label>
                  <div className="text-white font-medium mt-1">
                    {formatDate(user.createdAt)}
                  </div>
                </div>
                
                <div>
                  <label className="text-sm text-gray-400">Last Active</label>
                  <div className="text-white font-medium mt-1">
                    {formatDate(user.lastActive)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Summary */}
          <div className="bg-gray-700/30 rounded-lg p-4 border border-gray-600/50">
            <h4 className="text-md font-semibold text-white mb-3">Activity Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-600/30 rounded border border-gray-500/30">
                <div className="text-gray-400">Status</div>
                <div className={`font-semibold mt-1 ${
                  user.status === 'banned' ? 'text-red-400' : 
                  user.isActive ? 'text-green-400' : 'text-gray-400'
                }`}>
                  {getStatusText()}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-600/30 rounded border border-gray-500/30">
                <div className="text-gray-400">Account Age</div>
                <div className="text-white font-semibold mt-1">
                  {user.createdAt ? 
                    Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24)) + ' days' : 
                    'Unknown'
                  }
                </div>
              </div>
            </div>
          </div>

          {/* Warning for Banned Users */}
          {user.status === 'banned' && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FaExclamationTriangle className="text-red-400 flex-shrink-0" />
                <div>
                  <div className="text-red-400 font-semibold">This user is banned</div>
                  <div className="text-red-300 text-sm mt-1">
                    Banned users cannot access the platform. You can unban them to restore access.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end p-6 border-t border-gray-700 bg-gray-750/50">
          {user.status === 'banned' ? (
            <button
              onClick={() => {
                onUnbanUser(user.id);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <FaCheck size={14} />
              Unban User
            </button>
          ) : (
            <button
              onClick={() => {
                onBanUser(user.id);
                onClose();
              }}
              className="flex items-center justify-center gap-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              <FaBan size={14} />
              Ban User
            </button>
          )}
          
          <button
            onClick={() => {
              onDeleteUser(user.id);
              onClose();
            }}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <FaTrash size={14} />
            Delete User
          </button>
          
          <button
            onClick={onClose}
            className="flex items-center justify-center gap-2 px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}