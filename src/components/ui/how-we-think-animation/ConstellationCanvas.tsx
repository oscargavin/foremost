"use client";

import { useRef, useState, useCallback, Suspense, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitalNodes } from "./OrbitalNodes";
import { GravitationalLines } from "./GravitationalLines";
import { CentralCore } from "./CentralCore";

interface ConstellationCanvasProps {
  isMobile: boolean;
  isVisible: boolean;
}

// Mouse tracking for orbital interaction
function MouseTracker({
  onMouseUpdate,
  enabled,
}: {
  onMouseUpdate: (pos: { x: number; y: number; z: number; active: boolean }) => void;
  enabled: boolean;
}) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const mouse = useRef(new THREE.Vector2());
  const intersection = useRef(new THREE.Vector3());

  useEffect(() => {
    if (!enabled) return;

    const canvas = gl.domElement;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const padding = 50;
      const isWithinBounds =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (!isWithinBounds) {
        onMouseUpdate({ x: -100, y: -100, z: -100, active: false });
        return;
      }

      raycaster.current.setFromCamera(mouse.current, camera);

      if (raycaster.current.ray.intersectPlane(plane.current, intersection.current)) {
        onMouseUpdate({
          x: intersection.current.x,
          y: intersection.current.y,
          z: intersection.current.z,
          active: true,
        });
      }
    };

    const handleMouseLeave = () => {
      onMouseUpdate({ x: -100, y: -100, z: -100, active: false });
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

// Mobile ambient pulses
function AmbientPulser({
  onPulse,
}: {
  onPulse: (pos: { x: number; y: number; z: number; active: boolean }) => void;
}) {
  const lastPulseTime = useRef(0);
  const currentPulse = useRef<{ x: number; y: number; z: number; startTime: number } | null>(null);

  // Pulse positions around the orbital paths
  const pulsePositions = [
    { x: 2.5, y: 1.5, z: 0 },
    { x: -1.5, y: 2, z: 0 },
    { x: -2, y: -1.5, z: 0 },
    { x: 1.5, y: -2, z: 0 },
  ];

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    if (time - lastPulseTime.current > 3.5 + Math.random() * 2) {
      const randomPos = pulsePositions[Math.floor(Math.random() * pulsePositions.length)];
      currentPulse.current = { ...randomPos, startTime: time };
      lastPulseTime.current = time;
    }

    if (currentPulse.current) {
      const pulseAge = time - currentPulse.current.startTime;
      const pulseDuration = 2.5;

      if (pulseAge < pulseDuration) {
        onPulse({
          x: currentPulse.current.x,
          y: currentPulse.current.y,
          z: currentPulse.current.z,
          active: true,
        });
      } else {
        onPulse({ x: -100, y: -100, z: -100, active: false });
        currentPulse.current = null;
      }
    }
  });

  return null;
}

// Gentle camera drift for mobile
function CameraDrift({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const basePosition = useRef(new THREE.Vector3(0, 0, 10));

  useFrame((state) => {
    if (!enabled) return;

    const time = state.clock.elapsedTime;

    camera.position.x = basePosition.current.x + Math.sin(time * 0.08) * 0.25;
    camera.position.y = basePosition.current.y + Math.cos(time * 0.06) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Scene content
function Scene({ isMobile, isVisible }: ConstellationCanvasProps) {
  const [mousePosition, setMousePosition] = useState({
    x: -100,
    y: -100,
    z: -100,
    active: false,
  });

  const handleMouseUpdate = useCallback(
    (pos: { x: number; y: number; z: number; active: boolean }) => {
      setMousePosition(pos);
    },
    []
  );

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Mouse tracking for desktop */}
      {!isMobile && <MouseTracker onMouseUpdate={handleMouseUpdate} enabled={true} />}

      {/* Ambient pulses for mobile */}
      {isMobile && <AmbientPulser onPulse={handleMouseUpdate} />}

      {/* Camera drift for mobile */}
      <CameraDrift enabled={isMobile} />

      {/* Central core representing unified thinking */}
      <CentralCore mousePosition={mousePosition} isMobile={isMobile} />

      {/* Four orbital nodes representing core beliefs */}
      <OrbitalNodes mousePosition={mousePosition} isMobile={isMobile} />

      {/* Gravitational connection lines */}
      <GravitationalLines mousePosition={mousePosition} isMobile={isMobile} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#ee6018" />
      <pointLight position={[-5, -5, 5]} intensity={0.15} color="#b8b3b0" />
    </>
  );
}

export function ConstellationCanvas({ isMobile, isVisible }: ConstellationCanvasProps) {
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
        position: [0, 0, 10],
        fov: 50,
        near: 0.1,
        far: 100,
      }}
      style={{ background: "transparent" }}
      frameloop={isVisible ? "always" : "never"}
    >
      <Suspense fallback={null}>
        <Scene isMobile={isMobile} isVisible={isVisible} />
      </Suspense>
    </Canvas>
  );
}
