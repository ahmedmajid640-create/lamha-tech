"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Scroll-driven particle field. Thousands of points morph between four formations as
 * `progress.current` moves 0 → 1: sphere → BOOM (burst) → wave grid → ring.
 * The GPU does the interpolation (vertex shader); the CPU only updates uniforms,
 * camera (push-in, FOV punch, shake) and the shockwave rings.
 */
export type ProgressRef = { current: number };

// Phase windows (shared between shader and JS)
const BURST_START = 0.04;
const BURST_END = 0.2;
const WAVE_START = 0.3;
const WAVE_END = 0.66;
const RING_START = 0.7;
const RING_END = 0.98;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildFormations(count: number) {
  const rand = mulberry32(1337);
  const sphere = new Float32Array(count * 3);
  const burst = new Float32Array(count * 3);
  const wave = new Float32Array(count * 3);
  const ring = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));
  const R = 2.0;
  const cols = Math.ceil(Math.sqrt(count * 1.6));
  const rows = Math.ceil(count / cols);
  for (let i = 0; i < count; i++) {
    const s = rand();
    seed[i] = s;
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    const sx = Math.cos(th) * r;
    const sy = y;
    const sz = Math.sin(th) * r;
    sphere.set([sx * R, sy * R, sz * R], i * 3);
    // burst: thrown far out along its own direction (many fly past the camera), heavy jitter
    const k = R * (3.2 + rand() * 6.5);
    burst.set([sx * k + (rand() - 0.5) * 3, sy * k + (rand() - 0.5) * 3, sz * k + (rand() - 0.5) * 3 + 1.2], i * 3);
    const cx = (i % cols) / (cols - 1) - 0.5;
    const cz = Math.floor(i / cols) / (rows - 1) - 0.5;
    wave.set([cx * 9.5, cz * 5.2, Math.sin(cx * 6.0) * 0.5 + Math.cos(cz * 5.0) * 0.4 - 0.6], i * 3);
    const u = (i / count) * Math.PI * 2 * 7 + s * 0.3;
    const v = rand() * Math.PI * 2;
    const TR = 2.3;
    const tr = 0.55 + rand() * 0.12;
    const tx = (TR + tr * Math.cos(v)) * Math.cos(u);
    const ty = tr * Math.sin(v);
    const tz = (TR + tr * Math.cos(v)) * Math.sin(u);
    const tilt = 1.05;
    ring.set([tx, ty * Math.cos(tilt) - tz * Math.sin(tilt), ty * Math.sin(tilt) + tz * Math.cos(tilt)], i * 3);
  }
  return { sphere, burst, wave, ring, seed };
}

const vertex = /* glsl */ `
  attribute vec3 aBurst;
  attribute vec3 aWave;
  attribute vec3 aRing;
  attribute float aSeed;
  uniform float uProgress;
  uniform float uBoom;      // 0..1 pulse at the moment of explosion
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uPixelRatio;
  varying float vSeed;
  varying float vBoom;

  void main() {
    float p = clamp(uProgress, 0.0, 1.0);
    float p1 = smoothstep(${BURST_START.toFixed(3)}, ${BURST_END.toFixed(3)}, p);
    float p2 = smoothstep(${WAVE_START.toFixed(3)}, ${WAVE_END.toFixed(3)}, p);
    float p3 = smoothstep(${RING_START.toFixed(3)}, ${RING_END.toFixed(3)}, p);
    // ease-out burst: fast start, long tail (explosive)
    float e1 = 1.0 - pow(1.0 - p1, 3.0);
    vec3 pos = mix(position, aBurst, e1);
    pos = mix(pos, aWave, p2);
    pos = mix(pos, aRing, p3);
    // shockwave kick outward at the peak
    pos += normalize(pos + 0.0001) * uBoom * (0.6 + aSeed * 1.8);
    float b = sin(uTime * 0.9 + aSeed * 6.2831);
    pos += normalize(pos + 0.0001) * b * 0.035;
    float inWave = p2 * (1.0 - p3);
    pos.z += inWave * sin(pos.x * 1.6 + uTime * 1.4) * cos(pos.y * 1.8 + uTime) * 0.35;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vec4 clip = projectionMatrix * mv;
    vec2 ndc = clip.xy / clip.w;
    float d = distance(ndc, uMouse);
    float rep = smoothstep(0.32, 0.0, d);
    vec2 dir = normalize(ndc - uMouse + vec2(0.0001));
    mv.xy += dir * rep * 0.55;
    gl_Position = projectionMatrix * mv;
    float size = (1.6 + 2.6 * aSeed) * (1.0 + 2.2 * uBoom) * uPixelRatio * (7.0 / max(0.4, -mv.z));
    gl_PointSize = min(size, 46.0 * uPixelRatio);
    vSeed = aSeed;
    vBoom = uBoom;
  }
`;

const fragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vSeed;
  varying float vBoom;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.08, d) * (0.35 + 0.65 * vSeed) * (1.0 + 0.6 * vBoom);
    vec3 col = mix(uColorA, uColorB, vSeed);
    col = mix(col, vec3(1.0), vBoom * 0.85);
    gl_FragColor = vec4(col, min(a, 1.0));
  }
`;

const ss = (x: number, a: number, b: number) => THREE.MathUtils.smoothstep(x, a, b);
/** Bell pulse between a and b, peaking in the middle. */
const pulse = (x: number, a: number, b: number) => Math.sin(THREE.MathUtils.clamp((x - a) / (b - a), 0, 1) * Math.PI);

function Field({ progress, count, reduced }: { progress: ProgressRef; count: number; reduced: boolean }) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const core = useRef<THREE.Mesh>(null);
  const glow = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const smooth = useRef({ p: 0, mx: 0, my: 0 });

  const { geometry, uniforms } = useMemo(() => {
    const f = buildFormations(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(f.sphere, 3));
    geometry.setAttribute("aBurst", new THREE.BufferAttribute(f.burst, 3));
    geometry.setAttribute("aWave", new THREE.BufferAttribute(f.wave, 3));
    geometry.setAttribute("aRing", new THREE.BufferAttribute(f.ring, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(f.seed, 1));
    const uniforms = {
      uProgress: { value: 0 },
      uBoom: { value: 0 },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(10, 10) },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color("#2e7cf6") },
      uColorB: { value: new THREE.Color("#bcd6ff") },
    };
    return { geometry, uniforms };
  }, [count]);

  useFrame((state, delta) => {
    const s = smooth.current;
    // Faster follow during the burst so the boom feels immediate.
    const target = progress.current;
    const inBurst = target > BURST_START && target < BURST_END + 0.1;
    s.p = THREE.MathUtils.lerp(s.p, target, inBurst ? 0.18 : 0.08);
    if (!reduced) {
      s.mx = THREE.MathUtils.lerp(s.mx, state.pointer.x, 0.08);
      s.my = THREE.MathUtils.lerp(s.my, state.pointer.y, 0.08);
    }
    const boom = pulse(s.p, BURST_START, BURST_END + 0.06); // peaks mid-burst
    const flash = pulse(s.p, BURST_START, BURST_START + 0.09); // short bright flash at ignition
    const t = state.clock.elapsedTime;

    const m = material.current;
    if (m) {
      m.uniforms.uProgress.value = s.p;
      m.uniforms.uBoom.value = boom;
      m.uniforms.uTime.value += reduced ? 0 : delta;
      m.uniforms.uMouse.value.set(s.mx, s.my);
      m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    }
    if (points.current) {
      points.current.rotation.y += reduced ? 0 : delta * (0.05 + s.p * 0.05 + boom * 0.6);
      points.current.rotation.x = THREE.MathUtils.lerp(points.current.rotation.x, 0.25 + s.my * 0.2, 0.05);
    }

    // Camera: push in at ignition, pull back as debris passes, FOV punch + shake.
    const cam = state.camera as THREE.PerspectiveCamera;
    const pushIn = pulse(s.p, BURST_START - 0.02, BURST_START + 0.08);
    const pullBack = ss(s.p, BURST_START + 0.05, BURST_END + 0.15) * (1 - ss(s.p, WAVE_START, WAVE_END));
    const shake = reduced ? 0 : boom * 0.12;
    cam.position.z = 7.5 - 2.6 * pushIn + 2.2 * pullBack;
    cam.position.x = shake * Math.sin(t * 43.0);
    cam.position.y = shake * Math.cos(t * 37.0);
    const fov = 50 + 22 * boom;
    if (Math.abs(cam.fov - fov) > 0.01) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }

    // Core: flares up at ignition, then vanishes; small nucleus returns inside the ring.
    const coreScale = (1 - ss(s.p, BURST_START + 0.02, BURST_START + 0.12)) * (1 + 1.6 * flash) + ss(s.p, RING_START, RING_END) * 0.45;
    const k = Math.max(0.0001, coreScale) * (1 + 0.05 * Math.sin(t * 2));
    if (core.current) {
      core.current.scale.setScalar(k);
      (core.current.material as THREE.MeshBasicMaterial).color.setRGB(0.18 + flash * 0.8, 0.49 + flash * 0.5, 0.96);
    }
    if (glow.current) glow.current.scale.setScalar(k * (1.1 + flash * 0.9));

    // Shockwave rings expand from the core through the burst.
    const w1 = THREE.MathUtils.clamp((s.p - BURST_START) / (BURST_END - BURST_START + 0.08), 0, 1);
    const w2 = THREE.MathUtils.clamp((s.p - BURST_START - 0.03) / (BURST_END - BURST_START + 0.1), 0, 1);
    for (const [ref, w] of [
      [ringA, w1],
      [ringB, w2],
    ] as const) {
      if (!ref.current) continue;
      const active = w > 0 && w < 1;
      ref.current.visible = active;
      ref.current.scale.setScalar(0.3 + w * 9);
      (ref.current.material as THREE.MeshBasicMaterial).opacity = active ? (1 - w) * (1 - w) * 0.9 : 0;
    }
  });

  return (
    <group>
      <points ref={points} geometry={geometry}>
        <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
      <mesh ref={core}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#2e7cf6" transparent opacity={0.95} toneMapped={false} />
      </mesh>
      <mesh ref={glow}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#2e7cf6" transparent opacity={0.14} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringA} visible={false}>
        <torusGeometry args={[1, 0.035, 8, 128]} />
        <meshBasicMaterial color="#bcd6ff" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} visible={false} rotation={[0.9, 0.4, 0]}>
        <torusGeometry args={[1, 0.02, 8, 128]} />
        <meshBasicMaterial color="#2e7cf6" transparent opacity={0} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function ScrollField({ progress, active, reduced, mobile }: { progress: ProgressRef; active: boolean; reduced: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "demand"}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 7.5], fov: 50 }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <Field progress={progress} count={mobile ? 3500 : 7000} reduced={reduced} />
    </Canvas>
  );
}
