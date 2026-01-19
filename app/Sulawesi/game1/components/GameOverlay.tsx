import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { GameMode, GameStats } from "../types";

interface GameOverlayProps {
  state: "WON" | "LOST";
  stats: GameStats;
  mode: GameMode;
  onRestart: () => void;
  onHome: () => void;
}

const GameOverlay: React.FC<GameOverlayProps> = ({
  state,
  stats,
  mode,
  onRestart,
  onHome,
}) => {
  const isWon = state === "WON";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center over"
        >
          <div className="flex justify-center pointer-events-none">
            <div className="relative w-44 h-44">
              <Image
                src={
                  isWon
                    ? "/assets/Sulawesi/game1/FaceWin.png"
                    : "/assets/Sulawesi/game1/FaceLose.png"
                }
                alt={isWon ? "Menang" : "Kalah"}
                fill
                className="object-contain drop-shadow-lg"
              />
            </div>
          </div>

          <h2
            className={`text-3xl font-bold mb-2 font-serif ${isWon ? "text-[#10B981]" : "text-[#9F1239]"}`}
          >
            {isWon ? "Gokil! Kamu Menang!" : "Yah, Waktu Habis!"}
          </h2>

          <p className="text-[#543310]/80 mb-6 font-sans">
            {isWon
              ? `Kamu jago banget! Semua kartu di mode ${mode === "LANGUAGE" ? "Jelajah Kata" : "Jejak Warisan"} berhasil kamu taklukkan!`
              : "Jangan nyerah bestie! Coba lagi biar makin paham budaya kita!"}
          </p>

          <div className="mb-8 w-full max-w-xs mx-auto bg-[#F8F4E1] border border-[#AF8F6F]/20 p-4 rounded-xl">
            <div className="text-center">
              <div className="text-sm text-[#543310]/60">Sisa Waktu</div>
              <div className="text-2xl font-bold text-[#D97706]">
                {stats.timeLeft}s
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onRestart}
              className="w-full py-3 bg-[#543310] hover:bg-[#74512D] text-[#F8F4E1] rounded-xl font-semibold transition-colors shadow-lg shadow-[#543310]/20 cursor-pointer"
            >
              Main Lagi
            </button>
            <button
              onClick={onHome}
              className="w-full py-3 bg-white border-2 border-[#AF8F6F]/30 hover:bg-[#F8F4E1] text-[#543310] rounded-xl font-semibold transition-colors cursor-pointer"
            >
              Kembali ke Menu
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GameOverlay;
