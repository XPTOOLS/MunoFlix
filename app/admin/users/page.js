"use client";
import { useEffect, useState } from 'react';
import UserTable from '@/components/admin/users/UserTable';
import UserFilters from '@/components/admin/users/UserFilters';
import UserModal from '@/components/admin/users/UserModal';
import StatCard from '@/components/ui/StatCard';
import { FaUsers, FaUserCheck, FaUserPlus, FaUserSlash, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    joined: 'all',
    page: 1,
    limit: 20
  });

  // Pagination state
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 20,
    totalUsers: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false
  });

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await fetch(`/api/admin/users?${queryParams}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users');
      }
      
      setUsers(data.users || []);
      setStatistics(data.statistics || {});
      setPagination(data.pagination || {});
      
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error(`Failed to load users: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedUsers(new Set()); // Clear selection when filters change
  };

  const handleSelectUser = (userId) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === users.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(users.map(user => user.id)));
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleBanUser = async (userId) => {
    if (!confirm('Are you sure you want to ban this user?')) return;
    
    try {
      const response = await fetch('/api/admin/users/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success(`User banned successfully. They will see a ban notification.`);
        await fetchUsers(); // Refresh data
        setSelectedUsers(new Set()); // Clear selection
      } else {
        throw new Error(data.error || 'Failed to ban user');
      }
    } catch (error) {
      console.error('Error banning user:', error);
      toast.error(`Failed to ban user: ${error.message}`);
    }
  };

  const handleUnbanUser = async (userId) => {
    if (!confirm('Are you sure you want to unban this user?')) return;
    
    try {
      const response = await fetch('/api/admin/users/unban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('User unbanned successfully');
        await fetchUsers(); // Refresh data
        setSelectedUsers(new Set()); // Clear selection
      } else {
        throw new Error(data.error || 'Failed to unban user');
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      toast.error(`Failed to unban user: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone and will remove the user from both the database and authentication system.')) return;
    
    try {
      const response = await fetch('/api/admin/users/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        toast.success('User deleted successfully from both database and authentication');
        await fetchUsers(); // Refresh data
        setSelectedUsers(new Set()); // Clear selection
      } else {
        throw new Error(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  const handleBulkBan = async () => {
    if (selectedUsers.size === 0) return;
    if (!confirm(`Are you sure you want to ban ${selectedUsers.size} users? They will receive ban notifications.`)) return;
    
    try {
      const promises = Array.from(selectedUsers).map(userId =>
        fetch('/api/admin/users/ban', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
      );
      
      const results = await Promise.all(promises);
      const failedBans = results.filter(result => !result.ok);
      
      if (failedBans.length === 0) {
        toast.success(`Successfully banned ${selectedUsers.size} users`);
        await fetchUsers();
        setSelectedUsers(new Set());
      } else {
        throw new Error(`${failedBans.length} users failed to ban`);
      }
    } catch (error) {
      console.error('Error in bulk ban:', error);
      toast.error(`Error banning users: ${error.message}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedUsers.size === 0) return;
    if (!confirm(`Are you sure you want to delete ${selectedUsers.size} users? This cannot be undone and will remove them from both database and authentication.`)) return;
    
    try {
      const promises = Array.from(selectedUsers).map(userId =>
        fetch('/api/admin/users/delete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId })
        })
      );
      
      const results = await Promise.all(promises);
      const failedDeletes = results.filter(result => !result.ok);
      
      if (failedDeletes.length === 0) {
        toast.success(`Successfully deleted ${selectedUsers.size} users`);
        await fetchUsers();
        setSelectedUsers(new Set());
      } else {
        throw new Error(`${failedDeletes.length} users failed to delete`);
      }
    } catch (error) {
      console.error('Error in bulk delete:', error);
      toast.error(`Error deleting users: ${error.message}`);
    }
  };

  const handleExport = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.status !== 'all') queryParams.append('status', filters.status);
      if (filters.joined !== 'all') queryParams.append('joined', filters.joined);

      const response = await fetch(`/api/admin/users/export?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to export users');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Users exported successfully');
    } catch (error) {
      console.error('Error exporting users:', error);
      toast.error('Error exporting users');
    }
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Users Management</h1>
        <p className="text-gray-400 mt-2">Manage your platform users and their permissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaUsers className="text-blue-400" />}
          value={statistics.totalUsers || 0}
          label="Total Users"
          loading={loading}
          delay={0}
        />
        <StatCard
          icon={<FaUserCheck className="text-green-400" />}
          value={statistics.activeUsers || 0}
          label="Active Users"
          loading={loading}
          delay={0.1}
        />
        <StatCard
          icon={<FaUserPlus className="text-purple-400" />}
          value={statistics.newUsersThisWeek || 0}
          label="New This Week"
          loading={loading}
          delay={0.2}
        />
        <StatCard
          icon={<FaUserSlash className="text-red-400" />}
          value={statistics.bannedUsers || 0}
          label="Banned Users"
          loading={loading}
          delay={0.3}
        />
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-blue-400 font-medium">
              {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBulkBan}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaUserSlash size={14} />
                Ban Selected
              </button>
              <button
                onClick={handleBulkDelete}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaTrash size={14} />
                Delete Selected
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <UserFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onExport={handleExport}
        onRefresh={fetchUsers}
        loading={loading}
      />

      {/* User Table */}
      <UserTable
        users={users}
        selectedUsers={selectedUsers}
        onSelectUser={handleSelectUser}
        onSelectAll={handleSelectAll}
        onViewUser={handleViewUser}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onDeleteUser={handleDeleteUser}
        loading={loading}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50">
          <div className="text-gray-400 text-sm">
            Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
            {Math.min(pagination.page * pagination.pageSize, pagination.totalUsers)} of{' '}
            {pagination.totalUsers} users
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev || loading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg text-sm font-medium">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.hasNext || loading}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* User Modal */}
      <UserModal
        user={selectedUser}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onDeleteUser={handleDeleteUser}
      />
    </div>
  );
}