"use client";

import { useState } from "react";
import { Photo } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, ArrowUp, ArrowDown, Upload, Image as ImageIcon, Loader2, ListPlus } from "lucide-react";
import { toast } from "sonner";

interface PhotoManagerProps {
  photos: Photo[];
  onAddPhoto: (photoData: { image_url: string; title: string; description: string; alt_text: string }) => Promise<void>;
  onDeletePhoto: (photo: Photo) => Promise<void>;
  onMovePhoto: (photo: Photo, direction: "up" | "down") => Promise<void>;
}

export function PhotoManager({
  photos,
  onAddPhoto,
  onDeletePhoto,
  onMovePhoto,
}: PhotoManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [photoForm, setPhotoForm] = useState({
    image_url: "",
    title: "",
    description: "",
    alt_text: "",
  });
  const [bulkUrls, setBulkUrls] = useState("");

  const handleR2Upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const tid = toast.loading("Đang tải ảnh lên Cloud R2...");
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      });
      if (!res.ok) throw new Error("Không lấy được URL upload");
      const { uploadUrl, publicUrl } = await res.json();
      const up = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!up.ok) throw new Error("Upload thất bại");
      setPhotoForm((prev) => ({ ...prev, image_url: publicUrl }));
      toast.success("Tải lên thành công!", { id: tid });
    } catch (err: any) {
      toast.error(err.message, { id: tid });
    } finally {
      setUploading(false);
    }
  };

  const handleSingleSubmit = async () => {
    if (!photoForm.image_url) {
      toast.error("Vui lòng nhập hoặc upload ảnh trước");
      return;
    }
    try {
      await onAddPhoto(photoForm);
      setPhotoForm({ image_url: "", title: "", description: "", alt_text: "" });
    } catch (err: any) {
      toast.error("Lỗi thêm ảnh: " + err.message);
    }
  };

  const handleBulkSubmit = async () => {
    if (!bulkUrls.trim()) {
      toast.error("Vui lòng nhập danh sách link ảnh");
      return;
    }
    const urlRegex = /(https?:\/\/[^\s,"'()<>]+|\/[^\s,"'()<>]+)/g;
    const urls: string[] = [];
    let match;
    while ((match = urlRegex.exec(bulkUrls)) !== null) {
      let cleanUrl = match[0];
      // Strip trailing punctuation commonly copied by mistake (e.g. at the end of sentences)
      while (cleanUrl && /[.,;!?]$/.test(cleanUrl)) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      if (cleanUrl) {
        urls.push(cleanUrl);
      }
    }

    if (urls.length === 0) {
      toast.error("Không tìm thấy link ảnh hợp lệ (bắt đầu bằng http:// hoặc https://)");
      return;
    }

    const tid = toast.loading(`Đang xử lý ${urls.length} link ảnh...`);
    try {
      for (let i = 0; i < urls.length; i++) {
        await onAddPhoto({
          image_url: urls[i],
          title: `Tác phẩm ${photos.length + i + 1}`,
          description: "",
          alt_text: "",
        });
      }
      toast.success(`Đã thêm thành công ${urls.length} ảnh!`, { id: tid });
      setBulkUrls("");
    } catch (err: any) {
      toast.error("Lỗi khi thêm loạt ảnh: " + err.message, { id: tid });
    }
  };

  return (
    <div className="space-y-8">
      {/* Menu lua chon cach nhap */}
      <Card className="border border-border/40 rounded-3xl overflow-hidden shadow-sm bg-card">
        <CardContent className="p-6 md:p-8">
          <Tabs defaultValue="single" className="w-full">
            <div className="flex items-center justify-between border-b border-border/40 pb-4 mb-6">
              <h3 className="text-lg font-semibold tracking-tight">Thêm Tác Phẩm</h3>
              <TabsList className="bg-secondary/30 rounded-xl p-1 border border-border/20">
                <TabsTrigger value="single" className="rounded-lg px-4 py-1.5 text-xs">Thêm từng ảnh</TabsTrigger>
                <TabsTrigger value="bulk" className="rounded-lg px-4 py-1.5 text-xs">Nhập hàng loạt URL</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="single" className="space-y-6 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tải ảnh lên R2</Label>
                  <div className="relative border border-dashed border-border/60 hover:border-foreground/30 transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-secondary/10">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleR2Upload}
                      disabled={uploading}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    {uploading ? (
                      <>
                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                        <span className="text-xs text-muted-foreground">Đang tải lên...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground text-center">Click hoặc kéo thả ảnh vào đây</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="image_url" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Hoặc dùng URL ảnh</Label>
                    <Input
                      id="image_url"
                      value={photoForm.image_url}
                      onChange={(e) => setPhotoForm({ ...photoForm, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
                    />
                  </div>

                  {photoForm.image_url && (
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-secondary relative border border-border/40">
                      <img src={photoForm.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photo_title" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tiêu đề ảnh</Label>
                  <Input
                    id="photo_title"
                    value={photoForm.title}
                    onChange={(e) => setPhotoForm({ ...photoForm, title: e.target.value })}
                    placeholder="Tiêu đề tác phẩm..."
                    className="rounded-xl border-border/40"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alt_text" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Alt text (Mô tả phụ cho SEO)</Label>
                  <Input
                    id="alt_text"
                    value={photoForm.alt_text}
                    onChange={(e) => setPhotoForm({ ...photoForm, alt_text: e.target.value })}
                    placeholder="VD: Cậu bé đá bóng trên đường phố"
                    className="rounded-xl border-border/40"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo_desc" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Mô tả tác phẩm</Label>
                <Textarea
                  id="photo_desc"
                  value={photoForm.description}
                  onChange={(e) => setPhotoForm({ ...photoForm, description: e.target.value })}
                  placeholder="Thông số máy ảnh, thời khắc chụp hoặc ý nghĩa..."
                  rows={2}
                  className="rounded-xl border-border/40 resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSingleSubmit}
                  disabled={!photoForm.image_url}
                  className="rounded-full px-6 gap-2 bg-foreground text-background hover:bg-foreground/90"
                >
                  <Plus className="w-4 h-4" /> Thêm vào Album
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="bulk" className="space-y-4 outline-none">
              <div className="space-y-2">
                <Label htmlFor="bulk_urls" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
                  Danh sách liên kết ảnh (Mỗi dòng một link)
                </Label>
                <Textarea
                  id="bulk_urls"
                  value={bulkUrls}
                  onChange={(e) => setBulkUrls(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-1542038784456-1ea8e935640e&#10;https://images.unsplash.com/photo-1493863641943-9b68992a8d07"
                  rows={6}
                  className="rounded-xl border-border/40 font-mono text-sm leading-relaxed"
                />
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                Hệ thống sẽ quét từng dòng và thêm nhanh các ảnh hợp lệ vào album hiện tại với tiêu đề mẫu tăng dần.
              </p>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleBulkSubmit}
                  disabled={!bulkUrls.trim()}
                  className="rounded-full px-6 gap-2 bg-foreground text-background hover:bg-foreground/90"
                >
                  <ListPlus className="w-4 h-4" /> Thêm nhanh hàng loạt
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Danh sach anh */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-2">
          <h3 className="font-semibold tracking-tight text-lg">Danh sách tác phẩm ({photos.length})</h3>
          <span className="text-xs text-muted-foreground">Ấn mũi tên để sắp xếp thứ tự hiển thị</span>
        </div>

        {photos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-border/40 rounded-3xl bg-card">
            <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
            <p className="font-medium text-muted-foreground">Chưa có tác phẩm nào trong album này</p>
            <p className="text-xs text-muted-foreground/80 mt-1">Hãy tải ảnh lên ở khung phía trên.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {photos.map((p, idx) => (
              <Card key={p.id || idx} className="border border-border/40 hover:border-foreground/20 transition-all rounded-2xl overflow-hidden shadow-sm bg-card/60 backdrop-blur-sm">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-secondary overflow-hidden flex-shrink-0 border border-border/20">
                    <img src={p.image_url} alt={p.alt_text || p.title} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-foreground">{p.title || "Không có tiêu đề"}</p>
                    {p.description && <p className="text-xs text-muted-foreground truncate mt-0.5">{p.description}</p>}
                    <p className="text-[10px] font-mono text-muted-foreground/80 truncate mt-1 bg-secondary/30 px-2 py-0.5 rounded w-max">{p.image_url}</p>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl border-border/40"
                      onClick={() => onMovePhoto(p, "up")}
                      disabled={idx === 0}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl border-border/40"
                      onClick={() => onMovePhoto(p, "down")}
                      disabled={idx === photos.length - 1}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-xl border-border/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => onDeletePhoto(p)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
