"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface MousePosition {
  /** World-space X coordinate */
  x: number;
  /** World-space Z coordinate (we map Y screen to Z world since plane is horizontal) */
  z: number;
  /** Whether mouse is actively over the canvas area */
  active: boolean;
}

/**
 * Tracks mouse position and converts to world coordinates for the topology surface.
 * The surface lies on the XZ plane, so we need to raycast to find intersection.
 */
export function useMousePosition(
  canvasRef: React.RefObject<HTMLElement | null>,
  camera: THREE.Camera | null,
  enabled: boolean = true
) {
  const [position, setPosition] = useState<MousePosition>({
    x: -100,
    z: -100,
    active: false,
  });

  const raycaster = useRef(new THREE.Raycaster());
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)); // XZ plane at y=0
  const mouse = useRef(new THREE.Vector2());
  const intersection = useRef(new THREE.Vector3());
  const rafId = useRef<number | null>(null);
  const pendingEvent = useRef<MouseEvent | null>(null);

  useEffect(() => {
    if (!enabled || !camera) return;

    const processMouseMove = () => {
      const e = pendingEvent.current;
      if (!e) return;
      pendingEvent.current = null;
      rafId.current = null;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();

      // Convert to NDC (-1 to 1)
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Check if mouse is within canvas bounds (with padding)
      const padding = 50;
      const isWithinBounds =
        e.clientX >= rect.left - padding &&
        e.clientX <= rect.right + padding &&
        e.clientY >= rect.top - padding &&
        e.clientY <= rect.bottom + padding;

      if (!isWithinBounds) {
        setPosition({ x: -100, z: -100, active: false });
        return;
      }

      // Raycast to find intersection with XZ plane
      raycaster.current.setFromCamera(mouse.current, camera);

      if (raycaster.current.ray.intersectPlane(plane.current, intersection.current)) {
        setPosition({
          x: intersection.current.x,
          z: intersection.current.z,
          active: true,
        });
      }
    };

    // Throttle mousemove with RAF to prevent layout thrashing
    const handleMouseMove = (e: MouseEvent) => {
      pendingEvent.current = e;
      if (rafId.current === null) {
        rafId.current = requestAnimationFrame(processMouseMove);
      }
    };

    const handleMouseLeave = () => {
      pendingEvent.current = null;
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
        rafId.current = null;
      }
      setPosition({ x: -100, z: -100, active: false });
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current !== null) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [canvasRef, camera, enabled]);

  return position;
}

/**
 * Simple hook that returns mouse position in normalized device coordinates.
 * Used by R3F components that need raw NDC values.
 */
export function useMouseNDC(enabled: boolean = true) {
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, [enabled]);

  return mouseRef;
}
