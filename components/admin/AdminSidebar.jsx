"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FaSignOutAlt } from "react-icons/fa";

export default function AdminSidebar({ isOpen, onClose, isMobile }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Analytics", href: "/admin/analytics", icon: "📈" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Movies", href: "/admin/movies", icon: "🎬" },
  ];

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    }
  };

  // Determine sidebar width and position based on device and state
  const getSidebarClasses = () => {
    if (isMobile) {
      return isOpen 
        ? "w-64 translate-x-0" 
        : "-translate-x-full";
    } else {
      return isOpen 
        ? "w-64 translate-x-0" 
        : "w-16 translate-x-0";
    }
  };

  // Check if we should show labels (only when open on PC, or when open on mobile)
  const shouldShowLabels = isOpen || isMobile;

  return (
    <>
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 left-0 z-30 h-screen
        bg-gray-800 border-r border-gray-700
        transition-all duration-300 ease-in-out
        flex flex-col
        ${getSidebarClasses()}
      `}>
        {/* Logo Section */}
        <div className="p-4 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-between">
            {(isOpen || isMobile) ? (
              <div className="flex items-center space-x-3 flex-1">
                {isOpen || isMobile ? (
                  <h1 className="text-xl font-bold text-white whitespace-nowrap">
                    Admin Panel
                  </h1>
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
                <span className="text-white font-bold text-sm">A</span>
              </div>
            )}
            
            {/* Close button for mobile when sidebar is open */}
            {isMobile && isOpen && (
              <button
                onClick={onClose}
                className="p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 ml-2"
                aria-label="Close sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto">
          <ul className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href || (item.href === '/admin/movies' && pathname.startsWith('/admin/movies'));
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => {
                      if (isMobile) {
                        onClose();
                      }
                    }}
                    className={`
                      flex items-center p-2 sm:p-3 rounded-lg transition-all duration-200
                      ${isActive 
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25" 
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                      }
                      ${shouldShowLabels ? "" : "justify-center"}
                    `}
                  >
                    {/* Icon */}
                    <span className={`text-lg flex-shrink-0 ${isActive ? "scale-110" : ""}`}>
                      {item.icon}
                    </span>
                    
                    {/* Label - Only show when sidebar is open OR on mobile */}
                    {shouldShowLabels && (
                      <span className="font-medium whitespace-nowrap ml-2 sm:ml-3">
                        {item.name}
                      </span>
                    )}

                    {/* Active indicator dot for collapsed state on PC */}
                    {!shouldShowLabels && isActive && (
                      <div className="absolute right-2 w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t border-gray-700 flex-shrink-0">
          <button
            onClick={handleLogout}
            className={`
              flex items-center w-full p-2 sm:p-3 rounded-lg transition-all duration-200
              text-gray-300 hover:bg-gray-700 hover:text-red-400
              ${shouldShowLabels ? "" : "justify-center"}
            `}
          >
            <FaSignOutAlt className="text-lg flex-shrink-0" />
            {shouldShowLabels && (
              <span className="font-medium whitespace-nowrap ml-2 sm:ml-3">
                Logout
              </span>
            )}
          </button>
        </div>

        {/* Footer/Collapse Hint - Only show when open */}
        {(isOpen || isMobile) && isOpen && (
          <div className="p-3 sm:p-4 border-t border-gray-700 flex-shrink-0">
            <p className="text-xs text-gray-400 text-center">
              Admin Panel v1.0
            </p>
          </div>
        )}
      </div>
    </>
  );
}