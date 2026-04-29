"use client";

import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div suppressHydrationWarning>{mounted ? children : null}</div>
    </ThemeProvider>
  );
}
