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
        "inline-block bg-clip-text text-transparent bg-[linear-gradient(110deg,#0f172a,35%,#059669,50%,#0f172a,65%)] bg-[length:250%_100%]",
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
