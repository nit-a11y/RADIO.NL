import React, { useState, useEffect } from "react";
import { Play, Pause, ChevronDown, Music, Check, Loader2, Disc } from "lucide-react";
import { Act, Track } from "../playlistData";
import { motion, AnimatePresence } from "motion/react";
import LiveEqualizer from "./LiveEqualizer";

interface PlaylistAccordionProps {
  acts: Act[];
  activeTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  onSelectTrack: (track: Track, act: Act) => void;
}

export default function PlaylistAccordion({
  acts,
  activeTrack,
  isPlaying,
  isLoading,
  onSelectTrack,
}: PlaylistAccordionProps) {
  const [expandedActNumbers, setExpandedActNumbers] = useState<number[]>([1]); // Expand Act 1 by default

  // Auto-expand the act containing the active track so it is always visible
  useEffect(() => {
    if (!activeTrack) return;
    const parentAct = acts.find((act) =>
      act.tracks.some((t) => t.searchQuery === activeTrack.searchQuery)
    );
    if (parentAct && !expandedActNumbers.includes(parentAct.number)) {
      setExpandedActNumbers((prev) => [...prev, parentAct.number]);
    }
  }, [activeTrack, acts]);

  const toggleAct = (actNum: number) => {
    setExpandedActNumbers((prev) =>
      prev.includes(actNum)
        ? prev.filter((num) => num !== actNum)
        : [...prev, actNum]
    );
  };

  return (
    <div className="space-y-3">
      {acts.map((act) => {
        const isExpanded = expandedActNumbers.includes(act.number);
        const containsActiveTrack = act.tracks.some(
          (t) => t.searchQuery === activeTrack?.searchQuery
        );

        return (
          <div
            key={act.number}
            className={`border border-zinc-800 rounded-2xl overflow-hidden transition-all bg-zinc-950/80 shadow-lg ${
              containsActiveTrack ? "ring-1 ring-red-500/20 border-red-950" : ""
            }`}
          >
            {/* Act Header (Toggle Accordion) */}
            <button
              onClick={() => toggleAct(act.number)}
              className="w-full flex items-center justify-between p-4 bg-zinc-900/40 hover:bg-zinc-900/70 transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-red-500 shadow-inner">
                  {act.number === 9 ? "★" : `0${act.number}`}
                </div>
                <div>
                  <h4 className="font-sans font-bold text-sm text-zinc-100 uppercase tracking-wide">
                    {act.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-mono tracking-wider">
                    {act.tracks.length} {act.tracks.length === 1 ? "FAIXA" : "FAIXAS"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {containsActiveTrack && (
                  <span className="text-[9px] bg-red-950 text-red-400 font-mono font-bold px-2 py-0.5 rounded border border-red-900/50 uppercase animate-pulse">
                    Tocando
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${
                    isExpanded ? "rotate-180 text-red-500" : ""
                  }`}
                />
              </div>
            </button>

            {/* Collapsible Tracks List */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="bg-zinc-950 divide-y divide-zinc-900/50 p-2 space-y-1">
                    {act.tracks.map((track) => {
                      const isActive = track.searchQuery === activeTrack?.searchQuery;
                      const isCurrentPlaying = isActive && isPlaying;
                      const isCurrentLoading = isActive && isLoading;

                      return (
                        <div
                          key={track.searchQuery}
                          onClick={() => onSelectTrack(track, act)}
                          className={`flex items-center justify-between p-2.5 rounded-xl transition-all group cursor-pointer ${
                            isActive
                              ? "bg-red-950/20 border border-red-950/40"
                              : "hover:bg-zinc-900/40 border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="shrink-0 relative w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-zinc-600 transition-colors">
                              {isActive ? (
                                isCurrentLoading ? (
                                  <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />
                                ) : isCurrentPlaying ? (
                                  <Pause className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-red-500 fill-red-500" />
                                )
                              ) : (
                                <>
                                  <Music className="w-3.5 h-3.5 text-zinc-500 group-hover:hidden" />
                                  <Play className="w-3.5 h-3.5 text-white fill-white hidden group-hover:block" />
                                </>
                              )}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-xs font-bold truncate ${
                                    isActive ? "text-red-400 font-extrabold" : "text-zinc-200"
                                  }`}
                                >
                                  {track.title}
                                </span>
                                {isCurrentPlaying && (
                                  <div className="shrink-0 pb-0.5">
                                    <LiveEqualizer isPlaying={true} count={3} height={10} color="bg-red-500" />
                                  </div>
                                )}
                              </div>
                              <span className="block text-[10px] text-zinc-500 truncate mt-0.5 font-mono">
                                {track.artist}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
