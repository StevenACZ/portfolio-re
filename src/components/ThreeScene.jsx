import { useRef, useEffect, useMemo, startTransition } from "react";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  Group,
  Color,
  AmbientLight,
  DirectionalLight,
  PointLight,
  SphereGeometry,
  MeshPhongMaterial,
  Mesh,
} from "three";
import {
  SCENE_COLORS,
  LIGHT_CONFIG,
  MATERIAL_CONFIG,
  CAMERA_CONFIG,
  ORBIT_CONFIG,
  PARTICLE_SIZE_CONFIG,
  getParticleConfig,
} from "../config/threeScene";

export const ThreeScene = ({ canvasRef, onLoaded }) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef(null);

  // Device detection
  const isMobile = useMemo(() => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768
    );
  }, []);

  // Get particle configuration based on device
  const particleConfig = useMemo(
    () => getParticleConfig(isMobile),
    [isMobile]
  );

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new PerspectiveCamera(
      CAMERA_CONFIG.fov,
      window.innerWidth / window.innerHeight,
      CAMERA_CONFIG.near,
      CAMERA_CONFIG.far
    );
    camera.position.z = CAMERA_CONFIG.positionZ;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: !isMobile,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    rendererRef.current = renderer;

    // Particle system setup
    const particleGroup = new Group();
    const particlesArray = [];

    // Materials
    const appPurple = new Color(SCENE_COLORS.appPurple);
    const appBlue = new Color(SCENE_COLORS.appBlue);

    // Lighting
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

    // Base geometry
    const baseGeometry = new SphereGeometry(
      1,
      particleConfig.segments,
      particleConfig.rings
    );

    // Pre-create materials
    const purpleMaterial = new MeshPhongMaterial({
      color: appPurple,
      ...MATERIAL_CONFIG,
    });
    const blueMaterial = new MeshPhongMaterial({
      color: appBlue,
      ...MATERIAL_CONFIG,
    });

    // Create particles in batches
    const createParticlesBatch = () => {
      const batchSize = Math.min(20, particleConfig.count);
      let currentIndex = 0;
      const orbitConfig = isMobile ? ORBIT_CONFIG.mobile : ORBIT_CONFIG.desktop;

      const processBatch = () => {
        const endIndex = Math.min(currentIndex + batchSize, particleConfig.count);

        for (let i = currentIndex; i < endIndex; i++) {
          // Size: planets (large) or moons (small)
          const isPlanet = Math.random() < PARTICLE_SIZE_CONFIG.planetChance;
          const scale = isPlanet
            ? Math.random() * particleConfig.size + PARTICLE_SIZE_CONFIG.planetMinScale
            : Math.random() * (particleConfig.size * PARTICLE_SIZE_CONFIG.moonSizeMultiplier) +
              PARTICLE_SIZE_CONFIG.moonMinScale;

          const sphereGeometry = baseGeometry.clone();
          sphereGeometry.scale(scale, scale, scale);

          const sphereMaterial =
            i % 2 === 0 ? purpleMaterial.clone() : blueMaterial.clone();
          const sphere = new Mesh(sphereGeometry, sphereMaterial);

          // Position
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

          // Orbital properties
          sphere.userData = {
            orbitRadius: radius,
            orbitSpeed:
              (Math.random() * 0.002 + 0.0005) * particleConfig.speed,
            orbitAngle: finalAngle,
            originalPosition: sphere.position.clone(),
            baseScale: scale,
          };

          particleGroup.add(sphere);
          particlesArray.push(sphere);
        }

        currentIndex = endIndex;

        if (currentIndex < particleConfig.count) {
          startTransition(() => {
            setTimeout(processBatch, 0);
          });
        }
      };

      processBatch();
    };

    createParticlesBatch();
    scene.add(particleGroup);
    particlesRef.current = particlesArray;

    // Mouse tracking
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      frameCount++;

      if (
        particlesRef.current &&
        frameCount % particleConfig.updateRate === 0
      ) {
        particlesRef.current.forEach((particle) => {
          const userData = particle.userData;

          // Orbital motion
          userData.currentAngle =
            (userData.currentAngle || userData.orbitAngle) + userData.orbitSpeed;

          const baseX = Math.cos(userData.currentAngle) * userData.orbitRadius;
          const baseY =
            Math.sin(userData.currentAngle) *
            userData.orbitRadius *
            ORBIT_CONFIG.yFlatten;

          // Mouse dispersion
          const mouseX = mouseRef.current.x * 15;
          const mouseY = mouseRef.current.y * 15;
          const dx = particle.position.x - mouseX;
          const dy = particle.position.y - mouseY;
          const distance3D = Math.sqrt(dx * dx + dy * dy);

          let finalX = baseX;
          let finalY = baseY;

          if (distance3D < particleConfig.mouseInfluence) {
            const disperseForce =
              (particleConfig.mouseInfluence - distance3D) /
              particleConfig.mouseInfluence;
            finalX += (dx / distance3D) * disperseForce * 8;
            finalY += (dy / distance3D) * disperseForce * 8;
          }

          particle.position.x = finalX;
          particle.position.y = finalY;
          particle.rotation.x += 0.01;
          particle.rotation.y += 0.01;
        });
      }

      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    // Mark as loaded
    setTimeout(() => onLoaded?.(), 100);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);

      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          object.geometry?.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((m) => m.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
      }

      rendererRef.current?.dispose();
    };
  }, [canvasRef, particleConfig, isMobile, onLoaded]);

  return null;
};
