import { nightTokyo } from "@/utils/fonts"

export default function AboutUs() {
  return (
    <div className="min-h-screen pt-20 px-4">
      {/* Background effects matching homepage */}
      <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px]"></div>
      <div className="fixed w-[500px] h-[370.13px] right-[50%] bottom-[20%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] z-0 rounded-full"></div>
      
      {/* Main content */}
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h1 className={`${nightTokyo.className} text-5xl text-white mb-4`}>
            About MunoFlix
          </h1>
          <p className="text-gray-300 text-lg">
            Your ultimate destination for streaming movies and TV shows
          </p>
        </div>

        <div className="bg-[#1a1a2e] bg-opacity-50 backdrop-blur-lg rounded-2xl p-8 border border-[#313e5038]">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl text-white mb-4">Our Mission</h2>
              <p className="text-gray-300 leading-relaxed">
                MunoFlix is dedicated to bringing you the best streaming experience 
                with a vast collection of movies and TV shows. We believe in making 
                quality entertainment accessible to everyone.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl text-white mb-4">What We Offer</h2>
              <ul className="text-gray-300 space-y-2">
                <li>• High-quality streaming</li>
                <li>• Curated collections</li>
                <li>• Personalized recommendations</li>
                <li>• Multi-platform support</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#313e5038]">
            <h2 className="text-2xl text-white mb-4">Join Our Community</h2>
            <p className="text-gray-300">
              Become part of our growing community of movie enthusiasts. 
              Discover new favorites, share your thoughts, and enjoy unlimited entertainment.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}