"use client";

import { useEffect, useRef, useState } from "react";
import { MotionValue, useScroll, useTransform, useMotionValueEvent, AnimatePresence, motion } from "framer-motion";
import Overlay from "./Overlay";

const FRAME_COUNT = 121;

const currentFrameIndex = (index: number) =>
  `/sequence/frame_${index.toString().padStart(3, "0")}_delay-0.041s.png`;

interface ScrollyCanvasProps {
  /** Called once with the scrollYProgress MotionValue so parent can pass it to Navbar */
  onScrollProgress?: (scrollYProgress: MotionValue<number>) => void;
}

export default function ScrollyCanvas({ onScrollProgress }: ScrollyCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const [loadedImages, setLoadedImages] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Expose the MotionValue to parent on first render
  useEffect(() => {
    onScrollProgress?.(scrollYProgress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  useEffect(() => {
    const images: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = currentFrameIndex(i);

      img.onload = () => {
        loadedCount++;
        setLoadedImages(loadedCount);
        if (loadedCount === FRAME_COUNT) {
          setTimeout(() => setIsLoaded(true), 500);
        }
        if (i === 0) renderFrame(0);
      };

      img.onerror = () => {
        loadedCount++;
        setLoadedImages(loadedCount);
        if (loadedCount === FRAME_COUNT) {
          setTimeout(() => setIsLoaded(true), 500);
        }
      };

      images.push(img);
    }

    imagesRef.current = images;
    if (images[0]?.complete) renderFrame(0);
  }, []);

  const renderFrame = (index: number) => {
    if (!canvasRef.current || !imagesRef.current[index]) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    const canvasRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (canvasRatio > imgRatio) {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      drawWidth = canvas.height * imgRatio;
      drawHeight = canvas.height;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#121212";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (img.complete && img.naturalHeight !== 0) {
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  useMotionValueEvent(frameIndex, "change", (latest) => {
    if (!isLoaded) return;
    const clampedIndex = Math.min(Math.max(Math.floor(latest), 0), FRAME_COUNT - 1);
    renderFrame(clampedIndex);
  });

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        const currentIdx = Math.min(Math.max(Math.floor(frameIndex.get()), 0), FRAME_COUNT - 1);
        renderFrame(currentIdx);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [frameIndex, isLoaded]);

  return (
    <div ref={containerRef} className="h-[500vh] relative w-full bg-[#121212]">

      {/* Loading Overlay */}
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a]"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-sm md:text-md tracking-[0.3em] font-light uppercase mb-8"
            >
              Loading Experience
            </motion.div>

            <div className="w-64 max-w-[80vw] h-[1px] bg-white/10 overflow-hidden relative">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${(loadedImages / FRAME_COUNT) * 100}%` }}
                transition={{ duration: 0.1, ease: "linear" }}
              />
            </div>

            <motion.div
              className="text-white/40 text-xs mt-4 font-mono tracking-widest"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {Math.round((loadedImages / FRAME_COUNT) * 100)}%
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 z-10">
          <Overlay scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}
