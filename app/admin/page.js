"use client";
import { useEffect, useState } from 'react';
import StatCard from '@/components/ui/StatCard';
import ChartComponent from '@/components/ui/ChartComponent';
import { FaUsers, FaEye, FaChartLine, FaUserPlus } from 'react-icons/fa';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics data
      const analyticsResponse = await fetch('/api/admin/analytics');
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);

      // Fetch users data
      const usersResponse = await fetch('/api/admin/users');
      const usersData = await usersResponse.json();
      setUsers(usersData);

    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const totalVisitors = analytics?.daily?.reduce((sum, day) => sum + day.visits, 0) || 0;
  const uniqueVisitors = analytics?.daily?.reduce((sum, day) => sum + day.uniqueVisitors, 0) || 0;
  const activeUsers = users?.statistics?.activeUsers || 0;
  const newUsers = users?.statistics?.newUsersThisWeek || 0;

  // Prepare chart data for visitors
  const getChartData = () => {
    if (!analytics?.daily) return null;

    const last14Days = analytics.daily.slice(0, 14).reverse();
    
    return {
      labels: last14Days.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Visitors',
          data: last14Days.map(day => day.visits),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Unique Visitors',
          data: last14Days.map(day => day.uniqueVisitors),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-gray-400 mt-2">Welcome to your streaming platform admin panel</p>
        </div>

        {/* Loading Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard loading={true} />
          <StatCard loading={true} />
          <StatCard loading={true} />
          <StatCard loading={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome to your streaming platform admin panel</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={<FaEye className="text-blue-400" />}
          value={totalVisitors}
          label="Total Visitors"
          loading={loading}
          delay={0}
        />
        <StatCard
          icon={<FaChartLine className="text-purple-400" />}
          value={uniqueVisitors}
          label="Unique Visitors"
          loading={loading}
          delay={0.1}
        />
        <StatCard
          icon={<FaUsers className="text-green-400" />}
          value={activeUsers}
          label="Active Users"
          loading={loading}
          delay={0.2}
        />
        <StatCard
          icon={<FaUserPlus className="text-yellow-400" />}
          value={newUsers}
          label="New Users This Week"
          loading={loading}
          delay={0.3}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Chart */}
        <div className="lg:col-span-2">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-white mb-2">Visitor Analytics</h2>
            <p className="text-gray-400">Website traffic over the last 14 days</p>
          </div>
          <ChartComponent
            type="line"
            data={getChartData()}
            height={350}
          />
        </div>

        {/* Placeholder for Popular Content */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Popular Content</h3>
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">Popular movies and series chart coming soon</div>
          </div>
        </div>

        {/* Placeholder for Recent Activity */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="text-center py-8">
            <div className="text-gray-500 text-sm">User activity log coming soon</div>
          </div>
        </div>
      </div>
    </div>
  );
}