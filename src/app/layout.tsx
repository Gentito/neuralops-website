import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });

export const metadata: Metadata = {
  metadataBase: new URL("https://neuralops.vercel.app"),
  title: {
    default: "NeuralOps — Engineering Intelligent Digital Experiences",
    template: "%s · NeuralOps"
  },
  description: "Web, mobile, and AI systems built for the future.",
  applicationName: "NeuralOps",
  keywords: [
    "NeuralOps",
    "IT Solutions",
    "Web Development",
    "Mobile Apps",
    "AI Systems",
    "Automation",
    "UI/UX"
  ],
  openGraph: {
    type: "website",
    siteName: "NeuralOps",
    title: "NeuralOps — Engineering Intelligent Digital Experiences",
    description: "Web. Mobile. AI. Built for the future."
  },
  twitter: {
    card: "summary_large_image",
    title: "NeuralOps",
    description: "Engineering Intelligent Digital Experiences"
  },
  robots: {
    index: true,
    follow: true
  }
};

export const viewport: Viewport = {
  themeColor: "#05060A",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${space.variable} scroll-smooth`}
      suppressHydrationWarning
    >
      <body className="min-h-screen font-[var(--font-inter)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
