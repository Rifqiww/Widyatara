"use client"
import React from "react";
import { Ingredient } from "../types";

interface GameFooterProps {
  ingredients: Ingredient[];
}

const GameFooter: React.FC<GameFooterProps> = ({ ingredients }) => {
  return (
    <footer className="relative z-10 p-4 bg-black/5 backdrop-blur-sm flex justify-center border-t border-[color:var(--secondary)]/10 overflow-hidden">
      <div className="flex items-center gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-2 px-4 max-w-full">
        {ingredients.map((ing) => (
          <div key={ing.id} className="flex items-center gap-1.5 md:gap-2 whitespace-nowrap opacity-60 scale-90 md:scale-100">
            <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-[color:var(--secondary)]/10 flex items-center justify-center text-[8px] md:text-[10px] font-bold">{ing.order}</span>
            <img src={ing.img} alt={ing.name} className="w-5 h-5 md:w-6 md:h-6 object-cover rounded-md shadow-sm" />
            <span className="text-[10px] md:text-xs font-bold uppercase">{ing.name}</span>
            {ing.order < 4 && <div className="w-3 md:w-4 h-0.5 bg-[color:var(--secondary)]/20" />}
          </div>
        ))}
      </div>
    </footer>
  );
};

export default GameFooter;
