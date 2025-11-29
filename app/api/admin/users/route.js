import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { db } from '@/firebase/config';
import { collection, getDocs, query, where, orderBy, limit, startAfter } from 'firebase/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const joined = searchParams.get('joined') || 'all';

    const mongoDb = await getDatabase();
    
    // Build Firebase query
    let firebaseQuery = collection(db, 'users');
    
    // Apply filters
    const constraints = [];
    
    if (search) {
      constraints.push(
        where('email', '>=', search),
        where('email', '<=', search + '\uf8ff')
      );
    }
    
    if (status === 'active') {
      // We'll filter this after fetching since active status comes from MongoDB
    } else if (status === 'banned') {
      constraints.push(where('status', '==', 'banned'));
    }
    
    // Date filter - we'll apply this after fetching
    constraints.push(orderBy('createdAt', 'desc'));
    
    // Get all users first (Firebase doesn't support easy pagination without indexes)
    const usersSnapshot = await getDocs(firebaseQuery);
    let firebaseUsers = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get active users from MongoDB visits (last 7 days)
    const activeUsers = await mongoDb.collection('visits').distinct('userId', { 
      userId: { $ne: null },
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Apply additional filters that couldn't be done in Firebase query
    if (search) {
      firebaseUsers = firebaseUsers.filter(user => 
        user.email?.toLowerCase().includes(search.toLowerCase()) ||
        user.displayName?.toLowerCase().includes(search.toLowerCase()) ||
        user.username?.toLowerCase().includes(search.toLowerCase()) ||
        user.id?.includes(search)
      );
    }

    if (status === 'active') {
      firebaseUsers = firebaseUsers.filter(user => activeUsers.includes(user.id));
    }

    // Apply date filter
    if (joined !== 'all') {
      const now = new Date();
      let startDate;
      
      switch (joined) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = null;
      }
      
      if (startDate) {
        firebaseUsers = firebaseUsers.filter(user => {
          const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
          return userDate >= startDate;
        });
      }
    }

    // Calculate pagination
    const totalUsers = firebaseUsers.length;
    const totalPages = Math.ceil(totalUsers / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedUsers = firebaseUsers.slice(startIndex, startIndex + pageSize);

    // Format users with additional data
    const formattedUsers = paginatedUsers.map(user => ({
      id: user.id,
      email: user.email || 'No email',
      displayName: user.displayName || user.username || 'No Name',
      username: user.username || '',
      createdAt: user.createdAt?.toDate ? user.createdAt.toDate().toISOString() : user.createdAt,
      lastLogin: user.lastLogin?.toDate ? user.lastLogin.toDate().toISOString() : user.lastLogin,
      status: user.status || 'active',
      isActive: activeUsers.includes(user.id),
      lastActive: user.lastLogin?.toDate ? user.lastLogin.toDate() : null
    }));

    // Calculate statistics
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const newUsersThisWeek = firebaseUsers.filter(user => {
      const userDate = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
      return userDate >= oneWeekAgo;
    }).length;

    const bannedUsers = firebaseUsers.filter(user => user.status === 'banned').length;

    return NextResponse.json({
      users: formattedUsers,
      pagination: {
        page,
        pageSize,
        totalUsers,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      statistics: {
        totalUsers,
        activeUsers: activeUsers.length,
        bannedUsers,
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