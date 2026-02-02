"use client";

import { useRef, useState, useCallback, Suspense, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { SectorGrid } from "./SectorGrid";

interface SectorGridCanvasProps {
  isMobile: boolean;
  isVisible: boolean;
}

// Mouse tracking for grid interaction
function MouseTracker({
  onMouseUpdate,
  enabled,
}: {
  onMouseUpdate: (pos: { x: number; z: number; active: boolean }) => void;
  enabled: boolean;
}) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // XZ plane at y=0
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
        onMouseUpdate({ x: -100, z: -100, active: false });
        return;
      }

      raycaster.current.setFromCamera(mouse.current, camera);

      if (
        raycaster.current.ray.intersectPlane(plane.current, intersection.current)
      ) {
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

// Mobile ambient wave animation
function AmbientWave({
  onWaveUpdate,
}: {
  onWaveUpdate: (pos: { x: number; z: number; active: boolean }) => void;
}) {
  const wavePosition = useRef(new THREE.Vector2(-6, 0));
  const waveDirection = useRef(1);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Wave sweeps across the grid
    const waveSpeed = 0.8;
    wavePosition.current.x += waveDirection.current * 0.02 * waveSpeed;

    // Bounce wave at edges
    if (wavePosition.current.x > 6) {
      waveDirection.current = -1;
    } else if (wavePosition.current.x < -6) {
      waveDirection.current = 1;
    }

    // Add subtle vertical drift
    wavePosition.current.y = Math.sin(time * 0.3) * 2;

    onWaveUpdate({
      x: wavePosition.current.x,
      z: wavePosition.current.y,
      active: true,
    });
  });

  return null;
}

// Gentle camera drift for mobile
function CameraDrift({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const basePosition = useRef(new THREE.Vector3(6, 7, 8));

  useFrame((state) => {
    if (!enabled) return;

    const time = state.clock.elapsedTime;

    camera.position.x = basePosition.current.x + Math.sin(time * 0.08) * 0.4;
    camera.position.y = basePosition.current.y + Math.cos(time * 0.06) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Scene content
function Scene({ isMobile, isVisible }: SectorGridCanvasProps) {
  const [mousePosition, setMousePosition] = useState({
    x: -100,
    z: -100,
    active: false,
  });

  const handleMouseUpdate = useCallback(
    (pos: { x: number; z: number; active: boolean }) => {
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

      {/* Ambient wave for mobile */}
      {isMobile && <AmbientWave onWaveUpdate={handleMouseUpdate} />}

      {/* Camera drift for mobile */}
      <CameraDrift enabled={isMobile} />

      {/* Main sector grid */}
      <SectorGrid mousePosition={mousePosition} isMobile={isMobile} />

      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={0.4} color="#ffffff" />
      <pointLight position={[8, 5, 0]} intensity={0.3} color="#ee6018" />
    </>
  );
}

export function SectorGridCanvas({ isMobile, isVisible }: SectorGridCanvasProps) {
  // Position camera for isometric-like view, offset to the right on desktop
  const cameraPosition: [number, number, number] = isMobile
    ? [5, 6, 7]
    : [6, 7, 8];

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
        position: cameraPosition,
        fov: 45,
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
