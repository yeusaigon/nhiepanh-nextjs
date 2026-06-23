"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Camera, Menu, X, Sun, Moon, User, LogIn, LogOut, ShieldCheck, ChevronDown } from "lucide-react";
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
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Đóng dropdown khi đổi trang
  useEffect(() => { setDropdownOpen(false); setMobileOpen(false); }, [pathname]);

  const isAdmin = user?.email === ADMIN_EMAIL;
  const isLoggedIn = mounted && !!user;

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/50">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">

        {/* Logo — bên trái */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-foreground/10 flex items-center justify-center group-hover:bg-foreground/15 transition-colors">
            <Camera className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold tracking-tight">Nhiếp Ảnh Số</span>
        </Link>

        {/* Nav + User icon — bên phải */}
        <div className="flex items-center gap-1">

          {/* Nav links — desktop */}
          <nav className="hidden md:flex items-center gap-0.5 mr-2">
            {NAV.map(n => {
              const isActive = pathname === n.href || pathname?.startsWith(n.href + "/");
              return (
                <Link key={n.href} href={n.href}
                  className={`relative px-4 py-2 text-sm transition-colors rounded-full
                    ${isActive
                      ? "text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    }`}>
                  {n.label}
                  {/* Active underline */}
                  {isActive && (
                    <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full bg-foreground/70" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User dropdown — chỉ hiện trên desktop */}
          <div className="hidden md:block relative" ref={dropdownRef}>
            <button
              id="user-menu-btn"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`relative flex items-center gap-1.5 h-9 px-3 rounded-xl transition-all duration-200
                ${dropdownOpen ? "bg-secondary/80 text-foreground" : "hover:bg-secondary/70 text-muted-foreground hover:text-foreground"}`}
              aria-label="Menu người dùng"
              aria-expanded={dropdownOpen}
            >
              <User className="w-4 h-4" />
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />

              {/* Chấm xanh — đã đăng nhập */}
              {isLoggedIn && (
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-background" />
              )}
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border/40 bg-background shadow-xl shadow-black/10 overflow-hidden z-50"
                style={{ animation: "fadeSlideDown 0.15s ease-out" }}>

                {/* Section: Giao diện */}
                <div className="px-3 pt-2.5 pb-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold px-1">Giao diện</p>
                </div>
                <button
                  onClick={toggle}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors text-left group"
                >
                  {mounted && theme === "dark"
                    ? <><Sun className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" /><span>Chuyển sang Sáng</span></>
                    : <><Moon className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" /><span>Chuyển sang Tối</span></>
                  }
                </button>

                <div className="h-px bg-border/40 mx-3 my-1" />

                {/* Section: Tài khoản */}
                <div className="px-3 pt-1.5 pb-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-semibold px-1">Tài khoản</p>
                </div>

                {!loading && (
                  user ? (
                    <>
                      {/* Email info */}
                      <div className="flex items-center gap-2.5 px-4 py-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>

                      {isAdmin && (
                        <Link href="/admin" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary/60 transition-colors group">
                          <ShieldCheck className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                          <span>Trang quản trị</span>
                        </Link>
                      )}

                      <div className="h-px bg-border/40 mx-3 my-1" />
                      <button
                        onClick={() => { signOut(); setDropdownOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 mb-1 text-sm hover:bg-red-500/8 text-muted-foreground hover:text-red-500 transition-colors text-left group rounded-b-2xl"
                      >
                        <LogOut className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        <span>Đăng xuất</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => { signInWithGoogle(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 mb-1 text-sm hover:bg-secondary/60 transition-colors text-left group"
                    >
                      <LogIn className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
                      <span>Đăng nhập Google</span>
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <Button variant="ghost" size="icon" className="md:hidden rounded-full ml-1"
            onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu — smooth slide animation */}
      <div
        className="md:hidden overflow-hidden border-t border-border/50 bg-background shadow-lg"
        style={{
          maxHeight: mobileOpen ? "400px" : "0px",
          borderTopWidth: mobileOpen ? "1px" : "0px",
          transition: "max-height 0.3s cubic-bezier(0.4,0,0.2,1), border-top-width 0.3s ease, opacity 0.25s ease",
          opacity: mobileOpen ? 1 : 0,
        }}
      >
        <nav className="flex flex-col p-3 gap-0.5">
          {NAV.map(n => {
            const isActive = pathname === n.href;
            return (
              <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm rounded-xl transition-colors
                  ${isActive ? "bg-secondary/80 text-foreground font-medium" : "hover:bg-secondary/50 text-muted-foreground"}`}>
                {n.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-foreground/60" />}
              </Link>
            );
          })}

          <div className="h-px bg-border/40 mx-1 my-2" />

          <button onClick={toggle}
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-secondary/50 transition-colors text-left text-muted-foreground">
            {mounted && theme === "dark"
              ? <><Sun className="w-4 h-4 text-amber-400" /><span>Chuyển sang Sáng</span></>
              : <><Moon className="w-4 h-4 text-indigo-400" /><span>Chuyển sang Tối</span></>
            }
          </button>

          {!loading && (user ? (
            <>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-secondary/50 text-muted-foreground">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /><span>Trang quản trị</span>
                </Link>
              )}
              <div className="px-4 py-2">
                <p className="text-xs text-muted-foreground/60 truncate">{user.email}</p>
              </div>
              <button onClick={() => { signOut(); setMobileOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-red-500/8 text-muted-foreground hover:text-red-500 transition-colors text-left">
                <LogOut className="w-4 h-4" /><span>Đăng xuất</span>
              </button>
            </>
          ) : (
            <button onClick={() => { signInWithGoogle(); setMobileOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-xl hover:bg-secondary/50 text-muted-foreground text-left">
              <LogIn className="w-4 h-4 text-blue-400" /><span>Đăng nhập Google</span>
            </button>
          ))}
        </nav>
      </div>

      <style>{`
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </header>
  );
}
