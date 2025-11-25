"use client";
import { useState, useEffect, Suspense } from "react";
import Movies from "@/content/catalog/Movies";
import Options from "@/content/catalog/Options";

const Page = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading delay to see the animation
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Material Wave Loading Component
  const MaterialWaveLoading = () => (
    <div className="w-full flex flex-col items-center justify-center py-20">
      <div className="flex justify-center items-center space-x-2 mb-4">
        <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave"></div>
        <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-3 h-10 bg-pink-400 rounded-full animate-wave" style={{ animationDelay: '0.3s' }}></div>
        <div className="w-3 h-10 bg-purple-400 rounded-full animate-wave" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-gray-400 text-sm">Loading catalog...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#12111a] via-[#1a1825] to-[#2d2a44] pt-20 pb-12">
      <div className="w-full flex flex-col items-center z-10 relative">
        <div className="w-full max-w-[96rem] px-4 lg:px-6 relative">

          {/* small line separation */}
          <div className="w-[-webkit-fill-available] h-[1px] absolute bg-[#212029] top-[1px]"></div>

          <div className="mt-[15px] flex justify-between items-center">
            <h1 className="text-[#ffffffea] font-medium text-[23px] font-['poppins']">Catalog</h1>
          </div>

          {/* Material Wave Loading */}
          {loading ? (
            <MaterialWaveLoading />
          ) : (
            <div className="flex gap-4 mt-4 mb-32 max-[780px]:flex-col">
              <Suspense fallback={<MaterialWaveLoading />}>
                <Movies />
              </Suspense>
            </div>
          )}
        </div>
      </div>

      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="fixed w-[138.33px] h-[82.25px] left-[1%] top-[2%] bg-[#92b7fc8f] blur-[200px]"></div>
        <div className="fixed w-[500px] h-[370.13px] right-[50%] bottom-[20%] bg-[#576683b4] blur-[215.03px] translate-x-[70%] z-0 rounded-b-[30%]"></div>
      </div>
    </div>
  );
}

export default Page;
