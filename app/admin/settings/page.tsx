"use client";

import { useEffect, useState } from "react"; import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext"; import { ADMIN_EMAIL, SiteSettings } from "@/types";
import { getSettings, saveSettings } from "@/lib/firestore"; import { MOCK_SETTINGS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card"; import { Button } from "@/components/ui/button"; import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"; import { Textarea } from "@/components/ui/textarea"; import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react"; import { toast } from "sonner";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth(); const router = useRouter();
  const [form, setForm] = useState<SiteSettings>(MOCK_SETTINGS);

  useEffect(() => { const load = async () => { const s = await getSettings(); setForm(s); }; if (user) load(); }, [user]);

  if (authLoading) return <Skeleton className="max-w-2xl mx-auto h-96 mt-12 rounded-3xl" />;
  if (!user || user.email !== ADMIN_EMAIL) return null;

  const handleSave = async () => {
    try { await saveSettings({ ...form, updated_at: new Date().toISOString() }); toast.success("Đã lưu cài đặt"); }
    catch (e: any) { toast.error(e.message); }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
      <button onClick={() => router.push("/admin")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"><ArrowLeft className="w-4 h-4" />Dashboard</button>
      <h1 className="text-3xl font-bold tracking-tight mb-8">Cài Đặt Trang</h1>
      <Card className="p-6 rounded-3xl space-y-4">
        <div className="space-y-2"><Label>Tên trang</Label><Input value={form.site_name} onChange={e => setForm({...form, site_name: e.target.value})} /></div>
        <div className="space-y-2"><Label>Mô tả trang</Label><Textarea value={form.site_description} onChange={e => setForm({...form, site_description: e.target.value})} rows={2} /></div>
        <hr className="border-border/50" />
        <h3 className="font-semibold">Thông Tin Tác Giả</h3>
        <div className="space-y-2"><Label>Tên tác giả</Label><Input value={form.author_name} onChange={e => setForm({...form, author_name: e.target.value})} /></div>
        <div className="space-y-2"><Label>Giới thiệu</Label><Textarea value={form.author_bio} onChange={e => setForm({...form, author_bio: e.target.value})} rows={3} /></div>
        <div className="space-y-2"><Label>Avatar URL</Label><Input value={form.author_avatar} onChange={e => setForm({...form, author_avatar: e.target.value})} /></div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2"><Label>Facebook</Label><Input value={form.author_social.facebook || ""} onChange={e => setForm({...form, author_social: {...form.author_social, facebook: e.target.value}})} /></div>
          <div className="space-y-2"><Label>Instagram</Label><Input value={form.author_social.instagram || ""} onChange={e => setForm({...form, author_social: {...form.author_social, instagram: e.target.value}})} /></div>
          <div className="space-y-2"><Label>Twitter</Label><Input value={form.author_social.twitter || ""} onChange={e => setForm({...form, author_social: {...form.author_social, twitter: e.target.value}})} /></div>
          <div className="space-y-2"><Label>Website</Label><Input value={form.author_social.website || ""} onChange={e => setForm({...form, author_social: {...form.author_social, website: e.target.value}})} /></div>
        </div>
        <hr className="border-border/50" />
        <h3 className="font-semibold">Bản Quyền</h3>
        <div className="space-y-2"><Label>Thông báo bản quyền</Label><Textarea value={form.copyright_text} onChange={e => setForm({...form, copyright_text: e.target.value})} /></div>
        <div className="space-y-2"><Label>DMCA</Label><Textarea value={form.dmca_text} onChange={e => setForm({...form, dmca_text: e.target.value})} /></div>
        <Button onClick={handleSave} className="rounded-full gap-2"><Save className="w-4 h-4" />Lưu Cài Đặt</Button>
      </Card>
    </div>
  );
}
