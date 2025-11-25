import { Suspense } from "react";
import Collection from "@/content/Home/Collection";
import Herosection from "@/content/Home/HeroSection/Herosection"
import Popular from "@/content/Home/Popular";
import TopRated from "@/content/Home/Season";
import Trending from "@/content/Home/Trending";
import WatchHistory from "@/content/Home/WatchHistory";
import { getTrendingMovies, getTopRatedMovies } from "@/lib/MoviesFunctions";

// Material Wave Loading Component
function HomeLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44]">
      {/* Hero Section Loading */}
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave"></div>
            <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="text-gray-400 text-sm">Loading MunoFlix...</p>
        </div>
      </div>
    </div>
  );
}

// Main content component wrapped in Suspense
async function HomeContent() {
  // Add artificial delay to see the loading animation (remove in production)
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const [trendingdata, top_rateddata] = await Promise.all([
    getTrendingMovies(),
    getTopRatedMovies()
  ]);

  return (
    <>
      <Herosection data={trendingdata} />

      <div className="w-full flex flex-col items-center z-10 relative main-responsive">
        <Trending data={trendingdata} />
        <WatchHistory />
        {/* Remove Featured Collections section */}
        {/* <Collection /> */}
        <Popular />
        <TopRated data={top_rateddata} />
      </div>

      {/* background */}
      <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px]"></div>
      <div className="fixed w-[500px] h-[370.13px] right-[50%] bottom-[20%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] z-0 rounded-full"></div>
    </>
  );
}

const Home = () => {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeContent />
    </Suspense>
  );
}

export default Home;