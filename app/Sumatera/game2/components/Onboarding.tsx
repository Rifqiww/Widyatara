"use client"
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ArrowRight } from "lucide-react";

interface OnboardingProps {
  showOnboarding: boolean;
  onStart: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ showOnboarding, onStart }) => {
  return (
    <AnimatePresence>
      {showOnboarding && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-xl z-[150] flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-[color:var(--accent)] max-w-md w-full p-8 rounded-[3rem] shadow-2xl border-t-[10px] border-[color:var(--accent)] text-center space-y-6"
          >
            <h2 className="text-3xl font-black text-[color:var(--text-primary)] tracking-tight">Meracik Rendang</h2>
            <p className="text-[color:var(--text-primary)]/70 leading-relaxed font-serif italic text-lg">
              Ketelitian, kesabaran, dan bumbu yang tepat adalah kunci utama mahakarya Sumatera.
            </p>
            <div className="bg-white/40 p-4 rounded-2xl text-left space-y-2 border border-white/60">
              <p className="text-xs font-bold uppercase tracking-widest text-[color:var(--accent)] flex items-center gap-2">
                <Info className="w-4 h-4" /> Cara Bermain
              </p>
              <p className="text-sm font-medium text-[color:var(--text-primary)]/80">
                Geser bahan-bahan ke dalam kuali sesuai urutan di bawah kuali yang benar sebelum waktu habis!
              </p>
            </div>
            <button
              onClick={onStart}
              className="w-full py-5 bg-[color:var(--accent-strong)] text-white font-black text-xl rounded-2xl hover:brightness-110 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 group"
            >
              Mulai Memasak
              <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Onboarding;
