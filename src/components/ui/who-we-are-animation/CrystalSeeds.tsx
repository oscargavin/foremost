"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Crystal {
  direction: THREE.Vector3;
  length: number;
  baseLength: number;
  phase: number;
  growthSpeed: number;
}

interface CrystalSeedsProps {
  seedPositions: THREE.Vector3[];
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Shader for crystal wireframe effect
const crystalVertexShader = `
varying vec3 vPosition;
varying float vDistance;

uniform vec3 uMousePosition;
uniform float uTime;
uniform float uGrowthFactor;

void main() {
  vPosition = position;

  // Calculate distance from mouse for interaction
  vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
  vDistance = distance(worldPos.xy, uMousePosition.xy);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const crystalFragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;
uniform float uTime;
uniform float uOpacity;
uniform float uGrowthFactor;

varying vec3 vPosition;
varying float vDistance;

void main() {
  // Distance-based highlight
  float mouseHighlight = smoothstep(3.0, 0.0, vDistance);

  // Growth pulse effect
  float pulse = sin(uTime * 2.0 + vPosition.x * 2.0) * 0.5 + 0.5;

  // Elevation-based glow (tips glow more)
  float tipGlow = smoothstep(0.0, 1.0, length(vPosition) * 0.5);

  // Combine effects
  float highlightStrength = mouseHighlight * 0.6 + tipGlow * 0.3 + uGrowthFactor * 0.2;

  vec3 color = mix(uBaseColor, uHighlightColor, highlightStrength);

  // Subtle shimmer
  color += uHighlightColor * pulse * mouseHighlight * 0.15;

  float alpha = uOpacity + mouseHighlight * 0.3 + uGrowthFactor * 0.1;

  gl_FragColor = vec4(color, alpha);
}
`;

function CrystalFormation({
  position,
  seedIndex,
  mousePosition,
  isMobile,
}: {
  position: THREE.Vector3;
  seedIndex: number;
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const crystalsRef = useRef<Crystal[]>([]);
  const currentGrowthRef = useRef<number[]>([]);

  // Generate crystal directions radiating from seed
  const crystalCount = isMobile ? 8 : 12;

  const crystals = useMemo(() => {
    const result: Crystal[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < crystalCount; i++) {
      const theta = goldenAngle * i;
      const phi = Math.acos(1 - (2 * (i + 0.5)) / crystalCount);

      // Spherical to cartesian with some randomness
      const x = Math.sin(phi) * Math.cos(theta) + (Math.random() - 0.5) * 0.2;
      const y = Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 0.2;
      const z = Math.cos(phi) * 0.3 + (Math.random() - 0.5) * 0.1;

      const baseLength = 0.4 + Math.random() * 0.6;

      result.push({
        direction: new THREE.Vector3(x, y, z).normalize(),
        length: baseLength,
        baseLength,
        phase: Math.random() * Math.PI * 2,
        growthSpeed: 0.5 + Math.random() * 0.5,
      });
    }

    crystalsRef.current = result;
    currentGrowthRef.current = result.map(() => 1);
    return result;
  }, [crystalCount]);

  // Create geometry for crystal shards
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];

    crystals.forEach((crystal, i) => {
      const baseIdx = i * 4;

      // Crystal shard: elongated tetrahedron
      const tip = crystal.direction.clone().multiplyScalar(crystal.length);
      const width = 0.05;

      // Create perpendicular vectors for base
      const perp1 = new THREE.Vector3()
        .crossVectors(crystal.direction, new THREE.Vector3(0, 1, 0))
        .normalize()
        .multiplyScalar(width);
      const perp2 = new THREE.Vector3()
        .crossVectors(crystal.direction, perp1)
        .normalize()
        .multiplyScalar(width);

      // Base vertices (triangle)
      const base1 = perp1.clone();
      const base2 = perp1
        .clone()
        .multiplyScalar(-0.5)
        .add(perp2.clone().multiplyScalar(0.866));
      const base3 = perp1
        .clone()
        .multiplyScalar(-0.5)
        .sub(perp2.clone().multiplyScalar(0.866));

      // Add vertices: base triangle + tip
      positions.push(base1.x, base1.y, base1.z);
      positions.push(base2.x, base2.y, base2.z);
      positions.push(base3.x, base3.y, base3.z);
      positions.push(tip.x, tip.y, tip.z);

      // Wireframe edges (as line indices)
      // Base triangle
      indices.push(baseIdx, baseIdx + 1);
      indices.push(baseIdx + 1, baseIdx + 2);
      indices.push(baseIdx + 2, baseIdx);
      // Edges to tip
      indices.push(baseIdx, baseIdx + 3);
      indices.push(baseIdx + 1, baseIdx + 3);
      indices.push(baseIdx + 2, baseIdx + 3);
    });

    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);

    return geo;
  }, [crystals]);

  // Shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: crystalVertexShader,
      fragmentShader: crystalFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMousePosition: { value: new THREE.Vector3(-100, -100, -100) },
        uBaseColor: { value: new THREE.Color(0xb8b3b0) },
        uHighlightColor: { value: new THREE.Color(0xee6018) },
        uOpacity: { value: 0.65 },
        uGrowthFactor: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }, []);

  // Animation
  useFrame((state) => {
    if (!groupRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const mouseVec = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);
    const seedWorldPos = position.clone();

    // Calculate distance from mouse to this seed
    const distToMouse = mouseVec.distanceTo(seedWorldPos);
    const mouseInfluence = mousePosition.active ? Math.max(0, 1 - distToMouse / 4) : 0;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMousePosition.value.copy(mouseVec);
    materialRef.current.uniforms.uGrowthFactor.value = mouseInfluence;

    // Animate crystal growth based on mouse proximity
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;

    crystals.forEach((crystal, i) => {
      const baseIdx = i * 4;

      // Target growth: base + mouse influence
      const targetGrowth = 1 + mouseInfluence * 0.8;

      // Smooth interpolation
      currentGrowthRef.current[i] +=
        (targetGrowth - currentGrowthRef.current[i]) * 0.05 * crystal.growthSpeed;

      // Add ambient breathing
      const breathe = Math.sin(time * 0.5 + crystal.phase) * 0.1;
      const finalGrowth = currentGrowthRef.current[i] + breathe;

      // Update tip position (vertex 3)
      const tip = crystal.direction.clone().multiplyScalar(crystal.baseLength * finalGrowth);
      positionAttr.setXYZ(baseIdx + 3, tip.x, tip.y, tip.z);
    });

    positionAttr.needsUpdate = true;

    // Gentle rotation
    groupRef.current.rotation.z = Math.sin(time * 0.2 + seedIndex) * 0.05;
  });

  // Create line segments object
  const lineSegments = useMemo(() => {
    return new THREE.LineSegments(geometry, material);
  }, [geometry, material]);

  return (
    <group ref={groupRef} position={position}>
      {/* Central seed sphere */}
      <mesh>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ee6018"
          emissive="#ee6018"
          emissiveIntensity={0.6}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Crystal formations as lines */}
      <primitive object={lineSegments}>
        <primitive object={material} ref={materialRef} attach="material" />
      </primitive>
    </group>
  );
}

export function CrystalSeeds({ seedPositions, mousePosition, isMobile }: CrystalSeedsProps) {
  return (
    <group>
      {seedPositions.map((pos, i) => (
        <CrystalFormation
          key={i}
          position={pos}
          seedIndex={i}
          mousePosition={mousePosition}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}
