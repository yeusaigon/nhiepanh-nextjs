"use client";

import { useEffect, useState } from "react"; import Link from "next/link";
import { Album, CATEGORIES } from "@/types";
import { getFeaturedAlbums, getPublicAlbums } from "@/lib/firestore";
import { MOCK_ALBUMS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card"; import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, ChevronRight, MapPin, Calendar, Sparkles, Building2, User, Mountain, Landmark, Globe, Camera, Plane } from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  Building2, User, Mountain, Landmark, Globe, Camera, Plane, Eye
};
import { formatDate } from "@/lib/firebase";

export default function HomePage() {
  const [featured, setFeatured] = useState<Album[]>([]);
  const [latest, setLatest] = useState<Album[]>([]);

  useEffect(() => {
    const load = async () => {
      const [f, l] = await Promise.all([getFeaturedAlbums(), getPublicAlbums()]);
      setFeatured(f); setLatest(l.slice(0, 9));
    };
    load();
  }, []);

  const heroAlbum = featured[0];
  const sideAlbums = featured.slice(1, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative pt-8 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-muted-foreground text-sm mb-8">
            <Sparkles className="w-4 h-4" /> <span>Featured Collections</span>
          </div>

          {heroAlbum && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Link href={`/albums/${heroAlbum.slug}`} className="lg:col-span-2 group">
                <Card className="relative h-[450px] lg:h-[560px] overflow-hidden rounded-3xl border-0 cursor-pointer">
                  <img src={heroAlbum.cover_image_url} alt={heroAlbum.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">{heroAlbum.category}</Badge>
                      <Badge variant="outline" className="text-white/80 border-white/20 bg-transparent gap-1"><Eye className="w-3 h-3" />{heroAlbum.view_count}</Badge>
                    </div>
                    <h1 className="text-3xl lg:text-5xl font-bold text-white mb-3 tracking-tight">{heroAlbum.title}</h1>
                    <p className="text-white/70 text-base max-w-xl line-clamp-2 mb-4">{heroAlbum.description}</p>
                    <Button className="rounded-full gap-2 bg-white text-black hover:bg-white/90">View Album <ArrowRight className="w-4 h-4" /></Button>
                  </div>
                </Card>
              </Link>
              <div className="flex flex-col gap-6">
                {sideAlbums.map(a => (
                  <Link key={a.id} href={`/albums/${a.slug}`} className="group flex-1">
                    <Card className="relative h-full min-h-[215px] lg:min-h-[270px] overflow-hidden rounded-3xl border-0 cursor-pointer">
                      <img src={a.cover_image_url} alt={a.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm text-xs">{a.category}</Badge>
                        </div>
                        <h2 className="text-xl font-bold text-white tracking-tight">{a.title}</h2>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Danh Mục</h2>
            <Link href="/albums" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">Xem tất cả <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {CATEGORIES.map(c => {
              const Icon = iconMap[c.icon] || Camera;
              return (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="group flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-foreground/20 transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                  <Icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">{c.name}</span>
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* Latest */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Album Mới Nhất</h2>
            <Link href="/albums" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">Xem tất cả <ChevronRight className="w-4 h-4" /></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latest.map((album, i) => (
              <Link key={album.id} href={`/albums/${album.slug}`} className="group animate-fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Card className="overflow-hidden rounded-3xl border-border/50 hover:border-foreground/10 transition-all duration-300 h-full">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">{album.category}</Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="w-3 h-3" />{album.view_count}</div>
                    </div>
                    <h3 className="text-lg font-semibold tracking-tight mb-1 group-hover:opacity-80 transition-opacity">{album.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                    <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{album.location}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{formatDate(album.date_taken)}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
