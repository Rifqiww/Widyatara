import React from "react";
import { motion } from "framer-motion";
import { CardItem } from "../types";
import { cn } from "../utils";

interface GameCardProps {
  item: CardItem;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: () => void;
  disabled: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  item,
  isFlipped,
  isMatched,
  onClick,
  disabled,
}) => {
  return (
    <motion.div
      className={cn(
        "relative aspect-3/4 perspective-1000",
        disabled && !isFlipped && !isMatched
          ? "cursor-not-allowed opacity-80"
          : "cursor-pointer",
      )}
      onClick={() => !disabled && onClick()}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={!disabled && !isFlipped && !isMatched ? { scale: 1.05 } : {}}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full h-full relative preserve-3d will-change-transform"
        animate={{ rotateY: isFlipped || isMatched ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }} // Smoother, lighter animation
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front (Card Back / Question Mark) - Visible when NOT flipped (0deg) */}
        <div
          className="absolute inset-0 w-full h-full bg-linear-to-br from-[#543310] to-[#74512D] rounded-xl shadow-md border-2 border-[#AF8F6F]/30 flex items-center justify-center backface-hidden"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          <div className="text-[#F8F4E1] text-5xl md:text-6xl font-bold opacity-30 font-serif">
            ?
          </div>
        </div>

        {/* Back (Content) - Visible when flipped (180deg) */}
        <div
          className={cn(
            "absolute inset-0 w-full h-full rounded-xl shadow-md border-2 flex flex-col items-center justify-between p-2.5 gap-1 text-center backface-hidden bg-[#F8F4E1]",
            isMatched
              ? "border-[#10B981] text-[#10B981] bg-[#10B981]/10"
              : "border-[#AF8F6F] text-[#543310]",
          )}
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        >
          {item.image ? (
            <>
              <div className="w-full flex-1 flex items-center justify-center min-h-0 py-0.5">
                <img
                  src={item.image}
                  alt={item.content}
                  className="max-w-[90%] max-h-full object-contain drop-shadow-sm pointer-events-none"
                />
              </div>
              <span className="font-bold text-[10px] sm:text-xs md:text-[13px] selection:bg-none select-none font-serif leading-tight">
                {item.content}
              </span>
            </>
          ) : (
            <span className="font-bold text-sm sm:text-base md:text-lg selection:bg-none select-none font-serif leading-tight flex-1 flex items-center justify-center">
              {item.content}
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default GameCard;
