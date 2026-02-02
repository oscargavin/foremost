"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createPaths } from "./ConveyorPaths";

interface CheckpointsProps {
  isMobile: boolean;
  mousePosition: { x: number; y: number; z: number; active: boolean };
}

// Checkpoint marker shader
const checkpointVertexShader = `
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const checkpointFragmentShader = `
uniform float uTime;
uniform float uPulse;
uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;

varying vec2 vUv;
varying vec3 vPosition;

void main() {
  // Distance from center
  float dist = length(vUv - 0.5) * 2.0;

  // Ring effect
  float ring = smoothstep(0.7, 0.85, dist) - smoothstep(0.85, 1.0, dist);

  // Center glow
  float centerGlow = smoothstep(0.5, 0.0, dist);

  // Pulse animation
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;

  // Combine effects
  vec3 color = mix(uBaseColor, uHighlightColor, ring + centerGlow * (0.3 + pulse * 0.2));
  color += uHighlightColor * uPulse * 0.5;

  float alpha = (ring * 0.6 + centerGlow * 0.4) * (0.6 + uPulse * 0.4);

  gl_FragColor = vec4(color, alpha);
}
`;

interface CheckpointData {
  position: THREE.Vector3;
  pathId: string;
  progress: number;
}

function CheckpointMarker({
  position,
  mousePosition,
  index,
}: {
  position: THREE.Vector3;
  mousePosition: { x: number; y: number; z: number; active: boolean };
  index: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const ringRef = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: checkpointVertexShader,
      fragmentShader: checkpointFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPulse: { value: 0 },
        uBaseColor: { value: new THREE.Color(0xb8b3b0) },
        uHighlightColor: { value: new THREE.Color(0xee6018) },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (!materialRef.current || !meshRef.current) return;

    const time = state.clock.elapsedTime;

    // Calculate distance from mouse
    const mouseVec = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);
    const distToMouse = mouseVec.distanceTo(position);
    const mouseInfluence = mousePosition.active ? Math.max(0, 1 - distToMouse / 3) : 0;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time + index * 0.5;
    materialRef.current.uniforms.uPulse.value = mouseInfluence;

    // Gentle rotation
    meshRef.current.rotation.z = time * 0.2 + index;

    // Subtle scale pulse on hover
    const scale = 1 + mouseInfluence * 0.15;
    meshRef.current.scale.setScalar(scale);

    // Rotate outer ring opposite direction
    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Main checkpoint plane */}
      <mesh ref={meshRef}>
        <planeGeometry args={[0.5, 0.5]} />
        <primitive object={material} ref={materialRef} attach="material" />
      </mesh>

      {/* Outer wireframe ring */}
      <mesh ref={ringRef}>
        <ringGeometry args={[0.28, 0.32, 6]} />
        <meshBasicMaterial color="#ee6018" transparent opacity={0.6} wireframe />
      </mesh>

      {/* Inner dot */}
      <mesh>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color="#ee6018" transparent opacity={0.8} />
      </mesh>
    </group>
  );
}

export function Checkpoints({ isMobile, mousePosition }: CheckpointsProps) {
  // Get checkpoint positions from paths
  const checkpoints = useMemo((): CheckpointData[] => {
    const paths = createPaths(isMobile);
    const result: CheckpointData[] = [];

    paths.forEach((path) => {
      path.checkpoints.forEach((progress) => {
        const position = path.curve.getPoint(progress);
        result.push({
          position,
          pathId: path.id,
          progress,
        });
      });
    });

    return result;
  }, [isMobile]);

  return (
    <group>
      {checkpoints.map((checkpoint, i) => (
        <CheckpointMarker
          key={`${checkpoint.pathId}-${checkpoint.progress}`}
          position={checkpoint.position}
          mousePosition={mousePosition}
          index={i}
        />
      ))}
    </group>
  );
}
