"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/**
 * Reusable 3D accent: a floating wireframe form chosen by `variant`, with a dark solid
 * core and blue rim. Used on service heroes, solutions, technology and CTA sections.
 */
export type AccentVariant = "icosahedron" | "torusKnot" | "grid" | "rings" | "cluster" | "octahedron" | "capsule";

const LIGHT = "#7fb0ff";
const BLUE = "#2e7cf6";
const NAVY = "#0b1b3a";

function Wire({ geometry, scale = 1 }: { geometry: React.ReactNode; scale?: number }) {
  return (
    <group scale={scale}>
      <mesh>
        {geometry}
        <meshStandardMaterial color={NAVY} roughness={0.35} metalness={0.6} />
      </mesh>
      <mesh scale={1.012}>
        {geometry}
        <meshBasicMaterial color={LIGHT} wireframe transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function GridPlane({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [geometry] = useState(() => new THREE.PlaneGeometry(4.2, 4.2, 28, 28));
  const base = useRef<Float32Array | null>(null);
  useFrame(({ clock }) => {
    const mesh = ref.current;
    if (!mesh || reduced) return;
    const attr = (mesh.geometry as THREE.PlaneGeometry).attributes.position;
    const pos = attr.array as Float32Array;
    if (!base.current) base.current = pos.slice();
    const b = base.current;
    const t = clock.getElapsedTime();
    for (let i = 0; i < pos.length; i += 3) {
      pos[i + 2] = Math.sin(b[i] * 1.4 + t * 0.9) * 0.18 + Math.cos(b[i + 1] * 1.6 + t * 0.7) * 0.18;
    }
    attr.needsUpdate = true;
  });
  return (
    <mesh ref={ref} geometry={geometry} rotation={[-1.05, 0, 0.35]} position={[0, -0.4, 0]}>
      <meshBasicMaterial color={LIGHT} wireframe transparent opacity={0.45} />
    </mesh>
  );
}

function Cluster() {
  const items = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        pos: [((i % 3) - 1) * 0.9, (Math.floor(i / 3) - 1) * 0.9, ((i * 7) % 3 - 1) * 0.5] as [number, number, number],
        s: 0.28 + ((i * 13) % 5) * 0.06,
      })),
    [],
  );
  return (
    <group rotation={[0.4, 0.6, 0]}>
      {items.map((it, i) => (
        <group key={i} position={it.pos}>
          <mesh>
            <boxGeometry args={[it.s, it.s, it.s]} />
            <meshStandardMaterial color={NAVY} roughness={0.4} metalness={0.5} />
          </mesh>
          <mesh scale={1.02}>
            <boxGeometry args={[it.s, it.s, it.s]} />
            <meshBasicMaterial color={i % 2 ? LIGHT : BLUE} wireframe transparent opacity={0.6} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Rings() {
  return (
    <group rotation={[0.9, 0.2, 0]}>
      {[1.5, 1.15, 0.8].map((r, i) => (
        <mesh key={r} rotation={[i * 0.5, i * 0.7, 0]}>
          <torusGeometry args={[r, 0.02 + i * 0.01, 12, 128]} />
          <meshBasicMaterial color={i === 1 ? BLUE : LIGHT} transparent opacity={0.7 - i * 0.15} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.35, 32, 32]} />
        <meshBasicMaterial color={BLUE} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Form({ variant, reduced }: { variant: AccentVariant; reduced: boolean }) {
  switch (variant) {
    case "torusKnot":
      return <Wire geometry={<torusKnotGeometry args={[1, 0.28, 180, 24]} />} scale={0.95} />;
    case "grid":
      return <GridPlane reduced={reduced} />;
    case "rings":
      return <Rings />;
    case "cluster":
      return <Cluster />;
    case "octahedron":
      return <Wire geometry={<octahedronGeometry args={[1.5, 1]} />} />;
    case "capsule":
      return <Wire geometry={<capsuleGeometry args={[0.7, 1.4, 8, 24]} />} />;
    default:
      return <Wire geometry={<icosahedronGeometry args={[1.5, 1]} />} />;
  }
}

function Spin({ children, reduced }: { children: React.ReactNode; reduced: boolean }) {
  const ref = useRef<THREE.Group>(null);
  const { pointer } = useThree();
  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += delta * 0.25;
    ref.current.rotation.x = THREE.MathUtils.lerp(ref.current.rotation.x, pointer.y * 0.3, 0.04);
  });
  return <group ref={ref}>{children}</group>;
}

export default function AccentScene({ variant, active, reduced }: { variant: AccentVariant; active: boolean; reduced: boolean }) {
  return (
    <Canvas dpr={[1, 1.5]} frameloop={active && !reduced ? "always" : "demand"} gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 5.2], fov: 40 }} aria-hidden="true">
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={30} color={LIGHT} />
      <pointLight position={[-4, -2, 2]} intensity={12} color={BLUE} />
      <Float speed={reduced ? 0 : 1.4} rotationIntensity={reduced ? 0 : 0.5} floatIntensity={reduced ? 0 : 0.9}>
        <Spin reduced={reduced}>
          <Form variant={variant} reduced={reduced} />
        </Spin>
      </Float>
    </Canvas>
  );
}
