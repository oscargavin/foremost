"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GrowthParticlesProps {
  seedPositions: THREE.Vector3[];
  isMobile: boolean;
}

interface Particle {
  seedIndex: number;
  startPosition: THREE.Vector3;
  direction: THREE.Vector3;
  speed: number;
  life: number;
  maxLife: number;
  size: number;
}

export function GrowthParticles({ seedPositions, isMobile }: GrowthParticlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const maxParticles = isMobile ? 20 : 40;

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Spawn new particles
    if (particlesRef.current.length < maxParticles && Math.random() < 0.08) {
      const seedIndex = Math.floor(Math.random() * seedPositions.length);
      const seed = seedPositions[seedIndex];

      // Random direction with upward bias
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.6; // Bias toward upper hemisphere

      const direction = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta) + 0.3, // Upward bias
        Math.cos(phi) * 0.5
      ).normalize();

      particlesRef.current.push({
        seedIndex,
        startPosition: seed.clone(),
        direction,
        speed: 0.3 + Math.random() * 0.4,
        life: 0,
        maxLife: 2 + Math.random() * 2,
        size: 0.02 + Math.random() * 0.03,
      });
    }

    // Update particles
    let instanceIndex = 0;

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];
      particle.life += delta;

      if (particle.life >= particle.maxLife) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      // Calculate position along trajectory
      const progress = particle.life / particle.maxLife;
      const distance = particle.speed * particle.life;

      // Position with slight spiral motion
      const spiralAngle = progress * Math.PI * 2;
      const spiralRadius = 0.1 * progress;

      const position = particle.startPosition
        .clone()
        .add(particle.direction.clone().multiplyScalar(distance))
        .add(
          new THREE.Vector3(
            Math.cos(spiralAngle) * spiralRadius,
            Math.sin(spiralAngle) * spiralRadius,
            0
          )
        );

      dummy.position.copy(position);

      // Fade in and out
      const fadeIn = Math.min(progress * 4, 1);
      const fadeOut = 1 - Math.pow(progress, 2);
      const alpha = fadeIn * fadeOut;

      // Pulse size
      const pulse = 1 + Math.sin(time * 8 + i) * 0.2;
      dummy.scale.setScalar(particle.size * alpha * pulse);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(instanceIndex, dummy.matrix);
      instanceIndex++;
    }

    // Hide unused instances
    for (let i = instanceIndex; i < maxParticles; i++) {
      dummy.position.set(0, -100, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxParticles]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ee6018" transparent opacity={0.8} />
    </instancedMesh>
  );
}
