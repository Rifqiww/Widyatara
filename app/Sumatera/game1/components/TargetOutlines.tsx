"use client"
import React from "react";
import { motion } from "framer-motion";
import { Piece } from "../types";

interface TargetOutlinesProps {
  pieces: Piece[];
  showHint: string | null;
}

const TargetOutlines: React.FC<TargetOutlinesProps> = ({ pieces, showHint }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {pieces.map((piece) => (
        <motion.div
          key={`target-${piece.id}`}
          className="absolute border-2 border-dashed rounded-xl flex items-center justify-center transition-all duration-500"
          style={{
            width: piece.width,
            height: piece.height,
            x: piece.targetX,
            y: piece.targetY,
          }}
          animate={{
            borderColor: piece.isSnapped ? "var(--accent)" : 
                        (showHint === piece.id ? "var(--primary)" : "var(--secondary)/0.1"),
            scale: showHint === piece.id ? [1, 1.03, 1] : 1,
            backgroundColor: showHint === piece.id ? "var(--accent)/0.05" : "transparent",
          }}
          transition={showHint === piece.id ? { repeat: Infinity, duration: 1.5 } : {}}
        >
          {!piece.isSnapped && showHint === piece.id && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -top-10 px-4 py-1.5 bg-[var(--primary)] text-white text-[10px] font-black rounded-lg uppercase tracking-wider shadow-lg"
            >
              Taruh {piece.name} Disini
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default TargetOutlines;
