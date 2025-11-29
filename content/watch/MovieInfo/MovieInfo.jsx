"use client"
import { getSeason } from "@/utils/SmallPrograms"
import Image from "next/image"
import Link from "next/link"
import { IoTimeOutline, IoCalendarOutline, IoFlagOutline, IoFilmOutline, IoStatsChart } from "react-icons/io5"

const MovieInfo = ({ info }) => {
  const media_type = info.type

  return (
    <div className="text-white">
      {/* Main Content - Poster, Details, Rating in one row on desktop */}
      <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto">
        {/* Left: Poster */}
        <div className="flex-shrink-0 flex justify-center lg:justify-start">
          <Image
            src={`https://image.tmdb.org/t/p/w500${info?.poster_path}`}
            alt={info?.title || info?.name || "Poster"}
            width={180}
            height={270}
            className="rounded-xl object-cover shadow-lg border border-[#39374b]"
          />
        </div>

        {/* Middle: Movie Details */}
        <div className="flex-1">
          <h1 className="text-2xl lg:text-2xl font-bold font-['poppins'] mb-3 text-center lg:text-left">
            {info?.title || info?.name || ""}
          </h1>
          
          {/* Quality Badges */}
          <div className="flex gap-2 mb-4 justify-center lg:justify-start">
            <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded">HD</span>
            <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">SUB</span>
            <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-1 rounded">
              {media_type?.charAt(0).toUpperCase() + media_type?.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Overview */}
          <p className="text-sm text-gray-300 font-['poppins'] leading-relaxed mb-6 line-clamp-4 text-center lg:text-left">
            {info?.overview}
          </p>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* Left Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <IoFilmOutline className="text-purple-400 flex-shrink-0" />
                <span className="font-medium min-w-[70px]">Type:</span>
                <Link href={`/`} className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                  {media_type?.charAt(0).toUpperCase() + media_type?.slice(1).toLowerCase()}
                </Link>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <IoFlagOutline className="text-purple-400 flex-shrink-0" />
                <span className="font-medium min-w-[70px]">Country:</span>
                <span className="text-purple-400 text-sm">
                  {info?.origin_country?.[0] || "N/A"}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <IoCalendarOutline className="text-purple-400 flex-shrink-0" />
                <span className="font-medium min-w-[70px]">Released:</span>
                <span className="text-purple-400 text-sm">
                  {info?.release_date ? new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(info?.release_date)) : 'N/A'}
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-300">
                <IoTimeOutline className="text-purple-400 flex-shrink-0" />
                <span className="font-medium min-w-[70px]">Status:</span>
                <Link href={`/catalog?airing=${info?.status}&sort=POPULARITY_DESC`} className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                  {info?.status}
                </Link>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <IoFilmOutline className="text-purple-400 flex-shrink-0" />
                <span className="font-medium min-w-[70px]">Episodes:</span>
                <Link href={`/catalog?episodes=${info?.episodes}&sort=POPULARITY_DESC`} className="text-purple-400 hover:text-purple-300 transition-colors text-sm">
                  {media_type === "movie" ? 1 : info?.number_of_episodes || 1}
                </Link>
              </div>

              <div className="flex items-center gap-2 text-gray-300">
                <IoStatsChart className="text-purple-400 flex-shrink-0" />
                <span className="font-medium min-w-[70px]">Season:</span>
                <span className="text-purple-400 text-sm">
                  {getSeason(new Date(info?.release_date))}
                </span>
              </div>
            </div>
          </div>

          {/* Genres */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-gray-300 mb-2 justify-center lg:justify-start">
              <IoStatsChart className="text-purple-400" />
              <span className="font-medium">Genres:</span>
            </div>
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {info?.genres?.map((item) => (
                <Link 
                  key={item?.id} 
                  href={`/catalog?genres=%5B"${item?.name}"%5D&sort=POPULARITY_DESC`}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-xs bg-purple-900/30 px-2 py-1 rounded"
                >
                  {item?.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Rating Box - This will be positioned exactly where waifu was */}
        {/* This space is reserved for the Rating component from the parent */}
      </div>
    </div>
  )
}

export default MovieInfo