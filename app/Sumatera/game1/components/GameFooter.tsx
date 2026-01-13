"use client"
import React from "react";

const GameFooter: React.FC = () => {
  return (
    <div className="mt-8 flex flex-wrap justify-center gap-8 text-[var(--secondary)]/30 text-[10px] uppercase tracking-[0.4em] font-black">
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        Tahan & Seret
      </div>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        Kunci di Kerangka
      </div>
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)]" />
        Tantangan 90 Detik
      </div>
    </div>
  );
};

export default GameFooter;
