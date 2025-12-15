// ThreeScene configuration for 3D particle system
// Colors matching the portfolio's purple/blue theme
export const SCENE_COLORS = {
  appPurple: 0x8b5cf6,
  appBlue: 0x3b82f6,
  ambientLight: 0x2a1f3d,
  directionalLight: 0x4338ca,
  pointLight: 0x7c3aed,
};

// Light intensities
export const LIGHT_CONFIG = {
  ambient: { intensity: 0.3 },
  directional: { intensity: 0.4, position: [10, 10, 5] },
  point: { intensity: 0.3, distance: 50, position: [-10, -10, 10] },
};

// Material configuration
export const MATERIAL_CONFIG = {
  transparent: true,
  opacity: 0.8,
  shininess: 100,
};

// Camera configuration
export const CAMERA_CONFIG = {
  fov: 75,
  near: 0.1,
  far: 1000,
  positionZ: 30,
};

// Performance level configurations for different devices
export const PERFORMANCE_CONFIGS = {
  "ultra-low": {
    count: 25,
    size: 0.5,
    speed: 0.1,
    mouseInfluence: 15,
    segments: 8,
    rings: 6,
    updateRate: 3,
  },
  low: {
    count: 50,
    size: 0.7,
    speed: 0.15,
    mouseInfluence: 20,
    segments: 12,
    rings: 8,
    updateRate: 2,
  },
  medium: {
    count: 120,
    size: 0.9,
    speed: 0.25,
    mouseInfluence: 25,
    segments: 16,
    rings: 12,
    updateRate: 1,
  },
  high: {
    count: 300,
    size: 0.8,
    speed: 0.3,
    mouseInfluence: 80,
    segments: 20,
    rings: 16,
    updateRate: 1,
  },
};

// Orbit configuration for particles
export const ORBIT_CONFIG = {
  mobile: { maxRadius: 12, minRadius: 4 },
  desktop: { maxRadius: 35, minRadius: 10 },
  yFlatten: 0.6,
  zDepth: 10,
  angleVariation: 0.3,
};

// Particle size distribution
export const PARTICLE_SIZE_CONFIG = {
  planetChance: 0.3, // 30% chance of being a "planet"
  planetMinScale: 0.4,
  moonMinScale: 0.1,
  moonSizeMultiplier: 0.5,
};

/**
 * Determine performance level based on device capabilities
 */
export function getPerformanceLevel(isMobile) {
  const isLowEnd =
    navigator.hardwareConcurrency < 4 || window.innerWidth < 768;
  const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
  const isSlowConnection =
    navigator.connection &&
    (navigator.connection.effectiveType === "slow-2g" ||
      navigator.connection.effectiveType === "2g");

  if (hasLowMemory || isSlowConnection) return "ultra-low";
  if (isLowEnd) return "low";
  if (isMobile) return "medium";
  return "high";
}

/**
 * Get particle configuration for current device
 */
export function getParticleConfig(isMobile) {
  const level = getPerformanceLevel(isMobile);
  return PERFORMANCE_CONFIGS[level];
}
