import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function POST(request) {
  try {
    const { movieId, title, poster, userId, userIp, playerType = 'unknown' } = await request.json();

    if (!movieId || !title || !userIp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await connectToDatabase();

    const sessionId = `${movieId}_${userIp}_${Date.now()}`;
    const startTime = new Date();
    
    // Calculate date fields manually
    const date = startTime.toISOString().split('T')[0]; // YYYY-MM-DD
    const week = `${startTime.getFullYear()}-${Math.ceil((startTime.getDate() + startTime.getDay() + 1) / 7)}`; // YYYY-WW
    const month = `${startTime.getFullYear()}-${String(startTime.getMonth() + 1).padStart(2, '0')}`; // YYYY-MM
    
    const session = new MovieSession({
      sessionId,
      movieId,
      title,
      poster,
      userId,
      userIp,
      playerType,
      startTime,
      date,
      week,
      month
    });

    await session.save();

    return NextResponse.json({ 
      success: true, 
      sessionId,
      message: 'Movie session started' 
    });

  } catch (error) {
    console.error('Start movie session error:', error);
    return NextResponse.json({ 
      error: 'Failed to start movie session',
      details: error.message 
    }, { status: 500 });
  }
}