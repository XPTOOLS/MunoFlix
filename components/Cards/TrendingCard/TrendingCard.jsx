"use client"
import Image from "next/image"
import styles from "./TrendingCard.module.css"
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { Totalgenres } from "@/utils/Genres";

const TrendingCard = ({ info }) => {
  // Format rating to 1 decimal place
  const formattedRating = info?.vote_average ? info.vote_average.toFixed(1) : "0.0";
  
  // Get primary genre
  const primaryGenre = info?.genre_ids?.[0] ? Totalgenres?.find(g => g?.id === info.genre_ids[0])?.name : "Movie";
  
  // Determine media type display
  const mediaType = info?.media_type === "movie" ? "Movie" : 
                   info?.media_type === "tv" ? "TV Show" : 
                   info?.title ? "Movie" : "TV Show";

  return (
    <Link
      href={`/watch/${info?.id}?media_type=${info?.media_type || "movie"}`}
      className={`${styles?.cardImage} w-full aspect-[9/14] rounded-2xl relative overflow-hidden cursor-pointer group`}
    >
      <Image
        src={
          info?.poster_path 
            ? `https://image.tmdb.org/t/p/w500${info.poster_path}`
            : "/images/logo.png" // Fallback image
        }
        alt={info?.title || info?.name || "Trending"}
        width={200}
        height={280}
        quality={100}
        className="object-cover w-full h-full rounded-2xl hover:cursor-pointer group-hover:scale-105 transition-transform duration-300"
      />

      {/* Rating Badge - Always visible on trending page */}
      <div className={`absolute top-0 left-0 bg-[#21212c]/90 backdrop-blur-sm w-auto min-w-[70px] rounded-br-lg rounded-tl-md flex items-center justify-center gap-2 text-white h-10 px-3 border border-[#39374b]`}>
        <FaStar className="text-yellow-400" />
        <span className="font-semibold">{formattedRating}</span>
      </div>

      {/* Content Overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-3 z-10 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl">
        <h1 className="text-white font-semibold text-sm leading-tight line-clamp-2 mb-1">
          {info?.title || info?.name || "Unknown Title"}
        </h1>
        <div className="flex items-center justify-between text-xs text-gray-300">
          <span className="capitalize">{mediaType}</span>
          {primaryGenre && (
            <span className="text-gray-400">• {primaryGenre}</span>
          )}
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-2xl"></div>
    </Link>
  )
}

export default TrendingCard