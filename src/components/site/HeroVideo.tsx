"use client";

import { useEffect, useState } from "react";

export function HeroVideo({
  src = "/videos/hero.mp4",
  className
}: {
  src?: string;
  className?: string;
}) {
  const enabledByEnv = process.env.NEXT_PUBLIC_ENABLE_HERO_VIDEO === "1";
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabledByEnv) {
      setEnabled(false);
      return;
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setEnabled(false);
      return;
    }

    const ctrl = new AbortController();
    fetch(src, { method: "HEAD", signal: ctrl.signal })
      .then((res) => setEnabled(res.ok))
      .catch(() => setEnabled(false));

    return () => ctrl.abort();
  }, [enabledByEnv, src]);

  if (!enabledByEnv || !enabled) return null;

  return (
    <video
      className={className}
      autoPlay
      playsInline
      muted
      loop
      preload="metadata"
      onCanPlay={() => setReady(true)}
      onError={() => setEnabled(false)}
      style={{ opacity: ready ? 0.5 : 0, transition: "opacity 500ms ease" }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
