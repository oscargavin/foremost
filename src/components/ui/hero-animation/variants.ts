/**
 * Animation variant configurations for different pages.
 * Each variant creates a distinctly different terrain shape and feel.
 */

export type TopologyType = 'plane' | 'sphere' | 'radial' | 'terraced' | 'wave' | 'bowl' | 'ridge';

export interface AnimationVariant {
  /** Base topology shape */
  topology: TopologyType;
  /** Noise seed offset for unique terrain shapes */
  seedOffset: number;
  /** Wave amplitude multiplier (1 = default) */
  waveAmplitude: number;
  /** Animation speed multiplier (1 = default) */
  speed: number;
  /** Grid density multiplier (1 = default 48x30) */
  gridDensity: number;
  /** Base color - subtle gray variations */
  baseColor: number;
  /** Noise frequency - higher = more detailed terrain features */
  noiseFrequency: number;
  /** Terrain height multiplier - taller peaks and deeper valleys */
  terrainHeight: number;
  /** Noise octaves style: 'balanced' | 'smooth' | 'rough' | 'ridged' */
  terrainStyle: 'balanced' | 'smooth' | 'rough' | 'ridged';
}

export const variants: Record<string, AnimationVariant> = {
  // Home - classic loss landscape terrain
  default: {
    topology: 'plane',
    seedOffset: 0,
    waveAmplitude: 1.0,
    speed: 1.0,
    gridDensity: 1.0,
    baseColor: 0x9a9694,
    noiseFrequency: 1.0,
    terrainHeight: 1.0,
    terrainStyle: 'balanced',
  },
  // Who We Are - curved horizon, global perspective
  "who-we-are": {
    topology: 'sphere',
    seedOffset: 42,
    waveAmplitude: 0.7,
    speed: 0.8,
    gridDensity: 1.0,
    baseColor: 0xa09c9a,
    noiseFrequency: 0.8,
    terrainHeight: 0.5,
    terrainStyle: 'smooth',
  },
  // How We Think - radial emanating patterns, ideas spreading
  "how-we-think": {
    topology: 'radial',
    seedOffset: 137,
    waveAmplitude: 1.0,
    speed: 1.0,
    gridDensity: 1.1,
    baseColor: 0x949290,
    noiseFrequency: 1.2,
    terrainHeight: 1.0,
    terrainStyle: 'ridged',
  },
  // How We Work - terraced steps, methodical process
  "how-we-work": {
    topology: 'terraced',
    seedOffset: 256,
    waveAmplitude: 0.7,
    speed: 0.9,
    gridDensity: 1.1,
    baseColor: 0x9e9a98,
    noiseFrequency: 0.8,
    terrainHeight: 1.0,
    terrainStyle: 'balanced',
  },
  // Careers - flowing waves, dynamic movement
  careers: {
    topology: 'wave',
    seedOffset: 389,
    waveAmplitude: 1.3,
    speed: 1.1,
    gridDensity: 1.0,
    baseColor: 0x969492,
    noiseFrequency: 1.0,
    terrainHeight: 1.2,
    terrainStyle: 'balanced',
  },
  // Contact - bowl shape, welcoming, drawing in
  contact: {
    topology: 'bowl',
    seedOffset: 512,
    waveAmplitude: 0.6,
    speed: 0.8,
    gridDensity: 0.95,
    baseColor: 0xa8a4a2,
    noiseFrequency: 0.6,
    terrainHeight: 0.5,
    terrainStyle: 'smooth',
  },
  // Energy - wave patterns like power flow
  "industry-energy": {
    topology: 'wave',
    seedOffset: 600,
    waveAmplitude: 1.2,
    speed: 1.1,
    gridDensity: 1.0,
    baseColor: 0x9c9896,
    noiseFrequency: 0.9,
    terrainHeight: 1.0,
    terrainStyle: 'balanced',
  },
  // Financial - terraced, structured stability
  "industry-financial": {
    topology: 'terraced',
    seedOffset: 700,
    waveAmplitude: 0.6,
    speed: 0.85,
    gridDensity: 1.1,
    baseColor: 0x98969c,
    noiseFrequency: 0.7,
    terrainHeight: 0.8,
    terrainStyle: 'smooth',
  },
  // Healthcare - sphere, organic wholeness
  "industry-healthcare": {
    topology: 'sphere',
    seedOffset: 800,
    waveAmplitude: 0.8,
    speed: 0.9,
    gridDensity: 1.0,
    baseColor: 0x9a9e9c,
    noiseFrequency: 0.7,
    terrainHeight: 0.4,
    terrainStyle: 'smooth',
  },
  // Manufacturing - ridge spine, industrial backbone
  "industry-manufacturing": {
    topology: 'ridge',
    seedOffset: 900,
    waveAmplitude: 0.8,
    speed: 0.95,
    gridDensity: 1.15,
    baseColor: 0x9a9896,
    noiseFrequency: 1.1,
    terrainHeight: 1.0,
    terrainStyle: 'rough',
  },
  // Professional - radial, network of expertise
  "industry-professional": {
    topology: 'radial',
    seedOffset: 1000,
    waveAmplitude: 0.7,
    speed: 0.9,
    gridDensity: 1.0,
    baseColor: 0x9c9a98,
    noiseFrequency: 0.8,
    terrainHeight: 0.7,
    terrainStyle: 'balanced',
  },
  // Retail - plane with dynamic terrain
  "industry-retail": {
    topology: 'plane',
    seedOffset: 1100,
    waveAmplitude: 1.1,
    speed: 1.1,
    gridDensity: 1.0,
    baseColor: 0x989694,
    noiseFrequency: 1.2,
    terrainHeight: 1.2,
    terrainStyle: 'rough',
  },
};

export type VariantName = keyof typeof variants;

export function getVariant(name?: string): AnimationVariant {
  if (!name || !(name in variants)) {
    return variants.default;
  }
  return variants[name as VariantName];
}
