"use client"
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, RotateCcw, ArrowRight, Flame } from "lucide-react";
import RecipeBook from "./RecipeBook";

interface ResultOverlayProps {
  gameState: "playing" | "won" | "lost";
  onRestart: () => void;
}

const ResultOverlay: React.FC<ResultOverlayProps> = ({ gameState, onRestart }) => {
  if (gameState === "playing") return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/10 flex items-center justify-center z-[100] p-4 md:p-8"
      >
        <motion.div
          initial={{ scale: 0.9, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", damping: 20 }}
          className="bg-[color:var(--accent)] p-8 md:p-12 rounded-[3.5rem] max-w-xl w-full text-center shadow-[0_0_100px_rgba(0,0,0,0.8)] border-t-[12px] border-[color:var(--accent)] relative overflow-y-auto max-h-[90vh] scrollbar-hide"
        >              
          <h2 className={`text-4xl md:text-5xl font-black mb-6 tracking-tighter ${gameState === "won" ? "text-[color:var(--text-primary)]" : "text-red-900"}`}>
            {gameState === "won" ? "Rendang Sigma!" : "Masakan Hangus!"}
          </h2>

          {gameState === "won" ? (
            <div className="space-y-8 text-left mb-6 md:mb-10">
              {/* rendang rendang apa yang bikin marah? rendang orang hhh (jawaban asli dri jokes tersebut adalah nendang, kalo orang di tendang ngamuk dong orangnya hehe) -erlangga xii pplg 2 */}
              <div className="p-4 md:p-6 bg-[color:var(--accent)]/5 rounded-3xl border border-[color:var(--accent)]/10 group">
                <h3 className="flex items-center gap-2 text-lg md:text-xl font-black text-[color:var(--text-primary)] mb-3 md:mb-4">
                  <Info className="w-5 h-5 md:w-6 md:h-6 text-[color:var(--accent)]" />
                  Filosofi "Marandang"
                </h3>
                <p className="text-[color:var(--text-primary)]/80 leading-relaxed font-serif italic text-base md:text-lg lg:text-xl">
                  Rendang bukan sekadar makanan, melainkan simbol musyawarah dan kesabaran. Empat unsur penyusunnya melambangkan masyarakat Minangkabau: <strong> Daging</strong> (Marapulai/Pemimpin), <strong> Santan</strong> (Cadiak Pandai/Intelektual), <strong> Cabai</strong> (Alim Ulama), dan <strong> Bumbu</strong> (Keseluruhan masyarakat)."
                </p>
              </div>

              <RecipeBook />

              {/* summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="p-3 md:p-4 bg-white/40 rounded-2xl flex flex-col gap-1 items-center text-center">
                  <span className="text-2xl md:text-3xl">⏳</span>
                  <p className="text-[10px] md:text-sm font-bold opacity-60">Dibutuhkan waktu 4-8 jam untuk hasil otentik.</p>
                </div>
                <div className="p-3 md:p-4 bg-white/40 rounded-2xl flex flex-col gap-1 items-center text-center">
                  <span className="text-2xl md:text-3xl">🥥</span>
                  <p className="text-[10px] md:text-sm font-bold opacity-60">Dimasak hingga santan menjadi minyak & dedak.</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-lg md:text-xl text-[color:var(--text-primary)] mb-8 md:mb-10 leading-relaxed font-serif">
                Memasak Rendang butuh ketelitian urutan dan api yang terjaga. Jika tergesa-gesa, bumbu takkan meresap sempurna.
              </p>
              <div className="p-6 bg-red-50 rounded-3xl border border-red-100 flex items-start gap-4 text-left">
                <Flame className="w-8 h-8 text-red-500 shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-red-900">Peringatan Koki:</p>
                  <p className="text-sm text-red-800/80">Api yang terlalu besar atau urutan yang salah membuat bumbu tidak meresap ke dalam serat daging.</p>
                </div>
              </div>
            </div>
          )}
          {/*  button  */}
          <div className="flex flex-wrap gap-4 mt-8">
            <button 
              onClick={() => window.location.reload()}
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
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResultOverlay;
