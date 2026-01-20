"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export default function RendangGame() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [instruction, setInstruction] = useState("Tarik <b>Santan</b> ke dalam kuali!");
  const [showStirLabel, setShowStirLabel] = useState(false);
  const [burnProgress, setBurnProgress] = useState(0);
  const [showDetails, setShowDetails] = useState(false);

  // Refs for "global" variables in the game scope
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const kualiRef = useRef<THREE.Mesh | null>(null);
  const kualiGroupRef = useRef<THREE.Group | null>(null);
  const spatulaRef = useRef<THREE.Group | null>(null);
  const bowlRef = useRef<THREE.Group | null>(null);
  const fireGroupRef = useRef<THREE.Group | null>(null);
  const mixMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const ingredientMeshesRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const originalPositionsRef = useRef<{ [key: string]: THREE.Vector3 }>({});
  const cookedMeatMeshesRef = useRef<THREE.Mesh[]>([]);
  const fireParticlesRef = useRef<THREE.Mesh[]>([]);
  const stepRef = useRef(0); // Mutable ref for logic access without re-renders
  const stirProgressRef = useRef(0);
  const burnProgressRef = useRef(0);
  const lastStirTimeRef = useRef(Date.now());
  const draggedObjectRef = useRef<THREE.Object3D | null>(null);
  const mouseRef = useRef(new THREE.Vector2());
  const raycasterRef = useRef(new THREE.Raycaster());
  const dragPlaneRef = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.5));
  const animIdRef = useRef<number | null>(null);
  const intervalIdsRef = useRef<NodeJS.Timeout[]>([]);

  const steps = ["santan", "rempah", "daging"];

  useEffect(() => {
    if (!mountRef.current) return;

    // INIT
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x4a321f);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ENVIRONMENT
    const tableGeo = new THREE.BoxGeometry(60, 2, 40);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x5d3a24, roughness: 0.6 });
    const counterTop = new THREE.Mesh(tableGeo, tableMat);
    counterTop.position.y = -2;
    counterTop.receiveShadow = true;
    scene.add(counterTop);

    const wallGeo = new THREE.PlaneGeometry(60, 30);
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x3d2b1f });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.z = -12;
    wall.position.y = 8;
    scene.add(wall);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff4e0, 1.0);
    mainLight.position.set(5, 10, 7);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const fireGroup = new THREE.Group();
    scene.add(fireGroup);
    fireGroupRef.current = fireGroup;
    createKitchenFire(fireGroup);

    // KUALI
    const kualiGroup = new THREE.Group();
    kualiGroupRef.current = kualiGroup;

    const wokGeo = new THREE.SphereGeometry(2, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2);
    const wokMat = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide, metalness: 0.7, roughness: 0.3 });
    const kuali = new THREE.Mesh(wokGeo, wokMat);
    kuali.position.y = 1;
    kualiRef.current = kuali;
    kualiGroup.add(kuali);

    const handleGeo = new THREE.TorusGeometry(0.35, 0.1, 16, 32, Math.PI);
    const hL = new THREE.Mesh(handleGeo, wokMat);
    hL.position.set(-1.9, 1.1, 0); hL.rotation.set(-Math.PI / 2, 0, Math.PI / 2);
    kualiGroup.add(hL);
    const hR = hL.clone();
    hR.position.set(1.9, 1.1, 0); hR.rotation.set(-Math.PI / 2, 0, -Math.PI / 2);
    kualiGroup.add(hR);
    scene.add(kualiGroup);

    // MIX TEXTURE
    const mixGeo = new THREE.CircleGeometry(1.85, 32);
    const mixMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0, roughness: 0.9 });
    mixMaterialRef.current = mixMaterial;
    const mix = new THREE.Mesh(mixGeo, mixMaterial);
    mix.rotation.x = -Math.PI / 2;
    mix.position.y = 0.45;
    kualiGroup.add(mix);

    // SPATULA
    const spatGroup = new THREE.Group();
    const spatHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), new THREE.MeshStandardMaterial({ color: 0x4d3b2f }));
    spatHandle.position.y = 2;
    spatGroup.add(spatHandle);
    const spatHead = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.05), new THREE.MeshStandardMaterial({ color: 0x777777 }));
    spatHead.rotation.x = Math.PI / 4;
    spatGroup.add(spatHead);
    spatulaRef.current = spatGroup;
    spatGroup.visible = false;
    scene.add(spatGroup);

    createDecorativeBowl(scene);

    // INGREDIENTS - Responsive positioning
    const isMobile = window.innerWidth < 768;
    const loadIngredients = async () => {
      if (isMobile) {
        // Mobile: ingredients in front of pot, closer together
        await createDraggable(scene, "santan", 0xeeeeee, new THREE.Vector3(-2, 0, 4));
        await createDraggable(scene, "rempah", 0x8b4513, new THREE.Vector3(0, 0, 4.5));
        await createDraggable(scene, "daging", 0x7c3a23, new THREE.Vector3(2, 0, 4));
      } else {
        // Desktop: original spread out positions
        await createDraggable(scene, "santan", 0xeeeeee, new THREE.Vector3(-6, 0, 2));
        await createDraggable(scene, "rempah", 0x8b4513, new THREE.Vector3(-4, 0, 4));
        await createDraggable(scene, "daging", 0x7c3a23, new THREE.Vector3(6, 0, 2));
      }
    };
    loadIngredients();

    // ANIMATION LOOP
    const animate = () => {
      animIdRef.current = requestAnimationFrame(animate);

      // Fire
      fireParticlesRef.current.forEach((p) => {
        p.position.y += p.userData.speed;
        p.userData.life -= 0.025;
        p.scale.multiplyScalar(0.965);
        // @ts-ignore
        p.material.opacity = p.userData.life * 0.7;
        if (p.userData.life <= 0) {
          p.position.set((Math.random() - 0.5) * 1.8, -0.9, (Math.random() - 0.5) * 1.8);
          p.userData.life = 1.0;
          p.scale.set(1, 1, 1);
        }
      });

      // Kuali idle
      if (stepRef.current < 5 && kualiGroupRef.current) {
        kualiGroupRef.current.rotation.y = Math.sin(Date.now() * 0.0006) * 0.06;
      } else if (bowlRef.current && stepRef.current === 5) {
        bowlRef.current.rotation.y += 0.004;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animIdRef.current) cancelAnimationFrame(animIdRef.current);
      intervalIdsRef.current.forEach(clearInterval);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []); // Only run once on mount

  // HELPER FUNCTIONS
  const createKitchenFire = (group: THREE.Group) => {
    for (let i = 0; i < 25; i++) {
      const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + Math.random() * 0.2),
        new THREE.MeshBasicMaterial({ color: 0xff6600, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending })
      );
      p.position.set((Math.random() - 0.5) * 1.8, -0.9, (Math.random() - 0.5) * 1.8);
      p.userData = { speed: 0.03 + Math.random() * 0.05, life: 1.0 };
      group.add(p);
      fireParticlesRef.current.push(p);
    }
  };

  const createDecorativeBowl = (scene: THREE.Scene) => {
    const bGroup = new THREE.Group();
    const points = [];
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(0.9, 0.1));
    points.push(new THREE.Vector2(1.6, 0.8));
    points.push(new THREE.Vector2(1.9, 1.5));

    const bGeo = new THREE.LatheGeometry(points, 32);
    const bMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide, metalness: 0.05, roughness: 0.2 });
    const bMesh = new THREE.Mesh(bGeo, bMat);
    bGroup.add(bMesh);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.9, 0.2, 32), bMat);
    base.position.y = -0.1;
    bGroup.add(base);

    bowlRef.current = bGroup;
    bGroup.position.set(13, -0.8, -1);
    scene.add(bGroup);
  };

  const createDraggable = async (scene: THREE.Scene, type: string, color: number, pos: THREE.Vector3) => {
    let mesh: THREE.Mesh | THREE.Group;

    // Load GLB models for santan, rempah, and daging
    const loader = new GLTFLoader();
    const modelPath = `/model/${type}.glb`;

    try {
      const gltf = await new Promise<any>((resolve, reject) => {
        loader.load(modelPath, resolve, undefined, reject);
      });

      mesh = gltf.scene;
      mesh.scale.set(0.5, 0.5, 0.5);

      // Make all child meshes interactive
      mesh.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.userData.type = type;
        }
      });
    } catch (error) {
      console.error(`Failed to load ${type} model:`, error);
      // Fallback to geometry if model fails to load
      let geo;
      if (type === "santan") geo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
      else if (type === "rempah") geo = new THREE.DodecahedronGeometry(0.35);
      else geo = new THREE.BoxGeometry(0.8, 0.6, 0.8);
      mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: color, roughness: 0.5 }));
    }

    mesh.position.copy(pos);
    mesh.userData.type = type;
    scene.add(mesh);
    ingredientMeshesRef.current[type] = mesh as THREE.Mesh;
    originalPositionsRef.current[type] = pos.clone();
  };

  // INTERACTION HANDLERS
  const updateMousePos = (clientX: number, clientY: number) => {
    mouseRef.current.x = (clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(clientY / window.innerHeight) * 2 + 1;
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    updateMousePos(e.clientX, e.clientY);
    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current!);
    // Use recursive intersect to hit child meshes in GLB models
    const hits = raycasterRef.current.intersectObjects(Object.values(ingredientMeshesRef.current), true);

    // Check if the hit object matches the current step
    if (hits.length > 0) {
      const hitType = hits[0].object.userData.type;
      if (hitType === steps[stepRef.current]) {
        // Store the top-level parent (the ingredient group/mesh)
        const ingredient = Object.values(ingredientMeshesRef.current).find(obj =>
          obj === hits[0].object || obj === hits[0].object.parent ||
          (hits[0].object.parent && obj === hits[0].object.parent.parent)
        );
        if (ingredient) draggedObjectRef.current = ingredient;
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    updateMousePos(e.clientX, e.clientY);

    // Dragging Logic
    if (draggedObjectRef.current && cameraRef.current) {
      raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);
      const p = new THREE.Vector3();
      raycasterRef.current.ray.intersectPlane(dragPlaneRef.current, p);
      draggedObjectRef.current.position.copy(p);
    }

    // Stirring Logic
    if (stepRef.current === 3 && spatulaRef.current) {
      spatulaRef.current.position.set(mouseRef.current.x * 5, 0.7 + Math.sin(Date.now() * 0.01) * 0.2, -mouseRef.current.y * 5);
      spatulaRef.current.rotation.y += 0.2;

      // If mouse is near center, increase progress and reset burn timer
      if (Math.abs(mouseRef.current.x) < 0.6 && Math.abs(mouseRef.current.y) < 0.6) {
        stirProgressRef.current += 0.5;
        if (stirProgressRef.current > 100) stirProgressRef.current = 100;
        lastStirTimeRef.current = Date.now();
        burnProgressRef.current = 0;
        updateStirVisuals();
      }
    }
  };

  const handlePointerUp = () => {
    if (!draggedObjectRef.current) return;

    if (draggedObjectRef.current.position.distanceTo(new THREE.Vector3(0, 0, 0)) < 2.5) {
      addIngredientToPot(draggedObjectRef.current.userData.type);
    } else {
      draggedObjectRef.current.position.copy(originalPositionsRef.current[draggedObjectRef.current.userData.type]);
    }
    draggedObjectRef.current = null;
  };

  const addIngredientToPot = (type: string) => {
    const m = ingredientMeshesRef.current[type];
    const mixMat = mixMaterialRef.current;

    if (type === "santan") {
      if (mixMat) { mixMat.opacity = 0.8; mixMat.color.set(0xffffff); }
      sceneRef.current?.remove(m);
    } else if (type === "rempah") {
      if (mixMat) mixMat.color.lerp(new THREE.Color(0xd2b48c), 0.5);
      sceneRef.current?.remove(m);
    } else if (type === "daging") {
      m.position.set(0, 0.4, 0);
      m.scale.set(0.6, 0.6, 0.6);

      // Set initial brown color for meat (override the red/pink from model)
      m.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material) {
          const mat = Array.isArray(child.material) ? child.material[0] : child.material;
          if (mat && 'color' in mat) {
            (mat as any).color.set(0x8B4513); // Saddle brown color
          }
        }
      });

      kualiRef.current?.parent?.add(m);
      cookedMeatMeshesRef.current.push(m);
      // add variations
      for (let i = 0; i < 4; i++) {
        const c = m.clone();
        c.position.set((Math.random() - 0.5) * 1.8, 0.4, (Math.random() - 0.5) * 1.8);
        c.rotation.set(Math.random(), Math.random(), Math.random());

        // Set brown color for clones too
        c.traverse((child) => {
          if (child instanceof THREE.Mesh && child.material) {
            const mat = Array.isArray(child.material) ? child.material[0] : child.material;
            if (mat && 'color' in mat) {
              (mat as any).color.set(0x8B4513);
            }
          }
        });

        kualiRef.current?.parent?.add(c);
        cookedMeatMeshesRef.current.push(c);
      }
    }

    delete ingredientMeshesRef.current[type];

    // Update State for UI
    const nextStepIndex = stepRef.current + 1;
    stepRef.current = nextStepIndex;
    setCurrentStep(nextStepIndex);

    if (nextStepIndex < 3) {
      const next = steps[nextStepIndex];
      setInstruction(`Lanjut! Masukkan <b>${next.charAt(0).toUpperCase() + next.slice(1)}</b>.`);
    } else {
      setInstruction("Bagus! Sekarang <b>ADUK</b> sampai asat!");
      setShowProgressBar(true);
      setShowStirLabel(true);
      if (spatulaRef.current) spatulaRef.current.visible = true;
    }

    burstSteam(8);
  };

  const updateStirVisuals = () => {
    const prog = stirProgressRef.current;
    setProgressWidth(prog);

    // Check for burning
    const timeSinceLastStir = Date.now() - lastStirTimeRef.current;
    if (timeSinceLastStir > 2000) {
      burnProgressRef.current += 1;
      setBurnProgress(burnProgressRef.current);

      if (burnProgressRef.current >= 100) {
        handleBurnedFood();
        return;
      }
    } else {
      // Reset burn if stirring
      if (burnProgressRef.current > 0) {
        burnProgressRef.current = Math.max(0, burnProgressRef.current - 2);
        setBurnProgress(burnProgressRef.current);
      }
    }

    // Darken the mixture
    if (mixMaterialRef.current) {
      mixMaterialRef.current.color.lerp(new THREE.Color(0x321605), 0.02);
    }

    // Darken meat pieces progressively as cooking progresses
    cookedMeatMeshesRef.current.forEach((m) => {
      if (m instanceof THREE.Mesh && m.material) {
        const mat = Array.isArray(m.material) ? m.material[0] : m.material;
        if (mat && 'color' in mat && mat.color instanceof THREE.Color) {
          // Darken more based on progress
          const targetColor = new THREE.Color(0x1a0800); // Very dark brown
          (mat.color as THREE.Color).lerp(targetColor, 0.03);
        }
      }
      // Animate position
      m.position.y = 0.4 + Math.sin(Date.now() * 0.015 + m.id) * 0.06;
    });

    if (Math.random() < 0.15) burstSteam(1);
    if (prog >= 100 && stepRef.current === 3) {
      startPouringAnimation();
    }
  };

  const burstSteam = (n: number) => {
    for (let i = 0; i < n; i++) {
      const s = new THREE.Mesh(
        new THREE.SphereGeometry(0.1 + Math.random() * 0.15),
        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })
      );
      s.position.set((Math.random() - 0.5) * 3.5, 1.2, (Math.random() - 0.5) * 3.5);
      sceneRef.current?.add(s);

      let l = 0;
      const id = setInterval(() => {
        s.position.y += 0.08;
        s.scale.multiplyScalar(1.03);
        // @ts-ignore
        s.material.opacity -= 0.01;
        if (++l > 30) {
          clearInterval(id);
          sceneRef.current?.remove(s);
        }
      }, 30);
      intervalIdsRef.current.push(id); // track to clear on unmount
    }
  };

  const startPouringAnimation = () => {
    stepRef.current = 5; // Prevent re-trigger
    setCurrentStep(5); // UI update
    if (spatulaRef.current) spatulaRef.current.visible = false;

    let p = 0;
    const anim = setInterval(() => {
      if (!kualiGroupRef.current) return;
      p += 0.012;

      if (p < 0.4) {
        kualiGroupRef.current.position.x += 0.32;
        kualiGroupRef.current.position.y += 0.08;
      } else if (p < 0.75) {
        kualiGroupRef.current.rotation.z -= 0.05;
        if (Math.random() > 0.6) dropRendangParticle();
      } else if (p < 1.0) {
        kualiGroupRef.current.rotation.z += 0.05;
        kualiGroupRef.current.position.x -= 0.32;
        kualiGroupRef.current.position.y -= 0.08;
        if (p > 0.98) {
          kualiGroupRef.current.rotation.z = 0;
          kualiGroupRef.current.position.set(0, 0, 0);
        }
      }
      if (p >= 1.0) {
        clearInterval(anim);
        showFinalResult();
      }
    }, 20);
    intervalIdsRef.current.push(anim);
  };

  const dropRendangParticle = () => {
    if (!kualiGroupRef.current) return;
    const d = new THREE.Mesh(new THREE.SphereGeometry(0.18), new THREE.MeshBasicMaterial({ color: 0x321605 }));
    d.position.set(kualiGroupRef.current.position.x + 0.5, kualiGroupRef.current.position.y + 1, 0);
    sceneRef.current?.add(d);

    let l = 0;
    const a = setInterval(() => {
      d.position.y -= 0.18;
      d.position.x += 0.05;
      if (++l > 15) {
        clearInterval(a);
        sceneRef.current?.remove(d);
      }
    }, 20);
    intervalIdsRef.current.push(a);
  };

  const handleBurnedFood = () => {
    stepRef.current = 6; // Special state for burned
    setCurrentStep(6);
    if (spatulaRef.current) spatulaRef.current.visible = false;
    setInstruction("<b>OH NO!</b> Rendangnya gosong! Coba lagi.");
    setTimeout(() => {
      window.location.reload();
    }, 3000);
  };

  const showFinalResult = () => {
    // MOVE RENDANG TO BOWL
    const sMix = new THREE.Mesh(new THREE.CircleGeometry(1.6, 32), new THREE.MeshStandardMaterial({ color: 0x321605 }));
    sMix.rotation.x = -Math.PI / 2;
    sMix.position.y = 1.0;
    bowlRef.current?.add(sMix);

    cookedMeatMeshesRef.current.forEach((m) => {
      const mc = m.clone();
      mc.position.set((Math.random() - 0.5) * 1.2, 1.15, (Math.random() - 0.5) * 1.2);
      mc.scale.set(0.5, 0.5, 0.5);
      bowlRef.current?.add(mc);
      m.visible = false;
    });
    if (mixMaterialRef.current) mixMaterialRef.current.visible = false;

    // CAMERA ANIMATION
    const camTarget = new THREE.Vector3(13, 1, -1);
    const camPos = new THREE.Vector3(13, 5, 5);

    let p = 0;
    const camAnim = setInterval(() => {
      if (!cameraRef.current) return;
      p += 0.02;
      cameraRef.current.position.lerp(camPos, 0.12);
      cameraRef.current.lookAt(camTarget);
      if (p >= 1.2) {
        clearInterval(camAnim);
        setShowFinishModal(true);
      }
    }, 20);
    intervalIdsRef.current.push(camAnim);
  };

  const reloadGame = () => {
    window.location.reload();
  };

  const isCooking = stepRef.current >= 4;

  return (
    <div className="relative w-full h-screen bg-[#2c1a10] overflow-hidden font-sans touch-none">
      {/* 3D Container */}
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="w-full h-full relative z-0"
      />

      {/* UI Layer - Top on Mobile, Left on Desktop */}
      {!showFinishModal && currentStep < 5 && (
        <>
          {/* Mobile UI - Top */}
          <div className="md:hidden absolute top-0 left-0 right-0 pointer-events-none flex justify-center p-3 z-10">
            <div className="bg-orange-900/95 backdrop-blur-sm p-3 pointer-events-auto rounded-lg max-w-full">
              <h1 className="text-base font-bold mb-2 text-yellow-400 text-center">Dapur Tradisi Minang</h1>

              <div className="flex gap-2 mb-2 justify-center">
                {steps.map((s, idx) => (
                  <div
                    key={s}
                    className={`flex items-center gap-1 px-2 py-1 transition-all ${idx === currentStep ? "bg-yellow-500/20 border-2 border-yellow-500" :
                      idx < currentStep ? "opacity-50" : "opacity-30"
                      }`}
                  >
                    <span className="text-lg">
                      {s === 'santan' ? '🥥' : s === 'rempah' ? '🌿' : '🥩'}
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-white text-[10px] text-center" dangerouslySetInnerHTML={{ __html: instruction }} />

              {showProgressBar && (
                <>
                  <div className="w-full bg-orange-950 h-2 overflow-hidden mb-1 mt-2">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-100"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                  {burnProgress > 0 && (
                    <div className="w-full bg-red-950 h-1.5 overflow-hidden">
                      <div
                        className="h-full bg-red-600 transition-all duration-100"
                        style={{ width: `${burnProgress}%` }}
                      />
                    </div>
                  )}
                </>
              )}

              {showStirLabel && (
                <p className="mt-2 text-yellow-300 font-bold animate-pulse text-[9px] text-center">
                  Gunakan jari untuk mengaduk!
                </p>
              )}
            </div>
          </div>

          {/* Desktop UI - Left Side */}
          <div className="hidden md:flex absolute top-0 left-0 h-full pointer-events-none items-center p-6 z-10">
            <div className="bg-orange-900/90 backdrop-blur-sm p-6 pointer-events-auto max-w-xs">
              <h1 className="text-2xl font-bold mb-4 text-yellow-400">Dapur Tradisi Minang</h1>

              <div className="space-y-3 mb-4">
                {steps.map((s, idx) => (
                  <div
                    key={s}
                    className={`flex items-center gap-3 p-2 transition-all ${idx === currentStep ? "bg-yellow-500/20 border-l-4 border-yellow-500" :
                      idx < currentStep ? "opacity-50" : "opacity-30"
                      }`}
                  >
                    <span className="text-2xl">
                      {s === 'santan' ? '🥥' : s === 'rempah' ? '🌿' : '🥩'}
                    </span>
                    <span className="text-white font-medium capitalize">{s}</span>
                  </div>
                ))}
              </div>

              <p className="text-white text-sm mb-4" dangerouslySetInnerHTML={{ __html: instruction }} />

              {showProgressBar && (
                <>
                  <div className="w-full bg-orange-950 h-3 overflow-hidden mb-2">
                    <div
                      className="h-full bg-yellow-500 transition-all duration-100"
                      style={{ width: `${progressWidth}%` }}
                    />
                  </div>
                  {burnProgress > 0 && (
                    <div className="w-full bg-red-950 h-2 overflow-hidden">
                      <div
                        className="h-full bg-red-600 transition-all duration-100"
                        style={{ width: `${burnProgress}%` }}
                      />
                    </div>
                  )}
                </>
              )}

              {showStirLabel && (
                <p className="mt-4 text-yellow-300 font-bold animate-pulse text-xs">
                  Gunakan jari/mouse untuk mengaduk!
                </p>
              )}
            </div>
          </div>
        </>
      )}

      {/* Finish Modal - Collapsible Details */}
      {showFinishModal && (
        <div className="fixed inset-0 flex items-start justify-start z-50 bg-black/60 p-4 md:p-8 pb-24 md:pb-8">
          <div className="bg-orange-900 p-6 md:p-8 max-w-lg w-full text-white max-h-[calc(100vh-120px)] md:max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl md:text-4xl font-black mb-3 md:mb-4 text-yellow-400">SELESAI!</h2>
            <p className="text-lg md:text-xl mb-4 opacity-90">Rendang telah tersaji sempurna.</p>

            {/* Toggle Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full mb-4 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 font-bold py-2 px-4 transition-colors text-sm flex items-center justify-between"
              type="button"
            >
              <span>{showDetails ? 'Sembunyikan Detail' : 'Lihat Sejarah & Filosofi'}</span>
              <span>{showDetails ? '▲' : '▼'}</span>
            </button>

            {/* Collapsible Content */}
            {showDetails && (
              <div className="space-y-4 md:space-y-6 text-xs md:text-sm leading-relaxed opacity-90 text-left mb-4">
                <div>
                  <h3 className="text-base md:text-lg font-bold text-yellow-400 mb-2">Sejarah Rendang</h3>
                  <p>
                    Rendang berasal dari <b>Minangkabau</b>, Sumatera Barat.
                    Masakan ini lahir dari kebutuhan masyarakat Minang untuk membawa bekal
                    yang tahan lama saat merantau.
                  </p>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-bold text-yellow-400 mb-2">Filosofi 4 Unsur</h3>
                  <ul className="space-y-1.5 md:space-y-2 pl-4">
                    <li><b>• Daging:</b> Simbol niniak mamak (pemimpin adat)</li>
                    <li><b>• Santan:</b> Simbol cadiak pandai (kaum intelektual)</li>
                    <li><b>• Cabai:</b> Simbol alim ulama (pemuka agama)</li>
                    <li><b>• Bumbu rempah:</b> Simbol masyarakat Minang</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-bold text-yellow-400 mb-2">Pengakuan Dunia</h3>
                  <p>
                    Pada tahun 2011, CNN International memilih rendang sebagai
                    <b> makanan paling enak di dunia</b>.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-orange-950 font-bold py-3 md:py-4 px-6 transition-colors text-base md:text-lg"
              type="button"
            >
              Masak Lagi
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
