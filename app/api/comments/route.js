import { CommentService } from '@/lib/comments';
import { NextResponse } from 'next/server';

const getUserId = (request) => {
  const cookie = request.headers.get('cookie');
  let userId = cookie?.match(/userId=([^;]+)/)?.[1];
  
  if (!userId) {
    userId = 'guest_' + Math.random().toString(36).substr(2, 9);
  }
  
  return userId;
};

export async function POST(request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();
    const { movieId, content, author, email, isGuest } = body;

    if (!movieId || !content) {
      return NextResponse.json(
        { error: 'Movie ID and content are required' },
        { status: 400 }
      );
    }

    const comment = await CommentService.addComment({
      movieId: String(movieId), // Ensure string format
      content: content.trim(),
      author: author?.trim() || 'Anonymous',
      email: email?.trim() || null,
      isGuest: isGuest || true,
      userAvatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author?.trim() || 'Anonymous')}&background=6c5dd3&color=fff`,
      userId: userId
    });

    const response = NextResponse.json(comment);
    
    // Set userId cookie if not present
    if (!request.headers.get('cookie')?.includes('userId=')) {
      response.cookies.set('userId', userId, {
        maxAge: 365 * 24 * 60 * 60,
        path: '/',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
    }
    
    return response;
  } catch (error) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 50;

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    const result = await CommentService.getComments(movieId, page, limit);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}