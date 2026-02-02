"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface OrbitalNodesProps {
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Orbital node configuration - 4 beliefs with different orbital parameters
interface OrbitalConfig {
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
  nodeSize: number;
}

const orbitalConfigs: OrbitalConfig[] = [
  { radius: 2.8, speed: 0.3, phase: 0, tilt: 0.1, nodeSize: 0.18 },
  { radius: 2.2, speed: -0.4, phase: Math.PI / 2, tilt: -0.15, nodeSize: 0.15 },
  { radius: 3.2, speed: 0.25, phase: Math.PI, tilt: 0.2, nodeSize: 0.2 },
  { radius: 2.5, speed: -0.35, phase: (3 * Math.PI) / 2, tilt: -0.1, nodeSize: 0.16 },
];

// Vertex shader for node glow
const nodeVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment shader for node with glow effect
const nodeFragmentShader = `
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uGlowIntensity;
uniform float uTime;

varying vec3 vNormal;
varying vec3 vViewPosition;

void main() {
  // Fresnel effect for edge glow
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.0);

  // Pulsing glow
  float pulse = sin(uTime * 2.0) * 0.15 + 0.85;

  // Mix base color with glow
  vec3 color = mix(uColor, uGlowColor, fresnel * uGlowIntensity * pulse);

  // Core brightness
  float coreBrightness = 0.8 + fresnel * 0.2 * uGlowIntensity;

  gl_FragColor = vec4(color * coreBrightness, 0.95);
}
`;

function OrbitalNode({
  config,
  index,
  mousePosition,
  isMobile,
}: {
  config: OrbitalConfig;
  index: number;
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Spring physics for mouse attraction
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const currentOffset = useRef(new THREE.Vector3(0, 0, 0));

  // Base orbital position ref
  const basePosition = useRef(new THREE.Vector3());

  // Create orbital ring geometry
  const ringGeometry = useMemo(() => {
    const segments = isMobile ? 48 : 64;
    const points: THREE.Vector3[] = [];

    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * config.radius;
      const y = Math.sin(angle) * config.radius;
      const z = Math.sin(angle) * config.tilt * config.radius;
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, [config.radius, config.tilt, isMobile]);

  // Shader material for node
  const nodeMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: nodeVertexShader,
      fragmentShader: nodeFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0xb8b3b0) },
        uGlowColor: { value: new THREE.Color(0xee6018) },
        uGlowIntensity: { value: 0.3 },
        uTime: { value: 0 },
      },
      transparent: true,
    });
  }, []);

  // Ring material
  const ringMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0xb8b3b0,
      transparent: true,
      opacity: 0.4,
    });
  }, []);

  // Create the Line object using useMemo
  const ringLine = useMemo(() => {
    return new THREE.Line(ringGeometry, ringMaterial);
  }, [ringGeometry, ringMaterial]);

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;
    const delta = Math.min(state.clock.getDelta(), 0.1);

    // Calculate base orbital position
    const angle = time * config.speed + config.phase;
    basePosition.current.x = Math.cos(angle) * config.radius;
    basePosition.current.y = Math.sin(angle) * config.radius;
    basePosition.current.z = Math.sin(angle) * config.tilt * config.radius;

    // Mouse attraction physics (desktop only)
    if (!isMobile && mousePosition.active) {
      const mouseVec = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);
      const toMouse = mouseVec.clone().sub(basePosition.current);
      const distance = toMouse.length();

      // Attraction strength falls off with distance
      const attractionRadius = 4;
      const maxAttraction = 1.2;

      if (distance < attractionRadius) {
        const strength = (1 - distance / attractionRadius) * maxAttraction;
        const attractionForce = toMouse.normalize().multiplyScalar(strength);

        // Apply spring physics
        const springStrength = 8;
        const dampening = 4;

        const springForce = currentOffset.current.clone().multiplyScalar(-springStrength);
        const dampingForce = velocity.current.clone().multiplyScalar(-dampening);

        velocity.current.add(attractionForce.multiplyScalar(delta * 60));
        velocity.current.add(springForce.multiplyScalar(delta));
        velocity.current.add(dampingForce.multiplyScalar(delta));

        currentOffset.current.add(velocity.current.clone().multiplyScalar(delta));
      }
    } else {
      // Spring back to orbital position
      const springStrength = 6;
      const dampening = 3;

      const springForce = currentOffset.current.clone().multiplyScalar(-springStrength);
      const dampingForce = velocity.current.clone().multiplyScalar(-dampening);

      velocity.current.add(springForce.multiplyScalar(delta));
      velocity.current.add(dampingForce.multiplyScalar(delta));

      currentOffset.current.add(velocity.current.clone().multiplyScalar(delta));
    }

    // Apply position
    meshRef.current.position.copy(basePosition.current).add(currentOffset.current);

    // Calculate glow intensity based on mouse proximity
    const mouseVec = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);
    const distToMouse = meshRef.current.position.distanceTo(mouseVec);
    const glowFromMouse = mousePosition.active ? Math.max(0, 1 - distToMouse / 3) : 0;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uGlowIntensity.value = 0.3 + glowFromMouse * 0.7;

    // Subtle size pulsing
    const pulseScale = 1 + Math.sin(time * 1.5 + index) * 0.05;
    meshRef.current.scale.setScalar(pulseScale);

    // Update ring opacity based on mouse
    if (ringLine) {
      const ringMat = ringLine.material as THREE.LineBasicMaterial;
      ringMat.opacity = 0.4 + glowFromMouse * 0.3;
    }
  });

  return (
    <group>
      {/* Orbital ring path */}
      <primitive object={ringLine} />

      {/* Node sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[config.nodeSize, 24, 24]} />
        <primitive object={nodeMaterial} ref={materialRef} attach="material" />
      </mesh>
    </group>
  );
}

export function OrbitalNodes({ mousePosition, isMobile }: OrbitalNodesProps) {
  // Centered in container (CSS handles right-side positioning)
  const groupPosition = [0, 0, 0];

  return (
    <group position={groupPosition as [number, number, number]}>
      {orbitalConfigs.map((config, index) => (
        <OrbitalNode
          key={index}
          config={config}
          index={index}
          mousePosition={mousePosition}
          isMobile={isMobile}
        />
      ))}
    </group>
  );
}
