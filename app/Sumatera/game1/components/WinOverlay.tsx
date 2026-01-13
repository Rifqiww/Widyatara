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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[60] bg-background/98 backdrop-blur-2xl flex items-center justify-center p-12 overflow-y-auto"
    >
      <div className="max-w-3xl w-full text-foreground">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white border border-secondary/10 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-50" />
          
          <div className="flex flex-col md:flex-row gap-10 items-center">
            <div className="w-full border-secondary/10 pl-0 md:pl-10 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Info className="text-primary" size={20} />
                <h4 className="text-xl font-bold text-secondary">Mengenal Rumah Gadang</h4>
              </div>
              <p className="text-secondary/80 text-sm leading-relaxed mb-6 font-medium">
                Rumah Gadang adalah rumah adat bagi masyarakat Minangkabau di Sumatera Barat. 
                Wujudnya yang paling khas adalah <span className="text-primary font-bold">Atap Gonjong</span> yang melengkung tajam layaknya tanduk kerbau. 
                Struktur bangunan ini dirancang <span className="text-primary font-bold">tahan gempa</span> tanpa menggunakan paku, melainkan sistem pasak kayu yang fleksibel namun sangat kokoh.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-background p-4 rounded-2xl border border-secondary/10">
                  <div className="text-primary text-[10px] font-black uppercase mb-1">Filosofi</div>
                  <div className="text-xs text-secondary font-bold">Alam Takambang Jadi Guru</div>
                </div>
                <div className="bg-background p-4 rounded-2xl border border-secondary/10">
                  <div className="text-primary text-[10px] font-black uppercase mb-1">Sistem Konstruksi</div>
                  <div className="text-xs text-secondary font-bold">Elastisitas & Resiliensi</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onRestart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-background hover:bg-accent/10 text-primary font-bold rounded-2xl border border-secondary/10 transition-all uppercase tracking-widest text-xs"
                >
                  <RotateCcw size={16} />
                  Main Lagi
                </button>
                <button 
                  onClick={() => alert("Level Berikutnya: Rumah Batak (Segera Hadir!)")}
                  className="flex-1 group flex items-center justify-center gap-2 px-6 py-4 bg-[var(--primary)] hover:bg-[var(--secondary)] text-white font-black rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs"
                >
                  Level Selanjutnya
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => window.history.back()}
            className="absolute top-6 right-6 text-secondary/20 hover:text-primary transition-colors p-2"
          >
            <ArrowLeft size={24} />
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WinOverlay;
