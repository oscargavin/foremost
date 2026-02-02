"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface SectorGridProps {
  mousePosition: { x: number; z: number; active: boolean };
  isMobile: boolean;
}

// Design system colors
const ORANGE = new THREE.Color("#ee6018");
const WARM_GRAY = new THREE.Color("#b8b3b0");
const DARK_GRAY = new THREE.Color("#1f1d1c");

// Grid configuration
const GRID_SIZE = 8; // 8x8 grid
const BLOCK_SPACING = 0.8;
const BASE_HEIGHT = 0.1;
const MAX_HEIGHT = 2.5;
const INTERACTION_RADIUS = 2.5;

interface BlockData {
  baseHeight: number;
  currentHeight: number;
  targetHeight: number;
  color: THREE.Color;
  position: THREE.Vector3;
  velocity: number;
}

export function SectorGrid({ mousePosition, isMobile }: SectorGridProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const blocksRef = useRef<BlockData[]>([]);
  const tempMatrix = useRef(new THREE.Matrix4());
  const tempColor = useRef(new THREE.Color());

  // Initialize blocks
  const blockCount = useMemo(() => {
    const blocks: BlockData[] = [];
    const halfGrid = (GRID_SIZE - 1) / 2;

    for (let x = 0; x < GRID_SIZE; x++) {
      for (let z = 0; z < GRID_SIZE; z++) {
        // Create varied base heights for city-skyline effect
        const distFromCenter = Math.sqrt(
          Math.pow(x - halfGrid, 2) + Math.pow(z - halfGrid, 2)
        );
        const noise =
          Math.sin(x * 0.8) * Math.cos(z * 0.7) * 0.5 +
          Math.sin(x * 1.2 + z * 0.9) * 0.3;

        // Higher towards center-right for desktop positioning
        const baseHeight =
          BASE_HEIGHT +
          (1 - distFromCenter / (halfGrid * 1.5)) * 0.6 +
          noise * 0.4;

        blocks.push({
          baseHeight: Math.max(BASE_HEIGHT, baseHeight),
          currentHeight: baseHeight,
          targetHeight: baseHeight,
          color: WARM_GRAY.clone(),
          position: new THREE.Vector3(
            (x - halfGrid) * BLOCK_SPACING,
            0,
            (z - halfGrid) * BLOCK_SPACING
          ),
          velocity: 0,
        });
      }
    }

    blocksRef.current = blocks;
    return blocks.length;
  }, []);

  // Create geometry - box with wireframe effect using EdgesGeometry
  const { boxGeometry, edgesGeometry, blockSize } = useMemo(() => {
    const size = BLOCK_SPACING * 0.7;
    const box = new THREE.BoxGeometry(size, 1, size);
    const edges = new THREE.EdgesGeometry(box);
    return { boxGeometry: box, edgesGeometry: edges, blockSize: size };
  }, []);

  // Animation frame
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const time = state.clock.elapsedTime;
    const blocks = blocksRef.current;

    blocks.forEach((block, i) => {
      // Calculate distance to mouse/wave position
      const dx = block.position.x - mousePosition.x;
      const dz = block.position.z - mousePosition.z;
      const distance = Math.sqrt(dx * dx + dz * dz);

      // Determine target height based on proximity
      let targetHeight = block.baseHeight;

      if (mousePosition.active && distance < INTERACTION_RADIUS) {
        // Rise when mouse is near
        const influence = 1 - distance / INTERACTION_RADIUS;
        const easeInfluence = influence * influence * (3 - 2 * influence); // smoothstep
        targetHeight = block.baseHeight + easeInfluence * (MAX_HEIGHT - block.baseHeight);
      }

      // Add subtle ambient animation
      const ambientWave = Math.sin(time * 0.5 + block.position.x * 0.3 + block.position.z * 0.4) * 0.1;
      targetHeight += ambientWave;

      // Spring physics for smooth height transitions
      const stiffness = isMobile ? 3 : 5;
      const damping = isMobile ? 0.8 : 0.85;

      const force = (targetHeight - block.currentHeight) * stiffness;
      block.velocity += force * delta;
      block.velocity *= damping;
      block.currentHeight += block.velocity;

      // Update color based on height (gray to orange)
      const heightRatio = Math.min(
        1,
        (block.currentHeight - block.baseHeight) / (MAX_HEIGHT - block.baseHeight)
      );

      // Interpolate between warm gray and orange
      tempColor.current.copy(WARM_GRAY).lerp(ORANGE, heightRatio * 0.8);

      // Update instance matrix
      tempMatrix.current.makeScale(1, block.currentHeight, 1);
      tempMatrix.current.setPosition(
        block.position.x,
        block.currentHeight / 2,
        block.position.z
      );

      meshRef.current!.setMatrixAt(i, tempMatrix.current);
      meshRef.current!.setColorAt(i, tempColor.current);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Solid blocks with transparency for glass effect */}
      <instancedMesh
        ref={meshRef}
        args={[boxGeometry, undefined, blockCount]}
        frustumCulled={false}
      >
        <meshStandardMaterial
          color={WARM_GRAY}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </instancedMesh>

      {/* Wireframe overlay for each block */}
      <WireframeBlocks
        blocks={blocksRef}
        blockSize={blockSize}
        blockCount={blockCount}
      />

      {/* Base grid lines */}
      <GridLines />
    </group>
  );
}

// Separate wireframe component for performance
function WireframeBlocks({
  blocks,
  blockSize,
  blockCount,
}: {
  blocks: React.MutableRefObject<BlockData[]>;
  blockSize: number;
  blockCount: number;
}) {
  const linesRef = useRef<THREE.Group>(null);

  // Create line segments for wireframe effect
  const lineGeometry = useMemo(() => {
    const size = blockSize;
    const halfSize = size / 2;

    // Vertices for a box wireframe
    const vertices: number[] = [];

    // Bottom face
    vertices.push(-halfSize, 0, -halfSize, halfSize, 0, -halfSize);
    vertices.push(halfSize, 0, -halfSize, halfSize, 0, halfSize);
    vertices.push(halfSize, 0, halfSize, -halfSize, 0, halfSize);
    vertices.push(-halfSize, 0, halfSize, -halfSize, 0, -halfSize);

    // Top face
    vertices.push(-halfSize, 1, -halfSize, halfSize, 1, -halfSize);
    vertices.push(halfSize, 1, -halfSize, halfSize, 1, halfSize);
    vertices.push(halfSize, 1, halfSize, -halfSize, 1, halfSize);
    vertices.push(-halfSize, 1, halfSize, -halfSize, 1, -halfSize);

    // Vertical edges
    vertices.push(-halfSize, 0, -halfSize, -halfSize, 1, -halfSize);
    vertices.push(halfSize, 0, -halfSize, halfSize, 1, -halfSize);
    vertices.push(halfSize, 0, halfSize, halfSize, 1, halfSize);
    vertices.push(-halfSize, 0, halfSize, -halfSize, 1, halfSize);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    return geometry;
  }, [blockSize]);

  useFrame(() => {
    if (!linesRef.current) return;

    const blockData = blocks.current;

    linesRef.current.children.forEach((line, i) => {
      if (i >= blockData.length) return;

      const block = blockData[i];
      line.position.set(block.position.x, 0, block.position.z);
      line.scale.set(1, block.currentHeight, 1);

      // Update line color
      const heightRatio = Math.min(
        1,
        (block.currentHeight - block.baseHeight) /
          (MAX_HEIGHT - block.baseHeight)
      );
      const color = WARM_GRAY.clone().lerp(ORANGE, heightRatio * 0.9);
      (line as THREE.LineSegments).material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.75 + heightRatio * 0.25,
      });
    });
  });

  return (
    <group ref={linesRef}>
      {Array.from({ length: blockCount }).map((_, i) => (
        <lineSegments key={i} geometry={lineGeometry}>
          <lineBasicMaterial color={WARM_GRAY} transparent opacity={0.75} />
        </lineSegments>
      ))}
    </group>
  );
}

// Subtle base grid
function GridLines() {
  const gridGeometry = useMemo(() => {
    const vertices: number[] = [];
    const halfGrid = (GRID_SIZE - 1) / 2;
    const extent = halfGrid * BLOCK_SPACING + BLOCK_SPACING;

    // Horizontal lines (along X)
    for (let z = -halfGrid; z <= halfGrid; z++) {
      const zPos = z * BLOCK_SPACING;
      vertices.push(-extent, 0.01, zPos, extent, 0.01, zPos);
    }

    // Vertical lines (along Z)
    for (let x = -halfGrid; x <= halfGrid; x++) {
      const xPos = x * BLOCK_SPACING;
      vertices.push(xPos, 0.01, -extent, xPos, 0.01, extent);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );

    return geometry;
  }, []);

  return (
    <lineSegments geometry={gridGeometry}>
      <lineBasicMaterial color={DARK_GRAY} transparent opacity={0.5} />
    </lineSegments>
  );
}
