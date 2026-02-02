"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PulseOrigin } from "./BeaconCanvas";

interface ReceiverNodesProps {
  pulseOrigins: PulseOrigin[];
  beaconPosition: THREE.Vector3;
  isMobile: boolean;
}

// Design system colors
const ORANGE = new THREE.Color("#ee6018");
const WARM_GRAY = new THREE.Color("#b8b3b0");

interface NodeState {
  position: THREE.Vector3;
  baseOpacity: number;
  activeOpacity: number;
  activationTime: number;
}

export function ReceiverNodes({
  pulseOrigins,
  beaconPosition,
  isMobile,
}: ReceiverNodesProps) {
  const nodesRef = useRef<THREE.Group>(null);
  const connectionsRef = useRef<THREE.Group>(null);
  const nodeStates = useRef<Map<number, NodeState>>(new Map());

  // Generate receiver node positions around the edges
  const nodePositions = useMemo(() => {
    const positions: THREE.Vector3[] = [];
    const nodeCount = isMobile ? 8 : 12;
    const radius = isMobile ? 4 : 6;

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * Math.PI * 2;
      // Add some variation to radius
      const r = radius + Math.sin(angle * 3) * 0.5;
      // Offset based on beacon position to create asymmetry on desktop
      const offsetX = isMobile ? 0 : beaconPosition.x * 0.3;
      positions.push(
        new THREE.Vector3(Math.cos(angle) * r + offsetX, Math.sin(angle) * r, 0)
      );
    }

    return positions;
  }, [isMobile, beaconPosition]);

  // Initialize node states
  useMemo(() => {
    nodePositions.forEach((pos, i) => {
      if (!nodeStates.current.has(i)) {
        nodeStates.current.set(i, {
          position: pos,
          baseOpacity: 0.2 + Math.random() * 0.1,
          activeOpacity: 0,
          activationTime: 0,
        });
      }
    });
  }, [nodePositions]);

  // Connection lines from beacon to nodes (using primitive pattern)
  const connectionLines = useMemo(() => {
    const lines: THREE.Line[] = [];

    nodePositions.forEach((nodePos) => {
      const points = [beaconPosition.clone(), nodePos.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: WARM_GRAY,
        transparent: true,
        opacity: 0.05,
        depthWrite: false,
      });
      lines.push(new THREE.Line(geometry, material));
    });

    return lines;
  }, [nodePositions, beaconPosition]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (!nodesRef.current) return;

    // Check each pulse's effect on nodes
    nodePositions.forEach((nodePos, nodeIndex) => {
      const nodeState = nodeStates.current.get(nodeIndex);
      if (!nodeState) return;

      let maxActivation = 0;

      // Check if any pulse wave is reaching this node
      pulseOrigins.forEach((pulse) => {
        const pulseAge = time - pulse.time;
        const pulseSpeed = isMobile ? 1.8 : 2.5; // units per second
        const pulseRadius = pulseAge * pulseSpeed;
        const pulseFadeStart = 2.5;

        // Distance from pulse origin to this node
        const distToNode = Math.sqrt(
          Math.pow(nodePos.x - pulse.x, 2) + Math.pow(nodePos.y - pulse.y, 2)
        );

        // Check if pulse wave is at this node (with some tolerance)
        const tolerance = 0.8;
        const distFromWave = Math.abs(pulseRadius - distToNode);

        if (distFromWave < tolerance && pulseAge < pulseFadeStart) {
          // Calculate activation based on how close the wave is
          const waveFit = 1 - distFromWave / tolerance;
          const ageFade = 1 - pulseAge / pulseFadeStart;
          maxActivation = Math.max(maxActivation, waveFit * ageFade);
        }
      });

      // Update node activation
      nodeState.activeOpacity = THREE.MathUtils.lerp(
        nodeState.activeOpacity,
        maxActivation,
        0.1
      );

      // Update node mesh
      const nodeMesh = nodesRef.current?.children[nodeIndex] as THREE.Mesh;
      if (nodeMesh) {
        const material = nodeMesh.material as THREE.MeshBasicMaterial;
        const totalOpacity =
          nodeState.baseOpacity + nodeState.activeOpacity * 0.8;
        material.opacity = totalOpacity;
        material.color.copy(WARM_GRAY).lerp(ORANGE, nodeState.activeOpacity);

        // Scale up when activated
        const scale = 1 + nodeState.activeOpacity * 0.5;
        nodeMesh.scale.setScalar(scale);
      }
    });

    // Animate connection lines
    if (connectionsRef.current) {
      connectionsRef.current.children.forEach((child, i) => {
        const nodeState = nodeStates.current.get(i);
        const lineMesh = child as THREE.Line;
        const material = lineMesh.material as THREE.LineBasicMaterial;

        // Base subtle visibility + activation glow
        const baseOpacity = 0.05;
        const activeBoost = nodeState ? nodeState.activeOpacity * 0.3 : 0;
        material.opacity = baseOpacity + activeBoost;
        material.color.copy(WARM_GRAY).lerp(ORANGE, activeBoost / 0.3);
      });
    }
  });

  return (
    <group>
      {/* Receiver nodes */}
      <group ref={nodesRef}>
        {nodePositions.map((pos, i) => (
          <mesh key={`node-${i}`} position={pos}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial
              color={WARM_GRAY}
              transparent
              opacity={0.2}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>

      {/* Connection lines (very subtle) - using primitive pattern */}
      <group ref={connectionsRef}>
        {connectionLines.map((line, i) => (
          <primitive key={`connection-${i}`} object={line} />
        ))}
      </group>

      {/* Outer boundary ring (very subtle) */}
      <mesh position={[isMobile ? 0 : beaconPosition.x * 0.3, 0, -0.1]}>
        <ringGeometry
          args={[isMobile ? 4.5 : 6.5, isMobile ? 4.55 : 6.55, 64]}
        />
        <meshBasicMaterial
          color={WARM_GRAY}
          transparent
          opacity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
