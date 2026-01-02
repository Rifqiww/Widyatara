"use client";

import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen({ onFinished }: { onFinished: () => void }) {
  const { progress } = useProgress();
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (progress === 100) {
      const timer = setTimeout(() => {
        setIsFinished(true);
        onFinished();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [progress, onFinished]);
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!isFinished) {
        setIsFinished(true);
        onFinished();
      }
    }, 10000); 
    return () => clearTimeout(fallback);
  }, [isFinished, onFinished]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#F8F4E1]"
        >
          <div className="relative flex flex-col items-center">
            {/* Logo ler pls ingetin gw */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-[#543310] mb-8 tracking-[0.2em] uppercase font-serif"
            >
              Widyatara
            </motion.h2>
        
            {/* Progress Container */}
            <div className="w-64 md:w-80 h-[2px] bg-[#543310]/10 relative overflow-hidden rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="absolute top-0 left-0 h-full bg-[#AF8F6F]"
              />
            </div>

            {/* Progress Percentage */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-[#74512D] text-sm tracking-widest font-mono"
            >
              {Math.round(progress)}%
            </motion.div>
            <div className="mt-12 flex space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                  className="w-1.5 h-1.5 rounded-full bg-[#AF8F6F]"
                />
              ))}
            </div>
            
            <p className="mt-4 text-[#74512D]/60 text-xs uppercase tracking-[0.3em]">
              Memuat Warisan Budaya
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
