"use client";

export const runtime = "edge";

import { useEffect, useState } from "react"; import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; import { Album, Photo, CATEGORIES, ADMIN_EMAIL } from "@/types";
import { getAdminAlbums, getPhotos, createAlbum, updateAlbum, deleteAlbum, createPhoto, updatePhoto, deletePhoto } from "@/lib/firestore";
import { Card } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge"; import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Plus, Image as ImageIcon, Trash2, ArrowUp, ArrowDown, Save } from "lucide-react";
import { toast } from "sonner"; import { toSlug } from "@/lib/firebase";

export default function EditAlbumPage() {
  const { id } = useParams<{ id: string }>(); const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const isNew = id === "new";
  const [album, setAlbum] = useState<Album | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", content: "", cover_image_url: "", category: "street", tags: "", location: "", date_taken: "", is_public: true, is_featured: false, pin: "", seo_title: "", seo_description: "" });
  const [photoForm, setPhotoForm] = useState({ image_url: "", title: "", description: "", alt_text: "" });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      if (!isNew) {
        const albums = await getAdminAlbums(user.uid);
        const a = albums.find(x => x.id === id);
        if (a) {
          setAlbum(a); setPhotos(await getPhotos(a.id));
          setForm({ title: a.title, description: a.description, content: a.content, cover_image_url: a.cover_image_url, category: a.category, tags: a.tags.join(", "), location: a.location, date_taken: a.date_taken, is_public: a.is_public, is_featured: a.is_featured, pin: a.pin || "", seo_title: a.seo_title, seo_description: a.seo_description });
        }
      }
    };
    load();
  }, [user, id]);

  if (authLoading) return <Skeleton className="max-w-4xl mx-auto h-96 mt-12 rounded-3xl" />;
  if (!user || user.email !== ADMIN_EMAIL) return null;

  const handleSave = async () => {
    if (!form.title) { toast.error("Tiêu đề không được để trống"); return; }
    const data = { ...form, slug: toSlug(form.title), tags: form.tags.split(",").map(t => t.trim()).filter(Boolean) };
    try {
      if (isNew) { await createAlbum({ ...data, user_id: user.uid, view_count: 0 }); toast.success("Đã tạo album"); }
      else if (album) { await updateAlbum(album.id, { ...data, updated_at: new Date().toISOString() }); toast.success("Đã cập nhật"); }
      router.push("/admin");
    } catch (e: any) { toast.error(e.message); }
  };

  const handleDelete = async () => {
    if (!album || !confirm("Xóa album này và tất cả ảnh?")) return;
    try { await deleteAlbum(album.id); toast.success("Đã xóa"); router.push("/admin"); } catch (e: any) { toast.error(e.message); }
  };

  const handleAddPhoto = async () => {
    if (!album || !photoForm.image_url) { toast.error("URL ảnh không được để trống"); return; }
    try { await createPhoto({ album_id: album.id, image_url: photoForm.image_url, thumbnail_url: photoForm.image_url, title: photoForm.title, description: photoForm.description, alt_text: photoForm.alt_text, display_order: photos.length }); setPhotoForm({ image_url: "", title: "", description: "", alt_text: "" }); setPhotos(await getPhotos(album.id)); toast.success("Đã thêm ảnh"); } catch (e: any) { toast.error(e.message); }
  };

  const handleDelPhoto = async (p: Photo) => {
    if (!confirm("Xóa ảnh này?")) return;
    try { await deletePhoto(p.id); setPhotos(await getPhotos(album!.id)); toast.success("Đã xóa"); } catch (e: any) { toast.error(e.message); }
  };

  const movePhoto = async (p: Photo, dir: "up" | "down") => {
    const idx = photos.findIndex(x => x.id === p.id);
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === photos.length - 1)) return;
    const nIdx = dir === "up" ? idx - 1 : idx + 1;
    try { await updatePhoto(p.id, { display_order: nIdx }); await updatePhoto(photos[nIdx].id, { display_order: idx }); setPhotos(await getPhotos(album!.id)); } catch {}
  };

  const handleR2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, contentType: file.type }) });
      if (!res.ok) throw new Error("Không lấy được URL upload");
      const { uploadUrl, publicUrl } = await res.json();
      const up = await fetch(uploadUrl, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!up.ok) throw new Error("Upload thất bại");
      setPhotoForm(prev => ({ ...prev, image_url: publicUrl }));
      toast.success("Upload thành công!");
    } catch (err: any) { toast.error(err.message); }
    finally { setUploading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-fade-in">
      <button onClick={() => router.push("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Dashboard</button>
      <h1 className="text-3xl font-bold tracking-tight mb-8">{isNew ? "Tạo Album Mới" : "Chỉnh Sửa Album"}</h1>

      {!isNew && (
        <Tabs defaultValue="info" className="w-full mb-12">
          <TabsList className="mb-6"><TabsTrigger value="info">Thông Tin</TabsTrigger><TabsTrigger value="photos">Ảnh ({photos.length})</TabsTrigger></TabsList>
          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Tiêu đề</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
              <div className="space-y-2"><Label>Danh mục</Label><Select value={form.category} onValueChange={v => setForm({...form, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label>Ảnh bìa URL</Label><Input value={form.cover_image_url} onChange={e => setForm({...form, cover_image_url: e.target.value})} placeholder="https://..." /></div>
              <div className="space-y-2"><Label>Địa điểm</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
              <div className="space-y-2"><Label>Ngày chụp</Label><Input type="date" value={form.date_taken} onChange={e => setForm({...form, date_taken: e.target.value})} /></div>
              <div className="space-y-2"><Label>Tags (phân cách bằng dấu phẩy)</Label><Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="saigon, night, street" /></div>
              <div className="space-y-2"><Label>Mã PIN (để trống nếu không khóa)</Label><Input value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} maxLength={6} /></div>
            </div>
            <div className="space-y-2"><Label>Mô tả</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
            <div className="space-y-2"><Label>Nội dung</Label><Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} /></div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2"><Switch id="pub" checked={form.is_public} onCheckedChange={v => setForm({...form, is_public: v})} /><Label htmlFor="pub">Công khai</Label></div>
              <div className="flex items-center gap-2"><Switch id="feat" checked={form.is_featured} onCheckedChange={v => setForm({...form, is_featured: v})} /><Label htmlFor="feat">Nổi bật</Label></div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="rounded-full gap-2"><Save className="w-4 h-4" />Lưu</Button>
              {!isNew && <Button variant="destructive" onClick={handleDelete} className="rounded-full gap-2"><Trash2 className="w-4 h-4" />Xóa Album</Button>}
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-4">
            <Card className="p-4 rounded-2xl space-y-3">
              <h3 className="font-semibold">Thêm Ảnh Mới</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1"><Label>Upload lên R2</Label><Input type="file" accept="image/*" onChange={handleR2Upload} disabled={uploading} /></div>
                <div className="space-y-1"><Label>Hoặc URL ảnh</Label><Input value={photoForm.image_url} onChange={e => setPhotoForm({...photoForm, image_url: e.target.value})} placeholder="https://..." /></div>
                <div className="space-y-1"><Label>Tiêu đề</Label><Input value={photoForm.title} onChange={e => setPhotoForm({...photoForm, title: e.target.value})} /></div>
                <div className="space-y-1"><Label>Alt text</Label><Input value={photoForm.alt_text} onChange={e => setPhotoForm({...photoForm, alt_text: e.target.value})} /></div>
              </div>
              <div className="space-y-1"><Label>Mô tả</Label><Textarea value={photoForm.description} onChange={e => setPhotoForm({...photoForm, description: e.target.value})} rows={1} /></div>
              <Button onClick={handleAddPhoto} disabled={!photoForm.image_url} className="rounded-full gap-2"><Plus className="w-4 h-4" />Thêm</Button>
            </Card>
            <div className="space-y-2">
              {photos.map((p, i) => (
                <Card key={p.id} className="flex items-center gap-3 p-3 rounded-2xl">
                  <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden flex-shrink-0"><img src={p.image_url} alt={p.alt_text} className="w-full h-full object-cover" /></div>
                  <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{p.title || "Untitled"}</p><p className="text-xs text-muted-foreground truncate">{p.image_url}</p></div>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={() => movePhoto(p, "up")} disabled={i === 0}><ArrowUp className="w-3 h-3" /></Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg" onClick={() => movePhoto(p, "down")} disabled={i === photos.length - 1}><ArrowDown className="w-3 h-3" /></Button>
                    <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg text-destructive" onClick={() => handleDelPhoto(p)}><Trash2 className="w-3 h-3" /></Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {isNew && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Tiêu đề</Label><Input value={form.title} onChange={e => setForm({...form, title: e.target.value})} /></div>
            <div className="space-y-2"><Label>Danh mục</Label><Select value={form.category} onValueChange={v => setForm({...form, category: v})}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{CATEGORIES.map(c => <SelectItem key={c.slug} value={c.slug}>{c.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Ảnh bìa URL</Label><Input value={form.cover_image_url} onChange={e => setForm({...form, cover_image_url: e.target.value})} placeholder="https://..." /></div>
            <div className="space-y-2"><Label>Địa điểm</Label><Input value={form.location} onChange={e => setForm({...form, location: e.target.value})} /></div>
            <div className="space-y-2"><Label>Ngày chụp</Label><Input type="date" value={form.date_taken} onChange={e => setForm({...form, date_taken: e.target.value})} /></div>
            <div className="space-y-2"><Label>Tags</Label><Input value={form.tags} onChange={e => setForm({...form, tags: e.target.value})} placeholder="saigon, night, street" /></div>
            <div className="space-y-2"><Label>Mã PIN</Label><Input value={form.pin} onChange={e => setForm({...form, pin: e.target.value})} maxLength={6} /></div>
          </div>
          <div className="space-y-2"><Label>Mô tả</Label><Textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={2} /></div>
          <div className="space-y-2"><Label>Nội dung</Label><Textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={4} /></div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2"><Switch id="pub2" checked={form.is_public} onCheckedChange={v => setForm({...form, is_public: v})} /><Label htmlFor="pub2">Công khai</Label></div>
            <div className="flex items-center gap-2"><Switch id="feat2" checked={form.is_featured} onCheckedChange={v => setForm({...form, is_featured: v})} /><Label htmlFor="feat2">Nổi bật</Label></div>
          </div>
          <Button onClick={handleSave} className="rounded-full gap-2"><Save className="w-4 h-4" />Tạo Album</Button>
        </div>
      )}
    </div>
  );
}
