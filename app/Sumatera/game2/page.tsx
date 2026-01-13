"use client";

import React, { useState, useEffect, useRef } from "react";
import { AnimatePresence, useAnimation } from "framer-motion";
import { Flame } from "lucide-react";
import { motion } from "framer-motion";
import { INITIAL_INGREDIENTS } from "./constants";
import { Ingredient } from "./types";

import Onboarding from "./components/Onboarding";
import FloatingTimer from "./components/FloatingTimer";
import StepIndicator from "./components/StepIndicator";
import IngredientShelf from "./components/IngredientShelf";
import Kuali from "./components/Kuali";
import ResultOverlay from "./components/ResultOverlay";
import GameFooter from "./components/GameFooter";

const RacikRasaNusantara: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">("playing");
  const [currentStep, setCurrentStep] = useState(1);
  const [isCooking, setIsCooking] = useState(false);
  const [cookingProgress, setCookingProgress] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | null>(null);
  const [cookingMessage, setCookingMessage] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(true);

  const kualiControls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const kualiRef = useRef<HTMLDivElement>(null);

  // Timer logic
  useEffect(() => {
    if (gameState !== "playing" || showOnboarding) return;

    if (timeLeft <= 0) {
      setGameState("lost");
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, showOnboarding]);

  // Cooking Logic
  useEffect(() => {
    if (!isCooking) return;

    const getDuration = () => {
      switch(currentStep) {
        case 2: return 2000;
        case 3: return 2500;
        case 4: return 3500;
        case 5: return 5000;
        default: return 3000;
      }
    };

    const duration = getDuration();
    const intervalTime = 50;
    const increment = (intervalTime / duration) * 100;

    const interval = setInterval(() => {
      setCookingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsCooking(false);
          setCookingProgress(0);
          
          if (currentStep > 4) {
            setGameState("won");
          }
          return 100;
        }
        return prev + increment;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isCooking, currentStep]);

  const handleRestart = () => {
    setIngredients(INITIAL_INGREDIENTS.map(i => ({ ...i, placed: false })));
    setTimeLeft(60);
    setGameState("playing");
    setCurrentStep(1);
    setIsCooking(false);
    setCookingProgress(0);
    setShowFeedback(false);
    setFeedbackType(null);
  };

  const getCookingMessage = (step: number) => {
    switch(step) {
      case 1: return "Menumis Rempah...";
      case 2: return "Menghaluskan Cabai...";
      case 3: return "Meresapkan Bumbu ke Daging...";
      case 4: return "Mengentalkan Santan (Marandang)...";
      default: return "Memasak...";
    }
  };

  const onDragEnd = (event: any, info: any, ingredient: Ingredient) => {
    if (gameState !== "playing" || ingredient.placed || isCooking) return;

    const kualiRect = kualiRef.current?.getBoundingClientRect();
    const dragPoint = info.point;

    if (
      kualiRect &&
      dragPoint.x >= kualiRect.left &&
      dragPoint.x <= kualiRect.right &&
      dragPoint.y >= kualiRect.top &&
      dragPoint.y <= kualiRect.bottom
    ) {
      if (ingredient.order === currentStep) {
        // Success
        setIngredients((prev) =>
          prev.map((item) =>
            item.id === ingredient.id ? { ...item, placed: true } : item
          )
        );
        
        setFeedbackType("success");
        setShowFeedback(true);
        setTimeout(() => setShowFeedback(false), 800);

        // Start cooking 
        setIsCooking(true);
        setCookingMessage(getCookingMessage(currentStep));
        setCurrentStep((prev) => prev + 1);
      } else {
        // Error
        setFeedbackType("error");
        kualiControls.start({
          x: [0, -10, 10, -10, 10, 0],
          transition: { duration: 0.4 },
        });
      }
    }
  };

  return (
    <div 
      className="relative w-full min-h-screen border-[color:var(--secondary)] bg-[color:var(--bg-secondary)] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] flex flex-col font-sans select-none"
      ref={containerRef}
    >
      <FloatingTimer timeLeft={timeLeft} />

      <Onboarding 
        showOnboarding={showOnboarding} 
        onStart={() => setShowOnboarding(false)} 
      />

      <main className="relative flex-1 w-full flex flex-col items-center justify-between py-8 px-6 overflow-hidden">
        <StepIndicator currentStep={currentStep} />

        <IngredientShelf 
          ingredients={ingredients}
          isCooking={isCooking}
          currentStep={currentStep}
          containerRef={containerRef}
          onDragEnd={onDragEnd}
        />

        {/* progress masak */}
        <div className="h-20 flex flex-col items-center justify-center w-full max-w-sm gap-3 z-10 transition-all">
          <AnimatePresence mode="wait">
            {isCooking && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="w-full flex flex-col items-center gap-2"
              >
                <p className="text-[color:var(--text-primary)] font-black text-lg flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 animate-bounce" />
                  {cookingMessage}
                </p>
                <div className="w-full h-3 bg-black/10 rounded-full overflow-hidden border border-white/20">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-orange-400 to-red-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${cookingProgress}%` }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Kuali 
          kualiRef={kualiRef}
          kualiControls={kualiControls}
          isCooking={isCooking}
          currentStep={currentStep}
          showFeedback={showFeedback}
          feedbackType={feedbackType}
        />
      </main>

      <ResultOverlay 
        gameState={gameState} 
        onRestart={handleRestart} 
      />

      <GameFooter ingredients={INITIAL_INGREDIENTS} />
    </div>
  );
};

export default RacikRasaNusantara;
