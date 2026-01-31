<template>
  <div class="three-scene" aria-hidden="true" />
</template>

<script setup>
import { onMounted, onUnmounted, watch } from "vue";
import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from "three";
import {
  CAMERA_CONFIG,
  LIGHT_CONFIG,
  MATERIAL_CONFIG,
  ORBIT_CONFIG,
  PARTICLE_SIZE_CONFIG,
  SCENE_COLORS,
  getParticleConfig,
} from "../config/threeScene";

const props = defineProps({
  canvas: { type: Object, default: null },
});

const emit = defineEmits(["loaded"]);

let scene = null;
let renderer = null;
let camera = null;
let particles = null;
let frameId = null;
const mouse = { x: 0, y: 0 };
let cleanup = null;

function setup(canvasEl) {
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;

  const particleConfig = getParticleConfig(isMobile);

  scene = new Scene();

  camera = new PerspectiveCamera(
    CAMERA_CONFIG.fov,
    window.innerWidth / window.innerHeight,
    CAMERA_CONFIG.near,
    CAMERA_CONFIG.far
  );
  camera.position.z = CAMERA_CONFIG.positionZ;

  renderer = new WebGLRenderer({
    canvas: canvasEl,
    alpha: true,
    antialias: !isMobile,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  const particleGroup = new Group();
  const particlesArray = [];

  const appPurple = new Color(SCENE_COLORS.appPurple);
  const appBlue = new Color(SCENE_COLORS.appBlue);

  const ambientLight = new AmbientLight(
    SCENE_COLORS.ambientLight,
    LIGHT_CONFIG.ambient.intensity
  );
  const directionalLight = new DirectionalLight(
    SCENE_COLORS.directionalLight,
    LIGHT_CONFIG.directional.intensity
  );
  directionalLight.position.set(...LIGHT_CONFIG.directional.position);
  const pointLight = new PointLight(
    SCENE_COLORS.pointLight,
    LIGHT_CONFIG.point.intensity,
    LIGHT_CONFIG.point.distance
  );
  pointLight.position.set(...LIGHT_CONFIG.point.position);

  scene.add(ambientLight, directionalLight, pointLight);

  const baseGeometry = new SphereGeometry(
    1,
    particleConfig.segments,
    particleConfig.rings
  );

  const purpleMaterial = new MeshPhongMaterial({
    color: appPurple,
    ...MATERIAL_CONFIG,
  });
  const blueMaterial = new MeshPhongMaterial({
    color: appBlue,
    ...MATERIAL_CONFIG,
  });

  const createParticlesBatch = () => {
    const batchSize = Math.min(20, particleConfig.count);
    let currentIndex = 0;
    const orbitConfig = isMobile ? ORBIT_CONFIG.mobile : ORBIT_CONFIG.desktop;

    const processBatch = () => {
      const endIndex = Math.min(currentIndex + batchSize, particleConfig.count);

      for (let i = currentIndex; i < endIndex; i++) {
        const isPlanet = Math.random() < PARTICLE_SIZE_CONFIG.planetChance;
        const scale = isPlanet
          ? Math.random() * particleConfig.size +
            PARTICLE_SIZE_CONFIG.planetMinScale
          : Math.random() *
              (particleConfig.size * PARTICLE_SIZE_CONFIG.moonSizeMultiplier) +
            PARTICLE_SIZE_CONFIG.moonMinScale;

        const sphereGeometry = baseGeometry.clone();
        sphereGeometry.scale(scale, scale, scale);

        const sphereMaterial = i % 2 === 0 ? purpleMaterial : blueMaterial;
        const sphere = new Mesh(sphereGeometry, sphereMaterial.clone());

        const radius =
          Math.random() * orbitConfig.maxRadius + orbitConfig.minRadius;
        const angle = (i / particleConfig.count) * Math.PI * 2;
        const offsetAngle =
          (Math.random() - 0.5) * Math.PI * ORBIT_CONFIG.angleVariation;
        const finalAngle = angle + offsetAngle;

        sphere.position.x = Math.cos(finalAngle) * radius;
        sphere.position.y =
          Math.sin(finalAngle) * radius * ORBIT_CONFIG.yFlatten;
        sphere.position.z = (Math.random() - 0.5) * ORBIT_CONFIG.zDepth;

        sphere.userData = {
          orbitRadius: radius,
          orbitSpeed: (Math.random() * 0.002 + 0.0005) * particleConfig.speed,
          orbitAngle: finalAngle,
          originalPosition: sphere.position.clone(),
          baseScale: scale,
        };

        particleGroup.add(sphere);
        particlesArray.push(sphere);
      }

      currentIndex = endIndex;

      if (currentIndex < particleConfig.count) {
        window.setTimeout(processBatch, 0);
      }
    };

    processBatch();
  };

  createParticlesBatch();
  scene.add(particleGroup);
  particles = particlesArray;

  function handleMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  let frameCount = 0;
  function animate() {
    frameId = requestAnimationFrame(animate);
    frameCount++;

    if (particles && frameCount % particleConfig.updateRate === 0) {
      particles.forEach((particle) => {
        const userData = particle.userData;

        userData.currentAngle =
          (userData.currentAngle || userData.orbitAngle) + userData.orbitSpeed;

        const baseX = Math.cos(userData.currentAngle) * userData.orbitRadius;
        const baseY =
          Math.sin(userData.currentAngle) *
          userData.orbitRadius *
          ORBIT_CONFIG.yFlatten;

        const mouseX = mouse.x * 15;
        const mouseY = mouse.y * 15;
        const dx = particle.position.x - mouseX;
        const dy = particle.position.y - mouseY;
        const distance2D = Math.sqrt(dx * dx + dy * dy);

        let finalX = baseX;
        let finalY = baseY;

        if (distance2D < particleConfig.mouseInfluence) {
          const disperseForce =
            (particleConfig.mouseInfluence - distance2D) /
            particleConfig.mouseInfluence;
          finalX += (dx / distance2D) * disperseForce * 8;
          finalY += (dy / distance2D) * disperseForce * 8;
        }

        particle.position.x = finalX;
        particle.position.y = finalY;
        particle.rotation.x += 0.01;
        particle.rotation.y += 0.01;
      });
    }

    renderer.render(scene, camera);
  }

  animate();

  function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", handleResize);

  window.setTimeout(() => emit("loaded"), 100);

  return () => {
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", handleResize);

    if (frameId) cancelAnimationFrame(frameId);

    if (scene) {
      scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose());
          } else {
            object.material.dispose?.();
          }
        }
      });
      scene.clear();
    }

    renderer?.dispose?.();
    scene = null;
    renderer = null;
    camera = null;
    particles = null;
    frameId = null;
  };
}

onMounted(() => {
  if (props.canvas) cleanup = setup(props.canvas);
});

watch(
  () => props.canvas,
  (nextCanvas) => {
    if (!nextCanvas || cleanup) return;
    cleanup = setup(nextCanvas);
  }
);

onUnmounted(() => {
  cleanup?.();
  cleanup = null;
});
</script>
