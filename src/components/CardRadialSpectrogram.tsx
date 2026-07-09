import React from "react";
import { motion } from "motion/react";

interface CardRadialSpectrogramProps {
  isPlaying: boolean;
}

const BAR_COUNT = 80;
const R_START = 210;

export default function CardRadialSpectrogram({ isPlaying }: CardRadialSpectrogramProps) {
  const bars = React.useMemo(() => {
    return Array.from({ length: BAR_COUNT }).map((_, i) => {
      const angle = (i * 360) / BAR_COUNT;
      const angleRad = (angle * Math.PI) / 180;
      const randomExtension = 10 + Math.random() * 32;

      const x1 = 250 + R_START * Math.cos(angleRad);
      const y1 = 250 + R_START * Math.sin(angleRad);
      const baseX2 = 250 + (R_START + 3) * Math.cos(angleRad);
      const baseY2 = 250 + (R_START + 3) * Math.sin(angleRad);
      const maxX2 = 250 + (R_START + randomExtension) * Math.cos(angleRad);
      const maxY2 = 250 + (R_START + randomExtension) * Math.sin(angleRad);

      return {
        i,
        x1,
        y1,
        baseX2,
        baseY2,
        maxX2,
        maxY2,
        duration: 0.35 + (i % 7) * 0.08,
        color: i % 3 === 0 ? "#ef4444" : i % 3 === 1 ? "#dc2626" : "#7f1d1d"
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none -z-10 flex items-center justify-center overflow-visible">
      <motion.div
        animate={{
          scale: isPlaying ? [0.98, 1.04, 0.98] : 1,
          opacity: isPlaying ? [0.4, 0.65, 0.4] : 0.25,
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-radial from-red-600/10 via-transparent to-transparent pointer-events-none rounded-full blur-2xl scale-[1.3]"
      />

      <div className="absolute w-[140%] h-[140%] -inset-[20%] flex items-center justify-center pointer-events-none">
        <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
          {bars.map((bar) => (
            <motion.line
              key={bar.i}
              x1={bar.x1}
              y1={bar.y1}
              x2={bar.baseX2}
              y2={bar.baseY2}
              initial={false}
              animate={isPlaying ? {
                x2: [bar.baseX2, bar.maxX2, bar.baseX2],
                y2: [bar.baseY2, bar.maxY2, bar.baseY2]
              } : {
                x2: bar.baseX2,
                y2: bar.baseY2
              }}
              transition={{
                duration: bar.duration,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              stroke={bar.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={isPlaying ? 0.75 : 0.15}
            />
          ))}
        </svg>
      </div>

      <motion.div
        animate={{ rotate: isPlaying ? 360 : 0 }}
        transition={{
          repeat: Infinity,
          duration: 35,
          ease: "linear"
        }}
        className="absolute w-[130%] h-[130%] pointer-events-none flex items-center justify-center opacity-40"
      >
        <svg viewBox="0 0 500 500" className="w-full h-full">
          <path
            id="outerCircularTextPath"
            d="M 250, 250 m -225, 0 a 225,225 0 1,1 450,0 a 225,225 0 1,1 -450,0"
            fill="none"
          />
          <text className="fill-red-600/80 font-display font-black text-[9px] tracking-[0.25em] uppercase">
            <textPath href="#outerCircularTextPath" startOffset="0%">
              • DIA DO ROCK • NORDESTE LOCAÇÕES • ROCK N' ROLL REVOLUTION • LIVE TRANSMISSION •
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
}
