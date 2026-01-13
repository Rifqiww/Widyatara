"use client"
import React from "react";
import { motion } from "framer-motion";
import { Play, ArrowLeft } from "lucide-react";

interface IdleOverlayProps {
  onStart: () => void;
}

const IdleOverlay: React.FC<IdleOverlayProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[var(--background)]/95 backdrop-blur-xl flex items-center justify-center p-12"
    >
      <div className="max-w-2xl text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="w-48 h-48 mx-auto mb-6 bg-[var(--accent)]/10 rounded-full flex items-center justify-center border border-[var(--accent)]/20">
            <img src="/Sumatera/game1/gadangfull.png" className="w-40 object-contain" alt="Icon" />
          </div>
          <h2 className="text-5xl font-black text-[var(--primary)] mb-4 tracking-tighter italic">ARSITEK MINANG</h2>
          <p className="text-secondary text-lg font-medium leading-relaxed">
            Selesaikan pembangunan Rumah Gadang dengan menyusun kepingan arsitektur tradisional ke dalam kerangka bangunan sebelum waktu habis.
          </p>
        </motion.div>
        
        <div className="flex flex-col items-center gap-4">
          <button 
            onClick={onStart}
            className="group relative flex items-center gap-3 px-12 py-5 bg-[var(--primary)] text-white rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            <Play fill="currentColor" size={20} />
            MULAI MEMBANGUN
          </button>
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-secondary/40 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ArrowLeft size={16} />
            Kembali
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default IdleOverlay;
