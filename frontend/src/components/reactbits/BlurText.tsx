"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  delay?: number;
  className?: string;
  animateBy?: "words" | "letters";
}

export default function BlurText({
  text,
  delay = 45,
  className = "",
  animateBy = "words",
}: BlurTextProps) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setInView(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const elements = animateBy === "words" ? text.split(" ") : text.split("");

  return (
    <span className={cn("inline-flex flex-wrap justify-center gap-x-[0.3em]", className)}>
      {elements.map((element, index) => (
        <span
          key={index}
          className="inline-block transition-all duration-700 ease-out will-change-transform will-change-[filter]"
          style={{
            transitionDelay: `${index * delay}ms`,
            filter: inView ? "blur(0px)" : "blur(8px)",
            opacity: inView ? 1 : 0.2,
            transform: inView ? "translateY(0)" : "translateY(10px)",
          }}
        >
          {element}
        </span>
      ))}
    </span>
  );
}
