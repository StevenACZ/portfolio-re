import {
  Color,
  DynamicDrawUsage,
  InstancedMesh,
  Matrix4,
  MeshPhongMaterial,
  Quaternion,
  SphereGeometry,
  Vector3,
} from "three";
import {
  MATERIAL_CONFIG,
  ORBIT_CONFIG,
  PARTICLE_SIZE_CONFIG,
  SCENE_COLORS,
  getParticleConfig,
} from "../../config/threeScene";

export function createParticleField({ isMobile }) {
  const particleConfig = getParticleConfig(isMobile);
  const orbitConfig = isMobile ? ORBIT_CONFIG.mobile : ORBIT_CONFIG.desktop;

  const total = particleConfig.count;
  const purpleCount = Math.ceil(total / 2);
  const blueCount = Math.floor(total / 2);

  const geometry = new SphereGeometry(
    1,
    particleConfig.segments,
    particleConfig.rings
  );

  const purpleMaterial = new MeshPhongMaterial({
    color: new Color(SCENE_COLORS.appPurple),
    ...MATERIAL_CONFIG,
  });
  const blueMaterial = new MeshPhongMaterial({
    color: new Color(SCENE_COLORS.appBlue),
    ...MATERIAL_CONFIG,
  });

  const purpleMesh = new InstancedMesh(geometry, purpleMaterial, purpleCount);
  const blueMesh = new InstancedMesh(geometry, blueMaterial, blueCount);

  purpleMesh.instanceMatrix.setUsage(DynamicDrawUsage);
  blueMesh.instanceMatrix.setUsage(DynamicDrawUsage);

  const purple = [];
  const blue = [];

  for (let i = 0; i < total; i += 1) {
    const isPlanet = Math.random() < PARTICLE_SIZE_CONFIG.planetChance;
    const scale = isPlanet
      ? Math.random() * particleConfig.size +
        PARTICLE_SIZE_CONFIG.planetMinScale
      : Math.random() *
          (particleConfig.size * PARTICLE_SIZE_CONFIG.moonSizeMultiplier) +
        PARTICLE_SIZE_CONFIG.moonMinScale;

    const radius =
      Math.random() * orbitConfig.maxRadius + orbitConfig.minRadius;
    const angle = (i / total) * Math.PI * 2;
    const offsetAngle =
      (Math.random() - 0.5) * Math.PI * ORBIT_CONFIG.angleVariation;
    const orbitAngle = angle + offsetAngle;

    const x = Math.cos(orbitAngle) * radius;
    const y = Math.sin(orbitAngle) * radius * ORBIT_CONFIG.yFlatten;
    const z = (Math.random() - 0.5) * ORBIT_CONFIG.zDepth;

    const particle = {
      orbitRadius: radius,
      orbitSpeed: (Math.random() * 0.002 + 0.0005) * particleConfig.speed,
      orbitAngle,
      currentAngle: orbitAngle,
      x,
      y,
      z,
      scale,
    };

    if (i % 2 === 0) purple.push(particle);
    else blue.push(particle);
  }

  const matrix = new Matrix4();
  const position = new Vector3();
  const quaternion = new Quaternion();
  const scale = new Vector3();

  const applyInitialMatrices = (mesh, list) => {
    list.forEach((particle, index) => {
      scale.setScalar(particle.scale);
      position.set(particle.x, particle.y, particle.z);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });
    mesh.instanceMatrix.needsUpdate = true;
  };

  applyInitialMatrices(purpleMesh, purple);
  applyInitialMatrices(blueMesh, blue);

  const mouseInfluenceSq =
    particleConfig.mouseInfluence * particleConfig.mouseInfluence;

  function updateList(mesh, list, mouseX, mouseY) {
    list.forEach((particle, index) => {
      particle.currentAngle += particle.orbitSpeed;

      const baseX = Math.cos(particle.currentAngle) * particle.orbitRadius;
      const baseY =
        Math.sin(particle.currentAngle) *
        particle.orbitRadius *
        ORBIT_CONFIG.yFlatten;

      const dx = particle.x - mouseX;
      const dy = particle.y - mouseY;
      const distanceSq = dx * dx + dy * dy;

      let x = baseX;
      let y = baseY;

      if (distanceSq < mouseInfluenceSq) {
        const distance2D = Math.sqrt(distanceSq) || 1;
        const disperseForce =
          (particleConfig.mouseInfluence - distance2D) /
          particleConfig.mouseInfluence;
        x += (dx / distance2D) * disperseForce * 8;
        y += (dy / distance2D) * disperseForce * 8;
      }

      particle.x = x;
      particle.y = y;

      scale.setScalar(particle.scale);
      position.set(particle.x, particle.y, particle.z);
      matrix.compose(position, quaternion, scale);
      mesh.setMatrixAt(index, matrix);
    });

    mesh.instanceMatrix.needsUpdate = true;
  }

  function update(mouse) {
    const mouseX = mouse.x * 15;
    const mouseY = mouse.y * 15;

    updateList(purpleMesh, purple, mouseX, mouseY);
    updateList(blueMesh, blue, mouseX, mouseY);
  }

  function dispose() {
    geometry.dispose?.();
    purpleMaterial.dispose?.();
    blueMaterial.dispose?.();
  }

  return {
    meshes: [purpleMesh, blueMesh],
    config: particleConfig,
    update,
    dispose,
  };
}
