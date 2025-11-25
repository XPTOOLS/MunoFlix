import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const mongoDb = await getDatabase();
    
    // Get users from Firebase (no auth needed with open rules)
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const firebaseUsers = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log('Found users:', firebaseUsers.length);

    // Get active users from MongoDB visits
    const activeUsers = await mongoDb.collection('visits').distinct('userId', { 
      userId: { $ne: null },
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Calculate statistics
    const totalUsers = firebaseUsers.length;
    const activeUsersCount = activeUsers.length;
    
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = firebaseUsers.filter(user => {
      const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
      return userDate >= oneWeekAgo;
    }).length;

    return NextResponse.json({
      users: firebaseUsers.map(user => ({
        id: user.id,
        email: user.email || 'No email',
        displayName: user.displayName || user.username || 'No Name',
        createdAt: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : user.createdAt,
        lastLogin: user.lastLogin?.toDate ? user.lastLogin.toDate().toISOString() : user.lastLogin,
        isActive: activeUsers.includes(user.id)
      })),
      statistics: {
        totalUsers,
        activeUsers: activeUsersCount,
        newUsersThisWeek
      }
    });

  } catch (error) {
    console.error('Users API error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch users',
      details: error.message 
    }, { status: 500 });
  }
}