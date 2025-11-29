"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth/check', {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        // Only redirect if we're not already on the login page
        if (!pathname.includes('/admin/login')) {
          router.push('/admin/login');
        }
      }
    } catch (error) {
      setIsAuthenticated(false);
      if (!pathname.includes('/admin/login')) {
        router.push('/admin/login');
      }
    }
  };

  // Show loading while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not on login page, we'll redirect (handled in useEffect)
  if (!isAuthenticated && !pathname.includes('/admin/login')) {
    return null;
  }

  return children;
}