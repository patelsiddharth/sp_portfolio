"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import createGlobe from "cobe";

export function GlobeCell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const LAT = 23.18;
    const LNG = 79.95;
    const theta = LAT * (Math.PI / 180);
    let phi = -LNG * (Math.PI / 90);
    let width = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let velocity = 0;
    let animationFrameId: number;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };
    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvasRef.current!, {
      width: width * 2,
      height: width * 2,
      devicePixelRatio: 2,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 2,
      baseColor: [0.18, 0.14, 0.35],
      markerColor: [0.6, 0.52, 1.0],
      glowColor: [0.35, 0.25, 0.7],
      markers: [{ location: [LAT, LNG], size: 0.07 }],
      onRender: (state: any) => {
        state.width = width * 2;
        state.height = width * 2;
      },
    } as any);

    setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 100);

    const animate = () => {
      if (!isDragging) {
        if (Math.abs(velocity) > 0.0001) {
          phi += velocity;
          velocity *= 0.92;
        } else {
          velocity = 0;
          phi += 0.002;
        }
      }
      globe.update({ phi, theta });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handlePointerDown = (clientX: number) => {
      isDragging = true;
      lastPointerX = clientX;
      velocity = 0;
    };

    const handlePointerMove = (clientX: number) => {
      if (!isDragging) return;
      const delta = clientX - lastPointerX;
      const dPhi = delta * 0.005;
      phi += dPhi;
      velocity = dPhi;
      lastPointerX = clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const wrapper = canvasRef.current?.parentElement;
    const onPointerDown = (e: PointerEvent) => handlePointerDown(e.clientX);
    const onPointerMove = (e: PointerEvent) => handlePointerMove(e.clientX);

    if (wrapper) {
      wrapper.addEventListener("pointerdown", onPointerDown);
      wrapper.addEventListener("pointermove", onPointerMove);
      wrapper.addEventListener("pointerup", handlePointerUp);
      wrapper.addEventListener("pointerleave", handlePointerUp);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
      if (wrapper) {
        wrapper.removeEventListener("pointerdown", onPointerDown);
        wrapper.removeEventListener("pointermove", onPointerMove);
        wrapper.removeEventListener("pointerup", handlePointerUp);
        wrapper.removeEventListener("pointerleave", handlePointerUp);
      }
    };
  }, []);

  return (
    <div className="relative flex flex-col h-full min-h-[320px]">
      <div className="absolute top-4 left-4 z-10">
        <span className="flex items-center gap-1.5 text-[10px] font-mono tracking-[0.2em] uppercase text-muted-foreground/60">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Live Location
        </span>
      </div>

      <div className="absolute bottom-4 left-4 z-10">
        <div className="flex items-center gap-2 glass rounded-full px-3 py-1.5 border border-white/10">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="font-body text-xs text-foreground/80">
            Jabalpur, India
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full cursor-grab"
          style={{
            aspectRatio: "1 / 1",
            contain: "layout paint size",
            opacity: 0,
            transition: "opacity 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}