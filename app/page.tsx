"use client";

import { useEffect, useState, useRef } from "react"; import Link from "next/link";
import { Album, CATEGORIES } from "@/types";
import { getFeaturedAlbums, getPublicAlbums } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { BlurImage } from "@/components/ui/blur-image";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ArrowRight, Eye, ChevronRight, ChevronDown, Sparkles, Building2, User, Mountain, Landmark, Globe, Camera, Plane } from "lucide-react";
import { AlbumCard } from "@/components/ui/album-card";
import { GooglePagination } from "@/components/ui/pagination-google";

const iconMap: Record<string, React.ElementType> = {
  Building2, User, Mountain, Landmark, Globe, Camera, Plane, Eye
};

const getCategoryName = (slug: string) => {
  return CATEGORIES.find(c => c.slug === slug.toLowerCase())?.name || slug;
};

export default function HomePage() {
  const [featured, setFeatured] = useState<Album[]>([]);
  const [allPublicAlbums, setAllPublicAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const latestSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      const [f, l] = await Promise.all([getFeaturedAlbums(), getPublicAlbums()]);
      // Shuffle featured albums to display randomly on each refresh
      const shuffled = [...f].sort(() => Math.random() - 0.5);
      setFeatured(shuffled);
      setAllPublicAlbums(l);
      setLoading(false);
    };
    load();
  }, []);

  const heroAlbum = featured[0] || allPublicAlbums[0];
  const sideAlbums = featured.length > 0 ? featured.slice(1, 3) : allPublicAlbums.slice(1, 3);

  // Exclude albums shown in Featured sections to prevent duplication
  const featuredIds = new Set<string>();
  if (heroAlbum) featuredIds.add(heroAlbum.id);
  sideAlbums.forEach((a) => featuredIds.add(a.id));

  const latestFiltered = allPublicAlbums.filter((a) => !featuredIds.has(a.id));

  // Google Pagination
  const itemsPerPage = 6;
  const totalPages = Math.ceil(latestFiltered.length / itemsPerPage);
  const sanitizedPage = Math.min(currentPage, totalPages || 1);
  const latestPaginated = latestFiltered.slice(
    (sanitizedPage - 1) * itemsPerPage,
    sanitizedPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    latestSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative pt-12 pb-16 px-6 bg-gradient-to-b from-secondary/30 via-secondary/5 to-transparent border-b border-border/20 overflow-hidden">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[130px] pointer-events-none -z-10" />
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="space-y-12 animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                <div className="lg:col-span-5 space-y-6">
                  <div className="h-6 w-40 bg-muted rounded-full" />
                  <div className="space-y-3">
                    <div className="h-10 w-full bg-muted rounded-lg" />
                    <div className="h-10 w-3/4 bg-muted rounded-lg" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded" />
                    <div className="h-4 w-5/6 bg-muted rounded" />
                  </div>
                  <div className="flex gap-6 pt-4 border-t border-border/50">
                    <div className="h-10 w-24 bg-muted rounded" />
                    <div className="h-10 w-24 bg-muted rounded" />
                    <div className="h-10 w-28 bg-muted rounded" />
                  </div>
                  <div className="h-4 w-36 bg-muted rounded" />
                </div>
                <div className="lg:col-span-7">
                  <div className="aspect-[4/3] lg:aspect-[16/10] bg-muted rounded-3xl" />
                </div>
              </div>
              <div className="border-t border-border/50 pt-8">
                <div className="h-4 w-40 bg-muted rounded mb-4" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-4 items-center p-3">
                    <div className="w-32 h-28 sm:w-56 sm:h-40 bg-muted rounded-2xl flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-16 bg-muted rounded" />
                      <div className="h-5 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                  <div className="flex gap-4 items-center p-3">
                    <div className="w-32 h-28 sm:w-56 sm:h-40 bg-muted rounded-2xl flex-shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-16 bg-muted rounded" />
                      <div className="h-5 w-full bg-muted rounded" />
                      <div className="h-4 w-3/4 bg-muted rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : heroAlbum ? (
            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                {/* Left: Editorial Text */}
                <div className="lg:col-span-5 space-y-6 flex flex-col justify-center animate-fade-in">
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-semibold border border-border/40 w-fit">
                      <Sparkles className="w-3 h-3 text-amber-500" /> TÁC PHẨM TIÊU BIỂU
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-[1.15]">
                      {heroAlbum.title}
                    </h1>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed max-w-md">
                    {heroAlbum.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-border/50 pt-4">
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-0.5">Chuyên mục</span>
                      <span className="font-semibold text-foreground">{getCategoryName(heroAlbum.category)}</span>
                    </div>
                    {heroAlbum.location && (
                      <div>
                        <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-0.5">Địa điểm</span>
                        <span className="font-semibold text-foreground">{heroAlbum.location}</span>
                      </div>
                    )}
                    <div>
                      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground/60 mb-0.5">Lượt xem</span>
                      <span className="font-semibold text-foreground">{heroAlbum.view_count} lượt xem</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Link href={`/albums/detail?gallery=${heroAlbum.slug}`} className="group">
                      <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-foreground/80 group-hover:text-foreground transition-colors pb-1.5 border-b border-foreground/20 group-hover:border-foreground/80 duration-300">
                        Khám phá tác phẩm <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                    </Link>
                  </div>
                </div>

                {/* Right: Immersive Image Showcase */}
                <div className="lg:col-span-7 h-full animate-scale-in">
                  <Link href={`/albums/detail?gallery=${heroAlbum.slug}`} className="block group">
                    <div className="relative aspect-[4/3] lg:aspect-[16/10] overflow-hidden rounded-3xl border border-border/40 shadow-lg bg-muted transition-transform duration-700 ease-out group-hover:scale-[0.99]">
                      <BlurImage 
                        src={heroAlbum.cover_image_url} 
                        alt={heroAlbum.title} 
                        fill
                        className="group-hover:scale-[1.03] transition-transform duration-1000 ease-out"
                        loading="eager"
                        fetchPriority="high"
                      />
                      <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Other Featured Collections - Editorial Cards */}
              {sideAlbums.length > 0 && (
                <div className="border-t border-border/50 pt-8 animate-fade-up">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70 font-semibold block mb-4">
                    Tác phẩm tiêu biểu khác
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {sideAlbums.map((a, i) => (
                      <Link key={a.id} href={`/albums/detail?gallery=${a.slug}`} className="group flex gap-4 items-center p-3 rounded-2xl hover:bg-secondary/40 transition-colors duration-300">
                        <div className="w-32 h-28 sm:w-56 sm:h-40 relative overflow-hidden rounded-2xl bg-muted flex-shrink-0 border border-border/40">
                          <BlurImage src={a.cover_image_url} alt={a.title} fill className="group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="space-y-1 min-w-0">
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{getCategoryName(a.category)}</span>
                          <h3 className="text-sm sm:text-base font-semibold text-foreground truncate group-hover:text-primary transition-colors">{a.title}</h3>
                          <p className="text-xs text-muted-foreground line-clamp-1">{a.description}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Chưa có tác phẩm nào.</p>
            </div>
          )}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 animate-bounce hidden sm:block">
          <ChevronDown className="w-5 h-5 text-muted-foreground/50" />
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 px-6 border-t border-border/50">
        <ScrollReveal className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-4">Nhiếp Ảnh Số</h2>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Bộ sưu tập ảnh nghệ thuật — nơi lưu giữ những khoảnh khắc đẹp qua ống kính. Từ đường phố Sài Gòn nhộn nhịp đến biển vàng Phú Quốc thơ mộng, mỗi album là một câu chuyện được kể bằng ánh sáng và góc nhìn riêng.
          </p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Link href="/albums"><Button className="rounded-full gap-2">Khám Phá Tác Phẩm <ArrowRight className="w-4 h-4" /></Button></Link>
            <Link href="/about"><Button variant="outline" className="rounded-full">Về Tác Giả</Button></Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Danh Mục</h2>
            <Link href="/albums" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">Xem tất cả <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map((c, i) => {
              const Icon = iconMap[c.icon] || Camera;
              return (
              <ScrollReveal key={c.slug} delay={i * 40} className="w-full">
                <Link href={`/categories/${c.slug}`} className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-foreground/20 hover:shadow-sm transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{c.name}</span>
                </Link>
              </ScrollReveal>
            )})}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="py-16 px-6" ref={latestSectionRef}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Album Mới Nhất</h2>
            <Link href="/albums" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">Xem tất cả <ChevronRight className="w-4 h-4" /></Link>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="rounded-2xl border border-border/40 overflow-hidden">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-4 space-y-2">
                    <div className="h-3 w-20 bg-muted rounded" />
                    <div className="h-5 w-full bg-muted rounded" />
                    <div className="h-4 w-3/4 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {latestPaginated.map((album, i) => (
                  <ScrollReveal key={album.id} delay={(i % 3) * 100} className="w-full">
                    <AlbumCard album={album} />
                  </ScrollReveal>
                ))}
              </div>

              <GooglePagination
                currentPage={sanitizedPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </section>
    </div>
  );
}
