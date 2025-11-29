"use client"
import { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { startMovieTracking, stopMovieTracking, getUserIP } from '@/utils/movieTracker';

const HLSPlayer = ({ url, startAtSeconds, controls, ondataloaded, speed, movieId, movieTitle, moviePoster, userId }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [userIp, setUserIp] = useState(null);

  useEffect(() => {
    // Get user IP when component mounts
    getUserIP().then(ip => setUserIp(ip));
  }, []);

  const startTracking = async () => {
    if (movieId && movieTitle && userIp) {
      await startMovieTracking(
        movieId,
        movieTitle,
        moviePoster,
        userId,
        userIp,
        'hls'
      );
    }
  };

  const stopTracking = async (completed = false) => {
    await stopMovieTracking(completed);
  };

  useEffect(() => {
    if (Hls.isSupported() && videoRef.current) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        if (startAtSeconds) {
          videoRef.current.currentTime = startAtSeconds;
        }
        videoRef.current.play();
      });

      hlsRef.current = hls;
    } else if (videoRef.current && videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
      // For browsers that support HLS natively
      videoRef.current.src = url;
      videoRef.current.addEventListener('loadedmetadata', () => {
        if (startAtSeconds) {
          videoRef.current.currentTime = startAtSeconds;
        }
        videoRef.current.play();
      });
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
      stopTracking(false); // Stop tracking when component unmounts
    };
  }, [url, startAtSeconds]);

  // Add event listeners for tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => {
      startTracking();
    };

    const handlePause = () => {
      // Don't stop tracking on pause, just stop heartbeats temporarily
    };

    const handleEnded = () => {
      stopTracking(true); // Mark as completed when video ends
    };

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, [movieId, movieTitle, moviePoster, userId, userIp]);

  return (
    <video
      ref={videoRef}
      controls={controls || false}
      autoPlay={!controls}
      muted={!controls}
      preload={!controls ? "auto" : "metadata"}
      onCanPlay={() => ondataloaded(true)}
      onLoadStart={(event) => {
        event.currentTarget.playbackRate = speed || 1;
      }}
      className="w-full h-full object-cover"
    />
  );
};

export default HLSPlayer;