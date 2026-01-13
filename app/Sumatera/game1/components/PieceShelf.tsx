"use client"
import React from "react";
import { motion } from "framer-motion";
import { Piece } from "../types";

interface PieceShelfProps {
  pieces: Piece[];
  canvasRef: React.RefObject<HTMLDivElement | null>;
  onDrag: () => void;
  checkSnap: (id: string, x: number, y: number) => void;
}

const PieceShelf: React.FC<PieceShelfProps> = ({ pieces, canvasRef, onDrag, checkSnap }) => {
  return (
    <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-10 px-10 pointer-events-none">
      {pieces.filter(p => !p.isSnapped).map((piece, idx) => (
        <motion.div
          key={piece.id}
          drag
          dragConstraints={canvasRef}
          dragElastic={0.15}
          onDrag={(_, info) => {
            onDrag();
            const containerRect = canvasRef.current?.getBoundingClientRect();
            if (containerRect) {
              const centerX = containerRect.left + containerRect.width / 2;
              const centerY = containerRect.top + containerRect.height / 2;
              const x = info.point.x - centerX;
              const y = info.point.y - centerY;
              const distance = Math.sqrt(
                Math.pow(x - piece.targetX, 2) + Math.pow(y - piece.targetY, 2)
              );
              if (distance < 60) {
                checkSnap(piece.id, x, y);
              }
            }
          }}
          onDragEnd={(_, info) => {
            const containerRect = canvasRef.current?.getBoundingClientRect();
            if (containerRect) {
              const centerX = containerRect.left + containerRect.width / 2;
              const centerY = containerRect.top + containerRect.height / 2;
              const x = info.point.x - centerX;
              const y = info.point.y - centerY;
              checkSnap(piece.id, x, y);
            }
          }}
          whileDrag={{ scale: 1.2, rotate: idx % 2 === 0 ? 8 : -8, zIndex: 100 }}
          whileHover={{ scale: 1.1, filter: "drop-shadow(0 0 20px rgba(175,143,111,0.4))" }}
          className="pointer-events-auto cursor-grab active:cursor-grabbing group relative"
          style={{ width: 140, height: 140 }}
        >
          <div className="w-full h-full bg-white rounded-2xl border-2 border-[var(--secondary)]/10 overflow-hidden shadow-xl transition-colors group-hover:border-[var(--primary)]/50">
            <img 
              src={piece.img} 
              alt={piece.name}
              className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 group-hover:scale-110"
              draggable={false}
            />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[var(--primary)] text-white text-[9px] font-black px-3 py-1 rounded-full whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {piece.name.toUpperCase()}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PieceShelf;
