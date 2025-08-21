import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import Typewriter from 'typewriter-effect';

const HeroSection = ({ onScrollIndicatorClick }) => {
  const canvasRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const particlesRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameIdRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const performanceRef = useRef({ frameCount: 0, lastTime: Date.now(), avgFPS: 60 });

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
      'ultra-low': { count: 15, size: 0.1, speed: 0.1, mouseInfluence: 20, segments: 3, rings: 2, updateRate: 3 },
      low: { count: 30, size: 0.15, speed: 0.15, mouseInfluence: 30, segments: 4, rings: 3, updateRate: 2 },
      medium: { count: 80, size: 0.25, speed: 0.25, mouseInfluence: 50, segments: 6, rings: 4, updateRate: 1 },
      high: { count: 200, size: 0.4, speed: 0.4, mouseInfluence: 80, segments: 8, rings: 6, updateRate: 1 }
    };
    
    return configs[performanceLevel];
  }, [isMobile]);

  // Typewriter words
  const typewriterWords = [
    'Full Stack Developer',
    'Swift Developer',
    'Creative Problem Solver',
    'UX Enthusiast',
    'React Specialist',
    'Mobile App Creator',
  ];

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
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
    const particleGroup = new THREE.Group();
    const particlesArray = [];
    // const originalPositions = [];

    // Exact app colors: 50% purple, 50% blue
    const appPurple = new THREE.Color(0x8b5cf6); // Your app's purple
    const appBlue = new THREE.Color(0x3b82f6); // Your app's blue

    // Create subtle lighting that preserves particle colors
    const ambientLight = new THREE.AmbientLight(0x2a1f3d, 0.3); // Darker purple ambient
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x4338ca, 0.4); // Purple directional light
    directionalLight.position.set(10, 10, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x7c3aed, 0.3, 50); // Purple point light
    pointLight.position.set(-10, -10, 10);
    scene.add(pointLight);

    // Object pooling for geometries and materials
    const geometryPool = [];
    const materialPool = { purple: [], blue: [] };
    
    // Pre-create optimized geometries and materials
    const baseGeometry = new THREE.SphereGeometry(1, particleConfig.segments, particleConfig.rings);
    for (let j = 0; j < 3; j++) { // 3 size variants
      const size = 0.1 + (j * particleConfig.size / 3);
      const geometry = baseGeometry.clone();
      geometry.scale(size, size, size);
      geometryPool.push(geometry);
    }
    
    // Pre-create materials with color variants
    for (let j = 0; j < 2; j++) {
      const purpleMaterial = new THREE.MeshPhongMaterial({
        color: appPurple,
        shininess: 15,
        transparent: true,
        opacity: 0.7,
        emissive: appPurple.clone().multiplyScalar(0.05),
      });
      const blueMaterial = purpleMaterial.clone();
      blueMaterial.color = appBlue;
      blueMaterial.emissive = appBlue.clone().multiplyScalar(0.05);
      
      materialPool.purple.push(purpleMaterial);
      materialPool.blue.push(blueMaterial);
    }

    // Create individual 3D sphere particles using pooled resources
    for (let i = 0; i < particleConfig.count; i++) {
      // Use pooled geometry and material
      const geometryIndex = Math.floor(Math.random() * geometryPool.length);
      const sphereGeometry = geometryPool[geometryIndex];
      
      const isBlue = i % 2 === 0;
      const materialIndex = Math.floor(Math.random() * 2);
      const sphereMaterial = isBlue ? 
        materialPool.blue[materialIndex] : 
        materialPool.purple[materialIndex];

      // Material already assigned from pool above

      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);

      // Create orbital properties for circular movement - SLOWER speeds
      const orbitRadius = Math.random() * 15 + 8; // Orbit radius between 8-23
      const orbitSpeed = Math.random() * 0.003 + 0.001; // Much slower: 0.001-0.004
      const orbitAngle = Math.random() * Math.PI * 2; // Random starting angle
      const baseZ = (Math.random() - 0.5) * 8; // Random Z depth between -4 and 4
      const floatSpeed = Math.random() * 0.005 + 0.002; // Slower floating

      // Initial position based on orbit - HORIZONTAL plane (XY) facing user
      const x = Math.cos(orbitAngle) * orbitRadius;
      const y = Math.sin(orbitAngle) * orbitRadius; // Orbit in XY plane (horizontal)
      const z = baseZ; // Z is depth, not part of orbit

      sphere.position.set(x, y, z);

      // Store orbital properties in userData
      sphere.userData = {
        orbitRadius,
        orbitSpeed,
        orbitAngle,
        baseZ, // Changed from baseY to baseZ
        floatSpeed,
        currentAngle: orbitAngle,
      };

      // Store original orbital position for future reference
      // originalPositions[i] = {
      //   x,
      //   y,
      //   z,
      //   orbitRadius,
      //   orbitSpeed,
      //   orbitAngle,
      //   baseZ,
      // };

      // Orient spheres to face the camera (user)
      sphere.rotation.x = 0; // No X rotation (prevents looking up/down)
      sphere.rotation.y = Math.random() * Math.PI * 0.5; // Slight Y variation
      sphere.rotation.z = 0; // No Z rotation

      particlesArray.push(sphere);
      particleGroup.add(sphere);
    }

    scene.add(particleGroup);
    particlesRef.current = {
      group: particleGroup,
      particles: particlesArray,
      // originalPositions,
    };

    setIsLoaded(true);

    // Cleanup function
    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
      if (sceneRef.current) {
        sceneRef.current.clear();
      }
    };
  }, [particleConfig, isMobile]);

  // Animation loop
  useEffect(() => {
    if (
      !isLoaded ||
      !rendererRef.current ||
      !sceneRef.current ||
      !cameraRef.current
    )
      return;

    let startTime = Date.now();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      // Performance monitoring and adaptive quality
      const now = Date.now();
      const deltaTime = now - performanceRef.current.lastTime;
      performanceRef.current.frameCount++;
      
      if (deltaTime >= 1000) { // Update FPS every second
        performanceRef.current.avgFPS = (performanceRef.current.frameCount * 1000) / deltaTime;
        performanceRef.current.frameCount = 0;
        performanceRef.current.lastTime = now;
        
        // Reduce quality if FPS drops below 30
        if (performanceRef.current.avgFPS < 30) {
          console.warn('Performance degradation detected, consider reducing particle count');
        }
      }

      const elapsedTime = (now - startTime) * 0.001;

      // Frame skipping for performance optimization
      const frameSkip = particleConfig.updateRate || 1;
      if (performanceRef.current.frameCount % frameSkip !== 0) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        return;
      }

      if (particlesRef.current && particlesRef.current.particles) {
        const { particles } = particlesRef.current;

        // LOD: Update fewer particles when performance is low
        const updateCount = performanceRef.current.avgFPS < 30 ? 
          Math.floor(particles.length * 0.7) : particles.length;

        // Orbital 3D Sphere animation system
        for (let i = 0; i < updateCount; i++) {
          const sphere = particles[i];
          const position = sphere.position;
          const userData = sphere.userData;

          // Update orbital angle
          userData.currentAngle += userData.orbitSpeed;

          // Calculate base orbital position - HORIZONTAL orbit (XY plane) facing user
          const baseX = Math.cos(userData.currentAngle) * userData.orbitRadius;
          const baseY = Math.sin(userData.currentAngle) * userData.orbitRadius; // Y orbit instead of Z
          const baseZ =
            userData.baseZ +
            Math.sin(elapsedTime * userData.floatSpeed + i) * 1; // Gentle Z float

          // Mouse interaction - CORRECTED orientation and dispersion only
          const mouseX = mouseRef.current.x * 15; // Fixed X direction
          const mouseY = mouseRef.current.y * 15; // Y direction
          const mouseZ = 0;

          // Calculate distance from mouse
          const dx = position.x - mouseX;
          const dy = position.y - mouseY;
          const dz = position.z - mouseZ;
          const distance3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

          let finalX = baseX;
          let finalY = baseY;
          let finalZ = baseZ;

          // Mouse dispersion effect - only push away, no attraction
          if (distance3D < particleConfig.mouseInfluence) {
            const disperseForce =
              (particleConfig.mouseInfluence - distance3D) /
              particleConfig.mouseInfluence;

            // Push particles away from mouse
            finalX += (dx / distance3D) * disperseForce * 8;
            finalY += (dy / distance3D) * disperseForce * 8;
            finalZ += (dz / distance3D) * disperseForce * 4;
          }

          // Smooth transition to final position
          position.x += (finalX - position.x) * 0.05;
          position.y += (finalY - position.y) * 0.05;
          position.z += (finalZ - position.z) * 0.05;

          // Boundary limits - keep particles in screen area (XY plane)
          const maxRadius = 25;
          const currentRadius = Math.sqrt(
            position.x * position.x + position.y * position.y
          );
          if (currentRadius > maxRadius) {
            const scale = maxRadius / currentRadius;
            position.x *= scale;
            position.y *= scale;
          }

          // Z limits (depth)
          if (Math.abs(position.z) > 10) {
            position.z = Math.sign(position.z) * 10;
          }

          // Very subtle rotation animation - only Y axis, much slower
          sphere.rotation.y += 0.0003;
        }

        // Gentle camera movement
        cameraRef.current.position.x +=
          (mouseRef.current.x * 2 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y +=
          (-mouseRef.current.y * 2 - cameraRef.current.position.y) * 0.02;
        cameraRef.current.lookAt(sceneRef.current.position);
      }

      rendererRef.current.render(sceneRef.current, cameraRef.current);
    };

    animate();

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
    };
  }, [isLoaded, particleConfig]);

  // Mouse movement handler
  useEffect(() => {
    const handleMouseMove = (event) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const handleTouchMove = (event) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1;
        mouseRef.current.y = -(touch.clientY / window.innerHeight) * 2 + 1;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  // Window resize handler
  useEffect(() => {
    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return;

      cameraRef.current.aspect = window.innerWidth / window.innerHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section id="hero" className="hero-section">
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="hero-canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
      />

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-greeting">Hi, I&apos;m</h1>
          <h2 className="hero-name">Steven Coaila Zaa</h2>
          <div className="hero-subtitle">
            <span className="typewriter-text">
              <Typewriter
                options={{
                  strings: typewriterWords,
                  autoStart: true,
                  loop: true,
                  delay: 80,
                  deleteSpeed: 30,
                  pauseFor: 3000,
                }}
              />
            </span>
          </div>
          <p className="hero-description">
            Creating innovative digital experiences with modern technologies.
            Passionate about building scalable applications and beautiful user
            interfaces.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={onScrollIndicatorClick}>
          <div className="scroll-arrow">
            <span>Scroll to explore</span>
            <div className="chevron-down">↓</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
