import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleBackground from './ParticleBackground';

// ── WebGL Support Check ─────────────────────────────────────
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      canvas.getContext('webgl2')
    );
  } catch {
    return false;
  }
}

// ── Particle Cloud ──────────────────────────────────────────
function ParticleCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const autoRotate = useRef(true);

  const particleCount = 2000;
  const radius = Math.min(viewport.width, viewport.height) * 0.38;

  // Generate particle positions in a sphere
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const col = new Float32Array(particleCount * 3);
    const siz = new Float32Array(particleCount);

    const color1 = new THREE.Color('#06b6d4'); // cyan
    const color2 = new THREE.Color('#6366f1'); // indigo
    const color3 = new THREE.Color('#10b981'); // emerald

    for (let i = 0; i < particleCount; i++) {
      // Fibonacci sphere distribution for uniform spread
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = radius * (0.7 + Math.random() * 0.3);

      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      // Color gradient based on position
      const t = (pos[i * 3 + 1] / radius + 1) / 2;
      const mixed = color1.clone().lerp(color2, t).lerp(color3, Math.random() * 0.3);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;

      siz[i] = Math.random() * 3 + 1;
    }

    return { positions: pos, colors: col, sizes: siz };
  }, [radius]);

  // Lines between nearby particles
  const lineGeometry = useMemo(() => {
    const linePositions: number[] = [];
    const maxDist = radius * 0.25;
    const sampledCount = Math.min(particleCount, 400);

    for (let i = 0; i < sampledCount; i += 2) {
      for (let j = i + 2; j < sampledCount; j += 2) {
        const dx = positions[i * 3] - positions[j * 3];
        const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
        const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < maxDist && Math.random() < 0.15) {
          linePositions.push(
            positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
            positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2],
          );
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    return geo;
  }, [positions, radius]);

  // Mouse interaction
  const onPointerDown = useCallback((e: THREE.Event) => {
    isDragging.current = true;
    autoRotate.current = false;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setTimeout(() => {
      autoRotate.current = true;
    }, 2000);
  }, []);

  const onPointerMove = useCallback((e: THREE.Event) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevMouse.current.x;
    const dy = e.clientY - prevMouse.current.y;
    rotationVelocity.current = { x: dy * 0.005, y: dx * 0.005 };
    prevMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (autoRotate.current) {
      groupRef.current.rotation.y += 0.15 * delta;
      groupRef.current.rotation.x += 0.05 * delta;
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
    } else {
      groupRef.current.rotation.x += rotationVelocity.current.x;
      groupRef.current.rotation.y += rotationVelocity.current.y;
      rotationVelocity.current.x *= 0.96;
      rotationVelocity.current.y *= 0.96;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerUp}
    >
      {/* Connection lines */}
      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.12}
          depthWrite={false}
        />
      </lineSegments>

      {/* Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-size"
            count={particleCount}
            array={sizes}
            itemSize={1}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.8}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Outer ring particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.015}
          color="#06b6d4"
          transparent
          opacity={0.4}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ── Scene ────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <ParticleCloud />
    </>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function InteractiveParticleCloud() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  // Fallback to 2D canvas particles when WebGL is unavailable
  if (!webglSupported) {
    return <ParticleBackground />;
  }

  return (
    <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        dpr={[1, 1.5]}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}