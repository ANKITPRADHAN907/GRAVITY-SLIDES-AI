import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { AntigravityMode, TemplateTheme } from '../types';

interface AntigravityCanvas3DProps {
  mode: AntigravityMode;
  theme: TemplateTheme;
  interactive?: boolean;
}

export const AntigravityCanvas3D: React.FC<AntigravityCanvas3DProps> = ({
  mode,
  theme,
  interactive = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const modeRef = useRef<AntigravityMode>(mode);
  const themeRef = useRef<TemplateTheme>(theme);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 24;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const pointLight = new THREE.PointLight(new THREE.Color(theme.primaryHex), 3, 50);
    pointLight.position.set(0, 5, 10);
    scene.add(pointLight);

    // Particle field (Star dust & antigravity embers)
    const particleCount = 700;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 60;
      particlePositions[i + 1] = (Math.random() - 0.5) * 40;
      particlePositions[i + 2] = (Math.random() - 0.5) * 40;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      color: new THREE.Color(theme.primaryHex),
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Antigravity Floating 3D Geometric Bodies
    interface FloatingBody {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      velocity: THREE.Vector3;
      rotSpeed: { x: number; y: number; z: number };
      floatFreq: number;
      floatAmp: number;
      mass: number;
    }

    const floatingBodies: FloatingBody[] = [];
    const geometries = [
      new THREE.IcosahedronGeometry(1.6, 0),
      new THREE.OctahedronGeometry(1.4, 0),
      new THREE.DodecahedronGeometry(1.5, 0),
      new THREE.TorusGeometry(1.4, 0.4, 16, 50),
      new THREE.TetrahedronGeometry(1.7, 0),
      new THREE.TorusKnotGeometry(1.1, 0.35, 64, 8, 2, 3),
      new THREE.SphereGeometry(1.2, 24, 24),
    ];

    const bodyCount = 14;
    for (let i = 0; i < bodyCount; i++) {
      const geom = geometries[i % geometries.length];
      const isWire = i % 2 === 0;

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(i % 3 === 0 ? theme.primaryHex : i % 3 === 1 ? theme.accentHex : '#FFFFFF'),
        wireframe: isWire,
        roughness: 0.3,
        metalness: 0.8,
        transparent: true,
        opacity: isWire ? 0.75 : 0.65,
      });

      const mesh = new THREE.Mesh(geom, mat);

      // Initial distributed positions in zero gravity
      const angle = (i / bodyCount) * Math.PI * 2;
      const radius = 12 + Math.random() * 8;
      const initialPos = new THREE.Vector3(
        Math.cos(angle) * radius + (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 - 2
      );

      mesh.position.copy(initialPos);

      scene.add(mesh);

      floatingBodies.push({
        mesh,
        basePos: initialPos.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01,
          (Math.random() - 0.5) * 0.01
        ),
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.015,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01,
        },
        floatFreq: 0.6 + Math.random() * 0.8,
        floatAmp: 0.5 + Math.random() * 0.8,
        mass: 1.0 + Math.random() * 0.8,
      });
    }

    // Mouse movement listener for interactive antigravity repulsion
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePos.current = { x: x * 18, y: y * 12, active: true };
    };

    const handlePointerLeave = () => {
      mousePos.current.active = false;
    };

    if (interactive) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseleave', handlePointerLeave);
    }

    // Resize observer
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const currentMode = modeRef.current;
      const currentTheme = themeRef.current;

      // Update light color if theme changed
      pointLight.color.set(currentTheme.primaryHex);
      particleMaterial.color.set(currentTheme.primaryHex);

      // Antigravity particles drift
      const positions = particleGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        const vel = particleVelocities[i];

        if (currentMode === 'zero-g') {
          positions[idx] += vel.x;
          positions[idx + 1] += vel.y + Math.sin(elapsedTime * 0.5 + i) * 0.005;
          positions[idx + 2] += vel.z;
        } else if (currentMode === 'earth-g') {
          positions[idx + 1] -= 0.03;
          if (positions[idx + 1] < -20) positions[idx + 1] = 20;
        } else if (currentMode === 'vortex') {
          const currentX = positions[idx];
          const currentY = positions[idx + 1];
          const dist = Math.sqrt(currentX * currentX + currentY * currentY) + 0.1;
          const theta = Math.atan2(currentY, currentX) + 0.015;
          positions[idx] = Math.cos(theta) * dist;
          positions[idx + 1] = Math.sin(theta) * dist;
        }

        // Boundary wrap
        if (Math.abs(positions[idx]) > 30) positions[idx] *= -0.95;
        if (Math.abs(positions[idx + 1]) > 20) positions[idx + 1] *= -0.95;
        if (Math.abs(positions[idx + 2]) > 20) positions[idx + 2] *= -0.95;
      }
      particleGeometry.attributes.position.needsUpdate = true;

      // Floating 3D bodies physics & antigravity repulsion
      floatingBodies.forEach((body, idx) => {
        // Rotational inertia
        body.mesh.rotation.x += body.rotSpeed.x;
        body.mesh.rotation.y += body.rotSpeed.y;
        body.mesh.rotation.z += body.rotSpeed.z;

        if (currentMode === 'paused') {
          return;
        }

        // Zero-G vs Earth-G vs Vortex
        if (currentMode === 'zero-g') {
          // Subtle natural buoyant bobbing
          const bobY = Math.sin(elapsedTime * body.floatFreq + idx) * body.floatAmp;
          const bobX = Math.cos(elapsedTime * body.floatFreq * 0.7 + idx) * (body.floatAmp * 0.4);

          // Restoring spring toward base position
          const targetX = body.basePos.x + bobX;
          const targetY = body.basePos.y + bobY;
          body.velocity.x += (targetX - body.mesh.position.x) * 0.015;
          body.velocity.y += (targetY - body.mesh.position.y) * 0.015;
          body.velocity.z += (body.basePos.z - body.mesh.position.z) * 0.015;
        } else if (currentMode === 'earth-g') {
          // Gravity pull downwards with floor bounce
          body.velocity.y -= 0.02 / body.mass;
          if (body.mesh.position.y < -10) {
            body.mesh.position.y = -10;
            body.velocity.y = Math.abs(body.velocity.y) * 0.65; // elastic bounce
          }
        } else if (currentMode === 'vortex') {
          // Swirling orbit around center
          const angle = Math.atan2(body.mesh.position.y, body.mesh.position.x) + 0.012;
          const rad = Math.sqrt(body.mesh.position.x ** 2 + body.mesh.position.y ** 2);
          body.velocity.x += (Math.cos(angle) * rad - body.mesh.position.x) * 0.05;
          body.velocity.y += (Math.sin(angle) * rad - body.mesh.position.y) * 0.05;
        }

        // Mouse Antigravity Repulsion Field
        if (mousePos.current.active) {
          const dx = body.mesh.position.x - mousePos.current.x;
          const dy = body.mesh.position.y - mousePos.current.y;
          const distSq = dx * dx + dy * dy;
          const threshold = 18; // radius of antigravity repulsion field

          if (distSq < threshold * threshold && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (1 - dist / threshold) * 0.28;
            body.velocity.x += (dx / dist) * force;
            body.velocity.y += (dy / dist) * force;
            body.velocity.z += force * 0.5; // push away in Z depth too
          }
        }

        // Apply velocity with air drag
        body.velocity.multiplyScalar(0.94);
        body.mesh.position.add(body.velocity);
      });

      // Subtle camera parallax to follow mouse gently
      if (mousePos.current.active) {
        camera.position.x += (mousePos.current.x * 0.08 - camera.position.x) * 0.03;
        camera.position.y += (mousePos.current.y * 0.08 - camera.position.y) * 0.03;
      } else {
        camera.position.x += (0 - camera.position.x) * 0.02;
        camera.position.y += (0 - camera.position.y) * 0.02;
      }
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        window.removeEventListener('mousemove', handlePointerMove);
        window.removeEventListener('mouseleave', handlePointerLeave);
      }
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometries.forEach((g) => g.dispose());
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      id="antigravity-3d-canvas-container"
      className="absolute inset-0 pointer-events-auto overflow-hidden z-0 select-none"
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${theme.cardBgHex}88 0%, ${theme.bgHex} 85%)`,
      }}
    />
  );
};
