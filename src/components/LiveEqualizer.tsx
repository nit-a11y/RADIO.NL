import React from "react";
import { motion } from "motion/react";

interface LiveEqualizerProps {
  isPlaying: boolean;
  color?: string;
  count?: number;
  height?: number;
}

export default function LiveEqualizer({
  isPlaying,
  color = "bg-red-500",
  count = 4,
  height = 16,
}: LiveEqualizerProps) {
  const barVariants = {
    animate: (custom: number) => ({
      scaleY: isPlaying ? [0.3, 1, 0.5, 0.8, 0.3] : 0.3,
      transition: {
        duration: 0.8 + custom * 0.15,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <div className="flex items-end gap-0.5" style={{ height: `${height}px` }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          custom={i}
          variants={barVariants}
          animate="animate"
          className={`w-0.5 rounded-full origin-bottom ${color}`}
          style={{ height: "100%" }}
        />
      ))}
    </div>
  );
}
