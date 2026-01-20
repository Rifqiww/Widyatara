"use client"
import React from "react";
import { motion } from "framer-motion";
import { Info, RotateCcw, ArrowRight, ArrowLeft } from "lucide-react";

interface WinOverlayProps {
  onRestart: () => void;
}

const WinOverlay: React.FC<WinOverlayProps> = ({ onRestart }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1 }}
      className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 z-[60] max-w-md"
    >
      <div className="w-full text-foreground">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="bg-white/95 backdrop-blur-xl border border-secondary/10 rounded-3xl p-6 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />

          <div className="flex items-center gap-3 mb-3">
            <Info className="text-primary" size={18} />
            <h4 className="text-lg font-bold text-secondary">Mengenal Rumah Gadang</h4>
          </div>

          <p className="text-secondary/80 text-xs leading-relaxed mb-4 font-medium">
            Rumah Gadang adalah rumah adat bagi masyarakat Minangkabau di Sumatera Barat.
            Wujudnya yang paling khas adalah <span className="text-primary font-bold">Atap Gonjong</span> yang melengkung tajam layaknya tanduk kerbau.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background p-3 rounded-xl border border-secondary/10">
              <div className="text-primary text-[9px] font-black uppercase mb-1">Filosofi</div>
              <div className="text-[10px] text-secondary font-bold">Alam Takambang Jadi Guru</div>
            </div>
            <div className="bg-background p-3 rounded-xl border border-secondary/10">
              <div className="text-primary text-[9px] font-black uppercase mb-1">Sistem Konstruksi</div>
              <div className="text-[10px] text-secondary font-bold">Elastisitas & Resiliensi</div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRestart}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-background hover:bg-accent/10 text-primary font-bold rounded-xl border border-secondary/10 transition-all uppercase tracking-wide text-[10px]"
            >
              <RotateCcw size={14} />
              Main Lagi
            </button>
            <button
              onClick={() => alert("Level Berikutnya: Rumah Batak (Segera Hadir!)")}
              className="flex-1 group flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-black rounded-xl transition-all shadow-lg uppercase tracking-wide text-[10px]"
            >
              Level Selanjutnya
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <button
            onClick={() => window.history.back()}
            className="absolute top-3 right-3 text-secondary/20 hover:text-primary transition-colors p-1"
          >
            <ArrowLeft size={18} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WinOverlay;
