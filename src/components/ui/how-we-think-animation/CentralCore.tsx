"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CentralCoreProps {
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Vertex shader for the central core
const coreVertexShader = `
varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vViewPosition = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}
`;

// Fragment shader for pulsing core with energy effect
const coreFragmentShader = `
uniform vec3 uCoreColor;
uniform vec3 uGlowColor;
uniform float uTime;
uniform float uPulseIntensity;
uniform float uMouseInfluence;

varying vec3 vNormal;
varying vec3 vViewPosition;
varying vec2 vUv;

void main() {
  // Fresnel for edge glow
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.5);

  // Core pulse
  float pulse = sin(uTime * 1.5) * 0.3 + 0.7;

  // Energy pattern
  float energy = sin(vUv.x * 10.0 + uTime * 3.0) * sin(vUv.y * 10.0 + uTime * 2.0) * 0.5 + 0.5;

  // Combined intensity
  float intensity = pulse * (0.6 + fresnel * 0.4 + uMouseInfluence * 0.4);

  // Color mixing
  vec3 color = mix(uCoreColor, uGlowColor, fresnel * 0.6 + uMouseInfluence * 0.4);
  color += uGlowColor * energy * 0.15 * uMouseInfluence;

  gl_FragColor = vec4(color * intensity, 0.9);
}
`;

// Ring shader for orbiting rings around core
const ringVertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const ringFragmentShader = `
uniform vec3 uColor;
uniform float uTime;
uniform float uOpacity;

varying vec2 vUv;

void main() {
  // Create dashed effect
  float dash = step(0.5, fract(vUv.x * 16.0 - uTime * 0.5));

  gl_FragColor = vec4(uColor, uOpacity * dash * 0.6);
}
`;

function CoreRing({
  radius,
  rotationSpeed,
  tiltX,
  tiltY,
  isMobile,
}: {
  radius: number;
  rotationSpeed: number;
  tiltX: number;
  tiltY: number;
  isMobile: boolean;
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    return new THREE.RingGeometry(radius - 0.01, radius + 0.01, isMobile ? 48 : 64);
  }, [radius, isMobile]);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: ringVertexShader,
      fragmentShader: ringFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0xee6018) },
        uTime: { value: 0 },
        uOpacity: { value: 0.6 },
      },
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  useFrame((state) => {
    if (!ringRef.current || !materialRef.current) return;

    const time = state.clock.elapsedTime;

    // Rotate ring
    ringRef.current.rotation.z = time * rotationSpeed;

    // Update shader time
    materialRef.current.uniforms.uTime.value = time;
  });

  return (
    <mesh ref={ringRef} rotation={[tiltX, tiltY, 0]} geometry={geometry}>
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
}

export function CentralCore({ mousePosition, isMobile }: CentralCoreProps) {
  const coreRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Offset for right-side positioning on desktop
  const groupOffset = 0;

  // Core shader material
  const coreMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      uniforms: {
        uCoreColor: { value: new THREE.Color(0xb8b3b0) },
        uGlowColor: { value: new THREE.Color(0xee6018) },
        uTime: { value: 0 },
        uPulseIntensity: { value: 1 },
        uMouseInfluence: { value: 0 },
      },
      transparent: true,
    });
  }, []);

  useFrame((state) => {
    if (!coreRef.current || !materialRef.current || !groupRef.current) return;

    const time = state.clock.elapsedTime;

    // Calculate mouse influence
    const adjustedMousePos = new THREE.Vector3(
      mousePosition.x - groupOffset,
      mousePosition.y,
      mousePosition.z
    );
    const distToMouse = adjustedMousePos.length();
    const mouseInfluence = mousePosition.active ? Math.max(0, 1 - distToMouse / 3) : 0;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouseInfluence.value = mouseInfluence;

    // Subtle scale pulsing
    const pulseScale = 1 + Math.sin(time * 1.5) * 0.05 + mouseInfluence * 0.1;
    coreRef.current.scale.setScalar(pulseScale);

    // Gentle rotation
    groupRef.current.rotation.y = time * 0.1;
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1;
  });

  return (
    <group ref={groupRef} position={[groupOffset, 0, 0]}>
      {/* Central glowing sphere */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.3, 32, 32]} />
        <primitive object={coreMaterial} ref={materialRef} attach="material" />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshBasicMaterial color="#ee6018" transparent opacity={0.35} />
      </mesh>

      {/* Orbiting rings */}
      <CoreRing
        radius={0.5}
        rotationSpeed={0.3}
        tiltX={Math.PI / 3}
        tiltY={0}
        isMobile={isMobile}
      />
      <CoreRing
        radius={0.6}
        rotationSpeed={-0.25}
        tiltX={-Math.PI / 4}
        tiltY={Math.PI / 6}
        isMobile={isMobile}
      />
      {!isMobile && (
        <CoreRing
          radius={0.7}
          rotationSpeed={0.2}
          tiltX={Math.PI / 2}
          tiltY={-Math.PI / 5}
          isMobile={isMobile}
        />
      )}
    </group>
  );
}
