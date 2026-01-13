"use client"
import React from "react";
import { motion } from "framer-motion";
import { Piece } from "../types";

interface SnappedPiecesProps {
  pieces: Piece[];
}

const SnappedPieces: React.FC<SnappedPiecesProps> = ({ pieces }) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {pieces.filter(p => p.isSnapped).map((piece) => (
        <motion.img
          key={`snapped-${piece.id}`}
          src={piece.img}
          alt={piece.name}
          className="absolute object-contain drop-shadow-[0_20px_40px_rgba(84,51,16,0.2)]"
          initial={{ scale: 1.8, rotateY: 180, opacity: 0 }}
          animate={{ scale: 1, rotateY: 0, opacity: 1, x: piece.targetX, y: piece.targetY }}
          style={{ width: piece.width, height: piece.height }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      ))}
    </div>
  );
};

export default SnappedPieces;
