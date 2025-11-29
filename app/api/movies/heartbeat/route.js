import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function POST(request) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const session = await MovieSession.findOne({ sessionId });
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Add 30 seconds to watch time (since heartbeat is sent every 30s)
    session.totalWatchTime += 30;
    await session.save();

    return NextResponse.json({ 
      success: true, 
      totalWatchTime: session.totalWatchTime,
      message: 'Heartbeat recorded' 
    });

  } catch (error) {
    console.error('Movie heartbeat error:', error);
    return NextResponse.json({ 
      error: 'Failed to record heartbeat',
      details: error.message 
    }, { status: 500 });
  }
}