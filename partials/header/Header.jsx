import { nightTokyo } from "@/utils/fonts"
import styles from "./header.module.css"
import Link from "next/link"
import Image from "next/image"
import Links from "./Links"
import Search from "./Search"
import Responsive from "./Responsive"
import Profile from "./Profile"


const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>

        <div className={styles.left}>

          <Responsive />

          <Link href={"/"} className={`${nightTokyo.className} text-white flex items-center gap-2`}>
            <div className="relative w-[50px]">
              <Image
                src="/images/logo-2.png"
                className="absolute top-1/2 -translate-y-1/2 left-0"
                alt="movieVerse"
                width={46}
                height={46}
              />
            </div>
            <span className="text-3xl">MunoFlix</span>
          </Link>

          {/* links */}
          <Links />

        </div>

        <div className={`${styles.right} min-[1390px]:w-[24%]`}>
          <Search />
          <Profile />
          {/* notification */}
          {/* <div className="text-2xl text-slate-200">
            <Bell />
          </div> */}


        </div>

      </div>
    </div>
  )
}

export default Header