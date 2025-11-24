"use client"
import { nightTokyo } from "@/utils/fonts"
import styles from "./header.module.css"
import Link from "next/link"
import Image from "next/image"
import Links from "./Links"
import Search from "./Search"
import Responsive from "./Responsive"
import Profile from "./Profile"
import { usePathname } from 'next/navigation'

const Header = () => {
  const pathname = usePathname()

  // Don't show header on watch pages
  if (pathname.includes('/watch/')) {
    return null
  }

  return (
    <>
      {/* Desktop Header - COMPLETELY HIDDEN on mobile */}
      <div className={`${styles.container} hidden md:block`}>
        <div className={styles.wrapper}>
          <div className={styles.left}>
            <Link href={"/"} className={`${nightTokyo.className} text-white flex items-center gap-2`}>
              <div className="relative w-[50px]">
                <Image
                  src="/images/logo-2.png"
                  className="absolute top-1/2 -translate-y-1/2 left-0"
                  alt="MunoFlix"
                  width={46}
                  height={46}
                />
              </div>
              <span className="text-3xl">MunoFlix</span>
            </Link>
            <Links />
          </div>

          <div className={`${styles.right} min-[1390px]:w-[24%]`}>
            <Search />
            <Profile />
          </div>
        </div>
      </div>

      {/* Mobile Header - ONLY shows on mobile */}
      <div className="block md:hidden">
        {/* Mobile Top Bar */}
        <div className="fixed top-0 left-0 right-0 bg-[#1a1a2e] border-b border-[#39374b] z-50 h-16 flex items-center justify-between px-4">
          <Link href={"/"} className={`${nightTokyo.className} text-white flex items-center gap-2`}>
            <div className="relative w-[40px]">
              <Image
                src="/images/logo-2.png"
                className="absolute top-1/2 -translate-y-1/2 left-0"
                alt="MunoFlix"
                width={36}
                height={36}
              />
            </div>
            <span className="text-2xl">MunoFlix</span>
          </Link>
          
          {/* Search Icon and Hamburger menu */}
          <div className="flex items-center gap-4">
            <div className="text-white">
              <Search />
            </div>
            <Responsive />
          </div>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#1a1a2e] border-t border-[#39374b] z-50">
          <MobileBottomNav />
        </div>
      </div>
    </>
  )
}

// Mobile Bottom Navigation Component
const MobileBottomNav = () => {
  const pathname = usePathname()

  const navItems = [
    { 
      name: 'Home', 
      path: '/', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    { 
      name: 'Trending', 
      path: '/catalog?sort=TRENDING_DESC', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      )
    },
    { 
      name: 'News', 
      path: '/news', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9" />
        </svg>
      )
    },
    { 
      name: 'Collection', 
      path: '/collection', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    { 
      name: 'About', 
      path: '/about', 
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ]

  return (
    <div className="flex justify-around items-center h-16">
      {navItems.map((item) => {
        const isActive = pathname === item.path || 
          (item.path === '/catalog?sort=TRENDING_DESC' && pathname.includes('/catalog')) ||
          (item.path === '/news' && pathname.includes('/news')) ||
          (item.path === '/collection' && pathname.includes('/collection')) ||
          (item.path === '/about' && pathname.includes('/about'))
        
        return (
          <a
            key={item.name}
            href={item.path}
            className={`flex flex-col items-center justify-center flex-1 py-2 transition-all duration-200 ${
              isActive 
                ? 'text-[#6c5dd3]' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'scale-100'}`}>
              {item.icon}
            </div>
            <span className={`text-xs mt-1 transition-all duration-200 ${
              isActive ? 'font-semibold' : 'font-normal'
            }`}>
              {item.name}
            </span>
            {isActive && (
              <div className="w-1 h-1 bg-[#6c5dd3] rounded-full mt-1"></div>
            )}
          </a>
        )
      })}
    </div>
  )
}

export default Header
