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

export async function POST(request, { params }) {
  try {
    const { id } = params;
    const userId = getUserId(request);
    const body = await request.json();
    const { type } = body; // 'like' or 'dislike'

    if (!id || !type) {
      return NextResponse.json(
        { error: 'Comment ID and reaction type are required' },
        { status: 400 }
      );
    }

    if (!['like', 'dislike'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid reaction type' },
        { status: 400 }
      );
    }

    const updatedComment = await CommentService.reactToComment(id, userId, type);

    if (!updatedComment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    const response = NextResponse.json(updatedComment);
    
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
    console.error('Error reacting to comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}