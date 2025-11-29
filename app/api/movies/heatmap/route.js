import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days')) || 30;
    
    await connectToDatabase();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Get sessions for the date range
    const sessions = await MovieSession.find({
      startTime: { $gte: startDate, $lte: endDate }
    });

    // Create daily activity map
    const dailyActivity = {};
    
    // Initialize all days with 0
    for (let i = 0; i < days; i++) {
      const date = new Date(endDate);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyActivity[dateStr] = {
        date: dateStr,
        views: 0,
        watchTime: 0,
        uniqueViewers: new Set()
      };
    }

    // Populate with actual data
    sessions.forEach(session => {
      const sessionDate = session.startTime.toISOString().split('T')[0];
      if (dailyActivity[sessionDate]) {
        dailyActivity[sessionDate].views += 1;
        dailyActivity[sessionDate].watchTime += session.totalWatchTime;
        dailyActivity[sessionDate].uniqueViewers.add(session.userIp);
      }
    });

    // Convert to array and calculate intensity
    const heatmapData = Object.values(dailyActivity)
      .reverse() // Most recent last
      .map(day => ({
        ...day,
        uniqueViewers: day.uniqueViewers.size,
        // Calculate intensity score (0-100) based on views and watch time
        intensity: Math.min(100, Math.round(
          (day.views * 0.6 + (day.watchTime / 3600) * 0.4) * 10
        ))
      }));

    return NextResponse.json({
      heatmapData,
      days,
      totalDays: heatmapData.length,
      maxIntensity: Math.max(...heatmapData.map(day => day.intensity))
    });

  } catch (error) {
    console.error('Get heatmap data error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch heatmap data',
      details: error.message 
    }, { status: 500 });
  }
}