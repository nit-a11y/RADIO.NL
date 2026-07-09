import React, { useEffect, useRef, useState, useCallback } from "react";

interface YouTubePlayerProps {
  searchQuery: string | null;
  isPlaying: boolean;
  volume: number;
  seekTime: number | null;
  onProgress: (currentTime: number, duration: number) => void;
  onTrackEnded: () => void;
  onLoadingStatus: (loading: boolean) => void;
  onVideoResolved: (videoId: string, durationStr: string) => void;
  onPlayerReady: () => void;
  nextSearchQuery?: string | null;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

let apiLoaded = false;
let apiLoading = false;
const callbacks: (() => void)[] = [];

function loadYouTubeAPI(callback: () => void) {
  if (apiLoaded) {
    callback();
    return;
  }
  callbacks.push(callback);
  if (apiLoading) return;

  apiLoading = true;
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  tag.async = true;
  const firstScriptTag = document.getElementsByTagName("script")[0];
  if (firstScriptTag && firstScriptTag.parentNode) {
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  } else {
    document.head.appendChild(tag);
  }

  window.onYouTubeIframeAPIReady = () => {
    apiLoaded = true;
    apiLoading = false;
    callbacks.forEach((cb) => cb());
  };
}

export default function YouTubePlayer({
  searchQuery,
  isPlaying,
  volume,
  seekTime,
  onProgress,
  onTrackEnded,
  onLoadingStatus,
  onVideoResolved,
  onPlayerReady,
  nextSearchQuery,
}: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(null);
  const [playerReady, setPlayerReady] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const progressIntervalRef = useRef<any>(null);
  const trackEndedRef = useRef(false);
  
  // Cache to store resolved video IDs for immediate playback
  const queryCache = useRef<Record<string, { id: string, duration: string }>>({});

  // 1. Resolve Video ID automatically when searchQuery changes
  useEffect(() => {
    if (!searchQuery) {
      setResolvedVideoId(null);
      return;
    }

    let active = true;
    async function resolveTrack() {
      if (queryCache.current[searchQuery!]) {
        const cached = queryCache.current[searchQuery!];
        setResolvedVideoId(cached.id);
        onVideoResolved(cached.id, cached.duration);
        return;
      }

      setIsSearching(true);
      onLoadingStatus(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery!)}`);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        
        if (data.id) {
          queryCache.current[searchQuery!] = { id: data.id, duration: data.duration || "3:30" };
        }

        if (active && data.id) {
          setResolvedVideoId(data.id);
          onVideoResolved(data.id, data.duration || "3:30");
        }
      } catch (err) {
        if (active) {
          setResolvedVideoId("dQw4w9WgXcQ");
          onVideoResolved("dQw4w9WgXcQ", "3:32");
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }

    resolveTrack();

    return () => {
      active = false;
    };
  }, [searchQuery]);

  // 1.5 Pre-fetch the next track in the background
  useEffect(() => {
    if (!nextSearchQuery) return;
    
    // If already in cache, do nothing
    if (queryCache.current[nextSearchQuery]) return;

    let active = true;
    async function prefetchNextTrack() {
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(nextSearchQuery!)}`);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        
        if (active && data.id) {
          queryCache.current[nextSearchQuery!] = { id: data.id, duration: data.duration || "3:30" };
        }
      } catch (err) {
      }
    }

    prefetchNextTrack();

    return () => {
      active = false;
    };
  }, [nextSearchQuery]);

  // 2. Initialize YouTube Player API
  useEffect(() => {
    let active = true;
    
    loadYouTubeAPI(() => {
      if (!active) return;
      
      // Create element for the player
      if (containerRef.current) {
        containerRef.current.innerHTML = "<div id='yt-player-iframe'></div>";
      }

      try {
        playerRef.current = new window.YT.Player("yt-player-iframe", {
          height: "0",
          width: "0",
          videoId: resolvedVideoId || "dQw4w9WgXcQ",
          playerVars: {
            autoplay: isPlaying ? 1 : 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              if (!active) return;
              setPlayerReady(true);
              onPlayerReady();
              playerRef.current.setVolume(volume);
              onLoadingStatus(false);
            },
            onStateChange: (event: any) => {
              if (!active) return;
              // YT.PlayerState: UNSTARTED (-1), ENDED (0), PLAYING (1), PAUSED (2), BUFFERING (3), CUED (5)
              if (event.data === window.YT.PlayerState.PLAYING) {
                onLoadingStatus(false);
              } else if (event.data === window.YT.PlayerState.BUFFERING) {
                onLoadingStatus(true);
              } else if (event.data === window.YT.PlayerState.ENDED) {
                onTrackEnded();
              }
            },
            onError: (err: any) => {
              onLoadingStatus(false);
              if (err.data === 101 || err.data === 150) {
                onTrackEnded();
              }
            }
          },
        });
      } catch (err) {
        console.error("Failed to initialize YT.Player:", err);
      }
    });

    return () => {
      active = false;
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === "function") {
        playerRef.current.destroy();
      }
    };
  }, []);

  // 3. Load/play video when resolved ID changes
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;

    if (resolvedVideoId) {
      onLoadingStatus(true);
      if (isPlaying) {
        playerRef.current.loadVideoById(resolvedVideoId);
      } else {
        playerRef.current.cueVideoById(resolvedVideoId);
      }
      playerRef.current.setVolume(volume);
    } else {
      playerRef.current.stopVideo();
    }
  }, [resolvedVideoId, playerReady]);

  // 4. Play/Pause state change handler
  useEffect(() => {
    if (!playerReady || !playerRef.current || !resolvedVideoId) return;

    try {
      const state = playerRef.current.getPlayerState();
      if (isPlaying && state !== window.YT.PlayerState.PLAYING) {
        playerRef.current.playVideo();
      } else if (!isPlaying && state === window.YT.PlayerState.PLAYING) {
        playerRef.current.pauseVideo();
      }
    } catch (err) {
      // Ignore if state cannot be checked yet
    }
  }, [isPlaying, playerReady, resolvedVideoId]);

  // 5. Volume adjustment handler
  useEffect(() => {
    if (!playerReady || !playerRef.current) return;
    try {
      playerRef.current.setVolume(volume);
    } catch (err) {
      console.warn("Failed to set volume:", err);
    }
  }, [volume, playerReady]);

  // 6. External seek action triggerer
  useEffect(() => {
    if (!playerReady || !playerRef.current || seekTime === null) return;
    try {
      playerRef.current.seekTo(seekTime, true);
    } catch (err) {
      console.warn("Failed to seek:", err);
    }
  }, [seekTime, playerReady]);

  // 7. Track time elapsed & duration progress monitoring loop
  useEffect(() => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

    if (isPlaying && playerReady && playerRef.current && resolvedVideoId) {
      progressIntervalRef.current = setInterval(() => {
        try {
          const currentTime = playerRef.current.getCurrentTime();
          const duration = playerRef.current.getDuration();
          const state = playerRef.current.getPlayerState();
          
          if (typeof currentTime === "number" && typeof duration === "number" && duration > 0) {
            onProgress(currentTime, duration);
            
            // Fallback: detect track end via time
            if (currentTime >= duration - 1 && state === window.YT.PlayerState.PLAYING && !trackEndedRef.current) {
              trackEndedRef.current = true;
              onTrackEnded();
            }
          }
          
          if (state !== window.YT.PlayerState.PLAYING) {
            trackEndedRef.current = false;
          }
        } catch (err) {
        }
      }, 500);
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying, playerReady, resolvedVideoId]);

  return (
    <div className="hidden pointer-events-none" ref={containerRef}>
      <div id="yt-player-iframe" />
    </div>
  );
}
