"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Partnership Network Visualization
 *
 * Concept: A collaborative network that lights up with exploration,
 * representing the partnership between consultant and client.
 *
 * Desktop: Interactive - cursor proximity activates nodes and connections
 * Mobile: Ambient - gentle breathing network with flowing particles
 *
 * The animation tells the story: attention reveals connections.
 */

// ============================================================================
// SHARED TYPES & COLORS
// ============================================================================

interface Node {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  type: "primary" | "secondary" | "tertiary";
  pulsePhase: number;
  activated: number;
}

interface Particle {
  x: number;
  y: number;
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  size: number;
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  active: number;
}

const COLORS = {
  orange: "#ee6018",
  orangeGlow: "rgba(238, 96, 24, 0.4)",
  orangeSubtle: "rgba(238, 96, 24, 0.08)",
  gray: "#b8b3b0",
  grayLight: "rgba(184, 179, 176, 0.2)",
  graySubtle: "rgba(184, 179, 176, 0.08)",
  dark: "#1f1d1c",
  darkSubtle: "rgba(31, 29, 28, 0.6)",
};

// ============================================================================
// MOBILE VERSION - Ambient breathing network
// ============================================================================

function MobileAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const initNetwork = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    // Mobile: Sparse constellation on the right side
    const nodePositions = [
      { x: 0.15, y: 0.08, type: "tertiary" as const, radius: 2 },
      { x: 0.85, y: 0.12, type: "secondary" as const, radius: 3 },
      { x: 0.92, y: 0.25, type: "tertiary" as const, radius: 1.5 },
      { x: 0.88, y: 0.45, type: "primary" as const, radius: 4 },
      { x: 0.95, y: 0.62, type: "tertiary" as const, radius: 2 },
      { x: 0.78, y: 0.85, type: "secondary" as const, radius: 2.5 },
      { x: 0.12, y: 0.92, type: "tertiary" as const, radius: 1.5 },
      { x: 0.55, y: 0.95, type: "tertiary" as const, radius: 2 },
    ];

    nodePositions.forEach((pos) => {
      nodes.push({
        x: width * pos.x,
        y: height * pos.y,
        baseX: width * pos.x,
        baseY: height * pos.y,
        vx: 0,
        vy: 0,
        radius: pos.radius,
        type: pos.type,
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
      });
    });

    // Sparse connections
    const connectionPairs = [
      [1, 3],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 7],
    ];

    connectionPairs.forEach(([from, to]) => {
      connections.push({
        from,
        to,
        strength: 0.4,
        active: 0,
      });
    });

    nodesRef.current = nodes;
    connectionsRef.current = connections;
    particlesRef.current = [];
    setIsReady(true);
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const nodes = nodesRef.current;
    const connections = connectionsRef.current;
    const particles = particlesRef.current;
    const time = timeRef.current;

    ctx.clearRect(0, 0, width, height);

    const slowTime = time * 0.3;

    // Update nodes
    nodes.forEach((node) => {
      const floatX = Math.sin(slowTime * 0.0006 + node.pulsePhase) * 2;
      const floatY = Math.cos(slowTime * 0.0008 + node.pulsePhase * 1.3) * 2;

      const targetX = node.baseX + floatX;
      const targetY = node.baseY + floatY;

      node.vx += (targetX - node.x) * 0.02;
      node.vy += (targetY - node.y) * 0.02;
      node.vx *= 0.95;
      node.vy *= 0.95;
      node.x += node.vx;
      node.y += node.vy;

      // Ambient wave activation
      const wavePhase = slowTime * 0.0003 + node.pulsePhase * 0.5;
      node.activated = (Math.sin(wavePhase) + 1) * 0.15;
    });

    // Update connections
    connections.forEach((conn) => {
      const nodeA = nodes[conn.from];
      const nodeB = nodes[conn.to];
      const targetActive = Math.max(nodeA.activated, nodeB.activated) * conn.strength;
      conn.active += (targetActive - conn.active) * 0.05;
    });

    // Spawn particles
    if (time % 120 === 0 && particles.length < 5) {
      const activeConns = connections.filter((c) => c.active > 0.1);
      if (activeConns.length > 0) {
        const conn = activeConns[Math.floor(Math.random() * activeConns.length)];
        const reverse = Math.random() > 0.5;
        particles.push({
          x: nodes[reverse ? conn.to : conn.from].x,
          y: nodes[reverse ? conn.to : conn.from].y,
          fromNode: reverse ? conn.to : conn.from,
          toNode: reverse ? conn.from : conn.to,
          progress: 0,
          speed: 0.003 + Math.random() * 0.004,
          size: 1 + Math.random() * 1,
        });
      }
    }

    // Draw connections
    connections.forEach((conn) => {
      const nodeA = nodes[conn.from];
      const nodeB = nodes[conn.to];

      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.lineTo(nodeB.x, nodeB.y);

      const opacity = 0.06 + conn.active * 0.12;

      if (conn.active > 0.08) {
        ctx.strokeStyle = `rgba(238, 96, 24, ${opacity})`;
      } else {
        ctx.strokeStyle = `rgba(184, 179, 176, ${opacity})`;
      }
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.progress += p.speed;

      if (p.progress >= 1) {
        particles.splice(i, 1);
        continue;
      }

      const fromNode = nodes[p.fromNode];
      const toNode = nodes[p.toNode];
      const easedProgress = 1 - Math.pow(1 - p.progress, 2);

      p.x = fromNode.x + (toNode.x - fromNode.x) * easedProgress;
      p.y = fromNode.y + (toNode.y - fromNode.y) * easedProgress;

      const alpha = Math.sin(p.progress * Math.PI) * 0.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238, 96, 24, ${alpha})`;
      ctx.fill();
    }

    // Draw nodes
    nodes.forEach((node) => {
      const breathe = Math.sin(slowTime * 0.002 + node.pulsePhase) * 0.2 + 0.8;
      const size = node.radius * breathe;

      if (node.activated > 0.05) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 4 * node.activated, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.08})`;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

      if (node.activated > 0.15) {
        ctx.fillStyle = `rgba(238, 96, 24, ${0.3 + node.activated * 0.4})`;
      } else if (node.type === "primary") {
        ctx.fillStyle = `rgba(31, 29, 28, ${0.25 + breathe * 0.1})`;
      } else {
        ctx.fillStyle = `rgba(184, 179, 176, ${0.2 + breathe * 0.1})`;
      }

      ctx.fill();
    });

    timeRef.current = time + 1;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initNetwork(rect.width, rect.height);
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, initNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: isReady ? 0.7 : 0,
        transition: "opacity 1s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// DESKTOP VERSION - Interactive network with proximity activation
// ============================================================================

function DesktopAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<Node[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const timeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const initNetwork = useCallback((width: number, height: number) => {
    const nodes: Node[] = [];
    const connections: Connection[] = [];

    // Primary nodes in a loose cluster on the right side
    const primaryPositions = [
      { x: 0.70, y: 0.28 },
      { x: 0.85, y: 0.42 },
      { x: 0.78, y: 0.62 },
      { x: 0.62, y: 0.48 },
    ];

    primaryPositions.forEach((pos) => {
      nodes.push({
        x: width * pos.x + (Math.random() - 0.5) * 30,
        y: height * pos.y + (Math.random() - 0.5) * 30,
        baseX: width * pos.x,
        baseY: height * pos.y,
        vx: 0,
        vy: 0,
        radius: 6,
        type: "primary",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
      });
    });

    // Secondary nodes orbiting around primaries
    for (let i = 0; i < 8; i++) {
      const parentIdx = i % 4;
      const parent = nodes[parentIdx];
      const angle = (i / 8) * Math.PI * 2 + Math.random() * 0.5;
      const distance = 55 + Math.random() * 35;

      nodes.push({
        x: parent.baseX + Math.cos(angle) * distance,
        y: parent.baseY + Math.sin(angle) * distance,
        baseX: parent.baseX + Math.cos(angle) * distance,
        baseY: parent.baseY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: 3.5,
        type: "secondary",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
      });
    }

    // Tertiary nodes scattered around
    for (let i = 0; i < 14; i++) {
      const parentIdx = Math.floor(Math.random() * 12);
      const parent = nodes[parentIdx];
      const angle = Math.random() * Math.PI * 2;
      const distance = 25 + Math.random() * 70;

      nodes.push({
        x: parent.baseX + Math.cos(angle) * distance,
        y: parent.baseY + Math.sin(angle) * distance,
        baseX: parent.baseX + Math.cos(angle) * distance,
        baseY: parent.baseY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: 2,
        type: "tertiary",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
      });
    }

    // Create connections based on proximity and hierarchy
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const typeI = nodes[i].type;
        const typeJ = nodes[j].type;

        let maxDistance = 0;
        let strength = 0;

        if (typeI === "primary" && typeJ === "primary") {
          maxDistance = 280;
          strength = 0.8;
        } else if (
          (typeI === "primary" && typeJ === "secondary") ||
          (typeI === "secondary" && typeJ === "primary")
        ) {
          maxDistance = 110;
          strength = 0.6;
        } else if (typeI === "secondary" && typeJ === "secondary") {
          maxDistance = 90;
          strength = 0.4;
        } else if (
          (typeI === "secondary" && typeJ === "tertiary") ||
          (typeI === "tertiary" && typeJ === "secondary")
        ) {
          maxDistance = 70;
          strength = 0.3;
        } else if (typeI === "tertiary" && typeJ === "tertiary") {
          maxDistance = 45;
          strength = 0.15;
        } else {
          maxDistance = 90;
          strength = 0.2;
        }

        if (distance < maxDistance) {
          connections.push({
            from: i,
            to: j,
            strength: strength * (1 - distance / maxDistance),
            active: 0,
          });
        }
      }
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;
    particlesRef.current = [];
    setIsReady(true);
  }, []);

  const spawnParticle = useCallback(() => {
    const connections = connectionsRef.current;
    const nodes = nodesRef.current;
    const particles = particlesRef.current;

    const activeConnections = connections.filter((c) => c.active > 0.3);

    if (activeConnections.length > 0 && particles.length < 30) {
      const conn = activeConnections[Math.floor(Math.random() * activeConnections.length)];
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      const reverse = Math.random() > 0.5;

      particles.push({
        x: reverse ? toNode.x : fromNode.x,
        y: reverse ? toNode.y : fromNode.y,
        fromNode: reverse ? conn.to : conn.from,
        toNode: reverse ? conn.from : conn.to,
        progress: 0,
        speed: 0.008 + Math.random() * 0.012,
        size: 1.5 + Math.random() * 1.5,
      });
    }
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const time = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      const influenceRadius = 180;
      const activationSpeed = 0.08;
      const deactivationSpeed = 0.02;

      // Update node positions and activation
      nodes.forEach((node) => {
        const floatX = Math.sin(time * 0.0008 + node.pulsePhase) * 3;
        const floatY = Math.cos(time * 0.001 + node.pulsePhase * 1.3) * 3;

        let targetX = node.baseX + floatX;
        let targetY = node.baseY + floatY;

        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < influenceRadius && dist > 0 && mouse.active) {
          const force = (1 - dist / influenceRadius) * 15;
          targetX += (dx / dist) * force * 0.5;
          targetY += (dy / dist) * force * 0.5;
          node.activated = Math.min(1, node.activated + activationSpeed);
        } else {
          node.activated = Math.max(0, node.activated - deactivationSpeed);
        }

        node.vx += (targetX - node.x) * 0.06;
        node.vy += (targetY - node.y) * 0.06;
        node.vx *= 0.88;
        node.vy *= 0.88;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Update connection activation
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];
        const targetActive = Math.max(nodeA.activated, nodeB.activated) * conn.strength;

        if (targetActive > conn.active) {
          conn.active = Math.min(1, conn.active + activationSpeed * 0.5);
        } else {
          conn.active = Math.max(0, conn.active - deactivationSpeed * 0.5);
        }
      });

      if (time % 8 === 0) {
        spawnParticle();
      }

      // Draw connections
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        const baseOpacity = conn.strength * 0.15;
        const activeOpacity = conn.active * 0.6;

        if (conn.active > 0.1) {
          ctx.strokeStyle = `rgba(238, 96, 24, ${activeOpacity})`;
          ctx.lineWidth = 1 + conn.active * 1.5;
          ctx.shadowColor = COLORS.orange;
          ctx.shadowBlur = conn.active * 8;
        } else {
          ctx.strokeStyle = `rgba(184, 179, 176, ${baseOpacity})`;
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.progress += p.speed;

        if (p.progress >= 1) {
          particles.splice(i, 1);
          continue;
        }

        const fromNode = nodes[p.fromNode];
        const toNode = nodes[p.toNode];
        const easedProgress = 1 - Math.pow(1 - p.progress, 2);

        p.x = fromNode.x + (toNode.x - fromNode.x) * easedProgress;
        p.y = fromNode.y + (toNode.y - fromNode.y) * easedProgress;

        const alpha = Math.sin(p.progress * Math.PI) * 0.9;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238, 96, 24, ${alpha})`;
        ctx.shadowColor = COLORS.orange;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 0.003 + node.pulsePhase) * 0.15 + 0.85;
        const size = node.radius * pulse;

        if (node.activated > 0.1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 8 * node.activated, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.15})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

        if (node.activated > 0.3) {
          ctx.fillStyle = COLORS.orange;
          ctx.shadowColor = COLORS.orange;
          ctx.shadowBlur = 12 * node.activated;
        } else if (node.type === "primary") {
          ctx.fillStyle = COLORS.darkSubtle;
          ctx.shadowBlur = 0;
        } else if (node.type === "secondary") {
          ctx.fillStyle = `rgba(184, 179, 176, ${0.5 + pulse * 0.2})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(184, 179, 176, ${0.3 + pulse * 0.1})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        if (node.type === "primary" && node.activated < 0.3) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 3, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(184, 179, 176, 0.2)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Geometric accents
      const accentOpacity = 0.06;

      ctx.save();
      ctx.translate(width - 60, 60);
      ctx.rotate(time * 0.0002);
      ctx.beginPath();
      ctx.moveTo(0, -35);
      ctx.lineTo(35 * 0.866, 35 * 0.5);
      ctx.lineTo(-35 * 0.866, 35 * 0.5);
      ctx.closePath();
      ctx.strokeStyle = `rgba(238, 96, 24, ${accentOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.translate(width - 70, height - 70);
      ctx.rotate(-time * 0.00015);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * 22;
        const y = Math.sin(angle) * 22;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(184, 179, 176, ${accentOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      timeRef.current = time + 1;
    },
    [spawnParticle]
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      initNetwork(rect.width, rect.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const padding = 50;
      const isWithinBounds =
        x >= -padding &&
        x <= rect.width + padding &&
        y >= -padding &&
        y <= rect.height + padding;

      mouseRef.current = { x, y, active: isWithinBounds };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const y = e.touches[0].clientY - rect.top;

        const isWithinBounds =
          x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

        mouseRef.current = { x, y, active: isWithinBounds };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    const animate = () => {
      const rect = canvas.getBoundingClientRect();
      draw(ctx, rect.width, rect.height);
      animationRef.current = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [draw, initNetwork]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{
        opacity: isReady ? 0.85 : 0,
        transition: "opacity 0.8s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// MAIN EXPORT - Responsive switcher
// ============================================================================

export function HowWeWorkAnimation() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Don't render until we know which version to show (prevents flash)
  if (isMobile === null) return null;

  return isMobile ? <MobileAnimation /> : <DesktopAnimation />;
}
