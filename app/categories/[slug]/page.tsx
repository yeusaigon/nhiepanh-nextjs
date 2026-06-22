"use client";

import { useEffect, useState } from "react"; import { useParams } from "next/navigation"; import Link from "next/link";
import { Album, CATEGORIES } from "@/types"; import { getAlbumsByCategory } from "@/lib/firestore";
import { Card } from "@/components/ui/card"; import { Badge } from "@/components/ui/badge"; import { Skeleton } from "@/components/ui/skeleton";
import { Eye, MapPin, Calendar, ChevronLeft } from "lucide-react"; import { formatDate } from "@/lib/firebase";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const cat = CATEGORIES.find(c => c.slug === slug);

  useEffect(() => { const load = async () => { const a = await getAlbumsByCategory(slug); setAlbums(a); setLoading(false); }; load(); }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 animate-fade-in">
      <Link href="/albums" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ChevronLeft className="w-4 h-4" />Tất cả albums</Link>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{cat?.name || slug}</h1>
      <p className="text-muted-foreground mb-8">{albums.length} album</p>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <Skeleton key={i} className="h-80 rounded-3xl" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map(album => (
            <Link key={album.id} href={`/albums/${album.slug}`} className="group">
              <Card className="overflow-hidden rounded-3xl border-border/50 hover:border-foreground/10 transition-all h-full">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <Badge variant="secondary" className="text-xs mb-2">{album.category}</Badge>
                  <h3 className="text-lg font-semibold tracking-tight mb-1">{album.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{album.description}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
