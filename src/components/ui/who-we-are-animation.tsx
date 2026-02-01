"use client";

import { useEffect, useRef, useCallback, useState } from "react";

/**
 * Trust Network Visualization - "Who We Are" Page
 *
 * Theme: People forming connections / Trust networks
 *
 * Three primary nodes represent the core values:
 * - Clarity (top) - The guiding light that illuminates understanding
 * - Rigour (bottom-left) - The foundation of evidence-based thinking
 * - Integrity (bottom-right) - The bond that holds trust together
 *
 * Secondary nodes represent team members and collaborators
 * Connections show trust, collaboration, and shared values
 *
 * Desktop: Mouse interaction reveals deeper connections - "Your presence strengthens the network"
 * Mobile: Gentle unified pulse showing team breathing together - "A unified presence"
 */

// ============================================================================
// SHARED TYPES & COLORS
// ============================================================================

interface TrustNode {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  type: "value" | "team" | "network";
  valueIndex?: number; // 0: Clarity, 1: Rigour, 2: Integrity
  pulsePhase: number;
  activated: number;
  connectionStrength: number;
  label?: string;
}

interface TrustBond {
  from: number;
  to: number;
  strength: number;
  active: number;
  type: "value-value" | "value-team" | "team-team";
}

interface TrustParticle {
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
  orangeSubtle: "rgba(238, 96, 24, 0.12)",
  orangeFaint: "rgba(238, 96, 24, 0.06)",
  gray: "#b8b3b0",
  grayLight: "rgba(184, 179, 176, 0.25)",
  graySubtle: "rgba(184, 179, 176, 0.1)",
  dark: "#1f1d1c",
  darkSubtle: "rgba(31, 29, 28, 0.6)",
  darkFaint: "rgba(31, 29, 28, 0.3)",
};

// Value labels for the three primary nodes
const VALUE_LABELS = ["Clarity", "Rigour", "Integrity"];

// ============================================================================
// MOBILE VERSION - Ambient unified breathing
// ============================================================================

function MobileAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<TrustNode[]>([]);
  const bondsRef = useRef<TrustBond[]>([]);
  const particlesRef = useRef<TrustParticle[]>([]);
  const timeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const initNetwork = useCallback((width: number, height: number) => {
    const nodes: TrustNode[] = [];
    const bonds: TrustBond[] = [];

    // Three value nodes forming a triangle - positioned to frame content on mobile
    // These are positioned more to the edges so they don't compete with text
    const valuePositions = [
      { x: 0.85, y: 0.12, label: "Clarity" },    // Top right - clarity illuminates
      { x: 0.08, y: 0.75, label: "Rigour" },     // Bottom left - foundational
      { x: 0.92, y: 0.78, label: "Integrity" },  // Bottom right - bonds trust
    ];

    valuePositions.forEach((pos, index) => {
      nodes.push({
        x: width * pos.x,
        y: height * pos.y,
        baseX: width * pos.x,
        baseY: height * pos.y,
        vx: 0,
        vy: 0,
        radius: 5,
        type: "value",
        valueIndex: index,
        pulsePhase: (index / 3) * Math.PI * 2, // Offset phases for wave effect
        activated: 0,
        connectionStrength: 1,
        label: pos.label,
      });
    });

    // Team nodes - sparse constellation around the edges
    const teamPositions = [
      { x: 0.15, y: 0.15 },
      { x: 0.88, y: 0.42 },
      { x: 0.12, y: 0.50 },
      { x: 0.55, y: 0.92 },
    ];

    teamPositions.forEach((pos) => {
      nodes.push({
        x: width * pos.x,
        y: height * pos.y,
        baseX: width * pos.x,
        baseY: height * pos.y,
        vx: 0,
        vy: 0,
        radius: 3,
        type: "team",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
        connectionStrength: 0.7,
      });
    });

    // Network nodes - very subtle, at the periphery
    const networkPositions = [
      { x: 0.05, y: 0.25 },
      { x: 0.95, y: 0.55 },
      { x: 0.30, y: 0.95 },
    ];

    networkPositions.forEach((pos) => {
      nodes.push({
        x: width * pos.x,
        y: height * pos.y,
        baseX: width * pos.x,
        baseY: height * pos.y,
        vx: 0,
        vy: 0,
        radius: 1.5,
        type: "network",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
        connectionStrength: 0.4,
      });
    });

    // Create bonds - value nodes are always connected to each other
    // Value triangle
    bonds.push({ from: 0, to: 1, strength: 0.8, active: 0, type: "value-value" });
    bonds.push({ from: 1, to: 2, strength: 0.8, active: 0, type: "value-value" });
    bonds.push({ from: 2, to: 0, strength: 0.8, active: 0, type: "value-value" });

    // Connect team nodes to nearest value
    bonds.push({ from: 0, to: 3, strength: 0.5, active: 0, type: "value-team" }); // Clarity to team
    bonds.push({ from: 0, to: 4, strength: 0.4, active: 0, type: "value-team" });
    bonds.push({ from: 1, to: 5, strength: 0.5, active: 0, type: "value-team" }); // Rigour to team
    bonds.push({ from: 2, to: 6, strength: 0.5, active: 0, type: "value-team" }); // Integrity to team

    // Sparse team-to-network connections
    bonds.push({ from: 3, to: 7, strength: 0.3, active: 0, type: "team-team" });
    bonds.push({ from: 4, to: 8, strength: 0.3, active: 0, type: "team-team" });

    nodesRef.current = nodes;
    bondsRef.current = bonds;
    particlesRef.current = [];
    setIsReady(true);
  }, []);

  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const nodes = nodesRef.current;
    const bonds = bondsRef.current;
    const particles = particlesRef.current;
    const time = timeRef.current;

    ctx.clearRect(0, 0, width, height);

    // Very slow time for subtle ambient movement
    const slowTime = time * 0.25;

    // Calculate unified breathing phase - all nodes breathe together
    const breathPhase = Math.sin(slowTime * 0.001) * 0.5 + 0.5; // 0 to 1

    // Update nodes with unified breathing
    nodes.forEach((node) => {
      // Gentle floating
      const floatX = Math.sin(slowTime * 0.0004 + node.pulsePhase) * 2;
      const floatY = Math.cos(slowTime * 0.0006 + node.pulsePhase * 1.3) * 2;

      const targetX = node.baseX + floatX;
      const targetY = node.baseY + floatY;

      node.vx += (targetX - node.x) * 0.015;
      node.vy += (targetY - node.y) * 0.015;
      node.vx *= 0.96;
      node.vy *= 0.96;
      node.x += node.vx;
      node.y += node.vy;

      // Unified activation - team breathes together
      // Value nodes lead the breathing, others follow
      if (node.type === "value") {
        node.activated = breathPhase * 0.4;
      } else if (node.type === "team") {
        node.activated = breathPhase * 0.25;
      } else {
        node.activated = breathPhase * 0.15;
      }
    });

    // Update bond activation based on connected nodes
    bonds.forEach((bond) => {
      const nodeA = nodes[bond.from];
      const nodeB = nodes[bond.to];
      const targetActive = Math.max(nodeA.activated, nodeB.activated) * bond.strength;
      bond.active += (targetActive - bond.active) * 0.03;
    });

    // Occasionally spawn ambient particles along the value triangle
    if (time % 150 === 0 && particles.length < 3) {
      const valueConnections = bonds.filter(b => b.type === "value-value");
      if (valueConnections.length > 0) {
        const bond = valueConnections[Math.floor(Math.random() * valueConnections.length)];
        const reverse = Math.random() > 0.5;
        particles.push({
          x: nodes[reverse ? bond.to : bond.from].x,
          y: nodes[reverse ? bond.to : bond.from].y,
          fromNode: reverse ? bond.to : bond.from,
          toNode: reverse ? bond.from : bond.to,
          progress: 0,
          speed: 0.002 + Math.random() * 0.003,
          size: 1.5,
        });
      }
    }

    // Draw bonds - subtle and ethereal
    bonds.forEach((bond) => {
      const nodeA = nodes[bond.from];
      const nodeB = nodes[bond.to];

      ctx.beginPath();
      ctx.moveTo(nodeA.x, nodeA.y);
      ctx.lineTo(nodeB.x, nodeB.y);

      // Lower opacity for mobile - more subtle
      let opacity = 0.04 + bond.active * 0.08;

      if (bond.type === "value-value") {
        ctx.strokeStyle = `rgba(238, 96, 24, ${opacity * 1.5})`;
      } else if (bond.type === "value-team") {
        ctx.strokeStyle = `rgba(238, 96, 24, ${opacity})`;
      } else {
        ctx.strokeStyle = `rgba(184, 179, 176, ${opacity})`;
      }

      ctx.lineWidth = bond.type === "value-value" ? 1 : 0.5;
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

      const alpha = Math.sin(p.progress * Math.PI) * 0.4;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(238, 96, 24, ${alpha})`;
      ctx.fill();
    }

    // Draw nodes
    nodes.forEach((node) => {
      const breathScale = 0.85 + breathPhase * 0.15;
      const size = node.radius * breathScale;

      // Subtle glow for value nodes
      if (node.type === "value" && node.activated > 0.1) {
        ctx.beginPath();
        ctx.arc(node.x, node.y, size + 6 * node.activated, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.06})`;
        ctx.fill();
      }

      // Node fill
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

      if (node.type === "value") {
        ctx.fillStyle = `rgba(238, 96, 24, ${0.35 + node.activated * 0.4})`;
      } else if (node.type === "team") {
        ctx.fillStyle = `rgba(31, 29, 28, ${0.2 + node.activated * 0.2})`;
      } else {
        ctx.fillStyle = `rgba(184, 179, 176, ${0.15 + node.activated * 0.1})`;
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
        opacity: isReady ? 0.65 : 0,
        transition: "opacity 1.2s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// DESKTOP VERSION - Interactive trust network
// ============================================================================

function DesktopAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const nodesRef = useRef<TrustNode[]>([]);
  const bondsRef = useRef<TrustBond[]>([]);
  const particlesRef = useRef<TrustParticle[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const timeRef = useRef(0);
  const [isReady, setIsReady] = useState(false);

  const initNetwork = useCallback((width: number, height: number) => {
    const nodes: TrustNode[] = [];
    const bonds: TrustBond[] = [];

    // Three value nodes forming an elegant triangle on the right side
    // Positioned to be visible but not intrusive
    const centerX = width * 0.72;
    const centerY = height * 0.48;
    const triangleRadius = Math.min(width, height) * 0.22;

    const valueAngles = [
      -Math.PI / 2,           // Top - Clarity
      Math.PI / 2 + Math.PI / 6,  // Bottom left - Rigour
      Math.PI / 2 - Math.PI / 6,  // Bottom right - Integrity
    ];

    valueAngles.forEach((angle, index) => {
      const x = centerX + Math.cos(angle) * triangleRadius;
      const y = centerY + Math.sin(angle) * triangleRadius;
      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        radius: 8,
        type: "value",
        valueIndex: index,
        pulsePhase: (index / 3) * Math.PI * 2,
        activated: 0,
        connectionStrength: 1,
        label: VALUE_LABELS[index],
      });
    });

    // Team nodes - positioned around value nodes in orbital patterns
    const teamCount = 9;
    for (let i = 0; i < teamCount; i++) {
      // Each team node orbits one of the three value nodes
      const parentValue = i % 3;
      const parentNode = nodes[parentValue];
      const orbitRadius = 50 + Math.random() * 35;
      const angle = (i / teamCount) * Math.PI * 2 + Math.random() * 0.5;

      const x = parentNode.baseX + Math.cos(angle) * orbitRadius;
      const y = parentNode.baseY + Math.sin(angle) * orbitRadius;

      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        radius: 4,
        type: "team",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
        connectionStrength: 0.7,
      });
    }

    // Network nodes - extended network, more distant
    const networkCount = 14;
    for (let i = 0; i < networkCount; i++) {
      // Position around the whole structure
      const parentIdx = Math.floor(Math.random() * 12); // Can orbit value or team nodes
      const parent = nodes[parentIdx];
      const orbitRadius = 40 + Math.random() * 70;
      const angle = Math.random() * Math.PI * 2;

      const x = parent.baseX + Math.cos(angle) * orbitRadius;
      const y = parent.baseY + Math.sin(angle) * orbitRadius;

      // Keep nodes within bounds
      const clampedX = Math.max(width * 0.45, Math.min(width * 0.98, x));
      const clampedY = Math.max(height * 0.05, Math.min(height * 0.95, y));

      nodes.push({
        x: clampedX,
        y: clampedY,
        baseX: clampedX,
        baseY: clampedY,
        vx: 0,
        vy: 0,
        radius: 2,
        type: "network",
        pulsePhase: Math.random() * Math.PI * 2,
        activated: 0,
        connectionStrength: 0.4,
      });
    }

    // Create bonds - value triangle always connected
    bonds.push({ from: 0, to: 1, strength: 1, active: 0, type: "value-value" });
    bonds.push({ from: 1, to: 2, strength: 1, active: 0, type: "value-value" });
    bonds.push({ from: 2, to: 0, strength: 1, active: 0, type: "value-value" });

    // Connect team nodes to their parent value and to each other
    for (let i = 3; i < 12; i++) {
      const parentValue = (i - 3) % 3;
      bonds.push({
        from: parentValue,
        to: i,
        strength: 0.7,
        active: 0,
        type: "value-team",
      });
    }

    // Cross-team connections (representing collaboration)
    for (let i = 3; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 90) {
          bonds.push({
            from: i,
            to: j,
            strength: 0.4 * (1 - distance / 90),
            active: 0,
            type: "team-team",
          });
        }
      }
    }

    // Network node connections
    for (let i = 12; i < nodes.length; i++) {
      // Connect to nearest non-network nodes
      let nearestIdx = 0;
      let nearestDist = Infinity;

      for (let j = 0; j < 12; j++) {
        const dx = nodes[i].baseX - nodes[j].baseX;
        const dy = nodes[i].baseY - nodes[j].baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDist) {
          nearestDist = dist;
          nearestIdx = j;
        }
      }

      if (nearestDist < 100) {
        bonds.push({
          from: nearestIdx,
          to: i,
          strength: 0.3 * (1 - nearestDist / 100),
          active: 0,
          type: "team-team",
        });
      }
    }

    nodesRef.current = nodes;
    bondsRef.current = bonds;
    particlesRef.current = [];
    setIsReady(true);
  }, []);

  const spawnParticle = useCallback(() => {
    const bonds = bondsRef.current;
    const nodes = nodesRef.current;
    const particles = particlesRef.current;

    const activeBonds = bonds.filter((b) => b.active > 0.25);

    if (activeBonds.length > 0 && particles.length < 25) {
      const bond = activeBonds[Math.floor(Math.random() * activeBonds.length)];
      const fromNode = nodes[bond.from];
      const toNode = nodes[bond.to];
      const reverse = Math.random() > 0.5;

      particles.push({
        x: reverse ? toNode.x : fromNode.x,
        y: reverse ? toNode.y : fromNode.y,
        fromNode: reverse ? bond.to : bond.from,
        toNode: reverse ? bond.from : bond.to,
        progress: 0,
        speed: 0.006 + Math.random() * 0.01,
        size: bond.type === "value-value" ? 2.5 : 1.5 + Math.random() * 1,
      });
    }
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      const nodes = nodesRef.current;
      const bonds = bondsRef.current;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const time = timeRef.current;

      ctx.clearRect(0, 0, width, height);

      const influenceRadius = 200;
      const activationSpeed = 0.06;
      const deactivationSpeed = 0.015;

      // Update node positions and activation
      nodes.forEach((node) => {
        // Organic floating motion
        const floatX = Math.sin(time * 0.0007 + node.pulsePhase) * 4;
        const floatY = Math.cos(time * 0.0009 + node.pulsePhase * 1.3) * 4;

        let targetX = node.baseX + floatX;
        let targetY = node.baseY + floatY;

        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < influenceRadius && dist > 0 && mouse.active) {
          // Gentle attraction toward mouse for value nodes, slight repulsion for others
          const force = (1 - dist / influenceRadius) * 20;

          if (node.type === "value") {
            // Value nodes are drawn toward attention
            targetX -= (dx / dist) * force * 0.3;
            targetY -= (dy / dist) * force * 0.3;
          } else {
            // Others gently part to reveal the structure
            targetX += (dx / dist) * force * 0.15;
            targetY += (dy / dist) * force * 0.15;
          }

          // Activation based on proximity and node type
          const activationMultiplier = node.type === "value" ? 1.2 : node.type === "team" ? 1 : 0.7;
          node.activated = Math.min(1, node.activated + activationSpeed * activationMultiplier);
        } else {
          node.activated = Math.max(0, node.activated - deactivationSpeed);
        }

        // Smoother physics
        node.vx += (targetX - node.x) * 0.05;
        node.vy += (targetY - node.y) * 0.05;
        node.vx *= 0.9;
        node.vy *= 0.9;
        node.x += node.vx;
        node.y += node.vy;
      });

      // Update bond activation - propagate through the network
      bonds.forEach((bond) => {
        const nodeA = nodes[bond.from];
        const nodeB = nodes[bond.to];

        // Bonds light up when either connected node is activated
        const targetActive = Math.max(nodeA.activated, nodeB.activated) * bond.strength;

        if (targetActive > bond.active) {
          bond.active = Math.min(1, bond.active + activationSpeed * 0.4);
        } else {
          bond.active = Math.max(0, bond.active - deactivationSpeed * 0.3);
        }
      });

      // Spawn particles on active bonds
      if (time % 10 === 0) {
        spawnParticle();
      }

      // Draw bonds
      bonds.forEach((bond) => {
        const nodeA = nodes[bond.from];
        const nodeB = nodes[bond.to];

        ctx.beginPath();
        ctx.moveTo(nodeA.x, nodeA.y);
        ctx.lineTo(nodeB.x, nodeB.y);

        const baseOpacity = bond.strength * 0.12;
        const activeOpacity = bond.active * 0.5;

        if (bond.active > 0.1) {
          // Activated bonds glow orange
          if (bond.type === "value-value") {
            ctx.strokeStyle = `rgba(238, 96, 24, ${activeOpacity + 0.15})`;
            ctx.lineWidth = 1.5 + bond.active * 2;
            ctx.shadowColor = COLORS.orange;
            ctx.shadowBlur = bond.active * 12;
          } else {
            ctx.strokeStyle = `rgba(238, 96, 24, ${activeOpacity})`;
            ctx.lineWidth = 1 + bond.active * 1;
            ctx.shadowColor = COLORS.orange;
            ctx.shadowBlur = bond.active * 6;
          }
        } else {
          // Inactive bonds are subtle gray
          ctx.strokeStyle = `rgba(184, 179, 176, ${baseOpacity})`;
          ctx.lineWidth = bond.type === "value-value" ? 1 : 0.5;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      });

      // Draw particles - flowing through the network
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

      // Draw nodes
      nodes.forEach((node) => {
        const pulse = Math.sin(time * 0.002 + node.pulsePhase) * 0.12 + 0.88;
        const size = node.radius * pulse;

        // Activation glow
        if (node.activated > 0.1) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 12 * node.activated, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(238, 96, 24, ${node.activated * 0.12})`;
          ctx.fill();
        }

        // Node fill
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);

        if (node.activated > 0.25) {
          // Activated nodes turn orange
          ctx.fillStyle = COLORS.orange;
          ctx.shadowColor = COLORS.orange;
          ctx.shadowBlur = 15 * node.activated;
        } else if (node.type === "value") {
          // Value nodes are prominent dark
          ctx.fillStyle = COLORS.darkSubtle;
          ctx.shadowBlur = 0;
        } else if (node.type === "team") {
          // Team nodes are medium gray
          ctx.fillStyle = `rgba(184, 179, 176, ${0.45 + pulse * 0.15})`;
          ctx.shadowBlur = 0;
        } else {
          // Network nodes are subtle
          ctx.fillStyle = `rgba(184, 179, 176, ${0.25 + pulse * 0.1})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;

        // Ring around value nodes
        if (node.type === "value" && node.activated < 0.25) {
          ctx.beginPath();
          ctx.arc(node.x, node.y, size + 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(184, 179, 176, 0.25)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      // Subtle geometric accent - triangle echo near the value nodes
      const accentOpacity = 0.04;
      ctx.save();
      ctx.translate(nodes[0].baseX, nodes[0].baseY);
      ctx.rotate(time * 0.00015);
      ctx.beginPath();
      const accentSize = 18;
      ctx.moveTo(0, -accentSize);
      ctx.lineTo(accentSize * 0.866, accentSize * 0.5);
      ctx.lineTo(-accentSize * 0.866, accentSize * 0.5);
      ctx.closePath();
      ctx.strokeStyle = `rgba(238, 96, 24, ${accentOpacity})`;
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
        opacity: isReady ? 0.8 : 0,
        transition: "opacity 0.8s ease-out",
      }}
      aria-hidden="true"
    />
  );
}

// ============================================================================
// MAIN EXPORT - Responsive switcher
// ============================================================================

export function WhoWeAreAnimation() {
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
