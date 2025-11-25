import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const db = await getDatabase();
    const { page, userId, sessionId } = await request.json();
    
    const visit = {
      timestamp: new Date(),
      page,
      userId: userId || null,
      sessionId,
      userAgent: request.headers.get('user-agent') || 'unknown',
      date: new Date().toISOString().split('T')[0],
      week: getWeekNumber(new Date()),
      month: new Date().toISOString().substring(0, 7)
    };

    await db.collection('visits').insertOne(visit);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
  }
}

function getWeekNumber(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return `${d.getUTCFullYear()}-W${Math.ceil((((d - yearStart) / 86400000) + 1) / 7)}`;
}