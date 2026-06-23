"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Album, CATEGORIES } from "@/types";
import { getPhotos } from "@/lib/firestore";
import { Card } from "@/components/ui/card";
import { BlurImage } from "@/components/ui/blur-image";
import { MapPin, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

// Global cache to prevent duplicate Firestore queries when hovering over the same album multiple times
const albumPhotosCache = new Map<string, string[]>();

const getCategoryName = (slug: string) => {
  return CATEGORIES.find((c) => c.slug === slug.toLowerCase())?.name || slug;
};

interface AlbumCardProps {
  album: Album;
  showDescription?: boolean;
  delay?: number;
}

export function AlbumCard({ album, showDescription = false, delay = 0 }: AlbumCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [slideshowImages, setSlideshowImages] = useState<string[]>([album.cover_image_url]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  // Load additional photos for hover slideshow
  useEffect(() => {
    let active = true;

    if (isHovered) {
      const loadPhotos = async () => {
        if (albumPhotosCache.has(album.id)) {
          const cached = albumPhotosCache.get(album.id);
          if (cached && cached.length > 0 && active) {
            setSlideshowImages(cached);
          }
        } else {
          setLoading(true);
          try {
            const photos = await getPhotos(album.id);
            const urls = [album.cover_image_url];
            
            // Add up to 2 other unique photos from the album for a 3-photo slideshow
            photos.forEach((p) => {
              if (p.image_url && p.image_url !== album.cover_image_url && urls.length < 3) {
                urls.push(p.image_url);
              }
            });

            albumPhotosCache.set(album.id, urls);
            if (active) {
              setSlideshowImages(urls);
            }
          } catch (err) {
            console.error("Failed to load album photos for hover slideshow:", err);
          } finally {
            if (active) setLoading(false);
          }
        }
      };

      loadPhotos();
    } else {
      // Revert back to cover image only when mouse leaves to save memory/resource
      setSlideshowImages([album.cover_image_url]);
      setCurrentIndex(0);
    }

    return () => {
      active = false;
    };
  }, [isHovered, album.id, album.cover_image_url]);

  // Slideshow rotation effect
  useEffect(() => {
    if (!isHovered || slideshowImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 1800);

    return () => clearInterval(interval);
  }, [isHovered, slideshowImages]);

  return (
    <Link
      href={`/albums/detail?gallery=${album.slug}`}
      className="group block h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden rounded-3xl border border-border/40 hover:border-foreground/10 bg-card transition-all duration-500 h-full flex flex-col group-hover:shadow-md relative">
        {/* Visual Showcase (Image / Slideshow) */}
        <div className="aspect-[4/3] overflow-hidden relative bg-muted select-none">
          {slideshowImages.map((src, index) => {
            const isVisible = index === currentIndex;
            return (
              <div
                key={src + "-" + index}
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 ease-in-out",
                  isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
              >
                <BlurImage
                  src={src}
                  alt={album.title}
                  fill
                  className={cn(
                    "transition-transform duration-1000 ease-out",
                    isHovered ? "scale-105" : "scale-100"
                  )}
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>
            );
          })}

          {/* Minimal Hover Indicators/Dots */}
          {isHovered && slideshowImages.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full animate-fade-in transition-all duration-300">
              {slideshowImages.map((_, index) => (
                <span
                  key={index}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all duration-300",
                    index === currentIndex ? "bg-white scale-125" : "bg-white/40"
                  )}
                />
              ))}
            </div>
          )}

          {/* Loading feedback overlay */}
          {loading && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-[10px] text-white/80 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse select-none">
              <span className="w-1 h-1 bg-white rounded-full animate-ping" />
              <span>Đang tải...</span>
            </div>
          )}
        </div>

        {/* Text Details */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 block">
              {getCategoryName(album.category)}
            </span>
            <h3 className="text-base font-semibold tracking-tight text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
              {album.title}
            </h3>
            {showDescription && album.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                {album.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border/30 text-[11px] text-muted-foreground/60 transition-colors duration-300 group-hover:text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-muted-foreground/50" /> {album.location || "Nhiếp ảnh"}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3 text-muted-foreground/50" /> {album.view_count.toLocaleString()} lượt xem
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
