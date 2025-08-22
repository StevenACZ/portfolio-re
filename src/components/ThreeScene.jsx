import React, { useRef, useEffect, useMemo } from 'react';
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
  Mesh
} from 'three';

export const ThreeScene = ({ canvasRef, onLoaded }) => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef(null);
  // const performanceRef = useRef({ frameCount: 0, lastTime: Date.now(), avgFPS: 60 });

  // Device detection
  const isMobile = useMemo(() => {
    return (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768
    );
  }, []);

  // Particle configuration based on device and performance
  const particleConfig = useMemo(() => {
    const isLowEnd = navigator.hardwareConcurrency < 4 || window.innerWidth < 768;
    const hasLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
    const isSlowConnection = navigator.connection && 
      (navigator.connection.effectiveType === 'slow-2g' || navigator.connection.effectiveType === '2g');
    
    const performanceLevel = (hasLowMemory || isSlowConnection) ? 'ultra-low' : 
      isLowEnd ? 'low' : isMobile ? 'medium' : 'high';
    
    const configs = {
      'ultra-low': { count: 25, size: 0.5, speed: 0.1, mouseInfluence: 15, segments: 8, rings: 6, updateRate: 3 },
      low: { count: 50, size: 0.7, speed: 0.15, mouseInfluence: 20, segments: 12, rings: 8, updateRate: 2 },
      medium: { count: 120, size: 0.9, speed: 0.25, mouseInfluence: 25, segments: 16, rings: 12, updateRate: 1 },
      high: { count: 300, size: 0.8, speed: 0.3, mouseInfluence: 80, segments: 20, rings: 16, updateRate: 1 }
    };
    
    return configs[performanceLevel];
  }, [isMobile]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: !isMobile, // Disable antialiasing on mobile for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
    );
    rendererRef.current = renderer;

    // 3D Sphere Particle System Setup
    const particleGroup = new Group();
    const particlesArray = [];

    // Pre-create materials for efficiency
    const appPurple = new Color(0x8b5cf6); // Your app's purple
    const appBlue = new Color(0x3b82f6); // Your app's blue

    // Lighting setup - optimized for performance
    const ambientLight = new AmbientLight(0x2a1f3d, 0.3); // Darker purple ambient
    const directionalLight = new DirectionalLight(0x4338ca, 0.4); // Purple directional light
    directionalLight.position.set(10, 10, 5);
    const pointLight = new PointLight(0x7c3aed, 0.3, 50); // Purple point light
    pointLight.position.set(-10, -10, 10);

    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.add(pointLight);

    // Create base geometry once and reuse
    const baseGeometry = new SphereGeometry(1, particleConfig.segments, particleConfig.rings);
    
    // Pre-create materials
    const purpleMaterial = new MeshPhongMaterial({
      color: appPurple,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
    });
    
    const blueMaterial = new MeshPhongMaterial({
      color: appBlue,
      transparent: true,
      opacity: 0.8,
      shininess: 100,
    });

    // Create particles
    for (let i = 0; i < particleConfig.count; i++) {
      // Create variety of sizes: planets (large) and moons (small)
      const isPlanet = Math.random() < 0.3; // 30% chance of being a "planet"
      const scale = isPlanet 
        ? Math.random() * particleConfig.size + 0.4 // Large planets (0.4 to size+0.4)
        : Math.random() * (particleConfig.size * 0.5) + 0.1; // Small moons (0.1 to size*0.5+0.1)
      
      const sphereGeometry = baseGeometry.clone();
      sphereGeometry.scale(scale, scale, scale);
      
      // Alternate between purple and blue for exact 50/50 split
      const sphereMaterial = i % 2 === 0 ? purpleMaterial.clone() : blueMaterial.clone();
      const sphere = new Mesh(sphereGeometry, sphereMaterial);

      // Position particles in a 3D space (facing user in XY plane)
      // Mobile: closer orbit around invisible planet, Desktop: more spread out
      const maxRadius = isMobile ? 12 : 35; // Mobile: 4-16, Desktop: 10-45
      const minRadius = isMobile ? 4 : 10;
      const radius = Math.random() * maxRadius + minRadius; // Distance from center
      const angle = (i / particleConfig.count) * Math.PI * 2; // Even distribution
      const offsetAngle = (Math.random() - 0.5) * Math.PI * 0.3; // Add some randomness
      const finalAngle = angle + offsetAngle;
      
      sphere.position.x = Math.cos(finalAngle) * radius;
      sphere.position.y = Math.sin(finalAngle) * radius * 0.6; // Flatten Y a bit
      sphere.position.z = (Math.random() - 0.5) * 10; // Random depth

      // Store orbital properties
      sphere.userData = {
        orbitRadius: radius,
        orbitSpeed: (Math.random() * 0.002 + 0.0005) * particleConfig.speed, // Even slower orbital speeds
        orbitAngle: finalAngle,
        originalPosition: sphere.position.clone(),
        baseScale: scale,
      };

      particleGroup.add(sphere);
      particlesArray.push(sphere);
    }

    scene.add(particleGroup);
    particlesRef.current = particlesArray;

    // Mouse tracking
    const handleMouseMove = (event) => {
      // Convert to Three.js coordinate system
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    // Animation loop
    let frameCount = 0;
    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);
      frameCount++;

      // Update particles with orbital motion and mouse interaction
      if (particlesRef.current && frameCount % particleConfig.updateRate === 0) {
        particlesRef.current.forEach((particle) => {
          const userData = particle.userData;
          
          // Orbital motion in horizontal plane (XY facing user)
          userData.currentAngle = (userData.currentAngle || userData.orbitAngle) + userData.orbitSpeed;
          
          // Calculate base orbital position
          const baseX = Math.cos(userData.currentAngle) * userData.orbitRadius;
          const baseY = Math.sin(userData.currentAngle) * userData.orbitRadius * 0.6;
          
          // Mouse interaction - Dispersion effect only
          const mouseX = mouseRef.current.x * 15; // Scale to scene coordinates
          const mouseY = mouseRef.current.y * 15;
          
          // Calculate distance to mouse
          const dx = particle.position.x - mouseX;
          const dy = particle.position.y - mouseY;
          const distance3D = Math.sqrt(dx * dx + dy * dy);
          
          let finalX = baseX;
          let finalY = baseY;
          
          // Apply dispersion force when mouse is close
          if (distance3D < particleConfig.mouseInfluence) {
            const disperseForce = (particleConfig.mouseInfluence - distance3D) / particleConfig.mouseInfluence;
            finalX += (dx / distance3D) * disperseForce * 8;
            finalY += (dy / distance3D) * disperseForce * 8;
          }
          
          // Update position
          particle.position.x = finalX;
          particle.position.y = finalY;
          
          // Gentle rotation
          particle.rotation.x += 0.01;
          particle.rotation.y += 0.01;
        });
      }

      // Render
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Mark as loaded
    setTimeout(() => {
      onLoaded && onLoaded();
    }, 100);

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }

      // Cleanup Three.js objects
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        });
        sceneRef.current.clear();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [canvasRef, particleConfig, isMobile, onLoaded]);

  return null; // This component only manages the Three.js canvas
};