import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { getAuth } from 'firebase-admin/auth';
import { doc, updateDoc, serverTimestamp, setDoc, deleteDoc } from 'firebase/firestore';

export async function POST(request) {
  try {
    const { userId, reason = 'Violation of terms of service' } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Disable user in Firebase Authentication
    try {
      await getAuth().updateUser(userId, {
        disabled: true
      });
      console.log(`User ${userId} disabled in Firebase Authentication`);
    } catch (authError) {
      console.warn('Could not disable user in Authentication:', authError.message);
      // Continue with Firestore update even if Auth operation fails
    }

    // Update user in Firestore with ban info
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      status: 'banned',
      bannedAt: serverTimestamp(),
      banReason: reason,
      isActive: false
    });

    // Create ban notification for the user
    const notificationRef = doc(db, 'users', userId, 'notifications', 'account_banned');
    await setDoc(notificationRef, {
      type: 'account_banned',
      title: 'Account Banned',
      message: `Your account has been banned for: ${reason}. This action was taken due to violations of our terms of service.`,
      severity: 'critical',
      showContactSupport: true,
      isRead: false,
      createdAt: serverTimestamp(),
      actionUrl: '/contact',
      actionText: 'Contact Support'
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User banned successfully. Notification sent to user.' 
    });

  } catch (error) {
    console.error('Ban user error:', error);
    return NextResponse.json({ 
      error: 'Failed to ban user',
      details: error.message 
    }, { status: 500 });
  }
}