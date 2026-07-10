import React from "react";
import { Play, Pause, Music, Loader2 } from "lucide-react";
import { Act, Track } from "../playlistData";
import LiveEqualizer from "./LiveEqualizer";

interface FlatPlaylistProps {
  acts: Act[];
  activeTrack: Track | null;
  isPlaying: boolean;
  isLoading: boolean;
  onSelectTrack: (track: Track, act: Act) => void;
}

export default function FlatPlaylist({
  acts,
  activeTrack,
  isPlaying,
  isLoading,
  onSelectTrack,
}: FlatPlaylistProps) {
  const allTracks = acts.flatMap((act) =>
    act.tracks.map((track) => ({ track, act }))
  );

  return (
    <div className="space-y-1">
      {allTracks.map(({ track, act }, index) => {
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

            <span className="text-[9px] text-zinc-600 font-mono shrink-0 ml-2">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        );
      })}
    </div>
  );
}
