import React, { useState, useEffect } from "react";
import { playlistData, Track, Act } from "./playlistData";
import YouTubePlayer from "./components/YouTubePlayer";
import DiaDoRockCover from "./components/DiaDoRockCover";
import CardRadialSpectrogram from "./components/CardRadialSpectrogram";
import CardBackgroundSpectrogram from "./components/CardBackgroundSpectrogram";
import PlaylistAccordion from "./components/PlaylistAccordion";
import bgImage from "./assets/images/rock_radio_bg_1783539455652.jpg";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  RotateCw,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  HelpCircle,
  Share2,
  ChevronDown,
  ChevronUp,
  ListMusic,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  // 1. Master Playback States
  const [activeAct, setActiveAct] = useState<Act>(playlistData[0]);
  const [activeTrack, setActiveTrack] = useState<Track>(playlistData[0].tracks[0]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(75);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Time & Seeking States
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [seekTime, setSeekTime] = useState<number | null>(null);

  // Repeat & Shuffle Modes
  const [isShuffle, setIsShuffle] = useState<boolean>(false);
  const [repeatMode, setRepeatMode] = useState<"none" | "one" | "all">("all");

  // Auxiliary and helper states
  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(null);
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState<boolean>(false);

  // Pre-fetch next track for smoother transitions
  useEffect(() => {
    // Reset times on track changes
    setCurrentTime(0);
    setDuration(0);
  }, [activeTrack]);

  // Formatting utilities
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds === undefined) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Helper to find the next track in the queue
  const getNextTrack = (): { track: Track; act: Act } | null => {
    if (isShuffle) {
      const allTracks: { track: Track; act: Act }[] = [];
      playlistData.forEach((act) => {
        act.tracks.forEach((track) => {
          if (track.searchQuery !== activeTrack?.searchQuery) {
            allTracks.push({ track, act });
          }
        });
      });
      if (allTracks.length > 0) {
        return allTracks[Math.floor(Math.random() * allTracks.length)];
      }
      return null;
    }

    let foundActIndex = -1;
    let foundTrackIndex = -1;

    for (let a = 0; a < playlistData.length; a++) {
      const tIndex = playlistData[a].tracks.findIndex(
        (t) => t.searchQuery === activeTrack?.searchQuery
      );
      if (tIndex !== -1) {
        foundActIndex = a;
        foundTrackIndex = tIndex;
        break;
      }
    }

    if (foundActIndex === -1 || foundTrackIndex === -1) {
      return { track: playlistData[0].tracks[0], act: playlistData[0] };
    }

    const currentAct = playlistData[foundActIndex];

    if (foundTrackIndex < currentAct.tracks.length - 1) {
      return { track: currentAct.tracks[foundTrackIndex + 1], act: currentAct };
    } else if (foundActIndex < playlistData.length - 1) {
      const nextAct = playlistData[foundActIndex + 1];
      return { track: nextAct.tracks[0], act: nextAct };
    } else {
      if (repeatMode === "all") {
        return { track: playlistData[0].tracks[0], act: playlistData[0] };
      }
      return null;
    }
  };

  const nextTrackInfo = getNextTrack();

  // 2. Playback logic controls
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectTrack = (track: Track, act: Act) => {
    setActiveAct(act);
    setActiveTrack(track);
    setIsPlaying(true);
  };

  // Skip Forward Logic
  const handleNext = () => {
    // A. Shuffle mode
    if (isShuffle) {
      const allTracks: { track: Track; act: Act }[] = [];
      playlistData.forEach((act) => {
        act.tracks.forEach((track) => {
          allTracks.push({ track, act });
        });
      });
      const randIndex = Math.floor(Math.random() * allTracks.length);
      const selected = allTracks[randIndex];
      setActiveAct(selected.act);
      setActiveTrack(selected.track);
      setIsPlaying(true);
      return;
    }

    // B. Linear mode - globally robust scanning
    let foundActIndex = -1;
    let foundTrackIndex = -1;

    for (let a = 0; a < playlistData.length; a++) {
      const tIndex = playlistData[a].tracks.findIndex(
        (t) => t.searchQuery === activeTrack.searchQuery
      );
      if (tIndex !== -1) {
        foundActIndex = a;
        foundTrackIndex = tIndex;
        break;
      }
    }

    if (foundActIndex === -1 || foundTrackIndex === -1) {
      // Fallback
      setActiveAct(playlistData[0]);
      setActiveTrack(playlistData[0].tracks[0]);
      setIsPlaying(true);
      return;
    }

    const currentAct = playlistData[foundActIndex];

    if (foundTrackIndex < currentAct.tracks.length - 1) {
      // Next song in same act
      setActiveAct(currentAct);
      setActiveTrack(currentAct.tracks[foundTrackIndex + 1]);
      setIsPlaying(true);
    } else if (foundActIndex < playlistData.length - 1) {
      // First song of next act
      const nextAct = playlistData[foundActIndex + 1];
      setActiveAct(nextAct);
      setActiveTrack(nextAct.tracks[0]);
      setIsPlaying(true);
    } else {
      // End of overall playlist
      if (repeatMode === "all") {
        setActiveAct(playlistData[0]);
        setActiveTrack(playlistData[0].tracks[0]);
        setIsPlaying(true);
      } else {
        setIsPlaying(false);
      }
    }
  };

  // Skip Backward Logic
  const handlePrev = () => {
    let foundActIndex = -1;
    let foundTrackIndex = -1;

    for (let a = 0; a < playlistData.length; a++) {
      const tIndex = playlistData[a].tracks.findIndex(
        (t) => t.searchQuery === activeTrack.searchQuery
      );
      if (tIndex !== -1) {
        foundActIndex = a;
        foundTrackIndex = tIndex;
        break;
      }
    }

    if (foundActIndex === -1 || foundTrackIndex === -1) {
      // Fallback
      setActiveAct(playlistData[0]);
      setActiveTrack(playlistData[0].tracks[0]);
      setIsPlaying(true);
      return;
    }

    const currentAct = playlistData[foundActIndex];

    if (foundTrackIndex > 0) {
      // Previous song in same act
      setActiveAct(currentAct);
      setActiveTrack(currentAct.tracks[foundTrackIndex - 1]);
      setIsPlaying(true);
    } else if (foundActIndex > 0) {
      // Last song of previous act
      const prevAct = playlistData[foundActIndex - 1];
      setActiveAct(prevAct);
      setActiveTrack(prevAct.tracks[prevAct.tracks.length - 1]);
      setIsPlaying(true);
    } else {
      // Wrap around to the absolute end if repeatAll is active
      if (repeatMode === "all") {
        const lastAct = playlistData[playlistData.length - 1];
        setActiveAct(lastAct);
        setActiveTrack(lastAct.tracks[lastAct.tracks.length - 1]);
        setIsPlaying(true);
      } else {
        // Just reset current track to beginning
        setSeekTime(0);
        // Clear immediately so it can be re-triggered
        setTimeout(() => setSeekTime(null), 100);
      }
    }
  };

  // Handler for track ending (from YT Player state callback)
  const handleTrackEnded = () => {
    if (repeatMode === "one") {
      setSeekTime(0);
      setTimeout(() => setSeekTime(null), 100);
      setIsPlaying(true);
    } else {
      handleNext();
    }
  };

  // Progress Bar Drag Seeking Handler
  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetVal = parseFloat(e.target.value);
    setCurrentTime(targetVal);
  };

  const handleSeekEnd = (e: React.MouseEvent<HTMLInputElement> | React.TouchEvent<HTMLInputElement>) => {
    setSeekTime(currentTime);
    setTimeout(() => setSeekTime(null), 100);
  };

  return (
    <div className="relative min-h-screen text-zinc-100 flex flex-col justify-between overflow-x-hidden select-none">
      {/* 1. Backdrop Blur and Grunge Image Cover */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat pointer-events-none z-0 transform scale-105"
        style={{ 
          backgroundImage: `url(${bgImage})`,
          filter: "brightness(0.65) contrast(1.1)"
        }}
      />
      
      {/* Dark overlay gradients */}
      <div className="fixed inset-0 bg-gradient-to-t from-black via-zinc-950/40 to-black/80 pointer-events-none z-0" />

      {/* 2. Top Header Display Box (Authentic to original image text block) */}
      <header className="relative z-10 pt-8 px-4 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center gap-2 max-w-2xl"
        >
          {/* Main heading styled like a metal stencil/sticker */}
          <div className="bg-black/95 text-white font-sans font-black text-sm sm:text-base md:text-lg tracking-widest px-6 py-2 rounded-md shadow-2xl border border-zinc-800 uppercase inline-block">
            DIA DO ROCK
          </div>
          <div className="bg-black/95 text-red-500 font-sans font-black text-sm sm:text-base md:text-lg tracking-widest px-6 py-2 rounded-md shadow-2xl border border-red-950 uppercase inline-block -mt-1">
            NORDESTE LOCAÇÕES
          </div>
        </motion.div>
      </header>

      {/* 3. Main Content Area */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4">
        
        {/* PLAYER CARD SECTION */}
        <div className="flex flex-col items-center justify-center relative">
          <CardRadialSpectrogram isPlaying={isPlaying} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[400px] bg-zinc-950/95 border-2 border-zinc-900 rounded-[32px] p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Ambient Background Spectrogram dancing to the music inside the card */}
            <CardBackgroundSpectrogram isPlaying={isPlaying} />

            {/* Background ambient pulse */}
            <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 via-zinc-800 to-red-600 z-10 ${isPlaying ? "animate-pulse" : ""}`} />

            {/* Content wrapper with higher z-index to stay interactive and sharp */}
            <div className="relative z-10 flex flex-col gap-6 w-full h-full">
              {/* Custom Album Cover Art */}
              <DiaDoRockCover isPlaying={isPlaying && !isLoading} />

              {/* Title / Subtitle */}
              <div className="flex flex-col gap-1 px-1">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-white font-sans font-extrabold text-xl tracking-tight truncate flex-1">
                    {isPlaying ? activeTrack.title : "Sintonizando..."}
                  </h2>
                  {isLoading && (
                    <span className="text-[10px] bg-red-600/30 text-red-500 border border-red-600/50 font-bold px-2 py-0.5 rounded animate-pulse shrink-0">
                      SINC...
                    </span>
                  )}
                </div>
                <p className="text-zinc-400 text-xs font-medium truncate">
                  {isPlaying ? `${activeTrack.artist} • Ato ${activeAct.number}` : "Dia do Rock na Nordeste Loc"}
                </p>
              </div>

              {/* Audio Progress Bar */}
              <div className="flex flex-col gap-2 px-1">
                <div className="relative group">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeekChange}
                    onMouseUp={handleSeekEnd}
                    onTouchEnd={handleSeekEnd}
                    className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-red-600 group-hover:bg-zinc-700 transition-colors"
                  />
                  {/* Visual Filled Stream Progress */}
                  <div 
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-red-600 rounded-lg pointer-events-none"
                    style={{ width: `${(currentTime / (duration || 100)) * 100}%` }}
                  />
                </div>

                {/* Timestamps */}
                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500 tracking-wider">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Media Controls Layout (Matches Original Image) */}
              <div className="flex justify-between items-center px-2">
                {/* Shuffle button */}
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isShuffle ? "text-red-500 bg-red-950/25 border border-red-900/40" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title="Aleatório"
                >
                  <Shuffle className="w-4 h-4" />
                </button>

                {/* Prev button */}
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:text-red-400 active:scale-90 transition-all cursor-pointer"
                  title="Anterior"
                >
                  <SkipBack className="w-5 h-5 fill-current" />
                </button>

                {/* Play / Pause (White Circle, Solid Icon) */}
                <button
                  onClick={handlePlayPause}
                  className="w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                  title={isPlaying ? "Pausar" : "Tocar"}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-zinc-950 fill-zinc-950" />
                  ) : (
                    <Play className="w-6 h-6 text-zinc-950 fill-zinc-950 ml-1" />
                  )}
                </button>

                {/* Next button */}
                <button
                  onClick={handleNext}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:text-red-400 active:scale-90 transition-all cursor-pointer"
                  title="Próxima"
                >
                  <SkipForward className="w-5 h-5 fill-current" />
                </button>

                {/* Repeat button */}
                <button
                  onClick={() => {
                    setRepeatMode((prev) =>
                      prev === "none" ? "all" : prev === "all" ? "one" : "none"
                    );
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    repeatMode !== "none"
                      ? "text-red-500 bg-red-950/25 border border-red-900/40"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                  title={`Repetir: ${repeatMode === "one" ? "Faixa" : repeatMode === "all" ? "Todos" : "Nenhum"}`}
                >
                  <RotateCw className={`w-4 h-4 ${repeatMode === "one" ? "scale-110" : ""}`} />
                </button>
              </div>

              {/* Volume Deck */}
              <div className="flex items-center gap-3 bg-zinc-900/50 px-4 py-2 rounded-2xl border border-zinc-900/50">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    setVolume(parseInt(e.target.value));
                    setIsMuted(false);
                  }}
                  className="flex-1 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-zinc-300 hover:bg-zinc-700 transition-colors"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Playlist Button */}
        <div className="flex justify-center">
          <button
            onClick={() => setIsPlaylistModalOpen(true)}
            className="w-full max-w-[400px] group flex items-center justify-between px-5 py-4 bg-zinc-950/95 border-2 border-zinc-900 hover:border-red-900/60 rounded-2xl shadow-lg transition-all cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
                <div className="w-2 h-2 rounded-full bg-red-600 relative" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest leading-none">
                  Fila de Transmissão
                </span>
                <span className="text-xs font-bold text-zinc-300 mt-0.5 group-hover:text-red-400 transition-colors">
                  {nextTrackInfo ? `${nextTrackInfo.track.title} - ${nextTrackInfo.track.artist}` : "Nenhuma música na fila"}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-zinc-500 group-hover:text-red-400 transition-colors font-mono font-bold uppercase tracking-wider">
                Ver Playlist
              </span>
              <ListMusic className="w-4 h-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
            </div>
          </button>
        </div>
      </main>

      {/* 4. Footer & Watermark */}
      <footer className="relative z-10 w-full bg-black/40 border-t border-zinc-900 py-6 mt-12">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
          <div className="flex items-center gap-2 text-zinc-500 text-xs">
            <span className="font-sans font-bold text-red-500/80 tracking-widest uppercase">
              Nordeste Locações
            </span>
            <span>•</span>
            <span>Dia do Rock Especial</span>
          </div>
          <div className="text-[10px] text-zinc-600 font-mono">
            Powered by Cobalt Stream Technology & Browser File System API
          </div>
        </div>
      </footer>

      {/* Playlist Modal */}
      <AnimatePresence>
        {isPlaylistModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsPlaylistModalOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="playlist-modal-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl max-h-[85vh] bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-ping absolute" />
                    <div className="w-2 h-2 rounded-full bg-red-600 relative" />
                  </div>
                  <div>
                    <h2 id="playlist-modal-title" className="text-sm font-bold text-zinc-300 uppercase tracking-wider">
                      Playlist Completa
                    </h2>
                    <p className="text-[10px] font-mono text-zinc-500">
                      {playlistData.reduce((acc, act) => acc + act.tracks.length, 0)} músicas • 8 Atos
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsPlaylistModalOpen(false)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  aria-label="Fechar playlist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Playlist Content */}
              <div className="flex-1 overflow-y-auto p-4">
                <PlaylistAccordion
                  acts={playlistData}
                  activeTrack={activeTrack}
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  onSelectTrack={(track, act) => {
                    handleSelectTrack(track, act);
                    setIsPlaylistModalOpen(false);
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. The Invisible Background YouTube Streamer Node */}
      <YouTubePlayer
        searchQuery={activeTrack ? `${activeTrack.artist} - ${activeTrack.title}` : null}
        nextSearchQuery={nextTrackInfo ? `${nextTrackInfo.track.artist} - ${nextTrackInfo.track.title}` : null}
        isPlaying={isPlaying}
        volume={isMuted ? 0 : volume}
        seekTime={seekTime}
        onProgress={(curr, dur) => {
          setCurrentTime(curr);
          setDuration(dur);
        }}
        onTrackEnded={handleTrackEnded}
        onLoadingStatus={(loading) => setIsLoading(loading)}
        onVideoResolved={(id, durStr) => {
          setResolvedVideoId(id);
          // Pre-set estimated duration from API if available to avoid flicker
          if (durStr && duration === 0) {
            const parts = durStr.split(":").map(Number);
            if (parts.length === 2) {
              setDuration(parts[0] * 60 + parts[1]);
            }
          }
        }}
        onPlayerReady={() => {}}
      />
    </div>
  );
}
