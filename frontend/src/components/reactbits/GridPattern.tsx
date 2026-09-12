"use client";

import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: string;
}

export default function GridPattern({
  className = "",
  width = 36,
  height = 36,
  x = -1,
  y = -1,
  strokeDasharray = "0",
}: GridPatternProps) {
  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-slate-400/10 stroke-slate-300/40 [mask-image:radial-gradient(ellipse_at_center,white,transparent_75%)]",
        className
      )}
    >
      <defs>
        <pattern
          id="grid-pattern-jalanaman"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill="url(#grid-pattern-jalanaman)" />
    </svg>
  );
}
