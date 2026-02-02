"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise2D } from "simplex-noise";
import alea from "alea";
import type { AnimationVariant } from "./variants";

// Inline shader strings (Next.js doesn't support raw GLSL imports without config)
const vertexShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uNoiseScale;
uniform float uWaveAmplitude;

varying vec3 vPosition;
varying float vElevation;
varying float vMouseDistance;

void main() {
  vec3 pos = position;
  vPosition = pos;

  // Ambient undulating waves - multiple frequencies for organic feel
  float wave1 = sin(pos.x * 0.5 + uTime * 0.3) * 0.12;
  float wave2 = cos(pos.z * 0.4 + uTime * 0.25) * 0.10;
  float wave3 = sin((pos.x + pos.z) * 0.3 + uTime * 0.2) * 0.08;

  pos.y += (wave1 + wave2 + wave3) * uWaveAmplitude;

  // Mouse ripple effect
  float dist = distance(pos.xz, uMouse);
  vMouseDistance = dist;

  // Ripple: outward-traveling wave that decays with distance
  float ripplePhase = dist * 2.5 - uTime * 3.5;
  float rippleDecay = exp(-dist * 0.4) * smoothstep(uMouseRadius, 0.0, dist);
  float ripple = sin(ripplePhase) * rippleDecay * 0.35;

  pos.y += ripple;

  vElevation = pos.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const fragmentShader = `
uniform vec3 uBaseColor;
uniform vec3 uHighlightColor;
uniform vec2 uMouse;
uniform float uMouseRadius;
uniform float uTime;
uniform float uOpacity;

varying vec3 vPosition;
varying float vElevation;
varying float vMouseDistance;

void main() {
  // Distance-based highlight from mouse
  float mouseHighlight = smoothstep(uMouseRadius, 0.0, vMouseDistance);

  // Elevation-based coloring - higher points get more highlight
  float elevationFactor = smoothstep(-0.2, 0.4, vElevation);

  // Combine factors
  float highlightStrength = mouseHighlight * 0.7 + elevationFactor * 0.3;

  // Mix base and highlight colors - keep mostly gray with subtle orange accents
  vec3 color = mix(uBaseColor, uHighlightColor, highlightStrength * 0.25);

  // Boost line visibility
  color *= 1.8;

  // Add subtle pulsing on mouse-affected areas
  float pulse = sin(uTime * 2.0) * 0.5 + 0.5;
  color += uHighlightColor * mouseHighlight * pulse * 0.15;

  // Opacity varies with elevation and mouse proximity
  float alpha = uOpacity + mouseHighlight * 0.2 + elevationFactor * 0.1;

  gl_FragColor = vec4(color, alpha);
}
`;

interface TopologySurfaceProps {
  isMobile: boolean;
  mousePosition: { x: number; z: number; active: boolean };
  variant: AnimationVariant;
}

export function TopologySurface({ isMobile, mousePosition, variant }: TopologySurfaceProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Grid dimensions - adjusted by variant
  const baseGridWidth = isMobile ? 32 : 48;
  const baseGridHeight = isMobile ? 20 : 30;
  const gridWidth = Math.round(baseGridWidth * variant.gridDensity);
  const gridHeight = Math.round(baseGridHeight * variant.gridDensity);

  // Helper to add noise detail to any topology
  const addNoiseDetail = (
    x: number,
    z: number,
    noise2D: (x: number, y: number) => number,
    freq: number,
    height: number,
    style: string
  ): number => {
    let detail = 0;
    switch (style) {
      case 'smooth':
        detail = noise2D(x * 0.2 * freq, z * 0.2 * freq) * 0.4 +
                 noise2D(x * 0.4 * freq, z * 0.4 * freq) * 0.15;
        break;
      case 'rough':
        detail = noise2D(x * 0.3 * freq, z * 0.3 * freq) * 0.3 +
                 noise2D(x * 0.8 * freq, z * 0.8 * freq) * 0.2 +
                 noise2D(x * 1.5 * freq, z * 1.5 * freq) * 0.15;
        break;
      case 'ridged':
        const n1 = noise2D(x * 0.25 * freq, z * 0.25 * freq);
        const n2 = noise2D(x * 0.5 * freq, z * 0.5 * freq);
        detail = (1 - Math.abs(n1)) * 0.35 + (1 - Math.abs(n2)) * 0.2 - 0.25;
        break;
      case 'balanced':
      default:
        detail = noise2D(x * 0.3 * freq, z * 0.3 * freq) * 0.35 +
                 noise2D(x * 0.6 * freq, z * 0.6 * freq) * 0.18 +
                 noise2D(x * 1.2 * freq, z * 1.2 * freq) * 0.08;
        break;
    }
    return detail * height;
  };

  // Create geometry based on topology type
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(24, 10, gridWidth, gridHeight);
    geo.rotateX(-Math.PI / 2);

    const prng = alea(variant.seedOffset);
    const noise2D = createNoise2D(prng);
    const positions = geo.attributes.position;

    const freq = variant.noiseFrequency;
    const height = variant.terrainHeight;
    const width = 24;
    const depth = 10;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const z = positions.getZ(i);

      // Normalized coordinates (-1 to 1)
      const nx = x / (width / 2);
      const nz = z / (depth / 2);

      let baseY = 0;

      switch (variant.topology) {
        case 'sphere':
          // Curved horizon - sphere segment
          const sphereRadius = 8;
          const distFromCenter = Math.sqrt(nx * nx + nz * nz);
          baseY = Math.sqrt(Math.max(0, 1 - distFromCenter * distFromCenter * 0.3)) * 2 - 1.5;
          break;

        case 'radial':
          // Concentric rings emanating from center
          const radialDist = Math.sqrt(x * x + z * z);
          baseY = Math.sin(radialDist * 0.8) * 0.5 * Math.exp(-radialDist * 0.08);
          break;

        case 'terraced':
          // Stepped plateaus
          const terraceNoise = noise2D(x * 0.15, z * 0.15);
          const terraceLevel = Math.floor((terraceNoise + 1) * 2.5) / 2.5;
          baseY = (terraceLevel - 0.5) * 0.8;
          break;

        case 'wave':
          // Flowing parametric waves
          baseY = Math.sin(x * 0.4 + z * 0.2) * 0.4 +
                  Math.sin(x * 0.2 - z * 0.3) * 0.3 +
                  Math.cos(x * 0.15 + z * 0.4) * 0.2;
          break;

        case 'bowl':
          // Concave valley - inverted dome
          const bowlDist = Math.sqrt(nx * nx * 0.8 + nz * nz);
          baseY = bowlDist * bowlDist * 1.2 - 0.8;
          break;

        case 'ridge':
          // Central ridge spine running along X axis
          const ridgeWidth = 0.4;
          const ridgeFalloff = Math.exp(-nz * nz / (ridgeWidth * ridgeWidth));
          baseY = ridgeFalloff * 0.8 - 0.3 + Math.sin(x * 0.3) * 0.2 * ridgeFalloff;
          break;

        case 'plane':
        default:
          // Standard flat terrain - all elevation from noise
          baseY = 0;
          break;
      }

      // Add noise detail on top of base topology
      const noiseDetail = addNoiseDetail(x, z, noise2D, freq, height, variant.terrainStyle);
      positions.setY(i, baseY + noiseDetail);
    }

    geo.computeVertexNormals();
    return geo;
  }, [gridWidth, gridHeight, variant.seedOffset, variant.noiseFrequency, variant.terrainHeight, variant.terrainStyle, variant.topology]);

  // Create shader material with uniforms - configured by variant
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(-100, -100) },
        uMouseRadius: { value: 2.5 },
        uNoiseScale: { value: 0.3 },
        uWaveAmplitude: { value: variant.waveAmplitude },
        uBaseColor: { value: new THREE.Color(variant.baseColor) },
        uHighlightColor: { value: new THREE.Color(0xee6018) }, // Orange accent
        uOpacity: { value: 0.7 },
      },
      wireframe: true,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, [variant.waveAmplitude, variant.baseColor]);

  // Update uniforms each frame - speed controlled by variant
  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime * variant.speed;

      // Smoothly interpolate mouse position
      const targetX = mousePosition.active ? mousePosition.x : -100;
      const targetZ = mousePosition.active ? mousePosition.z : -100;

      const currentMouse = materialRef.current.uniforms.uMouse.value;
      currentMouse.x += (targetX - currentMouse.x) * 0.1;
      currentMouse.y += (targetZ - currentMouse.y) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
      <primitive object={material} ref={materialRef} attach="material" />
    </mesh>
  );
}
