"use client"
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, CheckCircle2 } from "lucide-react";

interface KualiProps {
  kualiRef: React.RefObject<HTMLDivElement | null>;
  kualiControls: any;
  isCooking: boolean;
  currentStep: number;
  showFeedback: boolean;
  feedbackType: "success" | "error" | null;
}

const Kuali: React.FC<KualiProps> = ({
  kualiRef,
  kualiControls,
  isCooking,
  currentStep,
  showFeedback,
  feedbackType
}) => {
  return (
    <div className="relative mt-auto">
      {/* api bawah kuali */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-4 opacity-60">
        {[1, 2, 3, 4].map((f) => (
          <motion.div
            key={f}
            animate={{
              scaleY: [1, 1.8, 1],
              opacity: [0.4, 0.8, 0.4],
              x: [0, (f % 2 === 0 ? 5 : -5), 0]
            }}
            transition={{
              duration: 0.4 + f * 0.1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-5 h-16 bg-gradient-to-t from-red-600 via-orange-500 to-transparent blur-md rounded-full origin-bottom"
          />
        ))}
      </div>
      <motion.div
        ref={kualiRef}
        animate={kualiControls}
        className="group relative w-64 md:w-96 h-36 md:h-48 bg-gradient-to-br from-[#4a3721] via-[#2d1e12] to-[#1a110a] rounded-b-[4rem] md:rounded-b-[7rem] border-t-[8px] md:border-t-[14px] border-[#3d2b1a] shadow-[0_30px_60px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center overflow-hidden"
      >            
        <motion.div 
          className="absolute top-1 md:top-2 w-[92%] h-4 md:h-8 bg-[#543310] rounded-full overflow-hidden shadow-inner"
          animate={{ 
            opacity: currentStep > 1 ? 1 : 0.3,
            backgroundColor: currentStep === 1 ? "#3d2b1a" : currentStep === 2 ? "#e11d48" : currentStep === 3 ? "#543310" : "#2d1e12"
          }}
        >
          <motion.div 
            className="w-full h-full bg-orange-900/30"
            animate={{ 
              x: [-30, 30, -30],
              scale: isCooking ? [1, 1.05, 1] : 1
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        <div className="absolute -top-10 md:-top-20 left-0 w-full flex justify-around pointer-events-none">
          {[1, 2, 3, 4, 5, 6].map((s) => (
            <motion.div
              key={s}
              animate={{
                y: [-10, -80],
                x: [0, (s % 2 === 0 ? 20 : -20)],
                opacity: [0, isCooking ? 0.9 : 0.4, 0],
                scale: [0.5, 1.5, 2],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: s * 0.5,
              }}
              className="w-8 h-8 md:w-12 md:h-12 bg-white/10 rounded-full blur-xl md:blur-2xl"
            />
          ))}
        </div>

        {/* berhasil masak */}
        <AnimatePresence>
          {showFeedback && feedbackType === "success" && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-20"
            >
              <CheckCircle2 className="w-20 h-20 md:w-32 md:h-32 text-green-500/50" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex flex-col items-center gap-1 z-10">
          <Flame className={`w-5 h-5 md:w-8 md:h-8 transition-colors ${isCooking ? "text-orange-500 animate-pulse" : "text-white/20"}`} />
          <span className="text-white/40 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[8px] md:text-xs text-center">Kuali Sigma Sumatra</span>
        </div>

        <div className="absolute -left-4 md:-left-6 top-10 md:top-12 w-8 md:w-12 h-14 md:h-20 border-[6px] md:border-[10px] border-[#2d1e12] rounded-l-2xl md:rounded-l-3xl shadow-lg" />
        <div className="absolute -right-4 md:-right-6 top-10 md:top-12 w-8 md:w-12 h-14 md:h-20 border-[6px] md:border-[10px] border-[#2d1e12] rounded-r-2xl md:rounded-r-3xl shadow-lg" />
      </motion.div>
    </div>
  );
};

export default Kuali;
