"use client"
import React from "react";
import { Clock } from "lucide-react";

interface GameTimerProps {
  timeLeft: number;
}

const GameTimer: React.FC<GameTimerProps> = ({ timeLeft }) => {
  return (
    <div className="absolute top-8 left-8 z-20 flex items-center gap-4 bg-[var(--background)]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-[var(--secondary)]/10 shadow-sm">
      <Clock className={timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-primary'} size={24} />
      <div>
        <div className={`text-2xl font-mono font-black ${timeLeft < 30 ? 'text-red-500 animate-pulse' : 'text-primary'}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-[8px] uppercase tracking-widest text-[var(--secondary)]/40 font-bold">Time Remaining</div>
      </div>
    </div>
  );
};

export default GameTimer;
