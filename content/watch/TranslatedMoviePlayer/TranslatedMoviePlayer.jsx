"use client";
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaStepBackward, FaStepForward, FaDownload } from 'react-icons/fa';
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
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      clearTimeout(controlsTimeout);
    };
  }, []);

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
      {/* Video Container - YouTube-like sizing */}
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
                <button
                  onClick={togglePlay}
                  className="translated-control-button"
                  type="button"
                >
                  {isPlaying ? (
                    <FaPause className="translated-control-icon" />
                  ) : (
                    <FaPlay className="translated-control-icon" />
                  )}
                </button>

                {/* Skip Backward */}
                <button
                  onClick={skipBackward}
                  className="translated-control-button translated-skip-button"
                  type="button"
                >
                  <FaStepBackward className="translated-control-icon" />
                </button>

                {/* Skip Forward */}
                <button
                  onClick={skipForward}
                  className="translated-control-button translated-skip-button"
                  type="button"
                >
                  <FaStepForward className="translated-control-icon" />
                </button>

                {/* Volume Control */}
                <div className="translated-volume-control">
                  <button
                    onClick={toggleMute}
                    className="translated-control-button"
                    type="button"
                  >
                    {isMuted || volume === 0 ? (
                      <FaVolumeMute className="translated-control-icon" />
                    ) : (
                      <FaVolumeUp className="translated-control-icon" />
                    )}
                  </button>
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
              <button
                onClick={toggleFullscreen}
                className="translated-control-button"
                type="button"
              >
                {isFullscreen ? (
                  <FaCompress className="translated-control-icon" />
                ) : (
                  <FaExpand className="translated-control-icon" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Info Panel */}
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

      {/* Download Section */}
      <div className="translated-download-section">
        <div className="translated-download-container">
          <h2 className="translated-download-title">Download Movie</h2>
          <a 
            href={movie.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="translated-download-button"
          >
            <FaDownload className="translated-download-icon" />
            Download {movie.title}
          </a>
        </div>
      </div>
    </div>
  );
};

export default TranslatedMoviePlayer;