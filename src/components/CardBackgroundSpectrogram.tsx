import React from "react";
import { motion } from "motion/react";

interface CardBackgroundSpectrogramProps {
  isPlaying: boolean;
}

export default function CardBackgroundSpectrogram({ isPlaying }: CardBackgroundSpectrogramProps) {
  const barCount = 44;
  const bars = React.useMemo(() => {
    return Array.from({ length: barCount }).map((_, i) => {
      const duration = 0.35 + (i % 6) * 0.07;
      const delay = (i % 5) * 0.05;
      const randomHeight = 15 + Math.random() * 80;

      let multiplier = 1.0;
      if (i < barCount * 0.2) {
        multiplier = 1.45;
      } else if (i < barCount * 0.5) {
        multiplier = 1.2;
      } else if (i > barCount * 0.8) {
        multiplier = 0.75;
      } else {
        multiplier = 1.05;
      }

      const maxHeight = Math.min(98, Math.floor(randomHeight * multiplier));

      return {
        id: i,
        duration,
        delay,
        maxHeight,
        minHeight: 8,
        staticHeight: 5,
      };
    });
  }, [barCount]);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden rounded-[30px] opacity-[0.24]">
      <motion.div
        animate={isPlaying ? {
          opacity: [0.12, 0.35, 0.12],
          scale: [1, 1.03, 1],
        } : { opacity: 0.08 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 bg-radial from-red-600/50 via-transparent to-transparent"
      />

      <div className="absolute inset-0 bg-[linear-gradient(rgba(239,68,68,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(239,68,68,0.02)_1px,transparent_1px)] bg-[size:10px_10px]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.15)_2px,transparent_2px)] bg-[size:100%_4px]" />

      <div className="absolute inset-x-0 bottom-0 h-full flex items-end justify-between px-0.5 gap-[1.5px]">
        {bars.map((bar) => {
          return (
            <motion.div
              key={bar.id}
              initial={false}
              animate={
                isPlaying
                  ? {
                      height: [
                        `${bar.minHeight}%`,
                        `${bar.maxHeight}%`,
                        `${bar.minHeight}%`,
                      ],
                    }
                  : { height: `${bar.staticHeight}%` }
              }
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                delay: bar.delay,
                ease: "easeInOut",
              }}
              className="flex-1 rounded-t-sm origin-bottom bg-gradient-to-t from-red-950/60 via-red-600/60 to-red-400/70 shadow-[0_0_10px_rgba(239,68,68,0.25)]"
            />
          );
        })}
      </div>
    </div>
  );
}

