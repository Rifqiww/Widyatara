"use client"
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ingredient } from "../types";

interface IngredientShelfProps {
  ingredients: Ingredient[];
  isCooking: boolean;
  currentStep: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onDragEnd: (event: any, info: any, ingredient: Ingredient) => void;
}

const IngredientShelf: React.FC<IngredientShelfProps> = ({ 
  ingredients, 
  isCooking, 
  currentStep, 
  containerRef, 
  onDragEnd 
}) => {
  return (
    <div className="w-full grid grid-cols-2 md:flex md:justify-center items-center gap-4 md:gap-16 z-30 mt-12 md:mt-8 px-4">
      {ingredients.map((ing) => (
        <div key={ing.id} className="relative aspect-square md:w-32 md:h-32 flex flex-col items-center justify-center">
          <AnimatePresence>
            {!ing.placed && (
              <motion.div
                drag={!isCooking}
                dragSnapToOrigin
                dragConstraints={containerRef}
                dragElastic={0.1}
                onDragEnd={(e, info) => onDragEnd(e, info, ing)}
                whileHover={!isCooking ? { scale: 1.1, rotate: 5 } : {}}
                whileDrag={{ scale: 1.2, rotate: -5, zIndex: 100 }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ 
                  opacity: isCooking ? 0.5 : 1, 
                  y: 0, 
                  scale: 1,
                  filter: isCooking ? "grayscale(1)" : "none"
                }}
                exit={{ scale: 0, opacity: 0 }}
                className={`group relative w-full h-full rounded-3xl md:rounded-[2.5rem] flex flex-col items-center justify-center gap-2 shadow-xl border-b-4 md:border-b-8 border-black/10 transition-all ${
                  isCooking ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
                }`}
                style={{ 
                  backgroundColor: ing.color,
                  color: (ing.id === 'santan' || ing.id === 'cabai') ? 'white' : (ing.id === 'rempah' ? 'white' : 'white')
                }}
              >
                <img 
                  src={ing.img} 
                  alt={ing.name} 
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-2xl shadow-lg border-2 border-white/20" 
                />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">{ing.name}</span>
                
                {currentStep === ing.order && !isCooking && (
                  <div className="absolute -inset-2 md:-inset-3 border-2 md:border-4 border-dashed border-[color:var(--accent)] rounded-[2rem] md:rounded-[3rem] animate-spin-slow opacity-60" />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default IngredientShelf;
