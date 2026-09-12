"use client";

import React from "react";
import Link from "next/link";

export interface AppStoreButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: "sm" | "md" | "lg";
  theme?: "dark" | "light" | "outline";
  className?: string;
  href?: string;
}

const sizeConfig = {
  sm: {
    container: "h-10 px-3 py-1 gap-2 rounded-lg",
    icon: "w-5 h-5 shrink-0",
    topText: "text-[9px] leading-tight",
    bottomText: "text-xs font-bold leading-tight tracking-tight",
  },
  md: {
    container: "h-12 px-4 py-1.5 gap-2.5 rounded-xl",
    icon: "w-6 h-6 shrink-0",
    topText: "text-[10px] leading-tight",
    bottomText: "text-sm font-bold leading-tight tracking-tight",
  },
  lg: {
    container: "h-14 px-5 py-2 gap-3 rounded-xl",
    icon: "w-7 h-7 shrink-0",
    topText: "text-xs leading-tight",
    bottomText: "text-base font-bold leading-tight tracking-tight",
  },
};

const themeConfig = {
  dark: "bg-black text-white border border-neutral-800 hover:bg-neutral-900 hover:border-neutral-700 active:scale-[0.98] shadow-sm",
  light: "bg-white text-neutral-900 border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 active:scale-[0.98] shadow-sm",
  outline: "bg-transparent text-neutral-900 border border-neutral-300 hover:bg-neutral-50 active:scale-[0.98]",
};

export const GooglePlayButton: React.FC<AppStoreButtonProps> = ({
  size = "md",
  theme = "dark",
  className = "",
  href = "#",
  ...props
}) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  const currentTheme = themeConfig[theme] || themeConfig.dark;

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none no-underline ${currentSize.container} ${currentTheme} ${className}`}
      aria-label="Get it on Google Play"
      {...props}
    >
      <svg
        className={currentSize.icon}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.609 1.814L13.792 12 3.61 22.186c-.234-.236-.37-.585-.37-.996V2.81c0-.41.136-.76.37-.996z"
          fill="#00D3FF"
        />
        <path
          d="M14.888 13.097l2.259 2.258-11.89 6.865 9.631-9.123z"
          fill="#00F076"
        />
        <path
          d="M14.888 10.903L5.257 1.78l11.89 6.865-2.259 2.258z"
          fill="#FF3A44"
        />
        <path
          d="M17.147 8.645l3.072 1.774c.828.478.828 1.258 0 1.736l-3.072 1.774-2.259-2.258 2.259-2.226z"
          fill="#FFC800"
        />
      </svg>
      <div className="flex flex-col items-start text-left">
        <span
          className={`${currentSize.topText} font-medium uppercase opacity-75 tracking-wider`}
        >
          GET IT ON
        </span>
        <span className={currentSize.bottomText}>Google Play</span>
      </div>
    </a>
  );
};

export const AppStoreButton: React.FC<AppStoreButtonProps> = ({
  size = "md",
  theme = "dark",
  className = "",
  href = "#",
  ...props
}) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  const currentTheme = themeConfig[theme] || themeConfig.dark;

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none no-underline ${currentSize.container} ${currentTheme} ${className}`}
      aria-label="Download on the App Store"
      {...props}
    >
      <svg
        className={currentSize.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.54c.67-.82 1.13-1.96.99-3.12-.99.04-2.22.67-2.92 1.49-.62.72-1.16 1.88-1.02 3 .01 0 .03.01.05.01 1.09 0 2.23-.56 2.9-1.38z" />
      </svg>
      <div className="flex flex-col items-start text-left">
        <span
          className={`${currentSize.topText} font-medium opacity-75 tracking-tight`}
        >
          Download on the
        </span>
        <span className={currentSize.bottomText}>App Store</span>
      </div>
    </a>
  );
};

export const GalaxyStoreButton: React.FC<AppStoreButtonProps> = ({
  size = "md",
  theme = "dark",
  className = "",
  href = "#",
  ...props
}) => {
  const currentSize = sizeConfig[size] || sizeConfig.md;
  const currentTheme = themeConfig[theme] || themeConfig.dark;

  return (
    <a
      href={href}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer select-none no-underline ${currentSize.container} ${currentTheme} ${className}`}
      aria-label="Available on Galaxy Store"
      {...props}
    >
      <svg
        className={currentSize.icon}
        viewBox="0 0 24 24"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h2v2c0 .55.45 1 1 1s1-.45 1-1V8h6v2c0 .55.45 1 1 1s1-.45 1-1V8h2v12z" />
      </svg>
      <div className="flex flex-col items-start text-left">
        <span
          className={`${currentSize.topText} font-medium uppercase opacity-75 tracking-wider`}
        >
          AVAILABLE ON
        </span>
        <span className={currentSize.bottomText}>Galaxy Store</span>
      </div>
    </a>
  );
};

export const AppStoreButtonDefaultDemo = () => {
  return (
    <div className="flex flex-col items-start gap-3 md:flex-row">
      <GooglePlayButton size="md" />
      <AppStoreButton size="md" />
      <GalaxyStoreButton size="md" />
    </div>
  );
};
