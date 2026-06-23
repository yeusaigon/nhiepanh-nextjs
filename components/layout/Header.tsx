"use client";

import Link from "next/link"; import { useState, useEffect } from "react"; import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button"; import { Camera, Menu, X, Sun, Moon } from "lucide-react";
import { ADMIN_EMAIL } from "@/types";

const NAV = [
  { href: "/albums", label: "Tác phẩm" },
  { href: "/services", label: "Dịch vụ" },
  { href: "/about", label: "Giới thiệu" },
  { href: "/copyright", label: "Bản quyền" },
];

export default function Header() {
  const { user, loading, signInWithGoogle, signOut } = useAuth();
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/15 transition-colors">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Nhiếp Ảnh Số</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map(n => (
            <Link key={n.href} href={n.href} className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-secondary/50">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl" onClick={toggle} aria-label="Toggle theme">
            {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          {!loading && (user ? (
            <div className="hidden md:flex items-center gap-3">
              {user.email === ADMIN_EMAIL && <Link href="/admin"><Button variant="outline" size="sm">Quản trị</Button></Link>}
              <Button variant="ghost" size="sm" onClick={signOut}>Đăng xuất</Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={signInWithGoogle} className="hidden md:inline-flex">Đăng nhập</Button>
          ))}

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/50 bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col p-4 gap-1">
            {NAV.map(n => <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="px-4 py-2.5 text-sm rounded-xl hover:bg-secondary/50 transition-colors">{n.label}</Link>)}
            <div className="mt-2 pt-2 border-t border-border/50">
              {!loading && (user ? <>
                {user.email === ADMIN_EMAIL && <Link href="/admin" onClick={() => setOpen(false)} className="block px-4 py-2.5 text-sm rounded-xl hover:bg-secondary/50">Quản trị</Link>}
                <button onClick={() => { signOut(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm rounded-xl hover:bg-secondary/50 text-destructive">Đăng xuất</button>
              </> : <button onClick={() => { signInWithGoogle(); setOpen(false); }} className="w-full text-left px-4 py-2.5 text-sm rounded-xl hover:bg-secondary/50">Đăng nhập bằng Google</button>)}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
