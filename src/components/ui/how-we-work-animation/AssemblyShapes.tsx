"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPaths, PathDefinition } from "./ConveyorPaths";

interface AssemblyShapesProps {
  isMobile: boolean;
  mousePosition: { x: number; y: number; z: number; active: boolean };
}

// Shape types that transform as they progress
type ShapeType = "tetrahedron" | "octahedron" | "icosahedron" | "dodecahedron";

interface AssemblyShape {
  id: number;
  pathId: string;
  progress: number;
  speed: number;
  baseSpeed: number;
  scale: number;
  rotationSpeed: THREE.Vector3;
  shapeType: ShapeType;
  pausedUntil: number; // Time when shape can resume (for checkpoint pauses)
  checkpointsPassed: number;
}

// Shader for wireframe shapes with transformation glow
const shapeVertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const shapeFragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;
uniform float uProgress;
uniform float uMouseInfluence;
uniform float uTime;

varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // Edge detection based on normal
  float edge = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);

  // Progress-based refinement glow (shapes become more "refined" as they progress)
  float refinement = uProgress;

  // Mouse proximity boost
  float mouseGlow = uMouseInfluence * 0.6;

  // Combine for final color
  float highlight = edge * 0.5 + refinement * 0.3 + mouseGlow;
  vec3 color = mix(uBaseColor, uHighlightColor, highlight);

  // Subtle shimmer
  float shimmer = sin(uTime * 3.0 + vPosition.x * 5.0) * 0.1 + 0.9;
  color *= shimmer;

  float alpha = 0.6 + refinement * 0.25 + mouseGlow * 0.15;

  gl_FragColor = vec4(color, alpha);
}
`;

// Create geometry based on shape type
function createGeometry(type: ShapeType): THREE.BufferGeometry {
  switch (type) {
    case "tetrahedron":
      return new THREE.TetrahedronGeometry(0.15);
    case "octahedron":
      return new THREE.OctahedronGeometry(0.15);
    case "icosahedron":
      return new THREE.IcosahedronGeometry(0.15);
    case "dodecahedron":
      return new THREE.DodecahedronGeometry(0.12);
  }
}

// Get shape type based on progress (shapes evolve along path)
function getShapeType(progress: number, checkpointsPassed: number): ShapeType {
  // Evolution: simpler → more refined
  if (checkpointsPassed >= 2) return "dodecahedron";
  if (checkpointsPassed >= 1 || progress > 0.6) return "icosahedron";
  if (progress > 0.3) return "octahedron";
  return "tetrahedron";
}

export function AssemblyShapes({ isMobile, mousePosition }: AssemblyShapesProps) {
  const groupRef = useRef<THREE.Group>(null);
  const shapesRef = useRef<AssemblyShape[]>([]);
  const meshesRef = useRef<Map<number, THREE.Mesh>>(new Map());
  const materialsRef = useRef<Map<number, THREE.ShaderMaterial>>(new Map());
  const lastSpawnRef = useRef<Record<string, number>>({});
  const idCounterRef = useRef(0);

  const paths = useMemo(() => createPaths(isMobile), [isMobile]);
  const maxShapes = isMobile ? 12 : 25;

  // Pre-create geometries for each shape type
  const geometries = useMemo(() => ({
    tetrahedron: createGeometry("tetrahedron"),
    octahedron: createGeometry("octahedron"),
    icosahedron: createGeometry("icosahedron"),
    dodecahedron: createGeometry("dodecahedron"),
  }), []);

  // Create wireframe edges for geometries
  const edgesGeometries = useMemo(() => ({
    tetrahedron: new THREE.EdgesGeometry(geometries.tetrahedron),
    octahedron: new THREE.EdgesGeometry(geometries.octahedron),
    icosahedron: new THREE.EdgesGeometry(geometries.icosahedron),
    dodecahedron: new THREE.EdgesGeometry(geometries.dodecahedron),
  }), [geometries]);

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime;
    const mouseVec = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);

    // Spawn new shapes on paths
    paths.forEach((path) => {
      const lastSpawn = lastSpawnRef.current[path.id] || 0;
      const spawnInterval = isMobile ? 2.5 : 1.5;

      // Don't spawn on paths that diverge from others (they receive shapes from main)
      if (path.divergesFrom) return;

      if (
        time - lastSpawn > spawnInterval &&
        shapesRef.current.length < maxShapes &&
        Math.random() < 0.7
      ) {
        const newShape: AssemblyShape = {
          id: idCounterRef.current++,
          pathId: path.id,
          progress: 0,
          speed: 0.08 + Math.random() * 0.04,
          baseSpeed: 0.08 + Math.random() * 0.04,
          scale: 0.8 + Math.random() * 0.4,
          rotationSpeed: new THREE.Vector3(
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2,
            (Math.random() - 0.5) * 2
          ),
          shapeType: "tetrahedron",
          pausedUntil: 0,
          checkpointsPassed: 0,
        };

        shapesRef.current.push(newShape);
        lastSpawnRef.current[path.id] = time;
      }
    });

    // Update shapes
    for (let i = shapesRef.current.length - 1; i >= 0; i--) {
      const shape = shapesRef.current[i];
      const path = paths.find((p) => p.id === shape.pathId);
      if (!path) continue;

      // Get position on curve
      const position = path.curve.getPoint(shape.progress);

      // Calculate mouse influence for speed boost
      const distToMouse = mouseVec.distanceTo(position);
      const mouseInfluence = mousePosition.active ? Math.max(0, 1 - distToMouse / 2.5) : 0;

      // Check if paused at checkpoint
      const isPaused = time < shape.pausedUntil;

      if (!isPaused) {
        // Speed boost from mouse proximity
        shape.speed = shape.baseSpeed * (1 + mouseInfluence * 2);
        shape.progress += shape.speed * delta;

        // Check for checkpoint pauses
        path.checkpoints.forEach((checkpointProgress, cpIndex) => {
          // Only pause once per checkpoint
          if (
            shape.checkpointsPassed <= cpIndex &&
            shape.progress >= checkpointProgress &&
            shape.progress < checkpointProgress + 0.05
          ) {
            shape.pausedUntil = time + 0.5 + Math.random() * 0.3;
            shape.checkpointsPassed = cpIndex + 1;
          }
        });
      }

      // Update shape type based on progress/checkpoints
      shape.shapeType = getShapeType(shape.progress, shape.checkpointsPassed);

      // Handle path convergence
      if (path.convergesTo && shape.progress >= 0.95) {
        const targetPath = paths.find((p) => p.id === path.convergesTo);
        if (targetPath) {
          // Find closest point on target path
          shape.pathId = targetPath.id;
          shape.progress = 0.6 + Math.random() * 0.1; // Join mid-way
          shape.checkpointsPassed = 1; // Already refined
        }
      }

      // Handle path divergence (for output path)
      if (shape.pathId === "main" && shape.progress >= 0.75 && Math.random() < 0.02) {
        const outputPath = paths.find((p) => p.divergesFrom === "main");
        if (outputPath && shapesRef.current.filter((s) => s.pathId === "output").length < 5) {
          // Spawn a copy on the output path
          const divergeShape: AssemblyShape = {
            ...shape,
            id: idCounterRef.current++,
            pathId: "output",
            progress: 0,
            checkpointsPassed: 2, // Already fully refined
          };
          shapesRef.current.push(divergeShape);
        }
      }

      // Remove shapes that completed their path
      if (shape.progress >= 1) {
        shapesRef.current.splice(i, 1);
        meshesRef.current.delete(shape.id);
        materialsRef.current.delete(shape.id);
        continue;
      }

      // Get or create mesh for this shape
      let mesh = meshesRef.current.get(shape.id);
      let material = materialsRef.current.get(shape.id);

      if (!mesh || !material) {
        material = new THREE.ShaderMaterial({
          vertexShader: shapeVertexShader,
          fragmentShader: shapeFragmentShader,
          uniforms: {
            uBaseColor: { value: new THREE.Color(0xb8b3b0) },
            uHighlightColor: { value: new THREE.Color(0xee6018) },
            uProgress: { value: 0 },
            uMouseInfluence: { value: 0 },
            uTime: { value: 0 },
          },
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
        });

        mesh = new THREE.Mesh(geometries[shape.shapeType], material);
        meshesRef.current.set(shape.id, mesh);
        materialsRef.current.set(shape.id, material);
        groupRef.current?.add(mesh);
      }

      // Update geometry if shape type changed
      if (mesh.geometry !== geometries[shape.shapeType]) {
        mesh.geometry = geometries[shape.shapeType];
      }

      // Update mesh transform
      mesh.position.copy(position);

      // Add slight z-offset based on path to prevent z-fighting
      mesh.position.z = paths.indexOf(path) * 0.1;

      // Rotation animation (slower when paused)
      const rotMult = isPaused ? 0.2 : 1;
      mesh.rotation.x += shape.rotationSpeed.x * delta * rotMult;
      mesh.rotation.y += shape.rotationSpeed.y * delta * rotMult;
      mesh.rotation.z += shape.rotationSpeed.z * delta * rotMult;

      // Scale with slight pulse
      const pulseScale = 1 + Math.sin(time * 2 + shape.id) * 0.05;
      const pauseScale = isPaused ? 1.1 : 1; // Slightly larger when paused
      mesh.scale.setScalar(shape.scale * pulseScale * pauseScale * (0.7 + shape.progress * 0.3));

      // Update material uniforms
      material.uniforms.uProgress.value = shape.progress;
      material.uniforms.uMouseInfluence.value = mouseInfluence;
      material.uniforms.uTime.value = time;
    }

    // Clean up orphaned meshes
    meshesRef.current.forEach((mesh, id) => {
      if (!shapesRef.current.find((s) => s.id === id)) {
        groupRef.current?.remove(mesh);
        meshesRef.current.delete(id);
        materialsRef.current.delete(id);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Wireframe overlays for existing shapes - handled dynamically */}
    </group>
  );
}
