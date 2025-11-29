import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function GET(request, { params }) {
  try {
    const { movieId } = params;
    
    await connectToDatabase();

    // Get all sessions for this movie
    const sessions = await MovieSession.find({ movieId });

    if (sessions.length === 0) {
      return NextResponse.json({ 
        error: 'No data found for this movie' 
      }, { status: 404 });
    }

    // Calculate last 14 days
    const today = new Date();
    const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Daily stats for last 14 days
    const dailyStatsMap = {};
    const watchTimeMap = {};
    
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyStatsMap[dateStr] = { date: dateStr, views: 0, watchTime: 0 };
    }

    // Process sessions for daily stats
    sessions.forEach(session => {
      const sessionDate = session.startTime.toISOString().split('T')[0];
      if (dailyStatsMap[sessionDate]) {
        dailyStatsMap[sessionDate].views += 1;
        dailyStatsMap[sessionDate].watchTime += session.totalWatchTime;
      }
    });

    const dailyStats = Object.values(dailyStatsMap).reverse();
    const watchTimeData = dailyStats.map(day => ({
      date: day.date,
      watchTime: day.watchTime
    }));

    // Player usage stats
    const playerStats = sessions.reduce((acc, session) => {
      const player = session.playerType;
      acc[player] = (acc[player] || 0) + 1;
      return acc;
    }, {});

    // Overall movie stats
    const totalViews = sessions.length;
    const uniqueViewers = new Set(sessions.map(s => s.userIp)).size;
    const totalWatchTime = sessions.reduce((sum, session) => sum + session.totalWatchTime, 0);
    const avgWatchTime = totalViews > 0 ? (totalWatchTime / totalViews / 60).toFixed(1) : 0;

    return NextResponse.json({
      movieId,
      title: sessions[0].title,
      poster: sessions[0].poster,
      overallStats: {
        totalViews,
        uniqueViewers,
        totalWatchTime,
        avgWatchTime,
        totalWatchHours: (totalWatchTime / 3600).toFixed(2)
      },
      dailyStats,
      watchTimeData,
      playerStats,
      totalSessions: sessions.length
    });

  } catch (error) {
    console.error('Get movie details error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch movie details',
      details: error.message 
    }, { status: 500 });
  }
}