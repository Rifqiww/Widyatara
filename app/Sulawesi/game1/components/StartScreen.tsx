import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { GameMode } from "../types";

interface StartScreenProps {
  onSelectMode: (mode: GameMode) => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onSelectMode }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10" // Ensure text is above background
      >
        <h1 className="text-4xl md:text-6xl font-bold font-serif bg-clip-text text-transparent bg-linear-to-r from-[#543310] to-[#D97706] mb-4 drop-shadow-sm pb-2 leading-tight">
          Cari Pasangannya!
        </h1>
        <p className="text-[#543310]/80 text-lg md:text-xl max-w-2xl mx-auto font-sans">
          Yuk, main sambil belajar budaya Sulawesi! Pilih tantanganmu dan
          buktikan seberapa jago kamu!
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode("LANGUAGE")}
          className="group relative p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-[#AF8F6F]/20 hover:border-[#AF8F6F] transition-all overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-[#AF8F6F]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center z-10">
            <div className="relative w-[160px] h-[160px] mb-4">
              <Image
                src="/assets/Sulawesi/game1/Thinking.png"
                alt="Jelajah Kata Image"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-[#543310] mb-2 font-serif">
              Jelajah Kata
            </h3>
            <p className="text-[#543310]/70">
              Uji kemampuanmu menebak kata-kata unik dari Bugis, Makassar, &
              Toraja!
            </p>
          </div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectMode("SYMBOL")}
          className="group relative p-8 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border-2 border-[#D97706]/20 hover:border-[#D97706] transition-all overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-[#D97706]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex flex-col items-center z-10">
            <div className="relative w-[150px] h-[150px] mb-4">
              <Image
                src="/assets/Sulawesi/game1/BodoSuit.png"
                alt="Jejak Warisan Image"
                fill
                className="object-contain"
              />
            </div>
            <h3 className="text-2xl font-bold text-[#543310] mb-2 font-serif">
              Jejak Warisan
            </h3>
            <p className="text-[#543310]/70">
              Seberapa kenal kamu dengan benda pusaka dan adat Sulawesi? Cek di
              sini!
            </p>
          </div>
        </motion.button>
      </div>
    </div>
  );
};

export default StartScreen;
