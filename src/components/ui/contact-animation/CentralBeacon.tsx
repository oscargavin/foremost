"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CentralBeaconProps {
  position: THREE.Vector3;
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Design system colors
const ORANGE = new THREE.Color("#ee6018");
const WARM_GRAY = new THREE.Color("#b8b3b0");

export function CentralBeacon({
  position,
  mousePosition,
  isMobile,
}: CentralBeaconProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);

  // Outer decorative rings around beacon
  const ringGeometries = useMemo(() => {
    const rings: THREE.RingGeometry[] = [];
    const ringCount = 3;

    for (let i = 0; i < ringCount; i++) {
      const innerRadius = 0.3 + i * 0.15;
      const outerRadius = innerRadius + 0.02;
      rings.push(new THREE.RingGeometry(innerRadius, outerRadius, 64));
    }

    return rings;
  }, []);

  // Cleanup geometries
  useMemo(() => {
    return () => {
      ringGeometries.forEach((geo) => geo.dispose());
    };
  }, [ringGeometries]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (coreRef.current) {
      // Gentle pulsing of the core
      const pulse = 1 + Math.sin(time * 2) * 0.1;
      coreRef.current.scale.setScalar(pulse);

      // Increase brightness when mouse is nearby (desktop only)
      if (!isMobile && mousePosition.active) {
        const dist = Math.sqrt(
          Math.pow(mousePosition.x - position.x, 2) +
            Math.pow(mousePosition.y - position.y, 2)
        );
        const proximity = Math.max(0, 1 - dist / 3);
        const material = coreRef.current.material as THREE.MeshBasicMaterial;
        material.color.copy(ORANGE).lerp(new THREE.Color("#ff8040"), proximity * 0.5);
      }
    }

    if (glowRef.current) {
      // Glow pulsing slightly out of phase
      const glowPulse = 1 + Math.sin(time * 2 + 0.5) * 0.15;
      glowRef.current.scale.setScalar(glowPulse);

      const material = glowRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.2 + Math.sin(time * 2) * 0.1;
    }

    if (ringsRef.current) {
      // Rotate outer rings slowly
      ringsRef.current.rotation.z = time * 0.2;

      ringsRef.current.children.forEach((ring, i) => {
        // Staggered rotation
        ring.rotation.z = time * (0.1 + i * 0.05) * (i % 2 === 0 ? 1 : -1);

        // Pulse ring opacity
        const mesh = ring as THREE.Mesh;
        const material = mesh.material as THREE.MeshBasicMaterial;
        material.opacity = 0.3 + Math.sin(time * 1.5 + i * 0.5) * 0.15;
      });
    }
  });

  return (
    <group position={position}>
      {/* Core beacon point */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshBasicMaterial color={ORANGE} />
      </mesh>

      {/* Glow around core */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshBasicMaterial
          color={ORANGE}
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>

      {/* Decorative outer rings */}
      <group ref={ringsRef}>
        {ringGeometries.map((geometry, i) => (
          <mesh key={i} geometry={geometry}>
            <meshBasicMaterial
              color={i === 0 ? ORANGE : WARM_GRAY}
              transparent
              opacity={0.3}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Small accent points around beacon */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i / 4) * Math.PI * 2;
        const radius = 0.7;
        return (
          <mesh
            key={`accent-${i}`}
            position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color={WARM_GRAY} transparent opacity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}
