"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  Maximize2,
  Users,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import Footer from "@/components/Footer";

export default function PapuaSelectionPage() {
  const router = useRouter();
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredGame, setHoveredGame] = useState<string | null>(null);
  const [activeGameIndex, setActiveGameIndex] = useState(0); // 0: Kayu Malele, 1: Papeda
  const [isMobile, setIsMobile] = useState(false);
  const [step, setStep] = useState(0);

  const containerVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  // Refs for 3D state to avoid re-renders triggering useEffect re-init
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const modelsRef = useRef<{ [key: string]: THREE.Group }>({});
  const animationFrameRef = useRef<number | null>(null);

  // Text position refs
  const [textPositions, setTextPositions] = useState<{
    [key: string]: { x: number; y: number };
  }>({
    "kayu-malele": { x: 0, y: 0 },
    papeda: { x: 0, y: 0 },
  });

  // Hot reload effect - memastikan halaman selalu fresh
  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("papua-page-reloaded");
    if (!hasReloaded) {
      sessionStorage.setItem("papua-page-reloaded", "true");
      window.location.reload();
    }

    return () => {
      // Cleanup saat unmount
      sessionStorage.removeItem("papua-page-reloaded");
    };
  }, []);

  useEffect(() => {
    // Mobile check
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (!mountRef.current) return;

    // --- SETUP SCENE ---
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 2, 8);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // --- LIGHTS ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
    dirLight.position.set(5, 10, 7);
    dirLight.castShadow = true;
    scene.add(dirLight);

    // --- MODELS ---
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
    ) => {
      loader.load(
        path,
        (gltf) => {
          const model = gltf.scene;
          model.position.set(...pos);
          model.scale.set(scale, scale, scale);
          model.traverse((c) => {
            if (c instanceof THREE.Mesh) {
              c.castShadow = true;
              c.receiveShadow = true;
            }
          });
          model.userData = { id, name, originalScale: scale };
          scene.add(model);
          modelsRef.current[id] = model;

          console.log(`Model loaded: ${name}`, model.position);

          if (Object.keys(modelsRef.current).length === 2) {
            setLoading(false);
          }
        },
        undefined,
        (error) => {
          console.error(`Error loading ${name}:`, error);
          // Still set loading to false even if one model fails
          if (Object.keys(modelsRef.current).length >= 1) {
            setLoading(false);
          }
        },
      );
    };

    // Increased spacing as requested previously
    // Y position set to -1 to avoid header overlap
    loadModel(
      "/menu/KayuMalele.glb",
      "kayu-malele",
      "Kayu Malele",
      [-3.5, -1, 0],
      2,
    );
    loadModel("/menu/Papeda.glb", "papeda", "Papeda", [3.5, -1, 0], 1.5);

    // --- INTERACTION ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Helper to project 3D position to 2D screen
    const updateTextPositions = () => {
      const newPositions: any = {};

      Object.entries(modelsRef.current).forEach(([id, model]) => {
        const pos = model.position.clone();
        // Position text ABOVE model head
        pos.y = 2.5; // Above model head

        pos.project(camera);
        const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(pos.y * 0.5) + 0.5) * window.innerHeight;
        newPositions[id] = { x, y };
      });
      setTextPositions(newPositions);
    };

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Hover animation logic (Purely visual, independent of React state)
      const time = Date.now() * 0.005;
      Object.values(modelsRef.current).forEach((model) => {
        const isHovered = model.userData.hovered;
        const baseScale = model.userData.originalScale;
        const targetScale = isHovered ? baseScale * 1.1 : baseScale;

        // Smooth scale
        model.scale.lerp(
          new THREE.Vector3(targetScale, targetScale, targetScale),
          0.1,
        );

        // Bobbing only if hovered
        if (isHovered) {
          model.position.y = -1 + Math.sin(time) * 0.1;
          // model.rotation.y += 0.01; // User said NO SPINNING
        } else {
          model.position.y = THREE.MathUtils.lerp(model.position.y, -1, 0.1);
          model.rotation.set(0, 0, 0); // Reset rotation
        }
      });

      // Mobile Camera Logic
      if (window.innerWidth < 768) {
        // We need to read the current active index from a ref since we are in a closure with stale state?
        // Actually we can't access updated activeGameIndex here easily without ref or deps.
        // But since this is purely visual loop, let's keep it simple.
        // We will update camera position in a separate useEffect that reacts to [activeGameIndex].
      }

      renderer.render(scene, camera);
    };
    animate();

    // --- EVENT HANDLERS ---
    const onMouseMove = (event: MouseEvent) => {
      if (window.innerWidth < 768) return; // Desktop only hover

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const interactables = Object.values(modelsRef.current);
      const intersects = raycaster.intersectObjects(interactables, true);

      let hitdId: string | null = null;

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.id) obj = obj.parent;
        if (obj.userData.id) {
          hitdId = obj.userData.id;
        }
      }

      // Update model hover state
      Object.values(modelsRef.current).forEach((m) => {
        m.userData.hovered = m.userData.id === hitdId;
      });

      // Update React state only if changed to avoid renders
      // We use a local variable tracking or just check current state
      // But since we are inside event listener, we can't see current 'hoveredGame' easily without ref.
      // Let's just set it. React batched updates are efficient enough usually, BUT:
      // Re-rendering this component must NOT destroy the Canvas.
      // Since the canvas is in a ref and useEffect has [], it won't be destroyed.
      // THE BUG WAS: useEffect needed to depend on something that changed, causing re-run.
      // HERE: useEffect deps is [], so setHoveredGame will trigger Render, but NOT useEffect init.

      if (hitdId) {
        document.body.style.cursor = "pointer";
        setHoveredGame((prev) => (prev === hitdId ? prev : hitdId)); // Only update if different
      } else {
        document.body.style.cursor = "default";
        setHoveredGame((prev) => (prev === null ? prev : null));
      }
    };

    const onClick = (event: MouseEvent) => {
      if (window.innerWidth < 768) return;

      // Check raycast directly for reliable click
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
          obj.userData.id === "kayu-malele" ? "/Papua/game1" : "/Papua/game2";

        // CLEANUP before navigating? Next.js should handle component unmount.
        // BUT explicit dispose helps.
        router.push(target);
      }
    };

    const onResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;
      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      updateTextPositions(); // Update text on resize
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onClick);
    window.addEventListener("resize", onResize);

    // Initial text pos
    setTimeout(updateTextPositions, 1000); // Wait for load? Or call periodically

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onClick);
      window.removeEventListener("resize", onResize);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (mountRef.current)
          mountRef.current.removeChild(rendererRef.current.domElement);
      }
      // Dispose geometries/materials?
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          if (o.material instanceof THREE.Material) o.material.dispose();
        }
      });
    };
  }, []); // Empty deps = run once!

  // Separate effect for Mobile Camera and Text Position Updates
  useEffect(() => {
    // Update text positions more frequently to ensure they align
    if (!modelsRef.current["kayu-malele"]) return;

    const updateCam = () => {
      if (!cameraRef.current) return;
      if (window.innerWidth < 768) {
        const targetX = activeGameIndex === 0 ? -3.5 : 3.5;
        const targetPos = new THREE.Vector3(targetX, 0, 7);
        cameraRef.current.position.lerp(targetPos, 0.1);
        cameraRef.current.lookAt(targetX, 0, 0);
      } else {
        // Reset for desktop
        cameraRef.current.position.lerp(new THREE.Vector3(0, 2, 8), 0.1);
        cameraRef.current.lookAt(0, 0, 0);
      }
    };

    const loop = setInterval(() => {
      updateCam();
      // We can also calculate text positions here for the overlay
      const newPositions: any = {};
      if (cameraRef.current && rendererRef.current) {
        ["kayu-malele", "papeda"].forEach((id) => {
          const model = modelsRef.current[id];
          if (model) {
            const pos = model.position.clone();
            // Position text ABOVE model head
            pos.y = 2.5;

            pos.project(cameraRef.current!);
            const x = (pos.x * 0.5 + 0.5) * window.innerWidth;
            const y = (-(pos.y * 0.5) + 0.5) * window.innerHeight;
            newPositions[id] = { x, y };
          }
        });
        setTextPositions(newPositions);
      }
    }, 16);
    return () => clearInterval(loop);
  }, [activeGameIndex]);

  // Swipe Handlers
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

  // Play Click - Show cloud transition then hard reload
  const handlePlay = () => {
    const target = activeGameIndex === 0 ? "/Papua/game1" : "/Papua/game2";
    window.location.href = target;
  };

  return (
    <div
      className="min-h-screen w-full bg-background flex flex-col md:flex-row items-center justify-center font-plus-jakarta relative overflow-x-hidden overflow-y-auto py-10 md:py-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Three.js Canvas Container (Always Mounted, same behavior as Kalimantan) */}
      <div
        ref={mountRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${step === 1 ? "z-10 opacity-100" : "z-[-1] opacity-0"}`}
      />

      <AnimatePresence mode="wait">
        {step === 0 ? (
          <>
            <motion.div
              key="intro"
              variants={containerVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="max-w-5xl w-[92%] md:w-full bg-white/95 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(61,40,23,0.25)] border border-accent/20 flex flex-col md:flex-row relative my-10 md:my-0"
            >
              {/* Content Section (Left) */}
              <div className="md:w-3/5 p-6 md:p-14 flex flex-col justify-center order-2 md:order-1 pb-20 md:pb-14">
                <h1
                  className="text-3xl md:text-6xl font-bold text-(--color-primary) mb-4 md:mb-6"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  Jelajahi Pulau Papua
                </h1>

                <div className="space-y-4 md:space-y-6 text-(--color-foreground)/80 leading-relaxed mb-8 md:mb-10">
                  <p className="text-base md:text-lg">
                    Papua, tanah matahari terbit di ufuk timur Indonesia, adalah
                    rumah bagi keragaman budaya yang luar biasa. Dari pegunungan
                    Jayawijaya hingga pesisir pantai yang kaya sumber daya.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-y border-accent/20">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-accent-gold">
                        <Maximize2 size={16} />
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none">
                          Luas
                        </span>
                      </div>
                      <span className="text-xl font-bold text-(--color-primary)">
                        786k{" "}
                        <span className="text-xs font-normal opacity-60">
                          km²
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-accent-gold">
                        <Users size={16} />
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none">
                          Suku
                        </span>
                      </div>
                      <span className="text-xl font-bold text-(--color-primary)">
                        250+{" "}
                        <span className="text-xs font-normal opacity-60">
                          Suku
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-accent-gold">
                        <TrendingUp size={16} />
                        <span className="text-[10px] uppercase font-black tracking-widest leading-none">
                          Puncak
                        </span>
                      </div>
                      <span className="text-xl font-bold text-(--color-primary)">
                        4.884{" "}
                        <span className="text-xs font-normal opacity-60">
                          mdpl
                        </span>
                      </span>
                    </div>
                  </div>

                  <p className="opacity-70 text-xs md:text-sm">
                    Dikenal dengan burung Cendrawasih yang ikonik dan tradisi
                    seni ukir Asmat yang mendunia. Mari jelajahi kekayaan Papua
                    melalui petualangan seru ini!
                  </p>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="w-full md:w-max px-8 md:px-10 py-4 md:py-5 bg-(--color-primary) text-white rounded-2xl font-black uppercase tracking-widest hover:bg-secondary transition-all transform hover:scale-105 shadow-[0_12px_24px_rgba(61,40,23,0.25)] flex items-center justify-center gap-3 group mb-4 md:mb-0"
                >
                  Mulai Petualangan
                  <ArrowRight
                    size={22}
                    className="group-hover:translate-x-2 transition-transform"
                  />
                </button>
              </div>

              {/* Island Section (Right) */}
              <div className="md:w-2/5 bg-linear-to-br from-(--color-primary)/10 to-accent-gold/5 flex items-center justify-center p-6 md:p-12 relative overflow-hidden order-1 md:order-2 border-b md:border-b-0 md:border-l border-accent/20">
                <motion.div
                  style={{
                    filter: "drop-shadow(0 20px 30px rgba(61,40,23,0.2))",
                  }}
                  className="relative z-10 w-full max-w-[240px] md:max-w-none py-6 md:py-0"
                >
                  <Image
                    src="/pulau/papua.svg"
                    alt="Peta Papua"
                    width={500}
                    height={500}
                    className="w-full h-auto drop-shadow-2xl"
                  />
                  <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-accent/10 whitespace-nowrap">
                    <span className="text-(--color-primary) font-black text-[10px] md:text-xs uppercase tracking-[0.4em] ml-[0.4em]">
                      TERRA PAPUA
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        ) : (
          <motion.div
            key="selection"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10"
          >
            {/* Header (same layout as Kalimantan) */}
            <div className="absolute top-24 md:top-32 w-full text-center pointer-events-none z-20">
              <h1 className="text-3xl md:text-6xl font-extrabold text-(--color-primary) tracking-tight mb-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                Belajar Budaya Papua
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
              {(hoveredGame === "kayu-malele" ||
                (isMobile && activeGameIndex === 0)) && (
                <div className="absolute left-1/2 -translate-x-1/2 top-auto bottom-52 md:left-[35%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto max-w-md transition-all duration-500 ease-out mb-22">
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-xl space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-(--color-primary) uppercase text-center md:text-left">
                      Kayu Malele
                    </h2>
                    <p className="text-sm md:text-base text-(--color-foreground)/80 leading-relaxed text-center md:text-left">
                      Permainan tradisional melempar dan menangkap kayu.
                    </p>
                  </div>
                </div>
              )}

              {(hoveredGame === "papeda" ||
                (isMobile && activeGameIndex === 1)) && (
                <div className="absolute left-1/2 -translate-x-1/2 top-auto bottom-52 md:left-[85%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto max-w-md transition-all duration-500 ease-out mb-22">
                  <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-xl space-y-2">
                    <h2 className="text-2xl md:text-3xl font-black text-(--color-primary) uppercase text-center md:text-left">
                      Papeda
                    </h2>
                    <p className="text-sm md:text-base text-(--color-foreground)/80 leading-relaxed text-center md:text-left">
                      Belajar membuat makanan khas Papua dari sagu.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Controls */}
            <div className="md:hidden absolute bottom-8 w-full flex flex-col items-center gap-5 z-20">
              <div className="flex gap-3 mb-1">
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeGameIndex === 0 ? "w-8 bg-(--color-primary)" : "w-2.5 bg-(--color-primary)/30"}`}
                />
                <div
                  className={`h-2.5 rounded-full transition-all duration-300 ${activeGameIndex === 1 ? "w-8 bg-(--color-primary)" : "w-2.5 bg-(--color-primary)/30"}`}
                />
              </div>
              <button
                onClick={handlePlay}
                className="bg-(--color-primary) text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg active:scale-95 transition-all"
              >
                MAIN SEKARANG
              </button>
            </div>

            {/* Back Button (match Kalimantan pattern: back to step 0) */}
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

      {/* Background Ornaments (same as Kalimantan) */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent-gold/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
