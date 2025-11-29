import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { getAuth } from 'firebase-admin/auth';
import { doc, deleteDoc } from 'firebase/firestore';
import '@/firebase/admin'; // Import admin initialization

export async function POST(request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Delete user from Firebase Authentication
    try {
      await getAuth().deleteUser(userId);
      console.log(`User ${userId} deleted from Firebase Authentication`);
    } catch (authError) {
      console.warn('Could not delete user from Authentication:', authError.message);
      // Continue with Firestore deletion even if Auth deletion fails
    }

    // Delete user from Firestore
    const userRef = doc(db, 'users', userId);
    await deleteDoc(userRef);

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully from both Authentication and Firestore' 
    });

  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json({ 
      error: 'Failed to delete user',
      details: error.message 
    }, { status: 500 });
  }
}