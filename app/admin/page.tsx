"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Album, CATEGORIES, ADMIN_EMAIL } from "@/types";
import { getAdminAlbums, seedData } from "@/lib/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Plus, Image as ImageIcon, Eye, Star, Settings, LogOut, Database, Layers } from "lucide-react";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const getCategoryName = (slug: string) => {
  return CATEGORIES.find((c) => c.slug === slug.toLowerCase())?.name || slug;
};

export default function AdminDashboard() {
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    if (user) {
      setAlbums([]);
      setLoading(true);
      const load = async () => {
        try {
          const a = await getAdminAlbums(user.uid);
          setAlbums(a);
        } catch (e) {
          console.error(e);
        } finally {
          setLoading(false);
        }
      }
      load();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || (user && loading)) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
        <Skeleton className="h-20 w-1/3 rounded-2xl" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
          <Skeleton className="h-32 rounded-3xl" />
        </div>
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center flex flex-col items-center justify-center">
        <ScrollReveal>
          <div className="border border-border/40 bg-card/60 backdrop-blur-md rounded-3xl p-8 shadow-sm flex flex-col items-center">
            <Layers className="w-12 h-12 text-muted-foreground/60 mb-6" />
            <h1 className="text-2xl font-semibold tracking-tight mb-2">Quản trị Hệ thống</h1>
            <p className="text-sm text-muted-foreground mb-6">Đăng nhập bằng tài khoản Admin để quản lý nội dung danh mục và tác phẩm.</p>
            <Button onClick={signInWithGoogle} className="rounded-full px-8 py-6 bg-foreground text-background hover:bg-foreground/90 transition-all font-medium">
              Đăng nhập với Google
            </Button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="max-w-md mx-auto px-6 py-32 text-center">
        <ScrollReveal>
          <div className="border border-destructive/20 bg-destructive/5 rounded-3xl p-8 flex flex-col items-center">
            <h1 className="text-2xl font-bold text-destructive mb-2">Truy Cập Bị Từ Chối</h1>
            <p className="text-sm text-muted-foreground mb-6">Tài khoản <span className="font-semibold">{user.email}</span> không có quyền quản trị viên.</p>
            <Button variant="outline" onClick={signOut} className="rounded-full px-6 border-border/40 hover:bg-secondary">
              Đăng xuất
            </Button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  const totalViews = albums.reduce((s, a) => s + (a.view_count || 0), 0);
  const featuredCount = albums.filter((a) => a.is_featured).length;

  const handleSeed = async () => {
    setSeeding(true);
    const tid = toast.loading("Đang khởi tạo dữ liệu mẫu...");
    try {
      await seedData(user.uid);
      toast.success("Khởi tạo dữ liệu thành công!", { id: tid });
      const a = await getAdminAlbums(user.uid);
      setAlbums(a);
    } catch (e: any) {
      toast.error(`Khởi tạo thất bại: ${e.message}`, { id: tid });
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10">
      {/* Header */}
      <ScrollReveal>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-border/40 pb-6">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground">Bảng Quản Trị</h1>
            <p className="text-sm text-muted-foreground mt-1">Hệ thống quản lý album ảnh và thông tin nghệ sĩ</p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/settings">
              <Button variant="outline" className="rounded-full px-5 border-border/40 hover:bg-secondary/40 gap-2">
                <Settings className="w-4 h-4" /> Cấu hình trang
              </Button>
            </Link>
            <Button variant="outline" onClick={signOut} className="rounded-full px-5 border-border/40 hover:bg-destructive/10 hover:text-destructive text-muted-foreground gap-2">
              <LogOut className="w-4 h-4" /> Đăng xuất
            </Button>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Cards */}
      <ScrollReveal delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all hover:border-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Tổng số Albums</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tracking-tight">{albums.length}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all hover:border-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest font-semibold text-muted-foreground">Tổng lượt xem</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tracking-tight">{totalViews.toLocaleString()}</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl border-border/40 bg-card/40 backdrop-blur-sm shadow-sm transition-all hover:border-foreground/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs uppercase tracking-widest font-semibold text-muted-foreground font-medium">Albums Nổi bật</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-semibold tracking-tight">{featuredCount}</p>
            </CardContent>
          </Card>
        </div>
      </ScrollReveal>

      {/* Album List Header */}
      <ScrollReveal delay={0.2}>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-medium tracking-tight">Tất cả Album</h2>
          <div className="flex gap-2">
            {albums.length === 0 && (
              <Button variant="outline" className="rounded-full px-5 border-border/40 gap-2" onClick={handleSeed} disabled={seeding}>
                <Database className="w-4 h-4" /> {seeding ? "Đang tạo..." : "Tạo dữ liệu mẫu"}
              </Button>
            )}
            <Link href="/admin/albums/edit?id=new">
              <Button className="rounded-full px-6 gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all">
                <Plus className="w-4 h-4" /> Tạo Album Mới
              </Button>
            </Link>
          </div>
        </div>
      </ScrollReveal>

      {/* Albums Grid/List */}
      <ScrollReveal delay={0.3}>
        {albums.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-border/40 rounded-3xl bg-card/20 flex flex-col items-center justify-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground/40 mb-4" />
            <h3 className="text-lg font-medium mb-1">Chưa có album nào</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm">Tạo album đầu tiên hoặc nhấn nút Khởi tạo dữ liệu mẫu để thử nghiệm.</p>
            <Link href="/admin/albums/edit?id=new">
              <Button variant="outline" className="rounded-full border-border/40 hover:bg-secondary">Tạo Album Ngay</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {albums.map((album) => (
              <Link key={album.id} href={`/admin/albums/edit?id=${album.id}`}>
                <Card className="rounded-2xl border-border/40 bg-card/60 backdrop-blur-sm hover:border-foreground/30 transition-all duration-300 overflow-hidden group shadow-sm">
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 border border-border/20 relative">
                      <img
                        src={album.cover_image_url || "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=300"}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors text-foreground">{album.title}</h3>
                      <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
                        <Badge variant="outline" className="rounded-md border-border/60 text-muted-foreground bg-secondary/20">
                          {getCategoryName(album.category)}
                        </Badge>
                        <span className="flex items-center gap-1 text-muted-foreground font-medium">
                          <Eye className="w-3.5 h-3.5" /> {album.view_count || 0}
                        </span>
                        {album.is_featured && (
                          <span className="flex items-center gap-0.5 text-amber-500 font-semibold bg-amber-500/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 fill-amber-500" /> Nổi bật
                          </span>
                        )}
                        {!album.is_public && (
                          <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/5 rounded-full text-[10px] uppercase font-bold py-0">
                            Riêng tư
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </ScrollReveal>
    </div>
  );
}
