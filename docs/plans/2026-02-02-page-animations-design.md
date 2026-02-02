# Page Animation Designs

Three.js hero animations for each main page, following the design language established by the home page topology and who-we-are crystalline animations.

## Design Principles

- **Wireframe aesthetic** - consistent with existing animations
- **Orange accent** (`#ee6018`) for highlights and interaction
- **Warm gray** (`#b8b3b0`) for base elements
- **Mouse interactivity** on desktop, ambient pulses on mobile
- **Right-side positioning** to complement left-aligned text
- **Performance-conscious** - visibility pausing, reduced complexity on mobile

---

## Completed Animations

### Home Page (`/`)
**Concept**: Topology/Terrain Surface
- Undulating 3D wireframe landscape
- Mouse creates ripple effects
- Peak markers representing key nodes
- Flow paths with traveling particles
- Metaphor: Navigating the AI landscape, finding elevated vantage points

### Who We Are (`/who-we-are`)
**Concept**: Crystalline Growth
- Three seed points (founders) with radiating crystal spikes
- Seeds connected by animated energy paths
- Mouse proximity triggers crystal growth toward cursor
- Floating particles emanating from seeds
- Metaphor: Expertise crystallizing into solid foundations, interconnected team

---

## Proposed Animations

### How We Think (`/how-we-think`)
**Page theme**: Four core beliefs about AI strategy

**Recommended concept**: **Orbital Constellation**
- Four primary nodes arranged in orbital paths around a central point
- Each node represents a core belief
- Nodes connected by subtle gravitational lines
- Mouse interaction causes nodes to gravitate toward cursor, then snap back
- Orbits have different speeds/radiuses creating dynamic motion
- Metaphor: Ideas in balance, interconnected thinking, gravitational pull of principles

**Alternative concepts**:
1. **Layered Prisms** - Four transparent geometric prisms that rotate and refract light differently based on viewing angle
2. **Neural Pathways** - Branching thought patterns that illuminate when mouse hovers

---

### How We Work (`/how-we-work`)
**Page theme**: Partnership approach, phased engagement process

**Recommended concept**: **Assembly Pipeline**
- Geometric shapes moving along curved conveyor paths
- Multiple streams that merge and diverge
- Shapes transform as they progress (raw → refined)
- Mouse interaction speeds up nearby flow
- Checkpoints where shapes pause briefly before continuing
- Metaphor: Structured process, transformation, collaborative workflow

**Alternative concepts**:
1. **Interlocking Gears** - Wireframe gears of different sizes meshing together, mouse affects rotation speed
2. **Wave Interference** - Multiple wave sources creating interference patterns, representing collaboration

---

### Careers (`/careers`)
**Page theme**: Join the team, growth opportunities

**Recommended concept**: **Rising Particles / Ascent**
- Particles rising from bottom, gaining structure as they ascend
- Lower particles are diffuse, upper particles form into geometric shapes
- Multiple "streams" of rising elements
- Mouse creates updraft effect, accelerating nearby particles
- Metaphor: Growth, potential becoming realized, upward trajectory

**Alternative concepts**:
1. **Budding Network** - New nodes sprouting and connecting to existing network structure
2. **Staircase Construction** - Geometric steps building upward in real-time

---

### Contact (`/contact`)
**Page theme**: Start a conversation, reach out

**Recommended concept**: **Signal Pulse / Beacon**
- Central beacon point emitting concentric rings/waves
- Rings expand outward and fade
- Secondary receiver points that "light up" when waves reach them
- Mouse click creates additional pulse from cursor location
- Metaphor: Communication, signal and response, connection

**Alternative concepts**:
1. **Converging Lines** - Lines from edges of screen converging toward center point
2. **Handshake Geometry** - Two abstract forms approaching and interlocking

---

### Industries (shared animation or per-industry)

**Option A: Shared animation across all industry pages**

**Recommended concept**: **Sector Grid**
- Isometric grid of blocks at varying heights
- Blocks pulse/rise when mouse approaches
- Color intensity varies by "elevation"
- Subtle data-visualization feel
- Metaphor: Industry landscape, varied terrain of opportunity

**Option B: Unique per-industry (more work, higher impact)**

| Industry | Concept | Key Visual |
|----------|---------|------------|
| Healthcare | Pulse Monitor | ECG-style line with geometric heartbeat |
| Financial Services | Flow Chart | Currency/value flowing through network nodes |
| Manufacturing | Assembly Line | Components moving along production paths |
| Retail | Network Nodes | Connected points representing supply chain |
| Energy | Power Grid | Lines carrying energy pulses between stations |
| Professional Services | Org Chart | Hierarchical nodes with flowing connections |

---

## Implementation Priority

1. **How We Think** - High traffic page, strong conceptual fit with orbital idea
2. **How We Work** - Process visualization aligns well with service offering
3. **Contact** - Beacon concept is simple, high impact for conversion page
4. **Careers** - Lower priority but ascending particles would be engaging
5. **Industries** - Consider shared animation first, expand to unique later

---

## Technical Notes

- Reuse patterns from existing animations (dynamic import, visibility observer, mobile detection)
- Keep shader complexity moderate for performance
- Consider shared hooks directory for mouse tracking, visibility, etc.
- Mobile: reduce particle counts, simplify geometry, use ambient pulses instead of mouse tracking
