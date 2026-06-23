"use client";

import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Camera, GraduationCap, Heart, Image as ImageIcon, MapPin, MessageSquare, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";

const PRINTS = [
  { size: "30 x 45 cm", paper: "Fine Art Hahnemühle", frame: "Gỗ tự nhiên tiêu chuẩn", price: "450.000đ" },
  { size: "40 x 60 cm", paper: "Fine Art Hahnemühle", frame: "Gỗ tự nhiên tiêu chuẩn", price: "750.000đ" },
  { size: "60 x 90 cm", paper: "Fine Art Hahnemühle", frame: "Gỗ tự nhiên cao cấp", price: "1.450.000đ" },
];

const SERVICES = [
  {
    title: "Chụp ảnh chân dung & nghệ thuật",
    description: "Bộ ảnh cá nhân thực hiện tại studio hoặc ngoại cảnh. Tập trung vào biểu cảm tự nhiên và ánh sáng nghệ thuật.",
    price: "Từ 1.500.000đ",
    deliverables: "20 ảnh chỉnh sửa hoàn thiện, toàn bộ ảnh gốc.",
  },
  {
    title: "Chụp ảnh kiến trúc & nội thất",
    description: "Dành cho homestay, khách sạn, quán cà phê hoặc công trình thiết kế. Tôn vinh không gian và hình khối kiến trúc.",
    price: "Từ 3.000.000đ",
    deliverables: "Chụp không giới hạn, chỉnh sửa tối ưu góc nhìn.",
  },
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <section className="relative pt-16 pb-12 px-6 text-center max-w-4xl mx-auto">
        <ScrollReveal className="space-y-4">
          <Badge className="bg-primary/10 text-primary border-0 rounded-full hover:bg-primary/10">Dịch Vụ & Tranh In</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
            Lưu Giữ Khoảnh Khắc & Không Gian
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Cung cấp dịch vụ nhiếp ảnh chuyên nghiệp và các tác phẩm tranh in chất lượng cao dành cho không gian sống của bạn.
          </p>
        </ScrollReveal>
      </section>

      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Campaign: Free ID Photo for Students */}
        <ScrollReveal>
          <Card className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 p-6 sm:p-8 md:p-10 shadow-lg">
            <div className="absolute top-4 right-4 text-primary/10">
              <GraduationCap className="w-40 h-40" />
            </div>
            <div className="relative z-10 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Heart className="w-3 h-3 fill-current" /> Dự án cộng đồng phi lợi nhuận
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground flex flex-wrap items-center gap-2">
                  Miễn Phí 100% Chụp Ảnh Thẻ Cho Học Sinh
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  Để đồng hành và chia sẻ cùng thế hệ học sinh trong các kỳ thi và làm hồ sơ nhập học, tôi nhận chụp ảnh thẻ hoàn toàn miễn phí. Chương trình áp dụng trọn đời đối với tất cả học sinh, sinh viên tại khu vực Sài Gòn.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-muted-foreground pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>Không phát sinh bất kỳ chi phí nào</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <span>Nhận file mềm chất lượng cao</span>
                </div>
              </div>
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a href="https://zalo.me/0906232508" target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white border-0 shadow-md">
                    Đặt lịch chụp ngay <MessageSquare className="w-4 h-4" />
                  </Button>
                </a>
                <span className="text-xs text-muted-foreground">
                  * Yêu cầu: Mang theo thẻ học sinh/sinh viên hoặc giấy tờ liên quan khi chụp.
                </span>
              </div>
            </div>
          </Card>
        </ScrollReveal>

        {/* Art Prints */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start border-t border-border/50 pt-16">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-semibold border border-border/40 w-fit">
                <Sparkles className="w-3 h-3 text-amber-500" /> Tranh in nghệ thuật
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Đưa Nghệ Thuật Vào Không Gian Sống
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Tất cả tác phẩm trong bộ sưu tập đều có thể được in ấn với công nghệ Fine Art chất lượng cao, giữ màu sắc bền vững qua thời gian và đóng khung tiêu chuẩn mỹ thuật.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 w-full">
            <ScrollReveal className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm">
              <div className="p-6 border-b border-border/50 bg-secondary/20">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Bảng Giá Tranh In Tham Khảo</h3>
              </div>
              <div className="divide-y divide-border/50">
                {PRINTS.map((print, i) => (
                  <div key={i} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm hover:bg-secondary/10 transition-colors">
                    <div className="space-y-1">
                      <div className="font-semibold text-base text-foreground">{print.size}</div>
                      <div className="text-xs text-muted-foreground">Giấy: {print.paper} // Khung: {print.frame}</div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <span className="font-bold text-foreground text-lg">{print.price}</span>
                      <a href="https://zalo.me/0906232508" target="_blank" rel="noopener noreferrer">
                        <Button size="sm" variant="outline" className="rounded-full">Liên hệ đặt mua</Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Photography Services */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start border-t border-border/50 pt-16">
          <div className="lg:col-span-5 space-y-6">
            <ScrollReveal className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/80 text-muted-foreground text-[10px] uppercase tracking-[0.15em] font-semibold border border-border/40 w-fit">
                <Camera className="w-3 h-3 text-primary" /> Dịch Vụ Nhiếp Ảnh
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Ghi Lại Những Câu Chuyện Bằng Ánh Sáng
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                Thực hiện các bộ ảnh chất lượng cao theo yêu cầu của khách hàng cá nhân và doanh nghiệp, cam kết tính thẩm mỹ và phong cách độc bản.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {SERVICES.map((s, i) => (
              <ScrollReveal key={i} delay={i * 100} className="h-full">
                <Card className="p-6 border border-border/50 bg-card rounded-3xl h-full flex flex-col justify-between hover:border-foreground/10 transition-colors">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg text-foreground tracking-tight">{s.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
                    <div className="text-xs text-muted-foreground border-t border-border/30 pt-3">
                      <span className="block font-semibold text-foreground/80 mb-0.5">Sản phẩm bàn giao:</span>
                      {s.deliverables}
                    </div>
                  </div>
                  <div className="mt-6 pt-3 border-t border-border/30 flex items-center justify-between">
                    <span className="font-bold text-foreground">{s.price}</span>
                    <a href="https://zalo.me/0906232508" target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="rounded-full gap-1 p-0 hover:bg-transparent hover:text-primary">
                        Tư vấn <ArrowRight className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
