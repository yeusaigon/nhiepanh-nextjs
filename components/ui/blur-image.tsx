"use client";

import { useState } from "react";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export function BlurImage({ src, alt = "", className = "", containerClassName = "", ...props }: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const tinySrc = src ? `${src}${src.includes("?") ? "&" : "?"}w=30&q=10` : "";

  return (
    <span className={`relative block overflow-hidden ${containerClassName}`}>
      <img
        src={tinySrc}
        alt=""
        aria-hidden
        className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
      />
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`relative w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </span>
  );
}
