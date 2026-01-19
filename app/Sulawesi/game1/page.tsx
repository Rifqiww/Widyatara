"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StartScreen from "./components/StartScreen";
import GameBoard from "./components/GameBoard";
import { GameMode } from "./types";

export default function GameOnePage() {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);

  return (
    <div className="min-h-screen bg-[#F8F4E1] flex flex-col font-sans">
      <style
        dangerouslySetInnerHTML={{
          __html: `nav, footer { display: none !important; }`,
        }}
      />

      <main className="grow flex flex-col items-center justify-center p-4 relative overflow-hidden z-10">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {!gameMode ? (
              <motion.div
                key="start"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <StartScreen onSelectMode={setGameMode} />
              </motion.div>
            ) : (
              <motion.div
                key="game"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <GameBoard mode={gameMode} onExit={() => setGameMode(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
