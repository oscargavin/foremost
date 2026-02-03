"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface FlowPath {
  points: THREE.Vector3[];
  offset: number;
}

interface FlowPathsProps {
  isMobile: boolean;
}

// Extended type for LineDashedMaterial with dashOffset
type DashedMaterial = THREE.LineDashedMaterial & { dashOffset: number };

export function FlowPaths({ isMobile }: FlowPathsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<DashedMaterial[]>([]);

  // Define flow paths between peaks
  const paths: FlowPath[] = useMemo(() => {
    const peakPositions = [
      new THREE.Vector3(3.5, 0.6, -1.5),
      new THREE.Vector3(4.8, 0.5, 0.5),
      new THREE.Vector3(3.2, 0.55, 1.8),
      new THREE.Vector3(1.5, 0.45, 0),
      new THREE.Vector3(-2.0, 0.35, -2.0),
      new THREE.Vector3(-3.5, 0.3, 1.5),
    ];

    // Create curved paths between peaks
    const createPath = (
      start: THREE.Vector3,
      end: THREE.Vector3,
      curveHeight: number = 0.3
    ): THREE.Vector3[] => {
      const points: THREE.Vector3[] = [];
      const segments = 20;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = start.x + (end.x - start.x) * t;
        const z = start.z + (end.z - start.z) * t;

        // Parabolic curve for y
        const baseY = start.y + (end.y - start.y) * t;
        const curveY = Math.sin(t * Math.PI) * curveHeight;

        points.push(new THREE.Vector3(x, baseY + curveY, z));
      }

      return points;
    };

    const pathDefinitions = isMobile
      ? [
          { from: 0, to: 1, curve: 0.2 },
          { from: 1, to: 2, curve: 0.15 },
          { from: 3, to: 0, curve: 0.25 },
        ]
      : [
          { from: 0, to: 1, curve: 0.2 },
          { from: 1, to: 2, curve: 0.15 },
          { from: 2, to: 3, curve: 0.2 },
          { from: 3, to: 0, curve: 0.25 },
          { from: 3, to: 4, curve: 0.3 },
          { from: 4, to: 5, curve: 0.2 },
        ];

    return pathDefinitions.map((def, i) => ({
      points: createPath(peakPositions[def.from], peakPositions[def.to], def.curve),
      offset: i * 0.3,
    }));
  }, [isMobile]);

  // Create geometries and materials
  const geometries = useMemo(() => {
    // Reset materials ref when paths change to prevent stale references
    materialsRef.current = [];
    return paths.map((path) => {
      const curve = new THREE.CatmullRomCurve3(path.points);
      const points = curve.getPoints(50);
      const geo = new THREE.BufferGeometry().setFromPoints(points);

      // Compute line distances for dashed material to work
      const lineDistances: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        lineDistances.push(lineDistances[i - 1] + points[i - 1].distanceTo(points[i]));
      }
      geo.setAttribute(
        "lineDistance",
        new THREE.Float32BufferAttribute(lineDistances, 1)
      );

      return geo;
    });
  }, [paths]);

  // Animate dash offset
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    materialsRef.current.forEach((mat, i) => {
      if (mat && paths[i]) {
        // Animated dash offset creates flowing effect
        mat.dashOffset = -time * 0.5 - paths[i].offset;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <line key={i}>
          <primitive object={geo} attach="geometry" />
          <lineDashedMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el as DashedMaterial;
            }}
            color="#ee6018"
            dashSize={0.15}
            gapSize={0.1}
            transparent
            opacity={0.5}
            linewidth={1}
          />
        </line>
      ))}
    </group>
  );
}

// Particle system that travels along flow paths
interface FlowParticle {
  pathIndex: number;
  progress: number;
  speed: number;
  size: number;
}

export function FlowParticles({ isMobile }: { isMobile: boolean }) {
  const particlesRef = useRef<FlowParticle[]>([]);
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const maxParticles = isMobile ? 8 : 15;

  // Peak positions for path calculations
  const peakPositions = useMemo(
    () => [
      new THREE.Vector3(3.5, 0.6, -1.5),
      new THREE.Vector3(4.8, 0.5, 0.5),
      new THREE.Vector3(3.2, 0.55, 1.8),
      new THREE.Vector3(1.5, 0.45, 0),
      new THREE.Vector3(-2.0, 0.35, -2.0),
      new THREE.Vector3(-3.5, 0.3, 1.5),
    ],
    []
  );

  const pathConnections = useMemo(
    () =>
      isMobile
        ? [
            [0, 1],
            [1, 2],
            [3, 0],
          ]
        : [
            [0, 1],
            [1, 2],
            [2, 3],
            [3, 0],
            [3, 4],
            [4, 5],
          ],
    [isMobile]
  );

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Spawn new particles
    if (particlesRef.current.length < maxParticles && Math.random() < 0.02) {
      particlesRef.current.push({
        pathIndex: Math.floor(Math.random() * pathConnections.length),
        progress: 0,
        speed: 0.15 + Math.random() * 0.1,
        size: 0.03 + Math.random() * 0.02,
      });
    }

    // Update and render particles
    let instanceIndex = 0;

    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const particle = particlesRef.current[i];
      particle.progress += particle.speed * delta;

      if (particle.progress >= 1) {
        particlesRef.current.splice(i, 1);
        continue;
      }

      // Interpolate position along path
      const conn = pathConnections[particle.pathIndex];
      const start = peakPositions[conn[0]];
      const end = peakPositions[conn[1]];

      const t = particle.progress;
      const x = start.x + (end.x - start.x) * t;
      const z = start.z + (end.z - start.z) * t;
      const baseY = start.y + (end.y - start.y) * t;
      const curveY = Math.sin(t * Math.PI) * 0.25;

      dummy.position.set(x, baseY + curveY, z);

      // Fade in/out based on progress
      const alpha = Math.sin(t * Math.PI);
      dummy.scale.setScalar(particle.size * alpha);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(instanceIndex, dummy.matrix);
      instanceIndex++;
    }

    // Hide unused instances
    for (let i = instanceIndex; i < maxParticles; i++) {
      dummy.position.set(0, -10, 0);
      dummy.scale.setScalar(0);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, maxParticles]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ee6018" transparent opacity={0.9} />
    </instancedMesh>
  );
}
