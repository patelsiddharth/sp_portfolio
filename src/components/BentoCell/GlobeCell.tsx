import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, Compass, MapPin, Orbit } from "lucide-react";
import createGlobe from "cobe";

type GlobeStatProps = {
  label: string;
  value: string;
  align?: "left" | "center";
};

function GlobeStat({ label, value, align = "left" }: GlobeStatProps) {
  return (
    <div
      className={`glass rounded-2xl border border-border/50 px-4 py-3 ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/75">
        {label}
      </div>
      <p className="mt-2 text-sm font-medium leading-relaxed text-foreground sm:text-[15px]">
        {value}
      </p>
    </div>
  );
}

const LOCATION = {
  city: "Jabalpur, India",
  shortCity: "Jabalpur",
  lat: 23.18,
  lng: 79.95,
  coordinates: "23.18° N · 79.95° E",
  availability: "Open to product roles & select freelance work",
  timezone: "Asia/Kolkata",
  timezoneLabel: "UTC+5:30",
};

const useLocalTime = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: LOCATION.timezone,
    });

    const update = () => setTime(formatter.format(new Date()));
    update();

    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
};

export function GlobeCell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const localTime = useLocalTime();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const LAT = LOCATION.lat;
    const LNG = LOCATION.lng;
    const theta = LAT * (Math.PI / 180);
    let phi = -LNG * (Math.PI / 90);
    let width = 0;
    let pointerDragging = false;
    let lastPointerX = 0;
    let velocity = 0;
    let animationFrameId = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const globe = createGlobe(canvas, {
      width: width * 2,
      height: width * 2,
      devicePixelRatio: 2,
      phi,
      theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 3,
      baseColor: [0.18, 0.14, 0.35],
      markerColor: [0.6, 0.52, 1.0],
      glowColor: [0.35, 0.25, 0.7],
      markers: [{ location: [LAT, LNG], size: 0.07 }],
      onRender: (state: { width: number; height: number }) => {
        state.width = width * 2;
        state.height = width * 2;
      },
    } as never);

    const showTimer = window.setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    }, 100);

    const animate = () => {
      if (!pointerDragging) {
        if (Math.abs(velocity) > 0.0001) {
          phi += velocity;
          velocity *= 0.92;
        } else {
          velocity = 0;
          phi += 0.002;
        }
      }

      globe.update({ phi, theta });
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    const handlePointerDown = (clientX: number) => {
      pointerDragging = true;
      lastPointerX = clientX;
      velocity = 0;
      setIsDragging(true);
      setHasInteracted(true);
    };

    const handlePointerMove = (clientX: number) => {
      if (!pointerDragging) return;
      const delta = clientX - lastPointerX;
      const dPhi = delta * 0.005;
      phi += dPhi;
      velocity = dPhi;
      lastPointerX = clientX;
    };

    const handlePointerUp = () => {
      pointerDragging = false;
      setIsDragging(false);
    };

    const wrapper = canvasRef.current?.parentElement;
    const onPointerDown = (e: PointerEvent) => handlePointerDown(e.clientX);
    const onPointerMove = (e: PointerEvent) => handlePointerMove(e.clientX);

    if (wrapper) {
      wrapper.addEventListener("pointerdown", onPointerDown);
      wrapper.addEventListener("pointermove", onPointerMove);
      wrapper.addEventListener("pointerup", handlePointerUp);
      wrapper.addEventListener("pointerleave", handlePointerUp);
      wrapper.addEventListener("pointercancel", handlePointerUp);
    }

    return () => {
      window.clearTimeout(showTimer);
      window.cancelAnimationFrame(animationFrameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);

      if (wrapper) {
        wrapper.removeEventListener("pointerdown", onPointerDown);
        wrapper.removeEventListener("pointermove", onPointerMove);
        wrapper.removeEventListener("pointerup", handlePointerUp);
        wrapper.removeEventListener("pointerleave", handlePointerUp);
        wrapper.removeEventListener("pointercancel", handlePointerUp);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="relative z-10 space-y-4">
        {/* <div className="flex items-center justify-between gap-3">
          <div className="glass inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-muted-foreground/80">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inset-0 rounded-full bg-accent" />
              <span className="absolute inset-0 animate-ping rounded-full bg-accent/50" />
            </span>
            Live location
          </div>

          <div className="glass inline-flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5 text-xs text-foreground/85">
            <Clock3 className="h-3.5 w-3.5 text-primary" />
            <span>{localTime || "--:--"}</span>
            <span className="text-muted-foreground">{LOCATION.timezoneLabel}</span>
          </div>
        </div> */}

        <div className="relative overflow-hidden bg-background/20">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, transparent 42%, hsl(var(--primary) / 0.08) 68%, transparent 80%)",
            }}
          />

          <div className="absolute w-full flex justify-between p-4 sm:p-5">
            <div className="z-20 max-w-[260px] sm:left-5 sm:top-5">
              <h3 className="font-display text-xl font-semibold leading-tight text-foreground sm:text-xl">
                Based in <span className="gradient-text">{LOCATION.city}</span>
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Open to remote / hybrid opportunities and collaborations worldwide.
              </p>
            </div>
            <div className="z-20 hidden sm:block">
              <div className="glass rounded-full border border-border/50 p-2 text-muted-foreground">
                <Orbit className="h-4 w-4" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center pt-16">
            <canvas
              ref={canvasRef}
              className="relative z-10 w-full max-w-[560px] cursor-grab active:cursor-grabbing"
              style={{
                aspectRatio: "1 / 1",
                contain: "layout paint size",
                opacity: 0,
                transition: "opacity 0.5s ease",
                margin: "0 auto",
              }}
            />
          </div>

          <div className="absolute bottom-0 w-full pointer-events-none z-20 flex justify-between pb-3 px-4 sm:p-5">
            <div className="glass flex items-center gap-2 rounded-full border border-border/50 px-3 py-1.5 text-xs text-foreground/85">
              <Compass className="h-3.5 w-3.5 text-primary" />
              {LOCATION.coordinates}
            </div>
            <div className="glass rounded-full border border-border/50 px-3 py-1.5 text-[11px] text-muted-foreground">
              {isDragging
                ? "Exploring"
                : hasInteracted
                  ? "Momentum enabled"
                  : "Drag to rotate"}
            </div>
          </div>
        </div>

        {/* <div className="grid gap-3">
          <GlobeStat label="Work style" value={LOCATION.availability} />
        </div> */}
      </div>
    </motion.div>
  );
}