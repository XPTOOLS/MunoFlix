import { getDatabase } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); // You'll need to implement user auth
    
    const db = await getDatabase();
    const collection = db.collection('watchlist');
    
    const watchlist = await collection.find({ userId: userId || 'default' }).toArray();
    
    return NextResponse.json(watchlist);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId = 'default', movie, status = 'PLANNING' } = body;

    if (!movie || !movie.id) {
      return NextResponse.json({ error: 'Movie data is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('watchlist');
    
    // Check if already in watchlist
    const existing = await collection.findOne({ 
      userId: userId, 
      'movie.id': movie.id 
    });

    if (existing) {
      // Update status if different
      if (existing.status !== status) {
        await collection.updateOne(
          { _id: existing._id },
          { $set: { status, updatedAt: new Date() } }
        );
      }
    } else {
      // Add to watchlist
      await collection.insertOne({
        userId,
        movie,
        status,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating watchlist:', error);
    return NextResponse.json({ error: 'Failed to update watchlist' }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'default';
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json({ error: 'Movie ID is required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection('watchlist');
    
    await collection.deleteOne({ 
      userId: userId, 
      'movie.id': parseInt(movieId) 
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 });
  }
}