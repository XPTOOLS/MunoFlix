"use client"
import { useState } from "react"
import Links from "./Links"

const Responsive = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      {/* Hamburger Button - ONLY this button, no other icons */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white p-2"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 bg-[#1a1a2e] z-40 p-4">
          <Links isMobile={true} />
        </div>
      )}
    </div>
  )
}

export default Responsive
