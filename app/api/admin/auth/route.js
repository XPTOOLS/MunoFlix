import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import AdminSession from '@/models/AdminSession';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    // Get credentials from environment variables
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUsername || !adminPassword) {
      console.error('Admin credentials not configured in environment variables');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    // Verify credentials
    if (username === adminUsername && password === adminPassword) {
      await connectToDatabase();

      // Create session in MongoDB
      const sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      const session = new AdminSession({
        sessionId,
        username,
        userIp: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      });

      await session.save();

      // Set session cookie
      const response = NextResponse.json({ 
        success: true, 
        message: 'Login successful' 
      });
      
      response.cookies.set('admin_session', sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 // 24 hours
      });

      return response;
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
}

// Helper function to verify session from MongoDB
export async function verifySession(sessionId) {
  if (!sessionId) return null;
  
  try {
    await connectToDatabase();
    const session = await AdminSession.findOne({ sessionId });
    
    if (!session) return null;
    
    // Check if session expired
    if (new Date() > session.expiresAt) {
      await AdminSession.deleteOne({ sessionId });
      return null;
    }
    
    return session;
  } catch (error) {
    console.error('Session verification error:', error);
    return null;
  }
}

// Helper function to get session from request
export async function getSession(request) {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const cookies = Object.fromEntries(
    cookieHeader.split(';').map(cookie => {
      const [name, value] = cookie.trim().split('=');
      return [name, value];
    })
  );
  
  return await verifySession(cookies.admin_session);
}