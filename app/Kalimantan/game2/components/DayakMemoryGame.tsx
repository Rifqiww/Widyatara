"use client";

import React, { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, Environment, View } from "@react-three/drei";

interface DayakSymbol {
  id: string;
  name: string;
  meaning: string;
  color: string;
  modelPath: string;
  frequency: number; // audio feedback
}

const SYMBOLS: DayakSymbol[] = [
  {
    id: "manukan",
    name: "Burung Enggang",
    meaning: "Simbol kehormatan dan jiwa pemimpin suku",
    color: "#FFD700",
    modelPath: "/Kalimantan/game2/Manukan.glb",
    frequency: 261.63,
  },
  {
    id: "sapundu",
    name: "Sapundu Ritual",
    meaning: "Tiang kayu sakral penghubung dunia manusia dan roh",
    color: "#BC8F8F",
    modelPath: "/Kalimantan/game2/sapundu.glb",
    frequency: 329.63,
  },
  {
    id: "orangorangan",
    name: "Patung Penjaga",
    meaning: "Penjaga batas desa dari energi negatif",
    color: "#A0522D",
    modelPath: "/Kalimantan/game2/orangorangan.glb",
    frequency: 392.0,
  },
  {
    id: "asmi",
    name: "Ukiran Asmi",
    meaning: "Keseimbangan hubungan manusia dengan pencipta",
    color: "#CD853F",
    modelPath: "/Kalimantan/game2/asmi.glb",
    frequency: 523.25,
  },
];

const LEVEL_CONFIG = [
  { level: 1, sequenceLength: 3, timeLimit: 15 },
  { level: 2, sequenceLength: 4, timeLimit: 20 },
  { level: 3, sequenceLength: 5, timeLimit: 25 },
  { level: 4, sequenceLength: 6, timeLimit: 30 },
  { level: 5, sequenceLength: 7, timeLimit: 25 },
];

type GameStatus = "IDLE" | "MEMORIZING" | "PLAYING" | "LEVEL_TRANSITION" | "GAME_OVER" | "WIN";

function Model({ path, isActive }: { path: string; isActive: boolean }) {
  const { scene } = useGLTF(path);
  // Clone scene so multiple instances don't conflict
  const clonedScene = React.useMemo(() => scene.clone(), [scene]);

  return (
    <primitive 
      object={clonedScene} 
      scale={isActive ? 2.6 : 2} 
      rotation={[0, Math.PI / 0.7, 0]}
    />
  );
}

export default function DayakMemoryGame() {
  const [status, setStatus] = useState<GameStatus>("IDLE");
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeSymbol, setActiveSymbol] = useState<string | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(75);
  const [score, setScore] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtx = useRef<AudioContext | null>(null);

  // audio pertama
  const initAudio = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playTone = (freq: number) => {
    if (!audioCtx.current) return;
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, audioCtx.current.currentTime);
    
    gain.gain.setValueAtTime(0, audioCtx.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, audioCtx.current.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.5);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.5);
  };

  // Start Game
  const startGame = () => {
    initAudio();
    setStatus("MEMORIZING");
    setLevel(1);
    setTimeLeft(75);
    setMistakes(0);
    setScore(0);
    setPlayerSequence([]);
    generateSequence(1);
  };

  const generateSequence = (lvl: number) => {
    const config = LEVEL_CONFIG[lvl - 1];
    const newSeq = Array.from({ length: config.sequenceLength }, () => {
      return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].id;
    });
    setSequence(newSeq);
  };

  // Playback sequence
  useEffect(() => {
    if (status === "MEMORIZING" && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        const symbolId = sequence[i];
        const symbol = SYMBOLS.find(s => s.id === symbolId);
        
        setActiveSymbol(symbolId);
        if (symbol) playTone(symbol.frequency);

        setTimeout(() => setActiveSymbol(null), 600);
        
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => setStatus("PLAYING"), 800);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [status, sequence]);

  // Global Timer
  useEffect(() => {
    if (status === "MEMORIZING" || status === "PLAYING") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStatus("GAME_OVER");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [status]);

  const handleSymbolClick = (id: string) => {
    if (status !== "PLAYING") return;

    initAudio();
    const symbol = SYMBOLS.find(s => s.id === id);
    if (symbol) playTone(symbol.frequency);

    const nextIndex = playerSequence.length;
    if (sequence[nextIndex] === id) {
      // Correct
      const newPlayerSeq = [...playerSequence, id];
      setPlayerSequence(newPlayerSeq);
      
      if (newPlayerSeq.length === sequence.length) {
        // Level Complete
        setMistakes(0); // Reset consecutive mistakes
        setScore(prev => prev + (level * 100));
        if (level === 5) {
          setStatus("WIN");
        } else {
          setStatus("LEVEL_TRANSITION");
        }
      }
    } else {
      // Wrong
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      setPlayerSequence([]);

      if (newMistakes >= 3) {
        setStatus("GAME_OVER");
      } else {
        // Restart level memorization
        setStatus("MEMORIZING");
      }
    }
  };

  const nextLevel = () => {
    const nextLvl = level + 1;
    setLevel(nextLvl);
    setPlayerSequence([]);
    generateSequence(nextLvl);
    setStatus("MEMORIZING");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full p-4 font-sans text-foreground relative overflow-hidden bg-background">
      {/* HUD */}
      <div className="w-full max-w-md bg-secondary/20 backdrop-blur-md rounded-2xl p-6 border border-accent/20 mb-8 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">Level</span>
            <span className="text-3xl font-serif font-bold">{level}/5</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs uppercase tracking-widest text-accent font-bold">Waktu</span>
            <span className={`text-3xl font-mono font-bold ${level === 5 ? "text-red-600" : (timeLeft < 10 ? "text-red-500" : "")}`}>
              {timeLeft}s
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-primary/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-accent"
            style={{ width: `${(timeLeft / 75) * 100}%` }}
          />
        </div>

        <div className="flex gap-2 mt-4 justify-center">
            {[...Array(3)].map((_, i) => (
                <div 
                    key={i}
                    className={`w-4 h-4 rounded-full border-2 border-accent ${i < (3 - mistakes) ? 'bg-accent/80' : 'bg-transparent'}`}
                />
            ))}
        </div>
      </div>

      {/* Game Grid */}
      <div 
        className="grid grid-cols-2 gap-6 w-full max-w-md relative"
      >
        {SYMBOLS.map((symbol) => (
          <SymbolButton
            key={symbol.id}
            symbol={symbol}
            isActive={activeSymbol === symbol.id}
            disabled={status !== "PLAYING" && status !== "MEMORIZING"}
            onClick={() => handleSymbolClick(symbol.id)}
            status={status}
          />
        ))}

        {/* Center Totem Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-20">
            <div className="text-6xl select-none">🗿</div>
        </div>
      </div>

      {/* Narrative Context */}
      {status === "PLAYING" && (
          <p className="mt-8 text-center text-accent italic font-medium">
              Ulangi alunan urutan totem...
          </p>
      )}

      {/* Overlays */}
      {status === "IDLE" && (
        <Overlay title="Patung Dayak" subtitle="Asah ingatanmu dengan kebijaksanaan leluhur Dayak.">
          <button 
              onClick={startGame}
              className="px-8 py-3 bg-primary text-background rounded-full font-bold shadow-lg"
          >
            Mulai Ritual
          </button>
        </Overlay>
      )}

      {status === "LEVEL_TRANSITION" && (
          <Overlay 
              title={`Level ${level} Selesai!`} 
              subtitle={SYMBOLS.find(s => sequence[sequence.length-1] === s.id)?.meaning}
          >
              <div className="flex flex-col items-center gap-4">
                  <span className="text-5xl mb-2">✨</span>
                  <button 
                      onClick={nextLevel}
                      className="px-8 py-3 bg-accent text-background rounded-full font-bold"
                  >
                      Lanjut ke Tantangan Berikutnya
                  </button>
              </div>
          </Overlay>
      )}

      {status === "GAME_OVER" && (
        <Overlay title="Ritual Terhenti" subtitle="Ingatanmu memudar, namun leluhur selalu memberi kesempatan kedua.">
          <button 
              onClick={startGame}
              className="px-8 py-3 bg-red-800 text-white rounded-full font-bold"
          >
            Coba Lagi
          </button>
        </Overlay>
      )}

      {status === "WIN" && (
        <Overlay title="Penjaga Tradisi" subtitle={`Luar biasa! Kamu telah menguasai seluruh urutan totem dalam ${75 - timeLeft} detik.`}>
          <div className="text-center">
              <p className="text-accent mb-6">Skor Akhir: {score + timeLeft * 10}</p>
              <button 
                  onClick={startGame}
                  className="px-8 py-3 bg-primary text-background rounded-full font-bold"
              >
              Main Lagi
              </button>
          </div>
        </Overlay>
      )}
    </div>
  );
}

function SymbolButton({ symbol, isActive, disabled, onClick, status }: { 
    symbol: DayakSymbol; 
    isActive: boolean; 
    disabled: boolean; 
    onClick: () => void;
    status: GameStatus;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative aspect-square rounded-3xl flex flex-col items-center justify-center p-2
        border-4 overflow-hidden
        ${isActive ? 'border-white shadow-[0_0_30px_rgba(255,255,255,0.8)]' : 'border-transparent shadow-md'}
      `}
      style={{ 
        backgroundColor: isActive ? symbol.color : `${symbol.color}15`,
        borderColor: isActive ? 'white' : `${symbol.color}40`,
        color: isActive ? 'white' : symbol.color,
        boxShadow: isActive ? `0 0 40px ${symbol.color}` : 'none'
      }}
    >
      <div className="w-full h-full relative">
        <Suspense fallback={<div className="flex items-center justify-center h-full text-xs text-accent">Memuat...</div>}>
          <Canvas 
            camera={{ position: [0, 0, 5], fov: 45 }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={1.5} />
            <pointLight position={[10, 10, 10]} intensity={2} />
            <directionalLight position={[-10, 10, 5]} intensity={1.5} />
            <Suspense fallback={null}>
                <Model path={symbol.modelPath} isActive={isActive} />
                <Environment preset="city" />
            </Suspense>
          </Canvas>
        </Suspense>
      </div>
      
      <span className={`absolute bottom-2 text-[10px] font-bold uppercase tracking-tighter text-center px-2 py-0.5 rounded-full bg-black/40 ${isActive ? 'opacity-100 text-white' : 'opacity-60 text-white'}`}>
        {symbol.name}
      </span>
    </button>
  );
}

function Overlay({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-lg p-6 text-center">
      <div className="bg-white/90 p-10 rounded-3xl max-w-md w-full shadow-2xl border border-accent/20">
        <h2 className="text-4xl font-serif font-bold text-primary mb-2 leading-tight">{title}</h2>
        {subtitle && <p className="text-secondary mb-8 leading-relaxed italic">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
