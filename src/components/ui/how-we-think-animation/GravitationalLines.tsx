"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GravitationalLinesProps {
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Same orbital configs as nodes for position calculation
const orbitalConfigs = [
  { radius: 2.8, speed: 0.3, phase: 0, tilt: 0.1 },
  { radius: 2.2, speed: -0.4, phase: Math.PI / 2, tilt: -0.15 },
  { radius: 3.2, speed: 0.25, phase: Math.PI, tilt: 0.2 },
  { radius: 2.5, speed: -0.35, phase: (3 * Math.PI) / 2, tilt: -0.1 },
];

// Connection pairs between nodes (and to center)
const connections = [
  { from: -1, to: 0 }, // Center to node 0
  { from: -1, to: 1 }, // Center to node 1
  { from: -1, to: 2 }, // Center to node 2
  { from: -1, to: 3 }, // Center to node 3
  { from: 0, to: 1 }, // Node connections
  { from: 1, to: 2 },
  { from: 2, to: 3 },
  { from: 3, to: 0 },
];

// Shader for gravitational lines
const lineVertexShader = `
attribute float alpha;
varying float vAlpha;
varying vec3 vPosition;

void main() {
  vAlpha = alpha;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const lineFragmentShader = `
uniform vec3 uColor;
uniform vec3 uHighlightColor;
uniform float uTime;
uniform float uMouseInfluence;

varying float vAlpha;
varying vec3 vPosition;

void main() {
  // Flowing energy effect along the line
  float flow = sin(vPosition.x * 3.0 + vPosition.y * 3.0 - uTime * 2.0) * 0.5 + 0.5;

  // Mix colors based on mouse influence
  vec3 color = mix(uColor, uHighlightColor, uMouseInfluence * flow * 0.7);

  // Base alpha with flow modulation
  float alpha = vAlpha * (0.55 + flow * 0.25 + uMouseInfluence * 0.3);

  gl_FragColor = vec4(color, alpha);
}
`;

function GravitationalLine({
  fromIndex,
  toIndex,
  mousePosition,
  isMobile,
  groupOffset,
}: {
  fromIndex: number;
  toIndex: number;
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
  groupOffset: number;
}) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Store current positions for smooth updates
  const fromPos = useRef(new THREE.Vector3());
  const toPos = useRef(new THREE.Vector3());

  // Segments for curved line
  const segmentCount = isMobile ? 16 : 24;

  // Create geometry with position and alpha attributes
  const geometry = useMemo(() => {
    const positions = new Float32Array((segmentCount + 1) * 3);
    const alphas = new Float32Array(segmentCount + 1);

    // Initialize alpha values (fade at edges)
    for (let i = 0; i <= segmentCount; i++) {
      const t = i / segmentCount;
      // Fade in from 0, peak at middle, fade out to 1
      alphas[i] = Math.sin(t * Math.PI) * 0.8;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("alpha", new THREE.BufferAttribute(alphas, 1));

    return geo;
  }, [segmentCount]);

  // Shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: lineVertexShader,
      fragmentShader: lineFragmentShader,
      uniforms: {
        uColor: { value: new THREE.Color(0xb8b3b0) },
        uHighlightColor: { value: new THREE.Color(0xee6018) },
        uTime: { value: 0 },
        uMouseInfluence: { value: 0 },
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Create the Line object
  const lineObject = useMemo(() => {
    return new THREE.Line(geometry, material);
  }, [geometry, material]);

  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.elapsedTime;

    // Calculate from position
    if (fromIndex === -1) {
      // Center
      fromPos.current.set(0, 0, 0);
    } else {
      const config = orbitalConfigs[fromIndex];
      const angle = time * config.speed + config.phase;
      fromPos.current.set(
        Math.cos(angle) * config.radius,
        Math.sin(angle) * config.radius,
        Math.sin(angle) * config.tilt * config.radius
      );
    }

    // Calculate to position
    if (toIndex === -1) {
      toPos.current.set(0, 0, 0);
    } else {
      const config = orbitalConfigs[toIndex];
      const angle = time * config.speed + config.phase;
      toPos.current.set(
        Math.cos(angle) * config.radius,
        Math.sin(angle) * config.radius,
        Math.sin(angle) * config.tilt * config.radius
      );
    }

    // Update line geometry with subtle curve
    const positionAttr = geometry.attributes.position as THREE.BufferAttribute;
    const midPoint = fromPos.current.clone().add(toPos.current).multiplyScalar(0.5);

    // Add subtle perpendicular displacement for curve
    const direction = toPos.current.clone().sub(fromPos.current).normalize();
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0);
    const curveAmount = 0.2 + Math.sin(time * 0.5) * 0.1;
    midPoint.add(perpendicular.multiplyScalar(curveAmount));

    for (let i = 0; i <= segmentCount; i++) {
      const t = i / segmentCount;

      // Quadratic bezier interpolation
      const oneMinusT = 1 - t;
      const p = new THREE.Vector3()
        .addScaledVector(fromPos.current, oneMinusT * oneMinusT)
        .addScaledVector(midPoint, 2 * oneMinusT * t)
        .addScaledVector(toPos.current, t * t);

      positionAttr.setXYZ(i, p.x, p.y, p.z);
    }

    positionAttr.needsUpdate = true;

    // Calculate mouse influence
    const adjustedMousePos = new THREE.Vector3(
      mousePosition.x - groupOffset,
      mousePosition.y,
      mousePosition.z
    );

    const midPointWorld = midPoint.clone();
    const distToMouse = adjustedMousePos.distanceTo(midPointWorld);
    const mouseInfluence = mousePosition.active ? Math.max(0, 1 - distToMouse / 4) : 0;

    // Update uniforms
    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uMouseInfluence.value = mouseInfluence;
  });

  return (
    <primitive object={lineObject}>
      <primitive object={material} ref={materialRef} attach="material" />
    </primitive>
  );
}

export function GravitationalLines({ mousePosition, isMobile }: GravitationalLinesProps) {
  const groupOffset = 0;

  return (
    <group position={[groupOffset, 0, 0]}>
      {connections.map((conn, index) => (
        <GravitationalLine
          key={index}
          fromIndex={conn.from}
          toIndex={conn.to}
          mousePosition={mousePosition}
          isMobile={isMobile}
          groupOffset={groupOffset}
        />
      ))}
    </group>
  );
}
