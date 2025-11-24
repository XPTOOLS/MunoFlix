"use client";
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Total Visits Today</h3>
          <p className="text-2xl font-bold text-white">
            {analytics?.daily[0]?.visits || 0}
          </p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Unique Visitors Today</h3>
          <p className="text-2xl font-bold text-white">
            {analytics?.daily[0]?.uniqueVisitors || 0}
          </p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-gray-400 text-sm">Most Popular Page</h3>
          <p className="text-xl font-bold text-white truncate">
            {analytics?.popularPages[0]?._id || 'N/A'}
          </p>
        </div>
      </div>

      {/* Analytics Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Visits */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Daily Visits (Last 30 days)</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {analytics?.daily.map((day) => (
              <div key={day.date} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                <span className="text-gray-300">{day.date}</span>
                <div className="text-right">
                  <div className="text-white font-semibold">{day.visits} visits</div>
                  <div className="text-gray-400 text-sm">{day.uniqueVisitors} unique</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Pages */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Popular Pages</h3>
          <div className="space-y-2">
            {analytics?.popularPages.map((page, index) => (
              <div key={page._id} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                <span className="text-gray-300 truncate">{page._id}</span>
                <span className="text-white font-semibold">{page.visits}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}