"use client"

import { useWatchContext } from "@/context/Watch";
import EpInfo from "./EpInfo";
import Option from "./Option"
import Server from "./Server";
import { findMovieFromCollection } from "@/firebase/movies";
import { useEffect, useState, useRef } from "react";
import { useUserInfoContext } from "@/context/UserInfoContext";
import { useWatchSettingContext } from "@/context/WatchSetting";
import { AnimatePresence, motion } from "framer-motion"
import { startMovieTracking, stopMovieTracking, getUserIP } from "@/utils/movieTracker";

const MainVideo = () => {
  const { MovieInfo, watchInfo, episode } = useWatchContext();
  const { watchSetting, setWatchSetting } = useWatchSettingContext()
  const { userInfo, isUserLoggedIn } = useUserInfoContext()
  const [isMovieExists, setIsMovieExists] = useState({})
  const iframeRef = useRef(null);
  const [userIp, setUserIp] = useState(null);
  const [isTracking, setIsTracking] = useState(false);

  // Get user IP when component mounts
  useEffect(() => {
    getUserIP().then(ip => setUserIp(ip));
  }, []);

  // Start tracking function
  const startTracking = async () => {
    if (MovieInfo?.id && MovieInfo?.title && userIp && !isTracking) {
      await startMovieTracking(
        MovieInfo.id.toString(),
        MovieInfo.title || MovieInfo.name || MovieInfo.original_title,
        `https://image.tmdb.org/t/p/w500${MovieInfo.poster_path}`,
        userInfo?.uid || null,
        userIp,
        'iframe'
      );
      setIsTracking(true);
    }
  };

  // Stop tracking function
  const stopTracking = async (completed = false) => {
    if (isTracking) {
      await stopMovieTracking(completed);
      setIsTracking(false);
    }
  };

  // Start tracking when component mounts (assuming iframe starts playing immediately)
  useEffect(() => {
    if (watchInfo?.url) {
      // Start tracking after a short delay to ensure iframe is loaded
      const timer = setTimeout(() => {
        startTracking();
      }, 2000);

      return () => {
        clearTimeout(timer);
        stopTracking(false);
      };
    }
  }, [watchInfo?.url, MovieInfo, userIp]);

  // Also track when user leaves the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      stopTracking(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      stopTracking(false);
    };
  }, [isTracking]);

  useEffect(() => {
    const getdata = async () => {
      const uid = userInfo?.uid
      const isExists = await findMovieFromCollection(uid, MovieInfo?.id)

      // console.log(isExists)
      setIsMovieExists(isExists)
    }

    if (isUserLoggedIn) getdata()
  }, [userInfo])

  return (
    <div className="w-full bg-[#22212c] rounded-md p-2 !pb-0 flex flex-col">
      <iframe
        ref={iframeRef}
        src={watchInfo?.url}
        className="aspect-video z-10"
        allowFullScreen
        loading="lazy"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        title={MovieInfo?.title || MovieInfo?.name || MovieInfo?.original_name || MovieInfo?.original_title}
        onLoad={startTracking} // Start tracking when iframe loads
      />

      <Option isMovieExists={isMovieExists} />

      <div className="h-full min-h-[124px] bg-[#484460] text-slate-100 flex rounded-md overflow-hidden mt-4 shadow-[3px_13px_29px_0px_#48455fbd] max-[880px]:flex-col">
        <EpInfo episode={episode} />
        <Server />
      </div>


      {/* settings */}
      <AnimatePresence>
        {watchSetting?.light ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed top-0 left-0 w-full h-full z-20 bg-[#000000e5]'
            onClick={() => setWatchSetting(prev => ({ ...prev, light: false }))}
          ></motion.div>
        ) : null}
      </AnimatePresence>
    </div >
  )
}

export default MainVideo