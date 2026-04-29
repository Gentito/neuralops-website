"use client";

import { useEffect } from "react";

export function CursorGlow() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = `${(e.clientX / window.innerWidth) * 100}%`;
      const y = `${(e.clientY / window.innerHeight) * 100}%`;
      document.documentElement.style.setProperty("--x", x);
      document.documentElement.style.setProperty("--y", y);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return null;
}

