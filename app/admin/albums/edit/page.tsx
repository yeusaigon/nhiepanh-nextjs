"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Album, Photo, ADMIN_EMAIL } from "@/types";
import {
  getAdminAlbums,
  getPhotos,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  createPhoto,
  updatePhoto,
  deletePhoto,
} from "@/lib/firestore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { toSlug } from "@/lib/firebase";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { AlbumForm } from "@/components/admin/AlbumForm";
import { PhotoManager } from "@/components/admin/PhotoManager";

export default function EditAlbumPage() {
  return (
    <Suspense fallback={
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <Skeleton className="h-10 w-1/4 rounded-full" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    }>
      <EditAlbumContent />
    </Suspense>
  );
}

function EditAlbumContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "new";
  const { user, loading: authLoading } = useAuth();
  const isNew = id === "new";

  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  
  // Local state for photos if the album is brand new and not yet saved in Firestore
  const [newPhotos, setNewPhotos] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    content: "",
    cover_image_url: "",
    category: "street",
    tags: "",
    location: "",
    date_taken: new Date().toISOString().split("T")[0],
    is_public: true,
    is_featured: false,
    pin: "",
    seo_title: "",
    seo_description: "",
  });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        if (!isNew) {
          const albums = await getAdminAlbums(user.uid);
          const a = albums.find((x) => x.id === id);
          if (a) {
            setAlbum(a);
            const p = await getPhotos(a.id);
            setPhotos(p);
            setForm({
              title: a.title || "",
              slug: a.slug || "",
              description: a.description || "",
              content: a.content || "",
              cover_image_url: a.cover_image_url || "",
              category: a.category || "street",
              tags: Array.isArray(a.tags) ? a.tags.join(", ") : "",
              location: a.location || "",
              date_taken: a.date_taken || "",
              is_public: a.is_public !== undefined ? a.is_public : true,
              is_featured: a.is_featured || false,
              pin: a.pin || "",
              seo_title: a.seo_title || "",
              seo_description: a.seo_description || "",
            });
          } else {
            toast.error("Không tìm thấy album");
            router.push("/admin");
          }
        } else {
          setLoading(false);
        }
      } catch (err: any) {
        toast.error("Lỗi tải album: " + err.message);
        setLoading(false);
      } finally {
        if (!isNew) {
          setLoading(false);
        }
      }
    };
    load();
  }, [user, id, isNew, router]);

  if (authLoading || (user && loading && !isNew)) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <Skeleton className="h-10 w-1/4 rounded-full" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  const handleFieldChange = (field: string, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      toast.error("Tiêu đề không được để trống");
      return;
    }
    setSaving(true);
    const tid = toast.loading(isNew ? "Đang tạo album và lưu tác phẩm..." : "Đang lưu album...");
    
    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const finalSlug = form.slug.trim() ? toSlug(form.slug) : toSlug(form.title);

    const data = {
      ...form,
      slug: finalSlug,
      tags: tagsArray,
      pin: form.pin.trim() || null,
    };

    try {
      if (isNew) {
        // 1. Create the Album doc first
        const albumRef = await createAlbum({
          ...data,
          user_id: user.uid,
          view_count: 0,
        });

        const newAlbumId = albumRef.id;

        // 2. Insert all added photos sequentially referencing the new album_id
        if (newPhotos.length > 0) {
          for (const photo of newPhotos) {
            await createPhoto({
              album_id: newAlbumId,
              image_url: photo.image_url,
              thumbnail_url: photo.image_url,
              title: photo.title,
              description: photo.description,
              alt_text: photo.alt_text,
              display_order: photo.display_order,
            });
          }
        }
        toast.success("Đã tạo album mới và lưu ảnh thành công!", { id: tid });
      } else if (album) {
        await updateAlbum(album.id, {
          ...data,
          updated_at: new Date().toISOString(),
        });
        toast.success("Cập nhật album thành công!", { id: tid });
      }
      router.push("/admin");
    } catch (e: any) {
      toast.error(`Lỗi: ${e.message}`, { id: tid });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!album || !confirm("Bạn có chắc chắn muốn xóa album này và toàn bộ ảnh thuộc album không? Hành động này không thể hoàn tác.")) {
      return;
    }
    setSaving(true);
    const tid = toast.loading("Đang xóa album...");
    try {
      await deleteAlbum(album.id);
      toast.success("Đã xóa album thành công!", { id: tid });
      router.push("/admin");
    } catch (e: any) {
      toast.error(`Lỗi: ${e.message}`, { id: tid });
    } finally {
      setSaving(false);
    }
  };

  // Add Photo callback
  const handleAddPhoto = async (photoData: { image_url: string; title: string; description: string; alt_text: string }) => {
    if (isNew) {
      // In Creation mode, append to local newPhotos array state
      const newPhotoObj = {
        id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        image_url: photoData.image_url,
        title: photoData.title,
        description: photoData.description,
        alt_text: photoData.alt_text,
        display_order: newPhotos.length,
      };
      setNewPhotos((prev) => [...prev, newPhotoObj]);
      toast.success("Đã thêm tác phẩm vào danh sách chờ!");
    } else if (album) {
      // In Edit mode, write directly to Firestore database
      await createPhoto({
        album_id: album.id,
        image_url: photoData.image_url,
        thumbnail_url: photoData.image_url,
        title: photoData.title,
        description: photoData.description,
        alt_text: photoData.alt_text,
        display_order: photos.length,
      });
      setPhotos(await getPhotos(album.id));
      toast.success("Đã thêm tác phẩm vào album!");
    }
  };

  // Delete Photo callback
  const handleDeletePhoto = async (photo: Photo) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tác phẩm này?")) return;
    try {
      if (isNew) {
        // Remove from local newPhotos array state and adjust order indexes
        const filtered = newPhotos.filter((p) => p.id !== photo.id);
        const reordered = filtered.map((p, idx) => ({ ...p, display_order: idx }));
        setNewPhotos(reordered);
        toast.success("Đã xóa khỏi danh sách chờ!");
      } else {
        // Delete from Firestore
        await deletePhoto(photo.id);
        if (album) {
          setPhotos(await getPhotos(album.id));
        }
        toast.success("Đã xóa ảnh!");
      }
    } catch (err: any) {
      toast.error("Lỗi xóa ảnh: " + err.message);
    }
  };

  // Move Photo order callback
  const handleMovePhoto = async (p: Photo, direction: "up" | "down") => {
    if (isNew) {
      const idx = newPhotos.findIndex((x) => x.id === p.id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === newPhotos.length - 1)) {
        return;
      }
      const nIdx = direction === "up" ? idx - 1 : idx + 1;
      const updated = [...newPhotos];
      // Swap positions
      const temp = updated[idx];
      updated[idx] = updated[nIdx];
      updated[nIdx] = temp;
      
      // Update display orders
      const reordered = updated.map((photo, i) => ({ ...photo, display_order: i }));
      setNewPhotos(reordered);
    } else if (album) {
      const idx = photos.findIndex((x) => x.id === p.id);
      if ((direction === "up" && idx === 0) || (direction === "down" && idx === photos.length - 1)) {
        return;
      }
      const nIdx = direction === "up" ? idx - 1 : idx + 1;
      try {
        await updatePhoto(p.id, { display_order: nIdx });
        await updatePhoto(photos[nIdx].id, { display_order: idx });
        setPhotos(await getPhotos(album.id));
      } catch (err: any) {
        console.error(err);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Quay lại Dashboard
      </button>

      <ScrollReveal>
        <div className="border-b border-border/40 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            {isNew ? "Tạo Album Mới" : "Chỉnh Sửa Album"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isNew ? "Thiết lập thông tin và thêm ảnh trước khi lưu" : `Quản lý nội dung và các tác phẩm trong album "${album?.title}"`}
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="mb-6 bg-secondary/30 rounded-xl p-1 border border-border/20">
            <TabsTrigger value="info" className="rounded-lg px-6 py-2 text-sm">
              Thông tin Album
            </TabsTrigger>
            <TabsTrigger value="photos" className="rounded-lg px-6 py-2 text-sm">
              Tác Phẩm ({isNew ? newPhotos.length : photos.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="outline-none">
            <AlbumForm
              form={form}
              onChange={handleFieldChange}
              onSave={handleSave}
              onDelete={isNew ? undefined : handleDelete}
              isNew={isNew}
              saving={saving}
            />
          </TabsContent>

          <TabsContent value="photos" className="outline-none">
            <PhotoManager
              photos={isNew ? newPhotos : photos}
              onAddPhoto={handleAddPhoto}
              onDeletePhoto={handleDeletePhoto}
              onMovePhoto={handleMovePhoto}
            />
          </TabsContent>
        </Tabs>
      </ScrollReveal>
    </div>
  );
}
