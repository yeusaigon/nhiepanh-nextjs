"use client";

import { useEffect, useState } from "react"; import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext"; import { Album } from "@/types"; import { ADMIN_EMAIL } from "@/types";
import { getAdminAlbums, seedData } from "@/lib/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; import { Badge } from "@/components/ui/badge";
import { Plus, Image, Eye, Star, Settings, LogOut, Database } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => { if (user) { setAlbums([]); setLoading(false); const load = async () => { const a = await getAdminAlbums(user.uid); setAlbums(a); }; load(); } }, [user]);

  if (authLoading) return <div className="max-w-6xl mx-auto px-6 py-12"><Skeleton className="h-96 rounded-3xl" /></div>;
  if (!user) return <div className="max-w-md mx-auto px-6 py-20 text-center"><p className="text-xl font-semibold mb-4">Đăng nhập để quản lý</p><Button onClick={signInWithGoogle} className="rounded-full">Đăng nhập với Google</Button></div>;
  if (user.email !== ADMIN_EMAIL) return <div className="max-w-md mx-auto px-6 py-20 text-center"><p className="text-xl font-bold text-destructive mb-2">Truy Cập Bị Từ Chối</p><p className="text-muted-foreground mb-4">Trang này chỉ dành cho quản trị viên.</p><Button variant="outline" onClick={signOut} className="rounded-full">Đăng xuất</Button></div>;

  const totalViews = albums.reduce((s, a) => s + a.view_count, 0);

  const handleSeed = async () => {
    setSeeding(true); const tid = toast.loading("Đang khởi tạo dữ liệu mẫu...");
    try { await seedData(user.uid); toast.success("Khởi tạo thành công!", { id: tid }); const a = await getAdminAlbums(user.uid); setAlbums(a); }
    catch (e: any) { toast.error(`Lỗi: ${e.message}`, { id: tid }); }
    finally { setSeeding(false); }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Quản lý album và nội dung</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/settings"><Button variant="outline" size="sm" className="rounded-full gap-2"><Settings className="w-4 h-4" />Cài đặt</Button></Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tổng Albums</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{albums.length}</p></CardContent></Card>
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tổng Lượt Xem</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{totalViews.toLocaleString()}</p></CardContent></Card>
        <Card className="rounded-2xl"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Nổi Bật</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{albums.filter(a => a.is_featured).length}</p></CardContent></Card>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Albums Của Bạn</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleSeed} disabled={seeding}><Database className="w-4 h-4" />{seeding ? "Đang khởi tạo..." : "Khởi tạo dữ liệu mẫu"}</Button>
          <Link href="/admin/albums/new"><Button size="sm" className="rounded-full gap-2"><Plus className="w-4 h-4" />Tạo Album Mới</Button></Link>
        </div>
      </div>

      {albums.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border/50 rounded-3xl">
          <Image className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="font-semibold mb-2">Chưa có album nào</p>
          <p className="text-sm text-muted-foreground mb-4">Tạo album đầu tiên hoặc khởi tạo dữ liệu mẫu</p>
        </div>
      ) : (
        <div className="space-y-3">
          {albums.map(album => (
            <Link key={album.id} href={`/admin/albums/${album.id}`}>
              <Card className="rounded-2xl hover:border-foreground/10 transition-all">
                <div className="flex items-center gap-4 p-4">
                  <div className="w-16 h-16 rounded-xl bg-secondary overflow-hidden flex-shrink-0">
                    <img src={album.cover_image_url} alt={album.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{album.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">{album.category}</Badge>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{album.view_count}</span>
                      {album.is_featured && <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-amber-500 text-amber-500" />Featured</span>}
                      {!album.is_public && <Badge variant="outline" className="text-xs">Private</Badge>}
                    </div>
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
