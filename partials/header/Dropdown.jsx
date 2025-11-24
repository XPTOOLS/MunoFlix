import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { RxExit, RxPerson } from "react-icons/rx";
import { motion } from "framer-motion"
import Link from "next/link";
import { signinwithGoogle } from "@/firebase/authentication";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";

const Dropdown = ({ data, isLoggedIn }) => {
  return (
    <motion.div
      className="bg-[#17151e6f] backdrop-blur-[12px] border-2 border-[#4844606e] absolute top-14 right-0 rounded-2xl min-w-52 px-2 py-2 text-[14px] z-50"
      style={{ transformOrigin: 'top right' }}
      initial={{ scale: "0.1 0.3" }}
      animate={{ scale: 1 }}
    >
      {
        isLoggedIn ? (
          // Logged In State
          <>
            <div className="flex flex-col font-semibold ml-3 text-white mb-2">
              Signed in as <span className="text-purple-400">{data?.name}</span>
            </div>

            <Link
              className="flex items-center gap-2 hover:bg-[#262232] rounded-xl px-2 py-2 text-slate-200 cursor-pointer transition-colors"
              href={"/profile"}
            >
              <div><FaUser /></div>
              <div>Profile</div>
            </Link>

            <Link 
              href={"/settings"} 
              className="flex items-center gap-2 hover:bg-[#231f2f] rounded-xl px-2 py-2 text-slate-200 cursor-pointer transition-colors"
            >
              <div><IoMdSettings /></div>
              <div>Settings</div>
            </Link>
            
            <div 
              className="flex items-center gap-2 hover:bg-[#351f23] rounded-xl px-2 py-2 text-slate-200 cursor-pointer transition-colors" 
              onClick={() => signOut(auth)}
            >
              <div><RxExit /></div>
              <div>Log Out</div>
            </div>
          </>
        ) : (
          // Logged Out State - Updated with both options
          <>
            <Link 
              href="/signup"
              className="flex items-center gap-2 hover:bg-[#1a2f26] rounded-xl px-2 py-2 mb-2 text-green-400 cursor-pointer transition-colors font-semibold"
            >
              <div><RxPerson /></div>
              <div>Sign Up</div>
            </Link>

            <Link 
              href="/login"
              className="flex items-center gap-2 hover:bg-[#262232] rounded-xl px-2 py-2 mb-2 text-slate-200 cursor-pointer transition-colors"
            >
              <div><RxExit /></div>
              <div>Sign In</div>
            </Link>

            <div 
              className="flex items-center gap-2 hover:bg-[#2a2623] rounded-xl px-2 py-2 text-slate-200 cursor-pointer transition-colors" 
              onClick={() => signinwithGoogle()}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <div>Google Sign In</div>
            </div>

            <Link 
              href={"/settings"} 
              className="flex items-center gap-2 hover:bg-[#231f2f] rounded-xl px-2 py-2 text-slate-200 cursor-pointer transition-colors mt-2"
            >
              <div><IoMdSettings /></div>
              <div>Settings</div>
            </Link>
          </>
        )
      }
    </motion.div>
  )
}

export default Dropdown