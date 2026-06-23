"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { ADMIN_EMAIL, SiteSettings } from "@/types";
import { getSettings, saveSettings } from "@/lib/firestore";
import { MOCK_SETTINGS } from "@/lib/mock-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(MOCK_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await getSettings();
        setForm(s);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      load();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (authLoading || (user && loading)) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-6">
        <Skeleton className="h-10 w-1/4 rounded-full" />
        <Skeleton className="h-96 rounded-3xl" />
      </div>
    );
  }

  if (!user || user.email !== ADMIN_EMAIL) {
    return null;
  }

  const handleSave = async () => {
    setSaving(true);
    const tid = toast.loading("Đang lưu cấu hình...");
    try {
      await saveSettings({
        ...form,
        updated_at: new Date().toISOString(),
      });
      toast.success("Đã lưu cài đặt website thành công!", { id: tid });
    } catch (e: any) {
      toast.error(`Lỗi: ${e.message}`, { id: tid });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push("/admin")}
        className="flex items-center gap-1.5 text-xs uppercase tracking-wider font-semibold text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Quay lại Dashboard
      </button>

      <ScrollReveal>
        <div className="border-b border-border/40 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight">Cài Đặt Website</h1>
          <p className="text-sm text-muted-foreground mt-1">Cấu hình các thông tin chung, thương hiệu và thông tin liên hệ của nhiếp ảnh gia</p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <Card className="border border-border/40 rounded-3xl overflow-hidden shadow-sm bg-card/60 backdrop-blur-sm">
          <CardContent className="p-6 md:p-8 space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pb-3">
              <Sparkles className="w-4 h-4 text-muted-foreground" /> Thông tin chung
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tên website</Label>
                <Input
                  id="site_name"
                  value={form.site_name}
                  onChange={(e) => setForm({ ...form, site_name: e.target.value })}
                  className="rounded-xl border-border/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site_description" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Mô tả website</Label>
                <Textarea
                  id="site_description"
                  value={form.site_description}
                  onChange={(e) => setForm({ ...form, site_description: e.target.value })}
                  rows={2}
                  className="rounded-xl border-border/40 resize-none"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pt-4 pb-3">
              Nghệ Sĩ / Tác Giả
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="author_name" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Tên nghệ sĩ</Label>
                <Input
                  id="author_name"
                  value={form.author_name}
                  onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                  className="rounded-xl border-border/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_bio" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Giới thiệu bản thân</Label>
                <Textarea
                  id="author_bio"
                  value={form.author_bio}
                  onChange={(e) => setForm({ ...form, author_bio: e.target.value })}
                  rows={4}
                  className="rounded-xl border-border/40"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="author_avatar" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">URL Ảnh đại diện</Label>
                <Input
                  id="author_avatar"
                  value={form.author_avatar}
                  onChange={(e) => setForm({ ...form, author_avatar: e.target.value })}
                  className="rounded-xl border-border/40"
                />
              </div>

              {form.author_avatar && (
                <div className="w-20 h-20 rounded-full overflow-hidden border border-border/40 bg-secondary">
                  <img src={form.author_avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pt-4 pb-3">
              Mạng Xã Hội
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fb" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Facebook URL</Label>
                <Input
                  id="fb"
                  value={form.author_social.facebook || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      author_social: { ...form.author_social, facebook: e.target.value },
                    })
                  }
                  placeholder="https://facebook.com/..."
                  className="rounded-xl border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ins" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Instagram URL</Label>
                <Input
                  id="ins"
                  value={form.author_social.instagram || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      author_social: { ...form.author_social, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="rounded-xl border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tw" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Twitter / X URL</Label>
                <Input
                  id="tw"
                  value={form.author_social.twitter || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      author_social: { ...form.author_social, twitter: e.target.value },
                    })
                  }
                  placeholder="https://x.com/..."
                  className="rounded-xl border-border/40"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="web" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Website cá nhân khác</Label>
                <Input
                  id="web"
                  value={form.author_social.website || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      author_social: { ...form.author_social, website: e.target.value },
                    })
                  }
                  placeholder="https://myportfolio.com"
                  className="rounded-xl border-border/40"
                />
              </div>
            </div>

            <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border/40 pt-4 pb-3">
              Thông Tin Bản Quyền & Pháp Lý
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="copyright" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Thông báo bản quyền (Footer)</Label>
                <Textarea
                  id="copyright"
                  value={form.copyright_text}
                  onChange={(e) => setForm({ ...form, copyright_text: e.target.value })}
                  rows={2}
                  className="rounded-xl border-border/40 resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dmca" className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Thông báo DMCA / Tác quyền</Label>
                <Textarea
                  id="dmca"
                  value={form.dmca_text}
                  onChange={(e) => setForm({ ...form, dmca_text: e.target.value })}
                  rows={2}
                  className="rounded-xl border-border/40 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border/40">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full px-8 py-5 gap-2 bg-foreground text-background hover:bg-foreground/90 transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Lưu cấu hình website
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </ScrollReveal>
    </div>
  );
}
