"use client";

import { Suspense, useEffect, useState, useMemo } from "react"; import Link from "next/link"; import { useSearchParams } from "next/navigation";
import { Album, CATEGORIES } from "@/types"; import { getPublicAlbums } from "@/lib/firestore";
import { Input } from "@/components/ui/input"; import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, Grid3x3, Tags } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce"; import { formatDate } from "@/lib/firebase";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AlbumCard } from "@/components/ui/album-card";

const getCategoryName = (slug: string) => {
  return CATEGORIES.find(c => c.slug === slug.toLowerCase())?.name || slug;
};

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
      <ScrollReveal className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Tất Cả Tác Phẩm</h1>
        <p className="text-muted-foreground">Khám phá bộ sưu tập tác phẩm</p>
      </ScrollReveal>

      <ScrollReveal className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Tìm kiếm tác phẩm hoặc #tag..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 rounded-full" />
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
      </ScrollReveal>

      {allTags.length > 0 && (
        <ScrollReveal className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
            <Tags className="w-4 h-4" /> <span>Từ khóa phổ biến</span>
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
        </ScrollReveal>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <Grid3x3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-xl font-semibold mb-2">Không tìm thấy tác phẩm</p>
          <p className="text-muted-foreground">Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((album, i) => (
            <ScrollReveal key={album.id} delay={(i % 3) * 100} className="w-full">
              <AlbumCard album={album} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}
