"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useUserInfoContext } from '@/context/UserInfoContext';

export default function VisitTracker() {
  const pathname = usePathname();
  const { userInfo, isUserLoggedIn } = useUserInfoContext();

  useEffect(() => {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
      sessionStorage.setItem('sessionId', sessionId);
    }

    fetch('/api/visits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page: pathname,
        userId: isUserLoggedIn ? userInfo?.uid : null,
        sessionId: sessionId
      }),
    });
  }, [pathname, isUserLoggedIn, userInfo]);

  return null;
}