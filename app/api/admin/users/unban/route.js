import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { getAuth } from 'firebase-admin/auth';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import '@/firebase/admin'; // Import admin initialization

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Enable user in Firebase Authentication
    try {
      await getAuth().updateUser(userId, {
        disabled: false
      });
      console.log(`User ${userId} enabled in Firebase Authentication`);
    } catch (authError) {
      console.warn('Could not enable user in Authentication:', authError.message);
      // Continue with Firestore update even if Auth operation fails
    }

    // Update user in Firestore
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      status: 'active',
      bannedAt: null,
      banReason: null,
      isActive: true
    });

    // Remove ban notification if it exists
    try {
      const notificationRef = doc(db, 'users', userId, 'notifications', 'account_banned');
      await deleteDoc(notificationRef);
    } catch (notifError) {
      console.log('No ban notification to remove:', notifError.message);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'User unbanned successfully' 
    });

  } catch (error) {
    console.error('Unban user error:', error);
    return NextResponse.json({ 
      error: 'Failed to unban user',
      details: error.message 
    }, { status: 500 });
  }
}