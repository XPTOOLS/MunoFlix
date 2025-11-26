"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, 
  FaStepBackward, FaStepForward, FaDownload, FaFacebook, FaTwitter, 
  FaInstagram, FaYoutube, FaTelegram, FaWhatsapp 
} from 'react-icons/fa';
import './translated-player.css';

const TranslatedMoviePlayer = ({ movie }) => {
  const router = useRouter();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState('');

  // Social media links
  const socialLinks = [
    {
      icon: <FaFacebook className="text-blue-500" />,
      name: "Facebook",
      url: "https://www.facebook.com/profile.php?id=61556002877589",
    },
    {
      icon: <FaTwitter className="text-blue-400" />,
      name: "Twitter", 
      url: "https://twitter.com/munoflix",
    },
    {
      icon: <FaInstagram className="text-pink-400" />,
      name: "Instagram",
      url: "https://instagram.com/munoflix",
    },
    {
      icon: <FaYoutube className="text-red-500" />,
      name: "YouTube",
      url: "https://youtube.com/@freenethubtech?si=q1t1496Zj6P9cmMs",
    },
    {
      icon: <FaTelegram className="text-blue-400" />,
      name: "Telegram",
      url: "https://t.me/XPTOOLSTEAM",
    },
    {
      icon: <FaWhatsapp className="text-green-500" />,
      name: "WhatsApp",
      url: "https://wa.me/25761787221",
    }
  ];

  // Tooltip content for controls
  const tooltips = {
    play: isPlaying ? 'Pause (k)' : 'Play (k)',
    backward: 'Rewind 10s (j)',
    forward: 'Forward 10s (l)',
    volume: isMuted ? 'Unmute (m)' : 'Mute (m)',
    fullscreen: isFullscreen ? 'Exit fullscreen (f)' : 'Fullscreen (f)',
    download: 'Download movie'
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleWaiting = () => setBuffering(true);
    const handlePlaying = () => setBuffering(false);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Keyboard shortcuts
    const handleKeyPress = (e) => {
      if (!video) return;
      
      switch(e.key.toLowerCase()) {
        case ' ': // Space bar
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'j':
          e.preventDefault();
          skipBackward();
          break;
        case 'l':
          e.preventDefault();
          skipForward();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    // Auto-hide controls after 3 seconds
    let controlsTimeout;
    const resetControlsTimeout = () => {
      clearTimeout(controlsTimeout);
      setShowControls(true);
      controlsTimeout = setTimeout(() => setShowControls(false), 3000);
    };

    resetControlsTimeout();

    // Handle mouse movement for controls
    const handleMouseMove = () => resetControlsTimeout();
    // Handle touch for mobile
    const handleTouchStart = () => resetControlsTimeout();

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('keydown', handleKeyPress);

    // Handle fullscreen change
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearTimeout(controlsTimeout);
    };
  }, [isPlaying, isMuted, isFullscreen]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = () => {
    const videoContainer = videoRef.current.parentElement;
    if (!videoContainer) return;

    if (!document.fullscreenElement) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      } else if (videoContainer.webkitRequestFullscreen) {
        videoContainer.webkitRequestFullscreen();
      } else if (videoContainer.msRequestFullscreen) {
        videoContainer.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const skipForward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(video.currentTime + 10, duration);
  };

  const skipBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(video.currentTime - 10, 0);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/'); // Fallback to home if no history
    }
  };

  // Handle video click for play/pause
  const handleVideoClick = (e) => {
    e.stopPropagation();
    togglePlay();
  };

  return (
    <div className="translated-player-container">
      {/* Main Content - YouTube-like layout */}
      <div className="translated-main-content">
        {/* Video Player - Left Side */}
        <div className="translated-video-section">
          <div 
            className="translated-video-wrapper"
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
            onTouchStart={() => setShowControls(true)}
          >
            {/* Video Element */}
            <video
              ref={videoRef}
              className="translated-video-element"
              src={movie.videoUrl}
              poster={movie.poster}
              onClick={handleVideoClick}
              onEnded={() => setIsPlaying(false)}
              playsInline
              webkit-playsinline="true"
            >
              Your browser does not support the video tag.
            </video>

            {/* Buffering Indicator */}
            {buffering && (
              <div className="translated-buffering">
                <div className="translated-buffering-spinner"></div>
                <div>Loading...</div>
              </div>
            )}

            {/* Controls Overlay */}
            <div 
              className={`translated-controls-overlay ${showControls ? 'visible' : ''}`}
            >
              {/* Top Bar */}
              <div className="translated-top-bar">
                <button
                  onClick={handleBack}
                  className="translated-back-button"
                  type="button"
                >
                  ← Back
                </button>
                
                <div className="translated-title">
                  {movie.title}
                </div>
              </div>

              {/* Center Play Button - Only show when video is not playing */}
              {!isPlaying && (
                <div className="translated-center-play">
                  <button
                    onClick={togglePlay}
                    className="translated-play-button"
                    type="button"
                  >
                    <FaPlay className="translated-play-icon" />
                  </button>
                </div>
              )}

              {/* Bottom Controls */}
              <div className="translated-bottom-controls">
                {/* Progress Bar */}
                <div className="translated-progress-container">
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleSeek}
                    className="translated-progress-bar"
                  />
                </div>

                {/* Control Buttons */}
                <div className="translated-control-buttons">
                  <div className="translated-left-controls">
                    {/* Play/Pause */}
                    <div className="translated-tooltip-container">
                      <button
                        onClick={togglePlay}
                        className="translated-control-button"
                        type="button"
                        onMouseEnter={() => setActiveTooltip('play')}
                        onMouseLeave={() => setActiveTooltip('')}
                      >
                        {isPlaying ? (
                          <FaPause className="translated-control-icon" />
                        ) : (
                          <FaPlay className="translated-control-icon" />
                        )}
                      </button>
                      {activeTooltip === 'play' && (
                        <div className="translated-tooltip">{tooltips.play}</div>
                      )}
                    </div>

                    {/* Skip Backward */}
                    <div className="translated-tooltip-container">
                      <button
                        onClick={skipBackward}
                        className="translated-control-button translated-skip-button"
                        type="button"
                        onMouseEnter={() => setActiveTooltip('backward')}
                        onMouseLeave={() => setActiveTooltip('')}
                      >
                        <FaStepBackward className="translated-control-icon" />
                      </button>
                      {activeTooltip === 'backward' && (
                        <div className="translated-tooltip">{tooltips.backward}</div>
                      )}
                    </div>

                    {/* Skip Forward */}
                    <div className="translated-tooltip-container">
                      <button
                        onClick={skipForward}
                        className="translated-control-button translated-skip-button"
                        type="button"
                        onMouseEnter={() => setActiveTooltip('forward')}
                        onMouseLeave={() => setActiveTooltip('')}
                      >
                        <FaStepForward className="translated-control-icon" />
                      </button>
                      {activeTooltip === 'forward' && (
                        <div className="translated-tooltip">{tooltips.forward}</div>
                      )}
                    </div>

                    {/* Volume Control */}
                    <div className="translated-volume-control translated-tooltip-container">
                      <button
                        onClick={toggleMute}
                        className="translated-control-button"
                        type="button"
                        onMouseEnter={() => setActiveTooltip('volume')}
                        onMouseLeave={() => setActiveTooltip('')}
                      >
                        {isMuted || volume === 0 ? (
                          <FaVolumeMute className="translated-control-icon" />
                        ) : (
                          <FaVolumeUp className="translated-control-icon" />
                        )}
                      </button>
                      {activeTooltip === 'volume' && (
                        <div className="translated-tooltip">{tooltips.volume}</div>
                      )}
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="translated-volume-slider"
                      />
                    </div>

                    {/* Time Display */}
                    <span className="translated-time-display">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                  </div>

                  {/* Fullscreen Button */}
                  <div className="translated-tooltip-container">
                    <button
                      onClick={toggleFullscreen}
                      className="translated-control-button"
                      type="button"
                      onMouseEnter={() => setActiveTooltip('fullscreen')}
                      onMouseLeave={() => setActiveTooltip('')}
                    >
                      {isFullscreen ? (
                        <FaCompress className="translated-control-icon" />
                      ) : (
                        <FaExpand className="translated-control-icon" />
                      )}
                    </button>
                    {activeTooltip === 'fullscreen' && (
                      <div className="translated-tooltip">{tooltips.fullscreen}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Movie Info Below Video */}
          <div className="translated-movie-info-panel">
            <h1 className="translated-movie-title">{movie.title}</h1>
            <p className="translated-movie-description">{movie.description}</p>
            <div className="translated-genre-tags">
              {movie.genre.map((genre, index) => (
                <span key={index} className="translated-genre-tag">
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Right Side */}
        <div className="translated-sidebar">
          {/* Download Section */}
          <div className="translated-download-container">
            <h2 className="translated-download-title">Download Movie</h2>
            <div className="translated-tooltip-container">
              <a 
                href={movie.videoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="translated-download-button"
                onMouseEnter={() => setActiveTooltip('download')}
                onMouseLeave={() => setActiveTooltip('')}
              >
                <FaDownload className="translated-download-icon" />
                Download {movie.title}
              </a>
              {activeTooltip === 'download' && (
                <div className="translated-tooltip">{tooltips.download}</div>
              )}
            </div>
          </div>

          {/* Social Media Section */}
          <div className="translated-social-section">
            <h3 className="translated-social-title">Follow Us</h3>
            <div className="translated-social-grid">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="translated-social-link"
                  title={social.name}
                >
                  <div className="translated-social-icon">
                    {social.icon}
                  </div>
                  <span className="translated-social-name">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TranslatedMoviePlayer;
