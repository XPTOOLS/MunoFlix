import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import MovieSession from '@/models/MovieSession';

export async function POST(request) {
  try {
    const { sessionId, completed = false } = await request.json();

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    await connectToDatabase();

    const session = await MovieSession.findOne({ sessionId });
    
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    session.endTime = new Date();
    session.completed = completed;
    await session.save();

    return NextResponse.json({ 
      success: true, 
      totalWatchTime: session.totalWatchTime,
      message: 'Movie session ended' 
    });

  } catch (error) {
    console.error('Stop movie session error:', error);
    return NextResponse.json({ 
      error: 'Failed to end movie session',
      details: error.message 
    }, { status: 500 });
  }
}