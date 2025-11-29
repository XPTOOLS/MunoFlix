import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'today';
    
    await connectToDatabase();

    // Calculate date ranges
    const now = new Date();
    let startDate;

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'all':
      default:
        startDate = new Date(0);
    }

    // Get basic stats
    const sessions = await MovieSession.find({
      startTime: { $gte: startDate }
    });

    const totalViews = sessions.length;
    const uniqueViewers = new Set(sessions.map(s => s.userIp)).size;
    const totalWatchSeconds = sessions.reduce((sum, session) => sum + session.totalWatchTime, 0);
    const totalWatchHours = (totalWatchSeconds / 3600).toFixed(2);
    const avgWatchDuration = totalViews > 0 ? (totalWatchSeconds / totalViews / 60).toFixed(1) : 0;

    // Get top movies
    const movieStats = sessions.reduce((acc, session) => {
      const movieId = session.movieId;
      if (!acc[movieId]) {
        acc[movieId] = {
          movieId,
          title: session.title,
          poster: session.poster,
          views: 0,
          totalWatchTime: 0,
          uniqueViewers: new Set()
        };
      }
      acc[movieId].views++;
      acc[movieId].totalWatchTime += session.totalWatchTime;
      acc[movieId].uniqueViewers.add(session.userIp);
      return acc;
    }, {});

    const topMovies = Object.values(movieStats)
      .map(movie => ({
        ...movie,
        uniqueViewers: movie.uniqueViewers.size,
        avgWatchTime: (movie.totalWatchTime / movie.views / 60).toFixed(1),
        popularity: movie.views * movie.uniqueViewers.size
      }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 10);

    return NextResponse.json({
      statistics: {
        totalViews,
        uniqueViewers,
        totalWatchHours: parseFloat(totalWatchHours),
        avgWatchDuration: parseFloat(avgWatchDuration),
        totalWatchSeconds
      },
      topMovies,
      range
    });

  } catch (error) {
    console.error('Get movie stats error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch movie statistics',
      details: error.message 
    }, { status: 500 });
  }
}