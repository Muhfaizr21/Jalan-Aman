"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface HyperspeedProps {
  className?: string;
  speed?: number;
  theme?: "light" | "dark";
}

export default function Hyperspeed({ className = "", speed = 1.6, theme = "dark" }: HyperspeedProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!canvas || !canvas.parentElement) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement.clientWidth || window.innerWidth;
      height = canvas.parentElement.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    interface Streak {
      x: number;
      y: number;
      z: number;
      len: number;
      color: string;
      side: "left" | "right";
      width: number;
      speed: number;
    }

    const streaks: Streak[] = [];
    const count = 110;

    // Traffic colors: in light mode use rich, vivid tones so they don't wash out on white
    const leftColors = theme === "light"
      ? ["#e11d48", "#f43f5e", "#fb7185", "#be123c"]
      : ["#ef4444", "#f97316", "#dc2626", "#fb7185"];
    const rightColors = theme === "light"
      ? ["#059669", "#10b981", "#0284c7", "#06b6d4", "#0d9488"]
      : ["#00f5ff", "#38bdf8", "#06b6d4", "#a5f3fc"];

    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.48 ? "left" : "right";
      const laneOffset = side === "left" ? -Math.random() * 500 - 40 : Math.random() * 500 + 40;
      streaks.push({
        x: laneOffset,
        y: Math.random() * 120 + 80, // road elevation
        z: Math.random() * 1600 + 50,
        len: Math.random() * 120 + 50,
        color:
          side === "left"
            ? leftColors[Math.floor(Math.random() * leftColors.length)]
            : rightColors[Math.floor(Math.random() * rightColors.length)],
        side,
        width: Math.random() * 2 + 1.2,
        speed: Math.random() * 0.6 + 0.8,
      });
    }

    const fov = 320;
    let tick = 0;

    const draw = () => {
      tick++;
      const horizonY = height * 0.42;
      const centerX = width / 2;

      // Background with smooth motion blur trail
      ctx.fillStyle = theme === "light" ? "rgba(248, 250, 252, 0.32)" : "rgba(9, 9, 11, 0.4)";
      ctx.fillRect(0, 0, width, height);

      // --- Draw Highway Perspective Lines ---
      ctx.save();
      // Vanishing Road Edge Left
      ctx.strokeStyle = theme === "light" ? "rgba(16, 185, 129, 0.4)" : "rgba(16, 185, 129, 0.35)";
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(centerX - 15, horizonY);
      ctx.lineTo(centerX - width * 0.55, height);
      ctx.stroke();

      // Vanishing Road Edge Right
      ctx.strokeStyle = theme === "light" ? "rgba(2, 132, 199, 0.4)" : "rgba(56, 189, 248, 0.35)";
      ctx.beginPath();
      ctx.moveTo(centerX + 15, horizonY);
      ctx.lineTo(centerX + width * 0.55, height);
      ctx.stroke();

      // Highway Center Dashed Line
      ctx.strokeStyle = theme === "light" ? "rgba(217, 119, 6, 0.55)" : "rgba(251, 191, 36, 0.6)";
      ctx.lineWidth = 2;
      ctx.setLineDash([16, 24]);
      ctx.lineDashOffset = -tick * 4 * speed;
      ctx.beginPath();
      ctx.moveTo(centerX, horizonY);
      ctx.lineTo(centerX, height);
      ctx.stroke();
      ctx.restore();

      // --- Draw Streaks (Moving Light Trails) ---
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i];
        s.z -= 22 * speed * s.speed;

        if (s.z <= 20) {
          s.z = 1600;
          s.x = s.side === "left" ? -Math.random() * 520 - 40 : Math.random() * 520 + 40;
        }

        // Perspective projection
        const k1 = fov / s.z;
        const x1 = centerX + s.x * k1;
        const y1 = horizonY + s.y * k1;

        const k2 = fov / (s.z + s.len);
        const x2 = centerX + s.x * k2;
        const y2 = horizonY + s.y * k2;

        if (y1 > horizonY && y1 < height + 80 && x1 > -150 && x1 < width + 150) {
          const alpha = Math.min(1, (1600 - s.z) / 900);
          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = s.color;
          ctx.globalAlpha = Math.max(0.18, alpha * (theme === "light" ? 0.75 : 1));
          ctx.lineWidth = Math.max(1.2, (1600 - s.z) / 200) * (theme === "light" ? s.width * 1.05 : s.width);
          if (theme === "dark") {
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 14;
          }
          ctx.lineCap = "round";
          ctx.stroke();
          ctx.restore();
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationId);
    };
  }, [speed, theme]);

  return (
    <div className={cn("absolute inset-0 pointer-events-none overflow-hidden", className)}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Soft gradient fade so content remains perfectly readable */}
      {theme === "light" ? (
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/90 pointer-events-none" />
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-transparent to-zinc-950 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(9,9,11,0.5)_80%)] pointer-events-none" />
        </>
      )}
    </div>
  );
}
