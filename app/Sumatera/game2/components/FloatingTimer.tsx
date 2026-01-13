"use client"
import React from "react";
import { Clock } from "lucide-react";

interface FloatingTimerProps {
  timeLeft: number;
}

const FloatingTimer: React.FC<FloatingTimerProps> = ({ timeLeft }) => {
  return (
    <div className="absolute top-4 right-4 md:top-6 md:right-6 z-[100]">
      <div 
        className={`flex items-center gap-2 px-3 py-2 md:px-5 md:py-3 rounded-2xl border-2 transition-all duration-300 shadow-xl ${
          timeLeft < 15 
            ? "bg-red-600 text-white border-transparent scale-110 animate-pulse" 
            : "bg-white/80 text-[color:var(--text-primary)] border-[color:var(--accent)]/30 backdrop-blur-md"
        }`}
      >
        <Clock className={`w-4 h-4 md:w-6 md:h-6 ${timeLeft < 15 ? "animate-bounce" : ""}`} />
        <span className="text-lg md:text-2xl font-black font-mono leading-none">{timeLeft}s</span>
      </div>
    </div>
  );
};

export default FloatingTimer;
