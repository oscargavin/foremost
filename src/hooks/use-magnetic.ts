"use client";

import { useRef, useState, useCallback } from "react";

interface MagneticState {
  x: number;
  y: number;
}

interface UseMagneticOptions {
  strength?: number;
  radius?: number;
}

export function useMagnetic({ strength = 0.3, radius = 100 }: UseMagneticOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<MagneticState>({ x: 0, y: 0 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;
      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      if (distance < radius) {
        const pull = (radius - distance) / radius;
        setPosition({
          x: distanceX * strength * pull,
          y: distanceY * strength * pull,
        });
      }
    },
    [strength, radius]
  );

  const handleMouseLeave = useCallback(() => {
    setPosition({ x: 0, y: 0 });
  }, []);

  return {
    ref,
    position,
    handlers: {
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
}
