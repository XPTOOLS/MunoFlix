"use client";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function AdminHeader({ onToggleSidebar, sidebarOpen, isMobile }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const pathname = usePathname();

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);

  // Get current page title from pathname (safe for SSR)
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Dashboard';
    if (pathname === '/admin/analytics') return 'Analytics';
    if (pathname === '/admin/users') return 'User Management';
    if (pathname === '/admin/movies') return 'Movie Management';
    return 'Admin Panel';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationsClick = (e) => {
    e.stopPropagation();
    setNotificationsOpen(!notificationsOpen);
    setProfileOpen(false);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setProfileOpen(!profileOpen);
    setNotificationsOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 bg-gray-800/95 backdrop-blur-md border-b border-gray-700">
      <div className="flex items-center justify-between p-3 sm:p-4">
        {/* Left Section */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSidebar();
            }}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-gray-300 hover:text-white"
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Page Title */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
              {getPageTitle()}
            </h1>
            {!isMobile && (
              <div className="hidden sm:block">
                <span className="text-xs sm:text-sm text-gray-400">
                  Welcome back, Admin
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Notifications - Better Design */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={handleNotificationsClick}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 text-gray-300 hover:text-white relative group"
              aria-label="Notifications"
            >
              {/* Better notification icon */}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8.5 14.5A2.5 2.5 0 0011 12V9a4 4 0 118 0v3a2.5 2.5 0 002.5 2.5" />
              </svg>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-gray-800"></span>
            </button>

            {/* Notifications Dropdown */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                <div className="p-3 border-b border-gray-600">
                  <h3 className="text-base sm:text-lg font-semibold text-white">Notifications</h3>
                </div>
                <div className="p-4">
                  <div className="text-center py-3 sm:py-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM8.5 14.5A2.5 2.5 0 0011 12V9a4 4 0 118 0v3a2.5 2.5 0 002.5 2.5" />
                      </svg>
                    </div>
                    <p className="text-gray-400 text-sm">No new notifications</p>
                    <p className="text-gray-500 text-xs mt-1">You're all caught up!</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu - Fixed Clickability */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 p-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 group"
              aria-label="Profile menu"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">A</span>
              </div>
              
              {/* Show text only on larger screens */}
              {!isMobile && (
                <>
                  <div className="text-left min-w-0 hidden sm:block">
                    <p className="text-sm font-medium text-white truncate max-w-[80px] lg:max-w-none">Admin User</p>
                    <p className="text-xs text-gray-400 truncate max-w-[80px] lg:max-w-none">Administrator</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-400 hidden sm:block flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </>
              )}
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50">
                <div className="p-2">
                  <div className="px-3 py-2 border-b border-gray-600 mb-1">
                    <p className="text-sm font-medium text-white truncate">Admin User</p>
                    <p className="text-xs text-gray-400 truncate">admin@munoflix.com</p>
                  </div>
                  
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center space-x-2">
                    <span>👤</span>
                    <span>Profile Settings</span>
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center space-x-2">
                    <span>⚙️</span>
                    <span>Preferences</span>
                  </button>
                  <div className="border-t border-gray-600 my-1"></div>
                  <button className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md transition-colors duration-200 flex items-center space-x-2">
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}