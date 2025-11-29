import { FaUser } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { RxExit, RxPerson } from "react-icons/rx";
import { motion } from "framer-motion"
import Link from "next/link";
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
          // Logged Out State - Updated (Google Sign In removed)
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

            <Link 
              href={"/settings"} 
              className="flex items-center gap-2 hover:bg-[#231f2f] rounded-xl px-2 py-2 text-slate-200 cursor-pointer transition-colors"
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