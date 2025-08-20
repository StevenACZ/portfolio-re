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

  // Device detection
  const isMobile = useMemo(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
           window.innerWidth < 768;
  }, []);

  // Particle configuration based on device
  const particleConfig = useMemo(() => ({
    count: isMobile ? 800 : 1500,
    size: isMobile ? 2 : 3,
    speed: isMobile ? 0.3 : 0.5,
    mouseInfluence: isMobile ? 50 : 100,
  }), [isMobile]);

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    rendererRef.current = renderer;

    // Particle system setup
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleConfig.count * 3);
    const colors = new Float32Array(particleConfig.count * 3);
    const sizes = new Float32Array(particleConfig.count);
    const originalPositions = new Float32Array(particleConfig.count * 3);

    // Purple/Blue color palette
    const colorPalette = [
      new THREE.Color(0x3b82f6), // Blue
      new THREE.Color(0x8b5cf6), // Purple
      new THREE.Color(0x6366f1), // Indigo
      new THREE.Color(0xa855f7), // Light purple
    ];

    // Generate particles
    for (let i = 0; i < particleConfig.count; i++) {
      const i3 = i * 3;
      
      // Position particles in a sphere-like distribution
      const radius = Math.random() * 25 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);

      // Store original positions for reset
      originalPositions[i3] = positions[i3];
      originalPositions[i3 + 1] = positions[i3 + 1];
      originalPositions[i3 + 2] = positions[i3 + 2];

      // Random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      // Random size
      sizes[i] = Math.random() * particleConfig.size + 1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Particle material with custom shader
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 1.0 },
        mouse: { value: new THREE.Vector2() },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        uniform vec2 mouse;
        
        void main() {
          vColor = color;
          
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Mouse interaction effect
          vec2 mouseInfluence = mouse * 0.1;
          mvPosition.xy += mouseInfluence * sin(time + position.x * 0.1) * 0.5;
          
          gl_PointSize = size * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec3 vColor;
        
        void main() {
          vec2 center = gl_PointCoord - vec2(0.5);
          float distance = length(center);
          
          // Create circular particles with glow
          float alpha = 1.0 - smoothstep(0.3, 0.5, distance);
          
          // Add subtle pulsing effect
          alpha *= 0.8 + 0.2 * sin(time * 2.0);
          
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

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
    if (!isLoaded || !rendererRef.current || !sceneRef.current || !cameraRef.current) return;

    let startTime = Date.now();

    const animate = () => {
      frameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = (Date.now() - startTime) * 0.001;
      
      if (particlesRef.current) {
        const material = particlesRef.current.material;
        const geometry = particlesRef.current.geometry;
        const positions = geometry.attributes.position.array;

        // Update shader uniforms
        material.uniforms.time.value = elapsedTime;
        material.uniforms.mouse.value.set(mouseRef.current.x, mouseRef.current.y);

        // Particle animation and mouse interaction
        for (let i = 0; i < particleConfig.count; i++) {
          const i3 = i * 3;
          
          // Gentle floating animation
          positions[i3 + 1] += Math.sin(elapsedTime + i * 0.1) * 0.01;
          
          // Mouse attraction/repulsion effect
          const mouseX = mouseRef.current.x * window.innerWidth * 0.5;
          const mouseY = -mouseRef.current.y * window.innerHeight * 0.5;
          
          const dx = positions[i3] - mouseX * 0.05;
          const dy = positions[i3 + 1] - mouseY * 0.05;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < particleConfig.mouseInfluence) {
            const force = (particleConfig.mouseInfluence - distance) / particleConfig.mouseInfluence;
            positions[i3] += dx * force * 0.01;
            positions[i3 + 1] += dy * force * 0.01;
          }
        }

        geometry.attributes.position.needsUpdate = true;

        // Gentle camera movement
        cameraRef.current.position.x += (mouseRef.current.x * 2 - cameraRef.current.position.x) * 0.02;
        cameraRef.current.position.y += (-mouseRef.current.y * 2 - cameraRef.current.position.y) * 0.02;
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
          <h1 className="hero-greeting">Hi, I'm</h1>
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
            Passionate about building scalable applications and beautiful user interfaces.
          </p>
        </div>
        
        {/* Scroll Indicator */}
        <div className="scroll-indicator" onClick={onScrollIndicatorClick}>
          <div className="scroll-arrow">
            <span>Scroll to explore</span>
            <div className="chevron-down">
              ↓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;