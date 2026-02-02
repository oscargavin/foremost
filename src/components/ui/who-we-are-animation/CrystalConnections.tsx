"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CrystalConnectionsProps {
  seedPositions: THREE.Vector3[];
  mousePosition: { x: number; y: number; z: number; active: boolean };
  isMobile: boolean;
}

// Connection shader for animated energy flow
const connectionVertexShader = `
attribute float lineDistance;
varying float vLineDistance;
varying vec3 vPosition;

void main() {
  vLineDistance = lineDistance;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const connectionFragmentShader = `
uniform float uTime;
uniform float uDashSize;
uniform float uGapSize;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uFlowSpeed;

varying float vLineDistance;
varying vec3 vPosition;

void main() {
  // Animated dash pattern
  float dashOffset = uTime * uFlowSpeed;
  float totalSize = uDashSize + uGapSize;
  float pattern = mod(vLineDistance + dashOffset, totalSize);

  // Soft dash edges
  float dash = smoothstep(0.0, uDashSize * 0.1, pattern) *
               smoothstep(uDashSize, uDashSize * 0.9, pattern);

  if (dash < 0.1) discard;

  // Energy pulse effect
  float pulse = sin(vLineDistance * 3.0 - uTime * 4.0) * 0.5 + 0.5;

  vec3 color = uColor * (1.0 + pulse * 0.3);
  float alpha = uOpacity * dash * (0.7 + pulse * 0.3);

  gl_FragColor = vec4(color, alpha);
}
`;

function Connection({
  start,
  end,
  index,
  mousePosition,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  index: number;
  mousePosition: { x: number; y: number; z: number; active: boolean };
}) {
  const lineRef = useRef<THREE.Line>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Create curved path between seeds
  const { geometry } = useMemo(() => {
    const midPoint = start.clone().add(end).multiplyScalar(0.5);

    // Add curve perpendicular to the connection line
    const direction = end.clone().sub(start).normalize();
    const perpendicular = new THREE.Vector3(-direction.y, direction.x, 0).normalize();

    // Curve outward based on connection index
    const curveAmount = 0.4 + (index % 2 === 0 ? 0.2 : -0.2);
    midPoint.add(perpendicular.multiplyScalar(curveAmount));

    // Also add some z-depth for visual interest
    midPoint.z += 0.3 * Math.sin(index * 1.5);

    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    const points = curve.getPoints(40);

    const geo = new THREE.BufferGeometry().setFromPoints(points);

    // Calculate line distances for dash animation
    const distances: number[] = [0];
    for (let i = 1; i < points.length; i++) {
      distances.push(distances[i - 1] + points[i - 1].distanceTo(points[i]));
    }
    geo.setAttribute("lineDistance", new THREE.Float32BufferAttribute(distances, 1));

    return { geometry: geo };
  }, [start, end, index]);

  // Shader material
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: connectionVertexShader,
      fragmentShader: connectionFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uDashSize: { value: 0.15 },
        uGapSize: { value: 0.1 },
        uColor: { value: new THREE.Color(0xee6018) },
        uOpacity: { value: 0.7 },
        uFlowSpeed: { value: 0.8 + index * 0.1 },
      },
      transparent: true,
      depthWrite: false,
    });
  }, [index]);

  // Create line object
  const line = useMemo(() => {
    return new THREE.Line(geometry, material);
  }, [geometry, material]);

  useFrame((state) => {
    if (!materialRef.current) return;

    const time = state.clock.elapsedTime;

    // Calculate mouse proximity to connection midpoint
    const midPoint = start.clone().add(end).multiplyScalar(0.5);
    const mouseVec = new THREE.Vector3(mousePosition.x, mousePosition.y, mousePosition.z);
    const distToMouse = mouseVec.distanceTo(midPoint);
    const mouseInfluence = mousePosition.active ? Math.max(0, 1 - distToMouse / 3) : 0;

    materialRef.current.uniforms.uTime.value = time;
    materialRef.current.uniforms.uOpacity.value = 0.6 + mouseInfluence * 0.4;
    materialRef.current.uniforms.uFlowSpeed.value = 0.8 + index * 0.1 + mouseInfluence * 1.5;
  });

  return (
    <primitive object={line} ref={lineRef}>
      <primitive object={material} ref={materialRef} attach="material" />
    </primitive>
  );
}

export function CrystalConnections({
  seedPositions,
  mousePosition,
  isMobile,
}: CrystalConnectionsProps) {
  // Create connections between all seeds (triangle)
  const connections = useMemo(() => {
    const result: { start: THREE.Vector3; end: THREE.Vector3 }[] = [];

    for (let i = 0; i < seedPositions.length; i++) {
      for (let j = i + 1; j < seedPositions.length; j++) {
        result.push({
          start: seedPositions[i],
          end: seedPositions[j],
        });
      }
    }

    return result;
  }, [seedPositions]);

  return (
    <group>
      {connections.map((conn, i) => (
        <Connection
          key={i}
          start={conn.start}
          end={conn.end}
          index={i}
          mousePosition={mousePosition}
        />
      ))}
    </group>
  );
}
