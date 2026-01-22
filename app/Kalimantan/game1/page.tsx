
"use client";

import React, { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Sky, ContactShadows, Text, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { Footprints, RotateCcw, Volume2, Info, ChevronLeft, Timer, AlertTriangle, Trophy } from "lucide-react";
import Link from "next/link";
import Head from "next/head";

import Stilts from "./components/Stilts";
import { GAME_DURATION, MAX_FALLS, EGRANG_COLORS } from "./constants";

export default function EgrangGame() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [falls, setFalls] = useState(0);
  const [distance, setDistance] = useState(0);
  const [balance, setBalance] = useState(0); // -1 to 1
  const [lastStep, setLastStep] = useState<"L" | "R" | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const [leftFoot, setLeftFoot] = useState(0);
  const [rightFoot, setRightFoot] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const gameLoopRef = useRef<number>(null);

  // Responsive check
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Efek suara (pakai beep standar browser buat logikanya)
  const playPop = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  // lloopibg game
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      // keseimbangan acak
      setBalance(prev => {
        const drift = (Math.random() - 0.5) * 0.15;
        const newBalance = prev + drift;
        
        if (Math.abs(newBalance) > 0.9) {
          handleFall();
          return 0;
        }
        return newBalance;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [gameState]);

  // timer
  useEffect(() => {
    if (gameState !== "playing") return;

    if (timeLeft <= 0) {
      setGameState("won");
      setShowInfo(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleFall = () => {
    setFalls(prev => {
      const newFalls = prev + 1;
      if (newFalls >= MAX_FALLS) {
        setGameState("lost");
      }
      return newFalls;
    });
    setBalance(0);
    setLeftFoot(0);
    setRightFoot(0);
    setLastStep(null);
  };

  const takeStep = (side: "L" | "R") => {
    if (gameState !== "playing") return;

    if (side === "L") {
      setLeftFoot(1);
      setTimeout(() => setLeftFoot(0), 200);
      setBalance(prev => prev - 0.2); // Bakal miring ke arah kaki
    } else {
      setRightFoot(1);
      setTimeout(() => setRightFoot(0), 200);
      setBalance(prev => prev + 0.2);
    }

    if (side !== lastStep) {
      setDistance(prev => prev + 1);
      playPop();
    } else {
      setBalance(prev => prev + (side === "L" ? -0.4 : 0.4));
    }
    setLastStep(side);
  };

  const startGame = () => {
    setGameState("playing");
    setTimeLeft(GAME_DURATION);
    setFalls(0);
    setDistance(0);
    setBalance(0);
    setLastStep(null);
    setShowInfo(false);
  };

  return (
    <>
      <Head>
        <title>Tantangan Egrang Borneo | Widyatara</title>
        <meta name="description" content="Uji keseimbanganmu dalam permainan tradisional Egrang dari Kalimantan secara 3D." />
      </Head>
      <main className="relative w-full h-screen bg-[#BAE6FD] overflow-hidden font-sans">
        {/* langit */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#7DD3FC] to-[#BAE6FD] z-0" />
        <nav className="absolute top-0 left-0 w-full p-4 md:p-6 flex justify-between items-center z-10">
          <Link 
            href="/Kalimantan" 
            className="flex items-center gap-2 text-[#543310] hover:opacity-70 transition-all font-bold bg-white/30 backdrop-blur-md px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-base"
          >
            <ChevronLeft size={isMobile ? 16 : 20} />
            <span>Kembali</span>
          </Link>
          <div className="flex gap-4">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className="p-2 md:p-3 bg-[#543310] text-white rounded-full shadow-lg hover:scale-110 transition-transform"
            >
              <Info size={isMobile ? 16 : 20} />
            </button>
          </div>
        </nav>

        {/* statistik atas */}
        <div className="absolute top-4 md:top-10 left-1/2 -translate-x-1/2 z-10 text-center w-full px-4">
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-2xl md:text-4xl font-black text-[#543310] drop-shadow-lg uppercase tracking-wider"
            >
              Tantangan Egrang
            </motion.h1>
        </div>

        {/* Kiri - Stats */}
        <div className="absolute top-20 md:top-28 left-4 md:left-6 flex flex-col gap-2 md:gap-4 z-20">
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-4 rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#4D7C0F]/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-0.5 md:mb-1">
              <Timer className="text-[#543310]/60" size={14} />
              <p className="text-[8px] md:text-[10px] font-black text-[#543310]/50 uppercase tracking-widest text-[8px]">Waktu</p>
            </div>
            <p className={`text-2xl md:text-4xl font-black ${timeLeft <= 5 ? "text-red-600 animate-pulse" : "text-[#543310]"}`}>
              {timeLeft}s
            </p>
          </motion.div>

          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-4 rounded-2xl md:rounded-3xl border-2 md:border-4 border-[#7C2D12]/20 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-0.5 md:mb-1">
              <AlertTriangle className="text-red-500" size={14} />
              <p className="text-[8px] md:text-[10px] font-black text-[#543310]/50 uppercase tracking-widest text-[8px]">Jatuh</p>
            </div>
            <p className="text-2xl md:text-4xl font-black text-[#543310]">
              {falls}<span className="text-base md:text-xl text-[#543310]/30 font-bold">/{MAX_FALLS}</span>
            </p>
          </motion.div>
        </div>

        {/* Kanan - Stats */}
        <div className="absolute top-20 md:top-28 right-4 md:right-6 flex flex-col items-end gap-2 md:gap-4 z-20">
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="bg-white/90 backdrop-blur-md px-4 py-2 md:px-6 md:py-4 rounded-2xl md:rounded-3xl border-2 md:border-4 border-yellow-500/20 shadow-xl text-right"
          >
            <div className="flex items-center justify-end gap-2 mb-0.5 md:mb-1">
              <p className="text-[8px] md:text-[10px] font-black text-[#543310]/50 uppercase tracking-widest text-[8px]">Langkah</p>
              <Footprints className="text-yellow-600" size={14} />
            </div>
            <p className="text-2xl md:text-4xl font-black text-[#543310]">{distance}</p>
          </motion.div>
        </div>

        {/* Indikator Keseimbangan Tengah Bawah */}
        <div className={`absolute ${isMobile ? "bottom-32" : "bottom-40"} left-1/2 -translate-x-1/2 w-48 md:w-64 h-3 md:h-4 bg-black/20 rounded-full z-10 border-2 border-white/40`}>
           <motion.div 
             animate={{ x: balance * (isMobile ? 96 : 128) }}
             className="absolute top-1/2 left-1/2 -mt-2.5 -ml-2.5 md:-mt-3 md:-ml-3 w-5 h-5 md:w-6 md:h-6 bg-white rounded-full shadow-lg border-2 border-[#543310]"
           />
           <div className="absolute -top-5 left-0 w-full flex justify-between px-2 text-[8px] md:text-[10px] font-black text-[#543310]">
             <span>KIRI</span>
             <span>TENGAH</span>
             <span>KANAN</span>
           </div>
        </div>
        
        <div className="w-full h-full">
          <Canvas shadows dpr={[1, 2]}>
            <PerspectiveCamera 
              makeDefault 
              position={[0, 2, isMobile ? 12 : 8]} 
              fov={isMobile ? 50 : 45} 
            />
            <ambientLight intensity={1} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
            
            <Suspense fallback={null}>
              <Stilts balance={balance} leftFootPos={leftFoot} rightFootPos={rightFoot} />
              
              {/* tanah */}
              <group position={[0, 0, 0]}>
                <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                  <planeGeometry args={[100, 100]} />
                  <meshStandardMaterial color="#BEF264" />
                </mesh>
                <gridHelper 
                  args={[100, 50, "#4D7C0F", "#4D7C0F"]} 
                  onUpdate={(self) => {
                    self.material.transparent = true;
                    self.material.opacity = 0.2;
                  }} 
                />
              </group>

              <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
              <Environment preset="park" />
            </Suspense>

            <OrbitControls 
                enablePan={false} 
                enableZoom={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
            />
          </Canvas>
        </div>

        {/* tombol kanan kiri */}
        <div className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex gap-4 md:gap-8 z-30">
          <button
            onPointerDown={() => takeStep("L")}
            className="w-20 h-20 md:w-24 md:h-24 bg-[#543310] text-white rounded-2xl md:rounded-3xl shadow-2xl hover:scale-95 active:scale-90 transition-all border-b-4 md:border-b-8 border-black font-black text-xl md:text-2xl"
          >
            L
          </button>
          <button
            onPointerDown={() => takeStep("R")}
            className="w-20 h-20 md:w-24 md:h-24 bg-[#543310] text-white rounded-2xl md:rounded-3xl shadow-2xl hover:scale-95 active:scale-90 transition-all border-b-4 md:border-b-8 border-black font-black text-xl md:text-2xl"
          >
            R
          </button>
        </div>

        {/* Overlay Menang/Kalah/Awal Game */}
        <AnimatePresence>
          {(gameState === "idle" || gameState === "lost" || gameState === "won") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xl z-50 flex items-center justify-center p-4 md:p-6"
            >
              <motion.div
                initial={{ scale: 0.9, y: 30 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#F8F4E1] p-6 md:p-10 rounded-[2.5rem] md:rounded-[4rem] max-w-lg w-full shadow-[0_0_100px_rgba(0,0,0,0.5)] text-center border-4 md:border-8 border-white border-double overflow-y-auto max-h-[90vh]"
              >
                {gameState === "won" ? (
                  <>
                    <div className="w-16 h-16 md:w-24 md:h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6 shadow-xl">
                      <Trophy size={isMobile ? 32 : 48} className="text-white" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-[#543310] mb-2">Hebat!</h2>
                    <p className="text-lg md:text-xl font-bold text-[#71421e] mb-2">Kamu berhasil mencapai {distance} langkah!</p>
                    <div className="bg-[#4D7C0F]/10 p-4 md:p-6 rounded-2xl md:rounded-3xl mb-6 md:mb-8 text-left border-2 border-[#4D7C0F]/20">
                      <h3 className="text-lg md:text-xl font-black text-[#4D7C0F] mb-2 md:mb-3 flex items-center gap-2">
                        <Info size={18} /> Mengenal Egrang
                      </h3>
                      <p className="text-sm md:text-base text-[#543310] leading-relaxed">
                        Egrang adalah permainan tradisional yang melatih keseimbangan, keberanian, dan koordinasi motorik. Bambu yang digunakan melambangkan kemandirian dan kekuatan pijakan hidup.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl md:text-5xl font-black text-[#543310] mb-3 md:mb-4">
                      {gameState === "lost" ? "Yah, Terjatuh!" : "Siap Berjalan?"}
                    </h2>
                    <p className="text-lg md:text-xl text-[#71421e] mb-6 md:mb-8 font-medium">
                      {gameState === "lost" 
                        ? `Kamu terlalu banyak jatuh. Jaga keseimbangan dengan menekan L and R secara bergantian!` 
                        : "Gunakan tombol L and R secara bergantian. Jangan biarkan bola keseimbangan keluar dari jalur!"}
                    </p>
                  </>
                )}

                <button 
                  onClick={startGame}
                  className="w-full py-4 md:py-6 bg-[#543310] text-white rounded-2xl md:rounded-[2rem] font-black text-xl md:text-2xl hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(84,51,16,0.3)] flex items-center justify-center gap-3 md:gap-4"
                >
                  <RotateCcw size={isMobile ? 24 : 28} />
                  {gameState === "won" ? "Main Lagi" : (gameState === "lost" ? "Ulangi" : "Mulai Game")}
                </button>
                
                {gameState === "won" && (
                  <Link href="/Kalimantan" className="block mt-4 md:mt-6 text-[#543310]/60 font-black hover:text-[#543310] transition-colors text-sm md:text-base">
                    Selesai & Keluar
                  </Link>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <style jsx global>{`
          canvas {
            touch-action: none;
          }
          @keyframes pulse-soft {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
        `}</style>
      </main>
    </>
  );
}
