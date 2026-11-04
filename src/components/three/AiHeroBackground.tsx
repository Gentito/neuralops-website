"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader.js";
import { cn } from "@/lib/utils";

export interface AiHeroBackgroundProps {
  cols?: number;
  rows?: number;
  jitter?: number;
  hexOffset?: number;
  dotRadius?: number;
  spacing?: number;
  color?: string;
  bloomStrength?: number;
  className?: string;
}

/**
 * Animated WebGL dot-field background (InstancedMesh + UnrealBloom + RGB shift).
 * Adapted from 21st.dev "AI Hero Background" by blacksmith301.
 */
export function AiHeroBackground({
  cols = 120,
  rows = 120,
  jitter = 0.3,
  hexOffset = 0.5,
  dotRadius = 0.03,
  spacing = 0.6,
  color = "#eaf6ff",
  bloomStrength = 0.35,
  className
}: AiHeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: false,
        powerPreference: "high-performance"
      });
    } catch {
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.OrthographicCamera();

    const renderPass = new RenderPass(scene, camera);
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      bloomStrength,
      0.8,
      0.15
    );
    const rgbShift = new ShaderPass(RGBShiftShader);
    rgbShift.uniforms["amount"].value = 0.0015;
    rgbShift.uniforms["angle"].value = Math.PI / 4;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    composer.addPass(bloom);
    composer.addPass(rgbShift);

    const total = cols * rows;
    const geometry = new THREE.CircleGeometry(dotRadius, 8);
    const material = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
    const dots = new THREE.InstancedMesh(geometry, material, total);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(dots);

    const basePos = new Float32Array(total * 2);
    const distArr = new Float32Array(total);

    const xOffset = (cols - 1) * spacing * 0.5;
    const yOffset = (rows - 1) * spacing * 0.5;

    let idx = 0;
    const dummy = new THREE.Object3D();

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++, idx++) {
        let x = c * spacing - xOffset;
        let y = r * spacing - yOffset;
        y += (c % 2) * hexOffset * spacing;
        x += (Math.random() - 0.5) * jitter;
        y += (Math.random() - 0.5) * jitter;
        basePos[idx * 2 + 0] = x;
        basePos[idx * 2 + 1] = y;
        const len = Math.hypot(x, y);
        const ang = Math.atan2(y, x);
        const oct = 0.5 * Math.cos(ang * 8.0);
        distArr[idx] = len + oct * 0.75;
        dummy.position.set(x, y, 0);
        dummy.updateMatrix();
        dots.setMatrixAt(idx, dummy.matrix);
      }
    }

    function roundedSquareWave(t: number, delta: number, a: number, f: number) {
      return ((2 * a) / Math.PI) * Math.atan(Math.sin(2 * Math.PI * t * f) / delta);
    }

    const clock = new THREE.Clock();
    const mat = new THREE.Matrix4();
    const pos = new THREE.Vector3();
    let animationFrameId = 0;

    function renderFrame(t: number) {
      const speed = 0.5;
      const amp = 0.75;
      const freq = 0.3;
      const falloff = 0.035;
      const phase = (Math.sin(2 * Math.PI * t * freq) + 1) * 0.5;
      rgbShift.uniforms["amount"].value = 0.001 + phase * 0.0025;

      for (let i = 0; i < total; i++) {
        const x0 = basePos[i * 2 + 0];
        const y0 = basePos[i * 2 + 1];
        const dist = distArr[i];
        const localDelta = THREE.MathUtils.lerp(0.05, 0.2, Math.min(1.0, dist / 70.0));
        const tt = t * speed - dist * falloff;
        const k = 1 + roundedSquareWave(tt, localDelta, amp, freq);
        pos.set(x0 * k, y0 * k, 0);
        mat.set(1, 0, 0, pos.x, 0, 1, 0, pos.y, 0, 0, 1, 0, 0, 0, 0, 1);
        dots.setMatrixAt(i, mat);
      }
      dots.instanceMatrix.needsUpdate = true;
      composer.render();
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      renderFrame(clock.getElapsedTime());
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      const worldHeight = 10;
      const worldWidth = worldHeight * aspect;

      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = worldHeight / 2;
      camera.bottom = -worldHeight / 2;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(0, 0, 10);
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);
      composer.setSize(w, h);
      if (rgbShift.uniforms["resolution"]) {
        rgbShift.uniforms["resolution"].value.set(w, h);
      }
      bloom.setSize(w, h);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);

    resize();
    if (reduce) {
      renderFrame(0);
    } else {
      animate();
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      while (container.firstChild) container.removeChild(container.firstChild);
      geometry.dispose();
      material.dispose();
      composer.dispose();
      renderer.dispose();
    };
  }, [cols, rows, jitter, hexOffset, dotRadius, spacing, color, bloomStrength]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 z-0", className)}
    />
  );
}

export default AiHeroBackground;
