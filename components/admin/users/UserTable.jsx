"use client";
import { useState } from 'react';
import { FaEye, FaBan, FaTrash, FaCheck, FaUserSlash } from 'react-icons/fa';

export default function UserTable({ 
  users, 
  selectedUsers, 
  onSelectUser, 
  onSelectAll, 
  onViewUser, 
  onBanUser, 
  onUnbanUser, 
  onDeleteUser,
  loading = false 
}) {
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle dates
    if (sortField === 'createdAt' || sortField === 'lastActive') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }
    
    // Handle strings
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="h-6 bg-gray-700 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-8"></div>
              <div className="h-10 bg-gray-700 rounded-full w-10"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                <div className="h-3 bg-gray-700 rounded w-1/3"></div>
              </div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-700 rounded w-24"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 overflow-hidden">
      {/* Table Header */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-white">Users Management</h2>
        <p className="text-gray-400 text-sm mt-1">
          {users.length} user{users.length !== 1 ? 's' : ''} displayed
          {selectedUsers.size > 0 && ` • ${selectedUsers.size} selected`}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700/50 border-b border-gray-600">
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={onSelectAll}
                  className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                />
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('displayName')}
              >
                <div className="flex items-center gap-2">
                  User {getSortIcon('displayName')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-2">
                  Status {getSortIcon('status')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('createdAt')}
              >
                <div className="flex items-center gap-2">
                  Joined {getSortIcon('createdAt')}
                </div>
              </th>
              <th 
                className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort('lastActive')}
              >
                <div className="flex items-center gap-2">
                  Last Active {getSortIcon('lastActive')}
                </div>
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {sortedUsers.map((user) => (
              <tr 
                key={user.id} 
                className={`hover:bg-gray-700/30 transition-colors ${
                  selectedUsers.has(user.id) ? 'bg-blue-500/10' : ''
                }`}
              >
                {/* Checkbox */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.has(user.id)}
                    onChange={() => onSelectUser(user.id)}
                    className="rounded border-gray-600 bg-gray-700 text-blue-500 focus:ring-blue-500"
                  />
                </td>

                {/* User Info */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-white">
                        {user.displayName || 'No Name'}
                        {user.username && (
                          <span className="text-gray-400 text-xs ml-2">@{user.username}</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-400">
                        {user.email}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        ID: {user.id.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.status === 'banned' 
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                        : user.isActive
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                    }`}>
                      {user.status === 'banned' ? 'Banned' : user.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {user.status === 'banned' && (
                      <span className="text-xs text-red-400">
                        <FaUserSlash className="inline mr-1" size={10} />
                        Banned
                      </span>
                    )}
                  </div>
                </td>

                {/* Join Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  <div className="text-xs text-gray-500">
                    {user.createdAt ? new Date(user.createdAt).toLocaleTimeString() : ''}
                  </div>
                </td>

                {/* Last Active */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                  {user.lastActive && (
                    <div className="text-xs text-gray-500">
                      {new Date(user.lastActive).toLocaleTimeString()}
                    </div>
                  )}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onViewUser(user)}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors duration-200"
                    >
                      <FaEye size={10} />
                      View
                    </button>
                    
                    {user.status === 'banned' ? (
                      <button
                        onClick={() => onUnbanUser(user.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors duration-200"
                      >
                        <FaCheck size={10} />
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => onBanUser(user.id)}
                        className="flex items-center gap-1 px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs transition-colors duration-200"
                      >
                        <FaBan size={10} />
                        Ban
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDeleteUser(user.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors duration-200"
                    >
                      <FaTrash size={10} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty State */}
        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">No users found</div>
            <div className="text-gray-500 text-sm mt-2">
              Try adjusting your search or filters
            </div>
          </div>
        )}
      </div>
    </div>
  );
}