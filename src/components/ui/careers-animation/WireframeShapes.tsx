"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface WireframeShapesProps {
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

interface WireframeShape {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: number;
  targetScale: number;
  type: "tetrahedron" | "octahedron" | "icosahedron";
  rotationSpeed: THREE.Vector3;
  pulsePhase: number;
  opacity: number;
  targetOpacity: number;
}

// Design colors
const ORANGE = new THREE.Color("#ee6018");
const GRAY = new THREE.Color("#b8b3b0");

export function WireframeShapes({ mousePosition, isMobile }: WireframeShapesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<WireframeShape[]>([]);
  const meshRefs = useRef<(THREE.LineSegments | null)[]>([]);

  const shapeCount = isMobile ? 4 : 7;

  // Initialize shapes at the top of the canvas (where particles coalesce)
  useMemo(() => {
    shapesRef.current = [];
    const types: ("tetrahedron" | "octahedron" | "icosahedron")[] = [
      "tetrahedron",
      "octahedron",
      "icosahedron",
    ];

    for (let i = 0; i < shapeCount; i++) {
      // Position in upper region, offset to right on desktop (reduced height range)
      const xBase = isMobile ? (i - shapeCount / 2) * 1.5 : 1 + (i % 4) * 1.2;
      const yBase = isMobile ? 0.8 + Math.random() * 0.8 : 0.8 + (i % 3) * 0.4;

      shapesRef.current.push({
        position: new THREE.Vector3(
          xBase + (Math.random() - 0.5) * 0.5,
          yBase + (Math.random() - 0.5) * 0.5,
          (Math.random() - 0.5) * 1.5
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: 0,
        targetScale: 0.15 + Math.random() * 0.2,
        type: types[i % types.length],
        rotationSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3
        ),
        pulsePhase: Math.random() * Math.PI * 2,
        opacity: 0,
        targetOpacity: 0.8 + Math.random() * 0.2,
      });
    }
  }, [shapeCount, isMobile]);

  // Create wireframe geometries
  const geometries = useMemo(() => {
    return {
      tetrahedron: new THREE.EdgesGeometry(new THREE.TetrahedronGeometry(1)),
      octahedron: new THREE.EdgesGeometry(new THREE.OctahedronGeometry(1)),
      icosahedron: new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(1)),
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    const time = state.clock.elapsedTime;

    shapesRef.current.forEach((shape, i) => {
      const mesh = meshRefs.current[i];
      if (!mesh) return;

      // Gradually reveal shapes
      const revealTime = 2 + i * 0.3;
      if (time > revealTime) {
        shape.targetScale = 0.15 + Math.random() * 0.15;
        shape.targetOpacity = 0.5 + Math.random() * 0.3;
      }

      // Smooth scale transition
      shape.scale += (shape.targetScale - shape.scale) * delta * 2;
      shape.opacity += (shape.targetOpacity - shape.opacity) * delta * 2;

      // Mouse proximity effect
      if (mousePosition.active) {
        const dx = shape.position.x - mousePosition.x;
        const dy = shape.position.y - mousePosition.y;
        const distSq = dx * dx + dy * dy;
        const influenceRadius = 3;

        if (distSq < influenceRadius * influenceRadius) {
          const dist = Math.sqrt(distSq);
          const influence = 1 - dist / influenceRadius;

          // Shapes brighten and grow when mouse is near
          shape.targetScale = (0.15 + Math.random() * 0.15) * (1 + influence * 0.5);
          shape.targetOpacity = Math.min(1, shape.targetOpacity + influence * 0.3);

          // Faster rotation when activated
          shape.rotationSpeed.multiplyScalar(1 + influence * delta * 2);
        }
      }

      // Rotation
      shape.rotation.x += shape.rotationSpeed.x * delta;
      shape.rotation.y += shape.rotationSpeed.y * delta;
      shape.rotation.z += shape.rotationSpeed.z * delta;

      // Gentle float
      const floatY = Math.sin(time * 0.5 + shape.pulsePhase) * 0.1;
      const floatX = Math.cos(time * 0.3 + shape.pulsePhase) * 0.05;

      // Pulse scale
      const pulse = 1 + Math.sin(time * 2 + shape.pulsePhase) * 0.05;

      // Apply transforms
      mesh.position.copy(shape.position);
      mesh.position.y += floatY;
      mesh.position.x += floatX;
      mesh.rotation.copy(shape.rotation);
      mesh.scale.setScalar(shape.scale * pulse);

      // Update material opacity and color
      const material = mesh.material as THREE.LineBasicMaterial;
      material.opacity = shape.opacity;

      // Color based on position and time - more orange for higher shapes
      const heightFactor = (shape.position.y + 3) / 6;
      const colorMix = Math.min(1, heightFactor + Math.sin(time + i) * 0.1);
      material.color.copy(GRAY).lerp(ORANGE, colorMix * 0.7);
    });
  });

  return (
    <group ref={groupRef}>
      {shapesRef.current.map((shape, i) => (
        <lineSegments
          key={i}
          ref={(el) => {
            meshRefs.current[i] = el;
          }}
          geometry={geometries[shape.type]}
        >
          <lineBasicMaterial
            color={GRAY}
            transparent
            opacity={0}
            linewidth={1}
          />
        </lineSegments>
      ))}
    </group>
  );
}
