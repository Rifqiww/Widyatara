"use client"
import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

interface LostOverlayProps {
  onRestart: () => void;
}

const LostOverlay: React.FC<LostOverlayProps> = ({ onRestart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[60] bg-white/95 backdrop-blur-xl flex items-center justify-center p-12 text-center"
    >
      <div className="max-w-md">
        <div className="w-24 h-24 mx-auto mb-8 bg-red-100 rounded-3xl flex items-center justify-center border border-red-200">
          <AlertTriangle size={48} className="text-red-600" />
        </div>
        <h2 className="text-5xl font-black text-red-600 italic tracking-tighter mb-4">WAKTU HABIS!</h2>
        <p className="text-[var(--secondary)]/70 text-lg font-medium mb-10 leading-relaxed">
          Arsitektur hebat membutuhkan kesabaran. Jangan menyerah, coba bangun lagi dengan lebih teliti!
        </p>
        <div className="flex flex-col gap-4">
          <button 
            onClick={onRestart}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-[var(--primary)] text-white font-black rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-xl uppercase tracking-widest text-sm"
          >
            <RotateCcw size={20} />
            Coba Lagi
          </button>
          <button 
            onClick={() => window.history.back()}
            className="text-[var(--secondary)]/40 hover:text-[var(--primary)] transition-colors font-bold uppercase tracking-widest text-[10px]"
          >
            Mungkin Nanti
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default LostOverlay;
