import { IoStar, IoStarHalf, IoStarOutline } from "react-icons/io5"

const Rating = ({ info }) => {
  const rating = info?.vote_average || 0;
  const voteCount = info?.vote_count || 0;
  
  // Calculate star display
  const fullStars = Math.floor(rating / 2);
  const hasHalfStar = rating % 2 >= 1;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="bg-[#22212c] border border-[#39374b] rounded-2xl p-6 max-w-md mx-auto mt-8">
      <div className="text-center">
        {/* Main Rating */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full w-16 h-16 flex items-center justify-center">
            <span className="text-white text-xl font-bold">{rating.toFixed(1)}</span>
          </div>
          <div className="text-left">
            <div className="text-white text-2xl font-bold">/10</div>
            <div className="text-gray-400 text-sm">{voteCount.toLocaleString()} votes</div>
          </div>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-1 mb-4">
          {Array.from({ length: fullStars }).map((_, i) => (
            <IoStar key={`full-${i}`} className="text-yellow-400 text-2xl" />
          ))}
          {hasHalfStar && <IoStarHalf className="text-yellow-400 text-2xl" />}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <IoStarOutline key={`empty-${i}`} className="text-yellow-400 text-2xl" />
          ))}
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Story</span>
            <div className="flex items-center gap-1">
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStarOutline className="text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Animation</span>
            <div className="flex items-center gap-1">
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStarHalf className="text-yellow-400" />
              <IoStarOutline className="text-yellow-400" />
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Sound</span>
            <div className="flex items-center gap-1">
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStar className="text-yellow-400" />
              <IoStarOutline className="text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 rounded-xl transition-all transform hover:scale-105">
          Rate This {info?.type === 'movie' ? 'Movie' : 'Series'}
        </button>
        
        <div className="text-gray-500 text-xs mt-3">
          Share your thoughts with the community
        </div>
      </div>
    </div>
  )
}

export default Rating