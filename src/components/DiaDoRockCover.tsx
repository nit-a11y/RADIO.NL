import React from "react";
import { motion } from "motion/react";

interface DiaDoRockCoverProps {
  isPlaying: boolean;
}

export default function DiaDoRockCover({ isPlaying }: DiaDoRockCoverProps) {
  const numberOfBars = 36;
  const bars = React.useMemo(() => {
    return Array.from({ length: numberOfBars }).map((_, i) => {
      const angle = (i * 360) / numberOfBars;
      const angleRad = (angle * Math.PI) / 180;
      const rStart = 111;
      return {
        i,
        baseX2: 150 + (rStart + 3) * Math.cos(angleRad),
        baseY2: 150 + (rStart + 3) * Math.sin(angleRad),
        maxX2: 150 + (rStart + 8 + (i % 11) * 2) * Math.cos(angleRad),
        maxY2: 150 + (rStart + 8 + (i % 11) * 2) * Math.sin(angleRad),
        x1: 150 + rStart * Math.cos(angleRad),
        y1: 150 + rStart * Math.sin(angleRad),
        angleRad,
        color: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#dc2626" : "#7f1d1d",
      };
    });
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[280px] sm:max-w-[320px] mx-auto rounded-full bg-zinc-950/60 flex items-center justify-center group">
      {/* Red Grunge/Pulsing Glow Behind Vinyl */}
      <motion.div
        animate={{
          scale: isPlaying ? [0.95, 1.05, 0.95] : 0.98,
          opacity: isPlaying ? [0.5, 0.75, 0.5] : 0.4,
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-radial from-red-600/35 to-transparent pointer-events-none rounded-full blur-xl"
      />

      {/* 1. Pulsing Radial Spectrogram Layer (Behind/around the Vinyl Record) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0 flex items-center justify-center">
        <svg viewBox="0 0 300 300" className="w-[112%] h-[112%]">
          {bars.map((bar) => (
            <motion.line
              key={bar.i}
              x1={bar.x1}
              y1={bar.y1}
              animate={isPlaying ? {
                x2: [bar.baseX2, bar.maxX2, bar.baseX2],
                y2: [bar.baseY2, bar.maxY2, bar.baseY2],
              } : {
                x2: bar.baseX2,
                y2: bar.baseY2,
              }}
              transition={{
                duration: 0.3 + (bar.i % 5) * 0.08,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              stroke={bar.color}
              strokeWidth="2"
              strokeLinecap="round"
              opacity={isPlaying ? 0.85 : 0.25}
            />
          ))}
        </svg>
      </div>

      {/* 2. Slow Rotating Brand Ring wrapping just outside the Vinyl Edge */}
      <motion.div
        animate={{
          rotate: isPlaying ? 360 : 0
        }}
        transition={{
          repeat: Infinity,
          duration: 25,
          ease: "linear"
        }}
        className="absolute inset-0 w-full h-full pointer-events-none z-20 flex items-center justify-center"
      >
        <svg viewBox="0 0 300 300" className="w-[110%] h-[110%]">
          <path
            id="circularTextPath"
            d="M 150, 150 m -134, 0 a 134,134 0 1,1 268,0 a 134,134 0 1,1 -268,0"
            fill="none"
          />
          <text className="fill-red-500/90 font-display font-extrabold text-[9px] tracking-[0.22em] uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
            <textPath href="#circularTextPath" startOffset="0%">
              NORDESTE LOCAÇÕES • DIA DO ROCK • NORDESTE LOCAÇÕES • DIA DO ROCK •
            </textPath>
          </text>
        </svg>
      </motion.div>

      {/* 3. The SPINNING VINYL RECORD DISK */}
      <div className="relative w-[84%] h-[84%] rounded-full shadow-[0_15px_45px_rgba(0,0,0,0.95),0_0_25px_rgba(239,68,68,0.15)] flex items-center justify-center overflow-hidden z-10 border border-zinc-800">
        
        {/* Main rotating vinyl container */}
        <motion.div
          animate={{
            rotate: isPlaying ? 360 : 0,
          }}
          transition={{
            duration: 4, // Realistic vinyl rotation speed (~4 seconds)
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0 w-full h-full rounded-full bg-neutral-950 flex items-center justify-center"
        >
          {/* Vinyl Grooves - Render multiple distinct rings */}
          <div className="absolute inset-[3%] rounded-full border border-zinc-900/40" />
          <div className="absolute inset-[7%] rounded-full border border-neutral-900/60" />
          <div className="absolute inset-[11%] rounded-full border border-neutral-800/20" />
          <div className="absolute inset-[15%] rounded-full border border-zinc-900/40" />
          <div className="absolute inset-[19%] rounded-full border border-neutral-900/60" />
          <div className="absolute inset-[23%] rounded-full border border-neutral-800/20" />
          <div className="absolute inset-[27%] rounded-full border border-zinc-900/40" />
          <div className="absolute inset-[31%] rounded-full border border-neutral-900/60" />
          <div className="absolute inset-[35%] rounded-full border border-neutral-800/20" />
          
          {/* Inner smooth run-out groove area */}
          <div className="absolute inset-[39%] rounded-full bg-neutral-950 border border-neutral-900 shadow-inner" />

          {/* Center Label (Sticker) - Spins with the vinyl */}
          <div className="absolute w-[44%] h-[44%] rounded-full bg-gradient-to-tr from-red-700 via-red-900 to-zinc-900 border-[3px] border-zinc-950 flex flex-col items-center justify-center p-2 relative shadow-2xl overflow-hidden z-10 select-none">
            {/* Ambient Label Glow */}
            <div className="absolute inset-0 bg-radial from-red-500/20 to-transparent pointer-events-none" />

            {/* Micro Badge Label Content */}
            <div className="text-[7px] text-zinc-400 font-bold tracking-[0.15em] uppercase mb-0.5">
              Especial
            </div>
            
            <div className="text-white text-[13px] font-black tracking-wider leading-none uppercase font-sans">
              DIA DO
            </div>
            <div className="text-red-500 text-[18px] font-black tracking-widest leading-none uppercase font-sans my-0.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              ROCK
            </div>

            <div className="text-[6px] text-zinc-400 tracking-wider uppercase font-mono mt-0.5 scale-90">
              Nordeste Loc
            </div>
          </div>

          {/* Tiny center details on label */}
          <div className="absolute w-[18%] h-[18%] rounded-full border border-red-950/40 z-20" />
        </motion.div>

        {/* 4. STATIC REALISTIC GLOSSY LIGHT REFLECTIONS (Does not spin, mimicking actual physical light reflection!) */}
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_45deg,transparent_0deg,rgba(255,255,255,0.06)_40deg,transparent_80deg,transparent_180deg,rgba(255,255,255,0.06)_220deg,transparent_260deg)] pointer-events-none z-20" />
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_225deg,transparent_0deg,rgba(255,255,255,0.03)_30deg,transparent_70deg,transparent_180deg,rgba(255,255,255,0.03)_210deg,transparent_250deg)] pointer-events-none z-20" />

        {/* Center Metal Pin Hole (Spindle Grommet) */}
        <div className="absolute w-[11%] h-[11%] rounded-full bg-gradient-to-r from-zinc-300 via-zinc-400 to-zinc-500 border border-zinc-600 shadow-lg flex items-center justify-center z-30 pointer-events-none">
          <div className="w-[45%] h-[45%] rounded-full bg-zinc-950 shadow-inner" />
        </div>
      </div>
    </div>
  );
}
