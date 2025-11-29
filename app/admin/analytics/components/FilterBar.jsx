"use client";
import { motion } from "framer-motion";
import { FaFilter, FaCalendarAlt, FaFileExport, FaFileCsv } from "react-icons/fa";

export default function FilterBar({ 
  dateRange, 
  onDateRangeChange, 
  onApplyFilters,
  onExport, 
  loading = false 
}) {
  const dateRangeOptions = [
    { value: '7', label: 'Last 7 Days' },
    { value: '14', label: 'Last 14 Days' },
    { value: '30', label: 'Last 30 Days' },
    { value: '90', label: 'Last 90 Days' },
    { value: 'year', label: 'This Year' }
  ];

  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 animate-pulse">
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="w-6 h-6 bg-gray-700 rounded"></div>
            <div className="w-32 h-4 bg-gray-700 rounded"></div>
            <div className="w-40 h-10 bg-gray-700 rounded"></div>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="w-24 h-10 bg-gray-700 rounded"></div>
            <div className="w-24 h-10 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
    >
      {/* Desktop Layout */}
      <div className="hidden sm:flex gap-4 items-center justify-between">
        {/* Filter Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <FaFilter className="text-lg" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaCalendarAlt className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Export Section - Desktop only */}
        <div className="flex gap-3">
          <button
            onClick={onApplyFilters}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <FaFilter className="text-sm" />
            Apply Filters
          </button>

          <button
            onClick={() => onExport('json')}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <FaFileExport className="text-sm" />
            Export JSON
          </button>

          <button
            onClick={() => onExport('csv')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200 text-sm font-medium"
          >
            <FaFileCsv className="text-sm" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="sm:hidden space-y-4">
        {/* Filter Section - Mobile */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <FaFilter className="text-lg" />
            <span className="text-sm font-medium">Filters</span>
          </div>
          
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => onDateRangeChange(e.target.value)}
              className="bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-8"
            >
              {dateRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <FaCalendarAlt className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs pointer-events-none" />
          </div>
        </div>

        {/* Buttons Section - Mobile */}
        <div className="flex gap-2">
          <button
            onClick={onApplyFilters}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors duration-200"
          >
            <FaFilter className="text-xs" />
            Apply
          </button>

          <button
            onClick={() => onExport('json')}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors duration-200"
          >
            <FaFileExport className="text-xs" />
            JSON
          </button>

          <button
            onClick={() => onExport('csv')}
            className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors duration-200"
          >
            <FaFileCsv className="text-xs" />
            CSV
          </button>
        </div>
      </div>
    </motion.div>
  );
}