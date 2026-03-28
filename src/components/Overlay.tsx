"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [targetMetrics, setTargetMetrics] = useState({
    x: -420,
    y: -350,
    scale: 0.28,
  });

  useEffect(() => {
    setMounted(true);
    const updateMetrics = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;

      const fixedLogoEl = document.getElementById("fixed-logo-text");

      let ty = -350;
      let targetScale = 0.28;

      const startFontSize = ww >= 768 ? 96 : 60;
      targetScale = 24 / startFontSize;

      if (fixedLogoEl) {
        const rect = fixedLogoEl.getBoundingClientRect();
        const targetCenterY = rect.top + rect.height / 2;
        const startY = wh / 2;
        ty = targetCenterY - startY;
      } else {
        const targetCenterY = 36;
        ty = targetCenterY - wh / 2;
      }

      // fly animation is vertical-only
      setTargetMetrics({ x: 0, y: ty, scale: targetScale });
    };

    updateMetrics();
    const timeout = setTimeout(updateMetrics, 100);
    window.addEventListener("resize", updateMetrics);

    return () => {
      window.removeEventListener("resize", updateMetrics);
      clearTimeout(timeout);
    };
  }, []);

  // --- Section 1 ---
  const opacity1 = useTransform(scrollYProgress, [0, 0.03, 0.08], [1, 1, 0], {
    clamp: true,
  });
  const y1Sub = useTransform(scrollYProgress, [0, 0.08], [0, 60], {
    clamp: false,
  });
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0], {
    clamp: true,
  });
  const pointerEvents1 = useTransform(
    scrollYProgress,
    [0, 0.08],
    ["auto" as const, "none" as const],
  );

  const metricsRef = useRef(targetMetrics);
  useEffect(() => {
    metricsRef.current = targetMetrics;
  }, [targetMetrics]);

  // ── ELEMENT A: Flying name (vertical-only, shrinks toward navbar) ──
  const flyOpacity = useTransform(scrollYProgress, [0, 0.18, 0.2], [1, 1, 0]);

  const getProgress = (p: number) => {
    if (p <= 0) return 0;
    if (p >= 0.18) return 1;
    const progress = p / 0.18;
    return Math.sin((progress * Math.PI) / 2);
  };

  const flyY = useTransform(
    scrollYProgress,
    (p) => getProgress(p) * metricsRef.current.y,
  );
  const flyScale = useTransform(scrollYProgress, (p) => {
    const prog = getProgress(p);
    return 1 - prog * (1 - metricsRef.current.scale);
  });

  // ── ELEMENT B: Navbar-docked name ──
  const dockOpacity = useTransform(
    scrollYProgress,
    [0.18, 0.2, 0.96, 1.0],
    [0, 1, 1, 0],
  );

  // --- Section 2: Slide in from left, stay, slide out to left ---
  const x2 = useTransform(scrollYProgress, (p) => {
    if (typeof window === "undefined") return 0;
    const offscreen = -(window.innerWidth + 100);

    // Before 0.15: off-screen to the left
    if (p < 0.15) return offscreen;

    // 0.15 to 0.3: slide in from left
    if (p < 0.3) {
      const t = (p - 0.15) / 0.15;
      return offscreen + (0 - offscreen) * t;
    }

    // 0.3 to 0.6: stay on screen
    if (p < 0.6) return 0;

    // 0.6 to 0.75: slide out to left
    if (p < 0.75) {
      const t = (p - 0.6) / 0.15;
      return 0 + (offscreen - 0) * t;
    }

    // After 0.75: off-screen to the left
    return offscreen;
  });

  const opacity2 = useTransform(
    scrollYProgress,
    [0.12, 0.15, 0.75, 0.78],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // --- Section 3: Slide in from right, stay, slide out to right ---
  const x3 = useTransform(scrollYProgress, (p) => {
    if (typeof window === "undefined") return 0;
    const offscreen = window.innerWidth + 100;

    // Before 0.55: off-screen to the right
    if (p < 0.55) return offscreen;

    // 0.55 to 0.7: slide in from right
    if (p < 0.7) {
      const t = (p - 0.55) / 0.15;
      return offscreen + (0 - offscreen) * t;
    }

    // 0.7 to 0.95: stay on screen
    if (p < 0.95) return 0;

    // 0.95 to 1.0: slide out to right
    if (p < 1.0) {
      const t = (p - 0.95) / 0.05;
      return 0 + (offscreen - 0) * t;
    }

    // After 1.0: off-screen to the right
    return offscreen;
  });

  const opacity3 = useTransform(
    scrollYProgress,
    [0.52, 0.55, 1.0, 1.0],
    [0, 1, 1, 0],
    { clamp: true }
  );

  return (
    <>
      {/* ── ELEMENT B: Docked name at Navbar logo position (portal) ── */}
      {mounted &&
        createPortal(
          <motion.div
            style={{ opacity: dockOpacity }}
            className="fixed top-0 left-0 w-full z-[9999] pointer-events-none"
          >
            <div className="max-w-7xl mx-auto flex justify-center items-center px-6 py-4">
              <div className="font-display text-2xl font-bold tracking-tighter">
                <span id="fixed-logo-text" className="inline-block">
                  <span className="text-white">Siddharth </span>
                  <span className="gradient-text">Patel.</span>
                </span>
              </div>
            </div>
          </motion.div>,
          document.body,
        )}

      {/* OVERLAY CONTENT */}
      <div className="w-full h-full max-w-7xl mx-auto relative pointer-events-none">
        {/* ── ELEMENT A: Flying name (centered, moves vertically to navbar) ── */}
        <motion.div
          style={{
            y: flyY,
            x: 0,
            scale: flyScale,
            opacity: flyOpacity,
            transformOrigin: "center center",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
            zIndex: 50,
          }}
          className="text-6xl md:text-8xl font-bold tracking-tighter drop-shadow-2xl font-display"
        >
          <span className="inline-block whitespace-nowrap">
            <span className="text-white">Siddharth </span>
            <span className="gradient-text">Patel.</span>
          </span>
        </motion.div>

        {/* Section 1: Tagline + scroll indicator */}
        <motion.div
          style={{
            opacity: opacity1,
            pointerEvents: pointerEvents1,
          }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center z-10"
        >
          <div
            className="text-6xl md:text-8xl font-bold opacity-0 tracking-tighter select-none"
            aria-hidden
          >
            Siddharth Patel.
          </div>
          <motion.p
            style={{ y: y1Sub }}
            className="mt-6 text-2xl md:text-3xl text-gray-300 font-light tracking-widest uppercase"
          >
            Frontend Developer
          </motion.p>
          <motion.div
            style={{ opacity: scrollOpacity }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-sm tracking-widest text-gray-400 uppercase font-medium">
              Scroll
            </span>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
                ease: "easeInOut",
              }}
              className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center p-1"
            >
              <motion.div className="w-1 h-2 bg-gray-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section 2: Slides in from left edge, holds, exits left */}
        <motion.div
          initial={false}
          style={{ opacity: opacity2, x: x2 }}
          className="absolute inset-0 flex items-center justify-start text-left z-20 pointer-events-none pl-8 md:pl-12"
        >
          <div className="max-w-sm glass-card p-5 glow-primary">
            <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-4">
              I build digital{" "}
              <span className="gradient-text">experiences.</span>
            </h2>
            <div className="w-12 h-1 rounded-full mb-4 bg-gradient-to-r from-primary to-accent" />
            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light">
              Crafting fluid animations and pixel-perfect interfaces that blur
              the line between design and engineering.
            </p>
          </div>
        </motion.div>

        {/* Section 3: Slides in from right edge, holds, exits right */}
        <motion.div
          initial={false}
          style={{ opacity: opacity3, x: x3 }}
          className="absolute inset-0 flex items-center justify-end text-left z-20 pointer-events-none pr-8 md:pr-12"
        >
          <div className="max-w-sm glass-card p-4 glow-primary">
            <h2 className="text-lg md:text-2xl font-bold tracking-tight text-white mb-4">
              Bridging design{" "}
              <span className="gradient-text-accent">&amp; engineering.</span>
            </h2>
            <div className="w-12 h-1 rounded-full mb-4 bg-gradient-to-r from-primary to-accent" />
            <p className="text-sm md:text-base text-gray-300 leading-relaxed font-light">
              Turning complex problems into elegant, minimalist, and deeply
              interactive web solutions.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
