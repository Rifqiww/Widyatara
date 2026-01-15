"use client";

import React, { useEffect, useMemo } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "./TransitionContext";

const CloudTransition = () => {
  const { isAnimating, setIsAnimating, targetPath } = useTransitionContext();
  const router = useRouter();

  // Buat stop animasi
  const DEBUG_SHOW = false;

  useEffect(() => {
    if (DEBUG_SHOW) return;

    if (isAnimating && targetPath) {
      const timer = setTimeout(() => {
        router.push(targetPath);
      }, 2500);

      const closeTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 4000);

      return () => {
        clearTimeout(timer);
        clearTimeout(closeTimer);
      };
    }
  }, [isAnimating, targetPath, router, setIsAnimating, DEBUG_SHOW]);

  const cloudVariants: Variants = {
    initialLeft: { x: "-100%", opacity: 0, scale: 1, rotateZ: 0.01, z: 0 },
    initialRight: { x: "100%", opacity: 0, scale: 1, rotateZ: 0.01, z: 0 },
    enter: (custom: number) => ({
      x: "0%",
      opacity: 1,
      scale: 1,
      rotateZ: 0.01,
      z: 0,
      transition: {
        duration: DEBUG_SHOW ? 0 : 1.8,
        ease: [0.22, 1, 0.36, 1],
        delay: DEBUG_SHOW ? 0 : custom * 0.08,
      },
    }),
    exitLeft: (custom: number) => ({
      x: "-120%",
      opacity: 0,
      rotateZ: 0.01,
      z: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: custom * 0.05 + 0.3,
      },
    }),
    exitRight: (custom: number) => ({
      x: "120%",
      opacity: 0,
      rotateZ: 0.01,
      z: 0,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay: custom * 0.05 + 0.3,
      },
    }),
  };

  const clouds = useMemo(
    () => [
      { id: 1, side: "left", top: "-25%", left: "-10%", scale: 1.7, z: 200, delay: 0},
      { id: 2, side: "right", top: "10%", right: "40%", scale: 1.8, z: 210, delay: 0.2},
      { id: 3, side: "left", top: "25%", left: "-20%", scale: 1.6, z: 220, delay: 0.09},
      { id: 4, side: "right", top: "25%", right: "-25%", scale: 1.9, z: 230, delay: 0.15},
      { id: 5, side: "left", top: "55%", left: "-40%", scale: 1.7, z: 240, delay: 0.13},
      { id: 6, side: "right", top: "65%", right: "-40%", scale: 1.8, z: 250, delay: 0.24},
      { id: 7, side: "left", top: "80%", left: "20%", scale: 1.6, z: 260, delay: 0.18},
      { id: 8, side: "right", top: "5%", right: "-50%", scale: 1.7, z: 270, delay: 0.08},
      { id: 9, side: "left", top: "-20%", left: "10%", scale: 1.5, z: 280, delay: 0.3},
      { id: 10, side: "right", top: "10%", right: "-7%", scale: 1.7, z: 290, delay: 0},
      { id: 11, side: "left", top: "40%", left: "10%", scale: 1.8, z: 300, delay: 0.12},
      { id: 12, side: "right", top: "60%", right: "10%", scale: 1.6, z: 310, delay: 0.05},
      { id: 13, side: "left", top: "-20%", left: "-40%", scale: 1.8, z: 320, delay: 0.16},
      { id: 14, side: "right", top: "-25%", right: "-35%", scale: 1.9, z: 330, delay: 0.01},
    ],
    []
  );

  return (
    <AnimatePresence mode="wait">
      {(isAnimating || DEBUG_SHOW) && (
        <div
          className="fixed inset-0 z-9999 pointer-events-none overflow-hidden touch-none select-none"
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
            willChange: "contents",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 bg-[#F8F4E1] -z-10"
          />

          {clouds.map((cloud) => (
            <motion.div
              key={cloud.id}
              custom={cloud.delay}
              variants={cloudVariants}
              initial={
                DEBUG_SHOW
                  ? "enter"
                  : cloud.side === "left"
                  ? "initialLeft"
                  : "initialRight"
              }
              animate="enter"
              exit={cloud.side === "left" ? "exitLeft" : "exitRight"}
              className={`absolute w-screen h-[70vh] flex items-center will-change-transform ${
                cloud.side === "left" ? "justify-start" : "justify-end"
              }`}
              style={{
                top: cloud.top,
                zIndex: cloud.z,
                left: cloud.left,
                right: cloud.right,
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <motion.div
                animate={
                  DEBUG_SHOW
                    ? { y: 0 }
                    : {
                        y: [0, cloud.id % 2 === 0 ? -25 : 25, 0],
                      }
                }
                transition={{
                  duration: 5 + (cloud.id % 4),
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                }}
                className="relative w-full h-full flex items-center justify-center translate-z-0"
                style={{
                  scale: cloud.scale,
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              >
                <div className="relative w-full h-full max-w-[80%] max-h-[80%]">
                  <Image
                    src="/assets/entrance-clouds.png"
                    alt={`Cloud ${cloud.id}`}
                    fill
                    sizes="100vw"
                    className={`object-contain pointer-events-none transform-gpu ${
                      cloud.side === "left" ? "scale-x-[-1]" : ""
                    }`}
                    priority
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default CloudTransition;
