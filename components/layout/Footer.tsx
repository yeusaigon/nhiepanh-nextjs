"use client";

import Link from "next/link"; import { Camera, Heart } from "lucide-react"; import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Camera className="w-5 h-5 text-muted-foreground" />
              <span className="font-semibold tracking-tight">Nhiếp Ảnh Số</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">Bộ sưu tập ảnh nghệ thuật - nơi lưu giữ những khoảnh khắc đẹp qua ống kính.</p>
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
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            © {new Date().getFullYear()} Nhiếp Ảnh Số. Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
          <Button variant="ghost" size="sm" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Lên đầu trang ↑
          </Button>
        </div>
      </div>
    </footer>
  );
}
