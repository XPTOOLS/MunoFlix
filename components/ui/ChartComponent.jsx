"use client";
import { useEffect, useRef, useState } from 'react';

export default function ChartComponent({ 
  type = 'line', 
  data, 
  options = {}, 
  height = 300 
}) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !chartRef.current || !data) return;

    const initChart = async () => {
      const ChartJS = (await import('chart.js/auto')).default;
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#9CA3AF',
              font: {
                size: 12
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(17, 24, 39, 0.9)',
            titleColor: '#F3F4F6',
            bodyColor: '#D1D5DB',
            borderColor: 'rgba(75, 85, 99, 0.5)',
            borderWidth: 1,
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(75, 85, 99, 0.3)',
            },
            ticks: {
              color: '#9CA3AF',
            }
          },
          y: {
            grid: {
              color: 'rgba(75, 85, 99, 0.3)',
            },
            ticks: {
              color: '#9CA3AF',
            }
          }
        },
        ...options
      };

      chartInstance.current = new ChartJS(chartRef.current, {
        type,
        data,
        options: defaultOptions
      });
    };

    initChart();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [isClient, type, data, options]);

  if (!isClient) {
    return (
      <div 
        className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 animate-pulse flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">Loading chart...</div>
      </div>
    );
  }

  return (
    <div 
      className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50"
      style={{ height: `${height}px` }}
    >
      <canvas ref={chartRef} />
    </div>
  );
}