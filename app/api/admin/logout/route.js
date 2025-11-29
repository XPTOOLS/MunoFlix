import { NextResponse } from 'next/server';
import { getSession } from '../auth/route';
import { connectToDatabase } from '@/lib/mongodb';
import AdminSession from '@/models/AdminSession';

export async function POST(request) {
  try {
    const session = await getSession(request);
    
    if (session) {
      await connectToDatabase();
      await AdminSession.deleteOne({ sessionId: session.sessionId });
    }

    const response = NextResponse.json({ 
      success: true, 
      message: 'Logged out successfully' 
    });
    
    // Clear session cookie
    response.cookies.set('admin_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
}