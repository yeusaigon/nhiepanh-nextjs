"use client";

import { Suspense, useEffect, useState, useMemo } from "react"; import Link from "next/link"; import { useSearchParams } from "next/navigation";
import { Album } from "@/types"; import { getPublicAlbums } from "@/lib/firestore";
import { Card } from "@/components/ui/card"; import { Input } from "@/components/ui/input"; import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; import { Skeleton } from "@/components/ui/skeleton"; import { BlurImage } from "@/components/ui/blur-image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Eye, MapPin, Calendar, Grid3x3, Tags } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; import { formatDate } from "@/lib/firebase";

export default function AlbumsPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-6 py-12"><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}</div></div>}>
      <AlbumsContent />
    </Suspense>
  );
}

function AlbumsContent() {
  const searchParams = useSearchParams();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("tag") ? `#${searchParams.get("tag")}` : "");
  const [sort, setSort] = useState("newest");
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => { const load = async () => { const a = await getPublicAlbums(); setAlbums(a); setLoading(false); }; load(); }, []);

  const filtered = albums
    .filter(a => !debouncedSearch || a.title.toLowerCase().includes(debouncedSearch.toLowerCase().replace("#", "")) || a.tags.some(t => t.includes(debouncedSearch.toLowerCase().replace("#", ""))))
    .sort((a, b) => {
      if (sort === "newest") return new Date(b.date_taken).getTime() - new Date(a.date_taken).getTime();
      if (sort === "oldest") return new Date(a.date_taken).getTime() - new Date(b.date_taken).getTime();
      if (sort === "popular") return b.view_count - a.view_count;
      return a.title.localeCompare(b.title);
    });

  const allTags = useMemo(() => {
    const map = new Map<string, number>();
    albums.forEach(a => a.tags.forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 16);
  }, [albums]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tất Cả Albums</h1>
        <p className="text-muted-foreground">Khám phá bộ sưu tập ảnh</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm album hoặc #tag..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-full" />
        </div>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full sm:w-44 rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="oldest">Cũ nhất</SelectItem>
            <SelectItem value="popular">Xem nhiều</SelectItem>
            <SelectItem value="title">A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {allTags.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Tags className="w-4 h-4" /> <span>Tags phổ biến</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map(([tag, count]) => (
              <Link key={tag} href={`/albums?tag=${tag}`}>
                <Badge variant={debouncedSearch.includes(tag) ? "default" : "secondary"} className="rounded-full cursor-pointer hover:opacity-80 transition-opacity gap-1">
                  #{tag} <span className="opacity-50 text-xs">{count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold mb-2">Không tìm thấy album</p>
          <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((album, i) => (
            <Link key={album.id} href={`/albums/${album.slug}`} className="group" style={{ animationDelay: `${i * 50}ms` }}>
              <Card className="overflow-hidden rounded-3xl border-border/50 hover:border-foreground/10 transition-all duration-300 h-full animate-fade-up">
                <div className="aspect-[4/3] overflow-hidden">
                    <BlurImage src={album.cover_image_url} alt={album.title} className="group-hover:scale-105 transition-transform duration-500" />
                  </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">{album.category}</Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground"><Eye className="w-3 h-3" />{album.view_count}</div>
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight mb-1">{album.title}</h3>
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
      )}
    </div>
  );
}
