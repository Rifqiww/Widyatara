"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTransitionContext } from "@/components/TransitionContext";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Maximize2, Users, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";

export default function PapuaSelectionPage() {
    const router = useRouter();
    const { triggerTransition } = useTransitionContext();
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
    const [textPositions, setTextPositions] = useState<{ [key: string]: { x: number, y: number } }>({
        'kayu-malele': { x: 0, y: 0 },
        'papeda': { x: 0, y: 0 }
    });

    // Hot reload effect - memastikan halaman selalu fresh
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('papua-page-reloaded');
        if (!hasReloaded) {
            sessionStorage.setItem('papua-page-reloaded', 'true');
            window.location.reload();
        }

        return () => {
            // Cleanup saat unmount
            sessionStorage.removeItem('papua-page-reloaded');
        };
    }, []);

    useEffect(() => {
        // Mobile check
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (!mountRef.current) return;

        // --- SETUP SCENE ---
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            50,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
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
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        loader.setDRACOLoader(dracoLoader);

        // Shadow Catcher
        const groundGeo = new THREE.PlaneGeometry(100, 100);
        const groundMat = new THREE.ShadowMaterial({ opacity: 0.2 });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -1;
        ground.receiveShadow = true;
        scene.add(ground);

        const loadModel = (path: string, id: string, name: string, pos: [number, number, number], scale: number) => {
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
                }
            );
        };

        // Increased spacing as requested previously
        // Y position set to -1 to avoid header overlap
        loadModel('/menu/KayuMalele.glb', 'kayu-malele', 'Kayu Malele', [-3.5, -1, 0], 2);
        loadModel('/menu/Papeda.glb', 'papeda', 'Papeda', [3.5, -1, 0], 1.5);

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
                const x = (pos.x * .5 + .5) * window.innerWidth;
                const y = (-(pos.y * .5) + .5) * window.innerHeight;
                newPositions[id] = { x, y };
            });
            setTextPositions(newPositions);
        };

        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);

            // Hover animation logic (Purely visual, independent of React state)
            const time = Date.now() * 0.005;
            Object.values(modelsRef.current).forEach(model => {
                const isHovered = model.userData.hovered;
                const baseScale = model.userData.originalScale;
                const targetScale = isHovered ? baseScale * 1.1 : baseScale;

                // Smooth scale
                model.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

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
            Object.values(modelsRef.current).forEach(m => {
                m.userData.hovered = (m.userData.id === hitdId);
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
                document.body.style.cursor = 'pointer';
                setHoveredGame(prev => prev === hitdId ? prev : hitdId); // Only update if different
            } else {
                document.body.style.cursor = 'default';
                setHoveredGame(prev => prev === null ? prev : null);
            }
        };

        const onClick = (event: MouseEvent) => {
            if (window.innerWidth < 768) return;

            // Check raycast directly for reliable click
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(Object.values(modelsRef.current), true);

            if (intersects.length > 0) {
                let obj = intersects[0].object;
                while (obj.parent && !obj.userData.id) obj = obj.parent;
                const target = obj.userData.id === 'kayu-malele' ? '/Papua/KayuMalele' : '/Papua/Papeda';

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

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mousedown', onClick);
        window.addEventListener('resize', onResize);

        // Initial text pos
        setTimeout(updateTextPositions, 1000); // Wait for load? Or call periodically

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mousedown', onClick);
            window.removeEventListener('resize', onResize);
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
            if (rendererRef.current) {
                rendererRef.current.dispose();
                if (mountRef.current) mountRef.current.removeChild(rendererRef.current.domElement);
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
        if (!modelsRef.current['kayu-malele']) return;

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
                ['kayu-malele', 'papeda'].forEach(id => {
                    const model = modelsRef.current[id];
                    if (model) {
                        const pos = model.position.clone();
                        // Position text ABOVE model head
                        pos.y = 2.5;

                        pos.project(cameraRef.current!);
                        const x = (pos.x * .5 + .5) * window.innerWidth;
                        const y = (-(pos.y * .5) + .5) * window.innerHeight;
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
    const handleTouchStart = (e: React.TouchEvent) => touchStartRef.current = e.touches[0].clientX;
    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartRef.current === null) return;
        const diff = touchStartRef.current - e.changedTouches[0].clientX;
        if (diff > 50 && activeGameIndex === 0) setActiveGameIndex(1);
        if (diff < -50 && activeGameIndex === 1) setActiveGameIndex(0);
        touchStartRef.current = null;
    };

    // Play Click - Show cloud transition then hard reload
    const handlePlay = () => {
        const target = activeGameIndex === 0 ? '/Papua/KayuMalele' : '/Papua/Papeda';
        triggerTransition(target);
        // Hard reload after transition animation (2.5s as per CloudTransition.tsx)
        setTimeout(() => {
            window.location.href = target;
        }, 2500);
    };

    return (
        <div
            className="relative w-screen min-h-screen overflow-x-hidden bg-[#FFF8E7] flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            <div className="flex-grow relative min-h-screen">
                {/* Three.js Canvas */}
                <div ref={mountRef} className="fixed inset-0 z-0" />

                {/* Subtle Vignette Overlay */}
                <div className="fixed inset-0 pointer-events-none z-[1]"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.1) 100%)'
                    }}
                />

                <AnimatePresence mode="wait">
                {step === 0 ? (
                    <div key="intro" className="relative md:absolute md:inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-[#FFF8E7]/40 backdrop-blur-[2px] min-h-screen md:min-h-0">
                        <motion.div
                            variants={containerVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="max-w-5xl w-full bg-white/95 backdrop-blur-xl rounded-[2rem] md:rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(61,40,23,0.3)] border border-[#8B5A2B]/30 flex flex-col md:flex-row relative my-8 md:my-0"
                        >
                            {/* Island Section (Now Top on Mobile) */}
                            <div className="md:w-2/5 bg-gradient-to-br from-[#8B5A2B]/10 to-[#3D2817]/5 flex items-center justify-center p-6 md:p-12 relative overflow-hidden order-1 md:order-2 border-b md:border-b-0 md:border-l border-[#8B5A2B]/20">
                                {/* Decorative elements */}
                                <div className="absolute -top-4 -right-4 md:top-0 md:right-0 p-4 md:p-8 opacity-20 rotate-12">
                                    <Image 
                                        src="/assets/Sulawesi/game1/Thinking.png" 
                                        alt="Mascot Ornament" 
                                        width={160} 
                                        height={160} 
                                        className="w-20 h-20 md:w-40 md:h-40 object-contain"
                                    />
                                </div>
                                
                                <motion.div
                                    animate={{ 
                                        y: [0, -10, 0],
                                        rotateZ: [0, 1, 0],
                                        scale: [1, 1.02, 1] 
                                    }}
                                    transition={{ 
                                        duration: 6, 
                                        repeat: Infinity, 
                                        ease: "easeInOut" 
                                    }}
                                    style={{
                                        filter: 'drop-shadow(0 15px 25px rgba(61,40,23,0.2))'
                                    }}
                                    className="relative z-10 w-full max-w-[240px] md:max-w-none"
                                >
                                    <Image
                                        src="/pulau/papua.svg"
                                        alt="Peta Papua"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto drop-shadow-2xl"
                                    />
                                    
                                    {/* Subtitle label for visual depth */}
                                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-3 py-1.5 rounded-full shadow-lg border border-[#8B5A2B]/10 whitespace-nowrap">
                                        <span className="text-[#3D2817] font-black text-[10px] md:text-xs uppercase tracking-[0.4em] ml-[0.4em]">TERRA PAPUA</span>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Content Section (Now Bottom on Mobile) */}
                            <div className="md:w-3/5 p-6 md:p-14 flex flex-col justify-center order-2 md:order-1">
                                <h1 className="text-3xl md:text-6xl font-bold text-[#3D2817] mb-4 md:mb-6 leading-tight md:leading-normal" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                                    Jelajahi Pulau Papua
                                </h1>
                                <div className="space-y-4 md:space-y-6 text-[#3D2817]/80 leading-relaxed mb-8 md:mb-10">
                                    <p className="text-base md:text-lg">
                                        Papua, tanah matahari terbit di ufuk timur Indonesia, adalah rumah bagi keragaman budaya yang luar biasa. 
                                        Dari pegunungan Jayawijaya yang bersalju hingga pesisir pantai yang kaya akan sumber daya alam.
                                    </p>
                                    
                                    <div className="grid grid-cols-3 gap-2 md:gap-4 py-4 md:py-6 border-y border-[#8B5A2B]/20">
                                        <div className="flex flex-col gap-0.5 md:gap-1">
                                            <div className="flex items-center gap-1.5 md:gap-2 text-[#8B5A2B]">
                                                <Maximize2 size={12} className="md:w-4 md:h-4" />
                                                <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest leading-none">Luas</span>
                                            </div>
                                            <span className="text-sm md:text-xl font-bold text-[#3D2817]">786k <span className="text-[10px] md:text-xs font-normal opacity-60">km²</span></span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 md:gap-1 border-x border-[#8B5A2B]/10 px-2 md:px-0">
                                            <div className="flex items-center gap-1.5 md:gap-2 text-[#8B5A2B]">
                                                <Users size={12} className="md:w-4 md:h-4" />
                                                <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest leading-none">Suku</span>
                                            </div>
                                            <span className="text-sm md:text-xl font-bold text-[#3D2817]">250+ <span className="text-[10px] md:text-xs font-normal opacity-60">Suku</span></span>
                                        </div>
                                        <div className="flex flex-col gap-0.5 md:gap-1">
                                            <div className="flex items-center gap-1.5 md:gap-2 text-[#8B5A2B]">
                                                <TrendingUp size={12} className="md:w-4 md:h-4" />
                                                <span className="text-[8px] md:text-[10px] uppercase font-black tracking-widest leading-none">Puncak</span>
                                            </div>
                                            <span className="text-sm md:text-xl font-bold text-[#3D2817]">4.884 <span className="text-[10px] md:text-xs font-normal opacity-60">mdpl</span></span>
                                        </div>
                                    </div>

                                    <p className="opacity-70 text-xs md:text-sm">
                                        Dikenal dengan burung Cendrawasih yang ikonik dan tradisi seni ukir Asmat yang mendunia. 
                                        Mari kita jelajahi kekayaan geografi melalui petualangan seru ini!
                                    </p>
                                </div>

                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full md:w-max px-8 md:px-10 py-4 md:py-5 bg-[#3D2817] text-[#FFF8E7] rounded-xl md:rounded-2xl font-black uppercase tracking-widest hover:bg-[#5A3E2B] transition-all transform hover:scale-105 shadow-[0_12px_24px_rgba(61,40,23,0.3)] flex items-center justify-center gap-3 group"
                                >
                                    Mulai
                                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform md:w-5 md:h-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <motion.div
                        key="selection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-10"
                    >
                        {/* Header - Minimalist */}
                        <div className="absolute top-24 md:top-32 w-full text-center pointer-events-none z-10">
                            <h1 className="text-3xl md:text-6xl font-extrabold text-[#3D2817] tracking-tight mb-2 
                                           drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]">
                                Belajar Budaya Papua
                            </h1>
                            <div className="flex items-center justify-center gap-3 mt-3">
                                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#8B5A2B] to-transparent opacity-50"></div>
                                <p className="text-[#8B5A2B] text-sm md:text-base tracking-[0.3em] uppercase font-semibold opacity-70">
                                    Pilih Permainan
                                </p>
                                <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-[#8B5A2B] to-transparent opacity-50"></div>
                            </div>
                        </div>

                        {/* Dynamic Text Labels - Side Panel */}
                        <div className="absolute inset-0 pointer-events-none z-10">
                            {/* Kayu Malele Label - Right of Left Model */}
                            {(hoveredGame === 'kayu-malele' || (isMobile && activeGameIndex === 0)) && (
                                <div
                                    className="absolute 
                                               left-1/2 -translate-x-1/2 top-auto bottom-50
                                               md:left-[35%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto
                                               max-w-md md:max-w-lg
                                               transition-all duration-500 ease-out animate-[slideInRight_0.4s_ease-out]"
                                >
                                    <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-xl space-y-2">
                                        <h2
                                            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                                            className="text-2xl md:text-3xl font-black text-[#3D2817] uppercase text-center md:text-left">
                                            Kayu Malele
                                        </h2>
                                        <p
                                            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                                            className="text-sm md:text-base text-[#5A3E2B] leading-relaxed text-center md:text-left">
                                            Permainan tradisional melempar dan menangkap kayu.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Papeda Label - Right of Right Model */}
                            {(hoveredGame === 'papeda' || (isMobile && activeGameIndex === 1)) && (
                                <div
                                    className="absolute
                                               left-1/2 -translate-x-1/2 top-auto bottom-50
                                               md:left-[85%] md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:bottom-auto
                                               max-w-md md:max-w-lg
                                               transition-all duration-500 ease-out animate-[slideInRight_0.4s_ease-out]"
                                >
                                    <div className="bg-white/95 backdrop-blur-sm px-5 py-4 rounded-2xl shadow-xl space-y-2">
                                        <h2
                                            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                                            className="text-2xl md:text-3xl font-black text-[#3D2817] uppercase text-center md:text-left">
                                            Papeda
                                        </h2>
                                        <p
                                            style={{ fontFamily: 'var(--font-plus-jakarta), sans-serif' }}
                                            className="text-sm md:text-base text-[#5A3E2B] leading-relaxed text-center md:text-left">
                                            Belajar membuat makanan khas Papua dari sagu.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mobile Swipe Indicators & Button - Enhanced */}
                        <div className="md:hidden absolute bottom-8 w-full flex flex-col items-center gap-5 z-20 pointer-events-auto">
                            {/* Swipe Dots */}
                            <div className="flex gap-3 mb-1">
                                <div className={`h-2.5 rounded-full transition-all duration-300 ${activeGameIndex === 0 ? 'w-8 bg-[#3D2817]' : 'w-2.5 bg-[#3D2817]/30'
                                    }`} />
                                <div className={`h-2.5 rounded-full transition-all duration-300 ${activeGameIndex === 1 ? 'w-8 bg-[#3D2817]' : 'w-2.5 bg-[#3D2817]/30'
                                    }`} />
                            </div>

                            {/* Play Button */}
                            <button
                                onClick={handlePlay}
                                className="relative bg-[#3D2817] text-[#FFF8E7] px-10 py-4 rounded-full 
                                         font-bold text-lg shadow-[0_8px_24px_rgba(61,40,23,0.3)]
                                         active:scale-95 transition-all duration-200
                                         before:absolute before:inset-0 before:rounded-full 
                                         before:bg-gradient-to-t before:from-black/20 before:to-transparent
                                         hover:shadow-[0_12px_32px_rgba(61,40,23,0.4)]"
                            >
                                <span className="relative z-10 tracking-wider">MAIN SEKARANG</span>
                            </button>

                            {/* Swipe Hint */}
                            <p className="text-[#8B5A2B] text-xs opacity-60 tracking-wide">
                                ← Geser untuk ganti game →
                            </p>
                        </div>

                        {/* Back Button - Minimalist */}
                        <div className="absolute top-6 left-6 z-20 pointer-events-auto">
                            <button
                                onClick={() => router.back()}
                                className="group relative bg-white/40 hover:bg-white/60 backdrop-blur-md 
                                         text-[#3D2817] p-3 rounded-full transition-all duration-300
                                         shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)]
                                         border border-white/50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 transition-transform duration-300 group-hover:-translate-x-1"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </button>
                        </div>

                        {/* Desktop Hover Hint */}
                        <div className="hidden md:block absolute bottom-8 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                            <p className="text-[#8B5A2B] text-sm opacity-50 tracking-wide text-center animate-pulse">
                                Arahkan kursor ke model untuk melihat detail
                            </p>
                        </div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setStep(0)}
                            className="absolute bottom-4 right-8 z-20 text-[#3D2817] hover:underline font-bold pointer-events-auto"
                        >
                            ← Kembali ke Penjelasan
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
            </div>
            
            <div className="relative z-50">
                <Footer />
            </div>
        </div >
    );
}