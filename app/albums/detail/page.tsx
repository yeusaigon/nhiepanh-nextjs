"use client";

import { Suspense, useEffect, useState, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Album, Photo, CATEGORIES } from "@/types";
import { getAlbumBySlug, getPhotos, getRelatedAlbums, incrementViewCount } from "@/lib/firestore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BlurImage } from "@/components/ui/blur-image";
import { Separator } from "@/components/ui/separator";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { ArrowLeft, Lock, Eye, MapPin, Calendar, User, ChevronLeft, ChevronRight, X, Download, Link2, Check, ZoomIn, ZoomOut, Facebook, Twitter } from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/lib/firebase";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { MOCK_ALBUMS } from "@/lib/mock-data";

const getCategoryName = (slug: string) => {
  return CATEGORIES.find((c) => c.slug === slug.toLowerCase())?.name || slug;
};

export default function AlbumDetailPage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Skeleton className="h-[400px] w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    }>
      <AlbumDetailContent />
    </Suspense>
  );
}

function AlbumDetailContent() {
  const searchParams = useSearchParams();
  const gallery = searchParams.get("gallery") || "";

  // Pre-populate state using mock data if slug matches for instant FCP/LCP
  const [album, setAlbum] = useState<Album | null>(() => {
    return MOCK_ALBUMS.find((x) => x.slug === gallery) || null;
  });
  
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [related, setRelated] = useState<Album[]>([]);
  const [loading, setLoading] = useState(!album); // only show loading skeleton if we don't have mock data
  const [pinDialog, setPinDialog] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    if (!gallery) return;
    const load = async () => {
      try {
        const a = await getAlbumBySlug(gallery);
        if (!a) {
          setLoading(false);
          return;
        }
        
        // Dynamically update document title for SEO/UX
        document.title = `${a.title} - Nhiếp ảnh số`;
        
        setAlbum(a);
        if (a.pin) {
          setPinDialog(true);
          setLoading(false);
        } else {
          setUnlocked(true);
          const p = await getPhotos(a.id);
          setPhotos(p);
          setLoading(false);
        }
        incrementViewCount(a.id);
        const r = await getRelatedAlbums(a.slug, a.category);
        setRelated(r);
      } catch (err) {
        console.error("Error loading album detail:", err);
        setLoading(false);
      }
    };
    load();
  }, [gallery]);

  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === "ArrowLeft" && lightboxIdx > 0) {
        setLightboxIdx(lightboxIdx - 1);
        setZoomLevel(1);
      }
      if (e.key === "ArrowRight" && lightboxIdx < photos.length - 1) {
        setLightboxIdx(lightboxIdx + 1);
        setZoomLevel(1);
      }
      if (e.key === "Escape") setLightboxIdx(null);
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [lightboxIdx, photos.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (zoomLevel > 1) return;
    touchStartX.current = e.touches[0].clientX;
  }, [zoomLevel]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null || lightboxIdx === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0 && lightboxIdx < photos.length - 1) setLightboxIdx(lightboxIdx + 1);
      else if (diff < 0 && lightboxIdx > 0) setLightboxIdx(lightboxIdx - 1);
    }
    touchStartX.current = null;
  }, [lightboxIdx, photos.length]);

  const toggleZoom = () => setZoomLevel((z) => (z === 1 ? 2.5 : 1));

  const handlePin = async () => {
    if (!album || pinInput !== album.pin) {
      toast.error("Mã PIN không đúng");
      setPinInput("");
      return;
    }
    setUnlocked(true);
    setPinDialog(false);
    const p = await getPhotos(album.id);
    setPhotos(p);
    toast.success("Album đã được mở khóa!");
  };

  const share = (p: "facebook" | "twitter") => {
    const url = window.location.href;
    if (p === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else {
      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(album?.title || "")}`, "_blank");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Đã sao chép liên kết!");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadImage = async (url: string, name: string) => {
    try {
      const r = await fetch(url);
      const b = await r.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch {
      toast.error("Tải ảnh thất bại");
    }
  };

  if (loading && !album) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Skeleton className="h-[400px] w-full rounded-3xl mb-8" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <p className="text-2xl font-bold mb-4">Album không tìm thấy</p>
        <Link href="/albums">
          <Button>Quay lại Albums</Button>
        </Link>
      </div>
    );
  }

  const photo = lightboxIdx !== null ? photos[lightboxIdx] : null;

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <BlurImage
          src={album.cover_image_url}
          alt={album.title}
          fill
          loading="eager"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
        <ScrollReveal className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-6 pb-12 w-full z-10">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/" className="text-white/70 hover:text-white transition-colors">Trang chủ</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link href="/albums" className="text-white/70 hover:text-white transition-colors">Tác phẩm</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <span className="text-white">{album.title}</span>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">{getCategoryName(album.category)}</Badge>
            {album.pin && (
              <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm gap-1">
                <Lock className="w-3 h-3" /> PIN
              </Badge>
            )}
            <Badge variant="outline" className="text-white/70 border-white/20 bg-transparent gap-1">
              <Eye className="w-3 h-3" /> {album.view_count}
            </Badge>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold text-white tracking-tight mb-3">{album.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {album.author}</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {album.location}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {formatDate(album.date_taken)}</span>
          </div>
        </ScrollReveal>
      </section>

      {/* Actions */}
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/albums">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={() => share("facebook")}><Facebook className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={() => share("twitter")}><Twitter className="w-4 h-4" /></Button>
          <Button variant="outline" size="sm" className="gap-2 rounded-full" onClick={copyLink}>
            {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />}
            {copied ? "Đã sao chép" : "Sao chép liên kết"}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <ScrollReveal className="lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4 tracking-tight">Giới thiệu Album</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm sm:text-base">{album.content}</p>
            <div className="flex flex-wrap gap-2 mt-6">
              {album.tags.map((tag) => (
                <Link key={tag} href={`/albums?tag=${tag}`}>
                  <Badge variant="secondary" className="rounded-full cursor-pointer hover:bg-secondary/80 transition-colors">
                    #{tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="rounded-2xl border border-border/50 p-6 space-y-4 sticky top-24">
              <h3 className="font-semibold tracking-tight">Thông Tin</h3>
              <div className="space-y-3 text-sm">
                <div><span className="text-muted-foreground">Tác gia</span><p className="font-medium">{album.author}</p></div>
                <Separator />
                <div><span className="text-muted-foreground">Địa điểm</span><p className="font-medium">{album.location}</p></div>
                <Separator />
                <div><span className="text-muted-foreground">Ngày chụp</span><p className="font-medium">{formatDate(album.date_taken)}</p></div>
                <Separator />
                <div><span className="text-muted-foreground">Danh mục</span><p className="font-medium capitalize">{getCategoryName(album.category)}</p></div>
                <Separator />
                <div><span className="text-muted-foreground">Lượt xem</span><p className="font-medium">{album.view_count.toLocaleString()}</p></div>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Gallery */}
        {(unlocked || !album.pin) && photos.length > 0 && (
          <section className="mb-16">
            <ScrollReveal>
              <h2 className="text-xl font-semibold mb-6 tracking-tight">Bộ sưu tập ({photos.length} ảnh)</h2>
            </ScrollReveal>
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
              {photos.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 30} className="break-inside-avoid">
                  <div className="group cursor-pointer" onClick={() => setLightboxIdx(i)}>
                    <Card className="rounded-2xl border-0 bg-secondary/20 group-hover:ring-1 ring-foreground/10 transition-all overflow-hidden relative">
                      <BlurImage
                        src={p.image_url}
                        alt={p.alt_text || p.title}
                        containerClassName="w-full h-full"
                        className="group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                      />
                      {p.title && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs font-medium truncate">{p.title}</p>
                        </div>
                      )}
                    </Card>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}

        {/* Related */}
        {related.length > 0 && (
          <section className="mb-16">
            <ScrollReveal>
              <h2 className="text-xl font-semibold mb-6 tracking-tight">Tác phẩm liên quan</h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((r, i) => (
                <ScrollReveal key={r.id} delay={i * 80}>
                  <Link href={`/albums/detail?gallery=${r.slug}`} className="group block h-full">
                    <Card className="overflow-hidden rounded-3xl border border-border/40 hover:border-foreground/10 bg-card transition-all duration-500 h-full flex flex-col group-hover:shadow-md">
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <BlurImage
                          src={r.cover_image_url}
                          alt={r.title}
                          fill
                          className="group-hover:scale-[1.03] transition-transform duration-700 ease-out"
                        />
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-muted-foreground/70 block mb-1">
                            {getCategoryName(r.category)}
                          </span>
                          <h4 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-300 line-clamp-1">
                            {r.title}
                          </h4>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* PIN Dialog */}
      <Dialog open={pinDialog} onOpenChange={setPinDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" /> Album được bảo vệ
          </DialogTitle>
          <DialogDescription>Nhập mã PIN để xem nội dung album.</DialogDescription>
          <Input
            type="password"
            placeholder="Nhập PIN..."
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handlePin()}
            className="text-center text-2xl tracking-widest"
            maxLength={6}
          />
          <Button onClick={handlePin} className="w-full rounded-full">Mở Khóa</Button>
        </DialogContent>
      </Dialog>

      {/* Lightbox */}
      <Dialog open={photo !== null} onOpenChange={(open) => !open && setLightboxIdx(null)}>
        <DialogContent className="max-w-[95vw] h-[95vh] p-0 border-0 bg-black/95 backdrop-blur-xl">
          <DialogTitle className="sr-only">Photo Viewer</DialogTitle>
          <DialogDescription className="sr-only">Xem ảnh kích thước đầy đủ</DialogDescription>
          {photo && (
            <div className="relative h-full flex flex-col">
              <div className="absolute top-4 right-4 z-10 flex gap-2">
                <Button size="icon" variant="secondary" className="rounded-full glass" onClick={toggleZoom}>
                  {zoomLevel > 1 ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full glass" onClick={() => downloadImage(photo.image_url, photo.title || "photo.jpg")}>
                  <Download className="w-4 h-4" />
                </Button>
                <Button size="icon" variant="secondary" className="rounded-full glass" onClick={() => setLightboxIdx(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex-1 flex items-center justify-center p-4 overflow-auto" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
                {lightboxIdx !== null && lightboxIdx > 0 && (
                  <Button size="icon" variant="secondary" className="absolute left-4 z-10 rounded-full glass" onClick={() => setLightboxIdx(lightboxIdx - 1)}>
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                )}
                <img
                  src={photo.image_url}
                  alt={photo.alt_text || photo.title}
                  className="max-h-[85vh] max-w-full object-contain rounded-2xl transition-transform duration-200 cursor-zoom-in"
                  style={{ transform: `scale(${zoomLevel})` }}
                  onClick={toggleZoom}
                  draggable={false}
                />
                {lightboxIdx !== null && lightboxIdx < photos.length - 1 && (
                  <Button size="icon" variant="secondary" className="absolute right-4 z-10 rounded-full glass" onClick={() => setLightboxIdx(lightboxIdx + 1)}>
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                )}
              </div>
              <div className="glass p-4 border-t border-white/10 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    {photo.title && <h3 className="font-semibold text-white">{photo.title}</h3>}
                    {photo.description && <p className="text-sm text-white/60">{photo.description}</p>}
                  </div>
                  <span className="text-sm text-white/40">
                    {lightboxIdx !== null ? lightboxIdx + 1 : 0} / {photos.length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
