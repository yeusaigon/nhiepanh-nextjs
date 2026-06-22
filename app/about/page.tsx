"use client";

import { useEffect, useState } from "react"; import { SiteSettings } from "@/types"; import { getSettings } from "@/lib/firestore"; import { MOCK_SETTINGS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card"; import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Globe, Instagram, Facebook, Twitter, Mail, MapPin } from "lucide-react";

export default function AboutPage() {
  const [settings, setSettings] = useState<SiteSettings>(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const load = async () => { const s = await getSettings(); setSettings(s); setLoading(false); }; load(); }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-12"><Skeleton className="h-64 w-64 rounded-full mx-auto mb-8" /><Skeleton className="h-8 w-48 mx-auto mb-4" /><Skeleton className="h-4 w-96 mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 text-center">
      <div className="w-32 h-32 rounded-full bg-secondary mx-auto mb-6 flex items-center justify-center">
        {settings.author_avatar ? <img src={settings.author_avatar} alt={settings.author_name} className="w-full h-full rounded-full object-cover" /> : <Camera className="w-12 h-12 text-muted-foreground" />}
      </div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">{settings.author_name}</h1>
      <p className="text-muted-foreground max-w-lg mx-auto mb-8 leading-relaxed">{settings.author_bio}</p>

      <div className="flex items-center justify-center gap-4 mb-12">
        {settings.author_social.instagram && <a href={settings.author_social.instagram} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"><Instagram className="w-5 h-5" /></a>}
        {settings.author_social.facebook && <a href={settings.author_social.facebook} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"><Facebook className="w-5 h-5" /></a>}
        {settings.author_social.twitter && <a href={settings.author_social.twitter} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"><Twitter className="w-5 h-5" /></a>}
        {settings.author_social.website && <a href={settings.author_social.website} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full bg-secondary/50 hover:bg-secondary transition-colors"><Globe className="w-5 h-5" /></a>}
      </div>

      <Card className="p-8 rounded-3xl text-left">
        <h2 className="text-xl font-semibold mb-4 text-center">Về Nhiếp Ảnh Số</h2>
        <p className="text-muted-foreground leading-relaxed">{settings.site_description}</p>
      </Card>
    </div>
  );
}
