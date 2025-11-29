"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { HiOutlineBars3, HiChevronUp, HiChevronDown } from "react-icons/hi2";
import Select from "@/components/ui/Select";
import EpisodeCard from "./EpisodeCard";
import { useWatchContext } from "@/context/Watch";

const EpisodeSelector = () => {
  const [epFromTo, setEpFromTo] = useState({ id: 0 });
  const [TFseason, setTFseason] = useState({ id: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [watchedEP, setWatchedEP] = useState([]);
  const [currentChunk, setCurrentChunk] = useState(0);

  const chunkSize = 15;

  const {
    episode,
    episodes,
    MovieId,
    MovieInfo,
    setSeason,
    episodeLoading,
  } = useWatchContext();

  let loading = episodeLoading;

  useEffect(() => {
    setSeason(TFseason?.value?.replace("Season ", ""));
  }, [TFseason]);

  const SplitedEpisodes = useMemo(() => {
    if (!episodes || episodes.length === 0) return [];
    return episodes?.reduce((chunks, _, i) => {
      if (i % chunkSize === 0) {
        chunks.push(episodes.slice(i, i + chunkSize));
      }
      return chunks;
    }, []);
  }, [episodes]);

  // Reset to first chunk when episodes change
  useEffect(() => {
    setCurrentChunk(0);
    setEpFromTo({ id: 0 });
  }, [episodes]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(`playing.${MovieId}`) || "[]");
    if (!storedItems.includes(episode)) {
      storedItems.push(episode);
      localStorage.setItem(`playing.${MovieId}`, JSON.stringify(storedItems));
    }
    setWatchedEP(storedItems);
  }, [MovieId, episode]);

  const handleSearchQueryChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleChunkChange = useCallback((direction) => {
    if (direction === 'next' && currentChunk < SplitedEpisodes.length - 1) {
      setCurrentChunk(prev => prev + 1);
      setEpFromTo({ id: currentChunk + 1 });
    } else if (direction === 'prev' && currentChunk > 0) {
      setCurrentChunk(prev => prev - 1);
      setEpFromTo({ id: currentChunk - 1 });
    }
  }, [currentChunk, SplitedEpisodes?.length]);

  const handleSelectChange = useCallback((selected) => {
    setCurrentChunk(selected.id);
    setEpFromTo(selected);
  }, []);

  // Generate proper range labels
  const chunkLabels = useMemo(() => {
    if (!SplitedEpisodes || SplitedEpisodes.length === 0) return [];
    return SplitedEpisodes.map((chunk, index) => {
      const startEp = index * chunkSize + 1;
      const endEp = Math.min((index + 1) * chunkSize, episodes?.length || 0);
      return `${startEp} - ${endEp}`;
    });
  }, [SplitedEpisodes, episodes]);

  const filteredEpisodes = useMemo(() => {
    if (searchQuery) {
      return episodes?.filter(
        (item) =>
          `episode ${item?.episode_number?.toString()}`.includes(searchQuery.toLowerCase()) ||
          item?.name?.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, '')?.includes(searchQuery.toLowerCase())
      ) || [];
    }
    return SplitedEpisodes[currentChunk] || [];
  }, [searchQuery, episodes, SplitedEpisodes, currentChunk]);

  return (
    <div className="bg-[#201f28] w-full max-w-[22rem] min-w-[18rem] EPSResponsive rounded-md flex flex-col">
      <div>
        <div className="flex justify-between px-2 py-3 border-b-2 border-[#514f61a1]">
          <div className="bg-[#2e2b3d] h-10 rounded-md flex-1 mr-2">
            <input
              type="text"
              placeholder="Search episode..."
              className="bg-transparent outline-none h-full w-full px-2 text-slate-200"
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
          </div>

          <div className="bg-[#2e2b3d] flex gap-2 rounded-lg">
            <div className="bg-[#d5d5d7] w-10 rounded-lg flex items-center justify-center text-2xl cursor-pointer">
              <HiOutlineBars3 />
            </div>
          </div>
        </div>

        <div className="flex justify-between px-2 py-3 gap-4">
          {/* Episode Range Selector */}
          <div className="w-full">
            <Select
              setSelected={handleSelectChange}
              data={chunkLabels}
              defaultValue={0}
              selectedId={currentChunk}
            />
          </div>

          {MovieInfo?.type === "tv" && (
            <div className="w-full">
              <Select
                setSelected={setTFseason}
                data={[...Array(MovieInfo?.seasons?.length || 0).keys()].map(i => `Season ${i + 1}`)}
                defaultValue={0}
              />
            </div>
          )}
        </div>

        {/* Navigation Controls */}
        {!searchQuery && SplitedEpisodes.length > 1 && (
          <div className="flex justify-between px-2 pb-2">
            <button
              onClick={() => handleChunkChange('prev')}
              disabled={currentChunk === 0}
              className="flex items-center gap-1 px-3 py-1 bg-[#2e2b3d] text-slate-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a364d] transition-colors"
            >
              <HiChevronUp className="w-4 h-4" />
              Previous
            </button>
            
            <div className="text-slate-300 text-sm flex items-center">
              Page {currentChunk + 1} of {SplitedEpisodes.length}
            </div>

            <button
              onClick={() => handleChunkChange('next')}
              disabled={currentChunk === SplitedEpisodes.length - 1}
              className="flex items-center gap-1 px-3 py-1 bg-[#2e2b3d] text-slate-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#3a364d] transition-colors"
            >
              Next
              <HiChevronDown className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="px-2 overflow-y-auto h-full max-h-[44rem] flex-1">
        {loading ? (
          // Show loading skeletons based on actual episode count or reasonable number
          Array.from({ length: Math.min(episodes?.length || 7, 10) }).map((_, index) => (
            <EpisodeCard key={index} loading />
          ))
        ) : (
          <>
            {filteredEpisodes?.length > 0 ? (
              filteredEpisodes.map((item, index) => (
                <EpisodeCard 
                  key={`${item.episode_number}-${index}`} 
                  info={item} 
                  currentEp={episode} 
                  watchedEP={watchedEP} 
                  posterImg={MovieInfo?.poster_path} 
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-[#d5d5d7] text-lg mb-2">No episodes found</p>
                {searchQuery && (
                  <p className="text-[#a5a5b5] text-sm">
                    No results for "{searchQuery}"
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Show total episodes count */}
        {!loading && episodes && episodes.length > 0 && !searchQuery && (
          <div className="text-center py-3 border-t border-[#514f61a1] mt-2">
            <p className="text-[#a5a5b5] text-sm">
              Showing {filteredEpisodes.length} of {episodes.length} episodes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EpisodeSelector;