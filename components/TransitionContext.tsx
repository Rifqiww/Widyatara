"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
  triggerTransition: (path: string) => void;
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
  targetPath: string | null;
}

const TransitionContext = createContext<TransitionContextType | undefined>(
  undefined
);

export const TransitionProvider = ({ children }: { children: ReactNode }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const router = useRouter();

  const triggerTransition = (path: string) => {
    if (isAnimating) return; // Prevent double triggers
    setTargetPath(path);
    setIsAnimating(true);
  };

  return (
    <TransitionContext.Provider
      value={{ triggerTransition, isAnimating, setIsAnimating, targetPath }}
    >
      {children}
    </TransitionContext.Provider>
  );
};

export const useTransitionContext = () => {
  const context = useContext(TransitionContext);
  if (!context) {
    throw new Error(
      "useTransitionContext must be used within a TransitionProvider"
    );
  }
  return context;
};
