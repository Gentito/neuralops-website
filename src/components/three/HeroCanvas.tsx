"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group, LineSegments, Points } from "three";
import * as THREE from "three";

function usePrefersReducedMotion() {
  return useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
}

function NeuralField() {
  const group = useRef<Group>(null);
  const pointsRef = useRef<Points>(null);
  const linesRef = useRef<LineSegments>(null);
  const reduce = usePrefersReducedMotion();

  const { pointGeometry, lineGeometry } = useMemo(() => {
    const pointCount = 190;
    const positions = new Float32Array(pointCount * 3);

    const rand = () => (Math.random() - 0.5) * 2;
    for (let i = 0; i < pointCount; i++) {
      const v = new THREE.Vector3(rand(), rand(), rand());
      v.normalize().multiplyScalar(0.9 + Math.random() * 0.65);
      v.multiplyScalar(1 + (Math.random() - 0.5) * 0.15);
      positions[i * 3 + 0] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }

    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const connectionsPerPoint = 2;
    const linePositions = new Float32Array(pointCount * connectionsPerPoint * 2 * 3);
    let idx = 0;

    for (let i = 0; i < pointCount; i++) {
      const ax = positions[i * 3 + 0];
      const ay = positions[i * 3 + 1];
      const az = positions[i * 3 + 2];

      for (let k = 0; k < connectionsPerPoint; k++) {
        const j = (i + 1 + Math.floor(Math.random() * 18)) % pointCount;
        const bx = positions[j * 3 + 0];
        const by = positions[j * 3 + 1];
        const bz = positions[j * 3 + 2];

        linePositions[idx++] = ax;
        linePositions[idx++] = ay;
        linePositions[idx++] = az;
        linePositions[idx++] = bx;
        linePositions[idx++] = by;
        linePositions[idx++] = bz;
      }
    }

    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3)
    );

    return { pointGeometry, lineGeometry };
  }, []);

  useFrame(({ clock }) => {
    if (!group.current || reduce) return;
    const t = clock.getElapsedTime();
    group.current.rotation.y = t * 0.12;
    group.current.rotation.x = Math.sin(t * 0.2) * 0.12;
    group.current.rotation.z = Math.cos(t * 0.14) * 0.08;

    const pulse = 0.45 + Math.sin(t * 0.9) * 0.1;
    if (pointsRef.current?.material) {
      (pointsRef.current.material as THREE.PointsMaterial).opacity = pulse;
    }
    if (linesRef.current?.material) {
      (linesRef.current.material as THREE.LineBasicMaterial).opacity = 0.18 + pulse * 0.16;
    }
  });

  return (
    <group ref={group} scale={2.2}>
      <points ref={pointsRef} geometry={pointGeometry}>
        <pointsMaterial
          size={0.018}
          color={new THREE.Color("#58C4FF")}
          transparent
          opacity={0.52}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color={new THREE.Color("#A855F7")}
          transparent
          opacity={0.26}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export function HeroCanvas() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.6]}
        camera={{ position: [0, 0, 3.8], fov: 48 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#05060A"]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[2.5, 2, 2]} intensity={1.2} color={"#22D3EE"} />
        <pointLight position={[-2, -1.8, 1]} intensity={1} color={"#A855F7"} />
        <NeuralField />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/30 via-transparent to-ink" />
    </div>
  );
}

