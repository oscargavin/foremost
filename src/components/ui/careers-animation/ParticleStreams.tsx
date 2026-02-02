"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ParticleStreamsProps {
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Design colors
const ORANGE = new THREE.Color("#ee6018");
const GRAY = new THREE.Color("#b8b3b0");

/**
 * Vertical stream lines that particles follow
 * Creates visual flow paths from bottom to top
 */
export function ParticleStreams({ mousePosition, isMobile }: ParticleStreamsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<THREE.LineBasicMaterial[]>([]);

  // Stream configurations
  const streams = useMemo(() => {
    if (isMobile) {
      return [
        { x: -1.5, amplitude: 0.3, frequency: 0.8, phase: 0 },
        { x: 0, amplitude: 0.4, frequency: 0.6, phase: Math.PI / 3 },
        { x: 1.5, amplitude: 0.3, frequency: 0.7, phase: Math.PI / 2 },
      ];
    }
    return [
      { x: 1.2, amplitude: 0.25, frequency: 0.7, phase: 0 },
      { x: 2.2, amplitude: 0.35, frequency: 0.5, phase: Math.PI / 4 },
      { x: 3.2, amplitude: 0.3, frequency: 0.6, phase: Math.PI / 2 },
      { x: 4.2, amplitude: 0.25, frequency: 0.8, phase: Math.PI },
      { x: 5.0, amplitude: 0.2, frequency: 0.9, phase: Math.PI * 1.5 },
    ];
  }, [isMobile]);

  // Create line geometries
  const lineGeometries = useMemo(() => {
    return streams.map((stream) => {
      const points: THREE.Vector3[] = [];
      const segments = 50;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = -2 + t * 4; // From bottom to top (reduced 60%)
        const x = stream.x;
        const z = 0;
        points.push(new THREE.Vector3(x, y, z));
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      return geometry;
    });
  }, [streams]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    streams.forEach((stream, streamIndex) => {
      const geometry = lineGeometries[streamIndex];
      const material = materialsRef.current[streamIndex];
      if (!geometry || !material) return;

      const positions = geometry.attributes.position.array as Float32Array;
      const segments = positions.length / 3 - 1;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const y = -2 + t * 4;

        // Wave motion decreases toward top (more structured)
        const structureFactor = 1 - t * 0.7;
        const wave =
          Math.sin(time * stream.frequency + stream.phase + y * 0.5) *
          stream.amplitude *
          structureFactor;

        // Mouse influence on nearby streams
        let mouseWave = 0;
        if (mousePosition.active) {
          const dx = stream.x - mousePosition.x;
          const distX = Math.abs(dx);
          if (distX < 2) {
            const influence = 1 - distX / 2;
            // Create a bulge toward mouse
            const yDist = Math.abs(y - mousePosition.y);
            if (yDist < 3) {
              const yInfluence = 1 - yDist / 3;
              mouseWave = -dx * 0.3 * influence * yInfluence;
            }
          }
        }

        positions[i * 3] = stream.x + wave + mouseWave;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = Math.sin(time * 0.3 + stream.phase + y * 0.2) * 0.2 * structureFactor;
      }

      geometry.attributes.position.needsUpdate = true;

      // Update material based on mouse proximity
      let opacity = 0.4;

      if (mousePosition.active) {
        const dx = stream.x - mousePosition.x;
        const distX = Math.abs(dx);
        if (distX < 2) {
          const influence = 1 - distX / 2;
          opacity += influence * 0.2;
          material.color.copy(GRAY).lerp(ORANGE, influence * 0.5);
        } else {
          material.color.copy(GRAY);
        }
      } else {
        material.color.copy(GRAY);
      }

      material.opacity = opacity;
    });
  });

  return (
    <group ref={groupRef}>
      {lineGeometries.map((geometry, i) => (
        <line key={i}>
          <primitive object={geometry} attach="geometry" />
          <lineBasicMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el;
            }}
            color={GRAY}
            transparent
            opacity={0.4}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}
