import { PERFORMANCE_CONFIGS } from "./performanceConfigs";

export function getPerformanceLevel(isMobile) {
  const isLowEnd = navigator.hardwareConcurrency < 4 || window.innerWidth < 768;
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

export function getParticleConfig(isMobile) {
  const level = getPerformanceLevel(isMobile);
  return PERFORMANCE_CONFIGS[level];
}
