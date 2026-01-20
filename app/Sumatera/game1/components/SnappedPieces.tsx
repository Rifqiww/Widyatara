"use client"
import React from "react";
import { motion } from "framer-motion";
import { Piece } from "../types";

interface SnappedPiecesProps {
  pieces: Piece[];
}

const SnappedPieces: React.FC<SnappedPiecesProps> = ({ pieces }) => {
  const allSnapped = pieces.every(p => p.isSnapped);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {allSnapped ? (
        // Show complete full image when all pieces are done - NO GAPS!
        <motion.img
          key="complete-gadang"
          src="/Sumatera/game1/gadangfull.png"
          alt="Rumah Gadang Complete"
          className="absolute object-contain drop-shadow-[0_20px_40px_rgba(84,51,16,0.2)]"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: 500,
            height: 400,
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      ) : (
        // Show individual pieces while building
        pieces.filter(p => p.isSnapped).map((piece) => (
          <motion.img
            key={`snapped-${piece.id}`}
            src={piece.img}
            alt={piece.name}
            className="absolute object-contain drop-shadow-[0_20px_40px_rgba(84,51,16,0.2)]"
            initial={{ scale: 1.8, rotateY: 180, opacity: 0 }}
            animate={{
              scale: 1,
              rotateY: 0,
              opacity: 1,
              x: piece.targetX,
              y: piece.targetY
            }}
            style={{
              width: piece.width,
              height: piece.height,
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden'
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          />
        ))
      )}
    </div>
  );
};

export default SnappedPieces;
