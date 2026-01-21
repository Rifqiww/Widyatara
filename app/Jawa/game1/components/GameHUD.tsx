import React from "react";
import { Heart, Pointer } from "lucide-react";
import { KEYS } from "../constants";

export const GameHUD = ({
  score,
  combo,
  life,
  feedback,
  activeKeys,
  onKeyInput,
  onKeyRelease,
  hidden,
}: {
  score: number;
  combo: number;
  life: number;
  feedback: { text: string; color: string; id: number } | null;
  activeKeys: boolean[];
  onKeyInput: (index: number) => void;
  onKeyRelease: (index: number) => void;
  hidden: boolean;
}) => (
  <div
    className={`absolute inset-0 pointer-events-none ${hidden ? "hidden" : ""}`}
    style={{ zIndex: 40 }}
  >
    {/* Top Header */}
    <div className="absolute top-0 w-full p-4 md:p-6 flex justify-between items-start bg-gradient-to-b from-black/80 to-transparent">
      {/* Score */}
      <div className="flex flex-col">
        <div className="text-[10px] md:text-xs text-[#d4af37] uppercase tracking-[0.2em]">
          Score
        </div>
        <div className="text-2xl md:text-4xl font-serif text-white drop-shadow-[0_0_10px_rgba(212,175,55,0.7)]">
          {score}
        </div>
      </div>

      {/* Combo */}
      <div className="flex flex-col items-center mt-2 md:mt-4">
        <div
          className={`text-5xl md:text-7xl font-bold text-[#ffd700] transition-all duration-100 ${combo > 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"} drop-shadow-md`}
        >
          {combo}
        </div>
        <div
          className={`text-[10px] md:text-sm font-bold text-white uppercase tracking-widest transition-opacity duration-100 ${combo > 0 ? "opacity-100" : "opacity-0"}`}
        >
          Combo
        </div>
      </div>

      {/* Life */}
      <div className="flex flex-col items-end">
        <div className="text-xs text-[#d4af37] uppercase tracking-[0.2em] mb-1">
          Life
        </div>
        <div className="flex gap-2 text-3xl">
          {[...Array(3)].map((_, i) => (
            <span
              key={i}
              className={
                i < life
                  ? "text-red-500 drop-shadow-[0_0_5px_rgba(220,38,38,0.8)] animate-pulse"
                  : "text-gray-800"
              }
            >
              <Heart className={i < life ? "fill-red-500" : ""} />
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Feedback */}
    {feedback && (
      <div
        key={feedback.id}
        className={`absolute top-1/2 right-[10%] transform -translate-y-1/2 text-4xl md:text-6xl font-serif font-bold italic drop-shadow-lg animate-ping-once ${feedback.color} z-50`}
        onAnimationEnd={(e) => (e.currentTarget.style.display = "none")}
      >
        {feedback.text}
      </div>
    )}

    {/* Key Hints */}
    <div className="absolute bottom-[10%] left-1/2 transform -translate-x-1/2 flex gap-4 md:gap-12 pointer-events-auto items-end">
      {KEYS.map((k, i) => (
        <div
          key={k}
          onMouseDown={() => onKeyInput(i)}
          onMouseUp={() => onKeyRelease(i)}
          onMouseLeave={() => onKeyRelease(i)}
          onTouchStart={(e) => {
            e.preventDefault();
            onKeyInput(i);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            onKeyRelease(i);
          }}
          className={`
                    border-2 rounded-full w-[65px] h-[65px] md:w-[70px] md:h-[70px] flex items-center justify-center font-bold font-serif cursor-pointer transition-all duration-100 shadow-[0_4px_6px_rgba(0,0,0,0.5)] touch-manipulation select-none
                    ${
                      activeKeys[i]
                        ? "bg-[#d4af37] text-[#1a0500] scale-110 -translate-y-1 shadow-[0_0_20px_#d4af37] border-white"
                        : "border-[#d4af37]/40 text-[#d4af37] bg-black/60"
                    }
                `}
        >
          <span className="hidden md:block">{k.toUpperCase()}</span>
          <Pointer className="block md:hidden w-6 h-6" />
        </div>
      ))}
    </div>

    <div className="absolute bottom-4 w-full text-center text-xs text-white/30">
      Tekan tombol keyboard atau klik lingkaran untuk memukul
    </div>
  </div>
);
