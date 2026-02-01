"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Finding Your Place - Careers Animation
 *
 * Desktop: Interactive - cursor proximity activates nearby team nodes, revealing
 *          the connections between team members. "Discovering the team."
 *
 * Mobile: Ambient - gentle orbital motion of team nodes with occasional new
 *         nodes drifting in and finding their orbit. "Watching others join."
 *
 * Conceptual meaning: The animation represents the experience of exploring a team -
 * as you move through the space, you illuminate the relationships and connections
 * that make up the organization.
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
  type: "team" | "newcomer" | "candidate";
  pulsePhase: number;
  activated: number;
  orbitPhase: number;
  orbitRadius: number;
  settled: number; // 0-1, how "settled" into the team this node is
}

interface Connection {
  from: number;
  to: number;
  strength: number;
  active: number;
  forming: boolean; // true if this is a new connection being formed
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
// MOBILE VERSION - Ambient orbital motion with newcomers drifting in
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

    // Center of the team cluster - positioned to frame content, not compete
    const clusterCenterX = width * 0.85;
    const clusterCenterY = height * 0.4;

    // Create team nodes in orbital positions around the center
    const teamPositions = [
      // Inner orbit - core team
      { angle: 0, distance: 35, radius: 5, type: "team" as const },
      { angle: Math.PI * 0.6, distance: 40, radius: 4.5, type: "team" as const },
      { angle: Math.PI * 1.2, distance: 38, radius: 4, type: "team" as const },
      // Outer orbit - extended team
      { angle: Math.PI * 0.3, distance: 70, radius: 3.5, type: "team" as const },
      { angle: Math.PI * 0.8, distance: 75, radius: 3, type: "team" as const },
      { angle: Math.PI * 1.5, distance: 72, radius: 3.5, type: "team" as const },
      { angle: Math.PI * 1.9, distance: 68, radius: 3, type: "team" as const },
    ];

    teamPositions.forEach((pos, index) => {
      const x = clusterCenterX + Math.cos(pos.angle) * pos.distance;
      const y = clusterCenterY + Math.sin(pos.angle) * pos.distance;

      nodes.push({
        x,
        y,
        baseX: clusterCenterX,
        baseY: clusterCenterY,
        vx: 0,
        vy: 0,
        radius: pos.radius,
        type: pos.type,
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
        orbitPhase: pos.angle,
        orbitRadius: pos.distance,
        settled: 1,
      });
    });

    // Add a "newcomer" that will drift in
    nodes.push({
      x: width * 0.1,
      y: height * 0.7,
      baseX: clusterCenterX,
      baseY: clusterCenterY,
      vx: 0,
      vy: 0,
      radius: 3.5,
      type: "newcomer",
      pulsePhase: Math.random() * Math.PI * 2,
      activated: 0.5,
      orbitPhase: Math.PI * 0.4,
      orbitRadius: 90,
      settled: 0,
    });

    // Create connections between team nodes
    for (let i = 0; i < teamPositions.length; i++) {
      for (let j = i + 1; j < teamPositions.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 80) {
          connections.push({
            from: i,
            to: j,
            strength: 0.5 * (1 - distance / 80),
            active: 0.3,
            forming: false,
          });
        }
      }
    }

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

    const slowTime = time * 0.4;

    // Update team node positions - gentle orbital motion
    nodes.forEach((node, index) => {
      if (node.type === "team") {
        // Slow orbital drift
        const orbitSpeed = 0.0002 + (index % 3) * 0.00005;
        node.orbitPhase += orbitSpeed;

        const targetX = node.baseX + Math.cos(node.orbitPhase) * node.orbitRadius;
        const targetY = node.baseY + Math.sin(node.orbitPhase) * node.orbitRadius;

        // Add subtle floating
        const floatX = Math.sin(slowTime * 0.0008 + node.pulsePhase) * 2;
        const floatY = Math.cos(slowTime * 0.001 + node.pulsePhase * 1.3) * 2;

        node.vx += (targetX + floatX - node.x) * 0.02;
        node.vy += (targetY + floatY - node.y) * 0.02;
        node.vx *= 0.95;
        node.vy *= 0.95;
        node.x += node.vx;
        node.y += node.vy;

        // Gentle activation wave
        const wavePhase = slowTime * 0.0004 + node.pulsePhase * 0.5;
        node.activated = (Math.sin(wavePhase) + 1) * 0.15;
      } else if (node.type === "newcomer") {
        // Newcomer gradually approaches and joins the orbit
        node.settled = Math.min(1, node.settled + 0.0003);

        // Interpolate from starting position to orbital position
        const targetOrbitX = node.baseX + Math.cos(node.orbitPhase) * node.orbitRadius;
        const targetOrbitY = node.baseY + Math.sin(node.orbitPhase) * node.orbitRadius;

        // Also start orbiting once settled enough
        if (node.settled > 0.5) {
          node.orbitPhase += 0.0002;
        }

        const floatX = Math.sin(slowTime * 0.0008 + node.pulsePhase) * 3 * (1 - node.settled);
        const floatY = Math.cos(slowTime * 0.001 + node.pulsePhase) * 3 * (1 - node.settled);

        const targetX = targetOrbitX + floatX;
        const targetY = targetOrbitY + floatY;

        node.vx += (targetX - node.x) * (0.005 + node.settled * 0.015);
        node.vy += (targetY - node.y) * (0.005 + node.settled * 0.015);
        node.vx *= 0.96;
        node.vy *= 0.96;
        node.x += node.vx;
        node.y += node.vy;

        // Increase activation as it joins
        node.activated = 0.3 + node.settled * 0.5;

        // Form connections as newcomer approaches
        if (node.settled > 0.3) {
          const newcomerIndex = index;
          nodes.forEach((otherNode, otherIndex) => {
            if (otherNode.type === "team" && otherIndex !== newcomerIndex) {
              const dx = node.x - otherNode.x;
              const dy = node.y - otherNode.y;
              const distance = Math.sqrt(dx * dx + dy * dy);

              if (distance < 100) {
                const existingConn = connections.find(
                  (c) =>
                    (c.from === newcomerIndex && c.to === otherIndex) ||
                    (c.from === otherIndex && c.to === newcomerIndex)
                );

                if (!existingConn) {
                  connections.push({
                    from: newcomerIndex,
                    to: otherIndex,
                    strength: 0.4 * (1 - distance / 100),
                    active: 0,
                    forming: true,
                  });
                }
              }
            }
          });
        }
      }
    });

    // Update connections
    connections.forEach((conn) => {
      const nodeA = nodes[conn.from];
      const nodeB = nodes[conn.to];

      if (conn.forming) {
        // Gradually strengthen forming connections
        conn.active = Math.min(conn.strength, conn.active + 0.002);
      } else {
        const targetActive = Math.max(nodeA.activated, nodeB.activated) * conn.strength;
        conn.active += (targetActive - conn.active) * 0.05;
      }
    });

    // Occasionally spawn ambient particles
    if (time % 100 === 0 && particles.length < 6) {
      const activeConns = connections.filter((c) => c.active > 0.15);
      if (activeConns.length > 0) {
        const conn = activeConns[Math.floor(Math.random() * activeConns.length)];
        const reverse = Math.random() > 0.5;
        particles.push({
          x: nodes[reverse ? conn.to : conn.from].x,
          y: nodes[reverse ? conn.to : conn.from].y,
          fromNode: reverse ? conn.to : conn.from,
          toNode: reverse ? conn.from : conn.to,
          progress: 0,
          speed: 0.004 + Math.random() * 0.004,
          size: 1 + Math.random() * 1,
        });
      }
    }

    // Draw connections
    connections.forEach((conn) => {
      const nodeA = nodes[conn.from];
      const nodeB = nodes[conn.to];

      if (conn.active < 0.02) return;

      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.lineTo(nodeB.x, nodeB.y);

      const opacity = 0.05 + conn.active * 0.2;

      if (conn.forming || conn.active > 0.1) {
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
      const breathe = Math.sin(slowTime * 0.002 + node.pulsePhase) * 0.15 + 0.85;
      const size = node.radius * breathe;

      // Glow for activated nodes
      if (node.activated > 0.1) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 5 * node.activated, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.1})`;
        ctx.fill();
      }

      // Node fill
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

      if (node.type === "newcomer") {
        // Newcomer starts orange-ish, becomes more integrated
        const orangeAmount = 0.4 + node.settled * 0.4;
        ctx.fillStyle = `rgba(238, 96, 24, ${orangeAmount})`;
      } else if (node.activated > 0.2) {
        ctx.fillStyle = `rgba(238, 96, 24, ${0.3 + node.activated * 0.5})`;
      } else {
        ctx.fillStyle = `rgba(31, 29, 28, ${0.25 + breathe * 0.15})`;
      }

      ctx.fill();
    });

    // Draw a subtle center point for the cluster
    ctx.beginPath();
    const centerX = nodes[0]?.baseX || width * 0.85;
    const centerY = nodes[0]?.baseY || height * 0.4;
    ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(184, 179, 176, 0.15)";
    ctx.fill();

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
// DESKTOP VERSION - Proximity-based activation (cursor activates nearby nodes)
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

    // Team cluster center - on the right side
    const clusterCenterX = width * 0.72;
    const clusterCenterY = height * 0.45;

    // Create team nodes in a loose organic cluster
    const teamPositions = [
      // Core team - tight inner cluster
      { x: 0, y: 0, radius: 6, orbit: 0 },
      { x: -25, y: -30, radius: 5.5, orbit: 35 },
      { x: 30, y: -20, radius: 5, orbit: 40 },
      { x: 20, y: 35, radius: 5, orbit: 42 },
      { x: -35, y: 20, radius: 4.5, orbit: 45 },
      // Extended team - outer ring
      { x: -50, y: -55, radius: 4, orbit: 70 },
      { x: 55, y: -50, radius: 3.5, orbit: 75 },
      { x: 65, y: 20, radius: 4, orbit: 72 },
      { x: 40, y: 65, radius: 3.5, orbit: 78 },
      { x: -55, y: 50, radius: 3.5, orbit: 74 },
      { x: -70, y: -10, radius: 3, orbit: 70 },
      // Peripheral team members
      { x: 15, y: -75, radius: 2.5, orbit: 85 },
      { x: 80, y: -25, radius: 2.5, orbit: 90 },
      { x: 70, y: 55, radius: 2.5, orbit: 88 },
      { x: -20, y: 80, radius: 2.5, orbit: 85 },
      { x: -80, y: 30, radius: 2.5, orbit: 86 },
    ];

    teamPositions.forEach((pos, index) => {
      const x = clusterCenterX + pos.x;
      const y = clusterCenterY + pos.y;
      const angle = Math.atan2(pos.y, pos.x);

      nodes.push({
        x: x + (Math.random() - 0.5) * 10,
        y: y + (Math.random() - 0.5) * 10,
        baseX: clusterCenterX,
        baseY: clusterCenterY,
        vx: 0,
        vy: 0,
        radius: pos.radius,
        type: "team",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
        orbitPhase: angle,
        orbitRadius: pos.orbit || Math.sqrt(pos.x * pos.x + pos.y * pos.y),
        settled: 1,
      });
    });

    // Create connections between team nodes based on proximity
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let maxDistance = 70;
        let baseStrength = 0.5;

        // Stronger connections between core members
        if (i < 5 && j < 5) {
          maxDistance = 100;
          baseStrength = 0.7;
        } else if (i < 5 || j < 5) {
          maxDistance = 80;
          baseStrength = 0.5;
        }

        if (distance < maxDistance) {
          connections.push({
            from: i,
            to: j,
            strength: baseStrength * (1 - distance / maxDistance),
            active: 0.2,
            forming: false,
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

    const activeConnections = connections.filter((c) => c.active > 0.25);

    if (activeConnections.length > 0 && particles.length < 25) {
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

      const clusterCenterX = width * 0.72;
      const clusterCenterY = height * 0.45;

      // Update team nodes with mouse proximity activation
      nodes.forEach((node, index) => {
        // Gentle orbital motion
        const orbitSpeed = 0.0003 + (index % 5) * 0.00005;
        node.orbitPhase += orbitSpeed;

        const targetX = node.baseX + Math.cos(node.orbitPhase) * node.orbitRadius;
        const targetY = node.baseY + Math.sin(node.orbitPhase) * node.orbitRadius;

        // Subtle floating
        const floatX = Math.sin(time * 0.001 + node.pulsePhase) * 2;
        const floatY = Math.cos(time * 0.0012 + node.pulsePhase * 1.3) * 2;

        // Mouse proximity activation - nodes glow when cursor is near
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);

        // Activation based on mouse proximity
        const activationRadius = 180;
        if (mouse.active && distToMouse < activationRadius && distToMouse > 0) {
          const proximityFactor = 1 - distToMouse / activationRadius;
          node.activated = Math.min(1, node.activated + proximityFactor * 0.08);
        } else {
          node.activated = Math.max(0, node.activated - 0.015);
        }

        // Ambient wave activation (subtle, when mouse isn't active)
        if (!mouse.active) {
          const wavePhase = time * 0.0004 + node.pulsePhase * 0.5;
          const waveActivation = (Math.sin(wavePhase) + 1) * 0.08;
          node.activated = Math.max(node.activated, waveActivation);
        }

        node.vx += (targetX + floatX - node.x) * 0.04;
        node.vy += (targetY + floatY - node.y) * 0.04;
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Update connections based on node activation
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];
        const targetActive = Math.max(nodeA.activated, nodeB.activated) * conn.strength + 0.1;

        if (targetActive > conn.active) {
          conn.active = Math.min(1, conn.active + 0.04);
        } else {
          conn.active = Math.max(0.1, conn.active - 0.02);
        }
      });

      // Spawn particles along active connections
      if (time % 6 === 0) {
        spawnParticle();
      }

      // Draw connections
      connections.forEach((conn) => {
        const nodeA = nodes[conn.from];
        const nodeB = nodes[conn.to];

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        const baseOpacity = conn.strength * 0.12;
        const activeOpacity = conn.active * 0.5;

        if (conn.active > 0.15) {
          ctx.strokeStyle = `rgba(238, 96, 24, ${activeOpacity})`;
          ctx.lineWidth = 1 + conn.active * 1.2;
          ctx.shadowColor = COLORS.orange;
          ctx.shadowBlur = conn.active * 6;
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

        const alpha = Math.sin(p.progress * Math.PI) * 0.85;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238, 96, 24, ${alpha})`;
        ctx.shadowColor = COLORS.orange;
        ctx.shadowBlur = 5;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Draw team nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 0.003 + node.pulsePhase) * 0.12 + 0.88;
        const size = node.radius * pulse;

        // Outer glow for activated nodes
        if (node.activated > 0.1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 8 * node.activated, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.12})`;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

        if (node.activated > 0.3) {
          ctx.fillStyle = COLORS.orange;
          ctx.shadowColor = COLORS.orange;
          ctx.shadowBlur = 10 * node.activated;
        } else if (node.radius > 5) {
          // Core members
          ctx.fillStyle = COLORS.darkSubtle;
          ctx.shadowBlur = 0;
        } else if (node.radius > 3) {
          // Extended team
          ctx.fillStyle = `rgba(31, 29, 28, ${0.4 + pulse * 0.15})`;
          ctx.shadowBlur = 0;
        } else {
          // Peripheral
          ctx.fillStyle = `rgba(184, 179, 176, ${0.35 + pulse * 0.15})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Subtle ring around core members
        if (node.radius > 5 && node.activated < 0.3) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 3, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(184, 179, 176, 0.15)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Geometric accent - subtle rotating triangle
      const accentOpacity = 0.05;
      ctx.save();
      ctx.translate(width - 50, 50);
      ctx.rotate(time * 0.0002);
      ctx.beginPath();
      ctx.moveTo(0, -30);
      ctx.lineTo(30 * 0.866, 30 * 0.5);
      ctx.lineTo(-30 * 0.866, 30 * 0.5);
      ctx.closePath();
      ctx.strokeStyle = `rgba(238, 96, 24, ${accentOpacity})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.restore();

      // Cluster center marker
      ctx.beginPath();
      ctx.arc(clusterCenterX, clusterCenterY, 2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(184, 179, 176, 0.1)";
      ctx.fill();

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

        const isWithinBounds = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

        mouseRef.current = { x, y, active: isWithinBounds };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { ...mouseRef.current, active: false };
    };

    const handleMouseLeave = () => {
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
    document.addEventListener("mouseleave", handleMouseLeave);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
      document.removeEventListener("mouseleave", handleMouseLeave);
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

export function CareersAnimation() {
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
