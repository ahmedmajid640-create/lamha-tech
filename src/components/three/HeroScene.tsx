"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Hero WebGL scene: a connected-systems sphere — nodes on a fibonacci sphere, links
 * between near neighbours, pulses travelling along links, a glowing core and orbit rings.
 * Reacts to pointer position; rotates slowly; paused when `active` is false.
 */
const BLUE = new THREE.Color("#2e7cf6");
const LIGHT = new THREE.Color("#7fb0ff");

function fibonacciSphere(n: number, radius: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(new THREE.Vector3(Math.cos(theta) * r * radius, y * radius, Math.sin(theta) * r * radius));
  }
  return pts;
}

function Network({ count, radius, reduced }: { count: number; radius: number; reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pulsesRef = useRef<THREE.InstancedMesh>(null);
  const { pointer } = useThree();

  const { nodes, linkGeometry, links } = useMemo(() => {
    const nodes = fibonacciSphere(count, radius);
    const links: [number, number][] = [];
    const maxDist = radius * 0.62;
    for (let i = 0; i < nodes.length; i++) {
      let added = 0;
      for (let j = i + 1; j < nodes.length && added < 3; j++) {
        if (nodes[i].distanceTo(nodes[j]) < maxDist) {
          links.push([i, j]);
          added++;
        }
      }
    }
    const positions = new Float32Array(links.length * 6);
    links.forEach(([a, b], k) => {
      positions.set([nodes[a].x, nodes[a].y, nodes[a].z, nodes[b].x, nodes[b].y, nodes[b].z], k * 6);
    });
    const linkGeometry = new THREE.BufferGeometry();
    linkGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return { nodes, linkGeometry, links };
  }, [count, radius]);

  const nodeGeometry = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const arr = new Float32Array(nodes.length * 3);
    nodes.forEach((p, i) => arr.set([p.x, p.y, p.z], i * 3));
    g.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    return g;
  }, [nodes]);

  const pulseCount = Math.min(24, links.length);

  // Mutable per-frame state lives in a ref; values are deterministic (no randomness during render).
  type Pulse = { link: number; t: number; speed: number };
  const frameState = useRef<{ pulses: Pulse[]; dummy: THREE.Object3D; tmp: THREE.Vector3 } | null>(null);
  if (frameState.current === null) {
    frameState.current = {
      pulses: Array.from({ length: pulseCount }, (_, i) => ({
        link: Math.floor((i / pulseCount) * links.length),
        t: (i * 0.618034) % 1,
        speed: 0.15 + ((i * 7) % 10) * 0.025,
      })),
      dummy: new THREE.Object3D(),
      tmp: new THREE.Vector3(),
    };
  }

  useFrame((_, delta) => {
    if (!group.current || !frameState.current) return;
    const { pulses, dummy, tmp } = frameState.current;
    if (!reduced) {
      group.current.rotation.y += delta * 0.08;
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, pointer.y * 0.25, 0.04);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, -pointer.x * 0.15, 0.04);
    }
    const mesh = pulsesRef.current;
    if (mesh) {
      for (let i = 0; i < pulses.length; i++) {
        const p = pulses[i];
        if (!reduced) p.t = (p.t + delta * p.speed) % 1;
        const [a, b] = links[p.link];
        tmp.lerpVectors(nodes[a], nodes[b], p.t);
        dummy.position.copy(tmp);
        dummy.scale.setScalar(0.6 + Math.sin(p.t * Math.PI) * 0.8);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={group} rotation={[0.35, 0.2, 0]}>
      {/* links */}
      <lineSegments geometry={linkGeometry}>
        <lineBasicMaterial color={LIGHT} transparent opacity={0.22} />
      </lineSegments>
      {/* nodes */}
      <points geometry={nodeGeometry}>
        <pointsMaterial color={LIGHT} size={0.045} sizeAttenuation transparent opacity={0.95} />
      </points>
      {/* pulses */}
      <instancedMesh ref={pulsesRef} args={[undefined, undefined, pulseCount]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshBasicMaterial color={LIGHT} toneMapped={false} />
      </instancedMesh>
      {/* core */}
      <mesh>
        <sphereGeometry args={[radius * 0.22, 32, 32]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.85} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.34, 32, 32]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.16} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius * 0.5, 32, 32]} />
        <meshBasicMaterial color={BLUE} transparent opacity={0.06} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* orbit rings */}
      <mesh rotation={[Math.PI / 2.2, 0.3, 0]}>
        <torusGeometry args={[radius * 1.25, 0.004, 8, 160]} />
        <meshBasicMaterial color={LIGHT} transparent opacity={0.35} />
      </mesh>
      <mesh rotation={[Math.PI / 1.7, -0.6, 0.4]}>
        <torusGeometry args={[radius * 1.55, 0.003, 8, 200]} />
        <meshBasicMaterial color={LIGHT} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function Rig({ reduced }: { reduced: boolean }) {
  useFrame(({ camera, pointer }) => {
    if (reduced) return;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointer.x * 0.4, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointer.y * 0.3, 0.03);
    camera.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({ active, reduced, mobile }: { active: boolean; reduced: boolean; mobile: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      frameloop={active && !reduced ? "always" : "demand"}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.2], fov: 42 }}
      style={{ background: "transparent" }}
      aria-hidden="true"
    >
      <Network count={mobile ? 160 : 260} radius={2.1} reduced={reduced} />
      <Rig reduced={reduced} />
    </Canvas>
  );
}
