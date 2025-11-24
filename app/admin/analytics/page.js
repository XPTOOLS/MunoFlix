"use client";
import { useEffect, useState } from 'react';

export default function AnalyticsPage() {
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
      <h1 className="text-3xl font-bold text-white">Analytics</h1>
      
      {/* Time Period Tabs */}
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">Daily</button>
        <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded">Weekly</button>
        <button className="px-4 py-2 bg-gray-700 text-gray-300 rounded">Monthly</button>
      </div>

      {/* Analytics Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Daily Visits */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Daily Visits</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
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

        {/* Weekly Visits */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Weekly Visits</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {analytics?.weekly.map((week) => (
              <div key={week.week} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                <span className="text-gray-300">{week.week}</span>
                <div className="text-right">
                  <div className="text-white font-semibold">{week.visits} visits</div>
                  <div className="text-gray-400 text-sm">{week.uniqueVisitors} unique</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Visits */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Monthly Visits</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {analytics?.monthly.map((month) => (
              <div key={month.month} className="flex justify-between items-center p-2 hover:bg-gray-700 rounded">
                <span className="text-gray-300">{month.month}</span>
                <div className="text-right">
                  <div className="text-white font-semibold">{month.visits} visits</div>
                  <div className="text-gray-400 text-sm">{month.uniqueVisitors} unique</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}