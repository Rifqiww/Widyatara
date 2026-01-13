
"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StiltsProps {
  balance: number; // -1 to 1
  leftFootPos: number; // 0 to 1 (height)
  rightFootPos: number; // 0 to 1 (height)
}

export default function Stilts({ balance, leftFootPos, rightFootPos }: StiltsProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // putar seluruh set egrang berdasarkan keseimbangan
      groupRef.current.rotation.z = balance * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Egrang Kiri */}
      <group position={[-0.4, 0, 0]}>
        <mesh position={[0, 1.5 + leftFootPos * 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
          <meshStandardMaterial color="#4D7C0F" />
        </mesh>
        {/* Pijakan Kaki */}
        <mesh position={[0, leftFootPos * 0.5 + 0.5, 0.1]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#7C2D12" />
        </mesh>
      </group>

      {/* Egrang Kanan */}
      <group position={[0.4, 0, 0]}>
        <mesh position={[0, 1.5 + rightFootPos * 0.5, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 4, 16]} />
          <meshStandardMaterial color="#4D7C0F" />
        </mesh>
        {/* Pijakan Kaki */}
        <mesh position={[0, rightFootPos * 0.5 + 0.5, 0.1]}>
          <boxGeometry args={[0.2, 0.1, 0.3]} />
          <meshStandardMaterial color="#7C2D12" />
        </mesh>
      </group>

      {/* Bayangan Karakter / Dasar */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="black" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
