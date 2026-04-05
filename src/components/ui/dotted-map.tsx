"use client";

import { useMemo } from "react";
import { createMap } from "svg-dotted-map";
import { cn } from "@/lib/utils";

declare module "svg-dotted-map";

export interface Marker {
  lat: number;
  lng: number;
  size?: number;
}

import { useRef, useEffect, useState } from "react";

interface DottedMapProps {
  width?: number;
  height?: number;
  mapSamples?: number;
  markers?: Marker[];
  dotColor?: string;
  markerColor?: string;
  dotRadius?: number;
  className?: string;
  showFloatingMarker?: boolean; // enables/disables the floating overlay marker
  floatingMarkerLabel?: string; // label for the floating marker
  floatingMarker?: Marker; // coordinates for the floating marker (default: first in markers)
}

function latLngToXY(
  lat: number,
  lng: number,
  width: number,
  height: number
) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

export function DottedMap({
  width = 150,
  height = 75,
  mapSamples = 5000,
  markers = [],
  dotColor = "currentColor",
  markerColor = "hsl(var(--primary))",
  dotRadius = 0.22,
  className,
  showFloatingMarker = false,
  floatingMarkerLabel = "I'm here",
  floatingMarker,
}: DottedMapProps) {
  const { points } = useMemo(
    () => createMap({ width, height, mapSamples }),
    [width, height, mapSamples]
  );

  // For floating marker overlay
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState<{w: number; h: number}>({w: width, h: height});

  useEffect(() => {
    if (!containerRef.current) return;
    const updateSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) setContainerSize({ w: rect.width, h: rect.height });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Pick marker for floating overlay
  const markerToShow = floatingMarker || markers[0];
  let floatingXY: {x: number; y: number} | null = null;
  if (showFloatingMarker && markerToShow) {
    floatingXY = latLngToXY(markerToShow.lat, markerToShow.lng, width, height);
  }

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%", height: "auto" }} className={className}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        style={{ width: "100%", height: "auto", display: "block" }}
        className={cn("text-muted-foreground")}
        fill="none"
      >
        {points.map((point: { x: number; y: number }, i: number) => (
          <circle
            key={i}
            cx={point.x}
            cy={point.y}
            r={dotRadius}
            fill={dotColor}
            opacity={0.6}
          />
        ))}
        {markers.map((marker, i) => {
          const { x, y } = latLngToXY(marker.lat, marker.lng, width, height);
          const r = marker.size ?? 0.6;
          return (
            <g key={`marker-${i}`}>
              <circle cx={x} cy={y} r={r} fill={markerColor} />
              <circle cx={x} cy={y} r={r} fill={markerColor} opacity={0.5}>
                <animate
                  attributeName="r"
                  from={String(r)}
                  to={String(r * 3)}
                  dur="1.5s"
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  from="0.5"
                  to="0"
                  dur="1.5s"
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          );
        })}
      </svg>
      {showFloatingMarker && floatingXY && (
        <div
          style={{
            position: "absolute",
            left: `${(floatingXY.x / width) * containerSize.w}px`,
            top: `${(floatingXY.y / height) * containerSize.h}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div className="glass rounded-lg px-2.5 py-1 text-[12px] font-medium text-foreground whitespace-nowrap shadow-lg border border-border/50">
            {floatingMarkerLabel}
          </div>
          <div className="w-px h-14 bg-gradient-to-b from-primary to-transparent" />
          <span className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-30 animate-ping"></span>
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-20 animate-ping delay-1000"></span>
            <span className="absolute inline-flex h-8 w-8 rounded-full bg-primary opacity-10 animate-ping delay-2000"></span>
            {/* <span className="relative inline-flex h-2 w-2 rounded-full bg-primary border-2 border-white shadow-lg"></span> */}
          </span>
        </div>
      )}
    </div>
  );
}
