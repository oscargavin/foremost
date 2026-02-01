"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * How We Think - Strategic Framework Visualization
 *
 * Represents the 4 pillars of Foremost's AI strategy philosophy:
 * 1. Strategic Clarity (top)
 * 2. Applied Intelligence (right)
 * 3. Human Potential (bottom)
 * 4. Governance as Enabler (left)
 *
 * Desktop: Interactive diamond framework where mouse reveals how pillars
 *          connect and influence each other - insights flow between nodes
 * Mobile: Slow breathing/rotation of the framework with ambient particle flow
 *
 * Conceptually: The diamond shape represents structured thinking, stability,
 * and the interconnected nature of these pillars - no pillar stands alone.
 */

// ============================================================================
// SHARED TYPES & COLORS
// ============================================================================

interface PillarNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  pillarIndex: number; // 0-3 for the 4 pillars
  type: "pillar" | "satellite" | "accent";
  pulsePhase: number;
  activated: number;
  label?: string;
}

interface InsightParticle {
  x: number;
  y: number;
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  size: number;
  color: "orange" | "gray";
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  active: number;
  type: "pillar" | "satellite" | "cross"; // pillar-to-pillar, pillar-to-satellite, cross-pillar
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

// Pillar labels for conceptual meaning
const PILLAR_LABELS = [
  "Strategic Clarity",
  "Applied Intelligence",
  "Human Potential",
  "Governance",
];

// ============================================================================
// MOBILE VERSION - Ambient breathing framework
// ============================================================================

function MobileAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<PillarNode[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const particlesRef = useRef<InsightParticle[]>([]);
  const timeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const initFramework = useCallback((width: number, height: number) => {
    const nodes: PillarNode[] = [];
    const connections: Connection[] = [];

    // Center point for the diamond - positioned toward right side on mobile
    const centerX = width * 0.65;
    const centerY = height * 0.45;
    const diamondRadius = Math.min(width, height) * 0.28;

    // 4 pillar nodes in a diamond formation
    // Top, Right, Bottom, Left
    const pillarAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

    pillarAngles.forEach((angle, i) => {
      const x = centerX + Math.cos(angle) * diamondRadius;
      const y = centerY + Math.sin(angle) * diamondRadius;

      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        radius: 5,
        pillarIndex: i,
        type: "pillar",
        pulsePhase: (i / 4) * Math.PI * 2,
        activated: 0,
        label: PILLAR_LABELS[i],
      });
    });

    // Add subtle satellite nodes around each pillar
    for (let i = 0; i < 4; i++) {
      const parent = nodes[i];
      const satCount = 2;

      for (let j = 0; j < satCount; j++) {
        const angle = pillarAngles[i] + (j - 0.5) * 0.8;
        const distance = diamondRadius * 0.25 + Math.random() * 15;

        nodes.push({
          x: parent.baseX + Math.cos(angle) * distance,
          y: parent.baseY + Math.sin(angle) * distance,
          baseX: parent.baseX + Math.cos(angle) * distance,
          baseY: parent.baseY + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          radius: 2,
          pillarIndex: i,
          type: "satellite",
          pulsePhase: Math.random() * Math.PI * 2,
          activated: 0,
        });
      }
    }

    // Add ambient accent nodes scattered around
    const accentPositions = [
      { x: 0.1, y: 0.15 },
      { x: 0.9, y: 0.2 },
      { x: 0.15, y: 0.85 },
      { x: 0.88, y: 0.78 },
    ];

    accentPositions.forEach((pos) => {
      nodes.push({
        x: width * pos.x,
        y: height * pos.y,
        baseX: width * pos.x,
        baseY: height * pos.y,
        vx: 0,
        vy: 0,
        radius: 1.5,
        pillarIndex: -1,
        type: "accent",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
      });
    });

    // Create connections
    // Pillar-to-pillar (diamond edges)
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      connections.push({
        from: i,
        to: next,
        strength: 0.7,
        active: 0,
        type: "pillar",
      });
    }

    // Cross connections (diagonals - showing interconnection)
    connections.push({ from: 0, to: 2, strength: 0.4, active: 0, type: "cross" });
    connections.push({ from: 1, to: 3, strength: 0.4, active: 0, type: "cross" });

    // Satellite connections
    for (let i = 0; i < 4; i++) {
      const satStart = 4 + i * 2;
      connections.push({
        from: i,
        to: satStart,
        strength: 0.3,
        active: 0,
        type: "satellite",
      });
      connections.push({
        from: i,
        to: satStart + 1,
        strength: 0.3,
        active: 0,
        type: "satellite",
      });
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;
    particlesRef.current = [];
    setIsReady(true);
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const nodes = nodesRef.current;
      const connections = connectionsRef.current;
      const particles = particlesRef.current;
      const time = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      const slowTime = time * 0.25;

      // Gentle rotation of the entire framework
      const rotationAngle = Math.sin(slowTime * 0.0003) * 0.02;

      // Update node positions with breathing and subtle rotation
      const centerX = width * 0.65;
      const centerY = height * 0.45;

      nodes.forEach((node) => {
        // Subtle floating motion
        const floatX = Math.sin(slowTime * 0.0005 + node.pulsePhase) * 2;
        const floatY = Math.cos(slowTime * 0.0007 + node.pulsePhase * 1.3) * 2;

        // Apply gentle rotation for pillar nodes
        let targetX = node.baseX + floatX;
        let targetY = node.baseY + floatY;

        if (node.type === "pillar") {
          const dx = node.baseX - centerX;
          const dy = node.baseY - centerY;
          const cos = Math.cos(rotationAngle);
          const sin = Math.sin(rotationAngle);
          targetX = centerX + dx * cos - dy * sin + floatX;
          targetY = centerY + dx * sin + dy * cos + floatY;
        }

        node.vx += (targetX - node.x) * 0.015;
        node.vy += (targetY - node.y) * 0.015;
        node.vx *= 0.96;
        node.vy *= 0.96;
        node.x += node.vx;
        node.y += node.vy;

        // Ambient activation wave - pillars activate in sequence
        const wavePhase = slowTime * 0.0004 + node.pillarIndex * 0.8;
        const waveActivation =
          node.type === "pillar"
            ? (Math.sin(wavePhase) + 1) * 0.25
            : (Math.sin(wavePhase) + 1) * 0.1;
        node.activated = waveActivation;
      });

      // Update connection activation
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];
        const targetActive =
          Math.max(nodeA.activated, nodeB.activated) * conn.strength;
        conn.active += (targetActive - conn.active) * 0.04;
      });

      // Spawn ambient insight particles
      if (time % 150 === 0 && particles.length < 6) {
        // Prioritize pillar connections for particles
        const pillarConns = connections.filter(
          (c) => c.type === "pillar" || c.type === "cross"
        );
        if (pillarConns.length > 0) {
          const conn =
            pillarConns[Math.floor(Math.random() * pillarConns.length)];
          const reverse = Math.random() > 0.5;
          particles.push({
            x: nodes[reverse ? conn.to : conn.from].x,
            y: nodes[reverse ? conn.to : conn.from].y,
            fromNode: reverse ? conn.to : conn.from,
            toNode: reverse ? conn.from : conn.to,
            progress: 0,
            speed: 0.002 + Math.random() * 0.003,
            size: 1.5 + Math.random(),
            color: conn.type === "pillar" ? "orange" : "gray",
          });
        }
      }

      // Draw cross connections first (behind)
      connections
        .filter((c) => c.type === "cross")
        .forEach((conn) => {
          const nodeA = nodes[conn.from];
          const nodeB = nodes[conn.to];

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.setLineDash([4, 8]);
          ctx.strokeStyle = `rgba(184, 179, 176, ${0.08 + conn.active * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.setLineDash([]);
        });

      // Draw pillar connections (the diamond)
      connections
        .filter((c) => c.type === "pillar")
        .forEach((conn) => {
          const nodeA = nodes[conn.from];
          const nodeB = nodes[conn.to];

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);

          const opacity = 0.1 + conn.active * 0.25;
          ctx.strokeStyle =
            conn.active > 0.15
              ? `rgba(238, 96, 24, ${opacity})`
              : `rgba(184, 179, 176, ${opacity})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        });

      // Draw satellite connections
      connections
        .filter((c) => c.type === "satellite")
        .forEach((conn) => {
          const nodeA = nodes[conn.from];
          const nodeB = nodes[conn.to];

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);
          ctx.strokeStyle = `rgba(184, 179, 176, ${0.06 + conn.active * 0.1})`;
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

        const alpha = Math.sin(p.progress * Math.PI) * 0.6;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color === "orange"
            ? `rgba(238, 96, 24, ${alpha})`
            : `rgba(184, 179, 176, ${alpha})`;
        ctx.fill();
      }

      // Draw nodes
      nodes.forEach((node) => {
        const breathe =
          Math.sin(slowTime * 0.0015 + node.pulsePhase) * 0.15 + 0.85;
        const size = node.radius * breathe;

        // Glow for activated pillar nodes
        if (node.type === "pillar" && node.activated > 0.1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 6 * node.activated, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.1})`;
          ctx.fill();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

        if (node.type === "pillar") {
          if (node.activated > 0.2) {
            ctx.fillStyle = `rgba(238, 96, 24, ${0.4 + node.activated * 0.5})`;
          } else {
            ctx.fillStyle = `rgba(31, 29, 28, ${0.35 + breathe * 0.15})`;
          }
        } else if (node.type === "satellite") {
          ctx.fillStyle = `rgba(184, 179, 176, ${0.25 + breathe * 0.1})`;
        } else {
          ctx.fillStyle = `rgba(184, 179, 176, ${0.15 + breathe * 0.08})`;
        }

        ctx.fill();

        // Ring around pillar nodes
        if (node.type === "pillar") {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 2, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(184, 179, 176, ${0.15 + node.activated * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      timeRef.current = time + 1;
    },
    []
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
      initFramework(rect.width, rect.height);
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
  }, [draw, initFramework]);

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
// DESKTOP VERSION - Interactive framework responding to attention
// ============================================================================

function DesktopAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<PillarNode[]>([]);
  const connectionsRef = useRef<Connection[]>([]);
  const particlesRef = useRef<InsightParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const timeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const initFramework = useCallback((width: number, height: number) => {
    const nodes: PillarNode[] = [];
    const connections: Connection[] = [];

    // Center point for the diamond - positioned on right side of viewport
    const centerX = width * 0.68;
    const centerY = height * 0.48;
    const diamondRadius = Math.min(width * 0.22, height * 0.32);

    // 4 pillar nodes in a diamond formation
    const pillarAngles = [-Math.PI / 2, 0, Math.PI / 2, Math.PI];

    pillarAngles.forEach((angle, i) => {
      const x = centerX + Math.cos(angle) * diamondRadius;
      const y = centerY + Math.sin(angle) * diamondRadius;

      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        radius: 8,
        pillarIndex: i,
        type: "pillar",
        pulsePhase: (i / 4) * Math.PI * 2,
        activated: 0,
        label: PILLAR_LABELS[i],
      });
    });

    // Satellite nodes around each pillar
    for (let i = 0; i < 4; i++) {
      const parent = nodes[i];
      const satCount = 3;

      for (let j = 0; j < satCount; j++) {
        const angle = pillarAngles[i] + (j - 1) * 0.6 + (Math.random() - 0.5) * 0.3;
        const distance = diamondRadius * 0.3 + Math.random() * 25;

        nodes.push({
          x: parent.baseX + Math.cos(angle) * distance,
          y: parent.baseY + Math.sin(angle) * distance,
          baseX: parent.baseX + Math.cos(angle) * distance,
          baseY: parent.baseY + Math.sin(angle) * distance,
          vx: 0,
          vy: 0,
          radius: 3,
          pillarIndex: i,
          type: "satellite",
          pulsePhase: Math.random() * Math.PI * 2,
          activated: 0,
        });
      }
    }

    // Outer accent nodes representing insights flowing in/out
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2 + Math.random() * 0.3;
      const distance = diamondRadius * 1.4 + Math.random() * 60;

      nodes.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        baseX: centerX + Math.cos(angle) * distance,
        baseY: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        radius: 2,
        pillarIndex: Math.floor(i / 3),
        type: "accent",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
      });
    }

    // Connections: Pillar-to-pillar (diamond edges)
    for (let i = 0; i < 4; i++) {
      const next = (i + 1) % 4;
      connections.push({
        from: i,
        to: next,
        strength: 0.85,
        active: 0,
        type: "pillar",
      });
    }

    // Cross connections (diagonals)
    connections.push({ from: 0, to: 2, strength: 0.5, active: 0, type: "cross" });
    connections.push({ from: 1, to: 3, strength: 0.5, active: 0, type: "cross" });

    // Pillar to satellite connections
    for (let i = 0; i < 4; i++) {
      const satStart = 4 + i * 3;
      for (let j = 0; j < 3; j++) {
        connections.push({
          from: i,
          to: satStart + j,
          strength: 0.45,
          active: 0,
          type: "satellite",
        });
      }
    }

    // Satellite to accent connections
    const accentStart = 4 + 12; // After pillars and satellites
    for (let i = 0; i < 12; i++) {
      const pillarIdx = Math.floor(i / 3);
      const satStart = 4 + pillarIdx * 3;
      // Connect accent to nearest satellite
      connections.push({
        from: satStart + (i % 3),
        to: accentStart + i,
        strength: 0.25,
        active: 0,
        type: "satellite",
      });
    }

    nodesRef.current = nodes;
    connectionsRef.current = connections;
    particlesRef.current = [];
    setIsReady(true);
  }, []);

  const spawnInsightParticle = useCallback(() => {
    const connections = connectionsRef.current;
    const nodes = nodesRef.current;
    const particles = particlesRef.current;

    const activeConnections = connections.filter((c) => c.active > 0.25);

    if (activeConnections.length > 0 && particles.length < 25) {
      const conn =
        activeConnections[Math.floor(Math.random() * activeConnections.length)];
      const fromNode = nodes[conn.from];
      const toNode = nodes[conn.to];
      const reverse = Math.random() > 0.5;

      particles.push({
        x: reverse ? toNode.x : fromNode.x,
        y: reverse ? toNode.y : fromNode.y,
        fromNode: reverse ? conn.to : conn.from,
        toNode: reverse ? conn.from : conn.to,
        progress: 0,
        speed: 0.006 + Math.random() * 0.01,
        size: conn.type === "pillar" ? 2 + Math.random() * 1.5 : 1.5 + Math.random(),
        color: conn.type === "pillar" || conn.type === "cross" ? "orange" : "gray",
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

      const influenceRadius = 200;
      const pillarInfluenceRadius = 250;
      const activationSpeed = 0.08;
      const deactivationSpeed = 0.025;

      // Update node positions and activation
      nodes.forEach((node) => {
        const floatX = Math.sin(time * 0.0006 + node.pulsePhase) * 4;
        const floatY = Math.cos(time * 0.0008 + node.pulsePhase * 1.3) * 4;

        let targetX = node.baseX + floatX;
        let targetY = node.baseY + floatY;

        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const effectiveRadius =
          node.type === "pillar" ? pillarInfluenceRadius : influenceRadius;

        if (dist < effectiveRadius && dist > 0 && mouse.active) {
          // Pillars attract slightly, others push away
          const force = (1 - dist / effectiveRadius) * 12;
          if (node.type === "pillar") {
            // Gentle attraction - pillars want your attention
            targetX -= (dx / dist) * force * 0.3;
            targetY -= (dy / dist) * force * 0.3;
          } else {
            // Others give way
            targetX += (dx / dist) * force * 0.4;
            targetY += (dy / dist) * force * 0.4;
          }
          node.activated = Math.min(1, node.activated + activationSpeed);
        } else {
          node.activated = Math.max(0, node.activated - deactivationSpeed);
        }

        node.vx += (targetX - node.x) * 0.05;
        node.vy += (targetY - node.y) * 0.05;
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Update connection activation - propagate through the network
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];
        const targetActive =
          Math.max(nodeA.activated, nodeB.activated) * conn.strength;

        if (targetActive > conn.active) {
          conn.active = Math.min(1, conn.active + activationSpeed * 0.6);
        } else {
          conn.active = Math.max(0, conn.active - deactivationSpeed * 0.4);
        }
      });

      // Spawn insight particles when connections are active
      if (time % 6 === 0) {
        spawnInsightParticle();
      }

      // Draw cross connections (dashed, behind everything)
      connections
        .filter((c) => c.type === "cross")
        .forEach((conn) => {
          const nodeA = nodes[conn.from];
          const nodeB = nodes[conn.to];

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);

          ctx.setLineDash([6, 12]);
          const opacity = 0.08 + conn.active * 0.35;
          ctx.strokeStyle =
            conn.active > 0.2
              ? `rgba(238, 96, 24, ${opacity})`
              : `rgba(184, 179, 176, ${opacity})`;
          ctx.lineWidth = 1 + conn.active;
          ctx.stroke();
          ctx.setLineDash([]);
        });

      // Draw satellite connections
      connections
        .filter((c) => c.type === "satellite")
        .forEach((conn) => {
          const nodeA = nodes[conn.from];
          const nodeB = nodes[conn.to];

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);

          const opacity = conn.strength * 0.12 + conn.active * 0.3;
          ctx.strokeStyle =
            conn.active > 0.15
              ? `rgba(238, 96, 24, ${opacity * 0.7})`
              : `rgba(184, 179, 176, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        });

      // Draw pillar connections (the diamond frame)
      connections
        .filter((c) => c.type === "pillar")
        .forEach((conn) => {
          const nodeA = nodes[conn.from];
          const nodeB = nodes[conn.to];

          // Glow for active connections
          if (conn.active > 0.15) {
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.strokeStyle = `rgba(238, 96, 24, ${conn.active * 0.15})`;
            ctx.lineWidth = 6;
            ctx.stroke();
          }

          ctx.beginPath();
          ctx.moveTo(nodeA.x, nodeA.y);
          ctx.lineTo(nodeB.x, nodeB.y);

          const opacity = 0.2 + conn.active * 0.6;
          if (conn.active > 0.1) {
            ctx.strokeStyle = `rgba(238, 96, 24, ${opacity})`;
            ctx.shadowColor = COLORS.orange;
            ctx.shadowBlur = conn.active * 10;
          } else {
            ctx.strokeStyle = `rgba(184, 179, 176, ${opacity})`;
            ctx.shadowBlur = 0;
          }
          ctx.lineWidth = 2 + conn.active * 1.5;
          ctx.stroke();
          ctx.shadowBlur = 0;
        });

      // Draw particles (insights flowing between pillars)
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

        const alpha = Math.sin(p.progress * Math.PI) * 0.85;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color === "orange"
            ? `rgba(238, 96, 24, ${alpha})`
            : `rgba(184, 179, 176, ${alpha * 0.7})`;
        ctx.shadowColor = p.color === "orange" ? COLORS.orange : COLORS.gray;
        ctx.shadowBlur = p.color === "orange" ? 8 : 4;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 0.002 + node.pulsePhase) * 0.12 + 0.88;
        const size = node.radius * pulse;

        // Outer glow for activated nodes
        if (node.activated > 0.1) {
          ctx.beginPath();
          ctx.arc(
            node.x,
            node.y,
            size + (node.type === "pillar" ? 12 : 6) * node.activated,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.12})`;
          ctx.fill();
        }

        // Main node
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

        if (node.activated > 0.3) {
          ctx.fillStyle = COLORS.orange;
          ctx.shadowColor = COLORS.orange;
          ctx.shadowBlur = 15 * node.activated;
        } else if (node.type === "pillar") {
          ctx.fillStyle = COLORS.darkSubtle;
          ctx.shadowBlur = 0;
        } else if (node.type === "satellite") {
          ctx.fillStyle = `rgba(184, 179, 176, ${0.45 + pulse * 0.15})`;
          ctx.shadowBlur = 0;
        } else {
          ctx.fillStyle = `rgba(184, 179, 176, ${0.25 + pulse * 0.1})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Decorative ring for pillar nodes
        if (node.type === "pillar") {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 4, 0, Math.PI * 2);
          ctx.strokeStyle =
            node.activated > 0.2
              ? `rgba(238, 96, 24, ${0.3 + node.activated * 0.4})`
              : `rgba(184, 179, 176, 0.25)`;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Inner detail
          if (node.activated < 0.3) {
            ctx.beginPath();
            ctx.arc(node.x, node.y, size * 0.4, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(250, 250, 250, 0.3)";
            ctx.fill();
          }
        }
      });

      // Draw geometric accent in corner
      const accentOpacity = 0.05 + Math.sin(time * 0.001) * 0.02;

      // Small diamond accent
      ctx.save();
      ctx.translate(width - 50, height - 50);
      ctx.rotate(time * 0.0001 + Math.PI / 4);
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(18, 0);
      ctx.lineTo(0, 18);
      ctx.lineTo(-18, 0);
      ctx.closePath();
      ctx.strokeStyle = `rgba(238, 96, 24, ${accentOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Framework center marker
      const centerX = width * 0.68;
      const centerY = height * 0.48;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238, 96, 24, ${0.15 + Math.sin(time * 0.003) * 0.1})`;
      ctx.fill();

      timeRef.current = time + 1;
    },
    [spawnInsightParticle]
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
      initFramework(rect.width, rect.height);
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
  }, [draw, initFramework]);

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

export function HowWeThinkAnimation() {
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
