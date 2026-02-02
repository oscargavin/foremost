"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Peak {
  position: [number, number, number];
  baseY: number;
  phase: number;
}

interface PeakMarkersProps {
  isMobile: boolean;
}

export function PeakMarkers({ isMobile }: PeakMarkersProps) {
  const groupRef = useRef<THREE.Group>(null);

  // Peak positions - elevated points on the topology surface
  // Corresponds to where primary nodes were in the original design
  const peaks: Peak[] = useMemo(
    () => [
      { position: [3.5, 0.6, -1.5], baseY: 0.6, phase: 0 },
      { position: [4.8, 0.5, 0.5], baseY: 0.5, phase: Math.PI * 0.5 },
      { position: [3.2, 0.55, 1.8], baseY: 0.55, phase: Math.PI },
      { position: [1.5, 0.45, 0], baseY: 0.45, phase: Math.PI * 1.5 },
      // Additional subtle peaks
      { position: [-2.0, 0.35, -2.0], baseY: 0.35, phase: Math.PI * 0.25 },
      { position: [-3.5, 0.3, 1.5], baseY: 0.3, phase: Math.PI * 0.75 },
    ],
    []
  );

  // Reduce peaks on mobile
  const visiblePeaks = isMobile ? peaks.slice(0, 4) : peaks;

  useFrame((state) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      if (child instanceof THREE.Mesh && visiblePeaks[i]) {
        const peak = visiblePeaks[i];

        // Gentle floating animation
        child.position.y = peak.baseY + Math.sin(time * 0.5 + peak.phase) * 0.08;

        // Subtle scale breathing
        const breathe = 1 + Math.sin(time * 0.7 + peak.phase) * 0.1;
        child.scale.setScalar(breathe);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {visiblePeaks.map((peak, i) => (
        <mesh key={i} position={peak.position}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial
            color="#ee6018"
            emissive="#ee6018"
            emissiveIntensity={0.5}
            transparent
            opacity={0.85}
          />
        </mesh>
      ))}
    </group>
  );
}
