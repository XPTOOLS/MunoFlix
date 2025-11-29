import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'today';
    const limit = parseInt(searchParams.get('limit')) || 20;
    
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

    const sessions = await MovieSession.find({
      startTime: { $gte: startDate }
    });

    // Aggregate movie statistics
    const movieStats = sessions.reduce((acc, session) => {
      const movieId = session.movieId;
      if (!acc[movieId]) {
        acc[movieId] = {
          movieId,
          title: session.title,
          poster: session.poster,
          views: 0,
          totalWatchTime: 0,
          uniqueViewers: new Set(),
          playerTypes: new Set()
        };
      }
      acc[movieId].views++;
      acc[movieId].totalWatchTime += session.totalWatchTime;
      acc[movieId].uniqueViewers.add(session.userIp);
      acc[movieId].playerTypes.add(session.playerType);
      return acc;
    }, {});

    const topMovies = Object.values(movieStats)
      .map(movie => ({
        ...movie,
        uniqueViewers: movie.uniqueViewers.size,
        avgWatchTime: (movie.totalWatchTime / movie.views / 60).toFixed(1),
        playerTypes: Array.from(movie.playerTypes),
        popularity: movie.views * movie.uniqueViewers.size
      }))
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);

    return NextResponse.json({
      topMovies,
      range,
      total: topMovies.length
    });

  } catch (error) {
    console.error('Get top movies error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch top movies',
      details: error.message 
    }, { status: 500 });
  }
}