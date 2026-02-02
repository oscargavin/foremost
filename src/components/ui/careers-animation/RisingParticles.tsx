"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface RisingParticlesProps {
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

interface Particle {
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  baseSpeed: number;
  size: number;
  progress: number; // 0 = bottom (diffuse), 1 = top (structured)
  streamIndex: number;
  wobblePhase: number;
  wobbleSpeed: number;
  isHighlight: boolean; // Orange vs gray particle
}

// Design colors
const ORANGE = "#ee6018";
const GRAY = "#b8b3b0";

export function RisingParticles({ mousePosition, isMobile }: RisingParticlesProps) {
  const grayMeshRef = useRef<THREE.InstancedMesh>(null);
  const orangeMeshRef = useRef<THREE.InstancedMesh>(null);
  const particlesRef = useRef<Particle[]>([]);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const maxParticles = isMobile ? 60 : 120;
  const maxGray = Math.floor(maxParticles * 0.6);
  const maxOrange = maxParticles - maxGray;
  const spawnRate = isMobile ? 0.04 : 0.06;

  // Stream positions - offset to the right for desktop
  const streamPositions = useMemo(() => {
    if (isMobile) {
      return [
        { x: -1.5, spread: 0.8 },
        { x: 0, spread: 1.0 },
        { x: 1.5, spread: 0.8 },
      ];
    }
    return [
      { x: 1.5, spread: 0.6 },
      { x: 3.0, spread: 0.8 },
      { x: 4.5, spread: 0.7 },
      { x: 2.2, spread: 0.5 },
    ];
  }, [isMobile]);

  useFrame((state, delta) => {
    if (!grayMeshRef.current || !orangeMeshRef.current) return;

    const time = state.clock.elapsedTime;

    // Count current particles by type
    const grayCount = particlesRef.current.filter((p) => !p.isHighlight).length;
    const orangeCount = particlesRef.current.filter((p) => p.isHighlight).length;

    // Spawn new particles
    if (particlesRef.current.length < maxParticles && Math.random() < spawnRate) {
      const streamIndex = Math.floor(Math.random() * streamPositions.length);
      const stream = streamPositions[streamIndex];

      // Random position within stream spread
      const x = stream.x + (Math.random() - 0.5) * stream.spread * 2;
      const y = -2 + Math.random() * 0.3; // Spawn at bottom (reduced range)

      // Determine if this should be an orange (highlight) particle
      // More likely to be orange as we have fewer orange particles
      const isHighlight =
        orangeCount < maxOrange && (grayCount >= maxGray || Math.random() < 0.35);

      particlesRef.current.push({
        position: new THREE.Vector3(x, y, (Math.random() - 0.5) * 2),
        velocity: new THREE.Vector3(0, 0.3 + Math.random() * 0.2, 0),
        baseSpeed: 0.3 + Math.random() * 0.3,
        size: isHighlight ? 0.025 + Math.random() * 0.035 : 0.02 + Math.random() * 0.025,
        progress: 0,
        streamIndex,
        wobblePhase: Math.random() * Math.PI * 2,
        wobbleSpeed: 1 + Math.random() * 2,
        isHighlight,
      });
    }

    let grayIndex = 0;
    let orangeIndex = 0;

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];

      // Calculate progress (0 at bottom, 1 at top)
      const yRange = 4; // Total vertical range (reduced 60%)
      const yMin = -2;
      particle.progress = Math.max(0, Math.min(1, (particle.position.y - yMin) / yRange));

      // Remove particles that have risen too high
      if (particle.position.y > 2.5) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      // Base upward velocity
      let speed = particle.baseSpeed;

      // Mouse updraft effect - accelerate particles near mouse
      if (mousePosition.active) {
        const dx = particle.position.x - mousePosition.x;
        const dy = particle.position.y - mousePosition.y;
        const distSq = dx * dx + dy * dy;
        const updraftRadius = 2.5;

        if (distSq < updraftRadius * updraftRadius) {
          const dist = Math.sqrt(distSq);
          const influence = 1 - dist / updraftRadius;
          // Strong upward boost near mouse
          speed += influence * 1.5;
          // Slight inward pull toward mouse column
          particle.velocity.x += -dx * influence * 0.3 * delta;
        }
      }

      // Apply velocity
      particle.velocity.y = speed;
      particle.position.add(particle.velocity.clone().multiplyScalar(delta));

      // Wobble decreases as particle rises (more structured at top)
      const wobbleStrength = 0.15 * (1 - particle.progress * 0.8);
      particle.position.x +=
        Math.sin(time * particle.wobbleSpeed + particle.wobblePhase) * wobbleStrength * delta;
      particle.position.z +=
        Math.cos(time * particle.wobbleSpeed * 0.7 + particle.wobblePhase) *
        wobbleStrength *
        delta;

      // Update transform
      dummy.position.copy(particle.position);

      // Size increases slightly as particle gains structure
      const structureScale = 1 + particle.progress * 0.5;
      const pulseScale = 1 + Math.sin(time * 3 + i) * 0.1 * (1 - particle.progress);
      dummy.scale.setScalar(particle.size * structureScale * pulseScale);

      dummy.updateMatrix();

      // Add to appropriate mesh
      if (particle.isHighlight) {
        orangeMeshRef.current.setMatrixAt(orangeIndex, dummy.matrix);
        orangeIndex++;
      } else {
        grayMeshRef.current.setMatrixAt(grayIndex, dummy.matrix);
        grayIndex++;
      }
    }

    // Hide unused instances
    dummy.position.set(0, -100, 0);
    dummy.scale.setScalar(0);
    dummy.updateMatrix();

    for (let i = grayIndex; i < maxGray; i++) {
      grayMeshRef.current.setMatrixAt(i, dummy.matrix);
    }
    for (let i = orangeIndex; i < maxOrange; i++) {
      orangeMeshRef.current.setMatrixAt(i, dummy.matrix);
    }

    grayMeshRef.current.instanceMatrix.needsUpdate = true;
    orangeMeshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <>
      {/* Gray base particles */}
      <instancedMesh ref={grayMeshRef} args={[undefined, undefined, maxGray]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={GRAY} transparent opacity={0.7} />
      </instancedMesh>

      {/* Orange highlight particles */}
      <instancedMesh ref={orangeMeshRef} args={[undefined, undefined, maxOrange]}>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color={ORANGE} transparent opacity={0.9} />
      </instancedMesh>
    </>
  );
}
