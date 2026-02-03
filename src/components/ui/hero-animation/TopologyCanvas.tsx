"use client";

import { useRef, useState, useEffect, useCallback, Suspense } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { TopologySurface } from "./TopologySurface";
import { FlowPaths, FlowParticles } from "./FlowPaths";
import type { AnimationVariant } from "./variants";

interface TopologyCanvasProps {
  isMobile: boolean;
  isVisible: boolean;
  variant: AnimationVariant;
}

// Component to handle mouse raycasting within R3F context
function MouseTracker({
  onMouseUpdate,
  enabled,
}: {
  onMouseUpdate: (pos: { x: number; z: number; active: boolean }) => void;
  enabled: boolean;
}) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0));
  const mouse = useRef(new THREE.Vector2());
  const intersection = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!enabled) return;

    const canvas = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      // Convert to NDC
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Check bounds with padding
      const padding = 50;
      const isWithinBounds =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (!isWithinBounds) {
        onMouseUpdate({ x: -100, z: -100, active: false });
        return;
      }

      // Raycast to XZ plane
      raycaster.current.setFromCamera(mouse.current, camera);

      if (raycaster.current.ray.intersectPlane(plane.current, intersection.current)) {
        onMouseUpdate({
          x: intersection.current.x,
          z: intersection.current.z,
          active: true,
        });
      }
    };

    const handleMouseLeave = () => {
      onMouseUpdate({ x: -100, z: -100, active: false });
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [camera, gl, enabled, onMouseUpdate]);

  return null;
}

// Mobile ambient animation - periodic pulses from random peaks
function AmbientPulser({
  onPulse,
}: {
  onPulse: (pos: { x: number; z: number; active: boolean }) => void;
}) {
  const lastPulseTime = useRef(0);
  const currentPulse = useRef<{ x: number; z: number; startTime: number } | null>(null);

  const peakPositions = [
    { x: 3.5, z: -1.5 },
    { x: 4.8, z: 0.5 },
    { x: 3.2, z: 1.8 },
    { x: 1.5, z: 0 },
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Start new pulse every 4-6 seconds
    if (time - lastPulseTime.current > 4 + Math.random() * 2) {
      const randomPeak = peakPositions[Math.floor(Math.random() * peakPositions.length)];
      currentPulse.current = { ...randomPeak, startTime: time };
      lastPulseTime.current = time;
    }

    // Animate current pulse
    if (currentPulse.current) {
      const pulseAge = time - currentPulse.current.startTime;
      const pulseDuration = 2.0;

      if (pulseAge < pulseDuration) {
        // Pulse is active
        onPulse({ x: currentPulse.current.x, z: currentPulse.current.z, active: true });
      } else {
        // Pulse ended
        onPulse({ x: -100, z: -100, active: false });
        currentPulse.current = null;
      }
    }
  });

  return null;
}

// Camera drift for mobile
function CameraDrift({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const basePosition = useRef(new THREE.Vector3(0, 4, 6));

  useFrame((state) => {
    if (!enabled) return;

    const time = state.clock.elapsedTime;

    // Gentle camera drift
    camera.position.x = basePosition.current.x + Math.sin(time * 0.1) * 0.3;
    camera.position.y = basePosition.current.y + Math.cos(time * 0.08) * 0.15;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Pause rendering when not visible
function VisibilityController({ isVisible }: { isVisible: boolean }) {
  const { gl } = useThree();

  useEffect(() => {
    // R3F handles frame loop internally, but we can set a flag
    // The parent component controls actual rendering
  }, [isVisible, gl]);

  return null;
}

// Scene content - always mounted to prevent WebGL context issues on navigation
function Scene({ isMobile, isVisible, variant }: TopologyCanvasProps) {
  const [mousePosition, setMousePosition] = useState({ x: -100, z: -100, active: false });

  const handleMouseUpdate = useCallback(
    (pos: { x: number; z: number; active: boolean }) => {
      setMousePosition(pos);
    },
    []
  );

  // Note: We no longer return null when !isVisible
  // The frameloop="never" on Canvas handles pausing, and keeping objects mounted
  // prevents WebGL context issues when navigating back to the page

  return (
    <>
      {/* Mouse tracking for desktop */}
      {!isMobile && <MouseTracker onMouseUpdate={handleMouseUpdate} enabled={true} />}

      {/* Ambient pulses for mobile */}
      {isMobile && <AmbientPulser onPulse={handleMouseUpdate} />}

      {/* Camera drift for mobile */}
      <CameraDrift enabled={isMobile} />

      {/* Main topology surface */}
      <TopologySurface isMobile={isMobile} mousePosition={mousePosition} variant={variant} />

      {/* Flow paths between peaks */}
      <FlowPaths isMobile={isMobile} />

      {/* Traveling particles */}
      <FlowParticles isMobile={isMobile} />

      {/* Subtle ambient lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={0.3} color="#ee6018" />
    </>
  );
}

export function TopologyCanvas({ isMobile, isVisible, variant }: TopologyCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "high-performance",
        preserveDrawingBuffer: false,
      }}
      camera={{
        position: [0, 4, 6],
        fov: 50,
        near: 0.1,
        far: 100,
      }}
      style={{ background: "transparent" }}
      // Pause frame loop when not visible
      frameloop={isVisible ? "always" : "never"}
    >
      <Suspense fallback={null}>
        <Scene isMobile={isMobile} isVisible={isVisible} variant={variant} />
      </Suspense>
    </Canvas>
  );
}
