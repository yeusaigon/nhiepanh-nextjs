"use client";

import { useEffect, useState } from "react"; import { SiteSettings } from "@/types"; import { getSettings } from "@/lib/firestore"; import { MOCK_SETTINGS } from "@/lib/mock-data";
import { Card } from "@/components/ui/card"; import { Skeleton } from "@/components/ui/skeleton";
import { Shield, AlertTriangle, Mail } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

export default function CopyrightPage() {
  const [settings, setSettings] = useState<SiteSettings>(MOCK_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => { const load = async () => { const s = await getSettings(); setSettings(s); setLoading(false); }; load(); }, []);

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-12"><Skeleton className="h-96 rounded-3xl" /></div>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <ScrollReveal className="text-center mb-12">
        <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-3xl font-bold tracking-tight mb-2">Bản Quyền</h1>
        <p className="text-muted-foreground">Thông tin bản quyền và quyền sở hữu trí tuệ</p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <Card className="p-8 rounded-3xl space-y-6 border border-border/40 shadow-sm bg-card">
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-amber-500" />Bản Quyền Hình Ảnh</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{settings.copyright_text}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3">DMCA / Khiếu Nại</h2>
            <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">{settings.dmca_text}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2"><Mail className="w-5 h-5" />Liên Hệ</h2>
            <p className="text-muted-foreground text-sm sm:text-base">Nếu bạn có bất kỳ câu hỏi nào về bản quyền, vui lòng liên hệ với chúng tôi qua email: <a href="mailto:vietnam.tri@gmail.com" className="text-foreground underline underline-offset-4 hover:opacity-80 transition-opacity">vietnam.tri@gmail.com</a></p>
          </div>
        </Card>
      </ScrollReveal>
    </div>
  );
}
