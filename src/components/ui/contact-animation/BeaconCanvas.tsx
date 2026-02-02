"use client";

import { useRef, useState, useCallback, Suspense, useEffect } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { CentralBeacon } from "./CentralBeacon";
import { PulseRings } from "./PulseRings";
import { ReceiverNodes } from "./ReceiverNodes";

interface BeaconCanvasProps {
  isMobile: boolean;
  isVisible: boolean;
}

export interface PulseOrigin {
  x: number;
  y: number;
  z: number;
  time: number;
  isClick?: boolean;
}

// Mouse tracking for pulse interaction
function MouseTracker({
  onMouseUpdate,
  onPulseCreate,
  enabled,
}: {
  onMouseUpdate: (pos: { x: number; y: number; z: number; active: boolean }) => void;
  onPulseCreate: (pos: { x: number; y: number; z: number }) => void;
  enabled: boolean;
}) {
  const { camera, gl } = useThree();
  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)); // XY plane at z=0
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

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();

      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.current.setFromCamera(mouse.current, camera);

      if (raycaster.current.ray.intersectPlane(plane.current, intersection.current)) {
        onPulseCreate({
          x: intersection.current.x,
          y: intersection.current.y,
          z: intersection.current.z,
        });
      }
    };

    const handleMouseLeave = () => {
      onMouseUpdate({ x: -100, y: -100, z: -100, active: false });
    };

    document.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("click", handleClick);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [camera, gl, enabled, onMouseUpdate, onPulseCreate]);

  return null;
}

// Mobile ambient pulses from central beacon
function AmbientPulser({
  onPulseCreate,
  beaconPosition,
}: {
  onPulseCreate: (pos: { x: number; y: number; z: number }) => void;
  beaconPosition: THREE.Vector3;
}) {
  const lastPulseTime = useRef(0);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Pulse every 2.5-4 seconds
    if (time - lastPulseTime.current > 2.5 + Math.random() * 1.5) {
      onPulseCreate({
        x: beaconPosition.x,
        y: beaconPosition.y,
        z: beaconPosition.z,
      });
      lastPulseTime.current = time;
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

    camera.position.x = basePosition.current.x + Math.sin(time * 0.08) * 0.3;
    camera.position.y = basePosition.current.y + Math.cos(time * 0.06) * 0.2;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Scene content
function Scene({ isMobile, isVisible }: BeaconCanvasProps) {
  const [mousePosition, setMousePosition] = useState({
    x: -100,
    y: -100,
    z: -100,
    active: false,
  });
  const [pulseOrigins, setPulseOrigins] = useState<PulseOrigin[]>([]);
  const clockRef = useRef({ elapsedTime: 0 });

  // Central beacon position (CSS handles container positioning)
  const beaconPosition = new THREE.Vector3(0, 0, 0);

  const handleMouseUpdate = useCallback(
    (pos: { x: number; y: number; z: number; active: boolean }) => {
      setMousePosition(pos);
    },
    []
  );

  const handlePulseCreate = useCallback(
    (pos: { x: number; y: number; z: number }) => {
      setPulseOrigins((prev) => {
        // Limit total pulses to avoid memory issues
        const filtered = prev.filter(
          (p) => clockRef.current.elapsedTime - p.time < 4
        );
        return [
          ...filtered.slice(-10),
          { ...pos, time: clockRef.current.elapsedTime },
        ];
      });
    },
    []
  );

  // Update clock reference
  useFrame((state) => {
    clockRef.current.elapsedTime = state.clock.elapsedTime;
  });

  // Auto-pulse from central beacon on desktop
  useEffect(() => {
    if (isMobile) return;

    const interval = setInterval(() => {
      handlePulseCreate({
        x: beaconPosition.x,
        y: beaconPosition.y,
        z: beaconPosition.z,
      });
    }, 3000);

    // Initial pulse
    setTimeout(() => {
      handlePulseCreate({
        x: beaconPosition.x,
        y: beaconPosition.y,
        z: beaconPosition.z,
      });
    }, 500);

    return () => clearInterval(interval);
  }, [isMobile, beaconPosition.x, beaconPosition.y, beaconPosition.z, handlePulseCreate]);

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Mouse tracking for desktop */}
      {!isMobile && (
        <MouseTracker
          onMouseUpdate={handleMouseUpdate}
          onPulseCreate={handlePulseCreate}
          enabled={true}
        />
      )}

      {/* Ambient pulses for mobile */}
      {isMobile && (
        <AmbientPulser
          onPulseCreate={handlePulseCreate}
          beaconPosition={beaconPosition}
        />
      )}

      {/* Camera drift for mobile */}
      <CameraDrift enabled={isMobile} />

      {/* Central beacon point */}
      <CentralBeacon
        position={beaconPosition}
        mousePosition={mousePosition}
        isMobile={isMobile}
      />

      {/* Expanding pulse rings */}
      <PulseRings
        pulseOrigins={pulseOrigins}
        beaconPosition={beaconPosition}
        isMobile={isMobile}
      />

      {/* Receiver nodes around the edges */}
      <ReceiverNodes
        pulseOrigins={pulseOrigins}
        beaconPosition={beaconPosition}
        isMobile={isMobile}
      />

      {/* Subtle ambient lighting */}
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#ee6018" />
      <pointLight position={[-5, -5, 5]} intensity={0.15} color="#b8b3b0" />
    </>
  );
}

export function BeaconCanvas({ isMobile, isVisible }: BeaconCanvasProps) {
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
