"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "@/components/TransitionContext";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Maximize2,
  Users,
  TrendingUp,
  Play,
  Lock,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function SumateraOnboarding() {
  const router = useRouter();
  const { triggerTransition } = useTransitionContext();
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [activeGameIndex, setActiveGameIndex] = useState(0); // 0: RumahSumatera, 1: Daging
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);
  const [showDevModal, setShowDevModal] = useState(false);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Refs for 3D state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelsRef = useRef<{ [key: string]: THREE.Group }>({});
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // Mobile check
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (step !== 1 || !mountRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2, 6);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const width = mountRef.current.clientWidth || window.innerWidth;
    const height = mountRef.current.clientHeight || window.innerHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/",
    );
    loader.setDRACOLoader(dracoLoader);

    // Shadow Catcher
    const groundGeo = new THREE.PlaneGeometry(100, 100);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1;
    ground.receiveShadow = true;
    scene.add(ground);

    const loadModel = (
      path: string,
      id: string,
      name: string,
      pos: [number, number, number],
      scale: number,
      rotationY: number = 0,
    ) => {
      loader.load(path, (gltf) => {
        const model = gltf.scene;

        // Apply responsiveness to scale and position
        const finalScale = isMobile ? scale * 0.7 : scale;
        const finalPos: [number, number, number] = isMobile
          ? [0, pos[1], pos[2]]
          : pos;

        model.position.set(...finalPos);
        model.scale.set(finalScale, finalScale, finalScale);
        model.rotation.y = rotationY;
        model.traverse((c) => {
          if (c instanceof THREE.Mesh) {
            c.castShadow = true;
            c.receiveShadow = true;
          }
        });
        model.userData = {
          id,
          name,
          originalScale: finalScale,
          basePos: finalPos,
        };
        scene.add(model);
        modelsRef.current[id] = model;

        if (Object.keys(modelsRef.current).length === 2) {
          setLoading(false);
        }
      });
    };

    loadModel(
      "/RumahSumatera.glb",
      "game1",
      "Pembangun Rumah Gadang",
      [-3, 0, 0],
      3,
      -Math.PI / 2,
    );
    loadModel(
      "/daging.glb",
      "game2",
      "Dapur Tradisi Rendang",
      [3, -1, 0],
      1,
      0,
    );

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      Object.values(modelsRef.current).forEach((model) => {
        const isHovered = model.userData.hovered;
        const isActive =
          isMobile &&
          ((model.userData.id === "game1" && activeGameIndex === 0) ||
            (model.userData.id === "game2" && activeGameIndex === 1));

        const baseScale = model.userData.originalScale;
        const targetScale = isHovered || isActive ? baseScale * 1.1 : baseScale;
        model.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          0.1,
        );
      });
      renderer.render(scene, camera);
    };
    animate();

    const onMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        Object.values(modelsRef.current),
        true,
      );
      let hitId: string | null = null;
      if (intersects.length > 0) {
        document.body.style.cursor = "pointer";
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.id) obj = obj.parent;
        if (obj.userData.id) hitId = obj.userData.id;
      }
      Object.values(modelsRef.current).forEach((m) => {
        m.userData.hovered = m.userData.id === hitId;
      });
      if (hitId) {
        setHoveredGame(hitId);
      } else {
        document.body.style.cursor = "default";
        setHoveredGame(null);
      }
    };

    const onClick = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(
        Object.values(modelsRef.current),
        true,
      );
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.id) obj = obj.parent;
        const target =
          obj.userData.id === "game1" ? "/Sumatera/game1" : "/Sumatera/game2";
        router.push(target);
      }
    };

    const onResize = () => {
      if (!cameraRef.current || !rendererRef.current || !mountRef.current)
        return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(width, height);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onResize);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [step, isMobile]); // Added isMobile to dependencies

  useEffect(() => {
    if (step !== 1) return;
    const updateCam = () => {
      if (!cameraRef.current) return;
      if (window.innerWidth < 768) {
        // Mobile camera: target the active model with better distance
        const targetX = 0;
        const cameraX = 0;
        const targetPos = new THREE.Vector3(cameraX, 0.5, 9);
        cameraRef.current.position.lerp(targetPos, 0.1);
        cameraRef.current.lookAt(0, 0, 0);

        // Update model visibility
        Object.values(modelsRef.current).forEach((model) => {
          const isActive =
            (model.userData.id === "game1" && activeGameIndex === 0) ||
            (model.userData.id === "game2" && activeGameIndex === 1);
          model.visible = isActive;
        });
      } else {
        // Desktop camera
        cameraRef.current.position.lerp(new THREE.Vector3(0, 2, 8), 0.05);
        cameraRef.current.lookAt(0, 0, 0);
        Object.values(modelsRef.current).forEach((model) => {
          model.visible = true;
          // Restore desktop positions
          const originalX = model.userData.id === "game1" ? -3 : 3;
          model.position.x = THREE.MathUtils.lerp(
            model.position.x,
            originalX,
            0.1,
          );
        });
      }
    };
    const loop = setInterval(updateCam, 16);
    return () => clearInterval(loop);
  }, [step, activeGameIndex]);

  const touchStartRef = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) =>
    (touchStartRef.current = e.touches[0].clientX);
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (diff > 50 && activeGameIndex === 0) setActiveGameIndex(1);
    if (diff < -50 && activeGameIndex === 1) setActiveGameIndex(0);
    touchStartRef.current = null;
  };

  const handlePlay = () => {
    const target =
      activeGameIndex === 0 ? "/Sumatera/game1" : "/Sumatera/game2";
    triggerTransition(target);
    setTimeout(() => {
      window.location.href = target;
    }, 2500);
  };

  return (
    <div
      className="min-h-screen md:h-screen w-full bg-background flex items-center justify-center font-plus-jakarta relative overflow-y-auto md:overflow-hidden py-10 md:py-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Three.js Canvas Container (Always Mounted) */}
      <div
        ref={mountRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${step === 1 ? "z-10 opacity-100" : "z-[-1] opacity-0"}`}
      />
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <>
            <div className="flex flex-col items-center gap-4 mb-4 md:mb-0 pt-10 md:pt-10">
              <motion.div
                key="intro"
                variants={containerVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="max-w-5xl w-[92%] md:w-full bg-white/90 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(30,58,138,0.2)] border border-accent/30 flex flex-col md:flex-row relative mb-20 md:mb-0"
              >
                {/* Content Section (Left) */}
                <div className="md:w-3/5 p-6 md:p-14 flex flex-col justify-center order-2 md:order-1 pb-20 md:pb-14">
                  <h1
                    className="text-4xl md:text-6xl font-bold text-primary mb-6"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    Jelajahi Pulau Sumatera
                  </h1>
                  <div className="space-y-6 text-foreground/80 leading-relaxed mb-10">
                    <p className="text-lg">
                      Sumatera, pulau keenam terbesar di dunia, adalah rumah
                      bagi sejarah yang megah dan budaya yang kaya. Dari
                      kejayaan Kerajaan Srivijaya yang menguasai jalur
                      perdagangan laut, hingga keunikan adat Minangkabau.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-accent/20">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-accent-gold">
                          <Maximize2 size={16} />
                          <span className="text-[10px] uppercase font-black tracking-widest leading-none">
                            Luas
                          </span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          473k{" "}
                          <span className="text-xs font-normal opacity-60">
                            km²
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-accent-gold">
                          <Users size={16} />
                          <span className="text-[10px] uppercase font-black tracking-widest leading-none">
                            Warga
                          </span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          62.5M{" "}
                          <span className="text-xs font-normal opacity-60">
                            Jiwa
                          </span>
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-accent-gold">
                          <TrendingUp size={16} />
                          <span className="text-[10px] uppercase font-black tracking-widest leading-none">
                            Tinggi
                          </span>
                        </div>
                        <span className="text-xl font-bold text-primary">
                          3.805{" "}
                          <span className="text-xs font-normal opacity-60">
                            mdpl
                          </span>
                        </span>
                      </div>
                    </div>

                    <p className="opacity-70 text-sm">
                      Dikenal dengan julukan{" "}
                      <span className="text-accent-gold font-bold italic">
                        Swarnadwipa
                      </span>{" "}
                      atau "Pulau Emas". Kekayaan rempahnya telah menjadikannya
                      pusat perhatian dunia selama berabad-abad.
                    </p>
                  </div>

                  <button
                    onClick={() => setStep(1)}
                    className="w-full md:w-max px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-secondary transition-all transform hover:scale-105 shadow-[0_12px_24px_rgba(30,58,138,0.3)] flex items-center justify-center gap-3 group"
                  >
                    Mulai Petualangan
                    <ArrowRight
                      size={22}
                      className="group-hover:translate-x-2 transition-transform"
                    />
                  </button>
                </div>

                {/* Island Section (Right) */}
                <div className="md:w-2/5 bg-linear-to-br from-primary/10 to-accent-gold/5 flex items-center justify-center p-8 md:p-12 relative overflow-hidden order-1 md:order-2 border-b md:border-b-0 md:border-l border-accent/20">
                  {/* Decorative elements */}

                  <motion.div
                    animate={{
                      y: [0, -20, 0],
                      rotateZ: [0, 1.5, 0],
                      scale: [1, 1.02, 1],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    style={{
                      filter: "drop-shadow(0 20px 30px rgba(30,58,138,0.2))",
                    }}
                    className="relative z-10 w-full max-w-[320px] md:max-w-none"
                  >
                    <Image
                      src="/pulau/sumatera.svg"
                      alt="Peta Sumatera"
                      width={500}
                      height={500}
                      className="w-full h-auto drop-shadow-2xl"
                    />

                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-accent/10 whitespace-nowrap">
                      <span className="text-primary font-black text-xs uppercase tracking-[0.4em] ml-[0.4em]">
                        SWARNADWIPA
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {/* Header */}
            <div className="absolute top-24 md:top-32 w-full text-center pointer-events-none z-20">
              <h1 className="text-3xl md:text-6xl font-extrabold text-primary tracking-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                Belajar Budaya Sumatera
              </h1>
              <div className="flex items-center justify-center gap-3 mt-3">
                <div className="h-[2px] w-12 bg-linear-to-r from-transparent via-accent to-transparent opacity-50"></div>
                <p className="text-accent text-sm md:text-base tracking-[0.3em] uppercase font-semibold opacity-70">
                  Pilih Permainan
                </p>
                <div className="h-[2px] w-12 bg-linear-to-r from-transparent via-accent to-transparent opacity-50"></div>
              </div>
            </div>

            {/* Selection Text Overlay */}
            <div className="absolute inset-0 pointer-events-none z-10">
              {(hoveredGame === "game1" ||
                (isMobile && activeGameIndex === 0)) && (
                <div className="absolute left-1/2 -translate-x-1/2 top-auto bottom-52 md:left-[35%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto max-w-md transition-all duration-500 ease-out mb-22">
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-xl space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-primary uppercase text-center md:text-left">
                      Pembangun Rumah Gadang
                    </h2>
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed text-center md:text-left">
                      Susun elemen-elemen ikonik Rumah Gadang dan pelajari
                      arsitektur megah Minangkabau.
                    </p>
                  </div>
                </div>
              )}

              {(hoveredGame === "game2" ||
                (isMobile && activeGameIndex === 1)) && (
                <div className="absolute left-1/2 -translate-x-1/2 top-auto bottom-52 md:left-[85%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto max-w-md transition-all duration-500 ease-out mb-22">
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-xl space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-primary uppercase text-center md:text-left">
                      Dapur Tradisi Rendang
                    </h2>
                    <p className="text-sm md:text-base text-foreground/80 leading-relaxed text-center md:text-left">
                      Pelajari bahan-bahan serta filosofi di balik makanan
                      paling lezat di dunia.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden absolute bottom-8 w-full flex flex-col items-center gap-5 z-20">
              <div className="flex gap-3 mb-1">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeGameIndex === 0 ? "w-8 bg-primary" : "w-2.5 bg-primary/30"}`}
                />
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeGameIndex === 1 ? "w-8 bg-primary" : "w-2.5 bg-primary/30"}`}
                />
              </div>
              <button
                onClick={handlePlay}
                className="bg-primary text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all"
              >
                MAIN SEKARANG
              </button>
            </div>

            {/* Back Button */}
            <div className="absolute top-6 left-6 z-20">
              <button
                onClick={() => setStep(0)}
                className="bg-white/40 hover:bg-white/60 backdrop-blur-md p-3 rounded-full transition-all shadow-md border border-white/50"
              >
                <ArrowRight size={24} className="rotate-180" />
              </button>
            </div>

            {/* Hint */}
            <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
              <p className="text-accent text-sm opacity-50 tracking-wide text-center animate-pulse">
                Arahkan kursor ke model untuk melihat detail
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Development Pop-up Modal */}
      <AnimatePresence>
        {showDevModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDevModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-accent/20 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4">
                <button
                  onClick={() => setShowDevModal(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors"
                >
                  <X size={20} className="text-primary" />
                </button>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-accent-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lock size={32} className="text-accent-gold" />
                </div>
                <h3 className="text-3xl font-cormorant font-bold text-primary mb-4">
                  Level 3 Masih dalam Development
                </h3>
                <p className="text-foreground/70 mb-8">
                  Sabar ya! Tim kami sedang mempersiapkan petualangan yang tidak
                  kalah seru untuk level ini. Tunggu update selanjutnya!
                </p>
                <button
                  onClick={() => setShowDevModal(false)}
                  className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-secondary transition-colors shadow-lg"
                >
                  Dimengerti
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Background Ornaments */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
