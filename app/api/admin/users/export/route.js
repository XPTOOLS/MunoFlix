import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';
import { db } from '@/firebase/config';
import { collection, getDocs } from 'firebase/firestore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';
    const joined = searchParams.get('joined') || 'all';

    const mongoDb = await getDatabase();
    
    // Get all users from Firebase
    const usersSnapshot = await getDocs(collection(db, 'users'));
    let firebaseUsers = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    // Get active users from MongoDB
    const activeUsers = await mongoDb.collection('visits').distinct('userId', { 
      userId: { $ne: null },
      timestamp: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Apply filters (same logic as main users API)
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
    } else if (status === 'banned') {
      firebaseUsers = firebaseUsers.filter(user => user.status === 'banned');
    }

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

    // Format users for CSV
    const csvData = firebaseUsers.map(user => {
      const userStatus = user.status === 'banned' ? 'banned' : 
                        activeUsers.includes(user.id) ? 'active' : 'inactive';
      
      const joinDate = user.createdAt?.toDate ? 
        user.createdAt.toDate().toISOString().split('T')[0] : 
        (user.createdAt ? new Date(user.createdAt).toISOString().split('T')[0] : 'N/A');
      
      const lastActive = user.lastLogin?.toDate ? 
        user.lastLogin.toDate().toISOString().split('T')[0] : 
        (user.lastLogin ? new Date(user.lastLogin).toISOString().split('T')[0] : 'N/A');

      return {
        id: user.id,
        username: user.username || user.displayName || 'No Name',
        email: user.email || 'No email',
        status: userStatus,
        joinDate,
        lastActive
      };
    });

    // Convert to CSV
    const headers = ['ID', 'Username', 'Email', 'Status', 'Join Date', 'Last Active'];
    const csvRows = [
      headers.join(','),
      ...csvData.map(user => 
        `"${user.id}","${user.username}","${user.email}","${user.status}","${user.joinDate}","${user.lastActive}"`
      )
    ];

    const csvString = csvRows.join('\n');

    // Create and return CSV file
    return new Response(csvString, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="users-export-${new Date().toISOString().split('T')[0]}.csv"`
      }
    });

  } catch (error) {
    console.error('Export users error:', error);
    return NextResponse.json({ 
      error: 'Failed to export users',
      details: error.message 
    }, { status: 500 });
  }
}