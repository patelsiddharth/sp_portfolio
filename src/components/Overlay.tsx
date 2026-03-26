"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, MotionValue, useTransform } from "framer-motion";

interface OverlayProps {
  scrollYProgress: MotionValue<number>;
}

export default function Overlay({ scrollYProgress }: OverlayProps) {
  const [mounted, setMounted] = useState(false);
  const [targetMetrics, setTargetMetrics] = useState({ x: -420, y: -350, scale: 0.28 });

  useEffect(() => {
    setMounted(true);
    const updateMetrics = () => {
      const ww = window.innerWidth;
      const wh = window.innerHeight;

      // Look for the portal element instead because the real Navbar is rendered
      // below ScrollyCanvas and currently sitting 500vh down the page.
      const fixedLogoEl = document.getElementById("fixed-logo-text");

      let tx = -420;
      let ty = -350;
      let targetScale = 0.28;

      const startFontSize = ww >= 768 ? 96 : 60; // 96px on md+, 60px on mobile
      targetScale = 24 / startFontSize; // 24px is text-2xl in the navbar

      if (fixedLogoEl) {
        const rect = fixedLogoEl.getBoundingClientRect();
        const targetCenterX = rect.left + rect.width / 2;
        const targetCenterY = rect.top + rect.height / 2;

        const startX = ww / 2;
        const startY = wh / 2;

        tx = targetCenterX - startX;
        ty = targetCenterY - startY;
      } else {
        const maxW = 1280;
        const boxLeft = Math.max(0, (ww - maxW) / 2);
        const logoLeft = boxLeft + 24;
        const approximateWidth = ww >= 768 ? 190 : 160;
        const targetCenterX = logoLeft + approximateWidth / 2;
        const targetCenterY = 36;

        tx = targetCenterX - (ww / 2);
        ty = targetCenterY - (wh / 2);
      }

      setTargetMetrics({ x: tx, y: ty, scale: targetScale });
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
  const opacity1 = useTransform(scrollYProgress, [0, 0.12, 0.18], [1, 1, 0]);
  const y1Sub = useTransform(scrollYProgress, [0, 0.18], [0, -120]);
  const scrollOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const metricsRef = useRef(targetMetrics);
  useEffect(() => {
    metricsRef.current = targetMetrics;
  }, [targetMetrics]);

  // ── ELEMENT A: Flying name ──
  const flyOpacity = useTransform(scrollYProgress, [0, 0.16, 0.18], [1, 1, 0]);

  const getProgress = (p: number) => {
    if (p <= 0) return 0;
    if (p >= 0.18) return 1;
    const progress = p / 0.18;
    return Math.sin((progress * Math.PI) / 2);
  };

  const flyY = useTransform(scrollYProgress, (p) => getProgress(p) * metricsRef.current.y);
  const flyX = useTransform(scrollYProgress, (p) => getProgress(p) * metricsRef.current.x);
  const flyScale = useTransform(scrollYProgress, (p) => {
    const prog = getProgress(p);
    return 1 - prog * (1 - metricsRef.current.scale);
  });

  // ── ELEMENT B: Navbar-docked name ──
  const dockOpacity = useTransform(scrollYProgress, [0.17, 0.19, 0.96, 1.0], [0, 1, 1, 0]);

  // --- Sections 2 & 3 ---
  // Section 2: 25% to 50%
  const opacity2 = useTransform(scrollYProgress, [0.22, 0.3, 0.45, 0.55], [0, 1, 1, 0]);

  // Section 3: 65% to 90%
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.68, 0.85, 0.95], [0, 1, 1, 0]);


  return (
    <>
      {/* ── ELEMENT B: Docked name at Navbar logo position (portal) ── */}
      {mounted && createPortal(
        <motion.div
          style={{ opacity: dockOpacity }}
          className="fixed top-0 left-0 w-full z-[9999] pointer-events-none"
        >
          {/* Mirror the layout of Navbar precisely */}
          <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
            <div className="font-display text-2xl font-bold tracking-tighter min-w-[200px]">
              <span id="fixed-logo-text" className="inline-block">
                <span className="text-white">Siddharth </span>
                <span className="gradient-text">Patel.</span>
              </span>
            </div>
          </div>
        </motion.div>,
        document.body
      )}

      {/* OVERLAY CONTENT */}
      <div className="w-full h-full max-w-7xl mx-auto px-6 relative pointer-events-none">

        {/* ── ELEMENT A: Flying name (centered, moves to top-left) ── */}
        <motion.div
          style={{
            y: flyY,
            x: flyX,
            scale: flyScale,
            opacity: flyOpacity,
            transformOrigin: "center center",
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: 0,
          }}
          className="text-6xl md:text-8xl font-bold tracking-tighter drop-shadow-2xl font-display"
        >
          <span className="inline-block whitespace-nowrap">
            <span className="text-white">Siddharth </span>
            <span className="gradient-text">Patel.</span>
          </span>
        </motion.div>

        {/* Section 1: Subtitle */}
        <motion.div
          style={{ opacity: opacity1 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
        >
          <div className="text-6xl md:text-8xl font-bold opacity-0 tracking-tighter select-none" aria-hidden>
            Siddharth Patel.
          </div>
          <motion.p style={{ y: y1Sub }} className="mt-6 text-2xl md:text-3xl text-gray-300 font-light tracking-widest uppercase">
            Frontend Developer
          </motion.p>
          <motion.div style={{ opacity: scrollOpacity }} className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-sm tracking-widest text-gray-400 uppercase font-medium">Scroll</span>
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} className="w-5 h-8 border-2 border-gray-400 rounded-full flex justify-center p-1">
              <motion.div className="w-1 h-2 bg-gray-400 rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Section 2 */}
        <motion.div style={{ opacity: opacity2 }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-2xl glass-card p-8 md:p-12 glow-primary">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">I build digital <span className="gradient-text">experiences.</span></h2>
            <div className="w-16 h-1 rounded-full mx-auto mb-6 bg-gradient-to-r from-primary to-accent" />
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">Crafting fluid animations and pixel-perfect interfaces that blur the line between design and engineering.</p>
          </div>
        </motion.div>

        {/* Section 3 */}
        <motion.div style={{ opacity: opacity3 }} className="absolute inset-0 flex items-center justify-end text-right px-6">
          <div className="max-w-2xl glass-card p-8 md:p-12 glow-secondary">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">Bridging design <span className="gradient-text-accent">&amp; engineering.</span></h2>
            <div className="w-16 h-1 rounded-full ml-auto mb-6 bg-gradient-to-l from-secondary to-accent" />
            <p className="text-xl md:text-2xl text-gray-300 leading-relaxed font-light">Turning complex problems into elegant, minimalist, and deeply interactive web solutions.</p>
          </div>
        </motion.div>
      </div>
    </>
  );
}

