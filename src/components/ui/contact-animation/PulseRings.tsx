"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PulseOrigin } from "./BeaconCanvas";

interface PulseRingsProps {
  pulseOrigins: PulseOrigin[];
  beaconPosition: THREE.Vector3;
  isMobile: boolean;
}

// Design system colors
const ORANGE = new THREE.Color("#ee6018");
const WARM_GRAY = new THREE.Color("#b8b3b0");

// Create circle geometry for rings
function createCircleGeometry(segments: number = 64): THREE.BufferGeometry {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0));
  }
  return new THREE.BufferGeometry().setFromPoints(points);
}

// Individual pulse ring component
function PulseRing({
  origin,
  currentTime,
  maxRadius,
  lifespan,
}: {
  origin: PulseOrigin;
  currentTime: number;
  maxRadius: number;
  lifespan: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  // Create line objects with materials
  const { primaryLine, secondaryLine } = useMemo(() => {
    const geometry = createCircleGeometry();

    const primaryMat = new THREE.LineBasicMaterial({
      color: ORANGE,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    const secondaryMat = new THREE.LineBasicMaterial({
      color: WARM_GRAY,
      transparent: true,
      opacity: 0.3,
      depthWrite: false,
    });

    return {
      primaryLine: new THREE.Line(geometry, primaryMat),
      secondaryLine: new THREE.Line(geometry.clone(), secondaryMat),
    };
  }, []);

  useFrame(() => {
    const age = currentTime - origin.time;
    const progress = age / lifespan;

    if (progress > 1 || progress < 0) {
      primaryLine.visible = false;
      secondaryLine.visible = false;
      return;
    }

    // Eased expansion
    const easedProgress = 1 - Math.pow(1 - progress, 2);
    const radius = easedProgress * maxRadius;

    // Opacity fades out as ring expands
    const opacity = Math.max(0, 1 - progress * 1.2);

    primaryLine.visible = true;
    primaryLine.scale.setScalar(radius);
    primaryLine.position.set(origin.x, origin.y, origin.z);
    (primaryLine.material as THREE.LineBasicMaterial).opacity = opacity * 0.6;

    // Secondary ring follows slightly behind
    const secondaryProgress = Math.max(0, progress - 0.1);
    const secondaryEased = 1 - Math.pow(1 - secondaryProgress, 2);
    const secondaryRadius = secondaryEased * maxRadius;
    const secondaryOpacity = Math.max(0, 1 - (secondaryProgress + 0.1) * 1.2);

    secondaryLine.visible = secondaryProgress > 0;
    secondaryLine.scale.setScalar(secondaryRadius);
    secondaryLine.position.set(origin.x, origin.y, origin.z);
    (secondaryLine.material as THREE.LineBasicMaterial).opacity =
      secondaryOpacity * 0.3;
  });

  return (
    <group ref={groupRef}>
      <primitive object={primaryLine} />
      <primitive object={secondaryLine} />
    </group>
  );
}

// Background rings that pulse from beacon periodically
function BeaconPulse({
  beaconPosition,
  isMobile,
}: {
  beaconPosition: THREE.Vector3;
  isMobile: boolean;
}) {
  // Create three line objects for continuous wave effect
  const lines = useMemo(() => {
    const geometry = createCircleGeometry();
    const result: THREE.Line[] = [];

    for (let i = 0; i < 3; i++) {
      const material = new THREE.LineBasicMaterial({
        color: WARM_GRAY,
        transparent: true,
        opacity: 0.15,
        depthWrite: false,
      });
      result.push(new THREE.Line(geometry.clone(), material));
    }

    return result;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    lines.forEach((line, i) => {
      // Each ring cycles every 3 seconds, offset by 1 second
      const cycleTime = 3;
      const adjustedTime = (time + i) % cycleTime;
      const progress = adjustedTime / cycleTime;

      const maxRadius = isMobile ? 5 : 7;
      const radius = progress * maxRadius * 0.5 + 0.5; // Start at 0.5, grow to maxRadius/2
      const opacity = Math.max(0, 0.15 * (1 - progress));

      line.scale.setScalar(radius);
      line.position.copy(beaconPosition);
      (line.material as THREE.LineBasicMaterial).opacity = opacity;
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

export function PulseRings({
  pulseOrigins,
  beaconPosition,
  isMobile,
}: PulseRingsProps) {
  const clockRef = useRef(0);
  const maxRadius = isMobile ? 5 : 8;
  const lifespan = 3; // seconds

  useFrame((state) => {
    clockRef.current = state.clock.elapsedTime;
  });

  // Filter active pulses
  const activePulses = useMemo(() => {
    return pulseOrigins.filter((p) => clockRef.current - p.time < lifespan);
  }, [pulseOrigins, lifespan]);

  return (
    <group>
      {/* Background continuous waves from beacon */}
      <BeaconPulse beaconPosition={beaconPosition} isMobile={isMobile} />

      {/* Interactive pulse rings */}
      {activePulses.map((origin, index) => (
        <PulseRing
          key={`${origin.time}-${index}`}
          origin={origin}
          currentTime={clockRef.current}
          maxRadius={maxRadius}
          lifespan={lifespan}
        />
      ))}
    </group>
  );
}
