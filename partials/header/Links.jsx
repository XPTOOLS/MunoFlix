"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import styles from "./header.module.css"

const Links = ({ isMobile }) => {
  const pathname = usePathname()

  const links = [
    { name: "Home", path: "/" },
    { name: "Trending", path: "/catalog?sort=TRENDING_DESC" },
    { name: "News", path: "/news" },
    { name: "Collection", path: "/collection" },
    { name: "About", path: "/about" }
  ]

  if (isMobile) {
    return (
      <div className="flex flex-col h-full justify-between items-center text-[#c4c2c7] p-2 gap-1 overflow-hidden">
        {links.map((link, index) => {
          const isActive = pathname === link.path || 
            (link.path === '/catalog?sort=TRENDING_DESC' && pathname.includes('/catalog')) ||
            (link.path === '/news' && pathname.includes('/news')) ||
            (link.path === '/collection' && pathname.includes('/collection')) ||
            (link.path === '/about' && pathname.includes('/about'))
          
          return (
            <Link
              href={link.path}
              key={link.name}
              className={`${isActive ? "text-white bg-[#242233] border-2 border-[#313e5038]" : ""} w-full h-full text-center py-[6px] rounded-md hover:bg-[#242233] border-2 border-transparent hover:border-[#313e5038] relative ${styles.animate_ltr}`}
              style={{ animationDelay: `${index * 0.13}s` }}
            >
              {link.name}
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex mt-[8px] text-[#c4c2c7] max-[990px]:hidden ml-8">
      {links.map((link, index) => {
        const isActive = pathname === link.path || 
          (link.path === '/catalog?sort=TRENDING_DESC' && pathname.includes('/catalog')) ||
          (link.path === '/news' && pathname.includes('/news')) ||
          (link.path === '/collection' && pathname.includes('/collection')) ||
          (link.path === '/about' && pathname.includes('/about'))
        
        return (
          <Link
            href={link.path}
            key={link.name}
            className={`${index === 0 ? "ml-0" : "ml-6"} px-3 py-2 text-sm font-medium transition-all duration-200 relative ${
              isActive ? "text-white" : "text-gray-300 hover:text-white"
            }`}
          >
            {link.name}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#6c5dd3] rounded-full"></div>
            )}
          </Link>
        )
      })}
    </div>
  )
}

export default Links
