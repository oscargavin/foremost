"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ConveyorPathsProps {
  isMobile: boolean;
}

// Extended type for LineDashedMaterial with dashOffset
type DashedMaterial = THREE.LineDashedMaterial & { dashOffset: number };

// Define path types
export interface PathDefinition {
  id: string;
  points: THREE.Vector3[];
  curve: THREE.CubicBezierCurve3 | THREE.QuadraticBezierCurve3;
  checkpoints: number[]; // Progress values (0-1) where checkpoints occur
  convergesTo?: string; // ID of path this merges into
  divergesFrom?: string; // ID of path this splits from
}

// Shared path definitions - exported for use by other components
export function createPaths(isMobile: boolean): PathDefinition[] {
  if (isMobile) {
    // Simplified paths for mobile - centered view
    return [
      {
        id: "main",
        points: [],
        curve: new THREE.CubicBezierCurve3(
          new THREE.Vector3(-3, 0.5, 0),
          new THREE.Vector3(-1, 1.2, 0),
          new THREE.Vector3(1, -0.8, 0),
          new THREE.Vector3(3, 0, 0)
        ),
        checkpoints: [0.35, 0.7],
      },
      {
        id: "secondary",
        points: [],
        curve: new THREE.CubicBezierCurve3(
          new THREE.Vector3(-3, -0.8, 0),
          new THREE.Vector3(-1, -1.5, 0),
          new THREE.Vector3(1, 0, 0),
          new THREE.Vector3(3, 0, 0)
        ),
        checkpoints: [0.4],
        convergesTo: "main",
      },
    ];
  }

  // Desktop: Multiple streams that merge and diverge - offset to the right
  return [
    // Main central path
    {
      id: "main",
      points: [],
      curve: new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2, 0.5, 0),
        new THREE.Vector3(1, 1.5, 0),
        new THREE.Vector3(4, -0.5, 0),
        new THREE.Vector3(7, 0, 0)
      ),
      checkpoints: [0.3, 0.65],
    },
    // Upper stream - diverges then converges
    {
      id: "upper",
      points: [],
      curve: new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2, 1.8, 0),
        new THREE.Vector3(0.5, 2.5, 0),
        new THREE.Vector3(3, 1.8, 0),
        new THREE.Vector3(5, 0.8, 0)
      ),
      checkpoints: [0.4],
      convergesTo: "main",
    },
    // Lower stream - joins the main flow
    {
      id: "lower",
      points: [],
      curve: new THREE.CubicBezierCurve3(
        new THREE.Vector3(-2, -1, 0),
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(2.5, -1.2, 0),
        new THREE.Vector3(4.5, -0.3, 0)
      ),
      checkpoints: [0.35, 0.7],
      convergesTo: "main",
    },
    // Output stream - diverges from main
    {
      id: "output",
      points: [],
      curve: new THREE.CubicBezierCurve3(
        new THREE.Vector3(5, 0.3, 0),
        new THREE.Vector3(5.8, 1, 0),
        new THREE.Vector3(6.5, 1.5, 0),
        new THREE.Vector3(8, 1.8, 0)
      ),
      checkpoints: [],
      divergesFrom: "main",
    },
  ];
}

export function ConveyorPaths({ isMobile }: ConveyorPathsProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialsRef = useRef<DashedMaterial[]>([]);

  const paths = useMemo(() => createPaths(isMobile), [isMobile]);

  // Create geometries for path visualization
  const geometries = useMemo(() => {
    return paths.map((path) => {
      const points = path.curve.getPoints(60);
      const geo = new THREE.BufferGeometry().setFromPoints(points);

      // Compute line distances for dashed material
      const lineDistances: number[] = [0];
      for (let i = 1; i < points.length; i++) {
        lineDistances.push(lineDistances[i - 1] + points[i - 1].distanceTo(points[i]));
      }
      geo.setAttribute("lineDistance", new THREE.Float32BufferAttribute(lineDistances, 1));

      return geo;
    });
  }, [paths]);

  // Animate dash offset for flowing effect
  useFrame((state) => {
    const time = state.clock.elapsedTime;

    materialsRef.current.forEach((mat, i) => {
      if (mat) {
        // Flowing animation - different speeds for visual interest
        const speed = 0.3 + (i * 0.05);
        mat.dashOffset = -time * speed;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <line key={paths[i].id}>
          <primitive object={geo} attach="geometry" />
          <lineDashedMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el as DashedMaterial;
            }}
            color="#b8b3b0"
            dashSize={0.2}
            gapSize={0.15}
            transparent
            opacity={0.6}
            linewidth={1}
          />
        </line>
      ))}

      {/* Secondary line for main path to add depth */}
      {!isMobile && (
        <line>
          <primitive
            object={new THREE.BufferGeometry().setFromPoints(paths[0].curve.getPoints(60))}
            attach="geometry"
          />
          <lineBasicMaterial color="#ee6018" transparent opacity={0.35} linewidth={1} />
        </line>
      )}
    </group>
  );
}
