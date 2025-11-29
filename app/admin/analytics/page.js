"use client";
import { useEffect, useState } from 'react';
import ChartComponent from '@/components/ui/ChartComponent';
import FilterBar from './components/FilterBar';

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // Default to 30 days

  useEffect(() => {
    fetchAnalytics();
  }, []);

  useEffect(() => {
    if (analytics) {
      applyDateFilter(dateRange);
    }
  }, [analytics, dateRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyDateFilter = (range) => {
    if (!analytics?.daily) return;

    let daysToShow;
    switch (range) {
      case '7':
        daysToShow = 7;
        break;
      case '14':
        daysToShow = 14;
        break;
      case '30':
        daysToShow = 30;
        break;
      case '90':
        daysToShow = 90;
        break;
      case 'year':
        daysToShow = 365;
        break;
      default:
        daysToShow = 30;
    }

    const filteredDaily = analytics.daily.slice(0, daysToShow).reverse();
    setFilteredData({
      ...analytics,
      daily: filteredDaily
    });
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };

  const handleApplyFilters = () => {
    // Refresh data with current date range
    fetchAnalytics();
  };

  const handleExport = (format) => {
    if (!filteredData) return;

    const dataToExport = {
      dateRange,
      exportDate: new Date().toISOString(),
      dailyVisits: filteredData.daily,
      popularPages: filteredData.popularPages
    };

    if (format === 'json') {
      const dataStr = JSON.stringify(dataToExport, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      downloadBlob(dataBlob, `analytics-${dateRange}days-${new Date().toISOString().split('T')[0]}.json`);
    } else if (format === 'csv') {
      const csvContent = convertToCSV(dataToExport);
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      downloadBlob(dataBlob, `analytics-${dateRange}days-${new Date().toISOString().split('T')[0]}.csv`);
    }
  };

  const downloadBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const convertToCSV = (data) => {
    const headers = ['Date', 'Visits', 'Unique Visitors'];
    const dailyRows = data.dailyVisits.map(day => 
      [day.date, day.visits, day.uniqueVisitors].join(',')
    );
    
    const pageHeaders = ['Page', 'Visits'];
    const pageRows = data.popularPages.map(page => 
      [page._id, page.visits].join(',')
    );

    return [
      'Daily Visits',
      headers.join(','),
      ...dailyRows,
      '',
      'Popular Pages',
      pageHeaders.join(','),
      ...pageRows
    ].join('\n');
  };

  // Prepare chart data for visitors over time
  const getVisitorsChartData = () => {
    if (!filteredData?.daily) return null;

    return {
      labels: filteredData.daily.map(day => {
        const date = new Date(day.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      }),
      datasets: [
        {
          label: 'Total Visits',
          data: filteredData.daily.map(day => day.visits),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Unique Visitors',
          data: filteredData.daily.map(day => day.uniqueVisitors),
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  // Prepare chart data for popular pages
// Prepare chart data for popular pages
const getPopularPagesChartData = () => {
  if (!filteredData?.popularPages) return null;

  // Group admin-related pages
  const groupedPages = filteredData.popularPages.reduce((acc, page) => {
    let pageName = page._id;
    
    // Group all admin pages together
    if (pageName.startsWith('/admin')) {
      const existingAdmin = acc.find(p => p._id === 'Admin');
      if (existingAdmin) {
        existingAdmin.visits += page.visits;
      } else {
        acc.push({
          _id: 'Admin',
          visits: page.visits
        });
      }
      return acc;
    }
    
    // Keep other pages as they are
    acc.push(page);
    return acc;
  }, []);

  // Take top pages after grouping
  const topPages = groupedPages
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  return {
    labels: topPages.map(page => {
      // Use the grouped page names
      let pageName = page._id;
      
      // Format for display
      if (pageName === 'Home') {
        return 'Home';
      }
      if (pageName === 'Watch Movies') {
        return 'Watch Movies';
      }
      if (pageName === 'Admin') {
        return 'Admin';
      }
      
      // Remove leading slash and format other pages
      pageName = pageName.replace(/^\//, '');
      if (pageName === '') return 'Home';
      
      // Capitalize and format
      const formattedName = pageName.split('/')[0];
      const displayName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1);
      
      return displayName.length > 20 ? displayName.substring(0, 20) + '...' : displayName;
    }),
    datasets: [
      {
        label: 'Page Visits',
        data: topPages.map(page => page.visits),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(14, 165, 233, 0.8)',
          'rgba(20, 184, 166, 0.8)',
          'rgba(248, 113, 113, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(34, 197, 94, 0.8)'
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(139, 92, 246)',
          'rgb(236, 72, 153)',
          'rgb(14, 165, 233)',
          'rgb(20, 184, 166)',
          'rgb(248, 113, 113)',
          'rgb(139, 92, 246)',
          'rgb(34, 197, 94)'
        ],
        borderWidth: 1
      }
    ]
  };
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">Analytics Overview</h1>
        <p className="text-gray-400 mt-2">Detailed insights into your platform's performance</p>
      </div>

      {/* Filter Bar */}
      <FilterBar 
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onApplyFilters={handleApplyFilters}
        onExport={handleExport}
        loading={loading}
      />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visitors Over Time Chart */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Visitors Over Time</h2>
              <p className="text-gray-400">Total visits and unique visitors trend</p>
            </div>
            
            {loading ? (
              <div className="space-y-4">
                <div className="h-4 bg-gray-700 rounded w-3/4 animate-pulse"></div>
                <div className="h-64 bg-gray-700 rounded animate-pulse flex items-center justify-center">
                  <div className="text-gray-500">Loading chart...</div>
                </div>
              </div>
            ) : (
              <ChartComponent
                type="line"
                data={getVisitorsChartData()}
                height={350}
                options={{
                  plugins: {
                    legend: {
                      position: 'top',
                    }
                  }
                }}
              />
            )}
          </div>
        </div>

        {/* Popular Pages Chart */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Popular Pages</h2>
            <p className="text-gray-400">Most visited pages on your platform</p>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-64 bg-gray-700 rounded animate-pulse flex items-center justify-center">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            </div>
          ) : (
            <ChartComponent
              type="bar"
              data={getPopularPagesChartData()}
              height={350}
              options={{
                indexAxis: 'y',
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          )}
        </div>

        {/* User Growth Chart (Optional) */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">User Growth</h2>
            <p className="text-gray-400">Unique visitors as a growth indicator</p>
          </div>
          
          {loading ? (
            <div className="space-y-4">
              <div className="h-4 bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-64 bg-gray-700 rounded animate-pulse flex items-center justify-center">
                <div className="text-gray-500">Loading chart...</div>
              </div>
            </div>
          ) : (
            <ChartComponent
              type="line"
              data={getVisitorsChartData() ? {
                ...getVisitorsChartData(),
                datasets: [getVisitorsChartData().datasets[1]] // Only unique visitors
              } : null}
              height={350}
              options={{
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}