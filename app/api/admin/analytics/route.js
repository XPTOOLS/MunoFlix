import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    
    // Get daily visits
    const dailyVisits = await db.collection('visits').aggregate([
      {
        $group: {
          _id: '$date',
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 30 }
    ]).toArray();

    // Get weekly visits
    const weeklyVisits = await db.collection('visits').aggregate([
      {
        $group: {
          _id: '$week',
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]).toArray();

    // Get monthly visits
    const monthlyVisits = await db.collection('visits').aggregate([
      {
        $group: {
          _id: '$month',
          visits: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$sessionId' }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 12 }
    ]).toArray();

    // Get popular pages
    const popularPages = await db.collection('visits').aggregate([
      {
        $group: {
          _id: '$page',
          visits: { $sum: 1 }
        }
      },
      { $sort: { visits: -1 } },
      { $limit: 10 }
    ]).toArray();

    return NextResponse.json({
      daily: dailyVisits.map(day => ({
        date: day._id,
        visits: day.visits,
        uniqueVisitors: day.uniqueVisitors.length
      })),
      weekly: weeklyVisits.map(week => ({
        week: week._id,
        visits: week.visits,
        uniqueVisitors: week.uniqueVisitors.length
      })),
      monthly: monthlyVisits.map(month => ({
        month: month._id,
        visits: month.visits,
        uniqueVisitors: month.uniqueVisitors.length
      })),
      popularPages: popularPages
    });

  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}