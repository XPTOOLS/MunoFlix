"use client";
import { FaCalendar, FaFire } from 'react-icons/fa';

export default function HeatmapChart({ heatmapData, loading }) {
  if (loading) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <FaCalendar className="text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Movie Activity Heatmap</h3>
        </div>
        <div className="h-48 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!heatmapData || heatmapData.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center gap-3 mb-6">
          <FaCalendar className="text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Movie Activity Heatmap</h3>
        </div>
        <div className="h-48 flex items-center justify-center text-gray-400">
          No activity data available
        </div>
      </div>
    );
  }

  const getIntensityColor = (intensity) => {
    if (intensity === 0) return 'bg-gray-700';
    if (intensity < 25) return 'bg-green-900';
    if (intensity < 50) return 'bg-green-600';
    if (intensity < 75) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getIntensityLabel = (intensity) => {
    if (intensity === 0) return 'No activity';
    if (intensity < 25) return 'Low';
    if (intensity < 50) return 'Medium';
    if (intensity < 75) return 'High';
    return 'Very High';
  };

  // Group by weeks for better visualization
  const weeks = [];
  let currentWeek = [];
  
  heatmapData.forEach((day, index) => {
    currentWeek.push(day);
    
    // Start new week every 7 days or at the end
    if (currentWeek.length === 7 || index === heatmapData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Get day labels
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FaCalendar className="text-orange-400" />
          <h3 className="text-lg font-semibold text-white">Movie Activity Heatmap</h3>
        </div>
        <div className="text-sm text-gray-400">
          Last {heatmapData.length} days
        </div>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-2">
            {dayLabels.map((label, index) => (
              <div key={label} className="h-6 flex items-center justify-center text-xs text-gray-400 font-medium">
                {index === 0 || index === 3 || index === 6 ? label : ''}
              </div>
            ))}
          </div>

          {/* Weeks */}
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={`${weekIndex}-${dayIndex}`}
                  className={`w-6 h-6 rounded-sm border border-gray-600 ${getIntensityColor(day.intensity)} 
                    transition-all duration-200 hover:scale-125 hover:z-10 relative group`}
                  title={`${day.date}: ${day.views} views, ${day.uniqueViewers} viewers, ${getIntensityLabel(day.intensity)} activity`}
                >
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-20">
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 text-xs min-w-48">
                      <div className="font-semibold text-white mb-1">{day.date}</div>
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Views:</span>
                          <span className="text-white">{day.views}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Viewers:</span>
                          <span className="text-green-400">{day.uniqueViewers}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Watch Time:</span>
                          <span className="text-purple-400">{(day.watchTime / 3600).toFixed(1)}h</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Activity:</span>
                          <span className={`
                            ${day.intensity < 25 ? 'text-green-400' : ''}
                            ${day.intensity >= 25 && day.intensity < 50 ? 'text-green-300' : ''}
                            ${day.intensity >= 50 && day.intensity < 75 ? 'text-orange-400' : ''}
                            ${day.intensity >= 75 ? 'text-red-400' : ''}
                          `}>
                            {getIntensityLabel(day.intensity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-gray-700 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-900 rounded-sm"></div>
            <div className="w-4 h-4 bg-green-600 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-red-500 rounded-sm"></div>
          </div>
          <span>More</span>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <FaFire className="text-orange-400" />
          <span>Activity Intensity</span>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-700/50">
        <div className="text-center">
          <div className="text-white font-bold text-lg">
            {heatmapData.reduce((sum, day) => sum + day.views, 0)}
          </div>
          <div className="text-gray-400 text-sm">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold text-lg">
            {Math.round(heatmapData.reduce((sum, day) => sum + day.watchTime, 0) / 3600)}
          </div>
          <div className="text-gray-400 text-sm">Watch Hours</div>
        </div>
        <div className="text-center">
          <div className="text-white font-bold text-lg">
            {new Set(heatmapData.flatMap(day => Array.from(day.uniqueViewers))).size}
          </div>
          <div className="text-gray-400 text-sm">Unique Viewers</div>
        </div>
      </div>
    </div>
  );
}