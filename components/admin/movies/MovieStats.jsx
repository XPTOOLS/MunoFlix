"use client";
import StatCard from '@/components/ui/StatCard';
import { FaPlay, FaUsers, FaClock, FaChartLine } from 'react-icons/fa';

export default function MovieStats({ statistics, loading }) {
  const stats = [
    {
      icon: <FaPlay className="text-blue-400" />,
      value: statistics?.totalViews || 0,
      label: "Total Views",
      loading: loading,
      delay: 0
    },
    {
      icon: <FaUsers className="text-green-400" />,
      value: statistics?.uniqueViewers || 0,
      label: "Unique Viewers",
      loading: loading,
      delay: 0.1
    },
    {
      icon: <FaClock className="text-purple-400" />,
      value: statistics?.totalWatchHours || 0,
      label: "Watch Hours",
      loading: loading,
      delay: 0.2
    },
    {
      icon: <FaChartLine className="text-yellow-400" />,
      value: statistics?.avgWatchDuration || 0,
      label: "Avg Duration (min)",
      loading: loading,
      delay: 0.3
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          icon={stat.icon}
          value={stat.value}
          label={stat.label}
          loading={stat.loading}
          delay={stat.delay}
        />
      ))}
    </div>
  );
}