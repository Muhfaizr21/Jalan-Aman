"use client";

import { cn } from "@/lib/utils";

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = "",
}: ShinyTextProps) {
  return (
    <span
      className={cn(
        "inline-block bg-clip-text text-transparent bg-[linear-gradient(110deg,#a1a1aa,45%,#ffffff,55%,#a1a1aa)] bg-[length:250%_100%]",
        !disabled && "animate-[shine_var(--speed)_infinite_linear]",
        className
      )}
      style={{
        ["--speed" as string]: `${speed}s`,
      }}
    >
      {text}
    </span>
  );
}
