"use client";

import Link from "next/link"; import { Camera, Heart, ArrowUp } from "lucide-react"; import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-border/50 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Camera className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold tracking-tight">Nhiếp Ảnh Số</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm mb-4">Bộ sưu tập ảnh nghệ thuật - nơi lưu giữ những khoảnh khắc đẹp qua ống kính.</p>
            <div className="flex items-center gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Instagram"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg></a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Facebook"><svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></a>
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Điều Hướng</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/albums" className="hover:text-foreground transition-colors">Albums</Link></li>
              <li><Link href="/about" className="hover:text-foreground transition-colors">Giới Thiệu</Link></li>
              <li><Link href="/copyright" className="hover:text-foreground transition-colors">Bản Quyền</Link></li>
              <li><Link href="/admin" className="hover:text-foreground transition-colors">Quản Trị</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-3">Danh Mục</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/categories/street" className="hover:text-foreground transition-colors">Đường Phố</Link></li>
              <li><Link href="/categories/landscape" className="hover:text-foreground transition-colors">Phong Cảnh</Link></li>
              <li><Link href="/categories/portrait" className="hover:text-foreground transition-colors">Chân Dung</Link></li>
              <li><Link href="/categories/architecture" className="hover:text-foreground transition-colors">Kiến Trúc</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} Nhiếp Ảnh Số. Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
          <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Trí Phan — Nhiếp ảnh gia
          </Link>
        </div>
      </div>
    </footer>
  );
}
