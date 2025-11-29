"use client";
import { motion } from "framer-motion";

export default function StatCard({ 
  icon, 
  value, 
  label, 
  trend, 
  loading = false,
  delay = 0 
}) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 bg-gray-700 rounded-lg"></div>
          <div className="w-16 h-4 bg-gray-700 rounded"></div>
        </div>
        <div className="mt-4">
          <div className="w-20 h-8 bg-gray-700 rounded mb-2"></div>
          <div className="w-24 h-4 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="text-2xl text-gray-400">
          {icon}
        </div>
        {trend && (
          <span className={`text-sm font-medium px-2 py-1 rounded-full ${
            trend > 0 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      
      <div>
        <h3 className="text-3xl font-bold text-white mb-1">
          {value?.toLocaleString() || '0'}
        </h3>
        <p className="text-gray-400 text-sm">
          {label}
        </p>
      </div>
    </motion.div>
  );
}