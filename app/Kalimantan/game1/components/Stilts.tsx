
"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { EGRANG_COLORS } from "../constants";

interface StiltsProps {
  balance: number; // -1 to 1
  leftFootPos: number; // 0 to 1 (height)
  rightFootPos: number; // 0 to 1 (height)
}

export default function Stilts({ balance, leftFootPos, rightFootPos }: StiltsProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load the stilt model
  const { scene } = useGLTF("/Kalimantan/Egrang.glb");

  // Clone the scene and apply color
  const copiedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Mengubah warna menjadi hijau (bambu)
        child.material = child.material.clone();
        if (child.material instanceof THREE.MeshStandardMaterial) {
          child.material.color.set(EGRANG_COLORS.bamboo);
        }
      }
    });
    return clone;
  }, [scene]);

  useFrame(() => {
    if (groupRef.current) {
      // putar seluruh set egrang berdasarkan keseimbangan
      groupRef.current.rotation.z = balance * 0.5;
      
      // Menggerakkan bagian model berdasarkan input kaki
      copiedScene.traverse((child) => {
        if (child instanceof THREE.Mesh || child instanceof THREE.Group) {
          if (child.position.x < 0) {
            child.position.y = leftFootPos * 0.5;
          } else if (child.position.x > 0) {
            child.position.y = rightFootPos * 0.5;
          }
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <primitive 
        object={copiedScene} 
        scale={[1, 1.5, 1]} 
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]} 
      />

      {/* Sederhana: Bayangan Dasar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial color="black" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

useGLTF.preload("/Kalimantan/Egrang.glb");
