"use client";

import React, { Suspense, useState, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, ContactShadows, Float } from "@react-three/drei";
import { motion, AnimatePresence, Variants } from "framer-motion";

// Model component to load and display the GLB
function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return (
    <primitive 
      object={scene} 
      scale={2.5} 
      position={[0, 0, 0]} 
      rotation={[0, 4.4, 0]}
    />
  );
}

interface HeroItemProps {
  title: string;
  modelUrl: string;
}

function HeroItem({ title, modelUrl }: HeroItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative h-[60vh] min-w-[280px] md:min-w-[300px] cursor-pointer overflow-hidden rounded-2xl transition-all duration-500 snap-center"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 3D Canvas Container */}
      <div className="absolute inset-0 z-0 bg-transparent">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_70%,rgba(175,143,111,0.15)_0%,rgba(248,244,225,0)_60%)]" />
        
        <Canvas camera={{ position: [0, 1, 4], near: 0.1, far: 1000, fov: 45 }}>
          <ambientLight intensity={1.5} />
          <hemisphereLight intensity={0.8} groundColor="#543310" />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
          <pointLight position={[-10, 10, -10]} intensity={1} />
          <Environment preset="city" />
          <Suspense fallback={null}>
            <Float 
              speed={isHovered ? 0.5 : 9} // Slight movement even when not hovered
              rotationIntensity={isHovered ? 0.2 : 0.1} 
              floatIntensity={isHovered ? 0.2 : 0.1}
            >
              <Model url={modelUrl} />
            </Float>
            <ContactShadows 
              opacity={0.6} 
              scale={12} 
              blur={2.8} 
              far={10} 
              resolution={512} 
              color="#543310"
              position={[0, -0.01, 0]}
            />
          </Suspense>
          {isHovered && <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={4} />}
        </Canvas>
      </div>

      {/* Border */}
      <div className={`absolute inset-0 border-2 transition-colors duration-500 rounded-2xl pointer-events-none ${isHovered ? 'border-[#543310]/30 shadow-2xl' : 'border-[#543310]/10 md:border-transparent'}`} />

      {/* Text */}
      <div className="absolute bottom-10 left-0 right-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
        {/* Mobile responsive */}
        <div className="flex md:hidden flex-col items-center">
          <div className="bg-[#543310]/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-[#AF8F6F]/30">
            <h3 className="text-[#F8F4E1] text-lg font-bold tracking-wider uppercase">
              {title}
            </h3>
          </div>
          <div className="h-1 w-16 bg-[#AF8F6F] mt-2 rounded-full" />
        </div>

        {/* sesktop hover animation */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="hidden md:flex flex-col items-center"
            >
              <div className="bg-[#543310]/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-[#AF8F6F]/30">
                <h3 className="text-[#F8F4E1] text-xl font-bold tracking-wider uppercase">
                  {title}
                </h3>
              </div>
              <motion.div 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                className="h-1 w-24 bg-[#AF8F6F] mt-2 rounded-full"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.05] md:opacity-[0.03]">
        <div className="w-64 h-64 border-2 border-[#543310] rounded-full flex items-center justify-center">
           <div className="w-56 h-56 border border-[#AF8F6F] rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}


// Preload models for the loading screen
useGLTF.preload("/TariTradisional.glb");
useGLTF.preload("/RumahTradisional.glb");
useGLTF.preload("/AlatMusikTradisional.glb");

export default function HeroPage() {
  const items = [
    {
      title: "Tari Tradisional",
      modelUrl: "/TariTradisional.glb",
    },
    {
      title: "Rumah Adat Tradisional",
      modelUrl: "/RumahTradisional.glb",
    },
    {
      title: "Alat Musik Tradisional",
      modelUrl: "/AlatMusikTradisional.glb",
    },
  ];

  // Animation Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const headerVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1, ease: "easeOut" }
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as any 
      }
    },
  };

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full min-h-screen bg-[#F8F4E1] flex flex-col items-center justify-center px-4 py-12 md:py-20 overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.05, scale: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center"
      >
        <div className="w-[150vw] h-[150vw] border border-[#AF8F6F]/20 rounded-full" />
      </motion.div>

      <motion.div 
        variants={headerVariants}
        className="text-center mb-10 md:mb-18 z-10 md:mt-8"
      >
        <h1 className="text-4xl md:text-7xl font-bold text-[#543310] mb-4">
          Widyatara
        </h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-xl text-[#74512D] max-w-2xl mx-auto italic font-serif px-4"
        >
          Menjelajahi Kekayaan Budaya Nusantara dalam Dimensi Berbeda
        </motion.p>
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "8rem" }}
          transition={{ delay: 1, duration: 1 }}
          className="h-1 bg-[#AF8F6F] mx-auto mt-6" 
        />
      </motion.div>

      <motion.div 
        variants={itemVariants}
        className="w-full max-w-7xl z-10 px-4"
      >
        <div className="flex flex-row overflow-x-auto pb-8 gap-6 md:gap-8 md:flex-wrap md:justify-center md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          {items.map((item, index) => (
            <motion.div 
              key={index} 
              variants={itemVariants}
              className="flex-none w-[85vw] md:w-auto md:flex-1 snap-center"
            >
              <HeroItem title={item.title} modelUrl={item.modelUrl} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-8 md:mt-12 text-[#543310] text-xs md:text-sm tracking-widest uppercase flex flex-col items-center gap-2"
      >
        <p className="md:hidden">Arahkan kursor untuk melihat detail</p>
        <p className="md:hidden flex items-center gap-2">
          <span>Geser untuk melihat lainnya</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </p>
      </motion.div>
    </motion.section>
  );
}
