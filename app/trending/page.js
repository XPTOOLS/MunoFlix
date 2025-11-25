import { Suspense } from "react";
import { getTrendingMovies } from "@/lib/MoviesFunctions";
import Trending from "@/content/Home/Trending";

// Loading component with better styling
function TrendingLoading() {
  return (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="flex justify-center items-center space-x-2 mb-4">
        <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave"></div>
        <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-gray-400 text-sm">Loading trending content...</p>
    </div>
  );
}

// Main component with artificial delay to see the loading state
async function TrendingContent() {
  // Add artificial delay to see the loading animation (remove in production)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const trendingData = await getTrendingMovies("all", 1);

  if (!trendingData?.results || trendingData.results.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-lg">No trending content found.</div>
      </div>
    );
  }

  return <Trending data={trendingData} />;
}

// Main page
export default function TrendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            Trending Now
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Discover what's popular and trending in movies and TV shows right now
          </p>
        </div>

        {/* Trending Content with Suspense */}
        <Suspense fallback={<TrendingLoading />}>
          <TrendingContent />
        </Suspense>

        {/* Background Effects */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>
  );
}