"use client";
import { useUserInfoContext } from "@/context/UserInfoContext";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { 
  FaUser, 
  FaCog, 
  FaSignOutAlt, 
  FaSignInAlt, 
  FaUserPlus,
  FaFilm,
  FaInfoCircle,
  FaQuestionCircle,
  FaEnvelope,
  FaShield,
  FaStar,
  FaHistory,
  FaBookmark
} from "react-icons/fa";

const MorePage = () => {
  const { userInfo, isUserLoggedIn, loading } = useUserInfoContext();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  // Account Section
  const accountItems = isUserLoggedIn ? [
    {
      name: "Profile",
      description: "View and edit your profile",
      icon: <FaUser className="text-blue-400" />,
      href: "/profile",
      color: "from-blue-500/20 to-blue-600/20",
      borderColor: "border-blue-500/30"
    },
    {
      name: "Settings",
      description: "App preferences and settings",
      icon: <FaCog className="text-purple-400" />,
      href: "/settings",
      color: "from-purple-500/20 to-purple-600/20",
      borderColor: "border-purple-500/30"
    },
    {
      name: "Log Out",
      description: "Sign out of your account",
      icon: <FaSignOutAlt className="text-red-400" />,
      onClick: handleLogout,
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30"
    }
  ] : [
    {
      name: "Sign In",
      description: "Login to your account",
      icon: <FaSignInAlt className="text-green-400" />,
      href: "/login",
      color: "from-green-500/20 to-green-600/20",
      borderColor: "border-green-500/30"
    },
    {
      name: "Sign Up",
      description: "Create a new account",
      icon: <FaUserPlus className="text-cyan-400" />,
      href: "/signup",
      color: "from-cyan-500/20 to-cyan-600/20",
      borderColor: "border-cyan-500/30"
    }
  ];

  // Content Section
  const contentItems = [
    {
      name: "Translated Movies",
      description: "Watch movies in Luganda",
      icon: <FaFilm className="text-yellow-400" />,
      href: "/translated",
      color: "from-yellow-500/20 to-yellow-600/20",
      borderColor: "border-yellow-500/30"
    },
    {
      name: "Continue Watching",
      description: "Pick up where you left off",
      icon: <FaHistory className="text-orange-400" />,
      href: "/continue-watching",
      color: "from-orange-500/20 to-orange-600/20",
      borderColor: "border-orange-500/30"
    },
    {
      name: "Watchlist",
      description: "Your saved movies and shows",
      icon: <FaBookmark className="text-pink-400" />,
      href: "/watchlist",
      color: "from-pink-500/20 to-pink-600/20",
      borderColor: "border-pink-500/30"
    }
  ];

  // App Section
  const appItems = [
    {
      name: "About",
      description: "Learn about MunoFlix",
      icon: <FaInfoCircle className="text-indigo-400" />,
      href: "/about",
      color: "from-indigo-500/20 to-indigo-600/20",
      borderColor: "border-indigo-500/30"
    },
    {
      name: "Help & Support",
      description: "Get help and support",
      icon: <FaQuestionCircle className="text-teal-400" />,
      href: "/help",
      color: "from-teal-500/20 to-teal-600/20",
      borderColor: "border-teal-500/30"
    },
    {
      name: "Contact",
      description: "Get in touch with us",
      icon: <FaEnvelope className="text-emerald-400" />,
      href: "/contact",
      color: "from-emerald-500/20 to-emerald-600/20",
      borderColor: "border-emerald-500/30"
    }
  ];

  // Admin Section (only show if user is admin)
  const adminItems = userInfo?.isAdmin ? [
    {
      name: "Admin Panel",
      description: "Manage website content",
      icon: <FaShield className="text-red-400" />,
      href: "/admin",
      color: "from-red-500/20 to-red-600/20",
      borderColor: "border-red-500/30"
    }
  ] : [];

  const Section = ({ title, items }) => (
    <div className="mb-6">
      <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
        {title}
      </h2>
      <div className="grid gap-2">
        {items.map((item, index) => (
          <div
            key={item.name}
            className={`bg-gradient-to-r ${item.color} border ${item.borderColor} rounded-lg p-3 hover:scale-102 transition-all duration-200 cursor-pointer backdrop-blur-sm`}
            onClick={item.onClick || (() => item.href && router.push(item.href))}
          >
            <div className="flex items-center gap-3">
              <div className="text-xl">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white text-base leading-tight">{item.name}</h3>
                <p className="text-gray-300 text-xs leading-tight mt-0.5">{item.description}</p>
              </div>
              <div className="text-white opacity-60 flex-shrink-0">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-16 pb-24 px-4">
      {/* Header */}
      <div className="max-w-2xl mx-auto mb-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-1">
            More
          </h1>
          <p className="text-gray-400 text-sm">
            All your options in one place
          </p>
        </div>

        {/* User Info Card - Updated */}
        {isUserLoggedIn && (
          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 mt-4 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0">
                {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-lg leading-tight truncate">{userInfo?.name || 'User'}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full border border-green-500/30 font-medium">
                    Active
                  </span>
                  <span className="bg-purple-500/20 text-purple-400 text-xs px-2 py-1 rounded-full border border-purple-500/30 font-medium">
                    Member
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Sections */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Account Section */}
        <Section title="Account" items={accountItems} />
        
        {/* Content Section */}
        <Section title="Content" items={contentItems} />
        
        {/* App Section */}
        <Section title="App" items={appItems} />
        
        {/* Admin Section */}
        {adminItems.length > 0 && (
          <Section title="Administration" items={adminItems} />
        )}
      </div>

      {/* Footer */}
      <div className="max-w-2xl mx-auto mt-8 text-center">
        <div className="text-gray-500 text-xs">
          MunoFlix v1.0 • Stream Unlimited
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default MorePage;