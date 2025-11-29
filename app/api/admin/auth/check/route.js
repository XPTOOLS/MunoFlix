import { NextResponse } from 'next/server';
import { getSession } from '../route';

export async function GET(request) {
  try {
    const session = await getSession(request);
    
    if (session) {
      return NextResponse.json({ 
        authenticated: true,
        user: session.username 
      });
    } else {
      return NextResponse.json({ 
        authenticated: false 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false 
    }, { status: 500 });
  }
}