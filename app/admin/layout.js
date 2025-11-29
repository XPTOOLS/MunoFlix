"use client";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const checkAuth = async () => {
    // Skip auth check for login page
    if (pathname === '/admin/login') {
      setIsAuthenticated(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/auth/check', {
        credentials: 'include'
      });
      
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.push('/admin/login');
      }
    } catch (error) {
      setIsAuthenticated(false);
      router.push('/admin/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  // Show loading while checking authentication
  if (isAuthenticated === null && pathname !== '/admin/login') {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gray-900`}>
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-gray-400 mt-4">Verifying admin access...</p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  // If not authenticated and not on login page, show nothing (redirect will happen)
  if (!isAuthenticated && pathname !== '/admin/login') {
    return null;
  }

  // For login page, don't show sidebar/header
  if (pathname === '/admin/login') {
    return (
      <html lang="en">
        <body className={`${inter.className} bg-gray-900`}>
          {children}
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-900`}>
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <AdminSidebar 
            isOpen={sidebarOpen} 
            onClose={closeSidebar}
            isMobile={isMobile}
          />
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 w-full">
            {/* Header */}
            <AdminHeader 
              onToggleSidebar={toggleSidebar}
              sidebarOpen={sidebarOpen}
              isMobile={isMobile}
            />
            
            {/* Page Content */}
            <main className="flex-1 p-3 sm:p-4 lg:p-6 overflow-auto bg-gray-900 w-full">
              <div className="max-w-full">
                {children}
              </div>
            </main>
          </div>

          {/* Mobile Overlay */}
          {sidebarOpen && isMobile && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
              onClick={closeSidebar}
            />
          )}
        </div>
      </body>
    </html>
  );
}