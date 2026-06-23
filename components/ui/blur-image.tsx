"use client";

import { useState } from "react";

interface BlurImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
  fetchPriority?: "high" | "low" | "auto";
  fill?: boolean;
}

export function BlurImage({
  src,
  alt = "",
  className = "",
  containerClassName = "",
  loading = "lazy",
  fetchPriority,
  fill = false,
  ...props
}: BlurImageProps) {
  const [loaded, setLoaded] = useState(false);
  const isUnsplash = src ? src.includes("unsplash.com") : false;
  const tinySrc = src && isUnsplash ? `${src}${src.includes("?") ? "&" : "?"}w=30&q=10` : "";

  return (
    <span className={`relative block overflow-hidden ${fill ? "w-full h-full" : ""} ${containerClassName}`}>
      {tinySrc && (
        <img
          src={tinySrc}
          alt=""
          aria-hidden
          className={`absolute inset-0 w-full h-full object-cover scale-110 blur-xl transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}`}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        className={`${fill ? "absolute inset-0" : "relative"} w-full h-full object-cover transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        onLoad={() => setLoaded(true)}
        {...props}
      />
    </span>
  );
}
