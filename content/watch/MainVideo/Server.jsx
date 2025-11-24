import React, { useEffect, useState } from "react";
import { useWatchContext } from "@/context/Watch";

const Server = () => {
  const { MovieId, setWatchInfo, MovieInfo, episode, season } = useWatchContext();

  const [selectedServer, setSelectedServer] = useState("");
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [subtitleLinks, setSubtitleLinks] = useState([]);
  const [loadingDownload, setLoadingDownload] = useState(false);

  // Improved server lists based on the other script
  const MovieVideoPlayers = {
    "VidLink (Recommended)": `https://vidlink.pro/movie/${MovieId}?player=jw&primaryColor=006fee&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false`,
    "VidLink 2": `https://vidlink.pro/movie/${MovieId}?primaryColor=006fee&autoplay=false`,
    "SuperEmbed": `https://multiembed.mov/directstream.php?video_id=${MovieId}&tmdb=1`,
    "VidSrc 5 (Recommended)": `https://vidsrc.cc/v3/embed/movie/${MovieId}?autoPlay=false`,
    "VidSrc 2": `https://vidsrc.to/embed/movie/${MovieId}`,
    "VidSrc 4": `https://vidsrc.cc/v2/embed/movie/${MovieId}?autoPlay=false`,
    "AutoEmbed 1": `https://autoembed.co/movie/tmdb/${MovieId}`,
    "AutoEmbed 2": `https://player.autoembed.cc/embed/movie/${MovieId}`,
    "2embed.cc": `https://www.2embed.cc/embed/${MovieId}`,
    "MoviesAPI": `https://moviesapi.club/movie/${MovieId}`,
    "FilmKu": `https://filmku.stream/embed/${MovieId}`,
    "NontonGo": `https://www.nontongo.win/embed/movie/${MovieId}`,
    "<Embed>": `https://embed.su/embed/movie/${MovieId}`,
    "embed.smashystream.com": `https://embed.smashystream.com/movie.php?id=${MovieId}`,
    "databasegdriveplayer.xyz": `https://databasegdriveplayer.xyz/player.php?imdb=${MovieId}`,
  };

  const TVVideoPlayers = {
    "VidLink (Recommended)": `https://vidlink.pro/tv/${MovieId}/${season}/${episode}?player=jw&primaryColor=f5a524&secondaryColor=a2a2a2&iconColor=eefdec&autoplay=false`,
    "VidLink 2": `https://vidlink.pro/tv/${MovieId}/${season}/${episode}?primaryColor=f5a524&autoplay=false`,
    "SuperEmbed": `https://multiembed.mov/directstream.php?video_id=${MovieId}&tmdb=1&s=${season}&e=${episode}`,
    "VidSrc 5 (Recommended)": `https://vidsrc.cc/v3/embed/tv/${MovieId}/${season}/${episode}?autoPlay=false`,
    "VidSrc 2": `https://vidsrc.to/embed/tv/${MovieId}/${season}/${episode}`,
    "VidSrc 4": `https://vidsrc.cc/v2/embed/tv/${MovieId}/${season}/${episode}?autoPlay=false`,
    "AutoEmbed 1": `https://autoembed.co/tv/tmdb/${MovieId}-${season}-${episode}`,
    "AutoEmbed 2": `https://player.autoembed.cc/embed/tv/${MovieId}/${season}/${episode}`,
    "2embed.cc": `https://www.2embed.cc/embedtv/${MovieId}&s=${season}&e=${episode}`,
    "MoviesAPI": `https://moviesapi.club/tv/${MovieId}-${season}-${episode}`,
    "FilmKu": `https://filmku.stream/embed/series?tmdb=${MovieId}&sea=${season}&epi=${episode}`,
    "NontonGo": `https://www.nontongo.win/embed/tv/${MovieId}/${season}/${episode}`,
    "<Embed>": `https://embed.su/embed/tv/${MovieId}/${season}/${episode}`,
    "embed.smashystream.com": `https://embed.smashystream.com/tv.php?id=${MovieId}&s=${season}&e=${episode}`,
    "databasegdriveplayer.xyz": `https://databasegdriveplayer.xyz/player.php?type=series&tmdb=${MovieId}&season=${season}&episode=${episode}`,
  };

  const servers = MovieInfo?.type === "movie"
    ? Object.entries(MovieVideoPlayers)
    : Object.entries(TVVideoPlayers);

  const changeServer = (e) => {
    const val = e.target.value;
    if (!val) return;
    const [name, url] = JSON.parse(val);
    setSelectedServer(name);
    setWatchInfo({ loading: true });
    setWatchInfo({ url, iframe: true, loading: false });
  };

  // Improved Download Links - Removed YTS.mx
  const getDownloadLinks = async () => {
    if (downloadLinks.length > 0) return;
    setLoadingDownload(true);

    const title = encodeURIComponent((MovieInfo?.title || MovieInfo?.name || "").trim());
    const year = MovieInfo?.release_date?.split("-")[0] || MovieInfo?.first_air_date?.split("-")[0] || "";

    // Try multiple download sources
    const sources = [
      {
        name: "1337x",
        links: [
          { quality: "1080p", size: "2-8GB", url: `https://1337x.to/search/${title}+${year}+1080p/1/` },
          { quality: "720p", size: "1-4GB", url: `https://1337x.to/search/${title}+${year}+720p/1/` },
          { quality: "4K", size: "10-20GB", url: `https://1337x.to/search/${title}+${year}+2160p/1/` },
        ]
      },
      {
        name: "The Pirate Bay",
        links: [
          { quality: "1080p", size: "2-8GB", url: `https://thepiratebay.org/search.php?q=${title}+${year}+1080p` },
          { quality: "720p", size: "1-4GB", url: `https://thepiratebay.org/search.php?q=${title}+${year}+720p` },
        ]
      },
      {
        name: "RARBG",
        links: [
          { quality: "Various", size: "", url: `https://rargb.to/search/?search=${title}+${year}` },
        ]
      }
    ];

    // Set download links immediately (no API dependency)
    const allLinks = sources.flatMap(source => 
      source.links.map(link => ({
        ...link,
        source: source.name
      }))
    );
    
    setDownloadLinks(allLinks);
    setLoadingDownload(false);
  };

  // Improved Subtitle Links
  const getSubtitleLinks = () => {
    if (subtitleLinks.length > 0) return;
    const title = encodeURIComponent(MovieInfo?.title || MovieInfo?.name || "");
    
    setSubtitleLinks([
      { lang: "English", url: `https://subscene.com/subtitles/searchbytitle?query=${title}` },
      { lang: "Arabic", url: `https://subscene.com/subtitles/searchbytitle?query=${title}&l=arabic` },
      { lang: "Spanish", url: `https://subscene.com/subtitles/searchbytitle?query=${title}&l=spanish` },
      { lang: "French", url: `https://subscene.com/subtitles/searchbytitle?query=${title}&l=french` },
      { lang: "Indonesian", url: `https://subscene.com/subtitles/searchbytitle?query=${title}&l=indonesian` },
      { lang: "Portuguese", url: `https://subscene.com/subtitles/searchbytitle?query=${title}&l=portuguese` },
      { lang: "German", url: `https://subscene.com/subtitles/searchbytitle?query=${title}&l=german` },
      { lang: "All Languages", url: `https://yifysubtitles.ch/movie-imdb/${MovieId}` },
      { lang: "OpenSubtitles", url: `https://www.opensubtitles.org/en/search2?moviename=${title}` },
    ]);
  };

  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      // Auto-select recommended server first, then first available
      const recommended = servers.find(([name]) => name.includes("(Recommended)"));
      const [name, url] = recommended || servers[0];
      setSelectedServer(name);
      setWatchInfo({ url, iframe: true, loading: false });
    }
    
    // Pre-load download and subtitle links
    getDownloadLinks();
    getSubtitleLinks();
  }, [MovieId, season, episode]);

  const handleDownloadClick = (url) => {
    window.open(url, '_blank');
  };

  const handleSubtitleClick = (url) => {
    window.open(url, '_blank');
  };

  // Get server badge color based on name
  const getServerBadgeColor = (serverName) => {
    if (serverName.includes("(Recommended)")) return "bg-gradient-to-r from-green-600 to-emerald-600";
    if (serverName.includes("VidLink")) return "bg-gradient-to-r from-blue-600 to-purple-600";
    if (serverName.includes("VidSrc")) return "bg-gradient-to-r from-purple-600 to-pink-600";
    return "bg-gradient-to-r from-gray-600 to-gray-700";
  };

  return (
    <div className="w-full bg-[#1e1c2f] border-t border-[#5b5682]/30">
      {/* Server Selector */}
      <div className="bg-[#2d2a44] px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-white font-semibold">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 32 32">
            <path d="M4.6661 6.66699C4.29791 6.66699 3.99943 6.96547 3.99943 7.33366V24.667C3.99943 25.0352 4.29791 25.3337 4.6661 25.3337H27.3328C27.701 25.3337 27.9994 25.0352 27.9994 24.667V7.33366C27.9994 6.96547 27.701 6.66699 27.3328 6.66699H4.6661ZM8.66667 21.3333C8.29848 21.3333 8 21.0349 8 20.6667V11.3333C8 10.9651 8.29848 10.6667 8.66667 10.6667H14C14.3682 10.6667 14.6667 10.9651 14.6667 11.3333V12.6667C14.6667 13.0349 14.3682 13.3333 14 13.3333H10.8C10.7264 13.3333 10.6667 13.393 10.6667 13.4667V18.5333C10.6667 18.607 10.7264 18.6667 10.8 18.6667H14C14.3682 18.6667 14.6667 18.9651 14.6667 19.3333V20.6667C14.6667 21.0349 14.3682 21.3333 14 21.3333H8.66667ZM18 21.3333C17.6318 21.3333 17.3333 21.0349 17.3333 20.6667V11.3333C17.3333 10.9651 17.6318 10.6667 18 10.6667H23.3333C23.7015 10.6667 24 10.9651 24 11.3333V12.6667C24 13.0349 23.7015 13.3333 23.3333 13.3333H20.1333C20.0597 13.3333 20 13.393 20 13.4667V18.5333C20 18.607 20.0597 18.6667 20.1333 18.6667H23.3333C23.7015 18.6667 24 18.9651 24 19.3333V20.6667C24 21.0349 23.7015 21.3333 23.3333 21.3333H18Z" />
          </svg>
          Server
        </div>

        <select
          onChange={changeServer}
          value={selectedServer ? JSON.stringify([selectedServer, (MovieInfo?.type === "movie" ? MovieVideoPlayers : TVVideoPlayers)[selectedServer]]) : ""}
          className="w-full sm:w-auto min-w-[250px] px-5 py-3 bg-[#413d57] border border-[#6a6488] rounded-xl text-white font-medium focus:outline-none focus:ring-4 focus:ring-purple-500/40"
        >
          <option value="" disabled>Select Server</option>
          {servers.map(([name, url]) => (
            <option key={name} value={JSON.stringify([name, url])}>
              {name}
            </option>
          ))}
        </select>
      </div>

      {/* Current Server Info with Badge */}
      <div className="bg-[#252233] px-5 py-3 border-b border-[#5b5682]/20">
        <div className="flex items-center justify-center gap-3">
          <span className="text-gray-300 text-sm sm:text-base">
            Currently using:
          </span>
          {selectedServer && (
            <span className={`px-3 py-1 ${getServerBadgeColor(selectedServer)} text-white font-bold rounded-full text-sm`}>
              {selectedServer}
            </span>
          )}
        </div>
      </div>

      {/* Download & Subtitle Options */}
      <div className="bg-[#2d2a44] px-5 py-4">
        {/* Download Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white font-semibold text-lg">Download:</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {loadingDownload ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-400"></div>
                Loading download options...
              </div>
            ) : downloadLinks.length > 0 ? (
              downloadLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleDownloadClick(link.url)}
                  className="flex flex-col items-center gap-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105 min-w-[100px]"
                >
                  <span className="font-semibold">{link.quality}</span>
                  {link.size && <span className="text-xs opacity-80">{link.size}</span>}
                  <span className="text-xs opacity-60">{link.source}</span>
                </button>
              ))
            ) : (
              <div className="text-gray-400 text-sm">No download options available</div>
            )}
          </div>
        </div>

        {/* Subtitles Section */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="text-white font-semibold text-lg">Subtitles:</span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {subtitleLinks.map((sub, index) => (
              <button
                key={index}
                onClick={() => handleSubtitleClick(sub.url)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium rounded-lg shadow-md transition transform hover:scale-105 text-sm"
              >
                <span>{sub.lang}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Server;