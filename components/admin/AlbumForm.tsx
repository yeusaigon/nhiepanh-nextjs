"use client";

import { CATEGORIES } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Save, Trash2, Loader2 } from "lucide-react";
import { toSlug } from "@/lib/firebase";

interface AlbumFormProps {
  form: {
    title: string;
    slug: string;
    description: string;
    content: string;
    cover_image_url: string;
    category: string;
    tags: string;
    location: string;
    date_taken: string;
    is_public: boolean;
    is_featured: boolean;
    pin: string;
    seo_title: string;
    seo_description: string;
  };
  onChange: (field: string, value: any) => void;
  onSave: () => void;
  onDelete?: () => void;
  isNew: boolean;
  saving?: boolean;
}

export function AlbumForm({
  form,
  onChange,
  onSave,
  onDelete,
  isNew,
  saving = false,
}: AlbumFormProps) {
  return (
    <div className="space-y-6">
      <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <h2 className="text-xl font-semibold tracking-tight border-b border-border/40 pb-4">
          {isNew ? "Thống tin Album Mới" : "Thông tin Album"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Tiêu đề <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              value={form.title}
              onChange={(e) => {
                onChange("title", e.target.value);
                if (isNew) {
                  onChange("slug", toSlug(e.target.value));
                }
              }}
              placeholder="VD: Hoàng hôn Sài Gòn"
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Đường dẫn URL (Slug)
            </Label>
            <Input
              id="slug"
              value={form.slug}
              onChange={(e) => onChange("slug", toSlug(e.target.value))}
              placeholder="VD: hoang-hon-sai-gon"
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Danh mục
            </Label>
            <Select value={form.category} onValueChange={(v) => onChange("category", v)}>
              <SelectTrigger id="category" className="rounded-xl border-border/40">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/40">
                {CATEGORIES.map((c) => (
                  <SelectItem key={c.slug} value={c.slug} className="rounded-lg">
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cover_image_url" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              URL Ảnh bìa
            </Label>
            <Input
              id="cover_image_url"
              value={form.cover_image_url}
              onChange={(e) => onChange("cover_image_url", e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Địa điểm chụp
            </Label>
            <Input
              id="location"
              value={form.location}
              onChange={(e) => onChange("location", e.target.value)}
              placeholder="VD: Quận 1, TP. Hồ Chí Minh"
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_taken" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Ngày chụp
            </Label>
            <Input
              id="date_taken"
              type="date"
              value={form.date_taken}
              onChange={(e) => onChange("date_taken", e.target.value)}
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Tags (phân cách bằng dấu phẩy)
            </Label>
            <Input
              id="tags"
              value={form.tags}
              onChange={(e) => onChange("tags", e.target.value)}
              placeholder="VD: saigon, street, sunset"
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pin" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              Mã PIN truy cập (để trống nếu không khóa bảo mật)
            </Label>
            <Input
              id="pin"
              value={form.pin}
              onChange={(e) => onChange("pin", e.target.value)}
              maxLength={6}
              placeholder="VD: 123456"
              className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Mô tả ngắn
          </Label>
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => onChange("description", e.target.value)}
            placeholder="Mô tả tóm tắt về album ảnh..."
            rows={2}
            className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground resize-none"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
            Nội dung chi tiết (Markdown hoặc Văn bản)
          </Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => onChange("content", e.target.value)}
            placeholder="Chia sẻ câu chuyện phía sau những bức ảnh này..."
            rows={5}
            className="rounded-xl border-border/40 focus-visible:ring-1 focus-visible:ring-foreground"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-6 pt-4 border-t border-border/40">
          <div className="flex items-center space-x-3">
            <Switch
              id="is_public"
              checked={form.is_public}
              onCheckedChange={(checked) => onChange("is_public", checked)}
            />
            <Label htmlFor="is_public" className="cursor-pointer font-medium">
              Chế độ công khai
            </Label>
          </div>

          <div className="flex items-center space-x-3">
            <Switch
              id="is_featured"
              checked={form.is_featured}
              onCheckedChange={(checked) => onChange("is_featured", checked)}
            />
            <Label htmlFor="is_featured" className="cursor-pointer font-medium">
              Đánh dấu nổi bật (Featured)
            </Label>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border/40 rounded-3xl p-6 md:p-8 space-y-4 shadow-sm">
        <h3 className="text-lg font-semibold tracking-tight">Cấu hình SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seo_title" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              SEO Title (để trống sẽ dùng tiêu đề)
            </Label>
            <Input
              id="seo_title"
              value={form.seo_title}
              onChange={(e) => onChange("seo_title", e.target.value)}
              placeholder="VD: Album ảnh Đường Phố Sài Gòn Đẹp Nhất"
              className="rounded-xl border-border/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seo_description" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">
              SEO Description
            </Label>
            <Input
              id="seo_description"
              value={form.seo_description}
              onChange={(e) => onChange("seo_description", e.target.value)}
              placeholder="Mô tả hiển thị trên Google..."
              className="rounded-xl border-border/40"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 items-center justify-end">
        {!isNew && onDelete && (
          <Button
            type="button"
            variant="destructive"
            onClick={onDelete}
            className="rounded-full px-6 gap-2 hover:bg-destructive/95"
            disabled={saving}
          >
            <Trash2 className="w-4 h-4" /> Xóa Album
          </Button>
        )}
        <Button
          type="button"
          onClick={onSave}
          className="rounded-full px-8 gap-2 bg-foreground text-background hover:bg-foreground/90"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" /> Lưu thay đổi
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
