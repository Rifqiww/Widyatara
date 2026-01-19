import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CardItem, GameMode, GameState, GameStats } from "../types";
import { GAME_DURATION, LANGUAGE_DATA, SYMBOL_DATA } from "../constants";
import GameCard from "./GameCard";
import GameOverlay from "./GameOverlay";
import { Timer, ArrowLeft, RefreshCw } from "lucide-react";
import { cn } from "../utils";

interface GameBoardProps {
  mode: GameMode;
  onExit: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ mode, onExit }) => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [gameState, setGameState] = useState<GameState>("READY"); // Start with READY state
  const [stats, setStats] = useState<GameStats>({
    timeLeft: GAME_DURATION,
  });
  const [countdown, setCountdown] = useState(3); // For the 3-2-1 countdown
  const [feedbackModal, setFeedbackModal] = useState<{
    show: boolean;
    isCorrect: boolean;
    item?: CardItem;
  }>({ show: false, isCorrect: false });

  // Initialize Game Data
  useEffect(() => {
    prepareGame();
  }, [mode]);

  const prepareGame = useCallback(() => {
    const data = mode === "LANGUAGE" ? LANGUAGE_DATA : SYMBOL_DATA;
    const shuffled = [...data].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedIds(new Set());
    setGameState("READY"); // Waiting for user to click Start
    setStats({
      timeLeft: GAME_DURATION,
    });
    setFeedbackModal({ show: false, isCorrect: false });
    setCountdown(3); // Reset countdown
  }, [mode]);

  const startGame = () => {
    setGameState("COUNTDOWN");
    setCountdown(3); // Ensure countdown starts from 3
  };

  const startNewGame = useCallback(() => {
    prepareGame();
    // In startNewGame (from restart button), maybe go back to READY or directly PLAYING?
    // Let's go to READY to be consistent with request.
    setGameState("READY");
  }, [prepareGame]);

  // Countdown Logic
  useEffect(() => {
    if (gameState === "COUNTDOWN") {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState("PREVIEW"); // After countdown, go to preview
      }
    }
  }, [gameState, countdown]);

  // Preview Logic
  useEffect(() => {
    if (gameState === "PREVIEW") {
      const timer = setTimeout(() => {
        setGameState("PLAYING"); // After preview, start playing
      }, 5000); // 5 seconds preview
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  // Game Timer Logic
  useEffect(() => {
    // Only pause timer for SYMBOL mode when feedback is shown
    const shouldPause = mode === "SYMBOL" && feedbackModal.show;
    if (gameState !== "PLAYING" || shouldPause) return;

    const timer = setInterval(() => {
      setStats((prev) => {
        if (prev.timeLeft <= 1) {
          setGameState("LOST");
          return { ...prev, timeLeft: 0 };
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, feedbackModal.show, mode]);

  // Card Click Handler
  const handleCardClick = (index: number) => {
    if (
      gameState !== "PLAYING" ||
      flippedIndices.includes(index) ||
      matchedIds.has(cards[index].pairId) ||
      flippedIndices.length >= 2 ||
      feedbackModal.show
    ) {
      return;
    }

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      checkMatch(newFlipped);
    }
  };

  const checkMatch = (indices: number[]) => {
    const card1 = cards[indices[0]];
    const card2 = cards[indices[1]];

    if (card1.pairId === card2.pairId) {
      const nextMatchedIds = new Set(matchedIds);
      nextMatchedIds.add(card1.pairId);

      handleMatch(card1, nextMatchedIds);
    } else {
      handleMismatch(card1);
    }
  };

  const handleMatch = (card: CardItem, nextMatchedIds: Set<string>) => {
    setTimeout(() => {
      setMatchedIds(nextMatchedIds);
      setFlippedIndices([]);

      if (mode === "SYMBOL") {
        // Show explanation for correct match in Symbol mode
        setFeedbackModal({
          show: true,
          isCorrect: true,
          item: card,
        });
      } else {
        // For LANGUAGE, check win immediately as there's no popup
        const totalPairs = cards.length / 2;
        if (nextMatchedIds.size === totalPairs) {
          setGameState("WON");
        }
      }
    }, 500);
  };

  const handleMismatch = (card: CardItem) => {
    setTimeout(() => {
      if (mode === "LANGUAGE") {
        // Show feedback on mismatch for Language mode
        setFeedbackModal({
          show: true,
          isCorrect: false,
          item: card,
        });
      } else {
        // Just reset flipped indices for Symbol mode
        setFlippedIndices([]);
      }
    }, 800);
  };

  const closeFeedback = () => {
    const wasCorrect = feedbackModal.isCorrect;
    setFeedbackModal({ show: false, isCorrect: false });
    setFlippedIndices([]);

    // If it was the last match, trigger win
    if (wasCorrect) {
      const totalPairs = cards.length / 2;
      if (matchedIds.size === totalPairs) {
        setGameState("WON");
      }
    }
  };

  return (
    <div className="relative w-full max-w-360 mx-auto p-1 flex flex-col h-[calc(100vh-1rem)]">
      {/* Ready Popup */}
      <AnimatePresence>
        {gameState === "READY" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#F8F4E1] rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border-2 border-[#AF8F6F]"
            >
              <h2 className="text-3xl font-bold mb-4 text-[#543310] font-serif">
                Bersiaplah
              </h2>
              <p className="text-[#543310]/80 mb-8 font-sans">
                Tantanganmu: Cocokkan semua kartu dalam{" "}
                {Math.floor(GAME_DURATION / 60)} menit.
              </p>
              <button
                onClick={startGame}
                className="w-full py-4 bg-[#543310] hover:bg-[#74512D] text-[#F8F4E1] rounded-xl font-bold text-lg transition-colors shadow-lg shadow-[#543310]/20 cursor-pointer"
              >
                Mulai Sekarang!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {gameState === "COUNTDOWN" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.5, opacity: 1 }}
              exit={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-9xl font-black text-[#D97706] drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] font-serif"
            >
              {countdown > 0 ? countdown : "Sikat!"}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD */}
      <div className="flex items-center justify-between mb-6 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-md border border-[#AF8F6F]/20">
        <button
          onClick={onExit}
          className="p-2 hover:bg-[#AF8F6F]/10 rounded-full transition-colors text-[#543310] cursor-pointer"
        >
          <ArrowLeft size={24} />
        </button>

        <div className="flex gap-6">
          <div className="flex items-center gap-2 text-[#D97706] font-bold bg-[#D97706]/10 px-4 py-2 rounded-full border border-[#D97706]/20">
            <Timer size={20} />
            {/* Format timer nicely if > 60s */}
            <span>
              {Math.floor(stats.timeLeft / 60)}:
              {(stats.timeLeft % 60).toString().padStart(2, "0")}
            </span>
          </div>
        </div>

        <button
          onClick={() => setGameState("PAUSED")}
          className="p-2 hover:bg-[#AF8F6F]/10 rounded-full transition-colors text-[#543310] cursor-pointer"
        >
          <RefreshCw size={24} />
        </button>
      </div>

      {/* Pause/Restart Confirmation Modal */}
      <AnimatePresence>
        {gameState === "PAUSED" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#F8F4E1] p-6 rounded-2xl max-w-sm w-full shadow-2xl border-l-4 border-[#D97706]"
            >
              <h3 className="text-xl font-bold text-[#543310] mb-2 font-serif">
                Ingin mengulang?
              </h3>
              <p className="text-[#543310]/80 mb-6 font-sans">
                Permainan akan direset dan kamu harus mulai dari awal. Yakin?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setGameState("PLAYING")}
                  className="flex-1 py-2 bg-white border border-[#AF8F6F] text-[#543310] rounded-lg hover:bg-[#AF8F6F]/10 transition-colors font-semibold cursor-pointer"
                >
                  Tidak
                </button>
                <button
                  onClick={startNewGame}
                  className="flex-1 py-2 bg-[#D97706] text-white rounded-lg hover:bg-[#B45309] transition-colors font-semibold cursor-pointer"
                >
                  Iya
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      <div className="grid grid-cols-6 gap-3 w-full h-full content-center px-4">
        {cards.map((card, index) => (
          <GameCard
            key={`${card.id}-${index}`}
            item={card}
            isFlipped={
              flippedIndices.includes(index) || gameState === "PREVIEW"
            } // All cards flipped during PREVIEW
            isMatched={matchedIds.has(card.pairId)}
            onClick={() => handleCardClick(index)}
            disabled={gameState !== "PLAYING"} // Disable clicks during countdown/preview
          />
        ))}
      </div>

      {/* Educational Feedback Modal (Correct Match Only) */}
      <AnimatePresence>
        {feedbackModal.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={closeFeedback}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={cn(
                "bg-[#F8F4E1] p-6 rounded-2xl max-w-sm w-full shadow-2xl border-l-4",
                feedbackModal.isCorrect
                  ? "border-[#10B981]"
                  : "border-[#9F1239]",
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-[#543310] mb-2 font-serif">
                {feedbackModal.isCorrect
                  ? "Benar Sekali!"
                  : "Wah, jawaban kurang tepat!"}
              </h3>
              <p className="text-[#543310]/80 mb-4 leading-relaxed font-sans">
                {feedbackModal.item?.info}
              </p>
              <button
                onClick={closeFeedback}
                className={cn(
                  "w-full py-2 text-white rounded-lg transition-colors font-semibold cursor-pointer",
                  feedbackModal.isCorrect
                    ? "bg-[#10B981] hover:bg-[#059669]"
                    : "bg-[#9F1239] hover:bg-[#78350F]",
                )}
              >
                {feedbackModal.isCorrect ? "Keren, Lanjut!" : "Sip, Paham!"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Over / Win Overlay */}
      {(gameState === "WON" || gameState === "LOST") && (
        <GameOverlay
          state={gameState}
          stats={stats}
          mode={mode}
          onRestart={startNewGame}
          onHome={onExit}
        />
      )}
    </div>
  );
};

export default GameBoard;
