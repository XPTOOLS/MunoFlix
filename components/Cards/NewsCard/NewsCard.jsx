"use client";
import { FaStar } from "react-icons/fa";

const NewsCard = ({ news, onViewDetails }) => {
  const { id, title, excerpt, category, image, date, source, vote_average } = news;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'movies':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'tv':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <article 
      className="bg-[#1e1c2f] border border-[#39374b] rounded-xl overflow-hidden hover:border-[#6c5dd3] transition-all duration-300 hover:scale-105 cursor-pointer group"
      onClick={onViewDetails}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(category)}`}>
            {category.toUpperCase()}
          </span>
        </div>
        {/* Rating Badge */}
        {vote_average && (
          <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-white text-xs">
            <FaStar className="text-yellow-400" />
            <span>{vote_average.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
          <span>{formatDate(date)}</span>
          <span>•</span>
          <span className="text-purple-400">{source}</span>
        </div>
        
        <h3 className="text-white font-semibold text-lg leading-tight mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
          {excerpt}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-purple-400 text-sm font-medium group-hover:text-purple-300 transition-colors">
            Read Full Story →
          </span>
        </div>
      </div>
    </article>
  );
};

export default NewsCard;