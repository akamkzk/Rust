import { useRef, useMemo, useCallback, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import ParticleBackground from './ParticleBackground';

// ── WebGL Check ──────────────────────────────────────────────
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('webgl2'));
  } catch {
    return false;
  }
}

// ── Whale Shape Generator ────────────────────────────────────
function generateWhalePoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const t = i / count; // 0 to 1 along body length

    // Body: elongated ellipsoid tapered at both ends
    const bodyLength = 1.0;
    const x = (t - 0.5) * bodyLength * 2; // -1 to 1

    // Body thickness varies along length - thickest at 40%, thinnest at tail
    const thicknessCurve = Math.sin(t * Math.PI) * (1 - t * 0.3);
    const bodyRadius = thicknessCurve * 0.45;

    // Random angle around the body axis
    const angle = (i * 137.508) % (Math.PI * 2); // golden angle
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Slightly flattened vertically (whale body shape)
    let y = bodyRadius * sinA * 0.7;
    let z = bodyRadius * cosA;

    // Head bulge (front 20%)
    if (t < 0.2) {
      const headFactor = 1 - (t / 0.2);
      const bulge = headFactor * 0.2;
      y *= (1 + bulge * 0.5);
      z *= (1 + bulge * 0.5);
    }

    // Tail flattening (last 25%)
    if (t > 0.75) {
      const tailFactor = (t - 0.75) / 0.25;
      z *= (1 - tailFactor * 0.8);
      y *= (1 - tailFactor * 0.3);
    }

    // Tail fin (last 10%)
    if (t > 0.9) {
      const finFactor = (t - 0.9) / 0.1;
      // Tail fin spreads horizontally
      z *= (1 + finFactor * 1.5);
      y *= (1 - finFactor * 0.7);
    }

    // Pectoral fins (around 30-40% of body)
    if (t > 0.28 && t < 0.42 && Math.abs(sinA) > 0.7) {
      const finExtend = (1 - Math.abs((t - 0.35) / 0.07)) * 0.6;
      y -= finExtend * 0.6;
      z *= (1 + finExtend * (sinA > 0 ? 0.8 : -0.8));
    }

    // Dorsal fin (around 60% of body, top)
    if (t > 0.55 && t < 0.7 && sinA > 0.8) {
      const dorsalFactor = (1 - Math.abs((t - 0.625) / 0.075)) * 0.5;
      y += dorsalFactor;
    }

    // Slight upward curve (whale breaching)
    const breachCurve = Math.sin(t * Math.PI * 1.3) * 0.15;
    y += breachCurve;

    points[i * 3] = x * scale;
    points[i * 3 + 1] = y * scale;
    points[i * 3 + 2] = z * scale;
  }

  return points;
}

// ── Water Splash Particles ──────────────────────────────────
function generateSplashPoints(count: number, scale: number): Float32Array {
  const points = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * scale * 1.2;
    const height = Math.random() * scale * 0.4;

    // Elliptical splash shape
    points[i * 3] = Math.cos(angle) * radius * (0.5 + Math.random() * 0.5);
    points[i * 3 + 1] = -scale * 0.45 + height;
    points[i * 3 + 2] = Math.sin(angle) * radius * 0.4;
  }

  return points;
}

// ── Morphing Particle Cloud ─────────────────────────────────
function MorphingParticleCloud() {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const rotationVelocity = useRef({ x: 0, y: 0 });
  const autoRotate = useRef(true);
  const morphProgress = useRef(0); // 0=sphere, 1=whale
  const morphTarget = useRef(0);
  const morphTimer = useRef(0);

  const particleCount = 2000;
  const splashCount = 400;
  const scale = Math.min(viewport.width, viewport.height) * 0.35;

  // Generate target positions
  const { spherePositions, whalePositions, splashPositions, colors } = useMemo(() => {
    const sphere = new Float32Array(particleCount * 3);
    const whale = new Float32Array(particleCount * 3);
    const splash = generateSplashPoints(splashCount, scale);
    const col = new Float32Array(particleCount * 3);

    const color1 = new THREE.Color('#06b6d4');
    const color2 = new THREE.Color('#6366f1');
    const color3 = new THREE.Color('#10b981');

    for (let i = 0; i < particleCount; i++) {
      // Sphere (Fibonacci)
      const phi = Math.acos(1 - 2 * (i + 0.5) / particleCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = scale * 0.85;

      sphere[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      sphere[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      sphere[i * 3 + 2] = r * Math.cos(phi);

      const t = (sphere[i * 3 + 1] / r + 1) / 2;
      const mixed = color1.clone().lerp(color2, t).lerp(color3, Math.random() * 0.3);
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }

    const whaleRaw = generateWhalePoints(particleCount, scale);
    // Match whale points to sphere points by sorting
    // We'll use the raw whale points directly since both use distributed positions
    for (let i = 0; i < particleCount * 3; i++) {
      whale[i] = whaleRaw[i];
    }

    return { spherePositions: sphere, whalePositions: whale, splashPositions: splash, colors: col };
  }, [scale]);

  // Current positions buffer
  const currentPositions = useMemo(() => {
    const arr = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      arr[i] = spherePositions[i];
    }
    return arr;
  }, [spherePositions]);

  // Morphing logic
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Auto morph cycle: sphere -> whale -> sphere
    morphTimer.current += delta;
    const cycleDuration = 8; // 8 seconds per cycle
    const phase = (morphTimer.current % (cycleDuration * 2)) / cycleDuration;

    if (phase < 1) {
      // Sphere -> Whale (0 to 1)
      morphTarget.current = easeInOutCubic(phase);
    } else {
      // Whale -> Sphere (1 to 0)
      morphTarget.current = 1 - easeInOutCubic(phase - 1);
    }

    // Smooth interpolation of morph progress
    morphProgress.current += (morphTarget.current - morphProgress.current) * 3 * delta;

    // Interpolate positions
    const t = morphProgress.current;
    for (let i = 0; i < particleCount * 3; i++) {
      currentPositions[i] = spherePositions[i] * (1 - t) + whalePositions[i] * t;
    }

    // Update buffer
    const posAttr = (groupRef.current.children[0] as THREE.Points)
      .geometry.attributes.position;
    posAttr.array.set(currentPositions);
    posAttr.needsUpdate = true;

    // Rotation
    if (autoRotate.current) {
      groupRef.current.rotation.y += 0.12 * delta;
      groupRef.current.rotation.x += 0.03 * delta;
      rotationVelocity.current.x *= 0.95;
      rotationVelocity.current.y *= 0.95;
    } else {
      groupRef.current.rotation.x += rotationVelocity.current.x;
      groupRef.current.rotation.y += rotationVelocity.current.y;
      rotationVelocity.current.x *= 0.96;
      rotationVelocity.current.y *= 0.96;
    }
  });

  const onPointerDown = useCallback((e: THREE.Event) => {
    isDragging.current = true;
    autoRotate.current = false;
    prevMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
    setTimeout(() => { autoRotate.current = true; }, 2000);
  }, []);

  const onPointerMove = useCallback((e: THREE.Event) => {
    if (!isDragging.current) return;
    const dx = e.clientX - prevMouse.current.x;
    const dy = e.clientY - prevMouse.current.y;
    rotationVelocity.current = { x: dy * 0.005, y: dx * 0.005 };
    prevMouse.current = { x: e.clientX, y: e.clientY };
  }, []);

  // Splash opacity based on morph
  const splashOpacity = useRef(0);
  useFrame(() => {
    splashOpacity.current = morphProgress.current;
  });

  return (
    <group
      ref={groupRef}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerUp}
    >
      {/* Main particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={currentPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={particleCount}
            array={colors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      {/* Glow layer */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={currentPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#06b6d4"
          transparent
          opacity={0.5}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>
    </group>
  );
}

// ── Easing ───────────────────────────────────────────────────
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

// ── Scene ────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <MorphingParticleCloud />
    </>
  );
}

// ── Main Component ───────────────────────────────────────────
export default function WhaleParticleCloud() {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
  }, []);

  if (!webglSupported) {
    return <ParticleBackground />;
  }

  return (
    <div className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0.3, 6], fov: 50 }}
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